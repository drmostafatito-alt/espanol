/**
 * مسار الدرس الكامل في متصفح حقيقي — PREA1 ثم A1، ومنع تكرار XP.
 *
 * حالة التحقق: شُغِّلت فعليًا ونجحت على Chromium وFirefox (2026-10-21).
 */
import { expect, test } from '@playwright/test';
import { FIRST_LESSON, PREA1, SECOND, completeLessonThroughUi, enterExercises, signupThroughApi, uniqueEmail } from './helpers';

test.describe('مسار الدرس', () => {
  test('زائر بلا جلسة على /learn يُحوَّل إلى الدخول', async ({ page }) => {
    await page.goto('/learn');
    await expect(page).toHaveURL(/\/login/);
  });

  test('درس PREA1 كاملًا: إجابات صحيحة ⇒ نجاح و30 XP مرة واحدة فقط', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('flow'));
    await page.goto(`/learn/${PREA1}`);

    // لا وسم «تجريبي/مسودة» في واجهة المتعلم (قرار حارس النسخ) — التحذير يبقى في استجابة الخادم فقط.
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

  test('الدرس التالي في الوحدة مقفل قبل إتمام السابق، ويُفتح بعده', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('lock'));

    await page.goto(`/learn/${SECOND}`);
    await expect(page.getByText(/مقفل/)).toBeVisible();
    await expect(page.getByTestId('lesson-submit')).toHaveCount(0);

    await page.goto(`/learn/${PREA1}`);
    await completeLessonThroughUi(page, PREA1);

    await page.goto(`/learn/${SECOND}`);
    await enterExercises(page);
    await expect(page.getByTestId('lesson-submit').or(page.locator('.choice')).first()).toBeVisible();
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

  test('لوحة التعلّم تعرض بطاقة خطوتك التالية واختبار تحديد المستوى وتبويبات المستويات', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('journey'));
    await page.goto('/learn');

    // بطاقة خطوتك التالية تشير إلى أول درس تمهيدي للمتعلم الجديد
    await expect(page.getByTestId('next-step-hero')).toBeVisible();
    await expect(page.getByTestId('next-lesson-btn')).toBeVisible();

    // دعوة تحديد المستوى ظاهرة
    await expect(page.getByTestId('placement-cta')).toBeVisible();

    // تبويبات المستويات موجودة وتعمل
    await expect(page.getByRole('tab', { name: 'التمهيد Pre-A1' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'مستوى A1' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'مسار السفر' })).toBeVisible();

    // الضغط على بطاقة خطوتك التالية ينقل مباشرة لأول درس في ترتيب المنهج
    await page.getByTestId('next-lesson-btn').click();
    await expect(page).toHaveURL(new RegExp(`/learn/${FIRST_LESSON}`));
  });

  test('اختبار تحديد المستوى /placement: يجيب المتعلم وتظهر النتيجة من الخادم', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('placement'));
    await page.goto('/placement');

    // صفحة تحديد المستوى تفتح وتعرض الأسئلة (الأسئلة من الخادم بلا مفاتيح إجابة)
    await expect(page.getByText('اختبار تحديد المستوى')).toBeVisible();
    await expect(page.getByText('السؤال 1 من 10')).toBeVisible();

    // إجابة الأسئلة العشرة باختيار الخيار الأول دائمًا — مواضع الصواب مخلوطة
    // في كل محاولة، فالنتيجة تتوقف على التخطيط؛ الاختبار يتحقق من رحلة الإرسال
    // والنتيجة المعروضة، والتصحيح نفسه مغطّى باختبارات الوحدة الخادمية.
    for (let i = 1; i <= 10; i++) {
      const firstChoice = page.locator('.choice').first();
      await firstChoice.click();
      if (i < 10) {
        await page.getByRole('button', { name: 'التالي →' }).click();
      }
    }

    // الضغط على إنهاء التقييم
    const finishBtn = page.getByRole('button', { name: /إنهاء التقييم/ });
    await expect(finishBtn).toBeEnabled();
    await finishBtn.click();

    // ظهور النتيجة والمستوى الموصى به (التمهيدي لهذه الإجابات)
    await expect(page.getByText('نتيجة اختبار تحديد المستوى')).toBeVisible();
    await expect(page.getByText(/المستوى الموصى به/)).toBeVisible();
    // النسبة من الخادم وتتوقف على تخطيط المحاولة المخلوط — نثبت شكلها لا قيمتها:
    // فقرة التسمية تعرض نسبة مئوية صالحة (مضاعف 10)، والمستوى الموصى به ظاهر أعلاه.
    await expect(page.locator('p', { hasText: 'نسبة الإجابات الصحيحة' }).first()).toContainText(/نسبة الإجابات الصحيحة: \d+%/);

    // العودة إلى اللوحة
    await page.getByRole('button', { name: /الانتقال إلى خريطة المنهج/ }).click();
    await expect(page).toHaveURL('/learn');
  });
});
