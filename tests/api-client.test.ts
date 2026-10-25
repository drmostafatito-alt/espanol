import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError, onUnauthorized } from '../src/web/api';

describe('عميل API — معالجة الأخطاء والجلسات', () => {
  const realFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = realFetch;
    vi.restoreAllMocks();
  });

  it('فشل الشبكة (الخادم غير متاح) يُصنَّف خطأ اتصال لا خطأ مصادقة', async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    await expect(api.me()).rejects.toMatchObject({ status: 0, code: 'NETWORK_ERROR' });
  });

  it('استجابة غير JSON (صفحة خطأ بروكسي) لا تُسقط JSON.parse بل رسالة مفهومة', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response('<html><body>Bad Gateway</body></html>', {
        status: 502,
        headers: { 'Content-Type': 'text/html' },
      }),
    );
    await expect(api.me()).rejects.toMatchObject({ status: 502, code: 'BAD_RESPONSE' });
  });

  it('401 يطلق المعالج المركزي لانتهاء الجلسة ويرمي ApiError', async () => {
    const handler = vi.fn();
    const off = onUnauthorized(handler);
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ error: { code: 'UNAUTHENTICATED', message: 'يلزم تسجيل الدخول.' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    await expect(api.progress()).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledTimes(1);
    off();
  });

  it('429 يمرر رسالة العربية والكود كما هما', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(
        JSON.stringify({ error: { code: 'RATE_LIMITED', message: 'محاولات كثيرة. أعد المحاولة بعد قليل.' } }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    await expect(api.login('a@b.com', 'whatever12')).rejects.toMatchObject({
      status: 429,
      code: 'RATE_LIMITED',
    });
  });

  it('كل الطلبات تُرسل credentials: include', async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } }),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await api.logout();
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    expect(init?.credentials).toBe('include');
  });
});
