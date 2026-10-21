/* أداة اختبار: تشغيل worker.fetch الحقيقي على قاعدة SQLite في الذاكرة */
import worker from '../src/worker/index';
import type { Env } from '../src/worker/types';
import { createTestDb, type TestDb } from '../src/worker/testing/d1-adapter';

export interface Harness {
  env: Env;
  db: TestDb;
  call: (path: string, init?: RequestInit & { cookie?: string | null }) => Promise<Response>;
  json: <T = any>(res: Response) => Promise<T>;
  cookieOf: (res: Response) => string | null;
  close: () => void;
}

export function makeHarness(overrides: Partial<Env> = {}): Harness {
  const db = createTestDb();
  const env: Env = {
    DB: db.d1,
    ENVIRONMENT: 'test',
    APP_ORIGIN: 'http://localhost:5173',
    MEDIA_ORIGIN: 'http://localhost:8787/media',
    PBKDF2_ITERATIONS: '20000', // أرضية السياسة؛ القياس والقرار في reports/kdf-benchmark.md
    SESSION_TTL_DAYS: '30',
    PASSWORD_PEPPER: 'test-pepper-0123456789abcdefghijklmnop',
    ...overrides,
  };

  const call: Harness['call'] = async (path, init = {}) => {
    const headers = new Headers(init.headers);
    if (init.cookie) headers.set('Cookie', init.cookie);
    if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const req = new Request('http://localhost:8787' + path, { ...init, headers });
    return await worker.fetch(req, env);
  };

  return {
    env,
    db,
    call,
    json: async <T,>(res: Response) => (await res.json()) as T,
    cookieOf: (res: Response) => {
      const raw = res.headers.get('Set-Cookie');
      if (!raw) return null;
      const first = raw.split(';')[0]!;
      return first.endsWith('=') ? null : first;
    },
    close: () => db.raw.close(),
  };
}

export const VALID_PW = 'Cairo2026learn';
export const VALID_EMAIL = 'sara@example.com';

export async function signupAndGetCookie(h: Harness, email = VALID_EMAIL, password = VALID_PW) {
  const res = await h.call('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName: 'سارة' }),
  });
  return { res, cookie: h.cookieOf(res) };
}
