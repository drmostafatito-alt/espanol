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
import { createHash } from 'node:crypto';
import { gradeAnswer, gradingModeOf, type AnswerKey } from '../lib/grading';
import { allowUnreviewedContent, UNREVIEWED_PROVENANCE } from '../lib/content-access';

import { scheduleCard, ratingToQuality, SCHEDULER_VERSION, type CardState } from '../lib/srs';
import { searchEngine } from '../../shared/search-engine';
import { shuffleSecure } from '../lib/random';
import { PLACEMENT_QUESTIONS, PLACEMENT_STRATA, PLACEMENT_PASS_SCORE, PLACEMENT_A2_SCORE, PLACEMENT_MAX_STARTS_PER_HOUR, type PlacementQuestion } from '../lib/placement-bank';
import { rateLimitOrThrow } from '../lib/rate-limit';
import { evaluateAchievements } from '../lib/achievements';

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


/** عتبة الإتقان من mastery_criteria_json للدرس السابق (70% في المنهج الحالي).
 *  لا نفرض قيمة افتراضية تعسفية: إن كانت البيانات تالفة أو ناقصة نعامل العتبة
 *  على أنها غير معلومة (0) وتبقى القاعدة كما كانت. */
function parseMastery(masteryJson: string): { minAccuracy: number | null } {
  try {
    const m = JSON.parse(masteryJson) as { minAccuracy?: unknown };
    if (m && typeof m.minAccuracy === 'number' && Number.isFinite(m.minAccuracy)) {
      return { minAccuracy: m.minAccuracy };
    }
  } catch {
    // بيانات تالفة — لا نفرض عتبة من نسج الخيال
  }
  return { minAccuracy: null };
}

const STABLE_ENC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** يعيد معرّف التمرين في القاعدة كما يشتقه الـ importer (stableId): نفس الخوارزمية ⇒ نفس المعرّف. */
function stableExerciseId(slug: string, exId: string): string {
  const digest = createHash('sha256').update(`${slug}/${exId}`).digest();
  let out = '';
  for (let i = 0; i < 12; i++) {
    const ch = STABLE_ENC[(digest[i] ?? 0) % 32];
    if (ch) out += ch;
  }
  return `ex_${out}`;
}

interface ReviewCardRow {
  user_id: string;
  item_type: string;
  item_id: string;
  ease: number;
  interval_days: number;
  repetitions: number;
  lapses: number;
  due_at: string;
  state: string;
  card_kind: string;
  last_reviewed_at: string | null;
}

/**
 * تأثير الإجابة الخاطئة المؤكدة على بطاقات الكلمات المستهدفة للتمرين.
 *
 * الرابط: `targetVocab` في content_json للدرس (التمثيل الكامل الذي يخزّنه الـ importer).
 * لا نُعدّ البطاقة إلا إن: كانت الإجابة خاطئة مؤكدة (correct === false)، والكلمة
 * محلولة إلى مدخل مفردات، وللمستخدم الحالي بطاقة recognition غير معلّقة.
 * أي فشل يُهمَل: نتيجة التمرين مسجّلة مسبقًا ولا تتأثر، ولا نمنح المتعلم نتيجة غير صحيحة.
 */
async function applyWrongAnswerToTargetCards(
  env: Env,
  user: SessionUser,
  lesson: LessonRow,
  exerciseId: string,
  eventId: string,
  mode: 'new' | 'replay' = 'new',
): Promise<void> {
  try {
    const parsed = JSON.parse(lesson.content_json) as { exercises?: { id?: string; targetVocab?: unknown }[] };
    const target = (parsed.exercises ?? []).find(
      ex => typeof ex.id === 'string' && stableExerciseId(lesson.slug, ex.id) === exerciseId,
    );
    if (!target) return;
    const words = Array.isArray(target.targetVocab)
      ? target.targetVocab.filter((w): w is string => typeof w === 'string')
      : [];
    if (!words.length) return;

    const norms = [...new Set(words.map(w => w.toLowerCase().trim()).filter(Boolean))];
    if (!norms.length) return;
    const placeholders = norms.map(() => '?').join(',');
    const entries = await env.DB.prepare(
      `SELECT id FROM vocabulary_entries WHERE headword_normalized IN (${placeholders})`,
    )
      .bind(...norms)
      .all<{ id: string }>();
    if (!entries.results.length) return;

    const now = new Date();
    for (const entry of entries.results) {
      const card = await env.DB.prepare(
        `SELECT user_id, item_type, item_id, ease, interval_days, repetitions, lapses, due_at, state, card_kind, last_reviewed_at
         FROM review_schedule WHERE user_id = ? AND item_type = 'vocab' AND item_id = ? AND card_kind = 'recognition'`,
      )
        .bind(user.id, entry.id)
        .first<ReviewCardRow>();
      if (!card || card.user_id !== user.id || card.state === 'suspended') continue;

      // مسار الاستئناف: عند إعادة إرسال حدث إجابة خاطئة، يُستكمل التحديث الفاشل جزئياً.
      // لا نُلغي تعديلاً لاحقاً (مثل تقييم في جلسة المراجعة) أحدث من سجل المراجعة.
      if (mode === 'replay') {
        const record = await env.DB.prepare(
          `SELECT next_state, next_due_at, reviewed_at
           FROM srs_reviews WHERE user_id = ? AND client_event_id = ?`,
        )
          .bind(user.id, `${eventId}:${entry.id}`)
          .first<{ next_state: string; next_due_at: string; reviewed_at: string }>();
        const applied = !!record && card.state === record.next_state && card.due_at === record.next_due_at;
        const superseded = !!record && !!card.last_reviewed_at && card.last_reviewed_at >= record.reviewed_at;
        if (applied || superseded) continue;
      }

      const next = scheduleCard(
        {
          state: card.state as CardState,
          ease: card.ease,
          intervalDays: card.interval_days,
          reps: card.repetitions,
          lapses: card.lapses,
        },
        'again',
        now,
      );

      // الذرية: إدخال سجل المراجعة وتحديث البطاقة في سيناريو واحد (batch = transaction
      // في D1 وفي المحرك المحلي). فشل إحدى العبارتين يعيد كليهما — لا سجل بلا تحديث
      // ولا تحديث بلا سجل. القيد الفريد على السجل يمنع تحديث البطاقة مرتين لنفس الحدث.
      await env.DB.batch([
        env.DB.prepare(
          `INSERT INTO srs_reviews
             (id, client_event_id, user_id, item_type, item_id, card_kind, rating,
              prev_state, prev_interval_days, prev_ease, prev_due_at,
              next_state, next_interval_days, next_ease, next_due_at,
              response_ms, scheduler_version, reviewed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_id, client_event_id) DO NOTHING`,
        )
          .bind(
            ulid().toLowerCase(), `${eventId}:${entry.id}`, user.id, 'vocab', entry.id, 'recognition',
            ratingToQuality('again'), card.state, card.interval_days, card.ease, card.due_at,
            next.state, next.intervalDays, next.ease, next.dueAt, null, SCHEDULER_VERSION, now.toISOString(),
          ),
        env.DB.prepare(
          `UPDATE review_schedule
             SET ease = ?, interval_days = ?, repetitions = ?, lapses = ?, due_at = ?, state = ?, last_reviewed_at = ?, last_quality = ?
           WHERE user_id = ? AND item_type = ? AND item_id = ? AND card_kind = ?`,
        )
          .bind(
            next.ease, next.intervalDays, next.reps, next.lapses, next.dueAt, next.state, now.toISOString(),
            ratingToQuality('again'), user.id, 'vocab', entry.id, 'recognition',
          ),
      ]);
    }
  } catch {
    // تحديث SRS فاشل: نتيجة التمرين محفوظة مسبقًا، والبطاقة تبقى كما هي
  }
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
    `SELECT l.slug, l.mastery_criteria_json, COALESCE(p.status, 'not_started') AS status, COALESCE(p.best_accuracy, 0) AS best_accuracy
     FROM lessons l LEFT JOIN user_lesson_progress p ON p.lesson_id = l.id AND p.user_id = ?
     WHERE l.slug IN (${placeholders})`,
  )
    .bind(user.id, ...rule.requires)
    .all<{ slug: string; mastery_criteria_json: string; status: string; best_accuracy: number }>();


  // عتبة الدقة: إن لم يحدّثها unlock_rule_json صراحةً، نستمدها من إتقان الدرس
  // السابق نفسه (mastery.minAccuracy من محتوى الدرس السابق).
  const missing = rows.results.filter(r => {
    const minAccuracy = rule.minAccuracy ?? parseMastery(r.mastery_criteria_json).minAccuracy ?? 0;
    return r.status === 'not_started' || r.best_accuracy < minAccuracy;
  });
  const found = new Set(rows.results.map(r => r.slug));
  const notFound = rule.requires.filter(s => !found.has(s));

  if (missing.length || notFound.length) {
    // العتبة الفعّالة للدروس الناقصة: إن لم يحدّدها unlock_rule_json صراحةً، نستعمل
    // عتبة إتقان الدرس السابق نفسه (mastery.minAccuracy).
    const effectiveMin = missing[0]
      ? (rule.minAccuracy ?? parseMastery(missing[0]!.mastery_criteria_json).minAccuracy ?? 0)
      : 0;
    throw new HttpError(403, 'LESSON_LOCKED', 'هذا الدرس مقفل: أكمل الدرس السابق بدقة كافية أولًا.', {
      requires: rule.requires,
      minAccuracy: effectiveMin,
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
  grammarPoints: { titleAr: string; explanationAr: string }[];
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
    grammarPoints: [],
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
    // شروح القواعد: تُعرض في شاشة المقدمة (الدرس الذي يشرح القاعدة قبل التمارين).
    // تُهمَل العناصر الناقصة ولا تؤثر على بقية الشاشة.
    const gpRaw = (l.pedagogy as { grammarPoints?: unknown } | undefined)?.grammarPoints;
    if (Array.isArray(gpRaw)) {
      for (const gpRawItem of gpRaw) {
        if (!gpRawItem || typeof gpRawItem !== 'object') continue;
        const gp = gpRawItem as { titleAr?: unknown; explanationAr?: unknown };
        if (typeof gp.titleAr !== 'string' || !gp.titleAr.trim()) continue;
        if (typeof gp.explanationAr !== 'string' || !gp.explanationAr.trim()) continue;
        base.grammarPoints.push({ titleAr: gp.titleAr, explanationAr: gp.explanationAr });
      }
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
        brief: buildLessonBrief(lesson.content_json, {
          objectiveAr: lesson.objective_ar,
          estimatedMinutes: lesson.estimated_minutes,
        }),
        ...(lesson.status === 'published' ? {} : { provenance: PROVENANCE }),
      },
      exercises: exercises.results.map(e => {
        const prompt = publicPrompt(e.prompt_json);
        const opts = optsByExercise.get(e.id) ?? [];

        // VER-01: نص النطق يُؤخذ من المحتوى المعلن فقط (speechEs/stemEs) —
        // لا يُشتق أبدًا من مفتاح الإجابة. الاشتقاق القديم كان يرسل الجملة
        // الصحيحة كاملة لتمارين الترتيب (accepted[0]) ونص الخيار الصحيح
        // لتمارين اختيار بلا سياق، أي الإجابة نفسها في حمولة ما قبل الإجابة.
        // ما يبقى: المحفّز السمعي المؤلَّف (جملة الاستماع/الإملاء نفسها) لأنه
        // مادة التمرين لا مفتاحه، ونطقه على الجهاز يتطلب نصه عند العميل.
        let speechEs = prompt.speechEs ?? prompt.stemEs;
        if (speechEs && typeof speechEs === 'string') {
          speechEs = speechEs.replace(/_{2,}/g, '...').trim();
        }
        // AUD-03 + DEFECT-1: ترتيب العرض يُخلط بعشوائية خادمية آمنة لكل جلسة.
        // المحتوى المولَّد يضع الصحيح أولًا في أغلب الأسئلة وعناصر الترتيب
        // بترتيب الجملة نفسه، فلا بد من الخلط — لكن الخلط الحتمي السابق ببذرة
        // (userId+exerciseId) كان قابلًا لإعادة الحساب من بيانات يعرفها العميل.
        // التصحيح بالمعرّف لا بالموضع، فيبقى صحيحًا لأي ترتيب يراه المتعلم
        // دون أي حاجة لتخزين الترتيب المعروض.
        const displayOptions = shuffleSecure(opts);
        const rawItems = itemsByExercise.get(e.id) ?? [];
        const displayItems = (e.type === 'word_order' || e.type === 'dialogue_order')
          ? shuffleSecure(rawItems)
          : rawItems;
        return {
          id: e.id,
          type: e.type,
          mode: gradingModeOf(e.type),
          hasGrader: gradingModeOf(e.type) === 'graded',
          ...prompt,
          speechEs,
          options: displayOptions,
          items: displayItems,
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
    // استكمال محدود لمحاولة SRS فاشلة جزئياً: إن لم يُسجّل سجل المراجعة أو لم يُطبَّق تحديث
    // البطاقة، تُعاد المحاولة هنا (بنفس eventId) — بلا محاولة جديدة ولا نقاط إضافية.
    if (existing.is_correct === 0) {
      await applyWrongAnswerToTargetCards(env, user, lesson, exerciseId, eventId, 'replay');
    }
    const replay = gradeAnswer(ex.type, safeParse<AnswerKey>(ex.answer_key_json), safeParse(existing.answer_json), safeParse(ex.error_feedback_json));
    return json(
      {
        replay: true,
        correct: existing.is_correct === 1,
        score: existing.score,
        mode: replay.mode,
        explanationAr: ex.explanation_ar,
        feedbackAr: replay.chosenFeedbackAr ?? null,
        ...revealAnswer(ex.answer_key_json),
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
          ...revealAnswer(ex.answer_key_json),
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

  // إجابة خاطئة مؤكدة ⇒ تؤثر على بطاقات الكلمات المستهدفة للتمرين فقط.
  // الإجابات الصحيحة وتمارين المشاركة (correct: null) لا تمسّ SRS.
  if (result.correct === false) {
    await applyWrongAnswerToTargetCards(env, user, lesson, exerciseId, eventId);
  }

  return json(
    {
      replay: false,
      correct: result.correct,
      score: result.score,
      mode: result.mode,
      explanationAr: ex.explanation_ar,
      feedbackAr: result.chosenFeedbackAr ?? null,
      ...revealAnswer(ex.answer_key_json),
    },
    {},
    requestId,
  );
}


/**
 * معرّف الخيار الصحيح + نص الإجابة الصحيحة — يُرسلان **بعد** الإجابة فقط.
 *
 * لماذا؟ بلا هذا لا يمكن للواجهة أن تُعلّم الخيار الصحيح بالأخضر والخاطئ بالأحمر
 * كما تفعل تطبيقات التعلّم، فيبقى المتعلم يقرأ شرحًا نصيًا بدل رؤية موضع الخطأ.
 * الأمان: يُستدعى فقط بعد تسجيل المحاولة، ولا يظهر في جلسة الدرس إطلاقًا
 * (tests/answer-leakage.test.ts يمنع أي تسريب من الجلسة).
 */
function revealAnswer(answerKeyJson: string): { correctOptionId: string | null; correctText: string | null } {
  try {
    const key = JSON.parse(answerKeyJson) as { correctOptionIds?: string[]; accepted?: string[]; tokens?: string[] };
    const correctOptionId = Array.isArray(key.correctOptionIds) && key.correctOptionIds.length === 1
      ? key.correctOptionIds[0] ?? null
      : null;
    let correctText: string | null = null;
    if (Array.isArray(key.tokens) && key.tokens.length) correctText = key.tokens.join(' ');
    else if (Array.isArray(key.accepted) && key.accepted.length) correctText = key.accepted[0] ?? null;
    return { correctOptionId, correctText };
  } catch {
    return { correctOptionId: null, correctText: null };
  }
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
    // AUD-06: إدخالات مجزّأة بـbatch (استدعاء D1 واحد لكل 50) بدل استعلام لكل بطاقة
    let created = 0;
    const stmts = rows.results.map(r =>
      env.DB.prepare(
        `INSERT INTO review_schedule
           (user_id, item_type, item_id, ease, interval_days, repetitions, lapses, due_at,
            card_kind, state, scheduler_version, created_at, origin_ref)
         VALUES (?, 'vocab', ?, 2.5, 0, 0, 0, ?, 'recognition', 'new', 1, ?, ?)
         ON CONFLICT(user_id, item_type, item_id) DO NOTHING`,
      ).bind(userId, r.entry_id, now, now, `lesson:${lessonId}`),
    );
    for (let i = 0; i < stmts.length; i += 50) {
      const results = await env.DB.batch(stmts.slice(i, i + 50));
      created += results.reduce((acc, r) => acc + (Number(r.meta?.changes ?? 0) > 0 ? 1 : 0), 0);
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


/**
 * سلسلة أيام التعلم من قائمة أيام نشاط (YYYY-MM-DD بالتوقيت العالمي).
 * دالة نقية قابلة للاختبار: السلسلة الحالية تُحتسب من اليوم أو أمس (يوم
 * لم ينتهِ بعد لا يكسر السلسلة)، والأطول من كل التاريخ.
 * ملاحظة موثّقة (لا تغيير سلوك): حدود «اليوم» بالتوقيت العالمي UTC؛ لمتعلم
 * في القاهرة (UTC+2) نشاط الساعة 1:00 صباحًا يُنسب لليوم السابق UTC.
 * التحول لأيام المنطقة الزمنية للمستخدم تغيير منتج منفصل يحتاج قرار مالك
 * (يؤثر في تعريف السلسلة القائمة) — خارج نطاق جولة الإصلاح الحالية.
 */
export function computeStreaks(activityDays: string[], todayUtc: string): { current: number; longest: number } {
  const days = [...new Set(activityDays)].sort();
  if (!days.length) return { current: 0, longest: 0 };
  const dayMs = 86_400_000;
  const toTs = (d: string) => Date.parse(`${d}T00:00:00Z`);
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    if (toTs(days[i]!) - toTs(days[i - 1]!) === dayMs) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }
  // السلسلة الحالية: من آخر يوم نشاط تراجعًا — بشرط قربه (اليوم/أمس)
  const last = days[days.length - 1]!;
  const gapFromToday = toTs(todayUtc) - toTs(last);
  let current = 0;
  if (gapFromToday === 0 || gapFromToday === dayMs) {
    current = 1;
    for (let i = days.length - 1; i > 0; i--) {
      if (toTs(days[i]!) - toTs(days[i - 1]!) === dayMs) current++;
      else break;
    }
  }
  return { current, longest };
}

/** مؤشرات مشتقة من نشاط حقيقي (AUD-11) — أعمدة user_stats لهذه القيم لم يكن يحدّثها أي كود */
async function derivedStats(env: Env, userId: string): Promise<{ streak_current: number; streak_longest: number; minutes_total: number; words_stable: number }> {
  const days = await env.DB.prepare(
    `SELECT DISTINCT d FROM (
       SELECT substr(created_at, 1, 10) AS d FROM user_exercise_attempts WHERE user_id = ?
       UNION SELECT substr(reviewed_at, 1, 10) AS d FROM srs_reviews WHERE user_id = ?
       UNION SELECT substr(occurred_at, 1, 10) AS d FROM learning_events WHERE user_id = ?
       UNION SELECT substr(created_at, 1, 10) AS d FROM xp_ledger WHERE user_id = ?
       UNION SELECT substr(last_reviewed_at, 1, 10) AS d FROM review_schedule WHERE user_id = ? AND last_reviewed_at IS NOT NULL
     ) WHERE d IS NOT NULL`,
  )
    .bind(userId, userId, userId, userId, userId)
    .all<{ d: string }>();
  const todayUtc = new Date().toISOString().slice(0, 10);
  const streaks = computeStreaks(days.results.map(r => r.d), todayUtc);

  const minutes = await env.DB.prepare(
    `SELECT COALESCE(SUM(COALESCE(duration_ms, 0)), 0) AS ms FROM user_exercise_attempts WHERE user_id = ?`,
  )
    .bind(userId)
    .first<{ ms: number }>();

  const stable = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM review_schedule
     WHERE user_id = ? AND item_type = 'vocab' AND state = 'review' AND interval_days >= 21`,
  )
    .bind(userId)
    .first<{ n: number }>();

  return {
    streak_current: streaks.current,
    streak_longest: streaks.longest,
    minutes_total: Math.round(Number(minutes?.ms ?? 0) / 60_000),
    words_stable: Number(stable?.n ?? 0),
  };
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
    `SELECT l.id, l.slug, l.title_ar, l.level_code, l.status, l.unlock_rule_json, l.mastery_criteria_json,
            l.estimated_minutes, l.sort_order AS sort_order,
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
      mastery_criteria_json: string;
      estimated_minutes: number | null;
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
  const thresholdMap = new Map<string, number>();
  for (const r of sortedLessons) {
    if (r.progress_status !== 'not_started') startedSet.add(r.slug);
    accuracyMap.set(r.slug, r.best_accuracy);
    // عتبة الإتقان من محتوى كل درس (mastery.minAccuracy) — نفس المصدر الذي
    // يستخدمه assertUnlocked، فلا يظهر الدرس مفتوحًا في القائمة وتُرفض فتحه في الخادم
    const m = parseMastery(r.mastery_criteria_json);
    if (m.minAccuracy !== null) thresholdMap.set(r.slug, m.minAccuracy);
  }

  const lessons = sortedLessons.map(l => {
    let rule: { requires?: string[]; minAccuracy?: number } = {};
    try {
      rule = JSON.parse(l.unlock_rule_json || '{}');
    } catch {}

    const requires = Array.isArray(rule.requires) ? rule.requires : [];
    const missing = requires.filter(reqSlug => {
      const isStarted = startedSet.has(reqSlug);
      const acc = accuracyMap.get(reqSlug) ?? 0;
      const minAcc = rule.minAccuracy ?? thresholdMap.get(reqSlug) ?? 0;
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
      estimated_minutes: l.estimated_minutes,
    };
  });

  // تحديد «خطوتك التالية»: أول درس متاح وغير مكتمل في المسار التعليمي
  const nextLesson = lessons.find(l => l.program_slug === 'main-track' && l.progress_status !== 'completed' && l.is_unlocked)
    ?? lessons.find(l => l.progress_status !== 'completed' && l.is_unlocked)
    ?? null;

  // AUD-11: السلسلة/الدقائق/المستقرة تُشتق من نشاط حقيقي لا من أعمدة لم تُحدَّث قط
  const derived = await derivedStats(env, user.id);
  // استمرارية الخادم: تُحفَظ السلسلة المحسوبة في user_stats (اختبار streak)
  // حتى لا تعتمد القراءات اللاحقة على إعادة الاشتقاق وحدها
  await env.DB.prepare(
    `UPDATE user_stats SET streak_current = ?, streak_longest = ? WHERE user_id = ?`,
  ).bind(derived.streak_current, derived.streak_longest, user.id).run();
  const statsMerged = {
    xp_total: Number(stats?.xp_total ?? 0),
    reviews_done: Number(stats?.reviews_done ?? 0),
    words_seen: Number(stats?.words_seen ?? 0),
    ...derived,
  };

  const totals = await env.DB.prepare(
    `SELECT (SELECT COUNT(*) FROM lessons WHERE status IN ${activeStatuses}) AS lessons_total,
            (SELECT COUNT(*) FROM user_lesson_progress p JOIN lessons l ON l.id = p.lesson_id
              WHERE p.user_id = ? AND p.status = 'completed' AND l.status IN ${activeStatuses}) AS lessons_completed`,
  )
    .bind(user.id)
    .first<{ lessons_total: number; lessons_completed: number }>();

  // ---------------- نشاط اليوم والأسبوع (بيانات حقيقية فقط) ----------------
  // كل الأرقام مشتقة من جداول النشاط: دفتر XP، محاولات التمارين، إكمال الدروس،
  // وجدول المراجعة. لا عدّادات مصطنعة ولا «أرقام تحفيزية» غير محسوبة.
  const period = activityPeriod(new Date(), 7);
  const activity = await dailyActivity(env, user.id, period);
  const reviewDue = await dueReviewCount(env, user.id);

  // ---------------- ملخص المستويات ----------------
  const levelMap = new Map<string, { code: string; total: number; completed: number }>();
  for (const l of lessons) {
    const code = (l.level_code ?? 'غير محدد').toUpperCase().replace('PRE-A1', 'PREA1');
    const entry = levelMap.get(code) ?? { code, total: 0, completed: 0 };
    entry.total += 1;
    if (l.progress_status === 'completed') entry.completed += 1;
    levelMap.set(code, entry);
  }
  const levels = [...levelMap.values()].sort((a, b) => levelRank(a.code) - levelRank(b.code));

  // ---------------- الإنجازات ----------------
  const lessonsByLevel: Record<string, number> = {};
  let bestAccuracy = 0;
  for (const l of lessons) {
    const code = (l.level_code ?? '').toUpperCase().replace('PRE-A1', 'PREA1');
    if (l.progress_status === 'completed' && code) {
      lessonsByLevel[code] = (lessonsByLevel[code] ?? 0) + 1;
    }
    if (l.best_accuracy > bestAccuracy) bestAccuracy = l.best_accuracy;
  }
  const achievements = evaluateAchievements({
    lessonsCompleted: Number(totals?.lessons_completed ?? 0),
    lessonsByLevel,
    xpTotal: Number(statsMerged.xp_total ?? 0),
    streakLongest: Number(statsMerged.streak_longest ?? 0),
    wordsSeen: Number(statsMerged.words_seen ?? 0),
    wordsStable: Number(statsMerged.words_stable ?? 0),
    reviewsDone: Number(statsMerged.reviews_done ?? 0),
    bestAccuracy,
  });

  return json(
    {
      stats: statsMerged,
      lessons,
      nextLesson: nextLesson ? {
        slug: nextLesson.slug,
        title_ar: nextLesson.title_ar,
        level_code: nextLesson.level_code,
        unit_title_ar: nextLesson.unit_title_ar,
        program_title_ar: nextLesson.program_title_ar,
        unit_id: nextLesson.unit_id,
        estimated_minutes: nextLesson.estimated_minutes,
      } : null,
      totals: totals ?? { lessons_total: 0, lessons_completed: 0 },
      today: activity.today,
      week: activity.week,
      goalMinutes: user.dailyGoalMinutes,
      review: { dueNow: reviewDue.due, total: reviewDue.total },
      levels,
      achievements,
      contentProvenance: allowUnreviewed(env) ? PROVENANCE : null,
    },
    {},
    requestId,
  );
}

/** ترتيب المستويات للعرض: PREA1 → A1 → … → C1 ثم ما لا يُعرف في النهاية */
function levelRank(code: string): number {
  const order = ['PREA1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const i = order.indexOf(code.toUpperCase());
  return i === -1 ? 99 : i;
}

export interface DayActivity {
  date: string;
  xp: number;
  minutes: number;
  lessons: number;
  reviews: number;
}

/** آخر `days` يومًا بالتوقيت العالمي (نفس تعريف سلسلة الأيام الموثّق في computeStreaks) */
export function activityPeriod(now: Date, days: number): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    out.push(new Date(now.getTime() - i * 86_400_000).toISOString().slice(0, 10));
  }
  return out;
}

/**
 * يجمع نشاط المستخدم اليومي من أربعة مصادر مستقلة ثم يوحّدها في صفوف يومية.
 * الغرض: صفحة «اليوم» تحتاج هدفًا يوميًا حقيقيًا وسجل أسبوعي، وكان ذلك
 * يتطلب ثلاثة طلبات من العميل (تقدّم + مراجعة + مسارات). هنا طلب واحد.
 */
export async function dailyActivity(
  env: Env,
  userId: string,
  days: string[],
): Promise<{ today: DayActivity; week: DayActivity[] }> {
  const since = days[0] ?? new Date().toISOString().slice(0, 10);
  const empty = (date: string): DayActivity => ({ date, xp: 0, minutes: 0, lessons: 0, reviews: 0 });
  const byDate = new Map<string, DayActivity>(days.map(d => [d, empty(d)]));

  const [xpRows, minuteRows, lessonRows, reviewRows] = await Promise.all([
    env.DB.prepare(
      `SELECT substr(created_at, 1, 10) AS d, COALESCE(SUM(amount), 0) AS n
       FROM xp_ledger WHERE user_id = ? AND substr(created_at, 1, 10) >= ? GROUP BY d`,
    ).bind(userId, since).all<{ d: string; n: number }>(),
    env.DB.prepare(
      `SELECT substr(server_recorded_at, 1, 10) AS d, COALESCE(SUM(COALESCE(duration_ms, 0)), 0) AS ms
       FROM user_exercise_attempts WHERE user_id = ? AND substr(server_recorded_at, 1, 10) >= ? GROUP BY d`,
    ).bind(userId, since).all<{ d: string; ms: number }>(),
    env.DB.prepare(
      `SELECT substr(completed_at, 1, 10) AS d, COUNT(*) AS n
       FROM user_lesson_progress
       WHERE user_id = ? AND status = 'completed' AND completed_at IS NOT NULL AND substr(completed_at, 1, 10) >= ?
       GROUP BY d`,
    ).bind(userId, since).all<{ d: string; n: number }>(),
    env.DB.prepare(
      `SELECT substr(last_reviewed_at, 1, 10) AS d, COUNT(*) AS n
       FROM review_schedule
       WHERE user_id = ? AND last_reviewed_at IS NOT NULL AND substr(last_reviewed_at, 1, 10) >= ?
       GROUP BY d`,
    ).bind(userId, since).all<{ d: string; n: number }>(),
  ]);

  for (const row of xpRows.results) {
    const day = byDate.get(row.d);
    if (day) day.xp = Number(row.n ?? 0);
  }
  for (const row of minuteRows.results) {
    const day = byDate.get(row.d);
    if (day) day.minutes = Math.round(Number(row.ms ?? 0) / 60_000);
  }
  for (const row of lessonRows.results) {
    const day = byDate.get(row.d);
    if (day) day.lessons = Number(row.n ?? 0);
  }
  for (const row of reviewRows.results) {
    const day = byDate.get(row.d);
    if (day) day.reviews = Number(row.n ?? 0);
  }

  const week = days.map(d => byDate.get(d) ?? empty(d));
  const today = week[week.length - 1] ?? empty(new Date().toISOString().slice(0, 10));
  return { today, week };
}

/** بطاقات مستحقة الآن (نفس تعريف جلسة المراجعة: غير موقوفة، ومفردتها موجودة) */
export async function dueReviewCount(env: Env, userId: string, nowIso = new Date().toISOString()): Promise<{ due: number; total: number }> {
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN rs.due_at <= ? AND rs.state != 'suspended' AND e.id IS NOT NULL THEN 1 ELSE 0 END) AS due
     FROM review_schedule rs
     LEFT JOIN vocabulary_entries e ON e.id = rs.item_id AND rs.item_type = 'vocab'
     WHERE rs.user_id = ?`,
  )
    .bind(nowIso, userId)
    .first<{ total: number; due: number | null }>();
  return { due: Number(row?.due ?? 0), total: Number(row?.total ?? 0) };
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


/**
 * اختبار تحديد المستوى — محاولات خادمية (إصلاح AUD-05)
 * ----------------------------------------------------------------------------
 * العقد الجديد:
 * 1) `POST /api/me/placement/start` ينشئ محاولة: ترتيب خيارات مخلوط لهذه
 *    المحاولة وحدها، ويُخزَّن التخطيط (qid ⇒ مفتاح الصحيح بعد الخلط) في
 *    `assessment_results.details_json` بحالة phase=started. العميل يستلم
 *    أسئلة بمعرّفات خيارات موضعية مبهمة (o0..o3) بلا أي علامة صحة.
 * 2) `POST /api/me/placement` يقبل {attemptId, answers} فقط، ويصحّح من
 *    التخطيط المخزَّن. المحاولة لمرة واحدة (phase=submitted) وبمهلة ساعة.
 *    أي `score`/`targetLevel` من العميل يُهمَل: الدرجة والمستوى من الخادم.
 * بذلك لا نمط ثابت (موضع/معرّف) يمكن أن يجتاز أعمى فوق الصدفة.
 */
const PLACEMENT_ATTEMPT_TTL_MS = 60 * 60_000;

interface PlacementAttemptDetails {
  phase: 'started' | 'submitted';
  /** qid ⇒ معرّف الخيار الصحيح كما عُرض في هذه المحاولة (o0..o3) */
  keyByQuestion: Record<string, string>;
  /** معرّفات أسئلة هذه المحاولة فقط (عيّنة من البنك — VER-02) */
  questionIds: string[];
  startedAt: string;
  submittedAt?: string;
  score?: number;
}

/** عيّنة طبقية عشوائية آمنة من البنك لهذه المحاولة (VER-02 + DEFECT-1):
 * لا بذرة ولا اعتماد على معرّف المحاولة أو أي قيمة يعرفها العميل. */
export function samplePlacementQuestions(): PlacementQuestion[] {
  const picked: PlacementQuestion[] = [];
  for (const { level, take } of PLACEMENT_STRATA) {
    const pool = PLACEMENT_QUESTIONS.filter(q => q.level === level);
    picked.push(...shuffleSecure(pool).slice(0, take));
  }
  return shuffleSecure(picked);
}

export async function startPlacementTest(_req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  // VER-02: سقف بدء المحاولات بالساعة — إعادة مشروعة مرحّب بها، واستخراج
  // بنك الإجابات بالتجريب المكثّف مكلف. المحاولات المسروقة البيانات لا
  // تنتقل بين المحاولات أصلًا (عيّنة مختلفة + تغذية بلا مفاتيح).
  const hourAgo = new Date(Date.now() - 60 * 60_000).toISOString();
  const recent = await env.DB.prepare(
    `SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM assessment_results
     WHERE user_id = ? AND kind = 'placement' AND created_at >= ?`,
  )
    .bind(user.id, hourAgo)
    .first<{ n: number; oldest: string | null }>();
  if (Number(recent?.n ?? 0) >= PLACEMENT_MAX_STARTS_PER_HOUR) {
    const retryAfterSeconds = recent?.oldest
      ? Math.max(1, Math.ceil((new Date(recent.oldest).getTime() + 60 * 60_000 - Date.now()) / 1000))
      : 3600;
    throw new HttpError(429, 'PLACEMENT_RATE_LIMITED', 'محاولات كثيرة في وقت قصير. خذ استراحة قصيرة ثم أعد المحاولة.', { retryAfterSeconds });
  }

  const attemptId = ulid().toLowerCase();
  const now = new Date().toISOString();
  const keyByQuestion: Record<string, string> = {};
  const sampled = samplePlacementQuestions();

  // DEFECT-1: ترتيب خيارات كل سؤال بعشوائية خادمية آمنة؛ التخطيط المعروض
  // يُحفظ في سجل المحاولة (keyByQuestion) والتصحيح منه حصرًا، فالترتيب
  // الذي يراه المتعلم هو نفسه المرجع عند التصحيح مهما كانت العشوائية.
  const questions = sampled.map(q => {
    const ordered = shuffleSecure(q.options);
    const presented = ordered.map((opt, idx) => {
      const presentedId = `o${idx}`;
      if (opt.key === q.correctKey) keyByQuestion[q.id] = presentedId;
      return { id: presentedId, text: opt.text };
    });
    return {
      id: q.id,
      level: q.level,
      promptAr: q.promptAr,
      ...(q.stemEs ? { stemEs: q.stemEs } : {}),
      options: presented,
    };
  });

  const details: PlacementAttemptDetails = { phase: 'started', keyByQuestion, questionIds: sampled.map(q => q.id), startedAt: now };
  await env.DB.prepare(
    `INSERT INTO assessment_results (id, user_id, kind, score, passed, details_json, created_at)
     VALUES (?, ?, 'placement', 0, 0, ?, ?)`,
  )
    .bind(attemptId, user.id, JSON.stringify(details), now)
    .run();

  return json({ attemptId, questions, total: questions.length }, {}, requestId);
}

/** تصحيح تحديد المستوى — الخادم هو المصحح الوحيد من تخطيط المحاولة المخزَّن */
export async function submitPlacementTest(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const body = await readJson<{ attemptId?: string; answers?: Record<string, string> }>(req);
  const attemptId = typeof body.attemptId === 'string' ? body.attemptId : '';
  if (!attemptId) {
    throw new HttpError(400, 'ATTEMPT_REQUIRED', 'ابدأ الاختبار أولًا من صفحة تحديد المستوى.');
  }
  if (!body.answers || typeof body.answers !== 'object' || Array.isArray(body.answers)) {
    throw new HttpError(400, 'ANSWERS_REQUIRED', 'يجب إرسال إجابات الاختبار لتصحيحها على الخادم.');
  }

  const row = await env.DB.prepare(
    `SELECT id, details_json, created_at FROM assessment_results
     WHERE id = ? AND user_id = ? AND kind = 'placement'`,
  )
    .bind(attemptId, user.id)
    .first<{ id: string; details_json: string; created_at: string }>();
  if (!row) throw new HttpError(404, 'ATTEMPT_NOT_FOUND', 'محاولة الاختبار غير موجودة.');

  const details = safeParse<PlacementAttemptDetails>(row.details_json);
  if (details.phase !== 'started' || !details.keyByQuestion) {
    throw new HttpError(409, 'ATTEMPT_USED', 'هذه المحاولة سُلِّمت من قبل. ابدأ اختبارًا جديدًا.');
  }
  if (Date.now() - new Date(details.startedAt).getTime() > PLACEMENT_ATTEMPT_TTL_MS) {
    throw new HttpError(409, 'ATTEMPT_EXPIRED', 'انتهت صلاحية هذه المحاولة. ابدأ اختبارًا جديدًا.');
  }

  const sampled = PLACEMENT_QUESTIONS.filter(q => (details.questionIds ?? []).includes(q.id));
  if (!sampled.length) throw new HttpError(409, 'ATTEMPT_INVALID', 'محاولة غير صالحة. ابدأ اختبارًا جديدًا.');
  let correct = 0;
  for (const q of sampled) {
    if (body.answers![q.id] === details.keyByQuestion[q.id]) correct++;
  }
  // VER-02: التغذية الراجعة شروح قواعد لأسئلة المحاولة كلها (أُصيبت أو أُخطئت)
  // بلا نص الإجابة الصحيحة وبلا علم صحة لكل سؤال — فلا شيء في هذه الاستجابة
  // يمكن حصاده لبناء مفتاح إجابات لمحاولة لاحقة، والعيّنة التالية مختلفة أصلًا.
  const feedback = sampled.map(q => ({ id: q.id, explanationAr: q.explanationAr }));
  const score = Math.round((correct / sampled.length) * 100);
  const passed = score >= PLACEMENT_PASS_SCORE;
  // المستوى يُشتق من الدرجة على الخادم (كان العميل يختاره من درجته المحلية)
  const targetLevel = score >= PLACEMENT_A2_SCORE ? 'A2' : 'A1';
  const now = new Date().toISOString();

  // إغلاق المحاولة أولًا وبشرط حالتها الحالية (VER-10): تسليمان متزامنان
  // لنفس المحاولة — واحد فقط يغلقها ويكمل، والآخر يُرفض بـ409 بدل سباق كتابة.
  const closed = await env.DB.prepare(
    `UPDATE assessment_results SET score = ?, passed = ?, details_json = ?
     WHERE id = ? AND user_id = ? AND COALESCE(json_extract(details_json, '$.phase'), 'started') = 'started'`,
  )
    .bind(
      score,
      passed ? 1 : 0,
      JSON.stringify({ ...details, phase: 'submitted', submittedAt: now, score, targetLevel }),
      attemptId,
      user.id,
    )
    .run();
  if (Number(closed.meta?.changes ?? 0) !== 1) {
    throw new HttpError(409, 'ATTEMPT_USED', 'هذه المحاولة سُلِّمت من قبل. ابدأ اختبارًا جديدًا.');
  }

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

    // AUD-06: batch مجزّأ بدل استعلام لكل درس (حد D1 على الخطة المجانية)
    const stmts = lessonsToComplete.results.map(l =>
      env.DB.prepare(
        `INSERT INTO user_lesson_progress (user_id, lesson_id, lesson_version_id, status, best_accuracy, attempts_count, completed_at, last_activity_at)
         VALUES (?, ?, ?, 'completed', 100, 1, ?, ?)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET
           status = 'completed',
           best_accuracy = MAX(user_lesson_progress.best_accuracy, 100),
           completed_at = COALESCE(user_lesson_progress.completed_at, excluded.completed_at),
           last_activity_at = excluded.last_activity_at`,
      ).bind(user.id, l.id, l.current_version_id, now, now),
    );
    for (let i = 0; i < stmts.length; i += 50) {
      const results = await env.DB.batch(stmts.slice(i, i + 50));
      unlockedLessonsCount += results.reduce((acc, r) => acc + Number(r.meta?.changes ?? 0), 0);
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
      feedback,
      messageAr: passed
        ? `أحسنت! حققت نسبة ${score}% وتم فتح مستوى ${targetLevel} لك مباشرة مع ${xpAwarded} XP مكافأة.`
        : `نتيجتك ${score}% — نوصي بالبدء من أول دروس المسار الأساسي لتثبيت الأساسيات خطوة بخطوة.`,
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
