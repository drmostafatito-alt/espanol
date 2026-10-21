# نموذج المحتوى الموحّد

## 1. فصل الكيانات (إلزامي)

| الكيان | ما هو | ما ليس هو | الجدول |
| --- | --- | --- | --- |
| المدخل المعجمي | كلمة/تعبير فريد بكتابته | ❌ ليس التصريف ولا المثال | `vocabulary_entries` |
| التصريف | صيغة مشتقة من الفعل/الاسم | لا تُحسب مدخلًا جديدًا | `vocabulary_forms` |
| المعنى | دلالة واحدة داخل المدخل | لا يُدمج معنيان مختلفان في صف واحد | `vocabulary_senses` |
| العبارة الاصطلاحية | معنى لا يُستنتج من الأجزاء | تُحسب مدخلًا واحدًا (idiom) | `vocabulary_entries(entry_kind='idiom')` |
| التعبير متعدد الكلمات | تركيب متكرر طبيعي (collocation) | لا يُضخّم العدّ كأنه كلمة جديدة مستقلة عن أجزائه؛ يُسجَّل مرة واحدة ويُربط بأجزائه في `related` | `entry_kind='collocation'` |
| المثال السياقي | جملة طبيعية تستخدم المدخل | لا تُحسب كلمة | `sentences` + `sentence_translations` |
| النطق | IPA + تلميح عربي + ملف صوتي | التلميح العربي تقريبي لا بديل | `ipa`, `pronunciation_hint_ar`, `audio_assets` |
| البدائل الإقليمية | es-ES / es-419 | لا تُدمج في نص واحد مربك | `variant_note_ar` + `audio_assets.variant` |
| الملاحظة النحوية | شرح يستحق التوقف | ليست قاعدة كاملة | `vocabulary_senses.usage_note_ar` / `grammar_topics` |

## 2. الملفات والمخططات

| الملف | الغرض | المخطط |
| --- | --- | --- |
| `content/exemplars/lesson-*.json` | درس كامل (سيناريو + تمارين) | [`lesson.schema.json`](../content/schema/lesson.schema.json) |
| `content/exemplars/vocab-*.json` | حزمة مفردات | [`vocabulary.schema.json`](../content/schema/vocabulary.schema.json) |
| `content/exemplars/paths.json` | البرامج/الوحدات وربط الدروس | تحقق متقاطع داخل `validate-content.mjs` |
| `content/schema/common.schema.json` | أنواع مشتركة | — |
| `content/schema/exercise.schema.json` | تمرين واحد بكل أنواعه الـ28 | — |

> المخططات **مصدر الحقيقة للشكل**، و`tools/validate-content.mjs` يطبّق مجموعة فرعية من JSON Schema 2020-12 (type/enum/required/properties/additionalProperties/items/min*/pattern/$ref). ما لا تدعمه المكتبة يُفحص بقواعد صريحة في الكود، لا يُترك بلا فحص.

## 3. مفتاح الإجابات لكل نوع تمرين (عقد صارم)

| النوع | شكل `answerKey` | قاعدة التحقق |
| --- | --- | --- |
| `image_choice` | `{correctOptionIds[]}` | كل خيار له `imageKey`؛ مشتت له تبرير |
| `word_choice` / `distinguish_similar` / `preposition_choice` / `infer_meaning` / `recall_previous_word` / `review_common_errors` | `{correctOptionIds[]}` | خيار صحيح واحد على الأقل، `isCorrect` متوافق |
| `listen_choose` / `identify_speaker` / `find_fix_error` / `choose_reply` | `{correctOptionIds[]}` | + `audioKey` مطلوب عمليًا |
| `fill_blank` / `type_missing_word` / `conjugate_in_context` / `dictation` | `{accepted[], caseSensitive?, allowMissingAccent?, verb?, expectedPerson?}` | ≥1 إجابة مقبولة، تُطبَّع (مسافات/حالة أحرف) |
| `translate_short` / `write_sentence` / `reconstruct_audio_sentence` / `summarize_dialogue` | `{accepted[], punctuationInsensitive?}` | تُقبل صيغ متعددة معتمدة |
| `word_order` / `dialogue_order` | `{accepted[]}` | **لا مقارنة نصية واحدة**: كل الترتيبات الصحيحة تُدرج صراحةً |
| `match_pairs` | `{pairs:[{left,right}]}` | تحقق ثنائي الاتجاه |
| `speak_with_text` / `speak_free` / `roleplay_simulation` / `phone_call_response` / `resolve_customer_issue` / `write_email` | `{modelAnswer|modelScript, acceptableVariants[], forbidden[]}` + `scoring.mode='rubric'` | أوزان المعيار = 100؛ لا تقييم صوتي آلي مُدَّعى |

**قاعدة ذهبية:** إذا كان للسؤال أكثر من إجابة صحيحة ممكنة، **يجب** إدراجها. عدم إدراجها خطأ يمنعه المدقق.

## 4. الهوية والإصدارات

```
programs → units → lessons (مؤشر) → lesson_versions (لقطة كاملة) → exercises → options/items
```
- `lesson_versions.content_json` يحمل الدرس كاملًا كما في مخطط JSON → إعادة إنتاج التصحيح لأي محاولة قديمة ممكنة.
- المحاولة تُسجَّل مع `lesson_version_id` المستخدَم. تغيير الدرس ينشئ إصدارًا جديدًا فقط.
- حل إجابات قديم لا يُطبَّق على إصدار جديد: عند اختلاف الإصدار يعيد الخادم `409 CONTENT_CHANGED` مع تفاصيل، والعميل يعيد تحميل الدرس دون حذف سجل المحاولات.
- معرفات ثابتة (ULID) تُولَّد عند الإنشاء ولا تتغير عند إعادة الترتيب أو تغيير النص.

## 5. الاستيراد والتصدير

| الاتجاه | الصيغة | الحماية |
| --- | --- | --- |
| استيراد | JSON (مخططات أعلاه) أو CSV للمفردات بحقول مُعرَّفة | يرفض: حقول غير معروفة، مستخدمين، أدوارًا، إعدادات أمنية، أي مفتاح `role`/`permissions` |
| تصدير | JSON قابل لإعادة الاستيراد + CSV مسطح للمفردات للمراجعة | بلا أسرار، بلا جلسات، بلا بيانات مستخدمين |
| معاينة | تشغيل `validate-content.mjs` على الملف قبل الكتابة | لا كتابة جزئية: دفعة كاملة أو لا شيء |

## 6. بوابات النشر (State machine)

```
draft ──submit──► in_review ──approve──► approved ──publish──► published ──archive──► archived
   ▲                   │                     │
   └────needs_changes──┘                     └── (تعديل جوهري) → نسخة جديدة draft
```
يمنع النشر آليًا عند واحد من: خطأ في المخطط · إجابة ناقصة · بلا تفسير · بلا تبرير مشتت · صوت معلَّق · مفردة غير مُدخلة · نوع تمرين مكرر بلا تنوّع (≥3 أنواع) · غياب مراجعة إسبانية/عربية مسجّلة في `content_review_records`.
