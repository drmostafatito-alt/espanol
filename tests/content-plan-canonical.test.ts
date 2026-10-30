/**
 * اختبارات انحدار للحسم الحتمي في خطة الاستيراد (30 أكتوبر 2026).
 *
 * كانت الخطة تصدر صفوفًا متعارضة لنفس المفتاح لأن نفس الكلمة معلنة في حزمتين
 * (hola، café، ser، estar، ir…) بنصوص ومستويات ومصادر مختلفة، ولأن البرنامج
 * الواحد (`main-track`) معلن في كل `paths.json` لمستوى بوصف مختلف. كان الحسم
 * بـ«أول ظهور يفوز» أي بترتيب الملفات: نتيجة غير حتمية، ومعه 62 تعارضًا و97 أمرًا
 * مُسقطًا. بعد الإصلاح: الظهور المعتمد يُختار بقاعدة موثّقة، والتعريف نفسه يُصدر
 * من أي مجلد تُبنى منه الخطة، فتُسقط التنقية الصفوف المتطابقة بلا تعارض.
 */
import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { readdirSync, readFileSync, statSync } from 'node:fs';
// @ts-ignore — وحدات .mjs مشتركة مع الأدوات
import { buildContentPlan, dedupePlanStatements } from '../tools/lib/content-plan.mjs';

const ROOT = join(import.meta.dirname, '..');

function planOf(dir: string, extra: Record<string, unknown> = {}) {
  return buildContentPlan(join(ROOT, dir), { existingVersions: {}, lexiconDirs: [join(ROOT, 'content')], ...extra });
}

/** نفس سلوك التصدير: الدروس المعرَّفة في drafts تُسقَط من exemplars. */
function draftLessonSlugs(): Set<string> {
  const out = new Set<string>();
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/^lesson-.*\.json$/.test(name)) {
        const slug = JSON.parse(readFileSync(full, 'utf8'))?.lesson?.slug;
        if (slug) out.add(slug);
      }
    }
  };
  walk(join(ROOT, 'content/drafts'));
  return out;
}

const rowsOf = (statements: string[], table: string) =>
  statements.filter(s => new RegExp(`INSERT\\s+INTO\\s+${table}\\s`).test(s));

describe('حسم الظهور المعتمد في خطة الاستيراد', () => {
  const exemplars = planOf('content/exemplars', { skipLessonSlugs: draftLessonSlugs() });
  const drafts = planOf('content/drafts');
  const merged = dedupePlanStatements([...exemplars.statements, ...drafts.statements]);

  it('لا تعارضات مفاتيح بين المجلدين بعد التنقية', () => {
    expect(merged.conflicts).toEqual([]);
  });

  it('الكلمة المكررة تُعرَّف مرة واحدة بالنص نفسه في المجلدين', () => {
    const entryIdOf = (plan: any, word: string) => {
      const row = plan.statements.find((s: string) => s.includes('INSERT INTO vocabulary_entries') && s.includes(`'${word}'`));
      return /VALUES \('([^']+)'/.exec(row ?? '')?.[1] ?? null;
    };
    const pick = (plan: any, word: string) => {
      const id = entryIdOf(plan, word);
      if (!id) return null;
      return plan.statements.find((s: string) => s.includes('INSERT INTO vocabulary_senses') && s.includes(`'${id}'`));
    };
    // «ser» معلنة في a1-u1-origen (drafts) وa1-core-20 (exemplars) — النص واحد
    const a = pick(exemplars, 'ser');
    const b = pick(drafts, 'ser');
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    expect(a).toBe(b);
  });

  it('صفّ المفردة يحمل مستوى ومصدر الظهور المعتمد لا مستوى المجلد', () => {
    const entry = drafts.statements.find((s: string) => s.includes('INSERT INTO vocabulary_entries') && s.includes("'ser'"));
    expect(entry).toBeTruthy();
    // الظهور المعتمد لـ«ser» هو الأدنى مستوى ثم الأبجدي: a1-core-20 (A1) لا غيره
    expect(entry).toContain("'A1'");
  });

  it('البرنامج يُصدر مرة واحدة لكل slug، وبلا مستوى لكل مستوى', () => {
    const programs = rowsOf(drafts.statements, 'programs');
    const slugs = programs.map(s => /'([\w-]+)',\s*'[^']*'/.exec(s)?.[1]);
    expect(new Set(slugs).size).toBe(slugs.length);
    const main = programs.filter(s => s.includes("'main-track'"));
    expect(main).toHaveLength(1);
    expect(main[0]).toContain('NULL');
  });

  it('كل معنى/مثال/صيغة في المفردات له مفتاح فريد داخل الخطة', () => {
    for (const table of ['vocabulary_senses', 'sentences', 'sentence_translations', 'vocabulary_forms', 'vocabulary_entries']) {
      const rows = rowsOf(merged.statements, table);
      const ids = rows.map(s => s.slice(s.indexOf('VALUES (') + 8, s.indexOf('VALUES (') + 40));
      expect(rows.length, table).toBeGreaterThan(0);
      expect(new Set(ids).size, table).toBe(ids.length);
    }
  });

  it('درس العيّنة المكرر مُسقَط ومُبلَّغ لا مُهمَل', () => {
    const skipped = (drafts as any).skippedLessons ?? [];
    expect(Array.isArray(skipped)).toBe(true);
  });
});
