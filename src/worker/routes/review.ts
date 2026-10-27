/* ============================================================================
   مسارات المراجعة المتباعدة (SRS)
   ----------------------------------------------------------------------------
   قواعد غير قابلة للتفاوض:
   * الخادم وحده يحسب الموعد القادم. أي `interval`/`dueAt`/`ease` يرسله العميل
     يُهمَل تمامًا — العميل يرسل تقييمه فقط.
   * كل مراجعة تحمل `clientEventId`، ويُخزَّن في قيد فريد ⇒ إعادة الإرسال
     (شبكة ضعيفة/إعادة محاولة/مزامنة) تُعيد النتيجة المخزَّنة بلا مراجعة ثانية.
   * الحدود اليومية تُطبَّق هنا لا في الواجهة.
   * لا نُنشئ بطاقات «استماع» قبل وجود ملفات صوتية معتمدة — البطاقة التي لا
     يمكن أداؤها ليست تدريبًا.
   ========================================================================== */
import type { Env, SessionUser } from '../types';
import { HttpError, json, readJson } from '../lib/http';
import { rateLimitOrThrow } from '../lib/rate-limit';
import { ulid } from '../lib/ids';
import {
  isCardKind, isRating, resolveLimits, scheduleCard, utcDayStart,
  DEFAULT_LIMITS, SCHEDULER_VERSION, ratingToQuality,
  type CardKind, type CardState, type Rating,
} from '../lib/srs';

const EVENT_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const RATING_CODE: Record<Rating, number> = { again: 1, hard: 2, good: 3, easy: 4 };
const MAX_SESSION_CARDS = 50;

interface CardRow {
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
}

interface EntryRow {
  id: string;
  headword_es: string;
  pos: string | null;
  level_code: string | null;
  ipa: string | null;
  pronunciation_hint_ar: string | null;
  meaning_ar_fusha: string | null;
  meaning_ar_eg: string | null;
  usage_note_ar: string | null;
  common_error_ar: string | null;
}

async function limitsFor(env: Env, userId: string) {
  const row = await env.DB.prepare(`SELECT value_json FROM user_settings WHERE user_id = ? AND key = 'srs.limits'`)
    .bind(userId)
    .first<{ value_json: string }>();
  let raw: unknown = null;
  try {
    raw = row?.value_json ? JSON.parse(row.value_json) : null;
  } catch {
    raw = null;
  }
  return resolveLimits(raw ?? DEFAULT_LIMITS);
}

async function todayCounts(env: Env, userId: string, dayStart: string) {
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN prev_state IN ('new','learning') OR prev_state IS NULL THEN 1 ELSE 0 END) AS new_count,
            SUM(CASE WHEN prev_state NOT IN ('new','learning') AND prev_state IS NOT NULL THEN 1 ELSE 0 END) AS review_count
     FROM srs_reviews WHERE user_id = ? AND reviewed_at >= ?`,
  )
    .bind(userId, dayStart)
    .first<{ total: number; new_count: number | null; review_count: number | null }>();
  return {
    total: Number(row?.total ?? 0),
    newCount: Number(row?.new_count ?? 0),
    reviewCount: Number(row?.review_count ?? 0),
  };
}

/** يبني بيانات العرض لكل بطاقة — بلا كشف الإجابة قبل طلبها */
function publicCard(card: CardRow, entry: EntryRow, kind: CardKind, explanationStyle?: string) {
  const base = {
    id: `${card.item_type}:${card.item_id}:${card.card_kind}`,
    kind,
    state: card.state,
    dueAt: card.due_at,
    level: entry.level_code,
  };
  if (kind === 'production') {
    // الإنتاج: يُعرض المعنى العربي ويُطلب استرجاع الكلمة الإسبانية
    return {
      ...base,
      promptAr: entry.meaning_ar_fusha ?? '',
      promptHintAr: entry.pos ? `نوع الكلمة: ${entry.pos}` : null,
      revealEs: entry.headword_es,
      exampleEs: null,
      exampleAr: null,
    };
  }
  // التعرف: تُعرض الكلمة الإسبانية ويُطلب استرجاع المعنى
  return {
    ...base,
    headwordEs: entry.headword_es,
    ipa: entry.ipa,
    pronunciationHintAr: entry.pronunciation_hint_ar,
    revealAr: entry.meaning_ar_fusha ?? '',
    revealArEg: explanationStyle === 'fusha' ? null : (entry.meaning_ar_eg ?? null),
    usageNoteAr: entry.usage_note_ar ?? null,
    commonErrorAr: entry.common_error_ar ?? null,
    exampleEs: null,
    exampleAr: null,
  };
}

/** GET /api/review/session — ما هو مستحق الآن، مع احترام الحدود اليومية */
export async function reviewSession(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const url = new URL(req.url);
  const requested = Number(url.searchParams.get('limit'));
  const limit = Number.isFinite(requested) && requested > 0 ? Math.min(MAX_SESSION_CARDS, Math.floor(requested)) : MAX_SESSION_CARDS;

  const now = new Date();
  const nowIso = now.toISOString();
  const dayStart = utcDayStart(now);
  const limits = await limitsFor(env, user.id);
  const counts = await todayCounts(env, user.id, dayStart);

  const due = await env.DB.prepare(
    `SELECT user_id, item_type, item_id, ease, interval_days, repetitions, lapses, due_at, state, card_kind
     FROM review_schedule
     WHERE user_id = ? AND state != 'suspended' AND due_at <= ?
     ORDER BY due_at ASC LIMIT 500`,
  )
    .bind(user.id, nowIso)
    .all<CardRow>();

  const newRemaining = Math.max(0, limits.newPerDay - counts.newCount);
  const reviewRemaining = Math.max(0, limits.reviewsPerDay - counts.reviewCount);

  const picked: CardRow[] = [];
  let newUsed = 0;
  let reviewUsed = 0;
  for (const card of due.results) {
    const isNew = card.state === 'new' || card.state === 'learning';
    if (isNew) {
      if (newUsed >= newRemaining) continue;
      newUsed++;
    } else {
      if (reviewUsed >= reviewRemaining) continue;
      reviewUsed++;
    }
    picked.push(card);
    if (picked.length >= limit) break;
  }

  const entries = new Map<string, EntryRow>();
  if (picked.length) {
    const ids = [...new Set(picked.map(c => c.item_id))];
    const placeholders = ids.map(() => '?').join(',');
    const rows = await env.DB.prepare(
      `SELECT e.id, e.headword_es, e.pos, e.level_code, e.ipa, e.pronunciation_hint_ar,
              s.meaning_ar_fusha, s.meaning_ar_eg, s.usage_note_ar, s.common_error_ar
       FROM vocabulary_entries e
       LEFT JOIN vocabulary_senses s ON s.entry_id = e.id AND s.sense_no = 1
       WHERE e.id IN (${placeholders})`,
    )
      .bind(...ids)
      .all<EntryRow>();
    for (const r of rows.results) entries.set(r.id, r);
  }

  const cards = picked
    .filter(c => entries.has(c.item_id))
    .map(c => publicCard(c, entries.get(c.item_id)!, c.card_kind as CardKind, user.explanationStyle));

  // due_now يُحسب بعد ربط المداخل فقط: صف جدول بلا مدخل معجمي (يتيم)
  // لا يُعرض أبدًا، فعدّه مستحقًا كان يكذب على سبب الفراغ («وصلت حدّك» بلا بطاقات).
  const totals = await env.DB.prepare(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN rs.due_at <= ? AND rs.state != 'suspended' AND e.id IS NOT NULL THEN 1 ELSE 0 END) AS due_now,
            SUM(CASE WHEN rs.due_at <= ? AND rs.state != 'suspended' AND e.id IS NULL THEN 1 ELSE 0 END) AS due_orphaned,
            SUM(CASE WHEN rs.state = 'suspended' THEN 1 ELSE 0 END) AS suspended
     FROM review_schedule rs LEFT JOIN vocabulary_entries e ON e.id = rs.item_id
     WHERE rs.user_id = ?`,
  )
    .bind(nowIso, nowIso, user.id)
    .first<{ total: number; due_now: number | null; due_orphaned: number | null; suspended: number | null }>();

  return json(
    {
      cards,
      session: {
        dueNow: Number(totals?.due_now ?? 0),
        totalCards: Number(totals?.total ?? 0),
        suspended: Number(totals?.suspended ?? 0),
        reviewedToday: counts.total,
        limits,
        newRemaining: Math.max(0, limits.newPerDay - counts.newCount),
        reviewsRemaining: Math.max(0, limits.reviewsPerDay - counts.reviewCount),
        dayBoundary: 'UTC',
      },
      emptyReason: cards.length === 0
        ? (Number(totals?.due_now ?? 0) > 0
            ? 'DAILY_LIMIT_REACHED'
            : Number(totals?.due_orphaned ?? 0) > 0 ? 'NO_VALID_CARDS' : 'NOTHING_DUE')
        : null,
    },
    { headers: { 'Cache-Control': 'no-store' } },
    requestId,
  );
}

/** POST /api/review/answers — تقييم واحد، والخادم يحسب الجدولة */
export async function submitReview(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  await rateLimitOrThrow(env.DB, `review:user:${user.id}`, 120, 60);
  const body = await readJson<{ clientEventId?: string; cardId?: string; rating?: string; responseMs?: number }>(req);
  const eventId = typeof body.clientEventId === 'string' ? body.clientEventId : '';
  if (!EVENT_ID_RE.test(eventId)) throw new HttpError(400, 'INVALID_EVENT_ID', 'معرّف الحدث غير صالح.');
  if (!isRating(body.rating)) throw new HttpError(400, 'INVALID_RATING', 'التقييم يجب أن يكون again أو hard أو good أو easy.');

  const cardId = typeof body.cardId === 'string' ? body.cardId : '';
  const [itemType, itemId, kindRaw] = cardId.split(':');
  if (!itemType || !itemId) throw new HttpError(400, 'INVALID_CARD_ID', 'معرّف البطاقة غير صالح.');
  const kind: CardKind = isCardKind(kindRaw) ? kindRaw : 'recognition';

  // إعادة إرسال نفس الحدث ⇒ النتيجة المخزَّنة، بلا تعديل الجدولة
  const existing = await env.DB.prepare(
    `SELECT next_state, next_interval_days, next_ease, next_due_at, rating, reviewed_at
     FROM srs_reviews WHERE user_id = ? AND client_event_id = ?`,
  )
    .bind(user.id, eventId)
    .first<{ next_state: string; next_interval_days: number; next_ease: number; next_due_at: string; rating: number; reviewed_at: string }>();

  if (existing) {
    return json(
      {
        replay: true,
        cardId,
        rating: body.rating,
        next: {
          state: existing.next_state,
          intervalDays: existing.next_interval_days,
          ease: existing.next_ease,
          dueAt: existing.next_due_at,
        },
        reviewedAt: existing.reviewed_at,
      },
      {},
      requestId,
    );
  }

  const card = await env.DB.prepare(
    `SELECT user_id, item_type, item_id, ease, interval_days, repetitions, lapses, due_at, state, card_kind
     FROM review_schedule WHERE user_id = ? AND item_type = ? AND item_id = ? AND card_kind = ?`,
  )
    .bind(user.id, itemType, itemId, kind)
    .first<CardRow>();
  if (!card) throw new HttpError(404, 'CARD_NOT_FOUND', 'هذه البطاقة غير موجودة في جدول مراجعتك.');

  const now = new Date();
  const dayStart = utcDayStart(now);
  const limits = await limitsFor(env, user.id);
  const counts = await todayCounts(env, user.id, dayStart);
  const isNew = card.state === 'new' || card.state === 'learning';
  if (isNew && counts.newCount >= limits.newPerDay) {
    throw new HttpError(429, 'DAILY_LIMIT_REACHED', 'وصلت إلى حدّ البطاقات الجديدة اليوم. عُد غدًا أو راجع ما هو مستحق.');
  }
  if (!isNew && counts.reviewCount >= limits.reviewsPerDay) {
    throw new HttpError(429, 'DAILY_LIMIT_REACHED', 'وصلت إلى حدّ المراجعات اليوم. عُد غدًا.');
  }

  const next = scheduleCard(
    {
      state: card.state as CardState,
      ease: card.ease,
      intervalDays: card.interval_days,
      reps: card.repetitions,
      lapses: card.lapses,
    },
    body.rating,
    now,
  );

  const reviewId = ulid().toLowerCase();
  const reviewedAt = now.toISOString();
  const responseMs = Number.isFinite(Number(body.responseMs))
    ? Math.max(0, Math.min(10 * 60_000, Math.floor(Number(body.responseMs))))
    : null;

  // القيد الفريد هو حائط الحماية: إن سبق طلبٌ متزامن تخزين نفس الحدث، لا نُطبّق
  // الجدولة مرة ثانية.
  let inserted = false;
  try {
    await env.DB.prepare(
      `INSERT INTO srs_reviews
         (id, client_event_id, user_id, item_type, item_id, card_kind, rating,
          prev_state, prev_interval_days, prev_ease, prev_due_at,
          next_state, next_interval_days, next_ease, next_due_at,
          response_ms, scheduler_version, reviewed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, client_event_id) DO NOTHING`,
    )
      .bind(
        reviewId, eventId, user.id, itemType, itemId, kind, RATING_CODE[body.rating],
        card.state, card.interval_days, card.ease, card.due_at,
        next.state, next.intervalDays, next.ease, next.dueAt,
        responseMs, SCHEDULER_VERSION, reviewedAt,
      )
      .run();
    const check = await env.DB.prepare(`SELECT id FROM srs_reviews WHERE user_id = ? AND client_event_id = ?`)
      .bind(user.id, eventId)
      .first<{ id: string }>();
    inserted = check?.id === reviewId;
  } catch {
    inserted = false;
  }

  if (!inserted) {
    const replayRow = await env.DB.prepare(
      `SELECT next_state, next_interval_days, next_ease, next_due_at, reviewed_at
       FROM srs_reviews WHERE user_id = ? AND client_event_id = ?`,
    )
      .bind(user.id, eventId)
      .first<{ next_state: string; next_interval_days: number; next_ease: number; next_due_at: string; reviewed_at: string }>();
    if (replayRow) {
      return json(
        {
          replay: true,
          cardId,
          next: {
            state: replayRow.next_state,
            intervalDays: replayRow.next_interval_days,
            ease: replayRow.next_ease,
            dueAt: replayRow.next_due_at,
          },
          reviewedAt: replayRow.reviewed_at,
        },
        {},
        requestId,
      );
    }
    throw new HttpError(500, 'REVIEW_WRITE_FAILED', 'تعذّر تسجيل المراجعة. لم يُحفظ أي تغيير — أعد المحاولة.');
  }

  await env.DB.prepare(
    `UPDATE review_schedule
       SET ease = ?, interval_days = ?, repetitions = ?, lapses = ?, due_at = ?, state = ?, last_reviewed_at = ?, last_quality = ?
     WHERE user_id = ? AND item_type = ? AND item_id = ? AND card_kind = ?`,
  )
    .bind(
      next.ease, next.intervalDays, next.reps, next.lapses, next.dueAt, next.state, reviewedAt,
      ratingToQuality(body.rating), user.id, itemType, itemId, kind,
    )
    .run();

  // إحصاء الكلمات «المثبَّتة» يُحدَّث من الجدولة نفسها لا من تخمين
  await env.DB.prepare(
    `INSERT INTO user_stats (user_id, reviews_done, updated_at)
     VALUES (?, 1, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
     ON CONFLICT(user_id) DO UPDATE SET reviews_done = reviews_done + 1, updated_at = excluded.updated_at`,
  )
    .bind(user.id)
    .run();

  const remaining = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM review_schedule rs
     LEFT JOIN vocabulary_entries e ON e.id = rs.item_id
     WHERE rs.user_id = ? AND rs.state != 'suspended' AND rs.due_at <= ? AND e.id IS NOT NULL`,
  )
    .bind(user.id, new Date().toISOString())
    .first<{ n: number }>();

  return json(
    {
      replay: false,
      cardId,
      rating: body.rating,
      next: { state: next.state, intervalDays: next.intervalDays, ease: next.ease, dueAt: next.dueAt },
      reviewedAt,
      remainingDue: Number(remaining?.n ?? 0),
    },
    {},
    requestId,
  );
}

/** POST /api/review/packs/:slug/start — يولّد بطاقات حزمة مفردات للمستخدم */
export async function startPack(req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const slug = decodeURIComponent(new URL(req.url).pathname.split('/')[4] ?? '');
  if (!/^[a-z0-9-]{3,64}$/.test(slug)) throw new HttpError(400, 'INVALID_SLUG', 'معرّف الحزمة غير صالح.');

  const bundle = await env.DB.prepare(`SELECT id, slug, title_ar FROM vocabulary_bundles WHERE slug = ?`)
    .bind(slug)
    .first<{ id: string; slug: string; title_ar: string }>();
  if (!bundle) throw new HttpError(404, 'PACK_NOT_FOUND', 'هذه الحزمة غير متاحة.');

  const entries = await env.DB.prepare(
    `SELECT e.id FROM vocabulary_bundle_entries be JOIN vocabulary_entries e ON e.id = be.entry_id
     WHERE be.bundle_id = ? ORDER BY be.sort_order`,
  )
    .bind(bundle.id)
    .all<{ id: string }>();

  const now = new Date().toISOString();
  let created = 0;
  for (const e of entries.results) {
    const res = await env.DB.prepare(
      `INSERT INTO review_schedule
         (user_id, item_type, item_id, ease, interval_days, repetitions, lapses, due_at,
          card_kind, state, scheduler_version, created_at, origin_ref)
       VALUES (?, 'vocab', ?, 2.5, 0, 0, 0, ?, 'recognition', 'new', ?, ?, ?)
       ON CONFLICT(user_id, item_type, item_id) DO NOTHING`,
    )
      .bind(user.id, e.id, now, SCHEDULER_VERSION, now, `pack:${bundle.slug}`)
      .run();
    if (Number(res.meta?.changes ?? 0) > 0) created++;
  }

  return json(
    {
      pack: bundle.slug,
      totalEntries: entries.results.length,
      created,
      alreadyPresent: entries.results.length - created,
      // الاستماع غير مدعوم قبل توفّر صوت معتمد — لا نُنشئ بطاقات لا يمكن أداؤها
      kindsCreated: ['recognition'],
    },
    {},
    requestId,
  );
}

/** GET /api/review/packs — حزم المفردات المتاحة للبدء */
export async function listPacks(_req: Request, env: Env, requestId: string, user: SessionUser): Promise<Response> {
  const rows = await env.DB.prepare(
    `SELECT b.slug, b.title_ar, b.level_code, b.sort_order,
            (SELECT COUNT(*) FROM vocabulary_bundle_entries be WHERE be.bundle_id = b.id) AS entries,
            (SELECT COUNT(*) FROM vocabulary_bundle_entries be JOIN review_schedule rs
               ON rs.item_id = be.entry_id AND rs.user_id = ? AND rs.item_type = 'vocab'
             WHERE be.bundle_id = b.id) AS started
     FROM vocabulary_bundles b ORDER BY b.sort_order, b.slug`,
  )
    .bind(user.id)
    .all<{ slug: string; title_ar: string; level_code: string | null; entries: number; started: number }>();

  return json(
    {
      packs: rows.results.map(r => ({
        slug: r.slug,
        titleAr: r.title_ar,
        level: r.level_code,
        entries: Number(r.entries),
        started: Number(r.started),
        startedAll: Number(r.entries) > 0 && Number(r.started) === Number(r.entries),
      })),
    },
    {},
    requestId,
  );
}
