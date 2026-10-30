/**
 * سلامة المحتوى والمنهج — فحص بنيوي على ملفات المصدر نفسها (بلا قاعدة بيانات).
 *
 * لا يقيّم صحة الإسبانية ولا جودتها (ذلك عمل مراجعة بشرية)، بل يحمي البنية التي
 * يعتمد عليها الاستيراد وفتح الدروس: معرّفات فريدة، مراجع وحدات موجودة،
 * مستويات متسقة، عناوين عربية غير فارغة، وحزم مفردات بلا تكرار.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const CONTENT = join(process.cwd(), 'content');
const LEVELS = new Set(['PREA1', 'A1', 'A2', 'B1', 'B2', 'C1']);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.json')) out.push(full);
  }
  return out;
}

const FILES = walk(CONTENT);
const lessons = FILES.filter(f => basename(f).startsWith('lesson-')).map(f => {
  const doc = JSON.parse(readFileSync(f, 'utf8'));
  return { file: f, lesson: (doc.lesson ?? doc) as Record<string, any> };
});
const draftLessons = lessons.filter(l => l.file.includes(`${'/'}drafts${'/'}`));
const pathFiles = FILES.filter(f => basename(f) === 'paths.json');
const draftPathFiles = pathFiles.filter(f => f.includes(`${'/'}drafts${'/'}`));

interface UnitRef {
  program: string;
  unit: string;
  level: string | null;
}
const units: UnitRef[] = [];
const programs = new Set<string>();
for (const file of pathFiles) {
  const doc = JSON.parse(readFileSync(file, 'utf8')) as {
    programs?: { slug: string; levelCode?: string; units?: { slug: string; levelCode?: string | null }[] }[];
  };
  for (const program of doc.programs ?? []) {
    programs.add(program.slug);
    for (const unit of program.units ?? []) {
      units.push({ program: program.slug, unit: unit.slug, level: unit.levelCode ?? null });
    }
  }
}

describe('المنهج — المراجع والترتيب', () => {
  it('كل درس يشير إلى برنامج ووحدة معلنين في ملفات المسارات', () => {
    const known = new Set(units.map(u => `${u.program}/${u.unit}`));
    const broken = lessons
      .filter(l => !known.has(`${l.lesson.programSlug}/${l.lesson.unitSlug}`))
      .map(l => `${l.lesson.slug} → ${l.lesson.programSlug}/${l.lesson.unitSlug}`);
    expect(broken).toEqual([]);
  });

  it('كل متطلب سابق (requires) يشير إلى درس موجود', () => {
    const slugs = new Set(lessons.map(l => l.lesson.slug));
    const broken: string[] = [];
    for (const { lesson } of lessons) {
      const requires: unknown = lesson.unlock?.requires ?? [];
      if (!Array.isArray(requires)) continue;
      for (const req of requires) {
        if (typeof req !== 'string' || !slugs.has(req)) broken.push(`${lesson.slug} → ${String(req)}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('لا درس يشير إلى نفسه كمتطلب', () => {
    const self = lessons.filter(l => (l.lesson.unlock?.requires ?? []).includes(l.lesson.slug));
    expect(self.map(l => l.lesson.slug)).toEqual([]);
  });

  it('معرّفات الدروس فريدة داخل المسودات', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const { file, lesson } of draftLessons) {
      const prior = seen.get(lesson.slug);
      if (prior) dupes.push(`${lesson.slug} في ${prior} و${file}`);
      seen.set(lesson.slug, file);
    }
    expect(dupes).toEqual([]);
  });

  it('تداخل المسودات مع العيّنة محصور في الدروس المعروفة (إصدارات مختلفة لا دروس مكررة)', () => {
    const draftSlugs = new Set(draftLessons.map(l => l.lesson.slug));
    const overlap = lessons
      .filter(l => !l.file.includes(`${'/'}drafts${'/'}`) && draftSlugs.has(l.lesson.slug))
      .map(l => l.lesson.slug);
    // العيّنة تعرض نسخًا مبكرة من دروس أُضيفت لاحقًا للمسودات — مقصود ومُدار بالإصدارات
    expect(overlap).toEqual(['prea1-hola-me-llamo']);
  });

  it('كل درس مسودة مُعلَن مرة واحدة فقط في مسارات المسودات وفي وحدته الصحيحة', () => {
    // ترتيب الدروس يأتي من قائمة lessons في paths.json لا من حقل داخل ملف الدرس
    const listed = new Map<string, string>();
    const problems: string[] = [];
    for (const file of draftPathFiles) {
      const doc = JSON.parse(readFileSync(file, 'utf8')) as {
        programs?: { slug: string; units?: { slug: string; lessons?: string[] }[] }[];
      };
      for (const program of doc.programs ?? []) {
        for (const unit of program.units ?? []) {
          for (const slug of unit.lessons ?? []) {
            const key = `${program.slug}/${unit.slug}`;
            const prior = listed.get(slug);
            if (prior) problems.push(`${slug}: مذكور في ${prior} و${key}`);
            listed.set(slug, key);
          }
        }
      }
    }
    expect(problems).toEqual([]);

    const missing = draftLessons
      .filter(l => !listed.has(l.lesson.slug))
      .map(l => `${l.lesson.slug}: غير مذكور في أي وحدة`);
    expect(missing).toEqual([]);

    const wrongUnit = draftLessons
      .filter(l => listed.get(l.lesson.slug) && listed.get(l.lesson.slug) !== `${l.lesson.programSlug}/${l.lesson.unitSlug}`)
      .map(l => `${l.lesson.slug}: ${listed.get(l.lesson.slug)} ≠ ${l.lesson.programSlug}/${l.lesson.unitSlug}`);
    expect(wrongUnit).toEqual([]);
  });
});

describe('المنهج — المستويات والعناوين', () => {
  it('كل درس بمستوى معتمد', () => {
    const bad = lessons.filter(l => !LEVELS.has(l.lesson.level)).map(l => `${l.lesson.slug}: ${l.lesson.level}`);
    expect(bad).toEqual([]);
  });

  it('مستوى الدرس يطابق مستوى وحدته المعلن', () => {
    const unitLevel = new Map(units.map(u => [`${u.program}/${u.unit}`, u.level]));
    const mismatched: string[] = [];
    for (const { lesson } of lessons) {
      const declared = unitLevel.get(`${lesson.programSlug}/${lesson.unitSlug}`);
      if (declared && lesson.level !== declared) mismatched.push(`${lesson.slug}: ${lesson.level} ≠ ${declared}`);
    }
    expect(mismatched).toEqual([]);
  });

  it('عناوين الدروس العربية غير فارغة وفريدة داخل المسودات', () => {
    const titles = new Map<string, string>();
    const problems: string[] = [];
    for (const { lesson } of draftLessons) {
      const title = String(lesson.titleAr ?? '').trim();
      if (!title) problems.push(`${lesson.slug}: عنوان فارغ`);
      else if (!/[\u0600-\u06FF]/.test(title)) problems.push(`${lesson.slug}: عنوان بلا حروف عربية`);
      const prior = titles.get(title);
      if (prior && prior !== lesson.slug) problems.push(`${lesson.slug}: عنوان مكرر مع ${prior}`);
      titles.set(title, lesson.slug);
    }
    expect(problems).toEqual([]);
  });

  it('عناوين الوحدات والبرامج عربية وغير مكررة داخل البرنامج', () => {
    const problems: string[] = [];
    const seen = new Map<string, string>();
    for (const { lesson } of lessons) {
      for (const title of [lesson.unitTitleAr, lesson.programTitleAr]) {
        if (title && !/[\u0600-\u06FF]/.test(String(title))) problems.push(`${lesson.slug}: عنوان غير عربي (${title})`);
      }
      const key = `${lesson.programSlug}/${lesson.unitSlug}`;
      const unitTitle = String(lesson.unitTitleAr ?? '');
      const prior = seen.get(key);
      if (prior && prior !== unitTitle) problems.push(`${key}: عنوانان للوحدة (${prior} / ${unitTitle})`);
      seen.set(key, unitTitle);
    }
    expect(problems).toEqual([]);
  });

  it('لا درس مسودة منشور (الحالة تبقى draft قبل المراجعة البشرية)', () => {
    const published = draftLessons.filter(l => l.lesson.status && l.lesson.status !== 'draft');
    expect(published.map(l => `${l.lesson.slug}: ${l.lesson.status}`)).toEqual([]);
  });
});

describe('المفردات — الحزم والروابط', () => {
  const bundles = FILES.filter(f => basename(f).startsWith('vocab-')).map(f => {
    const doc = JSON.parse(readFileSync(f, 'utf8'));
    return { file: f, slug: doc.bundleSlug as string, title: String(doc.titleAr ?? ''), entries: doc.entries ?? [] };
  });

  it('معرّفات الحزم فريدة عبر كل مجلدات المحتوى', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const b of bundles) {
      const prior = seen.get(b.slug);
      if (prior) dupes.push(`${b.slug} في ${prior} و${b.file}`);
      seen.set(b.slug, b.file);
    }
    expect(dupes).toEqual([]);
  });

  it('كل حزمة لها عنوان عربي فريد', () => {
    const titles = new Map<string, string>();
    const problems: string[] = [];
    for (const b of bundles) {
      if (!b.title.trim()) problems.push(`${b.slug}: بلا titleAr`);
      else if (!/[\u0600-\u06FF]/.test(b.title)) problems.push(`${b.slug}: عنوان غير عربي`);
      const prior = titles.get(b.title);
      if (prior) problems.push(`${b.slug}: عنوان مكرر مع ${prior}`);
      titles.set(b.title, b.slug);
    }
    expect(problems).toEqual([]);
  });

  it('كل حزمة فيها مدخلات ولها كلمات مفتاحية مطابقة لمعرّفها', () => {
    const broken = bundles
      .filter(b => !Array.isArray(b.entries) || b.entries.length === 0)
      .map(b => b.slug);
    expect(broken).toEqual([]);
    for (const b of bundles) {
      for (const entry of b.entries as { headword?: string; normalized?: string }[]) {
        expect(String(entry.headword ?? '').trim().length).toBeGreaterThan(0);
        expect(String(entry.normalized ?? '').trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('لا حزمة تكرر الكلمة نفسها مرتين', () => {
    const dupes: string[] = [];
    for (const b of bundles) {
      const seen = new Set<string>();
      for (const entry of b.entries as { normalized?: string }[]) {
        const key = String(entry.normalized ?? '').toLowerCase();
        if (seen.has(key)) dupes.push(`${b.slug}: ${key}`);
        seen.add(key);
      }
    }
    expect(dupes).toEqual([]);
  });
});
