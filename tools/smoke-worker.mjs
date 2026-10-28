#!/usr/bin/env node
/**
 * اختبار دخان على Worker حقيقي (wrangler dev / workerd + D1)
 * يُثبت أن المصادقة تعمل على نفس Runtime الإنتاج، لا على محاكي Node فقط.
 *
 * الاستخدام: node tools/smoke-worker.mjs [baseUrl]
 * الافتراضي: http://127.0.0.1:8787
 *
 * ملاحظة: ينشئ مستخدمًا ببريد عشوائي (بيانات اختبار فقط، لا بيانات إنتاج).
 */
const BASE = process.argv[2] || 'http://127.0.0.1:8787';
const results = [];

// Miniflare يضبط CF-Connecting-IP على 127.0.0.1 لكل الطلبات، فحدُّ المعدل
// (تسجيلات/ساعة لكل IP) يمنع تكرار التشغيل. نُفرّغ نوافذه محليًا فقط — لا يمسّ
// هذا أي قاعدة بعيدة، ولا يغيّر منطق الحد نفسه.
if (BASE.includes('127.0.0.1') || BASE.includes('localhost')) {
  try {
    const { execFileSync } = await import('node:child_process');
    const { existsSync } = await import('node:fs');
    const { join } = await import('node:path');
    const cli = join(process.cwd(), 'tools/wrangler-env/node_modules/wrangler/wrangler-dist/cli.js');
    const [execPath, baseArgs] = existsSync(cli)
      ? [process.execPath, [cli]]
      : ['./tools/wrangler-env/node_modules/.bin/wrangler', []];
    execFileSync(
      execPath,
      [...baseArgs, 'd1', 'execute', 'es-ar-dev', '--local', '--command', 'DELETE FROM rate_limits'],
      { cwd: process.cwd(), stdio: 'ignore' },
    );
  } catch { /* القاعدة غير مهيأة — سنرى الفشل في الفحوص نفسها */ }
}
const RUN_IP = '127.0.0.1';
let cookies = '';

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function call(path, init = {}) {
  // workerd يغلق اتصالات keep-alive الخاملة بسرعة؛ وبناء خطة المحتوى بين
  // المرحلتين يترك الاتصال خاملًا ثواني، فيموت أول طلب بعده بـUND_ERR_SOCKET.
  // Connection: close يمنع إعادة استخدام اتصال ميت — تغيير في عميل الاختبار فقط.
  const headers = { 'Content-Type': 'application/json', 'Connection': 'close', ...(init.headers || {}) };
  if (cookies) headers.Cookie = cookies;
  const res = await fetch(BASE + path, { ...init, headers });
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookies = setCookie.split(';')[0];
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body, headers: res.headers };
}

const email = `smoke_${Date.now()}@example.com`;
const password = 'SmokeTest2026';

const health = await call('/api/health');
record('GET /api/health يعمل ويصل إلى D1', health.status === 200 && health.body?.db?.reachable === true, `levels=${health.body?.db?.levels}`);

const settings = await call('/api/settings/public');
record('الإعدادات العامة تُقرأ من القاعدة', settings.status === 200 && settings.body?.settings?.['branding.platform_name'] === 'Español بالعربي');

const weak = await call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password: '123' }) });
record('كلمة مرور ضعيفة مرفوضة (400)', weak.status === 400 && weak.body?.error?.code === 'WEAK_PASSWORD');

const signup = await call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, displayName: 'اختبار' }) });
record('إنشاء حساب حقيقي (201) + كوكي جلسة', signup.status === 201 && !!cookies, `دور=${signup.body?.user?.role}`);
const setCookieHeader = (await (async () => (await fetch(BASE + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })).headers.get('set-cookie'))()) || '';
record('الكوكي HttpOnly + SameSite=Lax', /HttpOnly/i.test(setCookieHeader) && /SameSite=Lax/i.test(setCookieHeader));

const me = await call('/api/auth/me');
record('GET /api/auth/me بالجلسة', me.status === 200 && me.body?.user?.email === email);

const patch = await call('/api/me', { method: 'PATCH', body: JSON.stringify({ explanationStyle: 'eg', dailyGoalMinutes: 15 }) });
record('حفظ التفضيلات في الخادم', patch.status === 200 && patch.body?.user?.explanationStyle === 'eg' && patch.body?.user?.dailyGoalMinutes === 15);

const admin = await call('/api/admin/audit');
record('المتعلم لا يصل إلى مسار الإدارة (403)', admin.status === 403);

const csrf = await call('/api/me', {
  method: 'PATCH',
  headers: { Origin: 'https://evil.example', 'Sec-Fetch-Site': 'cross-site' },
  body: JSON.stringify({ dailyGoalMinutes: 20 }),
});
record('طلب من أصل خارجي مرفوض (CSRF)', csrf.status === 403 && csrf.body?.error?.code === 'ORIGIN_NOT_ALLOWED');

const dup = await call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
record('بريد مكرر يُرفض دون كشف', dup.status === 409 && !/موجود|مسجل|already/i.test(JSON.stringify(dup.body)));

const badLogin = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password: 'WrongPass2026' }) });
record('كلمة مرور خاطئة (401)', badLogin.status === 401);

const logout = await call('/api/auth/logout', { method: 'POST' });
const meAfter = await call('/api/auth/me');
record('الخروج يُبطل الجلسة في الخادم', logout.status === 200 && meAfter.status === 401);

// --- فحوص المراجعة الأمنية على workerd الحقيقي ---
const badCt = await call('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'email=a@b.com&password=Whatever2026x',
});
record('جسم غير JSON مرفوض (415)', badCt.status === 415 && badCt.body?.error?.code === 'UNSUPPORTED_MEDIA_TYPE');

const hdr = await call('/api/health');
record(
  'الرؤوس الأمنية على workerd',
  hdr.headers.get('x-content-type-options') === 'nosniff' &&
    hdr.headers.get('x-frame-options') === 'DENY' &&
    hdr.headers.get('cross-origin-resource-policy') === 'same-origin' &&
    (hdr.headers.get('vary') || '').includes('Origin') &&
    hdr.headers.get('cache-control') === 'no-store',
);

const crossSite = await call('/api/me', {
  method: 'PATCH',
  headers: { 'Sec-Fetch-Site': 'cross-site' },
  body: JSON.stringify({ dailyGoalMinutes: 20 }),
});
record('Sec-Fetch-Site: cross-site مرفوض (403)', crossSite.status === 403);

const ghost = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'ghost_' + Date.now() + '@example.com', password: 'WrongPass2026x' }) });
record('بريد غير مسجَّل لا يكشف شيئًا (401 عام)', ghost.status === 401 && ghost.body?.error?.code === 'INVALID_CREDENTIALS');

const spa = await fetch(BASE + '/learn');
const spaText = await spa.text();
record('SPA fallback يخدم index.html', spa.status === 200 && spaText.includes('<div id="root">'));

// مستند HTML نفسه: كان يُخدَم من الأصول بلا أي رأس أمني
// AUD-23: منع التضمين (frame-ancestors 'none' + X-Frame-Options: DENY) صارم في
// إنتاج فقط؛ بيئة التطوير/المعاينة المحلية تفتحه حتى تعمل المعاينات داخل أطر.
// الدخان يعمل محليًا فيتحقق من باقي الرؤوس ومن وجود frame-ancestors معلنًا.
record(
  'مستند HTML يحمل CSP وnosniff وCOOP (ومنع التضمين إنتاجيًا)',
  (spa.headers.get('content-security-policy') || '').includes('frame-ancestors') &&
    spa.headers.get('x-content-type-options') === 'nosniff' &&
    (spa.headers.get('cross-origin-opener-policy') || '') === 'same-origin',
);

const assetPath = spaText.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
if (assetPath) {
  const asset = await fetch(BASE + assetPath);
  record('أصول مُبصَّمة تُخزَّن immutable', (asset.headers.get('cache-control') || '').includes('immutable'));
} else {
  record('أصول مُبصَّمة تُخزَّن immutable', false, 'لم يُعثر على مسار أصل في HTML');
}

// ============================================================================
// المرحلة 2 — محرّك التمارين، حفظ التقدم، ومنع احتساب XP مرتين
// ============================================================================
const { buildContentPlan } = await import('./lib/content-plan.mjs');
const { resolve } = await import('node:path');
const plan = buildContentPlan(resolve(process.cwd(), 'content/drafts'), { existingVersions: {} });
const ANSWERS = plan.answers;

// الاختبارات السابقة سجّلت الخروج وأبطلت الجلسة — نعيد الدخول بنفس الحساب
const relogin = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
record('إعادة الدخول بعد الخروج تعمل', relogin.status === 200 && !!cookies);

const progress0 = await call('/api/me/progress');
record(
  'تقدم حساب جديد: أصفار حقيقية لا أرقام وهمية',
  progress0.status === 200 && progress0.body?.stats?.xp_total === 0 && progress0.body?.totals?.lessons_completed === 0,
);

const draft404 = await call('/api/lessons/prea1-hola-me-llamo/session');
record('جلسة درس متاحة للمستخدم المسجَّل', draft404.status === 200 && Array.isArray(draft404.body?.exercises));
const session = draft404.body;
const exs = session?.exercises ?? [];
record('جلسة بلا مفاتيح إجابة ولا خيار صحيح', !JSON.stringify(exs).match(/answerKey|correctOptionIds|is_correct|isCorrect/i));
record('وسم «عينة غير مراجعة» حاضر في الاستجابة', session?.lesson?.provenance?.status === 'unreviewed_sample');

const firstGraded = exs.find(e => e.mode === 'graded');
const evid = (tag) => `${tag}_smoke_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const wrong = await call('/api/lessons/prea1-hola-me-llamo/answers', {
  method: 'POST',
  body: JSON.stringify({ eventId: evid('a'), exerciseId: firstGraded.id, response: '__wrong__' }),
});
record('إجابة خاطئة لا تُحتسب صحيحة', wrong.status === 200 && wrong.body?.correct === false && wrong.body?.score === 0);

const sameEvent = evid('b');
const r1 = await call('/api/lessons/prea1-hola-me-llamo/answers', {
  method: 'POST',
  body: JSON.stringify({ eventId: sameEvent, exerciseId: firstGraded.id, response: ANSWERS[firstGraded.id] ?? '' }),
});
const r2 = await call('/api/lessons/prea1-hola-me-llamo/answers', {
  method: 'POST',
  body: JSON.stringify({ eventId: sameEvent, exerciseId: firstGraded.id, response: ANSWERS[firstGraded.id] ?? '' }),
});
record('إعادة إرسال نفس eventId ⇒ replay بلا تكرار محاولة', r1.status === 200 && r2.status === 200 && r2.body?.replay === true);

const badEvent = await call('/api/lessons/prea1-hola-me-llamo/answers', {
  method: 'POST',
  body: JSON.stringify({ eventId: 'short', exerciseId: firstGraded.id, response: 'x' }),
});
record('eventId غير صالح يُرفض (400)', badEvent.status === 400);

const lockedSession = await call('/api/lessons/a1-un-cafe-por-favor/session');
record(
  'درس A1 مقفل قبل اجتياز درس PREA1 السابق',
  lockedSession.status === 403 && lockedSession.body?.error?.code === 'LESSON_LOCKED',
  `status=${lockedSession.status}`,
);

// إجابة كل التمارين المصحَّحة ثم الإكمال
for (const ex of exs) {
  if (ex.mode !== 'graded') continue;
  await call('/api/lessons/prea1-hola-me-llamo/answers', {
    method: 'POST',
    body: JSON.stringify({ eventId: evid('f'), exerciseId: ex.id, response: ANSWERS[ex.id] ?? '' }),
  });
}
const claimed = await call('/api/lessons/prea1-hola-me-llamo/complete', {
  method: 'POST',
  body: JSON.stringify({ eventId: evid('c'), xpAwarded: 9999, passed: true, accuracy: 100 }),
});
record(
  'الإكمال يحسب XP على الخادم ويتجاهل ما يدّعيه العميل',
  claimed.status === 200 && claimed.body?.xpAwarded === 30 && claimed.body?.xpTotal === 30 && claimed.body?.passed === true,
  `xp=${claimed.body?.xpAwarded} دقة=${claimed.body?.accuracy}`,
);

const again = await call('/api/lessons/prea1-hola-me-llamo/complete', {
  method: 'POST',
  body: JSON.stringify({ eventId: evid('d') }),
});
record('إكمال جديد لدرس مكتمل لا يضاعف XP', again.status === 200 && again.body?.xpAwarded === 0 && again.body?.xpTotal === 30);

const unlockedSession = await call('/api/lessons/a1-un-cafe-por-favor/session');
record('بعد اجتياز PREA1 يُفتح درس A1', unlockedSession.status === 200);

const progress1 = await call('/api/me/progress');
record(
  'التقدم يعكس النتيجة المحفوظة',
  progress1.status === 200 && progress1.body?.stats?.xp_total === 30 && progress1.body?.totals?.lessons_completed === 1,
  `xp=${progress1.body?.stats?.xp_total} دروس=${progress1.body?.totals?.lessons_completed}`,
);

const passed = results.filter(r => r.ok).length;
console.log(`\n${passed}/${results.length} اختبار دخان ناجح على ${BASE}`);
if (passed !== results.length) process.exitCode = 1;
