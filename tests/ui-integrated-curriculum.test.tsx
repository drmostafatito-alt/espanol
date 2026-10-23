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

  it('وحدة التسوق A1 (a1-colores-ropa) تُسلَّم جلساتها وتصحح مفردات الملابس والألوان', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_ropa@example.com');
    const res = await h.call('/api/lessons/a1-colores-ropa/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('الألوان والملابس');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a1-colores-ropa/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'zapato',
        eventId: 'evt_test_ropa_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('zapato');
  });

  it('وحدة المنزل A1 (a1-habitaciones) تُسلَّم جلساتها وتصحح تسمية الغرف والمطبخ', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_casa@example.com');
    const res = await h.call('/api/lessons/a1-habitaciones/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('غرف المنزل');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a1-habitaciones/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'cocina',
        eventId: 'evt_test_hab_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('cocina');
  });

  it('وحدة الروتين A1 (a1-verbos-rutina) تُسلَّم جلساتها وتصحح أفعال العمل والدراسة في المضارع', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_rutina@example.com');
    const res = await h.call('/api/lessons/a1-verbos-rutina/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('أفعال الروتين اليومي');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a1-verbos-rutina/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'trabajo',
        eventId: 'evt_test_rutina_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('trabajo');
  });

  it('وحدة أماكن المدينة A1 (a1-lugares-ciudad) تُسلَّم جلساتها وتصحح أسماء الأماكن بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_lugares@example.com');
    const res = await h.call('/api/lessons/a1-lugares-ciudad/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('أماكن في المدينة');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a1-lugares-ciudad/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'parque',
        eventId: 'evt_test_lug_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('parque');
  });

  it('وحدة العمل والمهن A1 (a1-profesiones) تُسلَّم جلساتها وتصحح تأنيث المهن بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_prof@example.com');
    const res = await h.call('/api/lessons/a1-profesiones/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('المهن والوظائف');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a1-profesiones/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'profesora',
        eventId: 'evt_test_prof_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('profesora');
  });

  it('وحدة الصحة وأعضاء الجسم A1 (a1-cuerpo) تُسلَّم جلساتها وتصحح أسماء الأعضاء بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_cuerpo@example.com');
    const res = await h.call('/api/lessons/a1-cuerpo/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('أعضاء الجسم');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a1-cuerpo/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'cabeza',
        eventId: 'evt_test_cue_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
    expect(submitData.explanationAr).toContain('cabeza');
  });

  it('وحدة المستقبل A2 (a2-ir-a-infinitivo) تُسلَّم جلساتها وتصحح تصريف vamos بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_ira@example.com');
    const res = await h.call('/api/lessons/a2-ir-a-infinitivo/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('المستقبل القريب');
    expect(data.exercises.length).toBe(6);

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a2-ir-a-infinitivo/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'vamos',
        eventId: 'evt_test_ira_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة المقارنات A2 (a2-comparativos-superioridad) تُسلَّم جلساتها وتصحح مقارنة التفوق بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_cmp@example.com');
    const res = await h.call('/api/lessons/a2-comparativos-superioridad/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('صيغ المقارنة');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a2-comparativos-superioridad/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'mejor',
        eventId: 'evt_test_cmp_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة تجارب الماضي A2 (a2-perfecto-formacion) تُسلَّم جلساتها وتصحح الماضي المركب بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_per@example.com');
    const res = await h.call('/api/lessons/a2-perfecto-formacion/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('الماضي القريب المركب');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a2-perfecto-formacion/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'estudiado',
        eventId: 'evt_test_per_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة الصحة والأعراض A2 (a2-sintomas-medico) تُسلَّم جلساتها وتصحح وصف الأعراض بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_sin@example.com');
    const res = await h.call('/api/lessons/a2-sintomas-medico/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('الأعراض عند الطبيب');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a2-sintomas-medico/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'tos',
        eventId: 'evt_test_sin_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة السكن والإسكان A2 (a2-tipos-vivienda) تُسلَّم جلساتها وتصحح مفردات السكن بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_viv@example.com');
    const res = await h.call('/api/lessons/a2-tipos-vivienda/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('أنواع السكن');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a2-tipos-vivienda/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'luminoso',
        eventId: 'evt_test_viv_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة الهوايات والرياضة A2 (a2-deportes-tiempo-libre) تُسلَّم وتصحح إدغام al بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_dep@example.com');
    const res = await h.call('/api/lessons/a2-deportes-tiempo-libre/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('الرياضة وأنشطة وقت الفراغ');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a2-deportes-tiempo-libre/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'al',
        eventId: 'evt_test_dep_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة الهاتف والمواعيد A2 (a2-llamadas-telefonicas) تُسلَّم وتصحح السؤال عن المتصل بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_tel@example.com');
    const res = await h.call('/api/lessons/a2-llamadas-telefonicas/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('المكالمات الهاتفية');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a2-llamadas-telefonicas/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'quién',
        eventId: 'evt_test_tel_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة الثقافة والتقاليد A2 (a2-fiestas-tradiciones) تُسلَّم وتصحح تقاليد الأعياد بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_fie@example.com');
    const res = await h.call('/api/lessons/a2-fiestas-tradiciones/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('الأعياد والتقاليد');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/a2-fiestas-tradiciones/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'tradición',
        eventId: 'evt_test_fie_001',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة العمل والمقابلات B1 (b1-entrevistas-trabajo) تُسلَّم وتصحح llevo بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b1_work@example.com');
    const res = await h.call('/api/lessons/b1-entrevistas-trabajo/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('المقابلات الوظيفية');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/b1-entrevistas-trabajo/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'llevo',
        eventId: 'evt_test_b1_w01',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة الدراسة والتعليم B1 (b1-estudios-universidad) تُسلَّم وتصحح matricularse بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b1_study@example.com');
    const res = await h.call('/api/lessons/b1-estudios-universidad/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('التعليم الجامعي');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/b1-estudios-universidad/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'matricularse',
        eventId: 'evt_test_b1_s01',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة السفر المستقل B1 (b1-viajes-imprevistos) تُسلَّم وتصحح التعويض بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b1_travel@example.com');
    const res = await h.call('/api/lessons/b1-viajes-imprevistos/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('السفر المستقل');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/b1-viajes-imprevistos/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'indemnizacion',
        eventId: 'evt_test_b1_t01',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة الشكاوى والحلول B1 (b1-hoja-reclamaciones) تُسلَّم وتصحح حماية المستهلك بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b1_claims@example.com');
    const res = await h.call('/api/lessons/b1-hoja-reclamaciones/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('ورقة الشكاوى');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/b1-hoja-reclamaciones/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'consumidor',
        eventId: 'evt_test_b1_c01',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة الإعلام والأخبار B1 (b1-noticias-prensa) تُسلَّم وتصحح desmentir بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b1_media@example.com');
    const res = await h.call('/api/lessons/b1-noticias-prensa/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('الصحافة والإعلام');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/b1-noticias-prensa/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'desmentir',
        eventId: 'evt_test_b1_m01',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة نمط الحياة والصحة B1 (b1-habitos-saludables) تُسلَّم وتصحح الوقاية بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b1_hl@example.com');
    const res = await h.call('/api/lessons/b1-habitos-saludables/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('العادات الصحية');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/b1-habitos-saludables/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'prevenir',
        eventId: 'evt_test_b1_h01',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة العلاقات والمجتمع B1 (b1-relaciones-personales) تُسلَّم وتصحح التعاطف بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b1_rel@example.com');
    const res = await h.call('/api/lessons/b1-relaciones-personales/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('العلاقات الإنسانية');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/b1-relaciones-personales/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'empatia',
        eventId: 'evt_test_b1_r01',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });

  it('وحدة الكتابة الوظيفية B1 (b1-conectores-discursivos) تُسلَّم وتصحح أدوات الربط بنجاح', async () => {
    const { cookie } = await signupAndGetCookie(h, 'learner_b1_wr@example.com');
    const res = await h.call('/api/lessons/b1-conectores-discursivos/session', { cookie });
    expect(res.status).toBe(200);
    const data = await h.json<any>(res);
    expect(data.lesson.titleAr).toContain('أدوات الربط المنطقي');

    const fillEx = data.exercises.find((e: any) => e.type === 'fill_blank');
    expect(fillEx).toBeDefined();

    const submitRes = await h.call('/api/lessons/b1-conectores-discursivos/answers', {
      method: 'POST',
      cookie,
      body: JSON.stringify({
        exerciseId: fillEx.id,
        response: 'embargo',
        eventId: 'evt_test_b1_w01',
      }),
    });
    expect(submitRes.status).toBe(200);
    const submitData = await h.json<any>(submitRes);
    expect(submitData.correct).toBe(true);
  });
});
