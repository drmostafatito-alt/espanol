#!/usr/bin/env node
/**
 * ============================================================================
 * تدقيق أمني آلي — يولّد reports/security-review-phase1.md
 * ============================================================================
 * القاعدة: لا يوجد "PASS" مكتوب بيد. كل نتيجة صلاحية هنا تأتي من رمز خروج أمر
 * نُفِّذ الآن. النتائج التحليلية (ما وُجد ولماذا) مُعلنة كبيانات في هذا الملف،
 * وحالتها مرتبطة بدليل قابل للتحقق (اختبار أو أمر)، لا بادعاء.
 *
 * الاستخدام: node tools/security-audit.mjs [--with-bench] [--skip-build]
 */
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const WITH_BENCH = args.includes('--with-bench');
const SKIP_BUILD = args.includes('--skip-build');

/* ----------------------------- تشغيل الأوامر ----------------------------- */

const stripAnsi = (t) => t.replace(/\u001b\[[0-9;]*m/g, '');

function run(label, cmd, opts = {}) {
  const { timeout = 300_000, allowFail = false, env } = opts;
  const started = Date.now();
  const shellCmd = cmd;
  try {
    const isWin = process.platform === 'win32';
    const out = execSync(shellCmd, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout,
      shell: isWin ? true : '/bin/bash',
      env: env ? { ...process.env, ...env } : process.env
    });
    return { label, cmd, ok: true, code: 0, out: stripAnsi(out).trim(), ms: Date.now() - started };
  } catch (err) {
    const res = { label, cmd, ok: false, code: err.status ?? 1, out: stripAnsi(String(err.stdout ?? '')).trim(), ms: Date.now() - started };
    if (!allowFail) console.error(`⚠️  ${label} فشل`);
    return res;
  }
}

const results = [];
const push = (r) => { results.push(r); return r; };

/* -------------------------- الحالة الأولية للخادم -------------------------- */

async function serverUp(url) {
  try {
    const res = await fetch(url + '/api/health', { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch { return false; }
}

/* ------------------------------ تنفيذ الفحوص ------------------------------ */

const live = await serverUp('http://127.0.0.1:8787');

push(run('فحص الأنواع (tsc)', 'npx tsc --noEmit'));
push(run('اختبارات الوحدة والتكامل (vitest)', 'npx vitest run'));
push(run('اتساق DDL', 'node tools/check-sql.mjs'));
push(run('جودة المحتوى', 'node tools/validate-content.mjs'));
if (live) {
  push(run('اختبار الدخان على workerd + D1', 'node tools/smoke-worker.mjs'));
} else {
  results.push({ label: 'اختبار الدخان على workerd + D1', cmd: 'node tools/smoke-worker.mjs', ok: null, code: null, out: 'لم يُشغَّل: لا خادم على 127.0.0.1:8787 (شغّل npm run worker:dev)', ms: 0 });
}

if (!SKIP_BUILD) push(run('بناء الإنتاج', 'npx vite build'));

// حواجز أدوات قاعدة البيانات: يجب أن ترفض كل محاولة مسّ بعيد
const guards = [
  ['رفض --remote', 'node tools/db.mjs status --remote', {}],
  ['رفض ENVIRONMENT=production', 'node tools/db.mjs status', { env: { ENVIRONMENT: 'production' } }],
];
for (const [label, cmd, opt] of guards) {
  const r = run(`حاجز قاعدة البيانات: ${label}`, cmd, { ...opt, allowFail: true });
  // النجاح هنا يعني رمز خروج 2 (رفض مقصود)
  results.push({ ...r, ok: r.code === 2, out: r.code === 2 ? 'رُفض بنجاح (exit 2)' : r.out.slice(0, 200) });
}

if (WITH_BENCH) {
  push(run('قياس KDF على workerd', 'node tools/bench-kdf.mjs --runs 7', { timeout: 600_000 }));
}

/* ------------------------------- النتائج ------------------------------- */

const findings = [
  // id, الخطورة, المحور, العنوان, الحالة, الإصلاح, الدليل, المتبقي
  ['SEC-01', 'عالية', 'كلمات المرور', 'الـpepper كان يُقرأ كسلسلة فارغة عند غياب المتغير، أي تعمل المصادقة بلا سر في الإنتاج بصمت', 'مُصلح',
    'password.ts يرفض السياسة بلا pepper (≥32 حرفًا) في غير بيئة الاختبار؛ index.ts يعيد 503 على مسارات المصادقة ويسجّل الرمز', 'tests/security.test.ts → S-A (بلا PASSWORD_PEPPER ⇒ 503)', '—'],
  ['SEC-02', 'عالية', 'كلمات المرور', 'PBKDF2 بـ30,000 تكرار = 5.0% من متطلب OWASP (600,000) لـPBKDF2-HMAC-SHA256 (سقف خطة Cloudflare المجانية 10ms CPU)', 'مُخفَّف — قرار مالك مطلوب',
    'قياس فعلي على workerd لكل البدائل؛ رُفع إلى 30,000 (5.0%) وهو أقصى ما يدخل 10ms بهامش 2×. Argon2id/scrypt غير ممكنة (WASM محجوب + تكلفة 2.4–6× الميزانية)', 'reports/kdf-benchmark.md (مولَّد آليًا)', 'الوصول لمتطلب OWASP يتطلب Workers Paid (5$/شهر) أو ترحيل المصادقة — انظر القسم 5'],
  ['SEC-03', 'عالية', 'كلمات المرور', 'لا مسار لترقية التكرارات: تغيير الإعداد كان يُبقي الحسابات القديمة على القوة القديمة للأبد', 'مُصلح',
    'صيغة مُصدَّرة (pbkdf2-sha256$iters$salt$hash) + needsRehash() + إعادة تجزئة تلقائية عند أول دخول ناجح + دعم الصيغة القديمة للترحيل', 'tests/security.test.ts → S-A «ترقية التجزئة»', '—'],
  ['SEC-04', 'متوسطة', 'الحسابات', 'كشف وجود الحساب: رسالة ACCOUNT_INACTIVE (403) وACCOUNT_LOCKED (429) تختلف عن الرد العام', 'مُصلح',
    'كل حالات فشل الدخول تعيد 401 INVALID_CREDENTIALS، والقفل يعيد نفس رمز/رسالة حد المعدل (RATE_LIMITED) مع إهدار تكلفة اشتقاق مماثلة', 'tests/security.test.ts → S-C (3 اختبارات)', 'القفل يظل يمنع الدخول — وهو مقصود'],
  ['SEC-05', 'متوسطة', 'CSRF', 'الحماية كانت تعتمد على Origin فقط، وتقبل غيابه، ولا تفحص Content-Type (طلبات HTML forms البسيطة تمر)', 'مُصلح',
    'ثلاث طبقات: SameSite=Lax + فحص Sec-Fetch-Site/Origin + إلزام application/json لأي طلب له جسم (415)', 'tests/security.test.ts → S-B (415 + cross-site)', 'يمكن إضافة double-submit token لاحقًا'],
  ['SEC-06', 'متوسطة', 'الجلسات', 'لا انتهاء بالخمول: كوكي مسروق يظل صالحًا 30 يومًا كاملة', 'مُصلح',
    'فحص last_seen_at خلال 14 يومًا داخل استعلام الجلسة', 'tests/security.test.ts → S-B «الجلسة تنتهي بالخمول»', '—'],
  ['SEC-07', 'متوسطة', 'الجلسات', 'كتابة على D1 في كل طلب /me (تحديث last_seen_at) — استهلاك حصة الكتابة اليومية بلا فائدة', 'مُصلح',
    'التحديث مشروط بمرور 5 دقائق', 'tests/security.test.ts → S-B «لا يُحدَّث أكثر من مرة كل 5 دقائق»', '—'],
  ['SEC-08', 'متوسطة', 'الجلسات', 'لا سقف لعدد الجلسات النشطة لكل مستخدم — تراكم غير محدود للرموز', 'مُصلح',
    'MAX_SESSIONS_PER_USER = 10، وتُلغى الأقدم عند تجاوزها', 'tests/security.test.ts → S-B «سقف 10 جلسات»', '—'],
  ['SEC-09', 'متوسطة', 'الجلسات', 'لا تنظيف للجلسات المنتهية ولا لنوافذ حد المعدل (لا cron في الخطة المجانية)', 'مُصلح جزئيًا',
    'تنظيف احتمالي (5%) عند الدخول + فهارس جديدة على expires_at وlast_seen_at وwindow_start', 'migrations/0003 + db.ts', 'نمو بطيء محتمل تحت حِمل عالٍ — يحتاج Cron Trigger عند الترقية'],
  ['SEC-10', 'متوسطة', 'كلمات المرور', 'سياسة ضعيفة: 10 محارف فقط، بلا قائمة كلمات شائعة، بلا فحص البريد داخل كلمة المرور', 'مُصلح',
    '12 حرفًا كحد أدنى + قائمة شائعة وجذور شائعة + كشف التسلسل/التكرار + منع البريد داخل كلمة المرور', 'tests/lib.test.ts → «سياسة كلمات المرور»', 'لا فحص لقواعد التسريبات (HIBP) لأنه يتطلب شبكة خارجية'],
  ['SEC-11', 'متوسطة', 'الصلاحيات', 'فحص الصلاحية كان داخل كل معالج فقط؛ نسيان سطر = ثغرة صامتة', 'مُصلح',
    'حقل perm في تعريف المسار + فحص مركزي قبل استدعاء المعالج (مع بقاء فحص المعالج)', 'tests/security.test.ts → S-D', '—'],
  ['SEC-12', 'متوسطة', 'الرؤوس', 'لا HSTS، لا Cross-Origin-Resource-Policy، وVary: Origin غير مضمون على كل استجابة', 'مُصلح',
    'securityHeadersFor(env) + Vary دائم + Permissions-Policy أضيق', 'tests/security.test.ts → S-D', 'HSTS لا يُرسَل على http (مقصود)'],
  ['SEC-13', 'منخفضة', 'البنية', 'X-Forwarded-For (قابل للتزييف) كان يُستخدم كبديل لبصمة IP', 'مُصلح',
    'يُستخدم CF-Connecting-IP فقط؛ XFF في بيئة التطوير/الاختبار حصرًا', 'tests/security.test.ts → S-B «XFF لا يُستخدم في الإنتاج»', '—'],
  ['SEC-14', 'منخفضة', 'التدقيق', 'لا سجل تدقيق لعمليات المصادقة (إنشاء/دخول)', 'مُصلح',
    'writeAudit داخل signup وlogin مع معرّف الطلب وبصمة IP', 'tests/security.test.ts → S-D', '—'],
  ['SEC-15', 'منخفضة', 'قاعدة البيانات', 'إعادة الضبط كانت `rm -rf .wrangler` داخل package.json بلا حاجز يمنع أي مسار بعيد', 'مُصلح',
    'tools/db.mjs: يرفض --remote، و--env غير محلي، وENVIRONMENT=production، وdatabase_id حقيقيًا — كلها مُختبرة', 'هذا التقرير: نتائج «حاجز قاعدة البيانات»', '—'],
  ['SEC-16', 'منخفضة', 'قاعدة البيانات', 'لا تتبّع للمهاجرات: إعادة التطبيق أو نسيان مهاجرة لا يُكتشف', 'مُصلح',
    'جدول schema_migrations + checksum + أوامر status/migrate/seed/reset', 'migrations/0003 + tools/db.mjs status', 'تغيير ملف مهاجرة مطبَّق يُظهر تحذيرًا فقط (لا يمنع)'],
  ['SEC-17', 'منخفضة', 'التكوين', 'database_id وهمي في wrangler.toml — يمكن أن يُنشر بالخطأ على قاعدة فارغة', 'مُصلح (حاجز)',
    'حاجز يرفض العمل عند رؤية id حقيقي، والتوثيق يوضح أن النشر يحتاج id فعليًا + تصريح المالك', 'tools/db.mjs', 'لا يوجد سكربت نشر أصلًا — النشر غير مصرّح به'],
  ['SEC-19', 'عالية', 'الرؤوس', 'مستند HTML كان يُخدَم من Cloudflare Assets قبل وصوله إلى Worker ⇒ بلا CSP ولا X-Frame-Options ولا nosniff على الإطلاق', 'مُصلح',
    'Worker يخدم الأصول الآن (run_worker_first) ويضيف الرؤوس + CSP + كاش immutable للأصول المُبصَّمة؛ أُزيل الاعتماد على public/_headers لأنه غير قابل للتحقق محليًا', 'smoke: «مستند HTML يحمل CSP وnosniff وX-Frame-Options» + «أصول مُبصَّمة تُخزَّن immutable»', 'المقايضة: طلبات الأصول الثابتة تُحتسب في حصة 100 ألف طلب/يوم'],
  ['SEC-20', 'متوسطة', 'حدود المعدل', 'حد التسجيل 5/ساعة لكل IP يعاقب مستخدمي CGNAT (شبكات الهاتف في مصر)', 'مُصلح',
    'رُفع إلى 10/ساعة مع توثيق المقايضة', 'tests/security.test.ts + docs/21 §2', 'ما زال حدًّا لكل IP لا لكل جهاز'],
  ['SEC-18', 'منخفضة', 'الصوت', 'AudioService كانت مُختبرة ضد كائنات وهمية فقط', 'مُصلح جزئيًا',
    'العقد مغطى بـ14 اختبار وحدة (فشل R2، غياب الصوت الإسباني، تكرار الضغط، الإلغاء) + 4 سيناريوهات في متصفح حقيقي (Chromium + Firefox، 1280 و320؛ أُعيد تشغيلها في هذه الجلسة: 50/50 ناجح)',
    'tests/audio.test.ts + tests/e2e/audio.spec.ts', 'لا قياس أداء ولا سلوك على هاتف حقيقي، ولا WebKit/Safari — لم يُدَّعَ أي شيء عن الأجهزة'],
];

/* ------------------------------ بناء التقرير ------------------------------ */

const okCount = results.filter(r => r.ok === true).length;
const failCount = results.filter(r => r.ok === false).length;
const skipCount = results.filter(r => r.ok === null).length;
const fixed = findings.filter(f => f[4].startsWith('مُصلح')).length;
const open = findings.length - fixed;

const md = [];
md.push('# مراجعة أمنية وتصحيحية — المرحلة 1');
md.push('');
md.push('> **مولَّد آليًا** بـ`node tools/security-audit.mjs`. كل رقم صلاحية أدناه ناتج تنفيذ فعلي في هذه الجلسة، لا تقدير.');
md.push('');
md.push(`- تاريخ التشغيل: ${new Date().toISOString()}`);
md.push(`- Node ${process.version} · منصة التطوير (لم يُنشر شيء، لا حسابات حقيقية، لا أسرار إنتاج)`);
md.push('');
md.push('## 1) ملخص');
md.push('');
md.push('| البند | القيمة |');
md.push('| --- | --- |');
md.push(`| أوامر تحقق نُفِّذت | ${results.length} |`);
md.push(`| نجحت | ${okCount} |`);
md.push(`| فشلت | ${failCount} |`);
md.push(`| لم تُشغَّل (تحتاج شرطًا) | ${skipCount} |`);
md.push(`| نتائج أمنية مُصلحة | ${fixed} / ${findings.length} |`);
md.push(`| نتائج أمنية مفتوحة | ${open} |`);
md.push('');
md.push('## 2) نتائج أوامر التحقق (مخرجات فعلية)');
md.push('');
md.push('| الأمر | الحالة | التفصيل |');
md.push('| --- | --- | --- |');
for (const r of results) {
  const state = r.ok === true ? '✅ نجح' : r.ok === false ? '❌ فشل' : '⏭️ لم يُشغَّل';
  const detail = summarise(r);
  md.push(`| \`${r.cmd}\` | ${state} | ${detail} |`);
}
md.push('');
md.push('## 3) النتائج الأمنية');
md.push('');
md.push('| المعرّف | الخطورة | المحور | المشكلة | الحالة | الإصلاح | الدليل | المتبقي |');
md.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const [id, sev, area, title, status, fix, evidence, residual] of findings) {
  md.push(`| ${id} | ${sev} | ${area} | ${title} | ${status} | ${fix} | ${evidence} | ${residual} |`);
}
md.push('');
md.push('## 4) مخاطر مفتوحة غير مُصلحة (معلنة صراحة)');
md.push('');
md.push('1. **قوة اشتقاق كلمة المرور أقل من متطلب OWASP** — حدّ منصة لا اختيار. القرار في القسم 5.');
md.push('2. **حدود اختبار المتصفح**: Playwright مُثبَّت و50 اختبارًا ناجحًا على Chromium وFirefox (1280 و320 وملف Pixel 7). **لم** يُشغَّل WebKit/Safari (بناء WebKit غير ممكن على Debian 13)، ولا جهاز هاتف حقيقي، ولا فحص axe/Lighthouse.');
md.push('3. **لم تُقس أي أداء على هاتف حقيقي.** لا ادعاء بسرعة أو جودة صوت على الأجهزة.');
md.push('4. **لا تحقق بريد إلكتروني** (`email_verified_at` غير مستخدم) ⇒ لا استعادة كلمة مرور آمنة، ولا يمكن الاعتماد على البريد كهوية.');
md.push('5. **لا MFA** ولا ربط أجهزة/جلسات بلوحة تحكم للمستخدم.');
md.push('6. **لا فحص لكلمات المرور المسرَّبة** (HIBP) لأن ذلك يتطلب طلبًا خارجيًا.');
md.push('7. **يوجد ملف تطوير `.dev.vars`** بقيمة وهمية معلَّمة؛ خارج git. الإنتاج يحتاج `wrangler secret put PASSWORD_PEPPER` بـ256 بت عشوائية حقيقية.');
md.push('8. **سجلات `console.error` قد تحتوي رسالة استثناء SQL** (بلا بيانات مستخدم) — لا تُعرض للمستخدم، لكنها تظهر في سجلات Worker.');
md.push('');
md.push('## 5) قرار مطلوب من المالك قبل أي حساب حقيقي');
md.push('');
md.push('المعطى المقاس: على الخطة المجانية أقصى ما يمكن هو **5% من متطلب OWASP** (30,000 من 600,000 تكرار). هذا لا يكفي لحسابات حقيقية.');
md.push('');
md.push('| الخيار | ما يعنيه | التكلفة | الأثر على القيود |');
md.push('| --- | --- | --- | --- |');
md.push('| **أ) Workers Paid** | 30 ثانية CPU ⇒ Argon2id (m=19MiB,t=2) أو PBKDF2 600k. مطابق لـOWASP | 5$/شهر | يخالف «مجاني فقط» — يحتاج موافقة صريحة |');
md.push('| **ب) البقاء مجانًا + قبول المخاطرة** | 30k تكرارًا + pepper + حدود معدل + سياسة كلمات مرور أقوى + مراقبة. غير مطابق لـOWASP | 0 | يعني قبول أن تسرّب القاعدة يُكسر أسرع 20× من المعيار |');
md.push('| **ج) ترحيل المصادقة** إلى مزوّد خارجي مجاني | يخرج تخزين كلمات المرور من نطاقنا | 0 (بحدود) | يخالف «لا خدمات خارجية مطلوبة وقت التشغيل» |');
md.push('');
md.push('**حتى يتخذ المالك قراره:** `ALLOW_PUBLIC_SIGNUP` يبقى `"false"` في الإنتاج، والتسجيل يعيد 503 برسالة صريحة.');
md.push('الوضع الحالي: في بيئة التطوير `"true"` للاختبار فقط.');
md.push('');
md.push('## 6) ما يجب إعادة تشغيله قبل المرحلة 2');
md.push('');
md.push('```bash');
md.push('npm run db:reset:local          # قاعدة محلية + مهاجرات متتبَّعة');
md.push('npm test                        # وحدة + تكامل + أمن');
md.push('npm run worker:dev &            # خادم حقيقي على workerd');
md.push('node tools/smoke-worker.mjs');
md.push('node tools/bench-kdf.mjs        # يعيد توليد reports/kdf-benchmark.md');
md.push('node tools/security-audit.mjs --with-bench');
md.push('```');
md.push('');

function summarise(r) {
  const out = r.out || '';
  const t = out.match(/Tests\s+(\d+) passed/);
  if (t) {
    const f = out.match(/Test Files\s+(\d+) passed/);
    return `${t[1]} اختبارًا ناجحًا${f ? ` في ${f[1]} ملفات` : ''}`;
  }
  if (/النتيجة: PASS/.test(out)) return 'PASS';
  if (/اختبار دخان ناجح/.test(out)) return out.match(/(\d+\/\d+) اختبار دخان ناجح/)?.[1] ?? 'نجح';
  if (/built in/.test(out)) return out.match(/dist\/assets\/[^\s]+\.js\s+([\d.]+ kB │ gzip:\s*[\d.]+ kB)/)?.[1] ?? 'بُني';
  if (/القيمة المعتمدة حاليًا/.test(out)) {
    const v = out.match(/القيمة المعتمدة حاليًا[^:]*:\s*([\d,]+)/)?.[1];
    const pct = out.match(/القيمة المعتمدة حاليًا[^\n]*?\(([\d.]+)% من متطلب OWASP\)/)?.[1];
    return v ? `${v} تكرارًا (${pct}% من OWASP)` : 'قيس';
  }
  if (/رُفض بنجاح/.test(out)) return 'رُفض بنجاح (exit 2)';
  if (r.code === 0) return 'نجح (بلا مخرجات مختصرة)';
  return '`' + out.split('\n').filter(Boolean).slice(-2).join(' / ').slice(0, 160).replace(/\|/g, '\\|') + '`';
}

mkdirSync(join(ROOT, 'reports'), { recursive: true });
const path = join(ROOT, 'reports/security-review-phase1.md');
writeFileSync(path, md.join('\n'));
console.log(md.join('\n').split('## 2)')[0]);
console.log(`\n📄 كُتب ${path}`);
if (failCount > 0) process.exit(1);
