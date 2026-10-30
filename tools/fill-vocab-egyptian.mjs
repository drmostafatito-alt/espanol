#!/usr/bin/env node
/**
 * تحرير أمثلة المفردات العادية (غير القالبية) من دفعات مؤلَّفة، بثلاث لغات.
 *
 * سبب الوجود: أداة `rewrite-vocab-examples.mjs` تعمل على الأمثلة **القالبية**
 * فقط. لكن بقية الأمثلة فيها عيبان لا تصل إليهما: الترجمة المصرية **غائبة**
 * (1357 مثالًا في A2 وحدها: `senses[0].exampleArEg` و`examples[0].arEg` = null)،
 * وجملة عادية لكنها غير طبيعية أو لا تُظهر معنى المدخل أو فوق مستوى A2.
 * لا تُترجم الآلة شيئًا: كل نص هنا مكتوب يدويًا في ملف دفعة.
 *
 * الضمانات (كلها تُفحص قبل أي كتابة — أي مشكلة ⇒ خروج بغير الصفر ولا كتابة):
 *   1) الحزمة والمدخل موجودان؛ أي حقل لا تذكره الدفعة يبقى كما هو.
 *   2) المثال الإسباني: غير قالبي، ويحتوي المدخل أو تصريفه (كمنطق المدقّق)،
 *      وينتهي بعلامة، ولا يتشابه (ثلاثيات كلمات ≥ 0.5) مع أي مثال آخر في المعجم
 *      — نفس عتبة `check-vocab-batch.mjs`، بلا تخفيف.
 *   3) الفصحى والمصرية: نص عربي بلا حروف لاتينية، بعلامة ختام، وطول معقول.
 *   4) المصرية ليست نسخة من الفصحى: لا تطابق حرفيًا، وتشابه الكلمات < 0.8،
 *      وفيها أثر لهجي مصري على حدود الكلمة (مش/بتاع/عايز/فيه/لسه/كده/دلوقتي…
 *      أو سوابق المضارع ب- والمستقبل هـ-).
 *   5) لا تُطمس ترجمة مصرية قائمة إلا إن كانت الدفعة تعيد كتابة المثال الإسباني
 *      نفسه (حالة الإصلاح الموثّقة)، وتبقى الفحوص 3 و4 سارية.
 *   6) يكتب sense/examples[0] معًا، ويكتب أثرًا كاملًا قبل/بعد في
 *      reports/content-review/egyptian-fills.json. إعادة التشغيل ⇒ 0 تعديل.
 *
 * الاستعمال:
 *   node tools/fill-vocab-egyptian.mjs content/review/vocab-examples/eg1.json           # معاينة
 *   node tools/fill-vocab-egyptian.mjs content/review/vocab-examples/eg1.json --apply   # كتابة
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadInventory, isTemplateExample } from './lib/content-review.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUDIT = join(ROOT, 'reports/content-review/egyptian-fills.json');
const STOP = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para', 'que', 'y', 'a']);

// لا فحص «عربي فقط» بنطاق محارف (كان يعاقب علامات الترقيم والشرطة)، بل منع
// الحروف اللاتينية — وهو المقصود أصلًا.
const HAS_LATIN = /[A-Za-z\u00C0-\u024F]/;

const MARKERS = [
  'مش', 'ما', 'بتاع', 'بتاعة', 'بتوع', 'حاجة', 'حاجات', 'كده', 'كدا', 'دلوقتي', 'ده', 'دي', 'دول', 'محدش', 'أكتر', 'اكتر', 'لما', 'قعد', 'قعدت', 'قعدوا', 'إمبارح', 'امبارح', 'النهارده', 'أوي', 'اوي', 'ميراث', 'حاجات', 'دلوقت',
  'خالص', 'بقه', 'بقى', 'عايز', 'عاوز', 'عايزة', 'عاوزة', 'فيه', 'فيها', 'لسه', 'لسة',
  'عشان', 'علشان', 'زي', 'إيه', 'ايه', 'ليه', 'فين', 'امتى', 'إمتى', 'معايا', 'معاه',
  'معاها', 'اللي', 'هو', 'هي', 'كمان', 'برضه', 'بردو', 'أهو', 'اهو',
  'شوية', 'علطول', 'طيب', 'أيوه', 'ايوه', 'مفيش', 'فاضل', 'جوه', 'بره',
  'مية', 'مايه', 'ماية', 'ميّة', 'أوي', 'اوي', 'ميراث', 'حاجات', 'كويس', 'كويسة', 'عندنا', 'عندهم',
  'بتاعه', 'بتاعت', 'بتاعي', 'بيقول', 'بيقدر', 'عاوزين', 'هنروح', 'هيبقى',
  'الماية', 'المية', 'المايه', 'وقت', 'دلوقت', 'كام', 'ولا', 'مفيش',
  'الفطار', 'فطار', 'الغدا', 'العشا', 'مخدة', 'كسرولة', 'حلة', 'الطاسة', 'الطرابيزة',
  'ده', 'دي', 'دول', 'محدش', 'أكتر', 'اكتر', 'لما', 'قعد', 'قعدت', 'قعدوا',
  'إمبارح', 'امبارح', 'النهارده', 'بتاعنا', 'بتاعك', 'بتاعه', 'بتاعها',
  'محتاج', 'محتاجة', 'اديني', 'هات', 'خد', 'شوف', 'بص', 'خلاص',
];
/** حدود عربية: «ولسه» و«وعشان» مصريتان أيضًا، والواو أداة عطف لا تُخرج الكلمة عن اللهجة. */
const BOUNDARY = '(?:^|[\\s،؛:.!?,]|[وف])';
const MARKER_RE = new RegExp(
  BOUNDARY + '(' + MARKERS.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?=[\\s،؛:.!?,]|$)',
);
/**
 * سوابق مصرية: مضارع ب- (بيكتب) ومستقبل هـ- (هيكون).
 * `\b` لا يصلح مع العربية في JS (الحرف العربي ليس «word char»)، فكانت
 * «بتغلي/بيقرا/هيروح» لا تُكتشف أبدًا. الحدود صريحة هنا.
 */
const PREFIX = /(?:^|[\s،؛:.!?])[وف]?(?:ب|هـ)[\u0621-\u0652]{2,}(?=[\s،؛:.!?,]|$)/;

const norm = value =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
const words = value => norm(value).match(/[\u0600-\u06FF]+/g) ?? [];
const similarity = (a, b) => {
  const A = new Set(words(a)), B = new Set(words(b));
  if (!A.size || !B.size) return 0;
  const inter = [...A].filter(x => B.has(x)).length;
  return inter / (A.size + B.size - inter);
};
const hasDialectMark = value => MARKER_RE.test(value) || PREFIX.test(value);

const normVocab = s => s.toLowerCase().replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();
const loose = s => norm(s).replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();
const esWords = s => s.toLowerCase().match(/[\p{L}]+/gu) ?? [];
const trigrams = ws => {
  const out = new Set();
  for (let i = 0; i + 3 <= ws.length; i += 1) out.add(ws.slice(i, i + 3).join(' '));
  return out;
};
const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  const inter = [...a].filter(x => b.has(x)).length;
  return inter / (a.size + b.size - inter);
};

/** نفس منطق validate-content: هل يرد المدخل أو أحد تصريفاته؟ */
function headwordHit(entry, example) {
  const head = normVocab(entry.headword);
  const candidates = new Set([head, loose(entry.headword), ...head.split(' ').filter(w => w.length > 2 && !STOP.has(w))]);
  for (const fm of entry.forms || []) candidates.add(loose(fm.formEs));
  const exLoose = ' ' + loose(example) + ' ';
  const hit = [...candidates].some(c => c.length > 1 && exLoose.includes(' ' + c + ' ')) ||
    [...candidates].some(c => c.length > 4 && exLoose.includes(c));
  return hit;
}

/* ------------------------------- القراءة ------------------------------- */

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const batchPath = resolve(ROOT, args.find(a => !a.startsWith('--')) ?? '');
if (!existsSync(batchPath)) {
  console.error('استخدم: node tools/fill-vocab-egyptian.mjs <batch.json> [--apply]');
  process.exit(2);
}
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));

const bundles = new Map();
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/^vocab-.*\.json$/.test(name)) {
      const doc = JSON.parse(readFileSync(full, 'utf8'));
      bundles.set(doc.bundleSlug, { file: full, doc });
    }
  }
})(join(ROOT, 'content/drafts'));

const inv = loadInventory(ROOT);
const lexicon = inv.vocab.map(item => ({
  key: `${item.bundle}#${item.entry.headword}`,
  headword: item.entry.headword,
  tris: trigrams(esWords(item.entry.senses?.[0]?.exampleEs ?? '')),
}));

/* ------------------------------ التحقّق ------------------------------ */

const problems = [];
const already = [];
const valid = [];
const seen = new Set();
for (const item of batch.entries ?? []) {
  const key = `${item.bundle}#${item.headword}`;
  if (seen.has(key)) problems.push(`${key}: مكرر داخل الدفعة`);
  seen.add(key);
  const found = bundles.get(item.bundle);
  if (!found) { problems.push(`${key}: حزمة غير موجودة`); continue; }
  const entry = found.doc.entries.find(e => e.headword === item.headword) ||
    found.doc.entries.find(e => (e.normalized ?? e.headword) === (item.normalized ?? item.headword));
  if (!entry) { problems.push(`${key}: المدخل غير موجود`); continue; }
  const sense = entry.senses?.[0];
  if (!sense) { problems.push(`${key}: لا معنى أول`); continue; }

  const curEs = String(sense.exampleEs ?? '').trim();
  const curAr = String(sense.exampleAr ?? '').trim();
  const curEg = String(sense.exampleArEg ?? '').trim();
  const wantEs = item.es != null ? String(item.es).trim() : curEs;
  const wantAr = item.ar != null ? String(item.ar).trim() : curAr;
  const wantEg = item.arEg != null ? String(item.arEg).trim() : curEg;

  const esChanged = wantEs !== curEs;
  const arChanged = wantAr !== curAr;
  const egChanged = wantEg !== curEg;

  if (!esChanged && !arChanged && !egChanged) { already.push(key); continue; }

  if (esChanged) {
    if (isTemplateExample(entry.headword, wantEs)) problems.push(`${key}: الجملة الجديدة مطابقة لقالب`);
    if (!/[.!?]$/.test(wantEs)) problems.push(`${key}: الجملة لا تنتهي بعلامة ترقيم`);
    if (/^\s|\s$/.test(wantEs) || /\s{2,}/.test(wantEs)) problems.push(`${key}: مسافات شاذة في الجملة`);
    if (!headwordHit(entry, wantEs)) problems.push(`${key}: الجملة لا تحتوي المدخل ولا تصريفه ⇒ ستنبيه جديد`);
    if (esWords(wantEs).length < 3) problems.push(`${key}: جملة قصيرة جدًا`);
    const mine = trigrams(esWords(wantEs));
    const worst = lexicon
      .filter(row => row.key !== key)
      .map(row => [row.key, jaccard(mine, row.tris)])
      .sort((a, b) => b[1] - a[1])[0];
    if (worst && worst[1] >= 0.5) problems.push(`${key}: تشابه ${worst[1].toFixed(2)} مع ${worst[0]} — أعد الصياغة`);
  }
  if (arChanged) {
    if (HAS_LATIN.test(wantAr)) problems.push(`${key}: الفصحى فيها حروف لاتينية`);
    if (wantAr.length < 8) problems.push(`${key}: الفصحى قصيرة جدًا`);
    if (!/[.!?؟]$/.test(wantAr)) problems.push(`${key}: الفصحى بلا علامة ختام`);
  }
  if (curEg && egChanged && !esChanged) {
    problems.push(`${key}: إعادة كتابة مصرية قائمة بلا إعادة صياغة المثال — غير مسموح`);
    continue;
  }
  if (!wantEg) { problems.push(`${key}: المصرية غائبة — يجب تزويدها`); continue; }
  if (egChanged) {
    if (HAS_LATIN.test(wantEg)) problems.push(`${key}: المصرية فيها حروف لاتينية`);
    if (wantEg.length < 8) problems.push(`${key}: المصرية قصيرة جدًا`);
    if (wantEg.length > 240) problems.push(`${key}: المصرية طويلة جدًا`);
    if (!/[.!?؟]$/.test(wantEg)) problems.push(`${key}: المصرية بلا علامة ختام`);
    if (/^\s|\s$/.test(wantEg) || /\s{2,}/.test(wantEg)) problems.push(`${key}: مسافات شاذة في المصرية`);
    if (wantEg === wantAr) problems.push(`${key}: المصرية مطابقة للفصحى حرفيًا`);
    else {
      const sim = similarity(wantEg, wantAr);
      if (sim >= 0.8) problems.push(`${key}: تشابه مع الفصحى ${sim.toFixed(2)} — ليست مصرية حقيقية («${wantEg}»)`);
      // دليل اللهجة لا يقوم على قائمة كلمات وحدها: جملة مصرية صحيحة قد تخلو من
      // «مش/بتاع» (مثل «حكاية تيتي أثّرت فيّا»). الشرط: أثر لهجي صريح **أو**
      // إعادة صياغة جوهرية عن الفصحى (تشابه الكلمات ≤ 0.6)، وإلا فهي فصحى منزوعة.
      if (!hasDialectMark(wantEg) && sim > 0.6) {
        problems.push(`${key}: بلا أثر لهجي مصري ولا إعادة صياغة كافية (تشابه ${sim.toFixed(2)}) («${wantEg}»)`);
      }
    }
  }
  valid.push({ key, bundle: item.bundle, headword: item.headword, entry, sense, curEs, curAr, curEg, wantEs, wantAr, wantEg,
    esChanged, arChanged, egChanged });
}

console.log(`الدفعة: ${batch.batch} · مداخل ${(batch.entries ?? []).length} · صالحة ${valid.length} · مطبَّق سابقًا ${already.length}`);
if (problems.length) {
  console.log(`\n## مشاكل (${problems.length})`);
  for (const p of problems) console.log('- ' + p);
  console.log('\n**لم يُكتب شيء.**');
  process.exit(1);
}

if (!APPLY) {
  console.log('\nمعاينة فقط — أضف --apply للكتابة.');
  process.exit(0);
}

/* -------------------------------- التطبيق -------------------------------- */

mkdirSync(dirname(AUDIT), { recursive: true });
const audit = existsSync(AUDIT) ? JSON.parse(readFileSync(AUDIT, 'utf8')) : { batches: {}, fields: [] };
const touched = new Set();
const changes = [];
for (const row of valid) {
  const { entry, sense, bundle, headword } = row;
  if (row.esChanged) sense.exampleEs = row.wantEs;
  if (row.arChanged) sense.exampleAr = row.wantAr;
  if (row.egChanged) sense.exampleArEg = row.wantEg;
  const ex0 = Array.isArray(entry.examples) ? entry.examples[0] : null;
  if (ex0 && String(ex0.es ?? '').trim() === row.curEs) {
    if (row.esChanged) ex0.es = row.wantEs;
    if (row.arChanged) ex0.ar = row.wantAr;
    if (row.egChanged) ex0.arEg = row.wantEg;
  }
  touched.add(bundle);
  const fieldChanges = [];
  if (row.esChanged) fieldChanges.push({ path: 'senses.0.exampleEs', before: row.curEs, after: row.wantEs });
  if (row.arChanged) fieldChanges.push({ path: 'senses.0.exampleAr', before: row.curAr || null, after: row.wantAr });
  if (row.egChanged) fieldChanges.push({ path: 'senses.0.exampleArEg', before: row.curEg || null, after: row.wantEg });
  changes.push({
    itemId: `vocab:${bundle}#${entry.normalized ?? headword}`,
    bundle, headword, level: entry.level, changes: fieldChanges,
  });
}
if (changes.length === 0) {
  console.log('لا تغييرات جديدة — لم يُكتب شيء (idempotent).');
  process.exit(0);
}

for (const slug of touched) {
  const found = bundles.get(slug);
  writeFileSync(found.file, JSON.stringify(found.doc, null, 2) + '\n');
}
audit.batches[batch.batch] = {
  appliedAt: new Date().toISOString().slice(0, 10),
  entries: valid.length,
  itemIds: changes.map(c => c.itemId),
};
audit.fields = [...audit.fields.filter(f => f.batch !== batch.batch), ...changes.map(c => ({ batch: batch.batch, ...c }))];
writeFileSync(AUDIT, JSON.stringify(audit, null, 2) + '\n');
console.log(`✅ طُبِّق: ${valid.length} مدخلًا في ${touched.size} حزمة → ${AUDIT.replace(ROOT + '/', '')}`);
