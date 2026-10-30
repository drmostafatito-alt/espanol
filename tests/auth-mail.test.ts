/**
 * اختبارات البريد الأمني: التحقق من البريد واستعادة كلمة المرور.
 *
 * تُشغّل worker الحقيقي على SQLite في الذاكرة، وتقرأ الرمز من **صندوق التطوير**
 * (لأن قاعدة البيانات تحفظ sha256 فقط — وهذا نفسه أحد ما نُثبته هنا).
 *
 * ما تُثبته هذه الاختبارات فعليًا:
 *   1) الرمز يُخزَّن مجزّأً (sha256) ولا يظهر نصًا في قاعدة البيانات ولا في السجل.
 *   2) الرمز أحادي الاستخدام: المحاولة الثانية تُرفض، والرمز يُعلَّم مستهلكًا.
 *   3) طلب الاستعادة يعطي نفس الرد للحساب الموجود وغير الموجود (لا كشف حسابات).
 *   4) الإعداد غير المضبوط للبريد **لا** يعطّل الطلب ولا يدّعي إرسالًا (mailSent=false).
 *   5) انتهاء الصلاحية مرفوض (تحقق 24 ساعة، استعادة 30 دقيقة).
 *   6) الاستعادة تُبطل كل الجلسات القائمة، ولا تسمح بالدخول بالكلمة القديمة.
 *   7) حدود المعدل مفعّلة على طلب الاستعادة والتحقق.
 *   8) صندوق التطوير محجوب في الإنتاج.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { makeHarness, type Harness } from './harness';
import { clearOutbox } from '../src/worker/lib/mailer';

const DEV_MAIL = { DEBUG_MAIL_OUTBOX: 'true' } as const;

/** يقرأ أحدث رابط من الصندوق التطويري ويستخرج الرمز. */
async function latestToken(h: Harness, kind: 'verify_email' | 'reset_password'): Promise<string> {
  const res = await h.call('/api/dev/mail-outbox');
  expect(res.status).toBe(200);
  const body = (await res.json()) as { items: { kind: string; text: string }[] };
  const item = [...body.items].reverse().find((i) => i.kind === kind);
  expect(item, `لا رسالة ${kind} في الصندوق`).toBeTruthy();
  const match = /token=([A-Za-z0-9_-]+)/.exec(item!.text);
  expect(match, 'لا رمز في نص الرسالة').toBeTruthy();
  return match![1]!;
}

async function signupUser(h: Harness, email: string, password = 'Cairo2026learn') {
  const res = await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
  expect(res.status).toBe(201);
  return h.cookieOf(res)!;
}

describe('البريد — التحقق من العنوان', () => {
  beforeEach(() => clearOutbox());

  it('يتطلب جلسة، ويصدر رمزًا مجزّأً بلا ادعاء إرسال عند غياب مزوّد', async () => {
    const h = makeHarness(DEV_MAIL);
    const anon = await h.call('/api/auth/verify-email/request', { method: 'POST', body: '{}' });
    expect(anon.status).toBe(401);

    const cookie = await signupUser(h, 'verify@example.com');
    const res = await h.call('/api/auth/verify-email/request', { method: 'POST', cookie, body: '{}' });
    expect(res.status).toBe(200);
    const body = (await h.json(res)) as { ok: boolean; mailSent: boolean };
    expect(body.ok).toBe(true);
    // لا مفتاح Resend في الاختبار: لا ندّعي الإرسال
    expect(body.mailSent).toBe(false);

    const token = await latestToken(h, 'verify_email');
    const rows = h.db.raw
      .prepare('SELECT token_hash FROM verification_tokens WHERE user_id = (SELECT id FROM users WHERE email_normalized = ?)')
      .all('verify@example.com') as { token_hash: string }[];
    expect(rows).toHaveLength(1);
    // الرمز النصي لا يُخزَّن مطلقًا
    expect(rows[0]!.token_hash).not.toBe(token);
    expect(rows[0]!.token_hash).toMatch(/^[0-9a-f]{64}$/);
    h.close();
  });

  it('التأكيد يعمل مرة واحدة فقط ويُعلّم البريد', async () => {
    const h = makeHarness(DEV_MAIL);
    const cookie = await signupUser(h, 'once@example.com');
    await h.call('/api/auth/verify-email/request', { method: 'POST', cookie, body: '{}' });
    const token = await latestToken(h, 'verify_email');

    const ok = await h.call('/api/auth/verify-email/confirm', { method: 'POST', body: JSON.stringify({ token }) });
    expect(ok.status).toBe(200);
    const row = h.db.raw.prepare('SELECT email_verified_at FROM users WHERE email_normalized = ?').get('once@example.com') as {
      email_verified_at: string | null;
    };
    expect(row.email_verified_at).toBeTruthy();

    const again = await h.call('/api/auth/verify-email/confirm', { method: 'POST', body: JSON.stringify({ token }) });
    expect(again.status).toBe(400);
    expect(((await h.json(again)) as { error: { code: string } }).error.code).toBe('INVALID_TOKEN');
    h.close();
  });

  it('الرمز المنتهي مرفوض، وإعادة الطلب تُبطل الرمز السابق', async () => {
    const h = makeHarness(DEV_MAIL);
    const cookie = await signupUser(h, 'expire@example.com');
    const userId = (h.db.raw.prepare('SELECT id FROM users WHERE email_normalized = ?').get('expire@example.com') as { id: string }).id;

    await h.call('/api/auth/verify-email/request', { method: 'POST', cookie, body: '{}' });
    const first = await latestToken(h, 'verify_email');
    h.db.raw.prepare('UPDATE verification_tokens SET expires_at = ? WHERE user_id = ?').run('2020-01-01T00:00:00.000Z', userId);
    const expired = await h.call('/api/auth/verify-email/confirm', { method: 'POST', body: JSON.stringify({ token: first }) });
    expect(expired.status).toBe(400);

    // رمز جديد، ثم طلب ثالث يُبطل الثاني
    await h.call('/api/auth/verify-email/request', { method: 'POST', cookie, body: '{}' });
    const second = await latestToken(h, 'verify_email');
    await h.call('/api/auth/verify-email/request', { method: 'POST', cookie, body: '{}' });
    const third = await latestToken(h, 'verify_email');
    const stale = await h.call('/api/auth/verify-email/confirm', { method: 'POST', body: JSON.stringify({ token: second }) });
    expect(stale.status).toBe(400);
    const fresh = await h.call('/api/auth/verify-email/confirm', { method: 'POST', body: JSON.stringify({ token: third }) });
    expect(fresh.status).toBe(200);
    h.close();
  });

  it('حد المعدل: أربع طلبات في الساعة للمستخدم الواحد', async () => {
    const h = makeHarness(DEV_MAIL);
    const cookie = await signupUser(h, 'limit@example.com');
    const codes: number[] = [];
    for (let i = 0; i < 4; i += 1) {
      const res = await h.call('/api/auth/verify-email/request', { method: 'POST', cookie, body: '{}' });
      codes.push(res.status);
    }
    expect(codes.slice(0, 3)).toEqual([200, 200, 200]);
    expect(codes[3]).toBe(429);
    h.close();
  });
});

describe('البريد — استعادة كلمة المرور', () => {
  beforeEach(() => clearOutbox());

  it('الرد متطابق للحساب الموجود وغير الموجود (لا كشف حسابات)', async () => {
    const h = makeHarness(DEV_MAIL);
    await signupUser(h, 'exists@example.com');
    const known = await h.call('/api/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email: 'exists@example.com' }) });
    const unknown = await h.call('/api/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email: 'ghost@example.com' }) });
    const bad = await h.call('/api/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email: 'not-an-email' }) });
    expect(known.status).toBe(200);
    expect(unknown.status).toBe(200);
    expect(bad.status).toBe(200);
    expect(await h.json(known)).toEqual({ ok: true });
    expect(await h.json(unknown)).toEqual({ ok: true });
    expect(await h.json(bad)).toEqual({ ok: true });
    // رمز واحد فقط أُصدر: للحساب الحقيقي وحده
    const count = h.db.raw.prepare('SELECT COUNT(*) AS n FROM password_reset_tokens').get() as { n: number };
    expect(count.n).toBe(1);
    h.close();
  });

  it('الاستعادة تُغيّر كلمة المرور وتُبطل الجلسات والرمز', async () => {
    const h = makeHarness(DEV_MAIL);
    const cookie = await signupUser(h, 'reset@example.com');
    // جلسة ثانية على جهاز آخر
    const second = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'reset@example.com', password: 'Cairo2026learn' }) });
    expect(second.status).toBe(200);

    await h.call('/api/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email: 'reset@example.com' }) });
    const token = await latestToken(h, 'reset_password');

    const bad = await h.call('/api/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, derivedKey: 'short' }) });
    expect(bad.status).toBe(400);
    expect(((await h.json(bad)) as { error: { code: string } }).error.code).toBe('CLIENT_KDF_REQUIRED');

    const res = await h.call('/api/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, derivedKey: 'K'.repeat(43) }) });
    expect(res.status).toBe(200);

    // كل الجلسات القديمة سقطت
    const me = await h.call('/api/auth/me', { cookie });
    expect(me.status).toBe(401);
    const live = h.db.raw.prepare('SELECT COUNT(*) AS n FROM sessions WHERE revoked_at IS NULL').get() as { n: number };
    expect(live.n).toBe(0);

    // الرمز لا يُعاد استعماله
    const reuse = await h.call('/api/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, derivedKey: 'J'.repeat(43) }) });
    expect(reuse.status).toBe(400);

    // الكلمة القديمة لم تعد تعمل بعد إعادة التعيين
    const stale = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'reset@example.com', password: 'Cairo2026learn' }) });
    expect(stale.status).toBe(401);
    h.close();
  });

  it('الرمز المنتهي مرفوض', async () => {
    const h = makeHarness(DEV_MAIL);
    await signupUser(h, 'expired@example.com');
    await h.call('/api/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email: 'expired@example.com' }) });
    const token = await latestToken(h, 'reset_password');
    h.db.raw.prepare('UPDATE password_reset_tokens SET expires_at = ?').run('2020-01-01T00:00:00.000Z');
    const res = await h.call('/api/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, derivedKey: 'K'.repeat(43) }) });
    expect(res.status).toBe(400);
    h.close();
  });

  it('حد المعدل على الطلب: ست محاولات من نفس العنوان تُرفض السادسة', async () => {
    const h = makeHarness(DEV_MAIL);
    const codes: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      const res = await h.call('/api/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email: `nobody${i}@example.com` }) });
      codes.push(res.status);
    }
    expect(codes.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(codes[5]).toBe(429);
    h.close();
  });

  it('صندوق البريد التطويري محجوب في الإنتاج', async () => {
    const h = makeHarness({ ENVIRONMENT: 'production', DEBUG_MAIL_OUTBOX: 'true' });
    const res = await h.call('/api/dev/mail-outbox');
    expect(res.status).toBe(404);
    h.close();
  });

  it('لا كلمة مرور ولا رمز خام في سجل التدقيق، والعنوان مجزّأ', async () => {
    const h = makeHarness(DEV_MAIL);
    await signupUser(h, 'audit@example.com');
    await h.call('/api/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email: 'audit@example.com' }) });
    const token = await latestToken(h, 'reset_password');
    await h.call('/api/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, derivedKey: 'K'.repeat(43) }) });

    const rows = h.db.raw
      .prepare("SELECT action, after_json, ip_hash, request_id FROM admin_audit_logs WHERE action LIKE 'auth.%'")
      .all() as { action: string; after_json: string | null; ip_hash: string | null; request_id: string }[];
    expect(rows.some((r) => r.action === 'auth.password.reset')).toBe(true);
    expect(rows.some((r) => r.action === 'auth.password.reset_request')).toBe(true);
    for (const row of rows) {
      const flat = JSON.stringify(row);
      expect(flat).not.toContain(token);
      expect(flat).not.toContain('Cairo2026learn');
      expect(flat).not.toContain('K'.repeat(43));
      // العنوان بصمة HMAC (64 hex) لا عنوان IP صريح
      if (row.ip_hash) expect(row.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    }
    h.close();
  });
});
