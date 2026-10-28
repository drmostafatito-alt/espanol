# Español بالعربي — منصة عربية لتعلّم الإسبانية (من الصفر إلى C1)

> **حالة المشروع: التطبيق يعمل محليًا بالكامل.**
> 256 درسًا مسودة (PREA1 ‏12 + A1/A2/B1/B2 ‏40 لكل مستوى + C1 ‏32 + سفر 24 + كول سنتر 28)،
> 1,546 تمرينًا، 8,572 مدخل مفردات، محرك مراجعة متباعدة (SM-2 معدّل) على الخادم، وواجهة RTL من 320px.
> **لا شيء منشور:** كل المحتوى `draft` / `unreviewed`، ولا سجل مراجعة بشرية واحد.
>
> | التحقق | النتيجة |
> | --- | --- |
> | `npx vitest run` | **585/585** ✅ (46 ملفًا) — مُحقَّق في جلسة 2026-10-28 (سدّ الفجوات التنفيذية) |
> | `node tools/smoke-worker.mjs` (workerd + D1) | **32/32** ✅ — مُحقَّق في جلسة 2026-10-28 |
> | `node tools/journey-live-19.mjs` · `node tools/test-learner-flow-live.mjs` | **32/32 · ناجح 100%** ✅ — مُحقَّق في جلسة 2026-10-25 |
> | `./node_modules/.bin/playwright test --project=chromium-desktop --project=chromium-320` | **38/38** ✅ (19 سطح مكتب + 19 بعرض 320px) — مُحقَّق في جلسة 2026-10-28 على الشجرة المدمجة؛ مشروعا Firefox غير قابلين للتشغيل في هذه البيئة (تثبيت المتصفح يفشل شبكيًا) |
> | `npx tsc --noEmit` · `npx vite build` | نظيف / ناجح ✅ |
> | `node tools/check-sql.mjs` | PASS ✅ (62 جدولًا) |
> | `node tools/check-curriculum.mjs` | PASS ✅ (256 درسًا مكتوبًا، 0 أخطاء) |
> | `node tools/validate-content.mjs --dir …` | PASS في exemplars + كل مسودات المستويات والمسارات ✅ |
> | `node tools/audit-content-quality.mjs` (تدقيق الجودة الكامل) | **0 أخطاء · 113 تنبيهًا** ✅ — مُحقَّق في جلسة 2026-10-28 |
> | `node tools/check-content-integrity.mjs` (فحص تكامل المنهج البنيوي) | **PASS · 0 أخطاء** ✅ (256 درسًا، 1546 تمرينًا، 8572 مدخلًا) — يفحص التناسق بين الخريطة والملفات، مفاتيح الإجابة، الحلقات في التقدم، واللغة العربية |
> | `node tools/check-audio-manifest.mjs` | PASS ✅ (63 مدخلًا ← 52 ملفًا، 11 اسمًا مستعارًا) |
>
> ⚠️ **بوابة أمنية:** لا تُفتح حسابات حقيقية بعد. قوة تخزين كلمة المرور على الخطة المجانية = 5% من متطلب OWASP (حدّ منصة مقيس).
> القرار المطلوب: [`docs/SECURITY_BLOCKERS.md`](docs/SECURITY_BLOCKERS.md).
>
> 🔍 **تدقيق جودة المحتوى (16 درسًا · 134 مدخل مفردات):** [`reports/audit/SUMMARY.md`](reports/audit/SUMMARY.md)
>
> 📄 **التقرير النهائي:** [`docs/FINAL_LOCAL_QA_REPORT.md`](docs/FINAL_LOCAL_QA_REPORT.md) · حالة المراحل: [`docs/AUTONOMOUS_EXECUTION_STATUS.md`](docs/AUTONOMOUS_EXECUTION_STATUS.md) · ما ينتظر المراجعة البشرية: [`docs/CONTENT_REVIEW_QUEUE.md`](docs/CONTENT_REVIEW_QUEUE.md)

---

## 1. ما هذا المستودع؟

مستودع التخطيط والمواصفات لمشروع **منصة عربية تعلّم الإسبانية من الصفر حتى C1**، بما فيه:

| العُنصر | الموقع |
| --- | --- |
| تقرير المرحلة صفر (الفحص، الافتراضات، المخاطر، القرارات) | [`docs/00_PHASE0_REPORT.md`](docs/00_PHASE0_REPORT.md) |
| **تقرير المرحلة 1 (ما بُني وما لم يُبنَ)** | [`docs/19_PHASE1_REPORT.md`](docs/19_PHASE1_REPORT.md) |
| **المراجعة الأمنية للمرحلة 1 (النتائج والقرار المطلوب)** | [`docs/21_SECURITY_REVIEW_PHASE1.md`](docs/21_SECURITY_REVIEW_PHASE1.md) |
| متطلبات المنتج (FR/NFR) ومعايير القبول | [`docs/01_PROJECT_REQUIREMENTS.md`](docs/01_PROJECT_REQUIREMENTS.md) |
| المعمارية التقنية وموديل التكلفة | [`docs/02_ARCHITECTURE.md`](docs/02_ARCHITECTURE.md) |
| تصميم قاعدة البيانات (شرح) + DDL قابل للتنفيذ | [`docs/03_DATABASE_SCHEMA.md`](docs/03_DATABASE_SCHEMA.md) · [`db/migrations/`](db/migrations/) |
| منهج المستويات والوحدات والمسارات | [`docs/04_CURRICULUM_SPEC.md`](docs/04_CURRICULUM_SPEC.md) |
| نموذج المحتوى الموحد + JSON Schema | [`docs/05_CONTENT_SCHEMA.md`](docs/05_CONTENT_SCHEMA.md) · [`content/schema/`](content/schema/) |
| دليل جودة المحتوى ودورة المراجعة | [`docs/06_CONTENT_QUALITY_GUIDE.md`](docs/06_CONTENT_QUALITY_GUIDE.md) |
| نظام التصميم البصري (RTL/LTR، رموز الألوان، الخطوط) | [`docs/07_UI_DESIGN_SYSTEM.md`](docs/07_UI_DESIGN_SYSTEM.md) |
| خريطة الصفحات والمسارات | [`docs/08_PAGES.md`](docs/08_PAGES.md) |
| العمل دون اتصال والمزامنة | [`docs/09_OFFLINE_SYNC.md`](docs/09_OFFLINE_SYNC.md) |
| الأمن وحماية البيانات | [`docs/10_SECURITY.md`](docs/10_SECURITY.md) |
| خطة الاختبارات | [`docs/11_TESTING.md`](docs/11_TESTING.md) |
| مصفوفة معايير القبول القابلة للقياس | [`docs/12_ACCEPTANCE_MATRIX.md`](docs/12_ACCEPTANCE_MATRIX.md) |
| النشر والمتغيرات البيئية | [`docs/13_DEPLOYMENT.md`](docs/13_DEPLOYMENT.md) · [`docs/14_ENVIRONMENT_VARIABLES.md`](docs/14_ENVIRONMENT_VARIABLES.md) |
| دليل الإدارة والمساهمة وسجل التغييرات | [`docs/15_ADMIN_GUIDE.md`](docs/15_ADMIN_GUIDE.md) · [`docs/16_CONTRIBUTING.md`](docs/16_CONTRIBUTING.md) · [`CHANGELOG.md`](CHANGELOG.md) |
| خطة المراحل وخطة التوسع في المحتوى | [`docs/17_ROADMAP_PHASES.md`](docs/17_ROADMAP_PHASES.md) |
| حدود Cloudflare الحقيقية (مُتحقَّق منها بتاريخ 2026-10-21) | [`docs/18_PLATFORM_LIMITS_VERIFIED.md`](docs/18_PLATFORM_LIMITS_VERIFIED.md) |

## 2. مبدأ العمل الإلزامي

1. لا يُعلن أي بند "مكتمل" إلا بعد تشغيل اختبار فعلي وإرفاق نتيجته في `reports/`.
2. المحتوى التعليمي يُصاغ بشريًا ويُراجَع، ولا يُولَّد تلقائيًا بكميات قبل اجتياز النموذج العمودي.
3. العدّادات (5000 مدخل معجمي، 7000 كلمة تحريرية) تُقاس بالسكربتات في `tools/` لا بالادعاء.
4. أي بند غير منفَّذ يظهر بوصفه "غير منفَّذ" في هذا الملف وفي التقرير.

## 3. التشغيل والتحقق

### 0) التنزيل — Clone هو الطريقة الموصى بها

```bash
git clone https://github.com/drmostafatito-alt/espanol.git
cd espanol
```

> تنزيل ZIP يعطيك نفس الملفات لكن بلا مجلد `.git`: لا تاريخ، ولا تحديث بـ`git pull`، ولا فروع.
> لمواصلة التطوير استخدم `git clone` دائمًا.

**متطلبات التشغيل:** Node.js ‏24 LTS ‏(الحد الأدنى 22.5 — الأدوات والاختبارات تستخدم `node:sqlite`) + npm المرفق معه + Git.
لا يلزم تسجيل دخول Cloudflare ولا قاعدة إنتاج للتشغيل المحلي.

```bash
# 1) الاعتماديات (better-sqlite3 بديل اختياري فقط — node:sqlite هو الأساسي؛
# إن فشل بناء الوحدة الأصلية لعدم وجود أدوات C++، استخدم npm ci --ignore-scripts وسيعمل كل شيء)
npm ci
npm ci --prefix tools/wrangler-env          # wrangler المحلي (يحتاجه db:migrate:local أدناه)

# 2) سرّ محلي + فتح المحتوى المسودّ في التطوير فقط (الملف مستثنى من Git)
# الطريقة الأسرع: انسخ ملف المثال وعدّل القيم (انظر .dev.vars.example):
#   PowerShell: Copy-Item .dev.vars.example .dev.vars
#   Bash:       cp .dev.vars.example .dev.vars
# ثم ضع pepper عشوائيًا (32+ حرفًا) — توليده:
#   PowerShell: [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
#   Bash:       openssl rand -base64 36
# أو يدويًا بالشكل التالي (Bash):
cat > .dev.vars <<'EOF'
PASSWORD_PEPPER=local-dev-pepper-0123456789abcdefghijklmnop
ALLOW_UNREVIEWED_CONTENT="true"
ALLOW_PUBLIC_SIGNUP="true"
# الدخول عبر Google محليًا (اختياري): يلزم عميل OAuth حقيقي من Google Cloud Console
# مع تسجيل http://127.0.0.1:8787/api/auth/oauth/google/callback كـredirect URI.
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
EOF

# 3) قاعدة D1 المحلية + البذور + استيراد المحتوى بالترتيب الموثّق
npm run db:migrate:local && npm run db:seed:local
# --all فقط: خطة واحدة لكل content/drafts (كل الحزم معًا) + خطة العينات.
# الاستيراد مجلدًا بمجلد (--dir لكل مجلد) يكسر روابط الدرس↔المفردة بصمت،
# لأن كل خطة تربط بمفردات مجلدها فقط (رُصد: 160 رابطًا بدل 1,334).
node tools/import-content.mjs --all   # 256 درسًا مسودة + 3 ملفات عينات = 258 درسًا مميزًا، الكل draft/unreviewed
# الافتراضي بلا وسائط يستورد content/exemplars فقط (3 دروس).

# 4) التشغيل والتحقق
npm run build               # vite build
npm run worker:dev          # API + SPA على http://localhost:8787


npm test                    # اختبارات vitest (العدد الحالي يظهر في مخرجات التشغيل)
node tools/smoke-worker.mjs # 32 اختبار دخان على workerd/D1 (يتطلب worker:dev)
npm run validate            # DDL + جودة المحتوى + تكامل المنهج + تناسق الأصول الصوتية
node tools/check-curriculum.mjs
npm run deploy:preflight    # يجب أن يفشل (exit 1) على إعداد التطوير — هذه وظيفته
                            # ولاختبار قسم إنتاج: --file <path> [--env production]
node tools/security-audit.mjs --with-bench   # تقرير أمني مولَّد آليًا
```

> **بدون `.dev.vars` لن ترى أي درس في التطوير**: كل المحتوى بحالة `draft`، وقراءته محليًا تتطلب
> `ALLOW_UNREVIEWED_CONTENT="true"` مع `ENVIRONMENT` غير إنتاجي. هذا مفتاح تطوير لا يُستخدم في الإنتاج.

## 4. الاسم والشعار

الاسم النهائي، الشعار، الألوان، وسائل التواصل، وروابط السياسات = **إعدادات قابلة للتغيير من لوحة الإدارة** (جدول `admin_settings`, مجموعة `branding`).
الاسم المؤقت المستخدم في الكود والوثائق: `Español بالعربي`، ومفتاح المشروع `es-ar`.

## 5. الترخيص والحقوق

- الكود: يُحدَّد لاحقًا بموافقة المالك (لم يُختر ترخيص في المرحلة صفر).
- المحتوى التعليمي المُصاغ: ملك صاحب المشروع.
- لا يُستخدم أي أصل بصري أو صوتي من Duolingo أو أي منتج محمي. الهوية بصرية أصلية (انظر `docs/07_UI_DESIGN_SYSTEM.md`).
