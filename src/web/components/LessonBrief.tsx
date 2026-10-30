/**
 * شاشة تعريف الدرس (Lesson brief) — تُعرض قبل التمارين.
 *
 * الغاية: أن يعرف المتعلم ماذا سيتعلم، ولماذا، وما الكلمات التي ستظهر،
 * وكيف تُستخدم في جملة طبيعية، وما الحوار الذي يسمعه. كان هذا الكلام موجودًا
 * في بيانات الدرس ولا يُعرض، فأصبح يُعرض هنا.
 *
 * لا تُعرض مفاتيح الإجابة ولا أي بيانات تصحيح — هذه الشاشة تعليمية فقط.
 */
import { Icon, type IconName } from './icons';
import type { LessonBrief } from '../api';
import { Solecito } from './Illustrations';

interface Props {
  brief: LessonBrief;
  title: string;
  level: string | null;
  exerciseCount: number;
  onStart: () => void;
  onBack: () => void;
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: IconName;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 'var(--s-4)' }}>
      <h2 className="section-title">
        {icon && (
          <Icon
            name={icon}
            size={18}
            style={{ display: 'inline-block', verticalAlign: '-3px', marginInlineEnd: 6 }}
          />
        )}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function LessonBriefView({ brief, title, level, exerciseCount, onStart, onBack }: Props) {
  const vocab = brief.newVocabulary.filter(v => v.word);
  const reviewVocab = brief.reviewVocabulary.filter(v => v.word);

  return (
    <div className="lesson-shell" style={{ paddingBlock: 'var(--s-4)' }}>
      <div className="lesson-top">
        <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'nowrap' }}>
          <button className="lesson-close" onClick={onBack} aria-label="خروج إلى صفحة اليوم">
            <Icon name="close" size={20} />
          </button>
          <div className="lesson-title" style={{ minWidth: 0, flex: 1 }}>
            <h1>{title}</h1>
            <span className="small muted">
              {level ? `${level} · ` : ''}
              {brief.estimatedMinutes > 0 ? `≈ ${brief.estimatedMinutes} دقيقة · ` : ''}
              {exerciseCount} تمرين
            </span>
          </div>
        </div>
      </div>

      <div className="brief-hero" style={{ marginTop: 'var(--s-3)' }}>
        <div>
          <span className="continue-eyebrow">
            <Icon name="target" size={14} /> هدف هذا الدرس
          </span>
          <h1 style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.55rem)' }}>{title}</h1>
          <p>{brief.objectiveAr}</p>
          <div className="brief-meta">
            {level && <span className="badge primary">{level}</span>}
            {brief.estimatedMinutes > 0 && (
              <span className="meta-chip"><Icon name="clock" size={14} /> <span className="num">{brief.estimatedMinutes}</span> دقيقة</span>
            )}
            <span className="meta-chip"><Icon name="book" size={14} /> <span className="num">{exerciseCount}</span> تمرين</span>
            {vocab.length > 0 && (
              <span className="meta-chip"><Icon name="cards" size={14} /> <span className="num">{vocab.length}</span> كلمة جديدة</span>
            )}
          </div>
        </div>
        <Solecito mood="wave" size={120} />
      </div>

      <div className="brief-grid">
        <div className="card">
          {vocab.length > 0 && (
            <Section title="المفردات الجديدة" icon="book">
              <div className="vocab-list">
                {vocab.map(v => (
                  <span className="vocab-chip" key={v.word}>
                    <b className="es">{v.word}</b>
                    <span>{v.meaningFusha ?? v.meaningEg ?? '—'}</span>
                  </span>
                ))}
              </div>
            </Section>
          )}

          {reviewVocab.length > 0 && (
            <Section title="مراجعة مفردات سابقة" icon="refresh">
              <div className="vocab-list">
                {reviewVocab.map(v => (
                  <span className="vocab-chip" key={v.word}>
                    <b className="es">{v.word}</b>
                    <span>{v.meaningFusha ?? v.meaningEg ?? '—'}</span>
                  </span>
                ))}
              </div>
            </Section>
          )}

          {brief.targetStructures.length > 0 && (
            <Section title="جمل وعبارات تُستخدم فعلًا" icon="sparkles">
              <ul className="list-plain" style={{ margin: 0 }}>
                {brief.targetStructures.map((st, i) => (
                  <li key={i}><span className="es" style={{ fontWeight: 700 }}>{st}</span></li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="card">
          {brief.grammarPoints.length > 0 && (
            <Section title="القاعدة" icon="info">
              {brief.grammarPoints.map((gp, gi) => (
                <div key={gi} style={{ marginBottom: gi < brief.grammarPoints.length - 1 ? 'var(--s-3)' : 0 }}>
                  <p style={{ margin: '0 0 var(--s-1)', fontWeight: 800 }}>{gp.titleAr}</p>
                  <p className="small muted" style={{ margin: 0, whiteSpace: 'pre-line' }}>{gp.explanationAr}</p>
                </div>
              ))}
            </Section>
          )}

          {brief.scenarios.length > 0 && (
            <Section title="حوار من الموقف" icon="chat">
              {brief.scenarios.map((sc, i) => (
                <div key={i} style={{ marginBottom: 'var(--s-3)' }}>
                  {(sc.contextAr || sc.settingAr) && (
                    <p className="small muted" style={{ margin: '0 0 var(--s-2)' }}>
                      {sc.contextAr}{sc.settingAr ? ` · ${sc.settingAr}` : ''}
                    </p>
                  )}
                  <div className="dialogue">
                    {sc.lines.map((ln, j) => (
                      <div className="dialogue-line" key={j}>
                        <span className="bubble">
                          <span className="es">{ln.es}</span>
                          <span className="small muted" style={{ display: 'block' }}>{ln.ar}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {brief.culturalNoteAr && (
            <Section title="ملاحظة ثقافية" icon="globe">
              <p style={{ margin: 0 }}>{brief.culturalNoteAr}</p>
            </Section>
          )}
        </div>
      </div>

      {brief.pedagogicalRationaleAr && (
        <p className="small muted" style={{ margin: 'var(--s-3) var(--s-1) 0' }}>
          <Icon name="info" size={14} /> {brief.pedagogicalRationaleAr}
        </p>
      )}

      <div className="row" style={{ marginTop: 'var(--s-5)', justifyContent: 'space-between' }}>
        <button className="btn ghost" onClick={onBack}>لاحقًا</button>
        <button className="btn lg" onClick={onStart} data-testid="lesson-start">
          <Icon name="play" size={18} /> ابدأ التمارين
        </button>
      </div>
    </div>
  );
}
