import { useEffect, useMemo, useState } from 'react';
import { api, type ProgressPayload } from '../api';
import { useAuth } from '../state';
import { Icon } from '../components/icons';
import { ErrorState, LoadingState, ProgressBar, LevelBadge } from '../components/ui';
import { PathMap, groupUnits } from '../components/PathMap';
import { Solecito } from '../components/Illustrations';
import { trackVisual, trackImageSources, trackImageSrcSet } from '../components/tracks';

const LEVELS: { id: string; label: string }[] = [
  { id: 'ALL', label: 'كل المستويات' },
  { id: 'PREA1', label: 'التمهيد Pre-A1' },
  { id: 'A1', label: 'A1' },
  { id: 'A2', label: 'A2' },
  { id: 'B1', label: 'B1' },
  { id: 'B2', label: 'B2' },
  { id: 'C1', label: 'C1' },
  { id: 'travel', label: 'مسار السفر' },
  { id: 'callcenter', label: 'الكول سنتر' },
];

/**
 * خريطة المسار الكاملة — الرحلة البصرية التي يعرف فيها الطالب:
 * أين هو الآن، ما التالي، وما يحتاج إتمامه لفتح البقية.
 * كل الحالات من الخادم؛ لا فتح محلي لأي درس مقفل.
 */
export function Path({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const validFromUrl = (() => {
    const fromUrl = new URLSearchParams(window.location.search).get('level');
    return fromUrl && LEVELS.some(l => l.id === fromUrl) ? fromUrl : null;
  })();
  const [level, setLevel] = useState<string>(() => validFromUrl ?? 'ALL');
  // عرض «كل المستويات» يعني 66 وحدة = صفحة بلا نهاية. إن لم يطلب الطالب
  // مستوى بعينه من الرابط، نفتح مستوى رحلته الحالية مباشرة، ويبقى مبدّل
  // المستويات متاحًا للتنقل.
  // رابط بمستوى غير معروف (?level=XX) كان يمنع التركيز التلقائي ويُبقي رابطًا خاطئًا
  const [autoFocused, setAutoFocused] = useState(() => validFromUrl !== null);

  const load = () => {
    setError(null);
    api
      .progress()
      .then(setProgress)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'تعذّر تحميل المسار.'));
  };

  useEffect(load, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('level') && !validFromUrl && !autoFocused) {
      window.history.replaceState({}, '', '/path');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocused]);

  useEffect(() => {
    if (autoFocused || !progress) return;
    const code = (progress.nextLesson?.level_code ?? '').toUpperCase();
    if (code) {
      setAutoFocused(true);
      if (LEVELS.some(l => l.id === code)) setLevel(code);
    }
  }, [progress, autoFocused]);

  const lessons = progress?.lessons ?? [];
  const filtered = useMemo(
    () =>
      lessons.filter(l => {
        if (level === 'ALL') return true;
        if (level === 'travel') return l.program_slug === 'travel';
        if (level === 'callcenter') return l.program_slug === 'callcenter';
        return (l.level_code ?? '').toUpperCase() === level;
      }),
    [lessons, level],
  );

  const units = useMemo(() => groupUnits(filtered), [filtered]);

  // مسارات متخصصة (السفر / الكول سنتر): واجهة المسار نفسها تعرض تعريفًا
  // حقيقيًا من بيانات البرنامج لا من نص ثابت، مع صورة أصلية محلية.
  const track = useMemo(() => {
    if (level !== 'travel' && level !== 'callcenter') return null;
    const first = filtered[0];
    if (!first) return null;
    const visual = trackVisual(level === 'travel' ? 'travel' : 'call-center', first.program_title_ar ?? '');
    const done = filtered.filter(l => l.progress_status === 'completed').length;
    return {
      title: first.program_title_ar || (level === 'travel' ? 'مسار السفر' : 'مسار الكول سنتر'),
      image: visual.image,
      total: filtered.length,
      done,
      units: groupUnits(filtered).length,
      blurb:
        level === 'travel'
          ? 'مطار، فندق، مطعم ومواقف تحتاجها فعليًا في رحلتك: استمع، ردّد، ثم أجب في مواقف قصيرة.'
          : 'مكالمة خدمة عملاء من البداية للنهاية: افتح المكالمة، افهم الشكوى، اقترح الحل وأغلقها بأدب.',
    };
  }, [level, filtered]);
  const titleBySlug = useMemo(() => {
    const map: Record<string, string> = {};
    for (const l of lessons) map[l.slug] = l.title_ar;
    return map;
  }, [lessons]);
  // الأرقام تتبع العرض الحالي: طالب اختار «مسار السفر» يجب أن يرى تقدمه فيه،
  // لا تقدم المنهج كله (كان يعرض 258 درسًا تحت تصفية من 24 درسًا).
  const scoped = level === 'ALL';
  const completed = scoped
    ? progress?.totals.lessons_completed ?? 0
    : filtered.filter(l => l.progress_status === 'completed').length;
  const total = scoped ? progress?.totals.lessons_total ?? 0 : filtered.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const currentUnit = useMemo(() => {
    const nextSlug = progress?.nextLesson?.slug;
    return units.find(u => u.lessons.some(l => l.slug === nextSlug)) ?? units.find(u => u.completed < u.total) ?? units[0] ?? null;
  }, [units, progress]);

  // درس «التالي» داخل العرض الحالي: التالي الرسمي إن ظهر هنا، وإلا أول درس
  // متاح في هذه التصفية (مفيد في مسارات السفر/الكول سنتر المستقلة عن المنهج).
  const nextInView = useMemo(() => {
    const official = progress?.nextLesson?.slug;
    const match = filtered.find(l => l.slug === official);
    if (match) return match;
    return filtered.find(l => l.progress_status !== 'completed' && l.is_unlocked !== false) ?? null;
  }, [filtered, progress]);

  if (!user) return null;

  return (
    <div className="path-page">
      <header className="path-head">
        <div style={{ minWidth: 0 }}>
          <h1>خريطة مسارك</h1>
          <p className="muted small" style={{ margin: 0 }}>
            {completed} من {total} درسًا مكتملة · {units.length} وحدة
            {scoped ? ' في المنهج الكامل' : ' في هذا العرض'}
          </p>
          <div className="row" style={{ marginTop: 'var(--s-3)', gap: 'var(--s-3)' }}>
            <div style={{ flex: 1, minWidth: 220, maxWidth: 420 }}>
              <ProgressBar value={pct} height={12} label="تقدمك الكلي في المنهج" />
            </div>
            <span className="small muted num">{pct}%</span>
          </div>
        </div>
        <div className="row" style={{ gap: 'var(--s-3)' }}>
          {currentUnit && (
            <span className="badge navy">
              <Icon name="route" size={14} /> الآن: {currentUnit.title}
            </span>
          )}
          <Solecito mood={pct >= 100 ? 'celebrate' : 'think'} size={96} aria-hidden="true" />
        </div>
      </header>

      <div className="level-jump" role="tablist" aria-label="تصفية المستويات">
        {LEVELS.filter(l => l.id === 'ALL' || l.id === 'travel' || l.id === 'callcenter' || lessons.some(x => (x.level_code ?? '').toUpperCase() === l.id)).map(l => (
          <button
            key={l.id}
            role="tab"
            aria-selected={level === l.id}
            className={`level-pill${level === l.id ? ' active' : ''}`}
            onClick={() => {
              setAutoFocused(true);
              setLevel(l.id);
              const next = l.id === 'ALL' ? '/path' : `/path?level=${l.id}`;
              window.history.replaceState({}, '', next);
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {error && <ErrorState title="تعذّر تحميل المسار" description={error} onRetry={load} />}
      {!error && !progress && <LoadingState text="جارٍ تحميل خريطة المسار…" />}

      {track && (
        <section className="track-hero" aria-label={track.title}>
          <picture>
            <source type="image/webp" srcSet={trackImageSources(track.image).webp} sizes="320px" />
            <img
              src={track.image}
              srcSet={trackImageSrcSet(track.image)}
              sizes="320px"
              alt=""
              width={320}
              height={180}
              loading="lazy"
            />
          </picture>
          <div className="track-hero-body">
            <span className="badge navy">
              <Icon name="tracks" size={14} /> مسار متخصص · {level === 'travel' ? 'السفر' : 'الكول سنتر'}
            </span>
            <h2>{track.title}</h2>
            <p className="muted small">{track.blurb}</p>
            <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'wrap' }}>
              <span className="badge">{track.units} وحدة</span>
              <span className="badge">{track.total} درسًا</span>
              <span className="badge navy">
                أنجزت <span className="num">{track.done}</span>
              </span>
            </div>
            <div style={{ maxWidth: 420, marginTop: 'var(--s-2)' }}>
              <ProgressBar
                value={track.total ? Math.round((track.done / track.total) * 100) : 0}
                height={10}
                label={`تقدمك في ${track.title}`}
              />
            </div>
            {(() => {
              // زرّ بدء المسار المتخصص: يفتح أول درس متاح فعليًا في هذا المسار،
              // أو الدرس التالي الرسمي إن كان داخل المسار (لا يفتح درسًا مقفلًا).
              const nextHere = filtered.find(l => l.slug === progress?.nextLesson?.slug);
              const firstOpen = nextHere ?? filtered.find(l => l.is_unlocked !== false && l.progress_status !== 'completed');
              return (
                <button
                  type="button"
                  className="btn primary"
                  style={{ marginTop: 'var(--s-3)' }}
                  disabled={!firstOpen}
                  onClick={() => firstOpen && navigate(`/learn/${firstOpen.slug}`)}
                >
                  <Icon name="play" size={16} />
                  {track.done === track.total && track.total > 0 ? 'راجع دروس المسار' : `ابدأ مسار ${level === 'travel' ? 'السفر' : 'الكول سنتر'}`}
                </button>
              );
            })()}
          </div>
        </section>
      )}

      {progress && (
        <PathMap
          lessons={filtered}
          units={units}
          titleBySlug={titleBySlug}
          nextSlug={progress.nextLesson?.slug}
          reviewDue={progress.review?.dueNow ?? 0}
          onOpenLesson={slug => navigate(`/learn/${slug}`)}
          onOpenReview={() => navigate('/review')}
        />
      )}

      {progress && filtered.length > 0 && nextInView ? (
        <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <div className="row" style={{ gap: 'var(--s-2)' }}>
            <LevelBadge level={nextInView.level_code ?? null} />
            <span className="small muted">التالي في هذا العرض: {nextInView.title_ar}</span>
          </div>
          <button className="btn navy" onClick={() => navigate(`/learn/${nextInView.slug}`)}>
            <Icon name="play" size={17} /> ابدأ الدرس التالي
          </button>
        </div>
      ) : null}
    </div>
  );
}
