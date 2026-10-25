/**
 * انحدار: اسم كوكي الجلسة وخصائصه يتبعان أمان الطلب الفعلي لا إعداد APP_ORIGIN فقط.
 *
 * قبل الإصلاح: APP_ORIGIN=https يقصد `__Host-ses; Secure` حتى لو وصل الطلب عبر http
 * حقيقي (خادم تطوير/بروكسي معاينة)، فيرفض المتصفح الكوكي بصمت. النتيجة: POST ناجح
 * 200 ثم /me يعود 401 وكأن الجلسة لم تُحفظ أبدًا.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { makeHarness, VALID_EMAIL, VALID_PW, type Harness } from './harness';

let h: Harness;
afterEach(() => h?.close());

const signup = (headers: Record<string, string> = {}) =>
  h.call('/api/auth/signup', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }),
  });

describe('كوكي الجلسة — الاسم والأمان يتبعان الطلب', () => {
  it('عبر http: كوكي `ses` بلا Secure (وإلا يرفضه المتصفح)', async () => {
    h = makeHarness();
    const res = await signup();
    expect(res.status).toBe(201);
    const raw = res.headers.get('Set-Cookie')!;
    expect(raw.startsWith('ses=')).toBe(true);
    expect(raw).not.toContain('Secure');
    expect(raw).toContain('HttpOnly');
    expect(raw).toContain('SameSite=Lax');
  });

  it('عبر HTTPS (X-Forwarded-Proto): كوكي `__Host-ses` مع Secure', async () => {
    h = makeHarness();
    const res = await signup({ 'X-Forwarded-Proto': 'https' });
    expect(res.status).toBe(201);
    const raw = res.headers.get('Set-Cookie')!;
    expect(raw.startsWith('__Host-ses=')).toBe(true);
    expect(raw).toContain('Secure');
    expect(raw).toContain('Path=/');
    expect(raw).not.toContain('Domain=');
  });

  it('CF-Visitor https يُعامل كطلب آمن (بروكسي Cloudflare)', async () => {
    h = makeHarness();
    const res = await signup({ 'CF-Visitor': '{"scheme":"https"}' });
    expect(res.headers.get('Set-Cookie')!.startsWith('__Host-ses=')).toBe(true);
  });

  it('على HTTPS لا يُقبل كوكي `ses` غير المحمي بـ__Host- (حماية من الزرع عبر نطاق فرعي)', async () => {
    h = makeHarness();
    const cookie = h.cookieOf(await signup())!;
    expect(cookie.startsWith('ses=')).toBe(true);

    const me = await h.call('/api/auth/me', {
      cookie,
      headers: { 'X-Forwarded-Proto': 'https' },
    });
    expect(me.status).toBe(401);
  });

  it('جلسة أُنشئت عبر https (`__Host-ses`) تُقرأ لاحقًا في طلب http', async () => {
    h = makeHarness();
    const cookie = h.cookieOf(await signup({ 'X-Forwarded-Proto': 'https' }))!;
    expect(cookie.startsWith('__Host-ses=')).toBe(true);

    const me = await h.call('/api/auth/me', { cookie });
    expect(me.status).toBe(200);
  });

  it('الخروج يمسح الاسمين ويُبطل الجلسة في القاعدة', async () => {
    h = makeHarness();
    const cookie = h.cookieOf(await signup({ 'X-Forwarded-Proto': 'https' }))!;
    const out = await h.call('/api/auth/logout', {
      method: 'POST',
      cookie,
      headers: { 'X-Forwarded-Proto': 'https' },
    });
    expect(out.status).toBe(200);

    const cleared = typeof out.headers.getSetCookie === 'function'
      ? out.headers.getSetCookie()
      : [out.headers.get('Set-Cookie') ?? ''];
    expect(cleared.some(c => c.startsWith('__Host-ses=') && c.includes('Max-Age=0'))).toBe(true);
    expect(cleared.some(c => c.startsWith('ses=') && c.includes('Max-Age=0'))).toBe(true);

    expect((await h.call('/api/auth/me', { cookie })).status).toBe(401);
  });
});
