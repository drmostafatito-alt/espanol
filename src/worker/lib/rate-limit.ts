/* حد معدل الطلبات في D1: نافذة زمنية ثابتة، كتابة واحدة لكل نافذة */
import type { D1Database } from '../types';
import { HttpError } from './http';

export interface RateResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export async function checkRateLimit(
  db: D1Database,
  bucket: string,
  limit: number,
  windowSeconds: number,
  nowMs = Date.now(),
): Promise<RateResult> {
  const now = Math.floor(nowMs / 1000);
  const windowStart = Math.floor(now / windowSeconds) * windowSeconds;
  const resetAt = (windowStart + windowSeconds) * 1000;

  // upsert ذرّي: يزيد العدّاد أو ينشئ صفًا جديدًا للنافذة الحالية
  const row = await db
    .prepare(
      `INSERT INTO rate_limits (bucket, window_start, count) VALUES (?, ?, 1)
       ON CONFLICT(bucket, window_start) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(bucket, windowStart)
    .first<{ count: number }>();

  const count = row?.count ?? 1;
  return { allowed: count <= limit, limit, remaining: Math.max(0, limit - count), resetAt };
}

/** يرفض الطلب برمز 429 عند تجاوز الحد — نفس الرسالة في كل المسارات. */
export async function rateLimitOrThrow(
  db: D1Database,
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<void> {
  const r = await checkRateLimit(db, bucket, limit, windowSeconds);
  if (!r.allowed) {
    throw new HttpError(429, 'RATE_LIMITED', 'محاولات كثيرة. أعد المحاولة بعد قليل.', {
      retryAfterSeconds: Math.ceil((r.resetAt - Date.now()) / 1000),
    });
  }
}

/** تنظيف النوافذ القديمة — يُستدعى من cron أو نادرًا */
export async function pruneRateLimits(db: D1Database, olderThanSeconds = 86400): Promise<void> {
  const cutoff = Math.floor(Date.now() / 1000) - olderThanSeconds;
  await db.prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(cutoff).run();
}
