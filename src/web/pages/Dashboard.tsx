import { useEffect, useState } from 'react';
import { api, type ProgressPayload, type ReviewPayload } from '../api';
import { useAuth } from '../state';
import { AudioDemo } from '../components/AudioDemo';

interface PathRow {
  slug: string;
  title_ar: string;
  kind: string;
  level_code: string | null;
  units_count: number;
  lessons_count: number;
  provenance?: string;
}

export function Dashboard({ navigate }: { navigate: (to: string) => void }) {
  const { user, signOut } = useAuth();
  const [paths, setPaths] = useState<PathRow[] | null>(null);
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewPayload | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([api.paths(), api.progress()])
      .then(([p, pr]) => {
        if (!alive) return;
        setPaths(p.paths);
        setProgress(pr);
        // عدد المراجعات المستحقة — فشله لا يُفشل اللوحة
        api.reviewSession(1).then(r => alive && setReview(r)).catch(() => undefined);
      })
      .catch(() => {
        if (!alive) return;
        setPaths([]);
        setLoadError('تعذّر تحميل بيانات التقدم. الأرقام أدناه غير معروضة حتى تصل من الخادم.');
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!user) return null;
  const style = { fusha: 'العربية الفصحى', eg: 'العامية المصرية', fusha_eg: 'فصحى + توضيح مصري' }[user.explanationStyle];
  const lessons = progress?.lessons ?? [];
  const provenance = progress?.contentProvenance ?? null;

  return (
    <div className="container">
      <header className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-4)' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>أهلًا{user.displayName ? ` يا ${user.displayName}` : ''} 👋</h1>
          <p className="muted small" style={{ margin: 0 }}>
            أسلوب الشرح: <strong>{style}</strong> · الهدف اليومي: <span className="num">{user.dailyGoalMinutes}</span> دقيقة
          </p>
        </div>
        <div className="row">
          <button className="btn secondary sm" onClick={() => navigate('/settings')}>الإعدادات</button>
          <button className="btn ghost sm" onClick={() => void signOut().then(() => navigate('/'))}>خروج</button>
        </div>
      </header>

      {loadError && <div className="alert" role="alert">{loadError}</div>}

      {provenance && (
        <div className="card banner-warn" role="note" style={{ marginBottom: 'var(--s-4)' }}>
          <strong>محتوى تجريبي غير مراجَع.</strong> {provenance.warningAr} الأرقام أدناه حقيقية ومحفوظة،
          لكن الدروس نفسها عيّنات تعليمية تحتاج مراجعة بشرية قبل أن تُعدّ محتوى نهائيًا.
        </div>
      )}

      <section className="card" style={{ marginBottom: 'var(--s-4)' }} data-testid="review-cta">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 4 }}>المراجعة المتباعدة</h2>
            <p className="small muted" style={{ margin: 0 }}>
              {review === null
                ? 'جارٍ حساب ما هو مستحق…'
                : review.session.totalCards === 0
                  ? 'لا بطاقات بعد — إتمام درس يضيف مفرداته تلقائيًا، أو ابدأ حزمة مفردات.'
                  : `${review.session.dueNow} بطاقة مستحقة الآن · ${review.session.totalCards} بطاقة في مجموعتك`}
            </p>
          </div>
          <div className="row">
            <button className="btn" onClick={() => navigate('/review')} data-testid="review-start">ابدأ المراجعة</button>
            <button className="btn secondary" onClick={() => navigate('/review/packs')}>حزم المفردات</button>
          </div>
        </div>
      </section>

      <div className="grid cols-2">
        <section className="card">
          <h2>حالة تعلّمك</h2>
          {progress === null ? (
            <p className="muted small">جارٍ التحميل من الخادم…</p>
          ) : (
            <>
              <div className="stat-row">
                <div className="stat" data-testid="stat-lessons">
                  <b className="num">{progress.totals.lessons_completed}/{progress.totals.lessons_total}</b>
                  <span>دروس مكتملة</span>
                </div>
                <div className="stat" data-testid="stat-xp"><b className="num">{progress.stats.xp_total}</b><span>إجمالي XP</span></div>
                <div className="stat"><b className="num">{progress.stats.streak_current}</b><span>أيام متتابعة</span></div>
              </div>
              <p className="small muted" style={{ marginTop: 'var(--s-3)', marginBottom: 0 }}>
                كل رقم هنا مقروء من قاعدة البيانات بعد تحقّق الخادم. لا عدّادات محلية ولا نقاط غير محفوظة.
              </p>
            </>
          )}
        </section>

        <section className="card">
          <h2>تدريب النطق</h2>
          <AudioDemo
            text="Quiero un café con leche para llevar, por favor."
            audioKey="pending/a1-cafe-full-order"
            variant={user.audioVariant}
          />
        </section>
      </div>

      <section className="card" style={{ marginTop: 'var(--s-4)' }}>
        <h2>الدروس</h2>
        {progress === null && <p className="muted small">جارٍ التحميل…</p>}
        {progress && lessons.length === 0 && (
          <p className="muted small">لا توجد دروس متاحة بعد في قاعدتك المحلية. شغّل <code>node tools/import-content.mjs</code>.</p>
        )}
        {lessons.map(l => {
          const done = l.progress_status === 'completed';
          return (
            <div className="lesson-row" key={l.slug}>
              <div>
                <div>
                  <strong>{l.title_ar}</strong>{' '}
                  {l.level_code && <span className="badge">{l.level_code}</span>}{' '}
                  {l.status !== 'published' && <span className="badge accent">عينة غير منشورة</span>}{' '}
                  {done && <span className="badge primary">مكتمل {l.best_accuracy}%</span>}
                </div>
                <div className="small muted" style={{ marginTop: 4 }}>
                  {done ? 'أعد الحل لتحسين الدقة — لا نقاط إضافية عند الإعادة.' : l.progress_status === 'in_progress' ? 'بدأته ولم تُكمله' : 'لم يبدأ بعد'}
                </div>
              </div>
              <button className="btn sm" onClick={() => navigate(`/learn/${l.slug}`)}>
                {done ? 'إعادة' : l.progress_status === 'in_progress' ? 'متابعة' : 'ابدأ'}
              </button>
            </div>
          );
        })}
      </section>

      <section className="card" style={{ marginTop: 'var(--s-4)' }}>
        <h2>المسارات</h2>
        {paths === null && <p className="muted small">جارٍ التحميل…</p>}
        {paths && paths.length === 0 && <p className="muted small">لا مسارات منشورة بعد.</p>}
        <ul className="list-plain">
          {(paths ?? []).map(p => (
            <li key={p.slug} className="row" style={{ justifyContent: 'space-between' }}>
              <span>{p.title_ar}</span>
              <span className="row small muted">
                {p.provenance && <span className="badge accent">غير منشور</span>}
                <span className="num">{p.lessons_count}</span> درسًا · <span className="num">{p.units_count}</span> وحدة
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
