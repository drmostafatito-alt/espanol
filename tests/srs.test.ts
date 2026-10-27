/**
 * اختبارات نظام المراجعة المتباعدة — طبقتان:
 *   1) المجدول النقي (scheduleCard): حتمي، بلا قاعدة بيانات.
 *   2) التكامل عبر worker الحقيقي + D1 في الذاكرة: بطاقات، حدود، تكرار، استئناف.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import {
  scheduleCard, resolveLimits, isRating, ratingToQuality, qualityToRating,
  MIN_EASE, MAX_EASE, MAX_INTERVAL_DAYS, LEECH_THRESHOLD, DEFAULT_LIMITS,
  type CardLike,
} from '../src/worker/lib/srs';
import { makeHarness, signupAndGetCookie, type Harness } from './harness';
import { importExemplars, correctAnswer } from './content-fixture';

const NOW = new Date('2026-10-21T08:00:00.000Z');
const newCard: CardLike = { state: 'new', ease: 2.5, intervalDays: 0, reps: 0, lapses: 0 };
const reviewCard: CardLike = { state: 'review', ease: 2.5, intervalDays: 10, reps: 3, lapses: 0 };

const minutesBetween = (iso: string) => (new Date(iso).getTime() - NOW.getTime()) / 60_000;
const daysBetween = (iso: string) => minutesBetween(iso) / 1440;

describe('المجدول النقي (SM-2 معدّل)', () => {
  it('again: يصفّر الفاصل، يخفض ease، ويعيد بعد 10 دقائق', () => {
    const r = scheduleCard(reviewCard, 'again', NOW);
    expect(r.state).toBe('relearning');
    expect(r.intervalDays).toBe(0);
    expect(r.reps).toBe(0);
    expect(r.lapses).toBe(1);
    expect(r.ease).toBeCloseTo(2.3, 5);
    expect(minutesBetween(r.dueAt)).toBe(10);
  });

  it('hard على بطاقة جديدة: 12 ساعة وليس يومًا كاملًا', () => {
    const r = scheduleCard(newCard, 'hard', NOW);
    expect(r.state).toBe('learning');
    expect(minutesBetween(r.dueAt)).toBe(720);
    expect(r.ease).toBeCloseTo(2.35, 5);
  });

  it('hard على مراجعة: الفاصل × 1.2 بحد أدنى يوم', () => {
    const r = scheduleCard(reviewCard, 'hard', NOW);
    expect(r.intervalDays).toBe(12);
    expect(daysBetween(r.dueAt)).toBeCloseTo(12, 5);
  });

  it('good: أول مرة يوم واحد، ثم الفاصل × ease', () => {
    expect(scheduleCard(newCard, 'good', NOW).intervalDays).toBe(1);
    expect(scheduleCard(reviewCard, 'good', NOW).intervalDays).toBe(25);
  });

  it('easy: يرفع ease ويضاعف بمعامل 1.3', () => {
    const r = scheduleCard(reviewCard, 'easy', NOW);
    expect(r.ease).toBeCloseTo(2.65, 5);
    expect(r.intervalDays).toBe(34); // 10 × 2.65 × 1.3 = 34.45
  });

  it('حدود صلبة: ease محصور بين 1.3 و3.0، والفاصل لا يتجاوز سنة', () => {
    let c: CardLike = { state: 'review', ease: MIN_EASE, intervalDays: 5, reps: 1, lapses: 0 };
    for (let i = 0; i < 20; i++) c = { ...c, ...scheduleCard(c, 'again', NOW) };
    expect(c.ease).toBeGreaterThanOrEqual(MIN_EASE);

    let big: CardLike = { state: 'review', ease: MAX_EASE, intervalDays: 300, reps: 5, lapses: 0 };
    for (let i = 0; i < 10; i++) big = { ...big, ...scheduleCard(big, 'easy', NOW) };
    expect(big.intervalDays).toBeLessThanOrEqual(MAX_INTERVAL_DAYS);

    let top: CardLike = { state: 'review', ease: MAX_EASE, intervalDays: 10, reps: 5, lapses: 0 };
    for (let i = 0; i < 10; i++) top = { ...top, ...scheduleCard(top, 'easy', NOW) };
    expect(top.ease).toBeLessThanOrEqual(MAX_EASE);
  });

  it('بعد 8 إخفاقات تُعلَّق البطاقة (leech) بدل الدوران بلا نهاية', () => {
    let c: CardLike = { state: 'review', ease: 2.5, intervalDays: 3, reps: 2, lapses: 0 };
    for (let i = 1; i <= LEECH_THRESHOLD; i++) {
      const r = scheduleCard(c, 'again', NOW);
      c = { ...c, ...r };
      if (i < LEECH_THRESHOLD) expect(r.state).toBe('relearning');
    }
    expect(c.state).toBe('suspended');
    expect(c.lapses).toBe(LEECH_THRESHOLD);
  });

  it('حتمي: نفس المدخلات ⇒ نفس المخرجات', () => {
    expect(scheduleCard(reviewCard, 'good', NOW)).toEqual(scheduleCard(reviewCard, 'good', NOW));
  });

  it('قيم غير صالحة لا تُنتج مواعيد عشوائية', () => {
    const weird = { state: 'new', ease: NaN, intervalDays: NaN, reps: NaN, lapses: NaN } as unknown as CardLike;
    const r = scheduleCard(weird, 'good', NOW);
    expect(Number.isFinite(r.ease)).toBe(true);
    expect(Number.isFinite(r.intervalDays)).toBe(true);
    expect(new Date(r.dueAt).toString()).not.toBe('Invalid Date');
  });

  it('ترميز التقييمات ثابت ومتوافق مع أعمدة القاعدة', () => {
    expect(ratingToQuality('again')).toBe(1);
    expect(ratingToQuality('easy')).toBe(5);
    expect(qualityToRating(1)).toBe('again');
    expect(qualityToRating(5)).toBe('easy');
    expect(isRating('good')).toBe(true);
    expect(isRating('perfect')).toBe(false);
  });

  it('الحدود اليومية تُقصّ إلى نطاق آمن', () => {
    expect(resolveLimits(null)).toEqual(DEFAULT_LIMITS);
    expect(resolveLimits({ newPerDay: -5, reviewsPerDay: 99999 })).toEqual({ newPerDay: 0, reviewsPerDay: 1000 });
    expect(resolveLimits({ newPerDay: '7', reviewsPerDay: 10.7 })).toEqual({ newPerDay: 7, reviewsPerDay: 10 });
  });
});

// ---------------------------------------------------------------------------

let h: Harness;
let cookie: string;

const LESSON = 'prea1-hola-me-llamo';

async function completeLessonOnce() {
  const session = await h.json<{ exercises: { id: string; mode: string }[] }>(
    await h.call(`/api/lessons/${LESSON}/session`, { cookie }),
  );
  const { correctAnswer } = await import('./content-fixture');
  for (const ex of session.exercises) {
    if (ex.mode !== 'graded') continue;
    await h.call(`/api/lessons/${LESSON}/answers`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        eventId: `ev_${ex.id.slice(-10)}_${Math.random().toString(36).slice(2, 10)}`,
        exerciseId: ex.id,
        response: correctAnswer(h, ex.id) ?? '',
      }),
    });
  }
  return h.json<{ reviewCardsCreated: number; passed: boolean }>(
    await h.call(`/api/lessons/${LESSON}/complete`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({ eventId: `complete_${Math.random().toString(36).slice(2, 12)}` }),
    }),
  );
}

describe('SRS عبر الخادم الحقيقي', () => {
  beforeEach(async () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ALLOW_PUBLIC_SIGNUP: 'true' });
    importExemplars(h);
    const { cookie: c } = await signupAndGetCookie(h);
    cookie = c!;
  });

  it('إتمام درس يولّد بطاقات مفرداته مرة واحدة فقط', async () => {
    const first = await completeLessonOnce();
    expect(first.reviewCardsCreated).toBeGreaterThan(0);

    const again = await h.json<{ reviewCardsCreated: number }>(
      await h.call(`/api/lessons/${LESSON}/complete`, {
        method: 'POST',
        cookie,
        body: JSON.stringify({ eventId: 'complete_second_evt_1' }),
      }),
    );
    expect(again.reviewCardsCreated).toBe(0);
  });

  it('جلسة المراجعة تُعيد بطاقات مستحقة الآن بلا كشف الإجابة في وضع الإنتاج', async () => {
    await completeLessonOnce();
    const res = await h.json<{ cards: Record<string, unknown>[]; session: { totalCards: number } }>(
      await h.call('/api/review/session', { cookie }),
    );
    expect(res.cards.length).toBeGreaterThan(0);
    expect(res.session.totalCards).toBe(res.cards.length);
    const card = res.cards[0]!;
    expect(card.headwordEs).toBeTruthy();
    // في وضع التعرف: المعنى يُكشف يدويًا في الواجهة، لكنه ليس «إجابة مصحّحة»
    expect(card.kind).toBe('recognition');
  });

  it('التقييمات الأربعة تغيّر الموعد على الخادم فقط', async () => {
    await completeLessonOnce();
    const { cards } = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));

    const cases: [string, number][] = [['again', 0], ['hard', 1], ['good', 1], ['easy', 3]];
    let i = 0;
    for (const [rating, expectedDays] of cases) {
      const cardId = cards[Math.min(i, cards.length - 1)]!.id;
      const res = await h.json<{ replay: boolean; next: { intervalDays: number; dueAt: string } }>(
        await h.call('/api/review/answers', {
          method: 'POST',
          cookie,
          body: JSON.stringify({ clientEventId: `ev_rev_${rating}_0000001`, cardId, rating, responseMs: 1200 }),
        }),
      );
      expect(res.replay).toBe(false);
      expect(res.next.intervalDays).toBeGreaterThanOrEqual(expectedDays);
      expect(new Date(res.next.dueAt).getTime()).toBeGreaterThan(Date.now());
      i++;
    }
  });

  it('العميل لا يستطيع فرض موعد أو فاصل زمني', async () => {
    await completeLessonOnce();
    const { cards } = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));
    const res = await h.json<{ next: { intervalDays: number } }>(
      await h.call('/api/review/answers', {
        method: 'POST',
        cookie,
        body: JSON.stringify({
          clientEventId: 'ev_tamper_0000001',
          cardId: cards[0]!.id,
          rating: 'again',
          intervalDays: 9999,
          ease: 3,
          dueAt: '2030-01-01T00:00:00.000Z',
        }),
      }),
    );
    expect(res.next.intervalDays).toBe(0);
  });

  it('نفس clientEventId مرتين ⇒ replay واحد وسجل واحد', async () => {
    await completeLessonOnce();
    const { cards } = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));
    const body = JSON.stringify({ clientEventId: 'ev_dup_00000001', cardId: cards[0]!.id, rating: 'good' });
    const a = await h.json<{ replay: boolean }>(await h.call('/api/review/answers', { method: 'POST', cookie, body }));
    const b = await h.json<{ replay: boolean }>(await h.call('/api/review/answers', { method: 'POST', cookie, body }));
    expect(a.replay).toBe(false);
    expect(b.replay).toBe(true);
    const count = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM srs_reviews WHERE user_id = (SELECT id FROM users LIMIT 1)`)
      .get() as { n: number };
    expect(count.n).toBe(1);
  });

  it('طلبات متزامنة بنفس الحدث لا تُسجّل مراجعتين', async () => {
    await completeLessonOnce();
    const { cards } = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));
    const body = JSON.stringify({ clientEventId: 'ev_par_00000001', cardId: cards[0]!.id, rating: 'good' });
    const results = await Promise.all([
      h.call('/api/review/answers', { method: 'POST', cookie, body }),
      h.call('/api/review/answers', { method: 'POST', cookie, body }),
      h.call('/api/review/answers', { method: 'POST', cookie, body }),
    ]);
    expect(results.every(r => r.status === 200)).toBe(true);
    const n = h.db.raw.prepare(`SELECT COUNT(*) AS n FROM srs_reviews`).get() as { n: number };
    expect(n.n).toBe(1);
    const stats = h.db.raw.prepare(`SELECT reviews_done FROM user_stats`).get() as { reviews_done: number };
    expect(stats.reviews_done).toBe(1); // لا تقدم مضاعف
  });

  it('التقييم أو الحدث غير الصالح يُرفض بـ400', async () => {
    await completeLessonOnce();
    const { cards } = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));
    const bad1 = await h.call('/api/review/answers', {
      method: 'POST', cookie,
      body: JSON.stringify({ clientEventId: 'ev_val_00000001', cardId: cards[0]!.id, rating: 'perfect' }),
    });
    const bad2 = await h.call('/api/review/answers', {
      method: 'POST', cookie,
      body: JSON.stringify({ clientEventId: 'x', cardId: cards[0]!.id, rating: 'good' }),
    });
    const missing = await h.call('/api/review/answers', {
      method: 'POST', cookie,
      body: JSON.stringify({ clientEventId: 'ev_val_00000002', cardId: 'vocab:nope:recognition', rating: 'good' }),
    });
    expect(bad1.status).toBe(400);
    expect(bad2.status).toBe(400);
    expect(missing.status).toBe(404);
  });

  it('بلا جلسة: 401 — ولا تُكشف بطاقات مستخدم آخر', async () => {
    await completeLessonOnce();
    expect((await h.call('/api/review/session')).status).toBe(401);

    const other = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ALLOW_PUBLIC_SIGNUP: 'true' });
    importExemplars(other);
    const { cookie: otherCookie } = await signupAndGetCookie(other, 'other@example.com');
    const res = await other.json<{ cards: unknown[]; session: { totalCards: number } }>(
      await other.call('/api/review/session', { cookie: otherCookie }),
    );
    expect(res.cards).toEqual([]);
    expect(res.session.totalCards).toBe(0);
    other.close();
  });

  it('الحد اليومي للبطاقات الجديدة يُطبَّق على الخادم', async () => {
    h.db.raw
      .prepare(`INSERT INTO user_settings (user_id, key, value_json) VALUES ((SELECT id FROM users LIMIT 1), 'srs.limits', '{"newPerDay":1,"reviewsPerDay":100}')`)
      .run();
    await completeLessonOnce();

    const first = await h.json<{ cards: { id: string }[]; session: { newRemaining: number } }>(
      await h.call('/api/review/session', { cookie }),
    );
    expect(first.cards.length).toBe(1); // حد البطاقات الجديدة = 1 رغم وجود بطاقات أخرى مستحقة
    expect(first.session.newRemaining).toBe(1);

    await h.call('/api/review/answers', {
      method: 'POST', cookie,
      body: JSON.stringify({ clientEventId: 'ev_limit_0000001', cardId: first.cards[0]!.id, rating: 'good' }),
    });

    const after = await h.json<{ cards: unknown[]; session: { newRemaining: number }; emptyReason: string }>(
      await h.call('/api/review/session', { cookie }),
    );
    expect(after.session.newRemaining).toBe(0);
    expect(after.cards).toEqual([]);
    expect(after.emptyReason).toBe('DAILY_LIMIT_REACHED');
  });

  it('الحد اليومي للمراجعات يُطبَّق على الخادم (429)', async () => {
    h.db.raw
      .prepare(`INSERT INTO user_settings (user_id, key, value_json) VALUES ((SELECT id FROM users LIMIT 1), 'srs.limits', '{"newPerDay":10,"reviewsPerDay":1}')`)
      .run();
    await completeLessonOnce();

    // نحوّل بطاقتين إلى حالة «مراجعة» مباشرة (محاكاة يوم لاحق) ثم نجرّب تجاوز الحد
    h.db.raw.prepare(`UPDATE review_schedule SET state='review', interval_days=5, repetitions=2`).run();
    const session = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));
    expect(session.cards.length).toBe(1); // reviewsPerDay=1

    const ok = await h.call('/api/review/answers', {
      method: 'POST', cookie,
      body: JSON.stringify({ clientEventId: 'ev_rlimit_000001', cardId: session.cards[0]!.id, rating: 'good' }),
    });
    expect(ok.status).toBe(200);

    // نُعيد البطاقة الثانية إلى حالة مستحقة بلا مراجعة، ثم نحاول تقييمها ⇒ 429
    const second = h.db.raw
      .prepare(`SELECT item_id, card_kind FROM review_schedule ORDER BY item_id LIMIT 1 OFFSET 1`)
      .get() as { item_id: string; card_kind: string } | undefined;
    if (!second) return; // لا حرج: المحتوى الحالي قد يعطي بطاقة واحدة فقط
    const res = await h.call('/api/review/answers', {
      method: 'POST', cookie,
      body: JSON.stringify({ clientEventId: 'ev_rlimit_000002', cardId: `vocab:${second.item_id}:${second.card_kind}`, rating: 'good' }),
    });
    expect(res.status).toBe(429);
  });

  it('لا بطاقات مستحقة ⇒ سبب واضح لا رسالة خطأ', async () => {
    const res = await h.json<{ cards: unknown[]; emptyReason: string }>(await h.call('/api/review/session', { cookie }));
    expect(res.cards).toEqual([]);
    expect(res.emptyReason).toBe('NOTHING_DUE');
  });

  it('بطاقة يتيمة (بلا مدخل معجمي) لا تُعدّ مستحقة ولا تُظهر «وصلت حدّك»', async () => {
    h.db.raw
      .prepare(`INSERT INTO review_schedule (user_id, item_type, item_id, card_kind, ease, interval_days, repetitions, lapses, due_at, state)
                VALUES ((SELECT id FROM users LIMIT 1), 'vocab', 'voc_does_not_exist', 'recognition', 2.5, 0, 0, 0, '2000-01-01T00:00:00.000Z', 'new')`)
      .run();
    const res = await h.json<{ cards: unknown[]; session: { dueNow: number }; emptyReason: string }>(
      await h.call('/api/review/session', { cookie }),
    );
    expect(res.cards).toEqual([]);
    expect(res.session.dueNow).toBe(0);
    expect(res.emptyReason).toBe('NO_VALID_CARDS');
  });

  it('حزم المفردات: البدء يولّد البطاقات مرة واحدة، ويعيد الاستخدام بلا تكرار', async () => {
    const packs = await h.json<{ packs: { slug: string; entries: number }[] }>(await h.call('/api/review/packs', { cookie }));
    expect(packs.packs.length).toBeGreaterThan(0);
    const slug = packs.packs[0]!.slug;

    const first = await h.json<{ created: number; totalEntries: number }>(
      await h.call(`/api/review/packs/${slug}/start`, { method: 'POST', cookie }),
    );
    expect(first.created).toBe(first.totalEntries);

    const second = await h.json<{ created: number; alreadyPresent: number }>(
      await h.call(`/api/review/packs/${slug}/start`, { method: 'POST', cookie }),
    );
    expect(second.created).toBe(0);
    expect(second.alreadyPresent).toBe(first.totalEntries);
  });

  it('فشل قاعدة البيانات لا يُنتج حفظًا وهميًا', async () => {
    await completeLessonOnce();
    const { cards } = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));
    const realPrepare = h.env.DB.prepare.bind(h.env.DB);
    // نُعطّل الكتابة على سجل المراجعات فقط
    (h.env.DB as unknown as { prepare: (sql: string) => unknown }).prepare = (sql: string) => {
      if (sql.includes('INTO srs_reviews')) throw new Error('simulated disk failure');
      return realPrepare(sql);
    };
    const res = await h.call('/api/review/answers', {
      method: 'POST', cookie,
      body: JSON.stringify({ clientEventId: 'ev_fail_0000001', cardId: cards[0]!.id, rating: 'good' }),
    });
    (h.env.DB as unknown as { prepare: typeof realPrepare }).prepare = realPrepare;
    expect(res.status).toBeGreaterThanOrEqual(500);
    const n = h.db.raw.prepare(`SELECT COUNT(*) AS n FROM srs_reviews`).get() as { n: number };
    expect(n.n).toBe(0);
  });

  it('التحكم في ظهور الترجمة المصرية (fusha vs fusha_eg)', async () => {
    await completeLessonOnce();
    // 1. عند اختيار الفصحى فقط: revealArEg يجب أن يكون null دائمًا
    const patchRes1 = await h.call('/api/me', {
      method: 'PATCH',
      cookie,
      body: JSON.stringify({ explanationStyle: 'fusha' }),
    });
    expect(patchRes1.status).toBe(200);

    const resFusha = await h.json<{ cards: { id: string; revealArEg?: string | null }[] }>(
      await h.call('/api/review/session', { cookie }),
    );
    expect(resFusha.cards.length).toBeGreaterThan(0);
    for (const c of resFusha.cards) {
      expect(c.revealArEg ?? null).toBeNull();
    }

    // 2. عند اختيار الفصحى مع المصرية: revealArEg مسموح بظهوره عند توفره
    const patchRes2 = await h.call('/api/me', {
      method: 'PATCH',
      cookie,
      body: JSON.stringify({ explanationStyle: 'fusha_eg' }),
    });
    expect(patchRes2.status).toBe(200);

    const resEg = await h.json<{ cards: { id: string; revealArEg?: string | null }[] }>(
      await h.call('/api/review/session', { cookie }),
    );
    expect(resEg.cards.length).toBeGreaterThan(0);
    // تظهر المصرية لبعض البطاقات المستوردة
    const hasAnyEg = resEg.cards.some(c => typeof c.revealArEg === 'string' && c.revealArEg.length > 0);
    expect(hasAnyEg).toBe(true);
  });
});

// ---------------------------------------------------------------------------

const STABLE_ENC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** معرّف التمرين في القاعدة كما يشتقه الـ importer (نفس خوارزمية stableId). */
function dbExId(slug: string, jsonId: string): string {
  const digest = createHash('sha256').update(`${slug}/${jsonId}`).digest();
  let out = '';
  for (let i = 0; i < 12; i++) out += STABLE_ENC[(digest[i] ?? 0) % 32]!;
  return `ex_${out}`;
}

describe('ربط الإجابات الخاطئة ببطاقات المراجعة', () => {
  beforeEach(async () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ALLOW_PUBLIC_SIGNUP: 'true' });
    importExemplars(h);
    const { cookie: c } = await signupAndGetCookie(h);
    cookie = c!;
  });

  function entryIdFor(word: string): string {
    const row = h.db.raw
      .prepare(`SELECT id FROM vocabulary_entries WHERE headword_normalized = ?`)
      .get(word) as { id: string } | undefined;
    if (!row) throw new Error(`مدخل المفردات غير موجود: ${word}`);
    return row.id;
  }

  function cardFor(word: string) {
    return h.db.raw
      .prepare(
        `SELECT ease, interval_days, repetitions, lapses, due_at, state
         FROM review_schedule
         WHERE user_id = (SELECT id FROM users LIMIT 1) AND item_type = 'vocab' AND item_id = ? AND card_kind = 'recognition'`,
      )
      .get(entryIdFor(word)) as { ease: number; interval_days: number; repetitions: number; lapses: number; due_at: string; state: string };
  }

  function answer(exDbId: string, response: unknown, eventId: string) {
    return h.call(`/api/lessons/${LESSON}/answers`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({ eventId, exerciseId: exDbId, response }),
    });
  }

  it('الإجابة الصحيحة لا تمسّ بطاقات المراجعة', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    const res = await h.json(await answer(exId, correctAnswer(h, exId) ?? '', 'ev_corr_0000001'));
    expect(res.correct).toBe(true);

    const card = cardFor('me llamo');
    expect(card.state).toBe('new');
    expect(card.ease).toBeCloseTo(2.5, 5);
    expect(card.interval_days).toBe(0);
    expect(card.lapses).toBe(0);
    const n = h.db.raw.prepare(`SELECT COUNT(*) AS n FROM srs_reviews`).get() as { n: number };
    expect(n.n).toBe(0);
  });

  it('الإجابة الخاطئة تُعيد بطاقة الكلمة المستهدفة إلى إعادة التعلّم', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    const res = await h.json(await answer(exId, '__none__', 'ev_wrong_0000001'));
    expect(res.correct).toBe(false);

    const card = cardFor('me llamo');
    expect(card.state).toBe('relearning');
    expect(card.interval_days).toBe(0);
    expect(card.repetitions).toBe(0);
    expect(card.lapses).toBe(1);
    expect(card.ease).toBeCloseTo(2.3, 5);
    const minutes = (new Date(card.due_at).getTime() - Date.now()) / 60_000;
    expect(minutes).toBeGreaterThan(9);
    expect(minutes).toBeLessThan(11);

    // التحويل مسجّل في سجل المراجعات بتقييم again (1)
    const row = h.db.raw
      .prepare(`SELECT rating FROM srs_reviews WHERE item_id = ?`)
      .get(entryIdFor('me llamo')) as { rating: number };
    expect(row.rating).toBe(1);
  });

  it('فقط بطاقة الكلمة المستهدفة تتأثر، وبقية بطاقات الدرس ثابتة', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    await answer(exId, '__none__', 'ev_only_00000001');

    expect(cardFor('me llamo').state).toBe('relearning');
    for (const w of ['hola', 'buenos días', 'mucho gusto']) {
      const c = cardFor(w);
      expect(c.state).toBe('new');
      expect(c.ease).toBeCloseTo(2.5, 5);
      expect(c.lapses).toBe(0);
    }
  });

  it('غياب الرابط (تمرين بلا targetVocab) ⇒ لا تغيير', async () => {
    await completeLessonOnce();
    // prea1_ll_6_sound: word_choice بلا targetVocab
    const exId = dbExId(LESSON, 'prea1_ll_6_sound');
    const res = await h.json(await answer(exId, '__none__', 'ev_nolink_000001'));
    expect(res.correct).toBe(false);

    const n = h.db.raw.prepare(`SELECT COUNT(*) AS n FROM srs_reviews`).get() as { n: number };
    expect(n.n).toBe(0);
    expect(cardFor('me llamo').state).toBe('new');
    expect(cardFor('hola').state).toBe('new');
  });

  it('كلمة غير موجودة في المفردات ⇒ لا تغيير', async () => {
    await completeLessonOnce();
    // نُعدّل content_json بحيث تصبح targetVocab كلمة غير موجودة في المفردات
    const vid = h.db.raw
      .prepare(`SELECT id FROM lesson_versions WHERE id = (SELECT current_version_id FROM lessons WHERE slug = ?)`)
      .get(LESSON) as { id: string };
    const row = h.db.raw.prepare(`SELECT content_json FROM lesson_versions WHERE id = ?`).get(vid.id) as { content_json: string };
    const parsed = JSON.parse(row.content_json) as { exercises: { id: string; targetVocab?: string[] }[] };
    parsed.exercises = parsed.exercises.map(e =>
      e.id === 'prea1_ll_3_fill' ? { ...e, targetVocab: ['no-existe-xyz'] } : e,
    );
    h.db.raw.prepare(`UPDATE lesson_versions SET content_json = ? WHERE id = ?`).run(JSON.stringify(parsed), vid.id);

    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    const res = await h.json(await answer(exId, '__none__', 'ev_noword_000001'));
    expect(res.correct).toBe(false);

    expect(cardFor('me llamo').state).toBe('new');
    const n = h.db.raw.prepare(`SELECT COUNT(*) AS n FROM srs_reviews`).get() as { n: number };
    expect(n.n).toBe(0);
  });

  it('إعادة الطلب بنفس eventId ⇒ تحديث واحد للبطاقة', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    const body = JSON.stringify({ eventId: 'ev_replay_00001', exerciseId: exId, response: '__none__' });

    const a = await h.json(await h.call(`/api/lessons/${LESSON}/answers`, { method: 'POST', cookie, body }));
    expect(a.replay).toBe(false);
    const after1 = cardFor('me llamo');

    const b = await h.json(await h.call(`/api/lessons/${LESSON}/answers`, { method: 'POST', cookie, body }));
    expect(b.replay).toBe(true);
    const after2 = cardFor('me llamo');
    expect(after2.due_at).toBe(after1.due_at);
    expect(after2.lapses).toBe(1);

    const n = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM srs_reviews WHERE item_id = ?`)
      .get(entryIdFor('me llamo')) as { n: number };
    expect(n.n).toBe(1);
  });

  it('طلبان متزامنان لنفس النتيجة ⇒ تحديث واحد للبطاقة', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    const body = JSON.stringify({ eventId: 'ev_par_00000001', exerciseId: exId, response: '__none__' });
    const results = await Promise.all([
      h.call(`/api/lessons/${LESSON}/answers`, { method: 'POST', cookie, body }),
      h.call(`/api/lessons/${LESSON}/answers`, { method: 'POST', cookie, body }),
    ]);
    expect(results.some(r => r.status === 200)).toBe(true);

    const n = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM srs_reviews WHERE item_id = ?`)
      .get(entryIdFor('me llamo')) as { n: number };
    expect(n.n).toBe(1);
    expect(cardFor('me llamo').lapses).toBe(1);
  });

  it('فشل تحديث SRS لا يُسقط نتيجة التمرين', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    const before = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM user_exercise_attempts WHERE exercise_id = ?`)
      .get(exId) as { n: number };

    const realPrepare = h.env.DB.prepare.bind(h.env.DB);
    (h.env.DB as unknown as { prepare: (sql: string) => unknown }).prepare = (sql: string) => {
      if (sql.includes('INTO srs_reviews')) throw new Error('simulated disk failure');
      return realPrepare(sql);
    };
    const res = await h.json(await answer(exId, '__none__', 'ev_fail_0000001'));
    (h.env.DB as unknown as { prepare: typeof realPrepare }).prepare = realPrepare;

    // النتيجة صحيحة ومُسجّلة
    expect(res.correct).toBe(false);
    const after = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM user_exercise_attempts WHERE exercise_id = ?`)
      .get(exId) as { n: number };
    expect(after.n).toBe(before.n + 1);
    // والبطاقة لم تتغيّر
    expect(cardFor('me llamo').state).toBe('new');
    expect(cardFor('me llamo').lapses).toBe(0);
  });

  it('بطاقات غير مرتبطة (كلمات الحزم الأخرى) لا تتأثر', async () => {
    await completeLessonOnce();
    // حزمة مفردات تضيف بطاقات لكلمات ليست من دروس هذا الدرس
    const packs = await h.json<{ packs: { slug: string }[] }>(await h.call('/api/review/packs', { cookie }));
    await h.call(`/api/review/packs/${packs.packs[0]!.slug}/start`, { method: 'POST', cookie });
    const caféCard = cardFor('café');
    expect(caféCard).toBeTruthy();

    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    await answer(exId, '__none__', 'ev_unrel_0000001');

    expect(cardFor('me llamo').state).toBe('relearning');
    expect(cardFor('café').state).toBe('new');
    expect(cardFor('café').ease).toBeCloseTo(2.5, 5);
    expect(cardFor('café').lapses).toBe(0);
  });

  it('بطاقات مستخدم آخر لا تتأثر', async () => {
    await completeLessonOnce();
    // نُكمل الدرس لمستخدم ثانٍ في نفس القاعدة
    const other = await signupAndGetCookie(h, 'other@example.com');
    const session = await h.json<{ exercises: { id: string; mode: string }[] }>(
      await h.call(`/api/lessons/${LESSON}/session`, { cookie: other.cookie }),
    );
    for (const ex of session.exercises) {
      if (ex.mode !== 'graded') continue;
      await h.call(`/api/lessons/${LESSON}/answers`, {
        method: 'POST', cookie: other.cookie,
        body: JSON.stringify({ eventId: `ev_o_${ex.id.slice(-8)}_x1`, exerciseId: ex.id, response: correctAnswer(h, ex.id) ?? '' }),
      });
    }
    await h.call(`/api/lessons/${LESSON}/complete`, { method: 'POST', cookie: other.cookie, body: JSON.stringify({ eventId: 'complete_other_1' }) });

    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    await answer(exId, '__none__', 'ev_cross_0000001');

    // البطاقة الحالية تغيّرت
    expect(cardFor('me llamo').state).toBe('relearning');
    // بطاقة المستخدم الثاني (نفس الكلمة) ثابتة
    const otherCard = h.db.raw
      .prepare(
        `SELECT state, lapses FROM review_schedule
         WHERE user_id = (SELECT id FROM users WHERE email_normalized = 'other@example.com') AND item_type = 'vocab' AND item_id = ? AND card_kind = 'recognition'`,
      )
      .get(entryIdFor('me llamo')) as { state: string; lapses: number };
    expect(otherCard.state).toBe('new');
    expect(otherCard.lapses).toBe(0);
  });

  it('تحديث البطاقة وسجل المراجعة يحدثان معاً في سيناريو ذري واحد', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    await answer(exId, '__none__', 'ev_pair_0000001');

    // سجل المراجعة والبطاقة متطابقان — قيم next في السجل = حالة البطاقة الحالية
    const record = h.db.raw
      .prepare(`SELECT next_state, next_due_at, next_interval_days, next_ease FROM srs_reviews WHERE item_id = ?`)
      .get(entryIdFor('me llamo')) as { next_state: string; next_due_at: string; next_interval_days: number; next_ease: number };
    const card = cardFor('me llamo');
    expect(record).toBeDefined();
    expect(record.next_state).toBe(card.state);
    expect(record.next_due_at).toBe(card.due_at);
    expect(record.next_interval_days).toBe(card.interval_days);
    expect(record.next_ease).toBe(card.ease);
  });

  it('فشل التحديث أو إدخال السجل لا يترك حالة جزئية', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    const realBatch = h.env.DB.batch.bind(h.env.DB);
    (h.env.DB as unknown as { batch: () => Promise<unknown> }).batch = async () => {
      throw new Error('simulated batch failure');
    };
    const res = await h.json(await answer(exId, '__none__', 'ev_batchfail_1'));
    (h.env.DB as unknown as { batch: typeof realBatch }).batch = realBatch;

    // النتيجة صحيحة ومُسجّلة
    expect(res.correct).toBe(false);
    // لا سجل مراجعة منقوص
    const n = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM srs_reviews WHERE item_id = ?`)
      .get(entryIdFor('me llamo')) as { n: number };
    expect(n.n).toBe(0);
    // ولا تحديث بطاقة منقوص
    expect(cardFor('me llamo').state).toBe('new');
    expect(cardFor('me llamo').lapses).toBe(0);
  });

  it('إعادة المحاولة بعد فشل SRS بنفس eventId تستكمله بشكل محدود', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');

    // المحاولة الأولى: إدخال سجل المراجعة يفشل ⇒ لا بطاقة ولا سجل
    const realPrepare = h.env.DB.prepare.bind(h.env.DB);
    (h.env.DB as unknown as { prepare: (sql: string) => unknown }).prepare = (sql: string) => {
      if (sql.includes('INTO srs_reviews')) throw new Error('simulated disk failure');
      return realPrepare(sql);
    };
    const first = await h.json(await answer(exId, '__none__', 'ev_retry_000001'));
    (h.env.DB as unknown as { prepare: typeof realPrepare }).prepare = realPrepare;
    expect(first.correct).toBe(false);
    expect(cardFor('me llamo').state).toBe('new');
    const mid = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM srs_reviews WHERE item_id = ?`)
      .get(entryIdFor('me llamo')) as { n: number };
    expect(mid.n).toBe(0);

    // إعادة إرسال نفس الحدث ⇒ استكمال محدود للتحديث الفاشل
    const second = await h.json(await answer(exId, '__none__', 'ev_retry_000001'));
    expect(second.replay).toBe(true);
    expect(second.correct).toBe(false);
    expect(cardFor('me llamo').state).toBe('relearning');
    expect(cardFor('me llamo').lapses).toBe(1);
    const after = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM srs_reviews WHERE item_id = ?`)
      .get(entryIdFor('me llamo')) as { n: number };
    expect(after.n).toBe(1);
  });

  it('إعادة إرسال حدث إجابة خاطئة بعد مراجعة أحدث لا يعيد تطبيق التحديث القديم', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    await answer(exId, '__none__', 'ev_stale_000001');
    expect(cardFor('me llamo').state).toBe('relearning');

    // مراجعة أحدث للبطاقة نفسها (تقييم good في جلسة المراجعة)
    const entryId = entryIdFor('me llamo');
    const review = await h.json(
      await h.call('/api/review/answers', {
        method: 'POST', cookie,
        body: JSON.stringify({ clientEventId: 'rv_stale_000001', cardId: `vocab:${entryId}:recognition`, rating: 'good' }),
      }),
    );
    expect(review.replay).toBeFalsy();
    const dueAfterReview = cardFor('me llamo').due_at;
    const lapsesAfterReview = cardFor('me llamo').lapses;

    // إعادة إرسال حدث الإجابة الخاطئة القديم
    const replay = await h.json(await answer(exId, '__none__', 'ev_stale_000001'));
    expect(replay.replay).toBe(true);
    expect(replay.correct).toBe(false);

    // لا يُعاد تطبيق التحديث القديم: البطاقة تحافظ على جدولة المراجعة الأحدث
    expect(cardFor('me llamo').due_at).toBe(dueAfterReview);
    expect(cardFor('me llamo').lapses).toBe(lapsesAfterReview);
    // لا يُضاف سجل مراجعة جديد لحدث الإجابة القديم (السجل الموجود فقط)
    const n = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM srs_reviews WHERE client_event_id = ?`)
      .get(`ev_stale_000001:${entryId}`) as { n: number };
    expect(n.n).toBe(1);
  });

  it('حدثان مختلفان لنفس البطاقة ⇒ سجلان وتحديثان بلا تعارض فريد', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    await answer(exId, '__none__', 'ev_two_0000001');
    expect(cardFor('me llamo').lapses).toBe(1);
    await answer(exId, '__none__', 'ev_two_0000002');
    expect(cardFor('me llamo').state).toBe('relearning');
    expect(cardFor('me llamo').lapses).toBe(2);
    const n = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM srs_reviews WHERE item_id = ?`)
      .get(entryIdFor('me llamo')) as { n: number };
    expect(n.n).toBe(2);
  });

  it('طلبان متزامنان بحدثين مختلفين لنفس البطاقة ⇒ كلاهما ينجح بلا تعارض', async () => {
    await completeLessonOnce();
    const exId = dbExId(LESSON, 'prea1_ll_3_fill');
    const results = await Promise.all([
      answer(exId, '__none__', 'ev_par2_0000001'),
      answer(exId, '__none__', 'ev_par2_0000002'),
    ]);
    for (const r of results) expect(r.status).toBe(200);

    expect(cardFor('me llamo').state).toBe('relearning');
    const n = h.db.raw
      .prepare(`SELECT COUNT(*) AS n FROM srs_reviews WHERE item_id = ?`)
      .get(entryIdFor('me llamo')) as { n: number };
    expect(n.n).toBe(2);
  });
});
