/**
 * اختبار خدمة الأصول الثابتة: ملف صوت مفقود يجب أن يُرجع 404 حقيقيًا،
 * بينما مسارات التطبيق (SPA) تبقى تُخدَم بـ index.html كما هي.
 */
import { describe, it, expect } from 'vitest';
import worker from '../src/worker/index';
import type { Env } from '../src/worker/types';
import { createTestDb } from '../src/worker/testing/d1-adapter';

/** أصول وهمية تحاكي سلوك Cloudflare Assets: الملف الموجود يُرجَع، وغيره يُرجَع index.html */
const fakeAssets = {
  fetch: async (req: Request): Promise<Response> => {
    const path = new URL(req.url).pathname;
    if (path === '/assets/app.js') {
      return new Response('console.log(1)', { headers: { 'Content-Type': 'application/javascript' } });
    }
    return new Response('<!doctype html><html></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  },
};

function makeEnv(): { env: Env; close: () => void } {
  const db = createTestDb();
  const env: Env = {
    DB: db.d1,
    ASSETS: fakeAssets,
    ENVIRONMENT: 'test',
    APP_ORIGIN: 'http://localhost:5173',
    MEDIA_ORIGIN: 'http://localhost:8787/media',
    PBKDF2_ITERATIONS: '20000',
    SESSION_TTL_DAYS: '30',
    PASSWORD_PEPPER: 'test-pepper-0123456789abcdefghijklmnop',
  };
  return { env, close: () => db.raw.close() };
}

describe('خدمة الأصول الثابتة', () => {
  it('ملف صوت مفقود في /audio/ يُرجع 404 حقيقيًا وليس صفحة HTML', async () => {
    const { env, close } = makeEnv();
    const res = await worker.fetch(new Request('http://localhost:8787/audio/es-ES/missing.opus'), env);
    expect(res.status).toBe(404);
    expect(res.headers.get('Content-Type') ?? '').not.toContain('text/html');
    close();
  });

  it('مسار تطبيق غير معروف (SPA) يبقى يُخدَم بـ index.html', async () => {
    const { env, close } = makeEnv();
    const res = await worker.fetch(new Request('http://localhost:8787/learn/a1-gustar'), env);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type') ?? '').toContain('text/html');
    close();
  });

  it('ملف تطبيق ثابت موجود يُخدَم بنجاح', async () => {
    const { env, close } = makeEnv();
    const res = await worker.fetch(new Request('http://localhost:8787/assets/app.js'), env);
    expect(res.status).toBe(200);
    close();
  });
});
