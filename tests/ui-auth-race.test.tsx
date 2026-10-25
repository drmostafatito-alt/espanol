// @vitest-environment jsdom
/**
 * انحدار سباق المصادقة:
 * طلب /me الإقلاعي قد يعود 401 *بعد* أن يسجّل المستخدم دخوله بنجاح على شبكة بطيئة.
 * قبل الإصلاح كان ذلك يمحو هوية المستخدم ويعيده إلى صفحة الدخول رغم نجاح الخادم.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../src/web/state';
import { Login } from '../src/web/pages/Auth';

const USER = {
  id: 'u-race-1',
  email: 'race@local.dev',
  displayName: 'سباق',
  role: 'learner',
  explanationStyle: 'fusha_eg' as const,
  audioVariant: 'es-ES' as const,
  dailyGoalMinutes: 10,
  permissions: [],
};

function Probe() {
  const { user, loading } = useAuth();
  return (
    <div data-testid="probe">
      {loading ? 'loading' : user ? `user:${user.email}` : 'anonymous'}
    </div>
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('سباق طلب الإقلاع مع تسجيل الدخول', () => {
  it('401 إقلاعي متأخر لا يطرد مستخدمًا سجّل دخوله للتو', async () => {
    let resolveBootMe: (r: Response) => void = () => {};
    const bootMe = new Promise<Response>(res => {
      resolveBootMe = res;
    });

    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const raw = typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url;
      const path = String(raw).replace(/^https?:\/\/[^/]+/, '');
      const method = init?.method ?? 'GET';

      if (path === '/api/auth/me' && method === 'GET') return bootMe;
      if (path === '/api/auth/login' && method === 'POST') {
        return new Response(JSON.stringify({ user: USER }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Set-Cookie': 'ses=abc123; Path=/; HttpOnly' },
        });
      }
      return new Response(JSON.stringify({ error: { code: 'UNEXPECTED' } }), { status: 500 });
    }));

    const navigate = vi.fn();
    render(
      <AuthProvider>
        <Probe />
        <Login navigate={navigate} />
      </AuthProvider>,
    );

    const user = userEvent.setup();
    await user.type(document.querySelector('input[type="email"]')!, USER.email);
    await user.type(document.querySelector('input[type="password"]')!, 'StrongP@ss99x');
    await user.click(screen.getByRole('button', { name: 'دخول' }));

    // الدخول نجح ونقل الواجهة فعلًا
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/learn'));
    await waitFor(() => expect(screen.getByTestId('probe').textContent).toBe(`user:${USER.email}`));

    // الآن يصل رد /me الإقلاعي القديم برفض 401
    resolveBootMe(
      new Response(JSON.stringify({ error: { code: 'UNAUTHENTICATED', message: 'يلزم تسجيل الدخول.' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    await new Promise(r => setTimeout(r, 50));

    // المستخدم بقي مسجّلًا رغم الرد القديم
    expect(screen.getByTestId('probe').textContent).toBe(`user:${USER.email}`);
  });

  it('401 الإقلاع الطبيعي (بلا دخول) يترك الزائر مجهولًا بلا خطأ اتصال', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const path = String(typeof input).replace(/^https?:\/\/[^/]+/, '');
      if (path === '/api/auth/me') {
        return new Response(JSON.stringify({ error: { code: 'UNAUTHENTICATED' } }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'unexpected' }), { status: 500 });
    }));

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('probe').textContent).toBe('anonymous'));
  });
});
