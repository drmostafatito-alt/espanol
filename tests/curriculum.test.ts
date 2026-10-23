/**
 * اختبارات مدقّق المنهج — إيجابية وسلبية.
 * السلبية مهمة: مدقّق لا يفشل أبدًا لا يُثبت شيئًا.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
// @ts-ignore — وحدة .mjs مشتركة مع أدوات CLI
import { buildPrerequisites, findCycles, validateCurriculum } from '../tools/lib/curriculum.mjs';

const ROOT = process.cwd();
const map = JSON.parse(readFileSync(join(ROOT, 'content/curriculum/curriculum-map.v1.json'), 'utf8'));

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const bundles = walk(join(ROOT, 'content/drafts'))
  .filter(f => /vocab-.*\.json$/.test(f))
  .map(f => {
    const b = JSON.parse(readFileSync(f, 'utf8'));
    return { slug: b.bundleSlug, entries: b.entries ?? [] };
  });

const lessonFiles = walk(join(ROOT, 'content/drafts'))
  .filter(f => /lesson-.*\.json$/.test(f))
  .map(f => {
    const l = JSON.parse(readFileSync(f, 'utf8')).lesson;
    return { slug: l.slug, unlock: l.unlock };
  });

const base = { bundles, lessonFiles };

describe('خريطة المنهج', () => {
  it('الخريطة الفعلية تمرّ بلا أخطاء', () => {
    const res = validateCurriculum(map, base);
    expect(res.errors, JSON.stringify(res.errors, null, 2)).toEqual([]);
  });

  it('كل درس مكتوب له هدف تعليمي حقيقي لا عنوان مكرر', () => {
    const res = validateCurriculum(map, base);
    const lessons = [...res.prereq.keys()].map(k => k.split('/')[1]);
    expect(new Set(lessons).size).toBe(lessons.length);
    // 52 = عدد الدروس التي لها أهداف تعليمية مكتوبة (وليست مجرد أسماء مستويات)
    expect(res.stats.lessonsWithObjectives).toBeGreaterThanOrEqual(52);
    // عدد الدروس الموسومة «مكتوب» أقل بكثير — وهذا هو الصدق المطلوب
    expect(res.stats.authoredLessons).toBeLessThan(res.stats.lessonsWithObjectives);
  });

  it('المتطلبات السابقة متسلسلة بلا حلقات', () => {
    const prereq = buildPrerequisites(map);
    const cycles = findCycles(new Set(prereq.keys()), (n: string) => prereq.get(n) ?? []);
    expect(cycles).toEqual([]);
    // كل درس يحتاج الدرس السابق فقط، وأول درس في المسار لا يحتاج شيئًا
    const first = [...prereq.keys()][0]!;
    expect(prereq.get(first)).toEqual([]);
  });

  it('لا يُسمح بادعاء «أهم 1000 كلمة» في وصف تعليمي', () => {
    const bad = structuredClone(map);
    bad.tracks[1].levels[0].titleAr = 'أهم 1000 كلمة في الإسبانية';
    const res = validateCurriculum(bad, base);
    expect(res.errors.some((e: { code: string }) => e.code === 'UNLICENSED_FREQUENCY_CLAIM')).toBe(true);
  });

  it('يكشف المتطلب المكسور والحلقة', () => {
    const bad = structuredClone(map);
    const unit = bad.tracks[0].levels[0].units[0];
    unit.lessons[0].requires = [unit.lessons[2].slug];
    unit.lessons[1].requires = [unit.lessons[0].slug];
    unit.lessons[2].requires = [unit.lessons[1].slug];
    const res = validateCurriculum(bad, { bundles, lessonFiles: [] });
    expect(res.errors.some((e: { code: string }) => e.code === 'PREREQ_CYCLE')).toBe(true);
  });

  it('يكشف تكرار الدرس في وحدتين وتكرار الكلمة بين حزمتين', () => {
    const bad = structuredClone(map);
    const lvl = bad.tracks[0].levels[1];
    lvl.units[1].lessons[0].slug = lvl.units[0].lessons[0].slug;
    const dupBundles = [
      { slug: 'x', entries: [{ normalized: 'hola', senses: [{ meaningArFusha: 'تحية عند اللقاء' }] }] },
      { slug: 'y', entries: [{ normalized: 'hola', senses: [{ meaningArFusha: 'وداع' }] }] },
    ];
    const res = validateCurriculum(bad, { bundles: dupBundles, lessonFiles: [] });
    expect(res.errors.some((e: { code: string }) => e.code === 'DUP_LESSON')).toBe(true);
    expect(res.errors.some((e: { code: string }) => e.code === 'DUP_VOCAB_ACROSS_BUNDLES')).toBe(true);
  });

  it('الكلمة المشتركة بنفس الشرح تُنبَّه لا تُرفض (إعادة استخدام لا تكرار)', () => {
    const shared = [
      { slug: 'p', entries: [{ normalized: 'hola', senses: [{ meaningArFusha: 'تحية عند اللقاء' }] }] },
      { slug: 'q', entries: [{ normalized: 'hola', senses: [{ meaningArFusha: 'تحية عند اللقاء' }] }] },
    ];
    const res = validateCurriculum(map, { bundles: shared, lessonFiles: [] });
    expect(res.errors.some((e: { code: string }) => e.code === 'DUP_VOCAB_ACROSS_BUNDLES')).toBe(false);
    expect(res.warnings.some((w: { code: string }) => w.code === 'SHARED_VOCAB_REUSED')).toBe(true);
  });

  it('يكشف الوحدة بلا هدف والحزمة المفقودة', () => {
    const bad = structuredClone(map);
    bad.tracks[0].levels[1].units[0].objectiveAr = '';
    bad.tracks[0].levels[1].units[1].lessons[0].vocabPack = 'غير-موجودة';
    const res = validateCurriculum(bad, { bundles, lessonFiles: [] });
    expect(res.errors.some((e: { code: string }) => e.code === 'UNIT_NO_OBJECTIVE')).toBe(true);
    expect(res.errors.some((e: { code: string }) => e.code === 'MISSING_VOCAB_PACK')).toBe(true);
  });
});
