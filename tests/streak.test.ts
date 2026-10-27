import { describe, expect, it } from 'vitest';
import { computeStreaks } from '../src/worker/lib/streak';
import { makeHarness, signupAndGetCookie } from './harness';

const TODAY = '2026-10-27';

describe('computeStreaks', () => {
  it('لا نشاط: صفر/صفر', () => {
    expect(computeStreaks([], TODAY)).toEqual({ current: 0, longest: 0 });
  });

  it('نشاط اليوم فقط: سلسلة 1', () => {
    expect(computeStreaks(['2026-10-27'], TODAY)).toEqual({ current: 1, longest: 1 });
  });

  it('أمس واليوم وقبله: سلسلة 3', () => {
    expect(computeStreaks(['2026-10-25', '2026-10-26', '2026-10-27'], TODAY)).toEqual({ current: 3, longest: 3 });
  });

  it('فجوة أمس: الحالية 1 فقط رغم نشاط أقدم', () => {
    expect(computeStreaks(['2026-10-24', '2026-10-25', '2026-10-27'], TODAY)).toEqual({ current: 1, longest: 2 });
  });

  it('آخر نشاط قبل أمس: الحالية صفر والأطول محفوظة', () => {
    expect(computeStreaks(['2026-10-23', '2026-10-24', '2026-10-25'], TODAY)).toEqual({ current: 0, longest: 3 });
  });

  it('نشاط أمس فقط دون اليوم: السلسلة ما زالت حية', () => {
    expect(computeStreaks(['2026-10-26'], TODAY)).toEqual({ current: 1, longest: 1 });
  });

  it('تكرار التواريخ وقيم فاسدة لا تكسر الحساب', () => {
    expect(computeStreaks(['2026-10-27', '2026-10-27', 'garbage', '2026-10-26'], TODAY)).toEqual({ current: 2, longest: 2 });
  });
});

describe('streak عبر /api/me/progress', () => {
  it('يُحسب من سجل النشاط الفعلي ويُحدَّث في user_stats', async () => {
    const h = makeHarness();
    try {
      const { cookie } = await signupAndGetCookie(h);
      const userId = (h.db.raw.prepare('SELECT id FROM users').get() as { id: string }).id;
      // نشاط قبل 3 أيام ويومين متتاليين ينتهيان أمس (بتوقيت UTC اليوم)
      const day = (offset: number) => {
        const d = new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
        return `${d}T10:00:00.000Z`;
      };
      const ins = h.db.raw.prepare(
        `INSERT INTO learning_events (id, user_id, type, payload_json, content_version_id, idempotency_key, occurred_at)
         VALUES (?, ?, 'lesson_completed', '{}', NULL, ?, ?)`,
      );
      ins.run('ev-old', userId, 'k-old', day(-4));
      ins.run('ev-a', userId, 'k-a', day(-2));
      ins.run('ev-b', userId, 'k-b', day(-1));

      const prog = await h.json<{ stats: { streak_current: number; streak_longest: number } }>(
        await h.call('/api/me/progress', { cookie }),
      );
      expect(prog.stats.streak_current).toBe(2);
      expect(prog.stats.streak_longest).toBe(2);

      const row = h.db.raw.prepare('SELECT streak_current, streak_longest FROM user_stats WHERE user_id = ?').get(userId) as {
        streak_current: number;
        streak_longest: number;
      };
      expect(row.streak_current).toBe(2);
      expect(row.streak_longest).toBe(2);
    } finally {
      h.close();
    }
  });

  it('مستخدم جديد بلا نشاط: صفر', async () => {
    const h = makeHarness();
    try {
      const { cookie } = await signupAndGetCookie(h);
      const prog = await h.json<{ stats: { streak_current: number; streak_longest: number } }>(
        await h.call('/api/me/progress', { cookie }),
      );
      expect(prog.stats.streak_current).toBe(0);
      expect(prog.stats.streak_longest).toBe(0);
    } finally {
      h.close();
    }
  });
});
