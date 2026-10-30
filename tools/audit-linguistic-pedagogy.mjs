import { DatabaseSync } from 'node:sqlite';
import { readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// تحديد مسار قاعدة بيانات D1 المحلية تلقائيًا
const sqliteDir = join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
if (!existsSync(sqliteDir)) {
  console.error('🛑 لم يتم العثور على مجلد D1 المحلي.');
  process.exit(1);
}
const sqliteFiles = readdirSync(sqliteDir).filter(x => x.endsWith('.sqlite') && !x.includes('-shm') && !x.includes('-wal') && !x.startsWith('metadata'));
if (sqliteFiles.length !== 1) {
  console.error(`🛑 عدد ملفات SQLite غير متوقع (${sqliteFiles.length}).`);
  process.exit(1);
}
const DB_PATH = join(sqliteDir, sqliteFiles[0]);

const db = new DatabaseSync(DB_PATH, { open: true, readOnly: true });
db.exec('PRAGMA busy_timeout = 5000;');

console.log('================================================================');
console.log('     التدقيق اللغوي والتربوي الشامل لمنصة الإسبانية العربية      ');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// القسم 1: تدقيق القاموس والمفردات (Vocabulary Audit)
// -----------------------------------------------------------------------------
console.log('▶ جاري تدقيق المفردات والمعاجم...');

const vocabEntries = db.prepare(`
  SELECT v.id, v.headword_es, v.headword_normalized, v.pos, v.level_code, v.frequency_rank,
         s.id as sense_id, s.meaning_ar_fusha, s.meaning_ar_eg, s.usage_note_ar, s.common_error_ar, s.example_sentence_id
  FROM vocabulary_entries v
  LEFT JOIN vocabulary_senses s ON s.entry_id = v.id
  ORDER BY v.headword_normalized
`).all();

const distinctHeadwords = new Set();
const duplicateHeadwords = [];
const headwordCountMap = new Map();

for (const row of vocabEntries) {
  const norm = row.headword_normalized;
  distinctHeadwords.add(norm);
  headwordCountMap.set(norm, (headwordCountMap.get(norm) || 0) + 1);
}
for (const [headword, count] of headwordCountMap.entries()) {
  if (count > 1) {
    duplicateHeadwords.push({ headword, count });
  }
}

const posBreakdown = {};
let missingFushaGloss = 0;
let fushaNonArabicChars = 0;
let hasEgyptianGlossCount = 0;
let hasUsageNoteCount = 0;
let hasCommonErrorCount = 0;
let hasExampleCount = 0;
const vocabAccentSuspects = [];

// قواعد نبر دقيقة لا تتأثر باللواحق أو الحروف اللاتينية الإضافية
const ACCENT_TESTS = [
  { pattern: /(?<![\p{L}\p{M}])tambien(?![\p{L}\p{M}])/iu, correct: 'también', desc: 'نبرة también' },
  { pattern: /(?<![\p{L}\p{M}])ingles(?![\p{L}\p{M}])/iu, correct: 'inglés', desc: 'نبرة inglés' },
  { pattern: /(?<![\p{L}\p{M}])adios(?![\p{L}\p{M}])/iu, correct: 'adiós', desc: 'نبرة adiós' },
  { pattern: /(?<![\p{L}\p{M}])telefono(?![\p{L}\p{M}])/iu, correct: 'teléfono', desc: 'نبرة teléfono' },
  { pattern: /(?<![\p{L}\p{M}])numero(?![\p{L}\p{M}])/iu, correct: 'número', desc: 'نبرة número' },
  { pattern: /(?<![\p{L}\p{M}])facil(?![\p{L}\p{M}])/iu, correct: 'fácil', desc: 'نبرة fácil' },
  { pattern: /(?<![\p{L}\p{M}])dificil(?![\p{L}\p{M}])/iu, correct: 'difícil', desc: 'نبرة difícil' },
  { pattern: /(?<![\p{L}\p{M}])musica(?![\p{L}\p{M}])/iu, correct: 'música', desc: 'نبرة música' },
  { pattern: /(?<![\p{L}\p{M}])medico(?![\p{L}\p{M}])/iu, correct: 'médico', desc: 'نبرة médico' },
  { pattern: /(?<![\p{L}\p{M}])boligrafo(?![\p{L}\p{M}])/iu, correct: 'bolígrafo', desc: 'نبرة bolígrafo' },
  { pattern: /(?<![\p{L}\p{M}])estacion(?![\p{L}\p{M}])/iu, correct: 'estación', desc: 'نبرة estación' },
  { pattern: /(?<![\p{L}\p{M}])habitacion(?![\p{L}\p{M}])/iu, correct: 'habitación', desc: 'نبرة habitación' },
  { pattern: /(?<![\p{L}\p{M}])leccion(?![\p{L}\p{M}])/iu, correct: 'lección', desc: 'نبرة lección' },
  { pattern: /(?<![\p{L}\p{M}])cancion(?![\p{L}\p{M}])/iu, correct: 'canción', desc: 'نبرة canción' },
];

for (const v of vocabEntries) {
  // تصنيف نوع الكلمة (POS)
  const pos = v.pos || 'unknown';
  posBreakdown[pos] = (posBreakdown[pos] || 0) + 1;

  // فحص الفصحى
  if (!v.meaning_ar_fusha || !v.meaning_ar_fusha.trim()) {
    missingFushaGloss++;
  } else {
    // التأكد من احتواء المعنى على حروف عربية
    if (!/[\u0600-\u06FF]/.test(v.meaning_ar_fusha)) {
      fushaNonArabicChars++;
    }
  }

  // فحص العامية المصرية
  if (v.meaning_ar_eg && v.meaning_ar_eg.trim()) {
    hasEgyptianGlossCount++;
  }

  // فحص الملاحظات التوضيحية وتنبيهات الأخطاء الشائعة
  if (v.usage_note_ar && v.usage_note_ar.trim()) hasUsageNoteCount++;
  if (v.common_error_ar && v.common_error_ar.trim()) hasCommonErrorCount++;
  if (v.example_sentence_id) hasExampleCount++;

  // فحص النبرات على الكلمة الإسبانية
  for (const rule of ACCENT_TESTS) {
    if (rule.pattern.test(v.headword_es)) {
      vocabAccentSuspects.push({ id: v.id, word: v.headword_es, rule: rule.desc, correct: rule.correct });
    }
  }
}

// -----------------------------------------------------------------------------
// القسم 2: تدقيق القواعد والمسارات التعليمية (Grammar & Pedagogical Progression)
// -----------------------------------------------------------------------------
console.log('▶ جاري تدقيق القواعد وتوزيع المستويات التعليمية...');

const levels = db.prepare(`
  SELECT level_code, COUNT(DISTINCT l.id) as lesson_count, COUNT(e.id) as exercise_count
  FROM lessons l
  JOIN lesson_versions lv ON lv.id = l.current_version_id
  LEFT JOIN exercises e ON e.lesson_version_id = lv.id
  GROUP BY level_code
  ORDER BY 
    CASE level_code
      WHEN 'pre_a1' THEN 1
      WHEN 'a1' THEN 2
      WHEN 'a2' THEN 3
      WHEN 'b1' THEN 4
      WHEN 'b2' THEN 5
      WHEN 'c1' THEN 6
      WHEN 'travel_track' THEN 7
      WHEN 'business_track' THEN 8
      ELSE 9
    END
`).all();

// فحص تغطية القواعد الجوهرية للغة الإسبانية
const GRAMMAR_PILLARS = [
  { key: 'ser_vs_estar', name: 'الفرق بين Ser وEstar', keywords: ['ser', 'estar', 'كائن', 'مؤقت', 'دائم', 'مكان'] },
  { key: 'por_vs_para', name: 'الفرق بين Por وPara', keywords: ['por', 'para', 'سبب', 'غاية', 'أجل', 'وجهة'] },
  { key: 'preterite_imperfect', name: 'الماضي البسيط vs الماضي المستمر', keywords: ['indefinido', 'imperfecto', 'ماضي', 'مكتمل', 'مستمر', 'سرد'] },
  { key: 'subjunctive_present', name: 'صيغة المنصوب الحاضر (Presente de Subjuntivo)', keywords: ['subjuntivo', 'منصوب', 'شك', 'رغبة', 'أمنية', 'ojalá', 'espero que'] },
  { key: 'subjunctive_imperfect', name: 'صيغة المنصوب الماضي (Imperfecto de Subjuntivo)', keywords: ['imperfecto de subjuntivo', 'condicional', 'لو', 'ra/se'] },
  { key: 'object_pronouns', name: 'ضمائر المفعول المباشر وغير المباشر (lo/la/le/se)', keywords: ['objeto directo', 'objeto indirecto', 'مفعول', 'pronombres', 'se lo'] },
  { key: 'imperative', name: 'صيغة الأمر (Imperativo afirmativo/negativo)', keywords: ['imperativo', 'أمر', 'طلب', 'نهي', 'haz', 'no hagas'] },
  { key: 'reflexive_verbs', name: 'الأفعال الانعكاسية (Verbos reflexivos)', keywords: ['reflexivo', 'انعكاسي', 'llamarse', 'levantarse', 'ducharse', 'se'] },
  { key: 'gustar_verbs', name: 'أفعال الإعجاب والمشاعر شبيهة Gustar', keywords: ['gustar', 'encantar', 'يعجبني', 'doler', 'interesar'] },
  { key: 'conditional', name: 'الجمل الشرطية وحالات Si', keywords: ['condicional', 'شرط', 'si tuviera', 'habría'] }
];

const lessonsAll = db.prepare(`
  SELECT l.id, l.slug, l.title_ar, l.level_code, lv.content_json
  FROM lessons l
  JOIN lesson_versions lv ON lv.id = l.current_version_id
`).all();

const grammarCoverage = {};
for (const pillar of GRAMMAR_PILLARS) {
  grammarCoverage[pillar.key] = {
    name: pillar.name,
    matchingLessons: []
  };
}

for (const l of lessonsAll) {
  const text = (l.slug + ' ' + l.title_ar + ' ' + (l.content_json || '')).toLowerCase();
  for (const pillar of GRAMMAR_PILLARS) {
    const matched = pillar.keywords.some(kw => text.includes(kw.toLowerCase()));
    if (matched) {
      grammarCoverage[pillar.key].matchingLessons.push({
        slug: l.slug,
        title: l.title_ar,
        level: l.level_code
      });
    }
  }
}

// -----------------------------------------------------------------------------
// القسم 3: تدقيق التمارين وخياراتها وسلامتها التربوية (Exercise Quality Audit)
// -----------------------------------------------------------------------------
console.log('▶ جاري تدقيق التمارين وخياراتها ونصوصها...');

const exercises = db.prepare(`
  SELECT e.id, e.lesson_version_id, e.type, e.prompt_json, e.answer_key_json, e.explanation_ar, e.error_feedback_json, e.sort_order,
         l.slug as lesson_slug, l.title_ar as lesson_title, l.level_code
  FROM exercises e
  JOIN lesson_versions lv ON lv.id = e.lesson_version_id
  JOIN lessons l ON l.id = lv.lesson_id
  ORDER BY l.level_code, l.slug, e.sort_order
`).all();

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

const exerciseIssues = {
  critical: [],
  pedagogical: [],
  punctuationAccents: [],
  explanations: [],
  leakedAnswers: [],
  typeBreakdown: {}
};

for (const ex of exercises) {
  exerciseIssues.typeBreakdown[ex.type] = (exerciseIssues.typeBreakdown[ex.type] || 0) + 1;

  let prompt = {};
  let key = {};
  let errorFeedback = {};

  try { prompt = JSON.parse(ex.prompt_json || '{}'); } catch (e) {
    exerciseIssues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'prompt_json تالف' });
  }
  try { key = JSON.parse(ex.answer_key_json || '{}'); } catch (e) {
    exerciseIssues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'answer_key_json تالف' });
  }
  try { errorFeedback = JSON.parse(ex.error_feedback_json || '{}'); } catch (e) {
    exerciseIssues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'error_feedback_json تالف' });
  }

  // 1. تدقيق الشرح العربي
  if (!ex.explanation_ar || !ex.explanation_ar.trim()) {
    exerciseIssues.explanations.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'التمرين بلا شرح عربي' });
  } else {
    // كشف العلامات المؤقتة الحقيقية دون الاصطدام بكلمة todo الإسبانية
    if (/\b(TODO|TBD|FIXME)\b/.test(ex.explanation_ar) || /\b(undefined|null)\b/i.test(ex.explanation_ar)) {
      exerciseIssues.explanations.push({ id: ex.id, lesson: ex.lesson_slug, msg: `الشرح به نص مؤقت: "${ex.explanation_ar}"` });
    }
  }

  const opts = optionsByExercise.get(ex.id) ?? [];
  const its = itemsByExercise.get(ex.id) ?? [];
  const stem = prompt.stemEs || prompt.instructionAr || '';

  // 2. فحص الترقيم الإسباني (علامات الاستفهام المقلوبة)
  if (prompt.stemEs) {
    const s = prompt.stemEs;
    if (s.includes('?') && !s.includes('¿')) {
      exerciseIssues.punctuationAccents.push({ id: ex.id, lesson: ex.lesson_slug, text: s, msg: 'سؤال ينتهي بـ ? دون ¿' });
    }
    if (s.includes('!') && !s.includes('¡')) {
      exerciseIssues.punctuationAccents.push({ id: ex.id, lesson: ex.lesson_slug, text: s, msg: 'تعجب ينتهي بـ ! دون ¡' });
    }
    for (const rule of ACCENT_TESTS) {
      if (rule.pattern.test(s)) {
        exerciseIssues.punctuationAccents.push({ id: ex.id, lesson: ex.lesson_slug, text: s, msg: rule.desc, expected: rule.correct });
      }
    }
  }

  // 3. فحص الخيارات في أسئلة الاختيار من متعدد
  if (opts.length > 0) {
    const seenOptions = new Set();
    const dups = [];
    let emptyOpts = 0;
    for (const o of opts) {
      const text = (o.text || '').trim();
      if (!text) emptyOpts++;
      if (seenOptions.has(text.toLowerCase())) dups.push(text);
      seenOptions.add(text.toLowerCase());
    }
    if (emptyOpts > 0) {
      exerciseIssues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: `خيارات فارغة (${emptyOpts})` });
    }
    if (dups.length > 0) {
      exerciseIssues.pedagogical.push({ id: ex.id, lesson: ex.lesson_slug, msg: `خيارات مكررة: ${dups.join(' | ')}` });
    }

    // التحقق من صحة مفاتيح الإجابة
    const correctIds = key.correctOptionIds || [];
    if (correctIds.length === 0 && !key.accepted && !['speak_with_text', 'speak_free', 'roleplay_simulation'].includes(ex.type)) {
      exerciseIssues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'تمرين خيارات بلا مفتاح إجابة صحيحة' });
    }
    for (const cid of correctIds) {
      if (!opts.some(o => o.id === cid)) {
        exerciseIssues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: `معرّف الإجابة ${cid} غير موجود في الخيارات` });
      }
    }
  }

  // 4. فحص تمارين ترتيب الكلمات والحوار
  if (ex.type === 'word_order' || ex.type === 'dialogue_order') {
    if (its.length === 0) {
      exerciseIssues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'تمرين ترتيب بلا عناصر items' });
    }
    const accepted = key.accepted || [];
    if (accepted.length === 0) {
      exerciseIssues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'تمرين ترتيب بلا إجابات مقبولة' });
    }
  }

  // 5. فحص تمارين إكمال الفراغ
  if (['fill_blank', 'type_missing_word', 'translate_short'].includes(ex.type)) {
    const accepted = key.accepted || [];
    if (accepted.length === 0) {
      exerciseIssues.critical.push({ id: ex.id, lesson: ex.lesson_slug, msg: 'تمرين إدخال نصي بلا إجابة مقبولة' });
    }
  }

  // 6. فحص تسريب الإجابة في نص السؤال (Answer Leakage)
  if (['word_choice', 'listen_choose', 'fill_blank'].includes(ex.type)) {
    const correctOption = opts.find(o => o.is_correct);
    if (correctOption && correctOption.text && correctOption.text.length > 3) {
      const correctWord = correctOption.text.trim().toLowerCase();
      // إذا كان السؤال يعرض الكلمة الصحيحة بحذافيرها في السؤال ويطلب اختيارها بدون سياق أو ترجمة
      if (prompt.stemEs && prompt.stemEs.trim().toLowerCase() === correctWord && opts.length > 1) {
        exerciseIssues.leakedAnswers.push({
          id: ex.id,
          lesson: ex.lesson_slug,
          stem: prompt.stemEs,
          answer: correctOption.text,
          msg: 'نص السؤال مطابق تمامًا للخيار الصحيح'
        });
      }
    }
  }
}

// -----------------------------------------------------------------------------
// تلخيص التقرير وحفظه
// -----------------------------------------------------------------------------
const summary = {
  timestamp: new Date().toISOString(),
  vocabulary: {
    totalEntries: vocabEntries.length,
    distinctHeadwords: distinctHeadwords.size,
    duplicateHeadwordsCount: duplicateHeadwords.length,
    missingFushaGloss,
    fushaNonArabicChars,
    hasEgyptianGlossCount,
    egyptianGlossPercentage: `${((hasEgyptianGlossCount / vocabEntries.length) * 100).toFixed(1)}%`,
    hasUsageNoteCount,
    hasCommonErrorCount,
    hasExampleCount,
    vocabAccentSuspectsCount: vocabAccentSuspects.length,
    posBreakdown
  },
  curriculum: {
    levels,
    grammarPillarsCoverage: Object.fromEntries(
      Object.entries(grammarCoverage).map(([k, v]) => [k, { name: v.name, count: v.matchingLessons.length }])
    )
  },
  exercises: {
    totalExercises: exercises.length,
    typeBreakdown: exerciseIssues.typeBreakdown,
    criticalErrorsCount: exerciseIssues.critical.length,
    pedagogicalIssuesCount: exerciseIssues.pedagogical.length,
    punctuationAccentsCount: exerciseIssues.punctuationAccents.length,
    explanationIssuesCount: exerciseIssues.explanations.length,
    leakedAnswersCount: exerciseIssues.leakedAnswers.length
  }
};

console.log('\n================================================================');
console.log('                    ملخص نتائج التدقيق الشامل                   ');
console.log('================================================================');
console.log(`- إجمالي المفردات والمعاجم: ${summary.vocabulary.totalEntries}`);
console.log(`- المفردات ذات الشرح بالفصحى: ${summary.vocabulary.totalEntries - missingFushaGloss} (${(((summary.vocabulary.totalEntries - missingFushaGloss) / summary.vocabulary.totalEntries) * 100).toFixed(1)}%)`);
console.log(`- المفردات المدعومة بالعامية المصرية: ${summary.vocabulary.hasEgyptianGlossCount} (${summary.vocabulary.egyptianGlossPercentage})`);
console.log(`- المفردات بملاحظات استخدام عربية: ${summary.vocabulary.hasUsageNoteCount}`);
console.log(`- المفردات بتنبيهات أخطاء شائعة: ${summary.vocabulary.hasCommonErrorCount}`);
console.log(`- إجمالي التمارين: ${summary.exercises.totalExercises}`);
console.log(`- الأخطاء الحرجة في التمارين: ${summary.exercises.criticalErrorsCount}`);
console.log(`- الملاحظات التربوية وتكرار الخيارات: ${summary.exercises.pedagogicalIssuesCount}`);
console.log(`- ملاحظات النبرات وعلامات الترقيم الإسبانية: ${summary.exercises.punctuationAccentsCount}`);
console.log(`- ملاحظات الشرح العربي: ${summary.exercises.explanationIssuesCount}`);
console.log(`- تسريب الإجابات في السؤال: ${summary.exercises.leakedAnswersCount}`);
console.log('----------------------------------------------------------------');
console.log('تغطية ركائز القواعد الإسبانية الأساسية:');
for (const [k, v] of Object.entries(summary.curriculum.grammarPillarsCoverage)) {
  console.log(`  • ${v.name}: مغطى في ${v.count} درس/وحدة`);
}
console.log('================================================================\n');

// كتابة التقرير الشامل بصيغة JSON
const fullReport = {
  summary,
  details: {
    duplicateHeadwords: duplicateHeadwords.slice(0, 50),
    vocabAccentSuspects,
    criticalErrors: exerciseIssues.critical,
    pedagogicalIssues: exerciseIssues.pedagogical,
    punctuationAccents: exerciseIssues.punctuationAccents,
    explanationIssues: exerciseIssues.explanations,
    leakedAnswers: exerciseIssues.leakedAnswers,
    grammarLessonsMap: grammarCoverage
  }
};

writeFileSync('reports/full-linguistic-pedagogy-report.json', JSON.stringify(fullReport, null, 2), 'utf-8');
console.log('✅ تم حفظ التقرير الشامل والمفصل بنجاح في: reports/full-linguistic-pedagogy-report.json');
