# تقرير جولة تصحيح المحتوى + التحقق من Git — 29 أكتوبر 2026

**الفرع:** `arena/8aba50bb-espanol` · **رأس آخر دفعة محتوى:** `195c210` (B33) · **قاعدة الفرع:** `cb32181`
**الوسوم الاحتياطية (محلية):** `backup-2026-10-29-pre-content-corrections` → `e5ed173` · `backup-2026-10-29-pre-bulk-rewrite` → `9c97fc0` · `backup-2026-10-29-post-bulk` → `daf2288` · `backup-2026-10-29-post-b26` → `025ecd8` · `backup-2026-10-29-a1-complete` → `d1258bc`
**لم يُدفع شيء، ولم يُدمج، ولم يُنشر، ولم تُلمس قاعدة الإنتاج.** كل المحتوى ما زال `draft / unreviewed`.

---

## 1) حالة Git: ما تم التحقق منه فعلًا

### قبل أي تعديل

| العنصر | النتيجة المقيسة |
|---|---|
| `git status` | شجرة نظيفة؛ غير المتتبَّع: ستة ملفات تحت `reports/` فقط |
| `git log` | `e5ed173 ← e0d860a ← 16aa37a ← 316b8ea ← 4463242 ← 46f88e6 ← 1adb05e ← cb32181` |
| الفروع | `arena/8aba50bb-espanol` (نشط) · `main` = `cb32181` متتبِع `origin/main` |
| الوسوم | **لا يوجد أي وسم في هذا المستودع** قبل الجولة (خلافًا لما يفترضه الطلب) |
| `git reflog --all` | لا يظهر أي التزام خارج سلسلة الالتزامات الثمانية أعلاه |
| `git fsck --lost-found` | لا شيء ضائع إلا `8bb09a3` (التزام تقارير أُلغي بالـ reset، محتواه محفوظ في الشجرة) |

**الالتزامات الأربعة المذكورة في الطلب (`63b15a5`, `747e7aa`, `ce631d4`, `ed2bd31`) غير موجودة في هذا المستودع إطلاقًا** — لا في التاريخ، ولا في الـ reflog، ولا ككائنات معلّقة (`git cat-file -t` يعيد "absent" للأربعة). أي أن «التراجع» المذكور وقع في نسخة أخرى (جهاز Windows)، لا في هذه النسخة.

**هل تحفظ الشجرة العمل القديم؟** نعم: كل الملفات التي وصفها التقرير القديم موجودة **ومتتبَّعة** في التاريخ الحالي — `src/shared/vocab-titles.ts`، `tests/vocab-titles.test.ts`، `src/web/theme.css` (1241 سطرًا دخلت في `316b8ea`)، `tests/path-progress-scope.test.ts`، `tools/content-review.mjs`. أي أنه لا حاجة لاستعادة شيء: الشجرة = التاريخ + ملفات تقارير غير متتبَّعة.

### الإجراء الوقائي المتخذ

- أُنشئ **وسم محلي** `backup-2026-10-29-pre-content-corrections` على `e5ed173` (نقطة ما قبل هذه الجولة) — مرجع استرجاع كامل، بلا أي عملية مدمِّرة.
- **لم يُنفَّذ** `reset --hard` ولا `clean` ولا `checkout --force` ولا `rebase` ولا إعادة كتابة تاريخ.
- أُعيد التحقق في كل مرحلة بـ `git status` + `git diff --stat`؛ عدد الملفات المعدَّلة مطابق للمتوقع في كل دفعة.

### بعد الجولة (تاريخ جديد، لا إعادة كتابة)

| الالتزام | المحتوى |
|---|---|
| `0510f27` | أدوات: كاشف قوالب موحّد + نطاق `vocab-queue:` + `resolvedBy` + `--queues` + أداتا إعادة الكتابة وإزالة التسريب |
| `fd81036` | 195 مثالًا معجميًا أُعيد تأليفه (155 تعارض جنس + 40 A1) + دفعات مؤلَّفة + قوائم انتظار |
| `eff7474` | إزالة 276 تسريب «(الصواب)» + 5 تمارين `listen_choose` + اختبارات انحدار + سجل B12/B13 |
| `7d9e1a3` | توثيق عائلتين معلّقتين في السجل |

---

## 2) الأعداد المطلوبة: مؤكَّد / مُصحَّح / معلَّق

### أ) الـ50 تمرين `listen_choose` (الخيار الصحيح «لا يرد» في الجملة)

فُحصت الخمسون واحدًا واحدًا (الجذع، الخيارات، المفتاح، الشرح). **الرقم 50 كان أثرًا لمطابق نصّي ساذج، لا خمسين عيبًا:**

| التصنيف | العدد | الحكم |
|---|---|---|
| الخيار الصحيح إعادة صياغة للمضمون («A las 14:30 (dos y media)» مقابل «a las dos y media») | 36 | **سليم** |
| استنتاج معجمي مشروع (`interesantísimo` ⇒ `interesante`؛ قاعدة حذف الضمير) | 2 | **سليم** |
| جذع بلا نصّ، الاعتماد على التسجيل فقط | 3 | **سليم بالتصميم** |
| **تعليمة لا تطابق نوع الخيارات** (`ex-a2-cnd-5`, `ex-a2-med-5`, `ex-a2-ira-5`, `ex-a2-tel-5`) | **4** | **مؤكَّد ومُصحَّح** |
| **مفتاح الإجابة مكتوب داخل نصّ الخيار «(الصواب)»** | **4** من الـ50 (ومن 276 في المحتوى كله) | **مؤكَّد ومُصحَّح** |
| جذع فيه فراغ مقصود (`ex-a1-lug-5`) | 1 | **معلَّق** (F-318) |

**الإجمالي: 8 مؤكَّدة العيب ومُصحَّحة · 41 سليمة · 1 معلَّقة.**

### ب) الـ155 تعارض جنس

| البند | العدد |
|---|---|
| مؤكَّد العيب (أداة مؤنثة + صفة مذكرة داخل مثال قالبي) | **155 / 155** |
| مُصحَّح بإعادة تأليف المثال كاملًا + ترجمته | **155** (A1 47 · A2 75 · B1 32 · B2 1) |
| متبقٍ | **0** (تحقّق آلي مباشر) |

### ج) `ex-a2-tel-5` (المذكور بالاسم)

| البند | النتيجة |
|---|---|
| التشخيص | مؤكَّد: التعليمة «حدد هوية الشخص المطلوب»، والتسجيل «¿está la doctora García en su consulta?»، والإجابة المعلنة `llamada` — لا ترد في الجملة ولا تجيب عن التعليمة |
| الإصلاح | أُعيد تأليف الخيارات الثلاثة: `el doctor Ruiz` / **`la doctora García`** / `la enfermera del turno` + ترجماتها + شرح يفسّر المفتاح |
| ما لم يُمسّ | المعرّفات (`ex-a2-tel-5_a/b/c`)، نوع التمرين، موضع الإجابة (`_b`)، الـ slug، الترتيب |

### د) تسريب مفتاح الإجابة (عيب لم يكن في الطلب، اكتُشف أثناء التحقق)

**276 خيارًا في 103 دروس** كان نصّها العربي ينتهي بـ «(الصواب)» — و**كلها بلا استثناء هي الخيار الصحيح**. 264 بالصيغة المباشرة و12 بصيغة تحمل ملاحظة («الصواب بعد propongo que»…). الواجهة تعرض النص الإسباني فقط، فالتسريب لم يكن مرئيًا للمتعلم، لكنه كان في حمولة الـ API وفي أي تصدير. أُزيلت العلامة وحدها (A1 5 · A2 56 · B1 104 · B2 111)، والملاحظات التعليمية الاثنتا عشرة كان الشرح `explanationAr` يغطيها أصلًا.

---

## 3) أمثلة حقيقية من التصحيحات

**تعارض الجنس + مثال لا يُظهر المدخل (155 حالة، هذه عيّنة):**

| المدخل | قبل | بعد |
|---|---|---|
| `bala` (A2) | La bala es muy conocido en este ámbito. | La bala pasó cerca del policía y nadie resultó herido. / مرّت الرصاصة قرب الشرطي ولم يُصب أحد. |
| `furgoneta` (A2) | La furgoneta es muy conocido en este ámbito. | Cargamos las cajas en la furgoneta de reparto. / حمّلنا الصناديق في شاحنة التوصيل الصغيرة. |
| `zapatillas de casa` (A1) | La zapatillas de casa resulta muy práctico para el hogar moderno. | Me pongo las zapatillas de casa al llegar. / أرتدي خفّ المنزل حين أصل. |
| `arpillera` (B2) | La arpillera resulta muy práctico para el hogar moderno. | Guardan el café en sacos de arpillera. / يخزّنون القهوة في أكياس الخيش. |

**الدفعة الأخيرة B17 — الطعام والسفر (40 مدخلًا A1):** أُثبت أولًا أن الأمثلة الأربعين قالبية بالكاشف المعتمد (`isTemplateExample` = 40/40)، ثم أُعيد تأليفها:

| المدخل | قبل (قالبي) | بعد (إسباني / عربي) |
|---|---|---|
| `anchoa` | La anchoa es un ingrediente muy popular en la cocina. | A mí me gustan las anchoas con aceite y pan. / أحب الأنشوجة مع الزيت والخبز. |
| `bocadillo` | El bocadillo es un ingrediente muy popular en la cocina. | Para el viaje preparé un bocadillo de queso. / من أجل الرحلة حضّرت شطيرة جبن. |
| `churro` | El churro es un ingrediente muy popular en la cocina. | Los domingos desayunamos churros con chocolate. / أيام الأحد نفطر التشورو مع الشوكولاتة. |
| `aterrizaje` | El aterrizaje es fundamental para organizar el viaje. | El aterrizaje fue suave, casi no lo notamos. / كان الهبوط هادئًا، لم نكاد نشعر به. |
| `maletero` | El maletero es fundamental para organizar el viaje. | Pon las maletas en el maletero del coche. / ضع الحقائب في صندوق السيارة. |
| `recepcionista` | La recepcionista es fundamental para organizar el viaje. | La recepcionista nos dio la llave de la habitación. / أعطتنا موظفة الاستقبال مفتاح الغرفة. |

**ملاحظة قياس صادقة:** عدّاد «مُراجَع» في السجل يقيس النطاقات المعلنة لا جودة الأمثلة. دفعة B17 (40 مدخلًا) لم ترفع العدّاد لأن مداخلها كانت مُحتسبة سابقًا عبر نطاقات حزم كاملة في B05/B06، بينما رفعته B18 وB19 بمقدار +40 لكل منهما لأن مداخلهما لم تكن مُحتسبة. لذا المقياس الموثوق للعمل الفعلي هو عدد المداخل التي أُعيد تأليف مثالها فعلًا: **395** مدخلًا (منها 155 صُنّفت `spanish-grammar` لأن الخلل كان تعارض جنس، والباقي `vocab-example`). و**407** هو عدد المداخل الفريدة التي لها تصحيح مسجّل بأي تصنيف، لا رقم التغطية.

**الدفعة B18 — الطبيعة والأشياء (40 مدخلًا A1):** 24 من عائلة «es una maravilla de la naturaleza» (نباتات وحيوانات) + 16 من عائلة «es un concepto clave en este contexto». أُثبت قالبية الأمثلة الأربعين قبل التعديل (40/40 بالكاشف)، وكل جملة جديدة تصف استعمالًا حقيقيًا:

| المدخل | قبل (قالبي) | بعد (إسباني / عربي) |
|---|---|---|
| `cucaracha` | La cucaracha es una maravilla de la naturaleza y del medio ambiente. | Anoche vi una cucaracha en la cocina. / رأيت البارحة صرصورًا في المطبخ. |
| `koala` | El koala es una maravilla de la naturaleza y del medio ambiente. | El koala duerme casi veinte horas al día. / الكوالا ينام نحو عشرين ساعة في اليوم. |
| `lechuza` | La lechuza es una maravilla de la naturaleza y del medio ambiente. | De noche oímos una lechuza en el tejado. / في الليل سمعنا بومة على السطح. |
| `lavanda` | La lavanda es una maravilla de la naturaleza y del medio ambiente. | Puse lavanda en el armario para que huela bien. / وضعت اللافندر في الخزانة لتصبح رائحتها طيبة. |
| `gota` | La gota es un concepto clave en este contexto. | Hay una gota que cae del grifo toda la noche. / هناك قطرة تسقط من الصنبور طوال الليل. |
| `herramienta` | La herramienta es un concepto clave en este contexto. | Necesito una herramienta para apretar este tornillo. / أحتاج أداة لشد هذا البرغي. |
| `guitarrista` | La guitarrista es un concepto clave en este contexto. | El guitarrista tocó una canción flamenca. / عزف عازف الغيتار أغنية فلامنكو. |
| `ingrediente` | El ingrediente es un concepto clave en este contexto. | La harina es el ingrediente principal del pan. / الطحين هو المكوّن الأساسي للخبز. |

**الدفعة B19 — أشياء الحياة اليومية (40 مدخلًا A1):** من عائلة «es muy importante en la vida cotidiana» (181 مرشحًا). أُثبت قالبية الأمثلة الأربعين قبل التعديل (40/40)، وكل جملة جديدة **4–9 كلمات** بمفردات A1:

| المدخل | قبل (قالبي) | بعد (إسباني / عربي) |
|---|---|---|
| `oído` | El oído es muy importante en la vida cotidiana. | Me duele el oído derecho. / أشعر بألم في أذني اليمنى. |
| `mostaza` | La mostaza es muy importante en la vida cotidiana. | ¿Tienes mostaza para la hamburguesa? / هل عندك خردل للبرغر؟ |
| `moda` | La moda es muy importante en la vida cotidiana. | Este año las faldas largas están de moda. / هذا العام التنورات الطويلة موضة. |
| `motor` | El motor es muy importante en la vida cotidiana. | El motor del coche hace un ruido raro. / محرك السيارة يصدر صوتًا غريبًا. |
| `pantufla` | La pantufla es muy importante en la vida cotidiana. | Me pongo las pantuflas al llegar a casa. / أرتدي الخفّ حين أصل إلى البيت. |
| `percha` | La percha es muy importante en la vida cotidiana. | Cuelga el abrigo en la percha. / علّق المعطف على الشماعة. |
| `meta` | La meta es muy importante en la vida cotidiana. | Mi meta para este año es correr diez kilómetros. / هدفي هذا العام أن أركض عشرة كيلومترات. |
| `ola` | La ola es muy importante en la vida cotidiana. | Una ola grande mojó mi toalla. / بلّلت موجة كبيرة منشفتي. |

**قيود معلنة:** فحوص الدفعة الآلية تقيس الطول (≤9 كلمات)، وغياب الأبنية المتقدمة (شرط/وصل معقّد/أزمنة مركبة)، والتكرار الشبيه (تشابه ثلاثيات ≥0.5 = 0 عبر 8572 مثالًا)، وتطابق أداة التعريف مع الجنس. **لا تقيس** الطبيعية أو الملاءمة التربوية الحقيقية — ذلك يبقى مراجعة بشرية مطلوبة، والمحتوى كله `draft/unreviewed`.

**دفعة A1 عالية التكرار (40 مدخلًا):**
`agotado` → «Después del partido estoy agotado y me voy a dormir.» / «بعد المباراة أنا منهك وسأذهب للنوم.» · `buzón` → «Echo la carta en el buzón de la esquina.» / «أرمي الرسالة في صندوق البريد عند الزاوية.» · `crujiente` → «El pan recién hecho está crujiente por fuera.» / «الخبز الطازج مقرمش من الخارج.»

**التمارين:**

| التمرين | قبل | بعد |
|---|---|---|
| `ex-a2-tel-5` | الخيارات: teléfono / **llamada** / prefijo | el doctor Ruiz / **la doctora García** / la enfermera del turno |
| `ex-a2-cnd-5` | «استمع وحدد أمنية المتحدث» (والخيارات أفعال: esperar/dinero/tiempo) | «استمع وحدد الفعل الذي يعبّر به المتحدث عن أمله» |
| `ex-a2-med-5` | «استمع وحدد ما نصح به الطبيب عند عدم التحسن» | «استمع وحدد الكلمة الواردة في جملة الشرط التي وضعها الطبيب» |
| `ex-a2-ira-5` | «استمع وحدد قرار المتحدث للمستقبل» | «استمع وحدد الفعل الذي يعبّر به المتحدث عن قراره» |
| 276 خيارًا | «أداة التعريف للمؤنث (الصواب)» | «أداة التعريف للمؤنث» |

---

## 4) تغطية المفردات: قبل / جديد / مُصحَّح / معلَّق / متبقٍ

| البند | العدد |
|---|---|
| مُراجَع سابقًا (نهاية الجولة السابقة) | 1495 / 8572 |
| **مُراجَع جديد في هذه الجولة** | **774** مدخلًا أُعيد تأليف مثالها فعليًا (B20–B32 = 704 + B33 = 70) |
| **إجمالي المُراجَع (المسجَّل في السجل)** | **2215 / 8572 (25.8%)** — انظر التحذير أدناه |
| **مُصحَّح موثَّق قبل/بعد** | **1239** مدخلًا فريدًا (هذا هو الرقم الموثوق) |
| مُصحَّح (مفردات) | **1239** مدخلًا في السجل — منها **1226** مدخلًا أُعيد تأليف مثالها فعليًا بأثر قبل/بعد |
| معلَّق (مفردات) | **10** مداخل/عائلات |
| **متبقٍ (بحسب السجل)** | **6357** مدخلًا — منها **3233** مثالًا قالبيًا بقي في قوائم الانتظار |

> **تحديث 30 أكتوبر 2026 (حملة B34–B40):** الأرقام أعلاه هي أرقام **ما بعد B33** وتُحفظ كتاريخ. الحالة الحالية المُعاد حسابها من الملفات: **2580** مثالًا قالبيًا من 8572 (30.1%) بعد **653** تصحيحًا موثَّقًا، والسجل **1993** finding في **39** دفعة، وقوائم الانتظار: A2 **701** · B1 1183 · B2 477 · C1 219 · A1/PREA1 0. التفاصيل الكاملة في **`reports/final-report-2026-10-30-campaign-b34-b40.md`**.

**التغطية حسب المستوى (بحسب السجل):** PREA1 7/7 (100%) · A1 762/1712 (45%) · A2 655/3044 (22%) · B1 424/2302 (18%) · B2 86/1073 (8%) · C1 15/434 (3%).
الدروس: 256/256 (100%) في كل المستويات. التمارين: 1546/1546.

**تصحيح قياس مهم من الجولة السابقة:** عدد الأمثلة القالبية كان مُعلنًا **3467**؛ بعد توحيد الكاشف (`isTemplateExample`: 28 قالبًا مع إحلال **العبارة كاملة** وليس الكلمة الأولى، وبلا شرط «8 مداخل على الأقل») تبيّن أن الرقم الحقيقي **4460 (52%)**. الرقم القديم كان **أقل من الحقيقة**، لا مبالغًا فيه. بعد **1226** إعادة تأليف بقيت **3233**:

| المستوى | قوائم الانتظار الباقية |
|---|---|
| A1 | **0** |
| A2 | 1354 |
| B1 | 1183 |
| B2 | 477 |
| C1 | 219 |
| **الإجمالي** | **3233 من 8572 (37.7%)** |

**آلية الاستئناف:** `content/review/queues/template-<level>.json` تُبنى بأمر `node tools/content-review.mjs --queues`؛ والسجل يستعمل نطاقًا `vocab-queue:<name>` كي تُحتسب الدفعة بعناصرها بالضبط لا بمستوى كامل. ملفات الدفعات المؤلَّفة في `content/review/vocab-examples/*.json` (15 ملفًا)، وأثر كل حقل قبل/بعد في `reports/content-review/vocab-example-rewrites.json` (770 سجلًا في 15 دفعة)، وقائمة مراجعة مستقلة لكل دفعة في `content/review/queues/<batch>-review.json`.

---

## 4-ب) الجولة الكبرى — 704 مثالًا في ثلاث عشرة دفعة

كل دفعة مرّت بالبوّابة `tools/check-vocab-batch.mjs` (قالبية مؤكَّدة، تطابق الجذر، تشابه ≥ الحد، تكرار حرفي/قريب عبر المعجم كله، طول الترجمة، عدد الكلمات) ثم طُبِّقت بـ `tools/rewrite-vocab-examples.mjs --apply` (يكتب `senses[0].exampleEs/Ar` و`examples[0].es/ar` معًا، ويترك بقية الحقول كما هي)، ثم أُعيد تشغيلها للتحقق من الـ idempotency.

| الدفعة | الملف | العدد | بوابة التطبيق |
|---|---|---|---|
| B20 | `a1-verbs-core55` | 55 | نظيفة |
| B21 | `a1-compounds-home60` | 60 | نظيفة |
| B22 | `a1-compounds-food70` | 69 | نظيفة (68 صفًا ← 69 بعد دمج رأس مكرر) |
| B23 | `a1-everyday-nouns65` | 65 | فشلت أولًا على `junio` (تشابه 0.50 مع `cumpleaños`) ← أُعيدت إلى «Las clases terminan en junio.» |
| B24 | `a2-adjectives-nouns70` | 70 | فشلت أولًا على `escaso` (الجذر لم يُطابق) و`ovalado` (0.60 مع `cuadrado`) ← أُصلحتا |
| B25 | `a2-nouns-everyday55` | 55 | نظيفة |
| B26 | `a1-nouns-r-s55` | 55 | نظيفة من أول تشغيل |
| B27 | `a1-nouns-mood-senses54` | 54 | نظيفة بعد إصلاح ترجمة واحدة (حروف لاتينية) |
| B28 | `a1-adverbs-clave57` | 57 | نظيفة (صُحّحت 4 ترجمات بمراجعة يدوية) |
| B29 | `a1-tech-sports-compounds55` | 55 | نظيفة (صُحّحت «falta» ← مخالفة) |
| B30 | `a1-home-arts-wildlife53` | 53 | نظيفة من أول تشغيل |
| B31 | `a1-health-food-money53` | 53 | نظيفة (صُحّحت صياغة «otitis») |
| B32 | `a2-verbs-segment1-60` | 60 | نظيفة بعد إصلاح أداة الفحص (علامة «؟») |
| **المجموع** | **13 دفعة** | **704** | — |

**نماذج قبل/بعد (إسباني + عربي):**

| المدخل | قبل | بعد | الترجمة العربية |
|---|---|---|---|
| `papa` (البابا) | Mi papá cocina los domingos. | El papa visitó España el mes pasado. | زار البابا إسبانيا الشهر الماضي. |
| `papá` (الأب) | El papa es muy importante en la vida cotidiana. | Mi papá trabaja en un taller. | أبي يعمل في ورشة. |
| `junio` | El junio es un concepto clave en este contexto. | Las clases terminan en junio. | تنتهي الدراسة في يونيو. |
| `abundante` | Esta persona es sumamente abundante en su vida cotidiana. | Esta región recibe lluvia abundante en invierno. | تستقبل هذه المنطقة أمطارًا غزيرة في الشتاء. |
| `escaso` | Esta persona es sumamente escaso en su vida cotidiana. | El espacio es escaso en el centro de la ciudad. | المساحة ضيقة في وسط المدينة. |
| `ovalado` | Esta persona es sumamente ovalado en su vida cotidiana. | Compré un mantel ovalado para la mesa. | اشتريت مفرش مائدة بيضاويًا. |
| `freno` | El freno es muy conocido en este ámbito. | El freno de la bici no funciona. | فرامل الدراجة لا تعمل. |
| `baño maría` | El baño maría resulta muy común en el entorno cotidiano. | Derrite el chocolate al baño maría. | أذب الشوكولاتة على حمام مائي. |
| `sereno` | Esta persona es sumamente sereno en su vida cotidiana. | Se quedó sereno durante la discusión. | بقي هادئًا أثناء الجدال. |
| `huésped` | El huésped es un concepto clave en este contexto. | El huésped de la habitación cinco pidió una toalla. | نزيل الغرفة الخامسة طلب منشفة. |
| `buitre` | El buitre es muy conocido en este ámbito. | Un buitre volaba sobre el campo. | كان النسر يحلّق فوق الحقل. |

**عيب مستقل كشفه فحص التكرار:** مدخل `papa` (البابا) كان يحمل جملة عن **الأب** — مثال لا يخصّ المعنى إطلاقًا (تشابه لفظي فقط). أُعيد تأليفه، وأُضيف **اختبار انحدار** يثبّت أن لكل من `papa` و`papá` جملته ومعناه وترجمته، وأن الأداة لا تكتب في المدخل الخاطئ (كانت تطابق بعد حذف التشكيل — أُصلحت لتطابق حرفيًا أولًا).

**ملاحظة صدق:** هذه الـ 774 جملة كُتبت يدويًا مقابل معنى كل مدخل ومستواه، ولم تُستبدل بقوالب أخرى ولا بترجمة آلية. ما بقي (3233) هو حدّ العمل الحقيقي المتبقي، وأكبر عائلاته بعد الجولة:

| العائلة القالبية | العدد المتبقي |
|---|---|
| `Suelo X todos los días con atención.` (أفعال) | 363 |
| `El X resulta muy común en el entorno cotidiano.` | 319 |
| `La X resulta muy común en el entorno cotidiano.` | 277 |
| `La X es muy importante en la vida cotidiana.` | 207 |
| `El X es muy importante en la vida cotidiana.` | 201 |
| `La X resulta fundamental en los análisis avanzados.` | 153 |
| بقية العائلات (34 عائلة) | 1713 |
| **الإجمالي** | **3233** |

الأولوية للدفعة التالية: عائلة `El/La X resulta muy común…` في A2 (666)، بحسب ترتيب `tools/vocab-batch-plan.mjs`.

---

## 4-ج) إكمال A1 — 272 مثالًا في خمس دفعات (B27–B31) + دفعة A2 (B32)

**الهدف المعلن لهذه الجولة: إنهاء الـ 272 مثالًا القالبيًا المتبقي في A1.** أُعيد حساب العدد من ملفات المصدر قبل البدء بالكاشف القانوني نفسه (`isTemplateExample`) فكان **272** بالضبط — مطابقًا لقائمة الانتظار، لا مأخوذًا من تقرير قديم.

| الدفعة | الملف | المحتوى | العدد |
|---|---|---|---|
| B27 | `a1-nouns-mood-senses54` | أسماء شائعة (q–t): أدوات، مشاعر، أشهر، حياة يومية | 54 |
| B28 | `a1-adverbs-clave57` | 27 ظرفًا + 30 اسمًا «مفهوم محوري» | 57 |
| B29 | `a1-tech-sports-compounds55` | 30 مصطلح تقنية/إنترنت + 25 مصطلح رياضة | 55 |
| B30 | `a1-home-arts-wildlife53` | مطبخ ومنزل + فنون + حيوانات ونباتات | 53 |
| B31 | `a1-health-food-money53` | صحة وطب + طعام + أعمال ومصارف + صفات + فعل | 53 |
| **A1** | | | **272** |
| B32 | `a2-verbs-segment1-60` | 60 فعلًا A2 من عائلة `Suelo X` | **60** |

**النتيجة: قائمة الانتظار A1 = 0** (`content/review/queues/template-a1.json` مكتوب بمعرّفات فارغة، لا بحذف الملف).

**نماذج قبل/بعد من دفعات A1:**

| المدخل | قبل | بعد | الترجمة العربية |
|---|---|---|---|
| `televisor` | El televisor es muy importante en la vida cotidiana. | Vemos las noticias en el televisor del salón. | نشاهد الأخبار على تلفاز الصالة. |
| `tijeras` | La tijeras es muy importante en la vida cotidiana. | Necesito las tijeras para cortar el papel. | أحتاج المقص لقصّ الورق. |
| `septiembre` | El septiembre es muy importante en la vida cotidiana. | Volvemos al colegio en septiembre. | نعود إلى المدرسة في سبتمبر. |
| `lentamente` | Trabajamos lentamente para lograr el éxito en cada tarea. | El profesor habla lentamente para que entendamos. | يتحدث المعلم ببطء لنفهم. |
| `probablemente` | Trabajamos probablemente para lograr el éxito en cada tarea. | Probablemente llueva mañana por la tarde. | من المحتمل أن تمطر غدًا بعد الظهر. |
| `puerto usb` | El puerto usb resulta fundamental en el desarrollo informático moderno. | Conecta el teclado al puerto USB del ordenador. | وصّل لوحة المفاتيح بمنفذ يو إس بي في الحاسوب. |
| `tarjeta amarilla` | La tarjeta amarilla resulta muy popular entre los deportistas. | El jugador recibió una tarjeta amarilla por falta. | حصل اللاعب على بطاقة صفراء بسبب مخالفة. |
| `exprimidor eléctrico` | El exprimidor eléctrico resulta muy práctico para el hogar moderno. | Preparo el zumo con el exprimidor eléctrico. | أحضّر العصير بالعصارة الكهربائية. |
| `murciélago` | El murciélago es una maravilla de la naturaleza y del medio ambiente. | Un murciélago salió de la cueva. | خرج خفاش من الكهف. |
| `insulina` | La insulina es de suma importancia en el campo de la medicina. | Mi abuelo se pone insulina antes de comer. | يأخذ جدي الإنسولين قبل الأكل. |
| `reiniciar` | Los ingenieros suelen reiniciar con gran precisión en los sistemas. | Voy a reiniciar el ordenador porque va lento. | سأعيد تشغيل الحاسوب لأنه بطيء. |
| `aburrir` (A2) | Suelo aburrir todos los días con atención. | La película me aburrió y me dormí. | أضجرني الفيلم فنمت. |

**مراجعة عربية يدوية داخل الدفعات** (لا يكشفها أي فاحص آلي): صُحّحت 8 ترجمات قبل التطبيق — «esta película» (مؤنث) كانت «هذه الفيلم»، و`vitamina` نُقلت بدقة («في البرتقال فيتامينات كثيرة»)، و`vocal` استُبدل مصطلحها النحوي، و`seguramente` خُفّف إلى «على الأرجح»، و`otitis` أُعيدت صياغتها، و`devolver` وُحّد فيها الجمع، و`colocar` نُقلت بمعناها الحرفي، و`falta` الرياضية صارت «مخالفة» لا «خطأ».

**عيوب أدوات أُصلحت في هذه الجولة (لا في المحتوى):**
1. `content-review.mjs --queues` كان يتخطى كتابة المستوى الذي بلغ صفرًا، فيترك `template-a1.json` القديم على القرص يوهم بوجود 272 مهمة متبقية. صار يكتب ملفًا فارغًا لكل مستوى، وأعاد اختبار المطابقة النجاح.
2. `check-vocab-batch.mjs` كان يرفض «؟» كعلامة ختام للترجمة العربية — عيب تدويل يعاقب ترجمة سليمة. صار يقبل `؟` مع `.` و`!` و`?`.

---

## 4-د) تحذير صدق على رقم «مُراجَع»

`computeCoverage` يحسب «المُراجَع» من نطاقات الدفعات (`scopes`)، وبعض الدفعات المبكرة (B05، B06، B11) استعملت نطاق **حزمة كاملة** (`bundle:cv-verbs-expanded` وغيرها) لا قائمة معرّفات. النتيجة أن مداخل كثيرة دخلت «المُراجَع» بمجرد أنها تنتمي إلى حزمة قُرئت، دون أن يُعاد تأليف مثالها. لذلك:

- **الرقم الموثوق هو `corrected` = 1239 مدخلًا**، ولكل واحد منها ملاحظة في السجل بأثر قبل/بعد وملف دفعة.
- رقم «المُراجَع 2145» **حدّ أعلى** لا حقيقة مقيسة، و«المتبقي 6427» مقابله **حدّ أدنى**.
- الرقم المستقل عن هذا الالتباس هو **الأمثلة القالبية**: **3233 من 8572 (37.7%)** محسوبة بالكاشف نفسه على الملفات.

لم أُخفِ هذا الخلل ولم أُعدّل السجل التاريخي لتجميل الرقم.

---

---

---

## 4-هـ) B33 — عائلة «resulta muy común» (A2) + الترجمة المصرية

**تصحيح عدد مطلوب التحقق منه:** طُلب أن العائلة تضم 666 مدخلًا. القياس الفعلي من الملفات: **666 صحيح، لكنه مجموع كل المستويات** — A2 **279** · B1 **248** · B2 **131** · C1 **8**. لذا نُفِّذت الدفعة على **A2 (279)** لأن عمل هذه الجولة A1/A2، لا على الـ 666.

**معيار الاختيار:** الكلمات اليومية الأكثر فائدة في المحادثة داخل العائلة (صحة، منزل، تنفل، عمل، حياة اجتماعية) لا الأسماء المركّبة النادرة.

| المجال | أمثلة من الدفعة |
|---|---|
| صحة | calambre muscular · receta médica oficial · congestión nasal · cobertura médica |
| منزل | caldera de calefacción · pasillo estrecho · papelera de reciclaje · ovillo de lana |
| تنقل | neumático de repuesto · peaje de autopista · peatón precavido · salpicadero del coche |
| عمل | categoría profesional · cursillo de formación · compañerismo · comisión de expertos |
| اجتماعي | broma pesada · cotilleo · pandilla de amigos · recado urgente |

**جديد في هذه الدفعة — الترجمة المصرية.** لكل مدخل من الـ 70 ثلاثة نصوص الآن: `exampleEs` + `exampleAr` (فصحى) + **`exampleArEg` (مصري)**، وتُكتب في `senses[0]` و`examples[0]` معًا. الحقل موجود في المخطط من قبل (كان ممتلئًا في 471 من 8573 معنى) لكن الأدوات لم تكن تكتبه. أُضيف:
- كتابة `arEg` في `tools/rewrite-vocab-examples.mjs`.
- فحصه في `tools/check-vocab-batch.mjs` (حروف عربية فقط · طول · علامة ختام · **وليس نسخة حرفية من الفصحى**).
- اختباران في `tests/content-review-fixes.test.ts` يثبّتان المزامنة في الموضعين.

**نماذج قبل/بعد (حرفية من السجل):**

| المدخل | قبل (قالب) | بعد — إسباني | فصحى | مصري |
|---|---|---|---|---|
| `calambre muscular` | El calambre muscular resulta muy común en el entorno cotidiano. | Me dio un calambre muscular en la pierna. | أصابني تشنج عضلي في الساق. | جاتلي شدّة عضلية في رجلي. |
| `receta médica oficial` | La receta médica oficial resulta muy común en el entorno cotidiano. | El farmacéutico pidió la receta médica oficial. | طلب الصيدلي الوصفة الطبية الرسمية. | الصيدلي طلب الروشتة الرسمية. |
| `pasillo estrecho` | El pasillo estrecho resulta muy común en el entorno cotidiano. | El pasillo estrecho lleva a las habitaciones. | الممر الضيق يؤدي إلى الغرف. | الطرقة الضيقة بتودّي على الأوض. |
| `peaje de autopista` | El peaje de autopista resulta muy común en el entorno cotidiano. | El peaje de autopista cuesta ocho euros. | رسوم الطريق السريع ثمانية يورو. | رسوم الأوتوستراد بتمن تمانية يورو. |
| `broma pesada` | La broma pesada resulta muy común en el entorno cotidiano. | Me hicieron una broma pesada en la oficina. | أطلقوا مزحة ثقيلة عليّ في المكتب. | عملوا معايا مقالب تقيلة في المكتب. |
| `cotilleo` | El cotilleo resulta muy común en el entorno cotidiano. | No me interesa el cotilleo del vecindario. | لا يهمني قيل وقال الجيران. | مش فارق معايا كلام الجيران. |
| `categoría profesional` | La categoría profesional resulta muy común en el entorno cotidiano. | Mi categoría profesional cambió este año. | تغيّرت درجتي المهنية هذا العام. | درجتي الوظيفية اتغيّرت السنة دي. |
| `salpicadero del coche` | El salpicadero del coche resulta muy común en el entorno cotidiano. | Dejé las gafas en el salpicadero del coche. | تركت النظارة على لوحة قيادة السيارة. | سيبت النضارة على تابلوه العربية. |
| `pandilla de amigos` | La pandilla de amigos resulta muy común en el entorno cotidiano. | Salgo con mi pandilla de amigos los viernes. | أخرج مع شلّة أصدقائي أيام الجمعة. | بنزل مع شلّة أصحابي يوم الجمعة. |
| `oblea` | La oblea resulta muy común en el entorno cotidiano. | El helado viene entre dos obleas. | تأتي المثلجات بين قطعتين من البسكويت الرقيق. | الآيس كريم بييجي بين قطعتين بسكوت رفيع. |
| `bordillo de la acera` | El bordillo de la acera resulta muy común en el entorno cotidiano. | El niño esperó en el bordillo de la acera. | انتظر الطفل على حافة الرصيف. | الطفل استنى على حرف الرصيف. |

**عيب كشفته البوّابة:** الصيغة الأولى لـ `pasatiempo favorito` كانت «Leer es mi pasatiempo favorito.» وتكرّرت **حرفيًا** مع المدخل الموجود `pasatiempo` ⇒ رفضتها بوّابة التكرار، فاستُبدلت بـ«Su pasatiempo favorito es arreglar bicicletas viejas.».

**مراجعة يدوية قبل التطبيق (4 تعديلات):** `celos infantiles` (كانت «del bebé nuevo» ← «de su hermanito»)، `cicatriz de herida` (كانت جملة تعريفية مكررة اللفظ ← جملة موقف)، `columna vertebral` (كانت جملة قاموسية ← «Me duele la columna vertebral desde ayer»)، `peatón precavido` (كانت الترجمة المصرية فضفاضة ← «اللي بيعبر الطريق لازم يبص الأول»).

**معلَّق للمراجعة البشرية (لا أخطاء مؤكدة):** مصطلحات طبية/تقنية في الدفعة (`columna vertebral`, `congestión nasal`, `cobertura médica`) مكتوبة بصيغة فصحى تعليمية مقبولة، لكن هل تناسب مستوى A2 في السياق المصري؟ هذا حكم تحريري بشري؛ الجمل نفسها سليمة نحويًا.

---

## 4-و) حملة B34–B40 — نُفِّذت (تحديث 30 أكتوبر 2026)

**بعد B33:** 3233 مثالًا قالبيًا من 8572 (37.7%). A1 وPREA1 صفر.
**بعد B34–B40:** **2580** مثالًا قالبيًا من 8572 (30.1%) — **653** تصحيحًا موثَّقًا، كلها A2.

| المستوى | قبل الحملة | بعد الحملة | أكبر عائلة متبقية |
|---|---|---|---|
| A1 | 0 | **0** | — |
| A2 | 1354 | **701** | `Suelo X` (79) · `de suma importancia` (79) · `Trabajamos X` (56) · `concepto clave` (12) |
| B1 | 1183 | 1183 | يُحسب عند بدء المستوى |
| B2 | 477 | 477 | — |
| C1 | 219 | 219 | — |
| **الإجمالي** | **3233** | **2580** | |

**الدفعات المنفَّذة (بوّابة ← تطبيق ← سجل ← اختبارات):**

| الدفعة | المحتوى | العدد |
|---|---|---|
| B34 | `es muy importante` (m–p) | 83 |
| B35 | `es muy importante` (بقية) | 85 |
| B36 | `es muy importante` (n–t) | 100 |
| B37 | ختام `es muy importante` + `resulta muy común` | 102 |
| B38 | `resulta muy común` (c–t) | 95 |
| B39 | ختام `resulta muy común` + `concepto clave` | 100 |
| B40 | `concepto clave` (i–v) | 88 |

**ما صار مستنفدًا:** `El/La X es muy importante en la vida cotidiana` (150 → 0) و`El/La X resulta muy común en el entorno cotidiano` (666 → 0).

**التقرير الكامل للحملة** — بما فيه قبل/بعد حرفي، والأخطاء اللغوية المكتشفة، والخلل البرمجي المُصلَح مع اختبار انحداره، وكل نتائج الاختبارات ومقارنة التنبيهات بالأساس (9537 = الأساس، 0 جديد) — في **`reports/final-report-2026-10-30-campaign-b34-b40.md`**.

**الدفعة التالية المقترحة (لم تبدأ):** B41 — A2، `Suelo X` (79) ثم `de suma importancia` (79)، بالبروتوكول نفسه (60–100 لكل دفعة، مصري أصلي لكل مدخل).

---

## 5) بوّابات الجودة — الأوامر والنتائج الفعلية

| الأمر | النتيجة |
|---|---|
| `node tools/validate-content.mjs --dir content/drafts` | **PASS** · 0 خطأ · 9537 تنبيهًا غير حاجز (0 جديد مقابل الأساس) · 256 ملف درس (236 درسًا فريدًا) · 8572 مدخل مفردات · 1546 تمرينًا · 17/28 نوعًا |
| `npx tsc --noEmit` | **نظيف** |
| `npx vitest run` (كامل) | **51 ملفًا / 643 اختبارًا ناجحًا** — 0 فاشل |
| `npx vitest run tests/content-quality … content-integrity … curriculum … content-review-fixes` | **4 ملفات / 56 اختبارًا ناجحًا** |
| `npx vitest run tests/content-review-fixes.test.ts` (جديد) | **18/18** |
| `npm run build` | ✅ 268 ms · JS أساسي 306.25 kB (91.81 gzip) · CSS 72.36 kB |
| `node tools/content-review.mjs --apply --dry-run` | 0 تصحيح معلّق (تجربة بلا كتابة) · 82 تصحيحًا مطبَّقًا سابقًا |
| `node tools/content-review.mjs --scan` | **56** مرشّحًا آليًا (انخفض من 57 بعد الدفعات)، كلها عائلات معروفة |
| `node tools/content-review.mjs --queues` | 6 قوائم، إجمالي **2580** بعد حملة B34–B40 (PREA1 0 · A1 **0** · A2 **701** · B1 1183 · B2 477 · C1 219) |
| `node tools/strip-option-answer-flags.mjs` (تحقق) | **0** علامة متبقية (كانت 276) |
| `node tools/rewrite-vocab-examples.mjs <batch>` (إعادة تشغيل 23 ملفًا) | **0 تطبيق جديد، 1226 «مطبَّق سابقًا»** ⇒ idempotent |
| `node tools/content-review.mjs --sql` | 2676 سجل مراجعة |

**اختبارات الانحدار الجديدة** (`tests/content-review-fixes.test.ts`) تحرس: انعدام «(الصواب)» في أي خيار · بقاء العبارة التربوية المشروعة في `pedagogy` · انعدام `La … es muy conocido/resulta muy práctico` في المعجم كله · أمثلة معاد كتابتها تحترم المطابقة ولها ترجمة · جواب `ex-a2-tel-5` موجود نصًّا في التسجيل والتعليمة/الشرح متطابقان · كل قوائم الانتظار تشير إلى معرّفات موجودة · عدد قائمة A1 = عدد ما يحسبه الكاشف · كل نطاقات `vocab-queue:` في السجل لها ملفات · كل مثال في 23 دفعة مطبَّق فعلًا في الفهرس وغير قالبي · `papa` و`papá` لا يتبادلان الجمل ولا يكتبان في مدخل بعضهما.

---

## 6) ما تبقّى معلَّقًا (17 ملاحظة + 4 مؤجّلة)

- **عالية:** عائلة الأمثلة القالبية الباقية (F-360: **2580** مدخلًا، 30.1% من المعجم بعد 653 تصحيحًا في B34–B40) والمرتبطة بها صياغة المعاني العربية في الحزم المولَّدة (F-319، متوسطة). `ex-a2-tel-5` أُغلق.
- **متوسطة:** `F-059/F-057` عائلة `listen_choose` المجرّدة (خيارات مفردات بدل إجابة) · `F-024` مشتّت ينتج جملة صحيحة · `F-085` ترجمة `desplomar/desplomarse` متطابقة · `F-100` المثال العربي المنسوخ من القالب (بقي في مداخل لم تُراجَع بعد).
- **منخفضة:** `F-025` بديل مقبول بلا `del` · `F-026` جملة تغطية غير طبيعية · `F-058` بناء `Ojalá` · `F-039` تصنيف مستوى · `F-318` جذع بفراغ في `listen_choose`.
- **مؤجّلة (4):** `F-019…F-022` — تعارض تعليمة/مفتاح في `tr-u6-ayuda_3_fill` يحتاج قرار تحرير.
- **ديون غير لغوية معلنة:** 67 مدخلًا غير مُدخَل · 418 مفردة بانتظار الصوت · 17 من 28 نوع تمرين مستخدم.

---

## 7) تأكيد نهائي

### ملاحظة حرجة على حالة Git في بداية B33

عند الفحص المسبق تبيّن أن المستودع **أُعيد استنساخه**: `git reflog` يظهر `clone: from github.com/...` ثم إنشاء الفرع من `cb32181`، أي أن **29 التزامًا محليًا (B12–B32) والوسوم الخمسة السابقة لم تعد في قاعدة الكائنات**. لم يكن شيء مدفوعًا (بحسب تعليمات المشروع) فلا مصدر للاسترجاع من `origin`.

**ما نجا:** شجرة العمل كاملة. تحقّقت قبل أي تعديل أن الحالة مطابقة تمامًا لنهاية B32: السجل 1270 ملاحظة/31 دفعة · أثر التدقيق 1157 سجلًا · 22 ملف دفعة · A1 = 0 قالب · الإجمالي 3303 من 8572.

**الإجراء:** بدل إعادة بناء التاريخ من الذاكرة (خطر التكرار والاختلاق)، ثُبِّتت الشجرة الفعلية في التزام واحد `af5d1f9` على الفرع نفسه، ووُسم `backup-2026-10-30-pre-b33-recovery` **قبل** أي تعديل. ثم نُفِّذت B33 فوقه.

**الأثر:** أرقام الالتزامات السابقة المذكورة في تقارير قديمة (`d1258bc`, `07083ff`, …) لم تعد قابلة للاستدعاء في هذا المستودع؛ المحتوى نفسه موجود ومُوثَّق في `af5d1f9`.

**لم يُنفَّذ أي `push`، ولا دمج إلى `main`، ولا نشر، ولا رفع دروس، ولا استيراد إلى D1 الإنتاجي، ولا تغيير لأي سرّ إنتاجي.**

**حالة Git النهائية (مقيسة):** الفرع `arena/8aba50bb-espanol` · رأس دفعة B33 = `195c210` (الوسم `backup-2026-10-30-post-b33`) · **التزامان** فوق `cb32181`: `af5d1f9` (استرجاع الشجرة كاملة بعد إعادة استنساخ المستودع) ثم `195c210` (B33) · لا upstream، لا شيء مدفوع. الشجرة نظيفة تمامًا عدا التقارير الخمسة غير المتتبَّعة (`perf-*`, `ui-audit.json`, `redesign-v2-report.md`). الوسوم المحلية: `backup-2026-10-30-pre-b33-recovery` → `af5d1f9` · `backup-2026-10-30-post-b33` → `195c210`. لا `reset` ولا `clean` ولا `force`، ولم يُحذف أي محتوى أو درس أو تمرين.
الفرع `arena/8aba50bb-espanol` بلا upstream (لم يُدفع أبدًا). العمل كله محلي: تعديل ملفات `content/drafts`، أدوات في `tools/`، اختبارات في `tests/`، وسجل مراجعة في `content/review/`. المحتوى بأكمله ما زال `draft / unreviewed`، والوسم الاحتياطي محلي وجاهز للاسترجاع إن لزم.
