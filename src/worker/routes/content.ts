import type { Env, SessionUser } from '../types';
import { HttpError, json, readJson } from '../lib/http';
import { ulid } from '../lib/ids';
import { writeAudit } from '../db';
import { allowUnreviewedContent } from '../lib/content-access';
import { searchEngine, SearchEngine, normalizeEs } from '../../shared/search-engine';
import type { CompactGrammarItem, CompactLessonItem, SearchResponse } from '../../shared/search-engine';


/**
 * حزمة درس للقراءة. القاعدة: المنشور فقط يُقدَّم للعامة.
 * المستخدم ذو صلاحية content.read يمكنه معاينة إصدار غير منشور بـ ?preview=1.
 * المحتوى يُقدَّم بعد حذف مفاتيح الإجابة — نشر درس لا يكشف إجاباته للعامة.
 */
export async function getLesson(req: Request, env: Env, requestId: string, user: SessionUser | null): Promise<Response> {
  const url = new URL(req.url);
  const parts = url.pathname.split('/');
  const slug = decodeURIComponent(parts[parts.length - 1] || '');
  if (!/^[a-z0-9-]{3,64}$/.test(slug)) throw new HttpError(400, 'INVALID_SLUG', 'معرّف الدرس غير صحيح.');

  const preview = url.searchParams.get('preview') === '1' && !!user?.permissions.includes('content.read');
  const row = await env.DB.prepare(
    `SELECT l.id, l.slug, l.title_ar, l.level_code, l.status, lv.id AS version_id, lv.version_no, lv.content_json, lv.content_hash
     FROM lessons l
     JOIN lesson_versions lv ON lv.id = l.current_version_id
     WHERE l.slug = ? ${preview ? '' : "AND l.status = 'published' AND lv.status = 'published'"}`,
  ).bind(slug).first<{
    id: string; slug: string; title_ar: string; level_code: string; status: string;
    version_id: string; version_no: number; content_json: string; content_hash: string;
  }>();

  if (!row) throw new HttpError(404, 'LESSON_NOT_FOUND', 'هذا الدرس غير متاح.');

  // AUD-04: content_json لقطة كاملة فيها مفاتيح الإجابة وعلامات الصحة.
  // للمعاينة بصلاحية محتوى (preview) تُعاد كما هي لغرض المراجعة فقط؛
  // أما الدرس المنشور للعامة فيمرّ عبر تنقية تُسقط كل ما يصحّح أو يلمّح:
  // answerKey وisCorrect وerrorFeedback وشروحه. محرك التعلم على الخادم
  // يصحّح من جداول التمارين لا من هذه اللقطة، فلا يتأثر أي تصحيح.
  const full = JSON.parse(row.content_json) as unknown;
  const content = preview ? full : sanitizePublicContent(full);

  return json(
    {
      lesson: {
        id: row.id,
        slug: row.slug,
        titleAr: row.title_ar,
        level: row.level_code,
        versionId: row.version_id,
        versionNo: row.version_no,
        contentHash: row.content_hash,

        content,
      },
    },
    { headers: { 'ETag': `"${row.content_hash}"`, 'Cache-Control': preview ? 'no-store' : 'public, max-age=60, stale-while-revalidate=600' } },
    requestId,
  );
}

/**
 * كتالوج المسارات. المنشور فقط افتراضيًا.
 * في التطوير فقط (وبمفتاح صريح) تُعرض المسودات أيضًا، موسومة بأنها عينة غير مراجعة —
 * وإلا لظهرت المنصة فارغة تمامًا بينما المحتوى موجود، وهذا تضليل معكوس.
 */
export async function listPaths(_req: Request, env: Env, requestId: string): Promise<Response> {
  const includeDrafts = allowUnreviewedContent(env);
  const programFilter = includeDrafts ? "p.status IN ('published','draft')" : "p.status = 'published'";
  const unitFilter = includeDrafts ? "u.status IN ('published','draft')" : "u.status = 'published'";
  const lessonFilter = includeDrafts ? "l.status IN ('published','draft')" : "l.status = 'published'";

  const rows = await env.DB.prepare(
    `SELECT p.slug, p.title_ar, p.kind, p.level_code, p.category, p.estimated_minutes, p.status AS program_status,
            (SELECT COUNT(*) FROM units u WHERE u.program_id = p.id AND ${unitFilter} AND EXISTS (SELECT 1 FROM lessons lu WHERE lu.unit_id = u.id AND ${lessonFilter.replaceAll('l.', 'lu.')})) AS units_count,
            (SELECT COUNT(*) FROM lessons l JOIN units u2 ON u2.id = l.unit_id
              WHERE u2.program_id = p.id AND ${lessonFilter}) AS lessons_count
     FROM programs p
     WHERE ${programFilter} AND p.is_active = 1
     ORDER BY p.kind DESC, p.sort_order`,
  ).all<{ program_status: string } & Record<string, unknown>>();

  const paths = rows.results.map(r => ({
    ...r,
    ...(includeDrafts && r.program_status !== 'published' ? { provenance: 'unreviewed_sample' } : {}),
  }));

  return json(
    { paths, ...(includeDrafts ? { contentProvenance: 'unreviewed_sample' } : {}) },
    { headers: { 'Cache-Control': includeDrafts ? 'no-store' : 'public, max-age=300' } },
    requestId,
  );
}

/**
 * البحث الذكي: المفردات والتصريفات من الفهرس الثابت المضمّن في الحزمة
 * (بلا بيانات دروس عمدًا)، والدروس والقواعد من قاعدة البيانات وفق قاعدة
 * الرؤية نفسها المطبقة في كل مكان: المنشور فقط، والمسودات فقط عندما يسمح
 * allowUnreviewedContent (تطوير صريح، لا إنتاج). ملفات المحتوى المصدرية
 * لا تحمل حالة نشر، فالفهرس الثابت لا يجوز أن يحمل الدروس أبدًا — وإلا
 * تسرّبت عناوين المسودات وأهدافها وتراكيبها لأي زائر عبر حزمة الواجهة
 * أو عبر هذا المسار نفسه. يعمل محليًا وخفيفًا دون أي تكلفة خارجية.
 */
export async function searchContent(req: Request, env: Env, requestId: string): Promise<Response> {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  const level = url.searchParams.get('level') ?? undefined;
  const kind = (url.searchParams.get('kind') as 'all' | 'vocab' | 'grammar' | 'lesson') ?? undefined;
  const limitParam = parseInt(url.searchParams.get('limit') ?? '20', 10);
  const limit = Math.min(50, Math.max(1, isNaN(limitParam) ? 20 : limitParam));


  const includeDrafts = allowUnreviewedContent(env);
  const wantsLessons = kind === undefined || kind === 'all' || kind === 'lesson' || kind === 'grammar';

  // المفردات والتصريفات: من الفهرس الثابت (لا دروس فيه).
  const vocabRes = searchEngine.search(q, { level, kind, limit });

  // الدروس والقواعد: من قاعدة البيانات فقط، بعد فلترة الرؤية.
  let lessonRes: SearchResponse | null = null;
  if (wantsLessons) {
    const statusFilter = includeDrafts
      ? "l.status IN ('published','draft') AND lv.status IN ('published','draft')"
      : "l.status = 'published' AND lv.status = 'published'";
    const rows = await env.DB.prepare(
      `SELECT l.slug, l.title_ar, l.level_code, l.objective_ar, lv.content_json
       FROM lessons l JOIN lesson_versions lv ON lv.id = l.current_version_id
       WHERE ${statusFilter}`,
    ).all<{ slug: string; title_ar: string; level_code: string; objective_ar: string; content_json: string }>();

    const lessons: CompactLessonItem[] = [];
    const grammar: CompactGrammarItem[] = [];
    const seenTopics = new Set<string>();
    for (const row of rows.results) {
      // content_json يحمل مفاتيح الإجابة — نستخرج منه التراكيب ومواضيع
      // القواعد فقط، ولا يغادر الخادم أبدًا.
      let structures: string[] = [];
      let topics: string[] = [];
      try {
        const content = JSON.parse(row.content_json) as { targetStructures?: unknown; grammarTopics?: unknown };
        if (Array.isArray(content.targetStructures)) {
          structures = content.targetStructures.filter((s): s is string => typeof s === 'string');
        }
        if (Array.isArray(content.grammarTopics)) {
          topics = content.grammarTopics.filter((s): s is string => typeof s === 'string');
        }
      } catch {
        // محتوى تالف: الدرس يُبحث بعنوانه وهدفه فقط.
      }
      lessons.push({
        s: row.slug, t: row.title_ar, l: row.level_code, u: null,
        o: row.objective_ar || undefined, g: topics, st: structures,
      });
      for (const topic of topics) {
        const key = normalizeEs(topic);
        if (!seenTopics.has(key)) {
          seenTopics.add(key);
          grammar.push({ t: topic, l: row.level_code, s: row.slug, a: row.title_ar });
        }
      }
    }
    const lessonEngine = new SearchEngine({
      version: '1.0.0', vocab: [], forms: {}, lessons, grammar,
    });
    lessonRes = lessonEngine.search(q, { level, kind, limit });
  }

  // دمج النتيجتين وترتيبهما بالدرجة: كل نتيجة ضمن أفضل `limit` لنوعها،
  // فأفضل `limit` إجمالًا مجموعة جزئية منهما — لا يُسقَط الأعلى درجة.
  const results = [...vocabRes.results, ...(lessonRes?.results ?? [])]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  const result: SearchResponse = {
    query: vocabRes.query,
    total: vocabRes.total + (lessonRes?.total ?? 0),
    results,
    suggestion: vocabRes.suggestion ?? lessonRes?.suggestion ?? null,
    executionMs: vocabRes.executionMs + (lessonRes?.executionMs ?? 0),
    ...(includeDrafts ? { contentProvenance: 'unreviewed_sample' } : {}),
  };

  return json(
    result,
    {
      headers: {
        'Cache-Control': includeDrafts ? 'no-store' : 'public, max-age=120, stale-while-revalidate=600',
      },
    },
    requestId,
  );
}

/** مفاتيح لا تغادر الخادم أبدًا في أي عرض عام للمحتوى (AUD-04) */
const SECRET_CONTENT_KEYS = new Set(['answerKey', 'isCorrect', 'errorFeedback', 'correctOptionIds', 'distractorRationaleAr']);

/** تنقية عميقة: نسخة جديدة بلا مفاتيح تصحيح/تلميح في أي عمق */
export function sanitizePublicContent(value: unknown, inExercises = false): unknown {
  if (Array.isArray(value)) return value.map(v => sanitizePublicContent(v, inExercises));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SECRET_CONTENT_KEYS.has(k)) continue;
      // VER-01: شرح التمرين تغذية راجعة بعد الإجابة بطبيعته، و71.7% من شروح
      // تمارين الاختيار تذكر نص الخيار الصحيح حرفيًا — بقاؤه في العرض العام
      // تسريب دلالي ولو غابت المفاتيح البنوية. يُجرَّد داخل التمارين فقط؛
      // شروح pedagogy التعليمية (نقاط القواعد قبل الدرس) ليست إجابات وتبقى.
      if (inExercises && k === 'explanationAr') continue;
      out[k] = sanitizePublicContent(v, inExercises || k === 'exercises');
    }
    return out;
  }
  return value;
}

/* ============================================================================
   دورة حياة المحتوى: مراجعة ثم نشر (AUD-02) — بلا نشر تلقائي إطلاقًا
   ----------------------------------------------------------------------------
   * المراجعة مسارَان صريحان:
     أ) البشري (mode='human'): يتطلب الصلاحيتين، واسمَي مراجعين حقيقيين يصلان
        من المراجع نفسه — لا أسماء مفبركة.
     ب) الآلي (mode='ai_automated'): لا يُقبل إلا إذا كانت النسخة الحالية تحمل
        في content_review_records ثلاث مراحل passed (language_es، translation_ar،
        automated) أنشأها مسار الإفراج الآلي من بوابات حقيقية. لا يُنشئ هذا
        المسار السجلات بنفسه، فمن يستدعيه لا يستطيع «تأكيد» إفراج لم يحدث.
        ويُسجَّل في سجل التدقيق بمصدر provenance=ai+automated وبلا اسم بشري.
   * النشر: يتطلب content.publish وأن تكون review_state = 'approved' (حالة الاعتماد في مخطط القاعدة) —
     درس غير مراجَع يستحيل نشره من هذا المسار (409).
   * كل انتقال يُسجَّل في admin_audit_logs بممثل الفعل ونتيجته.
   * هذه المسارات لا تُستدعى من أي واجهة تعلم؛ والاستيراد يبقى draft دائمًا.
   ========================================================================== */

function slugFrom(req: Request): string {
  const parts = new URL(req.url).pathname.split('/');
  const slug = decodeURIComponent(parts[4] ?? '');
  if (!/^[a-z0-9-]{3,64}$/.test(slug)) throw new HttpError(400, 'INVALID_SLUG', 'معرّف الدرس غير صحيح.');
  return slug;
}

async function loadForLifecycle(env: Env, slug: string) {
  const row = await env.DB.prepare(
    `SELECT l.id, l.status, l.unit_id, u.program_id, lv.id AS version_id, lv.status AS version_status, lv.review_state
     FROM lessons l
     JOIN units u ON u.id = l.unit_id
     JOIN lesson_versions lv ON lv.id = l.current_version_id
     WHERE l.slug = ?`,
  )
    .bind(slug)
    .first<{ id: string; status: string; unit_id: string; program_id: string; version_id: string; version_status: string; review_state: string }>();
  if (!row) throw new HttpError(404, 'LESSON_NOT_FOUND', 'هذا الدرس غير متاح.');
  return row;
}

const AI_REVIEW_STAGES = ['language_es', 'translation_ar', 'automated'] as const;

export async function reviewLesson(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  if (!user.permissions.includes('content.review_ar')) {
    throw new HttpError(403, 'FORBIDDEN', 'يلزم صلاحيتا مراجعة الإسبانية والترجمة معًا.');
  }
  const slug = slugFrom(req);
  const body = await readJson<{
    spanishReviewer?: string;
    translationReviewer?: string;
    mode?: string;
    validationRunId?: string;
  }>(req);
  const aiMode = body.mode === 'ai_automated';
  const row = await loadForLifecycle(env, slug);

  if (aiMode) {
    const runId = typeof body.validationRunId === 'string' ? body.validationRunId.trim() : '';
    if (runId && runId.length > 120) {
      throw new HttpError(400, 'INVALID_VALIDATION_RUN', 'معرّف تشغيل التحقق طويل جدًا.');
    }
    /* الاعتماد الآلي لا يُبنى على ثقة الطالب: يشترط وجود سجلات passed فعلية
       أنشأها مسار الإفراج (content_review_records) لهذه النسخة تحديدًا. */
    const recs = await env.DB.prepare(
      `SELECT stage, decision FROM content_review_records
       WHERE target_type = 'lesson_version' AND target_id = ? AND stage IN ('language_es','translation_ar','automated')`,
    ).bind(row.version_id).all<{ stage: string; decision: string }>();
    const passed = new Set(
      (recs.results ?? []).filter((r) => r.decision === 'passed').map((r) => String(r.stage)),
    );
    const missing = AI_REVIEW_STAGES.filter((stage) => !passed.has(stage));
    if (missing.length) {
      throw new HttpError(
        409,
        'AUTOMATED_VALIDATION_REQUIRED',
        `لا اعتماد آلي بلا سجلات تحقق مكتملة لهذه النسخة (الناقص: ${missing.join(', ')}). شغّل مسار الإفراج أولًا.`,
      );
    }
    await env.DB.batch([
      env.DB.prepare(`UPDATE lesson_versions SET review_state = ? WHERE id = ?`).bind('approved', row.version_id),
    ]);
    await writeAudit(env.DB, {
      id: ulid(), actorUserId: user.id, action: 'content.review.ai', targetType: 'lesson',
      targetId: row.id, requestId, result: 'success',
      after: {
        slug,
        provenance: 'ai+automated',
        stages: [...AI_REVIEW_STAGES],
        validationRunId: runId || null,
        reviewedAt: new Date().toISOString(),
      },
    });
    return json({ slug, reviewState: 'approved', provenance: 'ai+automated' }, {}, requestId);
  }

  const spanishReviewer = typeof body.spanishReviewer === 'string' ? body.spanishReviewer.trim() : '';
  const translationReviewer = typeof body.translationReviewer === 'string' ? body.translationReviewer.trim() : '';
  if (!spanishReviewer || !translationReviewer || spanishReviewer.length > 80 || translationReviewer.length > 80) {
    throw new HttpError(400, 'REVIEWERS_REQUIRED', 'يلزم اسم مراجع الإسبانية واسم مراجع الترجمة.');
  }

  await env.DB.batch([
    env.DB.prepare(`UPDATE lesson_versions SET review_state = ? WHERE id = ?`).bind('approved', row.version_id),
  ]);
  await writeAudit(env.DB, {
    id: ulid(), actorUserId: user.id, action: 'content.review', targetType: 'lesson',
    targetId: row.id, requestId, result: 'success',
    after: { slug, spanishReviewer, translationReviewer, reviewedAt: new Date().toISOString() },
  });
  return json({ slug, reviewState: 'approved' }, {}, requestId);
}

export async function setLessonPublished(req: Request, env: Env, requestId: string, user: SessionUser, publish: boolean): Promise<Response> {
  const slug = slugFrom(req);
  const row = await loadForLifecycle(env, slug);

  if (publish && row.review_state !== 'approved') {
    throw new HttpError(409, 'NOT_REVIEWED', 'لا يُنشر درس لم يجتز اعتمادًا (آليًا موثّقًا أو بشريًا). شغّل مسار الإفراج/المراجعة أولًا.');
  }
  const nextStatus = publish ? 'published' : 'draft';
  const statements = [
    env.DB.prepare(`UPDATE lessons SET status = ? WHERE id = ?`).bind(nextStatus, row.id),
    env.DB.prepare(`UPDATE lesson_versions SET status = ? WHERE id = ?`).bind(nextStatus, row.version_id),
  ];
  // كتالوج المسارات لا يعرض البرنامج/الوحدة إلا إذا كانا منشورين أيضًا.
  // عند نشر درس مراجَع ننشر أسلافه فقط؛ لا نلغي نشرهم عند سحب درس واحد
  // لأن دروسًا منشورة أخرى قد تعتمد على الأسلاف أنفسهم.
  if (publish) {
    statements.push(
      env.DB.prepare(`UPDATE units SET status = 'published' WHERE id = ?`).bind(row.unit_id),
      env.DB.prepare(`UPDATE programs SET status = 'published' WHERE id = ?`).bind(row.program_id),
    );
  }
  await env.DB.batch(statements);
  await writeAudit(env.DB, {
    id: ulid(), actorUserId: user.id, action: publish ? 'content.publish' : 'content.unpublish', targetType: 'lesson',
    targetId: row.id, requestId, result: 'success',
    after: { slug, status: nextStatus, previousStatus: row.status, unitId: row.unit_id, programId: row.program_id, ancestorsPublished: publish },
  });
  return json({ slug, status: nextStatus }, {}, requestId);
}
