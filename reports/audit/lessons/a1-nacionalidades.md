# تقرير تدقيق — الجنسيات: كيف تُطابق الصفة جنس صاحبها

- **الملف:** `content/drafts/a1/lesson-a1-nacionalidades.json`
- **المعرّف:** `a1-nacionalidades` · **المستوى:** A1 · **الوحدة:** `a1-u1-origen`
- **التمارين:** 10 (fill_blank×1, find_fix_error×1, listen_choose×1, review_common_errors×1, speak_with_text×1, translate_short×1, word_choice×3, word_order×1)
- **السيناريوهات:** 1 · **أسطر الحوار:** 4
- **الحالة:** draft · spanishReviewer: null · translationReviewer: null · reviewedAt: null

> تدقيق آلي بمساعدة نموذج. **لا يُغني عن مراجعة بشرية** للإسبانية والترجمة العربية.

## 1) أخطاء مؤكَّدة أُصلحت (قابلة للتحقق ميكانيكيًا)

| # | الموضع | المشكلة | الإصلاح |
|---|--------|---------|---------|
| 1 | a1_nac_6_order غير قابل للحل | قائمة الإجابات المقبولة تفترض وجود الفعل «es» مرتين، لكن العناصر فيه رمز «es» واحد فقط ⇒ لا يمكن تكوين أي إجابة مقبولة. | أُضيف رمز ثانٍ `{"id": "a1_nac_t9", "text": "es"}` فصار التمرين قابلًا للحل بالإجابتين. |
| 2 | a1_nac_9_listen — نص مفسد | errorFeedback يحتوي «Italianا» (كلمة لاتينية + ألف عربية) فتظهر مكسورة للمتعلم. | صُحّح إلى «Italiana». |
| 3 | a1_nac_10_speak — مفتاح صوت خاطئ | referenceAudioKey «pending/a1-nac-anna-1» هو نفسه مفتاح جملة آنا في السيناريو، والنص المطلوب مختلف («Soy egipcia, de El Cairo…»). | مفتاح مستقل: `pending/a1-nac-10-model-1`. |
| 4 | answerKey.mode مكرر/متناقض | الحقل في غير موضعه؛ و`scoring.mode` موجود أصلًا (وفي هذا التمرين كان يخالفه). | أُزيل `answerKey.mode`. |

## 2) ملاحظات مرجَّحة (تحتاج قرارًا بشريًا — لم أُعدّل النص)

- `a1_nac_7_c` بلا textAr: المتعلم المبتدئ لا يجد ترجمة أحد الخيارات الثلاثة.
- `a1_nac_4_fix` بلا stemAr بينما بقية الدرس مترجم: الجملة «Marta es español.» تُعرض بلا معنى عربي.
- `a1_nac_10_speak`: stemEs «Soy egipcia, de El Cairo. Soy egipcia y hablo español.» مقابل modelAnswer «Soy egipcia, de El Cairo. Hablo español.» — نصّان مختلفان في تمرين واحد.
- شخصية المسار رجل («Omar») لكن تمرين النطق يطلب جملة مؤنثة «Soy egipcia» — قد يربك المتعلم الذكر.

**رصد آلي إضافي (تنبيهات، ليست أخطاء):**

- `R29-stem-translation` — stemAr ناقص بينما تمارين أخرى في الدرس مترجمة
- `R17-option-translation` — خيارات بلا textAr: a1_nac_7_c

## 3) تعديلات مقترحة (لم تُطبَّق)

- إضافة stemAr للتمرين المذكور ليساوي بقية الدرس.
- ترجمة عربية للخيارات المذكورة (بيد مترجم، لا آليًا).

## 4) أسئلة لمراجع إسباني/عربي مختص

- هل «alemán/alemana» و«marroquí» هما المثالان الأنسب لمستوى A1 في إسبانيا اليوم؟
- هل يصح تعليم «Soy egipcia» لمتعلم شخصيته رجل، أم نُثبّت شخصية المتعلم؟

