/**
 * اختبارات المراجعة الأمنية للمرحلة 1.
 * كل اختبار هنا يقابل بندًا في docs/21_SECURITY_REVIEW_PHASE1.md.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { makeHarness, signupAndGetCookie, VALID_PW, VALID_EMAIL, type Harness } from './harness';
import { b64url } from '../src/worker/lib/crypto';

const PEPPER = 'test-pepper-0123456789abcdefghijklmnop';

/** يبني تجزئة بالصيغة القديمة (password + pepper) لاختبار مسار الترقية. */
async function legacyHash(password: string, pepper: string, iterations = 20000): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password + pepper), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' }, key, 256);
  return `pbkdf2$${iterations}$${b64url(salt)}$${b64url(new Uint8Array(bits))}`;
}

let h: Harness;
beforeEach(() => { h = makeHarness(); });

describe('S-A: سياسة كلمات المرور والفشل المغلق', () => {
  it('بلا PASSWORD_PEPPER في غير بيئة الاختبار: المصادقة تُغلق (503) لا تعمل بحماية أقل', async () => {
    const env = makeHarness({ ENVIRONMENT: 'production', PASSWORD_PEPPER: '' });
    const res = await env.call('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'x@example.com', password: 'Cairo2026learn' }),
    });
    expect(res.status).toBe(503);
    expect((await env.json(res)).error.code).toBe('AUTH_UNAVAILABLE');
    env.close();
  });

  it('قراءة المحتوى العام تبقى تعمل حتى عند خطأ الإعداد (لا تعطيل كامل)', async () => {
    const env = makeHarness({ ENVIRONMENT: 'production', PASSWORD_PEPPER: '' });
    const res = await env.call('/api/content/paths');
    expect(res.status).toBe(200);
    env.close();
  });

  it('ALLOW_PUBLIC_SIGNUP=false يغلق التسجيل برسالة صريحة', async () => {
    const env = makeHarness({ ALLOW_PUBLIC_SIGNUP: 'false' });
    const res = await env.call('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'x@example.com', password: 'Cairo2026learn' }),
    });
    expect(res.status).toBe(503);
    expect((await env.json(res)).error.code).toBe('SIGNUP_DISABLED');
    env.close();
  });

  it('غياب ALLOW_PUBLIC_SIGNUP تمامًا يغلق التسجيل (فشل مغلق، لا فتح بالنسيان)', async () => {
    // سيناريو النشر الحقيقي: بيئة إنتاج بلا `[vars]` أو بمتغيّر منسي.
    // قبل الإصلاح كان الشرط `=== 'false'` ⇒ الغياب يعني تسجيلًا عامًا مفتوحًا.
    const env = makeHarness({ ENVIRONMENT: 'production', ALLOW_PUBLIC_SIGNUP: undefined });
    const res = await env.call('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'x@example.com', password: 'Cairo2026learn' }),
    });
    expect(res.status).toBe(503);
    expect((await env.json(res)).error.code).toBe('SIGNUP_DISABLED');
    // ولا يُنشأ أي مستخدم فعليًا
    const n = env.db.raw.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number };
    expect(n.n).toBe(0);
    env.close();
  });

  it('أي قيمة غير true تُغلق التسجيل (fail-closed على القيم غير المتوقعة)', async () => {
    for (const value of ['1', 'TRUE', 'yes', '', ' true']) {
      const env = makeHarness({ ALLOW_PUBLIC_SIGNUP: value });
      const res = await env.call('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email: 'x@example.com', password: 'Cairo2026learn' }),
      });
      expect(res.status, `القيمة: "${value}"`).toBe(503);
      env.close();
    }
  });

  it('ALLOW_PUBLIC_SIGNUP=true يفتح التسجيل صراحةً (المفتاح يعمل في الاتجاهين)', async () => {
    const env = makeHarness({ ALLOW_PUBLIC_SIGNUP: 'true' });
    const res = await env.call('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'x@example.com', password: 'Cairo2026learn' }),
    });
    expect(res.status).toBe(201);
    env.close();
  });

  it('كلمة المرور المخزَّنة لا تحتوي السر ولا الصيغة القديمة', async () => {
    await signupAndGetCookie(h);
    const row = h.db.raw.prepare('SELECT password_hash FROM users WHERE email_normalized = ?').get(VALID_EMAIL) as { password_hash: string };
    expect(row.password_hash).toMatch(/^pbkdf2-sha256\$20000\$/);
    expect(row.password_hash).not.toContain(PEPPER);
  });

  it('ترقية التجزئة عند تغيّر السياسة: تجزئة قديمة تعمل ثم تُرقّى أثناء الدخول', async () => {
    await signupAndGetCookie(h);
    const legacy = await legacyHash(VALID_PW, PEPPER, 20000);
    h.db.raw.prepare('UPDATE users SET password_hash = ? WHERE email_normalized = ?').run(legacy, VALID_EMAIL);

    const env2 = makeHarness({ PBKDF2_ITERATIONS: '30000' });
    // انقل نفس الصف إلى قاعدة أخرى لاختبار رفع التكرارات
    const row = h.db.raw.prepare('SELECT * FROM users WHERE email_normalized = ?').get(VALID_EMAIL) as Record<string, unknown>;
    env2.db.raw.prepare('INSERT INTO users (id, email_normalized, email_display, password_hash, role_id, status) VALUES (?,?,?,?,?,?)')
      .run(row.id, row.email_normalized, row.email_display, row.password_hash, row.role_id, 'active');
    env2.db.raw.prepare('INSERT INTO user_profiles (user_id) VALUES (?)').run(row.id as string);
    env2.db.raw.prepare('INSERT INTO user_stats (user_id) VALUES (?)').run(row.id as string);
    env2.db.raw.prepare('INSERT INTO notification_preferences (user_id) VALUES (?)').run(row.id as string);

    const res = await env2.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }) });
    expect(res.status).toBe(200);
    const after = env2.db.raw.prepare('SELECT password_hash FROM users WHERE email_normalized = ?').get(VALID_EMAIL) as { password_hash: string };
    expect(after.password_hash).toMatch(/^pbkdf2-sha256\$30000\$/);
    env2.close();
  });

  it('كلمة مرور خاطئة لا تُطلق إعادة التجزئة ولا تغيّر الهاش في القاعدة', async () => {
    await signupAndGetCookie(h);
    const legacy = await legacyHash(VALID_PW, PEPPER, 20000);
    h.db.raw.prepare('UPDATE users SET password_hash = ? WHERE email_normalized = ?').run(legacy, VALID_EMAIL);

    const res = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: 'WrongPassword2026!' }) });
    expect(res.status).toBe(401);

    const row = h.db.raw.prepare('SELECT password_hash FROM users WHERE email_normalized = ?').get(VALID_EMAIL) as { password_hash: string };
    // لا يزال بالصيغة القديمة ولم يتغير لأن التحقق فشل
    expect(row.password_hash).toBe(legacy);
  });

  it('تجزئة تالفة في القاعدة تُرجع 401 موحدًا ولا تُسقط الخادم بـ 500', async () => {
    await signupAndGetCookie(h);
    h.db.raw.prepare('UPDATE users SET password_hash = ? WHERE email_normalized = ?').run('corrupt$broken$hash$value', VALID_EMAIL);

    const res = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }) });
    expect(res.status).toBe(401);
    const body = await h.json(res);
    expect(body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('تسجيل الدخول عند غياب PASSWORD_PEPPER في الإنتاج يُغلق فورًا بـ 503 (فشل مغلق)', async () => {
    const env = makeHarness({ ENVIRONMENT: 'production', PASSWORD_PEPPER: '' });
    const res = await env.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com', password: 'ValidPassword2026!' }),
    });
    expect(res.status).toBe(503);
    expect((await env.json(res)).error.code).toBe('AUTH_UNAVAILABLE');
    env.close();
  });
});

describe('S-B: الجلسات والكوكيز وCSRF', () => {
  it('كوكي الجلسة HttpOnly + SameSite=Lax + Path=/ وليس قابلاً للقراءة من JS', async () => {
    const { res } = await signupAndGetCookie(h);
    const raw = res.headers.get('Set-Cookie')!;
    expect(raw).toContain('HttpOnly');
    expect(raw).toContain('SameSite=Lax');
    expect(raw).toContain('Path=/');
  });

  it('الجلسة تنتهي بالخمول (14 يومًا) حتى لو لم تنتهِ صلاحيتها', async () => {
    const { cookie } = await signupAndGetCookie(h);
    expect((await h.call('/api/auth/me', { cookie })).status).toBe(200);
    h.db.raw.prepare("UPDATE sessions SET last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ','now','-20 days')").run();
    expect((await h.call('/api/auth/me', { cookie })).status).toBe(401);
  });

  it('last_seen_at لا يُحدَّث أكثر من مرة كل 5 دقائق (حماية حصة D1)', async () => {
    const { cookie } = await signupAndGetCookie(h);
    const read = () => (h.db.raw.prepare('SELECT last_seen_at FROM sessions ORDER BY rowid LIMIT 1').get() as { last_seen_at: string | null }).last_seen_at;
    h.db.raw.prepare("UPDATE sessions SET last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')").run();
    const before = read();
    await h.call('/api/auth/me', { cookie });
    expect(read()).toBe(before); // حديث بالفعل ⇒ لا كتابة
  });

  it('سقف 10 جلسات نشطة لكل مستخدم', async () => {
    await signupAndGetCookie(h);
    for (let i = 0; i < 12; i++) {
      await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }) });
    }
    const active = h.db.raw.prepare('SELECT COUNT(*) AS n FROM sessions WHERE revoked_at IS NULL').get() as { n: number };
    expect(active.n).toBeLessThanOrEqual(10);
  });

  it('طلب يغيّر الحالة بجسم غير JSON يُرفض (415) — يقطع CSRF عبر HTML forms', async () => {
    const res = await h.call('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'email=a@b.com&password=Cairo2026learn',
    });
    expect(res.status).toBe(415);
    expect((await h.json(res)).error.code).toBe('UNSUPPORTED_MEDIA_TYPE');
  });

  it('Sec-Fetch-Site: cross-site يُرفض حتى بدون Origin', async () => {
    const res = await h.call('/api/me', {
      method: 'PATCH',
      headers: { 'Sec-Fetch-Site': 'cross-site' },
      body: JSON.stringify({ dailyGoalMinutes: 20 }),
    });
    expect(res.status).toBe(403);
    expect((await h.json(res)).error.code).toBe('ORIGIN_NOT_ALLOWED');
  });

  it('طلب من نفس الأصل بإعدادات المتصفح يُقبل (لا كسر للواجهة)', async () => {
    const { cookie } = await signupAndGetCookie(h);
    const res = await h.call('/api/me', {
      method: 'PATCH',
      cookie,
      headers: { Origin: 'http://localhost:5173', 'Sec-Fetch-Site': 'same-origin' },
      body: JSON.stringify({ dailyGoalMinutes: 25 }),
    });
    expect(res.status).toBe(200);
    expect((await h.json(res)).user.dailyGoalMinutes).toBe(25);
  });

  it('الخروج يُبطل الجلسة فعليًا في القاعدة', async () => {
    const { cookie } = await signupAndGetCookie(h);
    await h.call('/api/auth/logout', { method: 'POST', cookie });
    expect((await h.call('/api/auth/me', { cookie })).status).toBe(401);
  });

  it('لا يُخزَّن عنوان IP صريح في الجلسات', async () => {
    const res = await h.call('/api/auth/signup', {
      method: 'POST',
      headers: { 'CF-Connecting-IP': '203.0.113.77' },
      body: JSON.stringify({ email: 'ip@example.com', password: 'Cairo2026learn' }),
    });
    expect(res.status).toBe(201);
    const row = h.db.raw.prepare('SELECT ip_hash FROM sessions').get() as { ip_hash: string };
    expect(row.ip_hash).not.toContain('203.0.113.77');
    expect(row.ip_hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('X-Forwarded-For لا يُستَخدم في الإنتاج (قابل للتزييف)', async () => {
    const prod = makeHarness({ ENVIRONMENT: 'production' });
    // نفس الحساب مرتين بعنوانين مختلفين: يجب أن تتطابق البصمة لأن XFF مُهمَل
    const a = await prod.call('/api/auth/signup', {
      method: 'POST', headers: { 'X-Forwarded-For': '1.2.3.4' },
      body: JSON.stringify({ email: 'xff@example.com', password: 'Cairo2026learn' }),
    });
    expect(a.status).toBe(201);
    const rowA = prod.db.raw.prepare('SELECT ip_hash FROM sessions').get() as { ip_hash: string };
    const b = await prod.call('/api/auth/signup', {
      method: 'POST', headers: { 'X-Forwarded-For': '9.9.9.9' },
      body: JSON.stringify({ email: 'xff2@example.com', password: 'Cairo2026learn' }),
    });
    expect(b.status).toBe(201);
    const rows = prod.db.raw.prepare('SELECT ip_hash FROM sessions').all() as { ip_hash: string }[];
    expect(new Set(rows.map(r => r.ip_hash)).size).toBe(1);
    void rowA;
    prod.close();
  });
});

describe('S-C: كشف الحسابات وتحديد المحاولات', () => {
  it('حساب موقوف يرجع نفس الرد العام (لا 403 يكشف الوجود)', async () => {
    await signupAndGetCookie(h);
    h.db.raw.prepare("UPDATE users SET status = 'suspended' WHERE email_normalized = ?").run(VALID_EMAIL);
    const res = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }) });
    const unknown = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'ghost@example.com', password: VALID_PW }) });
    expect(res.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect((await h.json(res)).error.code).toBe((await h.json(unknown)).error.code);
  });

  it('حساب مقفل يرجع RATE_LIMITED — نفس رمز حد المعدل (لا تمييز عن بريد غير مسجل)', async () => {
    await signupAndGetCookie(h);
    h.db.raw.prepare("UPDATE users SET locked_until = strftime('%Y-%m-%dT%H:%M:%fZ','now','+15 minutes') WHERE email_normalized = ?").run(VALID_EMAIL);
    const res = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }) });
    expect(res.status).toBe(429);
    expect((await h.json(res)).error.code).toBe('RATE_LIMITED');
  });

  it('خمس محاولات خاطئة تقفل الحساب في القاعدة', async () => {
    await signupAndGetCookie(h);
    for (let i = 0; i < 5; i++) {
      await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: 'WrongPass2026x' }) });
    }
    const row = h.db.raw.prepare('SELECT failed_login_count, locked_until FROM users WHERE email_normalized = ?').get(VALID_EMAIL) as { failed_login_count: number; locked_until: string | null };
    expect(row.failed_login_count).toBeGreaterThanOrEqual(5);
    expect(row.locked_until).not.toBeNull();
  });
});

describe('S-D: الصلاحيات والرؤوس والتسريب', () => {
  it('الصلاحية تُفحص مركزيًا: المتعلم يُمنع 403 على مسار محمي بصلاحية', async () => {
    const { cookie } = await signupAndGetCookie(h);
    const res = await h.call('/api/admin/audit', { cookie });
    expect(res.status).toBe(403);
  });

  it('بلا جلسة على مسار محمي ⇒ 401 قبل أي فحص صلاحية', async () => {
    const res = await h.call('/api/admin/audit');
    expect(res.status).toBe(401);
  });

  it('الرؤوس الأمنية موجودة على كل استجابة API', async () => {
    const res = await h.call('/api/health');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    expect(res.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin');
    expect(res.headers.get('Vary')).toContain('Origin');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    // على http لا يُرسَل HSTS
    expect(res.headers.get('Strict-Transport-Security')).toBeNull();
  });

  it('HSTS يُرسَل عندما يكون الأصل https', async () => {
    const env = makeHarness({ APP_ORIGIN: 'https://app.example.com' });
    const res = await env.call('/api/health');
    expect(res.headers.get('Strict-Transport-Security')).toContain('max-age');
    env.close();
  });

  it('الاستجابات العامة للمحتوى قابلة للكاش، وبيانات المستخدم لا', async () => {
    const { cookie } = await signupAndGetCookie(h);
    expect((await h.call('/api/content/paths')).headers.get('Cache-Control')).toContain('public');
    expect((await h.call('/api/auth/me', { cookie })).headers.get('Cache-Control')).toBe('no-store');
  });

  it('استجابة /api/health لا تسرّب إعدادات أمنية', async () => {
    const text = JSON.stringify(await h.json(await h.call('/api/health')));
    expect(text).not.toMatch(/pepper|iterations|password/i);
  });

  it('الدخول الناجح والإنشاء يُسجَّلان في سجل التدقيق', async () => {
    await signupAndGetCookie(h);
    await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }) });
    const actions = (h.db.raw.prepare('SELECT action FROM admin_audit_logs ORDER BY created_at').all() as { action: string }[]).map(r => r.action);
    expect(actions).toContain('auth.signup');
    expect(actions).toContain('auth.login');
  });

  it('رسالة الخطأ لا تحتوي تفاصيل داخلية عند استثناء غير متوقع', async () => {
    // نكسر القاعدة عمدًا لجعل الاستعلام يفشل
    h.db.raw.exec('ALTER TABLE admin_settings RENAME TO admin_settings_x');
    const res = await h.call('/api/settings/public');
    expect(res.status).toBe(500);
    const body = await h.json(res);
    expect(body.error.code).toBe('INTERNAL_ERROR');
    expect(JSON.stringify(body)).not.toMatch(/sqlite|no such table|Error:/i);
    expect(res.headers.get('X-Request-Id')).toMatch(/^req_/);
  });
});
