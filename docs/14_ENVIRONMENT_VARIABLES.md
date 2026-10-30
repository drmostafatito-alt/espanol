# متغيرات البيئة والأسرار

> لا تُكتب أي قيمة سرية هنا أو في المستودع. هذا الملف يحدد **الأسماء والنطاق** فقط.

## 1. Bindings في `wrangler.toml` (غير سرية)

| الاسم | النوع | الغرض | بيئات |
| --- | --- | --- | --- |
| `DB` | D1 binding | قاعدة البيانات | dev/staging/prod |
| `MEDIA` | R2 binding | قراءة/كتابة الأصول (الإدارة فقط) | staging/prod |
| `ENVIRONMENT` | var | `development` \| `staging` \| `production` | كلها |
| `APP_ORIGIN` | var | أصل التطبيق للتحقق من Origin | كلها |
| `MEDIA_ORIGIN` | var | نطاق الوسائط المخصص | كلها |
| `PBKDF2_ITERATIONS` | var | تكرارات **الخادم** لـPBKDF2. `30000` في الإنتاج (حدّ 10ms للخطة المجانية) | كلها |
| `ALLOW_PUBLIC_SIGNUP` | var | `"true"` يفتح التسجيل العام بالبريد+كلمة المرور (قرار 2026-10-30). أي قيمة غير `"true"` = مغلق (فشل مغلق) | كلها |
| `CLIENT_KDF_REQUIRED` | var | `"true"`: إلزام اشتقاق المتصفح ورفض كلمة المرور الخام (400 `CLIENT_KDF_REQUIRED`). **يجب أن يبقى `true` في الإنتاج** | staging/prod |
| `CLIENT_KDF_ITERATIONS` | var | تكرارات المتصفح. `600000` = متطلب OWASP. الأرضية المقبولة 100,000، والبوابة ترفض أقل من 600,000 مع تسجيل مفتوح | staging/prod |
| `GOOGLE_CLIENT_ID` | var | معرّف عميل Google OAuth (عام — ليس سرًا) | staging/prod (وdev عند اختبار Google حقيقيًا) |
| `SESSION_TTL_DAYS` | var | 30 افتراضيًا | كلها |
| `FEATURE_PUSH` | var | `true` عندما يُعد VAPID | staging/prod |
| `FEATURE_EMAIL` | var | `true` عندما يُعد مزود البريد | staging/prod |
| `ADMIN_BOOTSTRAP_DONE` | var | يمنع إعادة إنشاء حساب إدارة | staging/prod |

## 2. أسرار (`wrangler secret put`)

| الاسم | الغرض | إلزامي؟ |
| --- | --- | --- |
| `PASSWORD_PEPPER` | إضافة سرية إلى تجزئة كلمة المرور (حماية من هجوم قاموس على قاعدة مسروقة). **هذا هو الاسم الذي يقرأه الكود**؛ `SESSION_PEPPER` اسم قديم في وثائق سابقة ولا أثر له — ضبطه لا يفعّل شيئًا ويترك المصادقة معطَّلة (503). | **نعم — ≥32 محرفًا عشوائيًا** |
| `VAPID_PUBLIC_KEY` | Web Push | عند تفعيل Push |
| `VAPID_PRIVATE_KEY` | Web Push | عند تفعيل Push |
| `EMAIL_API_KEY` | مزود البريد | عند تفعيل البريد |
| `TURNSTILE_SECRET` | حماية إنشاء الحساب (اختياري، مجاني) | اختياري |
| `GOOGLE_CLIENT_SECRET` | سر عميل Google OAuth — تبادل الكود على الخادم فقط، لا يظهر في أي ملف | عند تفعيل الدخول عبر Google |

## 3. متغيرات تطوير محلية (`.dev.vars` — غير مُتتبَّع في Git)

```
PASSWORD_PEPPER=<قيمة عشوائية 32B للـdev فقط>
ALLOW_PUBLIC_SIGNUP=true          # الإنتاج أيضًا true: التسجيل مجاني ومفتوح
CLIENT_KDF_REQUIRED=true          # الإنتاج: true (لا مسار كلمة مرور خام)
CLIENT_KDF_ITERATIONS=600000      # الإنتاج: 600000
ALLOW_UNREVIEWED_CONTENT=false
ENVIRONMENT=development
APP_ORIGIN=http://localhost:5173
```

`.gitignore` يجب أن يشمل: `.dev.vars`, `.env*`, `node_modules`, `dist`, `.wrangler`, `reports/*.local.*`.

## 4. قواعد

1. لا سر في كود الواجهة. لا `import.meta.env.VITE_*` لأي سر (القيم التي تُبنى في العميل **عامة**).
2. `VITE_*` مسموح فقط لـ: `VITE_APP_ORIGIN`, `VITE_MEDIA_ORIGIN`, `VITE_FEATURE_FLAGS` (عامة بطبيعتها).
3. مفاتيح مختلفة لكل بيئة؛ لا إعادة استخدام مفتاح production في staging.
4. تدوير `PASSWORD_PEPPER` **يُبطل كل كلمات المرور القائمة** — وأشد في v2: الملح الحتمي نفسه مشتق بالـpepper، فلا يمكن التحقق من أي حساب v2 بعده. لا يُدوَّر بلا مسار إعادة تعيين/ترحيل كامل مسبقًا.
5. تغيير `CLIENT_KDF_ITERATIONS` لا يكسر الحسابات القائمة: التكرارات تُقرأ من الصف المخزَّن (`kdfv2$server$client$salt$hash`) لا من الإعداد.
5. عند تغيّر متغير يؤثر على السلوك، يُسجَّل في `CHANGELOG.md`.
