#!/usr/bin/env node
/**
 * بوابة ما قبل النشر (Preflight) — تمنع نشر إعدادات التطوير بالخطأ.
 *
 * السبب: الملف المرفوع `wrangler.toml` يحمل إعدادات تطوير (ENVIRONMENT=development،
 * ALLOW_PUBLIC_SIGNUP="true"، database_id أصفهان، APP_ORIGIN على localhost).
 * نجاح `git push` لا يعني أن المشروع جاهز للنشر — وهذا الفحص يفصل بينهما بأمر واحد.
 *
 * الاستخدام:
 *   node tools/check-deploy-ready.mjs                     # يفحص wrangler.toml الافتراضي
 *   node tools/check-deploy-ready.mjs --file wrangler.production.toml
 *   node tools/check-deploy-ready.mjs --json
 *
 * كود الخروج: 0 = كل الفحوص تمر (نشر مسموح تقنيًا) · 1 = الفحص فشل · 2 = وجدت حواجز إطلاق مفتوحة.
 * ملاحظة: هذا الفحص لا ينشر شيئًا ولا يتصل بالشبكة.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const AS_JSON = process.argv.includes('--json');
const TARGET = arg('file', 'wrangler.toml');

/** أخطاء تمنع النشر (لازم تُصلح) */
const errors = [];
/** حواجز إطلاق معروفة مفتوحة (ليست خطأ برمجيًا، بل قرار مالك) */
const blockers = [];
/** تنبيهات */
const warnings = [];

const err = (code, msg, fix) => errors.push({ code, msg, fix });
const block = (code, msg, fix) => blockers.push({ code, msg, fix });
const warn = (code, msg, fix) => warnings.push({ code, msg, fix });

const abs = join(ROOT, TARGET);
if (!existsSync(abs)) {
  err('CONFIG_MISSING', `ملف الإعداد غير موجود: ${TARGET}`, 'تأكد من المسار أو مرّر --file');
} else {
  const text = readFileSync(abs, 'utf8');
  const varsBlock = text.split('[vars]')[1]?.split(/\n\[/)[0] ?? '';
  const getVar = name => {
    const m = varsBlock.match(new RegExp(`^\\s*${name}\\s*=\\s*"([^"]*)"`, 'm'));
    return m ? m[1] : undefined;
  };

  // 1) البيئة
  const environment = getVar('ENVIRONMENT');
  if (environment !== 'production') {
    err(
      'NOT_PRODUCTION',
      `ENVIRONMENT = ${environment === undefined ? '(غير موجود)' : `"${environment}"`} — يجب "production" للنشر.`,
      'أنشئ قسم [env.production.vars] بالقيم الإنتاجية بدل نشر قسم [vars] التطويري.',
    );
  }

  // 2) أصل التطبيق
  const appOrigin = getVar('APP_ORIGIN');
  if (!appOrigin) {
    err('APP_ORIGIN_MISSING', 'APP_ORIGIN غير موجود — ينهار فحص Origin والكوكي.', 'أضف النطاق الحقيقي، مثال: https://espanol.example.com');
  } else {
    const origins = appOrigin.split(',').map(s => s.trim());
    const localOnly = origins.every(o => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o));
    if (localOnly) {
      err('APP_ORIGIN_LOCAL', `APP_ORIGIN كلها محلية: ${appOrigin}`, 'ضع نطاق HTTPS الحقيقي؛ وإلا فسيرفض المتصفح كل طلب يغيّر الحالة.');
    }
    if (origins.some(o => o !== 'https' && !o.startsWith('https://'))) {
      warn('APP_ORIGIN_INSECURE', 'توجد أصول بلا HTTPS — الكوكي لن يأخذ __Host- ولن يُضاف Secure.', 'استخدم https:// فقط في الإنتاج.');
    }
  }

  // 3) بوابة التسجيل العام
  const signup = getVar('ALLOW_PUBLIC_SIGNUP');
  if (signup === 'true') {
    block(
      'PUBLIC_SIGNUP_OPEN',
      'ALLOW_PUBLIC_SIGNUP="true" — التسجيل العام مفتوح مع PBKDF2 بـ30k (5% من متطلب OWASP).',
      'اجعلها "false" حتى يُعتمد قرار قوة الاشتقاق (docs/SECURITY_BLOCKERS.md §1).',
    );
  } else if (signup === undefined) {
    // الكود يفشل مغلقًا الآن، فلا خطر فتح — لكن الإعداد يجب أن يكون صريحًا
    warn('PUBLIC_SIGNUP_IMPLICIT', 'ALLOW_PUBLIC_SIGNUP غير موجود؛ الكود سيغلق التسجيل. صرّح بالقيمة صراحةً للوضوح.', 'أضف ALLOW_PUBLIC_SIGNUP = "false".');
  }

  // 4) قاعدة البيانات
  const dbId = text.match(/database_id\s*=\s*"([^"]*)"/)?.[1];
  if (!dbId) {
    err('D1_ID_MISSING', 'database_id غير موجود في [[d1_databases]].', 'استخدم معرّف قاعدة الإنتاج من لوحة Cloudflare.');
  } else if (/^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(dbId)) {
    err('D1_ID_PLACEHOLDER', 'database_id ما زال معرّفًا وهميًا (أصفار).', 'ضع معرّف D1 الإنتاجي الحقيقي.');
  }

  // 5) السياسة الأمنية المطلوبة
  if (getVar('PBKDF2_ITERATIONS') && Number(getVar('PBKDF2_ITERATIONS')) < 600000) {
    block(
      'KDF_BELOW_OWASP',
      `PBKDF2_ITERATIONS = ${getVar('PBKDF2_ITERATIONS')} < 600,000 (متطلب OWASP).`,
      'إما خطة Workers المدفوعة (30s CPU) لرفع التكرارات، أو قبول البقاء بلا تسجيل عام (docs/SECURITY_BLOCKERS.md).',
    );
  }

  // 6) الأسرار لا تكون في الملف
  if (/PASSWORD_PEPPER\s*=/.test(text)) {
    err('SECRET_IN_CONFIG', 'PASSWORD_PEPPER مكتوب داخل ملف الإعداد — سيُرفع إلى Git.', 'أزله واستخدم: wrangler secret put PASSWORD_PEPPER');
  }
  if (/-----BEGIN [A-Z ]*PRIVATE KEY/.test(text)) {
    err('PRIVATE_KEY_IN_CONFIG', 'مفتاح خاص داخل ملف الإعداد.', 'أزله فورًا ودوّره.');
  }

  // 7) جدول التوافق
  const compat = text.match(/compatibility_date\s*=\s*"([^"]*)"/)?.[1];
  if (!compat) warn('COMPAT_DATE_MISSING', 'compatibility_date غير محدد.', 'ثبّته لتجنب تغيّر سلوك workerd.');
}

const status = errors.length ? 'FAIL' : blockers.length ? 'BLOCKED' : 'PASS';

if (AS_JSON) {
  console.log(JSON.stringify({ file: TARGET, status, errors, blockers, warnings }, null, 2));
} else {
  console.log(`# فحص الجاهزية للنشر — ${TARGET}\n`);
  console.log(`- أخطاء تمنع النشر: ${errors.length}`);
  console.log(`- حواجز إطلاق مفتوحة (قرار مالك): ${blockers.length}`);
  console.log(`- تنبيهات: ${warnings.length}\n`);

  const section = (title, list, icon) => {
    if (!list.length) return;
    console.log(`## ${title}`);
    for (const item of list) {
      console.log(`- ${icon} [${item.code}] ${item.msg}`);
      console.log(`  الإصلاح: ${item.fix}`);
    }
    console.log('');
  };
  section('أخطاء', errors, '✗');
  section('حواجز إطلاق', blockers, '⛔');
  section('تنبيهات', warnings, '!');

  console.log(`**النتيجة: ${status}**`);
  if (status !== 'PASS') {
    console.log('\n> هذا الفحص لا ينشر شيئًا. النشر يحتاج تصريحًا صريحًا من المالك (docs/13_DEPLOYMENT.md).');
  }
}

process.exit(status === 'FAIL' ? 1 : status === 'BLOCKED' ? 2 : 0);
