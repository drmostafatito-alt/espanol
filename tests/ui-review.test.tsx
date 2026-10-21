// @vitest-environment jsdom
/**
 * شاشة المراجعة كاملة: React حقيقي + worker حقيقي + D1 في الذاكرة.
 * يغطي: التذكّر قبل الكشف، التقييمات الأربعة، لوحة المفاتيح، الحالة الفارغة،
 * وقائمة الانتظار المحلية عند فشل الشبكة (ثم تفريغها عند عودة الاتصال).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Review } from '../src/web/pages/Review';
import { AuthProvider } from '../src/web/state';
import { makeHarness, signupAndGetCookie, type Harness } from './harness';
import { correctAnswer, importExemplars } from './content-fixture';
import worker from '../src/worker/index';

let h: Harness;
let cookie: string;
let failNextPost = false;

function wireFetch() {
  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const path = String(typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url).replace(
      /^https?:\/\/[^/]+/,
      '',
    );
    const method = init.method ?? 'GET';
    if (failNextPost && method === 'POST' && path.startsWith('/api/review/answers')) {
      failNextPost = false;
      throw new TypeError('Failed to fetch');
    }
    const headers = new Headers(init.headers);
    headers.set('Cookie', cookie);
    return worker.fetch(
      new Request('http://localhost:8787' + path, { method, headers, body: init.body as BodyInit | undefined }),
      h.env,
    );
  });
}

async function completeLesson() {
  const slug = 'prea1-hola-me-llamo';
  const session = await h.json<{ exercises: { id: string; mode: string }[] }>(
    await h.call(`/api/lessons/${slug}/session`, { cookie }),
  );
  for (const ex of session.exercises) {
    if (ex.mode !== 'graded') continue;
    await h.call(`/api/lessons/${slug}/answers`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({ eventId: `ev_${ex.id.slice(-9)}_aaaaaaaa`, exerciseId: ex.id, response: correctAnswer(h, ex.id) ?? '' }),
    });
  }
  await h.call(`/api/lessons/${slug}/complete`, {
    method: 'POST',
    cookie,
    body: JSON.stringify({ eventId: 'ev_complete_ui_aaaaaaaa' }),
  });
}

beforeEach(async () => {
  localStorage.clear();
  failNextPost = false;
  h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ALLOW_PUBLIC_SIGNUP: 'true' });
  importExemplars(h);
  const { cookie: c } = await signupAndGetCookie(h);
  cookie = c!;
  wireFetch();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  h.close();
});

describe('شاشة المراجعة', () => {
  it('تُظهر حالة الفراغ بوضوح عند عدم وجود بطاقات', async () => {
    render(<AuthProvider><Review navigate={() => {}} /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('review-empty')).toBeTruthy());
    expect(screen.getByText(/لا بطاقات مستحقة/)).toBeTruthy();
  });

  it('لا تكشف الإجابة قبل طلبها، وتكشفها بعد الضغط', async () => {
    await completeLesson();
    render(<AuthProvider><Review navigate={() => {}} /></AuthProvider>);

    await waitFor(() => expect(screen.getByTestId('review-card')).toBeTruthy());
    expect(screen.queryByTestId('review-answer')).toBeNull();

    await userEvent.setup().click(screen.getByTestId('review-reveal'));
    expect(screen.getByTestId('review-answer')).toBeTruthy();
    expect(screen.getByTestId('review-rate-good')).toBeTruthy();
  });

  it('التقييم يُحفظ على الخادم ويُنتقل للبطاقة التالية', async () => {
    await completeLesson();
    const before = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));
    render(<AuthProvider><Review navigate={() => {}} /></AuthProvider>);

    const user = userEvent.setup();
    await waitFor(() => expect(screen.getByTestId('review-card')).toBeTruthy());
    await user.click(screen.getByTestId('review-reveal'));
    await user.click(screen.getByTestId('review-rate-good'));

    await waitFor(() => expect(screen.getByTestId('review-last-next')).toBeTruthy());
    const rows = h.db.raw.prepare('SELECT COUNT(*) AS n FROM srs_reviews').get() as { n: number };
    expect(rows.n).toBe(1);
    expect(before.cards.length).toBeGreaterThan(0);
  });

  it('لوحة المفاتيح: مسافة تكشف، و3 تقيّم «جيد»', async () => {
    await completeLesson();
    render(<AuthProvider><Review navigate={() => {}} /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('review-card')).toBeTruthy());

    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    await waitFor(() => expect(screen.getByTestId('review-answer')).toBeTruthy());

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }));
    await waitFor(() => {
      const n = (h.db.raw.prepare('SELECT COUNT(*) AS n FROM srs_reviews').get() as { n: number }).n;
      expect(n).toBe(1);
    });
  });

  it('انقطاع الشبكة: يُحفظ التقييم محليًا ولا ندّعي حفظه على الخادم', async () => {
    await completeLesson();
    render(<AuthProvider><Review navigate={() => {}} /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('review-card')).toBeTruthy());

    failNextPost = true;
    const user = userEvent.setup();
    await user.click(screen.getByTestId('review-reveal'));
    await user.click(screen.getByTestId('review-rate-easy'));

    await waitFor(() => expect(localStorage.getItem('srs.pending.v1')).toBeTruthy());
    const queued = JSON.parse(localStorage.getItem('srs.pending.v1')!) as unknown[];
    expect(queued.length).toBe(1);
    expect(screen.getByTestId('review-offline')).toBeTruthy();

    // لا شيء وصل للخادم بعد
    expect((h.db.raw.prepare('SELECT COUNT(*) AS n FROM srs_reviews').get() as { n: number }).n).toBe(0);

    // عودة الاتصال ⇒ تُفرَّغ القائمة ويُسجَّل التقييم مرة واحدة
    window.dispatchEvent(new Event('online'));
    await waitFor(() => {
      const n = (h.db.raw.prepare('SELECT COUNT(*) AS n FROM srs_reviews').get() as { n: number }).n;
      expect(n).toBe(1);
    }, { timeout: 5000 });
    await waitFor(() => expect(localStorage.getItem('srs.pending.v1')).toBeNull());
  });

  it('إعادة إرسال نفس التقييم لا تُسجّل مراجعتين', async () => {
    await completeLesson();
    const { cards } = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));
    const body = JSON.stringify({ clientEventId: 'ev_retry_0000001', cardId: cards[0]!.id, rating: 'good' });
    await h.call('/api/review/answers', { method: 'POST', cookie, body });
    await h.call('/api/review/answers', { method: 'POST', cookie, body });
    expect((h.db.raw.prepare('SELECT COUNT(*) AS n FROM srs_reviews').get() as { n: number }).n).toBe(1);
  });
});
