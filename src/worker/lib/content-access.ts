/* ============================================================================
   بوابة المحتوى غير المنشور
   ----------------------------------------------------------------------------
   القاعدة: المحتوى المنشور فقط يُخدم افتراضيًا. المسودات تُخدم فقط إذا:
     1) ALLOW_UNREVIEWED_CONTENT === 'true'  (مفتاح صريح، غير موجود في الإنتاج)
     2) البيئة ليست production
   وفي كل استجابة تُوسَم بأنها «عينة غير مراجعة» — لا يمكن أن تمرّ كأنها نهائية.
   ========================================================================== */
import type { Env } from '../types';
import { isNonProductionEnv } from './http';

export function allowUnreviewedContent(env: Env): boolean {
  return env.ALLOW_UNREVIEWED_CONTENT === 'true' && isNonProductionEnv(env);
}

export const UNREVIEWED_PROVENANCE = {
  status: 'unreviewed_sample',
  warningAr:
    'عينة تعليمية تجريبية لم تُراجَع بشريًا بعد (لا مراجعة إسبانية ولا مراجعة ترجمة). ليست محتوى نهائيًا ولا تُنشر.',
};
