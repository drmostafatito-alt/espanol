/**
 * اختبارات المتصفح الحقيقي لإعادة التصميم الشاملة:
 * - الأقسام التسعة في التنقل الموحّد بدون تمرير أفقي أو أخطاء runtime
 * - مسار CEFR البصري وأهداف الوحدات
 * - إعادة فتح الشرح أثناء الدرس، مقارنة الإجابة، وملخص النتيجة والمفردات
 * - مكتبة المفردات (بطاقاتي + مستكشف المعجم) ووضع المراجعة المركزة (?mode=weak)
 * - استوديو المحادثات (بما في ذلك الكول سنتر) واستوديو الاستماع ولوحة الأحرف الإسبانية
 */
import { expect, test } from '@playwright/test';
import { PREA1, completeLessonThroughUi, signupThroughApi, uniqueEmail } from './helpers';

test.describe('الأقسام التسعة ومحاور المهارات المعاد تصميمها', () => {
  test('جميع الأقسام التسعة تعمل بلا أخطاء وبلا تمرير أفقي، مع حفظ التقدّم الحقيقي', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    await signupThroughApi(page, uniqueEmail('hubs-e2e'));

    // 1) إتمام درس حقيقي وفتح مفرداته وبطاقات مراجعته
    await page.goto(`/learn/${PREA1}`);
    await page.getByTestId('lesson-start').click();
    await expect(page.getByTestId('lesson-submit')).toBeVisible();

    // التحقق من زر مراجعة الشرح أثناء التمارين ثم العودة للتمارين
    await page.getByRole('button', { name: 'الشرح' }).click();
    await expect(page.getByRole('button', { name: /العودة إلى التمارين/ })).toBeVisible();
    await page.getByRole('button', { name: /العودة إلى التمارين/ }).click();
    await expect(page.getByTestId('lesson-submit')).toBeVisible();

    // إتمام الدرس بالكامل والتحقق من شاشة النتيجة والمفردات المكتسبة
    await completeLessonThroughUi(page, PREA1);
    await expect(page.getByText(/مفردات تعلّمتها في هذا الدرس/)).toBeVisible();

    // 2) تقييم بطاقة بـ «مرة أخرى» (1) لتظهر لاحقًا في وضع ?mode=weak
    await page.goto('/review');
    await expect(page.getByTestId('review-card')).toBeVisible();
    await page.getByTestId('review-reveal').click();
    await page.getByTestId('review-rate-again').click();
    await expect(page.getByTestId('review-empty').or(page.getByTestId('review-card'))).toBeVisible();

    // 3) التحقق من وضع المراجعة المركزة ?mode=weak
    await page.goto('/review?mode=weak');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/الكلمات المتعثرة/);

    // 4) زيارة جميع الأقسام وفحص التمرير الأفقي
    const routes: { path: string; heading: RegExp }[] = [
      { path: '/learn', heading: /مرحبًا/ },
      { path: '/path', heading: /خريطة مسارك/ },
      { path: '/vocabulary', heading: /المفردات والإتقان/ },
      { path: '/grammar', heading: /القواعد الإسبانية/ },
      { path: '/conversations', heading: /المحادثات ومحاكاة الكول سنتر/ },
      { path: '/listening', heading: /درّب أذنك ولسانك/ },
      { path: '/stats', heading: /الإحصائيات والتقدّم/ },
      { path: '/profile', heading: /متعلم اختبار/ },
    ];

    for (const r of routes) {
      await page.goto(r.path);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(r.heading);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `تمرير أفقي غير مرغوب في ${r.path}`).toBeLessThanOrEqual(1);
    }

    // 5) تحقق تفصيلي داخل استوديو الاستماع (لوحة الأحرف الإسبانية)
    await page.goto('/listening');
    await expect(page.getByRole('button', { name: 'إدراج الحرف ñ' })).toBeVisible();

    // 6) تحقق في الإحصائيات من أرقام حقيقية غير صفرية بعد إتمام الدرس
    await page.goto('/stats');
    await expect(page.getByText('1/258 درسًا')).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
});
