/**
 * محرك التمارين: التصحيح، سلطة الخادم، منع تكرار النقاط، الفتح، وحفظ التقدم.
 * كل اختبار هنا يقابل بندًا في docs/22_PHASE2_REPORT.md.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { makeHarness, VALID_EMAIL, type Harness } from './harness';
import { gradeAnswer, gradingModeOf } from '../src/worker/lib/grading';
import { correctAnswer, importExemplars } from './content-fixture';
import { PLACEMENT_QUESTIONS } from '../src/worker/lib/placement-bank';

const PW = 'Cairo2026learn';

let h: Harness;
let cookie: string;

async function signup(hh: Harness, email = VALID_EMAIL) {
  const res = await hh.call('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password: PW, displayName: 'سارة' }) });
  expect(res.status).toBe(201);
  return hh.cookieOf(res)!;
}

beforeEach(async () => {
  h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
  importExemplars(h);
  cookie = await signup(h);
});

/* ------------------------------ التصحيح ------------------------------ */

describe('G: التصحيح (دالة نقية)', () => {
  it('fill_blank يتجاهل حالة الأحرف والهمزة الناقصة عند السماح', () => {
    const key = { accepted: ['café', 'cafe'], caseSensitive: false, allowMissingAccent: true };
    expect(gradeAnswer('fill_blank', key, 'CAFE').correct).toBe(true);
    expect(gradeAnswer('fill_blank', key, 'café').correct).toBe(true);
    expect(gradeAnswer('fill_blank', key, 'té').correct).toBe(false);
  });

  it('translate_short يتجاهل الترقيم افتراضيًا', () => {
    const key = { accepted: ['Quiero agua, por favor.'], caseSensitive: false, punctuationInsensitive: true };
    expect(gradeAnswer('translate_short', key, 'quiero agua por favor').correct).toBe(true);
    expect(gradeAnswer('translate_short', key, 'Quiero agua por favor!').correct).toBe(true);
    expect(gradeAnswer('translate_short', key, 'Necesito agua por favor').correct).toBe(false);
  });

  it('اختيار خيار: لا يقبل أكثر من خيار واحد صحيح', () => {
    const key = { correctOptionIds: ['a'] };
    expect(gradeAnswer('word_choice', key, { optionId: 'a' }).correct).toBe(true);
    expect(gradeAnswer('word_choice', key, 'a').correct).toBe(true);
    expect(gradeAnswer('word_choice', key, { optionIds: ['a', 'b'] }).correct).toBe(false);
    expect(gradeAnswer('word_choice', key, 'b').correct).toBe(false);
  });

  it('الخيار الخاطئ يعيد تغذية راجعة مخصصة لذلك الخيار', () => {
    const res = gradeAnswer('listen_choose', { correctOptionIds: ['a'] }, { optionId: 'c' }, { c: 'لا يجيب عن السؤال' });
    expect(res.correct).toBe(false);
    expect(res.chosenFeedbackAr).toBe('لا يجيب عن السؤال');
  });

    it('word_order يقبل مصفوفة الكلمات المباشرة (raw array) من اليسار لليمين', () => {
    const key = { accepted: ['Yo te amo'], punctuationInsensitive: true };
    // جملة من 3 كلمات: الترتيب السليم LTR
    expect(gradeAnswer('word_order', key, ['Yo', 'te', 'amo']).correct).toBe(true);
    // الترتيب المعكوس يُرفض
    expect(gradeAnswer('word_order', key, ['amo', 'te', 'Yo']).correct).toBe(false);
  });

  it('word_order يتعامل مع جملة 5 كلمات وعلامات الاستفهام والكلمات المكررة', () => {
    const key = { accepted: ['¿A qué hora quedamos mañana?'], punctuationInsensitive: true };
    expect(gradeAnswer('word_order', key, ['¿A', 'qué', 'hora', 'quedamos', 'mañana?']).correct).toBe(true);
    expect(gradeAnswer('word_order', key, ['mañana?', 'quedamos', 'hora', 'qué', '¿A']).correct).toBe(false);

    // كلمات مكررة في نفس الجملة
    const keyRepeat = { accepted: ['es lo que es'] };
    expect(gradeAnswer('word_order', keyRepeat, ['es', 'lo', 'que', 'es']).correct).toBe(true);
    expect(gradeAnswer('word_order', keyRepeat, ['lo', 'es', 'es', 'que']).correct).toBe(false);
  });

  it('word_order يقبل صيغًا متعددة ويرفض الترتيب الخاطئ', () => {
    const key = { accepted: ['Quiero un café por favor', 'Quiero un café, por favor'], punctuationInsensitive: true };
    expect(gradeAnswer('word_order', key, { tokens: ['Quiero', 'un', 'café', 'por', 'favor'] }).correct).toBe(true);
    expect(gradeAnswer('word_order', key, { tokens: ['café', 'Quiero', 'un', 'favor', 'por'] }).correct).toBe(false);
  });

  it('تمارين النطق والتمثيل = مشاركة، لا يُدّعى تصحيحها', () => {
    for (const t of ['speak_with_text', 'roleplay_simulation', 'phone_call_response']) {
      expect(gradingModeOf(t)).toBe('participation');
      const r = gradeAnswer(t, { mode: 'self_assessment' }, 'أي نص');
      expect(r.correct).toBeNull();
      expect(r.score).toBeNull();
    }
  });

  it('dialogue_order يُصحَّح بالترتيب لا بمعرّفات الخيارات (انحدار: كان يُقرأ كسؤال اختيار)', () => {
    // المحتوى القديم حمل correctOptionIds داخل dialogue_order، فكان المُصحِّح يقرأ {order}
    // كأنه لم يُختر شيء ⇒ التمرين دائم الخطأ. القاعدة: أنواع الترتيب تُفحص أولًا.
    const ids = ['s1', 's2', 's3'];
    const sentences = ['Uno.', 'Dos.', 'Tres.'];
    const key = {
      correctOptionIds: ids,
      accepted: [sentences.join(' ')],
      punctuationInsensitive: true,
    };
    expect(gradeAnswer('dialogue_order', key, { order: sentences }).correct).toBe(true);
    expect(gradeAnswer('dialogue_order', key, { order: [...sentences].reverse() }).correct).toBe(false);
  });

  it('تمرين الترتيب يعيد تغذية راجعة مكتوبة عند الترتيب الخاطئ', () => {
    const key = { accepted: ['Quiero un café'], punctuationInsensitive: true };
    const r = gradeAnswer('word_order', key, { tokens: ['café', 'Quiero', 'un'] }, { order: 'ابدأ بالفاعل' });
    expect(r.correct).toBe(false);
    expect(r.chosenFeedbackAr).toBe('ابدأ بالفاعل');
  });

  it('الإجابة النصية الخاطئة تُطابَق بتغذية راجعة مكتوبة بعد نفس التسوية (لا تُهمَل)', () => {
    // التغذية الراجعة في المحتوى مكتوبة على شكل الإجابة الخاطئة نفسها، مثل «llego»
    const r = gradeAnswer('fill_blank', { accepted: ['llega'] }, '  LLEGO. ', { llego: '«llego» للمتحدث؛ الحقيبة مفرد غائب ⇒ llega.' });
    expect(r.correct).toBe(false);
    expect(r.chosenFeedbackAr).toContain('llega');
  });

  it('مفتاح تصحيح مفقود لا يمنح نجاحًا صامتًا', () => {
    const r = gradeAnswer('fill_blank', {}, 'أي شيء');
    expect(r.correct).toBeNull();
    expect(r.mode).toBe('participation');
  });
});

/* --------------------------- سلطة الخادم --------------------------- */

describe('E: جلسة الدرس لا تسرّب الإجابات', () => {
  it('التمارين تُرسل بلا مفاتيح إجابة وبلا خيار صحيح', async () => {
    const res = await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie });
    expect(res.status).toBe(200);
    const body = await h.json(res);
    expect(body.exercises.length).toBeGreaterThan(0);
    for (const ex of body.exercises) {
      expect(ex.answerKey).toBeUndefined();
      expect(ex.answer_key).toBeUndefined();
      expect(ex.correctOptionIds).toBeUndefined();
      expect(ex.errorFeedback).toBeUndefined();
      for (const opt of ex.options) {
        expect(opt.is_correct).toBeUndefined();
        expect(opt.isCorrect).toBeUndefined();
        expect(opt.distractorRationaleAr).toBeUndefined();
      }
    }
    // النص الخام للاستجابة لا يحتوي أي مفتاح إجابة
    const raw = JSON.stringify(body);
    expect(raw).not.toMatch(/correctOptionIds|is_correct|"accepted"/);
  });

  it('المحتوى غير المنشور يُوسَم بأنه عينة غير مراجعة', async () => {
    const body = await h.json(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }));
    expect(body.lesson.provenance?.status).toBe('unreviewed_sample');
    expect(body.lesson.provenance?.warningAr).toBeTruthy();
  });

  it('بلا مفتاح التطوير: المحتوى غير المنشور غير متاح (404)', async () => {
    const prod = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'false' });
    importExemplars(prod);
    const c = await signup(prod, 'prod@example.com');
    const res = await prod.call('/api/lessons/prea1-hola-me-llamo/session', { cookie: c });
    expect(res.status).toBe(404);
    prod.close();
  });

  it('في بيئة الإنتاج: المحتوى غير المنشور غير متاح (404) حتى مع وجود مفتاح التطوير', async () => {
    const prod = makeHarness({ ENVIRONMENT: 'production', ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(prod);
    const c = await signup(prod, 'prod-env@example.com');
    const res = await prod.call('/api/lessons/prea1-hola-me-llamo/session', { cookie: c });
    expect(res.status).toBe(404);
    prod.close();
  });

  it('بلا جلسة: 401', async () => {
    const res = await h.call('/api/lessons/prea1-hola-me-llamo/session');
    expect(res.status).toBe(401);
  });
});

describe('X: النقاط محسوبة على الخادم فقط', () => {
  const slug = 'prea1-hola-me-llamo';

  it('كل الإجابات صحيحة ⇒ نجاح + XP مرة واحدة', async () => {
    const session = await h.json(await h.call(`/api/lessons/${slug}/session`, { cookie }));
    const graded = session.exercises.filter((e: { mode: string }) => e.mode === 'graded');

    for (const ex of graded) {
      const answer = correctAnswerFor(ex);
      const res = await h.call(`/api/lessons/${slug}/answers`, {
        method: 'POST',
        cookie,
        body: JSON.stringify({ eventId: `ev_${ex.id.slice(-10)}_aaaaaaaa`, exerciseId: ex.id, response: answer }),
      });
      expect(res.status).toBe(200);
      const body = await h.json(res);
      expect(body.correct).toBe(true);
    }

    const done = await h.call(`/api/lessons/${slug}/complete`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({ eventId: 'complete_event_0001' }),
    });
    expect(done.status).toBe(200);
    const result = await h.json(done);
    expect(result.passed).toBe(true);
    expect(result.accuracy).toBe(100);
    expect(result.xpAwarded).toBe(30);
    expect(result.xpTotal).toBe(30);
  });

  it('XP المزعوم من العميل يُتجاهَل تمامًا', async () => {
    const session = await h.json(await h.call(`/api/lessons/${slug}/session`, { cookie }));
    const first = session.exercises[0];
    const res = await h.call(`/api/lessons/${slug}/answers`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        eventId: 'ev_claim_xp_0001',
        exerciseId: first.id,
        response: correctAnswerFor(first),
        correct: true,
        score: 100,
        xp: 9999,
        passed: true,
      }),
    });
    const body = await h.json(res);
    expect(body.xpAwarded).toBeUndefined();
    const stats = h.db.raw.prepare('SELECT xp_total FROM user_stats').get() as { xp_total: number };
    expect(stats.xp_total).toBe(0);
  });

  it('إكمال بلا محاولات ⇒ لا نجاح ولا XP', async () => {
    const res = await h.call(`/api/lessons/${slug}/complete`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({ eventId: 'complete_event_empty1' }),
    });
    const body = await h.json(res);
    expect(body.passed).toBe(false);
    expect(body.accuracy).toBe(0);
    expect(body.xpAwarded).toBe(0);
  });

  it('النجاح من جولة واحدة: إجابات صحيحة متفرقة عبر جولات فاشلة لا تُجمع', async () => {
    const session = await h.json(await h.call(`/api/lessons/${slug}/session`, { cookie }));
    const graded = session.exercises.filter((e: { mode: string }) => e.mode === 'graded');
    expect(graded.length).toBeGreaterThanOrEqual(4);
    const half = Math.floor(graded.length / 2);
    const answerOne = async (ex: { id: string }, tag: string) => {
      const res = await h.call(`/api/lessons/${slug}/answers`, {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_${ex.id.slice(-8)}_${tag}`, exerciseId: ex.id, response: correctAnswerFor(ex) }),
      });
      expect(res.status).toBe(200);
    };
    const complete = async (tag: string) => {
      const res = await h.call(`/api/lessons/${slug}/complete`, {
        method: 'POST', cookie, body: JSON.stringify({ eventId: `complete_${tag}` }),
      });
      expect(res.status).toBe(200);
      return h.json(res);
    };

    // الجولة 1: نصف التمارين فقط ⇒ فشل
    for (const ex of graded.slice(0, half)) await answerOne(ex, 'round1aa');
    await new Promise(r => setTimeout(r, 5));
    expect((await complete('round1xx')).passed).toBe(false);
    await new Promise(r => setTimeout(r, 5));

    // الجولة 2: النصف الآخر فقط ⇒ ما زال فشلًا (لا تراكم عبر الجولات)
    for (const ex of graded.slice(half)) await answerOne(ex, 'round2bb');
    await new Promise(r => setTimeout(r, 5));
    const second = await complete('round2xx');
    expect(second.passed).toBe(false);
    expect(second.xpAwarded).toBe(0);
    await new Promise(r => setTimeout(r, 5));

    // الجولة 3: كل التمارين في جولة واحدة ⇒ نجاح
    for (const ex of graded) await answerOne(ex, 'round3cc');
    const third = await complete('round3xx');
    expect(third.passed).toBe(true);
    expect(third.xpAwarded).toBe(30);
  });

  it('إجابة خاطئة لا تُحتسب صحيحة', async () => {
    const session = await h.json(await h.call(`/api/lessons/${slug}/session`, { cookie }));
    const first = session.exercises[0];
    const res = await h.call(`/api/lessons/${slug}/answers`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({ eventId: 'ev_wrong_000001', exerciseId: first.id, response: 'respuesta incorrecta' }),
    });
    expect((await h.json(res)).correct).toBe(false);
  });
});

describe('I: منع تكرار النقاط (Idempotency)', () => {
  const slug = 'prea1-hola-me-llamo';

  it('نفس eventId مرتين ⇒ محاولة واحدة في القاعدة', async () => {
    const session = await h.json(await h.call(`/api/lessons/${slug}/session`, { cookie }));
    const ex = session.exercises[0];
    const payload = JSON.stringify({ eventId: 'dup_event_00001', exerciseId: ex.id, response: correctAnswerFor(ex) });

    const first = await h.json(await h.call(`/api/lessons/${slug}/answers`, { method: 'POST', cookie, body: payload }));
    const second = await h.json(await h.call(`/api/lessons/${slug}/answers`, { method: 'POST', cookie, body: payload }));

    expect(first.replay).toBe(false);
    expect(second.replay).toBe(true);
    expect(second.correct).toBe(first.correct);

    const rows = h.db.raw.prepare('SELECT COUNT(*) AS n FROM user_exercise_attempts').get() as { n: number };
    expect(rows.n).toBe(1);
  });

  it('إكمال الدرس مرتين بنفس الحدث لا يضاعف XP', async () => {
    const session = await h.json(await h.call(`/api/lessons/${slug}/session`, { cookie }));
    for (const ex of session.exercises.filter((e: { mode: string }) => e.mode === 'graded')) {
      await h.call(`/api/lessons/${slug}/answers`, {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_${ex.id.slice(-10)}_bbbbbbbb`, exerciseId: ex.id, response: correctAnswerFor(ex) }),
      });
    }
    const body = JSON.stringify({ eventId: 'complete_dup_0001' });
    const a = await h.json(await h.call(`/api/lessons/${slug}/complete`, { method: 'POST', cookie, body }));
    const b = await h.json(await h.call(`/api/lessons/${slug}/complete`, { method: 'POST', cookie, body }));
    expect(a.xpAwarded).toBe(30);
    expect(b.replay).toBe(true);
    expect(b.xpAwarded).toBe(0);

    const ledger = h.db.raw.prepare('SELECT COUNT(*) AS n FROM xp_ledger').get() as { n: number };
    expect(ledger.n).toBe(1);
    const stats = h.db.raw.prepare('SELECT xp_total FROM user_stats').get() as { xp_total: number };
    expect(stats.xp_total).toBe(30);
  });

  it('حدث جديد بعد الإكمال لا يمنح XP ثانية (مرة واحدة لكل درس)', async () => {
    const session = await h.json(await h.call(`/api/lessons/${slug}/session`, { cookie }));
    for (const ex of session.exercises.filter((e: { mode: string }) => e.mode === 'graded')) {
      await h.call(`/api/lessons/${slug}/answers`, {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_${ex.id.slice(-10)}_cccccccc`, exerciseId: ex.id, response: correctAnswerFor(ex) }),
      });
    }
    await h.call(`/api/lessons/${slug}/complete`, { method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_first_001' }) });
    const again = await h.json(
      await h.call(`/api/lessons/${slug}/complete`, { method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_second_002' }) }),
    );
    expect(again.passed).toBe(true);
    expect(again.alreadyCompleted).toBe(true);
    expect(again.xpAwarded).toBe(0);
    const stats = h.db.raw.prepare('SELECT xp_total FROM user_stats').get() as { xp_total: number };
    expect(stats.xp_total).toBe(30);
  });

  it('eventId غير صالح يُرفض (400)', async () => {
    const res = await h.call(`/api/lessons/${slug}/answers`, {
      method: 'POST', cookie,
      body: JSON.stringify({ eventId: 'x', exerciseId: 'y', response: 'z' }),
    });
    expect(res.status).toBe(400);
  });
});

describe('L: قواعد الفتح', () => {
  it('درس A1 مقفل قبل إتمام PREA1', async () => {
    const res = await h.call('/api/lessons/a1-un-cafe-por-favor/session', { cookie });
    expect(res.status).toBe(403);
    const body = await h.json(res);
    expect(body.error.code).toBe('LESSON_LOCKED');
    // التفاصيل تُرسل مسطّحة داخل error (لا داخل details) — الشكل موحّد في apiError
    expect(body.error.missing).toContain('prea1-hola-me-llamo');
    expect(body.error.minAccuracy).toBeGreaterThan(0);
  });

  it('بدء PREA1 دون إتمامه لا يفتح A1 (نفس تعريف اللوحة)', async () => {
    const session = await h.json(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }));
    const first = session.exercises.find((e: { mode: string }) => e.mode === 'graded');
    await h.call('/api/lessons/prea1-hola-me-llamo/answers', {
      method: 'POST', cookie,
      body: JSON.stringify({ eventId: 'ev_inprog_00001', exerciseId: first.id, response: correctAnswerFor(first) }),
    });
    const prog = await h.json(await h.call('/api/me/progress', { cookie }));
    const prea1 = prog.lessons.find((l: { slug: string }) => l.slug === 'prea1-hola-me-llamo');
    expect(prea1.progress_status).toBe('in_progress');
    const res = await h.call('/api/lessons/a1-un-cafe-por-favor/session', { cookie });
    expect(res.status).toBe(403);
  });

  it('A1 يُفتح بعد إتمام PREA1 بدقة كافية', async () => {
    const session = await h.json(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }));
    for (const ex of session.exercises.filter((e: { mode: string }) => e.mode === 'graded')) {
      await h.call('/api/lessons/prea1-hola-me-llamo/answers', {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_${ex.id.slice(-8)}_unlock01`, exerciseId: ex.id, response: correctAnswerFor(ex) }),
      });
    }
    await h.call('/api/lessons/prea1-hola-me-llamo/complete', { method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_unlock_1' }) });

    const res = await h.call('/api/lessons/a1-un-cafe-por-favor/session', { cookie });
    expect(res.status).toBe(200);
  });

  it('درس مقفل إن لم يبلغ تقدم الدرس السابق عتبة إتقانه (mastery.minAccuracy)', async () => {
    // قاعدة فتح بلا minAccuracy صريحة (كأمثلة draft): العتبة تُستمد من محتوى الدرس السابق.
    await h.db.raw
      .prepare(`UPDATE lessons SET unlock_rule_json = ? WHERE slug = 'a1-un-cafe-por-favor'`)
      .run(JSON.stringify({ type: 'requires_lessons', requires: ['prea1-hola-me-llamo'] }));

    // نُكمِل الدرس السابق بإجابات جزئية (4 من 6 صحيحة ⇒ دقة 67% أقل من عتبة الإتقان 70%)
    const session = await h.json(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }));
    const graded = session.exercises.filter((e: { mode: string }) => e.mode === 'graded');
    expect(graded.length).toBe(6);
    for (let i = 0; i < graded.length; i++) {
      const ex = graded[i]!;
      const response = i < 4
        ? correctAnswerFor(ex)
        : (ex.type === 'word_choice' || ex.type === 'listen_choose') ? { optionId: '__none__' } : '__none__';
      await h.call('/api/lessons/prea1-hola-me-llamo/answers', {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_${i}_unlocklow`, exerciseId: ex.id, response }),
      });
    }
    const complete = await h.json(
      await h.call('/api/lessons/prea1-hola-me-llamo/complete', { method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_unlock_low' }) }),
    );
    expect(complete.passed).toBe(false);

    // الدرس التالي مقفل حتى وإن بدأ سابقًا (الشرط هو الدقة، لا مجرد البدء)
    const res = await h.call('/api/lessons/a1-un-cafe-por-favor/session', { cookie });
    expect(res.status).toBe(403);
    const body = await h.json(res);
    expect(body.error.code).toBe('LESSON_LOCKED');
    expect(body.error.minAccuracy).toBe(70);

    // لوحة التقدم تُظهر نفس حالة القفل (لا تناقض بين القائمة والخادم)
    const prog = await h.json(await h.call('/api/me/progress', { cookie }));
    const lesson = (prog as { lessons: { slug: string; is_unlocked: boolean }[] }).lessons
      .find(l => l.slug === 'a1-un-cafe-por-favor');
    expect(lesson?.is_unlocked).toBe(false);
  });

  it('يُفتح الدرس التالي إن بلغ تقدم الدرس السابق عتبة إتقانه', async () => {
    // نفس قاعدة الفتح (بلا minAccuracy صريحة): دقة 100% ≥ 70% ⇒ الدرس يُفتح
    await h.db.raw
      .prepare(`UPDATE lessons SET unlock_rule_json = ? WHERE slug = 'a1-un-cafe-por-favor'`)
      .run(JSON.stringify({ type: 'requires_lessons', requires: ['prea1-hola-me-llamo'] }));
    const session = await h.json(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }));
    for (const ex of session.exercises.filter((e: { mode: string }) => e.mode === 'graded')) {
      await h.call('/api/lessons/prea1-hola-me-llamo/answers', {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_${ex.id.slice(-8)}_unlockmid`, exerciseId: ex.id, response: correctAnswerFor(ex) }),
      });
    }
    await h.call('/api/lessons/prea1-hola-me-llamo/complete', { method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_unlock_mid' }) });

    const res = await h.call('/api/lessons/a1-un-cafe-por-favor/session', { cookie });
    expect(res.status).toBe(200);
    const prog = await h.json(await h.call('/api/me/progress', { cookie }));
    const lesson = (prog as { lessons: { slug: string; is_unlocked: boolean }[] }).lessons
      .find(l => l.slug === 'a1-un-cafe-por-favor');
    expect(lesson?.is_unlocked).toBe(true);
  });

  it('نتيجة عند العتبة بالضبط (67% = 67%) تفتح الدرس التالي', async () => {
    // قاعدة فتح بلا minAccuracy صريحة، عتبة إتقان الدرس السابق = 67%
    await h.db.raw
      .prepare(`UPDATE lessons SET unlock_rule_json = ? WHERE slug = 'a1-un-cafe-por-favor'`)
      .run(JSON.stringify({ type: 'requires_lessons', requires: ['prea1-hola-me-llamo'] }));
    await h.db.raw
      .prepare(`UPDATE lessons SET mastery_criteria_json = ? WHERE slug = 'prea1-hola-me-llamo'`)
      .run(JSON.stringify({ minAccuracy: 67 }));

    // نُكمِل الدرس السابق بإجابات جزئية (4 من 6 ⇒ 67% بالضبط بعد التقريب)
    const session = await h.json(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }));
    const graded = session.exercises.filter((e: { mode: string }) => e.mode === 'graded');
    for (let i = 0; i < graded.length; i++) {
      const ex = graded[i]!;
      const response = i < 4
        ? correctAnswerFor(ex)
        : (ex.type === 'word_choice' || ex.type === 'listen_choose') ? { optionId: '__none__' } : '__none__';
      await h.call('/api/lessons/prea1-hola-me-llamo/answers', {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_${i}_edge67`, exerciseId: ex.id, response }),
      });
    }
    await h.call('/api/lessons/prea1-hola-me-llamo/complete', { method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_edge_67' }) });

    // النتيجة عند العتبة بالضبط (67 = 67) ⇒ يُفتح (الشرط >= لا <)
    const res = await h.call('/api/lessons/a1-un-cafe-por-favor/session', { cookie });
    expect(res.status).toBe(200);
  });
});

describe('P: لوحة التقدم تُقرأ من الخادم', () => {
  it('تعيد أصفارًا حقيقية لحساب جديد', async () => {
    const body = await h.json(await h.call('/api/me/progress', { cookie }));
    expect(body.stats.xp_total).toBe(0);
    expect(body.totals.lessons_completed).toBe(0);
    expect(body.lessons.length).toBeGreaterThan(0);
  });

  it('تعكس التقدم بعد الإكمال', async () => {
    const slug = 'prea1-hola-me-llamo';
    const session = await h.json(await h.call(`/api/lessons/${slug}/session`, { cookie }));
    for (const ex of session.exercises.filter((e: { mode: string }) => e.mode === 'graded')) {
      await h.call(`/api/lessons/${slug}/answers`, {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_${ex.id.slice(-8)}_prog0001`, exerciseId: ex.id, response: correctAnswerFor(ex) }),
      });
    }
    await h.call(`/api/lessons/${slug}/complete`, { method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_prog_01' }) });

    const body = await h.json(await h.call('/api/me/progress', { cookie }));
    expect(body.stats.xp_total).toBe(30);
    expect(body.totals.lessons_completed).toBe(1);
    const row = body.lessons.find((l: { slug: string }) => l.slug === slug);
    expect(row.progress_status).toBe('completed');
    expect(row.best_accuracy).toBe(100);
  });

  it('تقدم مستخدم لا يظهر لمستخدم آخر', async () => {
    const other = await signup(h, 'other@example.com');
    const slug = 'prea1-hola-me-llamo';
    const session = await h.json(await h.call(`/api/lessons/${slug}/session`, { cookie }));
    for (const ex of session.exercises.filter((e: { mode: string }) => e.mode === 'graded')) {
      await h.call(`/api/lessons/${slug}/answers`, {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_${ex.id.slice(-8)}_iso00001`, exerciseId: ex.id, response: correctAnswerFor(ex) }),
      });
    }
    await h.call(`/api/lessons/${slug}/complete`, { method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_iso_1' }) });

    const body = await h.json(await h.call('/api/me/progress', { cookie: other }));
    expect(body.stats.xp_total).toBe(0);
    expect(body.totals.lessons_completed).toBe(0);
  });
});

describe('PL: اختبار تحديد المستوى (Placement Test) وسلطة الخادم', () => {

  interface PQuestion { id: string; options: { id: string; text: string }[] }

  async function startPlacement(): Promise<{ attemptId: string; questions: PQuestion[] }> {
    const res = await h.call('/api/me/placement/start', { method: 'POST', cookie });
    expect(res.status).toBe(200);
    const data = await h.json<{ attemptId: string; questions: PQuestion[] }>(res);
    expect(data.questions).toHaveLength(10);
    return data;
  }

  /** الإجابة الصحيحة عبر مطابقة نص الخيار بمعرفة بنك الخادم (للاختبار فقط) */
  function solve(questions: PQuestion[]): Record<string, string> {
    const answers: Record<string, string> = {};
    for (const q of questions) {
      const bank = PLACEMENT_QUESTIONS.find(b => b.id === q.id)!;
      const correctText = bank.options.find(o => o.key === bank.correctKey)!.text;
      answers[q.id] = q.options.find(o => o.text === correctText)!.id;
    }
    return answers;
  }

  it('بدء الاختبار لا يسرّب أي علامة صحة للعميل', async () => {
    const res = await h.call('/api/me/placement/start', { method: 'POST', cookie });
    expect(res.status).toBe(200);
    const raw = JSON.stringify(await h.json(res));
    expect(raw).not.toContain('correct');
    expect(raw).not.toContain('explanationAr');
  });

  it('يرفض الإرسال دون attemptId برمز 400 (لا درجة من العميل مهما ادّعى)', async () => {
    const res = await h.call('/api/me/placement', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ targetLevel: 'A2', score: 100, answersCount: 10 }),
    });
    expect(res.status).toBe(400);
    const body = await h.json(res);
    expect(body.error.code).toBe('ATTEMPT_REQUIRED');
  });

  it('الخادم يصحح الإجابات بنفسه ويمنح XP ويفتح الدروس عند النجاح', async () => {
    const { attemptId, questions } = await startPlacement();
    const res = await h.call('/api/me/placement', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ attemptId, answers: solve(questions) }),
    });
    expect(res.status).toBe(200);
    const data = await h.json(res);
    expect(data.passed).toBe(true);
    expect(data.score).toBe(100);

    // 100% ≥ عتبة A2 الخادمية (80) — المستوى يُشتق من الدرجة لا يختاره العميل
    expect(data.targetLevel).toBe('A2');
    expect(data.unlockedLevel).toBe('A2');
    expect(data.xpAwarded).toBe(80);
    expect(data.feedback).toHaveLength(10);
    expect(data.review).toBeUndefined();

    const prog = await h.json(await h.call('/api/me/progress', { cookie }));
    expect(prog.stats.xp_total).toBe(80);
    const a1Lesson = prog.lessons.find((l: { slug: string }) => l.slug === 'a1-un-cafe-por-favor');
    expect(a1Lesson).toBeDefined();
    expect(a1Lesson.is_unlocked).toBe(true);
  });

  it('اختيار الخيار الأول دائمًا لا ينجح — مواضع الصواب متنوّعة', async () => {
    const { attemptId, questions } = await startPlacement();
    // مواضع الصواب متنوعة داخل المحاولة نفسها: ليس كل صحيح في الخيار الأول
    const correctIds = solve(questions);
    const firstIds: Record<string, string> = {};
    for (const q of questions) firstIds[q.id] = q.options[0]!.id;
    const firstCorrect = questions.filter(q => correctIds[q.id] === firstIds[q.id]).length;
    expect(firstCorrect).toBeLessThan(questions.length);
    // العميل يحاول إرسال score: 100 للتلاعب — يُتجاهل تمامًا
    const res = await h.call('/api/me/placement', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ attemptId, answers: firstIds, score: 100 }),
    });
    expect(res.status).toBe(200);
    const data = await h.json(res);
    // التوقعات تُحسب من تخطيط المحاولة نفسها (الخيارات مخلوطة عشوائيًا)
    expect(data.score).toBe(firstCorrect * 10);
    expect(data.passed).toBe(data.score >= 60);
    expect(data.targetLevel).toBe(data.score >= 80 ? 'A2' : 'A1');
    expect(data.unlockedLevel).toBe(data.passed ? data.targetLevel : 'PREA1');
    expect(data.xpAwarded).toBe(data.passed ? (data.targetLevel === 'A2' ? 80 : 40) : 0);
  });

  it('الخادم يتجاهل الدرجة المرسلة من العميل إذا كانت الإجابات خاطئة (منع التلاعب)', async () => {

    const { attemptId, questions } = await startPlacement();
    const allWrong = Object.fromEntries(questions.map(q => [q.id, 'o_x_wrong']));
    const res = await h.call('/api/me/placement', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ attemptId, answers: allWrong, score: 100, targetLevel: 'A2' }),
    });
    expect(res.status).toBe(200);
    const data = await h.json(res);
    expect(data.passed).toBe(false);
    expect(data.score).toBe(0);
    expect(data.xpAwarded).toBe(0);
    expect(data.unlockedLevel).toBe('PREA1');
  });


  it('محاولة مستخدمة لا تُسلَّم مرتين (409)', async () => {
    const { attemptId, questions } = await startPlacement();
    const body = JSON.stringify({ attemptId, answers: solve(questions) });
    const first = await h.call('/api/me/placement', { method: 'POST', cookie, body });
    expect(first.status).toBe(200);
    const second = await h.call('/api/me/placement', { method: 'POST', cookie, body });
    expect(second.status).toBe(409);
    expect((await h.json(second)).error.code).toBe('ATTEMPT_USED');
  });

  it('استراتيجية «أول خيار دائمًا» العمياء لا تستطيع الاجتياز (AUD-05)', async () => {
    // أربع محاولات × عشرة أسئلة (داخل سقف بدء المحاولات): إن بقي الصحيح في
    // موضع ثابت لفازت بـ100%. التوقع العشوائي ~10 من 40.
    let totalCorrect = 0;
    for (let i = 0; i < 4; i++) {
      const { attemptId, questions } = await startPlacement();
      const blind = Object.fromEntries(questions.map(q => [q.id, q.options[0]!.id]));
      const res = await h.call('/api/me/placement', {
        method: 'POST',
        cookie,
        body: JSON.stringify({ attemptId, answers: blind }),
      });
      const data = await h.json(res);
      totalCorrect += data.score / 10;
    }
    expect(totalCorrect).toBeLessThan(20);
  });

  it('VER-02: عيّنة الأسئلة تختلف بين المحاولات (لا مجموعة ثابتة للحصاد)', async () => {
    const sets = [];
    for (let i = 0; i < 3; i++) {
      const { questions } = await startPlacement();
      sets.push(questions.map(q => q.id).sort().join(','));
    }
    expect(new Set(sets).size).toBeGreaterThan(1);
  });

  it('VER-02: استجابة التسليم لا تحمل أي قناة حصاد (لا نص صحيح ولا علم صحة)', async () => {
    const { attemptId, questions } = await startPlacement();
    const res = await h.call('/api/me/placement', {
      method: 'POST', cookie,
      body: JSON.stringify({ attemptId, answers: Object.fromEntries(questions.map(q => [q.id, q.options[0]!.id])) }),
    });
    expect(res.status).toBe(200);
    const data = await h.json(res);
    const raw = JSON.stringify(data);
    expect(raw).not.toContain('correctText');
    expect(raw).not.toContain('"correct"');
    expect(data.feedback).toHaveLength(10);
    for (const f of data.feedback) expect(Object.keys(f).sort()).toEqual(['explanationAr', 'id']);
    // ولا شرح من شروح المحاولة يذكر نص الخيار الصحيح لسؤاله
    for (const f of data.feedback) {
      const bank = PLACEMENT_QUESTIONS.find(b => b.id === f.id)!;
      const correctText = bank.options.find(o => o.key === bank.correctKey)!.text;
      expect(f.explanationAr.toLowerCase()).not.toContain(correctText.toLowerCase());
    }
  });

  it('VER-02: حصاد محاولة أولى كاملة القراءة لا ينقل أي إجابة للثانية', async () => {
    // المهاجم يقرأ كل بايت في استجابة التسليم الأولى ثم يبني «معرفة»:
    // نتحقق أن الاستجابة لا تربط أي سؤال بخياره الصحيح بأي تمثيل.
    const first = await startPlacement();
    const res1 = await h.call('/api/me/placement', {
      method: 'POST', cookie,
      body: JSON.stringify({ attemptId: first.attemptId, answers: solve(first.questions) }),
    });
    const r1 = await h.json(res1);
    expect(r1.passed).toBe(true); // الحل بمعرفة حقيقية يعمل
    // المحاولة الثانية بمستخدم جديد لا يعرف شيئًا إلا ما في الاستجابة:
    // لا يوجد فيها ما يُبنى عليه اختيار — أول-خيار أعمى يرسب كما قبل.
    const other = await signup(h, 'harvester@example.com');
    const st2 = await h.json<{ attemptId: string; questions: PQuestion[] }>(
      await h.call('/api/me/placement/start', { method: 'POST', cookie: other }),
    );
    const blind2 = Object.fromEntries(st2.questions.map(q => [q.id, q.options[0]!.id]));
    const res2 = await h.call('/api/me/placement', {
      method: 'POST', cookie: other,
      body: JSON.stringify({ attemptId: st2.attemptId, answers: blind2 }),
    });
    const r2 = await h.json(res2);
    expect(r2.xpAwarded).toBe(0);
    expect(r2.passed).toBe(false);
  });

  it('VER-02: سقف بدء المحاولات 5 في الساعة (429 بعدها)', async () => {
    for (let i = 0; i < 5; i++) await startPlacement();
    const sixth = await h.call('/api/me/placement/start', { method: 'POST', cookie });
    expect(sixth.status).toBe(429);
    expect((await h.json(sixth)).error.code).toBe('PLACEMENT_RATE_LIMITED');
  });

  it('VER-10: تسليمان متزامنان لنفس المحاولة — واحد 200 والآخر 409 وXP مرة واحدة', async () => {
    const { attemptId, questions } = await startPlacement();
    const body = JSON.stringify({ attemptId, answers: solve(questions) });
    const [a, b] = await Promise.all([
      h.call('/api/me/placement', { method: 'POST', cookie, body }),
      h.call('/api/me/placement', { method: 'POST', cookie, body }),
    ]);
    expect([a.status, b.status].sort()).toEqual([200, 409]);
    const prog = await h.json(await h.call('/api/me/progress', { cookie }));
    expect(prog.stats.xp_total).toBe(80);
  });

  it('منع تكرار منح XP عند إعادة اجتياز الاختبار لنفس المستوى (Idempotency)', async () => {
    const first = await startPlacement();
    const r1 = await h.call('/api/me/placement', {
      method: 'POST', cookie,
      body: JSON.stringify({ attemptId: first.attemptId, answers: solve(first.questions) }),
    });
    const d1 = await h.json(r1);
    expect(d1.xpAwarded).toBe(80);

    const second = await startPlacement();
    const r2 = await h.call('/api/me/placement', {
      method: 'POST', cookie,
      body: JSON.stringify({ attemptId: second.attemptId, answers: solve(second.questions) }),
    });
    const d2 = await h.json(r2);
    expect(d2.passed).toBe(true);
    expect(d2.xpAwarded).toBe(0); // لم يحصل على نقاط مضاعفة


    const prog = await h.json(await h.call('/api/me/progress', { cookie }));
    expect(prog.stats.xp_total).toBe(80);
  });
});

/** الإجابة الصحيحة لتمرين — من نفس محتوى الاستيراد، لا من استنتاج العميل */
function correctAnswerFor(ex: { id: string }): unknown {
  return correctAnswer(h, ex.id) ?? '';
}
