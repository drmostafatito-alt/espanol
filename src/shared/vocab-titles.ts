/**
 * عنوان حزمة المفردات كما يراه الطالب.
 *
 * مصدر الحقيقة هو `titleAr` في ملفات المفردات داخل content/drafts
 * (تُستورد إلى vocabulary_bundles.title_ar). هذه الدالة طبقة دفاع فقط:
 * صفوف قديمة أو استيرادات ناقصة قد تحمل المعرّف الإنجليزي في عمود العنوان،
 * فلا نعرض للطالب `cv-lex-nouns-core` أبدًا.
 */

const ARABIC = /[\u0600-\u06FF]/;

/** هل النص عنوان عربي صالح للعرض، أم معرّف تقني/غير مترجم؟ */
export function isTechnicalPackTitle(title: string | null | undefined, slug: string): boolean {
  if (!title) return true;
  const t = title.trim();
  if (!t) return true;
  if (t === slug) return true;
  if (!ARABIC.test(t)) return true; // لاتيني بالكامل
  if (/^[a-z0-9_-]+$/i.test(t)) return true;
  return false;
}

/** عنوان العرض: العنوان العربي المخزَّن، وإلا بديل عربي واضح (لا معرّف تقني). */
export function resolvePackTitle(
  titleAr: string | null | undefined,
  slug: string,
  level?: string | null,
): string {
  if (!isTechnicalPackTitle(titleAr, slug)) return titleAr!.trim();
  const lvl = (level ?? '').trim();
  return lvl ? `حزمة مفردات ${lvl}` : 'حزمة مفردات';
}
