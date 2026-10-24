import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';

const DB_PATH = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/9ba2b04bf514d9facfd57ed57d849e77241a7adc99d1c1545d06688b43d84248.sqlite';

if (!fs.existsSync(DB_PATH)) {
  console.error('Database not found at', DB_PATH);
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH, { open: true, readOnly: true });

console.log('=== بدء التدقيق اللغوي والتربوي الشامل لمنصة الإسبانية العربية ===\n');

// 1. فحص التمارين وخياراتها ومفاتيح الإجابة
const exercises = db.prepare(`
  SELECT e.id, e.lesson_version_id, e.type, e.prompt_json, e.answer_key_json, e.explanation_ar, e.error_feedback_json, e.sort_order,
         l.slug as lesson_slug, l.title_ar as lesson_title, l.level_code
  FROM exercises e
  JOIN lesson_versions lv ON lv.id = e.lesson_version_id
  JOIN lessons l ON l.id = lv.lesson_id
  ORDER BY l.level_code, l.slug, e.sort_order
`).all();

console.log(`إجمالي التمارين المفحوصة: ${exercises.length}`);

const options = db.prepare(`
  SELECT id, exercise_id, text, is_correct, sort_order FROM exercise_options ORDER BY exercise_id, sort_order
`).all();

const optionsByExercise = new Map();
for (const opt of options) {
  if (!optionsByExercise.has(opt.exercise_id)) optionsByExercise.set(opt.exercise_id, []);
  optionsByExercise.get(opt.exercise_id).push(opt);
}

const items = db.prepare(`
  SELECT id, exercise_id, payload_json, ordinal FROM exercise_items ORDER BY exercise_id, ordinal
`).all();

const itemsByExercise = new Map();
for (const it of items) {
  if (!itemsByExercise.has(it.exercise_id)) itemsByExercise.set(it.exercise_id, []);
  itemsByExercise.get(it.exercise_id).push(it);
}

const issues = {
  critical: [],
  pedagogical: [],
  accentsPunctuation: [],
  explanations: [],
};

const ACCENT_RULES = [
  { re: /\btambien\b/i, correct: 'también', msg: 'غياب النبرة على también' },
  { re: /\bingles\b/i, correct: 'inglés', msg: 'غياب النبرة على inglés' },
  { re: /\badios\b/i, correct: 'adiós', msg: 'غياب النبرة على adiós' },
  { re: /\btelefono\b/i, correct: 'teléfono', msg: 'غياب النبرة على teléfono' },
  { re: /\bnumero\b/i, correct: 'número', msg: 'غياب النبرة على número' },
  { re: /\bfacil\b/i, correct: 'fácil', msg: 'غياب النبرة على fácil' },
  { re: /\bdificil\b/i, correct: 'difícil', msg: 'غياب النبرة على difícil' },
  { re: /\bmusica\b/i, correct: 'música', msg: 'غياب النبرة على música' },
  { re: /\bmedico\b/i, correct: 'médico', msg: 'غياب النبرة على médico' },
  { re: /\bboligrafo\b/i, correct: 'bolígrafo', msg: 'غياب النبرة على bolígrafo' },
  { re: /\besta bien\b/i, correct: 'está bien', msg: 'غياب النبرة على está bien' },
  { re: /\bcomo estas\b/i, correct: 'cómo estás', msg: 'غياب النبرة على cómo estás في الاستفهام' },
  { re: /\bque tal\b/i, correct: 'qué tal', msg: 'غياب النبرة على qué tal في التحية' },
  { re: /\bdonde esta\b/i, correct: 'dónde está', msg: 'غياب النبرة على dónde está' },
];

for (const ex of exercises) {
  const opts = optionsByExercise.get(ex.id) ?? [];
  const its = itemsByExercise.get(ex.id) ?? [];
  let prompt = {};
  let key = {};
  let errorFeedback = {};

  try { prompt = JSON.parse(ex.prompt_json || '{}'); } catch (e) {
    issues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'prompt_json تالف' });
  }
  try { key = JSON.parse(ex.answer_key_json || '{}'); } catch (e) {
    issues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'answer_key_json تالف' });
  }
  try { errorFeedback = JSON.parse(ex.error_feedback_json || '{}'); } catch (e) {
    issues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'error_feedback_json تالف' });
  }

  // فحص الشرح العربي
  if (!ex.explanation_ar || ex.explanation_ar.trim().length === 0) {
    issues.explanations.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'التمرين بلا شرح عربي نهائيًا' });
  } else if (/TODO|TBD|undefined|null/i.test(ex.explanation_ar)) {
    issues.explanations.push({ id: ex.id, lesson: ex.lesson_slug, msg: `الشرح يحتوي نصًا مؤقتًا: "${ex.explanation_ar}"` });
  }

  // فحص نصوص السؤال والخيارات
  const stem = prompt.stemEs || '';
  if (stem) {
    // علامات الاستفهام المقلوبة
    if (stem.includes('?') && !stem.includes('¿')) {
      issues.accentsPunctuation.push({ id: ex.id, lesson: ex.lesson_slug, text: stem, msg: 'سؤال إسباني ينتهي بـ ? دون ¿ في البداية' });
    }
    if (stem.includes('!') && !stem.includes('¡')) {
      issues.accentsPunctuation.push({ id: ex.id, lesson: ex.lesson_slug, text: stem, msg: 'جملة تعجبية تنتهي بـ ! دون ¡ في البداية' });
    }
    for (const rule of ACCENT_RULES) {
      if (rule.re.test(stem)) {
        issues.accentsPunctuation.push({ id: ex.id, lesson: ex.lesson_slug, text: stem, msg: rule.msg, expected: rule.correct });
      }
    }
  }

  // فحص الخيارات المتطابقة أو الفارغة في أسئلة الاختيار
  if (opts.length > 0) {
    const textSet = new Set();
    const duplicates = [];
    let emptyCount = 0;
    for (const o of opts) {
      const trimmed = (o.text || '').trim();
      if (!trimmed) emptyCount++;
      if (textSet.has(trimmed.toLowerCase())) duplicates.push(trimmed);
      textSet.add(trimmed.toLowerCase());
    }
    if (emptyCount > 0) {
      issues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: `يوجد ${emptyCount} خيارات فارغة النص` });
    }
    if (duplicates.length > 0) {
      issues.pedagogical.push({ id: ex.id, lesson: ex.lesson_slug, msg: `خيارات مكررة بنفس النص: ${duplicates.join(', ')}` });
    }

    // التحقق من وجود مفتاح إجابة صحيح
    const correctIds = key.correctOptionIds ?? [];
    if (correctIds.length === 0 && !key.accepted && ex.type !== 'speak_with_text' && ex.type !== 'speak_free' && ex.type !== 'roleplay_simulation') {
      issues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'تمرين خيارات بلا أي مفتاح إجابة صحيحة' });
    }
    // هل المعرّف المشار إليه في correctOptionIds موجود فعليًا في options؟
    for (const cid of correctIds) {
      if (!opts.some(o => o.id === cid)) {
        issues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: `معرّف الإجابة الصحيحة ${cid} غير موجود في خيارات التمرين` });
      }
    }
  }

  // فحص تمارين ترتيب الجمل والكلمات
  if (ex.type === 'word_order' || ex.type === 'dialogue_order') {
    if (its.length === 0) {
      issues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'تمرين ترتيب بلا أي عناصر (items) للترتيب' });
    }
    const accepted = key.accepted ?? [];
    if (accepted.length === 0) {
      issues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'تمرين ترتيب بلا إجابة مقبولة (accepted)' });
    }
  }

  // فحص تمارين إكمال الفراغ
  if (ex.type === 'fill_blank' || ex.type === 'type_missing_word') {
    const accepted = key.accepted ?? [];
    if (accepted.length === 0) {
      issues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'تمرين كتابة/فراغ بلا إجابات مقبولة' });
    }
  }
}

// 2. فحص القاموس والمفردات
const vocabEntries = db.prepare(`
  SELECT v.id, v.headword_es, v.pos, s.meaning_ar_fusha, s.meaning_ar_eg, s.usage_note_ar, s.common_error_ar
  FROM vocabulary_entries v
  LEFT JOIN vocabulary_senses s ON s.entry_id = v.id
`).all();

console.log(`إجمالي مفردات القاموس المفحوصة: ${vocabEntries.length}`);

let vocabMissingGloss = 0;
let vocabEmptyHeadword = 0;
const vocabAccentIssues = [];

for (const ve of vocabEntries) {
  if (!ve.headword_es || !ve.headword_es.trim()) vocabEmptyHeadword++;
  if (!ve.meaning_ar_fusha || !ve.meaning_ar_fusha.trim()) vocabMissingGloss++;

  for (const rule of ACCENT_RULES) {
    if (rule.re.test(ve.headword_es)) {
      vocabAccentIssues.push({ id: ve.id, word: ve.headword_es, rule: rule.msg });
    }
  }
}

console.log('\n--- نتائج التدقيق ---');
console.log(`الأخطاء الحرجة (Critical): ${issues.critical.length}`);
console.log(`المشكلات التربوية وتكرار الخيارات (Pedagogical): ${issues.pedagogical.length}`);
console.log(`تنبيهات النبر وعلامات الترقيم الإسبانية (Accents/Punctuation): ${issues.accentsPunctuation.length}`);
console.log(`تنبيهات الشرح العربي (Explanations): ${issues.explanations.length}`);
console.log(`مفردات بلا ترجمة عربية (Vocab missing gloss): ${vocabMissingGloss}`);
console.log(`مفردات بلا كلمة إسبانية (Vocab empty headword): ${vocabEmptyHeadword}`);
console.log(`مفردات بها شبهة غياب نبرات: ${vocabAccentIssues.length}`);

if (issues.critical.length > 0) {
  console.log('\nتفاصيل الأخطاء الحرجة:', JSON.stringify(issues.critical.slice(0, 10), null, 2));
}
if (issues.pedagogical.length > 0) {
  console.log('\nعينة من المشكلات التربوية:', JSON.stringify(issues.pedagogical.slice(0, 10), null, 2));
}
if (issues.accentsPunctuation.length > 0) {
  console.log('\nعينة من تنبيهات الترقيم والنبر الإسباني:', JSON.stringify(issues.accentsPunctuation.slice(0, 10), null, 2));
}
if (issues.explanations.length > 0) {
  console.log('\nعينة من ملاحظات الشرح:', JSON.stringify(issues.explanations.slice(0, 10), null, 2));
}

// حفظ تقرير التدقيق كملف JSON لتوثيقه في التقرير النهائي
fs.writeFileSync('reports/linguistic-audit-findings.json', JSON.stringify({
  summary: {
    totalExercises: exercises.length,
    totalVocab: vocabEntries.length,
    criticalCount: issues.critical.length,
    pedagogicalCount: issues.pedagogical.length,
    accentsCount: issues.accentsPunctuation.length,
    explanationsCount: issues.explanations.length,
    vocabMissingGloss,
    vocabEmptyHeadword,
    vocabAccentIssuesCount: vocabAccentIssues.length
  },
  critical: issues.critical,
  pedagogical: issues.pedagogical,
  accentsPunctuation: issues.accentsPunctuation,
  explanations: issues.explanations,
  vocabAccentIssues
}, null, 2));

console.log('\nتم حفظ التقرير المفصل في: reports/linguistic-audit-findings.json');
