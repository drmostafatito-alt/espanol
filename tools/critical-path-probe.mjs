#!/usr/bin/env node
/**
 * قياس المسار الحرج لتحميل بارد بلا متصفح (waterfall حقيقي عبر HTTP).
 *
 * السبب: بيئة الفحص هذه لا تحتوي متصفحًا قابلًا للتشغيل (Chromium بلا
 * libnss3/libnspr4)، فلا يمكن قياس LCP. هذا السكربت يقيس بدلًا منه تسلسل
 * الطلبات الحرجة نفسه الذي يقيسه المتصفح فعليًا، بنفس الشروط:
 *
 *   1. GET الصفحة (index.html)
 *   2. GET حزمة JS الأساسية + CSS
 *   3. GET /api/me (الجلسة) ثم GET حزمة الصفحة الكسولة ثم GET بيانات الصفحة
 *
 * الفرق الوحيد المُقاس بين النسختين هو *توقيت بدء* طلب حزمة الصفحة:
 * قبل الإصلاح يبدأ بعد انتهاء /api/me، وبعده يبدأ معه بالتوازي.
 *
 *   node tools/critical-path-probe.mjs --base http://127.0.0.1:4175 --session <cookie> --path /profile
 */
const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const BASE = argOf('--base', 'http://127.0.0.1:4175').replace(/\/$/, '');
const SESSION = argOf('--session', '');
const TARGET = argOf('--path', '/profile');
const RUNS = Number(argOf('--runs', '5'));
const PARALLEL = args.includes('--prefetch'); // نسخة ما بعد الإصلاح

const AUTH_PATH = '/api/auth/me';
/* تأخير صناعي اختياري لمحاكاة زمن استجابة الشبكة الحقيقية (نصف قبل + نصف بعد).
   يُستخدم فقط للمقارنة العادلة بين نسختين: نفس RTT على الطرفين. */
const RTT = Number(argOf('--rtt', '0'));
const DATA_PATH =
  TARGET.startsWith('/review') ? '/api/review/session'
  : TARGET === '/profile' ? '/api/me/progress'
  : '/api/auth/me';
const t0 = () => Number(process.hrtime.bigint() / 1000n) / 1000; // ms بدقة ميكروثانية

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function timed(url, init) {
  const start = t0();
  if (RTT > 0) await sleep(RTT / 2);
  const res = await fetch(url, init);
  const body = await res.text();
  if (RTT > 0) await sleep(RTT / 2);
  return { ms: t0() - start, status: res.status, body };
}

async function runOnce() {
  const start = t0();
  const html = await timed(`${BASE}${TARGET}`);
  if (html.status !== 200) throw new Error(`الصفحة ${TARGET} أعادت ${html.status}`);

  const scriptMatch = html.body.match(/<script[^>]+src="([^"]+\.js)"/);
  const cssMatch = html.body.match(/<link[^>]+href="([^"]+\.css)"/);
  if (!scriptMatch) throw new Error('لم أجد حزمة JS الأساسية في HTML');

  const mainJs = await timed(`${BASE}${scriptMatch[1]}`);
  if (cssMatch) await timed(`${BASE}${cssMatch[1]}`);

  // اسم حزمة الصفحة مذكور داخل الحزمة الأساسية (مفتاح lazy)
  const chunkPrefix = TARGET.startsWith('/review') ? 'Review' : 'Profile';
  const chunkMatch = mainJs.body.match(new RegExp(`assets\\/(${chunkPrefix}-[\\w-]+\\.js)`));
  const chunkUrl = chunkMatch ? `${BASE}/assets/${chunkMatch[1]}` : null;

  const authHeaders = SESSION ? { cookie: `ses=${SESSION}` } : {};
  const auth = timed(`${BASE}${AUTH_PATH}`, { headers: authHeaders });
  if (PARALLEL && chunkUrl) {
    const [chunk, me] = await Promise.all([timed(chunkUrl), auth]);
    const data = await timed(`${BASE}${DATA_PATH}`, { headers: authHeaders });
    return {
      html: Math.round(html.ms),
      mainJs: Math.round(mainJs.ms),
      chunk: Math.round(chunk.ms),
      auth: Math.round(me.ms),
      data: Math.round(data.ms),
      lastCritical: Math.round(t0() - start),
      chunkFile: chunkMatch?.[1] ?? null,
      authStatus: me.status,
      dataStatus: data.status,
    };
  }
  const me = await auth;
  let chunkMs = 0;
  if (chunkUrl) chunkMs = (await timed(chunkUrl)).ms;
  const data = await timed(`${BASE}${DATA_PATH}`, { headers: authHeaders });
  return {
    html: Math.round(html.ms),
    mainJs: Math.round(mainJs.ms),
    chunk: Math.round(chunkMs),
    auth: Math.round(me.ms),
    data: Math.round(data.ms),
    lastCritical: Math.round(t0() - start),
    chunkFile: chunkMatch?.[1] ?? null,
    authStatus: me.status,
    dataStatus: data.status,
  };
}

const runs = [];
for (let i = 0; i < RUNS; i += 1) {
  try {
    runs.push(await runOnce());
  } catch (err) {
    console.error(`✖ محاولة ${i + 1}: ${err.message}`);
    process.exitCode = 1;
    break;
  }
  await new Promise(r => setTimeout(r, 150));
}

const median = key => {
  const values = runs.map(r => r[key]).filter(v => typeof v === 'number').sort((a, b) => a - b);
  return values.length ? values[Math.floor(values.length / 2)] : null;
};

console.log(JSON.stringify({
  base: BASE,
  path: TARGET,
  prefetch: PARALLEL,
  simulatedRttMs: RTT,
  runs: runs.length,
  median: {
    htmlMs: median('html'),
    mainJsMs: median('mainJs'),
    chunkMs: median('chunk'),
    authMs: median('auth'),
    dataMs: median('data'),
    lastCriticalMs: median('lastCritical'),
  },
  samples: runs.map(r => r.lastCritical),
  chunkFile: runs[0]?.chunkFile ?? null,
  authStatus: runs[0]?.authStatus ?? null,
  dataStatus: runs[0]?.dataStatus ?? null,
}, null, 2));
