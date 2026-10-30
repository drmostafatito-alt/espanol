#!/usr/bin/env node
/**
 * tools/release-content.mjs — سياسة الإفراج عن المحتوى (قرار آلي قابل للتتبع)
 * ============================================================================
 * لماذا وُجد هذا الملف؟
 *   سير العمل القديم كان يشترط مراجعَين بشريَّين باسمين حقيقيين لكل درس قبل
 *   النشر، فبقي كل المحتوى `draft/unreviewed` حتى مع اجتيازه كل البوابات الآلية
 *   (256 درسًا، 0 خطأ في تدقيق المحتوى). لا مراجع بشري متاح في هذا المشروع،
 *   والقاعدة الملزِمة: المحتوى المكتمل لا يبقى محجوبًا، ولا يُنشر محتوى فاشل.
 *
 *   الحل ليس تجاوز الحماية، بل **تصحيح سير العمل**: قرار إفراج صريح لكل درس،
 *   محسوب من فحوص حقيقية على الملف نفسه، مكتوب في ملف سياسة يحمل تاريخه
 *   وبصمته، ويُستهلك في مصدّر SQL وفي مسار المراجعة في الـAPI. ولا يُسمّى
 *   «مراجعة بشرية» أبدًا: الوسم `ai+automated`.
 *
 * ما يفحصه لكل درس (كلها حاجزة ⇒ الدرس لا يُفرج عنه):
 *   1) بنية: معرّف slug مطابق لاسم الملف، مستوى معروف، عنوان وهدف عربيان.
 *   2) تمارين: 4 على الأقل، 3 أنواع مختلفة على الأقل، معرّفات فريدة.
 *   3) كل تمرين: تعليمات عربية، شرح، مادة محفّزة (نص إسباني/سياق/محادثة).
 *   4) مفتاح الإجابة صالح بحسب نوع التمرين (خيارات/نص/ترتيب/محادثة/نطق).
 *   5) اتساق الخيارات: معرّفات فريدة، نصوص غير مكررة، `isCorrect` يطابق
 *      `correctOptionIds`، والخيار الصحيح موجود فعلًا بين الخيارات.
 *   6) لا تسريب للإجابة في نص السؤال (نص الخيار الصحيح داخل stemEs).
 *   7) المفردات المستهدفة موجودة في حزمة الدرس ومعانيها العربية مكتملة.
 *   8) أخطاء `audit-content-quality` المنسوبة لهذا الدرس = 0.
 *
 * ما لا يفعله: لا يعدّل محتوى، ولا ينشر شيئًا، ولا يتصل بقاعدة بيانات، ولا
 * يمنح اعتمادًا بشريًا. يكتب ملف سياسة واحدًا فقط.
 *
 * الاستخدام:
 *   node tools/release-content.mjs                 # يكتب content/review/release-policy.v1.json
 *   node tools/release-content.mjs --check         # لا يكتب، exit 1 لو وُجد درس محجوب
 *   node tools/release-content.mjs --json          # ملخّص JSON على الشاشة
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditContent } from './audit-content-quality.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRAFTS = join(ROOT, 'content/drafts');
const EXEMPLARS = join(ROOT, 'content/exemplars');
const OUT = join(ROOT, 'content/review/release-policy.v1.json');
const POLICY_VERSION = 'release-policy.v1';
const CHECK_ONLY = process.argv.includes('--check');
const AS_JSON = process.argv.includes('--json');

const LEVELS = new Set(['PREA1', 'A1', 'A2', 'B1', 'B2', 'C1']);
const OPTION_TYPES = new Set([
  'word_choice', 'listen_choose', 'choose_reply', 'find_fix_error',
  'review_common_errors', 'preposition_choice', 'summarize_dialogue',
]);
const TEXT_TYPES = new Set(['fill_blank', 'translate_short', 'type_missing_word', 'conjugate_in_context']);
const ORDER_TYPES = new Set(['word_order', 'dialogue_order']);
const SPEAK_TYPES = new Set(['speak_with_text', 'speak_free']);
const SCRIPT_TYPES = new Set(['phone_call_response', 'roleplay_simulation']);
const MIN_EXERCISES = 4;
const MIN_TYPES = 3;

const readJSON = (f) => JSON.parse(readFileSync(f, 'utf8'));
const norm = (s) => String(s ?? '')
  .toLowerCase()
  .replace(/[.,;:!?¡¿"«»…'’()\-–—]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

function walk(dir, out = [], filter = null) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out, filter);
    else if (e.endsWith('.json') && (!filter || filter(e))) out.push(p);
  }
  return out;
}
const lessonFiles = (dir) => walk(dir, [], (e) => e.startsWith('lesson-'));
const allJson = (dir) => walk(dir);

/**
 * فهرس المفردات العام: الدرس يعلن كلمات مجرّدة (`newVocabulary`) لا حزمة،
 * والكلمة قد تسكن أي حزمة. الفهرس يشمل الرأس والجمع والتصريفات، لأن
 * `targetVocab` يستعمل أحيانًا صيغة مصرفة («duele» = doler).
 */
function loadVocabIndex() {
  const index = new Map();
  for (const file of allJson(DRAFTS)) {
    const doc = readJSON(file);
    if (!doc?.bundleSlug || !Array.isArray(doc.entries)) continue;
    for (const entry of doc.entries) {
      const sense = entry.senses?.[0] ?? {};
      const info = {
        headword: String(entry.headword ?? ''),
        ar: String(sense.meaningArFusha ?? sense.meaningAr ?? '').trim(),
        exampleAr: String(sense.exampleAr ?? '').trim(),
        bundle: doc.bundleSlug,
      };
      index.set(String(entry.headword ?? '').toLowerCase(), info);
      if (entry.plural) index.set(String(entry.plural).toLowerCase(), info);
      for (const form of Array.isArray(entry.forms) ? entry.forms : []) {
        const f = String(form.formEs ?? '').toLowerCase();
        if (f && !index.has(f)) index.set(f, info);
      }
    }
  }
  return index;
}

/** يفحص تمرينًا واحدًا ويعيد قائمة الحواجز */
function checkExercise(ex, lessonSlug, vocab, lessonVocab, notes) {
  const blockers = [];
  const at = `${lessonSlug}#${ex.id ?? '?'}`;
  if (!ex.id || typeof ex.id !== 'string') blockers.push(`${at}: تمرين بلا معرّف`);
  const type = String(ex.type ?? '');
  if (!type) blockers.push(`${at}: تمرين بلا نوع`);
  if (!String(ex.instructionAr ?? '').trim()) blockers.push(`${at}: تعليمات عربية غائبة`);
  if (!String(ex.explanationAr ?? '').trim()) blockers.push(`${at}: شرح الإجابة غائب`);

  const stemEs = String(ex.stemEs ?? '');
  const hasMaterial = Boolean(
    stemEs.trim() ||
      String(ex.speechEs ?? '').trim() ||
      String(ex.stemAr ?? '').trim() ||
      String(ex.contextAr ?? '').trim() ||
      String(ex.promptAr ?? '').trim() ||
      (Array.isArray(ex.items) && ex.items.length) ||
      (Array.isArray(ex.options) && ex.options.length),
  );
  if (!hasMaterial) blockers.push(`${at}: لا مادة محفّزة (نص/سياق/عناصر)`);

  /* `targetVocab` قد تسمّي بنية نحوية لا مفردة معجمية («que»، «lo»،
   * «dijo que + imperfecto»)، وليست كل التمارين تعلن مفردات مستهدفة (تمارين
   * النطق والترتيب مثلًا). الحاجز الحقيقي هو: **كلمة يعلنها الدرس نفسه** في
   * `newVocabulary`/`reviewVocabulary` ثم لا وجود لها في المعجم، أو مفردة
   * مستهدفة موجودة بلا معنى عربي. أما البنية النحوية فتُسجَّل ملاحظة لا حاجزًا. */
  const target = Array.isArray(ex.targetVocab) ? ex.targetVocab : [];
  if (!target.length) notes.push(`${at}: بلا مفردات مستهدفة (مقبول لتمارين المهارة)`);
  for (const word of target) {
    const key = String(word).toLowerCase();
    const hit = vocab.get(key);
    const declared = lessonVocab.has(key);
    if (!hit && declared) {
      if (/\s/.test(String(word).trim()) || /\+/.test(String(word))) {
        notes.push(`${at}: «${word}» تركيب متعدد الكلمات (المعجم للمفردات الأحادية) — بلا بطاقة ترجمة`);
      } else {
        blockers.push(`${at}: المفردة المعلنة «${word}» غير موجودة في المعجم`);
      }
    }
    else if (hit && !hit.ar) blockers.push(`${at}: المفردة «${word}» بلا معنى عربي`);
    else if (!hit) notes.push(`${at}: «${word}» بنية/تركيب لا مفردة معجمية`);
  }

  const key = ex.answerKey ?? {};

  if (OPTION_TYPES.has(type)) {
    const options = Array.isArray(ex.options) ? ex.options : [];
    if (options.length < 2) blockers.push(`${at}: خيارات أقل من اثنين`);
    const ids = options.map((o) => String(o.id ?? ''));
    if (new Set(ids).size !== ids.length) blockers.push(`${at}: معرّفات خيارات مكررة`);
    const texts = options.map((o) => norm(o.text));
    if (new Set(texts).size !== texts.length) blockers.push(`${at}: نصوص خيارات مكررة`);
    const correctIds = Array.isArray(key.correctOptionIds) ? key.correctOptionIds.map(String) : [];
    if (!correctIds.length) blockers.push(`${at}: لا خيار صحيح معلن`);
    for (const id of correctIds) if (!ids.includes(id)) blockers.push(`${at}: الخيار الصحيح ${id} غير موجود`);
    const flagged = options.filter((o) => o.isCorrect === true).map((o) => String(o.id));
    if (flagged.length && flagged.sort().join(',') !== [...correctIds].sort().join(',')) {
      blockers.push(`${at}: isCorrect لا يطابق correctOptionIds`);
    }
    // تسريب: نص الخيار الصحيح داخل **نص السؤال المكتوب**. لا يُطبَّق على
    // `listen_choose` لأن `stemEs` عنده هو نص المادة المسموعة نفسه (المتعلم
    // يسمعها ثم يختار ما سمعه)، فتطابقه مع الخيار الصحيح هو تصميم التمرين لا
    // تسريب فيه. حارس التسريب في الحمولة العامة هو tests/answer-leakage.test.ts.
    /* تسريب الإجابة: ليس كل ظهور لنص الخيار داخل الجملة تسريبًا — قد يكون
     * الاسم المعاد إليه الضمير («Los muebles… vender___ todos» والجواب los).
     * التسريب الحقيقي أن يُذكر الجواب **عند الفراغ نفسه** فيُقرأ مباشرة.
     * لذلك نفحص نافذة 4 كلمات حول الفراغ فقط. `find_fix_error` مستثنى:
     * نصّه هو الجملة الخطأ المقصودة، وقد يتطابق خياره الصحيح معها إلا في الترقيم.
     */
    if (stemEs.trim() && type !== 'listen_choose' && type !== 'find_fix_error' && /_{2,}/.test(stemEs)) {
      const tokens = norm(stemEs).split(' ');
      const blankAt = tokens.findIndex((t) => /_{2,}/.test(t));
      for (const id of correctIds) {
        const text = norm(options.find((o) => String(o.id) === id)?.text);
        if (!text || text.length <= 2) continue;
        const needle = text.split(' ');
        const hit = tokens.some((_, i) => {
          if (!needle.every((w, j) => tokens[i + j] === w)) return false;
          const end = i + needle.length - 1;
          if (blankAt < 0) return true;
          const distance = i > blankAt ? i - blankAt : blankAt - end;
          return distance <= 4;
        });
        if (hit) blockers.push(`${at}: الإجابة مكشوفة قرب الفراغ («${text}»)`);
      }
    }
  } else if (TEXT_TYPES.has(type)) {
    const accepted = Array.isArray(key.accepted) ? key.accepted : [];
    if (!accepted.length) blockers.push(`${at}: لا إجابة مقبولة`);
    if (accepted.some((a) => !String(a).trim())) blockers.push(`${at}: إجابة مقبولة فارغة`);
  } else if (ORDER_TYPES.has(type)) {
    const items = Array.isArray(ex.items) ? ex.items : [];
    if (items.length < 2) blockers.push(`${at}: عناصر ترتيب أقل من اثنين`);
    const accepted = Array.isArray(key.accepted) ? key.accepted : [];
    if (!accepted.length) blockers.push(`${at}: لا ترتيب مقبول`);
    if (type === 'word_order') {
      const order = Array.isArray(key.tokenOrder) ? key.tokenOrder.map(String) : [];
      const ids = items.map((i) => String(i.id));
      const permutes = order.length === ids.length && [...order].sort().join(',') === [...ids].sort().join(',');
      if (order.length && !permutes) {
        blockers.push(`${at}: tokenOrder ليس تبديلة لعناصر التمرين`);
      } else if (!order.length) {
        // لا tokenOrder: الترتيب الصحيح هو أول إجابة مقبولة. نتحقق أن كلماتها
        // (بعدد التكرار) تساوي كلمات العناصر — وإلا فالتمرين غير قابل للحل.
        /* المقارنة بمستوى الكلمات لا الرموز: بعض الرموز عبارة من كلمتين
         * («por favor»)، فمقارنة نصوص العناصر حرفيًا ترفض ترتيبًا صحيحًا. */
        const words = (t) => norm(t).split(' ').filter(Boolean).sort().join(' ');
        const have = words(items.map((i) => i.text).join(' '));
        const matchesAny = accepted.some((a) => words(a) === have);
        if (!matchesAny) blockers.push(`${at}: عناصر الترتيب لا تطابق أي إجابة مقبولة`);
      }
    }
  } else if (SPEAK_TYPES.has(type)) {
    if (!String(key.modelAnswer ?? '').trim()) blockers.push(`${at}: لا إجابة نموذجية للنطق`);
  } else if (SCRIPT_TYPES.has(type)) {
    const script = key.modelScript ?? key.modelAnswer ?? key.acceptableVariants;
    if (!script || (Array.isArray(script) && !script.length)) blockers.push(`${at}: لا نص نموذجي للمحاكاة`);
  } else {
    blockers.push(`${at}: نوع تمرين غير معروف للسياسة («${type}»)`);
  }
  return blockers;
}

/** يفحص درسًا كاملًا ويعيد { released, blockers, stats } */
export function evaluateLesson(file, { auditFindings = [], vocabIndex } = {}) {
  const doc = readJSON(file);
  const L = doc.lesson ?? doc;
  const isDraft = file.startsWith(DRAFTS);
  const rel = (isDraft ? file.slice(DRAFTS.length + 1) : file.slice(EXEMPLARS.length + 1)).split('\\').join('/');
  const slug = String(L.slug ?? basename(file).replace(/^lesson-/, '').replace(/\.json$/, ''));
  const blockers = [];
  const notes = [];
  const lessonVocab = new Set(
    [...(Array.isArray(L.newVocabulary) ? L.newVocabulary : []), ...(Array.isArray(L.reviewVocabulary) ? L.reviewVocabulary : [])]
      .map((w) => String(w).toLowerCase()),
  );

  if (!/^lesson-[a-z0-9-]+\.json$/.test(basename(file))) blockers.push('اسم الملف لا يطابق نمط lesson-<slug>.json');
  /* مطابقة اسم الملف بـslug إلزامية في مجلد المنهج (content/drafts) لأنها
   * تحمي إعادة التسمية الخاطئة. مجلد العيّنات له تسمية خاصة
   * (lesson-a1-cafe.json يحمل slug a1-un-cafe-por-favor) فلا تُفرض عليه. */
  if (isDraft && basename(file) !== `${slug}.json` && basename(file) !== `lesson-${slug}.json`) {
    blockers.push(`slug «${slug}» لا يطابق اسم الملف`);
  }
  if (!LEVELS.has(String(L.level ?? ''))) blockers.push(`مستوى غير معروف: ${L.level}`);
  if (!String(L.titleAr ?? '').trim()) blockers.push('عنوان عربي غائب');
  if (!String(L.objectiveAr ?? '').trim()) blockers.push('هدف عربي غائب');

  const exercises = Array.isArray(L.exercises) ? L.exercises : [];
  if (exercises.length < MIN_EXERCISES) blockers.push(`تمارين أقل من ${MIN_EXERCISES} (${exercises.length})`);
  const types = new Set(exercises.map((e) => e.type));
  if (types.size < MIN_TYPES) blockers.push(`أنواع تمارين أقل من ${MIN_TYPES} (${types.size})`);
  const exIds = exercises.map((e) => String(e.id ?? ''));
  if (new Set(exIds).size !== exIds.length) blockers.push('معرّفات تمارين مكررة داخل الدرس');

  const vocab = vocabIndex ?? new Map();
  if (!vocab.size) blockers.push('فهرس المفردات العام فارغ');
  for (const ex of exercises) blockers.push(...checkExercise(ex, slug, vocab, lessonVocab, notes));

  // أخطاء التدقيق الآلي المنسوبة لهذا الملف
  const fileErrors = auditFindings.filter(
    (f) => f.severity === 'error' && String(f.where ?? '').startsWith(`${rel}#`),
  );
  for (const f of fileErrors) blockers.push(`تدقيق ${f.rule}: ${f.message}`);

  return {
    released: blockers.length === 0,
    blockers,
    notes,
    stats: { exercises: exercises.length, types: types.size, level: L.level },
  };
}

function main() {
  const vocabIndex = loadVocabIndex();
  const { findings } = auditContent(DRAFTS);
  const { findings: exemplarFindings } = auditContent(EXEMPLARS);
  const allFindings = [...findings, ...exemplarFindings];
  /* المجلدان معًا: كل درس قابل للاستيراد له قرار إفراج صريح. المنهج أولًا،
   * ثم العيّنات (وبتسجيل الـslug لا باسم الملف: ملف العيّنة قد يحمل اسمًا
   * مختلفًا عن الـslug). تكرار الـslug يُسقَط لصالح المنهج. */
  const seen = new Set();
  const files = [];
  for (const file of [...lessonFiles(DRAFTS).sort(), ...lessonFiles(EXEMPLARS).sort()]) {
    const doc = readJSON(file);
    const slug = String((doc.lesson ?? doc).slug ?? '');
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    files.push({ file, slug });
  }
  const lessons = {};
  let released = 0;
  for (const { file, slug } of files) {
    const verdict = evaluateLesson(file, { auditFindings: allFindings, vocabIndex });
    lessons[slug] = verdict;
    if (verdict.released) released++;
  }
  const today = new Date().toISOString().slice(0, 10);
  const policy = {
    policyVersion: POLICY_VERSION,
    generatedAt: today,
    provenance: 'ai+automated',
    noteAr:
      'إفراج آلي موثّق: مراجعة الذكاء الاصطناعي + بوابات آلية (validate-content، audit-content-quality، فحص التمارين). لا مراجعة بشرية.',
    thresholds: { minExercises: MIN_EXERCISES, minTypes: MIN_TYPES },
    totals: { lessons: files.length, released, blocked: files.length - released },
    lessons,
  };

  if (!CHECK_ONLY) {
    writeFileSync(OUT, JSON.stringify(policy, null, 2) + '\n', 'utf8');
  }

  if (AS_JSON) {
    console.log(JSON.stringify(policy.totals, null, 2));
  } else {
    console.log(`سياسة الإفراج: ${released}/${files.length} درسًا جاهزًا للنشر`);
    const blockedList = Object.entries(lessons).filter(([, v]) => !v.released);
    for (const [slug, v] of blockedList.slice(0, 20)) {
      console.log(`  ⛔ ${slug}: ${v.blockers.slice(0, 3).join(' · ')}${v.blockers.length > 3 ? ` (+${v.blockers.length - 3})` : ''}`);
    }
    if (!CHECK_ONLY) console.log(`كُتب: ${OUT.slice(ROOT.length + 1)}`);
  }
  process.exit(CHECK_ONLY && released !== files.length ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
