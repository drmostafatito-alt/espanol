#!/usr/bin/env node
/**
 * tools/remote-scratch-setup.mjs — إعداد قاعدة D1 بعيدة تجريبية (ليست إنتاجًا)
 * ============================================================================
 * يبني قاعدة تجريبية من الصفر ويتحقق منها، ثم تُحذف بأمر منفصل صريح:
 *   إنشاء قاعدة باسم تجريبي ← ترحيلات 0001–0005 بالترتيب مع تتبّع checksums
 *   ← استيراد المحتوى (نفس خطة المستورِد) ← تحقق من الأعداد والروابط.
 *
 * حماية الإنتاج (تُرفض قبل أي اتصال بعيد):
 *   - اسم القاعدة يجب أن يطابق `es-ar-scratch` + لاحقة اختيارية، وألا يحوي
 *     `prod` إطلاقًا. لا يمكن لهذه الأداة مخاطبة `es-ar-prod` أو أي اسم آخر.
 *   - لا يُقرأ `database_id` من أي إعداد؛ الاسم صريح في سطر الأوامر فقط.
 *   - وضع `--local-test` لا يلمس الشبكة إطلاقًا (ملف SQLite محلي).
 *   - الحذف يتطلب `--teardown` صريحًا + الاسم التجريبي نفسه؛ لا حذف ضمني أبدًا.
 *
 * الاستخدام:
 *   node tools/remote-scratch-setup.mjs --database es-ar-scratch-20261028 [--batch-size 40] [--resume]
 *   node tools/remote-scratch-setup.mjs --teardown --database es-ar-scratch-20261028
 *   node tools/remote-scratch-setup.mjs --local-test --db-file /tmp/scratch.db [--batch-size 40]
 * يتطلب العمل عن بُعد مصادقة wrangler صالحة (`wrangler login` أو توكن API
 * بصلاحيات D1: Edit فقط) — عند غيابها يفشل سريعًا بإرشادات دقيقة ولا ينشئ شيئًا.
 * الخروج: 0 نجاح · 1 فشل تشغيلي/تحقق · 2 مرفوض.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { buildContentPlan, collectGlobalLinks } from './lib/content-plan.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const WRANGLER_CLI = join(ROOT, 'tools/wrangler-env/node_modules/wrangler/wrangler-dist/cli.js');
const WRANGLER_BIN = join(ROOT, 'tools/wrangler-env/node_modules/.bin/wrangler');
const [WRANGLER_EXEC, WRANGLER_BASE_ARGS] = existsSync(WRANGLER_CLI)
  ? [process.execPath, [WRANGLER_CLI]]
  : [WRANGLER_BIN, []];
const MIGRATIONS_DIR = join(ROOT, 'db/migrations');
const STMT_BOUNDARY = '-- __ES_AR_STMT_BOUNDARY__';
const BOOTSTRAP_SQL = `CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));`;

function fail(code, message) {
  console.error(`\n🛑 ${message}\n`);
  process.exit(code);
}
function refuse(reason) { fail(2, `مرفوض: ${reason}`); }

const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log('الاستخدام: node tools/remote-scratch-setup.mjs --database es-ar-scratch-<suffix> [--batch-size N] [--resume] | --teardown --database <name> | --local-test --db-file <path>');
  process.exit(0);
}
function arg(name) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === name) return argv[i + 1] ?? null;
    if (argv[i].startsWith(name + '=')) return argv[i].slice(name.length + 1);
  }
  return null;
}
const dbName = arg('--database');
const dbFileArg = arg('--db-file');
const localTest = argv.includes('--local-test');
const teardown = argv.includes('--teardown');
const resume = argv.includes('--resume');
const dryRun = argv.includes('--dry-run');
const batchSize = Math.max(1, Number(arg('--batch-size') ?? 40) || 40);

function validScratchName(name) {
  return typeof name === 'string'
    && /^es-ar-scratch(-[a-z0-9-]+)?$/.test(name)
    && !/prod/i.test(name);
}
if (!localTest && !validScratchName(dbName)) {
  refuse('اسم القاعدة يجب أن يكون es-ar-scratch + لاحقة اختيارية (أحرف صغيرة/أرقام/شرطات)، وبلا أي أثر لـ prod. لا يُسمح بأي اسم آخر.');
}
if (localTest && !dbFileArg) fail(2, 'يلزم --db-file مع --local-test.');
if (localTest && dbFileArg && /prod(uction)?/i.test(dbFileArg)) {
  refuse('مسار ملف القاعدة يوحي بالإنتاج — استخدم مسارًا تجريبيًا واضحًا.');
}
if (teardown && localTest) fail(2, '--teardown للعمل عن بُعد فقط؛ احذف الملف المحلي يدويًا.');
if (!localTest && (process.env.WRANGLER_ENVIRONMENT === 'production' || process.env.ENVIRONMENT === 'production')) {
  refuse('متغيرات البيئة تشير إلى production — العمل عن بُعد مرفوض في هذه الجلسة.');
}

function migrations() {
  return readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .map(name => {
      const sql = readFileSync(join(MIGRATIONS_DIR, name), 'utf8');
      return { name, sql, checksum: createHash('sha256').update(sql).digest('hex').slice(0, 16) };
    });
}

function wrangler(args, { json = false } = {}) {
  const out = execFileSync(WRANGLER_EXEC, [...WRANGLER_BASE_ARGS, ...args], {
    cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 300_000,
  });
  if (!json) return out;
  const i = out.indexOf('[');
  if (i < 0) return null;
  return JSON.parse(out.slice(i));
}

/** نتائج `d1 execute --json`: الشكل `[{results: [...]}, ...]`. */
function wranglerQuery(args) {
  const parsed = wrangler(args, { json: true });
  if (!Array.isArray(parsed)) return [];
  return parsed[0]?.results ?? [];
}

/** نتائج `d1 list --json`: مصفوفة قواعد مباشرة `[{name, uuid, ...}]`. */
function wranglerList() {
  const parsed = wrangler(['d1', 'list', '--json'], { json: true });
  return Array.isArray(parsed) ? parsed : [];
}

function splitSqlFile(text) {
  const chunks = text.split(`\n${STMT_BOUNDARY}\n`).map(c => c.trim()).filter(Boolean);
  return chunks;
}

/** التحقق من سلامة الروابط (مرآة VER-04 في المستورِد): أزواج متوقعة مقابل فعلية. */
function verifyLinks(readPairs, readEntryIds, readLessonIds) {
  const expectedPairs = new Set(collectGlobalLinks(join(ROOT, 'content')).links.map(l => `${l.lessonId}|${l.entryId}`));
  const dbPairs = new Set(readPairs().map(r => `${r.lesson_id}|${r.entry_id}`));
  const entryIds = new Set(readEntryIds().map(r => r.id));
  const lessonIds = new Set(readLessonIds().map(r => r.id));
  const defects = [];
  const deferred = [];
  let present = 0;
  for (const pair of expectedPairs) {
    if (dbPairs.has(pair)) { present++; continue; }
    const [lessonId, entryId] = pair.split('|');
    (lessonIds.has(lessonId) && entryIds.has(entryId) ? defects : deferred).push(pair);
  }
  return { plannedPairs: expectedPairs.size, present, defects, deferred };
}

function verifyCounts(readCount) {
  return {
    lessons: readCount('lessons'),
    exercises: readCount('exercises'),
    vocab: readCount('vocabulary_entries'),
    links: readCount('lesson_vocabulary'),
    migrations: readCount('schema_migrations'),
  };
}

function reportVerification(counts, linkReport) {
  console.log(`\n📊 الأعداد: دروس ${counts.lessons} · تمارين ${counts.exercises} · مفردات ${counts.vocab} · روابط ${counts.links} · ترحيلات ${counts.migrations}`);
  console.log(`🔗 روابط: مخططة ${linkReport.plannedPairs} · موجودة ${linkReport.present} · مؤجلة ${linkReport.deferred.length} · مفقودة رغم وجود مدخلاتها ${linkReport.defects.length}`);
  if (linkReport.defects.length) {
    fail(1, `تحقق الروابط فشل: ${linkReport.defects.length} رابطًا مفقودًا رغم وجود الدرس والمدخل. القاعدة تُترك للفحص — لم يُحذف شيء.`);
  }
  console.log('✅ التحقق سليم: بلا روابط مفقودة.');
}

/* ---------- وضع الاختبار المحلي: نفس الخطوات على ملف SQLite ---------- */
if (localTest) {
  const dbPath = resolve(dbFileArg);
  if (dryRun) {
    console.log('(dry-run) الخطة المحلية — لم يُلمس أي ملف:');
    console.log(`  ملف القاعدة: ${dbPath}`);
    for (const m of migrations()) console.log(`  ترحيل: ${m.name}`);
    console.log('  توليد: node tools/export-content-sql.mjs --out <tmp>/content.sql');
    console.log('  تطبيق + تحقق (أعداد وروابط) على الملف نفسه.');
    process.exit(0);
  }
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec(BOOTSTRAP_SQL);
  const applied = new Map(db.prepare('SELECT name, checksum FROM schema_migrations').all().map(r => [r.name, r.checksum]));
  for (const m of migrations()) {
    if (applied.get(m.name) === m.checksum) { console.log(`⏭️ ترحيل مطبَّق مسبقًا: ${m.name}`); continue; }
    if (applied.has(m.name)) fail(1, `الترحيل ${m.name} تغيّر بعد تطبيقه (checksum مختلف) — فحص يدوي مطلوب.`);
    db.exec(m.sql);
    db.prepare('INSERT INTO schema_migrations (name, checksum) VALUES (?, ?)').run(m.name, m.checksum);
    console.log(`✓ ترحيل: ${m.name}`);
  }
  const work = mkdtempSync(join(tmpdir(), 'espanol-scratch-'));
  try {
    const sqlPath = join(work, 'content.sql');
    const manifestPath = join(work, 'manifest.json');
    execFileSync(process.execPath, [join(ROOT, 'tools/export-content-sql.mjs'), '--out', sqlPath, '--manifest', manifestPath], { cwd: ROOT, stdio: 'inherit' });
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const chunks = splitSqlFile(readFileSync(sqlPath, 'utf8'));
    if (chunks.length !== manifest.total) {
      fail(1, `عدد أجزاء الملف (${chunks.length}) لا يطابق البيان (${manifest.total}) — الملف تالف أو قُسّم خطأ.`);
    }
    db.exec('BEGIN TRANSACTION;');
    try {
      for (const c of chunks) db.exec(c);
      db.exec('COMMIT;');
    } catch (err) {
      try { db.exec('ROLLBACK;'); } catch {}
      throw err;
    }
    const counts = verifyCounts(t => db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n);
    const linkReport = verifyLinks(
      () => db.prepare('SELECT lesson_id, entry_id FROM lesson_vocabulary').all(),
      () => db.prepare('SELECT id FROM vocabulary_entries').all(),
      () => db.prepare('SELECT id FROM lessons').all(),
    );
    reportVerification(counts, linkReport);
  } finally {
    db.close();
    rmSync(work, { recursive: true, force: true });
  }
  process.exit(0);
}

/* ---------- العمل عن بُعد ---------- */
if (dryRun) {
  console.log('(dry-run) الأوامر المخططة — لم يُنفَّذ شيء:');
  console.log(`  wrangler whoami`);
  console.log(`  wrangler d1 create ${dbName}`);
  for (const m of migrations()) console.log(`  wrangler d1 execute ${dbName} --remote --file db/migrations/${m.name}`);
  console.log(`  node tools/export-content-sql.mjs --out <tmp>/content.sql --manifest <tmp>/manifest.json`);
  console.log(`  wrangler d1 execute ${dbName} --remote --file <chunk>  (× دفعات بحجم ${batchSize})`);
  console.log(`  wrangler d1 execute ${dbName} --remote --command "<SELECT counts>" --json`);
  process.exit(0);
}

if (teardown) {
  console.log(`حذف القاعدة التجريبية ${dbName} …`);
  wrangler(['d1', 'delete', dbName, '-y']);
  console.log(`✅ حُذفت ${dbName}. تحقق: wrangler d1 list`);
  process.exit(0);
}

// 1) المصادقة — فشل سريع قبل إنشاء أي شيء
try {
  const who = wrangler(['whoami']);
  if (/not authenticated/i.test(who)) {
    fail(1, 'لا توجد مصادقة Cloudflare في هذه البيئة (wrangler whoami: not authenticated). المطلوب من المالك: `wrangler login` بتدفق الجهاز على جهازه، أو توكن API جديد بصلاحيات D1: Edit فقط عبر Secure Vault (التوكن القديم المُرسل في الشات مكشوف ويجب تدويره). لم يُنشأ شيء عن بُعد.');
  }
} catch (err) {
  fail(1, `تعذّر التحقق من مصادقة wrangler: ${String(err.stderr ?? err.message).slice(0, 400)} — لم يُنشأ شيء.`);
}

// 2) الإنشاء (أو الاستئناف)
const existing = (() => {
  try {
    return wranglerList();
  } catch {
    return [];
  }
})();
const alreadyThere = existing.some(d => d?.name === dbName);
if (alreadyThere && !resume) {
  fail(1, `القاعدة ${dbName} موجودة مسبقًا. مرّر --resume للاستئناف الآمن (ترحيلات متخطاة + محتوى upsert)، أو احذفها أولًا بـ --teardown. لم يتغيّر شيء.`);
}
if (!alreadyThere) {
  console.log(`إنشاء القاعدة التجريبية ${dbName} …`);
  wrangler(['d1', 'create', dbName]);
}

// 3) الترحيلات بالترتيب مع تتبّع checksums
wrangler(['d1', 'execute', dbName, '--remote', '--command', BOOTSTRAP_SQL]);
let appliedRemote = [];
try {
  appliedRemote = wranglerQuery(['d1', 'execute', dbName, '--remote', '--command', 'SELECT name, checksum FROM schema_migrations', '--json']);
} catch { appliedRemote = []; }
const appliedMap = new Map(appliedRemote.map(r => [r.name, r.checksum]));
for (const m of migrations()) {
  if (appliedMap.get(m.name) === m.checksum) { console.log(`⏭️ ترحيل مطبَّق مسبقًا: ${m.name}`); continue; }
  if (appliedMap.has(m.name)) fail(1, `الترحيل ${m.name} تغيّر بعد تطبيقه (checksum مختلف) — فحص يدوي مطلوب. لم يُكمل التطبيق.`);
  wrangler(['d1', 'execute', dbName, '--remote', '--file', join(MIGRATIONS_DIR, m.name)]);
  wrangler(['d1', 'execute', dbName, '--remote', '--command', `INSERT INTO schema_migrations (name, checksum) VALUES ('${m.name}', '${m.checksum}')`]);
  console.log(`✓ ترحيل: ${m.name}`);
}

// 4) المحتوى: تصدير ثم دفعات (نفس الحجم المثبت في المستورِد المحلي: 40)
const work = mkdtempSync(join(tmpdir(), 'espanol-scratch-'));
try {
  const sqlPath = join(work, 'content.sql');
  const manifestPath = join(work, 'manifest.json');
  execFileSync(process.execPath, [join(ROOT, 'tools/export-content-sql.mjs'), '--out', sqlPath, '--manifest', manifestPath], { cwd: ROOT, stdio: 'inherit' });
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const chunks = splitSqlFile(readFileSync(sqlPath, 'utf8'));
  if (chunks.length !== manifest.total) {
    fail(1, `عدد أجزاء الملف (${chunks.length}) لا يطابق البيان (${manifest.total}) — توقف قبل أي تطبيق.`);
  }
  for (let i = 0; i < chunks.length; i += batchSize) {
    const chunkPath = join(work, `chunk-${i / batchSize + 1}.sql`);
    writeFileSync(chunkPath, chunks.slice(i, i + batchSize).join(`\n${STMT_BOUNDARY}\n`) + '\n', 'utf8');
    try {
      wrangler(['d1', 'execute', dbName, '--remote', '--file', chunkPath]);
    } catch (err) {
      console.error(`\n❌ فشل عند دفعة ${i / batchSize + 1}:`);
      console.error(String(err.stderr ?? err.message).slice(0, 1500));
      fail(1, 'توقف التطبيق. القاعدة تُترك للفحص؛ إعادة التشغيل بـ --resume آمنة (upserts). لم يُحذف شيء.');
    }
    process.stdout.write(`\r   نُفِّذ ${Math.min(i + batchSize, chunks.length)}/${chunks.length}`);
  }
  console.log('');
} finally {
  rmSync(work, { recursive: true, force: true });
}

// 5) التحقق عن بُعد
const counts = verifyCounts(t => {
  const rows = wranglerQuery(['d1', 'execute', dbName, '--remote', '--command', `SELECT COUNT(*) AS n FROM ${t}`, '--json']);
  return rows[0]?.n ?? 0;
});
const linkReport = verifyLinks(
  () => wranglerQuery(['d1', 'execute', dbName, '--remote', '--command', 'SELECT lesson_id, entry_id FROM lesson_vocabulary', '--json']),
  () => wranglerQuery(['d1', 'execute', dbName, '--remote', '--command', 'SELECT id FROM vocabulary_entries', '--json']),
  () => wranglerQuery(['d1', 'execute', dbName, '--remote', '--command', 'SELECT id FROM lessons', '--json']),
);
reportVerification(counts, linkReport);
console.log(`\n✅ القاعدة التجريبية ${dbName} جاهزة ومتحقق منها.`);
console.log(`للحذف بعد الفحص: node tools/remote-scratch-setup.mjs --teardown --database ${dbName}`);
