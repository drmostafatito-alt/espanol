#!/usr/bin/env node
/**
 * أداة استبدال أمثلة المفردات القالبية بأمثلة حقيقية.
 *
 * تستقبل ملف دفعة بالشكل:
 *   { "queue": "...", "items": [ { "id": "vocab:<bundle>#<headword>",
 *                                  "es": "…", "ar": "…", "eg": "…" } ] }
 * وتستبدل `senses[0].exampleEs/exampleAr/exampleArEg` (والنسخة المرآة في
 * `examples[0]`) بعد التحقق. لا تكتب شيئًا بدون --apply.
 *
 * الفحوص (تفشل الدفعة كلها إن خالفها أي عنصر):
 *  - المعرّف موجود مرة واحدة ويشير إلى مدخل واحد.
 *  - الجملة الإسبانية تحتوي الكلمة الرأس حرفيًا (صيغة صحيحة إملائيًا).
 *  - 4 كلمات على الأقل وتنتهي بعلامة ترقيم.
 *  - العربية والفصحى والمصرية بعربية خالصة بلا حروف لاتينية.
 *  - المصرية ليست نسخة من الفصحى (تشابه < 0.82) وليست فارغة.
 *  - لا تكرار للجملة الإسبانية في أي مدخل آخر بالمعجم.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DRAFTS = path.join(ROOT, 'content', 'drafts');
const AUDIT = path.join(ROOT, 'reports', 'content-review', 'template-fixes.json');

const AR_ONLY = /^[\u0600-\u06FF0-9\s،؛؟.:!«»()\-–—…٪]+$/u;
const LATIN = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/;

function vocabFiles(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...vocabFiles(p));
    else if (/^vocab-.*\.json$/.test(ent.name)) out.push(p);
  }
  return out;
}
const norm = (s) => String(s || '').toLowerCase().replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();
function bigrams(s) {
  const t = norm(s).replace(/\s+/g, ' ');
  const m = new Map();
  for (let i = 0; i < t.length - 1; i++) { const g = t.slice(i, i + 2); m.set(g, (m.get(g) || 0) + 1); }
  return m;
}
function similarity(a, b) {
  const A = bigrams(a), B = bigrams(b);
  let inter = 0, total = 0;
  for (const [g, n] of A) { total += n; inter += Math.min(n, B.get(g) || 0); }
  for (const [, n] of B) total += n;
  return total ? (2 * inter) / total : 0;
}

const batchPath = process.argv[2];
const apply = process.argv.includes('--apply');
if (!batchPath) { console.error('usage: fix-vocab-example.mjs <batch.json> [--apply]'); process.exit(2); }
const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
const items = batch.items || [];
if (!items.length) { console.error('دفعة فارغة'); process.exit(2); }

const files = vocabFiles(DRAFTS);
const docs = new Map();
const index = new Map(); // id -> {file, entry}
const esCorpus = new Map(); // normalized es -> [ids]
for (const f of files) {
  const doc = JSON.parse(fs.readFileSync(f, 'utf8'));
  docs.set(f, doc);
  for (const e of doc.entries || []) {
    const id = `vocab:${doc.bundleSlug}#${e.headword}`;
    if (index.has(id)) { console.error(`معرّف مكرر في المعجم: ${id}`); process.exit(1); }
    index.set(id, { file: f, entry: e });
    for (const s of e.senses || []) if (s.exampleEs) {
      const k = norm(s.exampleEs);
      esCorpus.set(k, [...(esCorpus.get(k) || []), id]);
    }
  }
}

const errors = [];
const seen = new Set();
for (const it of items) {
  const tag = it.id || '(بلا معرّف)';
  if (!it.id || seen.has(it.id)) { errors.push(`${tag}: معرّف مفقود أو مكرر داخل الدفعة`); continue; }
  seen.add(it.id);
  const hit = index.get(it.id);
  if (!hit) { errors.push(`${tag}: غير موجود في المعجم`); continue; }
  const head = hit.entry.headword;
  const es = String(it.es || '').trim();
  const ar = String(it.ar || '').trim();
  const eg = String(it.eg || '').trim();
  if (!es || !ar || !eg) { errors.push(`${tag}: حقل ناقص`); continue; }
  if (!es.toLowerCase().includes(head.toLowerCase())) errors.push(`${tag}: الجملة لا تحتوي «${head}»`);
  if (es.split(/\s+/).length < 4) errors.push(`${tag}: جملة قصيرة جدًا`);
  if (!/[.!?…]$/.test(es)) errors.push(`${tag}: الجملة بلا علامة نهاية`);
  if (LATIN.test(ar) || LATIN.test(eg)) errors.push(`${tag}: حروف لاتينية في الترجمة`);
  if (!AR_ONLY.test(ar) || !AR_ONLY.test(eg)) errors.push(`${tag}: محارف غير عربية في الترجمة`);
  if (norm(ar) === norm(eg)) errors.push(`${tag}: المصرية نسخة من الفصحى`);
  if (similarity(ar, eg) >= 0.82) errors.push(`${tag}: المصرية قريبة جدًا من الفصحى (${similarity(ar, eg).toFixed(2)})`);
  if (ar.split(/\s+/).length < 3 || eg.split(/\s+/).length < 3) errors.push(`${tag}: ترجمة قصيرة جدًا`);
  const owners = (esCorpus.get(norm(es)) || []).filter((x) => x !== it.id);
  if (owners.length) errors.push(`${tag}: الجملة مكررة مع ${owners[0]}`);
}

if (errors.length) {
  console.error(`❌ ${errors.length} خطأ — لم يُكتب شيء:`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

const now = new Date().toISOString().slice(0, 10);
const changes = [];
for (const it of items) {
  const { file, entry } = index.get(it.id);
  const s = (entry.senses || [])[0];
  const before = { es: s.exampleEs ?? null, ar: s.exampleAr ?? null, eg: s.exampleArEg ?? null };
  s.exampleEs = it.es.trim(); s.exampleAr = it.ar.trim(); s.exampleArEg = it.eg.trim();
  if (Array.isArray(entry.examples) && entry.examples.length) {
    entry.examples[0].es = s.exampleEs; entry.examples[0].ar = s.exampleAr; entry.examples[0].arEg = s.exampleArEg;
  }
  changes.push({ id: it.id, file: path.relative(ROOT, file), before, after: { es: s.exampleEs, ar: s.exampleAr, eg: s.exampleArEg } });
}

if (!apply) {
  console.log(`✅ الدفعة سليمة: ${items.length} عنصرًا (لم يُطبَّق؛ أضف --apply)`);
  process.exit(0);
}

for (const [f, doc] of docs) {
  if (!changes.some((c) => path.join(ROOT, c.file) === f)) continue;
  fs.writeFileSync(f, JSON.stringify(doc, null, 2) + '\n', 'utf8');
}

const audit = fs.existsSync(AUDIT) ? JSON.parse(fs.readFileSync(AUDIT, 'utf8')) : { version: 1, batches: {} };
const batchId = batch.queue || path.basename(batchPath, '.json');
audit.batches[batchId] = { appliedAt: now, count: changes.length, itemIds: items.map((i) => i.id), changes };
audit.totalFixed = Object.values(audit.batches).reduce((n, b) => n + b.count, 0);
fs.mkdirSync(path.dirname(AUDIT), { recursive: true });
fs.writeFileSync(AUDIT, JSON.stringify(audit, null, 2) + '\n', 'utf8');
console.log(`✅ طُبِّق: ${changes.length} مثالًا في ${batchId} — الإجمالي ${audit.totalFixed}`);
