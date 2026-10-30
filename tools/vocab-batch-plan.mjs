#!/usr/bin/env node
/**
 * مخطِّط دفعات المفردات — يحوّل قائمة الانتظار القانونية إلى ملف دفعة جاهز للتأليف.
 *
 * لماذا: قوائم template-<level>.json تحتوي مئات المعرّفات، وتأليف الأمثلة يدويًا
 * يحتاج قراءة المدخل + المعنى + المثال الحالي معًا. هذه الأداة تُخرج تلك الحقول
 * فقط، بالترتيب الحتمي نفسه الذي يستعمله الكاشف، وتستبعد أي مدخل لم يبقَ مثالُه
 * قالبيًا (أي عُدِّل في دفعة سابقة) — فيصبح الاستئناف آمنًا بلا ازدواج.
 *
 * الاستعمال:
 *   node tools/vocab-batch-plan.mjs --level A1 [--limit 60] [--out plan.json]
 *   node tools/vocab-batch-plan.mjs --queue template-a1 --limit 60
 *
 * المخرَج: { level, queue, generatedAt, total, remainingAfter, entries: [...] }
 * كل مدخل: { itemId, bundle, headword, level, gender, meaningAr, currentExample }
 * لا يكتب الأداة أي محتوى — التأليف يبقى قرارًا بشريًا/تحريريًا.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadInventory, isTemplateExample } from './lib/content-review.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const level = (arg('level') ?? '').toUpperCase();
const queueName = arg('queue') ?? (level ? `template-${level.toLowerCase()}` : null);
if (!queueName) {
  console.error('حدّد --level A1 أو --queue template-a1');
  process.exit(2);
}
const limit = Number(arg('limit', '0')) || 0;
const out = arg('out');

const queuePath = join(ROOT, 'content/review/queues', `${queueName}.json`);
if (!existsSync(queuePath)) {
  console.error(`قائمة انتظار غير موجودة: ${queueName}`);
  process.exit(2);
}
const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
const wanted = new Set(queue.ids ?? []);

const inv = loadInventory(ROOT);
const byId = new Map(inv.vocab.map(item => [item.id, item]));

const entries = [];
let missing = 0;
let alreadyDone = 0;
for (const id of queue.ids ?? []) {
  const item = byId.get(id);
  if (!item) {
    missing += 1;
    continue;
  }
  const example = item.entry.senses?.[0]?.exampleEs ?? '';
  if (!isTemplateExample(item.entry.headword, example)) {
    // عُدِّل في دفعة سابقة (أو لم يبقَ قالبيًا) — لا يُعاد اختياره أبدًا.
    alreadyDone += 1;
    continue;
  }
  entries.push({
    itemId: id,
    bundle: item.bundle,
    headword: item.entry.headword,
    level: item.entry.level ?? null,
    gender: item.entry.gender ?? null,
    meaningAr: item.entry.senses?.[0]?.meaningArFusha ?? null,
    currentExample: example,
  });
  if (limit && entries.length >= limit) break;
}

const stillTemplate = [...wanted].filter(id => {
  const item = byId.get(id);
  if (!item) return false;
  return isTemplateExample(item.entry.headword, item.entry.senses?.[0]?.exampleEs ?? '');
}).length;

const plan = {
  level: level || queue.level || null,
  queue: queueName,
  generatedAt: new Date().toISOString().slice(0, 10),
  queueSize: (queue.ids ?? []).length,
  remainingTemplateInQueue: stillTemplate,
  selected: entries.length,
  skippedAlreadyCorrected: alreadyDone,
  skippedMissingFromInventory: missing,
  entries,
};

if (out) {
  writeFileSync(out, JSON.stringify(plan, null, 2) + '\n');
  console.log(`📝 ${entries.length} مرشّحًا → ${out}`);
} else {
  for (const e of entries) {
    console.log(`${e.headword}\t[${e.gender ?? '-'}]\t${e.meaningAr ?? ''}\t${e.currentExample}`);
  }
}
console.log(
  `قائمة ${queueName}: ${plan.queueSize} · متبقٍ قالبي ${stillTemplate} · ` +
    `جاهز ${plan.selected} · مُعدَّل سابقًا ${alreadyDone} · مفقود ${missing}`,
);
