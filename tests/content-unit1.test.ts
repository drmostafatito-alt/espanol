/**
 * وحدة A1 الأولى كاملة عبر الـAPI الحقيقي: 4 دروس متسلسلة، من أول تمرين إلى
 * بطاقات المراجعة. يستورد نفس ما يستورده أداة الاستيراد (content/drafts/a1).
 */
import { beforeAll, describe, expect, it } from 'vitest';
// @ts-ignore — وحدة .mjs مشتركة مع أدوات الاستيراد
import { buildContentPlan } from '../tools/lib/content-plan.mjs';
import { join } from 'node:path';
import { makeHarness, signupAndGetCookie, type Harness } from './harness';

const DIR = join(process.cwd(), 'content/drafts/a1');
const LESSONS = ['a1-origen-de-donde-eres', 'a1-saludos-formalidad', 'a1-presentar-a-otro', 'a1-nacionalidades'];

let h: Harness;
let cookie: string;
let plan: { statements: string[]; answers: Record<string, unknown>; counters: Record<string, number>; errors: string[] };

beforeAll(async () => {
  plan = buildContentPlan(DIR, { existingVersions: {} });
  h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ALLOW_PUBLIC_SIGNUP: 'true' });
  expect(plan.errors).toEqual([]);
  h.db.raw.exec(plan.statements.join(';\n') + ';');
  const { cookie: c } = await signupAndGetCookie(h);
  cookie = c!;
});

interface Session {
  lesson: { slug: string; titleAr: string; objectiveAr: string };
  exercises: { id: string; type: string; mode: string; options?: { id: string }[] }[];
  progress: { status: string };
}

async function playLesson(slug: string, opts: { wrongEvery?: number } = {}) {
  const session = await h.json<Session>(await h.call(`/api/lessons/${slug}/session`, { cookie }));
  expect(session.exercises.length).toBeGreaterThan(5);
  let i = 0;
  for (const ex of session.exercises) {
    if (ex.mode !== 'graded') continue;
    i++;
    const answer = plan.answers[ex.id];
    expect(answer, `لا إجابة مسجَّلة للتمرين ${ex.id}`).toBeTruthy();
    const send = opts.wrongEvery && i % opts.wrongEvery === 0 ? '__wrong__' : answer;
    const res = await h.call(`/api/lessons/${slug}/answers`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({ eventId: `ev_${ex.id}_${Math.random().toString(36).slice(2, 8)}`, exerciseId: ex.id, response: send }),
    });
    expect(res.status).toBe(200);
  }
  return h.json<{ passed: boolean; accuracy: number; reviewCardsCreated: number; xpAwarded: number }>(
    await h.call(`/api/lessons/${slug}/complete`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({ eventId: `done_${slug}_${Math.random().toString(36).slice(2, 8)}` }),
    }),
  );
}

describe('وحدة A1 الأولى: التدفق الكامل', () => {
  it('الاستيراد ينتج 4 دروس على الأقل و3 حزم مفردات', () => {
    expect(plan.counters.lessons).toBeGreaterThanOrEqual(4);
    expect(plan.counters.bundles).toBeGreaterThanOrEqual(3);
    expect(plan.counters.exercises).toBeGreaterThan(30);
  });

  it('الدرس الثاني مقفل قبل إتمام الأول', async () => {
    const res = await h.call(`/api/lessons/${LESSONS[1]}/session`, { cookie });
    expect(res.status).toBeGreaterThanOrEqual(400);
    const body = (await res.json()) as { error?: { code?: string } };
    expect(body.error?.code).toMatch(/LOCKED|FORBIDDEN|NOT_UNLOCKED/);
  });

  it('يمرّ الدروس الأربعة بالتسلسل وينجح في كل منها', async () => {
    for (const slug of LESSONS) {
      const result = await playLesson(slug);
      expect(result.passed, `لم يُنجح الدرس ${slug}`).toBe(true);
      expect(result.accuracy).toBeGreaterThanOrEqual(70);
    }
  });

  it('كل درس أنشأ بطاقات مراجعة لمفرداته الجديدة', async () => {
    const session = await h.json<{ cards: { id: string; kind: string }[]; session: { totalCards: number } }>(
      await h.call('/api/review/session?limit=200', { cookie }),
    );
    expect(session.session.totalCards).toBeGreaterThan(15);
    const kinds = new Set(session.cards.map(c => c.kind));
    expect(kinds.has('recognition')).toBe(true);
    // لا بطاقات استماع قبل وجود صوت معتمد
    expect(kinds.has('listening')).toBe(false);
  });

  it('التقدم على الخادم يعكس 4 دروس مكتملة', async () => {
    const progress = await h.json<{ lessons: { slug: string; progress_status: string }[] }>(
      await h.call('/api/me/progress', { cookie }),
    );
    const done = progress.lessons.filter(l => l.progress_status === 'completed');
    for (const slug of LESSONS) expect(done.some(l => l.slug === slug), slug).toBe(true);
  });
});
