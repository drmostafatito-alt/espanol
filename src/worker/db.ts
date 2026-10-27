/* طبقة الوصول إلى D1 — استعلامات مُعدّة فقط (لا تجميع سلاسل SQL) */
import type { D1Database, Env, SessionUser, UserRow } from './types';
import { sha256Hex } from './lib/crypto';

export interface UserWithRole extends UserRow {
  role_code: SessionUser['role'];
}

const USER_SELECT = `
  SELECT u.id, u.email_normalized, u.email_display, u.password_hash, u.role_id,
         r.code AS role_code, u.status, u.failed_login_count, u.locked_until, u.created_at
  FROM users u JOIN roles r ON r.id = u.role_id`;

export async function findUserByEmail(db: D1Database, emailNormalized: string): Promise<UserWithRole | null> {
  return await db.prepare(`${USER_SELECT} WHERE u.email_normalized = ?`).bind(emailNormalized).first<UserWithRole>();
}

export async function findUserById(db: D1Database, id: string): Promise<UserWithRole | null> {
  return await db.prepare(`${USER_SELECT} WHERE u.id = ?`).bind(id).first<UserWithRole>();
}

export async function emailExists(db: D1Database, emailNormalized: string): Promise<boolean> {
  const row = await db.prepare('SELECT 1 AS ok FROM users WHERE email_normalized = ?').bind(emailNormalized).first();
  return !!row;
}

export async function createUser(
  db: D1Database,
  u: { id: string; emailNormalized: string; emailDisplay: string; passwordHash: string; displayName?: string | null },
): Promise<void> {
  const roleRow = await db.prepare('SELECT id FROM roles WHERE code = ?').bind('learner').first<{ id: string }>();
  if (!roleRow) throw new Error('ROLE_LEARNER_MISSING'); // خطأ إعداد لا خطأ مستخدم
  await db.batch([
    db
      .prepare(
        `INSERT INTO users (id, email_normalized, email_display, password_hash, role_id, status)
         VALUES (?, ?, ?, ?, ?, 'active')`,
      )
      .bind(u.id, u.emailNormalized, u.emailDisplay, u.passwordHash, roleRow.id),
    db.prepare('INSERT INTO user_profiles (user_id, display_name) VALUES (?, ?)').bind(u.id, u.displayName ?? null),
    db.prepare('INSERT INTO user_stats (user_id) VALUES (?)').bind(u.id),
    db.prepare('INSERT INTO notification_preferences (user_id) VALUES (?)').bind(u.id),
  ]);
}

export async function registerFailedLogin(db: D1Database, userId: string): Promise<void> {
  // القفل ينتهي فعلًا بانتهاء مدته: فشل واحد بعد انقضاء 15 دقيقة لا يعيد
  // القفل فورًا — كان العدّاد لا يُصفَّر أبدًا إلا بدخول ناجح، فيبقى الحساب
  // قابلًا للقفل الدائم بمحاولة خاطئة واحدة كل ربع ساعة.
  await db
    .prepare(
      `UPDATE users
       SET failed_login_count = CASE
             WHEN locked_until IS NOT NULL AND locked_until <= strftime('%Y-%m-%dT%H:%M:%fZ','now') THEN 1
             ELSE failed_login_count + 1 END,
           locked_until = CASE
             WHEN locked_until IS NOT NULL AND locked_until <= strftime('%Y-%m-%dT%H:%M:%fZ','now') THEN NULL
             WHEN failed_login_count + 1 >= 5 THEN strftime('%Y-%m-%dT%H:%M:%fZ','now','+15 minutes')
             ELSE locked_until END
       WHERE id = ?`,
    )
    .bind(userId)
    .run();
}

export async function resetFailedLogin(db: D1Database, userId: string): Promise<void> {
  await db
    .prepare(`UPDATE users SET failed_login_count = 0, locked_until = NULL,
              last_login_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`)
    .bind(userId)
    .run();
}

/* ---------- الجلسات ---------- */

export async function createSession(
  db: D1Database,
  userId: string,
  token: string,
  ttlDays: number,
  ipHash: string | null,
  userAgent: string | null,
): Promise<void> {
  const id = await sha256Hex(token); // نخزّن hash فقط
  await db
    .prepare(
      `INSERT INTO sessions (id, user_id, expires_at, ip_hash, user_agent)
       VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now', ?), ?, ?)`,
    )
    .bind(id, userId, `+${ttlDays} days`, ipHash, userAgent?.slice(0, 200) ?? null)
    .run();
}

/**
 * جلسة صالحة = غير ملغاة + لم تنتهِ مدة صلاحيتها + نشطة خلال SESSION_IDLE_DAYS.
 * فحص الخمول يقلّص نافذة أي كوكي مسروق لا يُستخدم بينما صاحبه غائب.
 */
export const SESSION_IDLE_DAYS = 14;

export async function findSessionUser(env: Env, token: string): Promise<SessionUser | null> {
  const id = await sha256Hex(token);
  const row = await env.DB.prepare(
    `SELECT u.id, u.email_display, r.code AS role_code, p.display_name, p.explanation_style,
            p.audio_variant, p.daily_goal_minutes
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     JOIN roles r ON r.id = u.role_id
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE s.id = ? AND s.revoked_at IS NULL AND s.expires_at > strftime('%Y-%m-%dT%H:%M:%fZ','now')
       AND (s.last_seen_at IS NULL OR s.last_seen_at > strftime('%Y-%m-%dT%H:%M:%fZ','now', ?))
       AND u.status = 'active'`,
  )
    .bind(id, `-${SESSION_IDLE_DAYS} days`)
    .first<{
      id: string;
      email_display: string;
      role_code: SessionUser['role'];
      display_name: string | null;
      explanation_style: SessionUser['explanationStyle'] | null;
      audio_variant: SessionUser['audioVariant'] | null;
      daily_goal_minutes: number | null;
    }>();
  if (!row) return null;

  const perms = await env.DB.prepare(
    `SELECT rp.permission FROM role_permissions rp JOIN roles r ON r.id = rp.role_id WHERE r.code = ?`,
  )
    .bind(row.role_code)
    .all<{ permission: string }>();

  return {
    id: row.id,
    email: row.email_display,
    displayName: row.display_name,
    role: row.role_code,
    explanationStyle: row.explanation_style ?? 'fusha_eg',
    audioVariant: row.audio_variant ?? 'es-ES',
    dailyGoalMinutes: row.daily_goal_minutes ?? 10,
    permissions: perms.results.map(p => p.permission),
  };
}

export async function revokeSession(env: Env, token: string): Promise<void> {
  const id = await sha256Hex(token);
  await env.DB.prepare(`UPDATE sessions SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`).bind(id).run();
}

/**
 * تحديث آخر نشاط — على الأكثر مرة كل 5 دقائق لكل جلسة.
 * السبب: الكتابة على كل طلب تستهلك حصة D1 المجانية (100 ألف صف/يوم) بلا فائدة أمنية،
 * لأن دقة "الخمول" لا تحتاج أكثر من ذلك.
 */
export async function touchSession(env: Env, token: string): Promise<void> {
  const id = await sha256Hex(token);
  await env.DB.prepare(
    `UPDATE sessions SET last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
     WHERE id = ? AND (last_seen_at IS NULL OR last_seen_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-5 minutes'))`,
  ).bind(id).run();
}

/** يلغي كل جلسات المستخدم عدا الجلسة الحالية — لطرد جلسة مسروقة بعد تغيير كلمة المرور. */
export async function revokeOtherSessions(env: Env, userId: string, currentToken: string): Promise<number> {
  const keepId = await sha256Hex(currentToken);
  const res = await env.DB.prepare(
    `UPDATE sessions SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
     WHERE user_id = ? AND revoked_at IS NULL AND id <> ?`,
  )
    .bind(userId, keepId)
    .run();
  return Number(res.meta?.changes ?? 0);
}

/** سقف الجلسات النشطة لكل مستخدم: يمنع تراكم الرموز المسروقة إلى ما لا نهاية. */
export const MAX_SESSIONS_PER_USER = 10;

export async function revokeExcessSessions(db: D1Database, userId: string): Promise<void> {
  await db
    .prepare(
      `UPDATE sessions SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE user_id = ? AND revoked_at IS NULL
         AND id NOT IN (
           SELECT id FROM sessions WHERE user_id = ? AND revoked_at IS NULL
           ORDER BY created_at DESC LIMIT ?
         )`,
    )
    .bind(userId, userId, MAX_SESSIONS_PER_USER)
    .run();
}

/** تنظيف الجلسات المنتهية — يُستدعى باحتمال منخفض عند الدخول بدل cron مدفوع. */
export async function pruneExpiredSessions(db: D1Database): Promise<void> {
  await db
    .prepare(`DELETE FROM sessions WHERE expires_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-7 days')`)
    .run();
}

/** ترقية تجزئة كلمة المرور (مثال: رفع عدد التكرارات) بعد دخول ناجح. */
export async function updatePasswordHash(db: D1Database, userId: string, passwordHash: string): Promise<void> {
  await db
    .prepare(`UPDATE users SET password_hash = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`)
    .bind(passwordHash, userId)
    .run();
}

/* ---------- الإعدادات العامة ---------- */

export async function getPublicSettings(db: D1Database): Promise<Record<string, unknown>> {
  const rows = await db.prepare('SELECT key, value_json FROM admin_settings WHERE is_public = 1').all<{ key: string; value_json: string }>();
  const out: Record<string, unknown> = {};
  for (const r of rows.results) {
    try {
      out[r.key] = JSON.parse(r.value_json);
    } catch {
      out[r.key] = r.value_json;
    }
  }
  return out;
}

/* ---------- التدقيق ---------- */

export async function writeAudit(
  db: D1Database,
  entry: {
    id: string;
    actorUserId: string | null;
    action: string;
    targetType?: string;
    targetId?: string;
    requestId?: string;
    ipHash?: string;
    result?: 'success' | 'denied' | 'error';
    after?: unknown;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO admin_audit_logs (id, actor_user_id, action, target_type, target_id, after_json, request_id, ip_hash, result)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      entry.id,
      entry.actorUserId,
      entry.action,
      entry.targetType ?? null,
      entry.targetId ?? null,
      entry.after ? JSON.stringify(entry.after) : null,
      entry.requestId ?? null,
      entry.ipHash ?? null,
      entry.result ?? 'success',
    )
    .run();
}
