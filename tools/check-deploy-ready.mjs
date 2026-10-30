#!/usr/bin/env node
/**
 * بوابة ما قبل النشر (Preflight) — تمنع نشر إعدادات التطوير بالخطأ.
 *
 * السبب: الملف الملتزم `wrangler.toml` يحمل إعدادات تطوير (ENVIRONMENT=development،
 * ALLOW_PUBLIC_SIGNUP="false"، database_id وهمي، APP_ORIGIN على localhost).
 * نجاح `git push` لا يعني أن المشروع جاهز للنشر — وهذا الفحص يفصل بينهما بأمر واحد.
 * لا يُتجاوَز بوضع قيم إنتاج وهمية: قسم إنتاج حقيقي يتطلب نطاقًا ومعرّف D1
 * حقيقيين وقرار مالك بشأن قوة الاشتقاق — وكلها غائبة عمدًا حتى الآن.
 *
 * الاستخدام:
 *   node tools/check-deploy-ready.mjs                     # يفحص wrangler.toml الافتراضي
 *   node tools/check-deploy-ready.mjs --file wrangler.production.toml
 *   node tools/check-deploy-ready.mjs --file wrangler.toml --env production
 *   node tools/check-deploy-ready.mjs --json
 *
 * 2026-10-30 (قرار قوة الاشتقاق): صار الحاجز مقيَّدًا بالحالة الفعلية للتعرّض:
 *   - تسجيل عام مفتوح + تكرارات < 600,000 ⇒ **خطأ** يمنع النشر (لا «حاجز» قابل للتجاوز).
 *   - تسجيل عام مغلق + تكرارات < 600,000 ⇒ حاجز يبقى قائمًا إلا إذا سُجّل **قبول مخاطرة**
 *     صريح مطابق النطاق في docs/risk-acceptances.json، عندئذٍ يظهر كتنبيه WAIVED
 *     بمعرّفه وتاريخ انتهائه (لا يختفي، ولا يُدّعى أنه مطابق لـOWASP).
 *   - تسجيل عام مفتوح + تكرارات ≥ 600,000 ⇒ يمرّ (خطة Workers المدفوعة).
 *
 * قسم المتغيّرات: يُقرأ [env.<name>.vars] عند تمرير --env، وإلا [env.production.vars] إن وُجد،
 * وإلا [vars]. مع --env صريح لا تراجع إلى [vars] التطويري بالصمت.
 *
 * كود الخروج: 0 = كل الفحوص تمر (نشر مسموح تقنيًا) · 1 = الفحص فشل · 2 = وجدت حواجز إطلاق مفتوحة.
 * ملاحظة: هذا الفحص لا ينشر شيئًا ولا يتصل بالشبكة.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const AS_JSON = process.argv.includes('--json');
const TARGET = arg('file', 'wrangler.toml');

/** أخطاء تمنع النشر (لازم تُصلح) */
const errors = [];
/** حواجز إطلاق معروفة مفتوحة (ليست خطأ برمجيًا، بل قرار مالك) */
const blockers = [];
/** تنبيهات */
const warnings = [];

const err = (code, msg, fix) => errors.push({ code, msg, fix });
const block = (code, msg, fix, meta = {}) => blockers.push({ code, msg, fix, ...meta });
const warn = (code, msg, fix) => warnings.push({ code, msg, fix });

/**
 * قبولات المخاطرة المسجّلة: قائمة صريحة (لا استنتاج) بتوقيع المالك وتاريخ انتهاء
 * ونطاق مطابقة. لا تُلغي شرطًا أمنيًا، بل تسجّل تنازلًا معلنًا يمكن حذفه فيرتد
 * الحاجز فورًا. ملف غائب أو تالف ⇒ لا قبول ⇒ الحواجز تبقى كما هي.
 */
const ACCEPTANCES_PATH = join(ROOT, 'docs/risk-acceptances.json');
const ACCEPTANCE_GRACE_DAYS = 0;
let acceptances = [];
let acceptancesError = null;
try {
  if (existsSync(ACCEPTANCES_PATH)) {
    const doc = JSON.parse(readFileSync(ACCEPTANCES_PATH, 'utf8'));
    acceptances = Array.isArray(doc.acceptances) ? doc.acceptances : [];
  }
} catch (e) {
  acceptancesError = String(e && e.message ? e.message : e);
}
/** قسم المتغيّرات الذي قُرئ فعلًا — يُذكر في التقرير ليعرف المستخدم أي قيم فُحصت. */
let usedSection = null;

const abs = join(ROOT, TARGET);
if (!existsSync(abs)) {
  err('CONFIG_MISSING', `ملف الإعداد غير موجود: ${TARGET}`, 'تأكد من المسار أو مرّر --file');
} else {
  const text = readFileSync(abs, 'utf8');

  // قراءة المتغيّرات من الأقسام لا من نص مسطّح:
  // إعداد النشر المعتاد في wrangler يحمل [vars] للتطوير و[env.production.vars] للإنتاج،
  // والاكتفاء بقسم [vars] يجعل البوابة ترفض الإعداد الإنتاجي الصحيح (خطأ كان موجودًا فعلًا).
  const sections = new Map();
  let current = '';
  for (const line of text.split('\n')) {
    const header = line.match(/^\s*\[([^\]]+)\]\s*$/);
    if (header) {
      current = header[1].trim();
      if (!sections.has(current)) sections.set(current, new Map());
      continue;
    }
    const kv = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"([^"]*)"\s*$/);
    if (kv && current) sections.get(current).set(kv[1], kv[2]);
  }

  // القسم المختار: --env <name> إن مُرِّر ووُجد، ثم env.production.vars، ثم [vars]
  const ENV_NAME = arg('env', '');
  // مع --env صريح لا نتراجع إلى [vars] التطويري بالصمت: قسم مفقود = خطأ واضح.
  const candidates = ENV_NAME ? [`env.${ENV_NAME}.vars`] : ['env.production.vars', 'vars'];
  const picked = candidates.find(s => sections.has(s));
  usedSection = picked ?? null;
  const vars = picked ? sections.get(picked) : new Map();
  const getVar = name => vars.get(name);

  if (!picked) {
    err('VARS_SECTION_MISSING', 'لا يوجد قسم متغيّرات ([vars] أو [env.<name>.vars]).', 'أضف قسم متغيّرات صريحًا.');
  }

  // 1) البيئة
  const environment = getVar('ENVIRONMENT');
  if (environment !== 'production') {
    err(
      'NOT_PRODUCTION',
      `ENVIRONMENT = ${environment === undefined ? '(غير موجود)' : `"${environment}"`} — يجب "production" للنشر.`,
      'ضع ENVIRONMENT="production" في قسم الإنتاج: [env.production.vars]، أو استخدم --env <name> لاختيار قسم آخر.',
    );
  }

  // 2) أصل التطبيق
  const appOrigin = getVar('APP_ORIGIN');
  if (!appOrigin) {
    err('APP_ORIGIN_MISSING', 'APP_ORIGIN غير موجود — ينهار فحص Origin والكوكي.', 'أضف النطاق الحقيقي، مثال: https://espanol.example.com');
  } else {
    const origins = appOrigin.split(',').map(s => s.trim());
    const localOnly = origins.every(o => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o));
    if (localOnly) {
      err('APP_ORIGIN_LOCAL', `APP_ORIGIN كلها محلية: ${appOrigin}`, 'ضع نطاق HTTPS الحقيقي؛ وإلا فسيرفض المتصفح كل طلب يغيّر الحالة.');
    }
    if (origins.some(o => o !== 'https' && !o.startsWith('https://'))) {
      warn('APP_ORIGIN_INSECURE', 'توجد أصول بلا HTTPS — الكوكي لن يأخذ __Host- ولن يُضاف Secure.', 'استخدم https:// فقط في الإنتاج.');
    }
    if (origins.some(o => /example\.(com|org|net)|REPLACE|your-domain|<|>/.test(o))) {
      err('APP_ORIGIN_PLACEHOLDER', `APP_ORIGIN تحتوي قيمة قالب لا نطاقًا حقيقيًا: ${appOrigin}`, 'ضع النطاق الحقيقي بعد شرائه/تسميته.');
    }
  }

  // 3) بوابة التسجيل العام — التعرّض الفعلي هو ما يحدّد الشدّة
  const signup = getVar('ALLOW_PUBLIC_SIGNUP');
  const iterations = Number(getVar('PBKDF2_ITERATIONS') ?? 0);
  // 2026-10-30 (بعد قرار «تسجيل مجاني»): القوة الفعلية = تكرارات المتصفح + تكرارات الخادم.
  // الطبقة الأولى تُنفَّذ مجانًا في المتصفح (WebCrypto)، فلا تستهلك ميزانية CPU في Worker.
  const clientIters = Number(getVar('CLIENT_KDF_ITERATIONS') ?? 0);
  const clientRequired = getVar('CLIENT_KDF_REQUIRED') === 'true';
  const layered = clientRequired && clientIters >= 600000 && iterations >= 20000;
  const kdfMeetsOwasp = iterations >= 600000 || layered;
  if (signup === 'true' && !kdfMeetsOwasp) {
    // أخطر تركيبة: حسابات عامة بلا حد معدل كافٍ وتجزئة ضعيفة. هذه ليست «قرار مالك»
    // بل عيب إعداد يجب أن يفشل به النشر، لا أن يُتجاوَز بكود خروج 2.
    err(
      'PUBLIC_SIGNUP_WEAK_KDF',
      `ALLOW_PUBLIC_SIGNUP="true" مع PBKDF2 = ${iterations || 'غير محدد'} < 600,000 — تسجيل عام بتجزئة أضعف من متطلب OWASP.`,
      'إمّا PBKDF2_ITERATIONS="600000" على خطة Workers المدفوعة، أو ALLOW_PUBLIC_SIGNUP="false" (الدخول عبر Google للمستخدمين الجدد).',
    );
  } else if (signup === undefined) {
    // الكود يفشل مغلقًا الآن، فلا خطر فتح — لكن الإعداد يجب أن يكون صريحًا
    warn('PUBLIC_SIGNUP_IMPLICIT', 'ALLOW_PUBLIC_SIGNUP غير موجود؛ الكود سيغلق التسجيل. صرّح بالقيمة صراحةً للوضوح.', 'أضف ALLOW_PUBLIC_SIGNUP = "false".');
  }

  // 3b) البريد: صندوق التطوير ممنوع في الإنتاج، ولا مفتاح داخل [vars]
  if (getVar('DEBUG_MAIL_OUTBOX') === 'true') {
    err(
      'MAIL_OUTBOX_IN_PROD',
      'DEBUG_MAIL_OUTBOX="true" في إعداد الإنتاج — يفتح GET /api/dev/mail-outbox برموز تحقق واستعادة.',
      'احذف المتغير من الإنتاج؛ الصندوق التطويري للتطوير والاختبار فقط.',
    );
  }
  const mailFrom = getVar('MAIL_FROM');
  if (mailFrom && /example\.(com|org|net)|REPLACE|<|>/i.test(mailFrom)) {
    err('MAIL_FROM_PLACEHOLDER', `MAIL_FROM قيمة قالب لا نطاقًا حقيقيًا: ${mailFrom}`, 'وثّق نطاقًا حقيقيًا عند المزوّد ثم ضعه هنا.');
  }
  if (getVar('RESEND_API_KEY')) {
    err(
      'SECRET_IN_VARS',
      'RESEND_API_KEY مكتوب داخل [vars] — سيُحفظ في Git وفي نص الإعداد.',
      'انقله إلى سر: wrangler secret put RESEND_API_KEY --config wrangler.production.toml',
    );
  }

  // 4) قاعدة البيانات
  const dbId = text.match(/database_id\s*=\s*"([^"]*)"/)?.[1];
  if (!dbId) {
    err('D1_ID_MISSING', 'database_id غير موجود في [[d1_databases]].', 'استخدم معرّف قاعدة الإنتاج من لوحة Cloudflare.');
  } else if (/^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(dbId)) {
    err('D1_ID_PLACEHOLDER', 'database_id ما زال معرّفًا وهميًا (أصفار).', 'ضع معرّف D1 الإنتاجي الحقيقي.');
  }

  // 5) السياسة الأمنية المطلوبة — حاجز يبقى ما لم تُطبَّق الطبقتان أو يُسجَّل تنازل مطابق
  if (getVar('PBKDF2_ITERATIONS') && !kdfMeetsOwasp) {
    block(
      'KDF_BELOW_OWASP',
      `PBKDF2_ITERATIONS = ${getVar('PBKDF2_ITERATIONS')} < 600,000 (متطلب OWASP).`,
      'إما خطة Workers المدفوعة (30s CPU) لرفع التكرارات، أو قبول البقاء بلا تسجيل عام (docs/SECURITY_BLOCKERS.md).',
      { waivable: true, scope: { ENVIRONMENT: environment ?? null, ALLOW_PUBLIC_SIGNUP: signup ?? null } },
    );
  }

  // 6) الأسرار لا تكون في الملف
  if (/PASSWORD_PEPPER\s*=/.test(text)) {
    err('SECRET_IN_CONFIG', 'PASSWORD_PEPPER مكتوب داخل ملف الإعداد — سيُرفع إلى Git.', 'أزله واستخدم: wrangler secret put PASSWORD_PEPPER');
  }
  if (/-----BEGIN [A-Z ]*PRIVATE KEY/.test(text)) {
    err('PRIVATE_KEY_IN_CONFIG', 'مفتاح خاص داخل ملف الإعداد.', 'أزله فورًا ودوّره.');
  }

  // 7) جدول التوافق
  const compat = text.match(/compatibility_date\s*=\s*"([^"]*)"/)?.[1];
  if (!compat) warn('COMPAT_DATE_MISSING', 'compatibility_date غير محدد.', 'ثبّته لتجنب تغيّر سلوك workerd.');
}

/**
 * تطبيق قبولات المخاطرة: الحاجز القابل للتنازل ينتقل إلى التنبيهات بمعرّف قبوله
 * وتاريخ انتهائه. شروط القبول: نفس الكود، غير منتهٍ، ونطاق مطابق للقيم الفعلية.
 */
const appliedWaivers = [];
if (acceptances.length) {
  const today = new Date().toISOString().slice(0, 10);
  for (const b of [...blockers]) {
    if (!b.waivable) continue;
    const hit = acceptances.find(a =>
      a && a.risk === b.code && !a.revokedAt &&
      typeof a.expiresAt === 'string' && a.expiresAt >= today &&
      a.scope && Object.entries(a.scope).every(([k, v]) => (b.scope?.[k] ?? null) === v));
    if (!hit) continue;
    blockers.splice(blockers.indexOf(b), 1);
    appliedWaivers.push({ id: hit.id, code: b.code, expiresAt: hit.expiresAt, recordedIn: hit.recordedIn });
    warn(
      `WAIVED:${hit.id}`,
      `${b.msg} — تنازل مسجَّل (${hit.id}) حتى ${hit.expiresAt}: ${hit.decision ?? ''}`.trim(),
      'هذا تنازل معلن لا مطابقة لـOWASP. يعود الحاجز فور حذف السجل من docs/risk-acceptances.json أو انتهاء تاريخه.',
    );
  }
}
if (acceptancesError) {
  warn('ACCEPTANCES_UNREADABLE', `تعذّرت قراءة docs/risk-acceptances.json: ${acceptancesError}`, 'لا قبولات مطبَّقة — أصلح الملف أو احذفه.');
}

const status = errors.length ? 'FAIL' : blockers.length ? 'BLOCKED' : 'PASS';

if (AS_JSON) {
  console.log(JSON.stringify({ file: TARGET, section: usedSection ?? null, status, errors, blockers, warnings, waivers: appliedWaivers }, null, 2));
} else {
  console.log(`# فحص الجاهزية للنشر — ${TARGET}${usedSection ? ` (قسم المتغيّرات: [${usedSection}])` : ''}\n`);
  console.log(`- أخطاء تمنع النشر: ${errors.length}`);
  console.log(`- حواجز إطلاق مفتوحة (قرار مالك): ${blockers.length}`);
  console.log(`- تنبيهات: ${warnings.length}`);
  if (appliedWaivers.length) console.log(`- تنازلات مسجَّلة (مخاطرة مقبولة صراحةً): ${appliedWaivers.length}`);
  console.log('');

  const section = (title, list, icon) => {
    if (!list.length) return;
    console.log(`## ${title}`);
    for (const item of list) {
      console.log(`- ${icon} [${item.code}] ${item.msg}`);
      console.log(`  الإصلاح: ${item.fix}`);
    }
    console.log('');
  };
  section('أخطاء', errors, '✗');
  section('حواجز إطلاق', blockers, '⛔');
  section('تنبيهات', warnings, '!');

  console.log(`**النتيجة: ${status}**`);
  if (status !== 'PASS') {
    console.log('\n> هذا الفحص لا ينشر شيئًا. النشر يحتاج تصريحًا صريحًا من المالك (docs/13_DEPLOYMENT.md).');
  }
}

process.exit(status === 'FAIL' ? 1 : status === 'BLOCKED' ? 2 : 0);
