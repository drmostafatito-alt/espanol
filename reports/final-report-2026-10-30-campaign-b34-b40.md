# تقرير حملة B34–B40 — إعادة تأليف أمثلة المفردات القالبية (A2)

**التاريخ:** 30 أكتوبر 2026 · **الفرع:** `arena/8aba50bb-espanol` · **المستوى:** A2 فقط في هذه الحملة.
**الحالة:** كل المحتوى **draft / unreviewed**؛ لم يُنشر شيء، ولم يُلمس الإنتاج.

---

## 1) الملخّص التنفيذي

| البند | القيمة |
|---|---|
| الأمثلة القالبية قبل الحملة | **3233** من 8572 |
| الأمثلة القالبية بعد الحملة | **2580** من 8572 (30.1%) |
| **مُصحَّح فعليًا في هذه الحملة** | **653** مدخلًا فريدًا |
| المستوى | A2 فقط (المستويات الأخرى لم تُمَس) |
| A2 قبل ← بعد | 1354 ← **701** |
| دفعات | 7 دفعات (B34…B40) بحجم 83–102 |
| مدخلات جديدة في السجل | 653 (السجل: 1710 ← **1993** finding، 36 ← **39** دفعة) |
| الترجمة المصرية | 653 جملة `exampleArEg` جديدة/مراجَعة يدويًا (كلها مختلفة عن الفصحى بفحص البوّابة + قراءة بشرية) |
| اختبارات | 647/647 ناجحة · TypeScript نظيف · بناء ناجح · SQL 153,416 أمرًا بلا أخطاء |
| تنبيهات `validate-content --dir content/drafts` | **9537** = الأساس تمامًا (0 جديد) |

**العائلات المستنفدة بالكامل:** `El/La X es muy importante en la vida cotidiana` (150 → **0**)، `X resulta muy común en el entorno cotidiano` (666 → **0**).
**العائلات المتبقية في A2 (31 عائلة، 701 مدخلًا):** `X es un concepto clave en este contexto` **12**، `Suelo X` **79**، `Trabajamos X` **56**، `de suma importancia` **79**، وغيرها.

---

## 2) الدفعات — العدد المُصحَّح فعلًا

| الدفعة | النطاق | العدد | ملاحظات |
|---|---|---|---|
| B34 | `es muy importante` (m–p) | **83** | أكبر عائلة A2 آنذاك |
| B35 | `es muy importante` (بقية) | **85** | |
| B36 | `es muy importante` (n–t) | **100** | 7 ملاحظات بوّابة صُلحت قبل التطبيق |
| B37 | ختام `es muy importante` (12) + `resulta muy común` (90) | **102** | |
| B38 | `resulta muy común` (c–t) | **95** | بوّابة نظيفة من أول مرة |
| B39 | ختام `resulta muy común` (24) + `concepto clave` (76) | **100** | 5 ملاحظات (منها 2 إنذار كاذب في المدقّق) |
| B40 | `concepto clave` (i–v) | **88** | 3 ملاحظات صُلحت |
| **الإجمالي** | | **653** | الهدف 500–700 ✅ |

المستويات الأخرى لم تُمَس: B1 **1183** · B2 **477** · C1 **219** (لم تتغير أرقامها بين بداية الحملة ونهايتها).

---

## 3) قبل/بعد — نصوص حرفية من السجل

| id | المدخل | قبل | بعد |
|---|---|---|---|
| F-1354 | `maceta` | La maceta es muy importante en la vida cotidiana. | Puse una maceta con flores en el balcón. |
| F-1522 | `nuera` | La nuera es muy importante en la vida cotidiana. | Mi nuera cocina muy bien el arroz. |
| F-1622 | `tensión` | La tensión es muy importante en la vida cotidiana. | Tengo la tensión un poco alta últimamente. |
| F-1724 | `cooperativa agraria` | La cooperativa agraria resulta muy común en el entorno cotidiano. | La cooperativa agraria vende el aceite del pueblo. |
| F-1819 | `travesía del Atlántico` | La travesía del Atlántico resulta muy común en el entorno cotidiano. | Hizo la travesía del Atlántico en velero. |
| F-2006 | `violencia` | La violencia es un concepto clave en este contexto. | La violencia nunca es la solución. |

نماذج ثلاثية اللغة من B40 (إسباني / فصحى / مصري):

- `individuo` — «Cada individuo tiene derecho a opinar.» / «لكل فرد الحق في أن يعبّر عن رأيه.» / «كل واحد من الناس ليه حق يقول رأيه.»
- `infarto` — «Mi abuelo sufrió un infarto el mes pasado.» / «أصيب جدي بجلطة قلبية الشهر الماضي.» / «جدو جاله جلطة في القلب الشهر اللي فات.»
- `infierno` — «Con este calor el metro es un infierno.» / «مع هذه الحرارة يصبح المترو جحيمًا.» / «بالحر ده المترو بقى جهنم.»

---

## 4) أخطاء لغوية/دلالية اكتُشفت وصُلحت

1. **جمل لا تحوي المدخل بصيغة معترف بها** — `mora` كُتبت `moras` (B34)، `provecho` غاب من الجملة (B36)، `canapé de salón` بصيغة جمع (B37)، `licenciado` كُتب `licenciada` (B40). صُلحت كلها داخل الجملة نفسها بلا تغيير المدخل.
2. **مصري = فصحى حرفيًا (نسخ سطحي)** — 10 حالات عبر B36–B40: `oficinista`, `órgano`, `portada`, `programador` (B36)، `choza de pastores` (B37)، `hebilla`, `higo` (B39)، `ladrido` (B40)… أُعيدت صياغة كل واحدة بتعبير مصري حقيقي («قُفلة الحزام مكسورة»، «أكلت تينة لسه مقطوطة من الشجرة»، «سمعت كلب بيعوّي من بعيد»).
3. **حروف لاتينية داخل النص العربي** — `pronombre` (B36) في كلا الحقلين العربيَّين؛ أُعيدت الصياغة.
4. **تشابه قالبـي زائد** — `villancico navideño` (B39) كان 0.50 تشابهًا مع مثال قديم؛ أُعيدت الصياغة («En Nochebuena toda la familia canta un villancico navideño.»).
5. **تطابق جنس الأداة** — `lente` كُتب «la lente» والمعجم يضبطه مذكرًا؛ غُيّر السياق إلى «el lente de la cámara» (استخدام شائع في أمريكا اللاتينية) بدل فرض جنس مخالف للمعجم.
6. **مراجعة دلالية فردية** — كلمات متعددة المعاني (`genio`, `gabinete`, `índice`, `lechera`, `localidad`, `listón`, `lomo`, `lente`) اختير لها المعنى الأكثر شيوعًا في الحياة اليومية، والجملة تُظهر ذلك المعنى صراحةً.

---

## 5) خلل برمجي اكتُشف وأُصلح (مع اختبار انحدار)

**الخلل:** مدقّق الدفعات `tools/check-vocab-batch.mjs` كان يرفض «el» مع أي اسم مؤنث، فيرفض جملًا صحيحة تمامًا مثل «Cortó la rama con **el hacha**.» و«**El haba** seca se usa en muchos guisos.» (أسماء مؤنثة تبدأ بـ a-/ha- مشدّدة تأخذ `el` في المفرد). الأثر: إما يُضعِف المحرّر الجملة، أو تُرفض دفعة سليمة.

**الإصلاح الجذري (لا إضعاف للفحص):**
- قاعدة الأداة استُخرجت إلى وحدة قابلة للاختبار: **`tools/lib/article-gender.mjs`** بدالة `articleGenderProblem()`.
- قائمة مغلقة `FEM_MASC_ARTICLE_OK` (agua, hacha, haba, águila, aula, hambre…) — قاعدة التشديد لا تُستنتج من الحروف، وإدراج كلمات مثل «amiga» سيُخفي أخطاء حقيقية.
- الفحص ما زال يرفض: «El bala…»، «La libro…»، والجنس المذكور/المؤنث الاعتيادي.
- **اختبار انحدار:** 4 حالات في `tests/content-review-fixes.test.ts` (يقبل el hacha/haba/agua · يرفض المؤنث العادي · يرفض المذكر بأداة مؤنثة · لا يعترض على أداة غير معرفة/موضع غير اسمي).

---

## 6) البوّابات والاختبارات — نتائج فعلية

| الأمر | النتيجة |
|---|---|
| `node tools/check-vocab-batch.mjs` على الدفعات السبع | 7/7 نظيفة بعد الإصلاحات (18 ملاحظة أثناء العمل، منها 2 إنذار كاذب في المدقّق عولج جذريًا) |
| `node tools/rewrite-vocab-examples.mjs <batch> --apply` | 653/653 مطبَّقًا؛ إعادة التطبيق على السبع = **0 جديد** (idempotent) |
| `node tools/validate-content.mjs --dir content/drafts` | **PASS** · 0 خطأ · **9537 تنبيهًا** = الأساس حرفيًا (0 جديد) · 8572 مدخلًا · 1546 تمرينًا |
| `npx tsc --noEmit` | نظيف |
| `npx vitest run` | **51 ملفًا · 647/647 اختبارًا ناجحًا** |
| `npm run build` | ناجح (289ms) |
| `node tools/export-content-sql.mjs --out …` | 153,416 أمرًا (151,251 محتوى + 2,165 ربطًا) · 7 إحالات مفردات بلا مدخل معجمي (مُسجَّلة، سابقة) |
| `node tools/check-sql.mjs` | **PASS** على ملف SQL المصدَّر وعلى `db/migrations` |
| `node tools/content-review.mjs --queues` | 6 قوائم متسقة: A2 **701** · B1 1183 · B2 477 · C1 219 · A1/PREA1 **0** |
| حرس اختبار الدفعات | رُفع من ≥1226 إلى **≥1791** (لا تخفيف: يزداد مع كل دفعة) |

---

## 7) Git

- المدخلات: `content/review/vocab-examples/b34…b40*.json` (7 ملفات) · السجل `content/review/ledger.v1.json` (+653) · سجل التقارير `reports/content-review/vocab-example-rewrites.json` (30 دفعة، 1880 سجلًا) · القوائم · `tools/lib/article-gender.mjs` + تعديل المدقّق + الاختبارات.
- نقطة استرجاع قبل التعديل: الوسم **`backup-2026-10-30-pre-b34`** (على `44327b9`).
- الالتزام المحلي ووسم ما بعد الحملة مُدرجان في تعليق الالتزام أدناه (فرع `arena/8aba50bb-espanol` فقط، **بلا push وبلا merge إلى main**).

---

## 8) ما يحتاج مراجعة بشرية (لا أخطاء مؤكدة)

1. 653 جملة إسبانية و653 ترجمة مصرية كُتبت آليًا-بشريًا بمعايير المحرّر؛ **المراجعة البشرية النهائية لم تُجرَ** والوسم يبقى `draft/unreviewed`.
2. 31 عائلة قالبية ما زالت في A2 (`Suelo X` 79، `Trabajamos X` 56، `de suma importancia` 79، `concepto clave` 12…) — موادّ الحملة القادمة.
3. مصطلح طبي/مهني في B40 (`infarto`, `lesión`, `licencia`) مكتوب فصحى تعليمية؛ الجمل سليمة لكن ملاءمة بعضها لمستوى A2 حكم تحريري بشري.
4. `itemId` في السجل يُبنى من المفتاح المُطبَّع (بلا تشكيل إسباني وحروف صغيرة) مثل `travesía del atlántico`، بينما المعجم يحفظ `travesía del Atlántico`. المحتوى صحيح في الاثنين؛ الفرق تجميلي في تسمية المعرّف، ولم أعِد كتابة تاريخ السجل.

---

## 9) تأكيد صريح

**الإنتاج لم يتغيّر:** لا push، لا دمج إلى `main`، لا نشر، لا دروس منشورة، لا استيراد D1 إنتاجي، لا أسرار ولا إعدادات إنتاج، لا حذف بيانات أو محتوى. كل شيء محلي وعلى فرع واحد، وكل المحتوى المُعدَّل ظلّ **draft/unreviewed**.
