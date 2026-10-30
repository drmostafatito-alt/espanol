/* خريطة بصرية للمسارات الحقيقية القادمة من /api/content/paths — لا مسارات وهمية.
   الصور أصول محلية مصرّح بها ضمن المشروع، والربط دائمًا بمسار/استعلام حقيقي. */

export interface TrackVisual {
  image: string;
  shortAr: string;
}

const IMG = {
  daily: '/img/track-daily.jpg',
  work: '/img/track-work.jpg',
  vocab: '/img/track-vocab.jpg',
  travel: '/img/track-travel.jpg',
  food: '/img/track-food.jpg',
};

export function trackVisual(slug: string, title?: string | null): TrackVisual {
  const s = `${slug} ${title ?? ''}`.toLowerCase();
  if (s.includes('call') || s.includes('كول') || s.includes('عمل') || s.includes('مهن')) {
    return { image: IMG.work, shortAr: 'خدمة عملاء ومكالمات مهنية' };
  }
  if (s.includes('travel') || s.includes('سفر') || s.includes('سياح')) {
    return { image: IMG.travel, shortAr: 'مطارات، فنادق ومواقف السفر' };
  }
  if (s.includes('food') || s.includes('طعام') || s.includes('مطاعم')) {
    return { image: IMG.food, shortAr: 'الطلب في المطاعم والمقاهي' };
  }
  if (s.includes('vocab') || s.includes('كلم') || s.includes('top1000') || s.includes('مفرد')) {
    return { image: IMG.vocab, shortAr: 'أهم المفردات في جمل حقيقية' };
  }
  if (s.includes('main') || s.includes('أساس')) {
    return { image: IMG.daily, shortAr: 'رحلة متدرجة من الصفر حتى C1' };
  }
  return { image: IMG.daily, shortAr: 'مسار تعلّم تفاعلي' };
}

/* بطاقات موضوعات الصفحة الرئيسية — تفتح بحثًا حقيقيًا في معجم المنصة */
export interface LandingTopic {
  title: string;
  description: string;
  image: string;
  query: string;
}

export const LANDING_TOPICS: LandingTopic[] = [
  {
    title: 'السفر',
    description: 'مطارات، فنادق، تذاكر ومواقف السفر الحقيقية.',
    image: IMG.travel,
    query: 'viaje',
  },
  {
    title: 'المطاعم والطعام',
    description: 'اطلب طعامك وقهوتك بالإسبانية بثقة.',
    image: IMG.food,
    query: 'comida',
  },
  {
    title: 'العمل والكول سنتر',
    description: 'مفردات ومحاكاة لمكالمات خدمة العملاء.',
    image: IMG.work,
    query: 'trabajo',
  },
  {
    title: 'الحياة اليومية',
    description: 'تحيات، تسوق، ومحادثات الشارع اليومية.',
    image: IMG.daily,
    query: 'día',
  },
];

export const EXPLANATION_STYLES: { id: 'fusha' | 'fusha_eg' | 'eg'; label: string; hint: string }[] = [
  { id: 'fusha', label: 'العربية الفصحى', hint: 'شرح فصيح فقط بلا لهجات عامية' },
  { id: 'fusha_eg', label: 'فصحى مع توضيح مصري', hint: 'الافتراضي — الأنسب لمعظم المتعلمين' },
  { id: 'eg', label: 'العامية المصرية', hint: 'الشرح كله بالعامية المصرية' },
];

/* ---------------- نسخ الصور المتجاوبة ----------------
   نفس الأصول الأصلية، بأحجام مولّدة عبر tools/build-image-variants.mjs.
   المسارات حقيقية وموجودة في public/img؛ لا تُضاف مسارات غير مولّدة. */
export function trackImageSources(src: string): { webp: string } {
  const base = src.replace(/\.jpg$/, '');
  return { webp: `${base}-320.webp 320w, ${base}-640.webp 640w` };
}

export function trackImageSrcSet(src: string): string {
  const base = src.replace(/\.jpg$/, '');
  return `${base}-320.jpg 320w, ${base}-640.jpg 640w`;
}

/* الهيرو: أكبر نسخة JPEG هي الملف الأصلي نفسه (لا نسخة 1100 معاد ترميزها) */
export const HERO_IMAGE = {
  src: '/img/hero-spain.jpg',
  srcSet: '/img/hero-spain-400.jpg 400w, /img/hero-spain-700.jpg 700w, /img/hero-spain.jpg 1100w',
  sizes: '(max-width: 900px) 92vw, 520px',
  sources: [
    {
      type: 'image/avif',
      srcSet: '/img/hero-spain-400.avif 400w, /img/hero-spain-700.avif 700w, /img/hero-spain-1100.avif 1100w',
    },
    {
      type: 'image/webp',
      srcSet: '/img/hero-spain-400.webp 400w, /img/hero-spain-700.webp 700w, /img/hero-spain-1100.webp 1100w',
    },
  ],
};
