/**
 * تهيئة قبل تشغيل اختبارات المتصفح — محلي فقط.
 *
 * لماذا؟ كل اختبار ينشئ حسابًا حقيقيًا (لا حسابات وهمية ولا بيانات إنتاج)،
 * وحد التسجيل 10/ساعة لكل IP. مع 4 بيئات × 9 اختبارات نتجاوزه بسرعة.
 * هذا الملف **لا يعطّل الحد** — يفرّغ نوافذه في قاعدة التطوير المحلية فقط،
 * ويصرّح بذلك. أي عنوان غير محلي يُرفض هنا.
 */
export default async function globalSetup() {
  const base = process.env.E2E_BASE_URL || 'http://127.0.0.1:8787';
  if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(base)) {
    throw new Error(`E2E محلي فقط. العنوان المرفوض: ${base}`);
  }
  const { execFileSync } = await import('node:child_process');
  try {
    execFileSync(
      './tools/wrangler-env/node_modules/.bin/wrangler',
      ['d1', 'execute', 'es-ar-dev', '--local', '--command', 'DELETE FROM rate_limits'],
      { cwd: process.cwd(), stdio: 'ignore' },
    );
  } catch (err) {
    console.warn('[e2e] تعذّر تفريغ نوافذ حد المعدل — الاختبارات قد تفشل بـ429:', String(err).slice(0, 120));
  }
}
