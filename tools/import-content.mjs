#!/usr/bin/env node
/**
 * ============================================================================
 * استيراد المحتوى إلى D1 المحلي — معرّفات ثابتة، تكرار آمن، وحالة «مسودة» دائمًا
 * ============================================================================
 * الاستخدام:
 *   node tools/import-content.mjs --dry-run
 *   node tools/import-content.mjs
 *
 * منطق التوليد نفسه في tools/lib/content-plan.mjs — مشترك مع اختبارات vitest،
 * حتى لا تنحرف نسخة الاختبار عن نسخة الاستيراد.
 *
 * قواعد صارمة:
 *   1) كل ما يُستورد بحالة draft وreview_state = unreviewed. لا شيء يُنشر.
 *   2) محلي فقط: يرفض --remote وproduction وdatabase_id حقيقيًا.
 *   3) تكرار آمن: نفس الملف ⇒ نفس المعرّفات، ولا إصدار جديد إن لم يتغيّر المحتوى.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildContentPlan } from './lib/content-plan.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const WRANGLER_CLI = join(ROOT, 'tools/wrangler-env/node_modules/wrangler/wrangler-dist/cli.js');
const WRANGLER_BIN = join(ROOT, 'tools/wrangler-env/node_modules/.bin/wrangler');
const [WRANGLER_EXEC, WRANGLER_BASE_ARGS] = existsSync(WRANGLER_CLI)
  ? [process.execPath, [WRANGLER_CLI]]
  : [WRANGLER_BIN, []];
const DB = 'es-ar-dev';
const DRY = process.argv.includes('--dry-run');

// مجلد المحتوى: افتراضيًا العينات، أو مسودات كاملة بـ --all أو مسار محدد بـ --dir
const dirIdx = process.argv.indexOf('--dir');
const targetDirs = dirIdx > 0 && process.argv[dirIdx + 1]
  ? [process.argv[dirIdx + 1]]
  : (process.argv.includes('--all') ? ['content/exemplars', 'content/drafts'] : ['content/exemplars']);

function refuse(reason) {
  console.error(`\n🛑 مرفوض: ${reason}\n`);
  process.exit(2);
}
if (process.argv.includes('--remote')) refuse('الاستيراد محلي فقط.');
if (process.env.ENVIRONMENT === 'production') refuse('متغيرات البيئة تشير إلى production.');
const toml = readFileSync(join(ROOT, 'wrangler.toml'), 'utf8');
const dbId = toml.match(/database_id\s*=\s*"([0-9a-f-]{36})"/i)?.[1];
if (dbId && dbId !== '00000000-0000-0000-0000-000000000000') refuse('database_id حقيقي في wrangler.toml — قد تكون قاعدة إنتاج.');

// البحث عن قاعدة D1 المحلية في .wrangler لتسريع الاستيراد إن وُجدت
let sqliteDb = null;
const sqliteDir = join(ROOT, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
if (existsSync(sqliteDir)) {
  const f = readdirSync(sqliteDir).find(x => x.endsWith('.sqlite'));
  if (f) {
    try {
      const { DatabaseSync } = await import('node:sqlite');
      sqliteDb = new DatabaseSync(join(sqliteDir, f));
      sqliteDb.exec('PRAGMA foreign_keys = ON;');
    } catch {}
  }
}

function d1(sql, { json = false } = {}) {
  const args = [...WRANGLER_BASE_ARGS, 'd1', 'execute', DB, '--local', '--command', sql];
  if (json) args.push('--json');
  const out = execFileSync(WRANGLER_EXEC, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (!json) return out;
  const i = out.indexOf('[');
  return i >= 0 ? JSON.parse(out.slice(i))[0].results : [];
}

function d1File(filePath) {
  const args = [...WRANGLER_BASE_ARGS, 'd1', 'execute', DB, '--local', '--file', filePath];
  return execFileSync(WRANGLER_EXEC, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

// حالة الإصدارات الحالية — تُقرأ من القاعدة لتحديد هل نحتاج إصدارًا جديدًا
function currentVersions() {
  let rows = [];
  try {
    if (sqliteDb) {
      rows = sqliteDb.prepare(
        `SELECT l.slug, lv.version_no, lv.content_hash FROM lessons l
         JOIN lesson_versions lv ON lv.id = l.current_version_id`,
      ).all();
    } else {
      rows = d1(
        `SELECT l.slug, lv.version_no, lv.content_hash FROM lessons l
         JOIN lesson_versions lv ON lv.id = l.current_version_id`,
        { json: true },
      );
    }
  } catch { /* قاعدة فارغة أو لم تُهيَّأ بعد */ }
  const map = {};
  for (const r of rows) map[r.slug] = { versionNo: r.version_no, contentHash: r.content_hash };
  return map;
}

const existingVersions = currentVersions();
const allStatements = [];
const aggregatedCounters = {};

for (const targetDir of targetDirs) {
  const { statements, counters, errors } = buildContentPlan(join(ROOT, targetDir), { existingVersions });
  if (errors.length) {
    console.error(`\n❌ المحتوى في ${targetDir} لم يجتز فحص الاستيراد:`);
    for (const e of errors) console.error('   - ' + e);
    process.exit(1);
  }
  console.log(`\n📦 ${targetDir} ⇒ ${statements.length} أمر SQL جاهز`);
  console.log('   ' + Object.entries(counters).map(([k, v]) => `${k}=${v}`).join('  '));
  allStatements.push(...statements);
  for (const [k, v] of Object.entries(counters)) {
    aggregatedCounters[k] = (aggregatedCounters[k] ?? 0) + v;
  }
}

if (DRY) {
  console.log('\n(dry-run) لم تُكتب أي بيانات.\n');
  if (sqliteDb) sqliteDb.close();
  process.exit(0);
}

if (sqliteDb) {
  sqliteDb.exec('BEGIN TRANSACTION;');
  try {
    for (let i = 0; i < allStatements.length; i++) {
      sqliteDb.exec(allStatements[i]);
      if (i % 2000 === 0 || i === allStatements.length - 1) {
        process.stdout.write(`\r   نُفِّذ ${i + 1}/${allStatements.length}`);
      }
    }
    sqliteDb.exec('COMMIT;');
  } catch (err) {
    sqliteDb.exec('ROLLBACK;');
    throw err;
  } finally {
    sqliteDb.close();
  }
} else {
  const batchIdx = process.argv.indexOf('--batch');
  const BATCH = batchIdx > 0 && process.argv[batchIdx + 1] ? Number(process.argv[batchIdx + 1]) : 40;
  const tmpFile = join(ROOT, '.wrangler', 'tmp-import.sql');
  for (let i = 0; i < allStatements.length; i += BATCH) {
    const chunk = allStatements.slice(i, i + BATCH).join(';\n') + ';';
    writeFileSync(tmpFile, chunk, 'utf8');
    try {
      d1File(tmpFile);
    } catch (err) {
      try { unlinkSync(tmpFile); } catch {}
      console.error(`\n❌ فشل عند الدفعة ${i / BATCH + 1}:`);
      console.error(String(err.stderr ?? err.message).slice(0, 1500));
      process.exit(1);
    }
    process.stdout.write(`\r   نُفِّذ ${Math.min(i + BATCH, allStatements.length)}/${allStatements.length}`);
  }
  try { unlinkSync(tmpFile); } catch {}
}
console.log('\n\n✅ تم الاستيراد — كل الصفوف بحالة draft / unreviewed. لم يُنشر شيء.');
