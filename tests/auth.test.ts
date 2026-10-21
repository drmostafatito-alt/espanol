import { describe, it, expect, afterEach } from 'vitest';
import { makeHarness, signupAndGetCookie, VALID_PW, VALID_EMAIL, type Harness } from './harness';

let h: Harness;
afterEach(() => h?.close());

describe('المصادقة — T1/T2/S1/S5/S9/S10', () => {
  it('T1: إنشاء حساب يعيد 201 وجلسة وكوكي HttpOnly، والدور learner', async () => {
    h = makeHarness();
    const { res, cookie } = await signupAndGetCookie(h);
    expect(res.status).toBe(201);
    const body = await h.json(res);
    expect(body.user.role).toBe('learner');
    expect(body.user.email).toBe(VALID_EMAIL);
    expect(body.user.permissions).toContain('learn.read');
    expect(body.user.permissions).not.toContain('audit.read');

    const setCookie = res.headers.get('Set-Cookie')!;
    expect(setCookie).toMatch(/HttpOnly/);
    expect(setCookie).toMatch(/SameSite=Lax/);
    expect(setCookie.startsWith('ses=')).toBe(true);
    expect(cookie).toBeTruthy();
  });

  it('T1b: كلمة المرور تُخزَّن مجزّأة (PBKDF2) وليست نصًا صريحًا', async () => {
    h = makeHarness();
    await signupAndGetCookie(h);
    const row = h.db.raw.prepare('SELECT password_hash FROM users WHERE email_normalized = ?').get(VALID_EMAIL) as { password_hash: string };
    expect(row.password_hash).not.toContain(VALID_PW);
    expect(row.password_hash.startsWith('pbkdf2-sha256$')).toBe(true);
    const [alg, iters, salt, hash] = row.password_hash.split('$');
    expect(alg).toBe('pbkdf2-sha256');
    expect(Number(iters)).toBe(20000);
    expect(salt!.length).toBeGreaterThan(10);
    expect(hash!.length).toBeGreaterThan(30);
    // الـpepper سر خارجي: لا يُخزَّن ولا يُشتق منه شيء في القاعدة
    expect(row.password_hash).not.toContain('test-pepper');
  });

  it('T1c: توكن الجلسة يُخزَّن كـhash فقط (لا التوكن نفسه)', async () => {
    h = makeHarness();
    const { cookie } = await signupAndGetCookie(h);
    const token = cookie!.split('=')[1]!;
    const rows = h.db.raw.prepare('SELECT id FROM sessions').all() as { id: string }[];
    expect(rows.length).toBe(1);
    expect(rows[0]!.id).not.toBe(token);
    expect(rows[0]!.id).toMatch(/^[0-9a-f]{64}$/);
  });

  it('T1d: بريد مكرر يُرفض برسالة لا تؤكد التسجيل', async () => {
    h = makeHarness();
    await signupAndGetCookie(h);
    const res = await h.call('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: VALID_EMAIL.toUpperCase(), password: 'Another2026pass' }),
    });
    expect(res.status).toBe(409);
    const body = await h.json(res);
    expect(body.error.code).toBe('SIGNUP_UNAVAILABLE');
    expect(JSON.stringify(body)).not.toMatch(/already|موجود|مسجل/);
  });

  it('T1e: كلمة مرور ضعيفة تُرفض مع أسباب', async () => {
    h = makeHarness();
    const res = await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email: 'x@y.com', password: 'short' }) });
    expect(res.status).toBe(400);
    const body = await h.json(res);
    expect(body.error.code).toBe('WEAK_PASSWORD');
    expect(body.error.problems.length).toBeGreaterThan(0);
  });

  it('T2: دخول صحيح ثم /me ثم خروج يُبطل الجلسة', async () => {
    h = makeHarness();
    await signupAndGetCookie(h);

    const login = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }) });
    expect(login.status).toBe(200);
    const cookie = h.cookieOf(login)!;

    const me = await h.call('/api/auth/me', { cookie });
    expect(me.status).toBe(200);
    expect((await h.json(me)).user.email).toBe(VALID_EMAIL);

    const out = await h.call('/api/auth/logout', { method: 'POST', cookie });
    expect(out.status).toBe(200);

    const me2 = await h.call('/api/auth/me', { cookie });
    expect(me2.status).toBe(401);
  });

  it('T2b: كلمة مرور خاطئة → 401 برسالة عامة (لا كشف وجود البريد)', async () => {
    h = makeHarness();
    await signupAndGetCookie(h);
    const wrong = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: 'WrongPass123' }) });
    const unknown = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'nobody@example.com', password: 'WrongPass123' }) });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    const a = await h.json(wrong);
    const b = await h.json(unknown);
    expect(a.error.code).toBe(b.error.code);
    expect(a.error.message).toBe(b.error.message);
  });

  it('S1: لا يمكن قراءة بيانات مستخدم آخر — لا يوجد أي مسار يقبل userId من الطلب', async () => {
    h = makeHarness();
    const { cookie } = await signupAndGetCookie(h);
    const res = await h.call('/api/auth/me?userId=someone-else', { cookie });
    const body = await h.json(res);
    expect(body.user.email).toBe(VALID_EMAIL); // يُهمل أي مُدخل خارجي
  });

  it('S5: المتعلم لا يصل إلى /api/admin/audit (403)', async () => {
    h = makeHarness();
    const { cookie } = await signupAndGetCookie(h);
    const res = await h.call('/api/admin/audit', { cookie });
    expect(res.status).toBe(403);
    expect((await h.json(res)).error.code).toBe('FORBIDDEN');
  });

  it('S5b: دور admin يصل بعد منح الصلاحية في القاعدة', async () => {
    h = makeHarness();
    const { cookie } = await signupAndGetCookie(h);
    h.db.raw.prepare("UPDATE users SET role_id = (SELECT id FROM roles WHERE code='admin') WHERE email_normalized = ?").run(VALID_EMAIL);
    const res = await h.call('/api/admin/audit', { cookie });
    expect(res.status).toBe(200);
    expect(Array.isArray((await h.json(res)).items)).toBe(true);
  });

  it('S10: طلب من أصل مختلف يُرفض (CSRF)', async () => {
    h = makeHarness();
    const res = await h.call('/api/auth/login', {
      method: 'POST',
      headers: { Origin: 'https://evil.example', 'Sec-Fetch-Site': 'cross-site' },
      body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }),
    });
    expect(res.status).toBe(403);
    expect((await h.json(res)).error.code).toBe('ORIGIN_NOT_ALLOWED');
  });

  it('S9: حد المعدل يمنع المحاولات المتكررة (429) دون كشف الحالة', async () => {
    h = makeHarness();
    await signupAndGetCookie(h);
    let last: Response | null = null;
    for (let i = 0; i < 12; i++) {
      last = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: VALID_EMAIL, password: 'WrongPass123' }) });
    }
    expect(last!.status).toBe(429);
    expect((await h.json(last!)).error.code).toBe('RATE_LIMITED');
  });

  it('S7: محاولة حقن SQL في البريد لا تسبب 500 ولا تسريب بنية', async () => {
    h = makeHarness();
    const res = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: "' OR 1=1 --", password: 'x' }),
    });
    expect(res.status).toBe(400);
    const text = JSON.stringify(await h.json(res));
    expect(text).not.toMatch(/sqlite|SQL|syntax/i);
  });

  it('S6: حقل role في جسم الطلب لا يغيّر الدور', async () => {
    h = makeHarness();
    const res = await h.call('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'r@example.com', password: VALID_PW, role: 'super_admin', role_id: 'role_super' }),
    });
    expect(res.status).toBe(201);
    expect((await h.json(res)).user.role).toBe('learner');
  });

  it('حدود الإدخال: جسم كبير يُرفض بـ413', async () => {
    h = makeHarness();
    const big = 'x'.repeat(70 * 1024);
    const res = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'a@b.com', password: big }) });
    expect(res.status).toBe(413);
  });

  it('تحديث الملف الشخصي يحفظ أسلوب الشرح والهدف اليومي', async () => {
    h = makeHarness();
    const { cookie } = await signupAndGetCookie(h);
    const res = await h.call('/api/me', {
      method: 'PATCH',
      cookie,
      body: JSON.stringify({ explanationStyle: 'eg', dailyGoalMinutes: 15, displayName: 'سارة م.' }),
    });
    expect(res.status).toBe(200);
    const body = await h.json(res);
    expect(body.user.explanationStyle).toBe('eg');
    expect(body.user.dailyGoalMinutes).toBe(15);
    expect(body.user.displayName).toBe('سارة م.');
  });

  it('الإعدادات العامة تُقرأ من القاعدة وتُخزَّن مؤقتًا', async () => {
    h = makeHarness();
    const res = await h.call('/api/settings/public');
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('public');
    const { settings } = await h.json(res);
    expect(settings['branding.platform_name']).toBe('Español بالعربي');
  });

  it('المحتوى غير المنشور لا يُقدَّم للعامة (404) ويُتاح للمعاينة بصلاحية', async () => {
    h = makeHarness();
    h.db.raw
      .prepare(
        `INSERT INTO programs (id, slug, title_ar, kind, status) VALUES ('p1','main-track','المسار الأساسي','main','published')`,
      )
      .run();
    h.db.raw
      .prepare(`INSERT INTO units (id, program_id, slug, title_ar, level_code, status) VALUES ('u1','p1','prea1-u4','أول جملة','PREA1','published')`)
      .run();
    h.db.raw
      .prepare(`INSERT INTO lessons (id, unit_id, slug, title_ar, level_code, objective_ar, status, current_version_id) VALUES ('l1','u1','prea1-hola','درس','PREA1','هدف','draft',NULL)`)
      .run();
    h.db.raw
      .prepare(`INSERT INTO lesson_versions (id, lesson_id, version_no, status, content_json, content_hash) VALUES ('lv1','l1',1,'draft','{"lesson":{"slug":"prea1-hola"}}','hash1')`)
      .run();
    h.db.raw.prepare(`UPDATE lessons SET current_version_id='lv1' WHERE id='l1'`).run();

    const { cookie } = await signupAndGetCookie(h);
    const anon = await h.call('/api/content/lessons/prea1-hola');
    expect(anon.status).toBe(404);

    // المتعلم لا يملك content.read → يظل 404
    const learner = await h.call('/api/content/lessons/prea1-hola?preview=1', { cookie });
    expect(learner.status).toBe(404);

    // مراجع محتوى يملك الصلاحية → 200
    h.db.raw.prepare("UPDATE users SET role_id=(SELECT id FROM roles WHERE code='language_reviewer') WHERE email_normalized=?").run(VALID_EMAIL);
    const reviewer = await h.call('/api/content/lessons/prea1-hola?preview=1', { cookie });
    expect(reviewer.status).toBe(200);
    expect((await h.json(reviewer)).lesson.versionId).toBe('lv1');
  });
});
