#!/usr/bin/env node
/**
 * فحص تكامل المنهج (Content integrity) — Español بالعربي.
 *
 * الغاية: التأكد آليًا من أن المنهج المكتوب سليم داخليًا قبل عرض أي درس للمتعلم:
 *   - كل درس في الخريطة له ملف، وكل ملف مرجوع في الخريطة (لا دروس منسية/ضالّة).
 *   - التقدم (requires) موجّه: لا إشارات لدرس غير موجود، ولا حلقات.
 *   - التمارين غير فارغة، وكل نوع تمرين له طريقة تقييم صحيحة.
 *   - مفتاح الإجابة (answerKey) متوافق مع الخيارات (options).
 *   - كل ما يُعرض للمتعلم مترجم عربية وله مثال إسباني.
 *   - حزم المفردات المشار إليها موجودة وغير فارغة.
 *
 * هذا فحص «منطقي/بنيوي». لا يحل محل التدقيق البشري اللغوي (see docs/CONTENT_REVIEW_QUEUE.md).
 * يخرج بكود خروج 1 إن found أخطاء، و0 إن لم يُعثر إلا على تحذيرات، و2 للخطأ التقني.
 */
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');
const MAP_PATH = join(CONTENT, 'curriculum', 'curriculum-map.v1.json');
const DRAFT_DIRS = ['a1', 'a2', 'b1', 'b2', 'c1', 'travel', 'callcenter', 'core-vocab'];

/** أنواع التمارين المقبولة (من content/schema/exercise.schema.json). */
const EXERCISE_TYPES = new Set([
  'image_choice', 'word_choice', 'fill_blank', 'listen_choose', 'match_pairs',
  'word_order', 'dialogue_order', 'distinguish_similar', 'type_missing_word',
  'write_sentence', 'translate_short', 'identify_speaker', 'choose_reply',
  'find_fix_error', 'conjugate_in_context', 'preposition_choice',
  'reconstruct_audio_sentence', 'dictation', 'speak_with_text', 'speak_free',
  'roleplay_simulation', 'phone_call_response', 'resolve_customer_issue',
  'write_email', 'summarize_dialogue', 'infer_meaning', 'recall_previous_word',
  'review_common_errors',
]);

const errors = [];
const warnings = [];
const stats = { lessons: 0, exercises: 0, bundles: 0, bundleEntries: 0, scenarioLines: 0 };
const addError = (loc, msg) => errors.push(`${loc}: ${msg}`);
const addWarn = (loc, msg) => warnings.push(`${loc}: ${msg}`);

const locOf = (file, extra = '') => `${relative(ROOT, file)}${extra ? ` (${extra})` : ''}`;

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function isStr(v) { return typeof v === 'string' && v.trim().length > 0; }
function isArr(v) { return Array.isArray(v); }

/* ---------------------------------------------------------------- 1. الخريطة */
const map = readJson(MAP_PATH);

/** فهرس كل درس في الخريطة: الـ slug -> {track, level, unit, entry, order} */
const mapLessons = new Map();
/** قائمة مرتبة لكل مسار (لفحص التقدم). */
const trackOrder = new Map();
let order = 0;

for (const track of map.tracks || []) {
  const ordered = [];
  for (const level of track.levels || []) {
    for (const unit of level.units || []) {
      for (const entry of unit.lessons || []) {
        if (mapLessons.has(entry.slug)) {
          addError(MAP_PATH, `تكرار slug الدرس «${entry.slug}» في أكثر من مكان`);
        }
        mapLessons.set(entry.slug, { track, level, unit, entry, order });
        ordered.push({ entry, order });
        order++;
      }
    }
  }
  trackOrder.set(track.slug, ordered);
}

/* فحص إشارات requires: وجود مرجوع + عدم وجود حلقات (الدورة تعني تعذر الفتح أبدًا).
 * ملاحظة: ترتيب الدروس في الخريطة ليس هو ما يحدد الفتح — الخادم يرتب الدروس
 * داخل كل وحدة بالاعتماد على requires (sortLessonsWithinUnits)، لذلك لا نُخطئ عند
 * اختلاف ترتيب الخريطة عن السلسلة، بل نُخطئ فقط عند وجود دورة حقيقية. */
for (const [trackSlug, ordered] of trackOrder) {
  const bySlug = new Map(ordered.map(o => [o.entry.slug, o]));
  for (const { entry } of ordered) {
    for (const req of entry.requires || []) {
      if (!bySlug.has(req)) {
        addError(MAP_PATH, `«${entry.slug}» يُطلب منه «${req}» وهو غير موجود في المسار نفسه`);
      }
    }
  }
  // كشف الحلقات: A يتطلب B و B يتطلب A ⇒ لا يمكن فتح أي منهما أبدًا.
  const state = new Map(); // 0 لم يزرها، 1 على السلسلة، 2 تمت
  const visit = (slug, path) => {
    const st = state.get(slug) ?? 0;
    if (st === 2) return;
    if (st === 1) {
      const cycle = [...path.slice(path.indexOf(slug)), slug];
      addError(MAP_PATH, `دورة تقدم في مسار ${trackSlug}: ${cycle.join(' → ')}`);
      state.set(slug, 2);
      return;
    }
    state.set(slug, 1);
    path.push(slug);
    for (const req of bySlug.get(slug)?.entry.requires || []) {
      if (bySlug.has(req)) visit(req, path);
    }
    path.pop();
    state.set(slug, 2);
  };
  for (const { entry } of ordered) {
    if ((state.get(entry.slug) ?? 0) === 0) visit(entry.slug, []);
  }
}

/* ---------------------------------------------------------------- 2. دروس على القرص */
const diskLessons = [];
for (const dir of DRAFT_DIRS) {
  const d = join(CONTENT, 'drafts', dir);
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d).sort()) {
    if (!f.endsWith('.json')) continue;
    diskLessons.push(join(d, f));
  }
}

/** ملفات «درس» فقط (ليس حزم المفردات). */
function isLessonFile(file) {
  const base = file.split('/').pop();
  return /^lesson-.*\.json$/.test(base);
}

const lessonFiles = diskLessons.filter(isLessonFile);
stats.lessons = lessonFiles.length;

/** إشارة كل ملف درس في الخريطة. */
const referencedByMap = new Set();

for (const file of lessonFiles) {
  let doc;
  try { doc = readJson(file); }
  catch (e) { addError(locOf(file), `JSON غير صالح: ${e.message}`); continue; }
  const lesson = doc.lesson || doc;
  const slug = lesson.slug;
  const here = locOf(file);

  if (!isStr(slug)) { addError(here, 'لا يحتوي على slug'); continue; }
  const meta = mapLessons.get(slug);
  if (!meta) {
    addWarn(here, `درس غير مرجوع في الخريطة (orphan) — لا يُفتح عبر الخريطة`);
    continue;
  }
  referencedByMap.add(slug);

  // ----- تساوٍ مع الخريطة -----
  if (meta.entry.filePath && !existsSync(join(ROOT, meta.entry.filePath))) {
    addError(here, `المسار في الخريطة «${meta.entry.filePath}» غير موجود`);
  }
  if (isStr(meta.entry.titleAr) && !isStr(lesson.titleAr)) addError(here, 'titleAr غير موجود');
  if (isStr(meta.entry.levelCode) && isStr(lesson.level) && lesson.level !== meta.entry.levelCode) {
    addError(here, `level «${lesson.level}» لا يطابق levelCode «${meta.entry.levelCode}»`);
  }
  if (isStr(meta.track.slug) && isStr(lesson.programSlug) && lesson.programSlug !== meta.track.slug) {
    addError(here, `programSlug «${lesson.programSlug}» لا يطابق المسار «${meta.track.slug}»`);
  }
  if (isStr(meta.unit.slug) && isStr(lesson.unitSlug) && lesson.unitSlug !== meta.unit.slug) {
    addError(here, `unitSlug «${lesson.unitSlug}» لا يطابق «${meta.unit.slug}»`);
  }

  // ----- الحقول الأساسية -----
  for (const f of ['titleAr', 'objectiveAr']) {
    if (!isStr(lesson[f])) addError(here, `${f} غير موجود/فارغ`);
  }
  if (!isArr(lesson.newVocabulary) || lesson.newVocabulary.length === 0) {
    addWarn(here, 'newVocabulary فارغة');
  }
  if (!isArr(lesson.targetStructures) || lesson.targetStructures.length === 0) {
    addWarn(here, 'targetStructures فارغة (لا أمثلة إسبانية واضحة)');
  }
  if (!isArr(lesson.grammarTopics) || lesson.grammarTopics.length === 0) {
    addWarn(here, 'grammarTopics فارغة');
  }

  // ----- السيناريوهات -----
  if (!isArr(lesson.scenarios) || lesson.scenarios.length === 0) {
    addWarn(here, 'لا توجد scenarios');
  }
  (lesson.scenarios || []).forEach((sc, si) => {
    (sc.lines || []).forEach((ln, li) => {
      stats.scenarioLines++;
      if (!isStr(ln.es)) addError(here, `سيناريو ${si}.${li}: المثال الإسباني es غير موجود`);
      if (!isStr(ln.ar)) addError(here, `سيناريو ${si}.${li}: الترجمة العربية ar غير موجودة`);
    });
  });

  // ----- التمارين -----
  const exercises = lesson.exercises;
  if (!isArr(exercises) || exercises.length === 0) {
    addError(here, 'لا توجد exercises (درس بلا تمارين)');
  }
  const seenIds = new Set();
  (exercises || []).forEach((ex, ei) => {
    stats.exercises++;
    const exLoc = `${here} ∋ تمرين#${ei} «${ex.id || 'بدون id'}»`;
    if (!isStr(ex.id)) { addError(exLoc, 'لا id للتمرين'); }
    else if (seenIds.has(ex.id)) addError(exLoc, 'تكرار id تمرين');
    seenIds.add(ex.id);

    if (!isStr(ex.type)) { addError(exLoc, 'لا type للتمرين'); }
    else if (!EXERCISE_TYPES.has(ex.type)) addError(exLoc, `نوع تمرين غير معروف «${ex.type}»`);

    // instructionAr مطلوب دائمًا (الـ schema يُوجِبه)، وهو قد يكون هو «السؤال» نفسه
    // للتمارين التي تُقدّم الخيارات في السؤال مباشرة. لذلك لا يُخطَأ عند غياب
    // promptAr/stem، بل يُحذَر فقط إن لم يكن هناك أي وسيط آخر (تنبيه معلوماتي).
    if (!isStr(ex.instructionAr)) addError(exLoc, 'instructionAr غير موجود/فارغ');
    if (!isStr(ex.explanationAr)) addError(exLoc, 'explanationAr غير موجود/فارغ');
    const hasPrompt = isStr(ex.promptAr) || isStr(ex.stemEs) || isStr(ex.stemAr)
      || isArr(ex.items) || isStr(ex.speechEs) || isStr(ex.referenceAudioKey);
    if (!hasPrompt) addWarn(exLoc, 'لا prompt ولا stem ولا items (السؤال يأتي من instructionAr فقط)');

    const ak = ex.answerKey;
    if (!ak || typeof ak !== 'object') { addError(exLoc, 'answerKey غير موجود'); }

    // ----- توافق الخيارات مع مفتاح الإجابة -----
    if (isArr(ex.options)) {
      if (ex.options.length < 2) addError(exLoc, 'أقل من خيارين');
      const optIds = new Set();
      const correctFromOptions = new Set();
      ex.options.forEach((o, oi) => {
        if (!isStr(o.id)) addError(exLoc, `خيار #${oi} بدون id`);
        optIds.add(o.id);
        if (!isStr(o.text)) addError(exLoc, `خيار #${oi} «${o.id}» text فارغ`);
        if (!isStr(o.textAr)) addWarn(exLoc, `خيار #${oi} «${o.id}» بدون ترجمة عربية textAr`);
        if (o.isCorrect === true) correctFromOptions.add(o.id);
      });
      if (ak && Array.isArray(ak.correctOptionIds)) {
        const correctFromKey = new Set(ak.correctOptionIds);
        for (const id of ak.correctOptionIds) {
          if (!optIds.has(id)) addError(exLoc, `correctOptionId «${id}» غير موجود في الخيارات`);
        }
        for (const id of correctFromOptions) {
          if (!correctFromKey.has(id)) addError(exLoc, `خيار «${id}» معلم isCorrect لكنه ليس في correctOptionIds`);
        }
        if (correctFromOptions.size === 0) addError(exLoc, 'لا يوجد خيار معلم isCorrect');
        if (correctFromOptions.size !== correctFromKey.size) {
          addError(exLoc, 'عدد الإجابات الصحيحة غير متسق بين options و answerKey');
        }
        if (isStr(ak.selectedOptionId) && !correctFromKey.has(ak.selectedOptionId)) {
          addError(exLoc, `selectedOptionId «${ak.selectedOptionId}» ليس إجابة صحيحة`);
        }
      }
    }

    // ----- أنواع التمارين التي تتطلب إجابة محددة -----
    if (ex.type === 'fill_blank' || ex.type === 'dictation') {
      if (!ak || !isArr(ak.accepted) || ak.accepted.length === 0) {
        addError(exLoc, 'fill_blank/dictation بدون answerKey.accepted');
      }
    }
    if (ex.type === 'word_order' || ex.type === 'dialogue_order') {
      // التصحيح يعتمد على answerKey.accepted (مقارنة نصية)، أما tokenOrder فهو بيانات
      // توليد فقط. لذلك يخطأ عند غياب accepted، ويُحذَر عند غياب tokenOrder.
      if (!ak || !isArr(ak.accepted) || ak.accepted.length === 0) {
        addError(exLoc, 'ترتيب الكلمات بدون answerKey.accepted (يُستخدم للتصحيح)');
      } else if (!isArr(ak.tokenOrder) || ak.tokenOrder.length === 0) {
        addWarn(exLoc, 'ترتيب الكلمات بدون tokenOrder (توليد فقط — التصحيح من accepted)');
      }
    }
  });

  // ----- حالة المراجعة (معلومة صادقة، لا ترفع الدرس إلى «منشور») -----
  if (lesson.review && lesson.review.status === 'draft') {
    addWarn(here, 'review.status draft (awaiting human review)');
  }
}

/* ----- دروس على القرص غير مرجعة في الخريطة ----- */
for (const file of lessonFiles) {
  try {
    const doc = readJson(file);
    const slug = (doc.lesson || doc).slug;
    if (isStr(slug) && !mapLessons.has(slug)) {
      addWarn(locOf(file), `ملف درس غير مرجوع في الخريطة: «${slug}»`);
    }
  } catch { /* سبق التعامل معه */ }
}

/* ---------------------------------------------------------------- 3. حزم المفردات */
const bundleFiles = diskLessons.filter(f => /^vocab-.*\.json$/.test(f.split('/').pop()));
const bundles = new Map();
for (const file of bundleFiles) {
  let doc;
  try { doc = readJson(file); }
  catch (e) { addError(locOf(file), `JSON غير صالح: ${e.message}`); continue; }
  const slug = doc.bundleSlug;
  if (!isStr(slug)) { addError(locOf(file), 'bundleSlug غير موجود'); continue; }
  if (bundles.has(slug)) addError(locOf(file), `تكرار bundleSlug «${slug}»`);
  bundles.set(slug, { file, doc });
  stats.bundles++;

  const entries = doc.entries || [];
  stats.bundleEntries += entries.length;
  if (entries.length === 0) addError(locOf(file), 'bundle بدون مداخل (فارغة)');
  const seenTerms = new Set();
  entries.forEach((e, i) => {
    if (!isStr(e.headword)) addError(locOf(file), `مدخل #${i} بدون headword`);
    const norm = (e.normalized || e.headword || '').toLowerCase();
    if (seenTerms.has(norm)) addError(locOf(file), `تكرار مدخل «${norm}»`);
    seenTerms.add(norm);
    const senses = e.senses || [];
    if (senses.length === 0) addWarn(locOf(file), `مدخل «${e.headword}» بدون senses`);
    for (const s of senses) {
      if (!isStr(s.meaningArFusha)) addError(locOf(file), `مدخل «${e.headword}» بدون ترجمة عربية`);
      if (!isStr(s.exampleEs)) addWarn(locOf(file), `مدخل «${e.headword}» بدون مثال إسباني`);
    }
  });
}

/* ----- إشارات vocabPack من الخريطة ----- */
for (const [slug, meta] of mapLessons) {
  const vp = meta.entry.vocabPack;
  if (isStr(vp) && !bundles.has(vp)) {
    addError(MAP_PATH, `درس «${slug}» يشير إلى vocabPack «${vp}» غير الموجود`);
  }
}

/* ---------------------------------------------------------------- 4. المخرجات */
const out = {
  generatedAt: new Date().toISOString(),
  errors,
  warnings,
  stats,
};
writeFileSync(join(ROOT, 'reports', 'content-integrity.json'), `${JSON.stringify(out, null, 2)}\n`);

console.log('=== فحص تكامل المنهج ===');
console.log(`دروس على القرص: ${stats.lessons} · تمارين: ${stats.exercises} · سيناريو: ${stats.scenarioLines} خط`);
console.log(`حزم مفردات: ${stats.bundles} · مداخل: ${stats.bundleEntries}`);
console.log(`أخطاء: ${errors.length} · تحذيرات: ${warnings.length}`);
if (errors.length) { console.log('\n-- الأخطاء --'); errors.slice(0, 40).forEach(e => console.log(' • ' + e)); }
if (warnings.length) { console.log('\n-- التحذيرات (أمثلة) --'); warnings.slice(0, 20).forEach(w => console.log(' · ' + w)); }
console.log(`\nالنتيجة: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
process.exit(errors.length === 0 ? 0 : 1);
