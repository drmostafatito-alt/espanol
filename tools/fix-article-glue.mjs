#!/usr/bin/env node
/**
 * تطبيع «الـ» التعريف الملتصقة بمدخل عربي في حزم المفردات.
 *
 * الخلفية: فحص tools/content-review.mjs رصد 7072 حقلًا في 20 حزمة كُتب فيها
 * التعريف بصورة «الـحفرة» بدل «الحفرة» — أثر توليد آلي من قالب يلصق «الـ»
 * بمدخل عربي. التطبيع هنا حرفي بحت (حذف التطويل U+0640) ولا يغيّر أي كلمة،
 * ولا يمسّ «الـ» قبل كلمة لاتينية (الـvoseo / الـYeísmo) لأن ذلك أسلوب سليم.
 *
 * لا يُصلح هذا الأمر عيب القالب نفسه (جملة «… معروف جداً في هذا المجال»)
 * ولا أخطاء المطابقة فيه؛ تلك تبقى معلَّقة للمراجعة البشرية في السجل.
 *
 * الاستخدام:
 *   node tools/fix-article-glue.mjs            # عرض فقط
 *   node tools/fix-article-glue.mjs --apply    # كتابة
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadInventory } from './lib/content-review.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');
const GLUE = /الـ([\u0600-\u06FF])/g;

/** يحذف التطويل فقط حين يليه حرف عربي، ويعيد عدد المواضع المتغيرة */
function normalize(value) {
  let hits = 0;
  const next = value.replace(GLUE, (_, letter) => {
    hits += 1;
    return `ال${letter}`;
  });
  return { next, hits };
}

/** يمرّ على كل الحقول النصية في المستند ويطبّعها؛ يعيد عدد التغييرات */
function walk(node, ops) {
  if (typeof node === 'string') return null;
  if (Array.isArray(node)) {
    node.forEach((child, index) => {
      if (typeof child === 'string') {
        const { next, hits } = normalize(child);
        if (hits) {
          ops.count += hits;
          if (APPLY) node[index] = next;
        }
      } else {
        walk(child, ops);
      }
    });
    return null;
  }
  if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) {
      if (typeof child === 'string') {
        const { next, hits } = normalize(child);
        if (hits) {
          ops.count += hits;
          ops.fields.add(key);
          if (APPLY) node[key] = next;
        }
      } else {
        walk(child, ops);
      }
    }
  }
  return null;
}

const inv = loadInventory(ROOT);
const byFile = new Map();
for (const item of inv.vocab) {
  if (!byFile.has(item.file)) byFile.set(item.file, item.doc);
}

const report = [];
let total = 0;
for (const [file, doc] of [...byFile].sort()) {
  const ops = { count: 0, fields: new Set() };
  walk(doc, ops);
  if (!ops.count) continue;
  total += ops.count;
  report.push({ file, count: ops.count, fields: [...ops.fields].sort() });
  if (APPLY) {
    const abs = join(ROOT, file);
    const raw = readFileSync(abs, 'utf8');
    const indentMatch = raw.match(/\n( +)"/);
    const indent = indentMatch ? indentMatch[1] : 2;
    writeFileSync(abs, JSON.stringify(doc, null, indent) + (raw.endsWith('\n') ? '\n' : ''));
  }
}

for (const row of report) console.log(`${String(row.count).padStart(6)}  ${row.file}  ${row.fields.join(',')}`);
console.log(
  `\n${APPLY ? '✅ طُبِّع' : '👀 معاينة'} ${total} موضعًا في ${report.length} حزمة` +
    (APPLY ? '' : ' — أضف --apply للكتابة'),
);
process.exit(0);
