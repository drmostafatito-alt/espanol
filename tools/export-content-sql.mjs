#!/usr/bin/env node
/**
 * tools/export-content-sql.mjs — تصدير خطة المحتوى كملف SQL واحد (بلا كتابة في قاعدة)
 * ==============================================================================
 * يبني نفس خطة الاستيراد التي يبنيها `tools/import-content.mjs` (نفس الدوال
 * المشتركة في `tools/lib/content-plan.mjs`، ونفس ترتيب المجلدات، ونفس تسلسل
 * أرقام الإصدارات عبر المجلدات)، لكنه يكتب الأوامر في ملف SQL بدل تنفيذها.
 *
 * الغرض: تغذية قاعدة بعيدة تجريبية عبر `wrangler d1 execute --remote --file`
 * (انظر `tools/remote-scratch-setup.mjs`). الملف بلا معاملة BEGIN/COMMIT:
 * التطبيق عن بُعد ليس ذرّيًا، وشبكة الأمان هي خطوة التحقق اللاحقة، وإعادة
 * تطبيق الملف نفسه آمنة لأن كل الأوامر upserts بمعرّفات ثابتة
 * (ON CONFLICT DO UPDATE/DO NOTHING) — بلا تكرار وبلا إصدارات جديدة لمحتوى
 * لم يتغيّر. كل الصفوف بحالة draft / unreviewed — لا شيء يُنشر.
 *
 * الاستخدام:
 *   node tools/export-content-sql.mjs --out /tmp/content.sql [--manifest /tmp/manifest.json]
 *   node tools/export-content-sql.mjs --out /tmp/content.sql --dir content/drafts
 * الخروج: 1 عند أخطاء فحص المحتوى، 0 عند النجاح. لا يقرأ أي قاعدة ولا يكتب فيها.
 */
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildContentPlan, collectGlobalLinks, linkInsertStatement } from './lib/content-plan.mjs';

const ROOT = resolve(import.meta.dirname, '..');

function fail(message) {
  console.error(`\n🛑 ${message}\n`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log('الاستخدام: node tools/export-content-sql.mjs --out <path> [--manifest <path>] [--dir <content-dir>]');
  process.exit(0);
}
function arg(name) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === name) return argv[i + 1] ?? null;
    if (argv[i].startsWith(name + '=')) return argv[i].slice(name.length + 1);
  }
  return null;
}
const outPath = arg('--out');
const manifestPath = arg('--manifest');
const dirArg = arg('--dir');
if (!outPath) fail('يلزم --out <path>. لا مسار افتراضي عمدًا حتى لا تُكتب ملفات غير مقصودة.');
if (argv.includes('--remote') || argv.some(a => a.startsWith('--env'))) {
  fail('هذه الأداة تولّد ملفًا فقط — لا وسائط بعيدة ولا بيئات هنا.');
}

const targetDirs = dirArg ? [dirArg] : ['content/exemplars', 'content/drafts'];
const existingVersions = {};
const allStatements = [];
const allLinkStatements = [];
const allUnresolved = [];
const aggregatedCounters = {};

for (const targetDir of targetDirs) {
  const { statements, counters, errors, unresolvedVocabRefs, linkStatements, versions: planVersions } = buildContentPlan(join(ROOT, targetDir), {
    existingVersions,
    lexiconDirs: [join(ROOT, 'content')],
  });
  if (Array.isArray(unresolvedVocabRefs)) allUnresolved.push(...unresolvedVocabRefs);
  if (Array.isArray(linkStatements)) allLinkStatements.push(...linkStatements);
  if (errors.length) {
    console.error(`\n❌ المحتوى في ${targetDir} لم يجتز فحص الاستيراد:`);
    for (const e of errors) console.error('   - ' + e);
    process.exit(1);
  }
  if (planVersions) Object.assign(existingVersions, planVersions);
  for (const s of statements) allStatements.push(s);
  for (const [k, v] of Object.entries(counters)) {
    aggregatedCounters[k] = (aggregatedCounters[k] ?? 0) + v;
  }
  console.log(`📦 ${targetDir} ⇒ ${statements.length} أمر SQL جاهز`);
}

const globalLinks = collectGlobalLinks(join(ROOT, 'content')).links;
const dedupedLinkStatements = [...new Set([...allLinkStatements, ...globalLinks.map(linkInsertStatement)])];

if (allUnresolved.length) {
  const uniq = [...new Set(allUnresolved.map(u => u.word))].sort();
  console.log(`⚠️ إحالات مفردات بلا مدخل معجمي: ${allUnresolved.length} إحالة (${uniq.length} كلمة فريدة) — سجّلت ولم تُنشأ لها روابط.`);
}

const STMT_BOUNDARY = '-- __ES_AR_STMT_BOUNDARY__';
const header = [
  '-- Español بالعربي — تصدير محتوى لاستيراد بعيد تجريبي',
  '-- وُلّد آليًا من نفس خطة tools/import-content.mjs. كل الصفوف draft/unreviewed.',
  '-- إعادة تطبيق هذا الملف آمنة: upserts بمعرّفات ثابتة، بلا تكرار.',
  '-- لا معاملة مجمّعة هنا: التطبيق عن بُعد يُقسَّم دفعات، والتحقق اللاحق هو شبكة الأمان.',
  '-- أسطر الفاصل أدناه تعليقات SQL صالحة، وتتيح تقسيم الملف دفعات دون كسر',
  '-- الأوامر متعددة الأسطر (لا يُقسَّم على `;` إطلاقًا — نصوص JSON قد تحويها).',
  'PRAGMA foreign_keys = ON;',
  '',
].join('\n');
const body = [...allStatements, ...dedupedLinkStatements].join(`;\n${STMT_BOUNDARY}\n`) + ';\n';
writeFileSync(resolve(outPath), header + body, 'utf8');

const manifest = {
  generatedAt: new Date().toISOString(),
  dirs: targetDirs,
  statements: allStatements.length,
  linkStatements: dedupedLinkStatements.length,
  total: allStatements.length + dedupedLinkStatements.length,
  counters: aggregatedCounters,
  unresolvedRefs: allUnresolved.length,
  unresolvedWords: [...new Set(allUnresolved.map(u => u.word))].sort(),
};
if (manifestPath) writeFileSync(resolve(manifestPath), JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✅ كُتب ${manifest.total} أمرًا (${allStatements.length} محتوى + ${dedupedLinkStatements.length} ربطًا) إلى ${outPath}`);
