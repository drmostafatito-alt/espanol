/* ============================================================================
   التصحيح — دالة نقية، بلا قاعدة بيانات ولا شبكة، قابلة للاختبار وحدها.
   القاعدة الحاكمة: الخادم هو المصحّح. العميل يرسل *إجابة* فقط، ولا يرسل صحة
   ولا درجة ولا XP. أي حقل من هذه يُتجاهَل بصمت في طبقة المسار.
   ========================================================================== */

export type GradingMode = 'graded' | 'participation';

export interface GradeResult {
  mode: GradingMode;
  /** null في تمارين المشاركة: لا ندّعي تصحيح نطق أو محادثة مفتوحة */
  correct: boolean | null;
  score: number | null; // 0..100
  /** رسالة خاصة بالخيار الخاطئ الذي اختاره المتعلم (إن وُجدت) */
  chosenFeedbackAr?: string;
  /** true عندما تكون الإجابة خاطئة بعلامة النبرة فقط (تمارين strictAccent فقط) */
  wrongByAccentOnly?: boolean;
}

export interface AnswerKey {
  accepted?: string[];
  correctOptionIds?: string[];
  caseSensitive?: boolean;
  /** قديم/احتياطي: كان يفعّل تسامح التشكيل لتمرين واحد. الافتراضي الآن متسامح، انظر strictAccent. */
  allowMissingAccent?: boolean;
  /**
   * صرامة التشكيل: عند ضبطه يُصحَّح التشكيل حرفيًا (si ≠ sí). يُستخدم فقط
   * حيث يثبت المحتوى أن التمييز هو هدف السؤال (زوج دنيا + تعليم صريح)،
   * مثل أداة الربط الشرطية si. الافتراضي: متسامح مع غياب النبرة.
   * strictAccent يتغلب على allowMissingAccent عند تعارضهما.
   */
  strictAccent?: boolean;
  punctuationInsensitive?: boolean;
  strictWordMatch?: boolean;
  mode?: string;
}

/** أنواع التمارين التي تُصحَّح آليًا بنصّ حر */
const TEXT_TYPES = new Set([
  'fill_blank', 'type_missing_word', 'translate_short', 'conjugate_in_context',
  'dictation', 'write_sentence', 'reconstruct_audio_sentence', 'write_email', 'summarize_dialogue',
]);

/** أنواع تُصحَّح بمفتاح خيارات */
const OPTION_TYPES = new Set([
  'word_choice', 'listen_choose', 'choose_reply', 'find_fix_error', 'distinguish_similar',
  'image_choice', 'identify_speaker', 'infer_meaning', 'preposition_choice',
  'review_common_errors', 'recall_previous_word', 'resolve_customer_issue',
]);

const ORDER_TYPES = new Set(['word_order', 'dialogue_order']);

/**
 * أنواع لا يصحّحها الخادم: نطق حر، تمثيل دور، مكالمة مفتوحة.
 * تُحسب «مشاركة» ولا تدخل في حساب الدقة — لأن ادعاء تصحيحها يتطلب ASR أو مراجعًا بشريًا،
 * ولا نملك أيًّا منهما الآن. عرضها كتمارين مُصحَّحة سيكون تزويرًا لبيانات التقدم.
 */
const PARTICIPATION_TYPES = new Set([
  'speak_with_text', 'speak_free', 'roleplay_simulation', 'phone_call_response',
  // match_pairs معرَّف في مخطط المحتوى لكن لا مصحّح له بعد — يُعامَل كمشاركة
  // حتى يُنفَّذ، ولا يدخل في الدقة. لا يوجد محتوى مستورد يستخدمه حاليًا.
  'match_pairs',
]);

export function gradingModeOf(type: string): GradingMode {
  // نوع غير معروف لا يُعامل كمُصحَّح: gradeAnswer نفسها تردّ «مشاركة» بلا
  // مفتاح له، فعدّه graded كان يجعل الدرس مستحيل النجاح صامتًا.
  if (PARTICIPATION_TYPES.has(type)) return 'participation';
  return isKnownExerciseType(type) ? 'graded' : 'participation';
}

/**
 * إزالة التشكيل اللاتيني (á → a) مع الحفاظ على ñ/Ñ حرفًا قائمًا بذاته:
 * التيلدا هنا حرف لا علامة تشكيل — حذفها يدمج أزواجًا دنيا (año/ano،
 * peña/pena، soñar/sonar). نستبدل ñ/Ñ بعلامتين خاصتين قبل التفكيك ثم نعيدهما.
 */
function stripDiacritics(s: string): string {
  const NFC = s.normalize('NFC');
  const guarded = NFC.replace(/ñ/g, '\uE000').replace(/Ñ/g, '\uE001');
  return guarded.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC')
    .replace(/\uE000/g, 'ñ').replace(/\uE001/g, 'Ñ');
}

function normalizeText(input: string, key: AnswerKey): string {
  let t = input.trim().replace(/\s+/g, ' ');
  if (!key.caseSensitive) t = t.toLowerCase();
  // علامات الترقيم الإسبانية تُهمَل افتراضيًا: الخطأ فيها ليس خطأ لغويًا يستحق العقاب
  if (key.punctuationInsensitive !== false) t = t.replace(/[.,;:!?¡¿"«»…'’]/g, '');
  // الافتراضي: تسامح مع غياب النبرة (está = esta) — لا تمرين حالي يعلّم
  // التمييز بالنبرة هدفًا إلا ما ضُبط strictAccent صراحةً وبدليل من المحتوى.
  if (!key.strictAccent) t = stripDiacritics(t);
  return t.trim().replace(/\s+/g, ' ');
}

/** مقارنة بعد إزالة التشكيل (مع حفظ ñ) — لكشف «خاطئ بالنبرة فقط». */
function stripForAccentCheck(input: string, key: AnswerKey): string {
  return normalizeText(input, { ...key, strictAccent: false });
}

function asText(response: unknown): string {
  if (typeof response === 'string') return response;
  if (Array.isArray(response)) return response.map(String).join(' ');
  if (response && typeof response === 'object') {
    const r = response as Record<string, unknown>;
    if (typeof r.text === 'string') return r.text;
    if (Array.isArray(r.tokens)) return r.tokens.map(String).join(' ');
    if (Array.isArray(r.order)) return r.order.map(String).join(' ');
  }
  return '';
}

/**
 * يصحّح إجابة واحدة.
 * @param response ما أرسله المتعلم (نص، أو {text}، أو {optionId}، أو {optionIds})
 */
export function gradeAnswer(
  type: string,
  answerKey: AnswerKey | null | undefined,
  response: unknown,
  errorFeedback: Record<string, string> = {},
): GradeResult {
  const key = answerKey ?? {};
  const mode = gradingModeOf(type);

  if (mode === 'participation') {
    // نتحقق فقط من أن المتعلم تفاعل، ولا ندّعي صحة
    const attempted = typeof response === 'string' ? response.trim().length > 0 : !!response;
    return { mode, correct: null, score: null, ...(attempted ? {} : {}) };
  }

  // تمارين الترتيب تُصحَّح بالترتيب المُنتَج، لا بمعرّفات خيارات.
  // بعض المحتوى يحمل correctOptionIds احتياطًا؛ لو فُحص أولًا لصار التمرين دائم الخطأ
  // (المتعلم يرسل {order:[...]} فيُقرأ كأنه لم يختر شيئًا). لذا نفحص ORDER_TYPES أولًا.
  if (!ORDER_TYPES.has(type) && (OPTION_TYPES.has(type) || Array.isArray(key.correctOptionIds))) {
    const correctIds = new Set(key.correctOptionIds ?? []);
    let chosen: string[] = [];
    if (typeof response === 'string') chosen = [response];
    else if (response && typeof response === 'object') {
      const r = response as Record<string, unknown>;
      if (Array.isArray(r.optionIds)) chosen = r.optionIds.map(String);
      else if (typeof r.optionId === 'string') chosen = [r.optionId];
    }
    const ok = chosen.length === correctIds.size && chosen.every(id => correctIds.has(id));
    const wrong = chosen.find(id => !correctIds.has(id));
    return {
      mode,
      correct: ok,
      score: ok ? 100 : 0,
      ...(ok || !wrong ? {} : { chosenFeedbackAr: errorFeedback[wrong] }),
    };
  }

  if (ORDER_TYPES.has(type) || Array.isArray(key.accepted)) {
    const accepted = (key.accepted ?? []).map(a => normalizeText(a, key));
    const given = normalizeText(asText(response), key);
    if (!given) return { mode, correct: false, score: 0, chosenFeedbackAr: errorFeedback.order };
    const ok = accepted.includes(given);
    // في تمارين strictAccent: خطأ بالنبرة فقط يستحق تلميحًا صريحًا بالعربية
    // بدل رسالة الخطأ العامة — المتعلم كتب الكلمة الصحيحة بلا/بنبرة زائدة.
    let wrongByAccentOnly = false;
    if (!ok && key.strictAccent) {
      const strippedGiven = stripForAccentCheck(asText(response), key);
      wrongByAccentOnly = (key.accepted ?? []).some(a => stripForAccentCheck(a, key) === strippedGiven);
    }
    // تغذية راجعة مكتوبة للإجابة الخاطئة نفسها (مفاتيح إسبانية في المحتوى،
    // مثل «llego» أو «Soy de Egypto») — تُطابَق بعد نفس تسوية النص.
    const matched = ok
      ? undefined
      : Object.entries(errorFeedback).find(([k, v]) => v && k !== 'order' && normalizeText(k, key) === given)?.[1];
    return {
      mode,
      correct: ok,
      score: ok ? 100 : 0,
      ...(wrongByAccentOnly
        ? {
            wrongByAccentOnly: true,
            chosenFeedbackAr: 'انتبه لعلامة النبرة فقط: الكلمة صحيحة، لكن التشكيل يغيّر المعنى هنا — راجع الشرح.',
          }
        : ok
          ? {}
          : { chosenFeedbackAr: matched ?? errorFeedback.order }),
    };
  }

  // نوع مُعلَن لكن بلا مفتاح تصحيح — خطأ محتوى، لا نمنح صحة ولا نكسر الجلسة
  return { mode: 'participation', correct: null, score: null };
}

/** هل هذا النوع معروف للنظام؟ (يُستخدم للتحقق من المحتوى المستورد) */
export function isKnownExerciseType(type: string): boolean {
  return TEXT_TYPES.has(type) || OPTION_TYPES.has(type) || ORDER_TYPES.has(type) || PARTICIPATION_TYPES.has(type);
}

export const KNOWN_TYPES = {
  text: [...TEXT_TYPES],
  option: [...OPTION_TYPES],
  order: [...ORDER_TYPES],
  participation: [...PARTICIPATION_TYPES],
};
