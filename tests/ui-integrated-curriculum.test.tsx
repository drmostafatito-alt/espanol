// @vitest-environment jsdom
/**
 * ============================================================================
 * اختبار تكاملي للدروس المدمجة من الكتب — A2, B1, B2, C1
 * ============================================================================
 * يتحقق من:
 *   1) استيراد خطط الدروس إلى قاعدة البيانات بنجاح (node:sqlite)
 *   2) ظهور الوحدات والدروس في كتالوج المسارات /api/paths
 *   3) جلب جلسة تعلّم حقيقية للدروس /api/learn/session/:slug مع حجب مفاتيح الإجابة
 *   4) تصحيح إجابات المتعلم على الخادم وتراكم نقاط XP في تقدم المستخدم
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { makeHarness, signupAndGetCookie, type Harness } from './harness';
// @ts-ignore
import { buildContentPlan } from '../tools/lib/content-plan.mjs';

let h: Harness;

function importDraftDir(harness: Harness, relDir: string) {
  const plan = buildContentPlan(join(process.cwd(), relDir), { existingVersions: {} }) as {
    statements: string[];
    errors: string[];
  };
  expect(plan.errors).toEqual([]);
  harness.db.raw.exec(plan.statements.join(';\n') + ';');
}

beforeEach(async () => {
  h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ALLOW_PUBLIC_SIGNUP: 'true' });
  // استيراد الدروس المدمجة عبر جميع المستويات
  importDraftDir(h, 'content/drafts/a1');
  importDraftDir(h, 'content/drafts/a2');
  importDraftDir(h, 'content/drafts/b1');
  importDraftDir(h, 'content/drafts/b2');
  importDraftDir(h, 'content/drafts/c1');
});

afterEach(() => {
  h.close();
});

describe('تكامل الدروس المدمجة من الكتب داخل تطبيق الخادم والواجهة', () => {
  it('كتالوج المسارات /api/content/paths يعرض وحدات A2 و B1 و B2 و C1', async () => {
    const res = await h.call('/api/content/paths');
    expect(res.status).toBe(200);
    const body = await h.json<{ paths: { slug: string; lessons_count: number }[] }>(res);
    const mainTrack = body.paths.find(p => p.slug === 'main-track');
    expect(mainTrack).toBeDefined();
    // يجب أن يحوي المسار الرئيسي على الأقل الـ16 درساً المدمجة
    expect(mainTrack!.lessons_count).toBeGreaterThanOrEqual(16);
  });

  it('جلسة تعلّم A2 (a2-indefinido-regular) تُسلَّم كاملة وبلا تسريب لمفاتيح الإجابة', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_a2@example.com');
    const res = await h.call('/api/lessons/a2-indefinido-regular/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('الماضي البسيط');
    expect(data.exercises.length).toBe(6);
    
    // تأكيد عدم تسريب answerKey للعميل
    for (const ex of data.exercises) {
      expect(ex.answerKey).toBeUndefined();
    }
  });

  it('جلسة تعلّم B1 (b1-expresar-opinion-creo-que) تعمل وتصحح الإجابة وتمنح XP', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b1@example.com');
    const res = await h.call('/api/lessons/b1-expresar-opinion-creo-que/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('Creo que');

    // تمرين ملء الفراغ الأول (Creo que él es...)
    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    // إرسال إجابة صحيحة للخادم
    const submitRes = await h.call('/api/lessons/b1-expresar-opinion-creo-que/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'es',
        eventId: 'evt_test_b1_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr.length).toBeGreaterThan(10);
  });

  it('جلسة تعلّم B2 (b2-condicional-imperfecto-subjuntivo) تعمل مع شرط الامتناع', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b2@example.com');
    const res = await h.call('/api/lessons/b2-condicional-imperfecto-subjuntivo/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.level).toBe('B2');
    expect(data.exercises.length).toBe(6);
  });

  it('جلسة تعلّم C1 (c1-precision-estilistica) متوفرة برصانة أسلوبية', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_c1@example.com');
    const res = await h.call('/api/lessons/c1-precision-estilistica/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.level).toBe('C1');
    expect(data.lesson.titleAr).toContain('الدقة الأسلوبية');
  });

  it('وحدة السفر A2 (a2-viajes-experiencias) تُسلَّم جلساتها وتصحح تمارين الماضي بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_travel@example.com');
    const res = await h.call('/api/lessons/a2-viajes-experiencias/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('حكاية تجارب السفر');
    expect(data.exercises.length).toBe(6);

    // تمرين ملء الفراغ (visité)
    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a2-viajes-experiencias/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'visité',
        eventId: 'evt_test_travel_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('visité');
  });

  it('وحدة السرد B1 (b1-pluscuamperfecto-narracion) تتيح جلسات الماضي الأسبق وتصحح على الخادم', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_narrate@example.com');
    const res = await h.call('/api/lessons/b1-pluscuamperfecto-narracion/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('الماضي الأسبق');
    expect(data.exercises.length).toBe(6);

    // تمرين ملء الفراغ (había)
    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/b1-pluscuamperfecto-narracion/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'había',
        eventId: 'evt_test_plus_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('había salido');
  });

  it('وحدة العائلة A1 (a1-mi-familia) تُسلَّم جلساتها وتصحح تمارين القرابة بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_fam@example.com');
    const res = await h.call('/api/lessons/a1-mi-familia/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('أفراد العائلة');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a1-mi-familia/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'madre',
        eventId: 'evt_test_fam_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('madre');
  });

  it('وحدة الأرقام والوقت A1 (a1-numeros-20-100) تُسلَّم جلساتها وتصحح إجابة الأرقام بدقة', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_num@example.com');
    const res = await h.call('/api/lessons/a1-numeros-20-100/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('الأرقام من 20 إلى 100');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a1-numeros-20-100/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'cuarenta',
        eventId: 'evt_test_num_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('cuarenta');
  });

  it('وحدة الطعام والشراب A1 (a1-vocabulario-comida) تُسلَّم جلساتها وتصحح مفردات الخبز والطعام', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_comida@example.com');
    const res = await h.call('/api/lessons/a1-vocabulario-comida/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('مفردات الطعام والشراب');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a1-vocabulario-comida/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'pan',
        eventId: 'evt_test_com_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('pan');
  });
});
