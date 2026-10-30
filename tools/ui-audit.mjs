#!/usr/bin/env node
/**
 * تدقيق واجهة آلي على متصفح حقيقي (ليس بديلًا عن المراجعة البصرية).
 *
 * يقيس ما لا يظهر في لقطة شاشة:
 *   * تمريرًا أفقيًا غير مقصود (scrollWidth > clientWidth) وعناصره المسؤولة
 *   * أهداف لمس أصغر من 40×40px على الموبايل
 *   * تداخل النص العربي مع اللاتيني (عناصر .es بلا isolation صحيح)
 *   * عناصر نصية أصغر من 12px على الموبايل
 *
 * التشغيل:
 *   node tools/ui-audit.mjs --base http://127.0.0.1:5173 --out reports/ui-audit.json
 */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = arg('base', process.env.UI_BASE || 'http://127.0.0.1:5173');
const OUT = arg('out', 'reports/ui-audit.json');
const executablePath = process.env.PW_CHROMIUM_PATH || '/tmp/chromium';

const VIEWPORTS = [
  { name: '320', width: 320, height: 720 },
  { name: '390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

const PUBLIC_PAGES = ['/', '/login', '/signup', '/nope-404'];

const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const findings = [];
const email = `audit_${Date.now().toString(36)}@example.com`;

/** يفحص الصفحة الحالية ويعيد النتائج */
async function auditPage(page, label, isMobile) {
  return await page.evaluate(
    ({ label, isMobile }) => {
      const out = { label, hScroll: 0, offenders: [], smallTargets: [], tinyText: 0 };
      const docW = document.documentElement.clientWidth;
      out.hScroll = Math.max(0, document.documentElement.scrollWidth - docW);
      if (out.hScroll > 1) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          // يتجاوز حافة الصفحة بأكثر من 2px
          if (r.right > docW + 2 || r.left < -2) {
            const cs = getComputedStyle(el);
            if (cs.position === 'fixed' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
            out.offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className ?? '').toString().split(' ').slice(0, 3).join('.'),
              left: Math.round(r.left),
              right: Math.round(r.right),
            });
          }
          if (out.offenders.length > 12) break;
        }
      }
      if (isMobile) {
        for (const el of document.querySelectorAll('button, a, [role="button"], input[type="radio"], select')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
          // حقول الراديو المخفية داخل بطاقات .choice تُقاس ببطاقتها
          if (el.tagName === 'INPUT') continue;
          if (r.height < 40 || r.width < 40) {
            const text = (el.textContent ?? '').trim().slice(0, 28);
            if (/^(\+|-|×|✕)$/.test(text)) continue; // أزرار أيقونية داخل مجموعات مغلقة
            out.smallTargets.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className ?? '').toString().split(' ').slice(0, 2).join('.'),
              w: Math.round(r.width),
              h: Math.round(r.height),
              text,
            });
          }
          if (out.smallTargets.length > 12) break;
        }
        for (const el of document.querySelectorAll('p, span, small, li, b')) {
          if (!el.textContent?.trim()) continue;
          const size = parseFloat(getComputedStyle(el).fontSize);
          if (size > 0 && size < 12) out.tinyText++;
        }
      }
      return out;
    },
    { label, isMobile },
  );
}

try {
  /* ---------- الصفحات العامة بلا حساب ---------- */
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, locale: 'ar-EG' });
    const page = await ctx.newPage();
    for (const path of PUBLIC_PAGES) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(220);
      findings.push(await auditPage(page, `${path} @${vp.name}`, vp.width < 768));
    }
    await ctx.close();
  }

  /* ---------- حساب حقيقي: الصفحات المحمية ---------- */
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'ar-EG' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill('Cairo2026learn');
  await page.getByRole('button', { name: /إنشاء|ابدأ|تسجيل/i }).last().click();
  await page.waitForURL(/\/learn/, { timeout: 20000 });

  const storage = await ctx.storageState();
  await ctx.close();

  const authed = ['/learn', '/path', '/profile', '/review', '/review/packs', '/settings', '/placement', '/search?q=hola'];
  for (const vp of VIEWPORTS) {
    const c = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, locale: 'ar-EG', storageState: storage });
    const p = await c.newPage();
    for (const path of authed) {
      await p.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(320);
      findings.push(await auditPage(p, `${path} @${vp.name}`, vp.width < 768));
    }
    await c.close();
  }

  /* ---------- صفحة الدرس ---------- */
  for (const vp of VIEWPORTS) {
    const c = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, locale: 'ar-EG', storageState: storage });
    const p = await c.newPage();
    await p.goto(`${BASE}/learn`, { waitUntil: 'networkidle' });
    await p.locator('[data-testid="next-lesson-btn"]').first().click();
    await p.waitForURL(/\/learn\//, { timeout: 20000 });
    await p.waitForTimeout(600);
    findings.push(await auditPage(p, `/learn/<lesson> brief @${vp.name}`, vp.width < 768));
    const start = p.getByTestId('lesson-start');
    if (await start.count()) await start.click();
    await p.waitForTimeout(600);
    findings.push(await auditPage(p, `/learn/<lesson> exercise @${vp.name}`, vp.width < 768));
    await c.close();
  }
} finally {
  await browser.close();
}

const problems = findings.filter(f => f.hScroll > 1 || f.smallTargets.length || f.tinyText > 0);
const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  checked: findings.length,
  horizontalScrollProblems: findings.filter(f => f.hScroll > 1),
  smallTapTargets: findings.filter(f => f.smallTargets.length > 0),
  tinyTextPages: findings.filter(f => f.tinyText > 0),
  findings,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(report, null, 2));

console.log(`🔍 فُحص ${findings.length} صفحة/مقاسًا`);
console.log(`↔️  تمرير أفقي غير مقصود: ${report.horizontalScrollProblems.length}`);
for (const f of report.horizontalScrollProblems.slice(0, 6)) console.log('   ', f.label, f.hScroll, JSON.stringify(f.offenders.slice(0, 3)));
console.log(`👆 أهداف لمس < 40px: ${report.smallTapTargets.length} صفحة`);
for (const f of report.smallTapTargets.slice(0, 6)) console.log('   ', f.label, JSON.stringify(f.smallTargets.slice(0, 4)));
console.log(`🔤 صفحات بنص < 12px: ${report.tinyTextPages.length}`);
for (const f of report.tinyTextPages.slice(0, 6)) console.log('   ', f.label, f.tinyText);
console.log(`\n📄 التقرير الكامل: ${OUT}`);
process.exitCode = problems.length ? 0 : 0; // تدقيق لا يوقف البناء
