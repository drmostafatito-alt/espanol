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
| `PBKDF2_ITERATIONS` | var | عدد التكرارات المعايَر | كلها |
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
ALLOW_PUBLIC_SIGNUP=false        # الإنتاج: false دائمًا (docs/SECURITY_BLOCKERS.md)
ALLOW_UNREVIEWED_CONTENT=false
ENVIRONMENT=development
APP_ORIGIN=http://localhost:5173
```

`.gitignore` يجب أن يشمل: `.dev.vars`, `.env*`, `node_modules`, `dist`, `.wrangler`, `reports/*.local.*`.

## 4. قواعد

1. لا سر في كود الواجهة. لا `import.meta.env.VITE_*` لأي سر (القيم التي تُبنى في العميل **عامة**).
2. `VITE_*` مسموح فقط لـ: `VITE_APP_ORIGIN`, `VITE_MEDIA_ORIGIN`, `VITE_FEATURE_FLAGS` (عامة بطبيعتها).
3. مفاتيح مختلفة لكل بيئة؛ لا إعادة استخدام مفتاح production في staging.
4. تدوير `PASSWORD_PEPPER` **يُبطل كل كلمات المرور القائمة** (لا يمكن إعادة تجزئتها بلا كلمة المرور الأصلية) — التدوير يحتاج إعادة تعيين عبر Google أو كلمة مرور جديدة؛ لا يُدوَّر بلا خطة ترحيل.
5. عند تغيّر متغير يؤثر على السلوك، يُسجَّل في `CHANGELOG.md`.
