// @vitest-environment jsdom
/**
 * إثبات أن تسجيل الدخول يعمل من الواجهة نفسها لا على مستوى HTTP فقط:
 * نفس مكوّن React (Login/Signup) + نفس worker.fetch الحقيقي + D1 حقيقي في الذاكرة،
 * مع حافظة كوكي تحاكي المتصفح (Set-Cookie ثم إرسالها في الطلبات التالية).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../src/web/state';
import { Login, Signup } from '../src/web/pages/Auth';
import { makeHarness, VALID_EMAIL, VALID_PW, type Harness } from './harness';

let h: Harness;
let cookieJar: string | null;

/** يوجّه fetch الواجهة إلى worker الحقيقي مع إدارة كوكي الجلسة كما يفعل المتصفح */
function wireFetchWithJar(harness: Harness) {
  cookieJar = null;
  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const path = String(
      typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url,
    ).replace(/^https?:\/\/[^/]+/, '');
    const headers = new Headers(init.headers);
    headers.set('Origin', 'http://localhost:5173');
    headers.set('Sec-Fetch-Site', 'same-origin');
    if (cookieJar) headers.set('Cookie', cookieJar);
    const req = new Request('http://localhost:8787' + path, {
      method: init.method ?? 'GET',
      headers,
      body: init.body as BodyInit | undefined,
    });
    const res = await import('../src/worker/index').then(m => m.default.fetch(req, harness.env));
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const pair = setCookie.split(';')[0]!;
      if (!pair.endsWith('=')) cookieJar = pair;
    }
    return res;
  });
}

beforeEach(() => {
  h = makeHarness({ ALLOW_PUBLIC_SIGNUP: 'true' });
  wireFetchWithJar(h);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  h.close();
});

describe('تدفق الهوية من الواجهة (DOM حقيقي + worker حقيقي)', () => {
  it('إنشاء حساب ينقل المستخدم فعلًا إلى لوحة المتعلم وتُحفظ الجلسة في الكوكي', async () => {
    const navigate = vi.fn();
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Signup navigate={navigate} />
      </AuthProvider>,
    );

    await user.type(document.querySelector('input[type="email"]')!, VALID_EMAIL);
    await user.type(document.querySelector('input[type="password"]')!, VALID_PW);
    await user.click(screen.getByRole('button', { name: 'إنشاء الحساب' }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/learn'), { timeout: 8000 });
    expect(cookieJar).toMatch(/^ses=.+/);
  });

  it('تسجيل الدخول بحساب موجود ينقل إلى اللوحة، والكوكي تصلح لمسار محمٍ بعده', async () => {
    // الحساب يُنشأ أولًا عبر worker مباشرة (مستخدم سجّل من قبل ثم عاد)
    const signupRes = await h.call('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW, displayName: 'سارة' }),
    });
    expect(signupRes.status).toBe(201);

    const navigate = vi.fn();
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Login navigate={navigate} />
      </AuthProvider>,
    );

    await user.type(document.querySelector('input[type="email"]')!, VALID_EMAIL);
    await user.type(document.querySelector('input[type="password"]')!, VALID_PW);
    await user.click(screen.getByRole('button', { name: 'دخول' }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/learn'), { timeout: 8000 });
    expect(cookieJar).toMatch(/^ses=.+/);

    // نفس الكوكي التي حصلت عليها الواجهة تُجيز مسارًا محميًا (محاكاة طلب بيانات اللوحة)
    const me = await h.call('/api/auth/me', { cookie: cookieJar });
    expect(me.status).toBe(200);
    const body = await h.json<{ user: { email: string } }>(me);
    expect(body.user.email).toBe(VALID_EMAIL);
  });

  it('كلمة مرور خاطئة تعرض رسالة الخادم الحقيقية ولا تنقل المستخدم', async () => {
    const signupRes = await h.call('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }),
    });
    expect(signupRes.status).toBe(201);

    const navigate = vi.fn();
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Login navigate={navigate} />
      </AuthProvider>,
    );

    await user.type(document.querySelector('input[type="email"]')!, VALID_EMAIL);
    await user.type(document.querySelector('input[type="password"]')!, 'WrongPassword9');
    await user.click(screen.getByRole('button', { name: 'دخول' }));

    await waitFor(
      () => expect(screen.getByRole('alert').textContent).toContain('البريد أو كلمة المرور غير صحيحة'),
      { timeout: 8000 },
    );
    expect(navigate).not.toHaveBeenCalled();
    expect(cookieJar).toBeNull();
  });
});
