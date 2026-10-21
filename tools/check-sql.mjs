#!/usr/bin/env node
/**
 * tools/check-sql.mjs — فحص ثابت لملفات الترحيل (بلا اعتماديات، بلا sqlite3)
 *
 * يكتشف:
 *  1. CREATE TABLE مكرَّر.
 *  2. REFERENCES إلى جدول غير موجود.
 *  3. CREATE INDEX على جدول غير موجود.
 *  4. فهارس مكررة الأسماء.
 *  5. أعمدة مذكورة في index/UNIQUE غير موجودة في تعريف الجدول (فحص نصي).
 *  6. INSERT OR IGNORE إلى جدول/عمود غير مُعرَّف (فحص أعمدة القائمة).
 *  7. إحصاء الجداول والفهارس.
 *
 * لا يُعد بديلًا عن تنفيذ SQL فعليًا على D1 — يُعد تحققًا مبكرًا يمنع أخطاء الترحيل الشائعة.
 * الاستخدام: node tools/check-sql.mjs [glob]
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = process.argv[2] || join(root, 'db', 'migrations');
const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

const errors = [];
const warnings = [];
const tables = new Map();      // name -> {columns:Set, sql}
const indexes = new Map();
const insertTargets = [];

function stripComments(sql) {
  return sql.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

for (const f of files) {
  const raw = readFileSync(join(dir, f), 'utf8');
  const sql = stripComments(raw);

  // --- الجداول
  const tableRe = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z_][\w]*)\s*\(([\s\S]*?)\n\)\s*;/gi;
  let m;
  while ((m = tableRe.exec(sql))) {
    const name = m[1];
    if (tables.has(name)) errors.push(`${f}: جدول مكرَّر: ${name}`);
    const body = m[2];
    const cols = new Set();
    for (const line of body.split('\n')) {
      const l = line.trim();
      if (!l || /^(PRIMARY|UNIQUE|FOREIGN|CHECK|CONSTRAINT)\b/i.test(l)) continue;
      const c = l.match(/^([A-Za-z_][\w]*)\s+/);
      if (c) cols.add(c[1]);
    }
    tables.set(name, { columns: cols, sql: m[0], file: f });
  }

  // --- ALTER TABLE … ADD COLUMN (مهاجرات إضافية): تُضاف الأعمدة قبل فحص الفهارس
  const alterRe = /ALTER\s+TABLE\s+([A-Za-z_][\w]*)\s+ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z_][\w]*)/gi;
  while ((m = alterRe.exec(sql))) {
    const [, table, col] = m;
    const t = tables.get(table);
    if (!t) { errors.push(`${f}: ALTER على جدول غير مُعرَّف: ${table}`); continue; }
    if (t.columns.has(col)) errors.push(`${f}: العمود ${col} مضاف مرتين إلى ${table}`);
    t.columns.add(col);
  }

  // --- الفهارس
  const idxRe = /CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z_][\w]*)\s+ON\s+([A-Za-z_][\w]*)\s*\(([^)]*)\)/gi;
  while ((m = idxRe.exec(sql))) {
    const [, name, table, cols] = m;
    if (indexes.has(name)) errors.push(`${f}: فهرس مكرَّر: ${name}`);
    indexes.set(name, { table, cols, file: f });
  }

  // --- REFERENCES
  const fkRe = /REFERENCES\s+([A-Za-z_][\w]*)\s*\(/gi;
  while ((m = fkRe.exec(sql))) {
    const target = m[1];
    if (!tables.has(target)) {
      // قد يكون الجدول معرَّفًا في ملف لاحق (الملفات مرتبة أبجديًا) → نتحقق بعد الحلقة
      warnings.push(`${f}: REFERENCES إلى جدول غير مُعرَّف حتى الآن: ${target}`);
    }
  }

  // --- INSERT OR IGNORE INTO x (cols)
  const insRe = /INSERT\s+OR\s+IGNORE\s+INTO\s+([A-Za-z_][\w]*)\s*\(([^)]*)\)/gi;
  while ((m = insRe.exec(sql))) insertTargets.push({ table: m[1], cols: m[2].split(',').map(s => s.trim()), file: f });
}

// تحقق نهائي بعد معرفة كل الجداول
for (const [, idx] of indexes) {
  if (!tables.has(idx.table)) errors.push(`${idx.file}: فهرس ${idx.table} غير موجود`);
  else {
    const known = tables.get(idx.table).columns;
    for (const c of idx.cols.split(',').map(s => s.trim().split(/\s+/)[0]).filter(Boolean)) {
      if (!known.has(c)) errors.push(`${idx.file}: العمود ${c} في الفهرس ليس عمودًا في ${idx.table}`);
    }
  }
}
for (const ins of insertTargets) {
  const t = tables.get(ins.table);
  if (!t) { errors.push(`${ins.file}: INSERT إلى جدول غير موجود: ${ins.table}`); continue; }
  for (const c of ins.cols) {
    if (!t.columns.has(c)) {
      errors.push(`${ins.file}: INSERT عمود غير معروف ${c} في ${ins.table}`);
    }
  }
}

// REFERENCES بعد تجميع كل الجداول
for (const [name, t] of tables) {
  const fkRe = /REFERENCES\s+([A-Za-z_][\w]*)/gi;
  let m;
  while ((m = fkRe.exec(t.sql))) {
    if (!tables.has(m[1])) errors.push(`${t.file}: ${name} يشير إلى جدول غير موجود: ${m[1]}`);
  }
}

const lines = [];
lines.push('# نتيجة فحص DDL');
lines.push('');
lines.push(`الملفات: ${files.join(', ')}`);
lines.push(`الجداول: ${tables.size} · الفهارس: ${indexes.size}`);
lines.push('');
if (errors.length) {
  lines.push('## أخطاء');
  errors.forEach(e => lines.push(`- ❌ ${e}`));
} else lines.push('## أخطاء\n- لا شيء ✅');
if (warnings.length) {
  lines.push('');
  lines.push('## تنبيهات');
  warnings.forEach(w => lines.push(`- ⚠️ ${w}`));
}
lines.push('');
lines.push(errors.length ? '**النتيجة: FAIL**' : '**النتيجة: PASS**');

const out = lines.join('\n');
console.log(out);
process.exitCode = errors.length ? 1 : 0;
