/**
 * محرك التمارين: التصحيح، سلطة الخادم، منع تكرار النقاط، الفتح، وحفظ التقدم.
 * كل اختبار هنا يقابل بندًا في docs/22_PHASE2_REPORT.md.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { makeHarness, VALID_EMAIL, type Harness } from './harness';
import { gradeAnswer, gradingModeOf } from '../src/worker/lib/grading';
import { correctAnswer, importExemplars } from './content-fixture';

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
  it('يرفض المستوى غير الصالح برمز 400', async () => {
    const res = await h.call('/api/me/placement', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ targetLevel: 'C2', answers: {} }),
    });
    expect(res.status).toBe(400);
    const body = await h.json(res);
    expect(body.error.code).toBe('INVALID_LEVEL');
  });

  it('الخادم يصحح الإجابات بنفسه ويمنح XP ويفتح الدروس عند النجاح', async () => {
    const correctAnswers = {
      '1': 'a',
      '2': 'a',
      '3': 'a',
      '4': 'a',
      '5': 'a',
      '6': 'a',
      '7': 'a',
      '8': 'a',
      '9': 'a',
      '10': 'a',
    };

    const res = await h.call('/api/me/placement', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ targetLevel: 'A1', answers: correctAnswers }),
    });
    expect(res.status).toBe(200);
    const data = await h.json(res);
    expect(data.passed).toBe(true);
    expect(data.score).toBe(100);
    expect(data.targetLevel).toBe('A1');
    expect(data.unlockedLevel).toBe('A1');
    expect(data.xpAwarded).toBe(40);

    // التحقق من أن لوحة التقدم تعكس فتح المستوى ورصيد الـ XP
    const progRes = await h.call('/api/me/progress', { cookie });
    const prog = await h.json(progRes);
    expect(prog.stats.xp_total).toBe(40);

    // درس A1 أصبح متاحًا (غير مقفل)
    const a1Lesson = prog.lessons.find((l: { slug: string }) => l.slug === 'a1-un-cafe-por-favor');
    expect(a1Lesson).toBeDefined();
    expect(a1Lesson.is_unlocked).toBe(true);
  });

  it('الخادم يتجاهل الدرجة المرسلة من العميل إذا كانت الإجابات خاطئة (منع التلاعب)', async () => {
    const fakeAnswers = {
      '1': 'wrong',
      '2': 'wrong',
    };

    // العميل يحاول إرسال score: 100 للتلاعب
    const res = await h.call('/api/me/placement', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ targetLevel: 'A1', answers: fakeAnswers, score: 100 }),
    });
    expect(res.status).toBe(200);
    const data = await h.json(res);
    expect(data.passed).toBe(false);
    expect(data.score).toBe(0); // الخادم صحح الإجابات الفعلية ووجد 0 صحيحة
    expect(data.xpAwarded).toBe(0);
    expect(data.unlockedLevel).toBe('PREA1');
  });

  it('منع تكرار منح XP عند إعادة اجتياز الاختبار لنفس المستوى (Idempotency)', async () => {
    const correctAnswers = {
      '1': 'a',
      '2': 'a',
      '3': 'a',
      '4': 'a',
      '5': 'a',
      '6': 'a',
      '7': 'a',
      '8': 'a',
      '9': 'a',
      '10': 'a',
    };

    // المحاولة الأولى
    const res1 = await h.call('/api/me/placement', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ targetLevel: 'A1', answers: correctAnswers }),
    });
    const d1 = await h.json(res1);
    expect(d1.xpAwarded).toBe(40);

    // المحاولة الثانية لنفس المستوى
    const res2 = await h.call('/api/me/placement', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ targetLevel: 'A1', answers: correctAnswers }),
    });
    const d2 = await h.json(res2);
    expect(d2.passed).toBe(true);
    expect(d2.xpAwarded).toBe(0); // لم يحصل على نقاط مضاعفة

    const progRes = await h.call('/api/me/progress', { cookie });
    const prog = await h.json(progRes);
    expect(prog.stats.xp_total).toBe(40);
  });
});

/** الإجابة الصحيحة لتمرين — من نفس محتوى الاستيراد، لا من استنتاج العميل */
function correctAnswerFor(ex: { id: string }): unknown {
  return correctAnswer(h, ex.id) ?? '';
}
