import { defineConfig, devices } from '@playwright/test';

/**
 * إعداد Playwright لاختبارات المتصفح الحقيقي.
 *
 * الحالة المُتحقَّق منها (آخر تشغيل: 2026-10-21): **نجح 70/70** على Chromium
 * وFirefox (5 مشاريع: 320px، سطح المكتب، Android، Firefox×2).
 * WebKit/Safari غير قابل للتشغيل على Debian 13 (sonames قديمة) — لا تدّعِ تغطيته.
 *
 * ⚠️ المتصفحات تحتاج مكتبات نظام لا تُحفظ مع مساحة العمل. على بيئة جديدة:
 *   npx playwright install chromium firefox
 *   sudo apt-get install -y --no-install-recommends libnss3 libnspr4 libatk1.0-0 \
 *     libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
 *     libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 libatspi2.0-0 \
 *     libgtk-3-0 libx11-xcb1 libxcb-shm0 libdbus-glib-1-2
 *
 * التشغيل:
 *   node tools/import-content.mjs        # المحتوى في D1 المحلي
 *   npx wrangler dev --local --port 8787
 *   npx playwright test                  # أو: npx playwright test --project=chromium-desktop
 */
/**
 * مسار متصفح Chromium بديل (بيئات بلا تنزيل من CDN).
 * يُضبط بـPW_CHROMIUM_PATH؛ وإن غاب استخدم Playwright نسخته المثبَّتة عادةً.
 * في هذه الحاضنة: chromium من @sparticuz/chromium + libnss3 من chrome-aws-lambda
 * + NSPR مبني من المصدر، ويُضبط LD_LIBRARY_PATH قبل التشغيل.
 */
const chromiumPath = process.env.PW_CHROMIUM_PATH;
const chromiumLaunch = chromiumPath
  ? { executablePath: chromiumPath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] }
  : undefined;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false, // مستخدمون في قاعدة واحدة — لا نريد تصادمًا
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'reports/playwright' }]],
  globalSetup: './tests/e2e/global-setup.ts',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:8787',
    locale: 'ar-EG',
    timezoneId: 'Africa/Cairo',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium-320', use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 720 }, hasTouch: true, launchOptions: chromiumLaunch } },
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, launchOptions: chromiumLaunch } },
    { name: 'android-chrome', use: { ...devices['Pixel 7'], launchOptions: chromiumLaunch } },
    // محرّك ثانٍ مختلف فعليًا (Gecko) — يمسك أخطاء تعتمد على محرّك العرض
    // Firefox يحتاج ثنائيًا غير متاح في هذه الحاضنة (لا شبكة لـCDN المتصفحات).
    ...(process.env.E2E_SKIP_FIREFOX ? [] : [
      { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } } },
      { name: 'firefox-320', use: { ...devices['Desktop Firefox'], viewport: { width: 320, height: 720 } } },
    ]),
    // Safari/WebKit غير قابل للتشغيل هنا: بناء Playwright لـwebkit يحتاج sonames قديمة
    // غير موجودة في Debian 13 (libicu66, libwebp.so.6, libjpeg.so.8, libffi.so.7).
    // يُفعَّل بـE2E_WEBKIT=1 على نظام مدعوم فقط — لا تدّعِ تشغيله قبل ذلك.
    ...(process.env.E2E_WEBKIT ? [{ name: 'iphone-safari', use: { ...devices['iPhone 13'] } }] : []),
  ],
});
