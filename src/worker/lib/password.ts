/* ============================================================================
   وحدة تجزئة كلمات المرور — مصدر الحقيقة الوحيد
   ----------------------------------------------------------------------------
   لماذا ملف منفصل؟
     لأن السياسة (عدد التكرارات، الـpepper، صيغة التخزين) يجب أن تكون في مكان واحد
     قابل للاختبار والترقية، لا مبعثرة داخل مسار تسجيل الدخول.

   الصيغة الحالية (v1):
     pbkdf2-sha256$<iterations>$<salt-b64url>$<hash-b64url>

   الصيغة القديمة (legacy — للقراءة فقط، تُرقّى تلقائيًا عند أول دخول ناجح):
     pbkdf2$<iterations>$<salt-b64url>$<hash-b64url>
     كانت تدمج الـpepper بإلحاقه بكلمة المرور؛ الطريقة القديمة أضعف لأنها لا تفصل
     النطاقات، لكنها مقبولة للترحيل فقط.

   الـpepper ليس بديلًا عن قوة الاشتقاق:
     الـpepper سر خارج القاعدة يحمي فقط عند تسرّب القاعدة وحدها (نسخ احتياطي مسروق،
     استعلام مسرَّب). إذا سُرّب الكود + السر معًا فلا قيمة له. لذلك تُقيَّم القوة دائمًا
     بعدد التكرارات القابل للتحقيق على المنصة — انظر reports/kdf-benchmark.md.
   ========================================================================== */
import { b64url, fromB64url, timingSafeEqual } from './crypto';

/** أرضية صارمة: لا يُسمح بسياسة أضعف من ذلك حتى لو أُسيء ضبط المتغيرات. */
export const MIN_ITERATIONS = 20_000;
/** سقف يمنع أي صف تالف/محقون من إجهاد المعالج (DoS) بلا فائدة أمنية. */
export const MAX_ITERATIONS = 2_000_000;
/**
 * ما تسمح به خطة Workers المجانية فعليًا (حد 10ms CPU لكل طلب).
 * قياس workerd: 30,000 ≈ 5ms. المتطلب من OWASP لهذه الخوارزمية 600,000 (20× أعلى).
 * انظر reports/kdf-benchmark.md — هذا حدّ منصة، لا اختيار تصميمي.
 */
export const FREE_TIER_SAFE_ITERATIONS = 30_000;
/** الافتراضي الآمن عند غياب الإعداد: متطلب OWASP. يفشل بصوت عالٍ على الخطة المجانية بدل أن يضعف صامتًا. */
export const OWASP_ITERATIONS_SHA256 = 600_000;

export const FORMAT_V1 = 'pbkdf2-sha256';
export const FORMAT_LEGACY = 'pbkdf2';
/**
 * الصيغة v2 — اشتقاق مُطبَّق على طبقتين (client-side stretching + server-side hash):
 *   kdfv2$<serverIters>$<clientIters>$<salt-b64url>$<hash-b64url>
 *
 * لماذا؟ حد الخطة المجانية 10ms CPU/طلب يسمح بـ≈30,000 تكرار على الخادم فقط (5% من
 * OWASP). المتصفح مجاني تمامًا: يُشتق المفتاح هناك بـ600,000 تكرار (متطلب OWASP)،
 * ثم يطبّق الخادم 30,000 على الناتج عالي العشوائية + pepper. العبء على من يسرق
 * القاعدة = 630,000 تكرار لكل تخمين + pepper غائب عن القاعدة، أي ≥ متطلب OWASP.
 * القيد المعلن: التحقق من سياسة طول كلمة المرور يصبح في العميل، وعميل مخصّص يمكنه
 * اختيار تكرارات أقل لحسابه هو فقط (لا يضر غيره). التفصيل في docs/SECURITY_BLOCKERS.md.
 */
export const FORMAT_V2 = 'kdfv2';
/** تكرارات الاشتقاق في المتصفح — يجب أن تطابق CLIENT_KDF_ITERATIONS في إعداد الإنتاج. */
export const CLIENT_KDF_ITERATIONS = 600_000;
/** أرضية معقولة للعميل: أقل منها يُرفض الحساب (عميل قديم/معطوب). */
export const MIN_CLIENT_KDF_ITERATIONS = 100_000;
/** بادئة النطاق في اشتقاق ملح العميل — تمنع إعادة استخدام الملح في سياق آخر. */
const CLIENT_SALT_PREFIX = 'es-kdfv2:';

export interface PasswordPolicy {
  iterations: number;
  pepper: string;
  /** هل الـpepper مُعرَّف؟ إن لم يكن، السياسة غير صالحة للإنتاج. */
  hasPepper: boolean;
}

export class PasswordPolicyError extends Error {
  constructor(public code: 'PEPPER_MISSING' | 'PEPPER_WEAK' | 'BAD_ITERATIONS', message: string) {
    super(code + ': ' + message);
  }
}

/**
 * يقرأ السياسة من البيئة ويقصّها إلى نطاق آمن.
 * القصّ لأعلى (clamp-up) عند قيمة أقل من الأرضية مقصود: خطأ إعداد يجب ألا يضعف الحماية.
 */
export function resolvePolicy(env: { PBKDF2_ITERATIONS?: string; PASSWORD_PEPPER?: string; ENVIRONMENT?: string }, opts: { requirePepper?: boolean } = {}): PasswordPolicy {
  const raw = Number(env.PBKDF2_ITERATIONS);
  let iterations = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : OWASP_ITERATIONS_SHA256;
  if (iterations < MIN_ITERATIONS) {
    console.warn(JSON.stringify({ level: 'warn', event: 'pbkdf2_iterations_raised', from: iterations, to: MIN_ITERATIONS }));
    iterations = MIN_ITERATIONS;
  }
  if (iterations > MAX_ITERATIONS) iterations = MAX_ITERATIONS;

  const pepper = env.PASSWORD_PEPPER ?? '';
  const requirePepper = opts.requirePepper ?? env.ENVIRONMENT !== 'test';
  if (!pepper) {
    if (requirePepper) {
      throw new PasswordPolicyError('PEPPER_MISSING', 'PASSWORD_PEPPER غير مضبوط. اشتقاق كلمات المرور بلا سر خارجي مرفوض في هذه البيئة.');
    }
    return { iterations, pepper: '', hasPepper: false };
  }
  if (pepper.length < 32 && requirePepper) {
    throw new PasswordPolicyError('PEPPER_WEAK', 'PASSWORD_PEPPER أقصر من 32 حرفًا.');
  }
  return { iterations, pepper, hasPepper: true };
}

/* ---------- الاشتقاق ---------- */

const enc = new TextEncoder();

/**
 * المفتاح الأولي: HMAC-SHA256(key=pepper, message=password).
 * الفصل النطاقي (domain separation) أفضل من إلحاق الـpepper بكلمة المرور، ويجعل
 * استخراج الـpepper من تجزئة مسروقة غير ممكن دون كسر HMAC نفسه.
 */
async function initialKeyMaterial(password: string, pepper: string): Promise<Uint8Array> {
  if (!pepper) return enc.encode(password);
  const key = await crypto.subtle.importKey('raw', enc.encode(pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(password));
  return new Uint8Array(sig);
}

async function derive(kim: Uint8Array, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', kim as BufferSource, 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    key,
    256,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string, policy: PasswordPolicy): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const kim = await initialKeyMaterial(password, policy.pepper);
  const hash = await derive(kim, salt, policy.iterations);
  return `${FORMAT_V1}$${policy.iterations}$${b64url(salt)}$${b64url(hash)}`;
}

interface Parsed {
  legacy: boolean;
  iterations: number;
  salt: Uint8Array;
  hash: Uint8Array;
}

function parse(stored: string): Parsed | null {
  const parts = stored.split('$');
  if (parts.length !== 4) return null;
  const legacy = parts[0] === FORMAT_LEGACY;
  if (!legacy && parts[0] !== FORMAT_V1) return null;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1_000 || iterations > MAX_ITERATIONS) return null;
  try {
    const salt = fromB64url(parts[2]!);
    const hash = fromB64url(parts[3]!);
    if (salt.length !== 16 || hash.length !== 32) return null;
    return { legacy, iterations, salt, hash };
  } catch {
    return null;
  }
}

export async function verifyPassword(password: string, stored: string, policy: PasswordPolicy): Promise<boolean> {
  const p = parse(stored);
  if (!p) return false;
  const kim = p.legacy
    ? enc.encode(password + policy.pepper) // طريقة v0: إلحاق مباشر (ترحيل فقط)
    : await initialKeyMaterial(password, policy.pepper);
  const actual = await derive(kim, p.salt, p.iterations);
  return timingSafeEqual(actual, p.hash);
}

/** هل التجزئة المخزَّنة أقدم من السياسة الحالية؟ (تُرقّى عند أول دخول ناجح) */
export function needsRehash(stored: string, policy: PasswordPolicy): boolean {
  const v2 = parseV2(stored);
  if (v2) return v2.serverIterations < policy.iterations;
  const p = parse(stored);
  if (!p) return true;
  if (p.legacy) return true;
  return p.iterations < policy.iterations;
}

/** هل الصف مُخزَّن بصيغة v2 (اشتقاق عميل)؟ يُستخدم لاختيار مسار التحقق بلا كشف خارجي. */
export function isV2Hash(stored: string): boolean {
  return parseV2(stored) !== null;
}

/**
 * عمل وهمي بنفس تكلفة التحقق — لتوحيد الزمن بين «بريد غير موجود» و«بريد موجود».
 * بلا ذلك يصبح زمن الاستجابة قناة كشف حسابات.
 */
export async function dummyVerifyWork(policy: PasswordPolicy): Promise<void> {
  const salt = new Uint8Array(16);
  const kim = await initialKeyMaterial('dummy-workload', policy.pepper);
  await derive(kim, salt, policy.iterations);
}

/* ---------- الطبقة الثانية: اشتقاق العميل (v2) ---------- */

export interface ClientKdfConfig {
  iterations: number;
  required: boolean;
}

/**
 * إعداد اشتقاق العميل من البيئة. الافتراضي في غير بيئة الاختبار: إلزامي 600,000.
 * القيمة تُقصّ إلى [MIN_CLIENT_KDF_ITERATIONS, MAX_ITERATIONS].
 */
export function resolveClientKdf(env: { CLIENT_KDF_ITERATIONS?: string; CLIENT_KDF_REQUIRED?: string; ENVIRONMENT?: string }): ClientKdfConfig {
  const raw = Number(env.CLIENT_KDF_ITERATIONS);
  const configured = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : CLIENT_KDF_ITERATIONS;
  // عدد تكرارات المتصفح **جزء من الصيغة** لا إعداد حرّ: المفتاح المشتق يعتمد عليه،
  // والخادم لا يستطيع معرفة العدد الذي استخدمه العميل إلا من الصف المخزَّن.
  // لو تغيّر المتغيّر بين نشرين لاشتقّ كل مستخدم قائم مفتاحًا مختلفًا ⇒ قفل شامل
  // للحسابات. ولو تجاهلناه صامتًا لسجّلنا clientIterations لا يطابق العمل الفعلي
  // (تكرار «قوة» وهمية في سجل التدقيق الأمني). لذلك: قيمة مختلفة = فشل مغلق.
  if (configured !== CLIENT_KDF_ITERATIONS) {
    throw new PasswordPolicyError(
      'BAD_ITERATIONS',
      `CLIENT_KDF_ITERATIONS=${configured} يخالف ثابت الصيغة ${CLIENT_KDF_ITERATIONS}`,
    );
  }
  const required = env.CLIENT_KDF_REQUIRED === 'true' || (env.CLIENT_KDF_REQUIRED !== 'false' && env.ENVIRONMENT !== 'test');
  return { iterations: CLIENT_KDF_ITERATIONS, required };
}

/**
 * ملح اشتقاق العميل: HMAC-SHA256(key=pepper, "es-kdfv2:"+email) مقتطعًا إلى 16 بايت.
 * حتميّ لكل بريد ⇒ لا حاجة لتخزينه ولا يكشف وجود حساب: أي بريد يعطي ملحًا.
 * وبما أن الـpepper مفتاح هذا الـHMAC، فمن يسرق القاعدة وحدها لا يستطيع حتى بدء
 * الاشتقاق للتحقق من تخمين — وهذا سبب إضافي لبقاء الـpepper خارج القاعدة.
 */
export async function clientKdfSalt(emailNormalized: string, policy: PasswordPolicy): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(policy.pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(CLIENT_SALT_PREFIX + emailNormalized));
  return b64url(new Uint8Array(sig).slice(0, 16));
}

/** شكل المفتاح المشتق المقبول من العميل: b64url لِـ32 بايت (43 محرفًا). */
const DERIVED_KEY_RE = /^[A-Za-z0-9_-]{42,44}$/;

export function isWellFormedDerivedKey(value: unknown): value is string {
  if (typeof value !== 'string' || !DERIVED_KEY_RE.test(value)) return false;
  try {
    return fromB64url(value).length === 32;
  } catch {
    return false;
  }
}

export async function hashDerivedKey(derivedKey: string, policy: PasswordPolicy, clientIterations: number): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const kim = await initialKeyMaterial(derivedKey, policy.pepper);
  const hash = await derive(kim, salt, policy.iterations);
  // لا نكتب في الصف رقمًا لم نتحقق منه: الصيغة تعني أن العدد ثابت بروتوكوليًا.
  // أي قيمة أخرى تعني أن المتغيّر تغيّر (سيُرفض عند القراءة أصلًا) — نرفض هنا أيضًا
  // بدل تسجيل «قوة» لا وجود لها.
  if (clientIterations !== CLIENT_KDF_ITERATIONS) {
    throw new PasswordPolicyError('BAD_ITERATIONS', `clientIterations=${clientIterations} ≠ ${CLIENT_KDF_ITERATIONS}`);
  }
  return `${FORMAT_V2}$${policy.iterations}$${CLIENT_KDF_ITERATIONS}$${b64url(salt)}$${b64url(hash)}`;
}

interface ParsedV2 {
  serverIterations: number;
  clientIterations: number;
  salt: Uint8Array;
  hash: Uint8Array;
}

export function parseV2(stored: string): ParsedV2 | null {
  const parts = stored.split('$');
  if (parts.length !== 5 || parts[0] !== FORMAT_V2) return null;
  const serverIterations = Number(parts[1]);
  const clientIterations = Number(parts[2]);
  if (!Number.isInteger(serverIterations) || serverIterations < 1_000 || serverIterations > MAX_ITERATIONS) return null;
  if (!Number.isInteger(clientIterations) || clientIterations < 1) return null;
  try {
    const salt = fromB64url(parts[3]!);
    const hash = fromB64url(parts[4]!);
    if (salt.length !== 16 || hash.length !== 32) return null;
    return { serverIterations, clientIterations, salt, hash };
  } catch {
    return null;
  }
}

export async function verifyDerivedKey(derivedKey: string, stored: string, policy: PasswordPolicy): Promise<boolean> {
  const p = parseV2(stored);
  if (!p) return false;
  const kim = await initialKeyMaterial(derivedKey, policy.pepper);
  const actual = await derive(kim, p.salt, p.serverIterations);
  return timingSafeEqual(actual, p.hash);
}

/* ---------- سياسة كلمة المرور نفسها ---------- */

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 200;

/**
 * قائمة كلمات مرور شائعة قصيرة (أساسية ومقصودة). لا تُغني عن كشف تسريب حقيقي،
 * لكنها تمنع أكثر الأنماط فعالية في تخمين القواميس — بتكلفة معالج صفرية.
 */
const COMMON = new Set([
  'password', 'password1', 'password123', 'passw0rd', 'p@ssw0rd', 'passwort',
  '123456', '1234567', '12345678', '123456789', '1234567890', '12345678910',
  'qwerty', 'qwertyuiop', 'qwerty123', 'abc123', 'abcd1234', 'abcdefgh',
  'letmein', 'welcome', 'welcome1', 'welcome123', 'admin', 'admin123', 'root',
  'iloveyou', 'monkey', 'dragon', 'sunshine', 'princess', 'football', 'baseball',
  'superman', 'batman', 'trustno1', 'master', 'shadow', 'michael', 'jennifer',
  'mustang', 'access', 'flower', 'whatever', 'freedom', 'computer', 'internet',
  'cairo123456', 'egypt123456', 'spain123456', 'spanish123', 'espanol123',
  'holamundo', 'holamundo1', 'espanol', 'español', 'madrid123', 'barcelona1',
  'arabic123', 'mohamed123', 'ahmed123', 'egypt2026', 'cairo2026', 'love123456',
]);

/** جذور شائعة: كلمة شائعة + حتى 4 محارف إضافية (password1234، qwerty!، letmein2026). */
const COMMON_STEMS = [
  'password', 'passwd', 'passwort', 'qwerty', 'letmein', 'welcome', 'iloveyou',
  'admin', 'root', 'monkey', 'dragon', 'sunshine', 'princess', 'football',
  'baseball', 'superman', 'batman', 'trustno1', 'master', 'shadow', 'mustang',
  'cairo', 'egypt', 'espanol', 'spanish', 'madrid', 'barcelona', 'arabic',
];

/** أنماط متسلسلة/متكررة: aaaaaaaa…، 123456789…، abcdefgh… */
function isLowEntropyPattern(pw: string): boolean {
  const s = pw.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s.length < 6) return false;
  if (new Set(s).size <= 2) return true;
  let asc = 0;
  for (let i = 1; i < s.length; i++) {
    const d = s.charCodeAt(i) - s.charCodeAt(i - 1);
    if (d === 1 || d === -1) asc++;
  }
  return asc >= s.length - 2;
}

export function passwordProblems(pw: unknown, opts: { email?: string } = {}): string[] {
  const out: string[] = [];
  if (typeof pw !== 'string') return ['كلمة المرور مطلوبة.'];
  if (pw !== pw.trim()) out.push('لا تبدأ أو تنتهِ بمسافة.');
  if (pw.length < MIN_PASSWORD_LENGTH) out.push(`${MIN_PASSWORD_LENGTH} حرفًا على الأقل.`);
  if (pw.length > MAX_PASSWORD_LENGTH) out.push(`${MAX_PASSWORD_LENGTH} حرفًا كحد أقصى.`);
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(pw)) out.push('يجب أن تحتوي حرفًا واحدًا على الأقل.');
  if (!/[0-9]/.test(pw)) out.push('يجب أن تحتوي رقمًا واحدًا على الأقل.');

  const norm = pw.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
  if (COMMON.has(norm)) out.push('كلمة المرور هذه شائعة جدًا وسهلة التخمين. اختر عبارة أطول وأقل توقعًا.');
  else if (COMMON_STEMS.some(stem => norm.startsWith(stem) && norm.length - stem.length <= 4)) {
    out.push('كلمة المرور تبدأ بكلمة شائعة. اختر عبارة أطول وأقل توقعًا.');
  }
  if (isLowEntropyPattern(pw)) out.push('كلمة المرور متسلسلة أو مكررة. اختر كلمات غير مترابطة.');
  if (opts.email) {
    const local = opts.email.split('@')[0]?.toLowerCase() ?? '';
    if (local.length >= 4 && norm.includes(local.replace(/[^a-z0-9]/g, ''))) {
      out.push('لا تستخدم بريدك كجزء من كلمة المرور.');
    }
  }
  return out;
}
