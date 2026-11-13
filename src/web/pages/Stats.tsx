import { useEffect, useState } from 'react';
import { api, type ProgressPayload } from '../api';
import { useAuth } from '../state';
import { Icon } from '../components/icons';
import { MedalIcon } from '../components/Illustrations';
import { ErrorState, LevelBadge, LoadingState, ProgressBar } from '../components/ui';

export function Stats({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    api
      .progress()
      .then(setProgress)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'تعذّر تحميل الإحصائيات.'));
  };

  useEffect(load, []);

  if (!user) return null;

  const stats = progress?.stats;
  const week = progress?.week ?? [];
  const levels = progress?.levels ?? [];
  const achievements = progress?.achievements ?? [];
  const earnedCount = achievements.filter(a => a.earned).length;
  const maxWeekXp = Math.max(...week.map(d => d.xp), 30);

  return (
    <div className="hub-page">
      <header className="hub-hero">
        <div>
          <span className="continue-eyebrow">
            <Icon name="trophy" size={14} /> تحليلات الأداء الفعلية
          </span>
          <h1>الإحصائيات والتقدّم</h1>
          <p className="muted">
            كل رقم هنا محسوب من محاولاتك ودروسك ومراجعاتك المسجّلة على الخادم — لا أرقام تقديرية.
          </p>
        </div>
        <div className="hub-hero-actions">
          <button type="button" className="btn secondary" onClick={() => navigate('/vocabulary')}>
            <Icon name="book" size={16} /> تفاصيل المفردات
          </button>
          <button type="button" className="btn navy" onClick={() => navigate('/path')}>
            <Icon name="route" size={16} /> مسار التعلم
          </button>
        </div>
      </header>

      {error && <ErrorState title="تعذّر تحميل الإحصائيات" description={error} onRetry={load} />}
      {!error && !progress && <LoadingState text="جارٍ حساب إحصائياتك…" />}

      {progress && (
        <>
          <section className="stat-tiles" aria-label="المؤشرات الرئيسية">
            <div className="stat-tile">
              <span className="stat-ico"><Icon name="star" size={22} /></span>
              <b className="num">{stats?.xp_total ?? 0}</b>
              <span>إجمالي نقاط XP</span>
            </div>
            <div className="stat-tile">
              <span className="stat-ico"><Icon name="target" size={22} /></span>
              <b className="num">
                {stats?.accuracy_avg !== null && stats?.accuracy_avg !== undefined ? `${stats.accuracy_avg}%` : '—'}
              </b>
              <span>دقة التمارين ({stats?.attempts_total ?? 0} محاولة)</span>
            </div>
            <div className="stat-tile">
              <span className="stat-ico"><Icon name="flame" size={22} /></span>
              <b className="num">{stats?.streak_current ?? 0}</b>
              <span>أيام متتالية · الأطول {stats?.streak_longest ?? 0}</span>
            </div>
            <div className="stat-tile">
              <span className="stat-ico"><Icon name="clock" size={22} /></span>
              <b className="num">{stats?.minutes_total ?? 0}</b>
              <span>دقيقة تعلم مسجّلة</span>
            </div>
          </section>

          <div className="dash-columns">
            <section className="card">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
                <h2 style={{ margin: 0 }}>النشاط الأسبوعي (XP / دقائق)</h2>
                <span className="small muted">آخر 7 أيام</span>
              </div>
              <div className="week-strip">
                {week.map((day, idx) => {
                  const h = Math.max(8, Math.round((day.xp / maxWeekXp) * 100));
                  const isToday = idx === week.length - 1;
                  return (
                    <div className={`week-day${isToday ? ' today' : ''}`} key={day.date}>
                      <span className="small muted num" style={{ fontSize: '0.72rem' }}>{day.xp > 0 ? day.xp : ''}</span>
                      <div className={`week-bar${day.xp === 0 && day.minutes === 0 ? ' idle' : ''}`} title={`${day.xp} XP · ${day.minutes} دقيقة · ${day.lessons} دروس · ${day.reviews} مراجعة`}>
                        <i style={{ height: `${day.xp === 0 ? 6 : h}%` }} />
                      </div>
                      <small>{isToday ? 'اليوم' : day.date.slice(5)}</small>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="card">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
                <h2 style={{ margin: 0 }}>حالة الذاكرة والمراجعة</h2>
                <span className="small muted num">{progress.review?.total ?? 0} بطاقة</span>
              </div>
              <div className="stats-kv-list">
                <div className="stats-kv"><span>مستحقة الآن</span><b className="num">{progress.review?.dueNow ?? 0}</b></div>
                <div className="stats-kv"><span>متقنة (≥ 21 يومًا)</span><b className="num">{progress.review?.masteredCount ?? stats?.words_stable ?? 0}</b></div>
                <div className="stats-kv"><span>مألوفة (3–20 يومًا)</span><b className="num">{progress.review?.familiarCount ?? 0}</b></div>
                <div className="stats-kv"><span>قيد التعلّم</span><b className="num">{progress.review?.learningCount ?? 0}</b></div>
                <div className="stats-kv"><span>تحتاج تركيزًا (متعثرة)</span><b className="num">{progress.review?.weakCount ?? 0}</b></div>
              </div>
              {(progress.review?.weakCount ?? 0) > 0 && (
                <button type="button" className="btn secondary sm" style={{ marginTop: 'var(--s-3)' }} onClick={() => navigate('/review?mode=weak')}>
                  درّب الكلمات المتعثرة
                </button>
              )}
            </section>
          </div>

          <section className="card">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
              <h2 style={{ margin: 0 }}>تقدّم مستويات CEFR</h2>
              <span className="small muted num">{progress.totals.lessons_completed}/{progress.totals.lessons_total} درسًا</span>
            </div>
            <div className="level-bars">
              {levels.map(lv => {
                const p = lv.total ? Math.round((lv.completed / lv.total) * 100) : 0;
                return (
                  <div className="level-bar-row" key={lv.code}>
                    <LevelBadge level={lv.code} />
                    <ProgressBar value={p} height={10} label={`مستوى ${lv.code}`} />
                    <span className="num">{lv.completed}/{lv.total} ({p}%)</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
              <h2 style={{ margin: 0 }}>الإنجازات المكتسبة</h2>
              <span className="small muted num">{earnedCount}/{achievements.length}</span>
            </div>
            <div className="ach-grid">
              {achievements.map(a => (
                <article className={`ach-card${a.earned ? ' earned' : ' locked'}`} key={a.code}>
                  <span className="ach-medal"><MedalIcon tier={a.tier} size={42} /></span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3>{a.titleAr}</h3>
                    <p>{a.descriptionAr}</p>
                    <div className="ach-mini-bar"><i style={{ width: `${a.percent}%` }} /></div>
                    <p className="small muted num" style={{ marginTop: 4 }}>{a.current}/{a.target}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
