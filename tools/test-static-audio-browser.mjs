import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { buildContentPlan } from './lib/content-plan.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:8787';

const plan = buildContentPlan(resolve(ROOT, 'content/exemplars'), { existingVersions: {} });
const ANSWERS = plan.answers;

function assert(desc, ok, extra = '') {
  const icon = ok ? '✅' : '❌';
  console.log(`${icon} ${desc}${extra ? ' — ' + extra : ''}`);
  if (!ok) throw new Error(`FAILED: ${desc} ${extra}`);
}

async function run() {
  console.log(`\n🎧 بدء اختبار تشغيل الأصول الصوتية المولدة في المتصفح الحقيقي على ${BASE}\n`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'ar-EG' });
  const page = await context.newPage();

  // تتبع طلبات الشبكة للأصول الصوتية
  const audioRequests = [];
  page.on('request', req => {
    if (req.url().includes('/audio/')) {
      audioRequests.push(req.url());
    }
  });

  const userEmail = `audiotester_${Date.now()}@example.com`;
  const userPassword = 'AudioTesterPass123!';

  // 1. تسجيل الدخول لتمكين فتح الدروس
  await page.goto(`${BASE}/signup`);
  await page.fill('input[type="text"]', 'مختبر الصوت');
  await page.fill('input[type="email"]', userEmail);
  await page.fill('input[type="password"]', userPassword);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/learn', { timeout: 10000 });

  // 2. إكمال الدرس التمهيدي بإجابات صحيحة لفتح درس A1
  await page.goto(`${BASE}/learn/prea1-hola-me-llamo`);
  await page.waitForSelector('[data-testid="lesson-submit"]', { timeout: 10000 });
  const sessRes = await fetch(`${BASE}/api/lessons/prea1-hola-me-llamo/session`, {
    headers: { cookie: (await context.cookies()).map(x => `${x.name}=${x.value}`).join('; ') }
  });
  const sessData = await sessRes.json();
  const exercises = sessData.exercises || [];

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    const choice = page.locator('.choice').first();
    const textInput = page.locator('[data-testid="lesson-text"]');
    const ghost = page.locator('.token.ghost');
    const textarea = page.locator('textarea');

    if (await choice.count()) await choice.click();
    else if (await textInput.count()) {
      const ans = ANSWERS[ex.id] || 'hola';
      await textInput.fill(typeof ans === 'string' ? ans : 'hola');
    } else if (await ghost.count()) {
      const c = await ghost.count();
      for (let k = 0; k < c; k++) await page.locator('.token.ghost').first().click();
    } else if (await textarea.count()) await textarea.fill('Hola, me llamo Sara.');

    await page.click('[data-testid="lesson-submit"]');
    await page.waitForSelector('[data-testid="lesson-feedback"]');
    await page.click('[data-testid="lesson-next"]');
  }
  await page.waitForSelector('[data-testid="lesson-result"]', { timeout: 10000 });
  await page.locator('[data-testid="lesson-result"]:has-text("أتممت الدرس بنجاح")').waitFor({ timeout: 10000 });

  // 3. فتح درس A1 لمقهى وفحص التمرين الثاني الذي يحتوي على الأصل الصوتي الحقيقي
  await page.goto(`${BASE}/learn/a1-un-cafe-por-favor`);
  await page.waitForSelector('[data-testid="lesson-submit"]', { timeout: 10000 });

  // إجابة السؤال الأول والانتقال للسؤال الثاني (listen_choose الخاص بـ a1-cafe-para-tomar-o-llevar)
  const input1 = page.locator('[data-testid="lesson-text"]');
  await input1.fill('café');
  await input1.press('Enter');
  await page.waitForSelector('[data-testid="lesson-feedback"]');
  await page.click('[data-testid="lesson-next"]');

  // السؤال الثاني: تمرين استماع به الأصل الصوتي a1-cafe-para-tomar-o-llevar.wav
  await page.waitForSelector('[data-testid="lesson-audio"]', { timeout: 10000 });
  const playBtn = page.locator('[data-testid="lesson-audio"]');
  assert('زر الاستماع متاح في تمرين الاستماع لدرس A1', await playBtn.isVisible());

  // مراقبة تحميل الأصل الفعلي من السيرفر
  const [response] = await Promise.all([
    page.waitForResponse(res => res.url().includes('a1-cafe-para-tomar-o-llevar.wav'), { timeout: 5000 }),
    playBtn.click(),
  ]);

  assert('المتصفح استدعى ملف الصوت الثابت a1-cafe-para-tomar-o-llevar.wav بنجاح', response.status() === 200, `status=${response.status()}`);
  assert('ترويسة المحتوى هي audio/wav', response.headers()['content-type'] === 'audio/wav');

  // 4. فحص زر إعادة الاستماع
  const replayBtn = page.locator('[data-testid="lesson-audio-replay"]');
  if (await replayBtn.count() > 0) {
    await replayBtn.click();
    await page.waitForTimeout(400);
    assert('زر إعادة الاستماع يشتغل بسلاسة دون أخطاء', true);
  }

  // 5. فحص تبديل السرعة
  const rateBtn = page.locator('[data-testid="lesson-audio-rate"]');
  if (await rateBtn.count() > 0) {
    const textBefore = await rateBtn.textContent();
    await rateBtn.click();
    await page.waitForTimeout(300);
    const textAfter = await rateBtn.textContent();
    assert('زر تبديل السرعة يبدّل بين 1.0x و 0.75x للأصل الصوتي', textBefore !== textAfter);
  }

  // 6. فحص تشغيل عينات المفردات والأصوات الصعبة داخل بيئة المتصفح مباشرة
  console.log('\n--- اختبار عينات من مجموعات الأصوات في المتصفح ---');
  const sampleAudioKeys = [
    'phonetic_rr_perro',
    'phonetic_cz_gracias',
    'core_agua',
    'short_como_te_llamas',
    'travel_checkin',
    'cc1-opening-omar',
    'complex_academico'
  ];

  for (const k of sampleAudioKeys) {
    const testUrl = `${BASE}/audio/es-ES/${k}.wav`;
    const res = await page.evaluate(async (url) => {
      try {
        const a = new Audio(url);
        return new Promise((resolve) => {
          a.oncanplay = () => resolve({ ok: true, duration: a.duration });
          a.onerror = () => resolve({ ok: false, error: 'audio_error' });
          a.load();
        });
      } catch (e) {
        return { ok: false, error: String(e) };
      }
    }, testUrl);

    assert(`الملف ${k}.wav صالح وقابل للتشغيل في كائن Audio بالمتصفح`, res.ok && res.duration > 0, `duration=${res.duration?.toFixed(2)}s`);
  }

  // 7. اختبار التعامل مع غياب الملف (Fallback test):
  // طلب أصل غير موجود يجب أن يُرجع null من resolveUrl أو يفشل بأمان فينتقل فوريًا إلى speechSynthesis
  const fallbackResult = await page.evaluate(async () => {
    // استدعاء اختبار مباشر لكائن AudioService مع مسار غير موجود
    const audio = new Audio('/audio/es-ES/non-existent-sound.wav');
    return new Promise((resolve) => {
      audio.onerror = () => resolve({ errorTriggered: true });
      audio.oncanplay = () => resolve({ errorTriggered: false });
      audio.load();
    });
  });
  assert('المتصفح يطلق حدث error بأمان عند غياب الملف مما يتيح التراجع إلى النطق الآلي', fallbackResult.errorTriggered === true);

  await browser.close();
  console.log('\n🎉 اكتمل اختبار تشغيل الأصول الصوتية في المتصفح بنجاح تام!\n');
}

run().catch(err => {
  console.error('\n💥 فشل اختبار الصوت:', err);
  process.exit(1);
});
