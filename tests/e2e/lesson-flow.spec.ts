/**
 * مسار الدرس الكامل في متصفح حقيقي — PREA1 ثم A1، ومنع تكرار XP.
 *
 * حالة التحقق: شُغِّلت فعليًا ونجحت على Chromium وFirefox (2026-10-21).
 */
import { expect, test } from '@playwright/test';
import { A1, PREA1, completeLessonThroughUi, signupThroughApi, uniqueEmail } from './helpers';

test.describe('مسار الدرس', () => {
  test('زائر بلا جلسة على /learn يُحوَّل إلى الدخول', async ({ page }) => {
    await page.goto('/learn');
    await expect(page).toHaveURL(/\/login/);
  });

  test('درس PREA1 كاملًا: إجابات صحيحة ⇒ نجاح و30 XP مرة واحدة فقط', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('flow'));
    await page.goto(`/learn/${PREA1}`);

    await expect(page.getByText('عينة تعليمية تجريبية')).toBeVisible();
    await completeLessonThroughUi(page, PREA1);

    const result = page.getByTestId('lesson-result');
    await expect(result).toContainText('أتممت الدرس بنجاح');
    await expect(result).toContainText('30');

    // إعادة الدرس لا تمنح نقاطًا إضافية — والخادم هو من يقرّر
    await page.getByRole('button', { name: 'إعادة الدرس' }).click();
    await completeLessonThroughUi(page, PREA1);
    await expect(page.getByTestId('lesson-result')).toContainText('لا تُمنح نقاط إضافية');

    const progress = await (await page.context().request.get('/api/me/progress')).json();
    expect(progress.stats.xp_total).toBe(30);
    expect(progress.totals.lessons_completed).toBe(1);
  });

  test('درس A1 مقفل قبل إتمام PREA1، ويُفتح بعده', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('lock'));

    await page.goto(`/learn/${A1}`);
    await expect(page.getByText(/مقفل/)).toBeVisible();
    await expect(page.getByTestId('lesson-submit')).toHaveCount(0);

    await page.goto(`/learn/${PREA1}`);
    await completeLessonThroughUi(page, PREA1);

    await page.goto(`/learn/${A1}`);
    await expect(page.getByTestId('lesson-submit').or(page.locator('.choice'))).toBeVisible();
  });

  test('لوحة التقدم لا تعرض أرقامًا وهمية', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('dash'));
    await page.goto('/learn');
    // حساب جديد: XP = 0 ودروس مكتملة = 0، والأرقام تأتي من /api/me/progress
    await expect(page.locator('[data-testid="stat-xp"] .num')).toHaveText('0');
    // المقام يتبع حجم المحتوى المستورد فعلًا — لا نُثبّت رقمًا قد يتغيّر مع كل وحدة جديدة
    const progress = await (await page.context().request.get('/api/me/progress')).json();
    const total = progress.totals.lessons_total as number;
    expect(total).toBeGreaterThan(0);
    await expect(page.locator('[data-testid="stat-lessons"] .num')).toHaveText(`0/${total}`);
    await expect(page.getByText('إجمالي XP')).toBeVisible();
  });

  test('شاشة 320px بلا تمرير أفقي', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('narrow'));
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(`/learn/${PREA1}`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
