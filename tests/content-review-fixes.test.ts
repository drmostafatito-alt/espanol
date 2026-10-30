/**
 * اختبارات انحدار لتصحيحات جولة 29 أكتوبر 2026 (الدفعات B12/B13 + إصلاحات التمارين).
 *
 * تحرس أربعة أشياء كانت معطوبة فعليًا:
 *  1) مفتاح الإجابة مكتوب داخل نصّ الخيار العربي («(الصواب)») — 276 حقلًا في 103 دروس.
 *  2) 155 مدخلًا بمثال قالبي يجمع أداة مؤنثة بصفة مذكرة («La bala es muy conocido»).
 *  3) ex-a2-tel-5: خيار «صحيح» (llamada) لا يرد في التسجيل ولا يجيب عن التعليمة.
 *  4) قوائم الانتظار القابلة للاستئناف للأمثلة القالبية الباقية.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
// @ts-ignore — وحدات .mjs مشتركة مع الأدوات (النمط المتبع في بقية الاختبارات)
import { loadInventory, isTemplateExample, templateSkeleton } from '../tools/lib/content-review.mjs';
// @ts-ignore — وحدة .mjs بلا تعريفات أنواع، مثل السطر أعلاه
import { articleGenderProblem } from '../tools/lib/article-gender.mjs';

const ROOT = join(import.meta.dirname, '..');

function lessonFiles(dir = join(ROOT, 'content/drafts'), out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) lessonFiles(full, out);
    else if (/^lesson-.*\.json$/.test(name)) out.push(full);
  }
  return out;
}

const lessons = lessonFiles().map(file => JSON.parse(readFileSync(file, 'utf8')).lesson);
const inventory = loadInventory(ROOT);
const vocabEntries = inventory.vocab.map((item: any) => ({
  id: item.id as string,
  entry: item.entry as any,
}));

describe('answer-key leak in option text', () => {
  it('لا يحمل أي خيار نص «(الصواب)» في الحقل العربي', () => {
    const leaks: string[] = [];
    for (const lesson of lessons) {
      for (const ex of lesson.exercises ?? []) {
        for (const opt of ex.options ?? []) {
          if (String(opt.textAr ?? '').includes('الصواب')) leaks.push(`${lesson.slug}#${ex.id}/${opt.id}`);
        }
      }
    }
    expect(leaks).toEqual([]);
  });

  it('لا يزال الشرح التربوي يستخدم «الصواب» حيث يكون مشروعًا', () => {
    const withPedagogy = lessons.filter(lesson =>
      (lesson.pedagogy?.commonMistakesAr ?? []).some((t: string) => t.includes('الصواب')),
    );
    // العبارة التربوية («الخطأ: … والصواب: …») مشروعة في الشرح، وليست تسريبًا.
    expect(withPedagogy.length).toBeGreaterThan(0);
  });
});

describe('template examples with gender conflict', () => {
  it('لا يوجد مثال «La … es muy conocido / resulta muy práctico» في أي مدخل', () => {
    const broken = vocabEntries
      .filter(({ entry }: any) => {
        const example = entry.senses?.[0]?.exampleEs ?? '';
        return /^la[s]? ~ .*\b(conocido|practico)\b/.test(templateSkeleton(entry.headword, example));
      })
      .map(({ id }: any) => id);
    expect(broken).toEqual([]);
  });

  it('كل مثال معاد كتابته يحترم مطابقة الصفة مع الاسم المؤنث', () => {
    const rewritten = [
      'bandera', 'bala', 'banda', 'botica', 'furgoneta', 'arpillera',
    ];
    for (const headword of rewritten) {
      const item = vocabEntries.find(({ entry }: any) => entry.headword === headword);
      expect(item, `المدخل ${headword} موجود`).toBeTruthy();
      const example: string = (item as any).entry.senses[0].exampleEs;
      expect(isTemplateExample(headword, example)).toBe(false);
      expect((item as any).entry.senses[0].exampleAr.length).toBeGreaterThan(5);
    }
  });
});

describe('ex-a2-tel-5', () => {
  const lesson = lessons.find(l => l.slug === 'a2-llamadas-telefonicas');
  const exercise = lesson?.exercises.find((ex: any) => ex.id === 'ex-a2-tel-5');

  it('الخيار الصحيح يرد نصًّا في السؤال المسموع ويجيب عن التعليمة', () => {
    expect(exercise).toBeTruthy();
    const correct = exercise.options.filter((o: any) => o.isCorrect);
    expect(correct).toHaveLength(1);
    expect(exercise.stemEs).toContain(correct[0].text);
    expect(exercise.answerKey.correctOptionIds).toEqual([correct[0].id]);
  });

  it('المعرّفات القديمة محفوظة وكل خيار له ترجمة عربية', () => {
    expect(exercise.options.map((o: any) => o.id)).toEqual([
      'ex-a2-tel-5_a', 'ex-a2-tel-5_b', 'ex-a2-tel-5_c',
    ]);
    for (const opt of exercise.options) expect(String(opt.textAr ?? '').length).toBeGreaterThan(2);
  });

  it('التعليمة والشرح يصفان المطلوب نفسه', () => {
    expect(exercise.instructionAr).toContain('هوية الشخص المطلوب');
    expect(exercise.explanationAr).toContain('غارثيا');
  });
});

describe('resumable template queues', () => {
  const queueDir = join(ROOT, 'content/review/queues');

  it('كل قائمة انتظار تحتوي معرّفات صحيحة موجودة في الفهرس', () => {
    const known = new Set(vocabEntries.map(({ id }: any) => id));
    const files = readdirSync(queueDir).filter(f => f.endsWith('.json'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const doc = JSON.parse(readFileSync(join(queueDir, file), 'utf8'));
      for (const id of doc.ids) expect(known.has(id), `${file}: ${id}`).toBe(true);
    }
  });

  it('قائمة الأمثلة القالبية والماسح يتفقان على العدد نفسه', () => {
    const file = join(queueDir, 'template-a1.json');
    expect(existsSync(file)).toBe(true);
    const queue = JSON.parse(readFileSync(file, 'utf8'));
    const counted = vocabEntries.filter(({ entry }: any) => {
      const example = entry.senses?.[0]?.exampleEs ?? '';
      return (entry.level ?? '').toUpperCase() === 'A1' && isTemplateExample(entry.headword, example);
    });
    expect(queue.ids.length).toBe(counted.length);
  });

  it('كل مستوى: قائمة الأمثلة القالبية تطابق ما يحسبه الماسح', () => {
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
      const doc = JSON.parse(readFileSync(join(queueDir, `template-${level.toLowerCase()}.json`), 'utf8'));
      const counted = vocabEntries.filter(({ entry }: any) => {
        const example = entry.senses?.[0]?.exampleEs ?? '';
        return (entry.level ?? '').toUpperCase() === level && isTemplateExample(entry.headword, example);
      });
      expect(doc.ids.length, `queue mismatch على ${level}`).toBe(counted.length);
    }
  });

  it('الدفعات المسجّلة في السجل تشير إلى قوائم موجودة', () => {
    const ledger = JSON.parse(readFileSync(join(ROOT, 'content/review/ledger.v1.json'), 'utf8'));
    const scopes = ledger.batches
      .flatMap((b: any) => b.scopes ?? [])
      .filter((s: string) => s.startsWith('vocab-queue:'))
      .map((s: string) => s.split(':')[1]);
    expect(scopes.length).toBeGreaterThan(0);
    for (const name of scopes) expect(existsSync(join(queueDir, `${name}.json`)), name).toBe(true);
  });
});

describe('reviewed vocabulary batches', () => {
  const batchDir = join(ROOT, 'content/review/vocab-examples');

  it('كل مثال أُعيد تأليفه ما زال مطبَّقًا في الفهرس وليس قالبيًا', () => {
    // مفتاحان لكل مدخل: مفتاح الفهرس القانوني (normalized) وصيغة العرض (headword).
    // بعض المدخلات تبدأ بحرف كبير في العرض («canguro de Australia») فتختلف الصيغتان.
    const byKey: Map<string, any> = new Map();
    for (const { id, entry } of vocabEntries as any[]) {
      const [bundle, key] = id.slice('vocab:'.length).split('#');
      byKey.set(`${bundle}#${key}`, entry);
      byKey.set(`${bundle}#${entry.headword}`, entry);
    }
    const files = readdirSync(batchDir).filter((f: string) => f.endsWith('.json'));
    expect(files.length).toBeGreaterThan(0);
    // دفعة إصلاح لاحقة قد تُعيد كتابة مثالًا سبق أن عالجته دفعة قوالب (مثل «beisbol»
    // التي كان مثالها عاديًا لا قالبيًا). عندئذٍ المرجع هو **آخر** نص موثّق، لا الأول.
    const superseded = new Map<string, any>();
    for (const file of files) {
      const doc = JSON.parse(readFileSync(join(batchDir, file), 'utf8'));
      if (doc.kind !== 'field-repair') continue;
      for (const item of doc.entries) superseded.set(`${item.bundle}#${item.headword}`, item);
    }
    let checked = 0;
    for (const file of files) {
      const doc = JSON.parse(readFileSync(join(batchDir, file), 'utf8'));
      // دفعات «إصلاح الحقول» (tools/fill-vocab-egyptian.mjs) تعمل على أمثلة عادية
      // غير قالبية وتذكر الحقول التي غيّرتها فقط، فلا تنطبق عليها شروط دفعات
      // القوالب. تُفحص هنا بما يخصّها: أن كل تعديل مذكور مطبَّق فعلًا في الفهرس.
      const fieldRepair = doc.kind === 'field-repair';
      for (const item of doc.entries) {
        const entry: any = byKey.get(`${item.bundle}#${item.headword}`);
        if (fieldRepair) {
          expect(entry, `${file}: ${item.bundle}#${item.headword}`).toBeTruthy();
          if (item.es) expect(entry.senses[0].exampleEs, `${file}: exampleEs`).toBe(item.es);
          if (item.ar) expect(entry.senses[0].exampleAr, `${file}: exampleAr`).toBe(item.ar);
          if (item.arEg) expect(entry.senses[0].exampleArEg, `${file}: exampleArEg`).toBe(item.arEg);
          expect(entry.senses[0].exampleEs, `${file}: ${item.headword} بلا علامة ختام`).toMatch(/[.!?]$/);
          expect(entry.senses[0].exampleArEg, `${file}: ${item.headword} بلا مصرية`).toBeTruthy();
          continue;
        }
        expect(entry, `${file}: ${item.bundle}#${item.headword}`).toBeTruthy();
        const later = superseded.get(`${item.bundle}#${item.headword}`);
        const expectedEs = later?.es ?? item.es;
        const expectedAr = later?.ar ?? item.ar;
        expect(entry.senses[0].exampleEs, `${file}: exampleEs`).toBe(expectedEs);
        expect(entry.senses[0].exampleAr, `${file}: exampleAr`).toBe(expectedAr);
        expect(entry.examples[0].es, `${file}: examples[0].es`).toBe(expectedEs);
        expect(isTemplateExample(item.headword, expectedEs), `${file}: ${item.headword} مثال قالبي`).toBe(false);
        expect(entry.examples[0].ar, `${file}: examples[0].ar`).toBe(expectedAr);
        // كل جملة إسبانية مكتملة، وكل ترجمة عربية بلا حروف لاتينية
        expect(item.es, `${file}: ${item.headword} بلا علامة ختام`).toMatch(/[.!?]$/);
        expect(item.ar, `${file}: ${item.headword} ترجمة بحروف لاتينية`).not.toMatch(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/);
        expect(item.ar.trim().length, `${file}: ${item.headword} ترجمة قصيرة`).toBeGreaterThan(7);
        checked += 1;
      }
    }
    // 395 (B12–B19) + 374 (B20–B25) + 55 (B26) + 272 (B27–B31) + 60 (B32) + 70 (B33) = 1226
    // + 465 (B34–B38) + 100 (B39) + 88 (B40) + 835 (B41–B49) = 2714
    expect(checked).toBeGreaterThanOrEqual(2714);
  });

  /** جودة الأمثلة المعاد تأليفها: قِصَر الجملة (مناسب A1) وعدم تكرار أي جملة حرفيًا.
   *  ملاحظة حدّ: هذا فحص هيوريستي — لا يثبت الطبيعية أو الملاءمة التربوية؛ ذلك يحتاج قراءة بشرية. */
  it('أمثلة الدفعات المعاد تأليفها قصيرة ولا تتكرر حرفيًا في المعجم', () => {
    const superseded2 = new Set<string>();
    for (const file of readdirSync(batchDir).filter((f: string) => f.endsWith('.json'))) {
      const doc = JSON.parse(readFileSync(join(batchDir, file), 'utf8'));
      if (doc.kind !== 'field-repair') continue;
      for (const item of doc.entries) superseded2.add(`${item.bundle}#${item.headword}`);
    }
    const allExamples = new Map<string, string[]>();
    for (const { entry } of vocabEntries as any[]) {
      const text = (entry.senses?.[0]?.exampleEs ?? '').trim().toLowerCase();
      if (!text) continue;
      if (!allExamples.has(text)) allExamples.set(text, []);
      allExamples.get(text)!.push(entry.headword);
    }
    for (const file of readdirSync(batchDir).filter((f: string) => f.endsWith('.json'))) {
      const doc = JSON.parse(readFileSync(join(batchDir, file), 'utf8'));
      if (doc.kind === 'field-repair') continue; // لها فحصها الخاص أعلاه
      for (const item of doc.entries) {
        if (superseded2.has(`${item.bundle}#${item.headword}`)) continue;
        const words = (item.es.match(/[\p{L}]+/gu) ?? []).length;
        expect(words, `${file}: ${item.headword} جملة طويلة لـA1`).toBeLessThanOrEqual(14);
        expect(words, `${file}: ${item.headword} جملة قصيرة جدًا`).toBeGreaterThanOrEqual(3);
        const owners: string[] = allExamples.get(item.es.trim().toLowerCase()) ?? [];
        expect(owners.filter(h => h !== item.headword), `${file}: ${item.headword} جملة مكررة حرفيًا`).toEqual([]);
        // لا تكرار آلي لأفعال الشرط/الوصل المعقّدة في مستوى A1
        expect(item.es, `${file}: ${item.headword} بناء متقدّم`).not.toMatch(/\b(hubiera|hubiese|siempre que|a menos que|no obstante|sin embargo|por lo tanto)\b/i);
      }
    }
  });
});

describe('homograph entries with different accents', () => {
  // «papa» (البابا) و«papá» (الأب) يتساويان إذا حُذف التشكيل، فأداة التطبيق كانت تكتب في
  // المدخل الخاطئ. الاختبار يثبّت أن لكل مدخل معناه وجملته الخاصة.
  const doc: any = JSON.parse(
    readFileSync(join(ROOT, 'content/drafts/core-vocab/vocab-cv-alphabet-m-p.json'), 'utf8'),
  );
  const find = (hw: string) => doc.entries.find((e: any) => e.headword === hw);

  it('«papa» (البابا) لا يحمل مثالًا عن الأب', () => {
    const entry = find('papa');
    expect(entry).toBeTruthy();
    expect(entry.senses[0].exampleEs).toBe(entry.examples[0].es);
    expect(entry.senses[0].exampleEs).not.toMatch(/papá/i);
    expect(entry.senses[0].exampleAr.trim().length).toBeGreaterThan(0);
  });

  it('«papá» (الأب) يحمل مثالًا عائليًا مستقلًا', () => {
    const entry = find('papá');
    expect(entry).toBeTruthy();
    expect(entry.senses[0].exampleEs).toBe(entry.examples[0].es);
    expect(entry.senses[0].exampleEs).toMatch(/papá/i);
    expect(entry.senses[0].exampleAr.trim().length).toBeGreaterThan(0);
  });

  it('المدخلان لا يتشاركان النص نفسه', () => {
    expect(find('papá').senses[0].exampleEs).not.toBe(find('papa').senses[0].exampleEs);
  });
});

describe('Egyptian Arabic mirror of rewritten examples', () => {
  // B33 أدخل الترجمة المصرية في الحقل المخصّص لها (exampleArEg / arEg). الاختبار
  // يثبّت أن كل مدخل في الدفعة يحمل الثلاثة (إسباني + فصيح + مصري) في الموضعين،
  // وأن المصرية ليست نسخة من الفصحى (نسخها يعني حقلًا زائدًا لا ترجمة).
  const batchFile = join(ROOT, 'content/review/vocab-examples/b33-a2-recomun-70.json');

  it('الدفعة تحمل arEg لكل مدخل ومختلفة عن الفصحى', () => {
    const doc = JSON.parse(readFileSync(batchFile, 'utf8'));
    expect(doc.entries.length).toBeGreaterThanOrEqual(70);
    for (const item of doc.entries) {
      expect(typeof item.arEg, `${item.headword}: arEg مفقود`).toBe('string');
      expect(item.arEg.trim().length, `${item.headword}: arEg قصير`).toBeGreaterThan(7);
      expect(item.arEg.trim(), `${item.headword}: arEg نسخة من الفصحى`).not.toBe(item.ar.trim());
      expect(/[\u0600-\u06FF]/.test(item.arEg), `${item.headword}: arEg بلا حروف عربية`).toBe(true);
    }
  });

  it('الفهرس يحمل arEg في senses و examples لكل مدخل في الدفعة', () => {
    const doc = JSON.parse(readFileSync(batchFile, 'utf8'));
    for (const item of doc.entries) {
      const entry: any = vocabEntries.find(
        ({ id }: any) => id === `vocab:${item.bundle}#${item.headword}`,
      )?.entry;
      expect(entry, `${item.headword}: غير موجود في الفهرس`).toBeTruthy();
      expect(entry.senses[0].exampleArEg, `${item.headword}: senses arEg`).toBe(item.arEg);
      expect(entry.examples[0].arEg, `${item.headword}: examples arEg`).toBe(item.arEg);
    }
  });
});

/**
 * انحدار: مدقّق الدفعات كان يرفض «el» مع المؤنث الذي يبدأ بـ a-/ha- مشدّدة
 * («Cortó la rama con el hacha.», «El haba seca se usa…») مع أنها صحيحة في الإسبانية،
 * فيضطر المحرّر إلى صياغة أضعف أو تُرفض الدفعة. القاعدة الآن في lib/article-gender.mjs.
 */
describe('article gender check: el + مؤنث يبدأ بـ a-/ha- مشدّدة', () => {
  it('يقبل el hacha و el haba و el agua', () => {
    expect(articleGenderProblem({ headword: 'hacha', gender: 'f' }, 'Cortó la rama con el hacha.')).toBeNull();
    expect(articleGenderProblem({ headword: 'haba', gender: 'f' }, 'El haba seca se usa en muchos guisos.')).toBeNull();
    expect(articleGenderProblem({ headword: 'agua', gender: 'f' }, 'El agua del río está fría.')).toBeNull();
  });

  it('لا يزال يرفض المؤنث العادي بأداة مذكرة', () => {
    expect(articleGenderProblem({ headword: 'bala', gender: 'f' }, 'El bala salió del arma.')).toContain('أداة مذكر');
    expect(articleGenderProblem({ headword: 'casa', gender: 'f' }, 'El casa es muy grande.')).toContain('أداة مذكر');
  });

  it('لا يزال يرفض المذكر بأداة مؤنثة', () => {
    expect(articleGenderProblem({ headword: 'libro', gender: 'm' }, 'La libro está en la mesa.')).toContain('أداة مؤنث');
  });

  it('لا يرفض أداة غير معرفة أو موضعًا غير اسمي', () => {
    expect(articleGenderProblem({ headword: 'casa', gender: 'f' }, 'Compré una casa pequeña.')).toBeNull();
    expect(articleGenderProblem({ headword: 'mesa', gender: 'f' }, 'La silla está junto a la mesa.')).toBeNull();
  });
});

/**
 * انحدار (30 أكتوبر 2026): انحراف كاشف القوالب عن الواقع.
 *
 * عائلتان كاملتان على الأقل في A2/B1/B2/C1 كانتا مكتوبتين بصيغة لا تطابق أي نمط
 * في الكاشف («…en el desarrollo científico y **tecnológico**» مقابل «…técnico»)،
 * فبقيت 394 جملة قالبية خارج كل قائمة انتظار — بل أُعلن سابقًا أن A1 = 0 وهو خطأ.
 * وأداة التطبيق كان لها نسختها الخاصة من القائمة، فرفضت الدفعات التي كشفها
 * الكاشف بعد التصحيح. الاختباران التاليان يمنعان تكرار الأمرين.
 */
describe('template detector coverage', () => {
  const inv = loadInventory(ROOT);

  it('لا عائلة قالبية (8 مداخل أو أكثر) تفوت الكاشف في أي مستوى', () => {
    const skeletons = new Map<string, { count: number; level: string; sample: string }>();
    for (const item of inv.vocab as any[]) {
      const ex = item.entry.senses?.[0]?.exampleEs ?? '';
      if (!ex) continue;
      if (isTemplateExample(item.entry.headword, ex)) continue;
      const sk = templateSkeleton(item.entry.headword, ex);
      const key = `${item.entry.level}|${sk}`;
      const cur = skeletons.get(key) ?? { count: 0, level: item.entry.level, sample: ex };
      cur.count += 1;
      skeletons.set(key, cur);
    }
    const big = [...skeletons.values()].filter(s => s.count >= 8);
    // نطبع المفاهيم المخالفة كي يظهر السبب مباشرة في تقرير الاختبار
    expect(big.map(s => `${s.level}: ${s.count}× ${s.sample.slice(0, 50)}`)).toEqual([]);
  });

  it('أداة التطبيق تستعمل الكاشف المشترك ولا تحتفظ بقائمة قوالب خاصة', () => {
    const src = readFileSync(join(ROOT, 'tools/rewrite-vocab-examples.mjs'), 'utf8');
    expect(src).toContain("from './lib/content-review.mjs'");
    expect(src).toContain('isTemplateExample');
    expect(src).not.toContain('KNOWN_TEMPLATES');
  });
});
