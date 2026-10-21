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
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildContentPlan } from './lib/content-plan.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const WRANGLER = join(ROOT, 'tools/wrangler-env/node_modules/.bin/wrangler');
const DB = 'es-ar-dev';
const DRY = process.argv.includes('--dry-run');
// مجلد المحتوى: افتراضيًا العينات، ويمكن تمرير مجلد مسودات جديد
const dirIdx = process.argv.indexOf('--dir');
const CONTENT_DIR = dirIdx > 0 && process.argv[dirIdx + 1] ? process.argv[dirIdx + 1] : 'content/exemplars';

function refuse(reason) {
  console.error(`\n🛑 مرفوض: ${reason}\n`);
  process.exit(2);
}
if (process.argv.includes('--remote')) refuse('الاستيراد محلي فقط.');
if (process.env.ENVIRONMENT === 'production') refuse('متغيرات البيئة تشير إلى production.');
const toml = readFileSync(join(ROOT, 'wrangler.toml'), 'utf8');
const dbId = toml.match(/database_id\s*=\s*"([0-9a-f-]{36})"/i)?.[1];
if (dbId && dbId !== '00000000-0000-0000-0000-000000000000') refuse('database_id حقيقي في wrangler.toml — قد تكون قاعدة إنتاج.');

function d1(sql, { json = false } = {}) {
  const args = ['d1', 'execute', DB, '--local', '--command', sql];
  if (json) args.push('--json');
  const out = execFileSync(WRANGLER, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (!json) return out;
  const i = out.indexOf('[');
  return i >= 0 ? JSON.parse(out.slice(i))[0].results : [];
}

// حالة الإصدارات الحالية — تُقرأ من القاعدة لتحديد هل نحتاج إصدارًا جديدًا
function currentVersions() {
  let rows = [];
  try {
    rows = d1(
      `SELECT l.slug, lv.version_no, lv.content_hash FROM lessons l
       JOIN lesson_versions lv ON lv.id = l.current_version_id`,
      { json: true },
    );
  } catch { /* قاعدة فارغة أو لم تُهيَّأ بعد */ }
  const map = {};
  for (const r of rows) map[r.slug] = { versionNo: r.version_no, contentHash: r.content_hash };
  return map;
}

const existingVersions = currentVersions();
const { statements, counters, errors } = buildContentPlan(join(ROOT, CONTENT_DIR), { existingVersions });

if (errors.length) {
  console.error('\n❌ المحتوى لم يجتز فحص الاستيراد:');
  for (const e of errors) console.error('   - ' + e);
  process.exit(1);
}

console.log(`\n📦 ${CONTENT_DIR} ⇒ ${statements.length} أمر SQL جاهز`);
console.log('   ' + Object.entries(counters).map(([k, v]) => `${k}=${v}`).join('  '));

if (DRY) {
  console.log('\n(dry-run) لم تُكتب أي بيانات.\n');
  process.exit(0);
}

const BATCH = 40;
for (let i = 0; i < statements.length; i += BATCH) {
  const chunk = statements.slice(i, i + BATCH).join(';\n') + ';';
  try {
    d1(chunk);
  } catch (err) {
    console.error(`\n❌ فشل عند الدفعة ${i / BATCH + 1}:`);
    console.error(String(err.stderr ?? err.message).slice(0, 1500));
    process.exit(1);
  }
  process.stdout.write(`\r   نُفِّذ ${Math.min(i + BATCH, statements.length)}/${statements.length}`);
}
console.log('\n\n✅ تم الاستيراد — كل الصفوف بحالة draft / unreviewed. لم يُنشر شيء.');
