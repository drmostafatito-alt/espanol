#!/usr/bin/env node
/**
 * tools/publish-readiness.mjs — تقرير جاهزية النشر (قراءة فقط، بلا كتابة إطلاقًا)
 *
 * ماذا يفعل:
 *   1) يقرأ ملفات الدروس المسودة من content/drafts ويعرض حالة المراجعة الملفّية
 *      لكل درس (review.status / المراجعون / reviewedAt) كما هي — بلا تعديل.
 *   2) يشغّل قواعد التدقيق الآلي الموجودة (audit-content-quality) داخل العملية
 *      وينسب نتائجها لكل درس، ويشغّل فحوص validate-content وcheck-content-integrity
 *      وcheck-curriculum كعمليات فرعية لالتقاط رموز خروجها فقط.
 *   3) يطبع الخطوات البشرية الدقيقة للنشر (مسارا review ثم publish في الـAPI)
 *      كما هي في الكود — بلا تنفيذها.
 *
 * ما لا يفعله أبدًا:
 *   - لا يكتب أي ملف، ولا يغيّر أي حالة مراجعة، ولا يضع أسماء مراجعين أو تواريخ.
 *   - لا يتصل بقاعدة بيانات، ولا ينشر شيئًا، ولا يدّعي مراجعة بشرية لم تحدث.
 *   - حكم «جاهز للمراجعة البشرية» يعني فقط: البوابات الآلية سالكة. النشر نفسه
 *     يتطلب مراجعة بشرية موثّقة باسمين حقيقيين عبر الـAPI (انظر أسفل التقرير).
 *
 * الاستخدام:
 *   node tools/publish-readiness.mjs [--json]
 * الخروج: 1 إذا وُجد خطأ آلي في أي درس (محظور)، 0 إذا سلكت كل البوابات الآلية
 * (جاهز للمراجعة البشرية — ما زال 0 منشورًا حتى تكتمل الخطوات البشرية).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { auditContent } from './audit-content-quality.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRAFTS = join(ROOT, 'content/drafts');
const AS_JSON = process.argv.includes('--json');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.startsWith('lesson-') && e.endsWith('.json')) out.push(p);
  }
  return out;
}

const files = walk(DRAFTS).sort();
const lessons = [];
for (const f of files) {
  const raw = JSON.parse(readFileSync(f, 'utf8'));
  const l = raw.lesson ?? raw;
  lessons.push({
    slug: l.slug,
    level: l.level,
    exercises: (l.exercises ?? []).length,
    types: new Set((l.exercises ?? []).map(x => x.type)).size,
    hasScenario: Array.isArray(l.scenarios) && l.scenarios.length > 0,
    reviewStatus: l.review?.status ?? null,
    spanishReviewer: l.review?.spanishReviewer ?? null,
    translationReviewer: l.review?.translationReviewer ?? null,
    reviewedAt: l.review?.reviewedAt ?? null,
    authors: l.review?.authors ?? l.authors ?? null,
  });
}
const bySlug = new Map(lessons.map(l => [l.slug, l]));

// نتائج التدقيق الآلي، منسوبة لكل درس من `where` بصيغة
// `<مسار نسبي>/lesson-<slug>.json#<معرّف>` (انظر audit-content-quality).
const { stats: auditStats, findings } = auditContent(DRAFTS);
const perLesson = new Map();
for (const f of findings) {
  const beforeHash = String(f.where).split('#')[0];
  const file = beforeHash.split('/').pop() ?? beforeHash;
  const slug = file.replace(/\.json$/, '').replace(/^lesson-/, '');
  const target = bySlug.get(slug);
  const key = target ? target.slug : '(غير منسوب لدرس)';
  const cur = perLesson.get(key) ?? { errors: 0, warns: 0, rules: new Set() };
  if (f.severity === 'error') cur.errors += 1;
  else cur.warns += 1;
  cur.rules.add(f.rule);
  perLesson.set(key, cur);
}

// البوابات العامة: رموز خروج فقط، بلا إعادة طباعة لمخرجاتها الكاملة.
function gate(cmd, args) {
  try {
    execFileSync(cmd, args, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' });
    return { code: 0, ok: true };
  } catch (e) {
    return { code: e.status ?? -1, ok: false };
  }
}
const gates = {
  validateContent: gate(process.execPath, ['tools/validate-content.mjs', '--dir', 'content/drafts']),
  integrity: gate(process.execPath, ['tools/check-content-integrity.mjs']),
  curriculum: gate(process.execPath, ['tools/check-curriculum.mjs', '--json']),
};
const auditErrors = findings.filter(f => f.severity === 'error').length;
const auditWarns = findings.filter(f => f.severity === 'warn').length;

const rows = lessons.map(l => {
  const a = perLesson.get(l.slug) ?? { errors: 0, warns: 0, rules: new Set() };
  const humanReviewed = l.reviewStatus === 'approved' || l.reviewStatus === 'published';
  const verdict = a.errors > 0
    ? 'BLOCKED_AUTOMATED_ERRORS'
    : humanReviewed
      ? 'HUMAN_REVIEWED_ON_FILE'
      : 'READY_FOR_HUMAN_REVIEW';
  return { ...l, auditErrors: a.errors, auditWarns: a.warns, auditRules: [...a.rules].sort(), verdict };
});
const counts = {
  lessons: lessons.length,
  exercises: lessons.reduce((n, l) => n + l.exercises, 0),
  withScenario: lessons.filter(l => l.hasScenario).length,
  draft: lessons.filter(l => l.reviewStatus === 'draft').length,
  humanReviewedOnFile: lessons.filter(l => l.reviewStatus === 'approved' || l.reviewStatus === 'published').length,
  blocked: rows.filter(r => r.verdict === 'BLOCKED_AUTOMATED_ERRORS').length,
  readyForHumanReview: rows.filter(r => r.verdict === 'READY_FOR_HUMAN_REVIEW').length,
  unattributedFindings: (perLesson.get('(غير منسوب لدرس)')?.errors ?? 0) + (perLesson.get('(غير منسوب لدرس)')?.warns ?? 0),
};
const byLevel = {};
for (const l of lessons) byLevel[l.level] = (byLevel[l.level] ?? 0) + 1;

const HUMAN_FLOW = [
  'الخطوة البشرية 1 — الاعتماد: POST /api/admin/lessons/:slug/review',
  '  يتطلب جلسة + صلاحيتي content.review_es وcontent.review_ar معًا.',
  '  الجسم: {"spanishReviewer": "<اسم مراجع الإسبانية الحقيقي>", "translationReviewer": "<اسم مراجع الترجمة الحقيقي>"}',
  '  الاسمان يصلان من المراجعين أنفسهما (≤80 حرفًا)؛ لا أسماء مفبركة ولا مراجعة صامتة.',
  '  النتيجة: review_state = approved + سجل تدقيق بأسماء المراجعين وتاريخ الاعتماد.',
  'الخطوة البشرية 2 — النشر: POST /api/admin/lessons/:slug/publish',
  '  يتطلب جلسة + صلاحية content.publish، ويرفض 409 NOT_REVIEWED إن لم يكن الدرس معتمدًا.',
  '  النشر ينشر الدرس وأسلافه (الوحدة والبرنامج) فقط، ويُسجَّل في سجل التدقيق.',
  'سحب النشر: POST /api/admin/lessons/:slug/unpublish (بالصلاحية نفسها).',
  'الاستيراد يبقى draft دائمًا؛ لا نشر جماعي بلا اعتماد بشري لكل درس.',
];

if (AS_JSON) {
  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(), readOnly: true, humanReviewClaimed: false,
    counts, byLevel,
    audit: { lessons: auditStats.lessons, exercises: auditStats.exercises, errors: auditErrors, warns: auditWarns },
    gates: Object.fromEntries(Object.entries(gates).map(([k, g]) => [k, g.code])),
    rows, humanFlow: HUMAN_FLOW,
  }, null, 2));
} else {
  console.log('# تقرير جاهزية النشر — قراءة فقط، لا يغيّر شيئًا\n');
  console.log(`الدروس: ${counts.lessons} · التمارين: ${counts.exercises} · بسيناريو: ${counts.withScenario}`);
  console.log(`حالة المراجعة الملفّية: draft=${counts.draft} · مراجَعة بشريًا على الملف=${counts.humanReviewedOnFile}`);
  console.log(`المستويات: ${Object.entries(byLevel).map(([k, v]) => `${k}=${v}`).join(' ')}`);
  console.log(`التدقيق الآلي: ${auditErrors} خطأ · ${auditWarns} تنبيهًا (دروس: ${auditStats.lessons}، تمارين: ${auditStats.exercises})`);
  console.log(`البوابات: validate-content=${gates.validateContent.code} · integrity=${gates.integrity.code} · curriculum=${gates.curriculum.code} (0 = سالكة)`);
  console.log(`الخلاصة: محظورة آليًا=${counts.blocked} · جاهزة للمراجعة البشرية=${counts.readyForHumanReview} · نتائج غير منسوبة=${counts.unattributedFindings}\n`);
  console.log('## الدروس');
  for (const r of rows) {
    console.log(`- ${r.slug} [${r.level}] تمارين=${r.exercises} أنواع=${r.types} سيناريو=${r.hasScenario ? 'نعم' : 'لا'} مراجعة=${r.reviewStatus} أخطاء_آلية=${r.auditErrors} تنبيهات=${r.auditWarns} ← ${r.verdict}`);
  }
  console.log('\n## الخطوات البشرية للنشر (لا ينفّذها هذا التقرير)');
  for (const line of HUMAN_FLOW) console.log(line);
  console.log('\n> هذا التقرير آلي ولا يثبت مراجعة بشرية. لا يُنشر درس قبل اعتماد بشري موثّق باسمين حقيقيين.');
}

const blocked = counts.blocked > 0 || auditErrors > 0 || !gates.validateContent.ok || !gates.integrity.ok || !gates.curriculum.ok;
process.exit(blocked ? 1 : 0);
