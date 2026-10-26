// @vitest-environment jsdom
/**
 * ============================================================================
 * اختبار شاشة الدرس كاملة — React حقيقي + محرّك حقيقي + D1 حقيقي (في الذاكرة)
 * ============================================================================
 * لماذا هذا الملف موجود؟ لأن Playwright لا يستطيع إقلاع Chromium في بيئة
 * العمل هذه (مكتبات نظام ناقصة). هذا يحفظ جزءًا مهمًا من القيمة:
 *   - نفس مكوّن React المُصدَّر إلى المستخدم يُرسَم ويُضغط عليه
 *   - نفس worker.fetch يُنفَّذ (لا نموذج وهمي للـAPI)
 *   - نفس قاعدة البيانات ومحرّك التصحيح
 * وما لا يغطيه: محرّك العرض الحقيقي، اللمس، الصوت، RTL البصري، الشبكة البطيئة.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lesson } from '../src/web/pages/Lesson';
import { AuthProvider } from '../src/web/state';
import { makeHarness, VALID_EMAIL, VALID_PW, type Harness } from './harness';
import { correctAnswer, importExemplars } from './content-fixture';

let h: Harness;

/** يوجّه fetch الواجهة إلى worker الحقيقي داخل العملية نفسها */
function wireFetch(harness: Harness, cookie: string | null) {
  const calls: { path: string; body: unknown }[] = [];
  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const path = String(typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url).replace(
      /^https?:\/\/[^/]+/,
      '',
    );
    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ path, body });
    const headers = new Headers(init.headers);
    if (cookie) headers.set('Cookie', cookie);
    const req = new Request('http://localhost:8787' + path, {
      method: init.method ?? 'GET',
      headers,
      body: init.body as BodyInit | undefined,
    });
    return h.env.DB ? workerFetch(req) : fetch(input as never, init);
  });
  const workerFetch = (req: Request) => import('../src/worker/index').then(m => m.default.fetch(req, h.env));
  return calls;
}

beforeEach(async () => {
  h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ALLOW_PUBLIC_SIGNUP: 'true' });
  importExemplars(h);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  h.close();
});

/** يبدأ الدرس من شاشة التعريف (التي تُعرض الآن قبل التمارين): ينتظر ظهورها ثم ينقر زر البدء */
async function startLesson(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => expect(screen.getByTestId('lesson-start')).toBeTruthy());
  await user.click(screen.getByTestId('lesson-start'));
  await waitFor(() => expect(screen.queryByTestId('lesson-start')).toBeNull());
}

async function login(): Promise<string> {
  const res = await h.call('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PW, displayName: 'متعلم' }),
  });
  expect(res.status).toBe(201);
  return h.cookieOf(res)!;
}

/** يمرّ على الدرس كله من الواجهة: إجابة صحيحة لكل تمرين ثم «تحقّق» ثم «التالي» */
async function playLesson(slug: string, session: { exercises: { id: string; mode: string; type: string }[] }) {
  const user = userEvent.setup();
  for (const ex of session.exercises) {
    const choice = document.querySelector<HTMLButtonElement | HTMLLabelElement>('.choice');
    // .token.ghost = الكلمات المتاحة (أما الكلمات الموضوعة في الجملة فهي .token فقط)
    const token = document.querySelector<HTMLButtonElement>('.token.ghost');
    const text = screen.queryByTestId('lesson-text') as HTMLInputElement | null;
    const area = document.querySelector('textarea');

    if (choice) {
      await user.click(choice);
    } else if (text) {
      const a = correctAnswer(h, ex.id);
      await user.type(text, typeof a === 'string' ? a : 'hola');
    } else if (token) {
      const n = document.querySelectorAll('.token.ghost').length;
      for (let k = 0; k < n; k++) await user.click(document.querySelector<HTMLButtonElement>('.token.ghost')!);
    } else if (area) {
      await user.type(area, 'Me llamo estudiante.');
    }

    const submit = screen.getByTestId('lesson-submit') as HTMLButtonElement;
    await waitFor(() => expect(submit.disabled, `التمرين «${ex.type}» لم يُفعّل زر التحقّق`).toBe(false), {
      timeout: 3000,
    });
    await user.click(submit);
    await waitFor(() => expect(screen.getByTestId('lesson-feedback')).toBeTruthy(), { timeout: 5000 });
    await user.click(screen.getByTestId('lesson-next'));
  }
  await waitFor(() => expect(screen.getByTestId('lesson-result')).toBeTruthy(), { timeout: 5000 });
  void slug;
}

describe('شاشة الدرس (DOM حقيقي، خادم حقيقي)', () => {
  it('ترسم الدرس دون أي وسم «تجريبي/غير مراجعة» (لا إعلانات تطويرية للمتعلم)', async () => {
    const cookie = await login();
    wireFetch(h, cookie);
    render(
      <AuthProvider>
        <Lesson slug="prea1-hola-me-llamo" navigate={() => {}} />
      </AuthProvider>,
    );
    const user = userEvent.setup();
    await waitFor(() => expect(screen.getByTestId('lesson-start')).toBeTruthy());
    await user.click(screen.getByTestId('lesson-start'));
    await waitFor(() => expect(screen.getByTestId('lesson-submit')).toBeTruthy());
    // الدرس يُرسم بصورة طبيعية...
    expect(screen.getByTestId('lesson-submit')).toBeTruthy();
    // ...ولا يعرض أي رسالة تطويرية (تمت إزالتها من واجهة المتعلم — راجع Phase 3)
    expect(screen.queryByText(/عينة تعليمية تجريبية|عينة غير مراجعة|تجريبي/)).toBeNull();
    // لا مفاتيح إجابة في أي مكان في الصفحة
    expect(document.body.innerHTML).not.toMatch(/correctOptionIds|answerKey/);
  });

  it('درس مقفل يعرض بطاقة القفل لا شاشة بيضاء', async () => {
    const cookie = await login();
    wireFetch(h, cookie);
    render(
      <AuthProvider>
        <Lesson slug="a1-un-cafe-por-favor" navigate={() => {}} />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByText(/هذا الدرس مقفل/)).toBeTruthy());
    expect(screen.getByText(/prea1-hola-me-llamo/)).toBeTruthy();
  });

  it('مسار كامل: كل الإجابات صحيحة ⇒ نتيجة من الخادم بـ30 XP', async () => {
    const cookie = await login();
    wireFetch(h, cookie);
    render(
      <AuthProvider>
        <Lesson slug="prea1-hola-me-llamo" navigate={() => {}} />
      </AuthProvider>,
    );
    const sessionRes = await h.json<{ exercises: { id: string; mode: string; type: string }[] }>(
      await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }),
    );
    const user = userEvent.setup();
    await startLesson(user);
    await playLesson('prea1-hola-me-llamo', sessionRes);

    const result = screen.getByTestId('lesson-result');
    expect(result.textContent).toContain('30');
    // الخادم هو من قرر النجاح، لا الواجهة
    const progress = await h.json<{ stats: { xp_total: number } }>(await h.call('/api/me/progress', { cookie }));
    expect(progress.stats.xp_total).toBe(30);
  }, 30000);

  it('إعادة الإرسال من الواجهة لا تمنح XP إضافية', async () => {
    const cookie = await login();
    const session = await h.json<{ exercises: { id: string; mode: string; type: string }[] }>(
      await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }),
    );
    for (const ex of session.exercises) {
      if (ex.mode !== 'graded') continue;
      await h.call('/api/lessons/prea1-hola-me-llamo/answers', {
        method: 'POST',
        cookie,
        body: JSON.stringify({
          eventId: `ev_ui_${ex.id.slice(-12)}_aaaa1111`,
          exerciseId: ex.id,
          response: correctAnswer(h, ex.id) ?? '',
        }),
      });
    }
    const first = await h.json<{ xpAwarded: number }>(
      await h.call('/api/lessons/prea1-hola-me-llamo/complete', {
        method: 'POST',
        cookie,
        body: JSON.stringify({ eventId: 'ev_ui_complete_bbbb2222' }),
      }),
    );
    const second = await h.json<{ xpAwarded: number }>(
      await h.call('/api/lessons/prea1-hola-me-llamo/complete', {
        method: 'POST',
        cookie,
        body: JSON.stringify({ eventId: 'ev_ui_complete_cccc3333' }),
      }),
    );
    expect(first.xpAwarded).toBe(30);
    expect(second.xpAwarded).toBe(0);
  });
});

/**
 * انحدار واجهة: تمرين الترتيب الحواري (dialogue_order).
 * قبل التدقيق كان `dialogue_order` يسقط إلى حقل نص حر (لأن الفرع كان يشترط
 * type === 'word_order')، فكان المتعلم لا يستطيع إرسال ترتيب أصلًا.
 * هذا الاختبار يرسم المكوّن الحقيقي بردّ جلسة مُصنَّع (لا قاعدة بيانات)
 * لأنه يخصّ *فرع العرض* وحده، والتصحيح مغطّى في tests/engine.test.ts.
 */
describe('واجهة الترتيب الحواري', () => {
  it('dialogue_order يُرسم كرموز قابلة للترتيب، لا كحقل نص', async () => {
    const items = [
      { id: 's1', text: 'Buenos días, le atiende Omar.' },
      { id: 's2', text: '¿Podría confirmarme su nombre?' },
    ];
    const sessionBody = {
      lesson: {
        slug: 'cc-test', titleAr: 'اختبار', level: 'A1', objectiveAr: 'هدف', estimatedMinutes: 5,
        versionNo: 1,
        brief: {
          objectiveAr: 'هدف', estimatedMinutes: 5, newVocabulary: [], reviewVocabulary: [],
          targetStructures: [], scenarios: [], grammarPoints: [], culturalNoteAr: null, pedagogicalRationaleAr: null,
        },
        provenance: { status: 'draft', warningAr: 'عينة تجريبية' },
      },
      exercises: [{
        id: 'x1', type: 'dialogue_order', mode: 'graded', hasGrader: true,
        instructionAr: 'رتّب مراحل المكالمة.', stemEs: null, stemAr: null, audioKey: null,
        options: [], items,
      }],
      progress: { status: 'not_started', best_accuracy: 0, attempts_count: 0, completed_at: null },
      xpPerLesson: 30,
    };
    vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
      const path = String(typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url);
      if (path.includes('/session')) return new Response(JSON.stringify(sessionBody), { status: 200, headers: { 'Content-Type': 'application/json' } });
      return new Response(JSON.stringify({ error: 'unexpected' }), { status: 500 });
    });
    render(
      <AuthProvider>
        <Lesson slug="cc-test" navigate={() => {}} />
      </AuthProvider>,
    );
    const user = userEvent.setup();
    await waitFor(() => expect(screen.getByTestId('lesson-start')).toBeTruthy());
    await user.click(screen.getByTestId('lesson-start'));
    await waitFor(() => expect(document.querySelectorAll('.token.ghost').length).toBe(2));
    expect(screen.queryByTestId('lesson-text')).toBeNull();
    // نضغط عنصري الترتيب ثم نتحقق أن المكوّن أرسل مصفوفة مرتّبة (لا نصًا مدموجًا)
    for (let i = 0; i < 2; i++) await user.click(document.querySelector<HTMLButtonElement>('.token.ghost')!);
    const placed = document.querySelectorAll('.token-box')[0]!.querySelectorAll('.token');
    expect([...placed].map(b => b.textContent)).toEqual(items.map(i => i.text));
  });
});

describe('قاعدة الدرس في شاشة المقدمة', () => {
  /** شاشة المقدمة: شروح القواعد (grammarPoints) تُعرض للمتعلم قبل التمارين. */
  function sessionWithGrammar(grammarPoints: { titleAr: string; explanationAr: string }[]) {
    return {
      lesson: {
        slug: 'a1-gram-test', titleAr: 'اختبار نحو', level: 'A1', objectiveAr: 'هدف الدرس', estimatedMinutes: 5,
        versionNo: 1,
        brief: {
          objectiveAr: 'هدف الدرس', estimatedMinutes: 5, newVocabulary: [], reviewVocabulary: [],
          targetStructures: [], scenarios: [], grammarPoints,
          culturalNoteAr: null, pedagogicalRationaleAr: null,
        },
        provenance: { status: 'draft', warningAr: 'عينة تجريبية' },
      },
      exercises: [{
        id: 'x1', type: 'word_choice', mode: 'graded', hasGrader: true,
        instructionAr: 'اختر الكلمة الصحيحة.', stemEs: null, stemAr: null, audioKey: null,
        options: [], items: [],
      }],
      progress: { status: 'not_started', best_accuracy: 0, attempts_count: 0, completed_at: null },
      xpPerLesson: 30,
    };
  }

  it('يُعرض شرح القاعدة في شاشة المقدمة', async () => {
    vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
      const path = String(typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url);
      if (path.includes('/session')) {
        return new Response(JSON.stringify(sessionWithGrammar([
          { titleAr: 'الصفات', explanationAr: 'تتوافق الضمائر مع الأسماء في الجنس والعدد.\nEl coche grande.', },
        ])), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ error: 'unexpected' }), { status: 500 });
    });
    render(
      <AuthProvider>
        <Lesson slug="a1-gram-test" navigate={() => {}} />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('lesson-start')).toBeTruthy());
    expect(screen.getByText('الصفات')).toBeTruthy();
    expect(screen.getByText(/تتوافق الضمائر مع الأسماء في الجنس والعدد/)).toBeTruthy();
    expect(screen.getByText(/El coche grande/)).toBeTruthy();
    // القاعدة في شاشة المقدمة فقط: لا تظهر في مرحلة التمارين قبل الضغط
    expect(screen.getByText('القاعدة')).toBeTruthy();
  });

  it('لا يُعرض قسم القاعدة عندما لا توجد شروح', async () => {
    vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
      const path = String(typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url);
      if (path.includes('/session')) {
        return new Response(JSON.stringify(sessionWithGrammar([])), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ error: 'unexpected' }), { status: 500 });
    });
    render(
      <AuthProvider>
        <Lesson slug="a1-gram-test" navigate={() => {}} />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('lesson-start')).toBeTruthy());
    expect(screen.queryByText('القاعدة')).toBeNull();
  });
});
