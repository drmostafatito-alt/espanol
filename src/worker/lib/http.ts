/* ============================================================================
   أدوات HTTP: استجابات موحّدة، رؤوس أمنية، تحقق الأصل، معرّف طلب
   ========================================================================== */
import type { Env } from '../types';

export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  // لا نحتاج أي واجهة جهاز؛ الإذن الأضيق هو الصحيح افتراضًا
  'Permissions-Policy': 'microphone=(), camera=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
};

/**
 * HTTPS فقط عندما تكون *كل* الأصول المكوَّنة https — القائمة قد تحوي عدة أصول
 * مفصولة بفواصل، و`startsWith` على السلسلة كلها كان يقرر Secure/__Host-/HSTS
 * من الأصل الأول فقط. قائمة مختلطة = إعداد خاطئ ⇒ لا ندّعي Secure (فشل آمن).
 */
export function isHttpsOnly(env: Env): boolean {
  const origins = (env.APP_ORIGIN ?? '').split(',').map(s => s.trim()).filter(Boolean);
  return origins.length > 0 && origins.every(o => o.startsWith('https://'));
}

/** HSTS يُرسَل فقط على HTTPS. */
export function securityHeadersFor(env: Env): Record<string, string> {
  const h: Record<string, string> = { ...SECURITY_HEADERS };
  if (isHttpsOnly(env)) {
    h['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }
  return h;
}

export function newRequestId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return 'req_' + [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}

function baseHeaders(headers: Headers, requestId?: string): Headers {
  // Vary دائمًا: يمنع أي كاش وسيط من تخزين استجابة مبنية على Origin
  if (!headers.has('Vary')) headers.set('Vary', 'Origin');
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  if (requestId) headers.set('X-Request-Id', requestId);
  return headers;
}

export function json(data: unknown, init: ResponseInit = {}, requestId?: string): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  // الافتراضي: بلا تخزين — إلا إذا حدّد المسار سياسة كاش عامة صريحة (محتوى عام فقط)
  if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers: baseHeaders(headers, requestId) });
}

/** خطأ موحّد برمز داخلي مستقر + رسالة عربية للمستخدم. لا تُكشف تفاصيل داخلية. */
export function apiError(status: number, code: string, messageAr: string, requestId?: string, extra?: Record<string, unknown>): Response {
  return json({ error: { code, message: messageAr, ...extra } }, { status }, requestId);
}

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * حماية CSRF بثلاث طبقات:
 *  1) كوكي الجلسة SameSite=Lax (+ __Host- على HTTPS) ⇒ لا يُرسَل مع طلب مستقل عبر المواقع.
 *  2) فحص Origin / Sec-Fetch-Site لكل طلب يغيّر الحالة.
 *  3) إلزام Content-Type: application/json لأي طلب له جسم ⇒ يُخرج طلبات HTML forms
 *     البسيطة (text/plain, application/x-www-form-urlencoded) خارج اللعبة تمامًا،
 *     وهي الطريقة الوحيدة لإرسال طلب بسيط عبر المواقع بلا preflight.
 *
 * الطلبات غير المتصفح (curl/اختبارات/تكامل خادم-إلى-خادم) لا تحمل Origin ولا كوكي متصفح،
 * فلا ينطبق عليها CSRF أصلًا — لكنها تبقى ملزمة بالمصادقة والصلاحيات.
 */
export function isOriginAllowed(req: Request, env: Env): boolean {
  if (!UNSAFE_METHODS.has(req.method)) return true;
  const origin = req.headers.get('Origin');
  const site = req.headers.get('Sec-Fetch-Site');
  const allowed = env.APP_ORIGIN.split(',').map(s => s.trim());

  // المتصفح يعلن دائمًا عن سياق الطلب في المتصفحات الحديثة
  if (site === 'cross-site') return false;
  if (site === 'same-origin') return true;
  if (origin) return allowed.includes(origin);
  // لا Origin ولا Sec-Fetch-Site: عميل غير متصفح. لا كوكي متصفح ⇒ لا CSRF.
  return true;
}

/** يرفض أي طلب يغيّر الحالة وله جسم بلا Content-Type: application/json. */
export function assertJsonContentType(req: Request): void {
  if (!UNSAFE_METHODS.has(req.method)) return;
  // Request في workerd/undici قد لا يحمل Content-Length؛ الحكم على وجود جسم فعلي
  const hasBody = req.body !== null || Number(req.headers.get('Content-Length') || 0) > 0 || !!req.headers.get('Transfer-Encoding');
  if (!hasBody) return;
  const ct = (req.headers.get('Content-Type') || '').toLowerCase();
  if (!ct.startsWith('application/json')) {
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', 'نوع المحتوى غير مدعوم؛ يُتوقع application/json.');
  }
}

export function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  if (!origin) return {};
  const allowed = env.APP_ORIGIN.split(',').map(s => s.trim());
  if (!allowed.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  };
}

export async function readJson<T>(req: Request, maxBytes = 64 * 1024): Promise<T> {
  const len = Number(req.headers.get('Content-Length') || 0);
  if (len > maxBytes) throw new HttpError(413, 'PAYLOAD_TOO_LARGE', 'حجم الطلب كبير جدًا.');
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, 'PAYLOAD_TOO_LARGE', 'حجم الطلب كبير جدًا.');
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, 'INVALID_JSON', 'صيغة الطلب غير صحيحة.');
  }
}

export class HttpError extends Error {
  constructor(public status: number, public code: string, public messageAr: string, public extra?: Record<string, unknown>) {
    super(code);
  }
}

export function cookieName(env: Env): string {
  // __Host- يتطلب Secure + Path=/ + بلا Domain — لا يعمل على http في التطوير المحلي
  return isHttpsOnly(env) ? '__Host-ses' : 'ses';
}

function cookieAttrs(env: Env, maxAge: number): string[] {
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAge}`, 'Priority=High'];
  if (isHttpsOnly(env)) attrs.push('Secure');
  return attrs;
}

export function serializeSessionCookie(env: Env, token: string, maxAgeDays: number): string {
  return [`${cookieName(env)}=${token}`, ...cookieAttrs(env, maxAgeDays * 24 * 60 * 60)].join('; ');
}

export function clearSessionCookie(env: Env): string {
  return [`${cookieName(env)}=`, ...cookieAttrs(env, 0)].join('; ');
}

export function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.get('Cookie');
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}
