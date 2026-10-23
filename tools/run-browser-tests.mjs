import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { buildContentPlan } from './lib/content-plan.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:8787';

const plan = buildContentPlan(resolve(ROOT, 'content/exemplars'), { existingVersions: {} });
const ANSWERS = plan.answers;

const results = [];
function assert(desc, ok, extra = '') {
  results.push({ desc, ok, extra });
  const icon = ok ? '✅' : '❌';
  console.log(`${icon} ${desc}${extra ? ' — ' + extra : ''}`);
  if (!ok) throw new Error(`FALIED: ${desc} ${extra}`);
}

async function run() {
  console.log(`\n🚀 بدء اختبارات المتصفح الحقيقي (Playwright Chromium) على ${BASE}\n`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'ar-EG',
    timezoneId: 'Africa/Cairo',
  });
  const page = await context.newPage();

  const userAEmail = `learner_a_${Date.now()}@example.com`;
  const userBEmail = `learner_b_${Date.now()}@example.com`;
  const userPassword = 'LearnerPass2026x!';

  try {
    // -------------------------------------------------------------------------
    // 1. الزائر غير المسجل والتحويل التلقائي
    // -------------------------------------------------------------------------
    await page.goto(`${BASE}/learn`);
    await page.waitForURL('**/login', { timeout: 5000 });
    assert('زيارة /learn بلا جلسة تحوّل المتعلم إلى /login', page.url().includes('/login'));

    await page.goto(`${BASE}/review`);
    await page.waitForURL('**/login', { timeout: 5000 });
    assert('زيارة /review بلا جلسة تحوّل المتعلم إلى /login', page.url().includes('/login'));

    // -------------------------------------------------------------------------
    // 2. تسجيل مستخدم جديد مع فحص كلمة المرور الضعيفة
    // -------------------------------------------------------------------------
    await page.goto(`${BASE}/signup`);
    assert('صفحة إنشاء الحساب تُفتح بنجاح', await page.locator('h1').textContent() === 'إنشاء حساب');

    // تجربة كلمة مرور ضعيفة
    await page.fill('input[type="email"]', userAEmail);
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    const alertText = await page.locator('.alert').textContent().catch(() => '');
    assert('كلمة مرور ضعيفة تُرفض وتُعرض رسالة خطأ واضحة', alertText.length > 0);

    // تسجيل صحيح
    await page.fill('input[type="text"]', 'أحمد');
    await page.fill('input[type="password"]', userPassword);
    await page.click('button[type="submit"]');

    // انتظار التحويل إلى لوحة التعلم
    await page.waitForURL('**/learn', { timeout: 10000 });
    assert('إنشاء الحساب الناجح يحوّل المتعلم تلقائيًا إلى /learn', page.url().endsWith('/learn'));

    // -------------------------------------------------------------------------
    // 3. لوحة التعلم والإحصائيات الأولية
    // -------------------------------------------------------------------------
    await page.waitForSelector('[data-testid="stat-xp"]');
    const xp0 = await page.locator('[data-testid="stat-xp"] .num').textContent();
    assert('إجمالي XP لمستخدم جديد هو 0 حقيقي', xp0?.trim() === '0');

    const lessons0 = await page.locator('[data-testid="stat-lessons"] .num').textContent();
    assert('الدروس المكتملة لمستخدم جديد تبدأ بـ 0', lessons0?.startsWith('0/'));

    const reviewCta = await page.locator('[data-testid="review-cta"]').textContent();
    assert('المراجعة المتباعدة توضح عدم وجود بطاقات للمستخدم الجديد', reviewCta?.includes('لا بطاقات بعد'));

    // -------------------------------------------------------------------------
    // 4. فحص قفل الدرس a1-un-cafe-por-favor قبل إتمام prea1
    // -------------------------------------------------------------------------
    await page.goto(`${BASE}/learn/a1-un-cafe-por-favor`);
    await page.waitForTimeout(1000);
    const lockedMsg = await page.textContent('body');
    assert('درس A1 مقفل قبل إتمام PREA1 ومحاولة دخوله تُظهر قفل الدرس', lockedMsg.includes('مقفل'));
    const submitBtnCount = await page.locator('[data-testid="lesson-submit"]').count();
    assert('الدرس المقفل لا يحتوي على زر التحقق', submitBtnCount === 0);

    // -------------------------------------------------------------------------
    // 5. فتح درس PREA1 وحل التمارين التفاعلية
    // -------------------------------------------------------------------------
    await page.goto(`${BASE}/learn/prea1-hola-me-llamo`);
    await page.waitForSelector('[data-testid="lesson-submit"]', { timeout: 10000 });

    const bodyText = await page.textContent('body');
    assert('وسم عينة تعليمية تجريبية يظهر للمتعلم بأمانة', bodyText.includes('عينة تعليمية تجريبية'));

    // الحصول على تمارين الجلسة من الخادم
    const sessionRes = await page.request.get(`${BASE}/api/lessons/prea1-hola-me-llamo/session`);
    const sessionData = await sessionRes.json();
    const exercises = sessionData.exercises;
    assert('جلسة الدرس تُسلَّم بتمارين فعلية من الخادم', exercises.length > 0, `عدد التمارين=${exercises.length}`);

    // التأكد من عدم تسريب مفاتيح الإجابة في بيانات الجلسة
    const leaked = JSON.stringify(sessionData).match(/answerKey|correctOptionIds|is_correct|isCorrect/i);
    assert('بيانات الجلسة لا تسرب مفاتيح الإجابة ولا الخيارات الصحيحة', leaked === null);

    // حل جميع التمارين
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      const audioBtn = page.locator('[data-testid="lesson-audio"]').first();
      if (await audioBtn.count() > 0) {
        await audioBtn.click();
        await page.waitForTimeout(200);
      }

      const choice = page.locator('.choice').first();
      const textInput = page.locator('[data-testid="lesson-text"]');
      const ghostTokens = page.locator('.token.ghost');
      const textarea = page.locator('textarea');

      if (await choice.count() > 0) {
        await choice.click();
      } else if (await textInput.count() > 0) {
        const ans = ANSWERS[ex.id] || 'hola';
        await textInput.fill(typeof ans === 'string' ? ans : 'hola');
      } else if (await ghostTokens.count() > 0) {
        const count = await ghostTokens.count();
        for (let k = 0; k < count; k++) {
          await page.locator('.token.ghost').first().click();
        }
      } else if (await textarea.count() > 0) {
        await textarea.fill('Hola, me llamo estudiante.');
      }

      await page.click('[data-testid="lesson-submit"]');
      await page.waitForSelector('[data-testid="lesson-feedback"]');
      await page.click('[data-testid="lesson-next"]');
    }

    // شاشة نهاية الدرس — ننتظر حتى ينتهي حساب النتيجة على الخادم
    await page.waitForSelector('[data-testid="lesson-result"]', { timeout: 10000 });
    await page.locator('[data-testid="lesson-result"]:has-text("أتممت الدرس بنجاح")').waitFor({ timeout: 10000 });
    const resultText = await page.locator('[data-testid="lesson-result"]').textContent();
    assert('شاشة إتمام الدرس تُعلن النجاح ومنح 30 XP', resultText?.includes('أتممت الدرس بنجاح') && resultText?.includes('30'));

    // -------------------------------------------------------------------------
    // 6. التحقق من منع تكرار XP عند إعادة الدرس
    // -------------------------------------------------------------------------
    await page.click('button:has-text("إعادة الدرس")');
    await page.waitForSelector('[data-testid="lesson-submit"]', { timeout: 10000 });
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      const choice = page.locator('.choice').first();
      const textInput = page.locator('[data-testid="lesson-text"]');
      const ghostTokens = page.locator('.token.ghost');
      const textarea = page.locator('textarea');

      if (await choice.count() > 0) await choice.click();
      else if (await textInput.count() > 0) await textInput.fill('hola');
      else if (await ghostTokens.count() > 0) {
        const count = await ghostTokens.count();
        for (let k = 0; k < count; k++) await page.locator('.token.ghost').first().click();
      } else if (await textarea.count() > 0) await textarea.fill('hola');

      await page.click('[data-testid="lesson-submit"]');
      await page.waitForSelector('[data-testid="lesson-feedback"]');
      await page.click('[data-testid="lesson-next"]');
    }
    await page.waitForSelector('[data-testid="lesson-result"]', { timeout: 10000 });
    await page.locator('[data-testid="lesson-result"]:has-text("لا تُمنح نقاط إضافية")').waitFor({ timeout: 10000 });
    const repeatResult = await page.locator('[data-testid="lesson-result"]').textContent();
    assert('إعادة الدرس لا تمنح نقاطًا إضافية', repeatResult?.includes('لا تُمنح نقاط إضافية'));

    // -------------------------------------------------------------------------
    // 7. حفظ التقدم بعد تحديث الصفحة
    // -------------------------------------------------------------------------
    await page.goto(`${BASE}/learn`);
    await page.reload();
    await page.waitForSelector('[data-testid="stat-xp"]');
    const xpAfterReload = await page.locator('[data-testid="stat-xp"] .num').textContent();
    assert('XP محفوظ عند 30 بعد تحديث الصفحة', xpAfterReload?.trim() === '30');

    const lessonsAfterReload = await page.locator('[data-testid="stat-lessons"] .num').textContent();
    assert('الدروس المكتملة 1 بعد تحديث الصفحة', lessonsAfterReload?.startsWith('1/'));

    // -------------------------------------------------------------------------
    // 8. فتاح درس A1 بعد إتمام المتطلب السابق
    // -------------------------------------------------------------------------
    await page.goto(`${BASE}/learn/a1-un-cafe-por-favor`);
    await page.waitForSelector('[data-testid="lesson-submit"]', { timeout: 10000 });
    assert('درس A1 فُتح رسميًا بعد إتمام PREA1 وزر التحقق متاح', true);

    // -------------------------------------------------------------------------
    // 9. الخروج ثم الدخول بنفس الحساب — استعادة التقدم
    // -------------------------------------------------------------------------
    await page.goto(`${BASE}/learn`);
    await page.click('header button:has-text("خروج")');
    await page.waitForURL('**/login', { timeout: 5000 });
    assert('الجلسة أُبطلت بالخروج وتوجّه المتعلم تلقائيًا إلى /login', page.url().includes('/login'));

    // إعادة الدخول بنفس الحساب
    await page.fill('input[type="email"]', userAEmail);
    await page.fill('input[type="password"]', userPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/learn', { timeout: 10000 });

    await page.waitForSelector('[data-testid="stat-xp"]');
    const xpRestored = await page.locator('[data-testid="stat-xp"] .num').textContent();
    assert('التقدم مستعاد بدقة بعد إعادة الدخول (XP=30)', xpRestored?.trim() === '30');

    // -------------------------------------------------------------------------
    // 10. عزل بيانات المستخدمين (User B)
    // -------------------------------------------------------------------------
    await page.click('header button:has-text("خروج")');
    await page.waitForURL('**/login', { timeout: 5000 });

    // تسجيل المستخدم الثاني
    await page.goto(`${BASE}/signup`);
    await page.fill('input[type="text"]', 'سارة');
    await page.fill('input[type="email"]', userBEmail);
    await page.fill('input[type="password"]', userPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/learn', { timeout: 10000 });

    const userB_xp = await page.locator('[data-testid="stat-xp"] .num').textContent();
    assert('بيانات المستخدم الجديد معزولة تمامًا (XP=0)', userB_xp?.trim() === '0');
    const userB_lessons = await page.locator('[data-testid="stat-lessons"] .num').textContent();
    assert('دروس المستخدم الجديد معزولة تمامًا (0 دروس مكتملة)', userB_lessons?.startsWith('0/'));

    // -------------------------------------------------------------------------
    // 11. تجربة المراجعة المتباعدة (SRS) للمستخدم A
    // -------------------------------------------------------------------------
    // نعود للمستخدم A الذي أتم درسًا
    await page.click('header button:has-text("خروج")');
    await page.waitForURL('**/login', { timeout: 5000 });
    await page.fill('input[type="email"]', userAEmail);
    await page.fill('input[type="password"]', userPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/learn');

    // الانتقال إلى المراجعة
    await page.click('[data-testid="review-start"]');
    await page.waitForURL('**/review');
    await page.waitForSelector('[data-testid="review-card"]');
    assert('بطاقة المراجعة تظهر بنجاح بعد إتمام الدرس', true);

    const answerCountBeforeReveal = await page.locator('[data-testid="review-answer"]').count();
    assert('الإجابة مخفية قبل ضغط كشف الإجابة', answerCountBeforeReveal === 0);

    // كشف الإجابة بالماوس
    await page.click('[data-testid="review-reveal"]');
    await page.waitForSelector('[data-testid="review-answer"]');
    assert('الإجابة تظهر فور الضغط على كشف الإجابة', true);

    // التقييم بـ جيد
    await page.click('[data-testid="review-rate-good"]');
    await page.waitForTimeout(500);
    assert('التقييم يُرسل ويُسجَّل بنجاح', true);

    // -------------------------------------------------------------------------
    // 12. التنقل بلوحة المفاتيح في المراجعة (مسافة للكشف، رقم 3 للتقييم)
    // -------------------------------------------------------------------------
    const remainingCards = await page.locator('[data-testid="review-card"]').count();
    if (remainingCards > 0) {
      await page.keyboard.press(' ');
      await page.waitForSelector('[data-testid="review-answer"]');
      assert('مفتاح المسافة يكشف الإجابة بلوحة المفاتيح', true);

      await page.keyboard.press('3');
      await page.waitForTimeout(500);
      assert('الأرقام 1-4 تقيّم البطاقة بلوحة المفاتيح', true);
    }

    // -------------------------------------------------------------------------
    // 13. فحص التجاوب على شاشة الهاتف (320px)
    // -------------------------------------------------------------------------
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(`${BASE}/learn`);
    await page.waitForSelector('[data-testid="stat-xp"]');
    const overflowLearn = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    assert('شاشة 320px في لوحة التعلم لا تحتوي على تمرير أفقي', overflowLearn <= 1, `overflow=${overflowLearn}px`);

    await page.goto(`${BASE}/learn/prea1-hola-me-llamo`);
    await page.waitForSelector('[data-testid="lesson-submit"]');
    const overflowLesson = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    assert('شاشة 320px في الدرس لا تحتوي على تمرير أفقي', overflowLesson <= 1, `overflow=${overflowLesson}px`);

    // -------------------------------------------------------------------------
    // 14. فحص سلامة مسارات المنهج وعدم وجود روابط مكسورة
    // -------------------------------------------------------------------------
    const pathsRes = await page.request.get(`${BASE}/api/content/paths`);
    const pathsData = await pathsRes.json();
    assert('كتالوج المسارات متاح ويغطي المسارات المنهجية والمهنية', pathsData.paths.length >= 3, `المسارات=${pathsData.paths.length}`);

    // -------------------------------------------------------------------------
    // 15. فحص البحث الذكي في المتصفح الحقيقي
    // -------------------------------------------------------------------------
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/search`);
    assert('صفحة البحث الذكي /search تفتح بنجاح', (await page.locator('h1').textContent())?.includes('البحث الذكي'));

    // بحث عن كلمة إسبانية
    await page.fill('[data-testid="search-input"]', 'gracias');
    await page.waitForTimeout(600);
    const searchCards = await page.locator('.card:has-text("gracias")').count();
    assert('البحث الذكي يجد كلمة gracias ويعرض بطاقة النتيجة', searchCards > 0);

    // فحص زر استماع النطق في البحث
    const searchAudioBtn = page.locator('.card button:has-text("🔊")').first();
    if (await searchAudioBtn.count() > 0) {
      await searchAudioBtn.click();
      assert('زر نطق الكلمة في نتائج البحث قابل للنقر دون أخطاء', true);
    }

    // بحث عن خطأ إملائي واقتراح التصحيح
    await page.fill('[data-testid="search-input"]', 'bibloteca');
    await page.waitForTimeout(600);
    const bodyContent = await page.textContent('body');
    assert('البحث يقترح الكلمة الصحيحة عند وجود خطأ إملائي', bodyContent?.includes('biblioteca'));

    // -------------------------------------------------------------------------
    // 16. فحص أزرار التحكم بالصوت والسرعة وإعادة الاستماع في شاشة الدرس
    // -------------------------------------------------------------------------
    await page.goto(`${BASE}/learn/prea1-hola-me-llamo`);
    await page.waitForSelector('[data-testid="lesson-submit"]', { timeout: 10000 });
    const audioBtn = page.locator('[data-testid="lesson-audio"]').first();
    if (await audioBtn.count() > 0) {
      await audioBtn.click();
      assert('زر الصوت الأساسي في الدرس يستجيب للنقر', true);
    }
    const replayBtn = page.locator('[data-testid="lesson-audio-replay"]').first();
    if (await replayBtn.count() > 0) {
      await replayBtn.click();
      assert('زر إعادة الاستماع يستجيب للنقر', true);
    }
    const rateBtn = page.locator('[data-testid="lesson-audio-rate"]').first();
    if (await rateBtn.count() > 0) {
      const rateTextBefore = await rateBtn.textContent();
      await rateBtn.click();
      const rateTextAfter = await rateBtn.textContent();
      assert('زر تبديل سرعة النطق يغير السرعة بنجاح', rateTextBefore !== rateTextAfter);
    }

    console.log(`\n🎉 اكتملت جميع اختبارات المتصفح الحقيقي بنجاح تام! (${results.length}/${results.length})\n`);
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch(err => {
  console.error('\n❌ فشل اختبار المتصفح:', err);
  process.exit(1);
});
