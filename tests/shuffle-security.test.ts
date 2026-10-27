/**
 * اختبارات أمان DEFECT-1 — حتمية بالكامل (إصلاح تقطّع النسخة الاحتمالية).
 *
 * المبدأ: لا تأكيد واحد هنا يعتمد على «كم أصاب التخمين» — فالمهاجم الأعمى
 * يصيب أحيانا بمحض الحظ، وجعل ذلك بوابة حمراء يعاقب كودًا سليمًا. بدلًا من
 * ذلك نختبر الثوابت مباشرة:
 *
 *  1) وحدة الخلط نفسها: حالات صغيرة بتيارات حرفية ومخرجات متوقعة محسوبة
 *     يدويًا (لا تُستدعى الدالة الخاضعة للاختبار لبناء التوقع).
 *  2) الترتيب المعروض = دالة مجرى عشوائية الخادم وحده: محاكاة مستقلة
 *     للمواصفة (Fisher–Yates من النهاية) على نفس التيار المحقون يجب أن
 *     تطابق استجابة الـAPI بايتًا، وعدد السحوبات المستهلكة متطابق تمامًا.
 *  3) الاستقلال عن البيانات العامة: محاولتان بمجرى متماثل وattemptId
 *     مختلفَين (يولّدهما الخادم) تعرضان نسخة متطابقة — فلا مدخل للمهاجم
 *     في الترتيب؛ وتنبؤات الخوارزمية القديمة لا تعيد بناء الترتيب كله
 *     (تطابق كليّ لكل الأسئلة العشرة مستحيل عمليًا دون معرفة التيار).
 *  4) العقد والتصحيح: لا مفاتيح في الردود، والتصحيح بالمعرّف من التخطيط
 *     المعروض، وإعادة الإرسال 409، وXP مرة واحدة.
 *
 * الإنتاج لا يحقن أي مصدر ⇒ crypto.getRandomValues حصرًا.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { makeHarness, signupAndGetCookie, type Harness } from './harness';
import { importExemplars, correctAnswer } from './content-fixture';
import { seedFromString, mulberry32 } from '../src/worker/lib/shuffle';
import { shuffleSecure, setRandomSourceForTests } from '../src/worker/lib/random';
import { PLACEMENT_QUESTIONS, PLACEMENT_STRATA } from '../src/worker/lib/placement-bank';

let h: Harness | null = null;
afterEach(() => {
  setRandomSourceForTests(null);
  h?.close();
  h = null;
});

/**
 * تيار حرفي معروف مسبقًا (تسلسل منخفض التباين بالنسبة الذهبية) — لا يشارك
 * أي كود مع مولدات المشروع. المصدر يُغلق على عداد السحوبات لنثبت تطابق
 * الاستهلاك بين الخادم والمحاكاة.
 */
const SEQ: number[] = Array.from({ length: 128 }, (_, i) => (i * 0.6180339887498949 + 0.12345) % 1);
function knownStream() {
  let idx = 0;
  return {
    next: () => {
      if (idx >= SEQ.length) throw new Error('known stream exhausted');
      return SEQ[idx++]!;
    },
    consumed: () => idx,
    reset: () => { idx = 0; },
  };
}

/**
 * محاكاة المواصفة مستقلة عن كود الإنتاج: Fisher–Yates من النهاية،
 * j = floor(r × (i+1)). كُتبت هنا من تعريف الخوارزمية نفسها.
 */
function specShuffle<T>(items: readonly T[], stream: { next: () => number }): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(stream.next() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** الخوارزمية الضعيفة القديمة كما يعرفها مهاجم قرأ المستودع (قبل DEFECT-1) */
function oldShuffledOrder(n: number, seed: string): number[] {
  const rand = mulberry32(seedFromString(seed));
  return specShuffle([...Array(n).keys()], { next: rand });
}

describe('shuffleSecure: حالات مثبتة يدويًا (لا توقعات مولّدة بالدالة نفسها)', () => {
  const fromSeq = (seq: number[]) => {
    let i = 0;
    return () => seq[i++]!;
  };

  it('مخرجات محسوبة يدويًا لتيارات حرفية معروفة', () => {
    // [0.9,0.1,0.5]: i=3→j=3 (ثبات)، i=2→j=0 (تبديل 2و0)، i=1→j=1 (ثبات)
    expect(shuffleSecure(['a', 'b', 'c', 'd'], fromSeq([0.9, 0.1, 0.5]))).toEqual(['c', 'b', 'a', 'd']);
    // [0,0,0]: كل خطوة تبدّل مع 0
    expect(shuffleSecure(['a', 'b', 'c', 'd'], fromSeq([0, 0, 0]))).toEqual(['b', 'c', 'd', 'a']);
    // قيم عليا: j=i دائمًا ⇒ الهوية
    expect(shuffleSecure(['a', 'b', 'c', 'd'], fromSeq([0.999, 0.999, 0.999]))).toEqual(['a', 'b', 'c', 'd']);
    // عنصران: r<0.5 → j=0 تبديل؛ r≥0.5 → j=1 ثبات
    expect(shuffleSecure(['x', 'y'], fromSeq([0.2]))).toEqual(['y', 'x']);
    expect(shuffleSecure(['x', 'y'], fromSeq([0.8]))).toEqual(['x', 'y']);
  });

  it('تبديل كامل لا يمس الأصل، وقصيرات القوائم بلا سحوبات', () => {
    const src = [1, 2, 3, 4, 5];
    const s = knownStream();
    const out = shuffleSecure(src, s.next);
    expect([...out].sort((a, b) => a - b)).toEqual(src);
    expect(src).toEqual([1, 2, 3, 4, 5]);
    expect(s.consumed()).toBe(4);
    const s2 = knownStream();
    expect(shuffleSecure([], s2.next)).toEqual([]);
    expect(shuffleSecure([7], s2.next)).toEqual([7]);
    expect(s2.consumed()).toBe(0);
  });
});

type PresentedQ = { id: string; options: { id: string; text: string }[] };
type StartRes = { attemptId: string; questions: PresentedQ[] };

async function start(cookie: string): Promise<{ raw: string; data: StartRes }> {
  const res = await h!.call('/api/me/placement/start', { method: 'POST', body: '{}', cookie });
  const raw = await res.clone().text();
  return { raw, data: (await res.json()) as StartRes };
}

/** محاكاة كاملة لاستجابة البدء من التيار — بنفس ترتيب استهلاك الخادم الموثق */
function simulateStart(stream: { next: () => number }): { id: string; texts: string[] }[] {
  const picked: typeof PLACEMENT_QUESTIONS = [];
  for (const { level, take } of PLACEMENT_STRATA) {
    picked.push(...specShuffle(PLACEMENT_QUESTIONS.filter(q => q.level === level), stream).slice(0, take));
  }
  const sampled = specShuffle(picked, stream);
  return sampled.map(q => ({ id: q.id, texts: specShuffle(q.options, stream).map(o => o.text) }));
}

describe('DEFECT-1 Placement: الترتيب دالة مجرى الخادم وحده', () => {
  it('استجابة البدء تطابق محاكاة التيار بايتًا (عينة وترتيبًا واستهلاكًا) وبلا مفاتيح', async () => {
    h = makeHarness({});
    const { cookie } = await signupAndGetCookie(h, 'stream-proof@example.com');

    const server = knownStream();
    setRandomSourceForTests(server.next);
    const { raw, data } = await start(cookie!);

    expect(raw).not.toContain('correctKey');
    expect(raw).not.toContain('"key"');
    expect(raw).not.toContain('keyByQuestion');

    const sim = knownStream();
    const expected = simulateStart(sim);
    expect(data.questions.map(q => ({ id: q.id, texts: q.options.map(o => o.text) }))).toEqual(expected);
    expect(server.consumed()).toBe(sim.consumed());
    // المعرّفات المعروضة موضعية بحتة (o0..o3) بلا أي علاقة بمفتاح البنك
    for (const q of data.questions) expect(q.options.map(o => o.id)).toEqual(['o0', 'o1', 'o2', 'o3']);
  });

  it('محاولتان بنفس التيار وattemptId مختلفَين تعرضان نسخة متطابقة — لا مدخل عامًا للترتيب', async () => {
    h = makeHarness({});
    const { cookie } = await signupAndGetCookie(h, 'attempt-independence@example.com');
    const server = knownStream();
    setRandomSourceForTests(server.next);

    const first = await start(cookie!);
    server.reset();
    const second = await start(cookie!);

    expect(first.data.attemptId).not.toBe(second.data.attemptId);
    expect(second.data.questions).toEqual(first.data.questions);

    // والمهاجم بالخوارزمية القديمة لا يعيد بناء الترتيب الذي ينتجه مجرى الخادم:
    // مقارنة حتمية بالكامل بين مدخلات مثبّتة حرفيًا (بذرة مهاجم ثابتة × مجرى
    // المحاكاة الثابت) — لا يدخل فيها attemptId العشوائي ولا أي مصادفة تشغيل.
    // ادّعاء «لن يصيب» الإحصائي كان هو عيب التقطّع الأصلي؛ هنا حقيقة ثابتة.
    const simAgain = simulateStart(knownStream());
    const attackerVersion = simAgain.map(q => {
      const bank = PLACEMENT_QUESTIONS.find(bq => bq.id === q.id)!;
      return oldShuffledOrder(bank.options.length, `placement:fixed-attacker-attempt:${q.id}`)
        .map(srcIdx => bank.options[srcIdx]!.text).join('|');
    }).join('§');
    const serverVersion = simAgain.map(q => q.texts.join('|')).join('§');
    expect(attackerVersion).not.toBe(serverVersion);
  });

  it('التصحيح يتبع التخطيط المعروض: صواب بالنص ينجح حيثما وقع، وإعادة الإرسال 409، وXP مرة واحدة', async () => {
    setRandomSourceForTests(knownStream().next);
    h = makeHarness({});
    const { cookie } = await signupAndGetCookie(h, 'knower2@example.com');
    const c = cookie!;

    const solveByText = (qs: PresentedQ[]) => Object.fromEntries(qs.map(q => {
      const bank = PLACEMENT_QUESTIONS.find(bq => bq.id === q.id)!;
      const text = bank.options.find(o => o.key === bank.correctKey)!.text;
      return [q.id, q.options.find(o => o.text === text)!.id];
    }));

    const s1 = await start(c);
    const a1 = solveByText(s1.data.questions);
    const r1 = await h.json<{ score: number; passed: boolean; xpAwarded: number }>(
      await h.call('/api/me/placement', { method: 'POST', cookie: c, body: JSON.stringify({ attemptId: s1.data.attemptId, answers: a1 }) }));
    expect(r1.score).toBe(100);
    expect(r1.passed).toBe(true);
    expect(r1.xpAwarded).toBe(80);

    const replay = await h.call('/api/me/placement', { method: 'POST', cookie: c, body: JSON.stringify({ attemptId: s1.data.attemptId, answers: a1 }) });
    expect(replay.status).toBe(409);

    const s2 = await start(c);
    const r2 = await h.json<{ score: number; xpAwarded: number }>(
      await h.call('/api/me/placement', { method: 'POST', cookie: c, body: JSON.stringify({ attemptId: s2.data.attemptId, answers: solveByText(s2.data.questions) }) }));
    expect(r2.score).toBe(100);
    expect(r2.xpAwarded).toBe(0);
  });
});

describe('DEFECT-1 دروس: ترتيب الخيارات من مجرى الخادم والتصحيح بالمعرّف', () => {
  it('جلسة الدرس تطابق محاكاة التيار على ترتيب القاعدة المصدري، والتصحيح ثابت عبر الترتيبات', async () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const { cookie } = await signupAndGetCookie(h, 'lesson-stream@example.com');
    const c = cookie!;

    type Session = { exercises: { id: string; type: string; mode: string; options: { id: string }[]; items: { id: string }[] }[] };
    const server = knownStream();
    setRandomSourceForTests(server.next);
    const sess = await h.json<Session>(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie: c }));

    // محاكاة: الخادم يمرّ على التمارين بترتيب الجلسة — خلط خيارات كل تمرين،
    // ثم خلط العناصر لأنواع الترتيب. الترتيب المصدري من القاعدة نفسها.
    const sim = knownStream();
    const expectedByExercise = new Map<string, string[]>();
    for (const e of sess.exercises) {
      const srcOpts = h.db.raw.prepare(
        'SELECT id FROM exercise_options WHERE exercise_id = ? ORDER BY sort_order',
      ).all(e.id) as { id: string }[];
      const expectedOptIds = specShuffle(srcOpts.map(o => o.id), sim);
      expectedByExercise.set(e.id, expectedOptIds);
      expect(e.options.map(o => o.id)).toEqual(expectedOptIds);
      if (e.type === 'word_order' || e.type === 'dialogue_order') {
        const srcItems = h.db.raw.prepare(
          'SELECT id FROM exercise_items WHERE exercise_id = ? ORDER BY ordinal',
        ).all(e.id) as { id: string }[];
        expect(e.items.map(i => i.id)).toEqual(specShuffle(srcItems.map(i => i.id), sim));
      }
    }
    expect(server.consumed()).toBe(sim.consumed());

    // إعادة تحميل بمجرى جديد: نفس مجموعة المعرّفات، والتصحيح بالمعرّف لا يتأثر بالموضع
    const target = sess.exercises.find(e => e.mode === 'graded' && (e.options?.length ?? 0) >= 3)!;
    const sess2 = await h.json<Session>(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie: c }));
    const again = sess2.exercises.find(e => e.id === target.id)!;
    expect(new Set(again.options.map(o => o.id))).toEqual(new Set(target.options.map(o => o.id)));
    const res = await h.call('/api/lessons/prea1-hola-me-llamo/answers', {
      method: 'POST', cookie: c,
      body: JSON.stringify({ eventId: 'ev_stream_truth_01', exerciseId: target.id, response: correctAnswer(h, target.id) }),
    });
    expect(((await res.json()) as { correct: boolean }).correct).toBe(true);

    // مهاجم البذرة العامة القديمة opt:{uid}:{eid} بمدخلات مثبّتة حرفيًا لا يعيد
    // بناء ترتيب محاكاة الخادم — مقارنة حتمية (كانت نسخة سابقة من هذا التأكيد
    // تعتمد uid عشوائيًا لكل تشغيل فتقطّعت؛ هنا كل المدخلات ثوابت أبدية).
    const attackerLesson = sess.exercises
      .filter(e2 => (e2.options?.length ?? 0) >= 2)
      .map(e2 => {
        const srcOpts = h!.db.raw.prepare(
          'SELECT id FROM exercise_options WHERE exercise_id = ? ORDER BY sort_order',
        ).all(e2.id) as { id: string }[];
        return oldShuffledOrder(srcOpts.length, `opt:fixed-attacker-user:${e2.id}`).map(i => srcOpts[i]!.id).join(',');
      }).join('§');
    const serverLesson = sess.exercises
      .filter(e2 => (e2.options?.length ?? 0) >= 2)
      .map(e2 => expectedByExercise.get(e2.id)!.join(',')).join('§');
    expect(attackerLesson).not.toBe(serverLesson);
  });

  it('مسار الإنتاج (بلا حقن) يعمل ويُعيد تبديلات كاملة من المصدر الآمن', async () => {
    // testSource = null ⇒ crypto.getRandomValues. لا نؤكد ترتيبًا بعينه (لا يمكن
    // حتميًا) بل الثابت الوحيد الصحيح: تبديل كامل لنفس مجموعة المعرّفات.
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const { cookie } = await signupAndGetCookie(h, 'prod-path@example.com');
    type Session = { exercises: { id: string; options: { id: string }[] }[] };
    const sess = await h.json<Session>(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie: cookie! }));
    for (const e of sess.exercises) {
      const src = h.db.raw.prepare('SELECT id FROM exercise_options WHERE exercise_id = ?').all(e.id) as { id: string }[];
      expect(new Set(e.options.map(o => o.id))).toEqual(new Set(src.map(o => o.id)));
    }
  });
});
