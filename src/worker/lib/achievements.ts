/**
 * الإنجازات: تعريفات صريحة + قياس من بيانات حقيقية.
 *
 * القاعدة الحاكمة: لا إنجاز يُمنح (ولا يُعرَض مكتملًا) إلا إذا تجاوز مقياسًا
 * محسوبًا من قاعدة البيانات. لا قيم ثابتة ولا «إنجازات ترحيبية».
 * كل تعريف يحمل مقياسًا رقميًا وهدفًا، فتُعرض للطالب نسبة التقدم فعلًا.
 */

export interface AchievementSnapshot {
  lessonsCompleted: number;
  lessonsByLevel: Record<string, number>;
  xpTotal: number;
  streakLongest: number;
  wordsSeen: number;
  wordsStable: number;
  reviewsDone: number;
  bestAccuracy: number;
}

export interface AchievementDef {
  code: string;
  titleAr: string;
  descriptionAr: string;
  /** اسم أيقونة من مكتبة الواجهة (icons.tsx) */
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  /** قيمة المقياس الحالية */
  value: (s: AchievementSnapshot) => number;
  target: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    code: 'first_step',
    titleAr: 'الخطوة الأولى',
    descriptionAr: 'أتممت أول درس لك في المنصة.',
    icon: 'play',
    tier: 'bronze',
    value: s => s.lessonsCompleted,
    target: 1,
  },
  {
    code: 'five_lessons',
    titleAr: 'خمسة دروس',
    descriptionAr: 'أكملت خمسة دروس كاملة.',
    icon: 'book',
    tier: 'bronze',
    value: s => s.lessonsCompleted,
    target: 5,
  },
  {
    code: 'fifteen_lessons',
    titleAr: 'مثابر',
    descriptionAr: 'أكملت خمسة عشر درسًا.',
    icon: 'graduation',
    tier: 'silver',
    value: s => s.lessonsCompleted,
    target: 15,
  },
  {
    code: 'precision_90',
    titleAr: 'دقة عالية',
    descriptionAr: 'أنجزت درسًا بدقة 90% أو أكثر.',
    icon: 'target',
    tier: 'silver',
    value: s => s.bestAccuracy,
    target: 90,
  },
  {
    code: 'streak_3',
    titleAr: 'ثلاثة أيام',
    descriptionAr: 'تعلّمت ثلاثة أيام متتالية.',
    icon: 'flame',
    tier: 'bronze',
    value: s => s.streakLongest,
    target: 3,
  },
  {
    code: 'streak_7',
    titleAr: 'أسبوع كامل',
    descriptionAr: 'سبعة أيام متتالية من التعلم.',
    icon: 'flame',
    tier: 'silver',
    value: s => s.streakLongest,
    target: 7,
  },
  {
    code: 'streak_30',
    titleAr: 'شهر بلا انقطاع',
    descriptionAr: 'ثلاثون يومًا متتالية من التعلم.',
    icon: 'flame',
    tier: 'gold',
    value: s => s.streakLongest,
    target: 30,
  },
  {
    code: 'xp_100',
    titleAr: 'مئة نقطة',
    descriptionAr: 'جمعت 100 نقطة خبرة.',
    icon: 'star',
    tier: 'bronze',
    value: s => s.xpTotal,
    target: 100,
  },
  {
    code: 'xp_500',
    titleAr: 'خمسمئة نقطة',
    descriptionAr: 'جمعت 500 نقطة خبرة.',
    icon: 'star',
    tier: 'silver',
    value: s => s.xpTotal,
    target: 500,
  },
  {
    code: 'xp_1500',
    titleAr: 'متقدّم',
    descriptionAr: 'جمعت 1500 نقطة خبرة.',
    icon: 'gem',
    tier: 'gold',
    value: s => s.xpTotal,
    target: 1500,
  },
  {
    code: 'words_50',
    titleAr: 'خمسون كلمة',
    descriptionAr: 'أضفت 50 كلمة إلى حصيلة المراجعة.',
    icon: 'cards',
    tier: 'bronze',
    value: s => s.wordsSeen,
    target: 50,
  },
  {
    code: 'words_stable_30',
    titleAr: 'ذاكرة راسخة',
    descriptionAr: 'ثلاثون كلمة ثبتت في ذاكرتك (فاصل مراجعة ≥ 21 يومًا).',
    icon: 'gem',
    tier: 'silver',
    value: s => s.wordsStable,
    target: 30,
  },
  {
    code: 'reviews_20',
    titleAr: 'مراجع منتظم',
    descriptionAr: 'أتممت 20 مراجعة متباعدة.',
    icon: 'refresh',
    tier: 'bronze',
    value: s => s.reviewsDone,
    target: 20,
  },
  {
    code: 'reach_a1',
    titleAr: 'عبرت التمهيد',
    descriptionAr: 'أكملت أول درس في مستوى A1.',
    icon: 'route',
    tier: 'silver',
    value: s => s.lessonsByLevel.A1 ?? 0,
    target: 1,
  },
  {
    code: 'reach_a2',
    titleAr: 'مستوى A2',
    descriptionAr: 'أكملت درسًا في مستوى A2.',
    icon: 'route',
    tier: 'silver',
    value: s => s.lessonsByLevel.A2 ?? 0,
    target: 1,
  },
  {
    code: 'reach_b1',
    titleAr: 'مستوى B1',
    descriptionAr: 'أكملت درسًا في مستوى B1.',
    icon: 'route',
    tier: 'gold',
    value: s => s.lessonsByLevel.B1 ?? 0,
    target: 1,
  },
];

export interface AchievementState {
  code: string;
  titleAr: string;
  descriptionAr: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  earned: boolean;
  current: number;
  target: number;
  /** نسبة التقدم مقصوصة إلى 0..100 */
  percent: number;
}

/**
 * يحوّل التعريفات إلى حالة قابلة للعرض.
 * `earned` مشتق من المقاس لا من جدول منفصل، حتى لا يتناقض الجدول مع الواقع.
 */
export function evaluateAchievements(snapshot: AchievementSnapshot): AchievementState[] {
  return ACHIEVEMENTS.map(def => {
    const raw = def.value(snapshot);
    const current = Math.max(0, Math.min(def.target, Math.floor(raw)));
    return {
      code: def.code,
      titleAr: def.titleAr,
      descriptionAr: def.descriptionAr,
      icon: def.icon,
      tier: def.tier,
      earned: raw >= def.target,
      current,
      target: def.target,
      percent: def.target > 0 ? Math.round(((current / def.target) * 100)) : 0,
    };
  }).sort((a, b) => Number(b.earned) - Number(a.earned) || b.percent - a.percent);
}

/** إنجازات مكتسبة فقط — للعرض المختصر في صفحة اليوم */
export function earnedCodes(states: AchievementState[]): string[] {
  return states.filter(s => s.earned).map(s => s.code);
}
