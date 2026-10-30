#!/usr/bin/env node
/**
 * tools/admin-create.mjs — إنشاء حساب مدير أعلى (super_admin) محليًا فقط
 * ======================================================================
 * الغرض: حلّ مشكلة «الحساب الإداري الأول» دون فتح التسجيل العام ودون أي
 * بيانات اعتماد مكشوفة أو مخزّنة. الحساب يُنشأ مباشرة في قاعدة D1 المحلية
 * بالدور `super_admin`، وكلمة مروره عشوائية لمرة واحدة تُطبع مرة واحدة فقط
 * للمشغّل (لا تُكتب في أي ملف ولا في أي سجل)، ويجب تغييرها فور أول دخول
 * عبر مسار تغيير كلمة المرور الموجود (`POST /api/auth/change-password`).
 *
 * ما يفعله بالضبط (مطابق `createUser` في الـWorker):
 *   users (role_super, status active, email_verified_at NULL — بلا ادعاء
 *   تحقق بالبريد، إذ لا يوجد تحقق بالبريد لحسابات كلمة المرور)
 *   + user_profiles + user_stats + notification_preferences، في معاملة واحدة.
 * التجزئة بنفس سياسة الـWorker (HMAC-pepper ثم PBKDF2) وبنفس الـpepper
 * والتكرارات من البيئة/`.dev.vars` — فإن غاب الـpepper أو قصُر، يفشل مغلقًا
 * ولا يُنشأ شيء.
 *
 * حواجز صارمة (خروج 2):
 *   - لا مسار للعمل عن بُعد إطلاقًا: الأداة تفتح ملف SQLite محليًا فقط،
 *     وترفض `--remote`، وترفض `database_id` حقيقيًا في `wrangler.toml`،
 *     وترفض ملف قاعدة اسمه إنتاجي.
 *   - لا يفتح التسجيل العام ولا يغيّر أي إعداد — ولا يمسّ `wrangler.toml`.
 *   - يرفض بريدًا موجودًا مسبقًا، ويرفض غياب دور `super_admin` المزروع.
 *
 * الاستخدام (محلي فقط):
 *   node tools/admin-create.mjs --email admin@example.com [--display-name "Name"]
 *   node tools/admin-create.mjs --email admin@example.com --db-file /tmp/scratch.db
 *   node tools/admin-create.mjs --email admin@example.com --dry-run
 *
 * مصدر الـpepper والتكرارات: متغيّرات البيئة أولًا، ثم `.dev.vars` المحلي
 * (خارج Git) إن وُجد. لا يُطلب أي سر في المحادثة ولا يُطبع أي سر هنا.
 * الخروج: 0 نجاح · 1 فشل تشغيلي · 2 مرفوض/استخدام خاطئ.
 */
import { DatabaseSync } from 'node:sqlite';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import {
  EMAIL_RE,
  generateAdminPassword,
  generatedPasswordLooksStrong,
  hashPasswordLocal,
  newUlid,
  normalizeEmailLocal,
  readDotEnvVars,
  resolvePolicyLike,
  verifyPasswordLocal,
} from './lib/account-tools.mjs';

const ROOT = resolve(import.meta.dirname, '..');

function fail(code, message) {
  console.error(`\n🛑 ${message}\n`);
  process.exit(code);
}

function refuse(reason) {
  fail(2, `مرفوض: ${reason}`);
}

const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log('الاستخدام: node tools/admin-create.mjs --email <addr> [--display-name <name>] [--db-file <path>] [--dry-run]');
  console.log('محلي فقط. كلمة المرور المولّدة تُطبع مرة واحدة ولا تُخزَّن. غيّرها فور أول دخول.');
  process.exit(0);
}
if (argv.includes('--remote')) refuse('العمل عن بُعد مرفوض — هذه الأداة محلية فقط.');

function arg(name) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === name) return argv[i + 1] ?? null;
    if (argv[i].startsWith(name + '=')) return argv[i].slice(name.length + 1);
  }
  return null;
}
const KNOWN_FLAGS = new Set(['--email', '--display-name', '--db-file', '--dry-run']);
for (const a of argv) {
  if (a.startsWith('--') && !KNOWN_FLAGS.has(a) && ![...KNOWN_FLAGS].some(f => a.startsWith(f + '='))) {
    refuse(`خيار غير معروف: ${a}`);
  }
}
const emailRaw = arg('--email');
const displayName = arg('--display-name');
const dbFileArg = arg('--db-file');
const dryRun = argv.includes('--dry-run');

if (!emailRaw) fail(2, 'يلزم --email. مثال: node tools/admin-create.mjs --email admin@example.com');
const email = normalizeEmailLocal(emailRaw);
if (!EMAIL_RE.test(email) || email.length > 254) fail(2, 'صيغة البريد الإلكتروني غير صحيحة.');
if (displayName && (displayName.length > 80 || displayName.includes('<'))) {
  fail(2, 'الاسم المعروض غير مقبول (80 حرفًا كحد أقصى، بلا <).');
}
if (dbFileArg && /prod(uction)?/i.test(basename(dbFileArg))) {
  refuse('اسم ملف القاعدة يوحي بالإنتاج — استخدم قاعدة تجريبية باسم واضح غير إنتاجي.');
}

// حاجز الإعداد: database_id حقيقي في wrangler.toml يعني قاعدة قد تكون إنتاجًا.
const toml = readFileSync(join(ROOT, 'wrangler.toml'), 'utf8');
const dbId = toml.match(/database_id\s*=\s*"([0-9a-f-]{36})"/i)?.[1];
if (dbId && dbId !== '00000000-0000-0000-0000-000000000000') {
  refuse('database_id حقيقي في wrangler.toml — قد تكون قاعدة إنتاج. لا تعمل هذه الأداة هنا.');
}

// السياسة: البيئة أولًا، ثم .dev.vars المحلي. القيم لا تُطبع أبدًا.
// (ESPANOL_DOTENV_PATH يتيح للاختبارات توجيه القراءة لملف آخر أو إلغاءها.)
const envVars = { ...process.env };
const devVarsPath = process.env.ESPANOL_DOTENV_PATH ?? join(ROOT, '.dev.vars');
if (existsSync(devVarsPath)) {
  const fromFile = readDotEnvVars(readFileSync(devVarsPath, 'utf8'));
  for (const [k, v] of Object.entries(fromFile)) {
    if (envVars[k] === undefined) envVars[k] = v;
  }
}
let policy;
try {
  // الأداة تشترط الـpepper دائمًا (أصرم من تساهل بيئة test في الـWorker):
  // حساب مدير أعلى بلا سر خارجي مرفوض في كل الأحوال.
  policy = resolvePolicyLike({
    PBKDF2_ITERATIONS: envVars.PBKDF2_ITERATIONS,
    PASSWORD_PEPPER: envVars.PASSWORD_PEPPER,
    ENVIRONMENT: envVars.ENVIRONMENT,
  }, { requirePepper: true });
} catch (e) {
  fail(2, `سياسة كلمة المرور غير صالحة (${e.code ?? 'POLICY'}): لن يُنشأ حساب بلا pepper قوي (32 حرفًا على الأقل).`);
}

// تحديد ملف القاعدة المحلية
function discoverLocalDb() {
  const dir = join(ROOT, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter(x => x.endsWith('.sqlite') && !x.includes('-shm') && !x.includes('-wal') && !x.startsWith('metadata'));
  if (files.length !== 1) return null;
  return join(dir, files[0]);
}
const dbPath = dbFileArg ? resolve(dbFileArg) : discoverLocalDb();
if (!dbPath || !existsSync(dbPath)) {
  fail(1, 'لم تُعثر على قاعدة D1 محلية. هيّئها أولًا: `npm run db:migrate:local` أو شغّل الـWorker المحلي مرة واحدة، ثم أعد المحاولة. (أو مرّر --db-file لمسار قاعدة تجريبية مهيأة.)');
}

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA busy_timeout = 5000;');

function tableExists(name) {
  try {
    return db.prepare("SELECT count(1) AS n FROM sqlite_master WHERE type='table' AND name=?").get(name)?.n === 1;
  } catch {
    return false;
  }
}
for (const t of ['users', 'roles', 'user_profiles', 'user_stats', 'notification_preferences']) {
  if (!tableExists(t)) {
    db.close();
    fail(1, `جدول ${t} غير موجود في القاعدة — طبّق الترحيلات أولًا (0001–0005) ثم أعد المحاولة.`);
  }
}
const superRole = db.prepare("SELECT id FROM roles WHERE code='super_admin'").get();
if (!superRole) {
  db.close();
  fail(1, 'دور super_admin غير مزروع — طبّق بذور 0002 أولًا.');
}
const existingAdmins = db.prepare(
  "SELECT COUNT(*) AS n FROM users u JOIN roles r ON r.id = u.role_id WHERE r.code='super_admin'",
).get()?.n ?? 0;
if (db.prepare('SELECT id FROM users WHERE email_normalized=?').get(email)) {
  db.close();
  fail(1, 'هذا البريد مسجَّل مسبقًا — لن يُنشأ حساب مكرر. استخدم بريدًا آخر أو غيّر كلمة مرور الحساب القائم.');
}

if (dryRun) {
  console.log('وضع تجريبي — لم يُنشأ شيء.');
  console.log(`البريد: ${email} · الدور: super_admin · القاعدة: ${dbPath}`);
  console.log(`مديرون أعلى موجودون: ${existingAdmins} · التكرارات: ${policy.iterations} · الـpepper: مضبوط (غير معروض)`);
  db.close();
  process.exit(0);
}

const oneTimePassword = generateAdminPassword(24);
if (!generatedPasswordLooksStrong(oneTimePassword)) {
  db.close();
  fail(1, 'فشل التحقق الداخلي من كلمة المرور المولّدة — لم يُنشأ شيء.');
}
const passwordHash = await hashPasswordLocal(oneTimePassword, policy);
const userId = newUlid();

db.exec('BEGIN TRANSACTION;');
try {
  db.prepare(
    `INSERT INTO users (id, email_normalized, email_display, password_hash, role_id, status)
     VALUES (?, ?, ?, ?, ?, 'active')`,
  ).run(userId, email, emailRaw.trim(), passwordHash, superRole.id);
  db.prepare('INSERT INTO user_profiles (user_id, display_name) VALUES (?, ?)').run(userId, displayName?.trim() || null);
  db.prepare('INSERT INTO user_stats (user_id) VALUES (?)').run(userId);
  db.prepare('INSERT INTO notification_preferences (user_id) VALUES (?)').run(userId);
  db.exec('COMMIT;');
} catch (err) {
  try { db.exec('ROLLBACK;'); } catch {}
  db.close();
  fail(1, `فشل الإنشاء وتراجعنا عن المعاملة: ${String(err.message ?? err).slice(0, 200)}`);
}

// تحقق لاحق: الصف موجود بالدور الصحيح، والتجزئة المخزنة تقبل كلمة المرور المطبوعة.
const row = db.prepare(
  "SELECT u.id, u.email_normalized, u.status, u.email_verified_at, r.code AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id=?",
).get(userId);
const roundTrip = row && row.role === 'super_admin' && row.status === 'active'
  && await verifyPasswordLocal(oneTimePassword, db.prepare('SELECT password_hash FROM users WHERE id=?').get(userId).password_hash, policy);
db.close();
if (!roundTrip) {
  fail(1, 'فشل التحقق اللاحق من الحساب المنشأ — راجع القاعدة يدويًا؛ كلمة المرور المطبوعة أدناه لم تُتحقق.');
}

console.log('✅ أُنشئ حساب مدير أعلى (محلي فقط).');
console.log(`البريد: ${email}`);
console.log(`المعرّف: ${userId}`);
console.log(`الدور: super_admin · الحالة: active · تحقق البريد: غير موثّق (لا يوجد تحقق بالبريد)`);
if (existingAdmins > 0) console.log(`تنبيه: كان يوجد ${existingAdmins} مديرًا أعلى قبل هذا الحساب.`);
console.log('');
console.log('كلمة المرور لمرة واحدة — احفظها الآن، لن تُعرض مرة أخرى، ولم تُكتب في أي ملف:');
console.log(oneTimePassword);
console.log('');
console.log('الخطوة التالية فورًا: سجّل الدخول بهذا الحساب، ثم غيّر كلمة المرور من الإعدادات (change-password).');
console.log('لا ترسل كلمة المرور هذه في أي محادثة أو بريد.');
