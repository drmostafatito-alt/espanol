/**
 * قائمة انتظار تقييمات المراجعة (offline queue).
 *
 * كانت هذه الدوال داخل صفحة المراجعة، فتجعل صفحة كاملة (12KB) تُحمَّل مع
 * الحزمة الأساسية لأن `state.tsx` يستورد منها ربط الطابور بهوية المستخدم.
 * نُقلت هنا كوحدة صغيرة مستقلة: صفحة المراجعة تُحمَّل عند الطلب، وتقسيم
 * الحزم يعمل كما هو مقصود (راجع INEFFECTIVE_DYNAMIC_IMPORT في بناء Vite).
 *
 * الأمان: الطابور مرتبط بمعرّف المستخدم (AUD-14)، فلا تُرسل تقييمات حساب
 * باسم حساب آخر، ويمسح عند تسجيل الخروج.
 */

export const QUEUE_KEY = 'srs.pending.v1';

export interface PendingReview {
  clientEventId: string;
  cardId: string;
  rating: 'again' | 'hard' | 'good' | 'easy';
  responseMs: number;
  queuedAt: number;
  userId: string;
}

let boundUserId: string | null = null;

export function queueKey(userId: string): string {
  return `${QUEUE_KEY}:${userId}`;
}

export function parseQueue(raw: string | null): PendingReview[] {
  try {
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as PendingReview[]) : [];
  } catch {
    return [];
  }
}

export function readQueue(userId: string): PendingReview[] {
  try {
    const legacy = parseQueue(localStorage.getItem(QUEUE_KEY));
    if (legacy.length) {
      const stamped = legacy.map(item => ({ ...item, userId }));
      const existing = parseQueue(localStorage.getItem(queueKey(userId)));
      localStorage.setItem(queueKey(userId), JSON.stringify([...existing, ...stamped]));
      localStorage.removeItem(QUEUE_KEY);
      return [...existing, ...stamped];
    }
    return parseQueue(localStorage.getItem(queueKey(userId)));
  } catch {
    return [];
  }
}

export function writeQueue(userId: string, items: PendingReview[]): void {
  try {
    if (items.length) localStorage.setItem(queueKey(userId), JSON.stringify(items));
    else localStorage.removeItem(queueKey(userId));
  } catch {
    /* التخزين قد يكون معطّلًا (وضع خاص) — نفشل بهدوء ولا ندّعي حفظًا */
  }
}

/** ربط قائمة الانتظار بحساب مالكها (AUD-14): تقييمات حساب لا تُرسَل باسم حساب آخر.
 *  يُهاجَر أي طابور قديم بالمفتاح العام إلى مفتاح المستخدم بدل حذفه بصمت. */
export function bindPendingQueue(userId: string | null): void {
  boundUserId = userId;
  if (!userId) return;
  try {
    const legacy = parseQueue(localStorage.getItem(QUEUE_KEY));
    if (legacy.length) {
      const stamped = legacy.map(item => ({ ...item, userId }));
      const existing = parseQueue(localStorage.getItem(queueKey(userId)));
      localStorage.setItem(queueKey(userId), JSON.stringify([...existing, ...stamped]));
      localStorage.removeItem(QUEUE_KEY);
    }
  } catch { /* noop */ }
}

/** مسح قائمة المستخدم المرتبط عند تسجيل الخروج */
export function clearPendingQueue(): void {
  if (boundUserId) writeQueue(boundUserId, []);
  else { try { localStorage.removeItem(QUEUE_KEY); } catch { /* noop */ } }
}
