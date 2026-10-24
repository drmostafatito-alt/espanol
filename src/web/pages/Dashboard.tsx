import { useEffect, useState } from 'react';
import { api, type ProgressPayload, type ReviewPayload, type ProgressLessonItem } from '../api';
import { useAuth } from '../state';
import { AudioDemo } from '../components/AudioDemo';
import { Icon, LevelBadge, ProgressBar, SectionHead, EmptyState, XpChip, GemChip } from '../components/ui';
import { TopicScene, topicForLesson } from '../components/Illustrations';

interface PathRow {
  slug: string;
  title_ar: string;
  kind: string;
  level_code: string | null;
  units_count: number;
  lessons_count: number;
}

const TABS = [
  { id: 'ALL', label: 'الكل' },
  { id: 'PREA1', label: 'التمهيد Pre-A1' },
  { id: 'A1', label: 'مستوى A1' },
  { id: 'A2', label: 'مستوى A2' },
  { id: 'B1', label: 'مستوى B1' },
  { id: 'B2', label: 'مستوى B2' },
  { id: 'C1', label: 'مستوى C1' },
  { id: 'travel', label: 'مسار السفر' },
  { id: 'callcenter', label: 'الكول سنتر' },
] as const;

const VALID_TABS: readonly string[] = TABS.map(t => t.id);

export function Dashboard({ navigate }: { navigate: (to: string) => void }) {
  const { user, signOut } = useAuth();
  const [paths, setPaths] = useState<PathRow[] | null>(null);
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewPayload | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('ALL');

  // دعم رابط «ابدأ من التمهيد» من صفحة تحديد المستوى: ?level=PREA1 مثلًا.
  // يُقبل التبويب فقط إن كان من القيم الصحيحة، وإلا يُتجاهل تمامًا.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('level');
    if (!raw) return;
    if (VALID_TABS.includes(raw)) {
      setSelectedTab(raw);
      return;
    }
    const upper = raw.toUpperCase();
    if (VALID_TABS.includes(upper)) setSelectedTab(upper);
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([api.paths(), api.progress()])
      .then(([p, pr]) => {
        if (!alive) return;
        setPaths(p.paths);
        setProgress(pr);
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
  const style = { fusha: 'العربية الفصحى فقط', eg: 'العامية المصرية', fusha_eg: 'فصحى + توضيح مصري' }[user.explanationStyle];
  const lessons = progress?.lessons ?? [];
  const completedLessons = progress?.totals.lessons_completed ?? 0;
  const totalXp = progress?.stats.xp_total ?? 0;
  // رصيد الجواهر الافتراضية المحسوب من الإنجاز الفعلي
  const gemsCount = (completedLessons * 5) + Math.floor(totalXp / 25);

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
  const nextLessonMatch = nextLesson ? lessons.find(l => l.slug === nextLesson.slug) : undefined;
  const nextTopic = nextLesson
    ? topicForLesson({
        titleAr: nextLesson.title_ar,
        unitTitleAr: nextLesson.unit_title_ar,
        programTitleAr: nextLesson.program_title_ar ?? nextLessonMatch?.program_title_ar,
        programSlug: nextLessonMatch?.program_slug,
      })
    : 'default';

  return (
    <div className="container">
      <header className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-4)' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>أهلًا{user.displayName ? ` يا ${user.displayName}` : ''}</h1>
          <p className="muted small" style={{ margin: 0 }}>
            أسلوب الشرح: <strong>{style}</strong> · الهدف اليومي: <span className="num">{user.dailyGoalMinutes}</span> دقيقة
          </p>
        </div>
        <div className="row">
          <button className="btn secondary sm" onClick={() => navigate('/settings')}>
            <Icon name="settings" size={17} /> الإعدادات
          </button>
          <button className="btn ghost sm" onClick={() => void signOut().then(() => navigate('/'))}>
            <Icon name="logout" size={17} /> خروج
          </button>
        </div>
      </header>

      {loadError && <div className="alert" role="alert">{loadError}</div>}

      {/* بطاقة خطوتك التالية */}
      {nextLesson && (
        <section className="card card-green" data-testid="next-step-hero" style={{ marginBottom: 'var(--s-4)' }}>
          <div className="track-card" style={{ alignItems: 'center' }}>
            <div style={{ width: 96, flex: 'none' }}>
              <TopicScene topic={nextTopic} label={`رسم موضوع درس ${nextLesson.title_ar}`} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="kicker">خطوتك التالية في المسار</span>
              <h2 style={{ margin: '4px 0 6px', fontSize: '1.3rem' }}>{nextLesson.title_ar}</h2>
              <p className="small muted" style={{ margin: 0, display: 'flex', gap: 'var(--s-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                <LevelBadge level={nextLesson.level_code} size="sm" />
                {nextLesson.unit_title_ar ? <span>{nextLesson.unit_title_ar}</span> : null}
                {nextLesson.program_title_ar ? <span>{nextLesson.program_title_ar}</span> : null}
              </p>
              <div style={{ marginTop: 'var(--s-3)' }}>
                <button
                  className="btn"
                  data-testid="next-lesson-btn"
                  onClick={() => navigate(`/learn/${nextLesson.slug}`)}
                >
                  <Icon name="play" size={18} /> ابدأ الدرس الآن
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* دعوة اختبار تحديد المستوى للمتعلمين الجدد */}
      {progress && completedLessons < 5 && (
        <section className="card card-gold" data-testid="placement-cta" style={{ marginBottom: 'var(--s-4)' }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>هل لديك معرفة سابقة بالإسبانية؟</h3>
              <p className="small muted" style={{ margin: 0 }}>
                خُض اختبار تحديد المستوى السريع (10 أسئلة) لتخطي الأساسيات والبدء مباشرة من مستواك المناسب مع كسب نقاط XP!
              </p>
            </div>
            <button className="btn secondary sm" onClick={() => navigate('/placement')}>
              <Icon name="target" size={17} /> ابدأ تحديد المستوى
            </button>
          </div>
        </section>
      )}

      {/* قسم المراجعة المتباعدة */}
      <section className="card" style={{ marginBottom: 'var(--s-4)' }} data-testid="review-cta">
        <SectionHead
          kicker="مراجعة"
          title="المراجعة المتباعدة الذكية"
          desc={
            review === null
              ? 'جارٍ حساب ما هو مستحق…'
              : review.session.totalCards === 0
                ? 'لا بطاقات بعد — إتمام درس يضيف مفرداته تلقائيًا، أو ابدأ حزمة مفردات.'
                : `${review.session.dueNow} بطاقة مستحقة الآن · ${review.session.totalCards} بطاقة في مجموعتك`
          }
          action={(
            <div className="row">
              <button className="btn" onClick={() => navigate('/review')} data-testid="review-start">ابدأ المراجعة</button>
              <button className="btn secondary" onClick={() => navigate('/review/packs')}>حزم المفردات</button>
            </div>
          )}
        />
      </section>

      {/* الإحصاءات والصوت */}
      <div className="grid cols-2">
        <section className="card">
          <SectionHead title="حالة تعلّمك" />
          {progress === null ? (
            <p className="muted small">جارٍ التحميل من الخادم…</p>
          ) : (
            <>
              <div className="row" style={{ gap: 'var(--s-2)', marginBottom: 'var(--s-3)' }}>
                <XpChip xp={progress.stats.xp_total} />
                <GemChip gems={gemsCount} />
              </div>
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
                <div className="stat" data-testid="stat-gems">
                  <b className="num" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-1)' }}>
                    <Icon name="gem" size={20} /> {gemsCount}
                  </b>
                  <span>جواهر</span>
                </div>
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

      {/* خريطة المنهج والدروس */}
      <section className="card" style={{ marginTop: 'var(--s-4)' }}>
        <SectionHead
          kicker="رحلتك"
          title="خريطة المنهج والدروس"
          desc="رحلة تعليمية منظمة خطوة بخطوة من التمهيد وحتى الإتقان"
          action={<span className="small muted num">{filteredLessons.length} درسًا معروضًا</span>}
        />

        {/* شرائح تصفية المستويات */}
        <div
          className="chip-row"
          style={{ marginBottom: 'var(--s-3)', paddingBottom: 'var(--s-2)', borderBottom: '1px solid var(--c-border)' }}
          role="tablist"
          aria-label="تصفية حسب المستوى"
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selectedTab === tab.id}
              className="chip"
              onClick={() => setSelectedTab(tab.id)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {progress === null && <p className="muted small">جارٍ تحميل الدروس…</p>}
        {progress && filteredLessons.length === 0 && (
          <EmptyState title="لا توجد دروس في هذا القسم حاليًا." desc="جرّب تبويبًا آخر من شرائح التصفية أعلاه لعرض دروس مختلفة." />
        )}

        {/* عرض الوحدات المقسمة */}
        {unitGroups.map(group => {
          const unitPct = group.lessons.length > 0 ? Math.round((group.completedCount / group.lessons.length) * 100) : 0;
          return (
            <div className="unit-card" key={group.unitId}>
              <div className="unit-head">
                <div>
                  <h3>{group.unitTitle}</h3>
                  <span className="small muted" style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
                    <LevelBadge level={group.levelCode} size="sm" />
                    {group.programTitle ? <span>{group.programTitle}</span> : null}
                  </span>
                </div>
                <span className="small muted num">
                  {group.completedCount}/{group.lessons.length} مكتمل ({unitPct}%)
                </span>
              </div>

              <div style={{ marginBottom: 'var(--s-3)' }}>
                <ProgressBar value={unitPct} showPct={false} />
              </div>

              {/* دروس الوحدة كصفوف مسار */}
              <div className="journey">
                {group.lessons.map((l, idx) => {
                  const done = l.progress_status === 'completed';
                  const inProgress = l.progress_status === 'in_progress';
                  const isLocked = l.is_unlocked === false;
                  const nodeClass = done ? 'done' : inProgress ? 'current' : isLocked ? 'locked' : '';

                  return (
                    <div className={`journey-node ${nodeClass}`} key={l.slug}>
                      <div className="journey-dot">
                        {done ? <Icon name="check" size={20} /> : isLocked ? <Icon name="lock" size={20} /> : inProgress ? <Icon name="play" size={18} /> : <span className="num">{idx + 1}</span>}
                      </div>
                      <div className="journey-body">
                        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--s-2)' }}>
                          <div style={{ minWidth: 0 }}>
                            <h4>{l.title_ar}</h4>
                            <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
                              <LevelBadge level={l.level_code} size="sm" />
                              {done && <span className="badge primary sm">مكتمل {l.best_accuracy}%</span>}
                              {inProgress && <span className="badge gold sm">قيد الحل</span>}
                            </div>
                            <p className="small muted" style={{ margin: '4px 0 0' }}>
                              {isLocked
                                ? 'مقفل — يتطلب إتمام الدرس السابق أولاً.'
                                : done
                                  ? 'أعد الحل لتحسين الدقة ومراجعة المفاهيم — لا نقاط إضافية عند الإعادة.'
                                  : inProgress
                                    ? 'بدأت هذا الدرس ولم تُكمله بعد.'
                                    : 'متاح للبدء الآن.'}
                            </p>
                          </div>
                          {isLocked ? (
                            <button className="btn sm ghost" disabled title="هذا الدرس مقفل حتى إتمام المتطلبات">
                              <Icon name="lock" size={16} /> مقفل
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
                      </div>
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
        <SectionHead kicker="تطبيق عملي" title="المسارات التطبيقية المتخصصة" />
        {paths === null && <p className="muted small">جارٍ التحميل…</p>}
        {paths && paths.length === 0 && <p className="muted small">لا مسارات منشورة بعد.</p>}
        <ul className="list-plain">
          {(paths ?? []).map(p => {
            const artIcon = p.slug === 'travel' || p.kind === 'travel' ? 'plane' : p.slug === 'callcenter' || p.kind === 'callcenter' ? 'headset' : 'book';
            const artTone = artIcon === 'plane' ? 'blue' : artIcon === 'headset' ? 'gold' : '';
            return (
              <li key={p.slug}>
                <div className="track-card">
                  <div className={`track-art ${artTone}`}>
                    <Icon name={artIcon} size={28} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-2)' }}>
                      <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                        <strong>{p.title_ar}</strong>
                        <LevelBadge level={p.level_code} size="sm" />
                      </div>
                      <span className="small muted">
                        <span className="num">{p.lessons_count}</span> درسًا · <span className="num">{p.units_count}</span> وحدة
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
