# التقرير النهائي للتدقيق الشامل والتحقق البصري — `FINAL_AUDIT_REPORT.md`

**المستودع:** `https://github.com/drmostafatito-alt/espanol`  
**الفرع النشط:** `feat/duolingo-transformation`  
**فرع النسخة الاحتياطية المحفوظ:** `backup/pre-duolingo-transformation` (`9bc7e2f`)  
**نطاق العمل:** مراجعة تقنية وتعليميةوصوتية وبصرية شاملة، وتوثيق الفروقات الرقمية بدقة، وإصلاح العيوب التي أثبتتها المراجعة الفعلية فقط دون المساس بقاعدة بيانات الإنتاج أو حذف أي محتوى.

---

## 1. حالة Git والفروع والالتزام بالقواعد الإلزامية

| البند | الحالة الفعلية | التحقق |
|---|---|---|
| الفرع الحالي | `feat/duolingo-transformation` | ✅ لم يُدمج في `main` |
| فرع النسخة الاحتياطية | `backup/pre-duolingo-transformation` (`9bc7e2f`) | ✅ محفوظ بالكامل محليًا وعلى `origin` |
| قاعدة بيانات الإنتاج وأسرار Cloudflare | لم تُلمس إطلاقًا | ✅ جميع الفحوصات تمت على بيئة D1 المحلية فقط |
| النشر على Production أو منصة X | لم يتم أي نشر | ✅ التزام كامل |
| حذف دروس أو مفردات أو تمارين | **0 ملفات أو سجلات محذوفة** | ✅ verified عبر `git diff backup/pre-duolingo-transformation..feat/duolingo-transformation -- content/ migrations/` |

---

## 2. مقارنة المحتوى الفعلي بالسابق (القرص مقابل قاعدة البيانات D1)

تم إجراء جرد آلي مباشر لملفات JSON المصدرية على القرص (`content/drafts` و`content/exemplars`) ومقارنتها بسجلات قاعدة البيانات الفعلية (`D1 SQLite`) وبالحالة السابقة في فرع `backup/pre-duolingo-transformation` (`9bc7e2f`):

| المؤشر | القرص (`content/drafts`) | القرص (`content/exemplars`) | الإجمالي على القرص | قاعدة البيانات الفعلية (`D1`) | الحالة السابقة (`backup/pre-duolingo-transformation`) | الفرق الفعلي |
|---|---:|---:|---:|---:|---:|---|
| **ملفات الدروس / الدروس الفريدة** | `256` ملفًا | `3` ملفات (`1` مشترك: `prea1-hola-me-llamo` + `2` فريدان) | `259` ملفًا (`258` معرف `slug` فريد) | **`258` درسًا فريدًا** (`lessons`) | `259` ملفًا / `258` درسًا فريدًا | **0 (تطابق 100%)** |
| **حزم المفردات (`vocab JSON`)** | `61` ملفًا (`8,572` مدخلًا) | `1` ملف (`20` مدخلًا، منها `5` فريدة) | `62` ملفًا (`8,592` سجلًا خامًا) | **`8,577` مدخلًا فريدًا** (`vocabulary_entries`) | `8,577` مدخلًا فريدًا | **0 (تطابق 100%)** |
| **الأشكال الصرفية وتصريفات الأفعال** | مولّدة عبر `import-content.mjs` | — | — | **`65,788` شكلًا صرفيًا** (`vocabulary_forms`) | `65,788` شكلًا صرفيًا | **0 (تطابق 100%)** |
| **التعبيرات والمتلازمات والاصطلاحات** | ضمن حزم المفردات + الدروس | — | `574` بتصنيف صريح / `1,889` متعدد الكلمات | **`574` مدخلًا** (`collocation: 269`, `expression: 183`, `idiom: 122`) + **`580` تركيبًا مستهدفًا** (`targetStructures`) | `574` مدخلًا + `580` تركيبًا | **0 (تطابق 100%)** |
| **الجمل والترجمات وسيناريوهات الحوار** | `146` سيناريو (`572` سطرًا حواريًا) | — | `572` سطر حوار + جمل المعجم | **`8,580` جملة** (`sentences`) + **`13,186` ترجمة** (`8,580` فصحى + `4,606` مصرية) | `8,580` جملة + `13,186` ترجمة | **0 (تطابق 100%)** |
| **التمارين وعناصرها** | `1,546` تمرينًا | `21` تمرينًا (`14` في الدرسين الفريدين + `7` في النسخة القديمة للدرس المشترك) | `1,567` تمرينًا خامًا | **`1,560` تمرينًا نشطًا** (`1,567` إجمالي في جدول `exercises` + `2,309` خيارًا في `exercise_options` + `1,457` عنصرًا في `exercise_items`) | `1,560` تمرينًا نشطًا (`1,567` إجمالي) | **0 (تطابق 100%)** |
| **إجمالي جمل SQL في `build/content-plan.sql`** | — | — | — | **`140,006` جملة `INSERT/UPDATE`** | `140,006` جملة `INSERT/UPDATE` | **0 (تطابق 100%)** |

### توزيع الدروس الـ `258` حسب مستويات الإطار الأوروبي (`CEFR`) والمسارات
- **حسب المستوى (`CEFR`):**
  - **`PREA1` (التمهيد التواصلي + ملحق الصوتيات):** `12` درسًا (الجميع مصنف بوضوح `level_code = 'PREA1'`).
  - **`A1` (المبتدئ):** `41` درسًا (`39` في `drafts` + درسان في `exemplars`: `a1-ar-presente` و`a1-familia`).
  - **`A2` (الأساسي):** `64` درسًا.
  - **`B1` (المتوسط):** `69` درسًا.
  - **`B2` (فوق المتوسط):** `40` درسًا.
  - **`C1` (المتقدم):** `32` درسًا.
  - **المجموع:** `12 + 41 + 64 + 69 + 40 + 32 = 258` درسًا (لا يوجد أي درس في قاعدة البيانات أو الملفات بدون تصنيف مستوى واضح).
- **حسب المسار (`programs`):**
  - **`main-track` (المسار الأساسي من الصفر إلى C1):** `205` دروس عبر `53` وحدة.
  - **`travel` (مسار الإسبانية للسفر):** `24` درسًا عبر `6` وحدات (`A1`–`B1`).
  - **`callcenter` (مسار الكول سنتر وخدمة العملاء):** `29` درسًا عبر `7` وحدات (`A2`–`B2`).

---

## 3. تفسير كل اختلاف في الأعداد بين التقارير السابقة والتقرير الأخير

لم يحدث أي فقدان أو حذف لأي بيانات (`0` حذف). جميع الفروقات الظاهرية في الأرقام المذكورة بين التقارير السابقة والتقرير الأخير ناتجة عن **اختلاف زاوية العدّ (القرص مقابل قاعدة البيانات مقابل السكربتات الجزئية)**:

1. **`244` درسًا مقابل `256` درسًا مقابل `258` درسًا مقابل `259` ملفًا:**
   - **`244` درسًا:** هو الرقم الذي يطبعه سكربت `tools/check-content-integrity.mjs` لأنه يفحص المجلدات `['a1', 'a2', 'b1', 'b2', 'c1', 'travel', 'callcenter']` ويغفل مجلد `prea1` (`12` درسًا): `256 - 12 = 244`.
   - **`256` درسًا:** هو عدد ملفات الدروس داخل `content/drafts/**/lessons/*.json` (وهو ما يطبعه اختبار `tests/content-format-audit.test.ts`).
   - **`258` درسًا:** هو العدد الفعلي للدروس الفريدة في قاعدة البيانات `D1` وفي واجهة المستخدم (`0/258 دروس مكتملة`)، لأن `tools/import-content.mjs` يستورد `256` درسًا من `content/drafts` بالإضافة إلى درسين فريدين من `content/exemplars` (`a1-ar-presente` و`a1-familia`).
   - **`259` ملفًا:** هو مجموع ملفات JSON على القرص (`256` في `drafts` + `3` في `exemplars`)، حيث يتكرر الدرس `prea1-hola-me-llamo` في المجلدين وتعتمد قاعدة البيانات النسخة الأحدث (`v2`) من `content/drafts`.

2. **`8,565` مفردة مقابل `8,572` مفردة مقابل `8,577` مفردة مقابل `8,592` سجلًا مقابل `65,788` شكلًا صرفيًا:**
   - **`8,565` مفردة:** يظهر في `tools/check-content-integrity.mjs` لأنه يتجاهل ملف `content/drafts/prea1/vocab.json`.
   - **`8,572` مفردة:** هو عدد المفردات الفريدة داخل `content/drafts` وحدها (`61` ملفًا).
   - **`8,577` مفردة:** هو العدد الفعلي في جدول `vocabulary_entries` في قاعدة البيانات `D1` وفي تبويب `مستكشف المعجم (8577)`، لأنه يضم `8,572` من `drafts` + `5` مفردات إضافية فريدة من `content/exemplars/a1-greetings-vocab.json`.
   - **`8,592` سجلًا:** هو مجموع عناصر المصفوفات الخام قبل إزالة التكرار (`15` كلمة مشتركة بين `exemplars` و`drafts`).
   - **`65,788` سجلًا:** هو عدد الصفوف في جدول `vocabulary_forms` (تصريفات الأفعال في الأزمنة والضمائر وصيغ الجمع والتأنيث المرتبطة بـ `8,577` مفردة).

3. **`140,006` سطرًا/عنصرًا في تقارير البناء السابقة:**
   - يمثل عدد أوامر SQL (`INSERT`/`UPDATE`) في ملف `build/content-plan.sql` الذي يجمع الدروس + النسخ + المفردات + المعاني + الأشكال الصرفية الـ `65,788` + الجمل الـ `8,580` + الترجمات الـ `13,186` + التمارين الـ `1,567` + الخيارات الـ `2,309` + عناصر الترتيب الـ `1,457`.

### المحتوى غير المرتبط مباشرة بمسار الدروس (`Unmapped / Auxiliary Content`)
1. **`8` وحدات تأسيسية قديمة فارغة في جدول `units`:**
   - ناتجة عن ملف الهجرة الأولي `migrations/0002_seed_content.sql` (`u_a0_1`, `u_a0_2`, `u_a1_1`, `u_a1_2`, `u_a2_1`, `u_b1_1`, `u_tr_1`, `u_cc_1`) وتحتوي على `0` دروس لأن الدروس الـ `258` مرتبطة بالوحدات الـ `66` النشطة في `curriculum-map.v1.json`. تُخفى هذه الوحدات الـ8 تلقائيًا في الواجهة (`units_count: 66` وحدة نشطة) ولم تُحذف التزامًا بقاعدة عدم الحذف.
2. **حوالي `7,100` مفردة إثرائية في المعجم (`vocabulary_entries`):**
   - الدروس الـ `258` تدرّس في قوائم `newVocabulary` و`reviewVocabulary` المباشرة حوالي `1,480` كلمة أساسية، بينما بقية الـ `8,577` مفردة (`~7,100` كلمة وتعبير في حزم `vocab-*.json` من `A1` إلى `C1`) متاحة بالكامل للمتعلم عبر **مكتبة المفردات (`/vocabulary` — مستكشف المعجم 8577)** وعبر **حزم المراجعة المتباعدة (`/review/packs` — 61 حزمة موضوعية)**.

---

## 4. نتائج تدقيق الصوت الإسباني (`AUDIO_AUDIT.md`)

تم إنشاء التقرير التفصيلي المستقل في [`AUDIO_AUDIT.md`](file:///home/antigravity/drmostafatito-alt/espanol/AUDIO_AUDIT.md) بعد فحص ثنائي (Binary RIFF/WAVE + RMS Amplitude) لجميع الملفات الصوتية ومفاتيح `assetManifest.json`:

1. **هل ملفات الصوت الـ150 موجودة فعلًا؟**  
   ✅ **نعم (`150/150`)** في `public/audio/es-ES/*.wav` بحجم إجمالي `13.12 MB` ومدّة إجمالية `311.9 ثانية`.
2. **هل كل الملفات سليمة ويمكن فكها وتشغيلها؟**  
   ✅ **نعم (`150/150`)** بترويسة `RIFF/WAVE` قياسية (`PCM 16-bit Mono, 22,050 Hz`)، و`0` ملفات تالفة أو صامتة (`minPeak = 18,303`, `minRms = 1,924.8`).
3. **هل المفاتيح الـ245 مرتبطة بملفات موجودة؟**  
   ✅ **نعم (`245/245`)** مفتاحًا في `src/web/audio/assetManifest.json` تشير إلى ملفات WAV موجودة فعليًا (`150` مفتاحًا أساسيًا + `95` مفتاحًا مرادفًا لتوحيد مفاتيح الدروس والمفردات).
4. **ما عدد المفاتيح التي لا تملك ملفًا صوتيًا؟**  
   - داخل `assetManifest.json`: **`0` مفاتيح مفقودة**.
   - على مستوى جميع دروس المنهج العليا (`A1`–`C1`، إجمالي `1,067` مرجعًا صوتيًا): `98` مرجعًا في الدروس التأسيسية مغطاة بملفات WAV محلية مسجلة بـ Piper TTS، و`969` مرجعًا في المستويات الأعلى تستخدم البديل التلقائي `Web Speech API (es-ES)` من المتصفح.
5. **ما عدد الملفات غير المستخدمة؟**  
   ✅ **`0` ملفات يتيمة على القرص** (كل ملف من الـ150 مرتبط بمفتاح في `assetManifest.json`؛ منها `98` تُستدعى بمفتاح مباشر في تمارين وحوارات الدروس الأولى، و`52` ملفًا تغطي الحروف الأبجدية والمقاطع الصوتية ومفردات الأساس عبر مطابقة النص أو المفتاح).
6. **هل يتم تشغيل الصوت المحلي فعلًا أم يتم الاعتماد على Web Speech API؟**  
   ✅ **`AudioService` (`src/web/audio/audioService.ts`) يطبق استراتيجية هجينة ذكية بـ 4 مراحل:**  
   (1) فحص `manifest[key]` لتشغيل ملف WAV المحلي عبر `HTMLAudioElement`،  
   (2) وإن لم يوجد المفتاح يطابق النص الإسباني بعد تطبيعه (`normalizeEs`) مع نصوص الـ150 ملفًا المحلي لتشغيل الـ WAV المحلي حتى لو اختلف اسم المفتاح،  
   (3) وإن لم يتوفر ملف WAV محلي ينتقل تلقائيًا إلى `window.speechSynthesis` بصوت `es-ES`،  
   (4) وإن تعذر كلاهما يعرض النص المكتوب مع تنبيه لطيف لا يعطل التمرين.
7. **هل النطق الإسباني صحيح في الكلمات والجمل؟**  
   ✅ **نعم** — جميع ملفات WAV الـ150 مولّدة بنموذج **`Piper TTS (es_ES-davefx-medium.onnx)`** بنطق إسباني قشتالي قياسي واضح، كما أُضيف الفلتر `extractSpanishForAudio()` لمنع قراءة أي كلمات عربية مصاحبة في أمثلة القواعد المختلطة.
8. **هل زر الصوت البطيء يعمل بسرعة `0.75x` دون تغيير طبقة الصوت بطريقة مزعجة؟**  
   ✅ **نعم** — تم ضبط `element.preservesPitch = true` (مع `mozPreservesPitch` و`webkitPreservesPitch`) في `src/web/audio/instance.ts` وإعادة التشغيل الفوري عند التبديل إلى `0.75x`، وتم التحقق منه آليًا في المتصفح (`{"status":200,"contentType":"audio/wav","preservesPitch":true,"playbackRate":0.75}`).
9. **هل الصوت يعمل على الهاتف والمتصفح؟**  
   ✅ **نعم** — يعمل عبر `HTMLAudioElement` و`speechSynthesis` المتوافقين مع متصفحات سطح المكتب والهاتف (Android Chrome / iOS Safari) عند نقر المستخدم على أزرار الصوت.

---

## 5. نتائج مراجعة رحلة المتعلم وتجربة التعلم (`Pre-A1` → `C1`)

تم اختبار حساب متعلم جديد يبدأ من الصفر، والتحقق من التسلسل البيداغوجي للمهارات العشر المطلوبة:

1. **البدء بالكلمات والتعبيرات اليومية الأكثر استخدامًا (وليس الحروف المجردة):**
   - أول درس يقابله المتعلم في لوحة اليوم (`درسك التالي`) وفي خريطة المسار (`ابدأ هنا ⚡`) هو **`prea1-hola-me-llamo` (أول كلمات: التحية والاسم)** يليه **`prea1-soy-tengo` (جملتان: أكون وعندي)** ثم **`prea1-repaso-habla` (تدريب متكامل قصير)**.
2. **الأبجدية والصوتيات اختيارية فعلًا ولا تعطل التقدم:**
   - دروس الصوتيات الـ6 (`prea1-abecedario`, `prea1-vocales`, `prea1-h-muda`, `prea1-silabas`, `prea1-acento-escrito`, `prea1-entonacion`) مفصولة في ملحق اختياري في نهاية `Pre-A1`، ومفتوحة جميعها منذ اليوم الأول (`200 OK`) دون أن تشترط إتمام ما قبلها، ولا تشترطها دروس `A1` للفتح.
3. **التدرج من كلمة ← تعبير ← جملة ← محادثة:**
   - **الكلمات الأساسية والتعارف:** الوحدات `prea1-u3-first-words` و`a1-u1-greetings` (`hola`, `buenos días`, `me llamo`, `mucho gusto`, `soy de...`).
   - **الأرقام والأيام والوقت:** دروس `a1-numeros-0-20`, `a1-numeros-21-100`, `a1-la-hora`, `a1-dias-meses`.
   - **الطعام والشراء والمقهى:** دروس `prea1-en-el-cafe`, `a1-comida-basica`, `a1-restaurante`, `a1-comprar`, `a1-precios`.
   - **السؤال والإجابة والأفعال اليومية وتكوين الجمل:** دروس `prea1-preguntas`, `a1-preguntas-basicas`, `a1-ar-presente`, `a1-rutina-diaria` مع تمارين `word_order` و`sentence_building`.
   - **المحادثات الواقعية والكول سنتر:** `146` سيناريو حواري (`572` سطرًا) موزعة على الحياة اليومية، السفر، المقاهي، التسوق، الصحة، والكول سنتر مع وضع **تمثيل الدور (Role-play)** وتحدي **اختر الرد الأنسب (+10 XP)**.
   - **الاستماع وفهم الكلام:** استوديو `/listening` يضم الإملاء الصوتي بـ3 سرعات (`0.75x`, `1x`, `1.25x`) مع شريط أحرف إسبانية (`á é í ó ú ü ñ ¿ ¡`) ومختبر نطق تفاعلي.
   - **المراجعة المتباعدة (`SM-2`):** تُولَّد بطاقات المراجعة تلقائيًا فور إتمام الدرس (`أُضيفت 6 بطاقة مراجعة من مفردات الدرس إلى مجموعتك`) وتُجدول خادميًا بتقييمات `نسيت / صعبة / جيدة / سهلة`.

---

## 6. نتائج التدقيق البصري الحقيقي (`Playwright Chromium`)

تم فتح الموقع فعليًا في متصفح Chromium حقيقي وقياس خصائص DOM والتخطيط والاتجاه على سطح المكتب (`1366×900`) والهاتف (`390×844`):

| الشاشة | ملف اللقطة | اتجاه الصفحة (`dir`) | التمرير الأفقي (`overflowX`) | نصوص إسبانية بغير `LTR` | أصغر خط (`minFontPx`) | النتيجة |
|---|---|---|---|---|---|---|
| 1. لوحة التحكم (Dashboard) | `01-dashboard.png` | `rtl` | `0px` | `0` | `12px` | ✅ سليم |
| 2. مسار التعلم (Learning Path) | `02-learning-path.png` | `rtl` | `0px` | `0` | `11.5px` (شارات فرعية) | ✅ سليم |
| 3. شاشة الدرس (Lesson) | `03-lesson.png` | `rtl` | `0px` | `0` (`3` عناصر `LTR`) | `12.2px` | ✅ سليم |
| 4. نتيجة الدرس (Lesson Result) | `04-lesson-result.png` | `rtl` | `0px` | `0` (`5` عناصر `LTR`) | `12.5px` | ✅ سليم |
| 5. المراجعة (Review) | `05-review.png` | `rtl` | `0px` | `0` (`1` عنصر `LTR`) | `12.5px` | ✅ سليم |
| 6. المفردات (Vocabulary) | `06-vocabulary.png` | `rtl` | `0px` | `0` (`12` عنصر `LTR`) | `12px` | ✅ سليم |
| 7. القواعد (Grammar) | `07-grammar.png` | `rtl` | `0px` | `0` (`580` عنصر `LTR`) | `12px` | ✅ سليم |
| 8. المحادثات (Conversations) | `08-conversations.png` | `rtl` | `0px` | `0` (`1623` عنصر `LTR`) | `12px` | ✅ سليم |
| 9. الاستماع (Listening) | `09-listening.png` | `rtl` | `0px` | `0` (`33` عنصر `LTR`) | `12px` | ✅ سليم |
| 10. الهاتف (`390px` Mobile) | `10-mobile-dashboard.png` | `rtl` | `0px` | `0` | `11.5px` | ✅ سليم |

---

## 7. قائمة الصور الملتقطة (`audit-screenshots/`)

تم حفظ جميع الصور العشر المطلوبة داخل مجلد المستودع `/home/antigravity/drmostafatito-alt/espanol/audit-screenshots/`:

1. [`audit-screenshots/01-dashboard.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/01-dashboard.png) — لوحة المتعلم اليومية، الهدف اليومي، تحديات اليوم، وملحق الحروف الاختياري.
2. [`audit-screenshots/02-learning-path.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/02-learning-path.png) — خريطة مسار التعلم التفاعلية مع شارة `ابدأ هنا ⚡` وملخص الوحدة.
3. [`audit-screenshots/03-lesson.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/03-lesson.png) — شاشة الدرس مع قلوب التركيز `❤️ 5` وأزرار الصوت العادي والبطيء `0.75x`.
4. [`audit-screenshots/04-lesson-result.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/04-lesson-result.png) — شاشة نتيجة الدرس بعد الإتمام بنجاح (`100%`، `+30 XP`، وبطاقات المراجعة المضافة).
5. [`audit-screenshots/05-review.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/05-review.png) — شاشة المراجعة المتباعدة (`SM-2`) مع النطق الصوتي والرموز الصوتية `IPA`.
6. [`audit-screenshots/06-vocabulary.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/06-vocabulary.png) — مكتبة المفردات والإتقان (`8,577` مفردة في المعجم + نطق تقريبـي و`IPA`).
7. [`audit-screenshots/07-grammar.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/07-grammar.png) — مرجع القواعد الإسبانية مع عزل ثنائي الاتجاه `BidiText` للنصوص المختلطة.
8. [`audit-screenshots/08-conversations.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/08-conversations.png) — استوديو المحادثات مع تمرين الرد التفاعلي ووضع تمثيل الدور.
9. [`audit-screenshots/09-listening.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/09-listening.png) — استوديو الاستماع والإملاء والنطق مع أزرار السرعة (`0.75x / 1x / 1.25x`) وشريط الأحرف الإسبانية.
10. [`audit-screenshots/10-mobile-dashboard.png`](file:///home/antigravity/drmostafatito-alt/espanol/audit-screenshots/10-mobile-dashboard.png) — عرض الهاتف المحمول (`390×844`) مع شريط التنقل السفلي وعدم وجود أي تمرير أفقي (`overflowX = 0`).

---

## 8. العيوب المكتشفة أثناء التدقيق الشامل

أثناء الفحص الفعلي للمسارات واللقطات البصرية، تم رصد **5 عيوب حقيقية** (لم تكن ظاهرة في الاختبارات النظرية):

1. **قفل دروس ملحق الصوتيات الاختيارية الثانية للمستخدم الجديد (`403 LESSON_LOCKED`):**
   - في `Dashboard.tsx`، يوجد زر سريع `حرف H الصامت والأصوات` يوجه إلى `/learn/prea1-h-muda`. كان الخادم يرفض فتحه للمستخدم الجديد بـ `403 LESSON_LOCKED` لأنه يشترط تسلسليًا إتمام `prea1-vocales` أولًا، رغم أن قسم الأبجدية والصوتيات معلن كملحق اختياري حر.
2. **انعكاس ترتيب الكلمات العربية والإسبانية في التراكيب المختلطة (`Bidi Text Reversal`):**
   - في صفحات `Grammar.tsx` و`Conversations.tsx` و`LessonBrief.tsx`، كانت التراكيب التي تجمع الإسبانية بالعربية (مثل `hola تُقرأ «أولا» لأن h صامتة` أو `Hola. Me llamo + اسم. Soy de + بلد.`) تُعرض داخل `<span className="es" dir="ltr">`، مما أدى إلى قلب ترتيب الكلمات العربية (`صامتة h تُقرأ «أولا» لأن hola`) والتصاق حرف العطف `و` بالكلمات اللاتينية (`tenerو ser`).
3. **اتساع مفرط داخل أزرار العبارات المفتاحية في المحادثات (`.vocab-list .es { min-width: 120px }`):**
   - قاعدة قديمة في `src/web/styles.css` (سطر 846) كانت تفرض `min-width: 120px` على كل عنصر `.es` داخل `.vocab-list`، مما تسبب في فراغات واسعة داخل شرائح العبارات في `Conversations.tsx`.
4. **سلوك زر الصوت البطيء (`0.75x`) أثناء تشغيل الصوت وعدم تفعيل `preservesPitch` صراحةً:**
   - النقر على زر السرعة أو إعادة الاستماع أثناء تشغيل الملف الصوتي كان يوقف الصوت بدل إعادة تشغيله بالسرعة الجديدة، كما لم تكن خاصية `preservesPitch = true` مفعّلة صراحةً على عنصر `HTMLAudioElement`.
5. **ضعف تباين تلميح `(مسافة)` وظهور معرفات تقنية خام في شاشة النتيجة:**
   - في `Review.tsx` كان النص `(مسافة)` داخل الزر البرتقالي الرئيسي يستخدم `className="small muted"` بلون رمادي داكن منخفض التباين، وفي `Lesson.tsx` (`ResultScreen`) كانت تظهر معرفات `grammarTopics` اللاتينية الخام (`pronunciacion-h-muda`) بجانب العناوين العربية.

---

## 9. الإصلاحات التي تمت والتحقق منها

| # | الملف المعدّل | الإصلاح المنفّذ | التحقق الفعلي |
|---|---|---|---|
| 1 | [`src/worker/routes/learn.ts`](file:///home/antigravity/drmostafatito-alt/espanol/src/worker/routes/learn.ts) و[`src/worker/routes/content.ts`](file:///home/antigravity/drmostafatito-alt/espanol/src/worker/routes/content.ts) | تعريف مجموعة `OPTIONAL_PHONETIC_LESSONS` للدروس الستة في وحدتي الصوتيات الاختياريتين وفتحها بالكامل منذ اليوم الأول في `assertUnlocked` و`myProgress` و`loadVisibleHubLessons`، واستبعاد التراكيب المختلطة بالعربية من مقاطع الإملاء في `listeningHub`. | فتح جميع الدروس الستة في متصفح Chromium لمستخدم جديد وإرجاع `200 OK` لكل منها. |
| 2 | [`src/web/components/ui.tsx`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/components/ui.tsx) و[`Grammar.tsx`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/pages/Grammar.tsx) و[`Conversations.tsx`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/pages/Conversations.tsx) و[`LessonBrief.tsx`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/components/LessonBrief.tsx) | إنشاء المكوّن `<BidiText>` لعزل المقاطع اللاتينية والعربية ثنائيًا (`<bdi dir="ltr">` / `<bdi dir="rtl">`) وفصل حرف العطف «و» الملتصق، والدالة `extractSpanishForAudio()` لقراءة الجزء الإسباني فقط عند النقر على زر الصوت. | التحقق البصري في `07-grammar.png` و`08-conversations.png`. |
| 3 | [`src/web/theme.css`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/theme.css) | إضافة `.vocab-list .vocab-chip .es, bdi.es { min-width: 0; display: inline; }` لإلغاء العرض الأدنى الموروث (`120px`). | التحقق البصري في `08-conversations.png`. |
| 4 | [`src/web/audio/instance.ts`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/audio/instance.ts) و[`Lesson.tsx`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/pages/Lesson.tsx) و[`Conversations.tsx`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/pages/Conversations.tsx) | تفعيل `preservesPitch = true` (`mozPreservesPitch` و`webkitPreservesPitch`) وإيقاف الصوت الجاري قبل إعادة تشغيله بسرعة `0.75x`. | فحص آلي في Chromium (`preservesPitch: true, playbackRate: 0.75`) + نجاح جميع اختبارات الصوت. |
| 5 | [`src/web/pages/Review.tsx`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/pages/Review.tsx) و[`src/web/pages/Lesson.tsx`](file:///home/antigravity/drmostafatito-alt/espanol/src/web/pages/Lesson.tsx) | تحسين تباين `(مسافة)` على زر `أظهر الإجابة`، وإزالة شارات `grammarTopics` اللاتينية الخام من `ResultScreen`. | التحقق البصري في `04-lesson-result.png` و`05-review.png`. |

---

## 10. نتائج جميع الاختبارات المنفّذة فعليًا

تم تنفيذ جميع حزم الاختبارات والتحقق من نتائجها الفعلية:

| الاختبار | الأمر المنفّذ | النتيجة الفعلية | التفاصيل |
|---|---|---|---|
| **TypeScript Typecheck** | `npx tsc --noEmit` | ✅ **PASS (0 أخطاء)** | تطابق كامل للأنواع في الواجهة والخادم |
| **Production Build** | `npm run build` | ✅ **PASS (في 2.86 ثانية)** | بناء جميع حزم Vite للإنتاج بنجاح |
| **Unit & Integration Tests** | `npx vitest run` | ✅ **PASS (58 ملفًا / 700 اختبار ناجح / 0 فشل)** | يشمل اختبارات API، المصادقة، المسار، المراجعة، الصوت، التباين، وأمان الإجابات |
| **Curriculum Validation** | `node tools/check-curriculum.mjs` | ✅ **PASS (0 أخطاء)** | تطابق خريطة المنهج والدروس |
| **Content Quality Audit** | `node tools/audit-content-quality.mjs` | ✅ **PASS (0 أخطاء حرجة · 113 تنبيهًا غير مانع)** | التنبيهات الـ113 هي كلمات إثرائية إضافية في مسار السفر (`R14-target-vocab-fit`) |
| **Content Integrity Check** | `node tools/check-content-integrity.mjs` | ✅ **PASS (0 أخطاء)** | سلامة بنية الدروس والتمارين وحزم المفردات |
| **Audio Manifest Audit** | `node tools/check-audio-manifest.mjs` | ✅ **PASS (245 مفتاحًا / 150 ملف WAV / 0 مفقود)** | تطابق 100% بين المفاتيح والملفات الصوتية |
| **SQL Schema & DDL Check** | `node tools/check-sql.mjs` | ✅ **PASS (62 جدولًا / 52 فهرسًا / 0 أخطاء)** | سلامة جميع ملفات الهجرة `0001`–`0005` |
| **Playwright Visual & Mobile Viewport** | فحص Chromium (`1366×900` و`390×844`) | ✅ **PASS (10/10 شاشات · `overflowX = 0`)** | التوثيق الكامل في `audit-screenshots/01..10.png` |

---

## 11. طريقة فتح المعاينة (Preview) من جهاز المستخدم

بما أن خوادم التطوير تعمل داخل بيئة السحابة المعزولة (Remote Linux VM) وليس على جهازك المحلي مباشرةً، فإن كتابة `http://localhost:5173` في متصفح هاتفك أو حاسوبك الشخصي لن تصل إلى الخادم السحابي مباشرةً إلا عبر نفق المعاينة المدمج في المنصة. لذلك وفرنا لك **طريقتين جاهزتين وتعملان فورًا من جهازك**:

1. **المعاينة التفاعلية المدمجة مباشرة في المحادثة (`espanol_preview.html`):**
   - تظهر أمامك مباشرة داخل هذا الرد (ويمكنك فتحها في اللوحة الجانبية بالضغط على بطاقة **espanol_preview**)، وتتيح لك تجربة شاشات **الرئيسية، المسار، تمرين الدرس مع النطق الإسباني العادي `1.0x` والبطيء `0.75x`، بطاقة المراجعة المتباعدة `SM-2`، وتحدي المحادثة** مباشرة من متصفحك أو هاتفك دون الحاجة لأي خادم محلي.
2. **معاينة الخادم الحي الكامل عبر بطاقة `Español Dev Preview`:**
   - الخادمان (`Cloudflare Worker D1` على المنفذ `8787` و`Vite Dev Server` على المنفذ `5173`) يعملان الآن في الخلفية (`Daemon`). يمكنك الضغط على بطاقة الرابط **`Español Dev Preview`** في الشريط الجانبي للمحادثة ليقوم نفق المعاينة المدمج في المنصة بفتح التطبيق الكامل لك.
