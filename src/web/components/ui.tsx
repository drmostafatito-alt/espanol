import type { ReactNode } from 'react';

/* ==========================================================================
   مكوّنات مشتركة — أيقونات SVG أصلية (خطية، لون حالي) + عناصر صغيرة.
   لا إيموجي في الواجهة: كل رمز هنا مرسوم كودًا، وله بديل نصي عند الحاجة.
   ========================================================================== */

export type IconName =
  | 'check' | 'x' | 'lock' | 'play' | 'replay' | 'listen' | 'mic' | 'book'
  | 'plane' | 'cup' | 'headset' | 'home' | 'bag' | 'phone' | 'briefcase'
  | 'star' | 'gem' | 'search' | 'settings' | 'logout' | 'arrowL' | 'arrowR'
  | 'eye' | 'eyeOff' | 'target' | 'flame' | 'clock' | 'cap' | 'chat'
  | 'pen' | 'info' | 'warn' | 'checkCircle' | 'chevronDown' | 'globe' | 'sun' | 'trophy';

const PATHS: Record<IconName, ReactNode> = {
  check: <path d="M4 12.5 9.5 18 20 6.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  lock: <><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" /></>,
  play: <path d="M7 4.5v15c0 .9 1 1.5 1.8 1L20 12.8a1.2 1.2 0 0 0 0-2.1L8.8 3.5c-.8-.5-1.8.1-1.8 1Z" />,
  replay: <><path d="M4 9a8 8 0 1 1 2 6" /><path d="M4 4v5h5" /></>,
  listen: <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="12" width="4.5" height="6" rx="2.25" /><rect x="16.5" y="12" width="4.5" height="6" rx="2.25" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" /></>,
  plane: <><path d="M3 11.5 21 3l-6.5 18-2.5-7.5L3 11.5Z" /><path d="M11.5 13.5 21 3" /></>,
  cup: <><path d="M5 9h11v5.5A4.5 4.5 0 0 1 11.5 19h-2A4.5 4.5 0 0 1 5 14.5V9Z" /><path d="M16 10h1.5a2 2 0 0 1 0 4H16" /><path d="M8.5 6.5c0-1 1-1 1-2M12 6.5c0-1 1-1 1-2" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4.5" height="6" rx="2.25" /><rect x="16.5" y="13" width="4.5" height="6" rx="2.25" /><path d="M19 19a3 3 0 0 1-3 3h-2" /></>,
  home: <><path d="M3.5 11 12 4l8.5 7" /><path d="M6 9.5V20h12V9.5" /><path d="M10 20v-5.5h4V20" /></>,
  bag: <><path d="M5 8h14l-1 12.5a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 20.5L5 8Z" /><path d="M9 10V6.5a3 3 0 0 1 6 0V10" /></>,
  phone: <><path d="M7 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5 5L16 12l4 1.5v3a1.5 1.5 0 0 1-1.5 1.5C10 18.5 5.5 14 6 5.5A1.5 1.5 0 0 1 7 3.5Z" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" /></>,
  star: <path d="M12 3.5 14.7 9l6.3.7-4.7 4.2 1.3 6.1L12 16.8 6.4 20l1.3-6.1L3 9.7 9.3 9 12 3.5Z" />,
  gem: <><path d="M6 4h12l3 4.5L12 20 3 8.5 6 4Z" /><path d="M3 8.5h18M9 4l3 4.5L15 4M12 8.5 12 20" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16 21 21" /></>,
  settings: <><circle cx="12" cy="12" r="3.2" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" /></>,
  logout: <><path d="M14 4h-9v16h9" /><path d="M18 8.5 21 12l-3 3.5M21 12H9" /></>,
  arrowL: <><path d="M19 12H5" /><path d="M10 5.5 4.5 12 10 18.5" /></>,
  arrowR: <><path d="M5 12h14" /><path d="M14 5.5 19.5 12 14 18.5" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M2.5 12S6 5.5 12 5.5c2.2 0 4.2.9 5.8 2.3M18.5 8.5C20 10 21.5 12 21.5 12S18 18.5 12 18.5c-1.4 0-2.7-.4-3.9-1" /><path d="M4 4l16 16" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  flame: <path d="M12 3c1 3.5-2.5 5-2.5 8.5a4.5 4.5 0 0 0 9 0c0-2-1-3.5-2-5-.3 1.2-1 2-2 2 .5-2-.5-4-2.5-5.5Z" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  cap: <><path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" /><path d="M6.5 11.5V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.5M21.5 9.5V15" /></>,
  chat: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9L4 20v-14.5Z" /><path d="M8 8h8M8 11.5h5" /></>,
  pen: <><path d="M4 20l1-4L17.5 3.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" /><path d="M14.5 6.5l3 3" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><circle cx="12" cy="7.5" r="1.1" fill="currentColor" stroke="none" /></>,
  warn: <><path d="M12 4 21.5 20h-19L12 4Z" /><path d="M12 10v4" /><circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none" /></>,
  checkCircle: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.5 11 15l4.5-5.5" /></>,
  chevronDown: <path d="M6 9.5 12 15.5 18 9.5" />,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c-2.5 2.5-3.8 5.3-3.8 8.5s1.3 6 3.8 8.5c2.5-2.5 3.8-5.3 3.8-8.5s-1.3-6-3.8-8.5Z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></>,
  trophy: <><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" /><path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4M12 12v3M8 20h8M10 15h4" /></>,
};

export function Icon({ name, size = 20, label, className }: { name: IconName; size?: number; label?: string; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      style={{ flex: 'none' }}
    >
      {PATHS[name]}
    </svg>
  );
}

/* شارة المستوى — لون يساعد المسح البصري دون الاعتماد على اللون وحده (النص موجود دائمًا) */
export function LevelBadge({ level, size = 'md' }: { level: string | null | undefined; size?: 'sm' | 'md' }) {
  if (!level) return null;
  const code = level.toUpperCase();
  const tone = code === 'C1' ? 'gold' : code === 'PREA1' ? 'blue' : 'primary';
  return <span className={`badge ${tone} ${size === 'sm' ? 'sm' : ''}`}>{code}</span>;
}

/* شريط تقدم مع تسمية — نسبة رقمية دائمًا بجانب الشريط (لا لون وحده) */
export function ProgressBar({ value, label, tone = '', showPct = true }: { value: number; label?: string; tone?: 'gold' | 'blue' | ''; showPct?: boolean }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      {(label || showPct) && (
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-1)' }}>
          {label ? <span className="small" style={{ fontWeight: 700 }}>{label}</span> : <span />}
          {showPct && <span className="small muted num">{pct}%</span>}
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'تقدم'}>
        <div className={`progress-fill ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* عنوان قسم: تمهيد + عنوان + وصف + إجراء اختياري */
export function SectionHead({ kicker, title, desc, action }: { kicker?: string; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="section-head">
      <div>
        {kicker && <span className="kicker">{kicker}</span>}
        <h2>{title}</h2>
        {desc && <p className="muted">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

/* حالة فراغ صادقة: لا بيانات وهمية، بل وصف وزر حقيقي */
export function EmptyState({ title, desc, action }: { title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{desc}</p>
      {action && <div style={{ marginTop: 'var(--s-4)' }}>{action}</div>}
    </div>
  );
}

/* رقائق أرقام حقيقية: XP من الخادم، جواهر مشتقة ومعلنة كذلك في لوحة المتعلم */
export function XpChip({ xp }: { xp: number }) {
  return <span className="xp-chip"><Icon name="star" size={16} /><span className="num">{xp} XP</span></span>;
}
export function GemChip({ gems }: { gems: number }) {
  return <span className="gem-chip"><Icon name="gem" size={16} /><span className="num">{gems}</span></span>;
}
/* شريحة السلسلة: أيام متتابعة من الخادم فقط (لا رقم افتراضي) */
export function StreakChip({ days }: { days: number }) {
  return <span className="streak-chip"><Icon name="flame" size={16} /><span className="num">{days}</span> يوم متتالٍ</span>;
}

/* حلقة مستوى SVG: نسبة من بيانات حقيقية تُمرَّر من لوحة المتعلم.
   code اختياري (رمز المستوى الحالي)؛ بدونه تُعرض النسبة وحدها في المنتصف. */
export function LevelRing({ pct, code, label }: { pct: number; code?: string | null; label?: string }) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (p / 100) * c;
  return (
    <div className="level-ring-wrap">
      <div className="level-ring" role="img" aria-label={label ?? `تقدم ${p}%`}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e9dcc2" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={r} fill="none" stroke="#16a34a" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`} strokeDashoffset={0}
          />
        </svg>
        <div className="level-ring-center">
          {code ? <span className="level-ring-code" dir="ltr">{code}</span> : null}
          <span className="level-ring-pct num">{p}%</span>
          <span className="small muted">{code ? 'مكتمل' : 'من المنهج'}</span>
        </div>
      </div>
      {label ? <span className="small muted" style={{ maxWidth: '24ch' }}>{label}</span> : null}
    </div>
  );
}
