# تقرير تدقيق — تسجيل الوصول في المطار

- **الملف:** `content/drafts/travel/lesson-tr-u1-checkin.json`
- **المعرّف:** `tr-u1-checkin` · **المستوى:** A2 · **الوحدة:** `tr-u1-airport`
- **التمارين:** 6 (choose_reply×1, fill_blank×1, speak_with_text×1, translate_short×1, word_choice×1, word_order×1)
- **السيناريوهات:** 1 · **أسطر الحوار:** 4
- **الحالة:** draft · spanishReviewer: null · translationReviewer: null · reviewedAt: null

> تدقيق آلي بمساعدة نموذج. **لا يُغني عن مراجعة بشرية** للإسبانية والترجمة العربية.

## 1) أخطاء مؤكَّدة أُصلحت (قابلة للتحقق ميكانيكيًا)

| # | الموضع | المشكلة | الإصلاح |
|---|--------|---------|---------|
| 1 | answerKey.mode | مكرر مع `scoring.mode`. | أُزيل. |
| 2 | tr_u1_6_speak — مفتاح صوت خاطئ | referenceAudioKey «pending/tr-u1-l1-omar-1» يخص سطر السيناريو، ونص النموذج مختلف. | مفتاح مستقل: `pending/tr-u1-6-model-1`. |

## 2) ملاحظات مرجَّحة (تحتاج قرارًا بشريًا — لم أُعدّل النص)

- `tr_u1_5_translate` يقبل «Mi vuelo llega con dos horas de retraso.» و«Mi vuelo está retrasado dos horas.» — الأولى مقبولة دلاليًا في المطار، والثانية فيها «estar retrasado + مدة» وهي متداولة لكنها أقل استقامة من «con dos horas de retraso». **لم أحذفهما** لأنه قرار لغوي (تسامح التصحيح) لا خطأ ميكانيكي.
- `targetVocab` يشير إلى puerta/embarque/retraso وهي من حزمة السفر لا من قوائم الدرس المعلنة.

**رصد آلي إضافي (تنبيهات، ليست أخطاء):**

- `R14-target-vocab-fit` — targetVocab «puerta» ليست من مفردات الدرس المعلنة
- `R14-target-vocab-fit` — targetVocab «embarque» ليست من مفردات الدرس المعلنة
- `R14-target-vocab-fit` — targetVocab «retraso» ليست من مفردات الدرس المعلنة

## 3) تعديلات مقترحة (لم تُطبَّق)

- إدراج المفردات المذكورة في قوائم الدرس أو إزالتها من targetVocab.

## 4) أسئلة لمراجع إسباني/عربي مختص

- هل «Mi vuelo está retrasado dos horas» مقبولة تعليميًا كإجابة صحيحة، أم تُقيَّد بـ«con dos horas de retraso»؟

