/* ============================================================================
   مجدول المراجعة المتباعدة — SM-2 معدّل، حتمي بالكامل
   ----------------------------------------------------------------------------
   لماذا SM-2 وليس FSRS؟
     FSRS أدقّ عمومًا، لكنه يحتاج بيانات مراجعة حقيقية لمعايرة معاملاته. استخدامه
     بمعاملات افتراضية ثم وصفه بأنه «معايَر» سيكون ادعاءً بلا دليل. SM-2 حتمي،
     قابلة قواعده للتحقق بسطر واحد لكل حالة، ويمكن استبداله لاحقًا: كل صف يحمل
     `scheduler_version`، والترقية تكون بمقارنة في وضع الظل ثم تحويل معلن.

   القواعد المطبَّقة (لا شيء هنا عشوائي):
     again  ⇒ خطوة إعادة تعلّم 10 دقائق، الفاصل يُصفَّر، ease −0.20
     hard   ⇒ بطاقة جديدة: 12 ساعة · مراجَعة: الفاصل × 1.2 (بحد أدنى يوم)، ease −0.15
     good   ⇒ بطاقة جديدة: يوم · مراجَعة: الفاصل × ease
     easy   ⇒ بطاقة جديدة: 3 أيام · مراجَعة: الفاصل × ease × 1.3، ease +0.15
   حدود: ease ∈ [1.30, 3.00] · الفاصل ≤ 365 يومًا · بعد 8 إخفاقات ⇒ suspended
   ========================================================================== */

export type Rating = 'again' | 'hard' | 'good' | 'easy';
export type CardState = 'new' | 'learning' | 'review' | 'relearning' | 'suspended';
export type CardKind = 'recognition' | 'production' | 'listening';

export const MIN_EASE = 1.3;
export const MAX_EASE = 3.0;
export const MAX_INTERVAL_DAYS = 365;
export const LEECH_THRESHOLD = 8;
export const SCHEDULER_VERSION = 1;

/** 10 دقائق إعادة تعلّم · 12 ساعة «صعب» على بطاقة جديدة */
export const RELEARN_MINUTES = 10;
export const HARD_NEW_HOURS = 12;

export const DEFAULT_LIMITS = { newPerDay: 10, reviewsPerDay: 100 } as const;

export interface CardLike {
  state: CardState;
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
}

export interface ScheduleResult {
  state: CardState;
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
  dueAt: string;
}

const RATING_TO_QUALITY: Record<Rating, number> = { again: 1, hard: 3, good: 4, easy: 5 };

/** 1 = again · 2 = hard · 3 = good · 4 = easy (كما تُخزَّن في srs_reviews.rating) */
export function ratingToQuality(rating: Rating): number {
  return RATING_TO_QUALITY[rating];
}

export function qualityToRating(q: number): Rating {
  if (q <= 2) return 'again';
  if (q === 3) return 'hard';
  if (q === 4) return 'good';
  return 'easy';
}

const clampEase = (e: number) => Math.min(MAX_EASE, Math.max(MIN_EASE, Number(e.toFixed(3))));
const clampInterval = (d: number) => Math.min(MAX_INTERVAL_DAYS, Math.max(0, Math.round(d)));

const addMinutes = (now: Date, m: number) => new Date(now.getTime() + m * 60_000).toISOString();
const addDays = (now: Date, d: number) => new Date(now.getTime() + d * 86_400_000).toISOString();

/**
 * يحسب الحالة التالية لبطاقة. دالة نقية: نفس المدخلات ⇒ نفس المخرجات دائمًا.
 * `now` تُمرَّر صراحةً حتى تكون الاختبارات قابلة للتكرار.
 */
export function scheduleCard(card: CardLike, rating: Rating, now: Date): ScheduleResult {
  const ease0 = Number.isFinite(card.ease) ? card.ease : 2.5;
  const interval0 = Number.isFinite(card.intervalDays) ? card.intervalDays : 0;
  const reps0 = Number.isFinite(card.reps) ? card.reps : 0;
  const lapses0 = Number.isFinite(card.lapses) ? card.lapses : 0;
  const isNewLike = card.state === 'new' || card.state === 'learning' || interval0 === 0;

  if (rating === 'again') {
    const lapses = lapses0 + 1;
    const suspended = lapses >= LEECH_THRESHOLD;
    return {
      state: suspended ? 'suspended' : 'relearning',
      ease: clampEase(ease0 - 0.2),
      intervalDays: 0,
      reps: 0,
      lapses,
      dueAt: addMinutes(now, RELEARN_MINUTES),
    };
  }

  if (rating === 'hard') {
    const ease = clampEase(ease0 - 0.15);
    if (isNewLike) {
      return { state: 'learning', ease, intervalDays: 1, reps: reps0 + 1, lapses: lapses0, dueAt: addMinutes(now, HARD_NEW_HOURS * 60) };
    }
    const intervalDays = clampInterval(Math.max(1, interval0 * 1.2));
    return { state: 'review', ease, intervalDays, reps: reps0 + 1, lapses: lapses0, dueAt: addDays(now, intervalDays) };
  }

  if (rating === 'good') {
    const ease = clampEase(ease0);
    const intervalDays = isNewLike ? 1 : clampInterval(Math.max(1, interval0 * ease));
    return { state: 'review', ease, intervalDays, reps: reps0 + 1, lapses: lapses0, dueAt: addDays(now, intervalDays) };
  }

  // easy
  const ease = clampEase(ease0 + 0.15);
  const intervalDays = isNewLike ? 3 : clampInterval(Math.max(1, interval0 * ease * 1.3));
  return { state: 'review', ease, intervalDays, reps: reps0 + 1, lapses: lapses0, dueAt: addDays(now, intervalDays) };
}

export function isRating(v: unknown): v is Rating {
  return v === 'again' || v === 'hard' || v === 'good' || v === 'easy';
}

export function isCardKind(v: unknown): v is CardKind {
  return v === 'recognition' || v === 'production' || v === 'listening';
}

/** حدود يومية مقروءة من إعدادات المستخدم مع حدود صلبة */
export function resolveLimits(raw: unknown): { newPerDay: number; reviewsPerDay: number } {
  const clamp = (v: unknown, def: number, min: number, max: number) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return def;
    return Math.min(max, Math.max(min, Math.floor(n)));
  };
  const o = (raw ?? {}) as Record<string, unknown>;
  return {
    newPerDay: clamp(o.newPerDay, DEFAULT_LIMITS.newPerDay, 0, 100),
    reviewsPerDay: clamp(o.reviewsPerDay, DEFAULT_LIMITS.reviewsPerDay, 0, 1000),
  };
}

/** بداية اليوم بتوقيت UTC — معلنة صراحةً حتى لا يظن أحد أنها بتوقيت المستخدم */
export function utcDayStart(now: Date): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
}
