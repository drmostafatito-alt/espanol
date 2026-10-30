/**
 * قياس أداء الصفحات في متصفح حقيقي (LCP, CLS, تأخير التفاعل، بايتات الشبكة).
 * يُستخدم لمقارنة ما قبل التصميم وبعده على نفس الصفحات ونفس الشبكة.
 *
 *   LD_LIBRARY_PATH=/tmp/nsslibs/lib node tools/perf-probe.mjs --base http://127.0.0.1:5174 --out reports/perf-before.json
 */
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const BASE = argOf('--base', 'http://127.0.0.1:5173');
const OUT = argOf('--out', 'reports/perf.json');
const SESSION = argOf('--session', ''); // كوكي جلسة جاهز (لتفادي اختلاف واجهة الدخول بين النسخين)

const browser = await chromium.launch({ executablePath: '/tmp/chromium', args: ['--no-sandbox'] });

async function newContext() {
  return browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'ar-EG',
    // بيئة شبكة محلية: نُبقي التخزين فارغًا لقياس التحميل البارد
  });
}

async function login(context) {
  if (!SESSION) return;
  const host = new URL(BASE).hostname;
  await context.addCookies([
    { name: 'ses', value: SESSION, domain: host, path: '/', httpOnly: true, sameSite: 'Lax' },
  ]);
}

async function measure(url, { scroll = false, anon = false } = {}) {
  const context = await newContext();
  if (!anon) await login(context);
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    window.__longTasks = 0;
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) window.__lcp = Math.max(window.__lcp, e.startTime + e.duration);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) window.__cls += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(list => { window.__longTasks += list.getEntries().length; })
      .observe({ type: 'longtask', buffered: true });
  });

  const t0 = Date.now();
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  const loadMs = Date.now() - t0;
  if (scroll) {
    // التمرير يُحمّل كل شيء كسولًا كما يفعل الطالب
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
  }
  await page.waitForTimeout(800);

  // تأخير التفاعل: نقيس زمن أحداث النقر المسجّلة عبر Event Timing API
  const target = page.locator('a[href], button').filter({ hasNot: page.locator('[disabled]') }).first();
  let interactionMs = null;
  try {
    await page.evaluate(() => { window.__events = []; new PerformanceObserver(l => { for (const e of l.getEntries()) window.__events.push({ kind: e.name, duration: e.duration }); }).observe({ type: 'event', buffered: true, durationThreshold: 16 }); });
    await target.click({ trial: true }).catch(() => {});
    await page.mouse.click(30, 30);
    await page.waitForTimeout(250);
    interactionMs = await page.evaluate(() => {
      const list = window.__events ?? [];
      return list.length ? Math.max(...list.map(e => e.duration)) : null;
    });
  } catch { /* ignore */ }

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    // أحجام الشبكة من Resource Timing (transferSize) — تشمل الترميز المضغوط فعلًا
    const bytes = { total: nav?.transferSize ?? 0, js: 0, css: 0, font: 0, img: 0 };
    for (const r of performance.getEntriesByType('resource')) {
      const size = r.transferSize ?? 0;
      bytes.total += size;
      if (r.initiatorType === 'script' || /\.js(\?|$)/.test(r.name)) bytes.js += size;
      else if (r.initiatorType === 'link' || /\.css(\?|$)/.test(r.name)) bytes.css += size;
      else if (/\.(woff2?|ttf)(\?|$)/.test(r.name)) bytes.font += size;
      else if (r.initiatorType === 'img' || /\.(png|jpe?g|webp|svg)(\?|$)/.test(r.name)) bytes.img += size;
    }
    return {
      lcp: Math.round(window.__lcp || 0),
      cls: Number((window.__cls || 0).toFixed(4)),
      longTasks: window.__longTasks || 0,
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
      domNodes: document.querySelectorAll('*').length,
      bytes,
    };
  });
  await context.close();
  return { url, loadMs, interactionMs, ...metrics };
}

/* --pages "/profile,/review" يقيس صفحات محددة (مثل مسارات محمية تحتاج جلسة) */
const PAGES_ARG = argOf('--pages', '');
const pages = PAGES_ARG
  ? PAGES_ARG.split(',').map(url => ({ url: url.trim(), scroll: false, anon: false }))
  : [
      { url: '/', scroll: true, anon: true },
      { url: '/login', anon: true },
      ...(SESSION ? [{ url: '/learn', scroll: true }, { url: '/path', scroll: true }] : []),
    ];
const results = [];
for (const p of pages) {
  const runs = [];
  for (let i = 0; i < 3; i++) runs.push(await measure(p.url, p));
  const medianBytes = key => {
    const v = runs.map(r => r.bytes?.[key] ?? 0).sort((a, b) => a - b);
    return v[Math.floor(v.length / 2)] ?? 0;
  };
  const median = key => {
    const v = runs.map(r => r[key]).filter(x => typeof x === 'number').sort((a, b) => a - b);
    return v.length ? v[Math.floor(v.length / 2)] : null;
  };
  results.push({
    url: p.url,
    lcpMs: median('lcp'),
    cls: Number((runs.map(r => r.cls).sort((a, b) => a - b)[1] ?? 0).toFixed(4)),
    interactionMs: median('interactionMs'),
    loadMs: median('loadMs'),
    domContentLoadedMs: median('domContentLoaded'),
    longTasks: median('longTasks'),
    domNodes: median('domNodes'),
    bytes: {
      total: medianBytes('total'),
      js: medianBytes('js'),
      css: medianBytes('css'),
      font: medianBytes('font'),
      img: medianBytes('img'),
    },
  });
  console.log(p.url, JSON.stringify(results.at(-1)));
}
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ base: BASE, measuredAt: new Date().toISOString(), results }, null, 2));
await browser.close();
console.log('saved', OUT);
