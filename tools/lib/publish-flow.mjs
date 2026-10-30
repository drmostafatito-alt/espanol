/**
 * tools/lib/publish-flow.mjs — تدفق نشر درس: بوابات آلية ثم مسار الاعتماد البشري
 * =================================================================================
 * لا ينشئ هذا التدفق اعتمادًا ولا يتجاوزه: خطوة المراجعة في الـWorker تتطلب
 * صلاحيتي `content.review_es` + `content.review_ar` واسمَي مراجعين حقيقيين
 * يصلان من المشغّل (تفاعليًا أو بأعلام صريحة)، وتُسجَّلان في سجل التدقيق.
 * دور هذه الأداة فقط: (1) إثبات سلامة المحتوى آليًا قبل أي طلب، (2) استدعاء
 * نقطتي الاعتماد والنشر الموجودتين بالترتيب الصحيح، (3) إظهار النتيجتين.
 *
 * البوابات قبل أي طلب شبكة:
 *   - الملف موجود في مجلد المحتوى وحالته الملفية `draft` (الملفات تبقى draft
 *     بالتصميم؛ الاعتماد حالة قاعدة بيانات لا حالة ملف).
 *   - صفر أخطاء تدقيق (`auditContent`) منسوبة لهذا الدرس (التنبيهات تُعرض ولا تمنع).
 *   - البوابات الشاملة سالكة: validate-content + check-content-integrity + check-curriculum.
 * الشبكة محلية فقط: القاعدة يجب أن تكون http://127.0.0.1 أو localhost — أي
 * أصل آخر (بما فيه https وworkers.dev) مرفوض قبل أي طلب.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { auditContent } from '../audit-content-quality.mjs';

export class PublishFlowError extends Error {
  constructor(step, message) {
    super(`[${step}] ${message}`);
    this.step = step;
  }
}

export function validateSlug(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9-]{3,64}$/.test(slug)) {
    throw new PublishFlowError('slug', 'معرّف الدرس غير صحيح (أحرف صغيرة/أرقام/شرطات، 3–64).');
  }
  return slug;
}

export function assertLocalBase(base) {
  let url;
  try {
    url = new URL(base);
  } catch {
    throw new PublishFlowError('base', 'عنوان القاعدة غير صالح.');
  }
  const host = url.hostname;
  if (url.protocol !== 'http:' || !(host === '127.0.0.1' || host === 'localhost' || host === '::1')) {
    throw new PublishFlowError('base', 'النشر مسموح فقط ضد خادم محلي (http://127.0.0.1 أو localhost). أصول الإنتاج مرفوضة هنا.');
  }
  return url.origin;
}

export function validateReviewers(spanishReviewer, translationReviewer) {
  const s = typeof spanishReviewer === 'string' ? spanishReviewer.trim() : '';
  const t = typeof translationReviewer === 'string' ? translationReviewer.trim() : '';
  if (!s || !t) {
    throw new PublishFlowError('reviewers', 'يلزم اسم مراجع الإسبانية واسم مراجع الترجمة — من المراجعين أنفسهم، بلا أسماء مفبركة أو افتراضية.');
  }
  if (s.length > 80 || t.length > 80) {
    throw new PublishFlowError('reviewers', 'اسم المراجع 80 حرفًا كحد أقصى.');
  }
  return { spanishReviewer: s, translationReviewer: t };
}

function slugOfFinding(where) {
  const file = basename(String(where ?? '').split('#')[0]);
  if (!file.startsWith('lesson-') || !file.endsWith('.json')) return null;
  return file.slice('lesson-'.length, -'.json'.length);
}

function findLessonFile(contentDir, slug) {
  const files = readdirSync(contentDir, { recursive: true }).filter(f => typeof f === 'string');
  const hit = files.find(f => basename(f) === `lesson-${slug}.json`);
  return hit ? join(contentDir, hit) : null;
}

/**
 * البوابات الآلية. `runGate` قابلة للحقن في الاختبارات (افتراضيًا: تشغيل
 * أوامر الفحص الحقيقية كعمليات فرعية والتقاط رمز الخروج فقط).
 */
export function runGates({ root, contentDir, slug, runGate }) {
  const file = findLessonFile(contentDir, slug);
  if (!file || !existsSync(file)) {
    throw new PublishFlowError('gates', `ملف الدرس lesson-${slug}.json غير موجود في ${contentDir}.`);
  }
  let lesson;
  try {
    lesson = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    throw new PublishFlowError('gates', `ملف الدرس ${file} ليس JSON صالحًا.`);
  }
  const fileStatus = lesson?.lesson?.review?.status;
  if (fileStatus && fileStatus !== 'draft') {
    throw new PublishFlowError('gates', `حالة الملف ${fileStatus} وليست draft — راجِع الملف يدويًا قبل النشر (الملفات تبقى draft بالتصميم).`);
  }

  const { findings } = auditContent(contentDir);
  const errors = findings.filter(f => f.severity === 'error' && slugOfFinding(f.where) === slug);
  const warnings = findings.filter(f => f.severity === 'warn' && slugOfFinding(f.where) === slug);
  if (errors.length) {
    const detail = errors.slice(0, 10).map(e => `  - [${e.rule}] ${e.where}: ${e.message}`).join('\n');
    throw new PublishFlowError('gates', `أخطاء تدقيق منسوبة للدرس ${slug} (${errors.length}) — أصلحها في الملف أولًا:\n${detail}`);
  }

  const gates = runGate({ root, contentDir });
  const failed = Object.entries(gates).filter(([, code]) => code !== 0);
  if (failed.length) {
    throw new PublishFlowError('gates', `بوابات شاملة فاشلة: ${failed.map(([k, c]) => `${k}=${c}`).join(' · ')} — أصلحها قبل النشر.`);
  }
  return { file, warnings: warnings.map(w => `[${w.rule}] ${w.message}`) };
}

async function postJson(fetchFn, url, cookie, body) {
  let res;
  try {
    res = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new PublishFlowError('network', `تعذّر الوصول إلى ${url}: ${String(err.message ?? err).slice(0, 200)} — هل الخادم المحلي يعمل؟`);
  }
  const text = await res.text().catch(() => '');
  let data = null;
  try { data = JSON.parse(text); } catch { /* رد غير JSON */ }
  return { status: res.status, data, text: text.slice(0, 300) };
}

/**
 * التدفق الكامل. `fetchFn` قابلة للحقن (الافتراضي: fetch العالمي).
 * في وضع dry-run لا يُرسل أي طلب — تُعاد الخطة فقط.
 */
export async function runPublishFlow({
  base,
  slug,
  cookie,
  spanishReviewer,
  translationReviewer,
  aiAutomated = false,
  validationRunId = null,
  fetchFn = globalThis.fetch,
  dryRun = false,
  gateResult = null,
}) {
  validateSlug(slug);
  const origin = assertLocalBase(base);
  // في وضع dry-run لا تُشترط الأسماء: الخطة تُعرض كما ستُرسل (بأسماء فارغة
  // إن لم تُعطَ)، ولا يُرسل شيء. في الوضع الحقيقي الأسماء إلزامية.
  /* مسارَان: بشري (اسمَان حقيقيان) أو آلي موثّق. المسار الآلي لا يُقبل في
     الـWorker إلا إذا كانت النسخة تحمل سجلات المراحل الثلاث passed التي
     أنشأها مسار الإفراج — فلا تستطيع هذه الأداة «تأكيد» إفراج لم يحدث. */
  const reviewers = aiAutomated
    ? { mode: 'ai_automated', ...(validationRunId ? { validationRunId: String(validationRunId) } : {}) }
    : dryRun
      ? { spanishReviewer: (spanishReviewer ?? '').trim(), translationReviewer: (translationReviewer ?? '').trim() }
      : validateReviewers(spanishReviewer, translationReviewer);
  if (!dryRun && (!cookie || typeof cookie !== 'string' || !cookie.trim())) {
    throw new PublishFlowError('auth', 'يلزم كوكي جلسة لحساب يملك صلاحيات المراجعة والنشر (PUBLISH_SESSION_COOKIE أو --cookie-file). سجّل الدخول في المتصفح وانسخ قيمة الكوكي.');
  }

  const reviewUrl = `${origin}/api/admin/lessons/${slug}/review`;
  const publishUrl = `${origin}/api/admin/lessons/${slug}/publish`;
  const plan = [
    { method: 'POST', url: reviewUrl, body: reviewers },
    { method: 'POST', url: publishUrl, body: {} },
  ];
  if (dryRun) return { dryRun: true, plan, gateResult };

  const review = await postJson(fetchFn, reviewUrl, cookie, reviewers);
  if (review.status < 200 || review.status >= 300 || review.data?.reviewState !== 'approved') {
    throw new PublishFlowError('review', `خطوة الاعتماد فشلت (HTTP ${review.status}): ${review.data?.error?.message ?? review.text}. لم يُرسل طلب النشر.`);
  }
  const publish = await postJson(fetchFn, publishUrl, cookie, {});
  if (publish.status < 200 || publish.status >= 300 || publish.data?.status !== 'published') {
    throw new PublishFlowError('publish', `خطوة النشر فشلت (HTTP ${publish.status}): ${publish.data?.error?.message ?? publish.text}. الاعتماد تم تسجيله؛ راجِع الحالة قبل إعادة المحاولة.`);
  }
  return {
    dryRun: false,
    steps: [
      { step: 'review', status: review.status, data: review.data },
      { step: 'publish', status: publish.status, data: publish.data },
    ],
  };
}
