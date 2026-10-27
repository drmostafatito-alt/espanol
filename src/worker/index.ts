/* ============================================================================
   Worker API — Español بالعربي
   المسؤوليات: /api فقط + تمرير بقية الطلبات إلى Static Assets.
   لا SSR (سبب: حد 10ms CPU على الخطة المجانية) — انظر docs/02_ARCHITECTURE.md
   ========================================================================== */
import type { Env, SessionUser } from './types';
import {
  HttpError, apiError, assertJsonContentType, corsHeaders, isOriginAllowed,
  json, newRequestId, readSessionToken, securityHeadersFor, isNonProductionEnv } from './lib/http';
import { findSessionUser, getPublicSettings } from './db';
import { adminAudit, changePassword, login, logout, me, revokeAllSessions, signup, updateMe } from './routes/auth';
import { getLesson, listPaths, reviewLesson, searchContent, setLessonPublished } from './routes/content';
import { completeLesson, lessonSession, myProgress, startPlacementTest, submitAnswer, submitPlacementTest } from './routes/learn';
import { listPacks, reviewSession, startPack, submitReview } from './routes/review';

interface Ctx {
  requestId: string;
  user: SessionUser | null;
  params: Record<string, string>;
}

type Handler = (req: Request, env: Env, ctx: Ctx) => Promise<Response>;
interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  handler: Handler;
  auth: 'none' | 'session' | 'optional';
  /** صلاحية مطلوبة — تُفحص مركزيًا قبل استدعاء المعالج (دفاع في العمق). */
  perm?: string;
}

function route(
  method: string,
  path: string,
  handler: Handler,
  auth: 'none' | 'session' | 'optional' = 'none',
  perm?: string,
): Route {
  const keys: string[] = [];
  const pattern = new RegExp(
    '^' +
      path.replace(/:[a-zA-Z]+/g, m => {
        keys.push(m.slice(1));
        return '([^/]+)';
      }) +
      '$',
  );
  return { method, pattern, keys, handler, auth, perm };
}

const routes: Route[] = [
  route('GET', '/api/health', async (_req, env, ctx) => {
    const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM levels').first<{ n: number }>();
    return json(
      {
        ok: true,
        env: env.ENVIRONMENT,
        db: { reachable: true, levels: row?.n ?? 0 },
        time: new Date().toISOString(),
        requestId: ctx.requestId,
      },
      {},
      ctx.requestId,
    );
  }),

  route('GET', '/api/settings/public', async (_req, env, ctx) => {
    const settings = await getPublicSettings(env.DB);
    return json({ settings }, { headers: { 'Cache-Control': 'public, max-age=60' } }, ctx.requestId);
  }),

  route('POST', '/api/auth/signup', (req, env, ctx) => signup(req, env, ctx.requestId)),
  route('POST', '/api/auth/login', (req, env, ctx) => login(req, env, ctx.requestId)),
  route('POST', '/api/auth/logout', (req, env, ctx) => logout(req, env, ctx.requestId)),
  route('POST', '/api/auth/change-password', (req, env, ctx) => changePassword(req, env, ctx.requestId, ctx.user!), 'session'),
  route('POST', '/api/auth/sessions/revoke-all', (req, env, ctx) => revokeAllSessions(req, env, ctx.requestId, ctx.user!), 'session'),
  route('GET', '/api/auth/me', (req, env, ctx) => me(req, env, ctx.requestId)),

  route('PATCH', '/api/me', (req, env, ctx) => updateMe(req, env, ctx.requestId, ctx.user!), 'session'),
  route('GET', '/api/admin/audit', (req, env, ctx) => adminAudit(req, env, ctx.requestId, ctx.user!), 'session', 'audit.read'),
  route('POST', '/api/admin/lessons/:slug/review', (req, env, ctx) => reviewLesson(req, env, ctx.requestId, ctx.user!), 'session', 'content.review_es'),
  route('POST', '/api/admin/lessons/:slug/publish', (req, env, ctx) => setLessonPublished(req, env, ctx.requestId, ctx.user!, true), 'session', 'content.publish'),
  route('POST', '/api/admin/lessons/:slug/unpublish', (req, env, ctx) => setLessonPublished(req, env, ctx.requestId, ctx.user!, false), 'session', 'content.publish'),

  route('GET', '/api/content/paths', (req, env, ctx) => listPaths(req, env, ctx.requestId)),
  route('GET', '/api/content/search', (req, env, ctx) => searchContent(req, env, ctx.requestId)),
  route('GET', '/api/content/lessons/:slug', (req, env, ctx) => getLesson(req, env, ctx.requestId, ctx.user), 'optional'),

  // ---- المرحلة 2: التعلم ----
  route('GET', '/api/me/progress', (req, env, ctx) => myProgress(req, env, ctx.requestId, ctx.user!), 'session'),
  route('POST', '/api/me/placement/start', (req, env, ctx) => startPlacementTest(req, env, ctx.requestId, ctx.user!), 'session', 'learn.read'),
  route('POST', '/api/me/placement', (req, env, ctx) => submitPlacementTest(req, env, ctx.requestId, ctx.user!), 'session', 'learn.submit'),
  route('GET', '/api/lessons/:slug/session', (req, env, ctx) => lessonSession(req, env, ctx.requestId, ctx.user!), 'session', 'learn.read'),
  route('POST', '/api/lessons/:slug/answers', (req, env, ctx) => submitAnswer(req, env, ctx.requestId, ctx.user!), 'session', 'learn.submit'),
  route('POST', '/api/lessons/:slug/complete', (req, env, ctx) => completeLesson(req, env, ctx.requestId, ctx.user!), 'session', 'learn.submit'),

  // ---- المرحلة 3: المراجعة المتباعدة ----
  route('GET', '/api/review/session', (req, env, ctx) => reviewSession(req, env, ctx.requestId, ctx.user!), 'session', 'learn.read'),
  route('POST', '/api/review/answers', (req, env, ctx) => submitReview(req, env, ctx.requestId, ctx.user!), 'session', 'learn.submit'),
  route('GET', '/api/review/packs', (req, env, ctx) => listPacks(req, env, ctx.requestId, ctx.user!), 'session', 'learn.read'),
  route('POST', '/api/review/packs/:slug/start', (req, env, ctx) => startPack(req, env, ctx.requestId, ctx.user!), 'session', 'learn.submit'),
];

async function resolveUser(req: Request, env: Env): Promise<SessionUser | null> {
  const token = readSessionToken(req);
  if (!token) return null;
  return await findSessionUser(env, token);
}

/**
 * فحص إعدادات إلزامية. الفشل المغلق: بلا سر لـpepper لا تُخدم المصادقة إطلاقًا،
 * بدل أن تعمل صامتة بحماية أقل. الرسالة للمستخدم عامة والسبب في السجل.
 */
function configError(env: Env): string | null {
  if (env.ENVIRONMENT === 'test') return null;
  const pepper = env.PASSWORD_PEPPER ?? '';
  if (!pepper) return 'PASSWORD_PEPPER_MISSING';
  if (pepper.length < 32) return 'PASSWORD_PEPPER_TOO_SHORT';
  if (!env.APP_ORIGIN) return 'APP_ORIGIN_MISSING';
  return null;
}

/** AUD-23: منع التضمين صارم في الإنتاج، ومفتوح في بيئات التطوير/المعاينة فقط */
function frameAncestors(env: Env): string {
  return isNonProductionEnv(env) ? '*' : "'none'";
}

function withSecurity(res: Response, origin: string | null, env: Env): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(securityHeadersFor(env))) if (!headers.has(k)) headers.set(k, v);
  for (const [k, v] of Object.entries(corsHeaders(origin, env))) headers.set(k, v);
  if (headers.get('Content-Type')?.includes('text/html')) {
    headers.set(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-ancestors " + frameAncestors(env) + "; base-uri 'none'; form-action 'self'",
    );
  }
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

/**
 * خدمة الأصول الثابتة مع رؤوس الأمان.
 * لماذا هنا وليس عبر public/_headers؟ لأن ذلك الملف لا يُطبَّق في workerd المحلي،
 * ولا يمكن التحقق منه محليًا — وهذا المشروع لا يعتمد ما لا يمكن التحقق منه.
 * المقايضة: كل طلب أصل يُحتسب ضمن حصة طلبات Worker (100k/يوم في المجاني).
 */
async function serveAsset(request: Request, env: Env, url: URL): Promise<Response> {
  const res = await env.ASSETS!.fetch(request);
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(securityHeadersFor(env))) headers.set(k, v);

  // ملفات الوسائط غير الموجودة لا تُخدم بصفحة HTML من SPA fallback.
  // نعيد 404 حقيقيًا حتى يفشل المشغّل بوضوح بدل تشغيل HTML.
  if (url.pathname.startsWith('/audio/') && (headers.get('Content-Type') ?? '').includes('text/html')) {
    return new Response('Not found', { status: 404, headers: securityHeadersFor(env) });
  }

  const isHtml = (headers.get('Content-Type') ?? '').includes('text/html');
  if (isHtml) {
    headers.set(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; worker-src 'self'; " +
        "frame-ancestors " + frameAncestors(env) + "; base-uri 'none'; form-action 'self'; object-src 'none'",
    );
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  } else if (url.pathname.startsWith('/assets/')) {
    // أسماء مُبصَّمة بالمحتوى (hash) ⇒ كاش طويل آمن
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = newRequestId();
    const origin = request.headers.get('Origin');
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }

    // API فقط؛ الباقي للأصول الثابتة (SPA)
    if (!url.pathname.startsWith('/api/')) {
      if (!env.ASSETS) return new Response('Not found', { status: 404 });
      return serveAsset(request, env, url);
    }

    try {
      // حماية CSRF: تحقق الأصل + إلزام JSON لأي طلب يغيّر الحالة وله جسم
      if (!isOriginAllowed(request, env)) {
        throw new HttpError(403, 'ORIGIN_NOT_ALLOWED', 'طلب من أصل غير مسموح.');
      }
      assertJsonContentType(request);

      const cfg = configError(env);
      if (cfg) {
        console.error(JSON.stringify({ level: 'error', requestId, event: 'config', code: cfg }));
        // مسارات القراءة العامة تبقى تعمل؛ المصادقة لا.
        const authPath = url.pathname.startsWith('/api/auth/') || url.pathname.startsWith('/api/me');
        if (authPath) throw new HttpError(503, 'AUTH_UNAVAILABLE', 'تسجيل الدخول غير متاح مؤقتًا. حاول لاحقًا.');
      }

      const match = routes.find(r => r.method === request.method && r.pattern.test(url.pathname));
      if (!match) throw new HttpError(404, 'NOT_FOUND', 'المسار غير موجود.');

      const m = match.pattern.exec(url.pathname)!;
      const params: Record<string, string> = {};
      match.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1] ?? '')));

      let user: SessionUser | null = null;
      if (match.auth === 'session') {
        user = await resolveUser(request, env);
        if (!user) throw new HttpError(401, 'UNAUTHENTICATED', 'يلزم تسجيل الدخول.');
      } else if (match.auth === 'optional' || request.method !== 'GET') {
        // مسارات عامة مع جلسة اختيارية (معاينة المحتوى) أو طلبات كتابة (تحديد المستخدم للتدقيق)
        user = await resolveUser(request, env);
      }

      // فحص الصلاحية مركزيًا — لا يعتمد فقط على فحص داخل المعالج
      if (match.perm && !user?.permissions.includes(match.perm)) {
        throw new HttpError(403, 'FORBIDDEN', 'لا تملك صلاحية الوصول إلى هذا المورد.');
      }

      const res = await match.handler(request, env, { requestId, user, params });
      return withSecurity(res, origin, env);
    } catch (err) {
      if (err instanceof HttpError) {
        return withSecurity(apiError(err.status, err.code, err.messageAr, requestId, err.extra), origin, env);
      }
      // لا نكشف تفاصيل داخلية للمستخدم؛ نسجّل معرّف الطلب للتحقيق
      console.error(JSON.stringify({ level: 'error', requestId, path: url.pathname, message: String(err) }));
      return withSecurity(
        apiError(500, 'INTERNAL_ERROR', 'حدث خطأ غير متوقع. حاول لاحقًا، وإذا تكرر أرسل لنا معرّف الطلب.', requestId),
        origin,
        env,
      );
    }
  },
};
