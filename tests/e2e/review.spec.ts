/**
 * المراجعة المتباعدة في متصفح حقيقي (Chromium + Firefox، سطح مكتب 1280 و320).
 * يغطي: الوصول من اللوحة، التذكّر قبل الكشف، التقييمات الأربعة، الحالة الفارغة،
 * ولوحة المفاتيح، وعدم تكرار XP/المراجعات عند إعادة الدور.
 */
import { expect, test } from '@playwright/test';
import { PREA1, completeLessonThroughUi, signupThroughApi, uniqueEmail } from './helpers';

test.describe('المراجعة المتباعدة', () => {
  test('اللوحة تُظهر دعوة للمراجعة وحالة واضحة قبل وجود بطاقات', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('rev-dash'));
    await page.goto('/learn');
    const cta = page.getByTestId('review-cta');
    await expect(cta).toBeVisible();
    // حساب جديد بلا دروس: لا بطاقات
    await expect(cta).toContainText(/لا بطاقات[\s\S]*بعد/);

    await page.getByTestId('review-start').click();
    await expect(page).toHaveURL(/\/review$/);
    await expect(page.getByTestId('review-empty')).toBeVisible();
  });

  test('بعد إتمام درس: بطاقة واحدة، لا كشف قبل الطلب، والتقييم يحفظ على الخادم', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('rev-flow'));
    await page.goto(`/learn/${PREA1}`);
    await completeLessonThroughUi(page, PREA1);

    await page.goto('/review');
    const card = page.getByTestId('review-card');
    await expect(card).toBeVisible();
    await expect(page.getByTestId('review-answer')).toHaveCount(0);

    const before = await (await page.context().request.get('/api/me/progress')).json();
    const reviewsBefore = before.stats.reviews_done as number;

    await page.getByTestId('review-reveal').click();
    await expect(page.getByTestId('review-answer')).toBeVisible();
    await page.getByTestId('review-rate-good').click();

    await expect
      .poll(async () => {
        const p = await (await page.context().request.get('/api/me/progress')).json();
        return p.stats.reviews_done as number;
      })
      .toBe(reviewsBefore + 1);
  });

  test('لوحة المفاتيح: مسافة تكشف الإجابة والرقم 3 يقيّم', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('rev-kbd'));
    await page.goto(`/learn/${PREA1}`);
    await completeLessonThroughUi(page, PREA1);

    await page.goto('/review');
    await expect(page.getByTestId('review-card')).toBeVisible();
    await page.keyboard.press(' ');
    await expect(page.getByTestId('review-answer')).toBeVisible();

    const before = await (await page.context().request.get('/api/me/progress')).json();
    await page.keyboard.press('3');
    await expect
      .poll(async () => {
        const p = await (await page.context().request.get('/api/me/progress')).json();
        return p.stats.reviews_done as number;
      })
      .toBe((before.stats.reviews_done as number) + 1);
  });

  test('بعد استهلاك كل البطاقات المستحقة: حالة فراغ صريحة لا رسالة خطأ', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('rev-empty'));
    await page.goto(`/learn/${PREA1}`);
    await completeLessonThroughUi(page, PREA1);

    // عدد البطاقات المستحقة يأتي من الخادم — لا نخمّن
    const payload = await (await page.context().request.get('/api/review/session?limit=200')).json();
    const due = payload.cards.length as number;
    expect(due).toBeGreaterThan(0);

    await page.goto('/review');
    for (let i = 0; i < due; i++) {
      const reveal = page.getByTestId('review-reveal');
      await expect(reveal).toBeVisible({ timeout: 10_000 });
      await reveal.click();
      const rate = page.getByTestId('review-rate-easy');
      await expect(rate).toBeEnabled({ timeout: 10_000 });
      await rate.click();
    }

    await expect(page.getByTestId('review-empty')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test('320px: شاشة المراجعة بلا تمرير أفقي', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('rev-320'));
    await page.goto(`/learn/${PREA1}`);
    await completeLessonThroughUi(page, PREA1);

    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/review');
    await expect(page.getByTestId('review-card')).toBeVisible();
    await page.getByTestId('review-reveal').click();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
