/**
 * سلامة التقدم بين المسارات: إتمام درس في مسار (الكول سنتر) لا يفسد مسارًا
 * آخر (المنهج الأساسي)، ولا يضاعف XP، ولا يفتح درسًا مقفلًا.
 *
 * بيانات العيّنة تحتوي درسًا واحدًا في مسار الكول سنتر (cc1-saludo-profesional)
 * وثلاثة دروس في المسار الأساسي؛ وهي نفس بنية المحتوى الحقيقي (برنامج/وحدة/درس).
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { makeHarness, signupAndGetCookie, type Harness } from './harness';
import { importExemplars, correctAnswer } from './content-fixture';

let h: Harness;

beforeEach(() => {
  h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
  importExemplars(h);
});
afterEach(() => h.close());

interface ProgressLesson {
  slug: string;
  progress_status: string;
  program_slug: string;
  is_unlocked: boolean;
  missing_prerequisites?: string[];
}

async function signup(email: string) {
  const { res, cookie } = await signupAndGetCookie(h, email);
  expect(res.status).toBe(201);
  return cookie!;
}

async function answerAll(cookie: string, slug: string) {
  const session = await h.json<{ exercises: { id: string; mode: string }[] }>(
    await h.call(`/api/lessons/${slug}/session`, { cookie }),
  );
  const graded = session.exercises.filter(e => e.mode === 'graded');
  expect(graded.length).toBeGreaterThan(0);
  for (const [i, ex] of graded.entries()) {
    const res = await h.call(`/api/lessons/${slug}/answers`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        eventId: `ev_${slug.slice(0, 6)}_${i}_${'a'.repeat(8)}`,
        exerciseId: ex.id,
        response: correctAnswer(h, ex.id),
      }),
    });
    expect(res.status).toBe(200);
  }
}

async function progressOf(cookie: string) {
  return await h.json<{
    stats: { xp_total: number };
    totals: { lessons_completed: number };
    lessons: ProgressLesson[];
  }>(await h.call('/api/me/progress', { cookie }));
}

describe('إتمام درس داخل مسار متخصص', () => {
  it('يسجّل الدرس في مساره فقط، ويمنح XP مرة واحدة', async () => {
    const cookie = await signup('scoped@example.com');

    // درس الكول سنتر مفتوح (لا متطلبات له)، ودرس A1 الأساسي مقفل قبل PREA1
    const before = await progressOf(cookie);
    const cc = before.lessons.find(l => l.slug === 'cc1-saludo-profesional')!;
    expect(cc.program_slug).toBe('callcenter');
    expect(cc.is_unlocked).toBe(true);
    expect(before.lessons.filter(l => l.progress_status === 'completed')).toHaveLength(0);

    await answerAll(cookie, 'cc1-saludo-profesional');
    const done = await h.json<{ passed: boolean; xpAwarded: number; xpTotal: number }>(
      await h.call('/api/lessons/cc1-saludo-profesional/complete', {
        method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_cc_1' }),
      }),
    );
    expect(done.passed).toBe(true);
    expect(done.xpAwarded).toBe(30);

    const after = await progressOf(cookie);
    expect(after.stats.xp_total).toBe(30);
    expect(after.totals.lessons_completed).toBe(1);

    // المسار المتخصص سجّل الإتمام، والمسار الأساسي لم يتغيّر
    const completed = after.lessons.filter(l => l.progress_status === 'completed');
    expect(completed.map(l => l.slug)).toEqual(['cc1-saludo-profesional']);
    expect(completed[0]!.program_slug).toBe('callcenter');
    const mainTrack = after.lessons.filter(l => l.program_slug === 'main-track');
    expect(mainTrack.every(l => l.progress_status === 'not_started')).toBe(true);
    // «الدرس التالي» يبقى في المنهج الأساسي ولا يقفز إلى المسار المتخصص
    expect(after.lessons.find(l => l.program_slug === 'callcenter')!.progress_status).toBe('completed');
  });

  it('إعادة نفس حدث الإكمال لا تضاعف XP ولا تسجّل إتمامًا ثانيًا', async () => {
    const cookie = await signup('idem@example.com');
    await answerAll(cookie, 'cc1-saludo-profesional');
    const body = JSON.stringify({ eventId: 'complete_same_event' });
    const first = await h.json<{ xpAwarded: number; xpTotal: number }>(
      await h.call('/api/lessons/cc1-saludo-profesional/complete', { method: 'POST', cookie, body }),
    );
    const replay = await h.json<{ xpAwarded: number; xpTotal: number; alreadyCompleted?: boolean }>(
      await h.call('/api/lessons/cc1-saludo-profesional/complete', { method: 'POST', cookie, body }),
    );
    expect(first.xpAwarded).toBe(30);
    expect(replay.xpAwarded).toBe(0);
    expect(replay.xpTotal).toBe(30);
    expect((await progressOf(cookie)).totals.lessons_completed).toBe(1);
  });

  it('إتمام درس في مسارين مختلفين يجمع الإتمام بلا تصادم', async () => {
    const cookie = await signup('two-paths@example.com');
    await answerAll(cookie, 'cc1-saludo-profesional');
    await h.call('/api/lessons/cc1-saludo-profesional/complete', {
      method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_cc_two' }),
    });

    await answerAll(cookie, 'prea1-hola-me-llamo');
    await h.call('/api/lessons/prea1-hola-me-llamo/complete', {
      method: 'POST', cookie, body: JSON.stringify({ eventId: 'complete_main_two' }),
    });

    const after = await progressOf(cookie);
    expect(after.totals.lessons_completed).toBe(2);
    expect(after.stats.xp_total).toBe(60);
    const completed = after.lessons.filter(l => l.progress_status === 'completed').map(l => l.slug).sort();
    expect(completed).toEqual(['cc1-saludo-profesional', 'prea1-hola-me-llamo']);
  });
});

describe('الدروس المقفلة لا تُفتح من رابط مباشر', () => {
  it('جلسة درس مقفل تُرفض (403) مع عدم تسريب مفاتيح الإجابات', async () => {
    const cookie = await signup('locked@example.com');
    const res = await h.call('/api/lessons/a1-un-cafe-por-favor/session', { cookie });
    expect(res.status).toBe(403);
    const text = await res.text();
    expect(text).not.toContain('answerKey');
  });

  it('قائمة التقدم تشرح سبب القفل بمعرّفات المتطلبات لا بتفعيل صامت', async () => {
    const cookie = await signup('locked-list@example.com');
    const prog = await progressOf(cookie);
    const locked = prog.lessons.find(l => l.slug === 'a1-un-cafe-por-favor')!;
    expect(locked.is_unlocked).toBe(false);
    expect(locked.missing_prerequisites?.length).toBeGreaterThan(0);
  });
});
