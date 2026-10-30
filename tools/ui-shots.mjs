#!/usr/bin/env node
/**
 * أداة توثيق واجهة المستخدم: تلتقط صورًا حقيقية من المتصفح لرحلة المتعلم.
 *
 * ليست أداة اختبار (الاختبارات في tests/e2e)، بل أداة «شاهد بعينك»:
 * تفتح التطبيق على الخادم المحلي، تُنشئ حسابًا تجريبيًا، تُمرِّر المتعلم عبر
 * الدرس، وتحفظ لقطات الشاشة للمراجعة البصرية.
 *
 * التشغيل:
 *   node tools/ui-shots.mjs --base http://127.0.0.1:5173 --out reports/ui-shots/<tag>
 *   PW_CHROMIUM_PATH=/path/to/chrome node tools/ui-shots.mjs   # متصفح من مسار خارجي
 *
 * ملاحظات:
 * - لا تُصوَّر بيانات حقيقية: الحساب يُنشأ عشوائيًا لكل تشغيل.
 * - الملفات تُحفظ خارج Git (reports/ui-shots) لتجنّب تضخيم المستودع بصور ثنائية.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = arg('base', process.env.UI_BASE || 'http://127.0.0.1:5173');
const OUT = arg('out', process.env.UI_OUT || 'reports/ui-shots/current');
const ONLY = arg('only', '');
const executablePath = process.env.PW_CHROMIUM_PATH || '/tmp/chromium';

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1280, height: 900 },
};

mkdirSync(OUT, { recursive: true });

const stamp = Date.now().toString(36);
const email = `shot_${stamp}@example.com`;
const password = 'Cairo2026learn';

let stepIndex = 0;
/**
 * لقطة كاملة موثوقة: التمرير إلى الأسفل لتفعيل التحميل الكسول ثم العودة للأعلى.
 * بلا هذه الخطوة يقيس fullPage ارتفاعًا قصيرًا قبل تحميل الصور والمكوّنات المؤجلة.
 */
async function settle(page) {
  await page.evaluate(() => document.fonts?.ready ?? null);
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.85;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(260);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(160);
}

async function shot(page, name, { full = false } = {}) {
  stepIndex++;
  const file = join(OUT, `${String(stepIndex).padStart(2, '0')}-${name}.png`);
  await settle(page);
  // العناصر اللاصقة (sticky) تُرسم في اللقطة الكاملة عند موضع التمرير، فتغطي
  // أعلى الصفحة. نُلغي الالتصاق مؤقتًا أثناء اللقطة الكاملة فقط ثم نعيده.
  if (full) {
    await page.addStyleTag({
      content: '.app-topbar,.mobile-nav,.lesson-top,.public-header{position:static!important} .skip-link{display:none!important}',
    });
  }
  await page.waitForTimeout(320); // استقرار الحركات القصيرة قبل اللقطة
  await page.screenshot({ path: file, fullPage: full });
  console.log(`📸 ${file}`);
}

function wanted(name) {
  return !ONLY || ONLY.split(',').some(k => name.includes(k));
}

const browser = await chromium.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
});

try {
  /* ---------------- زائر ---------------- */
  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport, locale: 'ar-EG', timezoneId: 'Africa/Cairo' });
    const page = await ctx.newPage();
    page.on('pageerror', e => console.error('pageerror:', e.message));

    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    if (wanted('landing')) await shot(page, `landing-${vpName}`, { full: vpName === 'desktop' });

    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
    if (wanted('login')) await shot(page, `login-${vpName}`);

    await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
    if (wanted('signup')) await shot(page, `signup-${vpName}`);

    await page.goto(`${BASE}/this-page-does-not-exist`, { waitUntil: 'networkidle' });
    if (wanted('404')) await shot(page, `404-${vpName}`);

    await ctx.close();
  }

  /* ---------------- إنشاء حساب حقيقي عبر الواجهة ---------------- */
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop, locale: 'ar-EG', timezoneId: 'Africa/Cairo' });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('pageerror:', e.message));
  await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });

  const nameInput = page.locator('input[autocomplete="name"], input[name="displayName"]').first();
  if (await nameInput.count()) await nameInput.fill('سارة');
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  const goals = page.locator('select');
  if (await goals.count()) await goals.first().selectOption({ index: 0 }).catch(() => {});
  await page.getByRole('button', { name: /إنشاء|سجّل|تسجيل|ابدأ/i }).last().click();
  await page.waitForURL(/\/learn/, { timeout: 20000 });
  await page.waitForLoadState('networkidle');

  if (wanted('dashboard')) await shot(page, 'dashboard-desktop', { full: true });

  /* ---------------- الجولة على الموبايل أولًا (نفس الحساب عبر جلسة منفصلة) ---------------- */
  const storage = await ctx.storageState();

  const mctx = await browser.newContext({ viewport: VIEWPORTS.mobile, locale: 'ar-EG', timezoneId: 'Africa/Cairo', storageState: storage });
  const mpage = await mctx.newPage();
  await mpage.goto(`${BASE}/learn`, { waitUntil: 'networkidle' });
  if (wanted('dashboard')) await shot(mpage, 'dashboard-mobile', { full: false });
  if (wanted('dashboard')) await shot(mpage, 'dashboard-mobile-full', { full: true });
  await mctx.close();

  /* ---------------- الدرس ---------------- */
  await page.goto(`${BASE}/learn`, { waitUntil: 'networkidle' });
  const nextBtn = page.locator('[data-testid="next-lesson-btn"]');
  if (await nextBtn.count()) {
    await nextBtn.click();
  } else {
    const firstNode = page.locator('.path-node:not([disabled])').first();
    await firstNode.click();
  }
  await page.waitForURL(/\/learn\//, { timeout: 20000 });
  await page.waitForLoadState('networkidle');

  if (wanted('brief')) await shot(page, 'lesson-brief-desktop', { full: true });

  const startBtn = page.getByRole('button', { name: /ابدأ|هيا|التمارين|ابدأ الدرس/i }).first();
  if (await startBtn.count()) await startBtn.click();
  await page.waitForTimeout(600);
  if (wanted('exercise')) await shot(page, 'lesson-exercise-desktop', { full: true });

  // إجابة خاطئة عمدًا إن أمكن: اختيار الخيار الأخير
  const optionLabels = page.locator('.choice');
  if (await optionLabels.count()) {
    await optionLabels.last().click();
    await page.locator('[data-testid="lesson-submit"]').click();
    await page.waitForTimeout(700);
    if (wanted('feedback')) await shot(page, 'lesson-feedback-desktop', { full: true });
  }

  // إكمال الدرس آليًا: نختار أول خيار في كل سؤال ثم نتحقق
  for (let i = 0; i < 40; i++) {
    const nextStage = page.locator('[data-testid="lesson-next"]');
    if (await nextStage.count()) {
      const label = (await nextStage.innerText()).trim();
      if (/إنهاء/.test(label)) {
        await nextStage.click();
        break;
      }
      await nextStage.click();
      await page.waitForTimeout(260);
      continue;
    }
    const opts = page.locator('.choice');
    if (await opts.count()) {
      await opts.first().click();
    } else if (await page.locator('[data-testid="remaining-tokens"] .token').count()) {
      const toks = page.locator('[data-testid="remaining-tokens"] .token');
      const n = await toks.count();
      for (let k = 0; k < n; k++) await toks.first().click();
    } else if (await page.locator('[data-testid="lesson-text"]').count()) {
      await page.locator('[data-testid="lesson-text"]').first().fill('Buenos días');
    }
    const submit = page.locator('[data-testid="lesson-submit"]');
    if ((await submit.count()) && (await submit.isEnabled())) {
      await submit.click();
      await page.waitForTimeout(320);
    } else {
      await page.waitForTimeout(320);
    }
  }
  await page.waitForTimeout(1200);
  if (wanted('result')) await shot(page, 'lesson-result-desktop', { full: true });

  /* ---------------- المراجعة والملف الشخصي ---------------- */
  await page.goto(`${BASE}/review`, { waitUntil: 'networkidle' });
  if (wanted('review')) await shot(page, 'review-desktop', { full: true });
  await page.goto(`${BASE}/review/packs`, { waitUntil: 'networkidle' });
  if (wanted('review')) await shot(page, 'review-packs-desktop', { full: true });
  await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' });
  if (wanted('profile')) await shot(page, 'profile-desktop', { full: true });
  await page.goto(`${BASE}/search?q=hola`, { waitUntil: 'networkidle' });
  if (wanted('search')) await shot(page, 'search-desktop', { full: true });

  /* ---------------- نفس الصفحات على الموبايل ---------------- */
  const mctx2 = await browser.newContext({ viewport: VIEWPORTS.mobile, locale: 'ar-EG', timezoneId: 'Africa/Cairo', storageState: await ctx.storageState() });
  const mpage2 = await mctx2.newPage();
  for (const [name, path] of [
    ['review', '/review'],
    ['profile', '/settings'],
    ['learn-path', '/learn'],
  ]) {
    await mpage2.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    if (wanted(name)) await shot(mpage2, `${name}-mobile`, { full: true });
  }
  await mpage2.goto(`${BASE}/learn`, { waitUntil: 'networkidle' });
  const mNext = mpage2.locator('[data-testid="next-lesson-btn"]');
  const mNode = mpage2.locator('.path-node:not([disabled])').first();
  if (await mNext.count()) await mNext.click();
  else if (await mNode.count()) await mNode.click();
  await mpage2.waitForTimeout(1200);
  if (wanted('exercise')) await shot(mpage2, 'lesson-desktop-mobile', { full: true });
  await mctx2.close();
  await ctx.close();
} finally {
  await browser.close();
}
console.log('\n✅ تم حفظ اللقطات في', OUT);
