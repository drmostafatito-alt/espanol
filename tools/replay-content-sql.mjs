#!/usr/bin/env node
/**
 * إعادة تنفيذ ملف تصدير المحتوى داخل قاعدة SQLite محلية مؤقتة — مرتين.
 *
 * الغرض: إثبات أن أوامر التصدير (١) صحيحة نحويًا، (٢) تحترم المفاتيح الأجنبية
 * (PRAGMA foreign_keys=ON)، (٣) آمنة إعادة التنفيذ (تطبيقها مرتين لا يضاعف
 * الصفوف ولا يفشل) — قبل أي استيراد مستقبلي. لا يلمس قاعدة الإنتاج إطلاقًا.
 *
 * الاستعمال:
 *   node tools/export-content-sql.mjs --out /tmp/content.sql
 *   node tools/replay-content-sql.mjs /tmp/content.sql [/tmp/replay.db]
 */
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
const dir = '/home/user/espanol/db/migrations';
const db = new DatabaseSync(process.argv[3] ?? '/tmp/replay.db');
db.exec('PRAGMA foreign_keys=ON;');
for (const f of readdirSync(dir).sort()) {
  const sql = readFileSync(dir + '/' + f, 'utf8');
  try { db.exec(sql); } catch (e) { console.log('migration fail', f, e.message.slice(0,120)); }
}
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'd1_%' AND name NOT LIKE '_cf%' ORDER BY name").all().map(r => r.name);
const counts = () => Object.fromEntries(tables.map(t => [t, db.prepare(`SELECT COUNT(*) c FROM "${t}"`).get().c]));
const file = process.argv[2];
const stmts = readFileSync(file, 'utf8').split('-- __ES_AR_STMT_BOUNDARY__').map(s => {
  // احذف تعليقات الترويسة فقط، ولا تمسّ نص الأوامر
  return s.split('\n').filter(l => !l.trim().startsWith('--')).join('\n').trim();
}).filter(Boolean);
console.log('tables', tables.length, 'stmts', stmts.length);
let okFirst = 0, failFirst = []; 
db.exec('BEGIN');
for (const s of stmts) { try { db.exec(s); okFirst++; } catch (e) { failFirst.push(e.message.slice(0,140)); if (failFirst.length > 5) break; } }
db.exec('COMMIT');
const c1 = counts();
if (failFirst.length) { console.log('FAIL first run:', failFirst.slice(0,3)); process.exit(1); }
const before = db.prepare('SELECT COUNT(*) c FROM sentence_translations').get().c;
db.exec('BEGIN');
let okSecond = 0, failSecond = [];
for (const s of stmts) { try { db.exec(s); okSecond++; } catch (e) { failSecond.push(e.message.slice(0,140)); if (failSecond.length > 5) break; } }
db.exec('COMMIT');
const c2 = counts();
if (failSecond.length) { console.log('FAIL second run:', failSecond.slice(0,3)); process.exit(1); }
const diff = Object.keys(c1).filter(t => c1[t] !== c2[t]).map(t => `${t}: ${c1[t]} → ${c2[t]}`);
console.log('first run ok:', okFirst, '· second run ok:', okSecond);
console.log('sentence_translations', before, '→', c2.sentence_translations);
console.log(diff.length ? 'DIFF: ' + diff.join(', ') : '✅ إعادة التنفيذ لا تغيّر أي عدد صفوف');
