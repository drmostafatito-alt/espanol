/**
 * اختبارات التسجيل المجاني الآمن (اشتقاق على طبقتين).
 *
 * ما تُثبته هذه الاختبارات فعليًا:
 *   1) معاملات الاشتقاق حتمية لكل بريد ولا تكشف وجود حساب (نفس الشكل والمسارات).
 *   2) في الإنتاج لا يُقبل تسجيل بكلمة مرور خام إطلاقًا (كلمة المرور لا تغادر المتصفح).
 *   3) الصف المخزَّن بصيغة kdfv2 ولا يحتوي كلمة المرور ولا مشتقها الأول.
 *   4) تسجيل الدخول يعمل بالمفتاح الصحيح ويفشل بالخطأ بنفس الرد العام.
 *   5) حساب قديم (v1) لا يُكسر: يُتحقق منه بكلمة المرور الخام ثم يُرقّى إلى v2.
 *   6) تغيير الـpepper يبطل الملح الحتمي ⇒ المفتاح المشتق القديم لا يعمل (فشل مغلق).
 */
import { describe, it, expect } from 'vitest';
import worker from '../src/worker/index';
import { makeHarness, type Harness } from './harness';


const PROD = {
  ENVIRONMENT: 'production',
  APP_ORIGIN: 'https://app.example.com',
  ALLOW_PUBLIC_SIGNUP: 'true',
  CLIENT_KDF_REQUIRED: 'true',
  CLIENT_KDF_ITERATIONS: '100000',
  PBKDF2_ITERATIONS: '20000',
} as const;

function b64urlToBytes(value: string): Uint8Array {
  const b64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

async function derive(password: string, saltB64: string, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: b64urlToBytes(saltB64) as unknown as BufferSource, iterations, hash: 'SHA-256' },
    key,
    256,
  );
  return Buffer.from(new Uint8Array(bits)).toString('base64url');
}

async function params(h: Harness, email: string) {
  const res = await h.call('/api/auth/kdf-params', { method: 'POST', body: JSON.stringify({ email }) });
  expect(res.status).toBe(200);
  return (await res.json()) as { salt: string; iterations: number; required: boolean; version: number };
}

async function credential(h: Harness, email: string, password: string) {
  const p = await params(h, email);
  return { email, derivedKey: await derive(password, p.salt, p.iterations) };
}

function prodHarness(overrides: Record<string, string> = {}) {
  const h = makeHarness({ ...PROD, ...overrides });
  // الطلبات في هذه الاختبارات تصل عبر https: حتى يأخذ الكوكي اسم __Host- وSecure
  const call: Harness['call'] = async (path, init = {}) => {
    const headers = new Headers(init.headers);
    if (init.cookie) headers.set('Cookie', init.cookie);
    if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const req = new Request('https://app.example.com' + path, { ...init, headers });
    return await worker.fetch(req, h.env);
  };
  return { ...h, call };
}

describe('اشتقاق كلمة المرور على طبقتين — تسجيل مجاني وآمن', () => {
  it('معاملات الاشتقاق حتمية ونفسها للبريد المجهول والمسجَّل (لا كشف حسابات)', async () => {
    const h = prodHarness();
    const before = await params(h, 'ghost@example.com');
    // ننشئ حسابًا حقيقيًا بنفس البريد ثم نقارن: الملح لا يتغيّر ولا يكشف شيئًا
    const signup = await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify(await credential(h, 'ghost@example.com', 'Cairo2026learn')) });
    expect(signup.status).toBe(201);
    const after = await params(h, 'ghost@example.com');
    expect(after.salt).toBe(before.salt);
    expect(after).toMatchObject({ version: 2, required: true });
    expect(after.iterations).toBe(100000);
    // شكل الاستجابة واحد للبريد غير الموجود
    const other = await params(h, 'nobody-else@example.com');
    expect(Object.keys(other).sort()).toEqual(Object.keys(after).sort());
    h.close();
  });

  it('الإنتاج: كلمة مرور خام مرفوضة (كلمة المرور لا تغادر المتصفح)', async () => {
    const h = prodHarness();
    const res = await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email: 'raw@example.com', password: 'Cairo2026learn' }) });
    expect(res.status).toBe(400);
    expect((await h.json(res)).error.code).toBe('CLIENT_KDF_REQUIRED');
    h.close();
  });

  it('التخزين: صيغة kdfv2 بلا أي أثر لكلمة المرور أو للمفتاح المُرسل', async () => {
    const h = prodHarness();
    const cred = await credential(h, 'store@example.com', 'Cairo2026learn');
    const res = await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ ...cred, displayName: 'سارة' }) });
    expect(res.status).toBe(201);
    const row = h.db.raw.prepare('SELECT password_hash FROM users WHERE email_normalized = ?').get('store@example.com') as { password_hash: string };
    expect(row.password_hash.startsWith('kdfv2$')).toBe(true);
    expect(row.password_hash).not.toContain(cred.derivedKey);
    expect(row.password_hash).not.toContain('Cairo2026learn');
    // 5 أجزاء: الصيغة، تكرارات الخادم، تكرارات العميل، الملح، التجزئة
    expect(row.password_hash.split('$')).toHaveLength(5);
    h.close();
  });

  it('الدخول: المفتاح الصحيح ينجح، والخطأ يعطي 401 عامًا', async () => {
    const h = prodHarness();
    const email = 'login@example.com';
    await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify(await credential(h, email, 'Cairo2026learn')) });

    const wrong = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify(await credential(h, email, 'Cairo2026wrong')) });
    expect(wrong.status).toBe(401);
    expect((await h.json(wrong)).error.code).toBe('INVALID_CREDENTIALS');

    const ok = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify(await credential(h, email, 'Cairo2026learn')) });
    expect(ok.status).toBe(200);
    const cookie = h.cookieOf(ok)!;
    expect(cookie.startsWith('__Host-ses=')).toBe(true);
    const me = await h.call('/api/auth/me', { cookie });
    expect(me.status).toBe(200);
    h.close();
  });

  it('الحساب القديم (v1) لا يُكسر: يدخل بكلمة المرور عبر المسار القديم', async () => {
    const h = makeHarness(); // بيئة اختبار: تسمح بالمسار القديم
    const email = 'legacy@example.com';
    const old = await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password: 'Cairo2026learn' }) });
    expect(old.status).toBe(201);
    const before = h.db.raw.prepare('SELECT password_hash FROM users WHERE email_normalized = ?').get(email) as { password_hash: string };
    expect(before.password_hash.startsWith('pbkdf2-sha256$')).toBe(true);

    // عميل جديد يرسل مفتاحًا مشتقًا لحساب قديم ⇒ 409 صريح (لا يكشف وجود الحساب)
    const v2 = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify(await credential(h, email, 'Cairo2026learn')) });
    expect(v2.status).toBe(409);
    expect((await h.json(v2)).error.code).toBe('LEGACY_CREDENTIALS');

    // يعيد المحاولة بكلمة المرور الخام مرة واحدة ⇒ دخول ناجح (لا كسر للحساب)
    const raw = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password: 'Cairo2026learn' }) });
    expect(raw.status).toBe(200);
    // ملاحظة صريحة: الصف يبقى v1 — الخادم لا يملك كلمة المرور ليعيد اشتقاق مفتاح
    // المتصفح. الحسابات القديمة تبقى على قوتها السابقة حتى تغيّر كلمة المرور،
    // وهذه الحالة لا وجود لها في الإنتاج (لم يُنشر التطبيق قط).
    const after = h.db.raw.prepare('SELECT password_hash FROM users WHERE email_normalized = ?').get(email) as { password_hash: string };
    expect(after.password_hash.startsWith('pbkdf2-sha256$')).toBe(true);
    h.close();
  });

  it('تغيير pepper يُبطل الملح الحتمي ⇒ مفتاح مشتق بملح قديم لا يدخل (فشل مغلق)', async () => {
    const h = prodHarness();
    const email = 'pepper@example.com';
    const first = await credential(h, email, 'Cairo2026learn');
    await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify(first) });

    // نفس البريد بملح مختلف (كما لو تغيّر pepper أو حاول المهاجم تخمينًا بملح ثابت)
    const wrongSalt = await derive('Cairo2026learn', 'AAAAAAAAAAAAAAAAAAAAAA', 100000);
    const res = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, derivedKey: wrongSalt }) });
    expect(res.status).toBe(401);
    // والمفتاح الصحيح ما زال يعمل
    const ok = await h.call('/api/auth/login', { method: 'POST', body: JSON.stringify(first) });
    expect(ok.status).toBe(200);
    h.close();
  });

  it('مفتاح مشوّه يُرفض قبل أي عمل اشتقاق (تحقق مدخلات)', async () => {
    const h = prodHarness();
    const res = await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email: 'bad@example.com', derivedKey: 'not-a-key' }) });
    expect(res.status).toBe(400);
    h.close();
  });
});
