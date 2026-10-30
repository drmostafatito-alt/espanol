# تقرير حملة B41–B49 — إتمام قوالب A2 + مراجعة SQL

**التاريخ:** 30 أكتوبر 2026 · **الفرع:** `arena/8aba50bb-espanol` · **الحالة:** كل المحتوى **draft / unreviewed**.
**نقطة الاسترجاع:** الوسم **`backup-2026-10-30-pre-b41`** على `6c3b05a` (HEAD عند بداية الحملة).
**الالتزامات:** `58de1d0` ثم `…` (EG) فوق `6c3b05a` — محلية فقط، **بلا push وبلا merge** · **الوسوم:** `backup-2026-10-30-pre-b41` · `backup-2026-10-30-post-b49`.

---

## 1) الملخّص

| البند | القيمة |
|---|---|
| مُصحَّح فعليًا في هذه الحملة (قبل/بعد في السجل) | **1072** مدخلًا فريدًا = 835 (B41–B49) + 237 (EG-1…EG-3) |
| الدفعات | 9 (B41…B49) بحجم 78–99 |
| A2 قبل الحملة ← بعدها | **476 ← 2** |
| إجمالي الأمثلة القالبية (كل المستويات) | **2712 ← 2153** من 8572 (25.1%) |
| السجل | 1993 ← **3065** finding · 36 ← **51** دفعة |
| سجل التقارير | 30 ← **39** دفعة · 1880 ← **2715** سجلًا |
| الترجمات المصرية | **1072** جملة جديدة/مراجَعة (835 في دفعات القوالب + 237 في دفعات إصلاح الحقول) |
| اختبارات | **658/658** (52 ملفًا) · TypeScript نظيف · البناء ناجح · SQL PASS |
| تنبيهات `validate-content` | **9537** = الأساس تمامًا (0 جديد) |

**النتيجة اللغوية:** قوالب A2 أُنجزت بالكامل تقريبًا — بقي **مدخلان فقط** أوقفهما خطأ إملائي في **رأس المدخل نفسه** (انظر §6)، لا في المثال.

---

## 2) الدفعات — الأعداد والنطاق

| الدفعة | العائلة/المحتوى | العدد |
|---|---|---|
| B41 | `Suelo X todos los días con atención.` (أفعال يومية) | **79** |
| B42 | `Trabajamos X…` (أحوال) + `La X es de suma importancia…` (صحة) | **99** |
| B43 | ختام `suma importancia` + `El X…suma importancia` + `Solemos X con mucha frecuencia` | **84** |
| B44 | `El X resulta muy popular entre los deportistas` + `…muy práctico para el hogar` + `Solemos X` | **99** |
| B45 | `concepto clave en el desarrollo científico y tecnológico` (م/مؤ) + `enriquece el patrimonio cultural` | **99** |
| B46 | `Solemos X con bastante regularidad` + `desarrollo informático` + `maravilla de la naturaleza` + رياضة | **99** |
| B47 | `enriquece la cultura` + `negocios` + `maravilla` + `organizar el viaje` + `Debemos X` | **99** |
| B48 | `organizar el viaje` + `ingrediente en la cocina` + `Solemos…trabajo diario` + `Este rasgo…` + `negocios` + `patrimonio` + `Solemos…frecuencia` | **99** |
| B49 | ختام 10 عائلات: حاسوب واتصالات وأفعال وأدوات ورياضة | **78** |
| **الإجمالي** | | **835** |

---

## 3) عيبان جوهريان كُشفا في هذه الحملة (وأُصلحا جذريًا)

### 3-أ) كاشف القوالب كان يفوّت عائلات كاملة (394 جملة)

**الأثر:** أُعلن سابقًا «A1 = 0 مثال قالبي» وهو **غير صحيح**. عائلتان على الأقل كانتا مكتوبتين بصيغة لا تطابق أي نمط في `VOCAB_TEMPLATE_PATTERNS`، فبقيت خارج كل قوائم الانتظار:

| العائلة الفعلية في المحتوى | العدد | لماذا فاتت |
|---|---|---|
| `El/La X es un concepto clave en el desarrollo científico y tecnológico.` | 40 (A2) + 30 (A2) + 24 (A1) + 11 (A1) | النمط مكتوب `…y **técnico**` لا `…y tecnológico` |
| `El/La X enriquece el patrimonio cultural de la sociedad.` | 29 + 10 (A2) + 7 + 6 (A1) | لا نمط لها إطلاقًا |
| `Solemos X con bastante regularidad en nuestras actividades.` | 27 (A2) | لا نمط لها إطلاقًا |
| `En este sentido, X, conviene mantener la claridad expositiva.` | 11 (C1) | لا نمط لها إطلاقًا |

**الإصلاح:** إضافة الأنماط الناقصة في `tools/lib/content-review.mjs` (**تشديد، لا تخفيف** — الكاشف أصبح يرى أكثر).
**الأثر العددي الصادق:** عند قياس الحالة نفسها بعد الإصلاح صارت: A1 **48** (كانت 0) · B1 1339 (كانت 1183) · B2 534 (كانت 477) · C1 230 (كانت 219) · A2 575 (كانت 439).
**اختبار انحدار:** «لا عائلة قالبية (8 مداخل أو أكثر) تفوت الكاشف في أي مستوى» — يفشل فورًا لو أُضيفت عائلة جديدة بلا نمط.

### 3-ب) أداة التطبيق كانت تحتفظ بقائمة قوالب ثانية

`tools/rewrite-vocab-examples.mjs` كان ينسخ `KNOWN_TEMPLATES` محليًا، فرفض تطبيق B45 (99 مدخلًا) رغم أن البوّابة تقبلها وتؤكدها قالبية. **الإصلاح:** حذف القائمة المحلية واستيراد `isTemplateExample` من المصدر الوحيد `tools/lib/content-review.mjs`، مع **اختبار انحدار** يمنع عودة القائمة الخاصة.

### 3-ج) مراجعة SQL — 153,416 أمرًا لم تكن كلها لازمة

| الفحص | قبل | بعد |
|---|---|---|
| عدد الأوامر | 153,416 | **137,847** (‏−15,569) |
| `vocabulary_tags` | **16,384** أمرًا لـ**75** وسمًا فقط | **75** أمرًا (الأمر كان يُصدر داخل حلقة «مدخل × وسم») |
| مفاتيح مكرّرة | `programs` ستّ مرات لـ`main-track` بوصف مختلف لكل مستوى (وآخر أمر يفوز ⇒ وصف البرنامج يمليه ترتيب الملفات) · 15 مدخل مفردات · 15 جملة · 26 صيغة · 17 ترجمة | **0 مفتاح مكرّر** |
| تعارضات محتوى | كانت تُحسم صامتة بالترتيب | **62 تعارضًا مُبلَّغًا صراحةً** في بيان التصدير (أول ظهور يفوز) |
| إعادة التنفيذ | `ON CONFLICT` في 100% من الأوامر، بلا معاملة جماعية (تقسيم بدفعات) | كما هو + بلا تكرار ⇒ إعادة التنفيذ آمنة محليًا |

**الإصلاح:** `dedupePlanStatements()` في `tools/lib/content-plan.mjs` (مفتاح الصفّ من عمود `id` أو من أول عمودين في جداول الربط) + **9 اختبارات انحدار** في `tests/sql-plan-dedupe.test.ts`، منها فحص على الخطة الحقيقية: لا مفتاح مكرّر، و`main-track` يُكتب مرة واحدة وبالسطر الأساسي (`level_code NULL`).
**لم يُستورد شيء إلى أي قاعدة بيانات** — التصدير ملف محلي فقط.

---

## 4) أمثلة قبل/بعد حرفية من السجل

| id | المدخل | قبل | بعد |
|---|---|---|---|
| F-2030 | `emparejar` | Suelo emparejar todos los días con atención. | Hay que emparejar cada palabra con su dibujo. |
| F-2109 | `afortunadamente` | Trabajamos afortunadamente para lograr el éxito en cada tarea. | Afortunadamente, el autobús llegó a tiempo. |
| F-2208 | `entrenar` | Solemos entrenar con mucha frecuencia en estas circunstancias. | Voy a entrenar en el gimnasio esta tarde. |
| F-2306 | `delantero centro` | El delantero centro resulta muy popular entre los deportistas. | El delantero centro marcó dos goles. |
| F-2405 | `átomo` | El átomo es un concepto clave en el desarrollo científico y tecnológico. | Cada átomo tiene un núcleo pequeño. |
| F-2504 | `disco duro` | El disco duro resulta fundamental en el desarrollo informático moderno. | El disco duro está casi lleno. |
| F-2603 | `soneto` | El soneto enriquece la cultura y el pensamiento humano. | Escribió un soneto para su mujer. |
| F-2702 | `autovía` | La autovía es fundamental para organizar el viaje. | La autovía estaba llena el domingo. |
| F-2801 | `memoria ram` | La memoria ram resulta fundamental en el desarrollo informático moderno. | La memoria ram de mi portátil es pequeña. |

نماذج ثلاثية (إسباني / فصحى / مصري):

- `emparejar` — «Hay que emparejar cada palabra con su dibujo.» / «يجب مطابقة كل كلمة مع صورتها.» / «لازم تطابق كل كلمة مع صورتها.»
- `ataxic`→`atracar` — «El barco va a atracar a las seis.» / «سترسو السفينة في السادسة.» / «المركب هيرسي الساعة ستة.»
- `pantalla táctil` — «La pantalla táctil no responde bien.» / «الشاشة اللمسية لا تستجيب جيدًا.» / «الشاشة اللمس مش بتستجيب كويس.»

---

## 5) المراجعة اللغوية/الدلالية داخل الدفعات

- **كل مدخل** قُرئ معه معناه العربي أولًا ثم كُتبت جملة تُظهر ذلك المعنى تحديدًا؛ الكلمات متعددة المعاني (`bulto`, `don`, `foco`, `disparo`, `fragmento`, `tirar/atracar`, `yeso`, `zueco`) عُوملت بمعناها الشائع.
- **حالات عُدّلت بعد قراءة ثانية قبل التطبيق:**
  - `suspender` — كان في المسودة «سينتظر…» (خطأ دلالي: المعنى رسب) ⇒ «سيرسب ابن عمي في الامتحان.»
  - `bronquio` — «القصبة الهوائية» في المصرية تسمية القصبة لا الشعبة ⇒ «الهوا بيمشي في شعبة صغيرة لحد الرئة.»
  - `esófago` — «المرئ» فصحى بحتة ⇒ «مريئي» في المصرية.
  - `oscilación`, `hebilla`-شبيهاتها, `raíl`, `colgante`, `higo`, `ladrido` — كل حالة «مصري = فصحى حرفيًا» أعيدت صياغتها.
  - `lente`, `raíl`: مطابقة الأداة/الجنس مع ما يضبطه المعجم.
  - `balar`: تبيّن أنها **ليست** جملة قالبية حسب الكاشف ⇒ أُخرجت من الدفعة (لا تُحتسب مصححة).
- **جمل رُفضت ولم تُعدّل (تحتاج قرارًا بشريًا):** مدخلان رأس الكلمة فيهما خطأ إملائي (`sabíamente` بياء مكسورة زائدة، `traquea` بلا تشكيل والصواب `tráquea`) — كتابة مثال صحيح أصلًا تُخفي الخطأ، وكتابته بالخطأ تُعلّمه. أوقفتهما بدل ترقيع العدد.

---

## 6) ما يحتاج مراجعة بشرية

1. **خطأان إملائيان في رأس المدخل** (`sabíamente` → `sabiamente`، `traquea` → `tráquea`): تغيير رأس المدخل يغيّر معرّفه المشتق (`stableId`)، فلم أغيّره بلا تفويض. هما السبب الوحيد لبقاء 2 في قائمة A2.
2. **62 تعارض مفتاح** في تصدير SQL (تكرار مدخل/جملة بين حزمتين بمستوى مختلف — مثل `hola` بين PREA1 وA1): أول ظهور يفوز الآن، والتعارض مُبلَّغ. الحسم النهائي (أي مستوى يُعتمد) قرار تحريري.
3. **B1 (1339) وB2 (534) وC1 (230) وA1 (48)** لم تُمَس في هذه الحملة؛ أرقامها ارتفعت فقط لأن الكاشف أصبح أدق.
4. 835 جملة إسبانية + 835 مصرية مكتوبة بمعايير المحرّر ولم تخضع لمراجعة بشرية نهائية.

---

## 7) البوّابات — نتائج فعلية

| الأمر | النتيجة |
|---|---|
| `check-vocab-batch` على الدفعات التسع (إعادة فحص) | 9/9 ✅ «كل الفحوص نظيفة» — كل ملاحظات العمل عولجت داخل الدفعة نفسها قبل التطبيق |
| `rewrite-vocab-examples --apply` | 835/835 مطبَّقًا · إعادة التطبيق على التسع = **0 جديد** |
| `validate-content --dir content/drafts` | **PASS** · 0 خطأ · **9537** تنبيهًا = الأساس (0 جديد) |
| `tsc --noEmit` | نظيف |
| `vitest run` | **52 ملفًا · 658/658** |
| `npm run build` | ناجح (299ms) |
| `export-content-sql` | **137,847** أمرًا · 62 تعارضًا مُبلَّغًا · 0 مفتاح مكرّر |
| `check-sql` | **PASS** على الملف المصدَّر وعلى `db/migrations` |
| `content-review --queues` | A2 **2** · A1 48 · B1 1339 · B2 534 · C1 230 = **2153** |

---

## 8) تأكيد صريح

**الإنتاج لم يتغيّر:** لا push، لا دمج إلى `main`، لا نشر، لا دروس منشورة، لا استيراد D1 إنتاجي، لا أسرار ولا إعدادات إنتاج، لا حذف بيانات أو محتوى. كل شيء محلي على فرع واحد، وكل المحتوى **draft/unreviewed**.


---

## 9) ملحق: الأمثلة **العادية** (غير القالبية) — دفعات EG-1…EG-3

المتطلب #3 (مراجعة بقية جمل A2 لا القوالب فقط) بدأ فعليًا بعد إتمام القوالب. المسح على
**3042** مثالًا عاديًا في A2 أعطى هذه الصورة، وهي أول قياس صادق للفجوة المتبقية:

| الفئة | العدد قبل | العدد بعد |
|---|---|---|
| مثال A2 عادي **بلا ترجمة مصرية** (`exampleArEg = null`) | **1357** | **1120** |
| مصرية = فصحى حرفيًا | 7 | 7 (لم تُمَس بعد) |
| جملة إسبانية مكررة حرفيًا بين مدخلين | 22 | 22 (مرشحة للمراجعة التحريرية) |
| جملة أقصر من 4 كلمات | 11 | 11 |

### ما نُفِّذ

| الدفعة | الحزمة | العدد | المحتوى |
|---|---|---|---|
| EG-1 | `cv-nouns-daily` | **87** | إضافة مصرية غائبة (بيت وأثاث ومطبخ وفاكهة) |
| EG-2 | `cv-alphabet-b-f` | **90** | مصرية غائبة + **8 أمثلة أُعيد تأليفها** بقرارٍ مكتوب |
| EG-3 | `cv-lex-nouns-core` | **60** | مصرية غائبة + **55 فصحى أُعيدت كتابتها** (انظر أدناه) |
| | | **237** | |

### عيب جديد كُشف: الفصحى كانت مصرية في حزمة كاملة

في `cv-lex-nouns-core` كان حقل **`exampleAr` (الفصحى)** يحمل جملًا مصرية:
`esposo` → «جوزها مهندس.» · `esposa` → «مراته بتشتغل في المدرسة.» · `despertador` → «بحطّ المنبه الساعة ستة.»
هذا ليس «مصرية ضعيفة» بل **خطأ موضع**: الطالب الذي يقرأ حقل الفصحى يتعلّم عامية في غير موضعها.
في الصفوف الستين التي روجعت، كان **55** منها بهذا الخطأ. الإصلاح: فصحى حقيقية في `exampleAr`
+ المصرية في `exampleArEg`:

| المدخل | قبل (في حقل الفصحى) | بعد (فصحى) | المصرية المضافة |
|---|---|---|---|
| `esposa` | مراته بتشتغل في المدرسة. | تعمل زوجته في المدرسة. | مراته بتشتغل في المدرسة. |
| `despertador` | بحطّ المنبه الساعة ستة. | أضبط المنبه على السادسة. | بحطّ المنبه على ستة. |
| `farmacia` | الصيدلية في الناصية. | تقع الصيدلية في الزاوية. | الصيدلية اللي في الناصية قريبة. |
| `medicina` | باخد الدوا بعد الأكل. | أتناول الدواء بعد الأكل. | باخد الدوا بعد الأكل. |

### أمثلة عادية أُعيد تأليفها في EG-2 (بقرار مكتوب لكل واحدة)

| المدخل | قبل | بعد | السبب |
|---|---|---|---|
| `balar` | Solemos balar con bastante frecuencia. | El cordero empieza a balar cuando tiene hambre. | جملة قالبية بقيت من عائلة «Solemos…» |
| `bello` | Este aspecto resulta muy bello para todos. | El jardín de mi abuela está muy bello en primavera. | قالب «Este aspecto resulta muy…» |
| `bloque` | Debemos superar el simplista cliché de que las culturas son bloques herméticos e inmutables. | El niño juega con un bloque de madera. | جملة B2/C1 بمفردات مجرّدة في مستوى A2 |
| `departamento` | Estimado señor Director: Me pongo en contacto con su departamento. | Mi departamento está en el tercer piso. | جملة رسالة إدارية لا تُظهر المعنى اليومي |
| `destornillador` | Necesito un destornillador para abrir el mueble. | Necesito un destornillador para montar el armario. | معنى خاطئ: المفك للتجميع لا «لفتح» الخزانة |
| `beisbol` | El beisbol es popular en muchos países. | El béisbol es muy popular en Japón. | تعميم بلا مضمون + فصحى «شائعة» بجنس خطأ (البيسبول مذكّر) |
| `dificultad` | Estudiamos mucho; por lo tanto, aprobaremos el examen sin dificultades. | Aprobó el examen sin dificultad. | «por lo tanto» بناء متقدم في A2 + فاعل جمعي غامض |
| `década` | El proyecto fue el más brillante y transformador de la década. | En la última década cambió mucho la ciudad. | تجريد وصفي فوق المستوى |

### أدوات جديدة (مع بوّابة صارمة، لا تطبيق أعمى)

- **`tools/fill-vocab-egyptian.mjs`** — يحرّر أمثلة المفردات **العادية**: يضيف المصرية الغائبة، ويصحّح
  الإسبانية/الفصحى عند الاقتضاء. يرفض الدفعة كاملة إذا: المثال تغيّر عن المسجَّل، أو الجملة الجديدة
  قالبية، أو لا تحتوي المدخل، أو تشابهت (ثلاثيات ≥ 0.5) مع مثال آخر، أو المصرية تساوي الفصحى أو
  تشابهها ≥ 0.8، أو خلت من أثر لهجي مصري على حدود الكلمة (مش/بتاع/عايز/فيه/لسه/كده/ده/دي/لما…
  أو سوابق المضارع ب- والمستقبل هـ-). لا يطمس ترجمة مصرية قائمة إلا إذا أعاد كاتب الدفعة صياغة
  المثال الإسباني نفسه. إعادة التشغيل ⇒ 0 تعديل (idempotent).
- **`tools/replay-content-sql.mjs`** — ينشئ قاعدة SQLite من `db/migrations` (62 جدولًا، `PRAGMA
  foreign_keys=ON`) وينفّذ ملف التصدير **مرتين** ويقارن أعداد الصفوف.
  النتيجة: **138,084 أمرًا** نُفِّذت بنجاح مرتين، و`sentence_translations` 10,848 قبل وبعد ⇒
  إعادة التنفيذ آمنة محليًا. (لا إنتاج، ولا D1.)

### اختبارات مُحدَّثة (بلا تخفيف)

- دفعات إصلاح الحقول تحمل `"kind": "field-repair"`، وأُضيف فرع فحص لها: كل حقل تذكره الدفعة
  يجب أن يكون مطبَّقًا حرفيًا في الفهرس، وكل مدخل يجب أن يملك مصرية.
- عند تعارض دفعتين على المدخل نفسه (مثل `beisbol`)، صار المرجع **آخر** نص موثّق لا الأول —
  قبل ذلك كان الاختبار يفشل بمجرد إصلاح لاحق مشروع.
- 3 اختبارات كانت تفشل بسبب هذا التداخل، والآن **658/658** تمر.

### ما لم يُنجَز في هذا الملحق (بصراحة)

1120 مثالًا A2 عاديًا ما زال بلا ترجمة مصرية، و7 أمثلة مصرية مطابقة للفصحى حرفيًا، و22 جملة
مكررة بين مدخلين. هذه أعداد حقيقية مقيسة من الملفات، لا تقديرات، وستكون أول عمل الدفعة التالية
(EG-4…) إن استُؤنفت الحملة.
