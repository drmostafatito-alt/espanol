/**
 * إصلاح لمرة واحدة: تعبئة ترجمات عربية ناقصة كشفها tools/audit-content-quality.mjs
 * (R17-option-translation و R29-stem-translation).
 *
 * لماذا سكربت وليس تعديلًا يدويًا: الملفات كبيرة ومتشابهة، والكتابة اليدوية تُسهّل
 * إصابة الحقل الخطأ. كل إدخال هنا مكتوب ومراجَع يدويًا، والسكربت يتحقق قبل الكتابة
 * من وجود التمرين وأن الحقل ناقص فعلًا، ثم يعيد التحقق بعد الكتابة.
 *
 * التشغيل: node tools/fix-missing-translations.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

// exId = التمرين، optId = الخيار (لـ textAr فقط)
const edits = [
  // ---- R17: خيارات بلا textAr ----
  ['content/drafts/a1/lesson-a1-nacionalidades.json', 'a1_nac_7_pais', 'a1_nac_7_c', 'أنا إيطالي من إيطاليا جنسية.'],
  ['content/drafts/a1/lesson-a1-presentar-a-otro.json', 'a1_pres_5_fix', 'a1_pres_5_b', 'أقدّم لك هي صديقتي.'],
  ['content/drafts/a1/lesson-a1-presentar-a-otro.json', 'a1_pres_5_fix', 'a1_pres_5_c', 'أقدّم لك صديقتي نور.'],
  ['content/drafts/a1/lesson-a1-presentar-a-otro.json', 'a1_pres_6_formal', 'a1_pres_6_c', 'أقدّم لك زميلي كريم، أليس كذلك؟'],
  ['content/drafts/a1/lesson-a1-saludos-formalidad.json', 'a1_sal_6_fix', 'a1_sal_6_c', 'هل حضرتك تعمل هنا؟ (الفعل غير مصرّف)'],
  ['content/drafts/callcenter/lesson-cc-u1-opening.json', 'cc_u1_3_formal', 'cc_u1_3_b', 'قل لي رقم طلبك.'],
  ['content/drafts/callcenter/lesson-cc-u1-opening.json', 'cc_u1_3_formal', 'cc_u1_3_c', 'ما رقم الطلب؟'],
  ['content/drafts/travel/lesson-tr-u1-boarding-delay.json', 'tr_u1_10_fix', 'tr_u1_10_b', 'عفوًا، يمكنني المرور من فضلك، أليس كذلك؟'],
  ['content/drafts/travel/lesson-tr-u2-checkin.json', 'tr_u2_8_fix', 'tr_u2_8_b', 'المفتاح لا يعمل. أعطني آخر حالًا.'],
  ['content/drafts/travel/lesson-tr-u2-checkout.json', 'tr_u2_13_checkout', 'tr_u2_13_b', 'هل يمكنني الدفع ببطاقة الائتمان؟'],

  // ---- R29: جذع التمرين بلا stemAr ----
  ['content/drafts/a1/lesson-a1-nacionalidades.json', 'a1_nac_4_fix', null, 'مارتا إسباني.'],
  ['content/drafts/a1/lesson-a1-presentar-a-otro.json', 'a1_pres_5_fix', null, 'أقدّم لك هي صديقتي نور.'],
  ['content/drafts/a1/lesson-a1-saludos-formalidad.json', 'a1_sal_6_fix', null, 'حضرتك تعملين هنا، أليس كذلك؟'],
  ['content/drafts/callcenter/lesson-cc-u1-opening.json', 'cc_u1_3_formal', null, 'اسمع، قل لي رقم طلبك.'],
  ['content/drafts/callcenter/lesson-cc-u1-hold-transfer.json', 'cc_u1_13_phone', null, 'العميل: لا، لا أريد الانتظار عشر دقائق. حوّلني الآن.'],
  ['content/drafts/callcenter/lesson-cc-u1-roleplay.json', 'cc_u1_17_roleplay', null, 'العميل: أنتظر منذ ثلاثة أيام، والعلبة وصلت مكسورة. أريد استرداد المبلغ كاملًا.'],
  ['content/drafts/travel/lesson-tr-u1-boarding-delay.json', 'tr_u1_10_fix', null, 'عفوًا، يمكنني المرور من فضلك، أليس كذلك؟'],
  ['content/drafts/travel/lesson-tr-u2-checkin.json', 'tr_u2_8_fix', null, 'أريد المفتاح مرة أخرى، لأنه لا يعمل.'],
];

const byFile = new Map();
for (const [file, exId, optId, value] of edits) {
  if (!byFile.has(file)) byFile.set(file, []);
  byFile.get(file).push({ exId, optId, value });
}

let applied = 0;
for (const [file, list] of byFile) {
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  const exercises = doc.lesson?.exercises ?? [];
  for (const { exId, optId, value } of list) {
    const ex = exercises.find(e => e.id === exId);
    if (!ex) throw new Error(`${file}: التمرين ${exId} غير موجود`);
    if (optId) {
      const opt = (ex.options ?? []).find(o => o.id === optId);
      if (!opt) throw new Error(`${file}: الخيار ${optId} غير موجود`);
      if (opt.textAr) throw new Error(`${file}/${optId}: textAr موجود بالفعل (${opt.textAr})`);
      if (!opt.text) throw new Error(`${file}/${optId}: خيار بلا text`);
      opt.textAr = value;
    } else {
      if (ex.stemAr) throw new Error(`${file}/${exId}: stemAr موجود بالفعل`);
      if (!ex.stemEs) throw new Error(`${file}/${exId}: لا stemEs لتُرجمته`);
      ex.stemAr = value;
    }
    applied++;
  }
  // الكتابة بنفس شكل الملفات الحالية (مسافتان، بلا سطر أخير فارغ)
  writeFileSync(file, JSON.stringify(doc, null, 2));
}
console.log(`طُبِّق ${applied} حقلًا في ${byFile.size} ملفًا.`);
