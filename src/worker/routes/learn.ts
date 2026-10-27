/* ============================================================================
   محرك التمارين وحفظ التقدم — الخادم هو المرجع الوحيد
   ----------------------------------------------------------------------------
   قواعد غير قابلة للتفاوض:
   * مفاتيح الإجابة لا تُرسل إلى العميل إطلاقًا (لا في الجلسة ولا في خيارات).
   * العميل يرسل إجابته فقط. أي `correct` أو `score` أو `xp` أو `passed` في الطلب
     يُتجاهَل تمامًا — التصحيح والحساب يحدثان هنا.
   * كل حدث كتابة يحمل `eventId` من العميل، ويُخزَّن كمفتاح فريد ⇒ إعادة الإرسال
     (شبكة ضعيفة، إعادة محاولة، مزامنة لاحقة) لا تُضاعف المحاولات ولا النقاط.
   ========================================================================== */
import type { Env, SessionUser } from '../types';
import { HttpError, json, readJson } from '../lib/http';
import { ulid } from '../lib/ids';
import { gradeAnswer, gradingModeOf, type AnswerKey } from '../lib/grading';
import { allowUnreviewedContent, UNREVIEWED_PROVENANCE } from '../lib/content-access';
import { gradePlacement, PLACEMENT_QUESTION_COUNT, publicPlacementQuestions } from '../lib/placement';
import { rateLimitOrThrow } from '../lib/rate-limit';
import { computeStreaks } from '../lib/streak';

/** XP ثابت على الخادم. العميل لا يشارك في تحديده. */
export const XP_PER_LESSON = 30;

const SLUG_RE = /^[a-z0-9-]{3,64}$/;
const EVENT_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

interface LessonRow {
  id: string;
  slug: string;
  title_ar: string;
  level_code: string | null;
  objective_ar: string;
  estimated_minutes: number;
  status: string;
  unlock_rule_json: string;
  mastery_criteria_json: string;
  version_id: string;
  version_no: number;
  version_status: string;
  review_state: string;
  content_hash: string;
}

interface ExerciseRow {
  id: string;
  type: string;
  prompt_json: string;
  answer_key_json: string;
  explanation_ar: string;
  error_feedback_json: string;
  sort_order: number;
}

function slugFrom(req: Request): string {
  const parts = new URL(req.url).pathname.split('/');
  const slug = decodeURIComponent(parts[3] ?? '');
  if (!SLUG_RE.test(slug)) throw new HttpError(400, 'INVALID_SLUG', 'معرّف الدرس غير صحيح.');
  return slug;
}

const allowUnreviewed = allowUnreviewedContent;
const PROVENANCE = UNREVIEWED_PROVENANCE;

async function loadLesson(env: Env, slug: string): Promise<LessonRow> {
  const row = await env.DB.prepare(
    `SELECT l.id, l.slug, l.title_ar, l.level_code, l.objective_ar, l.estimated_minutes, l.status,
            l.unlock_rule_json, l.mastery_criteria_json, lv.id AS version_id, lv.version_no,
            lv.status AS version_status, lv.review_state, lv.content_hash
     FROM lessons l JOIN lesson_versions lv ON lv.id = l.current_version_id
     WHERE l.slug = ?`,
  )
    .bind(slug)
    .first<LessonRow>();

  if (!row) throw new HttpError(404, 'LESSON_NOT_FOUND', 'هذا الدرس غير متاح.');
  const published = row.status === 'published' && row.version_status === 'published';
  if (!published && !allowUnreviewed(env)) {
    throw new HttpError(404, 'LESSON_NOT_FOUND', 'هذا الدرس غير متاح.');
  }
  return row;
}

/** يتحقق من قواعد الفتح. لا يوجد تجاوز — حتى في التطوير، حتى تكون الاختبارات حقيقية.
 * نفس تعريف «مستوفًى» في لوحة التقدم: إتمامٌ بدقة كافية، لا مجرد بدء.
 * قاعدة فتح تالفة ⇒ مقفل (فشل مغلق)، لا مفتوح صامتًا. */
async function assertUnlocked(env: Env, user: SessionUser, lesson: LessonRow): Promise<void> {
  let rule: { type?: string; requires?: string[]; minAccuracy?: number };
  try {
    rule = JSON.parse(lesson.unlock_rule_json);
  } catch {
    throw new HttpError(403, 'LESSON_LOCKED', 'هذا الدرس مقفل: أكمل الدرس السابق بدقة كافية أولًا.', {
      requires: [],
      minAccuracy: 0,
      missing: [],
    });
  }
  if (!rule.requires?.length) return;

  const placeholders = rule.requires.map(() => '?').join(',');
  const rows = await env.DB.prepare(
    `SELECT l.slug, COALESCE(p.status, 'not_started') AS status, COALESCE(p.best_accuracy, 0) AS best_accuracy
     FROM lessons l LEFT JOIN user_lesson_progress p ON p.lesson_id = l.id AND p.user_id = ?
     WHERE l.slug IN (${placeholders})`,
  )
    .bind(user.id, ...rule.requires)
    .all<{ slug: string; status: string; best_accuracy: number }>();

  const minAccuracy = rule.minAccuracy ?? 0;
  const missing = rows.results.filter(r => r.status !== 'completed' || r.best_accuracy < minAccuracy);
  const found = new Set(rows.results.map(r => r.slug));
  const notFound = rule.requires.filter(s => !found.has(s));

  if (missing.length || notFound.length) {
    throw new HttpError(403, 'LESSON_LOCKED', 'هذا الدرس مقفل: أكمل الدرس السابق بدقة كافية أولًا.', {
      requires: rule.requires,
      minAccuracy,
      missing: [...missing.map(m => m.slug), ...notFound],
    });
  }
}

function publicPrompt(promptJson: string) {
  try {
    const p = JSON.parse(promptJson) as Record<string, unknown>;
    return {
      instructionAr: String(p.instructionAr ?? ''),
      stemEs: (p.stemEs as string | null) ?? null,
      stemAr: (p.stemAr as string | null) ?? null,
      audioKey: (p.audioKey as string | null) ?? null,
      // النص الذي يُنطق احتياطيًا (speechSynthesis) — إسباني دائمًا، ولا يُستنتج
      // من خيارات مشتِّتة (الاستثناء الوحيد listen_choose بلا stemEs يُشتق في
      // lessonSession من نص الخيار الصحيح، لأنه محفّز التمرين نفسه)
      speechEs: (p.speechEs as string | null) ?? (p.stemEs as string | null) ?? null,
    };
  } catch {
    return { instructionAr: '', stemEs: null, stemAr: null, audioKey: null, speechEs: null };
  }
}

/** جلسة الدرس: بيانات العرض فقط — بلا مفاتيح إجابة ولا خيارات صحيحة */
export async function lessonSession(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const slug = slugFrom(req);
  const lesson = await loadLesson(env, slug);
  await assertUnlocked(env, user, lesson);

  const exercises = await env.DB.prepare(
    `SELECT id, type, prompt_json, answer_key_json, explanation_ar, error_feedback_json, sort_order
     FROM exercises WHERE lesson_version_id = ? ORDER BY sort_order`,
  )
    .bind(lesson.version_id)
    .all<ExerciseRow>();

  const options = await env.DB.prepare(
    `SELECT o.id, o.exercise_id, o.text, o.is_correct, o.sort_order FROM exercise_options o
     JOIN exercises e ON e.id = o.exercise_id WHERE e.lesson_version_id = ? ORDER BY o.sort_order`,
  )
    .bind(lesson.version_id)
    .all<{ id: string; exercise_id: string; text: string; is_correct: number; sort_order: number }>();

  const items = await env.DB.prepare(
    `SELECT i.id, i.exercise_id, i.payload_json, i.ordinal FROM exercise_items i
     JOIN exercises e ON e.id = i.exercise_id WHERE e.lesson_version_id = ? ORDER BY i.ordinal`,
  )
    .bind(lesson.version_id)
    .all<{ id: string; exercise_id: string; payload_json: string; ordinal: number }>();

  const progress = await env.DB.prepare(
    `SELECT status, best_accuracy, attempts_count, completed_at FROM user_lesson_progress
     WHERE user_id = ? AND lesson_id = ?`,
  )
    .bind(user.id, lesson.id)
    .first<{ status: string; best_accuracy: number; attempts_count: number; completed_at: string | null }>();

  const optsByExercise = new Map<string, { id: string; text: string }[]>();
  const correctTextByExercise = new Map<string, string>();
  for (const o of options.results) {
    if (!optsByExercise.has(o.exercise_id)) optsByExercise.set(o.exercise_id, []);
    optsByExercise.get(o.exercise_id)!.push({ id: o.id, text: o.text });
    if (o.is_correct === 1 && !correctTextByExercise.has(o.exercise_id)) correctTextByExercise.set(o.exercise_id, o.text);
  }
  const itemsByExercise = new Map<string, { id: string; text: string }[]>();
  for (const it of items.results) {
    if (!itemsByExercise.has(it.exercise_id)) itemsByExercise.set(it.exercise_id, []);
    let text = '';
    try {
      text = String((JSON.parse(it.payload_json) as { text?: string }).text ?? '');
    } catch { /* عنصر تالف لا يكسر الجلسة */ }
    itemsByExercise.get(it.exercise_id)!.push({ id: it.id, text });
  }

  return json(
    {
      lesson: {
        slug: lesson.slug,
        titleAr: lesson.title_ar,
        level: lesson.level_code,
        objectiveAr: lesson.objective_ar,
        estimatedMinutes: lesson.estimated_minutes,
        versionId: lesson.version_id,
        versionNo: lesson.version_no,
        contentHash: lesson.content_hash,
        ...(lesson.status === 'published' ? {} : { provenance: PROVENANCE }),
      },
      exercises: exercises.results.map(e => {
        const prompt = publicPrompt(e.prompt_json);
        const opts = optsByExercise.get(e.id) ?? [];
        // نص النطق: ما كتبه مؤلف المحتوى صراحةً (speechEs) أو نص السؤال
        // (stemEs) فقط — باستثناء واحد: listen_choose بلا stemEs، فالجملة
        // المسموعة هي نص الخيار الصحيح، والصوت هو محفّز التمرين نفسه، وكل
        // نصوص الخيارات مرسلة للعميل أصلًا، فلا تسريب هنا. لا يُشتق لأي
        // نوع آخر — نطق الخيار الصحيح في word_choice مثلًا كان يكشف الإجابة.
        let speechEs = prompt.speechEs ?? prompt.stemEs ?? null;
        if (!speechEs && e.type === 'listen_choose') speechEs = correctTextByExercise.get(e.id) ?? null;
        if (speechEs && typeof speechEs === 'string') {
          speechEs = speechEs.replace(/_{2,}/g, '...').trim();
        }
        return {
          id: e.id,
          type: e.type,
          mode: gradingModeOf(e.type),
          hasGrader: gradingModeOf(e.type) === 'graded',
          ...prompt,
          speechEs,
          options: opts,
          items: itemsByExercise.get(e.id) ?? [],
        };
      }),
      progress: progress ?? { status: 'not_started', best_accuracy: 0, attempts_count: 0, completed_at: null },
      xpPerLesson: XP_PER_LESSON,
    },
    { headers: { 'Cache-Control': 'no-store' } },
    requestId,
  );
}

/**
 * إرسال إجابة واحدة.
 * الحقول المقبولة: eventId, exerciseId, response, durationMs.
 * أي حقل آخر (correct/score/xp/passed) يُهمَل.
 */
export async function submitAnswer(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const slug = slugFrom(req);
  const lesson = await loadLesson(env, slug);
  await assertUnlocked(env, user, lesson);
  await rateLimitOrThrow(env.DB, `answers:user:${user.id}`, 120, 60);

  const body = await readJson<{ eventId?: string; exerciseId?: string; response?: unknown; durationMs?: number }>(req);
  const eventId = typeof body.eventId === 'string' ? body.eventId : '';
  const exerciseId = typeof body.exerciseId === 'string' ? body.exerciseId : '';
  if (!EVENT_ID_RE.test(eventId)) throw new HttpError(400, 'INVALID_EVENT_ID', 'معرّف الحدث غير صحيح.');
  if (!exerciseId) throw new HttpError(400, 'INVALID_EXERCISE', 'معرّف التمرين مطلوب.');

  const ex = await env.DB.prepare(
    `SELECT id, type, answer_key_json, explanation_ar, error_feedback_json
     FROM exercises WHERE id = ? AND lesson_version_id = ?`,
  )
    .bind(exerciseId, lesson.version_id)
    .first<ExerciseRow>();
  if (!ex) throw new HttpError(404, 'EXERCISE_NOT_FOUND', 'هذا التمرين لا ينتمي إلى هذا الدرس.');

  // إعادة إرسال نفس الحدث ⇒ نُعيد النتيجة المخزَّنة، بلا محاولة جديدة ولا نقاط
  const existing = await env.DB.prepare(
    `SELECT answer_json, is_correct, score, server_recorded_at FROM user_exercise_attempts
     WHERE client_event_id = ? AND user_id = ?`,
  )
    .bind(eventId, user.id)
    .first<{ answer_json: string; is_correct: number; score: number; server_recorded_at: string }>();

  if (existing) {
    const replay = gradeAnswer(ex.type, safeParse<AnswerKey>(ex.answer_key_json), safeParse(existing.answer_json), safeParse(ex.error_feedback_json));
    return json(
      {
        replay: true,
        correct: existing.is_correct === 1,
        score: existing.score,
        mode: replay.mode,
        explanationAr: ex.explanation_ar,
        feedbackAr: replay.chosenFeedbackAr ?? null,
        recordedAt: existing.server_recorded_at,
      },
      {},
      requestId,
    );
  }

  const result = gradeAnswer(ex.type, safeParse<AnswerKey>(ex.answer_key_json), body.response, safeParse(ex.error_feedback_json));

  // القيد الفريد هو حائط الحماية من سباق الإرسال المتزامن بنفس eventId:
  // ON CONFLICT DO NOTHING ثم إعادة قراءة — لا 500 ولا محاولة مكررة.
  const insert = await env.DB.prepare(
    `INSERT INTO user_exercise_attempts
       (id, client_event_id, user_id, lesson_id, lesson_version_id, exercise_id, is_correct, score, answer_json,
        duration_ms, source, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'online', ?)
     ON CONFLICT(client_event_id) DO NOTHING`,
  )
    .bind(
      ulid().toLowerCase(),
      eventId,
      user.id,
      lesson.id,
      lesson.version_id,
      exerciseId,
      result.correct === true ? 1 : 0,
      result.score ?? 0,
      JSON.stringify(body.response ?? null),
      Number.isFinite(Number(body.durationMs)) ? Math.max(0, Math.min(600_000, Number(body.durationMs))) : null,
      new Date().toISOString(),
    )
    .run();

  if ((insert.meta?.changes ?? 0) === 0) {
    const raced = await env.DB.prepare(
      `SELECT answer_json, is_correct, score, server_recorded_at FROM user_exercise_attempts
       WHERE client_event_id = ? AND user_id = ?`,
    )
      .bind(eventId, user.id)
      .first<{ answer_json: string; is_correct: number; score: number; server_recorded_at: string }>();
    if (raced) {
      const replay = gradeAnswer(ex.type, safeParse<AnswerKey>(ex.answer_key_json), safeParse(raced.answer_json), safeParse(ex.error_feedback_json));
      return json(
        {
          replay: true,
          correct: raced.is_correct === 1,
          score: raced.score,
          mode: replay.mode,
          explanationAr: ex.explanation_ar,
          feedbackAr: replay.chosenFeedbackAr ?? null,
          recordedAt: raced.server_recorded_at,
        },
        {},
        requestId,
      );
    }
    // مفتاح الحدث محجوز لمستخدم آخر (معرّف مولَّد عشوائيًا — نادر جدًا):
    // لا نسجّل محاولة ولا نُسقط الطلب بخطأ داخلي؛ على العميل إعادة الإرسال بمفتاح جديد.
    throw new HttpError(409, 'DUPLICATE_EVENT_ID', 'أُعيد إرسال هذا الحدث من قبل. أعد المحاولة.');
  }

  await env.DB.prepare(
    `INSERT INTO user_lesson_progress (user_id, lesson_id, lesson_version_id, status, attempts_count, last_activity_at)
     VALUES (?, ?, ?, 'in_progress', 1, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET
       attempts_count = attempts_count + 1,
       last_activity_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')`,
  )
    .bind(user.id, lesson.id, lesson.version_id)
    .run();

  return json(
    {
      replay: false,
      correct: result.correct,
      score: result.score,
      mode: result.mode,
      explanationAr: ex.explanation_ar,
      feedbackAr: result.chosenFeedbackAr ?? null,
    },
    {},
    requestId,
  );
}

interface MasteryCriteria {
  minAccuracy?: number;
  minCorrectExercises?: number;
}

/** إكمال الدرس: كل الحساب من محاولات مخزَّنة في القاعدة، لا من العميل */
export async function completeLesson(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const slug = slugFrom(req);
  const lesson = await loadLesson(env, slug);
  await assertUnlocked(env, user, lesson);
  await rateLimitOrThrow(env.DB, `complete:user:${user.id}`, 60, 60);

  const body = await readJson<{ eventId?: string }>(req);
  const eventId = typeof body.eventId === 'string' ? body.eventId : '';
  if (!EVENT_ID_RE.test(eventId)) throw new HttpError(400, 'INVALID_EVENT_ID', 'معرّف الحدث غير صحيح.');

  const exercises = await env.DB.prepare(
    `SELECT id, type FROM exercises WHERE lesson_version_id = ?`,
  )
    .bind(lesson.version_id)
    .all<{ id: string; type: string }>();

  const graded = exercises.results.filter(e => gradingModeOf(e.type) === 'graded');
  const gradedIds = new Set(graded.map(e => e.id));
  const requiredTypes = (safeParse<{ requiredExerciseTypes?: string[] }>(lesson.mastery_criteria_json)).requiredExerciseTypes ?? [];
  const missingRequiredTypes = requiredTypes.filter(t => !exercises.results.some(e => e.type === t));

  // منع الاحتساب المزدوج: XP مرة واحدة لكل درس في حياة الحساب
  const prior = await env.DB.prepare(
    `SELECT status, best_accuracy FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?`,
  )
    .bind(user.id, lesson.id)
    .first<{ status: string; best_accuracy: number }>();
  const alreadyCompleted = prior?.status === 'completed';

  // الدقة من جولة الإكمال الحالية فقط: محاولات بعد آخر استدعاء إكمال لهذا
  // الدرس. بلا هذا الحدّ كان النجاح تراكميًا عبر جولات — إجابات صحيحة
  // متفرقة من محاولات فاشلة متعددة تُجمع لتنجح دون جولة ناجحة واحدة.
  // الدرس المكتمل أصلًا يُحسب تراكميًا كما قبل (حالته لا تتراجع، وXP صُرف).
  let roundSince: string | null = null;
  if (!alreadyCompleted) {
    const lastEvent = await env.DB.prepare(
      `SELECT MAX(occurred_at) AS last_at FROM learning_events
       WHERE user_id = ? AND type = 'lesson_completed' AND idempotency_key LIKE ?`,
    )
      .bind(user.id, `${user.id}:lesson_complete:${lesson.id}:%`)
      .first<{ last_at: string | null }>();
    roundSince = lastEvent?.last_at ?? null;
  }

  const attempts = await env.DB.prepare(
    `SELECT exercise_id, is_correct, created_at FROM user_exercise_attempts
     WHERE user_id = ? AND lesson_version_id = ? AND exercise_id IN (${[...gradedIds].map(() => '?').join(',') || "''"})
       ${roundSince ? 'AND created_at > ?' : ''}
     ORDER BY created_at ASC, id ASC`,
  )
    .bind(user.id, lesson.version_id, ...gradedIds, ...(roundSince ? [roundSince] : []))
    .all<{ exercise_id: string; is_correct: number; created_at: string }>();

  // أحدث محاولة لكل تمرين هي الحكم في الجولة — إجابة صحيحة قديمة لا تُنقذ
  // إجابة خاطئة لاحقة للتمرين نفسه.
  const latestByExercise = new Map<string, number>();
  for (const a of attempts.results) {
    latestByExercise.set(a.exercise_id, a.is_correct);
  }
  const solved = new Set([...latestByExercise.entries()].filter(([, v]) => v === 1).map(([k]) => k));
  const answered = new Set(attempts.results.map(a => a.exercise_id));
  const correctCount = solved.size;
  const gradedTotal = graded.length;
  const accuracy = gradedTotal ? Math.round((correctCount / gradedTotal) * 100) : 0;

  const criteria = safeParse<MasteryCriteria>(lesson.mastery_criteria_json);
  const minAccuracy = criteria.minAccuracy ?? 80;
  // دفاع في العمق: معيار إتقان يطلب أكثر من عدد التمارين المُصحَّحة يجعل
  // الدرس مستحيل النجاح حتى بالأداء الكامل — يُقصّ إلى الحد الممكن.
  // (محتوى الـ40 درسًا المتأثرة أُصلح في ملفاته أيضًا، وهذا يحمي من أي قادم.)
  const minCorrect = Math.min(criteria.minCorrectExercises ?? 0, gradedTotal);
  const passed = gradedTotal > 0 && accuracy >= minAccuracy && correctCount >= minCorrect;

  // سجل الحدث بمفتاح فريد: تكرار نفس eventId لا يضيف شيئًا
  const eventKey = `${user.id}:lesson_complete:${lesson.id}:${eventId}`;
  const insertedEvent = await env.DB.prepare(
    `INSERT INTO learning_events (id, user_id, type, payload_json, content_version_id, idempotency_key, occurred_at)
     VALUES (?, ?, 'lesson_completed', ?, ?, ?, ?)
     ON CONFLICT(idempotency_key) DO NOTHING`,
  )
    .bind(ulid().toLowerCase(), user.id, JSON.stringify({ accuracy, correctCount, gradedTotal, passed }), lesson.version_id, eventKey, new Date().toISOString())
    .run();
  const replay = (insertedEvent.meta?.changes ?? 0) === 0;

  let xpAwarded = 0;
  if (passed && !alreadyCompleted && !replay) {
    const xpKey = `${user.id}:xp:lesson_complete:${lesson.id}`;
    const xpInsert = await env.DB.prepare(
      `INSERT INTO xp_ledger (id, user_id, amount, reason, ref_type, ref_id, idempotency_key)
       VALUES (?, ?, ?, 'lesson_complete', 'lesson', ?, ?)
       ON CONFLICT(idempotency_key) DO NOTHING`,
    )
      .bind(ulid().toLowerCase(), user.id, XP_PER_LESSON, lesson.id, xpKey)
      .run();
    if ((xpInsert.meta?.changes ?? 0) > 0) xpAwarded = XP_PER_LESSON;
  }

  await env.DB.prepare(
    `INSERT INTO user_lesson_progress (user_id, lesson_id, lesson_version_id, status, best_accuracy, attempts_count, completed_at, last_activity_at)
     VALUES (?, ?, ?, ?, ?, 0, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET
       status = CASE WHEN excluded.status = 'completed' THEN 'completed' ELSE user_lesson_progress.status END,
       best_accuracy = MAX(user_lesson_progress.best_accuracy, excluded.best_accuracy),
       completed_at = COALESCE(user_lesson_progress.completed_at, excluded.completed_at),
       last_activity_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')`,
  )
    .bind(
      user.id,
      lesson.id,
      lesson.version_id,
      passed ? 'completed' : 'in_progress',
      accuracy,
      passed ? new Date().toISOString() : null,
    )
    .run();

  // XP الإجمالي يُحسب من السجل دائمًا — لا عدّاد يمكن أن ينحرف
  await env.DB.prepare(
    `UPDATE user_stats SET xp_total = (SELECT COALESCE(SUM(amount),0) FROM xp_ledger WHERE user_id = ?),
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE user_id = ?`,
  )
    .bind(user.id, user.id)
    .run();

  // بطاقات مراجعة للمفردات المرتبطة بالدرس — تُنشأ مرة واحدة فقط (ON CONFLICT DO NOTHING)
  // بطاقات المراجعة لمن أتمّ الدرس فعلًا فقط — الضغط على «إنهاء» بلا نجاح
  // كان يضيف مفردات الدرس كلها إلى المراجعة ويرفع words_seen.
  const cardsCreated = passed ? await createCardsForLesson(env, user.id, lesson.id) : 0;

  const stats = await env.DB.prepare(`SELECT xp_total FROM user_stats WHERE user_id = ?`)
    .bind(user.id)
    .first<{ xp_total: number }>();

  return json(
    {
      replay,
      passed,
      accuracy,
      correctCount,
      gradedTotal,
      answeredCount: answered.size,
      minAccuracy,
      minCorrectExercises: minCorrect,
      missingRequiredTypes,
      participantOnly: exercises.results.length - gradedTotal,
      reviewCardsCreated: cardsCreated,
      xpAwarded,
      xpTotal: stats?.xp_total ?? 0,
      alreadyCompleted,
    },
    {},
    requestId,
  );
}


/**
 * يُنشئ بطاقات مراجعة للمفردات المرتبطة بالدرس (lesson_vocabulary).
 * لا يُنشئ بطاقة «استماع»: لا صوت معتمد بعد، والبطاقة التي لا يمكن أداؤها ليست تدريبًا.
 * التكرار آمن: ON CONFLICT DO NOTHING على (user_id, item_type, item_id).
 */
async function createCardsForLesson(env: Env, userId: string, lessonId: string): Promise<number> {
  try {
    const rows = await env.DB.prepare(
      `SELECT lv.entry_id FROM lesson_vocabulary lv WHERE lv.lesson_id = ?`,
    )
      .bind(lessonId)
      .all<{ entry_id: string }>();
    if (!rows.results.length) return 0;

    const now = new Date().toISOString();
    let created = 0;
    for (const r of rows.results) {
      const res = await env.DB.prepare(
        `INSERT INTO review_schedule
           (user_id, item_type, item_id, ease, interval_days, repetitions, lapses, due_at,
            card_kind, state, scheduler_version, created_at, origin_ref)
         VALUES (?, 'vocab', ?, 2.5, 0, 0, 0, ?, 'recognition', 'new', 1, ?, ?)
         ON CONFLICT(user_id, item_type, item_id) DO NOTHING`,
      )
        .bind(userId, r.entry_id, now, now, `lesson:${lessonId}`)
        .run();
      if (Number(res.meta?.changes ?? 0) > 0) created++;
    }
    if (created > 0) {
      await env.DB.prepare(
        `UPDATE user_stats SET words_seen = (SELECT COUNT(*) FROM review_schedule WHERE user_id = ? AND item_type = 'vocab'),
                updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE user_id = ?`,
      )
        .bind(userId, userId)
        .run();
    }
    return created;
  } catch {
    // فشل توليد البطاقات لا يُسقط نجاح الدرس: التقدم محفوظ، والبطاقات تُستكمل لاحقًا
    return 0;
  }
}

/** لوحة التقدم: كل رقم هنا من القاعدة، لا رقم محسوب في المتصفح */
export async function myProgress(_req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const stats = await env.DB.prepare(
    `SELECT xp_total, minutes_total, streak_current, streak_longest, reviews_done, words_seen, words_stable
     FROM user_stats WHERE user_id = ?`,
  )
    .bind(user.id)
    .first<Record<string, number>>();

  const activeStatuses = allowUnreviewed(env) ? "('published','draft')" : "('published')";

  const rawLessons = await env.DB.prepare(
    `SELECT l.id, l.slug, l.title_ar, l.level_code, l.status, l.unlock_rule_json, l.sort_order AS sort_order,
            u.id AS unit_id, u.slug AS unit_slug, u.title_ar AS unit_title_ar, u.sort_order AS unit_sort_order,
            p.id AS program_id, p.slug AS program_slug, p.title_ar AS program_title_ar, p.kind AS program_kind, p.sort_order AS program_sort_order,
            COALESCE(ulp.status, 'not_started') AS progress_status,
            COALESCE(ulp.best_accuracy, 0) AS best_accuracy,
            ulp.completed_at
     FROM lessons l
     JOIN units u ON u.id = l.unit_id
     JOIN programs p ON p.id = u.program_id
     LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = ?
     WHERE l.status IN ${activeStatuses}
     ORDER BY
       p.sort_order,
       CASE UPPER(COALESCE(l.level_code, ''))
         WHEN 'PREA1' THEN 0
         WHEN 'PRE-A1' THEN 0
         WHEN 'A1' THEN 1
         WHEN 'A2' THEN 2
         WHEN 'B1' THEN 3
         WHEN 'B2' THEN 4
         WHEN 'C1' THEN 5
         ELSE 6
       END,
       u.sort_order,
       l.sort_order,
       l.slug`,
  )
    .bind(user.id)
    .all<{
      id: string;
      slug: string;
      title_ar: string;
      level_code: string | null;
      status: string;
      unlock_rule_json: string;
      sort_order: number;
      unit_id: string;
      unit_slug: string;
      unit_title_ar: string;
      unit_sort_order: number;
      program_id: string;
      program_slug: string;
      program_title_ar: string;
      program_kind: string;
      program_sort_order: number;
      progress_status: string;
      best_accuracy: number;
      completed_at: string | null;
    }>();

  // ترتيب الدروس طوبولوجيًا داخل كل وحدة بحيث تأتي المتطلبات السابقة قبل الدروس المعتمدة عليها
  const sortedLessons = sortLessonsWithinUnits(rawLessons.results);

  // حساب حالة القفل بدقة وفقًا لقواعد الخادم assertUnlocked
  const completedSet = new Set<string>();
  const accuracyMap = new Map<string, number>();
  for (const r of sortedLessons) {
    if (r.progress_status === 'completed') completedSet.add(r.slug);
    accuracyMap.set(r.slug, r.best_accuracy);
  }

  const lessons = sortedLessons.map(l => {
    let rule: { requires?: string[]; minAccuracy?: number } = {};
    try {
      rule = JSON.parse(l.unlock_rule_json || '{}');
    } catch {}

    const requires = Array.isArray(rule.requires) ? rule.requires : [];
    const minAcc = rule.minAccuracy ?? 0;
    const missing = requires.filter(reqSlug => {
      const isDone = completedSet.has(reqSlug);
      const acc = accuracyMap.get(reqSlug) ?? 0;
      return !isDone || acc < minAcc;
    });

    const is_unlocked = missing.length === 0;

    return {
      slug: l.slug,
      title_ar: l.title_ar,
      level_code: l.level_code,
      status: l.status,
      progress_status: l.progress_status,
      best_accuracy: l.best_accuracy,
      completed_at: l.completed_at,
      unit_id: l.unit_id,
      unit_slug: l.unit_slug,
      unit_title_ar: l.unit_title_ar,
      unit_sort_order: l.unit_sort_order,
      program_slug: l.program_slug,
      program_title_ar: l.program_title_ar,
      program_kind: l.program_kind,
      is_unlocked,
      missing_prerequisites: missing,
    };
  });

  // تحديد «خطوتك التالية»: أول درس متاح وغير مكتمل في المسار التعليمي
  const nextLesson = lessons.find(l => l.program_slug === 'main-track' && l.progress_status !== 'completed' && l.is_unlocked)
    ?? lessons.find(l => l.progress_status !== 'completed' && l.is_unlocked)
    ?? null;

  const totals = await env.DB.prepare(
    `SELECT (SELECT COUNT(*) FROM lessons WHERE status IN ${activeStatuses}) AS lessons_total,
            (SELECT COUNT(*) FROM user_lesson_progress p JOIN lessons l ON l.id = p.lesson_id
              WHERE p.user_id = ? AND p.status = 'completed' AND l.status IN ${activeStatuses}) AS lessons_completed`,
  )
    .bind(user.id)
    .first<{ lessons_total: number; lessons_completed: number }>();

  // السلسلة تُحسب من سجل النشاط الفعلي (إكمال دروس، مراجعات، منح XP) لا من
  // عمود لا يكتبه أحد: أيام النشاط المميزة ثم تتابعها حتى اليوم/أمس.
  const activityRows = await env.DB.prepare(
    `SELECT activity_date FROM (
       SELECT date(COALESCE(occurred_at, recorded_at)) AS activity_date FROM learning_events WHERE user_id = ?
       UNION
       SELECT date(last_reviewed_at) FROM review_schedule WHERE user_id = ? AND last_reviewed_at IS NOT NULL
       UNION
       SELECT date(created_at) FROM xp_ledger WHERE user_id = ?
     ) WHERE activity_date IS NOT NULL ORDER BY activity_date DESC`,
  )
    .bind(user.id, user.id, user.id)
    .all<{ activity_date: string }>();
  const streaks = computeStreaks(
    activityRows.results.map(r => r.activity_date),
    new Date().toISOString().slice(0, 10),
  );
  const resolvedStats = {
    ...(stats ?? { xp_total: 0, minutes_total: 0, streak_current: 0, streak_longest: 0, reviews_done: 0, words_seen: 0, words_stable: 0 }),
    streak_current: streaks.current,
    streak_longest: streaks.longest,
  };
  // تحديث العمودين المخزنين ليبقيا صادقين لأي قارئ آخر — القراءة هنا لا تعتمد عليهما
  if (stats) {
    await env.DB.prepare(
      `UPDATE user_stats SET streak_current = ?, streak_longest = ? WHERE user_id = ?`,
    )
      .bind(streaks.current, streaks.longest, user.id)
      .run();
  }

  return json(
    {
      stats: resolvedStats,
      lessons,
      nextLesson: nextLesson ? {
        slug: nextLesson.slug,
        title_ar: nextLesson.title_ar,
        level_code: nextLesson.level_code,
        unit_title_ar: nextLesson.unit_title_ar,
        program_title_ar: nextLesson.program_title_ar,
      } : null,
      totals: totals ?? { lessons_total: 0, lessons_completed: 0 },
      contentProvenance: allowUnreviewed(env) ? PROVENANCE : null,
    },
    {},
    requestId,
  );
}

/** ترتيب الدروس داخل كل وحدة بحيث تسبق المتطلبات السابقة الدروس التي تطلبها */
function sortLessonsWithinUnits<T extends { unit_id: string; slug: string; unlock_rule_json: string }>(list: T[]): T[] {
  const byUnit = new Map<string, T[]>();
  for (const item of list) {
    if (!byUnit.has(item.unit_id)) byUnit.set(item.unit_id, []);
    byUnit.get(item.unit_id)!.push(item);
  }

  const result: T[] = [];
  for (const unitLessons of byUnit.values()) {
    const visited = new Set<string>();
    const bySlug = new Map(unitLessons.map(l => [l.slug, l]));

    function visit(l: T, visiting: Set<string>) {
      if (visited.has(l.slug)) return;
      if (visiting.has(l.slug)) {
        visited.add(l.slug);
        result.push(l);
        return;
      }
      visiting.add(l.slug);
      let requires: string[] = [];
      try {
        const parsed = JSON.parse(l.unlock_rule_json || '{}');
        if (Array.isArray(parsed.requires)) requires = parsed.requires;
      } catch {}

      for (const req of requires) {
        const dep = bySlug.get(req);
        if (dep && !visited.has(dep.slug)) {
          visit(dep, visiting);
        }
      }
      visiting.delete(l.slug);
      visited.add(l.slug);
      result.push(l);
    }

    for (const l of unitLessons) {
      visit(l, new Set());
    }
  }

  return result;
}

/** أسئلة اختبار تحديد المستوى — بلا مفاتيح إجابة. بنك الأسئلة في lib/placement.ts (خادم فقط). */
export async function placementQuestions(_req: Request, _env: Env, requestId: string, _user: SessionUser): Promise<Response> {
  return json({ questions: publicPlacementQuestions() }, { headers: { 'Cache-Control': 'no-store' } }, requestId);
}

/**
 * اختبار تحديد المستوى (Placement Test)
 * الخادم هو المصحح الوحيد: يتطلب الإجابات العشر كاملة، ويتجاهل أي درجة أو
 * مستوى يرسله العميل، ويشتق المستوى من الدرجة المحسوبة هنا فقط.
 * لا تراجع بقبول `score` من العميل — كان ذلك يفتح النجاح بلا إجابات.
 */
export async function submitPlacementTest(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const body = await readJson<{ answers?: Record<string, string> }>(req);

  const answers = body.answers;
  const validAnswers =
    !!answers &&
    typeof answers === 'object' &&
    !Array.isArray(answers) &&
    Object.keys(answers).length === PLACEMENT_QUESTION_COUNT &&
    Object.keys(answers).every(k => /^[1-9]$|^10$/.test(k)) &&
    Object.values(answers).every(v => ['a', 'b', 'c', 'd'].includes(v));
  if (!validAnswers) {
    throw new HttpError(400, 'INVALID_ANSWERS', 'أجب عن الأسئلة العشرة كاملة قبل إرسال التقييم.');
  }

  // حدّ المحاولات: 3 في اليوم لكل مستخدم — بلا إعادة لعب بلا حدود.
  await rateLimitOrThrow(env.DB, `placement:user:${user.id}`, 3, 86400);

  const { score } = gradePlacement(answers as Record<string, string>);
  const answersCount = PLACEMENT_QUESTION_COUNT;
  // المستوى يُشتق من الدرجة على الخادم: 80%+ ← A2، و60%+ ← A1، وأقل ← تمهيدي.
  const targetLevel = score >= 80 ? 'A2' : 'A1';
  const passed = score >= 60;
  const assessId = ulid().toLowerCase();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO assessment_results (id, user_id, kind, score, passed, details_json, created_at)
     VALUES (?, ?, 'placement', ?, ?, ?, ?)`,
  )
    .bind(
      assessId,
      user.id,
      score,
      passed ? 1 : 0,
      JSON.stringify({ targetLevel, score, answersCount, evaluatedAt: now }),
      now,
    )
    .run();

  let unlockedLessonsCount = 0;
  let xpAwarded = 0;

  if (passed) {
    const levelClause = targetLevel === 'A1' ? "('PREA1')" : "('PREA1', 'A1')";
    // نفس قاعدة رؤية المحتوى في بقية المنصة: المنشور فقط، والمسودات فقط
    // كعيّنة غير مراجعة خارج الإنتاج. لا يُفتح درس غير مرئي للمستخدم.
    const statusClause = allowUnreviewed(env) ? "('published','draft')" : "('published')";
    const lessonsToComplete = await env.DB.prepare(
      `SELECT l.id, l.current_version_id FROM lessons l WHERE l.level_code IN ${levelClause} AND l.status IN ${statusClause}`,
    ).all<{ id: string; current_version_id: string }>();

    for (const l of lessonsToComplete.results) {
      const res = await env.DB.prepare(
        `INSERT INTO user_lesson_progress (user_id, lesson_id, lesson_version_id, status, best_accuracy, attempts_count, completed_at, last_activity_at)
         VALUES (?, ?, ?, 'completed', 100, 1, ?, ?)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET
           status = 'completed',
           best_accuracy = MAX(user_lesson_progress.best_accuracy, 100),
           completed_at = COALESCE(user_lesson_progress.completed_at, excluded.completed_at),
           last_activity_at = excluded.last_activity_at`,
      )
        .bind(user.id, l.id, l.current_version_id, now, now)
        .run();
      if ((res.meta?.changes ?? 0) > 0) unlockedLessonsCount++;
    }

    const xpKey = `${user.id}:xp:placement:${targetLevel}`;
    const xpAmount = targetLevel === 'A1' ? 40 : 80;
    const xpInsert = await env.DB.prepare(
      `INSERT INTO xp_ledger (id, user_id, amount, reason, ref_type, ref_id, idempotency_key)
       VALUES (?, ?, ?, 'achievement', 'placement', ?, ?)
       ON CONFLICT(idempotency_key) DO NOTHING`,
    )
      .bind(ulid().toLowerCase(), user.id, xpAmount, targetLevel, xpKey)
      .run();

    if ((xpInsert.meta?.changes ?? 0) > 0) {
      xpAwarded = xpAmount;
      await env.DB.prepare(
        `UPDATE user_stats SET xp_total = (SELECT COALESCE(SUM(amount),0) FROM xp_ledger WHERE user_id = ?),
                updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE user_id = ?`,
      )
        .bind(user.id, user.id)
        .run();
    }
  }

  return json(
    {
      passed,
      score,
      targetLevel,
      unlockedLevel: passed ? targetLevel : 'PREA1',
      unlockedLessonsCount,
      xpAwarded,
      messageAr: passed
        ? `أحسنت! حققت نسبة ${score}% وتم فتح مستوى ${targetLevel} لك مباشرة مع ${xpAwarded} XP مكافأة.`
        : `نتيجتك ${score}% — نوصي بالبدء من المستوى التمهيدي لتثبيت الأساسيات خطوة بخطوة.`,
    },
    {},
    requestId,
  );
}

function safeParse<T = Record<string, unknown>>(raw: string | null | undefined): T {
  if (!raw) return {} as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return {} as T;
  }
}
