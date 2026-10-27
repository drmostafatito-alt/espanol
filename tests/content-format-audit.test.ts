/**
 * تدقيق للقراءة فقط: تنسيقات الدروس والإجابات وروابط paths.json والمفردات.
 * لا يعدّل أي ملف. الفشل هنا فشل حقيقي يُسجَّل ولا يُخفَّف.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import searchIndex from '../src/shared/search-index.json';

const ROOT = process.cwd();
const DRAFTS = join(ROOT, 'content', 'drafts');
const LESSON_DIRS = ['a1', 'a2', 'b1', 'b2', 'c1', 'callcenter', 'travel'];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const readJson = (f: string): any => JSON.parse(readFileSync(f, 'utf8'));

interface LessonFile { name: string; lesson: any; }
const lessonFiles: LessonFile[] = LESSON_DIRS.flatMap(d =>
  walk(join(DRAFTS, d))
    .filter(f => basename(f).startsWith('lesson-') && f.endsWith('.json'))
    .map(f => ({ name: basename(f), lesson: readJson(f).lesson })),
);

const FORMAT_A = ['mastery', 'targetStructures', 'scenarios', 'unlock'];
const FORMAT_B = ['contentBlocks', 'pedagogy', 'cefrLevel'];
const formatOf = (l: any) =>
  FORMAT_B.some(k => k in l) ? 'B' : FORMAT_A.some(k => k in l) ? 'A' : 'unknown';

const SPEAK = /^speak_|roleplay|phone_call|summarize|write_/;

describe('تنسيقات الدروس', () => {
  it('كل ملف درس يحمل كائن lesson', () => {
    expect(lessonFiles.length).toBeGreaterThan(0);
    for (const f of lessonFiles) expect(f.lesson, f.name).toBeTruthy();
  });

  it('كل درس ينتمي إلى تنسيق معروف (A أو B)', () => {
    const unknown = lessonFiles.filter(f => formatOf(f.lesson) === 'unknown').map(f => f.name);
    expect(unknown).toEqual([]);
  });

  it('عدّ الدروس حسب التنسيق يطابق المجموع', () => {
    const counts = { A: 0, B: 0, unknown: 0 };
    for (const f of lessonFiles) counts[formatOf(f.lesson) as 'A' | 'B' | 'unknown']++;
    console.log('[format-audit] lessons by format:', JSON.stringify(counts), 'total:', lessonFiles.length);
    expect(counts.A + counts.B + counts.unknown).toBe(lessonFiles.length);
  });
});

describe('الإجابات والتفسيرات', () => {
  const choiceExercises = lessonFiles.flatMap(f =>
    (f.lesson.exercises ?? [])
      .filter((e: any) => Array.isArray(e.options) && e.options.length > 0 && !SPEAK.test(e.type))
      .map((e: any) => ({ file: f.name, ex: e })),
  );

  it('كل تمرين اختيار له إجابة صحيحة واحدة بالضبط', () => {
    const bad = choiceExercises
      .filter(({ ex }) => ex.options.filter((o: any) => o.isCorrect === true).length !== 1)
      .map(({ file, ex }) => `${file}#${ex.id}`);
    expect(bad).toEqual([]);
  });

  it('كل خيار خاطئ له تفسير distractorRationaleAr غير فارغ', () => {
    const bad: string[] = [];
    for (const { file, ex } of choiceExercises) {
      for (const o of ex.options) {
        if (o.isCorrect === false && !String(o.distractorRationaleAr ?? '').trim()) bad.push(`${file}#${ex.id}#${o.id}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('كل تمرين له شرح explanationAr', () => {
    const bad = lessonFiles.flatMap(f => (f.lesson.exercises ?? [])
      .filter((e: any) => !String(e.explanationAr ?? '').trim())
      .map((e: any) => `${f.name}#${e.id}`));
    expect(bad).toEqual([]);
  });
});

describe('روابط paths.json', () => {
  const programs = walk(DRAFTS)
    .filter(f => basename(f) === 'paths.json')
    .flatMap(f => readJson(f).programs ?? []);
  const lessonSlugs = new Set(lessonFiles.map(f => f.lesson.slug));
  const bundleSlugs = new Set<string>(
    walk(DRAFTS).filter(f => basename(f).startsWith('vocab-')).map(f => readJson(f).bundleSlug).filter(Boolean),
  );

  it('كل درس مُعلن في paths.json له ملف درس', () => {
    const missing = programs.flatMap((p: any) => (p.units ?? []).flatMap((u: any) =>
      (u.lessons ?? []).filter((s: string) => !lessonSlugs.has(s))));
    expect(missing).toEqual([]);
  });

  it('كل حزمة مفردات مُعلنة في الوحدات لها ملف vocab', () => {
    const missing = programs.flatMap((p: any) => (p.units ?? []).flatMap((u: any) =>
      (u.vocabularyBundles ?? []).filter((b: string) => !bundleSlugs.has(b))));
    expect(missing).toEqual([]);
  });
});

describe('المفردات: 8,509 مصدرًا ↔ 8,509 في الفهرس', () => {
  const sourceEntries: { normalized: string }[] = walk(DRAFTS)
    .filter(f => basename(f).startsWith('vocab-') && f.endsWith('.json'))
    .flatMap(f => readJson(f).entries ?? []);
  const indexWords = new Set((searchIndex as any).vocab.map((v: any) => v.e as string));
  const stripAccents = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  it('عدد المدخلات المصدرية 8,509', () => {
    expect(sourceEntries.length).toBe(8509);
  });

  it('فهرس البحث يحوي 8,509 مفردة (كل المدخلات بعد إصلاح المولّد)', () => {
    expect((searchIndex as any).vocab.length).toBe(8509);
  });

  it('الأزواج الخمسة موجودة بكلا عضويها في الفهرس', () => {
    const groups = new Map<string, string[]>();
    for (const e of sourceEntries) {
      const k = stripAccents(e.normalized);
      groups.set(k, [...(groups.get(k) ?? []), e.normalized]);
    }
    const pairs = [...groups.values()].filter(g => g.length > 1);
    expect(pairs.length).toBe(5);
    expect(pairs.map(g => g.filter(w => !indexWords.has(w)).length)).toEqual([0, 0, 0, 0, 0]);
  });
});
