#!/usr/bin/env node
/**
 * ترحيل آمن لرأس مدخل مفردة (تصحيح إملائي) مع حفظ العلاقات.
 *
 * سبب الوجود: مدخلان في A2 رأس كلمتهما خطأ إملائي — `sabíamente` (ياء مكسورة
 * زائدة) و`traquea` (بلا نبرة، والصواب `tráquea`). تصحيح الرأس يغيّر
 * `normalized` ومنه `stableId('voc', normalized)`، فلا يجوز أن يُكتب نصًّا في
 * الملف وحده: كل مرجع للمدخل يجب أن يتحرك معه.
 *
 * ما يفعله (وبوّابة صارمة قبل أي كتابة):
 *   1) يتحقق أن كل تعديل يطابق مدخلًا واحدًا فقط في الحزمة المذكورة.
 *   2) يرفض إن كان المعرّف الجديد (normalized) مستخدمًا في أي حزمة أخرى
 *      (وإلا صار مدخلان بمعرّف واحد ⇒ فقدان/دمج بيانات).
 *   3) يبحث في **كل** ملفات `content/drafts` عن أي إشارة إلى المدخل القديم خارج
 *      الحزمة نفسها (مراجع دروس/تمارين/ترجمات) ويرفض إن وجد شيئًا لم يُعالج.
 *   4) يحدّث `headword` و`normalized` (صيغة العرض وصيغة الفهرسة) و`plural`
 *      وصيغ `forms[].formEs` المطابقة للقديم، ويصحّح الخطأ نفسه داخل الأمثلة
 *      العربية/الإسبانية للمدخل (مثل «La traquea» ⇒ «La tráquea»).
 *   5) يكتب خريطة ترحيل في `content/review/headword-migrations.v1.json`:
 *      oldId → newId، مع before/after، كي يكون أي استيراد لاحق قادرًا على
 *      مطابقة المعرّف القديم بدل فقدانه.
 *   6) idempotent: إعادة التشغيل بعد الترحيل ⇒ 0 تعديل.
 *
 * الاستعمال:
 *   node tools/migrate-headword.mjs                      # معاينة
 *   node tools/migrate-headword.mjs --apply              # كتابة
 *   node tools/migrate-headword.mjs --map my-map.json    # خريطة بديلة
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stableId } from './lib/content-plan.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIGRATIONS = join(ROOT, 'content/review/headword-migrations.v1.json');

/** الخريطة الافتراضية: تصحيحات إملائية مُثبتة (تُراجَع يدويًا وتُوسَّع بمراجع). */
const DEFAULT_MAP = [
  {
    bundle: 'cv-alphabet-u-z',
    from: 'sabíamente',
    to: 'sabiamente',
    plural: null,
    reason: 'ياء مكسورة زائدة بعد الألف (sabía + mente)، والصواب sabiamente — خطأ مطبعي لا صيغة معجمية.',
  },
  {
    bundle: 'cv-topic-health',
    from: 'traquea',
    to: 'tráquea',
    plural: 'tráqueas',
    reason: 'الكلمة مقطوعة الصوت على الألف (tra-que-a) فتحتاج نبرة: tráquea، وجمعها tráqueas.',
  },
];

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const mapArg = args.indexOf('--map');
const plan = mapArg >= 0 ? JSON.parse(readFileSync(args[mapArg + 1], 'utf8')) : DEFAULT_MAP;

/* فهرس الحزم */
const bundles = new Map();
const allFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.json')) allFiles.push(full);
  }
})(join(ROOT, 'content/drafts'));

for (const file of allFiles) {
  let doc;
  try { doc = JSON.parse(readFileSync(file, 'utf8')); } catch { continue; }
  if (doc && typeof doc === 'object' && doc.bundleSlug && Array.isArray(doc.entries)) {
    bundles.set(doc.bundleSlug, { file, doc });
  }
}

const normalizedOf = value => String(value).trim().toLowerCase();
const problems = [];
const already = [];
const work = [];

/** كل المعرّفات المستخدمة في كل الحزم — يجب ألا يستولي الترحيل على معرّف قائم. */
const idOwners = new Map();
for (const [slug, { doc }] of bundles) {
  for (const e of doc.entries) {
    const key = normalizedOf(e.normalized ?? e.headword);
    if (!idOwners.has(key)) idOwners.set(key, new Set());
    idOwners.get(key).add(`${slug}#${e.headword}`);
  }
}

for (const item of plan) {
  const found = bundles.get(item.bundle);
  if (!found) { problems.push(`${item.bundle}: حزمة غير موجودة`); continue; }
  const matches = found.doc.entries.filter(e => e.headword === item.from);
  if (matches.length === 0) {
    const done = found.doc.entries.find(e => e.headword === item.to);
    if (done) { already.push(`${item.bundle}#${item.from} → ${item.to}`); continue; }
    problems.push(`${item.bundle}#${item.from}: المدخل غير موجود (لا قديم ولا جديد)`);
    continue;
  }
  if (matches.length > 1) { problems.push(`${item.bundle}#${item.from}: ${matches.length} مدخلًا مطابقًا`); continue; }
  const entry = matches[0];
  const newKey = normalizedOf(item.to);
  const owners = idOwners.get(newKey);
  const conflicting = owners ? [...owners].filter(o => o !== `${item.bundle}#${item.from}`) : [];
  if (conflicting.length) {
    problems.push(`${item.bundle}#${item.from}: المعرّف الجديد «${newKey}» مستخدم في ${conflicting.join(', ')}`);
    continue;
  }
  // أي إشارة للصيغة القديمة خارج هذا المدخل في بقية المحتوى؟
  const outsideRefs = [];
  for (const file of allFiles) {
    if (file === found.file) continue;
    const raw = readFileSync(file, 'utf8');
    if (raw.includes(`"${item.from}"`)) outsideRefs.push(file.slice(ROOT.length + 1));
  }
  if (outsideRefs.length) {
    problems.push(`${item.bundle}#${item.from}: إشارات خارجية في ${outsideRefs.length} ملفًا (${outsideRefs.slice(0, 3).join(', ')}) — عالِجها أولًا`);
    continue;
  }
  work.push({ item, entry });
}

console.log(`الترحيلات المطلوبة: ${work.length} · مطبَّقة سابقًا: ${already.length}`);
if (problems.length) {
  console.log(`\n## مشاكل (${problems.length})`);
  for (const p of problems) console.log('- ' + p);
  console.log('\n**لم يُكتب شيء.**');
  process.exit(1);
}

/** استبدال آمن: كلمة كاملة لا ضمن كلمة أطول، مع الحفاظ على حالة الأحرف. */
function replaceWord(text, from, to) {
  if (!text) return text;
  const re = new RegExp(`(?<![\\p{L}])${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`, 'giu');
  return text.replace(re, m => {
    if (m === m.toUpperCase()) return to.toUpperCase();
    if (m[0] === m[0].toUpperCase()) return to[0].toUpperCase() + to.slice(1);
    return to;
  });
}

const migrations = existsSync(MIGRATIONS) ? JSON.parse(readFileSync(MIGRATIONS, 'utf8')) : { migrations: [] };
for (const { item, entry } of work) {
  const oldHead = entry.headword;
  const oldNorm = entry.normalized ?? entry.headword;
  const oldId = stableId('voc', oldNorm);
  entry.headword = item.to;
  entry.normalized = normalizedOf(item.to);
  if (item.plural != null) entry.plural = item.plural;
  if (Array.isArray(entry.forms)) {
    for (const form of entry.forms) {
      if (form && typeof form.formEs === 'string') form.formEs = replaceWord(form.formEs, oldHead, item.to);
    }
  }
  // تصحيح الخطأ داخل أمثلة المدخل نفسه (الثلاث لغات) — لا نصًّا عشوائيًا في الملف.
  for (const sense of entry.senses ?? []) {
    sense.exampleEs = replaceWord(sense.exampleEs, oldHead, item.to);
    sense.exampleAr = replaceWord(sense.exampleAr, oldHead, item.to);
    sense.exampleArEg = replaceWord(sense.exampleArEg, oldHead, item.to);
  }
  for (const ex of entry.examples ?? []) {
    ex.es = replaceWord(ex.es, oldHead, item.to);
    ex.ar = replaceWord(ex.ar, oldHead, item.to);
    ex.arEg = replaceWord(ex.arEg, oldHead, item.to);
  }
  for (const sense of entry.senses ?? []) sense.meaningArFusha = sense.meaningArFusha; // لا تُمسّ المعاني
  const rec = {
    date: '2026-10-30',
    bundle: item.bundle,
    oldHeadword: oldHead,
    newHeadword: entry.headword,
    oldNormalized: oldNorm,
    newNormalized: entry.normalized,
    oldStableId: oldId,
    newStableId: stableId('voc', entry.normalized),
    reason: item.reason ?? null,
  };
  migrations.migrations = migrations.migrations.filter(m => !(m.bundle === rec.bundle && m.oldHeadword === rec.oldHeadword));
  migrations.migrations.push(rec);
  console.log(`- ${item.bundle}: «${oldHead}» → «${entry.headword}» · ${oldId} → ${rec.newStableId}`);
}

if (!APPLY) {
  console.log('\nمعاينة فقط — أضف --apply للكتابة.');
  process.exit(0);
}

const touched = new Set(work.map(w => w.item.bundle));
for (const slug of touched) {
  const found = bundles.get(slug);
  writeFileSync(found.file, JSON.stringify(found.doc, null, 2) + '\n');
}
migrations.updatedAt = '2026-10-30';
writeFileSync(MIGRATIONS, JSON.stringify(migrations, null, 2) + '\n');
console.log(`✅ رُحِّل ${work.length} مدخلًا في ${touched.size} حزمة → ${MIGRATIONS.slice(ROOT.length + 1)}`);
