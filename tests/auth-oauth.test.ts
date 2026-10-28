/* المصادقة عبر Google — تدفق OAuth كاملًا برموز Google مزيّفة (بلا شبكة) */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { makeHarness, signupAndGetCookie, VALID_PW, VALID_EMAIL, type Harness } from './harness';
import {
  pkcePair, buildAuthorizationUrl, verifyIdToken,
  GOOGLE_TOKEN_URL, GOOGLE_JWKS_URL, type GoogleJwk,
} from '../src/worker/lib/google-oauth';
import { b64url } from '../src/worker/lib/crypto';

const CLIENT_ID = 'test-client-id.apps.googleusercontent.com';
const CLIENT_SECRET = 'test-client-secret';
const ORIGINS = 'http://localhost:5173,http://localhost:8787';

const enc = new TextEncoder();
let keyPair: CryptoKeyPair;
let badKeyPair: CryptoKeyPair;
let publicJwk: GoogleJwk;

const realFetch = globalThis.fetch.bind(globalThis);
let signedIdToken = '';
let lastTokenBody: URLSearchParams | null = null;
let googleBehavior: { exchange: 'ok' | 'http500' | 'no-id-token'; jwks: 'ok' | 'http500' | 'empty' } = {
  exchange: 'ok',
  jwks: 'ok',
};

async function fakeFetch(input: unknown, init?: unknown): Promise<Response> {
  const url = String(input);
  if (url === GOOGLE_TOKEN_URL) {
    if (googleBehavior.exchange === 'http500') return new Response('upstream error', { status: 500 });
    if (googleBehavior.exchange === 'no-id-token') {
      return Response.json({ access_token: 'ya29.test', token_type: 'Bearer', expires_in: 3600 });
    }
    lastTokenBody = new URLSearchParams(String((init as { body?: unknown } | undefined)?.body ?? ''));
    return Response.json({
      id_token: signedIdToken, access_token: 'ya29.test', token_type: 'Bearer', expires_in: 3600, scope: 'openid email profile',
    });
  }
  if (url === GOOGLE_JWKS_URL) {
    if (googleBehavior.jwks === 'http500') return new Response('upstream error', { status: 500 });
    if (googleBehavior.jwks === 'empty') return Response.json({ keys: [] });
    return Response.json({ keys: [publicJwk] });
  }
  return realFetch(input as RequestInfo, init as RequestInit);
}

async function makeIdToken(
  claims: Record<string, unknown>,
  key: CryptoKey = keyPair.privateKey,
  kid = 'test-kid',
): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', kid, typ: 'JWT' };
  const payload = {
    iss: 'https://accounts.google.com',
    aud: CLIENT_ID,
    sub: 'google-sub-123',
    email: VALID_EMAIL,
    email_verified: true,
    name: 'Sara Google',
    iat: nowSec,
    exp: nowSec + 3600,
    ...claims,
  };
  const head = b64url(enc.encode(JSON.stringify(header)));
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(`${head}.${body}`));
  return `${head}.${body}.${b64url(new Uint8Array(sig))}`;
}

function setCookiesOf(res: Response): string[] {
  const h = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof h.getSetCookie === 'function') return h.getSetCookie();
  const single = res.headers.get('Set-Cookie');
  return single ? [single] : [];
}

function cookieValue(cookies: string[], name: string): string | null {
  for (const c of cookies) {
    const first = c.split(';')[0]!;
    const [k, ...rest] = first.split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

async function startFlow(h: Harness) {
  const res = await h.call('/api/auth/oauth/google/start');
  expect(res.status).toBe(302);
  const location = res.headers.get('Location')!;
  expect(location.startsWith('https://accounts.google.com/o/oauth2/v2/auth?')).toBe(true);
  const cookies = setCookiesOf(res);
  const state = cookieValue(cookies, 'oauth_state');
  const verifier = cookieValue(cookies, 'oauth_verifier');
  const nonce = cookieValue(cookies, 'oauth_nonce');
  expect(state).toBeTruthy();
  expect(verifier).toBeTruthy();
  expect(nonce).toBeTruthy();
  for (const c of cookies) {
    expect(c).toMatch(/HttpOnly/);
    expect(c).toMatch(/SameSite=Lax/);
    expect(c).toMatch(/Max-Age=600/);
    expect(c).toMatch(/Path=\/api\/auth\/oauth/);
  }
  const cookieHeader = cookies.map(c => c.split(';')[0]!).join('; ');
  return { location, state: state!, verifier: verifier!, nonce: nonce!, cookieHeader };
}

async function callbackFlow(h: Harness, cookieHeader: string, state: string, code = 'test-auth-code-1') {
  return await h.call(`/api/auth/oauth/google/callback?code=${code}&state=${state}`, { cookie: cookieHeader });
}

function oauthEnv(): Partial<import('../src/worker/types').Env> {
  return { GOOGLE_CLIENT_ID: CLIENT_ID, GOOGLE_CLIENT_SECRET: CLIENT_SECRET, APP_ORIGIN: ORIGINS };
}

let h: Harness;
beforeAll(async () => {
  keyPair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  );
  badKeyPair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  );
  publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey) as GoogleJwk;
  publicJwk.kid = 'test-kid';
  publicJwk.alg = 'RS256';
  publicJwk.use = 'sig';
});
beforeEach(() => {
  googleBehavior = { exchange: 'ok', jwks: 'ok' };
  lastTokenBody = null;
  vi.stubGlobal('fetch', fakeFetch as typeof fetch);
});
afterEach(() => {
  vi.unstubAllGlobals();
  h?.close();
});

describe('Google OAuth — وحدة lib', () => {
  it('PKCE: متجه RFC 7636 يعطي التحدي المعروف', async () => {
    const { challenge } = await (async () => {
      const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
      const digest = await crypto.subtle.digest('SHA-256', enc.encode(verifier));
      return { challenge: b64url(new Uint8Array(digest)) };
    })();
    expect(challenge).toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
  });

  it('pkcePair: المُحقق 43 حرفًا والتحدي مشتق منه', async () => {
    const { verifier, challenge } = await pkcePair();
    expect(verifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const digest = await crypto.subtle.digest('SHA-256', enc.encode(verifier));
    expect(challenge).toBe(b64url(new Uint8Array(digest)));
  });

  it('buildAuthorizationUrl: كل بارامترات التدفق حاضرة', () => {
    const url = new URL(buildAuthorizationUrl({
      clientId: CLIENT_ID, redirectUri: 'http://localhost:8787/api/auth/oauth/google/callback',
      state: 's1', nonce: 'n1', challenge: 'c1',
    }));
    expect(url.searchParams.get('client_id')).toBe(CLIENT_ID);
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('scope')).toBe('openid email profile');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('state')).toBe('s1');
    expect(url.searchParams.get('nonce')).toBe('n1');
  });

  it('verifyIdToken: توقيع سليم + مطالب صحيحة يُقبل', async () => {
    const token = await makeIdToken({ nonce: 'n1' });
    const id = await verifyIdToken(token, { jwks: [publicJwk as GoogleJwk], clientId: CLIENT_ID, nonce: 'n1', nowMs: Date.now() });
    expect(id.sub).toBe('google-sub-123');
    expect(id.email).toBe(VALID_EMAIL);
    expect(id.name).toBe('Sara Google');
  });

  it('verifyIdToken: توقيع بمفتاح آخر يُرفض', async () => {
    const token = await makeIdToken({ nonce: 'n1' }, badKeyPair.privateKey);
    await expect(verifyIdToken(token, { jwks: [publicJwk as GoogleJwk], clientId: CLIENT_ID, nonce: 'n1', nowMs: Date.now() }))
      .rejects.toThrow('INVALID_ID_TOKEN');
  });

  it('verifyIdToken: aud خاطئ وnonce خاطئ ومنتهٍ وغير موثّق تُرفض', async () => {
    const cases: Array<Record<string, unknown>> = [
      { nonce: 'n1', aud: 'other-client' },
      { nonce: 'wrong-nonce' },
      { nonce: 'n1', exp: Math.floor(Date.now() / 1000) - 3600 },
      { nonce: 'n1', email_verified: false },
      { nonce: 'n1', iss: 'https://evil.example.com' },
    ];
    for (const c of cases) {
      const token = await makeIdToken(c);
      await expect(verifyIdToken(token, { jwks: [publicJwk as GoogleJwk], clientId: CLIENT_ID, nonce: 'n1', nowMs: Date.now() }))
        .rejects.toThrow('INVALID_ID_TOKEN');
    }
  });
});

describe('Google OAuth — تدفق كامل عبر worker.fetch', () => {
  it('start بلا إعداد يُعيد إلى /login?oauth=unavailable ولا يضع كوكيز', async () => {
    h = makeHarness();
    const res = await h.call('/api/auth/oauth/google/start');
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/login?oauth=unavailable');
    expect(setCookiesOf(res)).toHaveLength(0);
  });

  it('start بأصل غير مصرّح يُغلق فشلًا مغلقًا', async () => {
    h = makeHarness({ ...oauthEnv(), APP_ORIGIN: 'http://localhost:5173' });
    const res = await h.call('/api/auth/oauth/google/start');
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/login?oauth=unavailable');
  });

  it('مستخدم جديد عبر Google: حساب + هوية + جلسة، وبريد موثّق، وبلا دخول بكلمة مرور', async () => {
    h = makeHarness(oauthEnv());
    const { state, verifier, nonce, cookieHeader, location } = await startFlow(h);
    expect(new URL(location).searchParams.get('state')).toBe(state);
    signedIdToken = await makeIdToken({ nonce });
    const res = await callbackFlow(h, cookieHeader, state);
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/learn');
    // تبادل الكود أُرسل بالبارامترات الصحيحة
    expect(lastTokenBody?.get('grant_type')).toBe('authorization_code');
    expect(lastTokenBody?.get('code')).toBe('test-auth-code-1');
    expect(lastTokenBody?.get('code_verifier')).toBe(verifier);
    expect(lastTokenBody?.get('redirect_uri')).toBe('http://localhost:8787/api/auth/oauth/google/callback');
    expect(lastTokenBody?.get('client_id')).toBe(CLIENT_ID);
    // جلسة صالحة
    const cookies = setCookiesOf(res);
    const sessionCookie = cookieValue(cookies, 'ses');
    expect(sessionCookie).toBeTruthy();
    // كوكيز OAuth تُمسح في الرد نفسه
    for (const n of ['oauth_state', 'oauth_verifier', 'oauth_nonce']) {
      const cleared = cookies.find(c => c.startsWith(`${n}=`));
      expect(cleared).toMatch(/Max-Age=0/);
    }
    const me = await h.call('/api/auth/me', { cookie: `ses=${sessionCookie}` });
    expect(me.status).toBe(200);
    expect((await h.json<{ user: { email: string } }>(me)).user.email).toBe(VALID_EMAIL);
    // صفوف القاعدة: مستخدم واحد، هوية واحدة، بريد موثّق، اسم من Google
    const users = h.db.raw.prepare('SELECT id, email_verified_at FROM users').all() as Array<{ id: string; email_verified_at: string | null }>;
    expect(users).toHaveLength(1);
    expect(users[0]!.email_verified_at).toBeTruthy();
    const identities = h.db.raw.prepare('SELECT * FROM oauth_identities').all() as Array<Record<string, unknown>>;
    expect(identities).toHaveLength(1);
    expect(identities[0]!.provider).toBe('google');
    expect(identities[0]!.provider_subject).toBe('google-sub-123');
    expect(identities[0]!.user_id).toBe(users[0]!.id);
    const profile = h.db.raw.prepare('SELECT display_name FROM user_profiles WHERE user_id = ?').get(users[0]!.id) as { display_name: string | null };
    expect(profile.display_name).toBe('Sara Google');
    // الدخول بكلمة مرور مستحيل لهذا الحساب (تجزئة عشوائية مرمية)
    const login = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: VALID_EMAIL, password: 'Anything2026pass' }),
    });
    expect(login.status).toBe(401);
    // تغيير كلمة المرور مستحيل أيضًا (لا كلمة حالية صحيحة)
    const change = await h.call('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: 'Anything2026pass', newPassword: 'NewPass2026word' }),
      cookie: `ses=${sessionCookie}`,
    });
    expect(change.status).toBe(401);
  });

  it('حساب قائم بكلمة مرور يُربط بنفس البريد ولا يتكرر، وكلمة مروره تبقى تعمل', async () => {
    h = makeHarness(oauthEnv());
    const { cookie: pwCookie } = await signupAndGetCookie(h);
    expect(pwCookie).toBeTruthy();
    const { state, nonce, cookieHeader } = await startFlow(h);
    signedIdToken = await makeIdToken({ nonce });
    const res = await callbackFlow(h, cookieHeader, state);
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/learn');
    const users = h.db.raw.prepare('SELECT id FROM users').all() as Array<{ id: string }>;
    expect(users).toHaveLength(1);
    const identities = h.db.raw.prepare('SELECT user_id FROM oauth_identities').all() as Array<{ user_id: string }>;
    expect(identities).toHaveLength(1);
    expect(identities[0]!.user_id).toBe(users[0]!.id);
    // كلمة المرور القديمة ما زالت تعمل
    const login = await h.call('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW }),
    });
    expect(login.status).toBe(200);
  });

  it('دخول ثانٍ بنفس حساب Google لا ينشئ مستخدمًا ولا هوية مكررة', async () => {
    h = makeHarness(oauthEnv());
    for (let i = 0; i < 2; i++) {
      const { state, nonce, cookieHeader } = await startFlow(h);
      signedIdToken = await makeIdToken({ nonce });
      const res = await callbackFlow(h, cookieHeader, state, `test-auth-code-${i}`);
      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe('/learn');
    }
    expect((h.db.raw.prepare('SELECT id FROM users').all() as unknown[])).toHaveLength(1);
    expect((h.db.raw.prepare('SELECT id FROM oauth_identities').all() as unknown[])).toHaveLength(1);
  });

  it('state خاطئ يُرفض بلا جلسة', async () => {
    h = makeHarness(oauthEnv());
    const { nonce, cookieHeader } = await startFlow(h);
    signedIdToken = await makeIdToken({ nonce });
    const res = await callbackFlow(h, cookieHeader, 'tampered-state');
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/login?oauth=invalid');
    expect(cookieValue(setCookiesOf(res), 'ses')).toBeNull();
  });

  it('غياب كوكيز التدفق يُرفض', async () => {
    h = makeHarness(oauthEnv());
    signedIdToken = await makeIdToken({ nonce: 'n1' });
    const res = await h.call('/api/auth/oauth/google/callback?code=x&state=s');
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/login?oauth=invalid');
  });

  it('رفض المستخدم عند Google يُعيد denied', async () => {
    h = makeHarness(oauthEnv());
    const res = await h.call('/api/auth/oauth/google/callback?error=access_denied&state=s');
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/login?oauth=denied');
    expect((h.db.raw.prepare('SELECT id FROM users').all() as unknown[])).toHaveLength(0);
  });

  it('فشل تبادل الكود أو JWKS يُعيد failed بلا حساب', async () => {
    for (const behavior of [
      { exchange: 'http500', jwks: 'ok' },
      { exchange: 'no-id-token', jwks: 'ok' },
      { exchange: 'ok', jwks: 'http500' },
      { exchange: 'ok', jwks: 'empty' },
    ] as const) {
      h = makeHarness(oauthEnv());
      googleBehavior = { ...behavior };
      const { state, nonce, cookieHeader } = await startFlow(h);
      signedIdToken = await makeIdToken({ nonce });
      const res = await callbackFlow(h, cookieHeader, state);
      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe('/login?oauth=failed');
      expect((h.db.raw.prepare('SELECT id FROM users').all() as unknown[])).toHaveLength(0);
    }
  });

  it('توكن بتوقيع سليم لكن مطالب خاطئة يُرفض بلا حساب', async () => {
    const badClaims: Array<Record<string, unknown>> = [
      { email_verified: false },
      { aud: 'other-client' },
      { exp: Math.floor(Date.now() / 1000) - 60 },
    ];
    for (const claims of badClaims) {
      h = makeHarness(oauthEnv());
      const { state, nonce, cookieHeader } = await startFlow(h);
      signedIdToken = await makeIdToken({ nonce, ...claims });
      const res = await callbackFlow(h, cookieHeader, state);
      expect(res.headers.get('Location')).toBe('/login?oauth=failed');
      expect((h.db.raw.prepare('SELECT id FROM users').all() as unknown[])).toHaveLength(0);
    }
  });

  it('nonce غير مطابق يُرفض', async () => {
    h = makeHarness(oauthEnv());
    const { state, cookieHeader } = await startFlow(h);
    signedIdToken = await makeIdToken({ nonce: 'someone-elses-nonce' });
    const res = await callbackFlow(h, cookieHeader, state);
    expect(res.headers.get('Location')).toBe('/login?oauth=failed');
    expect((h.db.raw.prepare('SELECT id FROM users').all() as unknown[])).toHaveLength(0);
  });

  it('حساب موقوف لا يحصل على جلسة عبر Google', async () => {
    h = makeHarness(oauthEnv());
    const { state, nonce, cookieHeader } = await startFlow(h);
    signedIdToken = await makeIdToken({ nonce });
    const first = await callbackFlow(h, cookieHeader, state);
    expect(first.headers.get('Location')).toBe('/learn');
    h.db.raw.prepare(`UPDATE users SET status = 'suspended'`).run();
    const second = await startFlow(h);
    signedIdToken = await makeIdToken({ nonce: second.nonce });
    const res = await callbackFlow(h, second.cookieHeader, second.state, 'test-auth-code-2');
    expect(res.headers.get('Location')).toBe('/login?oauth=failed');
    expect(cookieValue(setCookiesOf(res), 'ses')).toBeNull();
  });
});
