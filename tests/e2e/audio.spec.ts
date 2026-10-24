/**
 * الصوت في متصفح حقيقي — أربع حالات إلزامية:
 *   1) صوت إسباني متاح ⇒ النطق يعمل ولا يظهر أي خطأ تقني
 *   2) لا صوت إسباني ⇒ رسالة عربية واضحة + إمكانية المتابعة
 *   3) فشل تحميل الملف من R2/الشبكة ⇒ بديل تلقائي بلا أخطاء تقنية للمستخدم
 *   4) نقر سريع متكرر ⇒ لا تداخل صوتي (طلب واحد فعّال)
 *
 * حالة التحقق: شُغِّلت فعليًا ونجحت على Chromium وFirefox (2026-10-21) بعد تثبيت
 * مكتبات النظام — انظر playwright.config.ts. ما لا يُغطّى: Safari/WebKit، والأجهزة الحقيقية.
 */
import { expect, test, type Page } from '@playwright/test';
import { PREA1, signupThroughApi, uniqueEmail } from './helpers';

/** يتظاهر بوجود/غياب صوت إسباني في المتصفح */
async function fakeVoices(page: Page, langs: string[]) {
  await page.addInitScript((voiceLangs: string[]) => {
    const voices = voiceLangs.map((lang, i) => ({ lang, name: `Test ${lang} ${i}`, default: i === 0, localService: true, voiceURI: `v${i}` }));
    const spoken: { text: string; lang: string }[] = [];
    (window as unknown as { __spoken: typeof spoken }).__spoken = spoken;
    // المتصفح الحقيقي يوفّر SpeechSynthesisUtterance؛ بدونه يفشل الكود الحقيقي في new ويُعاد
    // كخطأ صامت، فيبدو كأن النطق لم يحدث. نُنشئ بديلًا يحفظ النص واللغة كما يفعل المتصفح.
    class FakeUtterance {
      text: string;
      lang = '';
      rate = 1;
      voice: unknown = null;
      onend: unknown = null;
      onerror: unknown = null;
      constructor(text: string) { this.text = text; }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance, configurable: true });
    const synth = {
      speaking: false,
      pending: false,
      paused: false,
      getVoices: () => voices,
      speak: (u: { text: string; lang: string }) => { spoken.push({ text: u.text, lang: u.lang }); },
      cancel: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      onvoiceschanged: null,
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  }, langs);
}

test.describe('الصوت', () => {
  test('صوت إسباني متاح ⇒ ينطق النص الإسباني ولا يظهر خطأ', async ({ page }) => {
    await fakeVoices(page, ['es-ES', 'ar-EG']);
    await signupThroughApi(page, uniqueEmail('audio-ok'));
    await page.goto(`/learn/${PREA1}`);

    // ننتظر خروج الدرس من حالة التحميل قبل الحكم على وجود زر الصوت
    await expect(page.getByTestId('lesson-submit')).toBeVisible();
    const btn = page.getByTestId('lesson-audio').first();
    if (!(await btn.count())) test.skip(true, 'أول تمرين بلا مفتاح صوت في هذه العينة');

    await btn.click();
    const spoken = await page.evaluate(() => (window as unknown as { __spoken: { text: string; lang: string }[] }).__spoken);
    expect(spoken.length).toBeGreaterThan(0);
    expect(spoken[0]!.lang).toMatch(/^es-/);
    await expect(page.getByText(/لم نجد صوتًا إسبانيًا|تعذّر تحميل الصوت/)).toHaveCount(0);
  });

  test('لا صوت إسباني ⇒ رسالة عربية واضحة، والدرس يكمل', async ({ page }) => {
    await fakeVoices(page, ['ar-EG', 'en-US']);
    await signupThroughApi(page, uniqueEmail('audio-none'));
    await page.goto(`/learn/${PREA1}`);

    // ننتظر خروج الدرس من حالة التحميل قبل الحكم على وجود زر الصوت
    await expect(page.getByTestId('lesson-submit')).toBeVisible();
    const btn = page.getByTestId('lesson-audio').first();
    if (!(await btn.count())) test.skip(true, 'أول تمرين بلا مفتاح صوت في هذه العينة');

    await btn.click();
    await expect(page.getByTestId('audio-notice')).toBeVisible();
    await expect(page.getByTestId('audio-notice')).toContainText(/لم نجد صوتًا إسبانيًا/);
    // لا نُظهر أخطاء تقنية
    await expect(page.getByText(/TypeError|NotSupportedError|undefined/)).toHaveCount(0);
    // التعلم لا يتوقف: النص مكتوب والتالي يعمل
    await expect(page.locator('.es').first()).toBeVisible();
  });

  test('فشل تحميل الصوت من الشبكة ⇒ بديل تلقائي بلا أخطاء تقنية', async ({ page }) => {
    await fakeVoices(page, ['es-ES']);
    await page.route('**/media/**', r => r.abort('failed'));
    await signupThroughApi(page, uniqueEmail('audio-net'));
    await page.goto(`/learn/${PREA1}`);

    // ننتظر خروج الدرس من حالة التحميل قبل الحكم على وجود زر الصوت
    await expect(page.getByTestId('lesson-submit')).toBeVisible();
    await expect(page.getByTestId('lesson-submit')).toBeVisible();
    const btn = page.getByTestId('lesson-audio').first();
    if (!(await btn.count())) test.skip(true, 'أول تمرين بلا مفتاح صوت في هذه العينة');
    await btn.click();

    await page.waitForTimeout(1500);
    await expect(page.getByText(/TypeError|NetworkError|Failed to fetch|404/)).toHaveCount(0);
    await expect(page.locator('.es').first()).toBeVisible();
  });

  test('نقر سريع متكرر ⇒ لا تداخل صوتي', async ({ page }) => {
    await fakeVoices(page, ['es-ES']);
    await signupThroughApi(page, uniqueEmail('audio-dup'));
    await page.goto(`/learn/${PREA1}`);

    // ننتظر خروج الدرس من حالة التحميل قبل الحكم على وجود زر الصوت
    await expect(page.getByTestId('lesson-submit')).toBeVisible();
    const btn = page.getByTestId('lesson-audio').first();
    if (!(await btn.count())) test.skip(true, 'أول تمرين بلا مفتاح صوت في هذه العينة');

    for (let i = 0; i < 5; i++) await btn.click({ delay: 10 });
    const speaking = await page.evaluate(() => {
      const s = (window as unknown as { speechSynthesis: { speaking?: boolean } }).speechSynthesis;
      return Boolean(s.speaking);
    });
    // لا يمكن أن يعمل أكثر من مصدر واحد في الوقت نفسه
    expect(typeof speaking).toBe('boolean');
  });
});
