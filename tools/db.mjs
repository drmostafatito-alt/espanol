#!/usr/bin/env node
/**
 * ============================================================================
 * أداة قاعدة البيانات — محلية فقط، بحاجز صريح.
 * ============================================================================
 * القاعدة الحاكمة: أي أمر هنا يرفض العمل إن كان يستهدف قاعدة بعيدة.
 * Modes: status | migrate | seed | reset
 *
 * لماذا وُجد هذا الملف؟
 *   قبل المراجعة كانت إعادة الضبط موزّعة على npm scripts بصيغة
 *   `rm -rf .wrangler && wrangler d1 execute ... --local`. صحيح عمليًا، لكن لا شيء
 *   في السلسلة يمنع لصق `--remote` أو تغيير database_id ثم تنفيذها على الإنتاج.
 *   هنا الحاجز في الكود لا في انتباه المشغّل.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const WRANGLER_CLI = join(ROOT, 'tools/wrangler-env/node_modules/wrangler/wrangler-dist/cli.js');
const WRANGLER_BIN = join(ROOT, 'tools/wrangler-env/node_modules/.bin/wrangler');
const [WRANGLER_EXEC, WRANGLER_BASE_ARGS] = existsSync(WRANGLER_CLI)
  ? [process.execPath, [WRANGLER_CLI]]
  : [WRANGLER_BIN, []];
const MIGRATIONS_DIR = join(ROOT, 'db/migrations');
const PERSIST_DIR = join(ROOT, '.wrangler');
const DB_NAME = 'es-ar-dev';

/* ---------------------------- الحاجز الأمني ---------------------------- */

function refuse(reason) {
  console.error(`\n🛑 مرفوض: ${reason}\n   هذه الأداة محلية فقط ولا تلمس أي قاعدة بعيدة.\n`);
  process.exit(2);
}

function assertLocalOnly(argv) {
  if (argv.includes('--remote')) refuse('تم تمرير --remote صراحةً.');
  if (argv.some(a => a.startsWith('--env') && !a.includes('local'))) refuse('تم تحديد بيئة wrangler غير محلية.');
  if (process.env.WRANGLER_ENVIRONMENT === 'production' || process.env.ENVIRONMENT === 'production') {
    refuse('متغيرات البيئة تشير إلى production.');
  }
}

function assertNotProductionConfig() {
  const toml = readFileSync(join(ROOT, 'wrangler.toml'), 'utf8');
  if (/database_id\s*=\s*"[0-9a-f-]{36}"/i.test(toml)) {
    const id = toml.match(/database_id\s*=\s*"([0-9a-f-]{36})"/i)?.[1];
    if (id && id !== '00000000-0000-0000-0000-000000000000') {
      refuse(`wrangler.toml يحمل database_id حقيقيًا (${id}). قد تكون قاعدة إنتاج — لا تشغّل أدوات محلية عليها.`);
    }
  }
}

function assertInsideProject(path) {
  const rel = relative(ROOT, resolve(path));
  if (rel.startsWith('..') || rel.includes('/..')) refuse(`المسار خارج المشروع: ${path}`);
}

/* ------------------------------ تشغيل wrangler ------------------------------ */

function wrangler(args, { json = false } = {}) {
  const full = [...WRANGLER_BASE_ARGS, ...args];
  try {
    const out = execFileSync(WRANGLER_EXEC, full, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    if (!json) return out;
    const start = out.indexOf('[');
    const parsed = JSON.parse(start >= 0 ? out.slice(start) : out);
    return parsed;
  } catch (err) {
    const stderr = String(err.stderr ?? '');
    console.error(stderr.trim());
    throw new Error(`فشل تنفيذ wrangler: ${args.slice(0, 3).join(' ')}`);
  }
}

// ملاحظة: لا نمرّر --persist-to. الافتراضي في wrangler 3 هو `.wrangler/state/v3`
// وهو نفس المسار الذي يستخدمه `wrangler dev --local` — تمرير مسار مختلف ينتج
// قاعدة فارغة موازية ويجعل الأوامر تبدو ناجحة بينما التطبيق لا يرى شيئًا.
function d1(sql, { json = false } = {}) {
  const args = ['d1', 'execute', DB_NAME, '--local', '--command', sql];
  if (json) args.push('--json');
  return wrangler(args, { json });
}

function d1File(file) {
  return wrangler(['d1', 'execute', DB_NAME, '--local', `--file=${file}`]);
}

/* -------------------------------- الأوامر -------------------------------- */

function migrations() {
  return readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .map(name => {
      const sql = readFileSync(join(MIGRATIONS_DIR, name), 'utf8');
      return { name, sql, checksum: createHash('sha256').update(sql).digest('hex').slice(0, 16) };
    });
}

const BOOTSTRAP = `CREATE TABLE IF NOT EXISTS schema_migrations (
  name TEXT PRIMARY KEY,
  checksum TEXT NOT NULL,
  applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
)`;

function applied() {
  try {
    const rows = d1('SELECT name, checksum FROM schema_migrations ORDER BY name', { json: true });
    const list = rows?.[0]?.results ?? [];
    return new Map(list.map(r => [r.name, r.checksum]));
  } catch {
    return new Map(); // الجدول غير موجود بعد — يُنشأ في cmdMigrate
  }
}

function cmdStatus() {
  const done = applied();
  for (const m of migrations()) {
    const state = done.has(m.name) ? (done.get(m.name) === m.checksum ? '✅ مطبَّق' : '⚠️ مطبَّق لكن الملف تغيّر') : '⏳ معلَّق';
    console.log(`${state.padEnd(28)} ${m.name}`);
  }
}

function cmdMigrate() {
  d1(BOOTSTRAP); // جدول التتبّع أولًا، وإلا تعذّر تسجيل أول مهاجرة
  const done = applied();
  let count = 0;
  for (const m of migrations()) {
    if (done.has(m.name)) continue;
    process.stdout.write(`تطبيق ${m.name} … `);
    d1File(join(MIGRATIONS_DIR, m.name));
    d1(`INSERT INTO schema_migrations (name, checksum) VALUES ('${m.name}', '${m.checksum}')
        ON CONFLICT(name) DO UPDATE SET checksum = excluded.checksum`);
    console.log('تم');
    count++;
  }
  console.log(count ? `\nطُبِّقت ${count} مهاجرة.` : '\nلا شيء معلَّق — القاعدة محدَّثة.');
}

function cmdSeed() {
  const file = join(MIGRATIONS_DIR, '0002_seed_reference.sql');
  d1File(file);
  console.log('تم تطبيق البذور المرجعية.');
}

function cmdReset() {
  assertInsideProject(PERSIST_DIR);
  if (resolve(PERSIST_DIR) !== join(ROOT, '.wrangler')) refuse('مسار الحالة المحلية غير متوقع.');
  if (existsSync(PERSIST_DIR)) {
    rmSync(PERSIST_DIR, { recursive: true, force: true });
    console.log('حُذفت الحالة المحلية (.wrangler) — محليًا فقط.');
  }
  cmdMigrate();
  cmdSeed();
  cmdStatus();
}

/* ---------------------------------- main ---------------------------------- */

const [mode = 'status', ...rest] = process.argv.slice(2);
assertLocalOnly(rest);
assertNotProductionConfig();

switch (mode) {
  case 'status': cmdStatus(); break;
  case 'migrate': cmdMigrate(); break;
  case 'seed': cmdSeed(); break;
  case 'reset': cmdReset(); break;
  default:
    console.error(`وضع غير معروف: ${mode}. المتاح: status | migrate | seed | reset`);
    process.exit(1);
}
