/**
 * تسريب الإجابات والجلسات: جلسة الدرس لا تنطق الإجابة، وحزمة القراءة العامة
 * لا تحمل مفاتيح إجابة، وتغيير كلمة المرور يطرد الجلسات الأخرى.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { makeHarness, signupAndGetCookie, VALID_PW, type Harness } from './harness';
import { correctAnswer, importExemplars } from './content-fixture';

let h: Harness;
let cookie: string;

beforeEach(async () => {
  h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
  importExemplars(h);
  const signup = await signupAndGetCookie(h);
  cookie = signup.cookie!;
});

describe('لا تسريب للإجابات في جلسة الدرس', () => {
  it('speechEs لا يساوي أبدًا نص الإجابة الصحيحة ولا يشتق منها — إلا محفّز listen_choose', async () => {
    const res = await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie });
    expect(res.status).toBe(200);
    const session = await h.json(res);
    for (const ex of session.exercises) {
      // speechEs المسموح: لا شيء، أو نص السؤال نفسه (مع إخفاء الفراغات بـ «...» كما يفعل الخادم)
      const maskedStem = typeof ex.stemEs === 'string' ? ex.stemEs.replace(/_{2,}/g, '...').trim() : null;
      // الاستثناء الوحيد: listen_choose بلا stemEs ينطق نص الخيار الصحيح،
      // لأن الصوت هو محفّز التمرين نفسه وكل الخيارات معروضة أصلًا.
      const listenStimulus = ex.type === 'listen_choose' && !ex.stemEs
        ? ex.options.map((o: { text: string }) => o.text).find((t: string) => t === ex.speechEs) ?? null
        : null;
      expect(
        ex.speechEs === null || ex.speechEs === ex.stemEs || ex.speechEs === maskedStem || listenStimulus !== null,
        `speechEs غير مصرّح به في ${ex.id}`,
      ).toBe(true);
      if (ex.type === 'listen_choose' && !ex.stemEs) {
        expect(ex.speechEs, `listen_choose بلا stemEs يجب أن ينطق جملة مسموعة في ${ex.id}`).toBeTruthy();
        expect(ex.options.map((o: { text: string }) => o.text)).toContain(ex.speechEs);
      }
      const correct = correctAnswer(h, ex.id);
      const correctTexts: string[] = [];
      if (typeof correct === 'string' && correct) correctTexts.push(correct);
      if (correct && typeof correct === 'object' && Array.isArray((correct as { tokens?: unknown }).tokens)) {
        correctTexts.push(((correct as { tokens: string[] }).tokens).join(' '));
      }
      for (const t of correctTexts) {
        // في listen_choose الإجابة هي مطابقة ما سُمع، لا نص الجملة نفسه
        if (ex.type === 'listen_choose' && !ex.stemEs) continue;
        expect(ex.speechEs, `speechEs يكشف الإجابة في ${ex.id}`).not.toBe(t);
      }
      // لا خيارات تحمل علامة صواب، ولا مفتاح إجابة في الجلسة
      expect(JSON.stringify(ex)).not.toContain('isCorrect');
      expect(JSON.stringify(ex)).not.toContain('answerKey');
    }
  });
});

describe('حزمة القراءة العامة بلا مفاتيح إجابة', () => {
  it('درس منشور يُقدَّم بلا answerKey ولا isCorrect ولا accepted', async () => {
    h.db.raw.exec(`UPDATE lessons SET status = 'published'`);
    h.db.raw.exec(`UPDATE lesson_versions SET status = 'published'`);
    const res = await h.call('/api/content/lessons/prea1-hola-me-llamo');
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).not.toContain('answerKey');
    expect(text).not.toContain('isCorrect');
    expect(text).not.toContain('correctOptionIds');
    expect(text).not.toContain('"accepted"');
    const body = JSON.parse(text);
    expect(body.lesson.slug).toBe('prea1-hola-me-llamo');
    expect(body.lesson.content.exercises.length).toBeGreaterThan(0);
  });
});

describe('تغيير كلمة المرور وإلغاء الجلسات الأخرى', () => {
  it('تغيير كلمة المرور يبقي الجلسة الحالية ويطرد جلسة أخرى', async () => {
    // جلسة ثانية لنفس المستخدم من دخول آخر
    const loginRes = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'sara@example.com', password: VALID_PW }),
    });
    expect(loginRes.status).toBe(200);
    const otherCookie = h.cookieOf(loginRes)!;
    expect(otherCookie).not.toBe(cookie);

    const changeRes = await h.call('/api/auth/change-password', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ currentPassword: VALID_PW, newPassword: 'Cairo2026new!' }),
    });
    expect(changeRes.status).toBe(200);

    // الجلسة الحالية ما زالت صالحة
    const meRes = await h.call('/api/auth/me', { cookie });
    expect(meRes.status).toBe(200);
    // الجلسة الأخرى أُلغيت
    const otherMe = await h.call('/api/auth/me', { cookie: otherCookie });
    expect(otherMe.status).toBe(401);
    // الدخول بالقديمة يفشل، وبالجديدة ينجح
    const oldLogin = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'sara@example.com', password: VALID_PW }),
    });
    expect(oldLogin.status).toBe(401);
    const newLogin = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'sara@example.com', password: 'Cairo2026new!' }),
    });
    expect(newLogin.status).toBe(200);
  });

  it('كلمة مرور حالية خاطئة لا تغيّر شيئًا', async () => {
    const res = await h.call('/api/auth/change-password', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ currentPassword: 'WrongPass123', newPassword: 'Cairo2026new!' }),
    });
    expect(res.status).toBe(401);
    const loginRes = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'sara@example.com', password: VALID_PW }),
    });
    expect(loginRes.status).toBe(200);
  });

  it('إلغاء كل الجلسات الأخرى يبقي الحالية فقط', async () => {
    const loginRes = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'sara@example.com', password: VALID_PW }),
    });
    const otherCookie = h.cookieOf(loginRes)!;
    const res = await h.call('/api/auth/sessions/revoke-all', { method: 'POST', cookie });
    expect(res.status).toBe(200);
    const body = await h.json(res);
    expect(body.revoked).toBe(1);
    expect((await h.call('/api/auth/me', { cookie })).status).toBe(200);
    expect((await h.call('/api/auth/me', { cookie: otherCookie })).status).toBe(401);
  });
});

describe('قفل الحساب ينتهي بانتهاء مدته', () => {
  it('فشل واحد بعد انقضاء القفل لا يعيد القفل فورًا', async () => {
    const email = 'sara@example.com';
    for (let i = 0; i < 5; i++) {
      const r = await h.call('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: 'WrongPass123' }),
      });
      expect(r.status).toBe(401);
    }
    // الحساب مقفل الآن
    const locked = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: VALID_PW }),
    });
    expect(locked.status).toBe(429);

    // مرّت مدة القفل (نحرّك الساعة في القاعدة مباشرة — اختبار فقط)
    h.db.raw.exec(`UPDATE users SET locked_until = '2000-01-01T00:00:00.000Z' WHERE email_normalized = '${email}'`);

    // فشل واحد بعد الانقضاء: 401 لا 429، والعدّاد أُعيد إلى 1
    const after = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'WrongPass123' }),
    });
    expect(after.status).toBe(401);
    const row = h.db.raw.prepare('SELECT failed_login_count, locked_until FROM users WHERE email_normalized = ?').get(email) as {
      failed_login_count: number; locked_until: string | null;
    };
    expect(row.failed_login_count).toBe(1);
    expect(row.locked_until).toBeNull();
  });
});
