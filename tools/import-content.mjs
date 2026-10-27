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
import { buildContentPlan, collectGlobalLinks, linkInsertStatement } from './lib/content-plan.mjs';

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
if (process.argv.some(a => a.startsWith('--env') && !a.includes('local'))) refuse('تم تحديد بيئة wrangler غير محلية.');
if (process.env.WRANGLER_ENVIRONMENT === 'production' || process.env.ENVIRONMENT === 'production') {
  refuse('متغيرات البيئة تشير إلى production.');
}
const toml = readFileSync(join(ROOT, 'wrangler.toml'), 'utf8');
const dbId = toml.match(/database_id\s*=\s*"([0-9a-f-]{36})"/i)?.[1];
if (dbId && dbId !== '00000000-0000-0000-0000-000000000000') refuse('database_id حقيقي في wrangler.toml — قد تكون قاعدة إنتاج.');

// البحث عن قاعدة D1 المحلية في .wrangler لتسريع الاستيراد إن وُجدت
let sqliteDb = null;
const sqliteDir = join(ROOT, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
if (existsSync(sqliteDir)) {
  const sqliteFiles = readdirSync(sqliteDir).filter(x => x.endsWith('.sqlite') && !x.includes('-shm') && !x.includes('-wal'));
  if (sqliteFiles.length === 1) {
    const dbPath = join(sqliteDir, sqliteFiles[0]);
    // تجربة node:sqlite أولاً، ثم better-sqlite3 كبديل مدعوم
    try {
      const nodeSqlite = await import('node:sqlite');
      if (nodeSqlite && nodeSqlite.DatabaseSync) {
        const candidateDb = new nodeSqlite.DatabaseSync(dbPath);
        const check = candidateDb.prepare("SELECT count(1) as n FROM sqlite_master WHERE type='table' AND name IN ('lessons', 'programs', 'units')").get();
        if (check?.n === 3) {
          sqliteDb = candidateDb;
          sqliteDb.exec('PRAGMA foreign_keys = ON;');
          sqliteDb.exec('PRAGMA busy_timeout = 5000;');
        } else {
          candidateDb.close();
        }
      }
    } catch {}

    if (!sqliteDb) {
      try {
        const bSqlite = await import('better-sqlite3');
        const Database = bSqlite.default || bSqlite;
        const candidateDb = new Database(dbPath);
        const check = candidateDb.prepare("SELECT count(1) as n FROM sqlite_master WHERE type='table' AND name IN ('lessons', 'programs', 'units')").get();
        if (check?.n === 3) {
          sqliteDb = candidateDb;
          sqliteDb.pragma('foreign_keys = ON');
          sqliteDb.pragma('busy_timeout = 5000');
        } else {
          candidateDb.close();
        }
      } catch {}
    }
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

const allUnresolved = [];
const allLinks = [];
const allLinkStatements = [];
for (const targetDir of targetDirs) {
  // AUD-07: حلّ إحالات المفردات من جذر content/ كله، لا من مجلد الاستيراد فقط
  const { statements, counters, errors, unresolvedVocabRefs, links, linkStatements } = buildContentPlan(join(ROOT, targetDir), {
    existingVersions,
    lexiconDirs: [join(ROOT, 'content')],
  });
  if (Array.isArray(unresolvedVocabRefs)) allUnresolved.push(...unresolvedVocabRefs);
  if (Array.isArray(links)) allLinks.push(...links);
  if (Array.isArray(linkStatements)) allLinkStatements.push(...linkStatements);
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

if (allUnresolved.length) {
  const uniq = [...new Set(allUnresolved.map(u => u.word))].sort();
  console.log(`\n⚠️ إحالات مفردات بلا مدخل معجمي: ${allUnresolved.length} إحالة (${uniq.length} كلمة فريدة) — سجّلت ولم تُنشأ لها روابط.`);
}
// تقارير الاستيراد تُكتب كملفات محلية مهملة من Git حتى لا توسّخ الشجرة (AUD-20)
writeFileSync(join(ROOT, 'reports', 'vocab-unresolved-refs.local.json'),
  JSON.stringify({ count: allUnresolved.length, refs: allUnresolved }, null, 2), 'utf8');

if (DRY) {
  console.log('\n(dry-run) لم تُكتب أي بيانات.\n');
  if (sqliteDb) sqliteDb.close();
  process.exit(0);
}

// VER-04: مرور ربط نهائي شامل + تحقق من المنفَّذ فعليًا.
// الروابط داخل خطة كل مجلد محروسة بـEXISTS (أمان FK)، لكنها تُتخطى صامتة إن
// جاء مجلد الدروس قبل مجلد مفرداتها — والمستورِد نفسه يُستدعى لكل مجلد على
// حدة. لذلك يُعاد حساب كل الروابط من جذر content/ في كل استدعاء وتُنفَّذ بعد
// المحتوى، ثم تُطابَق بالأزواج الفعلية في القاعدة: رابط درسه ومدخله موجودان
// ولم يُنشأ = خطأ صريح يوقف الاستيراد، لا فقد صامت آخر.
const globalLinks = collectGlobalLinks(join(ROOT, 'content')).links;
const dedupedLinkStatements = [...new Set([...allLinkStatements, ...globalLinks.map(linkInsertStatement)])];
const expectedPairs = new Set(globalLinks.map(l => `${l.lessonId}|${l.entryId}`));
let linkPassInserted = 0;
let verifyReport = null;

function verifyLinks(readPairs, readEntryIds, readLessonIds) {
  const dbPairs = new Set(readPairs().map(r => `${r.lesson_id}|${r.entry_id}`));
  const entryIds = new Set(readEntryIds().map(r => r.id));
  const lessonIds = new Set(readLessonIds().map(r => r.id));
  const defects = []; // الدرس والمدخل موجودان والرابط غائب — يجب ألا يحدث
  const deferred = []; // الدرس أو المدخل غير مستورَد بعد (استيراد جزئي مشروع)
  let present = 0;
  for (const pair of expectedPairs) {
    if (dbPairs.has(pair)) { present++; continue; }
    const [lessonId, entryId] = pair.split('|');
    (lessonIds.has(lessonId) && entryIds.has(entryId) ? defects : deferred).push(pair);
  }
  return { plannedPairs: expectedPairs.size, present, defects, deferred };
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
    for (const st of dedupedLinkStatements) {
      linkPassInserted += Number(sqliteDb.prepare(st).run().changes ?? 0);
    }
    sqliteDb.exec('COMMIT;');
    verifyReport = verifyLinks(
      () => sqliteDb.prepare('SELECT lesson_id, entry_id FROM lesson_vocabulary').all(),
      () => sqliteDb.prepare('SELECT id FROM vocabulary_entries').all(),
      () => sqliteDb.prepare('SELECT id FROM lessons').all(),
    );
  } catch (err) {
    try { sqliteDb.exec('ROLLBACK;'); } catch {}
    throw err;
  } finally {
    sqliteDb.close();
  }
} else {
  const batchIdx = process.argv.indexOf('--batch');
  const BATCH = batchIdx > 0 && process.argv[batchIdx + 1] ? Number(process.argv[batchIdx + 1]) : 40;
  const tmpFile = join(ROOT, '.wrangler', 'tmp-import.sql');
  const runBatches = (stmts, label) => {
    for (let i = 0; i < stmts.length; i += BATCH) {
      writeFileSync(tmpFile, stmts.slice(i, i + BATCH).join(';\n') + ';', 'utf8');
      try {
        d1File(tmpFile);
      } catch (err) {
        try { unlinkSync(tmpFile); } catch {}
        console.error(`\n❌ فشل عند دفعة ${label} ${i / BATCH + 1}:`);
        console.error(String(err.stderr ?? err.message).slice(0, 1500));
        process.exit(1);
      }
      process.stdout.write(`\r   نُفِّذ ${Math.min(i + BATCH, stmts.length)}/${stmts.length}`);
    }
  };
  runBatches(allStatements, 'المحتوى');
  runBatches(dedupedLinkStatements, 'الربط النهائي');
  try { unlinkSync(tmpFile); } catch {}
  verifyReport = verifyLinks(
    () => d1('SELECT lesson_id, entry_id FROM lesson_vocabulary', { json: true }),
    () => d1('SELECT id FROM vocabulary_entries', { json: true }),
    () => d1('SELECT id FROM lessons', { json: true }),
  );
}

if (verifyReport) {
  const { plannedPairs, present, defects, deferred } = verifyReport;
  console.log(`\n🔗 روابط درس↔مفردة: مخططة ${plannedPairs} · منفَّذة الآن ${present} · أضافها المرور النهائي ${linkPassInserted} · مؤجلة (درس/مدخل غير مستورَد بعد) ${deferred.length} · مفقودة رغم وجود مدخلها ${defects.length}`);
  writeFileSync(join(ROOT, 'reports', 'vocab-link-gaps.local.json'),
    JSON.stringify({ plannedPairs, present, linkPassInserted, deferred, defects }, null, 2), 'utf8');
  if (defects.length) {
    console.error('❌ روابط مفقودة رغم وجود مدخلاتها — انظر reports/vocab-link-gaps.local.json');
    process.exit(1);
  }
}
console.log('\n\n✅ تم الاستيراد — كل الصفوف بحالة draft / unreviewed. لم يُنشر شيء.');
