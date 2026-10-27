/**
 * رحلة متعلم كاملة عبر الـWorker الحقيقي وقاعدة اختبار فعلية:
 * تسجيل ← أسئلة تحديد المستوى ← تقييم ← درس ← إجابات ← إكمال ← XP مرة
 * واحدة ← استمرار التقدم بعد «إعادة تحميل» (طلب جديد بنفس الكوكي) ←
 * مراجعة SRS ← درس تالٍ مفتوح.
 * لا متصفح هنا — اختبارات Playwright تغطي العرض؛ هذا يغطي العقد الخادمي كاملًا.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { makeHarness, type Harness } from './harness';
import { correctAnswer, importExemplars } from './content-fixture';

let h: Harness;

beforeEach(async () => {
  h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
  importExemplars(h);
});

async function signup(hh: Harness, email: string) {
  const res = await hh.call('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password: 'Cairo2026learn', displayName: 'متعلم' }),
  });
  expect(res.status).toBe(201);
  return hh.cookieOf(res)!;
}

describe('رحلة المتعلم من البداية إلى النهاية', () => {
  it('تحديد مستوى ثم درس ثم مراجعة — بلا تسريب إجابات وبلا مضاعفة XP', async () => {
    // --- المستخدم أ: اختبار تحديد المستوى ---
    const cookieA = await signup(h, 'placer@example.com');
    const qRes = await h.call('/api/me/placement/questions', { cookie: cookieA });
    expect(qRes.status).toBe(200);
    const qText = await qRes.text();
    expect(qText).not.toContain('correct');
    const questions = JSON.parse(qText).questions;
    expect(questions).toHaveLength(10);

    const placement = await h.json(
      await h.call('/api/me/placement', {
        method: 'POST', cookie: cookieA,
        body: JSON.stringify({
          answers: { '1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'b', '6': 'c', '7': 'd', '8': 'd', '9': 'c', '10': 'c' },
        }),
      }),
    );
    expect(placement.passed).toBe(true);
    expect(placement.score).toBe(100);
    expect(placement.xpAwarded).toBe(80);

    // --- المستخدم ب: رحلة الدرس ---
    const cookie = await signup(h, 'learner@example.com');

    // A1 مقفل قبل إتمام PREA1
    expect((await h.call('/api/lessons/a1-un-cafe-por-favor/session', { cookie })).status).toBe(403);

    const sessionRes = await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie });
    expect(sessionRes.status).toBe(200);
    const sessionText = await sessionRes.text();
    expect(sessionText).not.toContain('answerKey');
    expect(sessionText).not.toContain('isCorrect');
    const session = JSON.parse(sessionText);
    const graded = session.exercises.filter((e: { mode: string }) => e.mode === 'graded');
    expect(graded.length).toBeGreaterThan(0);

    for (const ex of graded) {
      const res = await h.call('/api/lessons/prea1-hola-me-llamo/answers', {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `ev_j_${ex.id.slice(-8)}_00001`, exerciseId: ex.id, response: correctAnswer(h, ex.id) }),
      });
      expect(res.status).toBe(200);
      expect((await h.json(res)).correct).toBe(true);
    }

    const done = await h.json(
      await h.call('/api/lessons/prea1-hola-me-llamo/complete', {
        method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_journey_1' }),
      }),
    );
    expect(done.passed).toBe(true);
    expect(done.xpAwarded).toBe(30);
    expect(done.xpTotal).toBe(30);
    expect(done.reviewCardsCreated).toBeGreaterThan(0);

    // إكمال مكرر بمعرّف حدث جديد: لا XP إضافيًا
    const again = await h.json(
      await h.call('/api/lessons/prea1-hola-me-llamo/complete', {
        method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_journey_2' }),
      }),
    );
    expect(again.xpAwarded).toBe(0);
    expect(again.xpTotal).toBe(30);
    expect(again.alreadyCompleted).toBe(true);

    // «إعادة تحميل الصفحة»: طلبات جديدة بنفس الكوكي — التقدم محفوظ
    expect((await h.call('/api/auth/me', { cookie })).status).toBe(200);
    const prog = await h.json(await h.call('/api/me/progress', { cookie }));
    expect(prog.stats.xp_total).toBe(30);
    expect(prog.totals.lessons_completed).toBe(1);
    expect(prog.lessons.find((l: { slug: string }) => l.slug === 'prea1-hola-me-llamo').progress_status).toBe('completed');

    // الدرس التالي أصبح مفتوحًا
    expect((await h.call('/api/lessons/a1-un-cafe-por-favor/session', { cookie })).status).toBe(200);

    // مراجعة SRS: بطاقات مستحقة، وتقييم يُجدول، وإعادة الإرسال تُعيد النتيجة
    const review = await h.json(await h.call('/api/review/session?limit=5', { cookie }));
    expect(review.cards.length).toBeGreaterThan(0);
    const card = review.cards[0];
    const rated = await h.json(
      await h.call('/api/review/answers', {
        method: 'POST', cookie,
        body: JSON.stringify({ clientEventId: 'review_journey_1', cardId: card.id, rating: 'good', responseMs: 1200 }),
      }),
    );
    expect(rated.replay).toBe(false);
    expect(rated.next).toBeDefined();
    const replay = await h.json(
      await h.call('/api/review/answers', {
        method: 'POST', cookie,
        body: JSON.stringify({ clientEventId: 'review_journey_1', cardId: card.id, rating: 'good', responseMs: 1200 }),
      }),
    );
    expect(replay.replay).toBe(true);
    const stats = h.db.raw.prepare(
      `SELECT xp_total, reviews_done FROM user_stats
       WHERE user_id = (SELECT id FROM users WHERE email_normalized = 'learner@example.com')`,
    ).get() as { xp_total: number; reviews_done: number };
    expect(stats.xp_total).toBe(30);
    expect(stats.reviews_done).toBe(1);
  });
});
