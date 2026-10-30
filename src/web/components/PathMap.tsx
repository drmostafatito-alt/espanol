import { useMemo, useState } from 'react';
import type { ProgressLessonItem } from '../api';
import { Icon } from './icons';
import { SceneIllustration, sceneFor, type SceneKind } from './Illustrations';
import { ProgressBar } from './ui';

/**
 * خريطة المسار العمودية: وحدات متتابعة + دروس متصلة + محطات مراجعة.
 *
 * قاعدة الحسم: حالة العقدة (مكتمل/حالي/متاح/مقفل) تأتي من الخادم فقط
 * (`progress_status` و`is_unlocked`)، والواجهة لا تفتح درسًا مقفلًا أبدًا.
 * محطة المراجعة تُعرض فقط بعد إتمام كل دروس الوحدة، وتفتح صفحة المراجعة
 * الحقيقية (بطاقات SRS المستحقة) — لا اختبار وهمي.
 */

export interface PathUnit {
  id: string;
  title: string;
  level: string | null;
  programSlug: string;
  programTitle: string;
  lessons: ProgressLessonItem[];
  completed: number;
  total: number;
  locked: boolean;
  scene: SceneKind;
}

/** يجمع الدروس في وحدات مرتّبة كما وصلت من الخادم (نفس ترتيب المنهج) */
export function groupUnits(lessons: ProgressLessonItem[]): PathUnit[] {
  const units: PathUnit[] = [];
  const index = new Map<string, PathUnit>();
  for (const lesson of lessons) {
    const id = lesson.unit_id || lesson.unit_slug || `unit-${lesson.slug}`;
    let unit = index.get(id);
    if (!unit) {
      const title = lesson.unit_title_ar || lesson.program_title_ar || 'وحدة تعليمية';
      unit = {
        id,
        title,
        level: lesson.level_code ?? null,
        programSlug: lesson.program_slug ?? 'main-track',
        programTitle: lesson.program_title_ar ?? 'المسار الأساسي',
        lessons: [],
        completed: 0,
        total: 0,
        locked: true,
        scene: sceneFor(`${title} ${lesson.program_title_ar ?? ''}`),
      };
      index.set(id, unit);
      units.push(unit);
    }
    unit.lessons.push(lesson);
    unit.total += 1;
    if (lesson.progress_status === 'completed') unit.completed += 1;
    if (lesson.is_unlocked !== false) unit.locked = false;
  }
  return units;
}

export function PathMap({
  lessons,
  nextSlug,
  onOpenLesson,
  onOpenReview,
  reviewDue = 0,
  titleBySlug = {},
  units: unitsProp,
}: {
  lessons: ProgressLessonItem[];
  /** وحدات محسوبة مسبقًا من الصفحة (تجنّب تجميع مكرر على المسارات الطويلة) */
  units?: PathUnit[];
  nextSlug?: string | null;
  onOpenLesson: (slug: string) => void;
  onOpenReview: () => void;
  reviewDue?: number;
  /** عناوين الدروس المطلوبة (slug → title) حتى يُفهم سبب القفل بلغة الطالب */
  titleBySlug?: Record<string, string>;
}) {
  const groupedUnits = useMemo(() => groupUnits(lessons), [lessons]);
  const units = unitsProp ?? groupedUnits;
  // الطيّ: خريطة كاملة بلا نهاية تُرهق الطالب. نفتح وحدة الطالب الحالية فقط
  // افتراضيًا، ونطوي ما قبلها وما بعدها في صفوف ملخّصة قابلة للفتح.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [allOpen, setAllOpen] = useState(false);

  const currentUnitId = useMemo(() => {
    const byNext = units.find(u => u.lessons.some(l => l.slug === nextSlug));
    if (byNext) return byNext.id;
    const byProgress = units.find(u => u.completed > 0 && u.completed < u.total);
    if (byProgress) return byProgress.id;
    const firstOpen = units.find(u => !u.locked);
    return (firstOpen ?? units[0])?.id ?? null;
  }, [units, nextSlug]);

  // نافذة عرض: 66 وحدة في صفحة واحدة تُربك الطالب. نعرض 8 وحدات حول وحدته
  // الحالية مع تنقّل واضح لما قبلها وما بعدها.
  const WINDOW = 8;
  const [windowOffset, setWindowOffset] = useState<number | null>(null);
  const focusIndex = Math.max(0, units.findIndex(u => u.id === currentUnitId));
  const maxStart = Math.max(0, units.length - WINDOW);
  const start = Math.min(windowOffset ?? Math.max(0, focusIndex - 2), maxStart);
  const visibleUnits = units.length > WINDOW ? units.slice(start, start + WINDOW) : units;
  const beforeCount = start;
  const afterCount = Math.max(0, units.length - (start + visibleUnits.length));
  // هل وحدة الطالب الحالية داخل النافذة المعروضة؟
  const inWindow = focusIndex >= start && focusIndex < start + visibleUnits.length;

  const isOpen = (unit: PathUnit) => allOpen || (overrides[unit.id] ?? unit.id === currentUnitId);
  const toggle = (unit: PathUnit) => {
    // وحدة الطالب الحالية تحمل درسه التالي: لا تُطوى حتى لا يختفي التالي من الخريطة
    if (unit.id === currentUnitId) return;
    setAllOpen(false);
    setOverrides(prev => ({ ...prev, [unit.id]: !isOpen(unit) }));
  };

  if (units.length === 0) {
    return (
      <div className="state-box">
        <div className="state-icon"><Icon name="route" size={30} /></div>
        <h3>لا دروس في هذا القسم بعد</h3>
        <p className="muted small">اختر مستوى آخر من الأعلى، أو ابدأ من المسار الأساسي.</p>
      </div>
    );
  }

  return (
    <div className="path-map">
      {units.length > WINDOW && focusIndex >= 0 && !inWindow ? (
        <button
          type="button"
          className="path-window-btn current-return"
          onClick={() => setWindowOffset(null)}
        >
          <Icon name="target" size={16} /> العودة إلى وحدتك الحالية
          {nextSlug && titleBySlug[nextSlug] ? ` — ${titleBySlug[nextSlug]}` : ''}
        </button>
      ) : null}

      {beforeCount > 0 ? (
        <button
          type="button"
          className="btn secondary sm path-window-btn"
          onClick={() => setWindowOffset(Math.max(0, start - WINDOW))}
        >
          <Icon name="chevron-up" size={16} /> عرض {beforeCount} وحدة سابقة
        </button>
      ) : null}

      {visibleUnits.map((unit, i) => {
        const unitIndex = start + i;
        const pct = unit.total ? Math.round((unit.completed / unit.total) * 100) : 0;
        const allDone = unit.total > 0 && unit.completed === unit.total;
        const open = isOpen(unit);
        const isCurrent = unit.id === currentUnitId;
        const panelId = `unit-panel-${unit.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
        return (
          <section
            className={`unit-block${unit.locked ? ' locked-unit' : ''}${open ? ' open' : ' collapsed'}${
              isCurrent ? ' is-current' : ''
            }`}
            key={unit.id}
            aria-label={`وحدة ${unitIndex + 1}: ${unit.title}`}
          >
            <header className="unit-head">
              <div className="unit-scene">
                <SceneIllustration kind={unit.scene} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h2>
                  {unit.title}
                  {isCurrent ? <span className="unit-now">وحدتك الآن</span> : null}
                </h2>
                <p className="unit-sub">
                  وحدة {unitIndex + 1} · {unit.level || unit.programTitle}
                  {!open ? ` · ${unit.completed}/${unit.total} درسًا` : ''}
                </p>
                {!open ? (
                  <p className="unit-locked-hint">
                    {unit.locked ? (
                      <>
                        <Icon name="lock" size={13} /> تُفتح بعد إتمام الدروس السابقة
                      </>
                    ) : allDone ? (
                      <>
                        <Icon name="check" size={13} /> أتممت هذه الوحدة — اضغط للعرض
                      </>
                    ) : (
                      'اضغط لعرض دروس الوحدة'
                    )}
                  </p>
                ) : null}
              </div>
              <div className="unit-head-progress">
                {open ? <ProgressBar value={pct} height={8} label={`تقدم وحدة ${unit.title}`} /> : null}
                <span className="unit-count num">{unit.completed}/{unit.total}</span>
              </div>
              <button
                type="button"
                className={`unit-toggle${open ? ' open' : ''}`}
                onClick={() => toggle(unit)}
                disabled={isCurrent}
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={
                  isCurrent
                    ? `وحدة ${unit.title} — وحدتك الحالية، تبقى مفتوحة لأنها تحمل درسك التالي`
                    : open
                      ? `طيّ وحدة ${unit.title}`
                      : `عرض وحدة ${unit.title}`
                }
                title={isCurrent ? 'وحدتك الحالية تبقى مفتوحة' : undefined}
              >
                <Icon name="chevron-down" size={18} />
              </button>
            </header>

            {open ? (
            <div className="path-track-v" id={panelId}>
              {unit.lessons.map((lesson, i) => {
                const done = lesson.progress_status === 'completed';
                const current = !done && lesson.slug === nextSlug;
                const inProgress = !done && lesson.progress_status === 'in_progress';
                const locked = lesson.is_unlocked === false && !done;
                const minutes = lesson.estimated_minutes ?? null;
                const cls = ['node-row', done ? 'done' : '', current ? 'current' : '', locked ? 'locked' : '']
                  .filter(Boolean)
                  .join(' ');
                const badge = done ? 'مكتمل' : current ? 'التالي' : inProgress ? 'قيد الحل' : locked ? 'مقفل' : 'متاح';
                const prereqTitles = (lesson.missing_prerequisites ?? []).map(slug => titleBySlug[slug] ?? slug);
                const note = locked
                  ? `يتطلب أولًا: ${prereqTitles.join('، ') || 'إتمام الدرس السابق'}`
                  : done
                    ? `أفضل نتيجة ${lesson.best_accuracy}% — الإعادة لا تمنح نقاطًا إضافية`
                    : current
                      ? 'درسك التالي في المسار'
                      : inProgress
                        ? 'بدأت هذا الدرس ولم تُكمله'
                        : 'متاح للبدء الآن';
                return (
                  <div className={cls} key={lesson.slug}>
                    <button
                      type="button"
                      className={`node-btn${done ? ' done' : current ? ' current' : locked ? ' locked' : ''}`}
                      onClick={() => !locked && onOpenLesson(lesson.slug)}
                      disabled={locked}
                      aria-label={`الدرس ${i + 1}: ${lesson.title_ar}. ${note}`}
                      aria-current={current ? 'step' : undefined}
                      title={note}
                    >
                      {done ? (
                        <Icon name="check" size={24} />
                      ) : locked ? (
                        <Icon name="lock" size={21} />
                      ) : current ? (
                        <Icon name="play" size={22} />
                      ) : (
                        <span className="num">{i + 1}</span>
                      )}
                    </button>

                    <div className="node-main">
                      <b className="node-title">{lesson.title_ar}</b>
                      <div className="node-meta">
                        <span className={`node-badge${done ? ' done' : current ? ' current' : ''}`}>
                          {done ? <Icon name="check" size={12} /> : null}
                          {badge}
                        </span>
                        {lesson.level_code ? (
                          <span className="node-badge plain">{lesson.level_code}</span>
                        ) : null}
                        {minutes ? (
                          <span className="node-badge plain">
                            <Icon name="clock" size={12} /> <span className="num">{minutes}</span> د
                          </span>
                        ) : null}
                      </div>
                      <p className="node-note">{note}</p>
                    </div>

                    {!locked ? (
                      <button
                        type="button"
                        className={`btn sm ${done ? 'secondary' : 'navy'} node-action`}
                        onClick={() => onOpenLesson(lesson.slug)}
                      >
                        {done ? 'مراجعة' : inProgress ? 'متابعة' : 'ابدأ'}
                      </button>
                    ) : (
                      <span className="node-action node-lock" aria-hidden="true">
                        <Icon name="lock" size={18} />
                      </span>
                    )}
                  </div>
                );
              })}

              {allDone ? (
                <div className="node-row checkpoint-row">
                  <button
                    type="button"
                    className="node-btn checkpoint"
                    onClick={onOpenReview}
                    aria-label="محطة مراجعة الوحدة — افتح بطاقات المراجعة المستحقة"
                  >
                    <Icon name="star" size={22} />
                  </button>
                  <div className="node-main">
                    <b className="node-title">محطة مراجعة الوحدة</b>
                    <p className="node-note">
                      {reviewDue > 0
                        ? `${reviewDue} بطاقة مستحقة الآن — ثبّت مفردات هذه الوحدة قبل التالي`
                        : 'لا بطاقات مستحقة الآن — المراجعة تُفتح عند استحقاقها'}
                    </p>
                  </div>
                  <button type="button" className="btn sm secondary node-action" onClick={onOpenReview}>
                    <Icon name="cards" size={16} /> المراجعة
                  </button>
                </div>
              ) : null}
            </div>
            ) : null}
          </section>
        );
      })}

      {afterCount > 0 ? (
        <button
          type="button"
          className="btn secondary sm path-window-btn"
          onClick={() => setWindowOffset(Math.min(maxStart, start + WINDOW))}
        >
          عرض {afterCount} وحدة تالية <Icon name="chevron-down" size={16} />
        </button>
      ) : null}

      {units.length > 1 ? (
        <div className="path-map-foot">
          <button type="button" className="btn secondary sm" onClick={() => { setOverrides({}); setAllOpen(v => !v); }}>
            {allOpen ? 'اطوِ كل الوحدات' : 'افتح كل الوحدات في هذه النافذة'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
