import { DatabaseSync } from 'node:sqlite';
import { copyFileSync, unlinkSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { buildContentPlan } from './lib/content-plan.mjs';

const ROOT = process.cwd();
const sqliteDir = join(ROOT, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
const files = readdirSync(sqliteDir).filter(x => x.endsWith('.sqlite') && !x.includes('-shm') && !x.includes('-wal') && !x.startsWith('metadata'));
if (files.length !== 1) {
  console.error('Expected exactly one sqlite file in miniflare directory');
  process.exit(1);
}

const originalDb = join(sqliteDir, files[0]);
const tempDbPath = join(ROOT, '.wrangler', 'temp-safety-audit.sqlite');

console.log('🔄 جاري نسخ قاعدة البيانات إلى ملف اختبار معزول:', tempDbPath);
copyFileSync(originalDb, tempDbPath);

const tables = [
  'programs', 'units', 'lessons', 'lesson_versions', 'exercises',
  'exercise_options', 'exercise_items', 'vocabulary_entries', 'vocabulary_senses',
  'vocabulary_bundles', 'vocabulary_tags', 'vocabulary_tag_links', 'lesson_vocabulary'
];

function getCounts(db) {
  const counts = {};
  for (const t of tables) {
    counts[t] = db.prepare(`SELECT count(1) as n FROM ${t}`).get().n;
  }
  return counts;
}

const db = new DatabaseSync(tempDbPath);
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA busy_timeout = 5000;');

const initialCounts = getCounts(db);
console.log('📊 أعداد السجلات الأولية في النسخة المعزولة:');
console.table(initialCounts);

// استخراج الإصدارات الموجودة
const existingRows = db.prepare(
  `SELECT l.slug, lv.version_no, lv.content_hash FROM lessons l
   JOIN lesson_versions lv ON lv.id = l.current_version_id`,
).all();
const existingVersions = {};
for (const r of existingRows) existingVersions[r.slug] = { versionNo: r.version_no, contentHash: r.content_hash };

// بناء خطة الاستيراد لكل من exemplars و drafts
const targetDirs = ['content/exemplars', 'content/drafts'];
const allStatements = [];

for (const dir of targetDirs) {
  const { statements, errors } = buildContentPlan(join(ROOT, dir), { existingVersions });
  if (errors.length) {
    throw new Error(`خطأ في بناء الخطة لـ ${dir}: ` + errors.join(', '));
  }
  allStatements.push(...statements);
}

console.log(`\n⚙️ جاري تنفيذ ${allStatements.length} أمر استيراد على النسخة المعزولة...`);
db.exec('BEGIN TRANSACTION;');
try {
  for (const stmt of allStatements) {
    db.exec(stmt);
  }
  db.exec('COMMIT;');
  console.log('✅ اكتملت المعاملة بنجاح.');
} catch (err) {
  db.exec('ROLLBACK;');
  db.close();
  unlinkSync(tempDbPath);
  throw err;
}

const afterCounts = getCounts(db);
console.log('\n📊 أعداد السجلات بعد إعادة الاستيراد الكامل:');
console.table(afterCounts);

// التحقق من التطابق التام
let mismatch = false;
for (const t of tables) {
  if (initialCounts[t] !== afterCounts[t]) {
    console.error(`❌ اختلاف في الجدول ${t}: كان ${initialCounts[t]} وأصبح ${afterCounts[t]}`);
    mismatch = true;
  }
}

// فحص عدم وجود أي أيتام أو تكرار
const dupLessons = db.prepare('SELECT slug, count(1) as n FROM lessons GROUP BY slug HAVING n > 1').all();
const dupVersions = db.prepare('SELECT lesson_id, version_no, count(1) as n FROM lesson_versions GROUP BY lesson_id, version_no HAVING n > 1').all();
const nonDraft = db.prepare("SELECT count(1) as n FROM lessons WHERE status != 'draft'").get().n;

db.close();
unlinkSync(tempDbPath);
console.log('🧹 تم حذف النسخة المعزولة بأمان.');

if (mismatch || dupLessons.length > 0 || dupVersions.length > 0 || nonDraft > 0) {
  console.error('❌ فشل فحص الأمان وقابلية التكرار!');
  process.exit(1);
} else {
  console.log('\n🎉 نجح اختبار الأمان وقابلية التكرار (Idempotence) بنسبة 100% دون أي تكرار أو زيادة أو تغيير في الحالات.');
}
