/* ============================================================================
   رسومات أصلية (SVG) للهوية البصرية — بدل صور نقطية ثقيلة.
   ----------------------------------------------------------------------------
   * كلها متجهية: تعمل بأي كثافة بكسل، وزنها بالكيلوبايت لا بالميغابايت.
   * «سوليثو» (Solecito) هي شخصية المنصة: شمس صغيرة بوجه، بديل عن الماسكوت
     النقطي القديم (3.3MB لصورتين). لا تُقلّد أي شخصية منتج آخر.
   * الأشكال هنا لونية بحتة وتتلقى `aria-hidden` افتراضيًا — النص هو المعنى.
   ========================================================================== */
import type { ReactNode } from 'react';

export type SolecitoMood = 'wave' | 'happy' | 'celebrate' | 'think' | 'sleep';

const FACE: Record<SolecitoMood, ReactNode> = {
  wave: (
    <>
      <circle cx="34" cy="40" r="3.1" fill="#1F2A44" />
      <circle cx="54" cy="40" r="3.1" fill="#1F2A44" />
      <path d="M34 52c4 5 12 5 16 0" stroke="#1F2A44" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="49" r="4" fill="#FF8A65" opacity="0.55" />
      <circle cx="62" cy="49" r="4" fill="#FF8A65" opacity="0.55" />
    </>
  ),
  happy: (
    <>
      <path d="M30 42c2.5-3 6.5-3 9 0" stroke="#1F2A44" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M49 42c2.5-3 6.5-3 9 0" stroke="#1F2A44" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M35 51c4 6 14 6 18 0" stroke="#1F2A44" strokeWidth="3.4" fill="none" strokeLinecap="round" />
    </>
  ),
  celebrate: (
    <>
      <path d="M30 43c2.5-4 6.5-4 9 0" stroke="#1F2A44" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M49 43c2.5-4 6.5-4 9 0" stroke="#1F2A44" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="44" cy="54" rx="8" ry="6.5" fill="#1F2A44" />
      <path d="M40 55c2.5 3 5.5 3 8 0" stroke="#FFE9D6" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  ),
  think: (
    <>
      <circle cx="34" cy="40" r="3.1" fill="#1F2A44" />
      <circle cx="54" cy="40" r="3.1" fill="#1F2A44" />
      <path d="M36 54h14" stroke="#1F2A44" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M62 26c2 0 3.5 1.5 3.5 3.5" stroke="#1F2A44" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  ),
  sleep: (
    <>
      <path d="M30 40c2.5 3 6.5 3 9 0" stroke="#1F2A44" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M49 40c2.5 3 6.5 3 9 0" stroke="#1F2A44" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M37 52c4 3 10 3 14 0" stroke="#1F2A44" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </>
  ),
};

/**
 * «سوليثو» — شخصية المنصة.
 * الرسم في viewBox 88×88 ثابت، والمقاس يتحكم بالعرض فقط.
 */
export function Solecito({
  mood = 'happy',
  size = 120,
  className,
}: {
  mood?: SolecitoMood;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 88 88"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="solecito-face" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#FFD166" />
          <stop offset="62%" stopColor="#FFB020" />
          <stop offset="100%" stopColor="#F58A00" />
        </radialGradient>
      </defs>
      {/* الأشعة */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const x1 = 44 + Math.cos(a) * 33;
        const y1 = 44 + Math.sin(a) * 33;
        const x2 = 44 + Math.cos(a) * 41;
        const y2 = 44 + Math.sin(a) * 41;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FFC43D"
            strokeWidth={i % 2 ? 3 : 4}
            strokeLinecap="round"
            opacity={i % 2 ? 0.75 : 0.95}
          />
        );
      })}
      <circle cx="44" cy="44" r="32" fill="url(#solecito-face)" />
      <circle cx="44" cy="44" r="32" stroke="#E07A00" strokeWidth="1.6" opacity="0.35" />
      <circle cx="30" cy="26" r="8" fill="#FFF6E0" opacity="0.4" />
      {FACE[mood]}
    </svg>
  );
}

/**
 * مشاهد الوحدات: لوحات مسطّحة بسيطة تدل على سياق الدرس (سفر، مقهى، مكالمات،
 * حروف، قواعد، مراجعة). تُستخدم كخلفية رأس الوحدة بدل صور فوتوغرافية ثقيلة.
 */
export type SceneKind = 'sounds' | 'cafe' | 'travel' | 'work' | 'daily' | 'grammar' | 'review' | 'vocab' | 'default';

const SCENES: Record<SceneKind, { bg: string; fg: string; art: ReactNode }> = {
  sounds: {
    bg: '#FFF1DC',
    fg: '#C2620A',
    art: (
      <>
        <text x="55" y="72" fontSize="46" fontWeight="800" fill="#C2620A" fontFamily="Cairo, sans-serif">A</text>
        <text x="94" y="86" fontSize="32" fontWeight="800" fill="#E08A2E" fontFamily="Cairo, sans-serif">ñ</text>
        <circle cx="30" cy="34" r="9" fill="#FFC43D" />
      </>
    ),
  },
  cafe: {
    bg: '#FFEFE6',
    fg: '#B3402A',
    art: (
      <>
        <rect x="34" y="54" width="54" height="34" rx="8" fill="#fff" stroke="#E8B9A6" strokeWidth="2" />
        <path d="M40 54h30v-6a8 8 0 0 0-8-8H48a8 8 0 0 0-8 8v6Z" fill="#F45B35" />
        <path d="M70 62h6a7 7 0 0 1 0 14h-6" stroke="#E8B9A6" strokeWidth="3" fill="none" />
        <path d="M46 26c3-6 9-6 12 0" stroke="#E08A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M56 20c3-6 9-6 12 0" stroke="#E08A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  travel: {
    bg: '#EAF2FF',
    fg: '#1C5FC0',
    art: (
      <>
        <path d="M22 78 96 30l-18 50-22-16-14 18 2-20-22-14Z" fill="#2F80ED" opacity="0.92" />
        <circle cx="34" cy="30" r="10" fill="#FFC43D" />
        <path d="M18 62c10 4 20 4 30 0" stroke="#9CC3FF" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  work: {
    bg: '#EAF7F2',
    fg: '#0E7A55',
    art: (
      <>
        <rect x="26" y="46" width="40" height="42" rx="8" fill="#0E9E6A" />
        <rect x="34" y="38" width="24" height="10" rx="4" fill="#0E7A55" />
        <rect x="34" y="58" width="24" height="4" rx="2" fill="#D8F5E7" />
        <rect x="34" y="68" width="16" height="4" rx="2" fill="#D8F5E7" />
        <path d="M70 30c8 0 14 6 14 14v6" stroke="#0E9E6A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="84" cy="58" r="6" fill="#FFC43D" />
      </>
    ),
  },
  daily: {
    bg: '#FFF4F6',
    fg: '#B3335A',
    art: (
      <>
        <rect x="26" y="34" width="60" height="46" rx="10" fill="#fff" stroke="#F0C6CF" strokeWidth="2" />
        <path d="M26 46h60" stroke="#F0C6CF" strokeWidth="2" />
        <circle cx="38" cy="40" r="3" fill="#F45B35" />
        <path d="M42 60h28M42 70h18" stroke="#B3335A" strokeWidth="4" strokeLinecap="round" />
        <circle cx="86" cy="26" r="8" fill="#FFC43D" />
      </>
    ),
  },
  grammar: {
    bg: '#F2EEFF',
    fg: '#5636B8',
    art: (
      <>
        <rect x="28" y="30" width="56" height="56" rx="12" fill="#fff" stroke="#D5C8FF" strokeWidth="2" />
        <path d="M40 74 78 34" stroke="#7C4DFF" strokeWidth="4" strokeLinecap="round" />
        <path d="M60 34h18v18" stroke="#D5C8FF" strokeWidth="3" fill="none" />
        <circle cx="30" cy="24" r="7" fill="#FFC43D" />
      </>
    ),
  },
  review: {
    bg: '#EAF7F2',
    fg: '#0E7A55',
    art: (
      <>
        <rect x="26" y="40" width="44" height="44" rx="10" fill="#fff" stroke="#B8E3CD" strokeWidth="2" />
        <rect x="36" y="32" width="44" height="44" rx="10" fill="#D8F5E7" stroke="#B8E3CD" strokeWidth="2" />
        <path d="M48 54l7 7 12-14" stroke="#0E9E6A" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  vocab: {
    bg: '#FFF7E3',
    fg: '#8A5A00',
    art: (
      <>
        <rect x="30" y="34" width="34" height="46" rx="6" fill="#FFE3AE" />
        <rect x="38" y="44" width="34" height="46" rx="6" fill="#FFC43D" />
        <rect x="46" y="54" width="34" height="46" rx="6" fill="#F45B35" />
        <path d="M56 68h14M56 78h10" stroke="#FFF3E8" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  default: {
    bg: '#FFF1DC',
    fg: '#C2620A',
    art: (
      <>
        <circle cx="60" cy="56" r="24" fill="#FFC43D" />
        <path d="M30 82c10-14 20-20 30-20" stroke="#F45B35" strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    ),
  },
};

/** حدّد نوع المشهد من عنوان الوحدة/البرنامج ولونه */
export function sceneFor(text: string): SceneKind {
  const t = text.toLowerCase();
  if (t.includes('كول') || t.includes('call') || t.includes('عمل') || t.includes('مهن')) return 'work';
  if (t.includes('سفر') || t.includes('travel') || t.includes('viaje')) return 'travel';
  if (t.includes('طعام') || t.includes('مطعم') || t.includes('مقهى') || t.includes('comida') || t.includes('café')) return 'cafe';
  if (t.includes('حرف') || t.includes('صوت') || t.includes('أبجد') || t.includes('sounds')) return 'sounds';
  if (t.includes('قواعد') || t.includes('نحو') || t.includes('gram')) return 'grammar';
  if (t.includes('مراجع') || t.includes('review')) return 'review';
  if (t.includes('مفرد') || t.includes('كلم') || t.includes('vocab')) return 'vocab';
  if (t.includes('يومي') || t.includes('حياة') || t.includes('daily') || t.includes('rutina')) return 'daily';
  return 'default';
}

export function SceneIllustration({ kind, className }: { kind: SceneKind; className?: string }) {
  const scene = SCENES[kind] ?? SCENES.default;
  return (
    <svg
      className={className}
      viewBox="0 0 120 110"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block' }}
    >
      <rect width="120" height="110" rx="18" fill={scene.bg} />
      {scene.art}
    </svg>
  );
}

/** زخرفة خلفية للوحات الرئيسية — دوائر ناعمة بلا صور */
export function SoftPattern({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 240" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      <circle cx="330" cy="40" r="90" fill="#FFC43D" opacity="0.18" />
      <circle cx="380" cy="200" r="70" fill="#F45B35" opacity="0.12" />
      <circle cx="40" cy="220" r="80" fill="#2F80ED" opacity="0.08" />
      <path d="M0 190c60-30 120-30 180 0s130 30 220 0" stroke="#F45B35" strokeWidth="2" fill="none" opacity="0.18" />
    </svg>
  );
}

/** أيقونة ميدالية الإنجاز — ألوان المستوى لا صور */
export function MedalIcon({ tier, size = 44 }: { tier: 'bronze' | 'silver' | 'gold'; size?: number }) {
  const c = tier === 'gold' ? ['#FFD166', '#E09B00'] : tier === 'silver' ? ['#E4E9F2', '#9AA7BD'] : ['#FFCFAE', '#C9773F'];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M14 4h20l-6 14H20L14 4Z" fill={c[1]} opacity="0.55" />
      <circle cx="24" cy="30" r="14" fill={c[0]} stroke={c[1]} strokeWidth="2.5" />
      <path d="M24 21l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L24 35.3l-5.6 2.9 1.1-6.2-4.5-4.4 6.2-.9L24 21Z" fill="#fff" opacity="0.92" />
    </svg>
  );
}
