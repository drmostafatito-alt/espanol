/**
 * حراس رجوع لبنود التدقيق الشامل (docs/26_COMPREHENSIVE_AUDIT.md):
 * AUD-02 دورة النشر، AUD-03 خلط الخيارات، AUD-04 تنقية المحتوى العام،
 * AUD-07 روابط المفردات عابرة المجلدات، AUD-09 أمثلة البطاقات، AUD-11 السلسلة.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { join } from 'node:path';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { makeHarness, signupAndGetCookie, VALID_EMAIL, type Harness } from './harness';
import { correctAnswer, importExemplars } from './content-fixture';
import { seedFromString, mulberry32 } from '../src/worker/lib/shuffle';
import { shuffleSecure, setRandomSourceForTests } from '../src/worker/lib/random';
import { computeStreaks } from '../src/worker/routes/learn';
import { sanitizePublicContent } from '../src/worker/routes/content';
// @ts-expect-error أداة Node بلا أنواع — نفس مولّد الاستيراد الحقيقي
import { buildContentPlan, buildLexiconIndex, collectGlobalLinks, linkInsertStatement } from '../tools/lib/content-plan.mjs';

let h: Harness | null = null;
// استعادة مصدر العشوائية الآمن دائمًا بعد كل اختبار — حتى لو فشل تأكيد في
// منتصفه — فلا يتسرّب مصدر مبذور لاختبار لاحق في نفس العملية (نظافة DEFECT-1)
afterEach(() => { setRandomSourceForTests(null); h?.close(); h = null; });

describe('AUD-03/DEFECT-1: خلط آمن متوازن (عشوائية خادمية، والحقن للاختبار فقط)', () => {
  it('حتمي عند حقن مصدر اختبار مبذور، وتبديل كامل لا يمسّ المصفوفة الأصلية', () => {
    const src = [1, 2, 3, 4];
    const run = () => shuffleSecure(src, mulberry32(seedFromString('seed-1')));
    expect(run()).toEqual(run());
    expect([...run()].sort((a, b) => a - b)).toEqual(src);
    expect(src).toEqual([1, 2, 3, 4]);
  });

  it('موضع العنصر الأول لا يحتكره موضع واحد عبر بذور كثيرة', () => {
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < 400; i++) {
      const out = shuffleSecure(['correct', 'x', 'y', 'z'], mulberry32(seedFromString(`balance-${i}`)));
      counts[out.indexOf('correct')]!++;
    }
    for (const c of counts) {
      expect(c).toBeGreaterThan(50); // المتوقع ~100
      expect(c).toBeLessThan(160);
    }
  });

  it('خيارات جلسة الدرس لا تضع الصحيح أولًا دائمًا وتختلف بين مستخدمين', async () => {
    // حقن مصدر مبذور يجعل هذا الاختبار حتميًا؛ الإنتاج يستخدم الآمن دائمًا
    setRandomSourceForTests(mulberry32(seedFromString('audit-03-session')));
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const { cookie: c1 } = await signupAndGetCookie(h, 'u1@example.com');
    const { cookie: c2 } = await signupAndGetCookie(h, 'u2@example.com');
    type Session = { exercises: { id: string; options: { id: string }[] }[] };
    const s1 = await h.json<Session>(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie: c1 }));
    const s2 = await h.json<Session>(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie: c2 }));

    const choiceExs = s1.exercises.filter(e => e.options.length >= 3);
    expect(choiceExs.length).toBeGreaterThan(0);
    const correctFirstCount = choiceExs.filter(e => e.options[0]!.id === correctAnswer(h!, e.id)).length;
    expect(correctFirstCount).toBeLessThan(choiceExs.length); // ليست «الأول دائمًا»
    const order1 = s1.exercises.flatMap(e => e.options.map(o => o.id)).join(',');
    const order2 = s2.exercises.flatMap(e => e.options.map(o => o.id)).join(',');
    expect(order1).not.toBe(order2); // ترتيب مختلف لمستخدم مختلف
    // DEFECT-1: الترتيب عشوائي لكل طلب (لا استقرار حتمي عند إعادة التحميل) —
    // المقابل الأمني مقصود، ومجموعة المعرّفات نفسها والتصحيح بالمعرّف لا يتأثر.
    const s1b = await h.json<Session>(await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie: c1 }));
    expect(new Set(s1b.exercises.flatMap(e => e.options.map(o => o.id))))
      .toEqual(new Set(order1.split(',').filter(Boolean)));
  });
});

describe('AUD-02/AUD-04: دورة المراجعة والنشر وتنقية العرض العام', () => {
  const SLUG = 'a1-un-cafe-por-favor';

  async function setup() {
    // بلا ALLOW_UNREVIEWED_CONTENT: رؤية إنتاجية (المنشور فقط للعامة)
    h = makeHarness({});
    importExemplars(h);
    const { cookie: admin } = await signupAndGetCookie(h, 'admin@example.com');
    h.db.raw.prepare("UPDATE users SET role_id = (SELECT id FROM roles WHERE code='admin') WHERE email_normalized = ?").run('admin@example.com');
    // صلاحيات الجلسة تُقرأ من القاعدة لكل طلب؛ إعادة الدخول لا حاجة لها هنا
    const { cookie: learner } = await signupAndGetCookie(h, VALID_EMAIL);
    return { admin: admin!, learner: learner! };
  }

  it('درس مسودة لا يظهر للعامة (404) ويستحيل نشره قبل المراجعة (409)', async () => {
    const { admin } = await setup();
    const pub = await h!.call(`/api/content/lessons/${SLUG}`, {});
    expect(pub.status).toBe(404);

    const tryPublish = await h!.call(`/api/admin/lessons/${SLUG}/publish`, { method: 'POST', cookie: admin });
    expect(tryPublish.status).toBe(409);
    expect((await h!.json(tryPublish)).error.code).toBe('NOT_REVIEWED');
  });

  it('متعلم عادي لا يملك مسارات دورة الحياة (403)', async () => {
    const { learner } = await setup();
    const res = await h!.call(`/api/admin/lessons/${SLUG}/publish`, { method: 'POST', cookie: learner });
    expect(res.status).toBe(403);
  });

  it('بعد مراجعة باسمين ونشر: العرض العام بلا أي مفتاح إجابة، والمعاينة الإدارية كاملة', async () => {
    const { admin } = await setup();

    const badReview = await h!.call(`/api/admin/lessons/${SLUG}/review`, {
      method: 'POST', cookie: admin, body: JSON.stringify({ spanishReviewer: 'مراجع' }),
    });
    expect(badReview.status).toBe(400); // اسما المراجعَين شرط

    const review = await h!.call(`/api/admin/lessons/${SLUG}/review`, {
      method: 'POST', cookie: admin,
      body: JSON.stringify({ spanishReviewer: 'مراجعة إسبانية اختبارية', translationReviewer: 'مراجعة ترجمة اختبارية' }),
    });
    expect(review.status).toBe(200);

    const publish = await h!.call(`/api/admin/lessons/${SLUG}/publish`, { method: 'POST', cookie: admin });
    expect(publish.status).toBe(200);

    // نشر الدرس ينشر وحدته وبرنامجه أيضًا، وإلا بقي مخفيًا من كتالوج المسارات
    // رغم أن جلسة الدرس والبحث يقبلانه كمنشور.
    const ancestors = h!.db.raw.prepare(
      `SELECT u.status AS unit_status, p.status AS program_status
       FROM lessons l
       JOIN units u ON u.id = l.unit_id
       JOIN programs p ON p.id = u.program_id
       WHERE l.slug = ?`,
    ).get(SLUG) as { unit_status: string; program_status: string };
    expect(ancestors).toEqual({ unit_status: 'published', program_status: 'published' });
    const paths = await h!.json<{ paths: { slug: string; lessons_count: number; units_count: number }[] }>(
      await h!.call('/api/content/paths', {}),
    );
    const mainTrack = paths.paths.find(p => p.slug === 'main-track');
    expect(mainTrack?.lessons_count).toBe(1);
    expect(mainTrack?.units_count).toBe(1);

    const pubRes = await h!.call(`/api/content/lessons/${SLUG}`, {});
    expect(pubRes.status).toBe(200);
    const pubRaw = JSON.stringify(await h!.json(pubRes));
    for (const leak of ['answerKey', 'isCorrect', 'errorFeedback', 'correctOptionIds', 'distractorRationaleAr']) {
      expect(pubRaw, leak).not.toContain(`"${leak}"`);
    }

    const unpublish = await h!.call(`/api/admin/lessons/${SLUG}/unpublish`, { method: 'POST', cookie: admin });
    expect(unpublish.status).toBe(200);
    const gone = await h!.call(`/api/content/lessons/${SLUG}`, {});
    expect(gone.status).toBe(404);

    const auditCount = h!.db.raw.prepare("SELECT COUNT(*) AS n FROM admin_audit_logs WHERE action LIKE 'content.%'").get() as { n: number };
    expect(auditCount.n).toBeGreaterThanOrEqual(3); // review + publish + unpublish
  });
});


describe('VER-01: فصل ما قبل الإجابة عن التغذية الراجعة', () => {
  it('التنقية تحذف شرح التمرين وتبقي شرح القواعد التعليمي', () => {
    const dirty = {
      pedagogy: { grammarPoints: [{ titleAr: 'قاعدة', explanationAr: 'شرح تعليمي قبل الدرس' }] },
      exercises: [{
        id: 'e1', type: 'word_choice', explanationAr: 'الإجابة الصحيحة هي X لأن...',
        options: [{ id: 'a', text: 'X', isCorrect: true }],
        answerKey: { correctOptionIds: ['a'], accepted: ['X'], modelAnswer: 'X' },
      }],
    };
    const clean = sanitizePublicContent(dirty) as any;
    expect(clean.exercises[0].explanationAr).toBeUndefined();
    expect(clean.exercises[0].answerKey).toBeUndefined();
    expect(clean.exercises[0].options[0].isCorrect).toBeUndefined();
    expect(clean.pedagogy.grammarPoints[0].explanationAr).toBe('شرح تعليمي قبل الدرس');
  });

  it('حمولة الجلسة قبل الإجابة: لا شرح ولا مفتاح ولا جملة الترتيب الصحيحة', async () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const { cookie } = await signupAndGetCookie(h, 'leak@example.com');
    const res = await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie });
    expect(res.status).toBe(200);
    const raw = JSON.stringify(await h.json(res));
    for (const leak of ['explanationAr', 'answerKey', 'correctOptionIds', '"accepted"', 'isCorrect']) {
      expect(raw, leak).not.toContain(leak);
    }
    const s2 = await h.json<{ exercises: { id: string; type: string; speechEs?: string | null }[] }>(
      await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }),
    );
    const wo = s2.exercises.find(e => e.type === 'word_order')!;
    const key = correctAnswer(h, wo.id) as { tokens: string[] };
    expect(wo.speechEs ?? null).not.toBe(key.tokens.join(' ')); // لا تُشتق من الإجابة
  });

  it('بعد التسليم فقط: استجابة التصحيح تحمل الشرح التعليمي كاملًا', async () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const { cookie } = await signupAndGetCookie(h, 'fb@example.com');
    const s = await h.json<{ exercises: { id: string; options: { id: string }[] }[] }>(
      await h.call('/api/lessons/prea1-hola-me-llamo/session', { cookie }),
    );
    const ex = s.exercises.find(e => e.options.length >= 2)!;
    const res = await h.call('/api/lessons/prea1-hola-me-llamo/answers', {
      method: 'POST', cookie,
      body: JSON.stringify({ eventId: 'ev_ver01_feedback_0001', exerciseId: ex.id, response: { optionId: ex.options[0]!.id } }),
    });
    expect(res.status).toBe(200);
    const data = await h.json<{ explanationAr?: string }>(res);
    expect(typeof data.explanationAr).toBe('string');
    expect(data.explanationAr!.length).toBeGreaterThan(5);
  });
});

describe('AUD-07/AUD-09: روابط وأمثلة المستورِد', () => {
  it('إحالات العبارات بعلامات الاستفهام الإسبانية تُربط بالمدخل المُطبَّع', () => {
    const index = buildLexiconIndex([join(process.cwd(), 'content')]) as { resolve: (word: string) => string | null };
    expect(index.resolve('¿de dónde?')).not.toBeNull();
    expect(index.resolve('¿cómo está usted?')).not.toBeNull();
  });

  it('درس الأرقام: كل مفرداته مرتبطة وإتمامه ينشئ بطاقة SRS لكل مدخل', async () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ALLOW_PUBLIC_SIGNUP: 'true' });
    const lexiconDirs = [join(process.cwd(), 'content')];
    const corePlan = buildContentPlan(join(process.cwd(), 'content/drafts/core-vocab'), {
      existingVersions: {}, lexiconDirs,
    }) as { statements: string[]; errors: string[] };
    const a1Plan = buildContentPlan(join(process.cwd(), 'content/drafts/a1'), {
      existingVersions: {}, lexiconDirs,
    }) as {
      statements: string[];
      errors: string[];
      answers: Record<string, unknown>;
      unresolvedVocabRefs: { lesson: string; word: string; role: string }[];
    };
    expect(corePlan.errors).toEqual([]);
    expect(a1Plan.errors).toEqual([]);
    expect(a1Plan.unresolvedVocabRefs.filter(r => r.lesson === 'a1-numeros-20-100')).toEqual([]);

    h.db.raw.exec(corePlan.statements.join(';\n') + ';');
    h.db.raw.exec(a1Plan.statements.join(';\n') + ';');

    const linked = h.db.raw.prepare(
      `SELECT ve.headword_normalized AS word, lv.role
       FROM lesson_vocabulary lv
       JOIN lessons l ON l.id = lv.lesson_id
       JOIN vocabulary_entries ve ON ve.id = lv.entry_id
       WHERE l.slug = 'a1-numeros-20-100'
       ORDER BY ve.headword_normalized`,
    ).all() as { word: string; role: string }[];
    expect(linked).toHaveLength(15);
    expect(linked.filter(r => r.role === 'new').map(r => r.word)).toEqual(expect.arrayContaining([
      'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa', 'cien', 'euro',
    ]));

    const { cookie } = await signupAndGetCookie(h, 'numbers-srs@example.com');
    const session = await h.json<{ exercises: { id: string; mode: string }[] }>(
      await h.call('/api/lessons/a1-numeros-20-100/session', { cookie }),
    );
    expect(session.exercises).toHaveLength(6);

    for (const [i, ex] of session.exercises.entries()) {
      const response = ex.mode === 'graded' ? a1Plan.answers[ex.id] : 'Cuesta cien euros en total.';
      expect(response, ex.id).toBeDefined();
      const submitted = await h.call('/api/lessons/a1-numeros-20-100/answers', {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: `numbers_srs_answer_${i}`, exerciseId: ex.id, response }),
      });
      expect(submitted.status, ex.id).toBe(200);
      if (ex.mode === 'graded') {
        expect((await h.json<{ correct: boolean }>(submitted)).correct, ex.id).toBe(true);
      }
    }

    const complete = await h.json<{ passed: boolean; reviewCardsCreated: number }>(
      await h.call('/api/lessons/a1-numeros-20-100/complete', {
        method: 'POST', cookie,
        body: JSON.stringify({ eventId: 'numbers_srs_complete_1' }),
      }),
    );
    expect(complete.passed).toBe(true);
    expect(complete.reviewCardsCreated).toBe(15);

    const cardWords = h.db.raw.prepare(
      `SELECT ve.headword_normalized AS word
       FROM review_schedule rs
       JOIN vocabulary_entries ve ON ve.id = rs.item_id
       WHERE rs.item_type = 'vocab'
       ORDER BY ve.headword_normalized`,
    ).all() as { word: string }[];
    expect(cardWords.map(r => r.word)).toEqual(linked.map(r => r.word));
  });

  it('حلّ الإحالات من جذر المحتوى: دروس a2 ترتبط بمفردات core-vocab', () => {
    const plan = buildContentPlan(join(process.cwd(), 'content/drafts/a2'), {
      existingVersions: {},
      lexiconDirs: [join(process.cwd(), 'content')],
    }) as { counters: Record<string, number>; unresolvedVocabRefs: unknown[] };
    // قبل الإصلاح كانت روابط مجلد بلا حزم مفردات = صفرًا بصمت
    expect(plan.counters.vocabLinks).toBeGreaterThan(200);
    expect(Array.isArray(plan.unresolvedVocabRefs)).toBe(true);
  });

  it('أمثلة المعاني تُستورَد إلى sentences وتُربط بالمعنى', () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const row = h.db.raw.prepare(
      'SELECT COUNT(*) AS n FROM vocabulary_senses WHERE example_sentence_id IS NOT NULL',
    ).get() as { n: number };
    expect(row.n).toBeGreaterThan(0);
    const s = h.db.raw.prepare('SELECT COUNT(*) AS n FROM sentences').get() as { n: number };
    expect(s.n).toBeGreaterThan(0);
  });
});


describe('ENVIRONMENT فاشل-بأمان (مخاطر متبقية)', () => {
  const envWith = (v: string) => ({ ENVIRONMENT: v, ALLOW_UNREVIEWED_CONTENT: 'true' }) as never;

  it('قيم غير معروفة/مخطوءة تُعامَل كإنتاج: إطارات ممنوعة ومسودات لا تُخدَم', async () => {
    const { securityHeadersFor } = await import('../src/worker/lib/http');
    const { allowUnreviewedContent } = await import('../src/worker/lib/content-access');
    for (const v of ['prod', 'PRODUCTION', 'Production', '', 'live']) {
      expect(securityHeadersFor(envWith(v))['X-Frame-Options']).toBeDefined();
      expect(allowUnreviewedContent(envWith(v))).toBe(false);
    }
  });

  it('التطوير/الاختبار الصريحان يبقيان مريحين كما قبل (لا كسر لتدفق التطوير)', async () => {
    const { securityHeadersFor } = await import('../src/worker/lib/http');
    const { allowUnreviewedContent } = await import('../src/worker/lib/content-access');
    for (const v of ['development', 'test']) {
      expect(securityHeadersFor(envWith(v))['X-Frame-Options']).toBeUndefined();
      expect(allowUnreviewedContent(envWith(v))).toBe(true);
    }
  });
});

describe('VER-04: مرور الربط الشامل يلغي حساسية ترتيب الاستيراد', () => {
  it('درس يُستورَد قبل حزمة كلماته: بلا المرور النهائي لا رابط، وبعده يوجد', () => {
    h = makeHarness({});
    const root = mkdtempSync(join(tmpdir(), 'ver04-'));
    try {
      const lessonsDir = join(root, 'lessons-dir');
      const vocabDir = join(root, 'vocab-dir');
      mkdirSync(lessonsDir, { recursive: true });
      mkdirSync(vocabDir, { recursive: true });
      writeFileSync(join(lessonsDir, 'paths.json'), JSON.stringify({
        programs: [{ slug: 'main-track', titleAr: 'مسار اختبار', units: [{ slug: 'u1', titleAr: 'وحدة', lessons: ['t-leccion'] }] }],
      }));
      writeFileSync(join(lessonsDir, 'lesson-t.json'), JSON.stringify({
        lesson: {
          slug: 't-leccion', titleAr: 'درس اختبار', level: 'A1', unitSlug: 'u1',
          objectiveAr: 'هدف', newVocabulary: ['palabraclave'], reviewVocabulary: [], exercises: [],
        },
      }));
      writeFileSync(join(vocabDir, 'vocab-t.json'), JSON.stringify({
        bundleSlug: 't-bundle', titleAr: 'حزمة اختبار',
        entries: [{
          headword: 'palabraclave', normalized: 'palabraclave', level: 'A1', kind: 'word',
          senses: [{ senseNo: 1, meaningArFusha: 'كلمة اختبار', exampleEs: 'La palabraclave es útil.', exampleAr: 'الكلمة مفيدة.' }],
        }],
      }));

      const exec = (stmts: string[]) => { for (const st of stmts) h!.db.raw.prepare(st).run(); };
      const linkCount = () => (h!.db.raw.prepare('SELECT COUNT(*) AS n FROM lesson_vocabulary').get() as { n: number }).n;

      // الترتيب السيئ: الدروس أولًا (روابطها الداخلية تُتخطى بـEXISTS)، ثم المفردات
      const lessonsPlan = buildContentPlan(lessonsDir, { existingVersions: {}, lexiconDirs: [root] }) as { statements: string[] };
      exec(lessonsPlan.statements);
      const vocabPlan = buildContentPlan(vocabDir, { existingVersions: {}, lexiconDirs: [root] }) as { statements: string[] };
      exec(vocabPlan.statements);
      expect(linkCount()).toBe(0); // هذا هو الفقد الصامت القديم بعينه

      // المرور النهائي الشامل من جذر المحتوى — كما يفعله المستورِد الآن
      const { links } = collectGlobalLinks(root) as { links: { lessonId: string; entryId: string; role: string }[] };
      expect(links).toHaveLength(1);
      exec(links.map((l: { lessonId: string; entryId: string; role: string }) => linkInsertStatement(l)));
      expect(linkCount()).toBe(1);
      // إعادة المرور لا تكرر (idempotent)
      exec(links.map((l: { lessonId: string; entryId: string; role: string }) => linkInsertStatement(l)));
      expect(linkCount()).toBe(1);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('AUD-11: حساب سلسلة الأيام (نقي)', () => {
  it('أيام متتالية تنتهي اليوم', () => {
    expect(computeStreaks(['2026-10-24', '2026-10-25', '2026-10-26'], '2026-10-26'))
      .toEqual({ current: 3, longest: 3 });
  });
  it('يوم أمس لا يكسر السلسلة الحالية، وفجوة تكسرها دون الأطول', () => {
    expect(computeStreaks(['2026-10-20', '2026-10-21', '2026-10-25'], '2026-10-26'))
      .toEqual({ current: 1, longest: 2 });
    expect(computeStreaks(['2026-10-20', '2026-10-21'], '2026-10-26'))
      .toEqual({ current: 0, longest: 2 });
  });
  it('بلا نشاط أصفار، والتكرار لا يضخّم', () => {
    expect(computeStreaks([], '2026-10-26')).toEqual({ current: 0, longest: 0 });
    expect(computeStreaks(['2026-10-26', '2026-10-26'], '2026-10-26')).toEqual({ current: 1, longest: 1 });
  });
});
