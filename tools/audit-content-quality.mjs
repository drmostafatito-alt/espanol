#!/usr/bin/env node
/**
 * tools/audit-content-quality.mjs — تدقيق جودة المحتوى (آلي، بلا اعتماديات)
 *
 * هذا الملف يختلف عن tools/validate-content.mjs:
 *   - validate-content يفحص البنية والمخططات والاتساق العام.
 *   - audit-content-quality يفحص الأخطاء التي لا يراها المخطط، لكنها قابلة للتحقق آليًا
 *     (نصوص مفسدة، تسريب الإجابات، إجابات ترتيب غير مطابقة للعناصر، IPA غير صالح،
 *      تكرار الشروح/المعايير، مفاتيح صوت مُعاد استخدامها لنصوص مختلفة…)
 *
 * المبدأ المعلن: لا نُصدر حكمًا لغويًا هنا. كل قاعدة في هذا الملف ميكانيكية وقابلة للإثبات.
 * أي شك لغوي يذهب إلى reports/audit/*.md كملاحظة مفتوحة تحتاج مراجعًا بشريًا.
 *
 * الاستخدام:
 *   node tools/audit-content-quality.mjs [--dir content/drafts] [--json reports/audit/quality.json]
 * الخروج: 1 إذا وُجدت أخطاء (errors)، 0 إذا وُجدت تنبيهات فقط.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const AR = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
// حروف عربية فقط (بلا علامات ترقيم، فيسقط «francés)،» من فحص الخلط)
const AR_CHAR = /[\u0621-\u063A\u0641-\u064A\u066E-\u06D3]/;
const LATIN_CHAR = /[A-Za-zÀ-ÿ]/;
// خلط حقيقي = حرف لاتيني ملاصق لحرف عربي بلا فاصل (Italianا)، لا «بـ-í»
const MIXED_PAIR = /(?:[A-Za-zÀ-ÿ][\u0621-\u063A\u0641-\u064A]|[\u0621-\u063A\u0641-\u064A][A-Za-zÀ-ÿ])/;
const LATIN_WORD = /[A-Za-zÀ-ÿ]/;

// الحالة داخل دالة حتى يمكن استيراد الملف من الاختبارات بلا آثار جانبية
let findings = [];
let err = () => {};
let warn = () => {};

const readJSON = f => JSON.parse(readFileSync(f, 'utf8'));

/**
 * تدقيق محتوى مجلد (متكرر في المجلدات الفرعية).
 * @param {string} CONTENT_DIR مسار مطلق أو نسبي من جذر المشروع
 * @returns {{stats:object, findings:Array}}
 */
export function auditContent(CONTENT_DIR) {
  findings = [];
  err = (rule, where, message) => findings.push({ severity: 'error', rule, where, message });
  warn = (rule, where, message) => findings.push({ severity: 'warn', rule, where, message });

const readJSON = f => JSON.parse(readFileSync(f, 'utf8'));

/** نفس تسوية المُصحِّح تقريبًا: بلا ترقيم، بلا حالة أحرف، مع/بلا تشكيل. */
function norm(s, { stripAccents = true } = {}) {
  let t = String(s ?? '').trim().replace(/\s+/g, ' ');
  t = t.toLowerCase().replace(/[.,;:!?¡¿"«»…'’()\-–—]/g, '');
  if (stripAccents) t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC');
  return t.replace(/\s+/g, ' ').trim();
}
const tokens = s => norm(s).split(' ').filter(Boolean);
const sortedKey = s => tokens(s).sort().join(' ');

/**
 * صيغ الجمع والمطابقة المنتظمة (جنس/عدد) — للاستخدام في R36 فقط.
 *
 * لماذا: المدخل يُخزَّن بصيغة المفرد/المذكر («abarrote»، «templado»، «accesorio»)،
 * والمثال الطبيعي يستخدم الجمع أو المؤنث («abarrotes»، «días templados»).
 * بلا هذه الصيغ يطلق المدقق إنذارًا كاذبًا على عيّنة سليمة، فيفقد الإنذار قيمته.
 * التوليد محافظ: لا يخلط جذورًا مختلفة، بل يغيّر النهاية فقط.
 */
function inflections(headword, plural) {
  const out = new Set();
  const base = norm(headword);
  if (!base) return out;
  if (plural) out.add(norm(plural));
  const parts = base.split(' ');
  const bases = new Set([base, ...(parts.length > 1 ? parts.filter(p => p.length > 2) : [])]);
  for (const w of bases) {
    if (!w) continue;
    out.add(w + 's');
    out.add(w + 'es');
    if (w.endsWith('z')) out.add(w.slice(0, -1) + 'ces');
    if (w.endsWith('o')) {
      out.add(w.slice(0, -1) + 'a');
      out.add(w.slice(0, -1) + 'os');
      out.add(w.slice(0, -1) + 'as');
    }
    if (w.endsWith('a')) {
      out.add(w.slice(0, -1) + 'o');
      out.add(w.slice(0, -1) + 'as');
      out.add(w.slice(0, -1) + 'os');
    }
    if (w.endsWith('e')) out.add(w + 's');
    if (/[lnrsd]$/.test(w)) out.add(w + 'es');
    // الجمع المؤنث للأسماء المنتهية بساكن مؤنث شائع (profesor → profesora)
    if (/[lnrsd]$/.test(w)) out.add(w + 'a');
  }
  // Apócope الصحيحة: bueno → buen café، primero → primer piso (ليست خطأً في المثال)
  const APOCOPE = { bueno: 'buen', malo: 'mal', primero: 'primer', tercero: 'tercer', alguno: 'algún', ninguno: 'ningún' };
  if (APOCOPE[base]) out.add(APOCOPE[base]);
  out.delete(base);
  return out;
}

/**
 * ضمائر ملتصقة بالفعل (dame، ayudarme، avísame) — المثال سليم لكن الكلمة ليست
 * صيغة مجردة. تُجرَّد اللاحقة الأطول أولًا، ثم تُقارن بالنص المجرّد من التشكيل.
 */
const ENCLITICS = [
  'melos', 'melas', 'melo', 'mela', 'selos', 'selas', 'selo', 'sela',
  'telos', 'telas', 'telo', 'tela', 'noslo', 'nosla', 'oslo', 'osla',
  'les', 'los', 'las', 'nos', 'me', 'te', 'se', 'os', 'lo', 'la', 'le',
];
function stripEnclitic(token) {
  for (const p of ENCLITICS) {
    if (token.length > p.length + 1 && token.endsWith(p)) return token.slice(0, -p.length);
  }
  return token;
}

// ---------------------------------------------------------------------------
// قواعد عامة للنصوص
// ---------------------------------------------------------------------------

/**
 * R1 — نصوص مفسدة: كلمة واحدة تحتوي حروفًا عربية ولاتينية معًا.
 * أمثلة حقيقية وُجدت: "Italianا" (Italian + ألف).
 */
function checkMixedScript(text, where) {
  if (typeof text !== 'string' || !text) return;
  for (const tok of text.split(/\s+/)) {
    // «وtú» / «بـ»+كلمة إسبانية: واو/باء عربية ملتصقة بكلمة لاتينية = أسلوب عربي مقصود، لا فساد
    if (/^[وفبلك][A-Za-zÀ-ÿ«]/.test(tok)) continue;
    if (MIXED_PAIR.test(tok)) {
      err('R1-mixed-script', where, `كلمة تخلط حروفًا عربية ولاتينية: «${tok}»`);
    }
  }
}

/** R2 — حروف عربية في حقل إسباني بحت (لا يُسمح حتى داخل علامات تنصيص). */
function checkSpanishOnly(text, where) {
  if (typeof text !== 'string' || !text) return;
  if (AR.test(text)) err('R2-arabic-in-spanish', where, `حروف عربية في حقل إسباني: «${text.slice(0, 60)}»`);
}

/** R3 — نص عربي بلا حروف عربية (حقل عربي أُفرغ أو امتلأ بإسبانية). */
function checkArabicOnly(text, where, { allowEmpty = true } = {}) {
  if (typeof text !== 'string') return;
  if (!text.trim()) {
    if (!allowEmpty) err('R3-empty-arabic', where, 'حقل عربي فارغ');
    return;
  }
  if (!AR_CHAR.test(text)) err('R3-arabic-missing', where, `حقل عربي بلا حروف عربية: «${text.slice(0, 60)}»`);
}

/** R4 — علامات استفهام/تعجب غير متوازنة في الإسبانية. */
function checkSpanishPunctuation(text, where) {
  if (typeof text !== 'string' || !text) return;
  const count = (s, ch) => (s.match(new RegExp(ch, 'g')) || []).length;
  if (count(text, '¿') !== count(text, '\\?')) err('R4-punctuation', where, `¿ و ؟ غير متوازنتين: «${text}»`);
  if (count(text, '¡') !== count(text, '!')) err('R4-punctuation', where, `¡ و ! غير متوازنتين: «${text}»`);
}

// ---------------------------------------------------------------------------
// بدائل نطق (IPA) — فحص شكلي فقط، لا حكم على دقة الترميز
// ---------------------------------------------------------------------------
// محارف IPA الشائعة + علامات النبر والطول + فواصل المقاطع
const IPA_ALLOWED = new Set([...'abcdefghijklmnopqrstuvwxyzɣθðʃʒŋɲʎɾrβɸʝxχçɟɡʔjwɰʕħʋɹɻɱɳˈˌːˑ‿.'].concat([' ']));
function checkIpa(ipa, where) {
  if (!ipa) return;
  if (!/^[/[].*[/\]]$/.test(ipa.trim())) err('R5-ipa-format', where, `IPA بلا قوسين مائلين: «${ipa}»`);
  const body = ipa.trim().replace(/^[/[]|[/\]]$/g, '');
  if (AR_CHAR.test(body)) err('R5-ipa-format', where, `IPA يحتوي حروفًا عربية: «${ipa}»`);
  if (/[()]/.test(body)) err('R5-ipa-format', where, `IPA يحتوي هامشًا نصيًا بين قوسين: «${ipa}»`);
  const bad = [...new Set([...body].filter(ch => !IPA_ALLOWED.has(ch.toLowerCase())))];
  if (bad.length) err('R5-ipa-chars', where, `محارف ليست من IPA داخل الحقل: ${bad.map(c => `«${c}»`).join(' ')} — «${ipa}»`);
}

// ---------------------------------------------------------------------------
// تحميل المحتوى
// ---------------------------------------------------------------------------
// المحتوى موزَّع في مجلدات فرعية (a1/ travel/ callcenter/ core-vocab/) — نجمعها كلها
function listJSON(dir, prefix = '') {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) out.push(...listJSON(join(dir, ent.name), `${prefix}${ent.name}/`));
    else if (ent.name.endsWith('.json')) out.push(`${prefix}${ent.name}`);
  }
  return out;
}
const files = listJSON(CONTENT_DIR).sort();
const lessonFiles = files.filter(f => /(^|\/)lesson-.*\.json$/.test(f));
const vocabFiles = files.filter(f => /(^|\/)vocab-.*\.json$/.test(f));

const CHOICE_TYPES = new Set(['image_choice', 'word_choice', 'distinguish_similar', 'identify_speaker',
  'choose_reply', 'preposition_choice', 'infer_meaning', 'recall_previous_word',
  'review_common_errors', 'listen_choose', 'find_fix_error']);
const ORDER_TYPES = new Set(['word_order', 'dialogue_order']);
const PRODUCTION_TYPES = new Set(['speak_with_text', 'speak_free', 'roleplay_simulation', 'phone_call_response',
  'resolve_customer_issue', 'write_email']);

const lessons = [];
const optionIds = new Map(); // id -> first where
const stats = { lessons: 0, exercises: 0, options: 0, scenarios: 0, scenarioLines: 0, vocabPacks: 0, vocabEntries: 0, ipa: 0 };

for (const f of lessonFiles.slice().sort()) {
  const doc = readJSON(join(CONTENT_DIR, f));
  const L = doc.lesson;
  if (!L) { err('R0-structure', f, 'الملف لا يحتوي كائن lesson'); continue; }
  lessons.push({ file: f, lesson: L });
  stats.lessons += 1;
  stats.exercises += (L.exercises || []).length;
  stats.scenarios += (L.scenarios || []).length;
  for (const s of L.scenarios || []) stats.scenarioLines += (s.lines || []).length;

  // --- الدرس نفسه ---
  checkMixedScript(L.titleAr, `${f}.titleAr`);
  checkMixedScript(L.objectiveAr, `${f}.objectiveAr`);
  checkArabicOnly(L.titleAr, `${f}.titleAr`, { allowEmpty: false });
  checkArabicOnly(L.objectiveAr, `${f}.objectiveAr`, { allowEmpty: false });

  // مستويات CEFR معلنة
  if (!['preA1', 'A1', 'A2', 'B1', 'B2', 'C1'].includes(L.level)) {
    err('R6-cefr', f, `مستوى غير معروف: ${L.level}`);
  }

  // الحالة: لا نشر ولا مراجعة بشرية مُدّعاة
  const status = L.review?.status;
  if (status !== 'draft' && status !== 'unreviewed') {
    err('R7-review-status', f, `حالة المحتوى «${status}» — يجب أن تبقى draft في هذه المرحلة`);
  }
  if (L.review?.reviewedAt) err('R7-review-status', f, 'reviewedAt مملوء بلا مراجعة بشرية فعلية');
  if (L.review?.spanishReviewer || L.review?.translationReviewer) {
    err('R7-review-status', f, 'اسم مراجع بشري مسجَّل دون مراجعة موثّقة');
  }

  // --- السيناريوهات ---
  const audioMap = new Map(); // audioKey -> النص المصحوب
  for (const [si, s] of (L.scenarios || []).entries()) {
    checkMixedScript(s.contextAr, `${f}.scenario[${si}].contextAr`);
    checkArabicOnly(s.contextAr, `${f}.scenario[${si}].contextAr`, { allowEmpty: false });
    for (const [li, line] of (s.lines || []).entries()) {
      const where = `${f}.scenario[${si}].line[${li}]`;
      checkSpanishOnly(line.es, `${where}.es`);
      checkSpanishPunctuation(line.es, `${where}.es`);
      checkMixedScript(line.ar, `${where}.ar`);
      checkArabicOnly(line.ar, `${where}.ar`, { allowEmpty: false });
      checkMixedScript(line.arEg, `${where}.arEg`);
      if (line.audioKey) {
        const prev = audioMap.get(line.audioKey);
        if (prev !== undefined && norm(prev) !== norm(line.es)) {
          err('R8-audio-reuse', where, `مفتاح صوت مُعاد استخدامه لنص مختلف: ${line.audioKey}`);
        }
        audioMap.set(line.audioKey, line.es);
      }
    }
  }

  // --- التمارين ---
  const stemIndex = new Map();
  const explIndex = new Map();
  const rubricIndex = new Map();
  const instructionIndex = new Map();
  const lessonVocab = new Set([...(L.newVocabulary || []), ...(L.reviewVocabulary || [])].map(v => norm(v)));

  for (const ex of L.exercises || []) {
    const where = `${f}#${ex.id}`;
    const key = ex.answerKey || {};

    checkMixedScript(ex.instructionAr, `${where}.instructionAr`);
    checkArabicOnly(ex.instructionAr, `${where}.instructionAr`, { allowEmpty: false });
    checkMixedScript(ex.explanationAr, `${where}.explanationAr`);
    checkArabicOnly(ex.explanationAr, `${where}.explanationAr`, { allowEmpty: false });
    if (ex.stemEs) { checkSpanishOnly(ex.stemEs, `${where}.stemEs`); checkSpanishPunctuation(ex.stemEs, `${where}.stemEs`); }
    if (ex.stemAr) { checkMixedScript(ex.stemAr, `${where}.stemAr`); checkArabicOnly(ex.stemAr, `${where}.stemAr`); }
    if (ex.contextAr) { checkMixedScript(ex.contextAr, `${where}.contextAr`); checkArabicOnly(ex.contextAr, `${where}.contextAr`); }
    if (ex.speechEs) { checkSpanishOnly(ex.speechEs, `${where}.speechEs`); checkSpanishPunctuation(ex.speechEs, `${where}.speechEs`); }

    // R9 — تعليمات غير عربية إطلاقًا (تسريب ترجمة آلية/فارغة)
    if ((ex.instructionAr || '').trim().length < 4) err('R9-instruction', where, 'تعليمات عربية قصيرة جدًا أو فارغة');

    // R10 — تكرار نص التمرين نفسه في الدرس (ازدواج محتوى)
    const stemSig = `${ex.type}|${norm(ex.stemEs || ex.contextAr || '')}`;
    if (stemSig.length > 12) {
      if (stemIndex.has(stemSig)) warn('R10-duplicate-stem', where, `نفس نص التمرين مكرر مع ${stemIndex.get(stemSig)}`);
      else stemIndex.set(stemSig, ex.id);
    }
    // R11 — شرح مكرر حرفيًا بين تمرينين مختلفين
    const explSig = norm(ex.explanationAr || '');
    if (explSig.length > 30) {
      if (explIndex.has(explSig)) warn('R11-duplicate-explanation', where, `الشرح منسوخ حرفيًا من ${explIndex.get(explSig)}`);
      else explIndex.set(explSig, ex.id);
    }
    // R12 — معيار تقييم مكرر بين نوعين مختلفين (مؤشر نسخ/لصق)
    const rubric = ex.scoring?.rubric || [];
    if (rubric.length) {
      const sig = rubric.map(r => `${r.code || ''}:${r.weight}:${r.labelAr || ''}`).join('|');
      if (rubricIndex.has(sig)) {
        const [otherId, otherType] = rubricIndex.get(sig);
        if (otherType !== ex.type) {
          warn('R12-duplicate-rubric', where, `نفس معيار التقييم مستخدم في ${otherId} من نوع ${otherType}`);
        }
      } else rubricIndex.set(sig, [ex.id, ex.type]);
    }

    // R13 — الوضع المُعلن في scoring مقابل answerKey.mode (حقل في غير موضعه)
    if (key.mode) err('R13-answerkey-mode', where, 'answerKey.mode في غير موضعه؛ مكانه scoring.mode');

    // R14 — fit التمرين مع أهداف الدرس
    for (const v of ex.targetVocab || []) {
      if (lessonVocab.size && !lessonVocab.has(norm(v))) {
        warn('R14-target-vocab-fit', where, `targetVocab «${v}» ليست من مفردات الدرس المعلنة`);
      }
    }

    // --- الخيارات ---
    const opts = ex.options || [];
    const isChoice = CHOICE_TYPES.has(ex.type) || (Array.isArray(key.correctOptionIds) && !ORDER_TYPES.has(ex.type));
    if (opts.length) {
      stats.options += opts.length;
      const flaggedTrue = opts.filter(o => o.isCorrect === true).map(o => o.id);
      const flaggedFalse = opts.filter(o => o.isCorrect === false).map(o => o.id);
      const missing = opts.filter(o => !('isCorrect' in o)).map(o => o.id);
      // R15 — isCorrect يجب أن يكون boolean صريحًا (لا null، لا غائبًا)
      if (missing.length) err('R15-iscorrect-type', where, `خيارات بلا isCorrect: ${missing.join(', ')}`);
      for (const o of opts) {
        if ('isCorrect' in o && typeof o.isCorrect !== 'boolean') {
          err('R15-iscorrect-type', where, `isCorrect ليست boolean في ${o.id}: ${JSON.stringify(o.isCorrect)}`);
        }
      }
      // R16 — isCorrect المعلَّم يجب أن يطابق answerKey عند وجوده
      if (Array.isArray(key.correctOptionIds)) {
        const a = [...flaggedTrue].sort().join(',');
        const b = [...key.correctOptionIds].sort().join(',');
        if (a !== b) err('R16-key-mismatch', where, `isCorrect (${a}) ≠ correctOptionIds (${b})`);
      }
      // R17 — تغطية الترجمة العربية لكل خيار (داخل الدرس: إما الكل أو لا شيء)
      const withAr = opts.filter(o => (o.textAr || '').trim()).length;
      if (withAr > 0 && withAr < opts.length) {
        const lacking = opts.filter(o => !(o.textAr || '').trim()).map(o => o.id);
        warn('R17-option-translation', where, `خيارات بلا textAr: ${lacking.join(', ')}`);
      }
      for (const o of opts) {
        const w = `${where}.option:${o.id}`;
        checkSpanishOnly(o.text, `${w}.text`);
        checkSpanishPunctuation(o.text, `${w}.text`);
        if (o.textAr) { checkMixedScript(o.textAr, `${w}.textAr`); checkArabicOnly(o.textAr, `${w}.textAr`); }
        if (o.distractorRationaleAr) {
          checkMixedScript(o.distractorRationaleAr, `${w}.rationale`);
          checkArabicOnly(o.distractorRationaleAr, `${w}.rationale`);
          if (o.isCorrect === true) err('R18-correct-has-rationale', w, 'الخيار الصحيح يحمل distractorRationaleAr');
        } else if (o.isCorrect !== true) {
          warn('R18-missing-rationale', w, 'مشتت بلا تفسير عربي');
        }
        // R19 — معرّفات الخيارات فريدة عالميًا (تُستخدم مفتاحًا في قاعدة البيانات)
        if (optionIds.has(o.id)) {
          err('R19-option-id', w, `معرّف خيار مكرر عبر المحتوى: ${o.id} (أول ظهور ${optionIds.get(o.id)})`);
        } else optionIds.set(o.id, where);
      }
      // R20 — تغذية راجعة لكل مشتت: العدد يجب أن يطابق عدد المشتتات
      const fb = ex.errorFeedback || {};
      const missingFb = opts.filter(o => o.isCorrect !== true && !fb[o.id]).map(o => o.id);
      if (isChoice && missingFb.length) {
        warn('R20-error-feedback', where, `مشتتات بلا تغذية راجعة خاصة: ${missingFb.join(', ')}`);
      }
      // R39 — نص خيار مكرر داخل التمرين نفسه
      const textSeen = new Map();
      for (const o of opts) {
        const t = norm(o.text || '');
        if (!t) { err('R43-empty-option', `${where}.option:${o.id}`, 'نص الخيار فارغ'); continue; }
        if (!t) continue;
        if (textSeen.has(t)) err('R39-duplicate-option', `${where}.option:${o.id}`, `نص الخيار مكرر مع ${textSeen.get(t)}`);
        else textSeen.set(t, o.id);
      }
      // R44 — تناقض بين التعليمات والتفسير: مشتت يوصَف بأنه «صحيح نحويًا» بينما
      // التعليمات تسأل عن الصحة فقط ⇒ تصبح للمشتت حجّة صحيحة. القاعدة: التعليمات
      // يجب أن تسأل عن الملاءمة (الأدب/السياق/الشيوع) إذا كان المشتت صحيحًا نحويًا.
      const softWrong = opts.filter(o => o.isCorrect !== true && /صحيحة|صحيح/.test(o.distractorRationaleAr || '') && !/خطأ|غير صحيحة|لا تصلح|لا وجود/.test(o.distractorRationaleAr || ''));
      if (softWrong.length) {
        const asksOnlyCorrectness = /(أي (جملة|سؤال|صيغة) (صحيحة|صحيح))/.test(ex.instructionAr || '');
        if (asksOnlyCorrectness) {
          warn('R44-instruction-fit', where,
            `التعليمات تسأل عن الصحة فقط، لكن ${softWrong.map(o => o.id).join(', ')} صحيح نحويًا وغير مناسب سياقيًا — اسأل عن الملاءمة`);
        }
      }

      // R21 — تسريب الإجابة في التعليمات/السياق
      const correct = opts.find(o => o.isCorrect === true);
      if (correct && norm(correct.text).length > 3) {
        const c = norm(correct.text);
        for (const [field, val] of [['instructionAr', ex.instructionAr], ['contextAr', ex.contextAr]]) {
          if (val && norm(val).includes(c)) err('R21-answer-leak', where, `${field} يكشف نص الإجابة الصحيحة`);
        }
      }
      if (flaggedTrue.length === 0) err('R22-no-correct', where, 'لا يوجد خيار صحيح معلَّم');
      if (isChoice && flaggedTrue.length > 1 && flaggedFalse.length > 0) {
        warn('R22-multi-correct', where, `أكثر من خيار صحيح (${flaggedTrue.length}) في نوع اختيار واحد`);
      }
    } else if (isChoice) {
      err('R23-no-options', where, `نوع اختيار بلا options`);
    }

    // --- العناصر المرتبة (word_order / dialogue_order) ---
    if (ORDER_TYPES.has(ex.type)) {
      const items = ex.items || [];
      if (items.length < 2) err('R24-order-items', where, 'تمرين ترتيب بأقل من عنصرين');
      // R25 — أرقام/تعداد داخل النص = تسريب الترتيب
      for (const it of items) {
        if (/^\s*[(\[]?\s*\d+\s*[).\-–]/.test(it.text || '')) {
          err('R25-order-numbering', `${where}.item:${it.id}`, `نص العنصر يبدأ بتعداد يكشف الترتيب: «${it.text.slice(0, 40)}»`);
        }
      }
      // R26 — كل إجابة مقبولة يجب أن تكون تباديلًا تامًا لنصوص العناصر (نفس المجموعة)
      // مقارنة بالمجموعة (multiset): كل كلمة في الإجابة المقبولة يجب أن تكون من العناصر
      // بنفس عدد مرات ورودها، ويُسمح بحذف عنصر واحد مقصود (حذف فعل متكرر في الإسبانية).
      const pool = new Map();
      for (const t of tokens(items.map(i => i.text).join(' '))) pool.set(t, (pool.get(t) || 0) + 1);
      for (const acc of key.accepted || []) {
        const used = new Map();
        for (const t of tokens(acc)) used.set(t, (used.get(t) || 0) + 1);
        const extra = [...used].filter(([t, n]) => n > (pool.get(t) || 0)).map(([t]) => t);
        const accN = tokens(acc).length;
        const itemN = tokens(items.map(i => i.text).join(' ')).length;
        if (extra.length) {
          err('R26-order-permutation', where,
            `إجابة مقبولة تستخدم كلمات ليست من عناصر التمرين: ${extra.join(', ')} — «${String(acc).slice(0, 60)}»`);
        } else if (accN < itemN - 1 || accN > itemN) {
          err('R26-order-permutation', where,
            `عدد كلمات الإجابة المقبولة (${accN}) لا يطابق عناصر التمرين (${itemN}) — «${String(acc).slice(0, 60)}»`);
        }
      }
      // R27 — تمرين ترتيب يحمل correctOptionIds: المُصحِّح يتعامل معه كاختيار، فيصير غير قابل للتصحيح
      if (Array.isArray(key.correctOptionIds)) {
        err('R27-order-optionids', where, 'تمرين ترتيب يحمل correctOptionIds — قد يُصحَّح كاختيار بدل ترتيب');
      }
      if (!(key.accepted || []).length) err('R27-order-optionids', where, 'تمرين ترتيب بلا answerKey.accepted');
    }

    // --- الإجابات النصية ---
    for (const acc of key.accepted || []) {
      if (ORDER_TYPES.has(ex.type)) continue;
      const w = `${where}.accepted`;
      checkSpanishOnly(acc, w);
      checkSpanishPunctuation(acc, w);
      if (!LATIN_WORD.test(acc)) err('R28-accepted-not-spanish', w, `إجابة مقبولة بلا حروف لاتينية: «${acc}»`);
      if (norm(acc) !== norm(norm(acc))) err('R28-accepted-not-spanish', w, 'إجابة مقبولة تفشل في تسوية النص');
    }
    if (key.modelAnswer) { checkSpanishOnly(key.modelAnswer, `${where}.modelAnswer`); checkSpanishPunctuation(key.modelAnswer, `${where}.modelAnswer`); }
    if (key.modelScript) checkArabicOnly(key.modelScript, `${where}.modelScript`);

    // R29 — تغطية الترجمة العربية: إن كان للدرس stemAr فليكن لكل تمارينه
    if (ex.stemEs && !ex.stemAr) {
      const lessonHasStemAr = (L.exercises || []).some(e => (e.stemAr || '').trim());
      if (lessonHasStemAr) warn('R29-stem-translation', where, 'stemAr ناقص بينما تمارين أخرى في الدرس مترجمة');
    }

    // R41 — مفاتيح التغذية الراجعة يجب أن تشير إلى خيارات موجودة (أو «order» لتمارين الترتيب)
    const optIdSet = new Set((ex.options || []).map(o => o.id));
    for (const k of Object.keys(ex.errorFeedback || {})) {
      checkMixedScript(ex.errorFeedback[k], `${where}.errorFeedback:${k}`);
      checkArabicOnly(ex.errorFeedback[k], `${where}.errorFeedback:${k}`, { allowEmpty: false });
      // مفاتيح الخيارات/العناصر للأنواع الاختيارية والمرتبة؛ أما تمارين النص الحر
      // فمفاتيحها إجابات خاطئة متوقعة (نص إسباني) يطابقها المُصحِّح بعد التسوية.
      if (isChoice || ORDER_TYPES.has(ex.type)) {
        const allowed = optIdSet.has(k) || k === 'order' || (ex.items || []).some(i => i.id === k);
        if (!allowed) err('R41-error-feedback-key', where, `مفتاح تغذية راجعة لا يطابق أي خيار/عنصر: ${k}`);
      } else if (!LATIN_WORD.test(k)) {
        err('R41-error-feedback-key', where, `مفتاح تغذية راجعة في تمرين نصي ليس إجابة إسبانية متوقعة: ${k}`);
      }
    }
    // R40 — تمارين الملء تحتاج فراغًا صريحًا في الجملة
    if (['fill_blank', 'type_missing_word', 'conjugate_in_context'].includes(ex.type)) {
      if (!/_{3,}|\[___\]|…/.test(ex.stemEs || '')) err('R40-gap-marker', where, `نوع ${ex.type} بلا فراغ واضح في stemEs`);
    }
    // R42 — تعليمات مكررة حرفيًا داخل الدرس
    const instSig = norm(ex.instructionAr || '');
    if (instSig.length > 7) {
      if (instructionIndex.has(instSig)) warn('R42-duplicate-instruction', where, `نفس التعليمات مستخدمة في ${instructionIndex.get(instSig)}`);
      else instructionIndex.set(instSig, ex.id);
    }

    // R30 — مفاتيح الصوت
    for (const [field, val] of [['audioKey', ex.audioKey], ['referenceAudioKey', key.referenceAudioKey]]) {
      if (!val) continue;
      const speech = ex.speechEs || ex.stemEs || '';
      const prev = audioMap.get(val);
      if (prev !== undefined && speech && norm(prev) !== norm(speech)) {
        err('R8-audio-reuse', where, `${field} ${val} مُستخدَم لنص مختلف`);
      }
      if (prev === undefined) audioMap.set(val, speech);
    }
    // R31 — تمرين سمعي بلا نص بديل ولا speechEs (لا يعمل بلا ملفات صوتية)
    if (ex.audioKey && !ex.speechEs && !ex.stemEs) {
      err('R31-audio-no-text', where, 'تمرين سمعي بلا نص بديل ولا speechEs — لا فائدة منه بلا صوت');
    }
  }
}

// ---------------------------------------------------------------------------
// المفردات
// ---------------------------------------------------------------------------
const vocabAudio = new Map(); // audioKey -> where
const ALLOWED_POS = new Set(['noun', 'verb', 'adj', 'adv', 'prep', 'conj', 'pron', 'det', 'interj', 'phrase', 'num', 'expression']);
for (const f of vocabFiles.slice().sort()) {
  const doc = readJSON(join(CONTENT_DIR, f));
  stats.vocabPacks += 1;
  const entries = doc.entries || [];
  stats.vocabEntries += entries.length;
  for (const e of entries) {
    const where = `${f}#${e.headword}`;
    checkSpanishOnly(e.headword, `${where}.headword`);
    checkArabicOnly(e.senses?.[0]?.meaningArFusha, `${where}.meaningArFushaA`, { allowEmpty: false });
    if (e.pos && !ALLOWED_POS.has(e.pos)) err('R32-pos', where, `pos غير مسموح: ${e.pos}`);
    if (e.pos === 'noun' && !['m', 'f', 'mf'].includes(e.gender || '')) {
      err('R32-gender', where, `اسم بجنس غير صالق: ${JSON.stringify(e.gender)}`);
    }
    if (e.ipa) {
      stats.ipa += 1;
      checkIpa(e.ipa, where);
      if (!e.ipa.includes('ˈ') && tokens(e.headword).length === 1 && (e.headword.match(/[aeiouáéíóú]/g) || []).length > 1) {
        warn('R33-ipa-stress', where, `IPA بلا علامة نبر (ˈ) لكلمة متعددة المقاطع: ${e.ipa}`);
      }
    }
    if (e.pronunciationHintAr) {
      checkMixedScript(e.pronunciationHintAr, `${where}.hint`);
      // الاقتباس الإسباني بين « » وبين قوسين مقصود في تلميح النطق (اسم الحرف/المقطع)،
      // فنفحص فقط الكلمات اللاتينية الطليقة خارج الاقتباس.
      const bare = e.pronunciationHintAr.replace(/«[^»]*»/g, ' ').replace(/\[[^\]]*\]/g, ' ');
      // كلمات المدخل نفسه مستثناة: التلميح يشرح نطقها
      const headWords = new Set(tokens(e.headword));
      const stray = bare.split(/\s+/)
        .filter(t => /^[A-Za-zÀ-ÿ]{3,}$/.test(t) && !headWords.has(norm(t)));
      if (stray.length) err('R34-hint-latin', where, `كلمات لاتينية طليقة في تلميح النطق العربي: ${stray.join(', ')}`);
      if (!AR_CHAR.test(e.pronunciationHintAr)) err('R34-hint-latin', where, 'تلميح النطق بلا حروف عربية');
      if (norm(e.pronunciationHintAr) === norm(e.headword)) err('R34-hint-latin', where, 'تلميح النطق مكرر للنص الإسباني');
    }
    const seenSense = new Set();
    for (const s of e.senses || []) {
      const w = `${where}.sense${s.senseNo}`;
      checkMixedScript(s.meaningArFusha, `${w}.meaningArFusha`);
      checkMixedScript(s.meaningArEg, `${w}.meaningArEg`);
      checkMixedScript(s.commonErrorAr, `${w}.commonErrorAr`);
      checkArabicOnly(s.meaningArFusha, `${w}.meaningArFusha`, { allowEmpty: false });
      checkArabicOnly(s.exampleAr, `${w}.exampleAr`, { allowEmpty: false });
      checkSpanishOnly(s.exampleEs, `${w}.exampleEs`);
      checkSpanishPunctuation(s.exampleEs, `${w}.exampleEs`);
      if (seenSense.has(s.senseNo)) err('R35-sense-dup', w, `senseNo مكرر ${s.senseNo}`);
      seenSense.add(s.senseNo);
      // R36 — المثال يجب أن يحتوي المدخل أو تصريفًا منه (يكشف أمثلة لا علاقة لها بالمدخل)
      const head = norm(e.headword);
      const cands = new Set([head, ...head.split(' ').filter(x => x.length > 2)]);
      for (const fm of e.forms || []) if (fm.formEs) cands.add(norm(fm.formEs));
      for (const v of inflections(e.headword, e.plural)) cands.add(v);
      const exL = ' ' + norm(s.exampleEs) + ' ';
      const exTokens = exL.split(' ').filter(Boolean);
      const hit = [...cands].some(c => {
        if (c.length <= 1) return false;
        if (c.includes(' ')) return exL.includes(' ' + c + ' '); // مدخل مركّب (a menudo)
        return exTokens.some(t => t === c || stripEnclitic(t) === c);
      });
      if (!hit) warn('R36-example-fit', w, `المثال لا يحتوي المدخل «${e.headword}» ولا تصريفًا منه`);
      // R37 — المثال العربي لا يجب أن يكون نسخة من الإسباني
      if (norm(s.exampleAr) === norm(s.exampleEs)) err('R37-example-copy', w, 'الترجمة العربية للمثال مساوية لنصه الإسباني');
      // R38 — الخطأ الشائع المذكور لا يمكن أن يكون هو نفسه الصواب
      if (s.commonErrorAr && norm(s.commonErrorAr) === norm(s.exampleEs)) {
        err('R38-common-error', w, 'حقل الخطأ الشائع يساوي نص المثال');
      }
      // R46 — شرح الاستخدام لا يناقض بيانات التصريف المخزّنة
      // (كان يقول «فعل منتظم — كل الصيغ على النهايات القياسية» مع صيغ irregular:true)
      // المطابقة على ادعاء الانتظام نفسه، لا على أي ذكر لعبارة «النهايات القياسية»
      // (نص التحذير الصحيح يستخدم العبارة منفيّة: «فيه صيغ لا تتبع النهايات القياسية»).
      if (/فعل منتظم|كل الصيغ على النهايات القياسية/.test(s.usageNoteAr || '') && (e.forms || []).some(f => f.irregular)) {
        err('R46-usage-note', w, 'شرح الاستخدام يقول إن الفعل منتظم بينما فيه صيغ غير منتظمة');
      }
    }
    // R45 — مفاتيح صوت المفردات: معلّقة (لا ملفات مُنتَجة) وفريدة
    if (e.audioKey) {
      if (!e.audioKey.startsWith('pending/')) err('R45-vocab-audio', where, `audioKey غير معلَّق: ${e.audioKey}`);
      if (vocabAudio.has(e.audioKey)) err('R45-vocab-audio', where, `audioKey مكرر: ${e.audioKey} (${vocabAudio.get(e.audioKey)})`);
      else vocabAudio.set(e.audioKey, where);
    }
    for (const [fi, fm] of (e.forms || []).entries()) {
      if (fm.formEs) checkSpanishOnly(fm.formEs, `${where}.form[${fi}]`);
    }
  }
}

  return { stats, findings };
}

// ---------------------------------------------------------------------------
// واجهة سطر الأوامر (تُستدعى فقط عند التشغيل المباشر، لا عند الاستيراد)
// ---------------------------------------------------------------------------
function main(argv) {
  const dirIdx = argv.indexOf('--dir');
  const CONTENT_DIR = join(ROOT, dirIdx >= 0 && argv[dirIdx + 1] ? argv[dirIdx + 1] : 'content/drafts');
  const jsonIdx = argv.indexOf('--json');
  const JSON_OUT = jsonIdx >= 0 && argv[jsonIdx + 1] ? join(ROOT, argv[jsonIdx + 1]) : null;

  const { stats, findings } = auditContent(CONTENT_DIR);
  const errors = findings.filter(x => x.severity === 'error');
  const warns = findings.filter(x => x.severity === 'warn');
  const byRule = new Map();
  for (const f of findings) {
    const cur = byRule.get(f.rule) || { error: 0, warn: 0 };
    cur[f.severity] += 1;
    byRule.set(f.rule, cur);
  }

  console.log(`تدقيق جودة المحتوى — ${CONTENT_DIR.replace(ROOT + '/', '')}`);
  console.log(`  دروس: ${stats.lessons} · تمارين: ${stats.exercises} · خيارات: ${stats.options} · سيناريوهات: ${stats.scenarios} (${stats.scenarioLines} سطرًا)`);
  console.log(`  حزم مفردات: ${stats.vocabPacks} · مداخل: ${stats.vocabEntries} · حقول IPA: ${stats.ipa}`);
  console.log('');
  for (const f of findings) {
    const tag = f.severity === 'error' ? 'خطأ ' : 'تنبيه';
    console.log(`  [${tag}] ${f.rule} · ${f.where}\n          ${f.message}`);
  }
  console.log('');
  console.log('القواعد المخالَفة:');
  for (const [rule, c] of [...byRule].sort()) console.log(`  ${rule}: خطأ ${c.error} · تنبيه ${c.warn}`);
  console.log('');
  console.log(`النتيجة: ${errors.length} خطأ · ${warns.length} تنبيه`);

  if (JSON_OUT) {
    mkdirSync(dirname(JSON_OUT), { recursive: true });
    writeFileSync(JSON_OUT, JSON.stringify({ generatedAt: new Date().toISOString(), dir: CONTENT_DIR, stats, findings }, null, 2));
    console.log(`تقرير JSON: ${JSON_OUT.replace(ROOT + '/', '')}`);
  }
  process.exit(errors.length ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL(`file://${process.argv[1]}`))) {
  main(process.argv.slice(2));
}
