#!/usr/bin/env node
/**
 * مزامنة قوائم انتظار الأمثلة القالبية مع المحتوى الفعلي.
 *
 * سبب الوجود: القوائم كانت أرقامًا مكتوبة في ملفات، فكل إصلاح يتركها متأخرة عن
 * الواقع. هنا تُحسب من المصدر نفسه بنفس دالة الكشف التي يستخدمها المدقق
 * (`isTemplateExample`)، فلا يمكن أن تنحرف.
 *
 *   node tools/sync-template-queues.mjs           # معاينة الفروق
 *   node tools/sync-template-queues.mjs --apply   # كتابة القوائم
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadInventory, isTemplateExample } from './lib/content-review.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

const { vocab } = loadInventory(ROOT);
const byLevel = Object.fromEntries(LEVELS.map((l) => [l, []]));
for (const item of vocab) {
  const entry = item.entry;
  const example = entry.senses?.[0]?.exampleEs ?? '';
  const level = String(entry.level ?? '').toUpperCase();
  if (!byLevel[level]) continue;
  if (isTemplateExample(entry.headword, example)) byLevel[level].push(item.id);
}

let total = 0;
const summary = {};
for (const level of LEVELS) {
  const ids = byLevel[level];
  total += ids.length;
  const file = join(ROOT, `content/review/queues/template-${level.toLowerCase()}.json`);
  const before = existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')).ids ?? []).length : 0;
  // الأسماء القديمة محفوظة عمدًا (ids فقط جديدة) كي تبقى السجلات قابلة للتتبع.
  const next = { queue: `template-${level.toLowerCase()}`, level, ids, count: ids.length };
  const same = existsSync(file) && JSON.stringify(JSON.parse(readFileSync(file, 'utf8')).ids) === JSON.stringify(ids);
  summary[level] = `${before} → ${ids.length}`;
  if (APPLY && !same) writeFileSync(file, JSON.stringify(next, null, 1) + '\n', 'utf8');
}
console.log('بقايا الأمثلة القالبية بحسب المستوى:', summary);
console.log(APPLY ? `✅ مجموع ${total}` : `مجموع ${total} — معاينة فقط (--apply للكتابة)`);
