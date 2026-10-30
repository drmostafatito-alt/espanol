import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, type ProgressLessonItem, type ProgressPayload } from '../api';
import { useAuth } from '../state';
import { Icon, type IconName } from '../components/icons';
import { Avatar, ProgressBar, LevelBadge, LoadingState, ErrorState, EmptyState } from '../components/ui';
import { LearningPath } from '../components/LearningPath';
import { Solecito, SceneIllustration, sceneFor, MedalIcon } from '../components/Illustrations';
import { trackVisual, trackImageSources, trackImageSrcSet } from '../components/tracks';

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

const WEEKDAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

/** اختصار اسم اليوم من تاريخ ISO (توقيت عالمي، نفس تعريف الخادم) */
function dayLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? '' : WEEKDAYS_AR[d.getUTCDay()] ?? '';
}

/** صفحة اليوم: لوحة المتعلم — كل رقم فيها محسوب على الخادم من نشاط حقيقي */
export function Dashboard({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [paths, setPaths] = useState<PathRow[] | null>(null);
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [pathsError, setPathsError] = useState<string | null>(null);
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

  useEffect(() => {
    loadProgress();
    loadPaths();
    const params = new URLSearchParams(window.location.search);
    const track = params.get('track');
    if (track) {
      const tab = TABS.find(t => t.id === track)?.id;
      if (tab) setSelectedTab(tab);
    }
    const section = params.get('section');
    if (section) {
      window.setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
  }, [loadProgress, loadPaths]);

  const lessons = useMemo(() => progress?.lessons ?? [], [progress]);
  const completedLessons = progress?.totals.lessons_completed ?? 0;
  const totalLessons = progress?.totals.lessons_total ?? 0;
  const totalXp = progress?.stats.xp_total ?? 0;
  const streak = progress?.stats.streak_current ?? 0;
  const streakLongest = progress?.stats.streak_longest ?? 0;
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const todayMinutes = progress?.today?.minutes ?? 0;
  const todayXp = progress?.today?.xp ?? 0;
  const todayLessons = progress?.today?.lessons ?? 0;
  const goalMinutes = progress?.goalMinutes ?? user?.dailyGoalMinutes ?? 10;
  const goalPct = goalMinutes > 0 ? Math.min(100, Math.round((todayMinutes / goalMinutes) * 100)) : 0;
  const dueNow = progress?.review?.dueNow ?? 0;
  const reviewTotal = progress?.review?.total ?? 0;
  const week = progress?.week ?? [];
  const achievements = progress?.achievements ?? [];
  const earned = achievements.filter(a => a.earned);
  const nextUp = achievements.find(a => !a.earned) ?? null;

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

  const filteredLessons = useMemo(
    () =>
      lessons.filter(l => {
        if (selectedTab === 'ALL') return true;
        if (selectedTab === 'travel') return l.program_slug === 'travel';
        if (selectedTab === 'callcenter') return l.program_slug === 'callcenter';
        return (l.level_code ?? '').toUpperCase() === selectedTab;
      }),
    [lessons, selectedTab],
  );

  const nextLesson = progress?.nextLesson ?? null;
  const firstAvailable = lessons.find(l => l.is_unlocked !== false && l.progress_status !== 'completed');
  const nextSlug = nextLesson?.slug ?? firstAvailable?.slug ?? null;
  const nextScene = sceneFor(`${nextLesson?.unit_title_ar ?? ''} ${nextLesson?.title_ar ?? ''}`);

  if (!user) return null;

  return (
    <div className="today">
      {/* ---------------- ترحيب + هدف اليوم ---------------- */}
      <header className="today-hero">
        <div className="today-greet">
          <div className="row" style={{ gap: 'var(--s-3)', marginBottom: 'var(--s-2)' }}>
            <Avatar name={user.displayName} email={user.email} large />
            <span className="badge primary">
              <Icon name="graduation" size={14} /> رحلتك الحالية: {currentLevel}
            </span>
          </div>
          <h1>مرحبًا يا {user.displayName || 'صديقي'}</h1>
          <p>
            {streak > 0
              ? `سلسلتك ${streak} يومًا متتاليًا. درس واحد اليوم يحافظ عليها.`
              : 'خطوة صغيرة اليوم أفضل من انتظار يوم مثالي. ابدأ بدرسك التالي.'}
          </p>
          <div className="today-pills">
            <span className="pill-stat flame">
              <Icon name="flame" size={17} />
              <span className="num">{streak}</span> يوم متتالي
            </span>
            <span className="pill-stat">
              <Icon name="star" size={17} />
              <span className="num">{todayXp}</span> XP اليوم
            </span>
            <span className="pill-stat">
              <Icon name="check-circle" size={17} />
              <span className="num">{todayLessons}</span> درس اليوم
            </span>
          </div>
        </div>
        <div className="today-hero-side">
          <div
            className="goal-ring"
            style={{ ['--p' as string]: goalPct }}
            role="img"
            aria-label={`هدف اليوم: ${todayMinutes} من ${goalMinutes} دقيقة (${goalPct}%)`}
          >
            <div className="goal-ring-inner">
              <b className="num">
                {todayMinutes}
                <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>/{goalMinutes}</span>
              </b>
              <span>دقيقة اليوم</span>
            </div>
          </div>
          <Solecito mood={goalPct >= 100 ? 'celebrate' : 'happy'} size={116} />
        </div>
      </header>

      {progressError && !progress && (
        <ErrorState title="تعذّر تحميل بيانات التقدم" description={progressError} onRetry={loadProgress} />
      )}

      {!progress && !progressError && <LoadingState text="جارٍ تحميل لوحتك من الخادم…" />}

      {progress && (
        <>
          {/* ---------------- الدرس التالي ---------------- */}
          <section className="continue-card" data-testid="next-step-hero">
            <div className="continue-scene">
              <SceneIllustration kind={nextScene} />
            </div>
            <div className="continue-body">
              <span className="continue-eyebrow">
                <Icon name="play" size={14} /> درسك التالي
              </span>
              <h2>{nextLesson ? nextLesson.title_ar : nextSlug ? 'أكمل من حيث توقفت' : 'أكملت كل الدروس المتاحة'}</h2>
              <p className="muted small">
                {nextLesson
                  ? nextLesson.unit_title_ar
                    ? `ضمن وحدة «${nextLesson.unit_title_ar}» — ${nextLesson.program_title_ar ?? 'المسار الأساسي'}`
                    : `ضمن ${nextLesson.program_title_ar ?? 'المسار الأساسي'}`
                  : nextSlug
                    ? 'لديك درس متاح لم تكتمله بعد — أكمله ليفتح التالي.'
                    : 'راجع مفرداتك، أو جرّب اختبار تحديد المستوى للانتقال لمستوى أعلى.'}
              </p>
              <div className="meta-chips">
                <LevelBadge level={nextLesson?.level_code ?? currentLevel} />
                {nextLesson?.estimated_minutes ? (
                  <span className="meta-chip">
                    <Icon name="clock" size={14} /> <span className="num">{nextLesson.estimated_minutes}</span> دقيقة
                  </span>
                ) : null}
                <span className="meta-chip">
                  <Icon name="star" size={14} /> +<span className="num">30</span> XP
                </span>
                <span className="meta-chip">
                  <Icon name="check-circle" size={14} /> <span className="num">{overallPct}%</span> من المنهج
                </span>
              </div>
            </div>
            <div className="continue-actions">
              {nextSlug ? (
                <button className="btn lg" data-testid="next-lesson-btn" onClick={() => navigate(`/learn/${nextSlug}`)}>
                  <Icon name="play" size={18} /> {nextLesson ? 'ابدأ الدرس' : 'متابعة التعلم'}
                </button>
              ) : null}
              <button className="btn secondary" onClick={() => navigate('/path')}>
                <Icon name="route" size={17} /> خريطة المسار
              </button>
            </div>
          </section>

          {/* ---------------- أهداف اليوم ---------------- */}
          <div className="quick-grid">
            <div className="quick-tile" data-testid="stat-xp">
              <span className="quick-icon"><Icon name="star" size={22} /></span>
              <span>
                <b className="num">{totalXp}</b>
                <span className="small">إجمالي XP</span>
              </span>
            </div>
            <div className="quick-tile" data-testid="stat-lessons">
              <span className="quick-icon success"><Icon name="check-circle" size={22} /></span>
              <span>
                <b className="num">{completedLessons}/{totalLessons}</b>
                <span className="small">دروس مكتملة</span>
              </span>
            </div>
            <div className="quick-tile action" data-testid="review-cta">
              <span className="quick-icon warn"><Icon name="cards" size={22} /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <b className="num">{dueNow}</b>
                <span className="small">
                  {reviewTotal > 0 ? `بطاقة مستحقة من ${reviewTotal}` : 'لا بطاقات في مجموعتك بعد'}
                </span>
              </span>
              <button className="btn sm navy" data-testid="review-start" onClick={() => navigate('/review')}>
                راجع
              </button>
            </div>
          </div>

          {/* ---------------- الأسبوع + الإنجازات ---------------- */}
          {(week.length > 0 || achievements.length > 0) && (
            <div className="dash-columns">
              {week.length > 0 && (
                <section className="week-card" aria-labelledby="week-title">
                  <div className="week-head">
                    <h2 id="week-title">آخر 7 أيام</h2>
                    <span className="small muted">
                      دقائق التعلم · الأطول {streakLongest} يومًا
                    </span>
                  </div>
                  <div className="week-strip">
                    {week.map((day, i) => {
                      const max = Math.max(...week.map(d => d.minutes), goalMinutes, 1);
                      const h = Math.max(6, Math.round((day.minutes / max) * 100));
                      const isToday = i === week.length - 1;
                      return (
                        <div className={`week-day${isToday ? ' today' : ''}`} key={day.date}>
                          <div className={`week-bar${day.minutes === 0 ? ' idle' : ''}`} title={`${day.minutes} دقيقة · ${day.xp} XP`}>
                            <i style={{ height: `${day.minutes === 0 ? 6 : h}%` }} />
                          </div>
                          <small>{isToday ? 'اليوم' : dayLabel(day.date).slice(0, 4)}</small>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {achievements.length > 0 && (
                <section className="week-card" aria-labelledby="ach-title">
                  <div className="week-head">
                    <h2 id="ach-title">إنجازاتك</h2>
                    <span className="small muted num">
                      {earned.length}/{achievements.length}
                    </span>
                  </div>
                  <div className="ach-strip">
                    {achievements.slice(0, 8).map(a => (
                      <span className={`ach-chip${a.earned ? '' : ' locked'}`} key={a.code} title={a.descriptionAr}>
                        <MedalIcon tier={a.tier} size={28} />
                        {a.titleAr}
                      </span>
                    ))}
                  </div>
                  {nextUp && (
                    <p className="small muted" style={{ margin: 'var(--s-3) 0 0' }}>
                      التالي: <b>{nextUp.titleAr}</b> — <span className="num">{nextUp.current}/{nextUp.target}</span>
                      <span className="ach-mini-bar" style={{ display: 'block' }}>
                        <i style={{ width: `${nextUp.percent}%` }} />
                      </span>
                    </p>
                  )}
                  <div className="row" style={{ marginTop: 'var(--s-3)' }}>
                    <button className="btn sm secondary" onClick={() => navigate('/profile')}>
                      <Icon name="trophy" size={16} /> كل الإنجازات والتقدم
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ---------------- مسار التعلم المختصر ---------------- */}
          <section className="card" id="learning-path">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
              <h2 style={{ margin: 0 }}>مسار التعلم</h2>
              <span className="small muted">العقد الخضراء مكتملة، والبرتقالية هي درسك الحالي</span>
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
            <div className="row" style={{ marginTop: 'var(--s-3)', justifyContent: 'space-between' }}>
              <button className="btn navy sm" onClick={() => navigate('/path')}>
                <Icon name="route" size={17} /> افتح خريطة المسار الكاملة
              </button>
              <span className="small muted">
                <span className="num">{completedLessons}</span> من <span className="num">{totalLessons}</span> درسًا
              </span>
            </div>

            <details className="units-details">
              <summary>عرض وحدات المنهج بالتفصيل</summary>
              <div style={{ marginTop: 'var(--s-4)' }}>
                {groupByUnit(filteredLessons).map(group => {
                  const pct = group.lessons.length ? Math.round((group.completedCount / group.lessons.length) * 100) : 0;
                  return (
                    <div key={group.unitId} style={{ marginBottom: 'var(--s-4)' }}>
                      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
                        <div className="row" style={{ gap: 8 }}>
                          <h3 style={{ margin: 0, fontSize: '1.02rem' }}>{group.unitTitle}</h3>
                          <LevelBadge level={group.levelCode} />
                          {group.programTitle && <span className="badge navy">{group.programTitle}</span>}
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

          {/* ---------------- المسارات المتخصصة ---------------- */}
          <section id="specialized-tracks" className="card">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
              <h2 style={{ margin: 0 }}>المسارات المتخصصة</h2>
              <span className="small muted">مسارات من محتوى المنصة</span>
            </div>
            {pathsError && <p className="small error-text">{pathsError}</p>}
            {!pathsError && !paths && <LoadingState text="جارٍ تحميل المسارات…" />}
            {!pathsError && paths && paths.filter(p => p.lessons_count > 0).length === 0 && (
              <EmptyState icon="tracks" title="لا مسارات متاحة بعد" description="ستظهر هنا المسارات المتاحة في المنصة." />
            )}
            <div className="track-grid">
              {(paths ?? [])
                .filter(p => p.lessons_count > 0)
                .map(p => {
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
                      <picture>
                        <source type="image/webp" srcSet={trackImageSources(visual.image).webp} sizes="320px" />
                        <img
                          src={visual.image}
                          srcSet={trackImageSrcSet(visual.image)}
                          sizes="320px"
                          alt=""
                          loading="lazy"
                          width={320}
                          height={200}
                        />
                      </picture>
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

          {/* ---------------- تحديد المستوى ---------------- */}
          {completedLessons < 5 && (
            <section className="card secondary-section" data-testid="placement-cta">
              <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-3)' }}>
                <div className="row" style={{ gap: 'var(--s-3)' }}>
                  <span className="quick-icon info"><Icon name="target" size={22} /></span>
                  <div>
                    <h3 style={{ margin: '0 0 2px', fontSize: '1rem' }}>هل لديك معرفة سابقة بالإسبانية؟</h3>
                    <p className="small muted" style={{ margin: 0 }}>
                      اختبار سريع من 10 أسئلة يفتح لك المستوى المناسب ويمنحك نقاط XP حقيقية عند اجتيازه.
                    </p>
                  </div>
                </div>
                <button className="btn secondary sm" onClick={() => navigate('/placement')}>
                  ابدأ تحديد المستوى
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function groupByUnit(lessons: ProgressLessonItem[]) {
  const groups: {
    unitId: string; unitTitle: string; levelCode: string | null;
    programTitle?: string; lessons: ProgressLessonItem[]; completedCount: number;
  }[] = [];
  const map = new Map<string, (typeof groups)[0]>();
  for (const l of lessons) {
    const key = l.unit_id || l.unit_slug || 'misc';
    let group = map.get(key);
    if (!group) {
      group = {
        unitId: key,
        unitTitle: l.unit_title_ar || 'وحدة تعليمية',
        levelCode: l.level_code,
        programTitle: l.program_title_ar,
        lessons: [],
        completedCount: 0,
      };
      map.set(key, group);
      groups.push(group);
    }
    group.lessons.push(l);
    if (l.progress_status === 'completed') group.completedCount += 1;
  }
  return groups;
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
          className="quick-icon"
          style={{
            width: 38, height: 38, borderRadius: 12,
            background: done ? 'var(--color-success)' : locked ? 'var(--color-surface-3)' : 'var(--color-info-soft)',
            color: done ? '#fff' : locked ? 'var(--color-muted)' : 'var(--color-info-text)',
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

