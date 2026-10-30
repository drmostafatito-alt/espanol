// @vitest-environment jsdom
/**
 * شاشات استعادة الوصول من الواجهة نفسها: نفس مكوّنات React + worker.fetch الحقيقي
 * + D1 في الذاكرة، مع حافظة كوكي تحاكي المتصفح.
 *
 * ما تُثبته:
 *   1) /forgot يُرسل الطلب ويعرض رسالة محايدة (لا تكشف وجود الحساب).
 *   2) /reset يشتق المفتاح في «المتصفح» ثم يُعيد التعيين، ويُظهر شاشة النجاح.
 *   3) /reset برابط ناقص يُظهر «رابط غير صالح» ولا يستدعي الخادم.
 *   4) /verify يؤكّد الرمز ويعرض النجاح، والرمز المستخدم مرة ثانية يُرفض.
 *   5) المعاملات الحسّاسة تُمسح من شريط العنوان بعد القراءة.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../src/web/state';
import { ForgotPassword, ResetPassword, VerifyEmail } from '../src/web/pages/Auth';
import { clearOutbox } from '../src/worker/lib/mailer';
import { makeHarness, type Harness } from './harness';

/** اشتقاق رخيص للاختبار: القيمة نفسها لكل كلمة (الخادم لا يتحقق من قوة الاشتقاق). */
vi.mock('../src/web/kdf', () => ({
  supportsClientKdf: () => true,
  deriveKeyB64: async (password: string) => Buffer.from('dk:' + password).toString('base64url').padEnd(43, 'A').slice(0, 43),
}));

let h: Harness;
let cookieJar: string | null;

function wireFetch() {
  cookieJar = null;
  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const path = String(
      typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url,
    ).replace(/^https?:\/\/[^/]+/, '');
    const headers = new Headers(init.headers);
    headers.set('Origin', 'http://localhost:5173');
    headers.set('Sec-Fetch-Site', 'same-origin');
    if (cookieJar) headers.set('Cookie', cookieJar);
    const res = await h.call(path, {
      method: init.method,
      headers,
      body: init.body as string | undefined,
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const pair = setCookie.split(';')[0]!;
      if (!pair.endsWith('=')) cookieJar = pair;
    }
    return res;
  });
}

beforeEach(() => {
  clearOutbox();
  h = makeHarness({ DEBUG_MAIL_OUTBOX: 'true' });
  wireFetch();
  window.history.replaceState({}, '', '/');
});

afterEach(() => {
  cleanup();
  h.close();
  vi.unstubAllGlobals();
});

async function signup(email: string) {
  const res = await h.call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password: 'Cairo2026learn' }) });
  expect(res.status).toBe(201);
  cookieJar = h.cookieOf(res);
}

async function tokenFor(kind: 'verify_email' | 'reset_password'): Promise<string> {
  const res = await h.call('/api/dev/mail-outbox');
  const body = (await res.json()) as { items: { kind: string; text: string }[] };
  const item = [...body.items].reverse().find(i => i.kind === kind)!;
  return /token=([A-Za-z0-9_-]+)/.exec(item.text)![1]!;
}

describe('شاشة نسيت كلمة المرور', () => {
  it('ترسل الطلب وتعرض رسالة محايدة', async () => {
    await signup('forgot@example.com');
    render(<AuthProvider><ForgotPassword navigate={() => undefined} /></AuthProvider>);
    await userEvent.type(screen.getByLabelText('البريد الإلكتروني'), 'forgot@example.com');
    await userEvent.click(screen.getByRole('button', { name: /أرسل رابط الاستعادة/ }));
    await waitFor(() => expect(screen.getByText(/إن كان هذا البريد مسجلًا/)).toBeTruthy());
    // الرسالة لا تؤكد وجود الحساب
    expect(screen.queryByText(/تم إرسال الرابط إلى/)).toBeNull();
  });
});

describe('شاشة إعادة التعيين', () => {
  it('تعيد التعيين بالمفتاح المشتق وتنجح', async () => {
    await signup('resetui@example.com');
    await h.call('/api/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email: 'resetui@example.com' }) });
    const token = await tokenFor('reset_password');
    window.history.replaceState({}, '', `/reset?token=${token}&email=resetui%40example.com`);
    cookieJar = null; // المستخدم يفتح الرابط على متصفح آخر

    render(<AuthProvider><ResetPassword navigate={() => undefined} /></AuthProvider>);
    const fields = screen.getAllByLabelText(/كلمة المرور/);
    await userEvent.type(fields[0]!, 'Cairo2027learn!');
    await userEvent.type(fields[1]!, 'Cairo2027learn!');
    await userEvent.click(screen.getByRole('button', { name: /احفظ كلمة المرور/ }));
    await waitFor(() => expect(screen.getByText(/حُفظت كلمة المرور الجديدة/)).toBeTruthy());
    // الرمز والبريد مُسحا من شريط العنوان
    expect(window.location.search).toBe('');
  });

  it('رابط ناقص لا يستدعي الخادم ويُظهر خطأً واضحًا', async () => {
    window.history.replaceState({}, '', '/reset');
    render(<AuthProvider><ResetPassword navigate={() => undefined} /></AuthProvider>);
    expect(screen.getByText(/هذا الرابط غير صالح/)).toBeTruthy();
  });
});

describe('شاشة تأكيد البريد', () => {
  it('تؤكد الرمز مرة واحدة وتعرض النجاح', async () => {
    await signup('verifyui@example.com');
    await h.call('/api/auth/verify-email/request', { method: 'POST', cookie: cookieJar, body: '{}' });
    const token = await tokenFor('verify_email');
    window.history.replaceState({}, '', `/verify?token=${token}`);

    render(<AuthProvider><VerifyEmail navigate={() => undefined} /></AuthProvider>);
    await waitFor(() => expect(screen.getByText(/صار بريدك مؤكدًا/)).toBeTruthy());
    expect(window.location.search).toBe('');
  });

  it('رمز مستخدم سابقًا يُظهر رسالة رفض', async () => {
    await signup('verifyui2@example.com');
    await h.call('/api/auth/verify-email/request', { method: 'POST', cookie: cookieJar, body: '{}' });
    const token = await tokenFor('verify_email');
    await h.call('/api/auth/verify-email/confirm', { method: 'POST', body: JSON.stringify({ token }) });
    window.history.replaceState({}, '', `/verify?token=${token}`);

    render(<AuthProvider><VerifyEmail navigate={() => undefined} /></AuthProvider>);
    await waitFor(() => expect(screen.getByText(/الرابط غير صالح أو منتهي/)).toBeTruthy());
  });
});
