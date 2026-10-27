import type { Env, SessionUser } from '../types';
import {
  HttpError, apiError, cookieName, json, readCookie, readJson,
  serializeSessionCookie, clearSessionCookie,
} from '../lib/http';
import { randomToken, sha256Hex, hmacSha256Hex } from '../lib/crypto';
import {
  hashPassword, verifyPassword, needsRehash, passwordProblems, resolvePolicy,
  type PasswordPolicy,
} from '../lib/password';
import { ulid } from '../lib/ids';
import { checkRateLimit, pruneRateLimits } from '../lib/rate-limit';
import {
  createSession, createUser, emailExists, findSessionUser, findUserByEmail, findUserById,
  registerFailedLogin, resetFailedLogin, revokeOtherSessions, revokeSession, touchSession,
  revokeExcessSessions, pruneExpiredSessions, updatePasswordHash, writeAudit,
} from '../db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
export const normalizeEmail = (e: string) => e.trim().toLowerCase();

/** رسالة موحّدة لكل حالات فشل الدخول — لا تكشف وجود الحساب ولا حالته. */
const GENERIC_AUTH_FAIL = 'البريد أو كلمة المرور غير صحيحة.';
const RATE_LIMIT_MSG = 'محاولات كثيرة. أعد المحاولة بعد قليل.';

/**
 * بصمة عنوان الشبكة: HMAC بمفتاح مشتق من سر التطبيق (فصل نطاقات)، بلا تخزين IP صريح.
 * لا نستخدم X-Forwarded-For (قابل للتزييف من العميل) إلا في التطوير المحلي.
 */
async function clientIpHash(req: Request, pepper: string, environment: string): Promise<string> {
  const cfIp = req.headers.get('CF-Connecting-IP');
  const forwarded = environment === 'development' || environment === 'test' ? req.headers.get('X-Forwarded-For') : null;
  const ip = (cfIp || forwarded || 'unknown').split(',')[0]!.trim();
  const key = await hmacSha256Hex(pepper || 'no-pepper-dev', 'ip-hash-v1');
  return hmacSha256Hex(key, ip);
}

/**
 * حد التسجيل لكل عنوان في الساعة.
 * الافتراضي 10 (المعتمد). يمكن رفعه في التطوير المحلي فقط لاختبارات المتصفح
 * التي تنشئ عشرات الحسابات؛ في الإنتاج يبقى المتغير غير مضبوط ⇒ 10.
 * لا يقلّ أبدًا عن 1.
 */
function signupRateLimit(env: Env): number {
  const raw = Number(env.SIGNUP_RATE_LIMIT_PER_HOUR);
  if (!Number.isFinite(raw) || raw <= 0) return 10;
  return Math.max(1, Math.floor(raw));
}

async function rateLimitOrThrow(env: Env, bucket: string, limit: number, windowSec: number): Promise<void> {
  const r = await checkRateLimit(env.DB, bucket, limit, windowSec);
  if (!r.allowed) {
    throw new HttpError(429, 'RATE_LIMITED', RATE_LIMIT_MSG, { retryAfterSeconds: Math.ceil((r.resetAt - Date.now()) / 1000) });
  }
}

/** مدة الجلسة بالأيام، محصورة بين 1 و90 — قيمة إعداد خاطئة لا تصنع جلسات لعشر سنوات. */
function sessionTtlDays(env: Env): number {
  const n = Number(env.SESSION_TTL_DAYS);
  if (!Number.isFinite(n)) return 30;
  return Math.min(90, Math.max(1, Math.floor(n)));
}

function policyFor(env: Env): PasswordPolicy {
  try {
    return resolvePolicy(env);
  } catch {
    // إعداد خاطئ = لا نخدم مصادقة أصلًا. الفشل المغلق مطلوب هنا.
    throw new HttpError(503, 'AUTH_UNAVAILABLE', 'تسجيل الدخول غير متاح مؤقتًا. حاول لاحقًا.');
  }
}

export async function signup(req: Request, env: Env, requestId: string): Promise<Response> {
  // فشل مغلق: التسجيل يُفتح بمفتاح صريح `true` فقط.
  // أي قيمة أخرى — بما فيها المتغيّر الغائب تمامًا (نسيان `[vars]` في بيئة نشر) — تُغلق التسجيل.
  // سابقًا كان الشرط `=== 'false'`، فكان غياب المتغيّر يفتح التسجيل العام بلا قرار صريح.
  if (env.ALLOW_PUBLIC_SIGNUP !== 'true') {
    throw new HttpError(503, 'SIGNUP_DISABLED', 'التسجيل غير متاح حاليًا. نفتحه بعد اعتماد سياسة حماية كلمات المرور.');
  }
  const policy = policyFor(env);
  const body = await readJson<{ email?: string; password?: string; displayName?: string }>(req);
  const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
  if (!EMAIL_RE.test(email) || email.length > 254) {
    throw new HttpError(400, 'INVALID_EMAIL', 'صيغة البريد الإلكتروني غير صحيحة.');
  }
  const pwProblems = passwordProblems(body.password, { email });
  if (pwProblems.length) {
    throw new HttpError(400, 'WEAK_PASSWORD', 'كلمة المرور غير مقبولة: ' + pwProblems.join(' '), { problems: pwProblems });
  }
  if (body.displayName && (body.displayName.length > 80 || body.displayName.includes('<'))) {
    throw new HttpError(400, 'INVALID_NAME', 'الاسم غير مقبول.');
  }

  const ipHash = await clientIpHash(req, env.PASSWORD_PEPPER ?? '', env.ENVIRONMENT);
  // 10/ساعة لا 5: شبكات الهاتف في مصر تستخدم CGNAT، فقد يتشارك كثير من المستخدمين عنوانًا واحدًا.
  // قابل للضبط بمتغير بيئة للتطوير/الاختبار المحلي فقط؛ القيمة الافتراضية هي المعتمدة.
  const signupLimit = signupRateLimit(env);
  await rateLimitOrThrow(env, `signup:ip:${ipHash}`, signupLimit, 3600);

  // رسالة موحّدة النص: لا نكشف إن كان البريد مسجلًا أم لا.
  // حدّ صريح: بلا تحقق بالبريد لا يمكن توحيد رمز الحالة (409 مقابل 201 + كوكي)
  // دون كسر التسجيل نفسه — الرد الناجح يجب أن ينشئ جلسة. التخفيف هنا هو
  // النص الموحّد + حد المعدل (10/ساعة لكل IP) + إهدار تكلفة اشتقاق مماثلة
  // لتكلفة الإنشاء حتى لا يكشف التوقيت وجود البريد. التوحيد الكامل يتطلب
  // قناة تحقق بالبريد (مزود بريد — عائق موثّق، بلا قرار مالك بعد).
  if (await emailExists(env.DB, email)) {
    await hashPassword(body.password as string, policy);
    throw new HttpError(409, 'SIGNUP_UNAVAILABLE', 'تعذّر إنشاء الحساب بهذا البريد. جرّب بريدًا آخر.');
  }

  const passwordHash = await hashPassword(body.password as string, policy);
  const userId = ulid();
  try {
    await createUser(env.DB, {
      id: userId,
      emailNormalized: email,
      emailDisplay: body.email!.trim(),
      passwordHash,
      displayName: body.displayName?.trim() || null,
    });
  } catch (err) {
    if (String(err).includes('UNIQUE')) {
      throw new HttpError(409, 'SIGNUP_UNAVAILABLE', 'تعذّر إنشاء الحساب بهذا البريد.');
    }
    throw err;
  }

  const ttl = sessionTtlDays(env);
  const token = randomToken(32);
  await createSession(env.DB, userId, token, ttl, ipHash, req.headers.get('User-Agent'));
  await revokeExcessSessions(env.DB, userId);

  await writeAudit(env.DB, {
    id: ulid(), actorUserId: userId, action: 'auth.signup', targetType: 'user',
    targetId: userId, requestId, ipHash, result: 'success',
  });

  const user = await findSessionUser(env, token);
  const res = json({ user }, { status: 201 }, requestId);
  res.headers.set('Set-Cookie', serializeSessionCookie(env, token, ttl));
  return res;
}

export async function login(req: Request, env: Env, requestId: string): Promise<Response> {
  const policy = policyFor(env);
  const body = await readJson<{ email?: string; password?: string }>(req);
  const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
  const password = typeof body.password === 'string' ? body.password : '';
  // صيغة البريد غير الصحيحة خطأ إدخال لا يكشف شيئًا؛ نُبقي 400 لرسالة أوضح للمستخدم
  if (!EMAIL_RE.test(email) || !password) {
    throw new HttpError(400, 'INVALID_CREDENTIALS', GENERIC_AUTH_FAIL);
  }

  const ipHash = await clientIpHash(req, env.PASSWORD_PEPPER ?? '', env.ENVIRONMENT);
  await rateLimitOrThrow(env, `login:ip:${ipHash}`, 10, 60);
  // نافذة على مستوى البريد أيضًا — تُطبَّق بالتساوي على المسجَّل وغير المسجَّل (لا كشف)
  await rateLimitOrThrow(env, `login:acct:${await sha256Hex(email)}`, 10, 900);

  const row = await findUserByEmail(env.DB, email);
  const generic: HttpError = new HttpError(401, 'INVALID_CREDENTIALS', GENERIC_AUTH_FAIL);

  if (!row) {
    // نُهدر تكلفة اشتقاق مماثلة لمنع كشف وجود البريد عبر التوقيت
    await hashPassword(password, policy);
    throw generic;
  }

  // الحساب غير النشط: نفس الرد العام — الرسالة الخاصة كانت تكشف وجود الحساب
  if (row.status !== 'active') {
    await hashPassword(password, policy);
    throw generic;
  }

  // القفل التجريبي: نفس رمز ورسالة حد المعدل حتى لا يميّز المهاجم الحساب الموجود
  if (row.locked_until && new Date(row.locked_until).getTime() > Date.now()) {
    await hashPassword(password, policy);
    throw new HttpError(429, 'RATE_LIMITED', RATE_LIMIT_MSG);
  }

  const ok = await verifyPassword(password, row.password_hash, policy);
  if (!ok) {
    await registerFailedLogin(env.DB, row.id);
    throw generic;
  }

  // ترقية صامتة: إن تغيّرت السياسة (تكرارات أعلى/صيغة أحدث) نُعيد التجزئة الآن
  if (needsRehash(row.password_hash, policy)) {
    await updatePasswordHash(env.DB, row.id, await hashPassword(password, policy));
  }

  await resetFailedLogin(env.DB, row.id);
  const ttl = sessionTtlDays(env);
  const token = randomToken(32);
  await createSession(env.DB, row.id, token, ttl, ipHash, req.headers.get('User-Agent'));
  await revokeExcessSessions(env.DB, row.id);

  // تنظيف احتمالي منخفض التكلفة بدل cron مدفوع
  if (Math.random() < 0.05) {
    await Promise.all([pruneRateLimits(env.DB), pruneExpiredSessions(env.DB)]);
  }

  await writeAudit(env.DB, {
    id: ulid(), actorUserId: row.id, action: 'auth.login', targetType: 'user',
    targetId: row.id, requestId, ipHash, result: 'success',
  });

  const user = await findSessionUser(env, token);
  const res = json({ user }, {}, requestId);
  res.headers.set('Set-Cookie', serializeSessionCookie(env, token, ttl));
  return res;
}

export async function logout(req: Request, env: Env, requestId: string): Promise<Response> {
  const token = readCookie(req, cookieName(env));
  if (token) await revokeSession(env, token);
  const res = json({ ok: true }, {}, requestId);
  res.headers.set('Set-Cookie', clearSessionCookie(env));
  return res;
}

export async function me(req: Request, env: Env, requestId: string): Promise<Response> {
  const token = readCookie(req, cookieName(env));
  if (!token) throw new HttpError(401, 'UNAUTHENTICATED', 'يلزم تسجيل الدخول.');
  const user = await findSessionUser(env, token);
  if (!user) throw new HttpError(401, 'UNAUTHENTICATED', 'انتهت الجلسة. سجّل الدخول من جديد.');
  await touchSession(env, token);
  return json({ user }, {}, requestId);
}

export async function updateMe(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const body = await readJson<{
    displayName?: string | null;
    explanationStyle?: string;
    audioVariant?: string;
    dailyGoalMinutes?: number;
  }>(req);

  const sets: string[] = [];
  const vals: unknown[] = [];
  if (body.displayName !== undefined) {
    if (body.displayName !== null && (typeof body.displayName !== 'string' || body.displayName.length > 80 || body.displayName.includes('<'))) {
      throw new HttpError(400, 'INVALID_NAME', 'الاسم غير مقبول.');
    }
    sets.push('display_name = ?');
    vals.push(body.displayName === null ? null : body.displayName.trim());
  }
  if (body.explanationStyle !== undefined) {
    if (!['fusha', 'eg', 'fusha_eg'].includes(body.explanationStyle)) {
      throw new HttpError(400, 'INVALID_STYLE', 'أسلوب الشرح غير معروف.');
    }
    sets.push('explanation_style = ?');
    vals.push(body.explanationStyle);
  }
  if (body.audioVariant !== undefined) {
    if (!['es-ES', 'es-419'].includes(body.audioVariant)) {
      throw new HttpError(400, 'INVALID_VARIANT', 'المنطقة الصوتية غير معروفة.');
    }
    sets.push('audio_variant = ?');
    vals.push(body.audioVariant);
  }
  if (body.dailyGoalMinutes !== undefined) {
    const n = Number(body.dailyGoalMinutes);
    if (!Number.isInteger(n) || n < 5 || n > 120) throw new HttpError(400, 'INVALID_GOAL', 'الهدف اليومي يجب أن يكون بين 5 و120 دقيقة.');
    sets.push('daily_goal_minutes = ?');
    vals.push(n);
  }
  if (!sets.length) throw new HttpError(400, 'NOTHING_TO_UPDATE', 'لا يوجد ما يُحدَّث.');
  sets.push(`updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')`);

  await env.DB.prepare(`UPDATE user_profiles SET ${sets.join(', ')} WHERE user_id = ?`).bind(...vals, user.id).run();

  const token = readCookie(req, cookieName(env))!;
  const refreshed = await findSessionUser(env, token);
  return json({ user: refreshed }, {}, requestId);
}

/** مثال RBAC: يتطلب صلاحية audit.read (المتعلم لا يملكها). */
export async function adminAudit(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  if (!user.permissions.includes('audit.read')) {
    throw new HttpError(403, 'FORBIDDEN', 'لا تملك صلاحية الوصول إلى سجل التدقيق.');
  }
  const url = new URL(req.url);
  // حدّ أدنى 1: LIMIT -1 في SQLite تعني «بلا حدّ» فتُعيد السجل كاملًا.
  const limit = Math.min(100, Math.max(1, Math.floor(Number(url.searchParams.get('limit')) || 20)));
  const rows = await env.DB.prepare(
    `SELECT id, action, target_type, result, created_at FROM admin_audit_logs ORDER BY created_at DESC LIMIT ?`,
  ).bind(limit).all();
  return json({ items: rows.results }, {}, requestId);
}

/** يلغي كل الجلسات الأخرى للمستخدم الحالي — بعد سرقة كوكي أو جهاز مشترك. */
export async function revokeAllSessions(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const token = readCookie(req, cookieName(env));
  if (!token) throw new HttpError(401, 'UNAUTHENTICATED', 'يلزم تسجيل الدخول.');
  const revoked = await revokeOtherSessions(env, user.id, token);
  await writeAudit(env.DB, {
    id: ulid(), actorUserId: user.id, action: 'auth.sessions.revoke_all', targetType: 'user',
    targetId: user.id, requestId, result: 'success', after: { revoked },
  });
  return json({ ok: true, revoked }, {}, requestId);
}

/** تغيير كلمة المرور: يتحقق من القديمة، ويطرد كل الجلسات الأخرى فورًا. */
export async function changePassword(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const policy = policyFor(env);
  const body = await readJson<{ currentPassword?: string; newPassword?: string }>(req);
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const row = await findUserById(env.DB, user.id);
  if (!row) throw new HttpError(401, 'UNAUTHENTICATED', 'يلزم تسجيل الدخول.');
  const ok = currentPassword ? await verifyPassword(currentPassword, row.password_hash, policy) : false;
  if (!ok) {
    await registerFailedLogin(env.DB, row.id);
    throw new HttpError(401, 'INVALID_CREDENTIALS', GENERIC_AUTH_FAIL);
  }
  const pwProblems = passwordProblems(body.newPassword, { email: row.email_normalized });
  if (pwProblems.length) {
    throw new HttpError(400, 'WEAK_PASSWORD', 'كلمة المرور غير مقبولة: ' + pwProblems.join(' '), { problems: pwProblems });
  }
  await updatePasswordHash(env.DB, row.id, await hashPassword(body.newPassword as string, policy));
  await resetFailedLogin(env.DB, row.id);
  const token = readCookie(req, cookieName(env));
  if (token) await revokeOtherSessions(env, row.id, token);
  await writeAudit(env.DB, {
    id: ulid(), actorUserId: row.id, action: 'auth.password.change', targetType: 'user',
    targetId: row.id, requestId, result: 'success',
  });
  return json({ ok: true }, {}, requestId);
}

export { apiError, normalizeEmail as _normalizeEmail };
