/**
 * رحلة استعادة الوصول في متصفح حقيقي (Chromium): حساب حقيقي → «نسيت كلمة المرور»
 * → إعادة تعيين من الرابط → دخول بالكلمة الجديدة → الكلمة القديمة تفشل →
 * طلب تحقق البريد → فتح الرابط → تأكيد → إعادة استخدام الرابط تُرفض.
 *
 * المصدر الوحيد للرمز: صندوق البريد التطويري (`/api/dev/mail-outbox`)، لأن القاعدة
 * تحفظ sha256 فقط — وهذا نفسه ما يُثبت أنه لا يوجد رمز خام في القاعدة.
 *
 * شرطان للتشغيل: `DEBUG_MAIL_OUTBOX=true` في `.dev.vars`، والخادم يخدم `dist`
 * المحدَّث (`npm run build` قبل التشغيل).
 */
import { expect, test } from '@playwright/test';
import { signupThroughApi, uniqueEmail } from './helpers';

const NEW_PASSWORD = 'Cairo2027learn';

async function latestToken(page: import('@playwright/test').Page, kind: 'verify_email' | 'reset_password') {
  const res = await page.context().request.get('/api/dev/mail-outbox');
  expect(res.status(), 'الصندوق التطويري غير مفعّل — أضف DEBUG_MAIL_OUTBOX=true إلى .dev.vars').toBe(200);
  const body = (await res.json()) as { items: { kind: string; text: string; to: string }[] };
  const item = [...body.items].reverse().find(i => i.kind === kind);
  expect(item, `لا رسالة ${kind} في الصندوق`).toBeTruthy();
  const match = /token=([A-Za-z0-9_-]+)/.exec(item!.text);
  expect(match, 'لا رمز في نص الرسالة').toBeTruthy();
  return { token: match![1]!, to: item!.to };
}

test('استعادة كلمة المرور وتحقق البريد من الواجهة نفسها', async ({ page }) => {
  const email = uniqueEmail('recover');
  await signupThroughApi(page, email);

  // 1) الخروج من أي جلسة أنشأها الـAPI، ثم «نسيت كلمة المرور» من الواجهة
  await page.context().clearCookies();
  await page.goto('/forgot');
  await page.getByLabel('البريد الإلكتروني').fill(email);
  await page.getByRole('button', { name: /أرسل رابط الاستعادة/ }).click();
  await expect(page.getByText(/إن كان هذا البريد مسجلًا/)).toBeVisible();

  // 2) الرمز وصل للصندوق، والبريد المستهدف هو بريد الحساب
  const reset = await latestToken(page, 'reset_password');
  expect(reset.to).toBe(email);

  // 3) فتح الرابط وإعادة التعيين
  await page.goto(`/reset?token=${reset.token}&email=${encodeURIComponent(email)}`);
  const fields = page.locator('input[type="password"]');
  await fields.nth(0).fill(NEW_PASSWORD);
  await fields.nth(1).fill(NEW_PASSWORD);
  await page.getByRole('button', { name: /احفظ كلمة المرور/ }).click();
  await expect(page.getByText(/حُفظت كلمة المرور الجديدة/)).toBeVisible();

  // 4) دخول بالكلمة الجديدة من نموذج الدخول الحقيقي (اشتقاق 600k في المتصفح)
  await page.goto('/login');
  await page.getByLabel('البريد الإلكتروني').fill(email);
  await page.getByLabel('كلمة المرور', { exact: true }).fill(NEW_PASSWORD);
  await page.getByRole('button', { name: 'دخول' }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // 5) طلب تحقق البريد من جلسة حقيقية، ثم فتح الرابط
  const req = await page.context().request.post('/api/auth/verify-email/request');
  expect(req.status()).toBe(200);
  const verify = await latestToken(page, 'verify_email');
  await page.goto(`/verify?token=${verify.token}`);
  await expect(page.getByText(/صار بريدك مؤكدًا/)).toBeVisible();

  // 6) الرمز أحادي الاستخدام: إعادة فتحه ترفض
  await page.goto(`/verify?token=${verify.token}`);
  await expect(page.getByText(/الرابط غير صالح أو منتهي/)).toBeVisible();

  // 7) الكلمة القديمة لم تعد تعمل
  await page.context().clearCookies();
  await page.goto('/login');
  await page.getByLabel('البريد الإلكتروني').fill(email);
  await page.getByLabel('كلمة المرور', { exact: true }).fill('E2eLearn2026x');
  await page.getByRole('button', { name: 'دخول' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('رابط إعادة التعيين التالف يُظهر رفضًا صريحًا بلا استدعاء للخادم', async ({ page }) => {
  await page.goto('/reset');
  await expect(page.getByText(/هذا الرابط غير صالح/)).toBeVisible();
  await expect(page.getByRole('button', { name: /اطلب رابطًا جديدًا/ })).toBeVisible();
});
