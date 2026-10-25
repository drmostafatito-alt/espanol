/**
 * انحدار اتساق الأقفال: ما تعرضه لوحة التقدم يجب أن يطابق ما يفرضه الخادم.
 *
 * الخلل السابق: `assertUnlocked` يفتح الدرس إذا كان للدرس السابق أي تقدم
 * (in_progress أو completed) ودقته ≥ minAccuracy، بينما `myProgress` كان يشترط
 * status === 'completed'. فإذا كان إتقان الدرس يشترط 80% وقاعدة الفتح 60%،
 * والمتعلم عنده 70%، يفتحه الخادم ويعرضه في اللوحة مقفلًا.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { makeHarness, signupAndGetCookie, type Harness } from './harness';
import { importExemplars } from './content-fixture';

let h: Harness;
afterEach(() => h?.close());

const PREREQ = 'prea1-hola-me-llamo';
const TARGET = 'a1-un-cafe-por-favor';

describe('اتساق حالة القفل بين اللوحة والخادم', () => {
  it('تقدم جزئي بدقة كافية يفتح الدرس في اللوحة كما يفتحه الخادم', async () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const { cookie } = await signupAndGetCookie(h);
    expect(cookie).toBeTruthy();

    const raw = h.db.raw;
    const pre = raw.prepare('SELECT id FROM lessons WHERE slug = ?').get(PREREQ) as { id: string } | undefined;
    const target = raw.prepare('SELECT id FROM lessons WHERE slug = ?').get(TARGET) as { id: string } | undefined;
    expect(pre?.id, `الدرس ${PREREQ} غير موجود في قاعدة الاختبار`).toBeTruthy();
    expect(target?.id, `الدرس ${TARGET} غير موجود في قاعدة الاختبار`).toBeTruthy();

    // قاعدة الفتح 60% (أخف من شرط الإتقان 80%) — الحالة التي كشفت التعارض
    raw.prepare('UPDATE lessons SET unlock_rule_json = ? WHERE id = ?').run(
      JSON.stringify({ type: 'prerequisite', requires: [PREREQ], minAccuracy: 60 }),
      target!.id,
    );
    const user = raw.prepare('SELECT id FROM users LIMIT 1').get() as { id: string };
    raw.prepare(
      `INSERT INTO user_lesson_progress (user_id, lesson_id, status, best_accuracy, attempts_count)
       VALUES (?, ?, 'in_progress', 70, 1)`,
    ).run(user.id, pre!.id);

    const prog = await h.json<{ lessons: { slug: string; is_unlocked: boolean; missing_prerequisites: string[] }[] }>(
      await h.call('/api/me/progress', { cookie }),
    );
    const item = prog.lessons.find(l => l.slug === TARGET);
    expect(item, 'الدرس الهدف غير ظاهر في لوحة التقدم').toBeDefined();
    expect(item!.missing_prerequisites).toEqual([]);
    expect(item!.is_unlocked).toBe(true);

    // الخادم نفسه يجب أن يسمح بفتح الدرس (نفس القاعدة) — وإلا فاللوحة تكذب
    const session = await h.call(`/api/lessons/${TARGET}/session`, { cookie });
    expect(session.status).toBe(200);
  });

  it('الدقة الأقل من الحد تُبقي الدرس مقفلًا في اللوحة والخادم', async () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const { cookie } = await signupAndGetCookie(h);

    const raw = h.db.raw;
    const pre = raw.prepare('SELECT id FROM lessons WHERE slug = ?').get(PREREQ) as { id: string };
    const target = raw.prepare('SELECT id FROM lessons WHERE slug = ?').get(TARGET) as { id: string };
    raw.prepare('UPDATE lessons SET unlock_rule_json = ? WHERE id = ?').run(
      JSON.stringify({ type: 'prerequisite', requires: [PREREQ], minAccuracy: 60 }),
      target.id,
    );
    const user = raw.prepare('SELECT id FROM users LIMIT 1').get() as { id: string };
    raw.prepare(
      `INSERT INTO user_lesson_progress (user_id, lesson_id, status, best_accuracy, attempts_count)
       VALUES (?, ?, 'in_progress', 40, 1)`,
    ).run(user.id, pre.id);

    const prog = await h.json<{ lessons: { slug: string; is_unlocked: boolean }[] }>(
      await h.call('/api/me/progress', { cookie }),
    );
    expect(prog.lessons.find(l => l.slug === TARGET)!.is_unlocked).toBe(false);
    expect((await h.call(`/api/lessons/${TARGET}/session`, { cookie })).status).toBe(403);
  });
});
