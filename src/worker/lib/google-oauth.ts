/* ============================================================================
   Google OAuth 2.0 — authorization code + PKCE، والتحقق من ID token
   ----------------------------------------------------------------------------
   النطاق: الهوية فقط (openid email profile) — بلا وصول إلى أي API من Google،
   وبلا طلب offline access (لا refresh tokens؛ الـID token يُستخدم مرة واحدة
   لإثبات الهوية ثم تُبنى جلسة المنصة المعتادة).
   تبادل الكود والتحقق من التوقيع على الخادم حصرًا؛ السر لا يغادر Worker.
   لا اعتماديات خارجية: WebCrypto + fetch فقط (يعملان في workerd وNode).
   ========================================================================== */
import type { Env } from '../types';
import { b64url, fromB64url, randomToken } from './crypto';

export const OAUTH_CALLBACK_PATH = '/api/auth/oauth/google/callback';
export const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
export const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];
export const GOOGLE_SCOPES = 'openid email profile';

const enc = new TextEncoder();
const dec = new TextDecoder();

/** كل أعطال OAuth تُصنَّف هنا — المسارات تترجمها إلى ردّ عام بلا تفاصيل مزوّد. */
export class OAuthError extends Error {
  constructor(
    public code:
      | 'OAUTH_NOT_CONFIGURED'
      | 'OAUTH_REDIRECT_MISMATCH'
      | 'OAUTH_EXCHANGE_FAILED'
      | 'INVALID_ID_TOKEN',
  ) {
    super(code);
  }
}

/** زوج PKCE: المُحقق (يُحفظ في كوكي قصير العمر) وتحدّيه S256. */
export async function pkcePair(): Promise<{ verifier: string; challenge: string }> {
  const verifier = randomToken(32); // 43 حرفًا b64url — ضمن نطاق RFC 7636
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(verifier));
  return { verifier, challenge: b64url(new Uint8Array(digest)) };
}

export function buildAuthorizationUrl(args: {
  clientId: string;
  redirectUri: string;
  state: string;
  nonce: string;
  challenge: string;
}): string {
  const q = new URLSearchParams({
    client_id: args.clientId,
    redirect_uri: args.redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    state: args.state,
    nonce: args.nonce,
    code_challenge: args.challenge,
    code_challenge_method: 'S256',
  });
  return `${GOOGLE_AUTHORIZATION_URL}?${q.toString()}`;
}

/**
 * رابط الرجوع يُشتق من أصل الطلب نفسه، ويجب أن يكون ضمن APP_ORIGIN صراحةً.
 * رابط غير مصرّح = خطأ إعداد ⇒ فشل مغلق، لا تخمين ولا رجوع افتراضي.
 */
export function resolveRedirectUri(req: Request, env: Env): string {
  const origin = new URL(req.url).origin;
  const allowed = env.APP_ORIGIN.split(',').map(s => s.trim());
  if (!allowed.includes(origin)) throw new OAuthError('OAUTH_REDIRECT_MISMATCH');
  return origin + OAUTH_CALLBACK_PATH;
}

/** تبادل الكود مقابل ID token. fetchFn يُحقن صراحةً لتُختبر الوحدة بلا شبكة. */
export async function exchangeCode(args: {
  code: string;
  verifier: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
  fetchFn: typeof fetch;
}): Promise<{ idToken: string }> {
  const body = new URLSearchParams({
    code: args.code,
    client_id: args.clientId,
    client_secret: args.clientSecret,
    redirect_uri: args.redirectUri,
    grant_type: 'authorization_code',
    code_verifier: args.verifier,
  });
  let res: Response;
  try {
    res = await args.fetchFn(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: body.toString(),
    });
  } catch {
    throw new OAuthError('OAUTH_EXCHANGE_FAILED');
  }
  if (!res.ok) throw new OAuthError('OAUTH_EXCHANGE_FAILED');
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new OAuthError('OAUTH_EXCHANGE_FAILED');
  }
  const idToken = (data as { id_token?: unknown } | null)?.id_token;
  if (typeof idToken !== 'string' || !idToken) throw new OAuthError('OAUTH_EXCHANGE_FAILED');
  return { idToken };
}

export interface GoogleJwk {
  kty?: unknown;
  kid?: unknown;
  n?: unknown;
  e?: unknown;
  alg?: unknown;
  use?: unknown;
}

interface Jwk extends GoogleJwk {}

export async function fetchJwks(fetchFn: typeof fetch): Promise<Jwk[]> {
  let res: Response;
  try {
    res = await fetchFn(GOOGLE_JWKS_URL, { headers: { Accept: 'application/json' } });
  } catch {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  if (!res.ok) throw new OAuthError('INVALID_ID_TOKEN');
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  const keys = (data as { keys?: unknown } | null)?.keys;
  if (!Array.isArray(keys) || !keys.length) throw new OAuthError('INVALID_ID_TOKEN');
  return keys as Jwk[];
}

function parseJwtPart(part: string): Record<string, unknown> {
  let bytes: Uint8Array;
  try {
    bytes = fromB64url(part);
  } catch {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  try {
    const parsed: unknown = JSON.parse(dec.decode(bytes));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape');
    return parsed as Record<string, unknown>;
  } catch {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
}

export interface GoogleIdentity {
  sub: string;
  email: string;
  name: string | null;
}

/**
 * التحقق الكامل من ID token: التوقيع RS256 بمفتاح JWKS المطابق لـkid،
 * ثم iss/aud/exp/iat/nonce، ثم بريد موثّق من Google. أي فشل = رفض صامت.
 * لا يُقبل بريد غير موثّق: ربطه بحساب محلي كان سيمنح هوية بلا إثبات ملكية.
 */
export async function verifyIdToken(
  idToken: string,
  args: { jwks: Jwk[]; clientId: string; nonce: string; nowMs: number },
): Promise<GoogleIdentity> {
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new OAuthError('INVALID_ID_TOKEN');
  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];
  const header = parseJwtPart(headerB64);
  if (header.alg !== 'RS256' || typeof header.kid !== 'string' || !header.kid) {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  const jwk = args.jwks.find(k => k.kid === header.kid);
  if (!jwk || jwk.kty !== 'RSA' || typeof jwk.n !== 'string' || typeof jwk.e !== 'string') {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      'jwk',
      { kty: 'RSA', n: jwk.n, e: jwk.e, alg: 'RS256', ext: true } as JsonWebKey,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
  } catch {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  let signature: Uint8Array;
  try {
    signature = fromB64url(sigB64);
  } catch {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    signature as BufferSource,
    enc.encode(`${headerB64}.${payloadB64}`),
  );
  if (!valid) throw new OAuthError('INVALID_ID_TOKEN');

  const payload = parseJwtPart(payloadB64);
  const nowSec = Math.floor(args.nowMs / 1000);
  if (typeof payload.iss !== 'string' || !GOOGLE_ISSUERS.includes(payload.iss)) {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  const aud = payload.aud;
  const audOk = aud === args.clientId || (Array.isArray(aud) && aud.includes(args.clientId));
  if (!audOk) throw new OAuthError('INVALID_ID_TOKEN');
  if (typeof payload.exp !== 'number' || payload.exp <= nowSec - 60) {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  if (typeof payload.iat !== 'number' || payload.iat > nowSec + 300) {
    throw new OAuthError('INVALID_ID_TOKEN');
  }
  if (payload.nonce !== args.nonce) throw new OAuthError('INVALID_ID_TOKEN');
  if (typeof payload.sub !== 'string' || !payload.sub) throw new OAuthError('INVALID_ID_TOKEN');
  if (typeof payload.email !== 'string' || !payload.email) throw new OAuthError('INVALID_ID_TOKEN');
  if (payload.email_verified !== true) throw new OAuthError('INVALID_ID_TOKEN');
  return {
    sub: payload.sub,
    email: payload.email,
    name: typeof payload.name === 'string' ? payload.name : null,
  };
}
