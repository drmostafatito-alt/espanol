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
import { searchEngine } from '../../shared/search-engine';

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
  content_json: string;
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
            lv.status AS version_status, lv.review_state, lv.content_hash, lv.content_json
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

/** يتحقق من قواعد الفتح. لا يوجد تجاوز — حتى في التطوير، حتى تكون الاختبارات حقيقية. */
async function assertUnlocked(env: Env, user: SessionUser, lesson: LessonRow): Promise<void> {
  let rule: { type?: string; requires?: string[]; minAccuracy?: number };
  try {
    rule = JSON.parse(lesson.unlock_rule_json);
  } catch {
    return;
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
  const missing = rows.results.filter(r => r.status === 'not_started' || r.best_accuracy < minAccuracy);
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
      // النص الذي يُنطق احتياطيًا (speechSynthesis) — إسباني دائمًا، ولا يُستنتج من خيارات مشتِّتة
      speechEs: (p.speechEs as string | null) ?? (p.stemEs as string | null) ?? null,
    };
  } catch {
    return { instructionAr: '', stemEs: null, stemAr: null, audioKey: null, speechEs: null };
  }
}

/** جلسة الدرس: بيانات العرض فقط — بلا مفاتيح إجابة ولا خيارات صحيحة */
/**
 * ملخص الدرس (Lesson brief): يُبنى من لقطة `content_json` الكاملة.
 * هذه العناصر كانت موجودة في المحتوى ولا تُعرض للمتعلم — الآن تُرسل لتظهر
 * كشاشة تعريف قبل التمارين (هدف، مفردات، أمثلة، حوار، ملاحظة ثقافية).
 * أي محتوى تالف يُهمَل ولا يُعطّل الدرس (فشل صامت نحو اللقطة الأساسية).
 */
export interface VocabBriefItem {
  word: string;
  meaningFusha: string | null;
  meaningEg: string | null;
}

export interface LessonBrief {
  objectiveAr: string;
  estimatedMinutes: number;
  newVocabulary: VocabBriefItem[];
  reviewVocabulary: VocabBriefItem[];
  targetStructures: string[];
  scenarios: { contextAr: string; settingAr: string; lines: { es: string; ar: string; arEg?: string }[] }[];
  culturalNoteAr: string | null;
  pedagogicalRationaleAr: string | null;
}

/** يحوّل قائمة الكلمات الإسبانية إلى بنود مع الترجمة العربية من معجم المفردات. */
function resolveVocab(words: string[]): VocabBriefItem[] {
  const seen = new Set<string>();
  const out: VocabBriefItem[] = [];
  for (const raw of words) {
    const word = raw.trim();
    if (!word) continue;
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    let meaningFusha: string | null = null;
    let meaningEg: string | null = null;
    try {
      const hit = searchEngine.lookupVocab(word);
      if (hit) {
        if (hit.f) meaningFusha = hit.f;
        if (hit.eg) meaningEg = hit.eg;
      }
    } catch {
      // معجم تالف — نُبقي الكلمة دون ترجمة ولا نكسر الدرس
    }
    out.push({ word, meaningFusha, meaningEg });
  }
  return out;
}

export function buildLessonBrief(
  contentJson: string,
  fallback: { objectiveAr: string; estimatedMinutes: number },
): LessonBrief {
  const base: LessonBrief = {
    objectiveAr: fallback.objectiveAr,
    estimatedMinutes: fallback.estimatedMinutes,
    newVocabulary: [],
    reviewVocabulary: [],
    targetStructures: [],
    scenarios: [],
    culturalNoteAr: null,
    pedagogicalRationaleAr: null,
  };
  try {
    const parsed = JSON.parse(contentJson) as { lesson?: Record<string, unknown> };
    const l: Record<string, unknown> =
      parsed.lesson ?? (parsed as unknown as Record<string, unknown>);
    const strArr = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
    base.newVocabulary = resolveVocab(strArr(l.newVocabulary));
    base.reviewVocabulary = resolveVocab(strArr(l.reviewVocabulary));
    base.targetStructures = strArr(l.targetStructures);
    if (typeof l.objectiveAr === 'string' && l.objectiveAr.trim()) base.objectiveAr = l.objectiveAr;
    if (typeof l.culturalNoteAr === 'string' && l.culturalNoteAr.trim()) base.culturalNoteAr = l.culturalNoteAr;
    if (typeof l.pedagogicalRationaleAr === 'string' && l.pedagogicalRationaleAr.trim()) {
      base.pedagogicalRationaleAr = l.pedagogicalRationaleAr;
    }
    if (Array.isArray(l.scenarios)) {
      for (const sRaw of l.scenarios) {
        if (!sRaw || typeof sRaw !== 'object') continue;
        const s = sRaw as { contextAr?: unknown; settingAr?: unknown; lines?: unknown };
        if (!Array.isArray(s.lines)) continue;
        const lines: LessonBrief['scenarios'][number]['lines'] = [];
        for (const lnRaw of s.lines) {
          if (!lnRaw || typeof lnRaw !== 'object') continue;
          const ln = lnRaw as { es?: unknown; ar?: unknown; arEg?: unknown };
          if (typeof ln.es !== 'string' || typeof ln.ar !== 'string') continue;
          const line: LessonBrief['scenarios'][number]['lines'][number] = { es: ln.es, ar: ln.ar };
          if (typeof ln.arEg === 'string' && ln.arEg.trim()) line.arEg = ln.arEg;
          lines.push(line);
        }
        if (!lines.length) continue;
        base.scenarios.push({
          contextAr: typeof s.contextAr === 'string' ? s.contextAr : '',
          settingAr: typeof s.settingAr === 'string' ? s.settingAr : '',
          lines,
        });
      }
    }
  } catch {
    // content_json تالف أو فارغ: نقدم اللقطة الأساسية فقط. لا نسمح له بكسر الدرس.
  }
  return base;
}

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
    `SELECT o.id, o.exercise_id, o.text, o.sort_order FROM exercise_options o
     JOIN exercises e ON e.id = o.exercise_id WHERE e.lesson_version_id = ? ORDER BY o.sort_order`,
  )
    .bind(lesson.version_id)
    .all<{ id: string; exercise_id: string; text: string; sort_order: number }>();

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
  for (const o of options.results) {
    if (!optsByExercise.has(o.exercise_id)) optsByExercise.set(o.exercise_id, []);
    optsByExercise.get(o.exercise_id)!.push({ id: o.id, text: o.text });
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
        brief: buildLessonBrief(lesson.content_json, {
          objectiveAr: lesson.objective_ar,
          estimatedMinutes: lesson.estimated_minutes,
        }),
        ...(lesson.status === 'published' ? {} : { provenance: PROVENANCE }),
      },
      exercises: exercises.results.map(e => {
        const prompt = publicPrompt(e.prompt_json);
        const opts = optsByExercise.get(e.id) ?? [];
        // نص النطق الاحتياطي: إن لم يُحدّده المحتوى صراحةً، يستخدمه الخادم من نص
        // الإجابة الصحيحة — لا من أول خيار (قد يكون مشتِّتًا فيُنطق نص خاطئ).
        let speechEs = prompt.speechEs;
        const key = safeParse<AnswerKey>(e.answer_key_json);
        const correctId = key?.correctOptionIds?.[0];
        if (!speechEs) {
          if (e.type === 'word_order' || e.type === 'dialogue_order') {
            speechEs = key?.accepted?.[0] ?? null;
          } else if (e.type === 'listen_choose' || e.type === 'choose_reply' || e.type === 'word_choice') {
            speechEs = prompt.stemEs ?? opts.find(o => o.id === correctId)?.text ?? key?.accepted?.[0] ?? null;
          } else {
            speechEs = prompt.stemEs ?? key?.accepted?.[0] ?? null;
          }
        }
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

  await env.DB.prepare(
    `INSERT INTO user_exercise_attempts
       (id, client_event_id, user_id, lesson_id, lesson_version_id, exercise_id, is_correct, score, answer_json,
        duration_ms, source, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'online', ?)`,
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

  const attempts = await env.DB.prepare(
    `SELECT exercise_id, is_correct FROM user_exercise_attempts
     WHERE user_id = ? AND lesson_version_id = ? AND exercise_id IN (${[...gradedIds].map(() => '?').join(',') || "''"})`,
  )
    .bind(user.id, lesson.version_id, ...gradedIds)
    .all<{ exercise_id: string; is_correct: number }>();

  const solved = new Set(attempts.results.filter(a => a.is_correct === 1).map(a => a.exercise_id));
  const answered = new Set(attempts.results.map(a => a.exercise_id));
  const correctCount = solved.size;
  const gradedTotal = graded.length;
  const accuracy = gradedTotal ? Math.round((correctCount / gradedTotal) * 100) : 0;

  const criteria = safeParse<MasteryCriteria>(lesson.mastery_criteria_json);
  const minAccuracy = criteria.minAccuracy ?? 80;
  const minCorrect = criteria.minCorrectExercises ?? 0;
  const passed = gradedTotal > 0 && accuracy >= minAccuracy && correctCount >= minCorrect && missingRequiredTypes.length === 0;

  // منع الاحتساب المزدوج: XP مرة واحدة لكل درس في حياة الحساب
  const prior = await env.DB.prepare(
    `SELECT status FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?`,
  )
    .bind(user.id, lesson.id)
    .first<{ status: string }>();
  const alreadyCompleted = prior?.status === 'completed';

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
  const cardsCreated = await createCardsForLesson(env, user.id, lesson.id);

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

  // حساب حالة القفل بدقة وفقًا لقواعد الخادم assertUnlocked.
  // assertUnlocked يقبل أي تقدم (in_progress أو completed) إذا بلغت الدقة الحد المطلوب،
  // فلو اشترطنا هنا completed وحده لعرضنا الدرس مقفلًا بينما الخادم يفتحه فعلًا
  // (مثال: إتقان الدرس يشترط 80% وقاعدة الفتح تشترط 60%، والمتعلم عنده 70%).
  const startedSet = new Set<string>();
  const accuracyMap = new Map<string, number>();
  for (const r of sortedLessons) {
    if (r.progress_status !== 'not_started') startedSet.add(r.slug);
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
      const isStarted = startedSet.has(reqSlug);
      const acc = accuracyMap.get(reqSlug) ?? 0;
      return !isStarted || acc < minAcc;
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

  return json(
    {
      stats: stats ?? { xp_total: 0, minutes_total: 0, streak_current: 0, streak_longest: 0, reviews_done: 0, words_seen: 0, words_stable: 0 },
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

const PLACEMENT_CANONICAL_KEYS: Record<string, string> = {
  '1': 'a',
  '2': 'a',
  '3': 'a',
  '4': 'a',
  '5': 'a',
  '6': 'a',
  '7': 'a',
  '8': 'a',
  '9': 'a',
  '10': 'a',
};

/**
 * اختبار تحديد المستوى (Placement Test)
 * الخادم هو المصحح الوحيد: يتحقق من الإجابات الفعلية ولا يعتمد على ما يرسله العميل من درجات
 */
export async function submitPlacementTest(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const body = await readJson<{ targetLevel?: string; answers?: Record<string, string>; score?: number; answersCount?: number }>(req);
  const targetLevel = String(body.targetLevel ?? '').toUpperCase();

  if (!['A1', 'A2'].includes(targetLevel)) {
    throw new HttpError(400, 'INVALID_LEVEL', 'المستوى المحدد لتحديد المستوى غير صالح. اختر A1 أو A2.');
  }

  // التصحيح والحساب على الخادم حصرًا. الإجابات إلزامية: كان هناك مسار تراجع
  // يقبل «score» من العميل مباشرة، فيُمكنه اختراق الاختبار وفتح كل دروس
  // المستوى ورصيد XP دون إجابة واحدة. لم يُبقَ أي ثقة بالدرجة المرسلة من العميل.
  if (!body.answers || typeof body.answers !== 'object' || Array.isArray(body.answers)) {
    throw new HttpError(400, 'ANSWERS_REQUIRED', 'يجب إرسال إجابات الاختبار لتصحيحها على الخادم.');
  }
  const answersCount = Object.keys(body.answers).length;
  let correct = 0;
  for (const [qid, expected] of Object.entries(PLACEMENT_CANONICAL_KEYS)) {
    if (body.answers[qid] === expected) correct++;
  }
  const score = Math.round((correct / 10) * 100);

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
    const lessonsToComplete = await env.DB.prepare(
      `SELECT l.id, l.current_version_id FROM lessons l WHERE l.level_code IN ${levelClause} AND l.status IN ('published','draft')`,
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
