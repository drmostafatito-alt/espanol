/* تدفق نشر الدروس — بوابات + مسار اعتماد، بلا تجاوز وبلا أسماء مفبركة */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  PublishFlowError,
  validateSlug,
  assertLocalBase,
  validateReviewers,
  runGates,
  runPublishFlow,
// @ts-ignore — وحدة .mjs مشتركة مع الأدوات
} from '../tools/lib/publish-flow.mjs';

const ROOT = join(import.meta.dirname, '..');
const BASE = 'http://127.0.0.1:8787';
const COOKIE = 'ses=test-cookie-value';
const REVIEWERS = { spanishReviewer: 'مراجع إسبانية حقيقي', translationReviewer: 'مراجع ترجمة حقيقي' };

function stubFetch(scenarios: Array<{ status: number; body: unknown }>) {
  const calls: Array<{ url: string; init: Record<string, unknown> }> = [];
  const fn = async (url: string, init: Record<string, unknown>) => {
    calls.push({ url, init });
    const next = scenarios[calls.length - 1] ?? scenarios[scenarios.length - 1]!;
    return {
      status: next.status,
      text: async () => JSON.stringify(next.body),
    };
  };
  return { fn: fn as unknown as typeof fetch, calls };
}

describe('التحقق من المدخلات', () => {
  it('يرفض معرّفات وقواعد غير صالحة', () => {
    expect(() => validateSlug('BAD_SLUG')).toThrow(PublishFlowError);
    expect(() => validateSlug('ab')).toThrow(PublishFlowError);
    expect(validateSlug('prea1-abecedario')).toBe('prea1-abecedario');
    expect(() => assertLocalBase('https://example.workers.dev')).toThrow(PublishFlowError);
    expect(() => assertLocalBase('http://evil.example.com')).toThrow(PublishFlowError);
    expect(assertLocalBase('http://127.0.0.1:8787/')).toBe('http://127.0.0.1:8787');
    expect(assertLocalBase('http://localhost:8787')).toBe('http://localhost:8787');
  });

  it('يرفض غياب أسماء المراجعين أو تجاوزها 80 حرفًا', () => {
    expect(() => validateReviewers('', 'x')).toThrow(PublishFlowError);
    expect(() => validateReviewers('x', '')).toThrow(PublishFlowError);
    expect(() => validateReviewers('s'.repeat(81), 't')).toThrow(PublishFlowError);
    expect(validateReviewers('  س  ', '  ت  ')).toEqual({ spanishReviewer: 'س', translationReviewer: 'ت' });
  });
});

describe('تدفق الاعتماد ثم النشر', () => {
  it('يرسل الاعتماد ثم النشر بالترتيب، بالكوكي والأسماء', async () => {
    const { fn, calls } = stubFetch([
      { status: 200, body: { slug: 'prea1-abecedario', reviewState: 'approved' } },
      { status: 200, body: { slug: 'prea1-abecedario', status: 'published' } },
    ]);
    const res = await runPublishFlow({ base: BASE, slug: 'prea1-abecedario', cookie: COOKIE, ...REVIEWERS, fetchFn: fn });
    expect(res.steps).toHaveLength(2);
    expect(calls[0]!.url).toBe(`${BASE}/api/admin/lessons/prea1-abecedario/review`);
    expect(calls[1]!.url).toBe(`${BASE}/api/admin/lessons/prea1-abecedario/publish`);
    expect(JSON.parse(calls[0]!.init.body as string)).toEqual(REVIEWERS);
    expect((calls[0]!.init.headers as Record<string, string>).Cookie).toBe(COOKIE);
    expect((calls[0]!.init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
  });

  it('فشل الاعتماد يمنع طلب النشر تمامًا', async () => {
    const { fn, calls } = stubFetch([{ status: 409, body: { error: { code: 'NOT_REVIEWED', message: 'لا يُنشر' } } }]);
    await expect(runPublishFlow({ base: BASE, slug: 'prea1-abecedario', cookie: COOKIE, ...REVIEWERS, fetchFn: fn }))
      .rejects.toThrow(/review/);
    expect(calls).toHaveLength(1);
  });

  it('فشل النشر بعد اعتماد ناجح يُبلَّغ بلا إعادة محاولة صامتة', async () => {
    const { fn, calls } = stubFetch([
      { status: 200, body: { slug: 'prea1-abecedario', reviewState: 'approved' } },
      { status: 403, body: { error: { code: 'FORBIDDEN', message: 'ممنوع' } } },
    ]);
    await expect(runPublishFlow({ base: BASE, slug: 'prea1-abecedario', cookie: COOKIE, ...REVIEWERS, fetchFn: fn }))
      .rejects.toThrow(/publish/);
    expect(calls).toHaveLength(2);
  });

  it('dry-run لا يرسل أي طلب ولا يشترط كوكي أو أسماء', async () => {
    const { fn, calls } = stubFetch([]);
    const res = await runPublishFlow({ base: BASE, slug: 'prea1-abecedario', cookie: '', fetchFn: fn, dryRun: true });
    expect(res.dryRun).toBe(true);
    expect(calls).toHaveLength(0);
    expect(res.plan).toHaveLength(2);
  });

  it('الوضع الحقيقي بلا كوكي مرفوض قبل أي طلب', async () => {
    const { fn, calls } = stubFetch([]);
    await expect(runPublishFlow({ base: BASE, slug: 'prea1-abecedario', cookie: '', ...REVIEWERS, fetchFn: fn }))
      .rejects.toThrow(/auth/);
    expect(calls).toHaveLength(0);
  });
});

describe('البوابات الآلية', () => {
  const stubGatesOk = () => ({ validateContent: 0, integrity: 0, curriculum: 0 });

  it('تجتاز على المحتوى الحقيقي بلا أخطاء تدقيق للدرس', () => {
    const res = runGates({
      root: ROOT,
      contentDir: join(ROOT, 'content/drafts'),
      slug: 'prea1-abecedario',
      runGate: stubGatesOk,
    });
    expect(res.file.endsWith('lesson-prea1-abecedario.json')).toBe(true);
  });

  it('ترفض درسًا فاسدًا (خيار بلا isCorrect) وتسمّي الدرس', () => {
    const dir = mkdtempSync(join(tmpdir(), 'espanol-publish-gates-'));
    try {
      cpSync(join(ROOT, 'content/drafts'), dir, { recursive: true });
      const file = join(dir, 'prea1/lesson-prea1-abecedario.json');
      const data = JSON.parse(readFileSync(file, 'utf8'));
      const ex = data.lesson.exercises.find((e: { options?: Array<Record<string, unknown>> }) => e.options?.length);
      const target = (ex.options as Array<Record<string, unknown>>)[1];
      expect(target, 'خيار ثانٍ موجود للفساد المقصود').toBeDefined();
      delete target!.isCorrect;
      writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
      expect(() => runGates({ root: ROOT, contentDir: dir, slug: 'prea1-abecedario', runGate: stubGatesOk }))
        .toThrowError(/prea1-abecedario/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('ترفض عند فشل بوابة شاملة', () => {
    expect(() => runGates({
      root: ROOT,
      contentDir: join(ROOT, 'content/drafts'),
      slug: 'prea1-abecedario',
      runGate: () => ({ validateContent: 1, integrity: 0, curriculum: 0 }),
    })).toThrowError(/validateContent/);
  });

  it('ترفض درسًا غير موجود', () => {
    expect(() => runGates({
      root: ROOT,
      contentDir: join(ROOT, 'content/drafts'),
      slug: 'no-such-lesson',
      runGate: stubGatesOk,
    })).toThrowError(/غير موجود/);
  });
});

describe('واجهة سطر الأوامر', () => {
  it('dry-run ينجح بلا كوكي ويطبع الخطة', () => {
    const r = spawnSync(process.execPath, ['tools/publish-lesson.mjs', '--slug', 'prea1-abecedario', '--dry-run'], {
      cwd: ROOT, encoding: 'utf8', timeout: 120_000,
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('dry-run');
    expect(r.stdout).toContain('/api/admin/lessons/prea1-abecedario/review');
    expect(r.stdout).toContain('/api/admin/lessons/prea1-abecedario/publish');
  }, 120_000);

  it('بلا كوكي يُرفض فورًا قبل البوابات', () => {
    const r = spawnSync(process.execPath, ['tools/publish-lesson.mjs', '--slug', 'prea1-abecedario', '--spanish-reviewer', 'س', '--translation-reviewer', 'ت'], {
      cwd: ROOT, encoding: 'utf8', timeout: 30_000, env: { ...process.env, PUBLISH_SESSION_COOKIE: '' },
    });
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('كوكي');
  });
});
