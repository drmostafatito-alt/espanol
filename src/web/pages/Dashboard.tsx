import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, type ProgressPayload, type ReviewPayload, type ProgressLessonItem, type ApiUser } from '../api';
import { useAuth } from '../state';
import { Icon, type IconName } from '../components/icons';
import { Avatar, ProgressBar, ProgressRing, LevelBadge, LoadingState, ErrorState, EmptyState } from '../components/ui';
import { LearningPath } from '../components/LearningPath';
import { trackVisual } from '../components/tracks';

interface PathRow {
  slug: string;
  title_ar: string;
  kind: string;
  level_code: string | null;
  units_count: number;
  lessons_count: number;
}

const LEVEL_ORDER = ['PREA1', 'A1', 'A2', 'B1', 'B2', 'C1'];

const TABS: { id: string; label: string }[] = [
  { id: 'ALL', label: 'الكل' },
  { id: 'PREA1', label: 'التمهيد Pre-A1' },
  { id: 'A1', label: 'مستوى A1' },
  { id: 'A2', label: 'مستوى A2' },
  { id: 'B1', label: 'مستوى B1' },
  { id: 'B2', label: 'مستوى B2' },
  { id: 'C1', label: 'مستوى C1' },
  { id: 'travel', label: 'مسار السفر' },
  { id: 'callcenter', label: 'الكول سنتر' },
];

export function Dashboard({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [paths, setPaths] = useState<PathRow[] | null>(null);
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  // كل مصدر له حالة خطأ مستقلة: فشل واحد لا يُسقط بقية اللوحة
  const [progressError, setProgressError] = useState<string | null>(null);
  const [pathsError, setPathsError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewPayload | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('ALL');

  const loadProgress = useCallback(() => {
    setProgressError(null);
    api
      .progress()
      .then(setProgress)
      .catch((err: unknown) => {
        setProgressError(err instanceof Error ? err.message : 'تعذّر تحميل بيانات التقدم.');
      });
  }, []);

  const loadPaths = useCallback(() => {
    setPathsError(null);
    api
      .paths()
      .then(p => setPaths(p.paths))
      .catch((err: unknown) => {
        setPathsError(err instanceof Error ? err.message : 'تعذّر تحميل المسارات.');
      });
  }, []);

  const loadReview = useCallback(() => {
    api
      .reviewSession(1)
      .then(setReview)
      .catch(() => undefined); // طلب ثانوي: لا يعطّل اللوحة إطلاقًا
  }, []);

  useEffect(() => {
    loadProgress();
    loadPaths();
    loadReview();
    // روابط داخلية من المسارات والأقسام: ?track= و?section=
    const params = new URLSearchParams(window.location.search);
    const track = params.get('track');
    if (track) {
      const tab = TABS.find(t => t.id === track)?.id;
      if (tab) setSelectedTab(tab);
    }
    const section = params.get('section');
    if (section) {
      const target = section;
      window.setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lessons = progress?.lessons ?? [];
  const completedLessons = progress?.totals.lessons_completed ?? 0;
  const totalLessons = progress?.totals.lessons_total ?? 0;
  const totalXp = progress?.stats.xp_total ?? 0;
  const streak = progress?.stats.streak_current ?? 0;
  const overallPct = totalLessons > 0 ? Math.round((completedLessonSafe(completedLessons) / totalLessons) * 100) : 0;

  const currentLevel = useMemo(() => {
    const done = new Set(
      lessons.filter(l => l.progress_status === 'completed' && l.level_code).map(l => l.level_code!.toUpperCase()),
    );
    for (let i = LEVEL_ORDER.length - 1; i >= 0; i--) {
      const lvl = LEVEL_ORDER[i]!;
      if (done.has(lvl)) return lvl;
    }
    return 'PREA1';
  }, [lessons]);

  const filteredLessons = lessons.filter(l => {
    if (selectedTab === 'ALL') return true;
    if (selectedTab === 'travel') return l.program_slug === 'travel';
    if (selectedTab === 'callcenter') return l.program_slug === 'callcenter';
    return (l.level_code ?? '').toUpperCase() === selectedTab;
  });

  const unitGroups = useMemo(() => {
    const groups: {
      unitId: string; unitTitle: string; levelCode: string | null;
      programTitle?: string; lessons: ProgressLessonItem[]; completedCount: number;
    }[] = [];
    const map = new Map<string, (typeof groups)[0]>();
    for (const l of filteredLessons) {
      const uKey = l.unit_id || l.unit_slug || 'misc';
      if (!map.has(uKey)) {
        const g = {
          unitId: uKey, unitTitle: l.unit_title_ar || 'وحدة تعليمية', levelCode: l.level_code,
          programTitle: l.program_title_ar, lessons: [] as ProgressLessonItem[], completedCount: 0,
        };
        map.set(uKey, g);
        groups.push(g);
      }
      const group = map.get(uKey)!;
      group.lessons.push(l);
      if (l.progress_status === 'completed') group.completedCount++;
    }
    return groups;
  }, [filteredLessons]);

  const nextLesson = progress?.nextLesson ?? null;
  const firstAvailable = lessons.find(l => l.is_unlocked !== false && l.progress_status !== 'completed');

  // بعد كل الـ hooks — منع تغيّر عدد الخطافات بين التصييرات
  if (!user) return null;

  return (
    <div>
      {/* ---------------- الترحيب ---------------- */}
      <header className="welcome-row">
        <Avatar name={user.displayName} email={user.email} large />
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1>مرحبًا يا {user.displayName || 'صديقي'}</h1>
          <p>استمر في رحلتك لتعلّم الإسبانية — {styleLabel(user)} · هدفك اليومي <span className="num">{user.dailyGoalMinutes}</span> دقيقة</p>
        </div>
        <button className="btn secondary sm" onClick={() => navigate('/settings')}>
          <Icon name="settings" size={17} /> الإعدادات
        </button>
      </header>

      {progressError && !progress && (
        <div style={{ marginBottom: 'var(--s-4)' }}>
          <ErrorState
            title="تعذّر تحميل بيانات التقدم"
            description={progressError}
            onRetry={loadProgress}
          />
        </div>
      )}

      {progress?.contentProvenance && (
        <p className="banner-warn" role="status" style={{ marginBottom: 'var(--s-4)' }}>
          {progress.contentProvenance.warningAr}
        </p>
      )}

      {!progress && !progressError && <LoadingState text="جارٍ تحميل لوحتك من الخادم…" />}

      {progress && (
        <>
          {/* ---------------- الإحصائيات الحقيقية — ثلاث فقط، الأهم للمتعلم ---------------- */}
          <div className="stat-chip-row" style={{ marginBottom: 'var(--s-4)' }}>
            <div className="stat-chip">
              <span className="stat-icon flame"><Icon name="flame" size={22} /></span>
              <span><b className="num">{streak}</b><span>يوم متتالي</span></span>
            </div>
            <div className="stat-chip" data-testid="stat-xp">
              <span className="stat-icon xp"><Icon name="star" size={22} /></span>
              <span><b className="num">{totalXp}</b><span>إجمالي XP</span></span>
            </div>
            <div className="stat-chip" data-testid="stat-lessons">
              <span className="stat-icon" style={{ background: 'var(--color-success-soft)', color: 'var(--color-success)' }}>
                <Icon name="check-circle" size={22} />
              </span>
              <span><b className="num">{completedLessons}/{totalLessons}</b><span>دروس مكتملة</span></span>
            </div>
          </div>

          <div className="dash-grid">
            {/* ---------------- بطاقة الدرس التالي ---------------- */}
            <section className="card next-card" data-testid="next-step-hero">
              <div className="next-media">
                <img src="/img/lesson-street.jpg" alt="شارع إسباني تقليدي بالشرفات المزهرة" loading="lazy" />
                <div className="next-media-content">
                  <span className="row" style={{ gap: 6 }}>
                    <LevelBadge level={nextLesson?.level_code ?? currentLevel} />
                    {nextLesson?.unit_title_ar && <span className="badge navy">{nextLesson.unit_title_ar}</span>}
                  </span>
                  <h2>{nextLesson ? nextLesson.title_ar : 'رحلتك تبدأ من هنا'}</h2>
                  <p>
                    {nextLesson
                      ? nextLesson.program_title_ar
                        ? `ضمن ${nextLesson.program_title_ar} — تقدم خطوة جديدة كل يوم.`
                        : 'الدرس التالي في مسارك — جاهز للبدء الآن.'
                      : 'أكملت كل الدروس المتاحة حاليًا. راجع ما تعلمته أو جرّب اختبار تحديد المستوى.'}
                  </p>
                </div>
              </div>
              <div className="next-body">
                <ProgressBar value={overallPct} label="نسبة إكمال المنهج" />
                <span className="small muted num" style={{ whiteSpace: 'nowrap' }}>{overallPct}%</span>
                {nextLesson ? (
                  <button className="btn navy" data-testid="next-lesson-btn" onClick={() => navigate(`/learn/${nextLesson.slug}`)}>
                    <Icon name="play" size={17} /> ابدأ الدرس الآن
                  </button>
                ) : firstAvailable ? (
                  <button className="btn navy" data-testid="next-lesson-btn" onClick={() => navigate(`/learn/${firstAvailable.slug}`)}>
                    <Icon name="play" size={17} /> متابعة التعلم
                  </button>
                ) : null}
              </div>
            </section>

            {/* ---------------- بطاقة المستوى ---------------- */}
            <section className="card" style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.05rem' }}>مستواك الحالي</h2>
              <div className="ring-wrap" style={{ margin: 'var(--s-3) 0' }}>
                <ProgressRing
                  value={overallPct}
                  centerTop={currentLevel}
                  centerBottom={overallPct > 0 ? `${overallPct}%` : 'مبتدئ'}
                />
                <span className="ring-caption small muted">
                  {overallPct > 0 ? 'نسبة إكمال المنهج ككل' : 'ابدأ أول درس ليتحرك المؤشر'}
                </span>
              </div>
              <button className="btn secondary sm block" onClick={() => document.getElementById('learning-path')?.scrollIntoView({ behavior: 'smooth' })}>
                عرض التفاصيل
              </button>
            </section>

            {/* ---------------- المسارات المتخصصة (مقدمة على التفاصيل) ---------------- */}
            <section className="card full" id="specialized-tracks">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-4)' }}>
                <h2 style={{ margin: 0 }}>المسارات المتخصصة</h2>
                <span className="small muted">كل المسارات تُقرأ من المحتوى المنشور فعليًا</span>
              </div>
              {pathsError && (
                <ErrorState
                  title="تعذّر تحميل المسارات"
                  description={pathsError}
                  onRetry={loadPaths}
                />
              )}
              {!pathsError && paths === null && <LoadingState text="جارٍ تحميل المسارات…" />}
              {!pathsError && paths && paths.length === 0 && (
                <EmptyState icon="tracks" title="لا مسارات منشورة بعد" description="سيظهر هنا كل مسار ينشره فريق المحتوى." />
              )}
              <div className="track-grid">
                {(paths ?? []).map(p => {
                  const visual = trackVisual(p.slug, p.title_ar);
                  return (
                    <button
                      type="button"
                      key={p.slug}
                      className="track-card"
                      style={{ textAlign: 'start', font: 'inherit' }}
                      onClick={() => {
                        const tab = TABS.find(t => t.id === p.slug)?.id;
                        if (tab) setSelectedTab(tab);
                        document.getElementById('learning-path')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      aria-label={`افتح مسار ${p.title_ar}`}
                    >
                      <img src={visual.image} alt="" loading="lazy" />
                      <span className="track-body">
                        <h3>{p.title_ar}</h3>
                        <p>{visual.shortAr}</p>
                        <span className="track-meta">
                          <Icon name="book" size={13} /> {p.lessons_count} درس · {p.units_count} وحدة
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ---------------- مسار التعلم ---------------- */}
            <section className="card full" id="learning-path">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
                <h2 style={{ margin: 0 }}>مسار التعلم</h2>
                <span className="small muted">العقد الخضراء مكتملة، والزرقاء هي درسك الحالي</span>
              </div>
              <div className="tabs-row" role="tablist" aria-label="تصفية حسب المستوى">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={selectedTab === tab.id}
                    className={`level-pill${selectedTab === tab.id ? ' active' : ''}`}
                    onClick={() => setSelectedTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {filteredLessons.length === 0 ? (
                <p className="muted small">لا توجد دروس في هذا القسم حاليًا.</p>
              ) : (
                <LearningPath
                  lessons={filteredLessons}
                  nextSlug={nextLesson?.slug}
                  onOpen={slug => navigate(`/learn/${slug}`)}
                />
              )}

              {/* القائمة التفصيلية بالوحدات — قابلة للطي على الموبايل حتى لا تطول الصفحة */}
              <details className="units-details">
                <summary>عرض وحدات المنهج بالتفصيل</summary>
                <div style={{ marginTop: 'var(--s-4)' }}>
                {unitGroups.map(group => {
                  const pct = group.lessons.length ? Math.round((group.completedCount / group.lessons.length) * 100) : 0;
                  return (
                    <div key={group.unitId} style={{ marginBottom: 'var(--s-4)' }}>
                      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
                        <div className="row" style={{ gap: 8 }}>
                          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{group.unitTitle}</h3>
                          <LevelBadge level={group.levelCode} />
                          {group.programTitle && <span className="badge">{group.programTitle}</span>}
                        </div>
                        <span className="small muted num">{group.completedCount}/{group.lessons.length} · {pct}%</span>
                      </div>
                      <ProgressBar value={pct} height={6} label={`تقدم وحدة ${group.unitTitle}`} />
                      <div style={{ marginTop: 'var(--s-3)' }}>
                        {group.lessons.map(l => (
                          <LessonRow key={l.slug} lesson={l} onOpen={slug => navigate(`/learn/${slug}`)} />
                        ))}
                      </div>
                    </div>
                  );
                })}
                </div>
              </details>
            </section>

            {/* ---------------- أقسام ثانوية: المراجعة والتحديد ---------------- */}
            <section className="card full secondary-section" data-testid="review-cta">
              <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
                <div className="row" style={{ gap: 'var(--s-3)' }}>
                  <span className="stat-icon" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-strong)' }}>
                    <Icon name="refresh" size={22} />
                  </span>
                  <div>
                    <h2 style={{ margin: '0 0 4px', fontSize: '1.08rem' }}>المراجعة المتباعدة الذكية</h2>
                    <p className="small muted" style={{ margin: 0 }}>
                      {review === null
                        ? 'جارٍ حساب ما هو مستحق…'
                        : review.session.totalCards === 0
                          ? 'لا بطاقات بعد — إتمام درس يضيف مفرداته تلقائيًا، أو ابدأ حزمة مفردات.'
                          : `${review.session.dueNow} بطاقة مستحقة الآن · ${review.session.totalCards} بطاقة في مجموعتك`}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <button className="btn success sm" onClick={() => navigate('/review')} data-testid="review-start">ابدأ المراجعة</button>
                  <button className="btn secondary sm" onClick={() => navigate('/review/packs')}>حزم المفردات</button>
                </div>
              </div>
            </section>

            {completedLessons < 5 && (
              <section className="card full secondary-section" data-testid="placement-cta">
                <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
                  <div className="row" style={{ gap: 'var(--s-3)' }}>
                    <span className="stat-icon" style={{ background: 'var(--color-info-soft)', color: 'var(--color-info)' }}><Icon name="target" size={22} /></span>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.02rem' }}>هل لديك معرفة سابقة بالإسبانية؟</h3>
                      <p className="small muted" style={{ margin: 0 }}>
                        اختبار سريع من 10 أسئلة يفتح لك المستوى المناسب ويمنحك نقاط XP حقيقية عند اجتيازه.
                      </p>
                    </div>
                  </div>
                  <button className="btn secondary sm" onClick={() => navigate('/placement')}>ابدأ تحديد المستوى</button>
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function LessonRow({ lesson, onOpen }: { lesson: ProgressLessonItem; onOpen: (slug: string) => void }) {
  const done = lesson.progress_status === 'completed';
  const inProgress = lesson.progress_status === 'in_progress';
  const locked = lesson.is_unlocked === false;
  const icon: IconName = done ? 'check-circle' : locked ? 'lock' : inProgress ? 'clock' : 'play';
  return (
    <div className="lesson-row" style={done ? { background: 'var(--color-success-soft)', borderColor: '#bfe6d1' } : undefined}>
      <div className="row" style={{ gap: 'var(--s-3)' }}>
        <span
          className="stat-icon"
          style={{
            width: 38, height: 38,
            background: done ? 'var(--color-success)' : locked ? 'var(--color-surface-3)' : 'var(--color-info-soft)',
            color: done ? '#fff' : locked ? 'var(--color-muted)' : 'var(--color-info)',
          }}
        >
          <Icon name={icon} size={19} />
        </span>
        <div>
          <strong>{lesson.title_ar}</strong>{' '}
          <LevelBadge level={lesson.level_code} />
          {done && <span className="badge success" style={{ marginInlineStart: 6 }}>مكتمل {lesson.best_accuracy}%</span>}
          {inProgress && <span className="badge accent" style={{ marginInlineStart: 6 }}>قيد الحل</span>}
          <p className="small muted" style={{ margin: '2px 0 0' }}>
            {locked
              ? `مقفل — يتطلب أولًا: ${(lesson.missing_prerequisites ?? []).join('، ') || 'إتمام الدرس السابق'}`
              : done
                ? 'أعد الحل لتحسين الدقة — لا نقاط إضافية عند الإعادة.'
                : inProgress
                  ? 'بدأت هذا الدرس ولم تُكمله بعد.'
                  : 'متاح للبدء الآن.'}
          </p>
        </div>
      </div>
      {locked ? (
        <button className="btn sm ghost" disabled title="هذا الدرس مقفل حتى إتمام المتطلبات">
          <Icon name="lock" size={16} /> مقفل
        </button>
      ) : (
        <button className={`btn sm ${done ? 'secondary' : 'navy'}`} onClick={() => onOpen(lesson.slug)}>
          {done ? 'مراجعة' : inProgress ? 'متابعة' : 'ابدأ'}
        </button>
      )}
    </div>
  );
}

function styleLabel(user: ApiUser): string {
  return {
    fusha: 'الشرح بالفصحى',
    eg: 'الشرح بالعامية المصرية',
    fusha_eg: 'فصحى مع توضيح مصري',
  }[user.explanationStyle];
}

function completedLessonSafe(n: number): number {
  return Number.isFinite(n) ? n : 0;
}
