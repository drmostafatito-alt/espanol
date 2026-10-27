#!/usr/bin/env node
/**
 * ============================================================================
 * تدقيق «إطارات» أمثلة المفردات + تعدين أمثلة طبيعية (AUD-08)
 * ============================================================================
 * المشكلة: ثلث أمثلة المعجم تقريبًا مولّد بقوالب حشو من نوع
 *   «El/La X es muy importante en la vida cotidiana.» ×750
 * والمدققات القديمة ترى فقط «المثال يحتوي الكلمة» فلا تكشف القالب.
 *
 * هذه الأداة:
 *  1) تكشف الإطارات: تُستبدل الكلمة في المثال بـ § فتتجمع القوالب المتطابقة.
 *  2) عند --write: تستبدل مثالًا قالبيًا بجملة **مؤلّفة أصلًا في هذا المشروع**
 *     (سطور سيناريوهات الدروس وسياقات تمارينها مع ترجماتها) بشرط أن تحتوي
 *     الكلمة أو أحد تصريفاتها المعلنة (forms) ككلمة كاملة.
 *     لا توليد، لا اختلاق: ما لا يوجد له بديل مؤلّف يبقى ويُقرَّر صراحة.
 *  3) إصلاح أمثلة معدَّنة معيبة قائمة (فرق مستوى مفرط أو فخّ معنى) متى وُجد
 *     بديل أفضل مُثبت آليًا؛ وإلا تُدرج في قائمة مراجعة بشرية دون لمسها.
 *
 * ضوابط الاختيار (tools/lib/example-miner.mjs — مختبَرة آليًا):
 *  - لا مثال أعلى بأكثر من مستويين متى توفر بديل داخل النطاق.
 *  - لا لفظ محاصَر داخل تعبير ثابت بمعنى مختلف («a pesar de» مرجعية).
 *  - سقف إعادة استخدام الجملة تراكمي عبر كل التشغيلات (يُحسب الاستخدام
 *    الحالي من ملفات المفردات قبل أي تعدين).
 *  - كل استبدال آلي «مقترح» بانتظار عين بشرية: يُدرج قبل/بعد في التقرير،
 *    ولا تُدَّعى لأي جملة مراجعة بشرية.
 *
 * الاستخدام:
 *   node tools/audit-example-frames.mjs           # تقرير فقط
 *   node tools/audit-example-frames.mjs --write   # تطبيق الاستبدالات المعدّنة
 *   node tools/audit-example-frames.mjs --ci      # صامت إن لم تتجاوز النسبة حدًّا (انظر أدناه)
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import {
  LEVELS, MAX_LEVEL_GAP, MAX_SENTENCE_REUSE_TOTAL,
  norm, fold, acceptedForms, frameOf, isTrappedUse, chooseCandidate,
} from './lib/example-miner.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const WRITE = process.argv.includes('--write');
/** حدّ CI: نسبة الأمثلة القالبية المسموحة قبل الفشل — يُخفَّض تدريجيًا مع التحسين اليدوي */
const CI_MAX_FRAME_RATIO = 0.62; // سُجّل 0.67 قبل الإصلاح، و~0.60 بعده — لا رجوع للأعلى
const FRAME_MIN_COUNT = 8;

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap(ent => {
  const full = join(d, ent.name);
  if (ent.isDirectory()) return walk(full);
  return ent.name.endsWith('.json') ? [full] : [];
});
const load = (f) => JSON.parse(readFileSync(f, 'utf8'));

/* ---------------- Corpus الجمل المؤلّفة في المشروع ---------------- */
function buildCorpus() {
  const seen = new Map();
  const add = (es, ar, arEg, level) => {
    const e = norm(es);
    if (!e || !norm(ar)) return;
    if (e.includes('____') || e.includes('...')) return;
    const wc = e.split(' ').length;
    if (wc < 3 || wc > 16) return;
    const key = fold(e);
    if (!seen.has(key)) seen.set(key, { es: e, ar: norm(ar), arEg: norm(arEg) || null, level: LEVELS[level] ?? 2, uses: 0 });
  };
  for (const f of walk(join(ROOT, 'content')).filter(x => basename(x).startsWith('lesson-'))) {
    const L = load(f).lesson;
    if (!L) continue;
    for (const sc of L.scenarios ?? []) for (const ln of sc.lines ?? []) add(ln.es, ln.ar, ln.arEg, L.level);
    for (const ex of L.exercises ?? []) {
      add(ex.stemEs, ex.stemAr, null, L.level);
      add(ex.speechEs, ex.stemAr, null, L.level);
    }
  }
  return [...seen.values()];
}

/* ------------------------------ التشغيل ------------------------------ */
const vocabFiles = walk(join(ROOT, 'content')).filter(x => basename(x).startsWith('vocab-'));
const corpus = buildCorpus();
const corpusByFold = new Map(corpus.map(c => [fold(c.es), c]));

// 1) جمع الأمثلة وبناء الإطارات + عدّ الاستخدام الحالي لكل جملة Corpus
//    (السقف التراكمي: ما استُخدم في تشغيلات سابقة يُحسب قبل أي اختيار جديد)
const records = []; // {file, data, entry, sense, forms, frame}
const frames = new Map();
const rawByFile = new Map();
function detectFormat(raw, data) {
  for (const indent of ['  ', ' ', '    ', '\t']) {
    const ser = JSON.stringify(data, null, indent);
    if (ser === raw) return { indent, nl: '' };
    if (ser + '\n' === raw) return { indent, nl: '\n' };
  }
  return null;
}

for (const file of vocabFiles) {
  const data = load(file);
  rawByFile.set(file, readFileSync(file, 'utf8'));
  for (const entry of data.entries ?? []) {
    const forms = acceptedForms(entry);
    for (const sense of entry.senses ?? []) {
      if (!sense.exampleEs) continue;
      const frame = frameOf(sense.exampleEs, forms);
      const rec = { file, data, entry, sense, forms, frame };
      records.push(rec);
      if (!frames.has(frame)) frames.set(frame, []);
      frames.get(frame).push(rec);
      const existing = corpusByFold.get(fold(sense.exampleEs));
      if (existing) existing.uses++;
    }
  }
}
const templateFrames = [...frames.entries()].filter(([, rs]) => rs.length >= FRAME_MIN_COUNT);
const templateSet = new Set(templateFrames.flatMap(([, rs]) => rs.map(r => `${r.entry.normalized}#${r.sense.senseNo}`)));

// أمثلة قائمة معيبة بمقاييس آلية (ليست قالبية بالضرورة): فرق مستوى مفرط
// (يُقاس فقط لمثال معروف مصدره من الـcorpus) أو فخ معنى — للإصلاح/المراجعة
const defectiveExisting = [];
for (const rec of records) {
  if (templateSet.has(`${rec.entry.normalized}#${rec.sense.senseNo}`)) continue;
  const entryLevel = LEVELS[rec.entry.level] ?? 2;
  const src = corpusByFold.get(fold(rec.sense.exampleEs));
  const levelGap = src ? src.level - entryLevel : 0;
  const trapped = isTrappedUse(rec.sense.exampleEs, rec.entry, rec.forms);
  if (levelGap > MAX_LEVEL_GAP || trapped) {
    defectiveExisting.push({ rec, reason: trapped ? 'فخ معنى (تعبير ثابت)' : `فرق مستوى +${levelGap}` });
  }
}

// 2) التعدين والإصلاح بضوابط المثال الواحدة
const changes = [];          // {word, reason, before, after}
const humanReviewQueue = []; // {word, reason, example}
const dirtyFiles = new Set();

function applyCandidate(rec, cand, reason) {
  cand.uses++;
  const before = rec.sense.exampleEs;
  changes.push({ word: rec.entry.normalized, reason, before, after: cand.es });
  if (!WRITE) return;
  rec.sense.exampleEs = cand.es;
  rec.sense.exampleAr = cand.ar;
  if (cand.arEg) rec.sense.exampleArEg = cand.arEg;
  for (const ex of rec.entry.examples ?? []) {
    if (norm(ex.es) === norm(before)) { ex.es = cand.es; ex.ar = cand.ar; if (cand.arEg) ex.arEg = cand.arEg; }
  }
  dirtyFiles.add(rec.file);
}

let replaced = 0;
const noCandidate = [];
for (const [, rs] of templateFrames) {
  for (const rec of rs) {
    const cand = chooseCandidate(corpus, {
      forms: rec.forms, entry: rec.entry, entryLevel: LEVELS[rec.entry.level] ?? 2,
    });
    // نفس إطار القالب ليس إصلاحًا
    if (!cand || frameOf(cand.es, rec.forms) === rec.frame) { noCandidate.push(rec); continue; }
    replaced++;
    applyCandidate(rec, cand, 'مثال قالبي');
  }
}

let repaired = 0;
for (const { rec, reason } of defectiveExisting) {
  const entryLevel = LEVELS[rec.entry.level] ?? 2;
  const cand = chooseCandidate(corpus, {
    forms: rec.forms, entry: rec.entry, entryLevel, skipFolded: fold(rec.sense.exampleEs),
  });
  // الإصلاح يتطلب بديلًا أفضل مُثبتًا: داخل نطاق المستوى ودون فخّ (chooseCandidate
  // يفضّل داخل النطاق؛ نرفض هنا أي بديل خارج النطاق لأنه ليس تحسينًا مؤكدًا)
  if (cand && cand.level - entryLevel <= MAX_LEVEL_GAP) {
    repaired++;
    applyCandidate(rec, cand, `إصلاح: ${reason}`);
  } else {
    humanReviewQueue.push({ word: rec.entry.normalized, reason, example: rec.sense.exampleEs });
  }
}

let writtenFiles = 0;
const skippedFormat = [];
if (WRITE) {
  const byFile = new Map();
  for (const rec of records) if (dirtyFiles.has(rec.file)) byFile.set(rec.file, rec.data);
  for (const [file, data] of byFile) {
    const fmt = detectFormat(rawByFile.get(file), JSON.parse(rawByFile.get(file)));
    if (!fmt) { skippedFormat.push(file); continue; }
    writeFileSync(file, JSON.stringify(data, null, fmt.indent) + fmt.nl, 'utf8');
    writtenFiles++;
  }
  if (skippedFormat.length) {
    console.error(`⚠️ ملفات لم يُكشف تنسيقها الحرفي فلم تُلمس (${skippedFormat.length}) — راجعها يدويًا.`);
  }
}

// 3) التقرير
const total = records.length;
const templated = templateSet.size;
const remaining = templated - replaced;
const ratio = total ? templated / total : 0;
const overCap = corpus.filter(c => c.uses > MAX_SENTENCE_REUSE_TOTAL)
  .sort((a, b) => b.uses - a.uses);
const lines = [];
lines.push('# تقرير إطارات أمثلة المفردات (AUD-08)');
lines.push('');
lines.push(`> توليد تلقائي بواسطة tools/audit-example-frames.mjs — لا مراجعة بشرية ضمنية. كل بديل آلي مقترح بانتظار مراجعة بشرية.`);
lines.push('');
lines.push(`- إجمالي أمثلة المعاني: ${total}`);
lines.push(`- إطارات قالبية (تكرار ≥ ${FRAME_MIN_COUNT}): ${templateFrames.length} إطارًا تغطي ${templated} مثالًا (${(ratio * 100).toFixed(1)}%)`);
lines.push(`- جمل مؤلَّفة متاحة للتعدين من دروس المشروع: ${corpus.length}`);
lines.push(`- قالبية قابلة للاستبدال بضوابط (مستوى ≤ +${MAX_LEVEL_GAP} عند التوفر، بلا فخاخ معنى، سقف استخدام تراكمي ${MAX_SENTENCE_REUSE_TOTAL}): ${replaced}${WRITE ? ' (طُبِّقت)' : ' (تقرير فقط)'}`);
lines.push(`- أمثلة قائمة معيبة آليًا (مستوى/معنى): ${defectiveExisting.length} — أُصلح منها ببديل أفضل مُثبت: ${repaired}، وبلا بديل آمن إلى قائمة المراجعة البشرية: ${humanReviewQueue.length}`);
lines.push(`- بلا بديل مؤلَّف للقالبية (تبقى وتحتاج تأليفًا/مراجعة بشرية): ${noCandidate.length}`);
lines.push(`- جمل تجاوزت سقف الاستخدام التراكمي تاريخيًا (لن تُمنح استخدامات جديدة): ${overCap.length}`);
lines.push('');
lines.push('## أكبر الإطارات');
lines.push('');
lines.push('| التكرار | الإطار |');
lines.push('|---:|---|');
for (const [frame, rs] of templateFrames.sort((a, b) => b[1].length - a[1].length).slice(0, 25)) {
  lines.push(`| ${rs.length} | ${frame} |`);
}
lines.push('');
lines.push(`## قبل/بعد للمغيَّرة (${changes.length})`);
lines.push('');
lines.push('| الكلمة | السبب | قبل | بعد |');
lines.push('|---|---|---|---|');
for (const ch of changes.slice(0, 400)) lines.push(`| ${ch.word} | ${ch.reason} | ${ch.before} | ${ch.after} |`);
if (changes.length > 400) lines.push(`| … | | (${changes.length - 400} أخرى في فرق Git) | |`);
lines.push('');
lines.push(`## قائمة مراجعة بشرية — معيبة آليًا وبلا بديل آمن (${humanReviewQueue.length})`);
lines.push('');
lines.push('> هذه لم تُلمس. ليست سليمة بالمقياس الآلي، وليست مراجَعة بشريًا — تحتاج قرار مؤلّف/مراجع.');
lines.push('');
for (const q of humanReviewQueue.slice(0, 200)) lines.push(`- ${q.word} (${q.reason}): «${q.example}»`);
lines.push('');
lines.push('## أمثلة بلا بديل مؤلَّف (عينة حتى 60)');
lines.push('');
for (const r of noCandidate.slice(0, 60)) lines.push(`- ${r.entry.normalized}: «${r.sense.exampleEs}»`);
writeFileSync(join(ROOT, 'reports', 'example-frames-audit.local.md'), lines.join('\n') + '\n', 'utf8');

console.log(`أمثلة: ${total} | قالبية: ${templated} (${(ratio * 100).toFixed(1)}%) في ${templateFrames.length} إطارًا | بدائل معدّنة: ${replaced} | إصلاحات قائمة: ${repaired} | قائمة بشرية: ${humanReviewQueue.length} | متبقٍّ قالبي: ${remaining}`);
console.log(`التقرير: reports/example-frames-audit.local.md`);
if (WRITE) console.log(`✏️ حُدِّثت ${writtenFiles} ملفات مفردات.`);

if (process.argv.includes('--ci') && ratio > CI_MAX_FRAME_RATIO) {
  console.error(`❌ نسبة الأمثلة القالبية ${(ratio * 100).toFixed(1)}% تتجاوز حد CI (${CI_MAX_FRAME_RATIO * 100}%).`);
  process.exit(1);
}
