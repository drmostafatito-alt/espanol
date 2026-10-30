import { useEffect, useMemo, useState } from 'react';
import { api, type ProgressPayload } from '../api';
import { useAuth } from '../state';
import { Icon } from '../components/icons';
import { Avatar, ErrorState, LoadingState, ProgressBar, LevelBadge } from '../components/ui';
import { MedalIcon, Solecito } from '../components/Illustrations';

const LEVEL_TITLES: Record<string, string> = {
  PREA1: 'البداية المطلقة',
  A1: 'مبتدئ',
  A2: 'أساسي',
  B1: 'متوسط',
  B2: 'متوسط متقدم',
  C1: 'متقدم',
};

/**
 * الملف الشخصي: التقدم والإنجازات.
 * كل رقم من `/api/me/progress` المحسوب على الخادم — لا أرقام محلية ولا وهمية.
 */
export function Profile({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    api
      .progress()
      .then(setProgress)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'تعذّر تحميل بيانات التقدم.'));
  };
  useEffect(load, []);

  const stats = progress?.stats;
  const achievements = progress?.achievements ?? [];
  const levels = progress?.levels ?? [];
  const earned = useMemo(() => achievements.filter(a => a.earned), [achievements]);
  const nextUp = useMemo(() => achievements.filter(a => !a.earned).slice(0, 3), [achievements]);
  const completed = progress?.totals.lessons_completed ?? 0;
  const total = progress?.totals.lessons_total ?? 0;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  if (!user) return null;

  return (
    <div className="page-stack" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
      <header className="profile-head">
        <Avatar name={user.displayName} email={user.email} large />
        <div style={{ minWidth: 0 }}>
          <h1>{user.displayName || 'متعلم'}</h1>
          <p className="small muted" style={{ margin: 0 }}>
            {user.email} · هدفك اليومي <span className="num">{user.dailyGoalMinutes}</span> دقيقة
          </p>
          <div className="row" style={{ marginTop: 'var(--s-2)', gap: 'var(--s-2)' }}>
            <span className="badge primary">
              <Icon name="graduation" size={14} /> {LEVEL_TITLES[currentLevelCode(levels)] ?? 'مبتدئ'}
            </span>
            <span className="badge success">
              <Icon name="star" size={14} /> <span className="num">{stats?.xp_total ?? 0}</span> XP
            </span>
            <span className="badge navy">
              <Icon name="check-circle" size={14} /> <span className="num">{completed}/{total}</span> درس
            </span>
          </div>
        </div>
        <div className="profile-action row" style={{ gap: 'var(--s-2)' }}>
          <button className="btn secondary sm" onClick={() => navigate('/settings')}>
            <Icon name="settings" size={16} /> الإعدادات
          </button>
          <button className="btn navy sm" onClick={() => navigate('/path')}>
            <Icon name="route" size={16} /> المسار
          </button>
        </div>
      </header>

      {error && <ErrorState title="تعذّر تحميل ملفك" description={error} onRetry={load} />}
      {!error && !progress && <LoadingState text="جارٍ تحميل تقدمك…" />}

      {progress && (
        <>
          <section className="stat-tiles" aria-label="أرقامك الحقيقية">
            <div className="stat-tile">
              <span className="stat-ico"><Icon name="flame" size={22} /></span>
              <b className="num">{stats?.streak_current ?? 0}</b>
              <span>يوم متتالي · أطول سلسلة {stats?.streak_longest ?? 0}</span>
            </div>
            <div className="stat-tile">
              <span className="stat-ico"><Icon name="clock" size={22} /></span>
              <b className="num">{stats?.minutes_total ?? 0}</b>
              <span>دقيقة تعلم إجمالًا</span>
            </div>
            <div className="stat-tile">
              <span className="stat-ico"><Icon name="cards" size={22} /></span>
              <b className="num">{stats?.reviews_done ?? 0}</b>
              <span>مراجعة متباعدة</span>
            </div>
            <div className="stat-tile">
              <span className="stat-ico"><Icon name="gem" size={22} /></span>
              <b className="num">{stats?.words_stable ?? 0}</b>
              <span>كلمة راسخة من {stats?.words_seen ?? 0}</span>
            </div>
          </section>

          <section className="card">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
              <h2 style={{ margin: 0 }}>تقدمك في المنهج</h2>
              <span className="small muted num">{pct}%</span>
            </div>
            <ProgressBar value={pct} label="نسبة إكمال المنهج" height={12} />
            <div className="level-bars" style={{ marginTop: 'var(--s-4)' }}>
              {levels.length === 0 && <p className="small muted">لم يبدأ أي مستوى بعد — ابدأ من درسك التالي.</p>}
              {levels.map(l => {
                const p = l.total ? Math.round((l.completed / l.total) * 100) : 0;
                return (
                  <div className="level-bar-row" key={l.code}>
                    <LevelBadge level={l.code} />
                    <ProgressBar value={p} height={10} label={`تقدم مستوى ${l.code}`} />
                    <span className="num">{l.completed}/{l.total}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
              <h2 style={{ margin: 0 }}>الإنجازات</h2>
              <span className="small muted num">{earned.length}/{achievements.length}</span>
            </div>
            {achievements.length === 0 ? (
              <p className="small muted">تُحسب الإنجازات من نشاطك الفعلي — أكمل درسك الأول ليظهر أول إنجاز.</p>
            ) : (
              <div className="ach-grid">
                {achievements.map(a => (
                  <article className={`ach-card${a.earned ? ' earned' : ' locked'}`} key={a.code}>
                    <span className="ach-medal"><MedalIcon tier={a.tier} size={46} /></span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3>{a.titleAr}</h3>
                      <p>{a.descriptionAr}</p>
                      {!a.earned && (
                        <>
                          <div className="ach-mini-bar"><i style={{ width: `${a.percent}%` }} /></div>
                          <p className="small muted num" style={{ marginTop: 4 }}>{a.current}/{a.target}</p>
                        </>
                      )}
                      {a.earned && (
                        <p className="small" style={{ color: 'var(--color-success-text)', marginTop: 4, fontWeight: 700 }}>
                          <Icon name="check-circle" size={14} /> تم
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {nextUp.length > 0 && (
            <section className="card flat" style={{ display: 'flex', gap: 'var(--s-4)', alignItems: 'center' }}>
              <Solecito mood="wave" size={88} />
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '1.05rem' }}>أقرب إنجاز لك</h2>
                <p className="small muted" style={{ margin: 0 }}>
                  {nextUp[0]!.titleAr} — تحتاج <b className="num">{nextUp[0]!.target}</b> مقابل{' '}
                  <b className="num">{nextUp[0]!.current}</b> الآن.
                </p>
              </div>
              <button className="btn sm navy" style={{ marginInlineStart: 'auto' }} onClick={() => navigate('/learn')}>
                تابع التعلم
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function currentLevelCode(levels: { code: string; completed: number }[]): string {
  const order = ['PREA1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  let best = 'PREA1';
  for (const l of levels) {
    if (l.completed > 0 && order.indexOf(l.code) > order.indexOf(best)) best = l.code;
  }
  return best;
}
