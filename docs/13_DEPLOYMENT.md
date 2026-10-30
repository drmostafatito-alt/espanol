# النشر

> **لا نشر إنتاجي في هذه المرحلة.** لا حساب Cloudflare متصل ولا تصريح من المالك. هذا الملف خطة تنفيذية، لا إعلان نجاح.

## 1. المتطلبات المسبقة

| المتطلب | الحالة الآن | ملاحظة |
| --- | --- | --- |
| Node 20+ | ✅ v20.20.2 | — |
| `wrangler` | ❌ غير مثبت | `npm i -D wrangler` داخل المشروع |
| حساب Cloudflare + تصريح | ❌ | يتطلب موافقة المالك |
| نطاق (domain) | ❌ | يُستخدم للنطاق المخصص للوسائط |
| مزود بريد | ❌ | اختياري للنسخة الأولى (يُعلن غير مفعّل) |

## 1.1 التحقق من إعداد KDF قبل النشر (إلزامي)

```bash
node tools/check-deploy-ready.mjs --file wrangler.production.toml
```

المتوقع: `PASS` مع **0 أخطاء · 0 حواجز · 0 تنبيهات**. الشرط الذي يفحصه صريحًا:

| الشرط | القيمة المطلوبة | لماذا |
| --- | --- | --- |
| `ALLOW_PUBLIC_SIGNUP` | `"true"` | التسجيل العام مجاني ومفتوح (قرار 2026-10-30) |
| `CLIENT_KDF_REQUIRED` | `"true"` | بدونها يقبل الخادم كلمة مرور خامًا على 30k فقط (5% من OWASP) |
| `CLIENT_KDF_ITERATIONS` | `≥ 600000` | متطلب OWASP. أقل من ذلك مع تسجيل مفتوح = **خطأ مانع** لا تنازل |
| `PBKDF2_ITERATIONS` | `≥ 20000` (الفعلي `30000`) | حدّ الخطة المجانية: 30k ≈ 5ms داخل 10ms |

بعد النشر، تحقّق يدوي واحد (بلا أسرار في المخرجات):

```bash
curl -s -X POST https://<origin>/api/auth/kdf-params -H 'content-type: application/json' \
  -d '{"email":"probe@example.com"}'   # يجب: 200 + iterations=600000 + cache-control: no-store
```


## 2. البنية المستهدفة

```
español-ar-web     (Worker + Static Assets)  ← SPA + /api
español-ar-media   (R2 bucket)               ← audio/, images/  عبر نطاق media.* مخصص
es-ar-prod / es-ar-staging (D1)
```

سبب استخدام Worker بدل Pages Functions: التحكم في التوجيه والأصول الثابتة وحصة الطلبات في مكان واحد، مع دعم `run_worker_first` للمسارات الحساسة فقط.

## 3. خطوات أول نشر (staging)

```bash
# 1) تثبيت (الاعتماديات لا تُحفظ بين الجلسات → تُعاد)
npm ci

# 2) مصادقة
npx wrangler login          # أو CLOUDFLARE_API_TOKEN في البيئة (لا يُكتب في ملف)

# 3) قاعدة البيانات
npx wrangler d1 create es-ar-staging
npx wrangler d1 migrations apply es-ar-staging --remote

# 4) بذور مرجعية + إنشاء حساب إدارة أول (سكربت آمن يطلب كلمة مرور تفاعلية)
npm run seed:reference -- --env staging
npm run admin:create -- --env staging --email <owner-email>   # لا كلمة مرور في المستودع

# 5) أسرار (الأسماء كما يقرأها الكود فعليًا — لا SESSION_PEPPER)
#    PASSWORD_PEPPER: إلزامي، ≥32 محرفًا عشوائيًا. بدونه كل مسار مصادقة يعيد 503.
npx wrangler secret put PASSWORD_PEPPER --env staging
npx wrangler secret put GOOGLE_CLIENT_SECRET --env staging   # لتفعيل الدخول عبر Google
npx wrangler secret put VAPID_PRIVATE_KEY --env staging      # عند تفعيل Push

# 6) نشر
npm run build
npx wrangler deploy --env staging
```

## 4. ترتيب مراجعة قبل production (checklist)

- [ ] `node tools/check-sql.mjs` PASS
- [ ] `node tools/validate-content.mjs` PASS (0 أخطاء)
- [ ] `node tools/check-deploy-ready.mjs --file wrangler.production.toml` **(إلزامي — PASS مطلوب على ملف الإنتاج)**
- [ ] `npm run deploy:preflight` (على `wrangler.toml` التطويري) — على `wrangler.toml` الملتزَم (إعداد تطوير) يجب أن يعطي `FAIL` (كود خروج 1): هذا هو سلوكه الصحيح، فهو يرفض نشر إعداد التطوير. `PASS` (0) مطلوب فقط عند فحص ملف/قسم إنتاج حقيقي.
  - يقرأ قسم المتغيّرات تلقائيًا: `[env.production.vars]` إن وُجد، وإلا `[vars]`. لبيئة أخرى: `--env staging`.
- [ ] `npm run test` + `node tools/smoke-worker.mjs` + `test:e2e` كلها خضراء
- [ ] المراجعة البشرية: 100% من الدروس المنشورة لها سجلا مراجعة
- [ ] لا `pending/` في أي `audioKey` لدرس منشور
- [ ] مراجعة المتغيرات والأسرار (`14_ENVIRONMENT_VARIABLES.md`)
- [ ] فحص CSP والرؤوس على staging
- [ ] اختبار استعادة من تصدير D1
- [ ] مراجعة صفحة الحالة والصيانة
- [ ] خطة تراجع مكتوبة (أدناه)
- [ ] **تصريح صريح من المالك**

## 5. التراجع (Rollback)

| المستوى | الإجراء | المدة |
| --- | --- | --- |
| الواجهة | `wrangler rollback` للإصدار السابق | دقائق |
| Worker API | نفس الأمر (النسخ متزامنة) | دقائق |
| D1 | ترحيل عكسي مُعد مسبقًا لكل migration، أو Time Travel (≤7 أيام) | دقائق–ساعات |
| المحتوى | إعادة استيراد نسخة Git السابقة (المحتوى في Git) | دقائق |
| الأصول | مفتاح `audio/` مُبصَّم بالـhash → إصدار جديد لا يمسح القديم | فوري |

**قاعدة:** كل migration يحتاج ملف `down` مُختبرًا على staging، ويُذكر في `CHANGELOG.md`.

## 6. المراقبة (بلا تكلفة)

| ما يُراقب | كيف |
| --- | --- |
| أخطاء API | سجل Worker + `request_id` في كل استجابة |
| فشل حفظ التقدم | عدّاد في `learning_events` بحالة `failed_sync` |
| استهلاك D1 | صفحة `/admin/status` تقرأ إحصاءات الحساب يدويًا + تنبيه عند 70% |
| 1027/1102 | كشف رمز الخطأ في السجل وعرض لافتة صيانة |
| صوت مفقود | استعلام دوري على `audio_assets` بلا `media_assets` صالح |
| جلسات منتهية | مهمة تنظيف يومية (cron) تحذف المنتهي |

لا تسجيل لكلمات المرور/التوكنات/التسجيلات. `request_id` عشوائي لكل طلب.

## 7. الاستهلاك المتوقع (تقدير، ليس وعدًا)

| البند | الافتراض | التقدير |
| --- | --- | --- |
| طلبات Worker | 25 طلبًا/جلسة | 100k/يوم ≈ 4,000 جلسة |
| كتابات D1 | ~12 كتابة/درس مكتمل | 100k/يوم ≈ 8,300 درسًا مكتملًا |
| تخزين D1 | 300 KB/مستخدم/شهر | 500 MB ≈ 1,600 مستخدم نشط (قبل التقليم) |
| R2 | 15 KB/جملة صوتية | 10 GB ≈ 650,000 جملة |

الأرقام تقريبية وتُقاس فعليًا بعد النشر. **الخطة المجانية ليست غير محدودة.**
