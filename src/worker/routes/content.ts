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
        const parsed = JSON.parse(row.content_json) as {
          lesson?: Record<string, unknown>;
          targetStructures?: unknown;
          grammarTopics?: unknown;
          pedagogy?: { grammarPoints?: unknown };
        };
        const content = (parsed.lesson ?? parsed) as {
          targetStructures?: unknown;
          grammarTopics?: unknown;
          pedagogy?: { grammarPoints?: unknown };
        };
        if (Array.isArray(content.targetStructures)) {
          structures = content.targetStructures.filter((s): s is string => typeof s === 'string');
        }
        const topicSet = new Set<string>();
        if (Array.isArray(content.grammarTopics)) {
          for (const g of content.grammarTopics) {
            if (typeof g === 'string' && g.trim()) topicSet.add(g.trim());
          }
        }
        if (Array.isArray(content.pedagogy?.grammarPoints)) {
          for (const gp of content.pedagogy.grammarPoints) {
            if (gp && typeof gp === 'object' && typeof (gp as { titleAr?: unknown }).titleAr === 'string') {
              const title = ((gp as { titleAr: string }).titleAr).trim();
              if (title) topicSet.add(title);
            }
          }
        }
        topics = [...topicSet];
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

/* ============================================================================
   مراكز المحتوى التعليمية: القواعد، المحادثات والكول سنتر، والاستماع والنطق
   ----------------------------------------------------------------------------
   * تطبق قاعدة الرؤية نفسها (منشور افتراضيًا، والمسودات فقط مع ALLOW_UNREVIEWED_CONTENT).
   * لا ترجع أي مفاتيح تصحيح أو تمارين داخلية أو answerKey أبدًا.
   ========================================================================== */

interface HubLessonRow {
  id: string;
  slug: string;
  title_ar: string;
  level_code: string | null;
  objective_ar: string;
  unlock_rule_json: string;
  mastery_criteria_json: string;
  sort_order: number;
  unit_slug: string;
  unit_title_ar: string;
  unit_sort_order: number;
  program_slug: string;
  program_title_ar: string;
  content_json: string;
}

interface ParsedHubLesson {
  row: HubLessonRow;
  progressStatus: string;
  isUnlocked: boolean;
  level: string;
  parsed: Record<string, unknown>;
}

const HUB_LEVEL_ORDER: Record<string, number> = {
  PREA1: 0,
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
};

async function loadVisibleHubLessons(env: Env, user: SessionUser | null): Promise<ParsedHubLesson[]> {
  const includeDrafts = allowUnreviewedContent(env);
  const statusFilter = includeDrafts
    ? "l.status IN ('published','draft') AND lv.status IN ('published','draft')"
    : "l.status = 'published' AND lv.status = 'published'";

  const rows = await env.DB.prepare(
    `SELECT l.id, l.slug, l.title_ar, l.level_code, l.objective_ar,
            l.unlock_rule_json, l.mastery_criteria_json, l.sort_order,
            u.slug AS unit_slug, u.title_ar AS unit_title_ar, u.sort_order AS unit_sort_order,
            p.slug AS program_slug, p.title_ar AS program_title_ar,
            lv.content_json
     FROM lessons l
     JOIN lesson_versions lv ON lv.id = l.current_version_id
     JOIN units u ON u.id = l.unit_id
     JOIN programs p ON p.id = u.program_id
     WHERE ${statusFilter}
     ORDER BY p.sort_order, u.sort_order, l.sort_order, l.slug`,
  ).all<HubLessonRow>();

  const progressMap = new Map<string, { status: string; bestAccuracy: number }>();
  if (user) {
    const pRows = await env.DB.prepare(
      `SELECT l.slug, p.status, p.best_accuracy
       FROM user_lesson_progress p JOIN lessons l ON l.id = p.lesson_id
       WHERE p.user_id = ?`,
    )
      .bind(user.id)
      .all<{ slug: string; status: string; best_accuracy: number }>();
    for (const p of pRows.results) {
      progressMap.set(p.slug, { status: p.status, bestAccuracy: Number(p.best_accuracy ?? 0) });
    }
  }

  const thresholdMap = new Map<string, number>();
  for (const r of rows.results) {
    try {
      const m = JSON.parse(r.mastery_criteria_json || '{}') as { minAccuracy?: unknown };
      if (typeof m.minAccuracy === 'number' && Number.isFinite(m.minAccuracy)) {
        thresholdMap.set(r.slug, m.minAccuracy);
      }
    } catch { /* تجاهل البيانات التالفة */ }
  }

  return rows.results
    .map(row => {
      let parsed: Record<string, unknown> = {};
      try {
        const raw = JSON.parse(row.content_json) as { lesson?: Record<string, unknown> };
        parsed = raw.lesson ?? (raw as unknown as Record<string, unknown>);
      } catch {
        parsed = {};
      }
      const prog = progressMap.get(row.slug);
      let isUnlocked = true;
      if (user) {
        try {
          const rule = JSON.parse(row.unlock_rule_json || '{}') as { requires?: string[]; minAccuracy?: number };
          const reqs = Array.isArray(rule.requires) ? rule.requires : [];
          isUnlocked = reqs.every(reqSlug => {
            const p = progressMap.get(reqSlug);
            if (!p || p.status === 'not_started') return false;
            const minAcc = rule.minAccuracy ?? thresholdMap.get(reqSlug) ?? 0;
            return p.bestAccuracy >= minAcc;
          });
        } catch {
          isUnlocked = false;
        }
      }
      const level = (row.level_code ?? 'A1').toUpperCase().replace('PRE-A1', 'PREA1');
      return {
        row,
        progressStatus: prog?.status ?? 'not_started',
        isUnlocked,
        level,
        parsed,
      };
    })
    .sort((a, b) => {
      const la = HUB_LEVEL_ORDER[a.level] ?? 99;
      const lb = HUB_LEVEL_ORDER[b.level] ?? 99;
      if (la !== lb) return la - lb;
      if (a.row.unit_sort_order !== b.row.unit_sort_order) return a.row.unit_sort_order - b.row.unit_sort_order;
      return a.row.sort_order - b.row.sort_order;
    });
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0) : [];
}

function humanizeGrammarTopicSlug(slug: string): string {
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** GET /api/content/hub/grammar — فهرس القواعد الشامل مصنَّفًا حسب CEFR */
export async function grammarHub(req: Request, env: Env, requestId: string, user: SessionUser | null): Promise<Response> {
  const url = new URL(req.url);
  const levelFilter = (url.searchParams.get('level') ?? '').toUpperCase().trim();
  const q = (url.searchParams.get('q') ?? '').toLowerCase().trim();
  const items = await loadVisibleHubLessons(env, user);

  const grammarTopicsTable = await env.DB.prepare(
    `SELECT slug, level_code, title_ar, explanation_md, eg_note_md FROM grammar_topics ORDER BY sort_order, slug`,
  ).all<{ slug: string; level_code: string | null; title_ar: string; explanation_md: string; eg_note_md: string | null }>();
  const topicLookup = new Map(grammarTopicsTable.results.map(t => [t.slug, t]));

  const entries: {
    id: string;
    lessonSlug: string;
    lessonTitleAr: string;
    level: string;
    unitTitleAr: string;
    programSlug: string;
    isUnlocked: boolean;
    progressStatus: string;
    titleAr: string;
    explanationAr: string;
    topicTags: string[];
    examples: string[];
    commonMistakesAr: string[];
    culturalNoteAr: string | null;
  }[] = [];

  for (const item of items) {
    if (levelFilter && levelFilter !== 'ALL' && item.level !== levelFilter) continue;
    const l = item.parsed;
    const ped = (l.pedagogy && typeof l.pedagogy === 'object' ? l.pedagogy : undefined) as
      | { grammarPoints?: unknown; commonMistakesAr?: unknown; culturalNoteAr?: unknown }
      | undefined;

    const pointsRaw = Array.isArray(ped?.grammarPoints) ? ped!.grammarPoints : [];
    const points: { titleAr: string; explanationAr: string }[] = [];
    for (const gpRaw of pointsRaw) {
      if (!gpRaw || typeof gpRaw !== 'object') continue;
      const gp = gpRaw as { titleAr?: unknown; explanationAr?: unknown };
      if (typeof gp.titleAr === 'string' && gp.titleAr.trim() && typeof gp.explanationAr === 'string' && gp.explanationAr.trim()) {
        points.push({ titleAr: gp.titleAr.trim(), explanationAr: gp.explanationAr.trim() });
      }
    }

    const topicSlugs = strArray(l.grammarTopics);
    const targetStructures = strArray(l.targetStructures);
    const commonMistakesAr = strArray(ped?.commonMistakesAr);
    const culturalNoteAr =
      typeof l.culturalNoteAr === 'string' && l.culturalNoteAr.trim()
        ? l.culturalNoteAr.trim()
        : typeof ped?.culturalNoteAr === 'string' && ped.culturalNoteAr.trim()
          ? ped.culturalNoteAr.trim()
          : null;

    // إن كان الدرس يحمل شروحات grammarPoints نُخرج نقطة واضحة لكل قاعدة؛
    // وإلا نُخرج بطاقة قاعدة موحّدة من عنوان الدرس وهدف التعلم وgrammarTopics والتراكيب المستهدفة.
    if (points.length > 0) {
      points.forEach((gp, idx) => {
        const hay = `${gp.titleAr} ${gp.explanationAr} ${item.row.title_ar} ${targetStructures.join(' ')}`.toLowerCase();
        if (q && !hay.includes(q)) return;
        entries.push({
          id: `${item.row.slug}:gp:${idx}`,
          lessonSlug: item.row.slug,
          lessonTitleAr: item.row.title_ar,
          level: item.level,
          unitTitleAr: item.row.unit_title_ar,
          programSlug: item.row.program_slug,
          isUnlocked: item.isUnlocked,
          progressStatus: item.progressStatus,
          titleAr: gp.titleAr,
          explanationAr: gp.explanationAr,
          topicTags: topicSlugs.map(humanizeGrammarTopicSlug),
          examples: targetStructures.slice(0, 4),
          commonMistakesAr,
          culturalNoteAr,
        });
      });
    } else if (topicSlugs.length > 0 || targetStructures.length > 0) {
      const dbTopics = topicSlugs.map(s => topicLookup.get(s)).filter((t): t is NonNullable<typeof t> => !!t);
      const titleAr = dbTopics[0]?.title_ar ?? item.row.title_ar;
      const explanationAr =
        dbTopics.map(t => t.explanation_md).filter(Boolean).join('\n\n') ||
        (typeof l.pedagogicalRationaleAr === 'string' && l.pedagogicalRationaleAr.trim()) ||
        item.row.objective_ar;
      const hay = `${titleAr} ${explanationAr} ${topicSlugs.join(' ')} ${item.row.title_ar} ${targetStructures.join(' ')}`.toLowerCase();
      if (q && !hay.includes(q)) continue;
      entries.push({
        id: `${item.row.slug}:topic`,
        lessonSlug: item.row.slug,
        lessonTitleAr: item.row.title_ar,
        level: item.level,
        unitTitleAr: item.row.unit_title_ar,
        programSlug: item.row.program_slug,
        isUnlocked: item.isUnlocked,
        progressStatus: item.progressStatus,
        titleAr,
        explanationAr,
        topicTags: topicSlugs.map(humanizeGrammarTopicSlug),
        examples: targetStructures.slice(0, 5),
        commonMistakesAr,
        culturalNoteAr,
      });
    }
  }

  return json(
    {
      total: entries.length,
      entries,
    },
    { headers: { 'Cache-Control': 'no-store' } },
    requestId,
  );
}

type ScenarioDomain = 'callcenter' | 'travel' | 'food' | 'shopping' | 'work' | 'health' | 'everyday';

function classifyConversationDomain(programSlug: string, slug: string, unitSlug: string): ScenarioDomain {
  if (programSlug === 'callcenter' || slug.startsWith('cc-')) return 'callcenter';
  if (programSlug === 'travel' || slug.startsWith('tr-') || /aeropuerto|hotel|vuelo|tren|direcciones|equipaje|ciudad|viaj/.test(slug + ' ' + unitSlug)) {
    return 'travel';
  }
  if (/cafe|restaurante|comida|bebida|desayuno|pedir-en-cafe|food/.test(slug + ' ' + unitSlug)) return 'food';
  if (/comprar|ropa|tienda|precio|mercado|shopping/.test(slug + ' ' + unitSlug)) return 'shopping';
  if (/trabajo|horario|entrevista|oficina|profesion|work/.test(slug + ' ' + unitSlug)) return 'work';
  if (/farmacia|doler|emergencia|salud|medico|cuerpo|health/.test(slug + ' ' + unitSlug)) return 'health';
  return 'everyday';
}

function callCenterPhaseFor(unitSlug: string): { code: string; labelAr: string } | null {
  if (unitSlug.startsWith('cc-u0')) return { code: 'phonetics', labelAr: 'الصوتيات والوضوح الهاتفي' };
  if (unitSlug.startsWith('cc-u1')) return { code: 'opening', labelAr: 'استقبال المكالمة والتحقق' };
  if (unitSlug.startsWith('cc-u2')) return { code: 'billing', labelAr: 'الفواتير والحساب والباقات' };
  if (unitSlug.startsWith('cc-u3')) return { code: 'diagnosis', labelAr: 'فهم المشكلة واقتراح الحل' };
  if (unitSlug.startsWith('cc-u4')) return { code: 'complaints', labelAr: 'الشكاوى وتهدئة العميل' };
  if (unitSlug.startsWith('cc-u5')) return { code: 'closing', labelAr: 'التصعيد وإغلاق المكالمة' };
  if (unitSlug.startsWith('cc-u6')) return { code: 'written', labelAr: 'المتابعة الكتابية والمحاكاة' };
  return null;
}

/** GET /api/content/hub/conversations — حوارات الحياة اليومية ومحاكاة الكول سنتر */
export async function conversationsHub(req: Request, env: Env, requestId: string, user: SessionUser | null): Promise<Response> {
  const url = new URL(req.url);
  const domainFilter = (url.searchParams.get('domain') ?? 'all').toLowerCase().trim();
  const levelFilter = (url.searchParams.get('level') ?? '').toUpperCase().trim();
  const items = await loadVisibleHubLessons(env, user);

  const scenarios: {
    id: string;
    domain: ScenarioDomain;
    callCenterPhase: { code: string; labelAr: string } | null;
    lessonSlug: string;
    lessonTitleAr: string;
    level: string;
    unitSlug: string;
    unitTitleAr: string;
    programSlug: string;
    isUnlocked: boolean;
    progressStatus: string;
    contextAr: string;
    settingAr: string;
    culturalNoteAr: string | null;
    keyPhrases: string[];
    lines: { es: string; ar: string; arEg?: string; audioKey?: string }[];
  }[] = [];

  const domainCounts: Record<ScenarioDomain, number> = {
    callcenter: 0,
    travel: 0,
    food: 0,
    shopping: 0,
    work: 0,
    health: 0,
    everyday: 0,
  };

  for (const item of items) {
    const l = item.parsed;
    const rawScenarios = Array.isArray(l.scenarios) ? l.scenarios : [];
    if (!rawScenarios.length) continue;

    const domain = classifyConversationDomain(item.row.program_slug, item.row.slug, item.row.unit_slug);
    const phase = domain === 'callcenter' ? callCenterPhaseFor(item.row.unit_slug) : null;
    const culturalNoteAr = typeof l.culturalNoteAr === 'string' && l.culturalNoteAr.trim() ? l.culturalNoteAr.trim() : null;
    const keyPhrases = strArray(l.targetStructures).slice(0, 4);

    rawScenarios.forEach((scRaw, idx) => {
      if (!scRaw || typeof scRaw !== 'object') return;
      const sc = scRaw as { contextAr?: unknown; settingAr?: unknown; lines?: unknown };
      if (!Array.isArray(sc.lines)) return;
      const lines: { es: string; ar: string; arEg?: string; audioKey?: string }[] = [];
      for (const lnRaw of sc.lines) {
        if (!lnRaw || typeof lnRaw !== 'object') continue;
        const ln = lnRaw as { es?: unknown; ar?: unknown; arEg?: unknown; audioKey?: unknown };
        if (typeof ln.es !== 'string' || typeof ln.ar !== 'string') continue;
        lines.push({
          es: ln.es,
          ar: ln.ar,
          ...(typeof ln.arEg === 'string' && ln.arEg.trim() ? { arEg: ln.arEg } : {}),
          ...(typeof ln.audioKey === 'string' && ln.audioKey.trim() ? { audioKey: ln.audioKey } : {}),
        });
      }
      if (!lines.length) return;
      domainCounts[domain] += 1;
      if (domainFilter !== 'all' && domain !== domainFilter) return;
      if (levelFilter && levelFilter !== 'ALL' && item.level !== levelFilter) return;

      scenarios.push({
        id: `${item.row.slug}:sc:${idx}`,
        domain,
        callCenterPhase: phase,
        lessonSlug: item.row.slug,
        lessonTitleAr: item.row.title_ar,
        level: item.level,
        unitSlug: item.row.unit_slug,
        unitTitleAr: item.row.unit_title_ar,
        programSlug: item.row.program_slug,
        isUnlocked: item.isUnlocked,
        progressStatus: item.progressStatus,
        contextAr: typeof sc.contextAr === 'string' ? sc.contextAr : item.row.objective_ar,
        settingAr: typeof sc.settingAr === 'string' ? sc.settingAr : item.row.unit_title_ar,
        culturalNoteAr,
        keyPhrases,
        lines,
      });
    });
  }

  return json(
    {
      total: scenarios.length,
      domainCounts,
      scenarios,
    },
    { headers: { 'Cache-Control': 'no-store' } },
    requestId,
  );
}

/** GET /api/content/hub/listening — استوديو الاستماع والإملاء والنطق */
export async function listeningHub(req: Request, env: Env, requestId: string, user: SessionUser | null): Promise<Response> {
  const url = new URL(req.url);
  const levelFilter = (url.searchParams.get('level') ?? '').toUpperCase().trim();
  const trackFilter = (url.searchParams.get('track') ?? 'all').toLowerCase().trim();
  const limitParam = parseInt(url.searchParams.get('limit') ?? '80', 10);
  const limit = Math.min(150, Math.max(10, Number.isNaN(limitParam) ? 80 : limitParam));
  const items = await loadVisibleHubLessons(env, user);

  const clips: {
    id: string;
    es: string;
    ar: string;
    arEg?: string;
    audioKey?: string;
    level: string;
    lessonSlug: string;
    lessonTitleAr: string;
    programSlug: string;
    contextAr: string;
    isUnlocked: boolean;
  }[] = [];

  for (const item of items) {
    if (levelFilter && levelFilter !== 'ALL' && item.level !== levelFilter) continue;
    if (trackFilter !== 'all' && item.row.program_slug !== trackFilter) continue;
    const l = item.parsed;
    const rawScenarios = Array.isArray(l.scenarios) ? l.scenarios : [];

    for (let si = 0; si < rawScenarios.length; si++) {
      const sc = rawScenarios[si] as { contextAr?: unknown; lines?: unknown };
      if (!sc || !Array.isArray(sc.lines)) continue;
      const contextAr = typeof sc.contextAr === 'string' ? sc.contextAr : item.row.title_ar;
      for (let li = 0; li < sc.lines.length; li++) {
        const ln = sc.lines[li] as { es?: unknown; ar?: unknown; arEg?: unknown; audioKey?: unknown };
        if (typeof ln?.es !== 'string' || typeof ln?.ar !== 'string') continue;
        clips.push({
          id: `${item.row.slug}:${si}:${li}`,
          es: ln.es,
          ar: ln.ar,
          ...(typeof ln.arEg === 'string' && ln.arEg.trim() ? { arEg: ln.arEg } : {}),
          ...(typeof ln.audioKey === 'string' && ln.audioKey.trim() ? { audioKey: ln.audioKey } : {}),
          level: item.level,
          lessonSlug: item.row.slug,
          lessonTitleAr: item.row.title_ar,
          programSlug: item.row.program_slug,
          contextAr,
          isUnlocked: item.isUnlocked,
        });
        if (clips.length >= limit) break;
      }
      if (clips.length >= limit) break;
    }

    // للدروس التي لا تحتوي حوارًا، نضيف العبارات المستهدفة للتدرب على النطق والاستماع
    if (clips.length < limit && rawScenarios.length === 0) {
      const structures = strArray(l.targetStructures);
      for (let ti = 0; ti < structures.length; ti++) {
        const es = structures[ti]!;
        clips.push({
          id: `${item.row.slug}:st:${ti}`,
          es,
          ar: item.row.title_ar,
          level: item.level,
          lessonSlug: item.row.slug,
          lessonTitleAr: item.row.title_ar,
          programSlug: item.row.program_slug,
          contextAr: item.row.objective_ar,
          isUnlocked: item.isUnlocked,
        });
        if (clips.length >= limit) break;
      }
    }
    if (clips.length >= limit) break;
  }

  return json(
    { total: clips.length, clips },
    { headers: { 'Cache-Control': 'no-store' } },
    requestId,
  );
}

