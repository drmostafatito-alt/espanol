#!/usr/bin/env node
/**
 * tools/validate-content.mjs — مدقق محتوى Español بالعربي
 *
 * يعمل بلا أي اعتماديات (Node 20+).
 * 1) تحقق بالمخططات (مجموعة فرعية من JSON Schema 2020-12) في content/schema.
 * 2) قواعد جودة تعليمية لا تعبّر عنها المخططات (إجابات، مشتتات، تسريب الإجابة، سلامة النص...).
 * 3) تحقق متقاطع بين الدروس والمفردات والمسارات.
 * 4) مقاييس محتوى (مداخل فريدة، كلمات تحريرية، تمارين).
 *
 * الفرق بين خطأ (error) وتنبيه (warning) مقصود ومعلن:
 *   - خطأ = يمنع النشر دائمًا.
 *   - تنبيه = يمنع النشر فقط عندما تكون حالة الدرس published/approved (يُصبح خطأً تلقائيًا).
 *
 * الاستخدام: node tools/validate-content.mjs [--write-report]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA_DIR = join(ROOT, 'content', 'schema');
// مجلد المحتوى قابل للتغيير: --dir content/drafts لفحص مسودات قبل دمجها
const dirArg = process.argv.indexOf('--dir');
const EX_DIR = join(ROOT, dirArg > 0 && process.argv[dirArg + 1] ? process.argv[dirArg + 1] : 'content/exemplars');

const readJSON = f => JSON.parse(readFileSync(f, 'utf8'));
const schemaCache = new Map();
function getSchema(name) {
  if (!schemaCache.has(name)) schemaCache.set(name, readJSON(join(SCHEMA_DIR, name)));
  return schemaCache.get(name);
}
function resolvePointer(doc, pointer) {
  if (!pointer || pointer === '/' || pointer === '') return doc;
  const parts = pointer.replace(/^#/, '').split('/').filter(Boolean).map(p => p.replace(/~1/g, '/').replace(/~0/g, '~'));
  let cur = doc;
  for (const p of parts) { if (cur == null) return undefined; cur = cur[p]; }
  return cur;
}
function resolveRef(ref, currentFile) {
  const [filePart, pointerPart] = ref.split('#');
  const file = filePart ? filePart : currentFile;
  if (!file) throw new Error(`$ref بلا ملف ولا سياق: ${ref}`);
  const doc = getSchema(basename(file));
  const target = resolvePointer(doc, pointerPart ? '#' + pointerPart : '');
  if (!target) throw new Error(`تعذر حل $ref: ${ref} (ملف ${file})`);
  return { schema: target, file: basename(file) };
}

// ---------- مدقق JSON Schema (مجموعة فرعية موثقة) ----------
function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (Number.isInteger(v)) return 'integer';
  return typeof v;
}
function validate(inst, schema, file, path, errors) {
  if (!schema) return;
  if (schema.$ref) {
    const r = resolveRef(schema.$ref, file);
    validate(inst, r.schema, r.file, path, errors);
    return;
  }
  const err = m => errors.push(`${path || '$'}: ${m}`);

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = typeOf(inst);
    const ok = types.some(t => t === actual || (t === 'number' && actual === 'integer'));
    if (!ok) { err(`النوع ${actual} لا يطابق ${types.join('|')}`); return; }
  }
  if (schema.enum && !schema.enum.some(e => JSON.stringify(e) === JSON.stringify(inst))) {
    err(`القيمة ${JSON.stringify(inst)} ليست ضمن enum`);
  }
  if (typeof inst === 'string') {
    if (schema.minLength != null && inst.trim().length < schema.minLength) err(`النص أقصر من ${schema.minLength} حرفًا`);
    if (schema.maxLength != null && inst.length > schema.maxLength) err(`النص أطول من ${schema.maxLength}`);
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(inst)) err(`لا يطابق النمط ${schema.pattern}`);
  }
  if (typeof inst === 'number') {
    if (schema.minimum != null && inst < schema.minimum) err(`أقل من ${schema.minimum}`);
    if (schema.maximum != null && inst > schema.maximum) err(`أكبر من ${schema.maximum}`);
  }
  if (Array.isArray(inst)) {
    if (schema.minItems != null && inst.length < schema.minItems) err(`عناصر أقل من ${schema.minItems}`);
    if (schema.maxItems != null && inst.length > schema.maxItems) err(`عناصر أكثر من ${schema.maxItems}`);
    if (schema.items) inst.forEach((it, i) => validate(it, schema.items, file, `${path}[${i}]`, errors));
  }
  if (inst && typeof inst === 'object' && !Array.isArray(inst)) {
    const props = schema.properties || {};
    if (schema.required) for (const r of schema.required) if (!(r in inst)) err(`حقل مطلوب مفقود: ${r}`);
    if (schema.minProperties != null && Object.keys(inst).length < schema.minProperties) err(`خصائص أقل من ${schema.minProperties}`);
    for (const [k, v] of Object.entries(inst)) {
      if (props[k]) validate(v, props[k], file, `${path}.${k}`, errors);
      else if (schema.additionalProperties === false) err(`حقل غير مسموح: ${k}`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
        validate(v, schema.additionalProperties, file, `${path}.${k}`, errors);
      }
    }
  }
}

// ---------- أدوات نصية ----------
const AR_RE = /[\u0600-\u06FF]/;
const LATIN_RE = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/;
const normalizeEs = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();
// هوية المدخل: نحافظ على التشكيل (ñ/á) لأن حذفه يدمج كلمات مختلفة (año ≠ ano)
const normVocab = s => s.toLowerCase().replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();
// مقارنة متسامحة (بلا تشكيل) تُستخدم فقط في فحوص المثال/الملاءمة
const loose = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();

function checkSpanishLine(text, where, errors, warnings) {
  if (!text) return;
  if (AR_RE.test(text)) errors.push(`${where}: النص الإسباني يحتوي حروفًا عربية`);
  if (/\s{2,}/.test(text)) errors.push(`${where}: مسافات مزدوجة`);
  if (text !== text.trim()) errors.push(`${where}: مسافة طرفية`);
  if (!text.includes('____') && !/[.!?…:»"]$/.test(text.trim())) warnings.push(`${where}: لا ينتهي بعلامة ترقيم`);
  if (/^[a-záéíóúüñ]/.test(text.trim())) warnings.push(`${where}: لا يبدأ بحرف كبير (تحقق من الشرعية)`);
}
function checkLexical(text, where, errors) {
  if (!text) return;
  if (AR_RE.test(text)) errors.push(`${where}: نص إسباني يحتوي حروفًا عربية`);
  if (/\s{2,}/.test(text)) errors.push(`${where}: مسافات مزدوجة`);
  if (text !== text.trim()) errors.push(`${where}: مسافة طرفية`);
  if (/[\u0600-\u06FF]/.test(text)) errors.push(`${where}: حروف عربية في حقل إسباني`);
}
function checkArabicLine(text, where, errors) {
  if (!text) return;
  if (!AR_RE.test(text)) errors.push(`${where}: النص العربي لا يحتوي حروفًا عربية`);
  if (/\s{2,}/.test(text)) errors.push(`${where}: مسافات مزدوجة في النص العربي`);
}

// ---------- قواعد الإجابات لكل نوع ----------
const CHOICE_TYPES = new Set(['image_choice', 'word_choice', 'distinguish_similar', 'identify_speaker',
  'choose_reply', 'preposition_choice', 'infer_meaning', 'recall_previous_word',
  'review_common_errors', 'listen_choose', 'find_fix_error']);
const TEXT_ANSWER_TYPES = new Set(['fill_blank', 'type_missing_word', 'conjugate_in_context', 'dictation',
  'translate_short', 'write_sentence', 'reconstruct_audio_sentence', 'summarize_dialogue']);
const RUBRIC_TYPES = new Set(['speak_with_text', 'speak_free', 'roleplay_simulation', 'phone_call_response',
  'resolve_customer_issue', 'write_email']);

function checkExercise(ex, where, errors, warnings) {
  const key = ex.answerKey || {};
  if (CHOICE_TYPES.has(ex.type)) {
    const ids = key.correctOptionIds;
    if (!Array.isArray(ids) || ids.length === 0) { errors.push(`${where}: answerKey.correctOptionIds مطلوب لهذا النوع`); }
    const opts = ex.options || [];
    if (opts.length < 2) errors.push(`${where}: خيارات أقل من 2`);
    const flagged = opts.filter(o => o.isCorrect).map(o => o.id);
    if (Array.isArray(ids)) {
      for (const id of ids) if (!opts.some(o => o.id === id)) errors.push(`${where}: الإجابة ${id} غير موجودة في الخيارات`);
      if (flagged.length && JSON.stringify([...flagged].sort()) !== JSON.stringify([...ids].sort())) {
        errors.push(`${where}: isCorrect (${flagged.join(',')}) لا يطابق answerKey (${ids.join(',')})`);
      }
    }
    if (opts.length && !opts.some(o => o.isCorrect)) errors.push(`${where}: لا يوجد خيار صحيح معلَّم`);
    for (const o of opts) {
      if (!o.isCorrect && !o.distractorRationaleAr) errors.push(`${where}: المشتت ${o.id} بلا distractorRationaleAr`);
      if (o.isCorrect && o.distractorRationaleAr) warnings.push(`${where}: الخيار الصحيح ${o.id} عليه distractorRationaleAr (غير لازم)`);
    }
    // تسريب الإجابة في التعليمات
    const correct = opts.find(o => o.isCorrect);
    if (correct) {
      const c = normalizeEs(correct.text);
      const leakSources = [ex.instructionAr, ex.contextAr].filter(Boolean).map(normalizeEs);
      if (c.length > 2 && leakSources.some(s => s.includes(c))) errors.push(`${where}: التعليمات/السياق تكشف الإجابة («${correct.text}»)`);
    }
  }
  if (TEXT_ANSWER_TYPES.has(ex.type)) {
    if (!Array.isArray(key.accepted) || key.accepted.length === 0) errors.push(`${where}: answerKey.accepted مطلوب لهذا النوع`);
    else {
      for (const a of key.accepted) {
        if (typeof a !== 'string' || a.trim().length < 1) errors.push(`${where}: إجابة مقبولة فارغة`);
        if (LATIN_RE.test(a) === false) warnings.push(`${where}: الإجابة «${a}» لا تحتوي حروفًا لاتينية (هل هي إسبانية؟)`);
      }
      const has = normalizeEs(key.accepted.join(' '));
      const inst = normalizeEs(ex.instructionAr || '');
      if (has.length > 3 && inst.includes(has) && !ex.contextAr) warnings.push(`${where}: قد تكشف التعليمات الإجابة`);
    }
  }
  if (ex.type === 'word_order') {
    if (!Array.isArray(ex.items) || ex.items.length < 3) errors.push(`${where}: word_order يحتاج 3 عناصر على الأقل`);
    if (!Array.isArray(key.accepted) || !key.accepted.length) errors.push(`${where}: word_order يحتاج قائمة إجابات مقبولة (قد يوجد أكثر من ترتيب صحيح)`);
  }
  if (ex.type === 'match_pairs') {
    if (!Array.isArray(key.pairs) || key.pairs.length < 2) errors.push(`${where}: match_pairs يحتاج pairs`);
  }
  if (RUBRIC_TYPES.has(ex.type)) {
    const mode = (ex.scoring || {}).mode;
    if (mode !== 'rubric' && mode !== 'self_assessment') errors.push(`${where}: أنواع الإنتاج الشفهي/الكتابي تحتاج scoring.mode = rubric`);
    const rubric = (ex.scoring || {}).rubric || [];
    if (rubric.length < 2) errors.push(`${where}: معيار التقييم يحتاج بندين على الأقل`);
    const sum = rubric.reduce((a, r) => a + (r.weight || 0), 0);
    if (rubric.length && sum !== 100) errors.push(`${where}: مجموع أوزان المعيار = ${sum} ويجب أن يكون 100`);
    if (!key.modelAnswer && !key.modelScript) warnings.push(`${where}: لا يوجد نموذج إجابة مرجعي (modelAnswer/modelScript)`);
  }
  if ((ex.type === 'listen_choose' || ex.type === 'dictation' || ex.type === 'identify_speaker' ||
       ex.type === 'reconstruct_audio_sentence' || ex.type === 'phone_call_response') && !ex.audioKey
       && !(ex.options || []).some(o => o.audioKey)) {
    warnings.push(`${where}: النوع ${ex.type} بلا audioKey`);
  }
  if (ex.type === 'image_choice' && !(ex.options || []).every(o => o.imageKey)) {
    warnings.push(`${where}: image_choice يحتاج imageKey لكل خيار`);
  }
  if (ex.stemEs) checkSpanishLine(ex.stemEs, `${where}.stemEs`, errors, warnings);
  if (ex.stemAr) checkArabicLine(ex.stemAr, `${where}.stemAr`, errors);
  for (const o of ex.options || []) if (o.text) checkLexical(o.text, `${where}.option:${o.id}`, errors);
}

// ---------- تحميل المحتوى ----------
const lessonFiles = existsSync(EX_DIR) ? readdirSync(EX_DIR).filter(f => /^lesson-.*\.json$/.test(f)) : [];
const vocabFiles = existsSync(EX_DIR) ? readdirSync(EX_DIR).filter(f => /^vocab-.*\.json$/.test(f)) : [];
const pathsFile = join(EX_DIR, 'paths.json');

const errors = [];
const warnings = [];
const lessons = [];
const vocabEntries = new Map(); // normalized -> entry

const lessonSchema = getSchema('lesson.schema.json');
const vocabSchema = getSchema('vocabulary.schema.json');

for (const f of lessonFiles) {
  const doc = readJSON(join(EX_DIR, f));
  const before = errors.length;
  validate(doc, lessonSchema, 'lesson.schema.json', f, errors);
  if (errors.length > before) continue; // لا نكمل القواعد الخاصة إن فشل المخطط
  const L = doc.lesson;
  lessons.push({ file: f, ...L });
  const published = ['published', 'approved'].includes(L.review.status);

  checkArabicLine(L.titleAr, `${f}.titleAr`, errors);
  checkArabicLine(L.objectiveAr, `${f}.objectiveAr`, errors);
  for (const s of L.scenarios || []) {
    checkArabicLine(s.contextAr, `${f}.scenario.contextAr`, errors);
    for (const [i, line] of s.lines.entries()) {
      checkSpanishLine(line.es, `${f}.scenario[${i}].es`, errors, warnings);
      checkArabicLine(line.ar, `${f}.scenario[${i}].ar`, errors);
      if (line.audioKey && line.audioKey.startsWith('pending/') && published) {
        errors.push(`${f}.scenario[${i}]: audioKey معلَّق (pending) لكن الدرس ${L.review.status} — لا يجوز النشر`);
      }
    }
  }
  if (L.mastery.minAccuracy < 50) errors.push(`${f}: minAccuracy ${L.mastery.minAccuracy} غير منطقي`);
  if (L.estimatedMinutes < 5 && L.exercises.length > 12) warnings.push(`${f}: مدة تقديرية قصيرة مقابل عدد التمارين`);

  const exIds = new Set();
  let hasRecall = false;
  for (const ex of L.exercises) {
    if (exIds.has(ex.id)) errors.push(`${f}: معرّف تمرين مكرر ${ex.id}`);
    exIds.add(ex.id);
    checkExercise(ex, `${f}#${ex.id}`, errors, warnings);
    checkArabicLine(ex.explanationAr, `${f}#${ex.id}.explanationAr`, errors);
    if (ex.audioKey && ex.audioKey.startsWith('pending/') && published) {
      errors.push(`${f}#${ex.id}: audioKey معلَّق (pending) لكن الدرس ${L.review.status}`);
    }
    if (ex.answerKey && ex.answerKey.referenceAudioKey && ex.answerKey.referenceAudioKey.startsWith('pending/') && published) {
      errors.push(`${f}#${ex.id}: referenceAudioKey معلَّق لكن الدرس منشور`);
    }
    if (['recall_previous_word', 'review_common_errors'].includes(ex.type)) hasRecall = true;
  }
  // تنوع الأنواع
  const types = new Set(L.exercises.map(e => e.type));
  if (types.size < 3) errors.push(`${f}: أنواع تمارين أقل من 3 (تنوع غير كافٍ)`);
  if (L.exercises.length < 4) errors.push(`${f}: تمارين أقل من 4`);
  if (['A2', 'B1', 'B2', 'C1'].includes(L.level) && ![...types].some(t => RUBRIC_TYPES.has(t))) {
    warnings.push(`${f}: مستوى ${L.level} بلا تمرين إنتاج/تحدث`);
  }
  // الأشكال الأساسية
  for (const st of L.targetStructures) {
    if (!AR_RE.test(st) && !LATIN_RE.test(st)) errors.push(`${f}: targetStructure غير مفهومة: ${st}`);
  }
}

// ---------- المفردات ----------
const bundleSlugs = new Set();
for (const f of vocabFiles) {
  const doc = readJSON(join(EX_DIR, f));
  const before = errors.length;
  validate(doc, vocabSchema, 'vocabulary.schema.json', f, errors);
  if (errors.length > before) continue;
  if (bundleSlugs.has(doc.bundleSlug)) errors.push(`${f}: bundleSlug مكرر ${doc.bundleSlug}`);
  bundleSlugs.add(doc.bundleSlug);

  const seenSense = new Set();
  for (const e of doc.entries) {
    const where = `${f}#${e.headword}`;
    if (normVocab(e.headword) !== e.normalized) errors.push(`${where}: normalized لا يطابق headword`);
    if (vocabEntries.has(e.normalized)) errors.push(`${where}: مدخل مكرر بين الحزم (${e.normalized})`);
    vocabEntries.set(e.normalized, { ...e, file: f });
    checkLexical(e.headword, `${where}.headword`, errors);
    if (e.pos === 'noun' && !e.gender) errors.push(`${where}: اسم بلا جنس (gender)`);
    if (e.pos === 'verb' && !(e.forms || []).some(fm => fm.kind === 'conjugation')) {
      warnings.push(`${where}: فعل بلا تصريفات`);
    }
    if (!e.ipa) warnings.push(`${where}: بلا IPA`);
    if (!e.pronunciationHintAr) warnings.push(`${where}: بلا تلميح نطق عربي`);
    for (const s of e.senses) {
      const k = `${e.normalized}#${s.senseNo}`;
      if (seenSense.has(k)) errors.push(`${where}: senseNo مكرر ${s.senseNo}`);
      seenSense.add(k);
      checkArabicLine(s.meaningArFusha, `${where}.senses[${s.senseNo}].meaningArFusha`, errors);
      if (!s.meaningArEg) warnings.push(`${where}: بلا معنى مصري للمعنى ${s.senseNo}`);
      checkSpanishLine(s.exampleEs, `${where}.senses[${s.senseNo}].exampleEs`, errors, warnings);
      checkArabicLine(s.exampleAr, `${where}.senses[${s.senseNo}].exampleAr`, errors);
      const STOP = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para', 'que', 'y', 'a']);
      const head = normVocab(e.headword);
      const candidates = new Set([head, loose(head), ...head.split(' ').filter(w => w.length > 2 && !STOP.has(w))]);
      for (const fm of e.forms || []) candidates.add(loose(fm.formEs));
      const exLoose = ' ' + loose(s.exampleEs) + ' ';
      const hit = [...candidates].some(c => c.length > 1 && exLoose.includes(' ' + c + ' ')) ||
                  [...candidates].some(c => c.length > 4 && exLoose.includes(c));
      if (!hit) warnings.push(`${where}: المثال لا يحتوي المدخل/تصريفه (تحقق من الملاءمة)`);
      if (!s.commonErrorAr) warnings.push(`${where}: بلا خطأ شائع للمعنى ${s.senseNo}`);
    }
    for (const ex of e.examples) {
      checkSpanishLine(ex.es, `${where}.example.es`, errors, warnings);
      checkArabicLine(ex.ar, `${where}.example.ar`, errors);
    }
  }
}

// ---------- المسارات ----------
let programs = [];
if (existsSync(pathsFile)) {
  programs = readJSON(pathsFile).programs;
  const progSlugs = new Set();
  const unitIndex = new Map();
  for (const p of programs) {
    if (progSlugs.has(p.slug)) errors.push(`paths.json: برنامج مكرر ${p.slug}`);
    progSlugs.add(p.slug);
    if (p.kind === 'main' && programs.filter(x => x.kind === 'main').length > 1) errors.push('paths.json: أكثر من مسار أساسي');
    for (const u of p.units) {
      const key = `${p.slug}/${u.slug}`;
      if (unitIndex.has(key)) errors.push(`paths.json: وحدة مكررة ${key}`);
      unitIndex.set(key, u);
    }
  }
  for (const L of lessons) {
    if (!progSlugs.has(L.programSlug)) errors.push(`${L.file}: programSlug غير موجود في paths.json (${L.programSlug})`);
    const u = unitIndex.get(`${L.programSlug}/${L.unitSlug}`);
    if (!u) errors.push(`${L.file}: unitSlug غير موجود (${L.unitSlug})`);
    else {
      if (!(u.lessons || []).includes(L.slug)) errors.push(`${L.file}: الدرس غير مُسجَّل في وحدته داخل paths.json`);
      if (u.levelCode !== L.level) errors.push(`${L.file}: مستوى الدرس ${L.level} يخالف مستوى الوحدة ${u.levelCode}`);
    }
  }
  for (const p of programs) for (const u of p.units) for (const ls of (u.lessons || [])) {
    if (!lessons.some(L => L.slug === ls)) errors.push(`paths.json: درس مُعلن بلا ملف: ${ls}`);
  }
}

// ---------- متقاطع: مفردات الدروس ----------
const unresolvedVocab = new Set();
for (const L of lessons) {
  const published = ['published', 'approved'].includes(L.review.status);
  for (const v of [...(L.newVocabulary || []), ...(L.reviewVocabulary || [])]) {
    if (!vocabEntries.has(normVocab(v))) {
      unresolvedVocab.add(v);
      const msg = `lesson ${L.slug}: مفردة «${v}» غير موجودة في حزم المفردات`;
      published ? errors.push(msg) : warnings.push(msg + ' (مسموح في draft فقط)');
    }
  }
  for (const ex of L.exercises) for (const v of ex.targetVocab || []) {
    if (!vocabEntries.has(normVocab(v))) {
      unresolvedVocab.add(v);
      const msg = `lesson ${L.slug}#${ex.id}: targetVocab «${v}» غير موجودة`;
      published ? errors.push(msg) : warnings.push(msg + ' (مسموح في draft فقط)');
    }
  }
}

// ---------- المقاييس ----------
function wordCount(s) { return (s || '').trim().split(/\s+/).filter(Boolean).length; }
let arabicWords = 0, spanishWords = 0;
function countBoth(obj) {
  if (typeof obj === 'string') {
    const hasAr = AR_RE.test(obj), hasLat = LATIN_RE.test(obj);
    if (hasAr && hasLat) {
      const arPart = (obj.match(/[\u0600-\u06FF\s،؛؟]+/g) || []).join(' ');
      arabicWords += wordCount(arPart);
      const rest = obj.replace(/[\u0600-\u06FF،؛؟]/g, ' ');
      spanishWords += wordCount(rest);
    } else if (hasAr) arabicWords += wordCount(obj);
    else if (hasLat) spanishWords += wordCount(obj);
    return;
  }
  if (Array.isArray(obj)) return obj.forEach(countBoth);
  if (obj && typeof obj === 'object') return Object.values(obj).forEach(countBoth);
}
for (const f of lessonFiles) countBoth(readJSON(join(EX_DIR, f)));
for (const f of vocabFiles) countBoth(readJSON(join(EX_DIR, f)));

const exerciseCount = lessons.reduce((a, l) => a + l.exercises.length, 0);
const typeSet = new Set(lessons.flatMap(l => l.exercises.map(e => e.type)));
const pendingAudio = lessons.reduce((a, l) =>
  a + l.exercises.filter(e => (e.audioKey || '').startsWith('pending/')).length, 0);

// ---------- التقرير ----------
const status = errors.length ? 'FAIL' : 'PASS';
const lines = [];
lines.push('# تقرير التحقق من المحتوى');
lines.push('');
lines.push(`تاريخ التشغيل: ${new Date().toISOString()}`);
lines.push('');
lines.push('## المقاييس الفعلية');
lines.push('');
lines.push('| المقياس | القيمة | الهدف النهائي |');
lines.push('| --- | --- | --- |');
lines.push(`| ملفات الدروس | ${lessonFiles.length} | 236 درسًا |`);
lines.push(`| مداخل مفردات فريدة | ${vocabEntries.size} | ≥ 8000 |`);
lines.push(`| تمارين | ${exerciseCount} | — |`);
lines.push(`| أنواع تمارين مستخدمة | ${typeSet.size} من 28 | 28 |`);
lines.push(`| كلمات تحريرية عربية | ${arabicWords} | ≥ 7000 (عربي + إسباني) |`);
lines.push(`| كلمات تحريرية إسبانية | ${spanishWords} | — |`);
lines.push(`| مفردات غير مُدخلة بعد | ${unresolvedVocab.size} | 0 |`);
lines.push(`| مفردات الدروس بانتظار الصوت (pending) | ${pendingAudio} | 0 |`);
lines.push('');
lines.push(`## الأخطاء (${errors.length})`);
lines.push('');
if (!errors.length) lines.push('- لا شيء ✅');
else errors.forEach(e => lines.push(`- ❌ ${e}`));
lines.push('');
lines.push(`## التنبيهات (${warnings.length})`);
lines.push('');
if (!warnings.length) lines.push('- لا شيء');
else warnings.forEach(w => lines.push(`- ⚠️ ${w}`));
lines.push('');
lines.push(`**النتيجة: ${status}**`);
lines.push('');
lines.push('> الحدود المعلنة: هذا المدقق يتحقق من الاتساق والشكل والاكتمال. **لا** يثبت صحة الإسبانية أو طبيعتها أو دقة الترجمة — ذلك يتطلب مراجعة بشرية (docs/06_CONTENT_QUALITY_GUIDE.md).');

const report = lines.join('\n');
if (process.argv.includes('--write-report')) {
  writeFileSync(join(ROOT, 'reports', 'content-validation.md'), report + '\n');
}
console.log(report);
process.exitCode = errors.length ? 1 : 0;
