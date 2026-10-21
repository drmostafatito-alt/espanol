# قائمة انتظار المراجعة البشرية للمحتوى

> آخر تحديث: 2026-10-21 (بعد تدقيق جودة آلي كامل) · **لا يوجد درس واحد منشور. لا يوجد سجل مراجعة بشرية واحد.**
> كل ما تحت هذا الملف بحالة `draft` / `review_state = unreviewed`.

## 0) لماذا هذا الملف

المحتوى أُنتج إعدادًا داخليًا (كاتب بشري + مساعدة نموذج) بلا مراجعة خبيرة. القاعدة الحاكمة في المشروع:
**لا نشر بلا مراجعة إسبانية أصلية ومراجعة عربية، ولا يُكتب سجل مراجعة قبل حدوثها فعليًا.**

## 0.5) نتيجة التدقيق الآلي الكامل — 2026-10-21

تدقيق آلي بمساعدة نموذج على **كل** مسودات المحتوى (لا عيّنة). التفاصيل الكاملة في `reports/audit/`
(ملخص: `reports/audit/SUMMARY.md`، ولكل درس/حزمة تقرير مستقل).

| البند | القيمة |
| --- | --- |
| دروس مدقَّقة | **16** · تمارين **94** · خيارات **163** · سيناريوهات **16** |
| حزم مفردات | **8** · مداخل **134** · حقول IPA **134** |
| أخطاء ميكانيكية مؤكَّدة **أُصلحت** | **37** موضعًا في 18 ملفًا |
| عيوب برمجية مؤكَّدة **أُصلحت** (تصحيح/واجهة) | **4** |
| تنبيهات مفتوحة (ترجمة/ملاءمة) | **29** |
| ملاحظات تحتاج مراجعًا | **59** |
| أسئلة موجَّهة للمراجعين | **29** |

**ما أُصلح (ملخص أصناف):** تمرين ترتيب غير قابل للحل · نص مفسد «Italianا» · 6 مفاتيح صوت لنصوص مختلفة ·
9 حقول `answerKey.mode` في غير موضعها · 14 خيارًا بلا `isCorrect` · تسريب ترتيب بترقيم العناصر ·
تمرين `dialogue_order` كان يُصحَّح كاختيار ولا يُرسم في الواجهة · 7 تعليمات لا تطابق مفتاحها ·
كلمات عربية دخيلة · IPA غير صالح في `egipcio` · `pos` خاطئ لأربعة مداخل · 3 شروح متناقضة/دائرية ·
ترجمة مصرية معكوسة · خطأان إملائيان إسبانيان · وصفا نطق لـj/g غير دقيقين.

**ما بقي مفتوحًا ولم يُصلح (بقرار معلن):**
- **ترجمة ناقصة:** 8 خيارات بلا `textAr` و8 تمارين بلا `stemAr` — لا تُترجم آليًا في هذا المشروع.
- **`targetVocab` غير المدرج:** 7 إشارات إلى مفردات من الحزمة لا من قوائم الدرس.
- **معيار تقييم `cc_u1_5_speak`** منسوخ من تمرين المحاكاة ولا يصف تمرين نطق — **يحتاج تأليفًا بشريًا**
  (المقترح في `reports/audit/lessons/cc-u1-opening.md`).
- **جودة IPA (134 مدخلًا)** فُحصت شكليًا فقط: الصيغة والمحارف والنبر، لا الدقة الصواتية.
- **تسامح التصحيح** (`tr_u1_5_translate` يقبل «está retrasado dos horas») — قرار لغوي لا ميكانيكي.

> ⚠️ **حدود صريحة:** هذا التدقيق الآلي **لا يغني** عن المراجعة البشرية أدناه، ولا يرفع حالة أي درس.
> كل ما يفعله أنه أزال الأخطاء القابلة للإثبات آليًا وجعل الباقي مرئيًا وقابلًا للتتبع.

## 1) ما يحتاج مراجعة الآن (16 درسًا · 94 تمرينًا)

| المسار | الوحدة | الدرس | المستوى | تمارين (مُصحَّحة/الكل) | أُصلح آليًا | تقرير |
| --- | --- | --- | --- | --- | --- | --- |
| main-track | a1-u1-origen | a1-origen-de-donde-eres | A1 | 10/11 | 4 | [`lessons/a1-origen-de-donde-eres.md`](../reports/audit/lessons/a1-origen-de-donde-eres.md) |
| main-track | a1-u1-origen | a1-saludos-formalidad | A1 | 10/11 | 4 | [`lessons/a1-saludos-formalidad.md`](../reports/audit/lessons/a1-saludos-formalidad.md) |
| main-track | a1-u1-origen | a1-presentar-a-otro | A1 | 8/9 | 2 | [`lessons/a1-presentar-a-otro.md`](../reports/audit/lessons/a1-presentar-a-otro.md) |
| main-track | a1-u1-origen | a1-nacionalidades | A1 | 9/10 | 4 | [`lessons/a1-nacionalidades.md`](../reports/audit/lessons/a1-nacionalidades.md) |
| travel | tr-u1-airport | tr-u1-checkin | A2 | 5/6 | 2 | [`lessons/tr-u1-checkin.md`](../reports/audit/lessons/tr-u1-checkin.md) |
| travel | tr-u1-airport | tr-u1-boarding-delay | A2 | 4/4 | 1 | [`lessons/tr-u1-boarding-delay.md`](../reports/audit/lessons/tr-u1-boarding-delay.md) |
| travel | tr-u1-airport | tr-u1-problem-luggage | A2 | 4/4 | 1 | [`lessons/tr-u1-problem-luggage.md`](../reports/audit/lessons/tr-u1-problem-luggage.md) |
| travel | tr-u1-airport | tr-u1-arrival-customs | A2 | 4/5 | 1 | [`lessons/tr-u1-arrival-customs.md`](../reports/audit/lessons/tr-u1-arrival-customs.md) |
| travel | tr-u2-hotel | tr-u2-booking | A2 | 4/4 | 0 | [`lessons/tr-u2-booking.md`](../reports/audit/lessons/tr-u2-booking.md) |
| travel | tr-u2-hotel | tr-u2-checkin | A2 | 4/4 | 2 | [`lessons/tr-u2-checkin.md`](../reports/audit/lessons/tr-u2-checkin.md) |
| travel | tr-u2-hotel | tr-u2-room-problem | A2 | 4/4 | 2 | [`lessons/tr-u2-room-problem.md`](../reports/audit/lessons/tr-u2-room-problem.md) |
| travel | tr-u2-hotel | tr-u2-checkout | A2 | 4/4 | 1 | [`lessons/tr-u2-checkout.md`](../reports/audit/lessons/tr-u2-checkout.md) |
| callcenter | cc-u1-opening-verification | cc-u1-opening | B1 | 4/5 | 2 | [`lessons/cc-u1-opening.md`](../reports/audit/lessons/cc-u1-opening.md) |
| callcenter | cc-u1-opening-verification | cc-u1-verification | B1 | 4/4 | 0 | [`lessons/cc-u1-verification.md`](../reports/audit/lessons/cc-u1-verification.md) |
| callcenter | cc-u1-opening-verification | cc-u1-hold-transfer | B1 | 3/4 | 0 | [`lessons/cc-u1-hold-transfer.md`](../reports/audit/lessons/cc-u1-hold-transfer.md) |
| callcenter | cc-u1-opening-verification | cc-u1-roleplay | B1 | 4/5 | 3 | [`lessons/cc-u1-roleplay.md`](../reports/audit/lessons/cc-u1-roleplay.md) |

المصدر: `content/drafts/**/lesson-*.json` (حقل `review.notes` في كل ملف يذكر ملاحظات المراجعة الخاصة به).

## 2) قائمة تفتيش لكل درس

### مراجع إسباني (es-ES)
- [ ] كل جملة طبيعية كما يقولها متحدث أصلي، لا ترجمة حرفية من العربية.
- [ ] النبر المكتوب صحيح (tilde) في كل كلمة تحتاجه.
- [ ] علامتا `¿…?` و`¡…!` في مكانهما.
- [ ] سجل اللغة متسق: `usted` في المواقف الرسمية، `tú` في غيرها، ولا خلط داخل الحوار نفسه.
- [ ] المشتتات (الخيارات الخاطئة) معقولة لغويًا، لا سخيفة.
- [ ] الأرقام والأسعار والتواريخ بصيغة إسبانية (فاصلة عشرية، 24 ساعة عند اللزوم).

### مراجع عربي
- [ ] الفصحى هي الأساس، والعامية المصرية إضافة اختيارية لا بديل.
- [ ] الشرح النحوي يخاطب مشكلة المتعلم العربي تحديدًا (حذف الفعل الناسخ، جنس الصفة، حروف الجر).
- [ ] المصطلحات موحّدة بين الدروس («حرف جر»، «مصدر»، «مذكر/مؤنث»).
- [ ] لا ترجمة آلية غير محرَّرة، ولا ادعاءات تقارب نطقي بلا تحفّظ.

### مراجع تعليمي (A1/A2/B1)
- [ ] الصعوبة مناسبة للمستوى المعلن (لا تمرين B2 في درس A1).
- [ ] كل تمرين له هدف تعليمي مرتبط بهدف الدرس.
- [ ] لا تكرار غير مبرَّر بين الدروس (المفردات المشتركة تُحال إلى حزمتها لا تُشرح ثانية).
- [ ] الشرح العربي يفسّر *لماذا* الخطأ خطأ، لا يقول «خطأ» فقط.

### حالة الصوت
- [ ] كل `audioKey` بحالة `pending/…` — ولا ملف صوتي مرفوع قبل اعتماد المصدر والترخيص.
- [ ] التمارين السمعية تعمل بنص بديل ظاهر عند غياب الصوت، ولا تُحتسب خطأً.

## 3) ملفات المفردات المنتظرة للمراجعة (8 حزم · 134 مدخلًا)

| الحزمة | المسار | المدخلات | أُصلح آليًا | تقرير |
| --- | --- | --- | --- | --- |
| a1-u1-origen | a1 | 7 | 1 | [`vocab/a1-u1-origen.md`](../reports/audit/vocab/a1-u1-origen.md) |
| a1-u2-saludos | a1 | 16 | 1 | [`vocab/a1-u2-saludos.md`](../reports/audit/vocab/a1-u2-saludos.md) |
| a1-u3-nacionalidades | a1 | 13 | 0 | [`vocab/a1-u3-nacionalidades.md`](../reports/audit/vocab/a1-u3-nacionalidades.md) |
| cv-band1-basics | core-vocab | 20 | 3 | [`vocab/cv-band1-basics.md`](../reports/audit/vocab/cv-band1-basics.md) |
| cv-band2-daily | core-vocab | 20 | 0 | [`vocab/cv-band2-daily.md`](../reports/audit/vocab/cv-band2-daily.md) |
| cv-band3-verbs | core-vocab | 20 | 0 | [`vocab/cv-band3-verbs.md`](../reports/audit/vocab/cv-band3-verbs.md) |
| tr-shared | travel | 20 | 1 | [`vocab/tr-shared.md`](../reports/audit/vocab/tr-shared.md) |
| cc-shared | callcenter | 18 | 2 | [`vocab/cc-shared.md`](../reports/audit/vocab/cc-shared.md) |

بنود إضافية لكل مدخل: معنى فصيح + معنى مصري + مثال إسباني + ترجمة + ترجمة عامية + ملاحظة استخدام + خطأ شائع + نطق تقريبي + IPA + تصريفات (للأفعال).

> **تحذير مسمّى:** هذه الحزم مرتبة **تدريسيًا (internalRank)** وليست مبنية على قائمة تكرار مرخَّصة. لا تُوصف بـ«الأكثر شيوعًا» أو «أهم 1000 كلمة» قبل اعتماد مصدر مرخَّص موثَّق. المدقق يرفض هذه العبارات آليًا إن ظهرت في حقل تعليمي.

## 4) كيف يجري الاعتماد بعد المراجعة (لم يُنفَّذ بعد)

1. المراجع يضع اسمه في `review.spanishReviewer` / `review.translationReviewer` و`review.reviewedAt`.
2. `node tools/validate-content.mjs --dir <المجلد>` يجب أن يبقى PASS.
3. بعد أي تعديل لغوي: `node tools/audit-content-quality.mjs` يجب أن يبقى بلا أخطاء،
   و`npx vitest run tests/content-quality.test.ts` يجب أن يبقى أخضر.
4. تحويل حالة الإصدار إلى مراجَع يحتاج مسارًا إداريًا غير موجود بعد (لا يوجد admin UI) — **لا تُعدّل الحالة يدويًا في SQL، ولا تُفبرك سجلات**.
5. النشر يعني تحديث `lessons.status = 'published'` — وهو ما يمنعه اختبار `content-gates` حاليًا بشكل مقصود حتى يوجد مسار مراجعة رسمي.