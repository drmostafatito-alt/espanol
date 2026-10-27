/**
 * بوّابات سلامة المحتوى قبل الاستيراد/النشر.
 * تُشغَّل على كل مجلدات المسودات الفعلية — وليست نسخة موازية من المدقق:
 * تستدعي validateCurriculum + buildContentPlan نفسها التي تستدعيها الأدوات.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
// @ts-ignore — وحدات .mjs مشتركة مع الأدوات
import { buildContentPlan } from '../tools/lib/content-plan.mjs';
// @ts-ignore
import { validateCurriculum } from '../tools/lib/curriculum.mjs';
import { gradingModeOf } from '../src/worker/lib/grading';

const ROOT = process.cwd();
const CONTENT_DIRS = [
  'content/drafts/a1',
  'content/drafts/a2',
  'content/drafts/b1',
  'content/drafts/b2',
  'content/drafts/c1',
  'content/drafts/core-vocab',
  'content/drafts/travel',
  'content/drafts/callcenter'
];
const AUDIO_TYPES = new Set(['listen_choose', 'dictation', 'identify_speaker', 'reconstruct_audio_sentence']);

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

describe('بوّابات المحتوى', () => {
  for (const dir of CONTENT_DIRS) {
    describe(basename(dir), () => {
      const plan = buildContentPlan(join(ROOT, dir), { existingVersions: {} }) as {
        errors: string[];
        counters: Record<string, number>;
        statements: string[];
      };
      const files = walk(join(ROOT, dir)).filter(f => f.endsWith('.json'));
      const lessons = files
        .filter(f => basename(f).startsWith('lesson-'))
        .map(f => JSON.parse(readFileSync(f, 'utf8')).lesson as Record<string, any>);

      it('خطة الاستيراد بلا أخطاء ولها محتوى فعلي', () => {
        expect(plan.errors).toEqual([]);
        expect(plan.statements.length).toBeGreaterThan(10);
      });

      it('كل معيار إتقان قابل للتحقيق من التمارين الموجودة', () => {
        const impossible: string[] = [];
        for (const L of lessons) {
          const exercises = (L.exercises ?? []) as { type: string }[];
          const gradedCount = exercises.filter(ex => gradingModeOf(ex.type) === 'graded').length;
          const criteria = (L.mastery ?? {}) as {
            minCorrectExercises?: number;
            requiredExerciseTypes?: string[];
          };
          if (gradedCount === 0) impossible.push(`${L.slug}: لا توجد تمارين مُصحَّحة`);
          if ((criteria.minCorrectExercises ?? 0) > gradedCount) {
            impossible.push(`${L.slug}: minCorrectExercises=${criteria.minCorrectExercises} > graded=${gradedCount}`);
          }
          const present = new Set(exercises.map(ex => ex.type));
          for (const type of criteria.requiredExerciseTypes ?? []) {
            if (!present.has(type)) impossible.push(`${L.slug}: نوع مطلوب غائب ${type}`);
          }
        }
        expect(impossible).toEqual([]);
      });

      it('لا شيء منشور، ولا سجل مراجعة بشرية مُفبرأ', () => {
        for (const L of lessons) {
          expect(L.review.status, L.slug).toBe('draft');
          expect(L.review.spanishReviewer, L.slug).toBeNull();
          expect(L.review.translationReviewer, L.slug).toBeNull();
          expect(L.review.reviewedAt, L.slug).toBeNull();
        }
        // لا تعليمة SQL تنشر درسًا أو تغيّر review_state إلى مراجَع
        const publishy = plan.statements.filter(
          s => /status\s*=\s*'published'|review_state\s*=\s*'reviewed'|'approved'/.test(s),
        );
        expect(publishy).toEqual([]);
      });

      it('كل تمرين له شرح عربي حقيقي وإجابة قابلة للتصحيح', () => {
        for (const L of lessons) {
          for (const ex of L.exercises ?? []) {
            expect(String(ex.explanationAr ?? '').length, `${L.slug}/${ex.id}`).toBeGreaterThanOrEqual(10);
            const key = ex.answerKey ?? {};
            const correct = (ex.options ?? []).filter((o: any) => o.isCorrect).map((o: any) => o.id);
            if (correct.length) {
              expect(new Set(correct), `${L.slug}/${ex.id}`).toEqual(new Set(key.correctOptionIds ?? correct));
            }
          }
        }
      });

      it('كل درس قابل للنجاح: معيار الإتقان لا يطلب أكثر من التمارين المُصحَّحة', () => {
        for (const L of lessons) {
          const graded = (L.exercises ?? []).filter((ex: any) => gradingModeOf(ex.type) === 'graded');
          const types = new Set((L.exercises ?? []).map((ex: any) => ex.type));
          const mastery = L.mastery ?? {};
          expect(mastery.minCorrectExercises ?? 0, `${L.slug}: minCorrectExercises`).toBeLessThanOrEqual(graded.length);
          for (const t of mastery.requiredExerciseTypes ?? []) {
            expect(types.has(t), `${L.slug}: requiredExerciseTypes يطلب ${t} غير الموجود`).toBe(true);
          }
          expect(graded.length, `${L.slug}: بلا تمارين مُصحَّحة إطلاقًا`).toBeGreaterThan(0);
        }
      });

      it('حالة الصوت معلنة: لا مفتاح صوتي بلا بادئة pending (لم يُنتج أي ملف)', () => {
        for (const L of lessons) {
          for (const sc of L.scenarios ?? []) {
            for (const line of sc.lines ?? []) {
              if (line.audioKey) expect(line.audioKey, L.slug).toMatch(/^pending\//);
            }
          }
          for (const ex of L.exercises ?? []) {
            if (ex.audioKey) expect(ex.audioKey, `${L.slug}/${ex.id}`).toMatch(/^pending\//);
            if (AUDIO_TYPES.has(ex.type)) expect(ex.speechEs, `${L.slug}/${ex.id}`).toBeTruthy();
          }
        }
      });
    });
  }

  it('الخريطة والمسودات متوافقة: 0 أخطاء، وكل درس مكتوب له ملف', () => {
    const map = JSON.parse(readFileSync(join(ROOT, 'content/curriculum/curriculum-map.v1.json'), 'utf8'));
    const bundles = walk(join(ROOT, 'content/drafts'))
      .filter(f => basename(f).startsWith('vocab-'))
      .map(f => ({ slug: JSON.parse(readFileSync(f, 'utf8')).bundleSlug, entries: JSON.parse(readFileSync(f, 'utf8')).entries }));
    const lessonFiles = walk(join(ROOT, 'content/drafts'))
      .filter(f => basename(f).startsWith('lesson-'))
      .map(f => ({ slug: JSON.parse(readFileSync(f, 'utf8')).lesson.slug }));
    const res = validateCurriculum(map, { bundles, lessonFiles }) as {
      errors: { code: string; message: string }[];
      stats: Record<string, unknown>;
    };
    expect(res.errors).toEqual([]);
    expect(res.stats.authoredLessons).toBeGreaterThanOrEqual(16);
  });

  it('صرامة التشكيل (strictAccent) مقصورة على أزواج دنيا مثبتة بدليل محتوى', () => {
    // التصحيح الافتراضي متسامح مع النبرة. strictAccent يُسمح به فقط حيث
    // تكون الإجابة المقبولة عضوًا في زوج دنيا (si/sí…) والتعليم يثبت أن
    // التمييز هو هدف السؤال. أي إضافة جديدة هنا تتطلب دليلًا لغويًا وتحديثًا
    // مقصودًا لهذه القائمة — لا صرامة صامتة جديدة.
    const PAIR_MEMBERS = new Set([
      'si', 'sí', 'tu', 'tú', 'el', 'él', 'mi', 'mí', 'se', 'sé', 'te', 'té',
      'de', 'dé', 'mas', 'más', 'solo', 'sólo', 'aun', 'aún',
      'papa', 'papá', 'pena', 'peña', 'sonar', 'soñar', 'oir', 'oír',
      'modem', 'módem', 'ano', 'año',
    ]);
    const strictIds: string[] = [];
    for (const dir of CONTENT_DIRS) {
      for (const f of walk(join(ROOT, dir)).filter(x => basename(x).startsWith('lesson-'))) {
        const L = JSON.parse(readFileSync(f, 'utf8')).lesson as Record<string, any>;
        for (const ex of L.exercises ?? []) {
          if (ex.answerKey?.strictAccent !== true) continue;
          strictIds.push(ex.id);
          const words = (ex.answerKey.accepted ?? []).flatMap((a: string) =>
            String(a).toLowerCase().replace(/[.,;:!?¡¿"«»']/g, ' ').split(/\s+/));
          expect(words.some((w: string) => PAIR_MEMBERS.has(w)), `${L.slug}/${ex.id}: strictAccent بلا عضو زوج دنيا`).toBe(true);
        }
      }
    }
    // القائمة المثبتة حاليًا: ex-b1-ind-2 فقط (si الشرطية، التعليم والشرح
    // يصرّحان «بدون نبرة»). أي strictAccent جديد يجب أن يُضاف هنا بمراجعة لغوية.
    expect(strictIds.sort()).toEqual(['ex-b1-ind-2']);
  });

  it('لا ادعاء تغطية CEFR كاملة من أسماء المستويات', () => {
    const map = JSON.parse(readFileSync(join(ROOT, 'content/curriculum/curriculum-map.v1.json'), 'utf8'));
    const covered = map.coverage ?? null;
    expect(covered).toBeTruthy();
    expect(covered.claimFullCefr).toBe(false);
    expect(String(covered.noteAr).length).toBeGreaterThan(20);
    // الأرقام المعلنة في التقرير يجب أن تطابق مجموع المسارات فعلًا
    const sum = Object.values(covered.byTrack as Record<string, { plannedLessons: number }>).reduce(
      (a, t) => a + t.plannedLessons, 0);
    expect(covered.totals.plannedLessonsAllTracks).toBe(sum);
  });
});
