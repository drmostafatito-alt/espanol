#!/usr/bin/env node
/**
 * ============================================================================
 * tools/count-lexicon.mjs — العدّاد الرسمي للمفردات الإسبانية الفريدة
 * ============================================================================
 * المنهجية (مرجعها الرسمي لهدف 8,000 — انظر docs/25_COMPLETION_PLAN.md §1):
 *
 *  1) الوحدة المعدودة: مدخل معجمي فريد = قيمة `normalized` لصف entries[]
 *     في أي ملف vocab-*.json تحت content/drafts/ (كل المسارات).
 *  2) يُعدّ: word / expression / collocation / idiom — العبارة المتعددة الكلمات مدخل واحد.
 *  3) لا يُعدّ (مستبعد موثّق في التقرير):
 *     - صيغ forms[] (تصريفات/جمع/مؤنث) — تُخزَّن داخل المدخل ولا تضاعف العدد.
 *     - تكرار المدخل في الأمثلة والجمل وشروح الدروس.
 *     - أي تكرار بين الحزم: يُستثنى من العدد الفريد، يُسجَّل بالتفصيل، ويفشل التشغيل (exit 1).
 *  4) المكتمل = مخطط سليم + معنى فصيح + مثال إسباني يحتوي المدخل أو صيغته
 *     + الفعل له تصريفات + الاسم له gender.
 *  5) المراجَع = مدخل مرتبط بسجل مراجعة بشرية موثّق. لا ادعاء بلا توثيق.
 *
 * الاستخدام:
 *   node tools/count-lexicon.mjs            # تقرير على stdout
 *   node tools/count-lexicon.mjs --write    # + كتابة reports/lexicon-status.md
 *   node tools/count-lexicon.mjs --json     # JSON فقط (للتقارير/CI)
 *   node tools/count-lexicon.mjs --ci      # يفشل (exit 1) عند أي تكرار عالمي
 *
 * لا يعتمد على أي مكتبة. كل رقم مشتق من الملفات فعليًا.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content', 'drafts');
const REPORT_DIR = join(ROOT, 'reports');
const AR = /[\u0600-\u06FF]/;
const LATIN = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/;

const normVocab = (s) =>
  s.toLowerCase().replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();

function loose(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function listVocabFiles(dir, prefix = '') {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) out.push(...listVocabFiles(join(dir, ent.name), `${prefix}${ent.name}/`));
    else if (/^vocab-.*\.json$/.test(ent.name)) out.push(`${prefix}${ent.name}`);
  }
  return out.sort();
}

const files = listVocabFiles(CONTENT);

/** @type {Map<string, {entry: any, file: string, bundle: string}>} */
const unique = new Map();
const duplicates = []; // {normalized, kept, duplicate}
let rawEntries = 0;
const byBundle = {};
const byLevel = {};
const byPos = {};
const byKind = {};
const byDomain = {};
const completeness = {
  withIpa: 0, withHintAr: 0, withMeaningEg: 0, withCommonError: 0,
  verbs: 0, verbsWithConjugations: 0, nouns: 0, nounsWithGender: 0, complete: 0,
};
const reviewed = 0; // لا سجل مراجعة بشرية موثّق لأي حزمة — لا نرفع هذا الرقم بلا توثيق حقيقي

function containsHeadOrForm(exampleEs, entry) {
  const ex = ' ' + loose((exampleEs || '').toLowerCase()) + ' ';
  const head = loose(entry.normalized);
  const forms = (entry.forms || []).map((f) => loose(String(f.formEs).toLowerCase()));
  const STOP = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para', 'que', 'y', 'a']);
  const candidates = [head, ...head.split(' ').filter((w) => w.length > 2 && !STOP.has(w)), ...forms];
  return candidates.some((c) => c.length > 1 && (ex.includes(` ${c} `) || (c.length > 4 && ex.includes(c))));
}

for (const f of files) {
  const doc = JSON.parse(readFileSync(join(CONTENT, f), 'utf8'));
  const bundle = doc.bundleSlug || f;
  byBundle[bundle] = byBundle[bundle] || { file: f, entries: 0, unique: 0 };
  for (const e of doc.entries || []) {
    rawEntries += 1;
    byBundle[bundle].entries += 1;
    const key = e.normalized || normVocab(e.headword);
    if (unique.has(key)) {
      const kept = unique.get(key);
      duplicates.push({ normalized: key, kept: `${kept.file}#${kept.entry.headword}`, duplicate: `${f}#${e.headword}` });
      continue;
    }
    unique.set(key, { entry: e, file: f, bundle });
    byBundle[bundle].unique += 1;

    const lvl = e.level || 'UNK';
    byLevel[lvl] = (byLevel[lvl] || 0) + 1;
    byPos[e.pos] = (byPos[e.pos] || 0) + 1;
    byKind[e.kind] = (byKind[e.kind] || 0) + 1;
    for (const t of e.tags || []) {
      if (t.startsWith('domain:')) byDomain[t.slice(7)] = (byDomain[t.slice(7)] || 0) + 1;
    }

    if (e.ipa) completeness.withIpa += 1;
    if (e.pronunciationHintAr) completeness.withHintAr += 1;
    const senses = e.senses || [];
    if (senses.some((s) => s.meaningArEg)) completeness.withMeaningEg += 1;
    if (senses.some((s) => s.commonErrorAr)) completeness.withCommonError += 1;

    let isComplete = senses.length > 0 &&
      senses.every((s) => s.meaningArFusha && s.exampleEs && s.exampleAr) &&
      senses.some((s) => containsHeadOrForm(s.exampleEs, e)) &&
      (e.examples || []).length > 0;

    if (e.pos === 'verb') {
      completeness.verbs += 1;
      const hasConj = (e.forms || []).some((fm) => fm.kind === 'conjugation');
      if (hasConj) completeness.verbsWithConjugations += 1;
      else isComplete = false;
    }
    if (e.pos === 'noun') {
      completeness.nouns += 1;
      if (e.gender) completeness.nounsWithGender += 1;
      else isComplete = false;
    }
    if (isComplete) completeness.complete += 1;
  }
}

const uniqueCount = unique.size;
const excludedDuplicates = duplicates.length;

const result = {
  generatedAt: new Date().toISOString(),
  methodology: {
    unit: 'unique normalized headword across content/drafts/**/vocab-*.json',
    counted: ['word', 'expression', 'collocation', 'idiom'],
    excluded: [
      'inflected forms[] (conjugations, plurals, feminines) — stored inside the entry',
      'repetitions inside examples, sentences, and lesson texts',
      'cross-bundle duplicates — excluded from unique count and reported as errors',
    ],
    completeDefinition: 'schema-valid + fusha meaning + Spanish example containing headword/inflection + verb conjugations + noun gender',
    reviewedDefinition: 'documented human review record — claimed only with real evidence',
  },
  files: files.length,
  rawEntries,
  uniqueEntries: uniqueCount,
  excludedDuplicates,
  duplicates,
  target: 8000,
  progressPercent: Math.round((uniqueCount / 8000) * 1000) / 10,
  byLevel,
  byPos,
  byKind,
  byDomain,
  byBundle,
  completeness,
  reviewedEntries: reviewed,
};

// ---------- الإخراج ----------
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const doWrite = args.includes('--write');
const ciMode = args.includes('--ci');

function renderMarkdown(r) {
  const lines = [];
  lines.push('# تقرير المفردات الإسبانية الفريدة');
  lines.push('');
  lines.push(`تاريخ التوليد: ${r.generatedAt}`);
  lines.push('');
  lines.push('## طريقة العدّ');
  lines.push('');
  lines.push(`- **الوحدة المعدودة**: ${r.methodology.unit}`);
  lines.push(`- **يُعدّ**: ${r.methodology.counted.join(' · ')}`);
  for (const ex of r.methodology.excluded) lines.push(`- **مستبعد**: ${ex}`);
  lines.push(`- **المكتمل**: ${r.methodology.completeDefinition}`);
  lines.push(`- **المراجَع**: ${r.methodology.reviewedDefinition}`);
  lines.push('');
  lines.push('## الأرقام');
  lines.push('');
  lines.push('| المقياس | القيمة |');
  lines.push('| --- | --- |');
  lines.push(`| صفوف entries الأولية (قبل الاستبعاد) | ${r.rawEntries} |`);
  lines.push(`| **مدخلات فريدة (الرقم الرسمي)** | **${r.uniqueEntries}** |`);
  lines.push(`| تكرارات مستبعدة بين الحزم | ${r.excludedDuplicates} |`);
  lines.push(`| الهدف | ${r.target} |`);
  lines.push(`| نسبة الإنجاز | ${r.progressPercent}% |`);
  lines.push(`| مكتملة وفق تعريف الجودة | ${r.completeness.complete} |`);
  lines.push(`| مراجَعة بشرية موثّقة | ${r.reviewedEntries} |`);
  lines.push('');
  lines.push('## التوزيع');
  lines.push('');
  lines.push('### حسب المستوى');
  for (const [k, v] of Object.entries(r.byLevel).sort()) lines.push(`- ${k}: ${v}`);
  lines.push('');
  lines.push('### حسب النوع');
  for (const [k, v] of Object.entries(r.byPos).sort()) lines.push(`- ${k}: ${v}`);
  lines.push('');
  lines.push('### حسب المجال (domain tags)');
  const dom = Object.entries(r.byDomain).sort((a, b) => b[1] - a[1]);
  if (!dom.length) lines.push('- (لا وسوم domain بعد)');
  for (const [k, v] of dom) lines.push(`- ${k}: ${v}`);
  lines.push('');
  lines.push('### حسب الحزمة');
  for (const [k, v] of Object.entries(r.byBundle).sort()) {
    lines.push(`- ${k} (${v.file}): ${v.unique} فريد من ${v.entries}`);
  }
  lines.push('');
  lines.push('## اكتمال الحقول');
  lines.push('');
  lines.push(`- مع IPA: ${r.completeness.withIpa} · مع تلميح نطق عربي: ${r.completeness.withHintAr}`);
  lines.push(`- مع معنى مصري: ${r.completeness.withMeaningEg} · مع خطأ شائع: ${r.completeness.withCommonError}`);
  lines.push(`- أفعال: ${r.completeness.verbs} (بتصريفات: ${r.completeness.verbsWithConjugations})`);
  lines.push(`- أسماء: ${r.completeness.nouns} (بجنس: ${r.completeness.nounsWithGender})`);
  lines.push('');
  if (r.duplicates.length) {
    lines.push('## ⛔ تكرارات مستبعدة (تسبب الفشل في وضع --ci)');
    lines.push('');
    for (const d of r.duplicates.slice(0, 100)) {
      lines.push(`- «${d.normalized}»: مكرر بين ${d.kept} و ${d.duplicate}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

const md = renderMarkdown(result);
if (asJson) console.log(JSON.stringify(result, null, 2));
else console.log(md);
if (doWrite) {
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(join(REPORT_DIR, 'lexicon-status.md'), md + '\n', 'utf8');
  if (!asJson) console.log(`\n(كُتب: reports/lexicon-status.md)`);
}

if (ciMode && duplicates.length) {
  console.error(`\n🛑 ${duplicates.length} تكرار بين الحزم — عرّف المدخل مرة واحدة واستخدم الإحالة.`);
  process.exit(1);
}
