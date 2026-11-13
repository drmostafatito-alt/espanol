// @vitest-environment jsdom
/**
 * اختبارات مراكز المهارات الجديدة والمفردات والتدريب التفاعلي:
 * 1) عقود الخادم الجديدة (/api/me/vocabulary, /api/content/hub/*, /api/review/session?mode=weak)
 *    بدون تسريب مفاتيح إجابة أو بيانات تصحيح، مع احترام النشر والقفل.
 * 2) شريط الأحرف الإسبانية AccentBar + insertAtCursor.
 * 3) رسم صفحات المفردات والقواعد والمحادثات والاستماع والإحصائيات ببيانات الخادم الحقيقية.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import worker from '../src/worker/index';
import { AuthProvider } from '../src/web/state';
import { AccentBar, insertAtCursor } from '../src/web/components/AccentBar';
import { Vocabulary } from '../src/web/pages/Vocabulary';
import { Grammar } from '../src/web/pages/Grammar';
import { Conversations } from '../src/web/pages/Conversations';
import { Listening } from '../src/web/pages/Listening';
import { Stats } from '../src/web/pages/Stats';
import { makeHarness, signupAndGetCookie, type Harness } from './harness';
import { correctAnswer, importExemplars } from './content-fixture';

let h: Harness;
let cookie: string;

function wireFetch(harness: Harness, sessionCookie: string | null) {
  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const path = String(typeof input === 'string' ? input : input instanceof URL ? input.pathname + input.search : input.url).replace(
      /^https?:\/\/[^/]+/,
      '',
    );
    const headers = new Headers(init.headers);
    if (sessionCookie) headers.set('Cookie', sessionCookie);
    return worker.fetch(
      new Request('http://localhost:8787' + path, {
        method: init.method ?? 'GET',
        headers,
        body: init.body as BodyInit | undefined,
      }),
      harness.env,
    );
  });
}

async function completeFirstLesson() {
  const slug = 'prea1-hola-me-llamo';
  const session = await h.json<{ exercises: { id: string; mode: string }[] }>(
    await h.call(`/api/lessons/${slug}/session`, { cookie }),
  );
  for (const ex of session.exercises) {
    if (ex.mode !== 'graded') continue;
    await h.call(`/api/lessons/${slug}/answers`, {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        eventId: `ev_${ex.id.slice(-9)}_hub11111`,
        exerciseId: ex.id,
        response: correctAnswer(h, ex.id) ?? '',
      }),
    });
  }
  await h.call(`/api/lessons/${slug}/complete`, {
    method: 'POST',
    cookie,
    body: JSON.stringify({ eventId: 'ev_complete_hub_111111' }),
  });
}

beforeEach(async () => {
  h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ALLOW_PUBLIC_SIGNUP: 'true' });
  importExemplars(h);
  const signup = await signupAndGetCookie(h);
  cookie = signup.cookie!;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  h.close();
});

describe('واجهات المهارات الخلفية والأمان', () => {
  it('GET /api/me/vocabulary يتطلب جلسة ويعيد ملخص المفردات والقاموس', async () => {
    const unauth = await h.call('/api/me/vocabulary');
    expect(unauth.status).toBe(401);

    await completeFirstLesson();
    const res = await h.call('/api/me/vocabulary', { cookie });
    expect(res.status).toBe(200);
    const body = await h.json<{
      summary: { totalCards: number; dictionaryTotal: number; weak: number };
      cards: { headwordEs: string; bucket: string }[];
      explorer: { headwordEs: string }[];
    }>(res);
    expect(body.summary.totalCards).toBeGreaterThan(0);
    expect(body.summary.dictionaryTotal).toBeGreaterThan(0);
    expect(body.cards.length).toBeGreaterThan(0);
    expect(body.explorer.length).toBeGreaterThan(0);
  });

  it('مراكز القواعد والمحادثات والاستماع خالية من أي أسرار تصحيح أو تمارين', async () => {
    for (const url of [
      '/api/content/hub/grammar',
      '/api/content/hub/conversations',
      '/api/content/hub/listening',
    ]) {
      const res = await h.call(url, { cookie });
      expect(res.status).toBe(200);
      const raw = await res.text();
      expect(raw).not.toContain('answerKey');
      expect(raw).not.toContain('isCorrect');
      expect(raw).not.toContain('correctOptionIds');
    }

    const conv = await h.json<{ total: number; scenarios: { lines: { es: string }[] }[] }>(
      await h.call('/api/content/hub/conversations', { cookie }),
    );
    expect(conv.total).toBeGreaterThan(0);
    expect(conv.scenarios[0]!.lines.length).toBeGreaterThan(0);

    const listen = await h.json<{ total: number; clips: { es: string }[] }>(
      await h.call('/api/content/hub/listening', { cookie }),
    );
    expect(listen.total).toBeGreaterThan(0);
    expect(listen.clips[0]!.es.length).toBeGreaterThan(0);
  });

  it('GET /api/review/session?mode=weak يختار البطاقات المتعثرة فقط', async () => {
    await completeFirstLesson();
    const dueRes = await h.json<{ cards: { id: string }[] }>(await h.call('/api/review/session', { cookie }));
    expect(dueRes.cards.length).toBeGreaterThan(0);
    const targetId = dueRes.cards[0]!.id;

    // نسجّل «لم أتذكّر» على بطاقة واحدة لتصبح متعثرة (lapses > 0, state = relearning)
    await h.call('/api/review/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({ clientEventId: 'ev_weak_again_1', cardId: targetId, rating: 'again' }),
    });

    const weakRes = await h.json<{ session: { mode?: string }; cards: { id: string; lapses?: number }[] }>(
      await h.call('/api/review/session?mode=weak', { cookie }),
    );
    expect(weakRes.session.mode).toBe('weak');
    expect(weakRes.cards.map(c => c.id)).toContain(targetId);
  });
});

describe('مكوّنات المهارات وشريط الأحرف في الواجهة', () => {
  it('AccentBar وinsertAtCursor يدرجان الأحرف الإسبانية في الموضع الصحيح', async () => {
    const user = userEvent.setup();
    let value = 'espanol';
    const onInsert = vi.fn((ch: string) => {
      insertAtCursor(null, value, ch, next => {
        value = next;
      });
    });
    render(<AccentBar onInsert={onInsert} />);
    await user.click(screen.getByRole('button', { name: 'إدراج الحرف ñ' }));
    expect(onInsert).toHaveBeenCalledWith('ñ');
    expect(value).toBe('espanolñ');
  });

  it('صفحات المفردات والقواعد والمحادثات والاستماع والإحصائيات تُرسَم ببيانات حقيقية بدون أخطاء', async () => {
    await completeFirstLesson();
    wireFetch(h, cookie);
    const nav = vi.fn();

    render(<AuthProvider><Vocabulary navigate={nav} /></AuthProvider>);
    await waitFor(() => expect(screen.getByText('المفردات والإتقان')).toBeTruthy());
    await waitFor(() => expect(screen.getByText(/توزيع مفرداتك/)).toBeTruthy());
    expect(document.body.textContent).not.toMatch(/undefined|NaN/);
    cleanup();

    render(<AuthProvider><Grammar navigate={nav} /></AuthProvider>);
    await waitFor(() => expect(screen.getByText('القواعد الإسبانية خطوة بخطوة')).toBeTruthy());
    expect(document.body.textContent).not.toMatch(/undefined|NaN/);
    cleanup();

    render(<AuthProvider><Conversations navigate={nav} /></AuthProvider>);
    await waitFor(() => expect(screen.getByText(/مواقف محادثة|المحادثات/)).toBeTruthy());
    expect(document.body.textContent).not.toMatch(/undefined|NaN/);
    cleanup();

    render(<AuthProvider><Listening navigate={nav} /></AuthProvider>);
    await waitFor(() => expect(screen.getByText(/الاستماع/)).toBeTruthy());
    expect(document.body.textContent).not.toMatch(/undefined|NaN/);
    cleanup();

    render(<AuthProvider><Stats navigate={nav} /></AuthProvider>);
    await waitFor(() => expect(screen.getByText('الإحصائيات والتقدّم')).toBeTruthy());
    expect(document.body.textContent).not.toMatch(/undefined|NaN/);
  });
});
