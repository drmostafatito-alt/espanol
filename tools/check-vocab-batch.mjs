#!/usr/bin/env node
/**
 * مدقّق دفعة المفردات قبل التطبيق — بوابة واحدة تُشغَّل على كل دفعة.
 *
 * يقلّد فحص validate-content.mjs حرفيًا في منطق «هل يرد المدخل/تصريفه في المثال؟»
 * حتى لا يُدخل أي مثال تنبيهًا جديدًا، ويضيف فحوص الجودة التحريرية:
 *   • قالبية المثال قبل التعديل (وإلا فالمدخل ليس هدفًا صالحًا)
 *   • عدم بقاء المثال قالبيًا بعد التعديل
 *   • تكرار حرفي مع أي مدخل آخر في المعجم
 *   • تشابه شبيه (تشابه ثلاثيات كلمات ≥ 0.5) داخل الدفعة ومع المعجم
 *   • طول الجملة (مناسب للمستوى) وغياب الأبنية المتقدمة في A1/A2
 *   • الترجمة العربية: نص عربي بلا حروف لاتينية، وطول معقول
 *   • تطابق أداة التعريف مع جنس المدخل
 *
 * الاستعمال:
 *   node tools/check-vocab-batch.mjs content/review/vocab-examples/<batch>.json
 * الخروج بغير الصفر عند أي مشكلة — لا يعالج ولا يكتب شيئًا.
 */
import { readFileSync } from 'node:fs';
import { loadInventory, isTemplateExample } from './lib/content-review.mjs';
import { articleGenderProblem } from './lib/article-gender.mjs';

const STOP = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para', 'que', 'y', 'a']);
const normVocab = s =>
  s.toLowerCase().replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();
const loose = s =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();

/** نفس منطق validate-content: هل يرد المدخل أو أحد تصريفاته؟ */
function headwordHit(entry, example) {
  const head = normVocab(entry.headword);
  const candidates = new Set([head, loose(head), ...head.split(' ').filter(w => w.length > 2 && !STOP.has(w))]);
  for (const fm of entry.forms || []) candidates.add(loose(fm.formEs));
  const exLoose = ' ' + loose(example) + ' ';
  const hit = [...candidates].some(c => c.length > 1 && exLoose.includes(' ' + c + ' ')) ||
    [...candidates].some(c => c.length > 4 && exLoose.includes(c));
  return hit;
}

const words = s => s.toLowerCase().match(/[\p{L}]+/gu) ?? [];
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

const ADVANCED = /\b(hubiera|hubiese|siempre que|a menos que|no obstante|sin embargo|por lo tanto|puesto que|a fin de que|con tal de que|mientras que)\b/i;
const COMPOUND_TENSE = /\b(habría|habré|hubiera|hubiese|fuese|fiera)\b/i;

const file = process.argv[2];
if (!file) {
  console.error('الاستعمال: node tools/check-vocab-batch.mjs <batch.json>');
  process.exit(2);
}
const batch = JSON.parse(readFileSync(file, 'utf8'));
const inv = loadInventory(process.cwd());

const byKey = new Map();
for (const item of inv.vocab) {
  const key = `${item.bundle}#${item.entry.headword}`;
  if (!byKey.has(key)) byKey.set(key, item);
}
const lexicon = inv.vocab.map(item => ({
  headword: item.entry.headword,
  example: item.entry.senses?.[0]?.exampleEs ?? '',
}));
const byExample = new Map();
for (const row of lexicon) {
  const k = row.example.trim().toLowerCase();
  if (!byExample.has(k)) byExample.set(k, []);
  byExample.get(k).push(row.headword);
}

const problems = [];
const stats = { total: 0, confirmedTemplateBefore: 0, alreadyApplied: 0, notTemplate: 0 };
for (const item of batch.entries ?? []) {
  stats.total += 1;
  const key = `${item.bundle}#${item.headword}`;
  const found = byKey.get(key);
  if (!found) {
    problems.push(`${key}: غير موجود في الفهرس`);
    continue;
  }
  const entry = found.entry;
  const sense = entry.senses?.[0] ?? {};
  const current = String(sense.exampleEs ?? '').trim();
  const nextEs = String(item.es ?? '').trim();
  const nextAr = String(item.ar ?? '').trim();

  if (current === nextEs) {
    stats.alreadyApplied += 1;
    continue;
  }
  if (!isTemplateExample(entry.headword, current)) {
    stats.notTemplate += 1;
    problems.push(`${key}: المثال الحالي ليس قالبيًا — ليس هدفًا صالحًا («${current.slice(0, 60)}»)`);
    continue;
  }
  stats.confirmedTemplateBefore += 1;

  if (!nextEs || !nextAr) {
    problems.push(`${key}: جملة أو ترجمة ناقصة`);
    continue;
  }
  if (isTemplateExample(entry.headword, nextEs)) problems.push(`${key}: الجملة الجديدة مطابقة لقالب`);
  if (!/[.!?]$/.test(nextEs)) problems.push(`${key}: لا تنتهي بعلامة ترقيم`);
  if (/^\s|\s$/.test(nextEs)) problems.push(`${key}: مسافة طرفية`);
  if (/\s{2,}/.test(nextEs)) problems.push(`${key}: مسافات مزدوجة`);
  if (/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(nextAr)) problems.push(`${key}: ترجمة عربية فيها حروف لاتينية`);
  if (nextAr.trim().length < 8) problems.push(`${key}: ترجمة عربية قصيرة جدًا`);
  if (!headwordHit(entry, nextEs)) problems.push(`${key}: الجملة لا تحتوي المدخل ولا تصريفه ⇒ ستنبيه جديد`);
  // علامة الاستفهام العربية «؟» علامة ختام صحيحة، وكان غيابها من المجموعة يعاقب ترجمة سليمة.
  if (!/[.!?؟]$/.test(nextAr)) problems.push(`${key}: الترجمة بلا علامة ختام`);

  // الترجمة المصرية (arEg) اختيارية، لكنها إن وُجدت يجب أن تكون عربية سليمة ومختلفة
  // عن الفصحى — نسخ الفصحى في حقل مصري ليس ترجمة مصرية بل حقل زائد.
  const nextArEg = typeof item.arEg === 'string' ? item.arEg.trim() : '';
  if (nextArEg) {
    if (/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(nextArEg)) problems.push(`${key}: الترجمة المصرية فيها حروف لاتينية`);
    if (nextArEg.length < 8) problems.push(`${key}: الترجمة المصرية قصيرة جدًا`);
    if (!/[.!?؟]$/.test(nextArEg)) problems.push(`${key}: الترجمة المصرية بلا علامة ختام`);
    if (nextArEg === nextAr.trim()) problems.push(`${key}: الترجمة المصرية مطابقة للفصحى حرفيًا`);
  }

  const ws = words(nextEs);
  const maxWords = ['A1', 'A2'].includes(String(entry.level).toUpperCase()) ? 14 : 20;
  if (ws.length > maxWords) problems.push(`${key}: جملة طويلة (${ws.length} كلمة) لمستوى ${entry.level}`);
  if (ws.length < 3) problems.push(`${key}: جملة قصيرة جدًا`);
  if (['A1', 'A2'].includes(String(entry.level).toUpperCase()) && ADVANCED.test(nextEs)) {
    problems.push(`${key}: بناء متقدّم غير مناسب للمستوى`);
  }
  if (COMPOUND_TENSE.test(nextEs)) problems.push(`${key}: زمن مركّب/افتراضي غير مناسب`);

  const lower = nextEs.trim().toLowerCase();
  const owners = (byExample.get(lower) ?? []).filter(h => h !== entry.headword);
  if (owners.length) problems.push(`${key}: جملة مكررة حرفيًا مع ${owners.join(', ')}`);
  const tg = trigrams(ws);
  for (const row of lexicon) {
    if (row.headword === entry.headword) continue;
    const sim = jaccard(tg, trigrams(words(row.example)));
    if (sim >= 0.5) {
      problems.push(`${key}: تشابه ${sim.toFixed(2)} مع «${row.headword}»: ${row.example}`);
      break;
    }
  }

  const ap = articleGenderProblem(entry, nextEs);
  if (ap) problems.push(`${key}: ${ap}`);
}

console.log(`📋 ${file}`);
console.log(`   إجمالي ${stats.total} · قالبية مؤكَّدة قبل التعديل ${stats.confirmedTemplateBefore} · مطبَّق سابقًا ${stats.alreadyApplied} · غير قالبي ${stats.notTemplate}`);
if (problems.length) {
  console.log(`   ❌ مشاكل ${problems.length}:`);
  for (const p of problems) console.log(`     - ${p}`);
  process.exit(1);
}
console.log('   ✅ كل الفحوص نظيفة');
