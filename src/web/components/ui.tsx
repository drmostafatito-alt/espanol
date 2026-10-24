import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from './icons';

/* ---------------- شريط التقدم ---------------- */
export function ProgressBar({ value, label, height = 10 }: { value: number; label?: string; height?: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className="progress-track"
      style={{ height }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'نسبة التقدم'}
    >
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------------- حلقة التقدم الدائرية ---------------- */
export function ProgressRing({
  value,
  centerTop,
  centerBottom,
  size = 128,
}: {
  value: number;
  centerTop: ReactNode;
  centerBottom?: ReactNode;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="ring" style={{ ['--p' as string]: pct, width: size, height: size }} role="img" aria-label={`التقدم ${pct}%`}>
      <div className="ring-inner" style={{ width: size - 28, height: size - 28 }}>
        <b>{centerTop}</b>
        {centerBottom ? <span>{centerBottom}</span> : null}
      </div>
    </div>
  );
}

/* ---------------- شارة المستوى ---------------- */
const LEVEL_STYLE: Record<string, string> = {
  PREA1: 'navy', A1: 'info', A2: 'success', B1: 'accent', B2: 'accent', B3: 'accent', C1: 'primary', C2: 'primary',
};
export function LevelBadge({ level }: { level: string | null | undefined }) {
  if (!level) return null;
  const cls = LEVEL_STYLE[level.toUpperCase()] ?? 'navy';
  return <span className={`badge ${cls}`}>{level.toUpperCase()}</span>;
}

/* ---------------- صورة الحساب ---------------- */
export function Avatar({ name, email, large }: { name: string | null; email: string; large?: boolean }) {
  const initials = (name?.trim() || email.trim())
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');
  return <span className={`avatar${large ? ' lg' : ''}`} aria-hidden="true">{initials}</span>;
}

/* ---------------- صورة بمعالجة فشل التحميل ---------------- */
export function SafeImage({
  src,
  alt,
  className,
  loading = 'lazy',
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={className} style={{ display: 'grid', placeItems: 'center', background: 'var(--color-surface-3)', color: 'var(--color-muted)' }}>
        <Icon name="image-off" size={28} />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading={loading} onError={() => setFailed(true)} />;
}

/* ---------------- حالات الصفحة ---------------- */
export function LoadingState({ text = 'جارٍ التحميل…' }: { text?: string }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" />
      <p className="muted" style={{ margin: 0 }}>{text}</p>
    </div>
  );
}

export function EmptyState({
  icon = 'sparkles',
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="state-box">
      <div className="state-icon"><Icon name={icon} size={30} /></div>
      <h3 style={{ marginBottom: 'var(--s-2)' }}>{title}</h3>
      {description ? <p className="muted small" style={{ margin: '0 auto', maxWidth: '46ch' }}>{description}</p> : null}
      {action ? <div style={{ marginTop: 'var(--s-4)' }}>{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = 'تعذّر تحميل البيانات',
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="state-box" role="alert">
      <div className="state-icon" style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger)' }}>
        <Icon name="refresh" size={30} />
      </div>
      <h3 style={{ marginBottom: 'var(--s-2)' }}>{title}</h3>
      {description ? <p className="muted small">{description}</p> : null}
      {onRetry ? (
        <button className="btn" style={{ marginTop: 'var(--s-3)' }} onClick={onRetry}>
          <Icon name="refresh" size={18} /> أعد المحاولة
        </button>
      ) : null}
    </div>
  );
}

/* ---------------- عنوان قسم ---------------- */
export function SectionHeading({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-head">
      <h2 style={{ margin: 0 }}>{children}</h2>
      {action}
    </div>
  );
}
