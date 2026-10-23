# تقرير تدقيق — الأمن والصعود والتأخير

- **الملف:** `content/drafts/travel/lesson-tr-u1-boarding-delay.json`
- **المعرّف:** `tr-u1-boarding-delay` · **المستوى:** A2 · **الوحدة:** `tr-u1-airport`
- **التمارين:** 4 (choose_reply×1, fill_blank×1, find_fix_error×1, listen_choose×1)
- **السيناريوهات:** 1 · **أسطر الحوار:** 3
- **الحالة:** draft · spanishReviewer: null · translationReviewer: null · reviewedAt: null

> تدقيق آلي بمساعدة نموذج. **لا يُغني عن مراجعة بشرية** للإسبانية والترجمة العربية.

## 1) أخطاء مؤكَّدة أُصلحت (قابلة للتحقق ميكانيكيًا)

| # | الموضع | المشكلة | الإصلاح |
|---|--------|---------|---------|
| 1 | tr_u1_7_notice — مفتاح صوت خاطئ | audioKey «pending/tr-u1-l2-anuncio-1» يخص إعلانًا أطول في السيناريو. | مفتاح مستقل: `pending/tr-u1-7-notice-1`. |

## 2) ملاحظات مرجَّحة (تحتاج قرارًا بشريًا — لم أُعدّل النص)

- `tr_u1_10_fix` بلا stemAr، والخيار المشتت «Disculpe, puedo pasar por favor, ¿no?» بلا textAr.

**رصد آلي إضافي (تنبيهات، ليست أخطاء):**

- `R17-option-translation` — خيارات بلا textAr: tr_u1_10_b
- `R29-stem-translation` — stemAr ناقص بينما تمارين أخرى في الدرس مترجمة

## 3) تعديلات مقترحة (لم تُطبَّق)

- ترجمة عربية للخيارات المذكورة (بيد مترجم، لا آليًا).
- إضافة stemAr للتمرين المذكور ليساوي بقية الدرس.

## 4) أسئلة لمراجع إسباني/عربي مختص

- مصطلحات الأمن والصعود (control de seguridad، tarjeta de embarque) — تحتاج تثبيتًا.

