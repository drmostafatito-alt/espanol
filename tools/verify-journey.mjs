/**
 * رحلة المتعلّم الحقيقية في متصفح فعلي (Chromium): تسجيل حساب جديد، فتح الدرس
 * التالي من لوحة «اليوم»، الإجابة مرة خطأ ومرة صحيحة، متابعة، نتيجة، الانتقال
 * للدرس التالي، ثم التحقق من تثبيت التقدم بعد إعادة التحميل والتنقّل بين الصفحات.
 *
 * التشغيل:
 *   LD_LIBRARY_PATH=/tmp/nsslibs/lib node tools/verify-journey.mjs --out reports/ui-shots/journey
 *   ... --mobile   (390×844، dSF=2)
 */
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const OUT = argOf('--out', 'reports/ui-shots/journey');
const MOBILE = args.includes('--mobile');
const BASE = argOf('--base', 'http://127.0.0.1:5173');
const TAG = MOBILE ? 'mobile-' : 'desktop-';
mkdirSync(OUT, { recursive: true });

const PLAN = JSON.parse(
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
import { join } from 'node:path';
import { buildContentPlan } from './tools/lib/content-plan.mjs';
const plan = buildContentPlan(join(process.cwd(), 'content', 'drafts'), { existingVersions: {} });
process.stdout.write(JSON.stringify({ answers: plan.answers }));
`,
    ],
    { cwd: process.cwd(), encoding: 'utf8', timeout: 90000 },
  ),
);

const shot = async (page, name, fullPage = true) => {
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(OUT, `${TAG}${name}.png`), fullPage });
};

const browser = await chromium.launch({ executablePath: '/tmp/chromium', args: ['--no-sandbox'] });
const context = await browser.newContext({
  viewport: MOBILE ? { width: 390, height: 844 } : { width: 1280, height: 900 },
  deviceScaleFactor: MOBILE ? 2 : 1,
  isMobile: MOBILE,
  hasTouch: MOBILE,
  locale: 'ar-EG',
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));

// 1) الصفحة العامة
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await shot(page, '01-landing');

// 2) حساب جديد
await page.goto(BASE + '/signup', { waitUntil: 'networkidle' });
const email = `journey_${MOBILE ? 'm' : 'd'}_${Date.now()}@example.com`;
await page.locator('input[type="email"]').first().fill(email);
await page.locator('input[type="password"]').first().fill('Cairo2026learn');
await page.getByRole('button', { name: 'إنشاء الحساب' }).click();
try {
  await page.waitForURL(/\/learn/, { timeout: 20000 });
} catch (e) {
  console.log('SIGNUP FAILED\n', await page.locator('body').innerText());
  throw e;
}

// 3) لوحة اليوم بعد تحميل بياناتها فعليًا
await page.waitForSelector('[data-testid="next-step-hero"]', { timeout: 20000 });
await page.waitForTimeout(700);
await page.evaluate(() => document.fonts.ready);
const todayText = await page.locator('main, .app-main').first().innerText();
await shot(page, '02-today');
console.log('TODAY:', todayText.replace(/\n+/g, ' | ').slice(0, 200));

// 4) فتح الدرس التالي
await page.locator('[data-testid="next-lesson-btn"]').first().click();
await page.waitForURL(/\/learn\//, { timeout: 20000 });
const slug = page.url().split('/learn/')[1].split('?')[0];
await page.waitForSelector('[data-testid="lesson-start"]', { timeout: 20000 });
await page.waitForTimeout(400);
await shot(page, '03-brief');
await page.getByTestId('lesson-start').click();
await page.waitForTimeout(500);

const session = await (await page.request.get(`${BASE}/api/lessons/${slug}/session`)).json();
let injectedWrong = false;
for (const ex of session.exercises) {
  const answer = PLAN.answers[ex.id];
  const choices = page.locator('.choice');
  const choiceCount = await choices.count();
  if (choiceCount) {
    const values = await page.locator('.choice input').evaluateAll(els => els.map(e => e.value));
    const correctId = typeof answer === 'string' && values.includes(answer) ? answer : null;
    let pick;
    if (!injectedWrong) {
      pick = correctId ? values.find(v => v !== correctId) ?? values[0] : values[0];
      injectedWrong = true;
    } else {
      pick = correctId ?? values[0];
    }
    await page.locator(`label.choice:has(input[value="${pick}"])`).click();
  } else if (await page.getByTestId('remaining-tokens').count()) {
    const tokens = answer?.tokens ?? null;
    const remaining = page.getByTestId('remaining-tokens');
    if (tokens?.length) {
      for (const t of tokens) await remaining.locator('.token.ghost', { hasText: t }).first().click();
    } else {
      const n = await page.locator('.token.ghost').count();
      for (let k = 0; k < n; k++) await page.locator('.token.ghost').first().click();
    }
  } else if (await page.locator('[data-testid="lesson-text"]').count()) {
    await page.locator('[data-testid="lesson-text"]').first().fill(typeof answer === 'string' ? answer : 'Me llamo Sara.');
  }
  const submit = page.getByTestId('lesson-submit');
  if ((await submit.count()) && (await submit.isEnabled())) {
    await submit.click();
    await page.waitForTimeout(450);
  }
  const next = page.getByTestId('lesson-next');
  if (await next.count()) {
    if (!injectedWrong || ex.id !== session.exercises[0].id) {
      // التقط لقطة واحدة من شاشة التغذية الراجعة في البداية
    }
    await next.click();
    await page.waitForTimeout(320);
  }
}

// 5) النتيجة
await page.waitForSelector('[data-testid="lesson-result"]', { timeout: 25000 });
await page.waitForTimeout(600);
await shot(page, '05-result');
console.log('RESULT:', (await page.getByTestId('lesson-result').innerText()).replace(/\n+/g, ' | ').slice(0, 260));

const progress = await (await page.request.get(`${BASE}/api/me/progress`)).json();
console.log('XP:', progress.stats.xp_total, '| lessons:', progress.totals.lessons_completed, '| today:', JSON.stringify(progress.today));
console.log('ACHIEVEMENTS:', progress.achievements.filter(a => a.earned).map(a => a.code).join(',') || '(none)');

// 6) الانتقال إلى الدرس التالي من شاشة النتيجة
const nextLesson = page.getByTestId('result-next-lesson');
if (await nextLesson.count()) {
  await nextLesson.click();
  await page.waitForTimeout(1000);
  console.log('NEXT URL:', page.url());
  await shot(page, '06-next-lesson');
}

// 7) إعادة تحميل: هل التقدم مثبت؟
await page.goto(BASE + '/learn', { waitUntil: 'networkidle' });
await page.waitForSelector('[data-testid="next-step-hero"]', { timeout: 20000 });
await page.waitForTimeout(600);
await shot(page, '07-today-after-reload');

await page.goto(BASE + '/path', { waitUntil: 'networkidle' });
await page.waitForSelector('.path-map, .state-box', { timeout: 20000 });
await page.waitForTimeout(600);
await shot(page, '08-path');

await page.goto(BASE + '/profile', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await shot(page, '09-profile');

await page.goto(BASE + '/review', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await shot(page, '10-review');

await page.goto(BASE + '/packs', { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(900);
await shot(page, '11-packs');

console.log('PAGE ERRORS:', errors.length ? errors.join(' | ') : 'none');
await browser.close();
console.log('done');
