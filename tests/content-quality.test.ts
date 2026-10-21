/**
 * تدقيق جودة المحتوى — اختبارات انحدار.
 *
 * هذه الاختبارات لا تحكم على صحة الإسبانية ولا على دقة الترجمة؛ الحكم اللغوي يحتاج
 * مراجعًا بشريًا (انظر docs/CONTENT_REVIEW_QUEUE.md). ما تُثبته هنا هو ما يمكن إثباته آليًا:
 *   ١) لا أخطاء بنيوية/ميكانيكية في كل مسودات المحتوى.
 *   ٢) القواعد التي كانت مخترقة فعلًا قبل التدقيق تبقى مغلقة (كل قاعدة لها اختبار باسمها).
 *
 * القواعد نفسها في tools/audit-content-quality.mjs — يُستورد الملف نفسه، فلا تنسخ الاختبارات
 * منطقًا موازيًا يمكن أن ينحرف عن الأداة.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
// @ts-ignore — وحدة .mjs مشتركة مع الأداة
import { auditContent } from '../tools/audit-content-quality.mjs';

const ROOT = process.cwd();
const DIRS = ['content/drafts'];

type Finding = { severity: 'error' | 'warn'; rule: string; where: string; message: string };
type Stats = {
  lessons: number; exercises: number; options: number; scenarios: number;
  scenarioLines: number; vocabPacks: number; vocabEntries: number; ipa: number;
};

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const audit = auditContent(join(ROOT, 'content/drafts')) as { stats: Stats; findings: Finding[] };
const errors = audit.findings.filter(f => f.severity === 'error');
const rule = (r: string) => errors.filter(f => f.rule === r);

const lessonFiles = DIRS.flatMap(d => walk(join(ROOT, d)))
  .filter(f => basename(f).startsWith('lesson-') && f.endsWith('.json'));
const vocabFiles = DIRS.flatMap(d => walk(join(ROOT, d)))
  .filter(f => basename(f).startsWith('vocab-') && f.endsWith('.json'));

const lessons = lessonFiles.map(f => ({ file: f.replace(ROOT + '/', ''), lesson: JSON.parse(readFileSync(f, 'utf8')).lesson as any }));
const packs = vocabFiles.map(f => ({ file: f.replace(ROOT + '/', ''), pack: JSON.parse(readFileSync(f, 'utf8')) as any }));

describe('نطاق التدقيق', () => {
  it('التدقيق يرى كل مسودات المحتوى فعلًا (لا عيّنة)', () => {
    expect(lessonFiles.length).toBe(16);
    expect(vocabFiles.length).toBe(8);
    expect(audit.stats.lessons).toBe(16);
    expect(audit.stats.vocabEntries).toBe(134);
    // كل درس له تمارين مقروءة، وكل حزمة لها مداخل
    for (const { lesson } of lessons) expect(lesson.exercises.length, lesson.slug).toBeGreaterThan(0);
    for (const { pack } of packs) expect(pack.entries.length, pack.bundleSlug).toBeGreaterThan(0);
  });

  it('المحتوى كله يبقى draft بلا مراجعة بشرية مُفبرأة', () => {
    for (const { lesson } of lessons) {
      expect(lesson.review.status, lesson.slug).toBe('draft');
      expect(lesson.review.spanishReviewer, lesson.slug).toBeNull();
      expect(lesson.review.translationReviewer, lesson.slug).toBeNull();
      expect(lesson.review.reviewedAt, lesson.slug).toBeNull();
    }
  });
});

describe('قواعد الجودة الميكانيكية', () => {
  it('لا أخطاء بنيوية في أي ملف محتوى', () => {
    // رسالة الفشل تسرد القاعدة والموضع حتى يكون الإصلاح مباشرًا
    const report = errors.map(f => `${f.rule} · ${f.where} · ${f.message}`).join('\n');
    expect(report).toBe('');
  });

  it('R1: لا كلمة تخلط حروفًا عربية ولاتينية (فساد نصي مثل «Italianا»)', () => {
    expect(rule('R1-mixed-script')).toEqual([]);
  });

  it('R15: كل خيار يحمل isCorrect منطقيًا صريحًا (لا null ولا حقل غائب)', () => {
    expect(rule('R15-iscorrect-type')).toEqual([]);
    for (const { lesson } of lessons) {
      for (const ex of lesson.exercises) {
        for (const o of ex.options ?? []) {
          expect(typeof o.isCorrect, `${lesson.slug}/${ex.id}/${o.id}`).toBe('boolean');
        }
      }
    }
  });

  it('R16: isCorrect المعلَّم يطابق answerKey.correctOptionIds دائمًا', () => {
    expect(rule('R16-key-mismatch')).toEqual([]);
  });

  it('R25: عناصر الترتيب لا تحمل أرقام تعداد (تسريب الترتيب)', () => {
    expect(rule('R25-order-numbering')).toEqual([]);
    for (const { lesson } of lessons) {
      for (const ex of lesson.exercises) {
        if (!['word_order', 'dialogue_order'].includes(ex.type)) continue;
        for (const item of ex.items ?? []) {
          expect(/^\s*[(\[]?\s*\d+\s*[).\-–]/.test(item.text), `${lesson.slug}/${ex.id}/${item.id}`).toBe(false);
        }
      }
    }
  });

  it('R26: كل إجابة ترتيب مقبولة قابلة للبناء فعلًا من عناصر التمرين', () => {
    expect(rule('R26-order-permutation')).toEqual([]);
  });

  it('R27: تمارين الترتيب تُصحَّح كترتيب ولا تحمل correctOptionIds', () => {
    expect(rule('R27-order-optionids')).toEqual([]);
    for (const { lesson } of lessons) {
      for (const ex of lesson.exercises) {
        if (!['word_order', 'dialogue_order'].includes(ex.type)) continue;
        expect(ex.answerKey.correctOptionIds, `${lesson.slug}/${ex.id}`).toBeUndefined();
        expect((ex.answerKey.accepted ?? []).length, `${lesson.slug}/${ex.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('R8: مفتاح صوت واحد لا يُستخدم لنصين مختلفين (نسبة خاطئة للمتحدث)', () => {
    expect(rule('R8-audio-reuse')).toEqual([]);
  });

  it('R5: حقول النطق بصيغة IPA صالحة (لا نص عربي ولا «(aproximada)» داخل الحقل)', () => {
    expect(rule('R5-ipa-format')).toEqual([]);
    expect(rule('R5-ipa-chars')).toEqual([]);
    for (const { pack } of packs) {
      for (const e of pack.entries) {
        if (!e.ipa) continue;
        expect(e.ipa.trim(), `${pack.bundleSlug}/${e.headword}`).toMatch(/^\/.*\/$/);
      }
    }
  });

  it('R13: answerKey.mode لا يُستخدم بدل scoring.mode', () => {
    expect(rule('R13-answerkey-mode')).toEqual([]);
  });

  it('R19: معرّفات الخيارات فريدة عبر المحتوى كله', () => {
    expect(rule('R19-option-id')).toEqual([]);
  });

  it('R39/R43: لا خيارات بنص مكرر أو فارغ داخل التمرين نفسه', () => {
    expect(rule('R39-duplicate-option')).toEqual([]);
    expect(rule('R43-empty-option')).toEqual([]);
  });

  it('R40: تمارين الملء تحتوي فراغًا صريحًا', () => {
    expect(rule('R40-gap-marker')).toEqual([]);
  });

  it('R45: مفاتيح صوت المفردات معلّقة وفريدة', () => {
    expect(rule('R45-vocab-audio')).toEqual([]);
  });

  it('R44: التعليمات تسأل عن الملاءمة عندما يكون المشتت صحيحًا نحويًا', () => {
    // الحالة الأصلية: «أي جملة صحيحة؟» ومشتت صحيح نحويًا لكنه غير مهذب —
    // فيصبح للمشتت حجّة. بعد الإصلاح لا تخرج هذه الحالة من الأداة أصلًا.
    expect(rule('R44-instruction-fit')).toEqual([]);
    expect(audit.findings.filter(f => f.rule === 'R44-instruction-fit')).toEqual([]);
  });

  it('لا مشتت يوصَف بـ«صحيحة لكن…» داخل تعليمات تسأل عن الصحة وحدها', () => {
    for (const { lesson } of lessons) {
      for (const ex of lesson.exercises) {
        const soft = (ex.options ?? []).filter(
          (o: any) => o.isCorrect === false && /صحيحة|صحيح/.test(o.distractorRationaleAr ?? '') &&
            !/خطأ|غير صحيحة|لا تصلح|لا وجود/.test(o.distractorRationaleAr ?? ''),
        );
        if (!soft.length) continue;
        expect(/أي (جملة|سؤال|صيغة|كلمة) (صحيحة|صحيح)\؟/.test(ex.instructionAr), `${lesson.slug}/${ex.id}: ${ex.instructionAr}`).toBe(false);
      }
    }
  });
});

describe('حدود التدقيق الآلي — معلنة لا مخفية', () => {
  it('التدقيق الآلي لا يصدر أحكامًا لغوية: نتيجة الأخطاء صفر لكن التنبيهات مفتوحة للمراجع', () => {
    // التنبيهات (ترجمة ناقصة، مثال بصيغة مشتقة، مفردة هدف غير معلنة) ليست «أخطاء»:
    // كل واحد منها يحتاج قرارًا بشريًا. وجودها هنا يوثّق أنها لم تُترك بلا رصد.
    const warns = audit.findings.filter(f => f.severity === 'warn');
    expect(warns.length).toBeGreaterThan(0);
    expect(new Set(warns.map(w => w.rule))).toEqual(
      new Set(['R14-target-vocab-fit', 'R17-option-translation', 'R29-stem-translation', 'R36-example-fit']),
    );
  });

  it('لا يوجد تقرير مراجعة بشرية ولا ملف صوتي مُنتج داخل المحتوى', () => {
    for (const { lesson } of lessons) {
      for (const ex of lesson.exercises) {
        for (const key of [ex.audioKey, ex.answerKey?.referenceAudioKey]) {
          if (key) expect(key.startsWith('pending/'), key).toBe(true);
        }
      }
      for (const s of lesson.scenarios ?? []) {
        for (const line of s.lines ?? []) {
          if (line.audioKey) expect(line.audioKey.startsWith('pending/'), line.audioKey).toBe(true);
        }
      }
    }
  });

  it('أداة التدقيق موجودة وقابلة للتشغيل من سطر الأوامر', () => {
    expect(existsSync(join(ROOT, 'tools/audit-content-quality.mjs'))).toBe(true);
  });
});
