import type { Env, SessionUser } from '../types';
import {
  HttpError, apiError, json, readJson,
  serializeSessionCookie, clearSessionCookies, readSessionToken,
  requestIsSecure, cookieName, cookieAttrs, readCookie, isNonProductionEnv } from '../lib/http';
import { randomToken, sha256Hex, hmacSha256Hex, timingSafeEqual } from '../lib/crypto';
import {
  buildAuthorizationUrl, exchangeCode, fetchJwks, pkcePair, resolveRedirectUri,
  verifyIdToken, OAuthError, type GoogleIdentity,
} from '../lib/google-oauth';
import {
  hashPassword, verifyPassword, needsRehash, passwordProblems, resolvePolicy,
  type PasswordPolicy,
} from '../lib/password';
import { ulid } from '../lib/ids';
import { checkRateLimit, pruneRateLimits } from '../lib/rate-limit';
import {
  createSession, createUser, emailExists, findSessionUser, findUserByEmail, findUserById,
  findOAuthIdentity, linkOAuthIdentity, markEmailVerified,
  registerFailedLogin, resetFailedLogin, revokeOtherSessions, revokeSession, touchSession,
  revokeExcessSessions, pruneExpiredSessions, updatePasswordHash, writeAudit,
  SESSION_IDLE_DAYS,
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
  // AUD-19: التجاوز للتطوير/الاختبار فقط — في الإنتاج يبقى الحد المعتمد (10) مهما عيّن المتغير
  if (!isNonProductionEnv(env)) return 10;
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
    throw new HttpError(409, 'SIGNUP_UNAVAILABLE', 'تعذّر إنشاء الحساب بهذا البريد. إن كان لديك حساب قائم جرّب تسجيل الدخول، أو استخدم بريدًا آخر.');
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
  res.headers.set('Set-Cookie', serializeSessionCookie(env, token, ttl, req));
  if (env.DEBUG_AUTH_SESSION === 'true') {
    // تسجيل تشخيصي محلي فقط (محجوب بمتغير بيئة غائب في الإنتاج):
    // اسم الكعكة وخصائصها الآمنة — بدون قيم، بدون بريد، بدون رموز.
    const sec = requestIsSecure(req);
    console.log(`[auth-session-diag] signup issued cookie name=${cookieName(env, req)} secure=${sec} attrs="${cookieAttrs(ttl * 24 * 60 * 60, sec).join('; ')}"`);
  }
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
  res.headers.set('Set-Cookie', serializeSessionCookie(env, token, ttl, req));
  if (env.DEBUG_AUTH_SESSION === 'true') {
    // تسجيل تشخيصي محلي فقط (محجوب بمتغير بيئة غائب في الإنتاج):
    // اسم الكعكة وخصائصها الآمنة — بدون قيم، بدون بريد، بدون رموز.
    const sec = requestIsSecure(req);
    console.log(`[auth-session-diag] login issued cookie name=${cookieName(env, req)} secure=${sec} attrs="${cookieAttrs(ttl * 24 * 60 * 60, sec).join('; ')}"`);
  }
  return res;
}

export async function logout(req: Request, env: Env, requestId: string): Promise<Response> {
  const token = readSessionToken(req);
  if (token) await revokeSession(env, token);
  const res = json({ ok: true }, {}, requestId);
  for (const cookie of clearSessionCookies(env, req)) res.headers.append('Set-Cookie', cookie);
  return res;
}

export async function me(req: Request, env: Env, requestId: string): Promise<Response> {
  const token = readSessionToken(req);
  if (env.DEBUG_AUTH_SESSION === 'true') {
    // تسجيل تشخيصي محلي فقط (محجوب بمتغير بيئة غائب في الإنتاج):
    // وجود الكعكة فقط (أسماء + أعلام — لا قيم)، ومرحلة الفشل:
    // extraction-failed (لم تصل كعكة / اسمها مُستبعد على طلب آمن) |
    // lookup-failed (كعكة وصلت ولا يوجد سجل جلسة) | verification-failed:… (الجلسة ملغاة/منتهية/خاملة/المستخدم غير active) | valid.
    const sec = requestIsSecure(req);
    const hasHost = readCookie(req, '__Host-ses') !== null;
    const hasPlain = readCookie(req, 'ses') !== null;
    let stage: string;
    if (!token) {
      stage = 'extraction-failed';
    } else {
      const row = await env.DB.prepare(
        `SELECT u.status AS status,
                s.revoked_at IS NULL AS not_revoked,
                s.expires_at > strftime('%Y-%m-%dT%H:%M:%fZ','now') AS not_expired,
                (s.last_seen_at IS NULL OR s.last_seen_at > strftime('%Y-%m-%dT%H:%M:%fZ','now', ?)) AS not_idle
         FROM sessions s JOIN users u ON u.id = s.user_id
         WHERE s.id = ?`,
      ).bind(`-${SESSION_IDLE_DAYS} days`, await sha256Hex(token))
        .first<{ status: string; not_revoked: number; not_expired: number; not_idle: number } | null>();
      if (!row) stage = 'lookup-failed';
      else if (!row.not_revoked) stage = 'verification-failed:revoked';
      else if (!row.not_expired) stage = 'verification-failed:expired';
      else if (!row.not_idle) stage = 'verification-failed:idle';
      else if (row.status !== 'active') stage = 'verification-failed:user-status';
      else stage = 'valid';
    }
    console.log(`[auth-session-diag] me secure=${sec} hostCookie=${hasHost} plainCookie=${hasPlain} token=${token ? 'present' : 'absent'} stage=${stage} requestId=${requestId}`);
  }
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

  const token = readSessionToken(req)!;
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

/* ============================================================================
   Google OAuth — الدخول عبر حساب Google (قرار مالك 2026-10-28، خيار «ج»)
   ----------------------------------------------------------------------------
   التدفق: start (كوكيز state + PKCE + nonce قصيرة العمر) ←→ Google، ثم
   callback: تبادل الكود والتحقق من ID token على الخادم، ثم بناء جلسة المنصة
   المعتادة (نفس الكوكي، نفس حدود الجلسات، نفس التدقيق).
   كل فشل ينتهي بإعادة توجيه إلى /login?oauth=<رمز عام> — بلا تفاصيل مزوّد،
   وبلا كشف وجود الحساب أو حالته. الدخول بكلمة المرور يبقى كما هو للحسابات
   القائمة؛ التسجيل العام بكلمة مرور يبقى مغلقًا.
   ========================================================================== */

const OAUTH_STATE_COOKIE = 'oauth_state';
const OAUTH_VERIFIER_COOKIE = 'oauth_verifier';
const OAUTH_NONCE_COOKIE = 'oauth_nonce';
/** 10 دقائق: تكفي إتمام تدفق المزوّد، ولا يبقى أثر بعده. */
const OAUTH_COOKIE_MAX_AGE = 600;

function oauthCookie(name: string, value: string, req: Request, maxAge: number): string {
  const parts = [`${name}=${value}`, 'Path=/api/auth/oauth', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAge}`];
  if (requestIsSecure(req)) parts.push('Secure');
  return parts.join('; ');
}

function clearOAuthCookies(req: Request): string[] {
  return [OAUTH_STATE_COOKIE, OAUTH_VERIFIER_COOKIE, OAUTH_NONCE_COOKIE].map(n => oauthCookie(n, '', req, 0));
}

function oauthRedirect(location: string, req: Request, extraCookies: string[] = []): Response {
  const res = new Response(null, { status: 302, headers: { Location: location, 'Cache-Control': 'no-store' } });
  for (const c of extraCookies) res.headers.append('Set-Cookie', c);
  return res;
}

function sanitizeOAuthDisplayName(name: string | null): string | null {
  if (!name) return null;
  const clean = name.trim();
  if (!clean || clean.length > 80 || clean.includes('<')) return null;
  return clean;
}

export async function oauthGoogleStart(req: Request, env: Env, _requestId: string): Promise<Response> {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) return oauthRedirect('/login?oauth=unavailable', req);
  let redirectUri: string;
  try {
    redirectUri = resolveRedirectUri(req, env);
  } catch {
    return oauthRedirect('/login?oauth=unavailable', req);
  }
  const ipHash = await clientIpHash(req, env.PASSWORD_PEPPER ?? '', env.ENVIRONMENT);
  try {
    await rateLimitOrThrow(env, `oauth-start:ip:${ipHash}`, 20, 600);
  } catch (e) {
    if (e instanceof HttpError) return oauthRedirect('/login?oauth=failed', req);
    throw e;
  }
  const state = randomToken(32);
  const nonce = randomToken(32);
  const { verifier, challenge } = await pkcePair();
  const url = buildAuthorizationUrl({ clientId, redirectUri, state, nonce, challenge });
  return oauthRedirect(url, req, [
    oauthCookie(OAUTH_STATE_COOKIE, state, req, OAUTH_COOKIE_MAX_AGE),
    oauthCookie(OAUTH_VERIFIER_COOKIE, verifier, req, OAUTH_COOKIE_MAX_AGE),
    oauthCookie(OAUTH_NONCE_COOKIE, nonce, req, OAUTH_COOKIE_MAX_AGE),
  ]);
}

export async function oauthGoogleCallback(req: Request, env: Env, requestId: string): Promise<Response> {
  const fail = (code: string): Response => oauthRedirect(`/login?oauth=${code}`, req, clearOAuthCookies(req));
  const params = new URL(req.url).searchParams;
  // رفض المستخدم عند المزوّد: رمز عام فقط، بلا تفاصيل.
  if (params.get('error')) return fail('denied');

  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return fail('unavailable');

  const code = params.get('code') ?? '';
  const stateParam = params.get('state') ?? '';
  const stateCookie = readCookie(req, OAUTH_STATE_COOKIE);
  const verifier = readCookie(req, OAUTH_VERIFIER_COOKIE);
  const nonce = readCookie(req, OAUTH_NONCE_COOKIE);
  if (!code || !stateParam || !stateCookie || !verifier || !nonce) return fail('invalid');
  const enc = new TextEncoder();
  if (!timingSafeEqual(enc.encode(stateParam), enc.encode(stateCookie))) return fail('invalid');

  let redirectUri: string;
  try {
    redirectUri = resolveRedirectUri(req, env);
  } catch {
    return fail('unavailable');
  }

  const ipHash = await clientIpHash(req, env.PASSWORD_PEPPER ?? '', env.ENVIRONMENT);
  try {
    await rateLimitOrThrow(env, `oauth-callback:ip:${ipHash}`, 10, 60);
  } catch (e) {
    if (e instanceof HttpError) return fail('failed');
    throw e;
  }

  let identity: GoogleIdentity;
  try {
    const { idToken } = await exchangeCode({ code, verifier, redirectUri, clientId, clientSecret, fetchFn: fetch });
    const jwks = await fetchJwks(fetch);
    identity = await verifyIdToken(idToken, { jwks, clientId, nonce, nowMs: Date.now() });
  } catch (e) {
    if (e instanceof OAuthError) return fail('failed');
    throw e;
  }

  const email = normalizeEmail(identity.email);
  if (!EMAIL_RE.test(email) || email.length > 254) return fail('failed');

  let userId: string | null = (await findOAuthIdentity(env.DB, 'google', identity.sub))?.user_id ?? null;
  if (userId) {
    const row = await findUserById(env.DB, userId);
    // الحساب غير النشط: نفس الرد العام — لا كشف للحالة.
    if (!row || row.status !== 'active') return fail('failed');
  } else {
    const byEmail = await findUserByEmail(env.DB, email);
    if (byEmail) {
      if (byEmail.status !== 'active') return fail('failed');
      userId = byEmail.id;
    } else {
      // إنشاء حساب جديد عبر OAuth يخضع لحد التسجيل نفسه (شبكات CGNAT في الاعتبار).
      try {
        await rateLimitOrThrow(env, `signup:ip:${ipHash}`, signupRateLimit(env), 3600);
      } catch (e) {
        if (e instanceof HttpError) return fail('failed');
        throw e;
      }
      let policy: PasswordPolicy;
      try {
        policy = policyFor(env);
      } catch (e) {
        if (e instanceof HttpError) return fail('failed');
        throw e;
      }
      // كلمة مرور عشوائية غير قابلة للاستخدام: تُجزَّأ وتُرمى فورًا، فلا دخول
      // بكلمة مرور لهذا الحساب أبدًا، ويبقى عمود password_hash NOT NULL بلا استثناء.
      const unusableHash = await hashPassword(randomToken(32), policy);
      userId = ulid();
      try {
        await createUser(env.DB, {
          id: userId,
          emailNormalized: email,
          emailDisplay: identity.email.trim(),
          passwordHash: unusableHash,
          displayName: sanitizeOAuthDisplayName(identity.name),
        });
      } catch (err) {
        if (String(err).includes('UNIQUE')) return fail('failed');
        throw err;
      }
    }
  }

  await linkOAuthIdentity(env.DB, {
    id: ulid(), userId, provider: 'google', providerSubject: identity.sub, emailAtLink: identity.email,
  });
  await markEmailVerified(env.DB, userId, new Date().toISOString());
  // إثبات هوية جديد من المزوّد ⇒ يُصفَّر عدّاد الفشل، ولا يُطبَّق قفل التخمين هنا.
  await resetFailedLogin(env.DB, userId);

  const ttl = sessionTtlDays(env);
  const token = randomToken(32);
  await createSession(env.DB, userId, token, ttl, ipHash, req.headers.get('User-Agent'));
  await revokeExcessSessions(env.DB, userId);
  await writeAudit(env.DB, {
    id: ulid(), actorUserId: userId, action: 'auth.oauth.login', targetType: 'user',
    targetId: userId, requestId, ipHash, result: 'success',
  });

  const res = oauthRedirect('/learn', req, clearOAuthCookies(req));
  res.headers.append('Set-Cookie', serializeSessionCookie(env, token, ttl, req));
  return res;
}

export { apiError, normalizeEmail as _normalizeEmail };
