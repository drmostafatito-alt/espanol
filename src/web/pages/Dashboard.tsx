import { useEffect, useState } from 'react';
import { api, type ProgressPayload, type ReviewPayload, type ProgressLessonItem } from '../api';
import { useAuth } from '../state';

interface PathRow {
  slug: string;
  title_ar: string;
  kind: string;
  level_code: string | null;
  units_count: number;
  lessons_count: number;
}

export function Dashboard({ navigate }: { navigate: (to: string) => void }) {
  const { user, signOut } = useAuth();
  const [paths, setPaths] = useState<PathRow[] | null>(null);
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewPayload | null>(null);
  const [reviewError, setReviewError] = useState(false);
  const [pathsError, setPathsError] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('ALL');

  function loadReview() {
    setReviewError(false);
    api.reviewSession(1).then(r => setReview(r)).catch(() => setReviewError(true));
  }

  useEffect(() => {
    let alive = true;
    Promise.all([api.paths(), api.progress()])
      .then(([p, pr]) => {
        if (!alive) return;
        setPaths(p.paths);
        setProgress(pr);
        loadReview();
      })
      .catch(() => {
        if (!alive) return;
        setPathsError(true);
        setLoadError('تعذّر تحميل بيانات التقدم. الأرقام أدناه غير معروضة حتى تصل من الخادم.');
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!user) return null;
  const style = { fusha: 'العربية الفصحى فقط', eg: 'العامية المصرية', fusha_eg: 'فصحى + توضيح مصري' }[user.explanationStyle];
  const lessons = progress?.lessons ?? [];
  const completedLessons = progress?.totals.lessons_completed ?? 0;

  const filteredLessons = lessons.filter(l => {
    if (selectedTab === 'ALL') return true;
    if (selectedTab === 'travel') return l.program_slug === 'travel';
    if (selectedTab === 'callcenter') return l.program_slug === 'callcenter';
    return (l.level_code ?? '').toUpperCase() === selectedTab;
  });

  // تجميع الدروس حسب الوحدات
  const unitGroups: {
    unitId: string;
    unitTitle: string;
    levelCode: string | null;
    programTitle?: string;
    lessons: ProgressLessonItem[];
    completedCount: number;
  }[] = [];

  const unitMap = new Map<string, typeof unitGroups[0]>();
  for (const l of filteredLessons) {
    const uKey = l.unit_id || l.unit_slug || 'misc';
    if (!unitMap.has(uKey)) {
      const g = {
        unitId: uKey,
        unitTitle: l.unit_title_ar || 'وحدة تعليمية',
        levelCode: l.level_code,
        programTitle: l.program_title_ar,
        lessons: [],
        completedCount: 0,
      };
      unitMap.set(uKey, g);
      unitGroups.push(g);
    }
    const group = unitMap.get(uKey)!;
    group.lessons.push(l);
    if (l.progress_status === 'completed') group.completedCount++;
  }

  const nextLesson = progress?.nextLesson;

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

      {progress?.contentProvenance && (
        <div className="alert" role="status" style={{ marginBottom: 'var(--s-3)' }}>
          {progress.contentProvenance.warningAr}
        </div>
      )}

      {/* بطاقة خطوتك التالية */}
      {nextLesson && (
        <section
          className="card"
          data-testid="next-step-hero"
          style={{
            marginBottom: 'var(--s-4)',
            border: '2px solid var(--color-primary, #0066cc)',
            background: 'var(--surface-hover, #f0f7ff)',
            borderRadius: 12,
            padding: 'var(--s-3) var(--s-4)',
          }}
        >
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
            <div>
              <span className="badge primary" style={{ marginBottom: 6 }}>🎯 خطوتك التالية في المسار</span>
              <h2 style={{ margin: '4px 0 6px', fontSize: '1.3rem' }}>{nextLesson.title_ar}</h2>
              <p className="small muted" style={{ margin: 0 }}>
                {nextLesson.level_code ? <span className="badge sm">{nextLesson.level_code}</span> : null}{' '}
                {nextLesson.unit_title_ar ? <span>· {nextLesson.unit_title_ar}</span> : null}
              </p>
            </div>
            <button
              className="btn"
              data-testid="next-lesson-btn"
              onClick={() => navigate(`/learn/${nextLesson.slug}`)}
              style={{ padding: 'var(--s-2) var(--s-4)', fontSize: '1.05rem', fontWeight: 600 }}
            >
              ▶️ ابدأ الدرس الآن
            </button>
          </div>
        </section>
      )}

      {/* دعوة اختبار تحديد المستوى للمتعلمين الجدد */}
      {progress && completedLessons < 5 && (
        <section
          className="card"
          data-testid="placement-cta"
          style={{ marginBottom: 'var(--s-4)', background: 'var(--surface-2, #f9fafb)', borderRadius: 10 }}
        >
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>هل لديك معرفة سابقة بالإسبانية؟ 🎓</h3>
              <p className="small muted" style={{ margin: 0 }}>
                خُض اختبار تحديد المستوى السريع (10 أسئلة) لتخطي الأساسيات والبدء مباشرة من مستواك المناسب مع كسب نقاط XP!
              </p>
            </div>
            <button className="btn secondary sm" onClick={() => navigate('/placement')}>
              🎯 ابدأ تحديد المستوى
            </button>
          </div>
        </section>
      )}

      {/* قسم المراجعة المتباعدة */}
      <section className="card" style={{ marginBottom: 'var(--s-4)' }} data-testid="review-cta">
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 4 }}>المراجعة المتباعدة الذكية</h2>
            <p className="small muted" style={{ margin: 0 }}>
              {reviewError
                ? 'تعذّر حساب البطاقات المستحقة.'
                : review === null
                  ? 'جارٍ حساب ما هو مستحق…'
                  : review.session.totalCards === 0
                    ? 'لا بطاقات بعد — إتمام درس يضيف مفرداته تلقائيًا، أو ابدأ حزمة مفردات.'
                    : `${review.session.dueNow} بطاقة مستحقة الآن · ${review.session.totalCards} بطاقة في مجموعتك`}
            </p>
          </div>
          <div className="row">
            {reviewError && (
              <button className="btn ghost sm" onClick={loadReview}>أعد المحاولة</button>
            )}
            <button className="btn" onClick={() => navigate('/review')} data-testid="review-start">ابدأ المراجعة</button>
            <button className="btn secondary" onClick={() => navigate('/review/packs')}>حزم المفردات</button>
          </div>
        </div>
      </section>

      {/* الإحصاءات */}
      <section className="card" style={{ marginBottom: 'var(--s-4)' }}>
        <h2>حالة تعلّمك</h2>
        {progress === null ? (
          <p className="muted small">جارٍ التحميل من الخادم…</p>
        ) : (
          <div className="stat-row">
            <div className="stat" data-testid="stat-lessons">
              <b className="num">{progress.totals.lessons_completed}/{progress.totals.lessons_total}</b>
              <span>دروس مكتملة</span>
            </div>
            <div className="stat" data-testid="stat-xp">
              <b className="num">{progress.stats.xp_total}</b>
              <span>إجمالي XP</span>
            </div>
            <div className="stat">
              <b className="num">{progress.stats.streak_current}</b>
              <span>أيام متتابعة</span>
            </div>
          </div>
        )}
      </section>

      {/* خريطة المنهج والدروس */}
      <section className="card" id="curriculum-map" style={{ marginTop: 'var(--s-4)' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s-3)' }}>
          <div>
            <h2 style={{ margin: 0 }}>خريطة المنهج والدروس</h2>
            <p className="small muted" style={{ margin: '4px 0 0' }}>
              رحلة تعليمية منظمة خطوة بخطوة من التمهيد وحتى الإتقان
            </p>
          </div>
          <span className="small muted num">
            {filteredLessons.length} درسًا معروضًا
          </span>
        </div>

        {/* أزرار تصفية المستويات */}
        <div
          className="row"
          style={{
            gap: 'var(--s-1)',
            overflowX: 'auto',
            paddingBottom: 'var(--s-2)',
            marginBottom: 'var(--s-3)',
            borderBottom: '1px solid var(--border)',
          }}
          role="tablist"
          aria-label="تصفية حسب المستوى"
        >
          {[
            { id: 'ALL', label: 'الكل' },
            { id: 'PREA1', label: 'التمهيد Pre-A1' },
            { id: 'A1', label: 'مستوى A1' },
            { id: 'A2', label: 'مستوى A2' },
            { id: 'B1', label: 'مستوى B1' },
            { id: 'B2', label: 'مستوى B2' },
            { id: 'C1', label: 'مستوى C1' },
            { id: 'travel', label: 'مسار السفر' },
            { id: 'callcenter', label: 'الكول سنتر' },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selectedTab === tab.id}
              className={`btn sm ${selectedTab === tab.id ? '' : 'ghost'}`}
              onClick={() => setSelectedTab(tab.id)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {progress === null && <p className="muted small">جارٍ تحميل الدروس…</p>}
        {progress && filteredLessons.length === 0 && (
          <p className="muted small">لا توجد دروس في هذا القسم حاليًا.</p>
        )}

        {/* عرض الوحدات المقسمة */}
        {unitGroups.map(group => {
          const unitPct = group.lessons.length > 0 ? Math.round((group.completedCount / group.lessons.length) * 100) : 0;
          return (
            <div
              key={group.unitId}
              style={{
                marginBottom: 'var(--s-4)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 'var(--s-3)',
                background: 'var(--surface-1, #fff)',
              }}
            >
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s-2)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{group.unitTitle}</h3>
                  <span className="small muted">
                    {group.levelCode ? <span className="badge sm">{group.levelCode}</span> : null}
                    {group.programTitle ? <span style={{ marginRight: 6 }}>{group.programTitle}</span> : null}
                  </span>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span className="small muted num">
                    {group.completedCount}/{group.lessons.length} مكتمل ({unitPct}%)
                  </span>
                </div>
              </div>

              {/* شريط تقدم الوحدة */}
              <div
                className="progress-track"
                style={{ height: 6, marginBottom: 'var(--s-3)' }}
                role="progressbar"
                aria-valuenow={unitPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="progress-fill" style={{ width: `${unitPct}%` }} />
              </div>

              {/* قائمة دروس الوحدة */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                {group.lessons.map(l => {
                  const done = l.progress_status === 'completed';
                  const inProgress = l.progress_status === 'in_progress';
                  const isLocked = l.is_unlocked === false;

                  return (
                    <div
                      className="lesson-row"
                      key={l.slug}
                      style={{
                        opacity: isLocked ? 0.75 : 1,
                        background: done ? 'var(--surface-2, #fbfcfd)' : 'transparent',
                        padding: 'var(--s-2) var(--s-3)',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <div>
                          <strong>{l.title_ar}</strong>{' '}
                          {l.level_code && <span className="badge sm">{l.level_code}</span>}{' '}
                          {done && <span className="badge primary sm">✓ مكتمل {l.best_accuracy}%</span>}
                          {inProgress && <span className="badge accent sm">⏳ قيد الحل</span>}
                        </div>
                        <div className="small muted" style={{ marginTop: 4 }}>
                          {isLocked
                            ? '🔒 مقفل — يتطلب إتمام الدرس السابق أولاً.'
                            : done
                              ? 'أعد الحل لتحسين الدقة ومراجعة المفاهيم — لا نقاط إضافية عند الإعادة.'
                              : inProgress
                                ? 'بدأت هذا الدرس ولم تُكمله بعد.'
                                : 'متاح للبدء الآن.'}
                        </div>
                      </div>

                      {isLocked ? (
                        <button className="btn sm ghost" disabled title="هذا الدرس مقفل حتى إتمام المتطلبات">
                          🔒 مقفل
                        </button>
                      ) : (
                        <button
                          className={`btn sm ${done ? 'secondary' : ''}`}
                          onClick={() => navigate(`/learn/${l.slug}`)}
                        >
                          {done ? 'مراجعة' : inProgress ? 'متابعة' : 'ابدأ'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* المسارات التخصصية */}
      <section className="card" style={{ marginTop: 'var(--s-4)' }}>
        <h2>المسارات التطبيقية المتخصصة</h2>
        {paths === null && !pathsError && <p className="muted small">جارٍ التحميل…</p>}
        {pathsError && <p className="muted small">تعذّر تحميل المسارات. أعد تحميل الصفحة للمحاولة مجددًا.</p>}
        {paths && paths.length === 0 && <p className="muted small">لا مسارات منشورة بعد.</p>}
        <ul className="list-plain">
          {(paths ?? []).map(p => (
            <li key={p.slug} className="row" style={{ justifyContent: 'space-between', padding: 'var(--s-2) 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <strong>{p.title_ar}</strong>
                {p.level_code && <span className="badge sm" style={{ marginRight: 8 }}>{p.level_code}</span>}
              </div>
              <span className="row small muted">
                <span className="num">{p.lessons_count}</span> درسًا · <span className="num">{p.units_count}</span> وحدة
                <button
                  className="btn ghost sm"
                  onClick={() => {
                    setSelectedTab(p.slug === 'travel' ? 'travel' : p.slug === 'callcenter' ? 'callcenter' : 'ALL');
                    document.getElementById('curriculum-map')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  عرض الدروس
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
