#!/usr/bin/env node
/**
 * ============================================================================
 * مولّد «ورقة مراجعة بشرية» من ملف درس JSON
 * ============================================================================
 * الغرض: أن يقرأ المراجع البشري درسًا كاملًا في صفحة واحدة (عربي + إسباني)
 * ويتحقق من: صحة الإسبانية، دقة الترجمة، ملاءمة المستوى، جودة المشتِّتات.
 * الملف المولَّد **مشتق** من الـJSON ولا يحتوي قرارًا جديدًا — أي تعديل يجب أن
 * يقع على الـJSON ثم يُعاد التوليد.
 *
 * الاستخدام:
 *   node tools/lesson-preview.mjs content/drafts/a1/lesson-a1-origen-de-donde-eres.json > out.md
 */
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const file = process.argv[2];
if (!file) {
  console.error('الاستخدام: node tools/lesson-preview.mjs <lesson.json>');
  process.exit(1);
}

const L = JSON.parse(readFileSync(file, 'utf8')).lesson;
const out = [];
const w = s => out.push(s);

const TYPE_AR = {
  listen_choose: 'استماع ثم اختيار',
  word_choice: 'اختيار كلمة/عبارة',
  fill_blank: 'ملء فراغ',
  word_order: 'إعادة ترتيب',
  dialogue_order: 'ترتيب حوار',
  type_missing_word: 'كتابة كلمة ناقصة',
  translate_short: 'ترجمة قصيرة',
  preposition_choice: 'اختيار حرف جر',
  choose_reply: 'اختيار ردّ مناسب',
  speak_with_text: 'نطق بنص (مشاركة)',
  speak_free: 'كلام حر (مشاركة)',
  write_sentence: 'كتابة جملة',
  conjugate_in_context: 'تصريف في سياق',
  find_fix_error: 'اكتشاف وتصحيح خطأ',
  distinguish_similar: 'تمييز متشابهات',
  match_pairs: 'مطابقة أزواج',
};

w(`# ورقة مراجعة بشرية — ${L.titleAr}`);
w('');
w(`> ملف مولَّد آليًا من \`${basename(file)}\`. **لا يُحرَّر يدويًا**: عدّل JSON ثم أعد التوليد.`);
w(`> أي تعديل هنا لن يصل للنظام.`);
w('');
w('## بيانات سريعة');
w('');
w(`| البند | القيمة |`);
w(`| --- | --- |`);
w(`| المعرّف | \`${L.slug}\` |`);
w(`| المستوى | ${L.level} |`);
w(`| المسار / الوحدة | \`${L.programSlug}\` / \`${L.unitSlug}\` |`);
w(`| الزمن المقدّر | ${L.estimatedMinutes} دقيقة |`);
w(`| عدد التمارين | ${L.exercises.length} (منها ${L.exercises.filter(e => ['speak_with_text', 'speak_free', 'roleplay_simulation', 'phone_call_response', 'match_pairs'].includes(e.type)).length} مشاركة لا تُصحَّح آليًا) |`);
w(`| حالة المراجعة | ${L.review?.status ?? 'غير محددة'} |`);
w(`| مراجع إسباني | ${L.review?.spanishReviewer ?? '**لا أحد بعد**'} |`);
w(`| مراجع ترجمة | ${L.review?.translationReviewer ?? '**لا أحد بعد**'} |`);
w('');
w(`**الهدف:** ${L.objectiveAr}`);
w('');
w(`**التراكيب المستهدفة:** ${(L.targetStructures || []).join(' · ')}`);
w('');
w(`**مفردات جديدة:** ${(L.newVocabulary || []).join(' · ')}`);
if ((L.reviewVocabulary || []).length) w(`**مراجعة سابقة:** ${(L.reviewVocabulary || []).join(' · ')}`);
w('');
w(`**حد الإتقان:** دقة ≥ ${L.mastery.minAccuracy}% وعدد صحيح ≥ ${L.mastery.minCorrectExercises}، وأنواع إلزامية: ${L.mastery.requiredExerciseTypes.join('، ')}.`);
w('');

if (L.scenarios?.length) {
  w('## الحوار / السياق');
  w('');
  for (const s of L.scenarios) {
    w(`*${s.contextAr}* — ${s.settingAr}`);
    w('');
    w('| الإسبانية | العربية (فصحى) | العربية (عامية) | صوت |');
    w('| --- | --- | --- | --- |');
    for (const line of s.lines) {
      w(`| **${line.es}** | ${line.ar} | ${line.arEg ?? '—'} | \`${line.audioKey ?? '—'}\` |`);
    }
    w('');
  }
}

w('## التمارين');
w('');
L.exercises.forEach((ex, i) => {
  w(`### ${i + 1}. ${TYPE_AR[ex.type] ?? ex.type} — \`${ex.id}\``);
  w('');
  w(`**التعليمات:** ${ex.instructionAr}`);
  if (ex.contextAr) w(`**السياق:** ${ex.contextAr}`);
  if (ex.stemEs) w(`**النص الإسباني:** ${ex.stemEs}`);
  if (ex.stemAr) w(`**الترجمة:** ${ex.stemAr}`);
  if (ex.audioKey) w(`**الصوت:** \`${ex.audioKey}\` ${ex.speechEs ? `— النص المنطوق: «${ex.speechEs}»` : ''}`);
  if (ex.items?.length) w(`**الرموز المتاحة:** ${ex.items.map(t => `\`${t.text}\``).join(' · ')}`);
  w('');
  if (ex.options?.length) {
    w('| الخيار | إسباني | عربي | صحيح؟ | سبب المشتِّت |');
    w('| --- | --- | --- | --- | --- |');
    for (const o of ex.options) {
      w(`| ${o.id} | ${o.text} | ${o.textAr ?? '—'} | ${o.isCorrect ? '✅' : ''} | ${o.distractorRationaleAr ?? '—'} |`);
    }
    w('');
  }
  const key = ex.answerKey ?? {};
  if (key.correctOptionIds) w(`**الإجابة:** \`${key.correctOptionIds.join(', ')}\``);
  else if (key.accepted) w(`**الإجابات المقبولة:** ${key.accepted.map(a => `\`${a}\``).join(' · ')}`);
  else if (key.modelAnswer) w(`**الجواب النموذجي:** ${key.modelAnswer} _(تمرين مشاركة — لا يُصحَّح آليًا)_`);
  w('');
  w(`**الشرح:** ${ex.explanationAr}`);
  if (ex.errorFeedback && Object.keys(ex.errorFeedback).length) {
    w('');
    w('**تغذية راجعة للأخطاء:**');
    for (const [k, v] of Object.entries(ex.errorFeedback)) w(`- \`${k}\` → ${v}`);
  }
  w('');
});

w('## قائمة المراجعة (يوقّعها المراجع البشري)');
w('');
w('- [ ] كل جملة إسبانية صحيحة نحويًا وطبيعية (لا ترجمة حرفية).');
w('- [ ] التشكيل والنبر وعلامات ¿ ¡ صحيحة.');
w('- [ ] الترجمة العربية دقيقة ولا تنقل معنى خاطئًا.');
w('- [ ] الشرح العربي واضح لجمهور عربي، وغير مولَّد آليًا.');
w('- [ ] المشتِّتات معقولة تربويًا (أخطاء متوقعة لا خيارات سخيفة).');
w('- [ ] مستوى الصعوبة يناسب A1 فعلًا.');
w('- [ ] لا يوجد حكم ثقافي أو ديني غير محايد.');
w('- [ ] الصوت: كل مقطع مُعلَّم pending ولا ادعاء بوجود ملف.');
w('');
w('---');
w('');
w('>**ملاحظة صدق:** هذا الدرس **مسودة** لم تُراجَع بشريًا. وجوده هنا لا يعني أنه محتوى نهائي، ولا أنه يغطي مستوى A1 — هو درس واحد من وحدة واحدة.');

console.log(out.join('\n'));
