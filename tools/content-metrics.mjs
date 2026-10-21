#!/usr/bin/env node
/**
 * tools/content-metrics.mjs — ينتج مقاييس المحتوى كـJSON (للاستخدام في CI أو تقارير المرحلة).
 * لا يعتمد على أي مكتبة. لا يحتسب ادعاءات: كل رقم مشتق من الملفات فعليًا.
 *
 * الاستخدام: node tools/content-metrics.mjs [--json]
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EX = join(ROOT, 'content', 'exemplars');
const AR = /[\u0600-\u06FF]/;
const LATIN = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/;
const words = s => (s || '').trim().split(/\s+/).filter(Boolean).length;

const files = readdirSync(EX);
const lessonFiles = files.filter(f => /^lesson-.*\.json$/.test(f));
const vocabFiles = files.filter(f => /^vocab-.*\.json$/.test(f));
const load = f => JSON.parse(readFileSync(join(EX, f), 'utf8'));

let arWords = 0, esWords = 0;
function walk(o) {
  if (typeof o === 'string') {
    const a = AR.test(o), l = LATIN.test(o);
    if (a && l) {
      arWords += words((o.match(/[\u0600-\u06FF\s،؛؟]+/g) || []).join(' '));
      esWords += words(o.replace(/[\u0600-\u06FF،؛؟]/g, ' '));
    } else if (a) arWords += words(o);
    else if (l) esWords += words(o);
    return;
  }
  if (Array.isArray(o)) return o.forEach(walk);
  if (o && typeof o === 'object') return Object.values(o).forEach(walk);
}

const lessons = lessonFiles.map(load);
const vocab = vocabFiles.map(load);
lessons.forEach(walk); vocab.forEach(walk);

const entries = vocab.flatMap(v => v.entries);
const uniqueEntries = new Set(entries.map(e => e.normalized)).size;
const dupes = entries.length - uniqueEntries;
const byType = {};
lessons.forEach(l => l.lesson.exercises.forEach(e => { byType[e.type] = (byType[e.type] || 0) + 1; }));
const byLevel = {};
lessons.forEach(l => { byLevel[l.lesson.level] = (byLevel[l.lesson.level] || 0) + 1; });

const metrics = {
  generatedAt: new Date().toISOString(),
  lessons: lessons.length,
  vocabularyEntries: entries.length,
  vocabularyEntriesUnique: uniqueEntries,
  duplicateEntries: dupes,
  exercises: lessons.reduce((a, l) => a + l.lesson.exercises.length, 0),
  exerciseTypesUsed: Object.keys(byType).length,
  exercisesByType: byType,
  lessonsByLevel: byLevel,
  editorialArabicWords: arWords,
  editorialSpanishWords: esWords,
  editorialWordsTotal: arWords + esWords,
  targets: { lessons: 236, vocabularyEntriesUnique: 5000, editorialWordsTotal: 7000, exerciseTypesUsed: 28 },
  targetsMet: {
    vocabulary: uniqueEntries >= 5000,
    editorialWords: (arWords + esWords) >= 7000,
    lessons: lessons.length >= 236,
    exerciseTypes: Object.keys(byType).length >= 28
  },
  note: 'هذه عيّنة نموذج عمودي فقط. أهداف 5000 مدخل/7000 كلمة/236 درسًا تخصّ المراحل 2 و3 ولا تُعلن مكتملة قبل بلوغها فعليًا.'
};

const json = JSON.stringify(metrics, null, 2);
writeFileSync(join(ROOT, 'reports', 'content-metrics.json'), json + '\n');
if (process.argv.includes('--json')) console.log(json);
else {
  console.log(`الدروس: ${metrics.lessons} · مداخل فريدة: ${uniqueEntries} · تمارين: ${metrics.exercises} · أنواع: ${metrics.exerciseTypesUsed}/28`);
  console.log(`كلمات تحريرية: ${metrics.editorialWordsTotal} (عربي ${arWords} + إسباني ${esWords})`);
  console.log(`اكتمال الأهداف: ${JSON.stringify(metrics.targetsMet)}`);
  console.log('→ reports/content-metrics.json');
}
