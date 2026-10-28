/* إغلاق التسجيل العام لا يمنع دخول الحسابات القائمة ولا إنشاء حسابات Google */
import { describe, it, expect } from 'vitest';
import { makeHarness, VALID_EMAIL, VALID_PW } from './harness';
import { createUser } from '../src/worker/db';
import { hashPassword, resolvePolicy } from '../src/worker/lib/password';

describe('التسجيل مغلق، الدخول مفتوح للحسابات القائمة', () => {
  it('حساب كلمة مرور قائم يسجّل دخوله مع ALLOW_PUBLIC_SIGNUP غائبًا تمامًا', async () => {
    const env = makeHarness({ ENVIRONMENT: 'production', ALLOW_PUBLIC_SIGNUP: undefined });
    const policy = resolvePolicy(env.env);
    await createUser(env.db.d1, {
      id: '01TESTCLOSED00000000000001',
      emailNormalized: VALID_EMAIL,
      emailDisplay: VALID_EMAIL,
      passwordHash: await hashPassword(VALID_PW, policy),
      displayName: 'سارة',
    });

    const signup = await env.call('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@example.com', password: VALID_PW }),
    });
    expect(signup.status).toBe(503);
    expect((await env.json(signup)).error.code).toBe('SIGNUP_DISABLED');

    const login = await env.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }),
    });
    expect(login.status).toBe(200);
    const cookie = env.cookieOf(login);
    expect(cookie).toBeTruthy();
    const me = await env.call('/api/auth/me', { cookie });
    expect(me.status).toBe(200);
    env.close();
  });

  it('بدء Google بلا Client ID يفشل مغلقًا ولا يسرّب شيئًا', async () => {
    const env = makeHarness({ ENVIRONMENT: 'production', ALLOW_PUBLIC_SIGNUP: undefined });
    const res = await env.call('/api/auth/oauth/google/start', { method: 'GET' });
    expect(res.status).toBe(302);
    const location = res.headers.get('Location') ?? '';
    expect(location).toBe('/login?oauth=unavailable');
    expect(location).not.toContain('accounts.google.com');
    env.close();
  });
});
