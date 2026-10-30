#!/usr/bin/env node
/**
 * إعادة كتابة الأمثلة القالبية في المفردات من دفعات مؤلَّفة بشريًا (كاتب الوكيل).
 *
 * الخلفية: 3467 مدخلًا (40% من 8572) مثالها جملة قالبية لا تُظهر معنى المدخل،
 * منها 155 بتعارض جنس («La bala es muy conocido…»). لا يجوز توليد البديل آليًا
 * ولا ترجمته آليًا، فكل جملة هنا مكتوبة ومُراجَعة يدويًا في ملف دفعة، ثم يطبّقها
 * هذا السكربت بحذر.
 *
 * الضمانات:
 *  1) يعمل فقط إن كان المثال الحالي أحد القوالب المعروفة (isTemplateExample في
 *     tools/lib/content-review.mjs — مصدر الحقيقة الوحيد) أو
 *     كان النص الجديد نفسه (تكرار آمن). أي نص آخر = «يحتاج مراجعة» ولا يُلمس.
 *  2) يكتب الحقول الأربعة معًا: senses[0].exampleEs/exampleAr و examples[0].es/ar
 *     (ولا يمسّ examples[0] إن لم يكن مطابقًا للقديم).
 *  3) idempotent: إعادة التشغيل بعد التطبيق ⇒ 0 تعديل، والبقية «مطبَّق سابقًا».
 *  4) يكتب أثرًا كاملًا قبل/بعد في reports/content-review/vocab-example-rewrites.json.
 *
 * الاستخدام:
 *   node tools/rewrite-vocab-examples.mjs content/review/vocab-examples/a1.json           # معاينة
 *   node tools/rewrite-vocab-examples.mjs content/review/vocab-examples/a1.json --apply   # كتابة
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isTemplateExample } from './lib/content-review.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUDIT = join(ROOT, 'reports/content-review/vocab-example-rewrites.json');

const normalize = value =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

// مصدر الحقيقة الوحيد لقوالب المفردات: tools/lib/content-review.mjs.
// (كانت هنا نسخة ثانية من القائمة، فانحرفت عن الكاشف: عائلات كاملة لم تُلمس.)
const isTemplate = (headword, example) => isTemplateExample(headword, example);

/* ------------------------------- القراءة ------------------------------- */

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const batchPath = resolve(ROOT, args.find(a => !a.startsWith('--')) ?? '');
if (!existsSync(batchPath)) {
  console.error('استخدم: node tools/rewrite-vocab-examples.mjs <batch.json> [--apply]');
  process.exit(2);
}
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));

/* فهرس حزم المفردات: يُبنى مرة واحدة من ملفات content/drafts */
const bundles = new Map();
const draftDir = join(ROOT, 'content/drafts');
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/^vocab-.*\.json$/.test(name)) files.push(full);
  }
})(draftDir);
for (const file of files) {
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  bundles.set(doc.bundleSlug, { file, doc });
}

/* -------------------------------- التطبيق -------------------------------- */

const audit = existsSync(AUDIT) ? JSON.parse(readFileSync(AUDIT, 'utf8')) : { batches: {}, fields: [] };
const report = { batch: batch.batch, applied: 0, skipped: 0, missing: [], unexpected: [], already: 0 };

for (const item of batch.entries) {
  const found = bundles.get(item.bundle);
  if (!found) { report.missing.push(`${item.bundle}#${item.headword} (حزمة غير موجودة)`); continue; }
  // مطابقة دقيقة أولًا (headword ثم normalized)، ثم مطابقة متسامحة مع التشكيل كاحتياط.
  // لا تصلح المطابقة المتسامحة وحدها: «papá» و«papa» مدخلان مختلفان يتطابقان إذا حُذف التشكيل.
  const sameNormalized = value => String(value ?? '').trim() === String(item.headword ?? '').trim();
  const entry =
    found.doc.entries.find(e => e.headword === item.headword) ||
    found.doc.entries.find(e => sameNormalized(e.normalized)) ||
    found.doc.entries.find(e => normalize(e.headword) === normalize(item.headword));
  if (!entry) { report.missing.push(`${item.bundle}#${item.headword}`); continue; }

  const sense = entry.senses?.[0] ?? {};
  const current = String(sense.exampleEs ?? '').trim();
  if (current === item.es.trim()) { report.already += 1; continue; }
  if (!isTemplate(entry.headword, current)) {
    report.unexpected.push(`${item.bundle}#${item.headword} ← «${current.slice(0, 60)}»`);
    continue;
  }
  if (!item.es?.trim() || !item.ar?.trim()) { report.missing.push(`${item.bundle}#${item.headword} (جملة ناقصة)`); continue; }

  const changes = [
    ['senses.0.exampleEs', current, item.es.trim()],
    ['senses.0.exampleAr', String(sense.exampleAr ?? ''), item.ar.trim()],
  ];
  const ex = entry.examples?.[0];
  const mirrors = Boolean(ex && String(ex.es ?? '').trim() === current);
  if (mirrors) changes.push(['examples.0.es', String(ex.es), item.es.trim()], ['examples.0.ar', String(ex.ar ?? ''), item.ar.trim()]);

  // الترجمة المصرية اختيارية في ملف الدفعة (حقل arEg). تُكتب في الحقلين المخصصين
  // لها في المخطط (senses[0].exampleArEg و examples[0].arEg) وتُترك null إن غابت.
  const arEg = typeof item.arEg === 'string' && item.arEg.trim() ? item.arEg.trim() : null;
  if (arEg) {
    changes.push(['senses.0.exampleArEg', String(sense.exampleArEg ?? ''), arEg]);
    if (mirrors) changes.push(['examples.0.arEg', String(ex.arEg ?? ''), arEg]);
  }

  if (APPLY) {
    sense.exampleEs = item.es.trim();
    sense.exampleAr = item.ar.trim();
    if (arEg) sense.exampleArEg = arEg;
    if (mirrors) { ex.es = item.es.trim(); ex.ar = item.ar.trim(); }
    if (mirrors && arEg) ex.arEg = arEg;
  }
  audit.fields.push({
    batch: batch.batch,
    // المعرّف القانوني يستخدم normalized (مفتاح الفهرس) لا صيغة العرض:
    // كتابة headword بحروف كبيرة كانت تُنتج معرّفًا لا يُحلّ إلى عنصر (كشفه مدقّق الدفعة).
    itemId: `vocab:${item.bundle}#${entry.normalized || entry.headword}`,
    level: entry.level ?? null,
    appliedAt: new Date().toISOString(),
    mirrorFieldsUpdated: mirrors,
    changes: changes.map(([path, before, after]) => ({ path, before, after })),
  });
  report.applied += 1;
}

if (APPLY && report.applied) {
  for (const [, found] of bundles) {
    // نكتب الحزم التي تغيّرت فقط
    const touched = batch.entries.some(i => i.bundle === found.doc.bundleSlug);
    if (touched) writeFileSync(found.file, JSON.stringify(found.doc, null, 2) + '\n');
  }
  mkdirSync(dirname(AUDIT), { recursive: true });
  audit.batches[batch.batch] = {
    date: new Date().toISOString().slice(0, 10),
    entries: batch.entries.length,
    applied: report.applied,
    skippedUnexpected: report.unexpected.length,
  };
  writeFileSync(AUDIT, JSON.stringify(audit, null, 2) + '\n');
}

console.log(`\n${APPLY ? '✅ طُبِّق' : '👀 معاينة'}: ${report.applied} مدخلًا من ${batch.entries.length} في «${batch.batch}»`);
if (report.already) console.log(`   مطبَّق سابقًا (idempotent): ${report.already}`);
if (report.missing.length) { console.log(`   ❌ غير موجود (${report.missing.length}):`); report.missing.slice(0, 10).forEach(m => console.log('     -', m)); }
if (report.unexpected.length) { console.log(`   ⚠️ مثال غير قالبي — لم يُلمس (${report.unexpected.length}):`); report.unexpected.slice(0, 10).forEach(m => console.log('     -', m)); }
if (!APPLY) console.log('   أضف --apply للكتابة\n');
