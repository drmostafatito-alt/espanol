/* عميل API: كوكي الجلسة HttpOnly — لا توكنات في JS، ولا localStorage للأسرار */

export interface ApiUser {
  id: string;
  email: string;
  displayName: string | null;
  role: string;
  explanationStyle: 'fusha' | 'eg' | 'fusha_eg';
  audioVariant: 'es-ES' | 'es-419';
  dailyGoalMinutes: number;
  permissions: string[];
}

export class ApiError extends Error {
  constructor(public status: number, public code: string, messageAr: string, public details?: unknown) {
    super(messageAr);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = body?.error ?? {};
    throw new ApiError(res.status, err.code ?? 'UNKNOWN', err.message ?? 'حدث خطأ غير متوقع.', err);
  }
  return body as T;
}

export const api = {
  me: () => request<{ user: ApiUser }>('/api/auth/me'),
  signup: (email: string, password: string, displayName?: string) =>
    request<{ user: ApiUser }>('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, displayName }) }),
  login: (email: string, password: string) =>
    request<{ user: ApiUser }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  updateMe: (patch: Partial<Pick<ApiUser, 'displayName' | 'explanationStyle' | 'audioVariant' | 'dailyGoalMinutes'>>) =>
    request<{ user: ApiUser }>('/api/me', { method: 'PATCH', body: JSON.stringify(patch) }),
  publicSettings: () => request<{ settings: Record<string, unknown> }>('/api/settings/public'),
  paths: () =>
    request<{
      paths: { slug: string; title_ar: string; kind: string; level_code: string | null; units_count: number; lessons_count: number; provenance?: string }[];
      contentProvenance?: string;
    }>('/api/content/paths'),

  // ---- المرحلة 2: التعلم ----
  progress: () => request<ProgressPayload>('/api/me/progress'),
  submitPlacement: (body: { targetLevel: 'A1' | 'A2'; answers?: Record<string | number, string>; score?: number; answersCount?: number }) =>
    request<{
      passed: boolean;
      score: number;
      targetLevel: string;
      unlockedLevel: string;
      unlockedLessonsCount: number;
      xpAwarded: number;
      messageAr: string;
    }>('/api/me/placement', { method: 'POST', body: JSON.stringify(body) }),
  lessonSession: (slug: string) => request<LessonSession>(`/api/lessons/${encodeURIComponent(slug)}/session`),
  submitAnswer: (slug: string, body: { eventId: string; exerciseId: string; response: unknown; durationMs?: number }) =>
    request<AnswerResult>(`/api/lessons/${encodeURIComponent(slug)}/answers`, { method: 'POST', body: JSON.stringify(body) }),
  completeLesson: (slug: string, eventId: string) =>
    request<CompleteResult>(`/api/lessons/${encodeURIComponent(slug)}/complete`, { method: 'POST', body: JSON.stringify({ eventId }) }),

  // ---- المراجعة المتباعدة ----
  reviewSession: (limit?: number) => request<ReviewPayload>(`/api/review/session${limit ? `?limit=${limit}` : ''}`),
  submitReview: (body: { clientEventId: string; cardId: string; rating: ReviewRating; responseMs?: number }) =>
    request<ReviewResult>('/api/review/answers', { method: 'POST', body: JSON.stringify(body) }),
  reviewPacks: () => request<{ packs: ReviewPack[] }>('/api/review/packs'),
  startPack: (slug: string) =>
    request<{ created: number; totalEntries: number; alreadyPresent: number }>(
      `/api/review/packs/${encodeURIComponent(slug)}/start`,
      { method: 'POST' },
    ),
  search: (query: string, opts?: { level?: string; kind?: string; limit?: number }) => {
    const params = new URLSearchParams({ q: query });
    if (opts?.level) params.set('level', opts.level);
    if (opts?.kind) params.set('kind', opts.kind);
    if (opts?.limit) params.set('limit', String(opts.limit));
    return request<import('../shared/search-engine').SearchResponse>(`/api/content/search?${params.toString()}`);
  },
};

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewCard {
  id: string;
  kind: 'recognition' | 'production' | 'listening';
  state: string;
  dueAt: string;
  level: string | null;
  headwordEs?: string;
  ipa?: string | null;
  pronunciationHintAr?: string | null;
  promptAr?: string;
  promptHintAr?: string | null;
  revealAr?: string;
  revealArEg?: string | null;
  revealEs?: string;
  usageNoteAr?: string | null;
  commonErrorAr?: string | null;
  exampleEs?: string | null;
  exampleAr?: string | null;
}

export interface ReviewPayload {
  cards: ReviewCard[];
  session: {
    dueNow: number;
    totalCards: number;
    suspended: number;
    reviewedToday: number;
    limits: { newPerDay: number; reviewsPerDay: number };
    newRemaining: number;
    reviewsRemaining: number;
    dayBoundary: string;
  };
  emptyReason: 'NOTHING_DUE' | 'DAILY_LIMIT_REACHED' | null;
}

export interface ReviewResult {
  replay: boolean;
  cardId: string;
  rating: ReviewRating;
  next: { state: string; intervalDays: number; ease: number; dueAt: string };
  reviewedAt: string;
  remainingDue?: number;
}

export interface ReviewPack {
  slug: string;
  titleAr: string;
  level: string | null;
  entries: number;
  started: number;
  startedAll: boolean;
}

export interface LessonExercise {
  id: string;
  type: string;
  mode: 'graded' | 'participation';
  hasGrader: boolean;
  instructionAr: string;
  stemEs: string | null;
  stemAr: string | null;
  audioKey: string | null;
  speechEs?: string | null;
  options: { id: string; text: string }[];
  items: { id: string; text: string }[];
}

export interface LessonSession {
  lesson: {
    slug: string; titleAr: string; level: string | null; objectiveAr: string; estimatedMinutes: number;
    versionNo: number; provenance?: { status: string; warningAr: string };
  };
  exercises: LessonExercise[];
  progress: { status: string; best_accuracy: number; attempts_count: number; completed_at: string | null };
  xpPerLesson: number;
}

export interface AnswerResult {
  replay: boolean;
  correct: boolean | null;
  score: number | null;
  mode: 'graded' | 'participation';
  explanationAr: string;
  feedbackAr: string | null;
}

export interface CompleteResult {
  replay: boolean;
  passed: boolean;
  accuracy: number;
  correctCount: number;
  gradedTotal: number;
  answeredCount: number;
  minAccuracy: number;
  missingRequiredTypes: string[];
  participantOnly: number;
  xpAwarded: number;
  xpTotal: number;
  alreadyCompleted: boolean;
}

export interface ProgressLessonItem {
  slug: string;
  title_ar: string;
  level_code: string | null;
  status: string;
  progress_status: string;
  best_accuracy: number;
  completed_at: string | null;
  unit_id?: string;
  unit_slug?: string;
  unit_title_ar?: string;
  unit_sort_order?: number;
  program_slug?: string;
  program_title_ar?: string;
  program_kind?: string;
  is_unlocked?: boolean;
  missing_prerequisites?: string[];
}

export interface ProgressPayload {
  stats: { xp_total: number; minutes_total: number; streak_current: number; streak_longest: number; reviews_done: number; words_seen: number; words_stable: number };
  lessons: ProgressLessonItem[];
  nextLesson?: {
    slug: string;
    title_ar: string;
    level_code: string | null;
    unit_title_ar?: string;
    program_title_ar?: string;
  } | null;
  totals: { lessons_total: number; lessons_completed: number };
  contentProvenance: { status: string; warningAr: string } | null;
}
