#!/usr/bin/env node
/**
 * فحص خريطة المنهج + اتساقها مع ملفات المحتوى.
 * الاستخدام:
 *   node tools/check-curriculum.mjs [--dir content/drafts] [--json]
 * مخرجات: تقرير بشري + كود خروج 2 عند أي خطأ (يمنع الدمج في CI).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCurriculum, formatReport } from './lib/curriculum.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const dirs = arg('dir', 'content/drafts').split(',').map(s => s.trim()).filter(Boolean);

const map = JSON.parse(readFileSync(join(ROOT, 'content/curriculum/curriculum-map.v1.json'), 'utf8'));

/** يمشي في المجلد فرعيًا حتى يجد ملفات المحتوى */
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const bundles = [];
const lessonFiles = [];
for (const d of dirs) {
  const full = join(ROOT, d);
  if (!existsSync(full)) continue;
  for (const abs of walk(full)) {
    const rel = abs.slice(ROOT.length + 1);
    const f = basename(abs);
    const folder = rel.slice(0, rel.length - f.length - 1);
    if (f.startsWith('vocab-') && f.endsWith('.json')) {
      const b = JSON.parse(readFileSync(abs, 'utf8'));
      bundles.push({ slug: b.bundleSlug, entries: b.entries ?? [], file: rel });
    }
    if (f.startsWith('lesson-') && f.endsWith('.json')) {
      const l = JSON.parse(readFileSync(abs, 'utf8')).lesson;
      lessonFiles.push({ slug: l.slug, unlock: l.unlock, file: rel });
    }
  }
}

const result = validateCurriculum(map, { bundles, lessonFiles });
console.log(formatReport(result));
if (process.argv.includes('--json')) console.log(JSON.stringify({ stats: result.stats, errors: result.errors, warnings: result.warnings }, null, 2));
console.log(`\n**النتيجة: ${result.errors.length ? 'FAIL' : 'PASS'}**`);
process.exitCode = result.errors.length ? 2 : 0;
