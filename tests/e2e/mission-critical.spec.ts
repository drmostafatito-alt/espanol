import { expect, test, type Page } from '@playwright/test';
import { PREA1, enterExercises, signupThroughApi, uniqueEmail, waitForSpoken } from './helpers';

async function fakeVoices(page: Page, langs: string[]) {
  await page.addInitScript((voiceLangs: string[]) => {
    const voices = voiceLangs.map((lang, i) => ({
      lang,
      name: `Test ${lang} ${i}`,
      default: i === 0,
      localService: true,
      voiceURI: `v${i}`,
    }));
    const spoken: { text: string; lang: string; rate: number }[] = [];
    (window as unknown as { __spoken: typeof spoken }).__spoken = spoken;

    class FakeUtterance {
      text: string;
      lang = '';
      rate = 1;
      voice: unknown = null;
      onend: unknown = null;
      onerror: unknown = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance, configurable: true });
    const synth = {
      speaking: false,
      pending: false,
      paused: false,
      getVoices: () => voices,
      speak: (u: { text: string; lang: string; rate: number; onend?: () => void }) => {
        spoken.push({ text: u.text, lang: u.lang, rate: u.rate });
        if (u.onend) setTimeout(u.onend, 50);
      },
      cancel: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      onvoiceschanged: null,
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  }, langs);
}

test.describe('Mission Critical E2E: الصوت وترتيب الكلمات وخيار العامية', () => {
  test('ترتيب الكلمات: اتجاه LTR وإضافة وحذف الكلمات والإجابة الصحيحة', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('word-order'));
    await page.goto(`/learn/${PREA1}`);
    await enterExercises(page);

    // نمر عبر التمارين الثلاثة الأولى حتى نصل لتمرين ترتيب الكلمات (التمرين الرابع)
    for (let step = 0; step < 3; step++) {
      const choice = page.locator('.choice').first();
      const input = page.getByTestId('lesson-text');
      if (await choice.count()) {
        await choice.click();
      } else if (await input.count()) {
        await input.fill('me');
      }
      await page.getByTestId('lesson-submit').click();
      await expect(page.getByTestId('lesson-feedback')).toBeVisible();
      await page.getByTestId('lesson-next').click();
    }

    // الآن نحن في تمرين ترتيب الكلمات
    const selectedBox = page.getByTestId('selected-tokens');
    const remainingBox = page.getByTestId('remaining-tokens');
    await expect(selectedBox).toBeVisible();
    await expect(remainingBox).toBeVisible();

    // 1. التحقق من أن اتجاه الحاوية هو LTR صراحة لمنع انقلاب الجملة الإسبانية
    const dir = await selectedBox.evaluate(el => window.getComputedStyle(el).direction);
    expect(dir).toBe('ltr');

    // الكلمات المطلوبة لتكوين Me llamo Sara
    const meBtn = remainingBox.locator('button', { hasText: 'Me' }).first();
    const llamoBtn = remainingBox.locator('button', { hasText: 'llamo' }).first();
    const saraBtn = remainingBox.locator('button', { hasText: 'Sara' }).first();

    await expect(meBtn).toBeVisible();
    await expect(llamoBtn).toBeVisible();
    await expect(saraBtn).toBeVisible();

    // 2. تجربة النقر والترتيب LTR: نضغط Me ثم llamo ثم Sara
    await meBtn.click();
    await llamoBtn.click();
    await saraBtn.click();

    // نتحقق من ترتيب الكلمات في صندوق الإجابة
    const selectedWords = await selectedBox.locator('button').allInnerTexts();
    expect(selectedWords).toEqual(['Me', 'llamo', 'Sara']);

    // 3. تجربة حذف كلمة بالنقر عليها
    // نحذف كلمة llamo من الوسط
    const selectedLlamo = selectedBox.locator('button', { hasText: 'llamo' });
    await selectedLlamo.click();

    // نتأكد أن الكلمات المتبقية أصبحت Me ثم Sara فقط، وllamo عادت للصندوق السفلي
    expect(await selectedBox.locator('button').allInnerTexts()).toEqual(['Me', 'Sara']);
    await expect(llamoBtn).toBeEnabled();

    // نحذف Sara أيضاً
    await selectedBox.locator('button', { hasText: 'Sara' }).click();
    expect(await selectedBox.locator('button').allInnerTexts()).toEqual(['Me']);

    // نعيد إضافة llamo ثم Sara
    await llamoBtn.click();
    await saraBtn.click();
    expect(await selectedBox.locator('button').allInnerTexts()).toEqual(['Me', 'llamo', 'Sara']);

    // 4. إرسال الإجابة والتحقق من صحتها وقبولها بنجاح 100%
    await page.getByTestId('lesson-submit').click();
    await expect(page.getByTestId('lesson-feedback')).toBeVisible();
    await expect(page.getByTestId('lesson-feedback')).toContainText(/أحسنت|ممتاز|صحيحة/i);
  });

  test('زر الصوت وتبديل السرعة 0.75x يعمل دون تعليق أو أخطاء', async ({ page }) => {
    await fakeVoices(page, ['es-ES']);
    await signupThroughApi(page, uniqueEmail('audio-rate'));
    await page.goto(`/learn/${PREA1}`);
    await enterExercises(page);

    const audioBtn = page.getByTestId('lesson-audio').first();
    if (await audioBtn.count()) {
      // التحقق من وجود زر الصوت وسرعة النطق
      await audioBtn.click();
      await waitForSpoken(page, 1);
      const spoken = await page.evaluate(
        () => (window as unknown as { __spoken: { text: string; lang: string; rate: number }[] }).__spoken,
      );
      expect(spoken.length).toBeGreaterThan(0);
      expect(spoken[0]?.rate).toBe(1);

      // زر تغيير السرعة إلى 0.75x — النقر على المفتاح نفسه أثناء التشغيل
      // يوقف (toggle) في خدمة الصوت، فننتظر انتهاء النطق الأول (onend بعد
      // 50ms في البديل المزيف) قبل تبديل السرعة حتى يُشغَّل الثاني فعلًا.
      const rateBtn = page.getByRole('button', { name: /0\.75x|1x/i }).first();
      if (await rateBtn.count()) {
        await page.waitForTimeout(200);
        await rateBtn.click();
        // toggleRate نفسه يشغّل النطق بالسرعة الجديدة — لا ننقر زر الصوت
        // مرة أخرى فورًا وإلا أوقفنا التشغيل قبل بدئه.
        await waitForSpoken(page, 2);
        const spoken2 = await page.evaluate(
          () => (window as unknown as { __spoken: { text: string; lang: string; rate: number }[] }).__spoken,
        );
        expect(spoken2.length).toBeGreaterThan(1);
        expect(spoken2[1]?.rate).toBe(0.75);
      }
    }
  });

  test('خيار أسلوب الشرح (الفصحى فقط vs الفصحى مع المصرية) يحفظ ويؤثر على واجهة المتعلم', async ({ page }) => {
    await signupThroughApi(page, uniqueEmail('dialect-pref'));
    await page.goto('/settings');
    await expect(page.getByText('أسلوب الشرح والترجمة')).toBeVisible();

    // الافتراضي هو الفصحى مع المصرية
    const select = page.locator('select').first();
    await expect(select).toHaveValue('fusha_eg');

    // 1. التحويل إلى الفصحى فقط
    await select.selectOption('fusha');
    await page.getByRole('button', { name: 'حفظ الإعدادات' }).click();
    await expect(page.getByText(/حُفظت الإعدادات في حسابك/)).toBeVisible();

    // التحقق من الحفظ على الخادم عبر API
    const meRes1 = await page.context().request.get('/api/auth/me');
    const me1 = await meRes1.json();
    expect(me1.user.explanationStyle).toBe('fusha');

    // التحقق عند إعادة تحميل الصفحة
    await page.reload();
    await expect(select).toHaveValue('fusha');

    // 2. التحويل مجددًا إلى الفصحى مع المصرية
    await select.selectOption('fusha_eg');
    await page.getByRole('button', { name: 'حفظ الإعدادات' }).click();
    await expect(page.getByText(/حُفظت الإعدادات في حسابك/)).toBeVisible();

    const meRes2 = await page.context().request.get('/api/auth/me');
    const me2 = await meRes2.json();
    expect(me2.user.explanationStyle).toBe('fusha_eg');
  });
});
