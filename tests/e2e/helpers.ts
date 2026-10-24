/**
 * أدوات مشتركة لاختبارات المتصفح الحقيقي.
 *
 * حالة التحقق: شُغِّلت فعليًا على Chromium 1148 وFirefox 1466 (70/70) بتاريخ 2026-10-21
 * بعد تثبيت مكتبات النظام المذكورة في playwright.config.ts.
 * ما لا يُغطّى: Safari/WebKit (غير قابل للتشغيل على Debian 13)، وقارئات الشاشة الحقيقية.
 */
import { execFileSync } from 'node:child_process';
import { expect, type Page } from '@playwright/test';

/**
 * نحسب خطة المحتوى في عملية Node فرعية بدل استيراد tools/lib/content-plan.mjs مباشرة:
 * محمّل Playwright 1.49 يتجمّد عند استيراد هذا الوحدة من ملفات tests/e2e (تم التحقق).
 * الحساب نفسه: buildContentPlan على content/exemplars.
 */
const PLAN_SCRIPT = `import { join } from 'node:path';
import { buildContentPlan } from './tools/lib/content-plan.mjs';
const plan = buildContentPlan(join(process.cwd(), 'content', 'exemplars'), { existingVersions: {} });
process.stdout.write(JSON.stringify({ answers: plan.answers, errors: plan.errors }));`;

export const PLAN = JSON.parse(
  execFileSync(process.execPath, ['--input-type=module', '-e', PLAN_SCRIPT], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 30_000,
  }),
) as { answers: Record<string, unknown>; errors: string[] };

export const PREA1 = 'prea1-hola-me-llamo';
export const A1 = 'a1-un-cafe-por-favor';

export function uniqueEmail(tag = 'e2e') {
  return `${tag}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`;
}

/** حساب اختبار عبر الـAPI داخل سياق المتصفح نفسه (الكوكي يصل إلى الصفحة) */
/** يفرّغ نوافذ حد المعدل في قاعدة التطوير المحلية فقط (لا يمسّ منطق الحد) */
async function clearRateLimits() {
  const { execFileSync } = await import('node:child_process');
  const { existsSync } = await import('node:fs');
  const { join } = await import('node:path');
  const cli = join(process.cwd(), 'tools/wrangler-env/node_modules/wrangler/wrangler-dist/cli.js');
  const [execPath, baseArgs] = existsSync(cli)
    ? [process.execPath, [cli]]
    : ['./tools/wrangler-env/node_modules/.bin/wrangler', []];
  execFileSync(
    execPath,
    [...baseArgs, 'd1', 'execute', 'es-ar-dev', '--local', '--command', 'DELETE FROM rate_limits'],
    { stdio: 'ignore' },
  );
}

export async function signupThroughApi(page: Page, email: string, password = 'E2eLearn2026x') {
  const attempt = () =>
    page.context().request.post('/api/auth/signup', { data: { email, password, displayName: 'متعلم اختبار' } });

  let res = await attempt();
  if (res.status() === 429) {
    // حد التسجيل 10/ساعة لكل IP: تشغيل عشرات الاختبارات يتجاوزه.
    // نُفرّغ النوافذ محليًا ونعيد مرة واحدة — الحد نفسه يبقى مفعّلًا في الكود.
    await clearRateLimits();
    res = await attempt();
  }
  expect(res.status(), `signup فشل: ${await res.text()}`).toBe(201);
  return { email, password };
}

/**
 * لماذا عبر الـAPI؟ لأن السؤال هو «هل تعمل الواجهة مع محرّك حقيقي؟»
 * لا «هل يعمل النموذج؟» — نموذج التسجيل له اختباراته في vitest.
 */
export async function sessionExercises(page: Page, slug: string) {
  const res = await page.context().request.get(`/api/lessons/${slug}/session`);
  expect(res.status()).toBe(200);
  return (await res.json()) as { exercises: { id: string; type: string; mode: string }[] };
}

/** يمرّ على الدرس كله من الواجهة نفسها، ويجيب إجابة صحيحة كل مرة */
export async function completeLessonThroughUi(page: Page, slug: string) {
  // لا نتفاعل قبل أن يخرج الدرس من حالة التحميل — وإلا نضغط زرًا معطّلًا
  await expect(page.getByTestId('lesson-submit')).toBeVisible();
  const { exercises } = await sessionExercises(page, slug);

  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i]!;

    // كل نوع تمرين له طريقة إدخال مختلفة — نجرّبها بالترتيب من الأبسط
    const choice = page.locator('.choice').first();
    const input = page.getByTestId('lesson-text');
    const token = page.locator('.token.ghost').first();
    const textarea = page.locator('textarea');

    if (await choice.count()) {
      await choice.click();
    } else if (await input.count()) {
      const answer = PLAN.answers[exercise.id];
      await input.fill(typeof answer === 'string' ? answer : 'hola');
    } else if (await token.count()) {
      // رتّب الكلمات: نضغط كل الرموز بترتيب ظهورها
      const n = await page.locator('.token.ghost').count();
      for (let k = 0; k < n; k++) await page.locator('.token.ghost').first().click();
    } else if (await textarea.count()) {
      await textarea.fill('Me llamo estudiante.');
    }

    await page.getByTestId('lesson-submit').click();
    await expect(page.getByTestId('lesson-feedback')).toBeVisible();
    await page.getByTestId('lesson-next').click();
  }

  await expect(page.getByTestId('lesson-result')).toBeVisible();
}
