#!/usr/bin/env node
/**
 * tools/publish-lesson.mjs — نشر درس واحد من Draft إلى Published عبر مسار الاعتماد
 * =====================================================================================
 * يطبّق البوابات الآلية أولًا (ملف الدرس + تدقيق المحتوى + الفحوص الشاملة)،
 * ثم يستدعي نقطتي الاعتماد والنشر في الـWorker المحلي بالترتيب، باسمَي
 * مراجعين حقيقيين يصلان من المشغّل. لا يتجاوز البوابة ولا يفبرك اعتمادًا:
 * بلا أسماء = لا نشر. بلا كوكي جلسة لمراجِع/مدير = لا نشر. بلا خادم محلي = لا نشر.
 *
 * الاستخدام (الخادم المحلي يعمل على 8787):
 *   PUBLISH_SESSION_COOKIE='ses=...' node tools/publish-lesson.mjs --slug prea1-abecedario \
 *     --spanish-reviewer "الاسم الحقيقي" --translation-reviewer "الاسم الحقيقي"
 *   node tools/publish-lesson.mjs --slug prea1-abecedario --cookie-file /tmp/cookie.txt \
 *     --spanish-reviewer "..." --translation-reviewer "..."
 *   node tools/publish-lesson.mjs --slug prea1-abecedario --dry-run
 *   node tools/publish-lesson.mjs --slug prea1-abecedario --ai-automated [--run-id X]
 *     ← المسار الآلي الموثّق: لا يمرّ إلا إذا كانت النسخة تحمل سجلات المراحل
 *       الثلاث passed (language_es/translation_ar/automated) من مسار الإفراج.
 * عند غياب الأسماء وكون الإدخال طرفيةً تفاعلية، تُطلب الأسماء بسؤال مباشر.
 * ملف الكوكي: سطر واحد بقيمة ترويسة Cookie كما يرسلها المتصفح (لا تُطبع ولا تُسجَّل).
 * الخروج: 0 نجاح · 1 فشل تدفق · 2 مرفوض/بوابات.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { PublishFlowError, runGates, runPublishFlow } from './lib/publish-flow.mjs';

const ROOT = resolve(import.meta.dirname, '..');

function fail(code, message) {
  console.error(`\n🛑 ${message}\n`);
  process.exit(code);
}

const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log('الاستخدام: node tools/publish-lesson.mjs --slug <slug> [--base URL] [--cookie-file <path>] [--spanish-reviewer <name>] [--translation-reviewer <name>] [--dry-run]');
  console.log('الكوكي عبر PUBLISH_SESSION_COOKIE أو --cookie-file. الأسماء من المراجعين أنفسهم فقط.');
  process.exit(0);
}
function arg(name) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === name) return argv[i + 1] ?? null;
    if (argv[i].startsWith(name + '=')) return argv[i].slice(name.length + 1);
  }
  return null;
}
const slug = arg('--slug');
const base = arg('--base') ?? 'http://127.0.0.1:8787';
const cookieFile = arg('--cookie-file');
const dryRun = argv.includes('--dry-run');
let spanishReviewer = arg('--spanish-reviewer');
let translationReviewer = arg('--translation-reviewer');
const aiAutomated = argv.includes('--ai-automated');
const validationRunId = arg('--run-id') ?? null;

if (!slug) fail(2, 'يلزم --slug. مثال: --slug prea1-abecedario');

async function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await new Promise(res => rl.question(question, res));
  } finally {
    rl.close();
  }
}
if ((!spanishReviewer || !translationReviewer) && !dryRun && !aiAutomated && process.stdin.isTTY) {
  if (!spanishReviewer) spanishReviewer = await prompt('اسم مراجع الإسبانية (الحقيقي): ');
  if (!translationReviewer) translationReviewer = await prompt('اسم مراجع الترجمة (الحقيقي): ');
}

let cookie = process.env.PUBLISH_SESSION_COOKIE ?? '';
if (cookieFile) {
  if (!existsSync(cookieFile)) fail(2, `ملف الكوكي غير موجود: ${cookieFile}`);
  cookie = readFileSync(cookieFile, 'utf8').trim().split('\n')[0].trim();
}
if (!dryRun && !cookie) {
  fail(2, 'يلزم كوكي جلسة: عيّن PUBLISH_SESSION_COOKIE أو مرّر --cookie-file. سجّل الدخول بحساب مراجع/مدير أعلى في المتصفح وانسخ قيمة الكوكي من أدوات المطوّر.');
}

function realGateRunner({ root }) {
  const gate = (cmd, args) => {
    try {
      execFileSync(cmd, args, { cwd: root, stdio: 'pipe', encoding: 'utf8' });
      return 0;
    } catch (e) {
      return e.status ?? 1;
    }
  };
  return {
    validateContent: gate(process.execPath, ['tools/validate-content.mjs', '--dir', 'content/drafts']),
    integrity: gate(process.execPath, ['tools/check-content-integrity.mjs']),
    curriculum: gate(process.execPath, ['tools/check-curriculum.mjs', '--json']),
  };
}

let gateResult;
try {
  gateResult = runGates({ root: ROOT, contentDir: resolve(ROOT, 'content/drafts'), slug, runGate: realGateRunner });
} catch (e) {
  if (e instanceof PublishFlowError) fail(2, e.message);
  throw e;
}
console.log(`✅ البوابات الآلية سالكة للدرس ${slug} (الملف: ${gateResult.file}).`);
for (const w of gateResult.warnings.slice(0, 10)) console.log(`   تنبيه تدقيق: ${w}`);

try {
  const result = await runPublishFlow({
    base, slug, cookie, spanishReviewer, translationReviewer,
    aiAutomated, validationRunId, dryRun, gateResult,
  });
  if (result.dryRun) {
    console.log('(dry-run) لم يُرسل أي طلب. الخطة:');
    for (const step of result.plan) console.log(`  POST ${step.url}  body=${JSON.stringify(step.body)}`);
    process.exit(0);
  }
  for (const step of result.steps) {
    console.log(`✅ ${step.step}: HTTP ${step.status} — ${JSON.stringify(step.data)}`);
  }
  console.log(
    aiAutomated
      ? `\n✅ نُشر الدرس ${slug} بعد اعتماد آلي موثّق (ai+automated) بسجلات تحقق مكتملة — لا مراجعة بشرية.`
      : `\n✅ نُشر الدرس ${slug} (ومعه أسلافه من الوحدة والبرنامج) بعد اعتماد مسجَّل باسمَي المراجعين.`,
  );
} catch (e) {
  if (e instanceof PublishFlowError) fail(e.step === 'gates' ? 2 : 1, e.message);
  throw e;
}
