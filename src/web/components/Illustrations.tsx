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

/* ==========================================================================
   شخصية كرتونية أصلية — طالب واحد بأشكال موقف مختلفة، بأسلوب مسطّح واحد:
   رأس دائري، ابتسامة، ألوان الهوية نفسها. لا أصول منسوخة ولا شخصيات
   لعلامات أخرى؛ كل شكل مرسوم هنا كودًا.
   ========================================================================== */

export type CartoonKey =
  | 'greet' | 'travel' | 'food' | 'work' | 'daily' | 'feelings'
  | 'celebrate' | 'trophy' | 'study' | 'phone' | 'shopping' | 'home';

/** ربط موضوع موجود (من topicForLesson) بكرتون موقف. */
export function cartoonForTopic(topic: TopicKey): CartoonKey {
  switch (topic) {
    case 'cafe': return 'food';
    case 'travel': return 'travel';
    case 'callcenter': return 'phone';
    case 'home': return 'home';
    case 'shopping': return 'shopping';
    case 'work': return 'work';
    case 'phone': return 'phone';
    case 'greetings': return 'greet';
    case 'daily': return 'daily';
    default: return 'study';
  }
}

/**
 * اختيار كرتون مطابق لموقف السؤال — لا عشوائية أبدًا.
 * يفحص نص السؤال الظاهر نفسه (التعليمة + الجملة الإسبانية + عنوان الدرس)
 * بكلمات عربية وإسبانية، ثم يعود إلى موضوع الدرس.
 */
export function cartoonForQuestion(opts: {
  titleAr?: string; instructionAr?: string; stemEs?: string; stemAr?: string; type?: string;
}): CartoonKey {
  const hay = [opts.titleAr, opts.instructionAr, opts.stemEs, opts.stemAr].filter(Boolean).join(' ').toLowerCase();
  const has = (...words: string[]) => words.some(w => hay.includes(w.toLowerCase()));
  if (has('يشعر', 'شعور', 'مزاج', 'سعيد', 'حزين', 'متعب', 'كيف حالك', 'feliz', 'triste', 'cansado', 'emoción', 'cómo estás', 'como estas')) return 'feelings';
  if (has('تحية', 'تعارف', 'تقديم نفس', 'اسمك', 'saludo', 'hola', 'adiós', 'gracias', 'buenos días', 'buenas noches', 'cómo te llamas', 'me llamo', 'presentación')) return 'greet';
  if (has('سفر', 'فندق', 'طائرة', 'مطار', 'حقيبة', 'رحلة', 'viaje', 'hotel', 'aeropuerto', 'avión', 'maleta', 'billete')) return 'travel';
  if (has('مقهى', 'قهوة', 'مطعم', 'طعام', 'أكل', 'ماء', 'café', 'restaurante', 'comida', 'agua', 'vaso', 'desayuno')) return 'food';
  if (has('عمل', 'مهنة', 'مكتب', 'وظيفة', 'trabajo', 'oficina', 'profesión', 'estoy en la oficina')) return 'work';
  if (has('هاتف', 'اتصال', 'مكالمة', 'teléfono', 'llamada', 'llamar')) return 'phone';
  if (has('تسوق', 'متجر', 'ملابس', 'سوق', 'compras', 'tienda', 'ropa')) return 'shopping';
  if (has('منزل', 'بيت', 'غرفة', 'عائلة', 'casa', 'hogar', 'habitación', 'familia')) return 'home';
  if (has('روتين', 'يوم', 'صباح', 'مساء', 'rutina', 'día', 'todos los días', 'mañana')) return 'daily';
  if (opts.type === 'listen_choose' || opts.type === 'speak_with_text' || opts.type === 'speak_free') {
    return cartoonForTopic(topicForLesson({ titleAr: opts.titleAr }));
  }
  return cartoonForTopic(topicForLesson({ titleAr: opts.titleAr }));
}

/**
 * كرتون بطاقة مراجعة — يُبنى فقط من الحقول الظاهرة قبل كشف الإجابة
 * (الكلمة الإسبانية في بطاقة التعرّف، أو السؤال العربي في بطاقة الإنتاج)،
 * حتى لا يلمّح الكرتون نفسه إلى الجواب المخفي.
 */
export function cartoonForReviewCard(opts: {
  headwordEs?: string; promptAr?: string; promptHintAr?: string | null;
}): CartoonKey {
  const hay = [opts.headwordEs, opts.promptAr, opts.promptHintAr].filter(Boolean).join(' ').toLowerCase();
  const has = (...words: string[]) => words.some(w => hay.includes(w.toLowerCase()));
  if (has('feliz', 'triste', 'cansado', 'emoción', 'يشعر', 'شعور', 'مزاج')) return 'feelings';
  if (has('hola', 'adiós', 'gracias', 'buenos días', 'buenas noches', 'تحية', 'تعارف')) return 'greet';
  if (has('viaje', 'hotel', 'aeropuerto', 'avión', 'maleta', 'سفر', 'فندق')) return 'travel';
  if (has('café', 'restaurante', 'comida', 'agua', 'desayuno', 'قهوة', 'طعام', 'مطعم')) return 'food';
  if (has('trabajo', 'oficina', 'profesión', 'عمل', 'مكتب')) return 'work';
  if (has('teléfono', 'llamada', 'llamar', 'هاتف', 'اتصال')) return 'phone';
  if (has('tienda', 'compras', 'ropa', 'تسوق', 'متجر')) return 'shopping';
  if (has('casa', 'hogar', 'habitación', 'familia', 'منزل', 'بيت')) return 'home';
  if (has('rutina', 'día', 'روتين', 'يوم')) return 'daily';
  return 'study';
}

type Pose = 'wave' | 'cheer' | 'normal' | 'hold';

/** جسم الطالب الواحد — نفس الوجه والشعر في كل المشاهد. */
function StudentFigure({ skin = '#e8b48c', shirt = GREEN, pose = 'normal', pack = false, transform }: {
  skin?: string; shirt?: string; pose?: Pose; pack?: boolean; transform?: string;
}) {
  return (
    <g transform={transform}>
      {pack && <rect x="60" y="76" width="16" height="36" rx="8" fill={TERRA} />}
      {/* ذراعان حسب الوضع */}
      {pose === 'wave' && (
        <g fill="none" stroke={shirt} strokeWidth="10" strokeLinecap="round">
          <path d="M128 82 Q148 70 150 50" />
          <path d="M72 82 Q64 100 68 112" />
        </g>
      )}
      {pose === 'cheer' && (
        <g fill="none" stroke={shirt} strokeWidth="10" strokeLinecap="round">
          <path d="M72 82 Q54 64 52 44" />
          <path d="M128 82 Q146 64 148 44" />
        </g>
      )}
      {pose === 'normal' && (
        <g fill="none" stroke={shirt} strokeWidth="10" strokeLinecap="round">
          <path d="M72 82 Q64 100 68 112" />
          <path d="M128 82 Q136 100 132 112" />
        </g>
      )}
      {pose === 'hold' && (
        <g fill="none" stroke={shirt} strokeWidth="10" strokeLinecap="round">
          <path d="M72 82 Q64 100 68 112" />
          <path d="M128 84 Q146 88 148 98" />
        </g>
      )}
      {pose === 'wave' && <circle cx="150" cy="46" r="7" fill={skin} />}
      {pose === 'cheer' && (<><circle cx="50" cy="40" r="7" fill={skin} /><circle cx="150" cy="40" r="7" fill={skin} /></>)}
      {/* جسم ورأس */}
      <path d="M70 118 Q70 72 100 72 Q130 72 130 118 Z" fill={shirt} />
      <circle cx="100" cy="52" r="20" fill={skin} />
      <path d="M80 50 a20 20 0 0 1 40 0 l0-6 a20 20 0 0 0-40 0 Z" fill={INK} />
      <circle cx="93" cy="54" r="2.5" fill={INK} /><circle cx="107" cy="54" r="2.5" fill={INK} />
      {pose === 'cheer'
        ? <path d="M92 58 Q100 70 108 58 Q100 62 92 58 Z" fill="#7a2e2e" />
        : <path d="M92 60 Q100 66 108 60" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />}
    </g>
  );
}

function ConfettiBits() {
  return (
    <g>
      <rect x="18" y="18" width="10" height="6" rx="2" fill={GOLD} transform="rotate(24 23 21)" />
      <rect x="168" y="14" width="10" height="6" rx="2" fill={TERRA} transform="rotate(-20 173 17)" />
      <rect x="150" y="34" width="8" height="8" rx="2" fill={GREEN} transform="rotate(30 154 38)" />
      <rect x="36" y="40" width="8" height="8" rx="2" fill={BLUE} transform="rotate(-15 40 44)" />
      <circle cx="28" cy="66" r="4" fill={TERRA} />
      <circle cx="172" cy="62" r="4" fill={GOLD} />
      <rect x="60" y="12" width="9" height="5" rx="2" fill={GREEN} transform="rotate(12 64 14)" />
      <rect x="128" y="10" width="9" height="5" rx="2" fill={BLUE} transform="rotate(-24 132 12)" />
    </g>
  );
}

function TrophyFigure() {
  return (
    <g>
      <path d="M118 26 h52 v20 a26 26 0 0 1-26 26 a26 26 0 0 1-26-26 Z" fill={GOLD} stroke={INK} strokeWidth="2.5" />
      <path d="M118 32 q-16 2-12 20 q3 12 18 12 M170 32 q16 2 12 20 q-3 12-18 12" fill="none" stroke={INK} strokeWidth="2.5" />
      <path d="M144 72 h-6 l3 18 h12 l3-18 h-6" fill={GOLD} stroke={INK} strokeWidth="2" />
      <rect x="128" y="90" width="32" height="12" rx="4" fill={TERRA} stroke={INK} strokeWidth="2" />
      <path d="M144 34 l4 8 9 1 -6 6 1 9 -8-4 -8 4 1-9 -6-6 9-1 Z" fill="#fff" />
    </g>
  );
}

/** مشهد كرتوني واحد بمقاس موحّد — يُعرض فوق السؤال أو البطاقة أو شاشة النتيجة. */
export function CartoonScene({ cartoon, label }: { cartoon: CartoonKey; label?: string }) {
  const common = { role: 'img' as const, 'aria-label': label ?? undefined, 'aria-hidden': label ? undefined : true };
  const ground = <ellipse cx="100" cy="124" rx="72" ry="7" fill={SAND} />;
  switch (cartoon) {
    case 'greet':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          {ground}
          <StudentFigure pose="wave" />
          <g>
            <rect x="126" y="6" width="68" height="30" rx="15" fill="#fff" stroke={INK} strokeWidth="2" />
            <path d="M140 36 l6 10 8-10" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            <text x="160" y="26" textAnchor="middle" fontSize="16" fontWeight="700" fill={INK} fontFamily="Source Sans 3, sans-serif">¡Hola!</text>
          </g>
        </svg>
      );
    case 'travel':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          <path d="M14 28 Q56 8 100 22" fill="none" stroke={INK} strokeWidth="2.5" strokeDasharray="1 7" strokeLinecap="round" />
          <circle cx="106" cy="22" r="4" fill={GOLD} />
          {ground}
          <StudentFigure pose="normal" pack />
          <g>
            <rect x="140" y="88" width="34" height="32" rx="7" fill={BLUE} />
            <rect x="140" y="100" width="34" height="4" fill="#fff" opacity="0.7" />
            <path d="M148 88 v-8 h18 v8" fill="none" stroke={INK} strokeWidth="3" />
          </g>
        </svg>
      );
    case 'food':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          {ground}
          <StudentFigure pose="hold" shirt={TERRA} />
          <g>
            <ellipse cx="100" cy="118" rx="54" ry="7" fill={SAND} />
            <path d="M150 92 h26 v9 a11 11 0 0 1-11 11 h-4 a11 11 0 0 1-11-11 Z" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <path d="M176 96 h5 a5 5 0 0 1 0 10 h-5" fill="none" stroke={INK} strokeWidth="2.5" />
            <path d="M158 86 c0-4 4-4 4-8" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            <circle cx="46" cy="104" r="12" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle cx="46" cy="104" r="5" fill={GREEN} />
          </g>
        </svg>
      );
    case 'work':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          {ground}
          <StudentFigure pose="normal" shirt={BLUE} />
          <g>
            <rect x="70" y="94" width="60" height="30" rx="6" fill={INK} opacity="0.9" />
            <rect x="76" y="100" width="48" height="18" rx="3" fill="#e7f0f5" />
            <path d="M84 106 h20 M84 112 h14" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" />
            <rect x="62" y="124" width="76" height="4" rx="2" fill={INK} opacity="0.25" />
          </g>
        </svg>
      );
    case 'daily':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          <circle cx="168" cy="26" r="15" fill={GOLD} />
          <path d="M168 6 v-0 M150 26 h-6 M192 26 h-6 M155 13 l-5-5 M181 13 l5-5" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          {ground}
          <StudentFigure pose="normal" shirt={GOLD} />
          <g>
            <circle cx="34" cy="100" r="14" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <path d="M34 100 v-8 M34 100 h6" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );
    case 'feelings':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          {ground}
          <StudentFigure pose="cheer" shirt={TERRA} />
          <g fill={TERRA}>
            <path d="M36 44 c-6-8-18-2-14 7 c2 6 8 10 14 13 c6-3 12-7 14-13 c4-9-8-15-14-7 Z" />
            <path d="M150 36 c-5-7-15-2-12 6 c2 5 7 8 12 11 c5-3 10-6 12-11 c3-8-7-13-12-6 Z" />
          </g>
        </svg>
      );
    case 'celebrate':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          <ConfettiBits />
          {ground}
          <StudentFigure pose="cheer" />
        </svg>
      );
    case 'trophy':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          <ConfettiBits />
          {ground}
          <StudentFigure pose="cheer" shirt={GREEN} transform="translate(-46 26) scale(0.68)" />
          <g transform="translate(8 -4)">
            <TrophyFigure />
          </g>
        </svg>
      );
    case 'phone':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          {ground}
          <StudentFigure pose="hold" shirt={BLUE} />
          <g>
            <rect x="126" y="36" width="16" height="28" rx="5" fill={GREEN} stroke={INK} strokeWidth="2" transform="rotate(12 134 50)" />
            <path d="M150 40 q10 2 12 12 M150 32 q16 3 19 19" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );
    case 'shopping':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          {ground}
          <StudentFigure pose="hold" shirt={TERRA} />
          <g>
            <path d="M146 92 h30 l-4 28 a5 5 0 0 1-5 4 h-16 a5 5 0 0 1-5-4 Z" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <path d="M153 96 v-6 a8 8 0 0 1 16 0 v6" fill="none" stroke={INK} strokeWidth="2.5" />
            <circle cx="161" cy="108" r="5" fill={GOLD} />
          </g>
        </svg>
      );
    case 'home':
      return (
        <svg viewBox="0 0 200 140" {...common}>
          {ground}
          <StudentFigure pose="wave" shirt={GREEN} />
          <g>
            <path d="M140 52 168 30l28 22" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M146 50 v24 h44 V50" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <path d="M160 74 v-12 h16 v12" fill={TERRA} />
            <rect x="150" y="56" width="8" height="8" rx="2" fill={BLUE} />
          </g>
        </svg>
      );
    case 'study':
    default:
      return (
        <svg viewBox="0 0 200 140" {...common}>
          {ground}
          <StudentFigure pose="normal" pack />
          <g>
            <rect x="76" y="94" width="48" height="28" rx="4" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <path d="M100 94 v28" stroke={INK} strokeWidth="2" />
            <path d="M84 102 h12 M108 102 h12 M84 110 h12 M108 110 h12" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );
  }
}
