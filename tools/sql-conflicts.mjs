#!/usr/bin/env node
/**
 * تفريغ **كل** تعارضات مفاتيح الخطة في ملف قابل للمراجعة (لا يُصلح شيئًا بنفسه).
 *
 * المشكلة التي يحلّها: التصدير كان يطبع أول 8 تعارضات فقط ويكتب 50 مفتاحًا في
 * البيان، فيبقى معظمها غير مرئي — وقد حُسمت سابقًا «أول ظهور يفوز» بلا دليل.
 * هنا يُبنى نفس الخطة تمامًا (نفس buildContentPlan وdedupePlanStatements) ويُكتب
 * لكل تعارض: الجدول، المفتاح، الصفّ الأول، الصفّ اللاحق، وأعمدة كل منهما مفكوكة
 * عمودًا/قيمةً — كي يُحسم بقرار مكتوب لا بترتيب الملفات.
 *
 * الاستعمال:
 *   node tools/sql-conflicts.mjs [--out reports/content-review/sql-conflicts.json]
 */
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync } from 'node:fs';
import { buildContentPlan, dedupePlanStatements, collectGlobalLinks, linkInsertStatement, collectLessonSlugs } from './lib/content-plan.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outPath = resolve(ROOT, outIdx >= 0 ? args[outIdx + 1] : 'reports/content-review/sql-conflicts.json');

const targetDirs = ['content/exemplars', 'content/drafts'];
const draftSlugs = collectLessonSlugs(join(ROOT, 'content/drafts'));
const existingVersions = {};
const allStatements = [];
const allLinks = [];
const allConflicts = [];
for (const targetDir of targetDirs) {
  const plan = buildContentPlan(join(ROOT, targetDir), {
    existingVersions,
    lexiconDirs: [join(ROOT, 'content')],
    skipLessonSlugs: targetDir === 'content/exemplars' ? draftSlugs : null,
  });
  if (plan.errors?.length) {
    console.error(`❌ ${targetDir}: ${plan.errors.slice(0, 3).join(' | ')}`);
    process.exit(1);
  }
  if (plan.versions) Object.assign(existingVersions, plan.versions);
  // push(...) على 130 ألف عنصر يتجاوز حدّ المكدّس — حلقة صريحة
  for (const st of plan.statements) allStatements.push(st);
  for (const st of plan.linkStatements ?? []) allLinks.push(st);
  for (const c of plan.conflicts ?? []) allConflicts.push(c);
}
const globalLinks = collectGlobalLinks(join(ROOT, 'content')).links;
const links = [...new Set([...allLinks, ...globalLinks.map(linkInsertStatement)])];
const final = dedupePlanStatements([...allStatements, ...links]);
const conflicts = [...allConflicts, ...final.conflicts];

/** فك الصفّ إلى أعمدة/قيم (نفس منطق مفتاح الصفّ في content-plan). */
function decode(stmt) {
  const m = /^\s*INSERT\s+INTO\s+(\w+)\s*\(([^)]*)\)\s*VALUES\s*\(/i.exec(stmt);
  if (!m) return { table: null, columns: [], values: [] };
  const columns = m[2].split(',').map(c => c.trim());
  const values = [];
  let i = m[0].length, cur = '', inStr = false;
  for (; i < stmt.length; i += 1) {
    const ch = stmt[i];
    if (inStr) {
      if (ch === "'" && stmt[i + 1] === "'") { cur += "''"; i += 1; continue; }
      if (ch === "'") { inStr = false; cur += ch; continue; }
      cur += ch;
      continue;
    }
    if (ch === "'") { inStr = true; cur += ch; continue; }
    if (ch === ',') { values.push(cur.trim()); cur = ''; continue; }
    if (ch === ')') { if (cur.trim()) values.push(cur.trim()); break; }
    cur += ch;
  }
  return { table: m[1], columns, values };
}

const unq = v => (v === 'NULL' ? null : v.replace(/^'/, '').replace(/'$/, '').replace(/''/g, "'"));

const grouped = new Map();
for (const c of conflicts) {
  const key = `${c.table}:${c.key}`;
  if (!grouped.has(key)) grouped.set(key, { table: c.table, key: c.key, variants: [] });
  const g = grouped.get(key);
  for (const stmt of [c.first, c.later]) {
    const d = decode(stmt);
    const fields = {};
    d.columns.forEach((col, idx) => { fields[col] = unq(d.values[idx] ?? ''); });
    if (!g.variants.some(v => JSON.stringify(v) === JSON.stringify(fields))) g.variants.push(fields);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  statements: final.statements.length,
  dropped: final.dropped,
  conflicts: grouped.size,
  groups: [...grouped.values()].sort((a, b) => b.variants.length - a.variants.length),
};
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');

const byTable = {};
for (const g of report.groups) byTable[g.table] = (byTable[g.table] ?? 0) + 1;
console.log(`تعارضات: ${report.conflicts} مفتاحًا · أوامر مُسقطة: ${report.dropped} · أوامر نهائية: ${report.statements}`);
console.log('بحسب الجدول:', JSON.stringify(byTable));
for (const g of report.groups.slice(0, 12)) {
  const cols = Object.keys(g.variants[0]).filter(c => g.variants.some(v => v[c] !== g.variants[0][c]));
  console.log(`- ${g.table} ${g.key} · متغيّرات ${g.variants.length} · أعمدة مختلفة: ${cols.join(',') || '(متطابقة القيم)'}`);
}
console.log(`\nالملف: ${outPath.slice(ROOT.length + 1)}`);
