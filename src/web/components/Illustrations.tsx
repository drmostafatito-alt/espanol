/* ==========================================================================
   رسوم تعليمية أصلية — مرسومة كودًا بـ SVG، بلا صور خارجية ولا أصول محمية.
   أسلوب مسطّح دافئ: أشكال هندسية بسيطة بألوان الهوية (أخضر، تراكوتا،
   ذهبي، أزرق هادئ). الكلمات الإسبانية داخل المشاهد زينة فقط؛ المحتوى
   الأساسي دائمًا نص حقيقي خارج الصورة.
   ========================================================================== */

export type TopicKey =
  | 'cafe' | 'travel' | 'callcenter' | 'home' | 'shopping' | 'work'
  | 'phone' | 'greetings' | 'daily' | 'default';

/** ربط موضوع الدرس بالأصل البصري — مطابقة كلمات من العناوين نفسها. */
export function topicForLesson(opts: {
  titleAr?: string; unitTitleAr?: string; programTitleAr?: string; programSlug?: string;
}): TopicKey {
  const hay = [opts.titleAr, opts.unitTitleAr, opts.programTitleAr, opts.programSlug].filter(Boolean).join(' ');
  const has = (...words: string[]) => words.some(w => hay.includes(w));
  if (opts.programSlug === 'travel' || has('سفر', 'فندق', 'طائرة', 'مطار', 'travel', 'viaje', 'hotel', 'aeropuerto')) return 'travel';
  if (opts.programSlug === 'callcenter' || has('كول سنتر', 'خدمة العملاء', 'callcenter', 'atención', 'cliente')) return 'callcenter';
  if (has('مقهى', 'قهوة', 'مطعم', 'طعام', 'café', 'restaurante', 'comida')) return 'cafe';
  if (has('منزل', 'بيت', 'غرفة', 'casa', 'hogar', 'habitación')) return 'home';
  if (has('تسوق', 'متجر', 'ملابس', 'سوق', 'compras', 'tienda', 'ropa')) return 'shopping';
  if (has('عمل', 'مهنة', 'مكتب', 'وظيفة', 'trabajo', 'oficina', 'profesión')) return 'work';
  if (has('هاتف', 'اتصال', 'مكالمة', 'teléfono', 'llamada')) return 'phone';
  if (has('تحية', 'تعارف', 'تقديم', 'saludo', 'hola', 'presentación')) return 'greetings';
  if (has('يوم', 'روتين', 'حياة', 'rutina', 'día')) return 'daily';
  return 'default';
}

const INK = '#221d16';
const GREEN = '#1e7a5c';
const TERRA = '#c96f4a';
const GOLD = '#e3a82b';
const BLUE = '#2f6b8a';
const SAND = '#f4eee1';

/** مشهد البطل: متعلّم عربي يتحدث مع صديق إسباني في مقهى. */
export function HeroScene({ label = 'مشهد تعلّم في مقهى: شخصان يتحادثان بالإسبانية' }: { label?: string }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label}>
      {/* نافذة مقوّسة وشمس */}
      <rect x="28" y="24" width="150" height="180" rx="75" fill="#e7f0f5" />
      <circle cx="130" cy="70" r="26" fill={GOLD} opacity="0.85" />
      <path d="M40 150 Q103 110 166 150" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      {/* نبتة */}
      <path d="M330 200 Q330 160 310 145 M330 200 Q330 155 350 140" fill="none" stroke={GREEN} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="330" cy="206" rx="26" ry="8" fill={TERRA} opacity="0.35" />
      {/* طاولة */}
      <ellipse cx="200" cy="238" rx="150" ry="16" fill={SAND} />
      <rect x="196" y="238" width="8" height="42" fill={INK} opacity="0.15" />
      {/* فنجانا قهوة */}
      <g>
        <path d="M138 196 h44 v14 a16 16 0 0 1-16 16 h-12 a16 16 0 0 1-16-16 Z" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <path d="M182 202 h8 a7 7 0 0 1 0 14 h-8" fill="none" stroke={INK} strokeWidth="2.5" />
        <path d="M150 190 c0-4 4-4 4-8 M166 190 c0-4 4-4 4-8" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </g>
      <g>
        <path d="M232 196 h44 v14 a16 16 0 0 1-16 16 h-12 a16 16 0 0 1-16-16 Z" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <path d="M276 202 h8 a7 7 0 0 1 0 14 h-8" fill="none" stroke={INK} strokeWidth="2.5" />
        <path d="M244 190 c0-4 4-4 4-8 M260 190 c0-4 4-4 4-8" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </g>
      {/* الشخصية 1: المتعلّم */}
      <g>
        <circle cx="150" cy="118" r="30" fill="#e8b48c" />
        <path d="M120 112 a30 30 0 0 1 60 0 l0-8 a30 30 0 0 0-60 0 Z" fill={INK} />
        <circle cx="141" cy="120" r="3" fill={INK} /><circle cx="159" cy="120" r="3" fill={INK} />
        <path d="M142 132 Q150 138 158 132" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M104 236 Q104 178 150 178 Q196 178 196 236 Z" fill={GREEN} />
      </g>
      {/* الشخصية 2: الصديق الإسباني */}
      <g>
        <circle cx="262" cy="118" r="30" fill="#f2cfa8" />
        <path d="M232 106 a30 30 0 0 1 60 4 l-4 10 q-12-12-28-8 q-16 2-24 10 Z" fill="#7a4a26" />
        <circle cx="253" cy="120" r="3" fill={INK} /><circle cx="271" cy="120" r="3" fill={INK} />
        <path d="M254 132 Q262 138 270 132" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M216 236 Q216 178 262 178 Q308 178 308 236 Z" fill={TERRA} />
      </g>
      {/* فقاعتا حوار */}
      <g>
        <rect x="88" y="24" width="104" height="38" rx="19" fill="#fff" stroke={INK} strokeWidth="2" />
        <path d="M120 62 l8 14 10-14" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <text x="140" y="48" textAnchor="middle" fontSize="19" fontWeight="700" fill={INK} fontFamily="Source Sans 3, sans-serif">¡Hola!</text>
      </g>
      <g>
        <rect x="216" y="18" width="150" height="38" rx="19" fill={GREEN} />
        <path d="M272 56 l8 14 10-14" fill={GREEN} />
        <text x="291" y="42" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff" fontFamily="Source Sans 3, sans-serif">Quiero un café</text>
      </g>
    </svg>
  );
}

/** مشاهد مواضيع صغيرة — تُستخدم بجانب العناوين والبطاقات. */
export function TopicScene({ topic, label }: { topic: TopicKey; label?: string }) {
  const common = { role: 'img' as const, 'aria-label': label ?? undefined, 'aria-hidden': label ? undefined : true };
  switch (topic) {
    case 'cafe':
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#fbf0d3" />
          <path d="M34 52 h44 v18 a18 18 0 0 1-18 18 h-8 a18 18 0 0 1-18-18 Z" fill="#fff" stroke={INK} strokeWidth="3" />
          <path d="M78 58 h6 a8 8 0 0 1 0 16 h-6" fill="none" stroke={INK} strokeWidth="3" />
          <path d="M46 44 c0-5 5-5 5-10 M62 44 c0-5 5-5 5-10" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case 'travel':
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#e7f0f5" />
          <rect x="34" y="48" width="52" height="44" rx="8" fill={BLUE} />
          <rect x="34" y="62" width="52" height="5" fill="#fff" opacity="0.7" />
          <path d="M48 48 v-8 h24 v8" fill="none" stroke={INK} strokeWidth="3" />
          <circle cx="60" cy="34" r="4" fill={GOLD} />
          <path d="M22 30 Q40 18 58 26" fill="none" stroke={INK} strokeWidth="2.5" strokeDasharray="1 6" strokeLinecap="round" />
        </svg>
      );
    case 'callcenter':
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#e3f1e9" />
          <path d="M26 66 v-6 a34 34 0 0 1 68 0 v6" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <rect x="22" y="62" width="14" height="22" rx="7" fill={GREEN} />
          <rect x="84" y="62" width="14" height="22" rx="7" fill={GREEN} />
          <path d="M90 84 a10 10 0 0 1-10 10 h-8" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="70" cy="94" r="5" fill={INK} />
        </svg>
      );
    case 'home':
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#fbf0d3" />
          <path d="M26 62 60 32l34 30" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 58 v30 h48 V58" fill="#fff" stroke={INK} strokeWidth="3" />
          <path d="M52 88 v-16 h16 v16" fill={TERRA} />
          <rect x="42" y="64" width="10" height="10" rx="2" fill={BLUE} />
        </svg>
      );
    case 'shopping':
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#e3f1e9" />
          <path d="M34 48 h52 l-5 44 a6 6 0 0 1-6 5 H45 a6 6 0 0 1-6-5 Z" fill="#fff" stroke={INK} strokeWidth="3" />
          <path d="M46 56 V44 a14 14 0 0 1 28 0 v12" fill="none" stroke={INK} strokeWidth="3" />
          <circle cx="60" cy="74" r="7" fill={GOLD} />
        </svg>
      );
    case 'work':
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#e7f0f5" />
          <rect x="28" y="46" width="64" height="46" rx="8" fill={BLUE} />
          <path d="M46 46 v-8 a14 14 0 0 1 28 0 v8" fill="none" stroke={INK} strokeWidth="3.5" />
          <path d="M28 62 h64" stroke="#fff" strokeWidth="3" opacity="0.7" />
        </svg>
      );
    case 'phone':
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#e3f1e9" />
          <path d="M44 28 h10 l4 14 -6 5 a28 28 0 0 0 13 13 l5-6 14 4 v10 a6 6 0 0 1-6 6 C55 88 32 65 34 42 a6 6 0 0 1 6-6 Z" fill={GREEN} />
          <path d="M84 34 q10 2 12 12 M84 26 q16 3 19 19" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'greetings':
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#fbf0d3" />
          <circle cx="44" cy="52" r="15" fill="#e8b48c" />
          <circle cx="78" cy="52" r="15" fill="#f2cfa8" />
          <path d="M28 92 Q28 72 44 72 Q60 72 60 92 Z" fill={GREEN} />
          <path d="M62 92 Q62 72 78 72 Q94 72 94 92 Z" fill={TERRA} />
          <rect x="44" y="26" width="34" height="18" rx="9" fill="#fff" stroke={INK} strokeWidth="2" />
          <text x="61" y="39" textAnchor="middle" fontSize="11" fontWeight="700" fill={INK} fontFamily="Source Sans 3, sans-serif">¡Hola!</text>
        </svg>
      );
    case 'daily':
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#fbf0d3" />
          <circle cx="60" cy="52" r="20" fill={GOLD} />
          <path d="M60 32 v-8 M60 72 v-8 M40 52 h-8 M88 52 h-8 M46 38 l-6-6 M74 38 l6-6" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <path d="M30 88 h60" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
          <circle cx="44" cy="88" r="4" fill={GREEN} /><circle cx="60" cy="88" r="4" fill={TERRA} /><circle cx="76" cy="88" r="4" fill={BLUE} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 120" {...common}>
          <circle cx="60" cy="60" r="54" fill="#e7f0f5" />
          <path d="M28 36 a10 10 0 0 1 10-10 h44 a10 10 0 0 1 10 10 v26 a10 10 0 0 1-10 10 H52 l-16 16 V36 Z" fill="#fff" stroke={INK} strokeWidth="3" />
          <path d="M40 46 h36 M40 58 h24" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
  }
}
