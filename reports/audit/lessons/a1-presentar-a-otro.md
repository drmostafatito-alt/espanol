# تقرير تدقيق — قدّم صديقك: te presento a…

- **الملف:** `content/drafts/a1/lesson-a1-presentar-a-otro.json`
- **المعرّف:** `a1-presentar-a-otro` · **المستوى:** A1 · **الوحدة:** `a1-u1-origen`
- **التمارين:** 9 (choose_reply×1, fill_blank×1, find_fix_error×1, listen_choose×1, speak_with_text×1, translate_short×1, word_choice×2, word_order×1)
- **السيناريوهات:** 1 · **أسطر الحوار:** 4
- **الحالة:** draft · spanishReviewer: null · translationReviewer: null · reviewedAt: null

> تدقيق آلي بمساعدة نموذج. **لا يُغني عن مراجعة بشرية** للإسبانية والترجمة العربية.

## 1) أخطاء مؤكَّدة أُصلحت (قابلة للتحقق ميكانيكيًا)

| # | الموضع | المشكلة | الإصلاح |
|---|--------|---------|---------|
| 1 | a1_pres_9_speak — مفتاح صوت خاطئ | referenceAudioKey «pending/a1-presentar-omar-1» يخص سطرًا آخر في السيناريو. | مفتاح مستقل: `pending/a1-presentar-9-model-1`. |
| 2 | answerKey.mode في غير موضعه | مكرر مع `scoring.mode`. | أُزيل. |

## 2) ملاحظات مرجَّحة (تحتاج قرارًا بشريًا — لم أُعدّل النص)

- `a1_pres_5_fix` بلا stemAr، وخياران فيه بلا textAr («Te presento a ella es mi amiga.» / «Te presento mi amiga Nour.»).
- `a1_pres_6_formal`: الخيار المشتت «Le presento a mi compañero Karim, ¿vale?» يستخدم le الصحيح ثم يخفق في السجل — منطقي، لكنه قد يُقرأ كخطأ في الضمير لا في السجل.

**رصد آلي إضافي (تنبيهات، ليست أخطاء):**

- `R17-option-translation` — خيارات بلا textAr: a1_pres_5_b, a1_pres_5_c
- `R29-stem-translation` — stemAr ناقص بينما تمارين أخرى في الدرس مترجمة
- `R17-option-translation` — خيارات بلا textAr: a1_pres_6_c

## 3) تعديلات مقترحة (لم تُطبَّق)

- ترجمة عربية للخيارات المذكورة (بيد مترجم، لا آليًا).
- إضافة stemAr للتمرين المذكور ليساوي بقية الدرس.

## 4) أسئلة لمراجع إسباني/عربي مختص

- هل «Le presento a mi compañero» هو السجل الأنسب في مكتب إسباني، أم «Este es mi compañero» أشيع؟

