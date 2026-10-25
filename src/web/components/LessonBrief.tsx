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
    <div className="container lesson-shell">
      <div className="lesson-top" style={{ marginTop: 'var(--s-4)' }}>
        <button className="btn ghost icon-btn" onClick={onBack} aria-label="خروج إلى لوحتي">
          <Icon name="arrow-right" size={22} />
        </button>
        <div className="lesson-title">
          <h1>{title}{level ? ` · ${level}` : ''}</h1>
        </div>
        <span className="lesson-counter num">{exerciseCount} تمرين</span>
      </div>

      <div className="card" style={{ marginTop: 'var(--s-4)' }}>
        <Section title="هدف هذا الدرس" icon="target">
          <p style={{ margin: 0 }}>{brief.objectiveAr}</p>
          {brief.estimatedMinutes > 0 && (
            <p className="small muted" style={{ marginTop: 'var(--s-2)' }}>
              تقريبًا <span className="num">{brief.estimatedMinutes}</span> دقيقة
            </p>
          )}
        </Section>

        {vocab.length > 0 && (
          <Section title="المفردات الجديدة" icon="book">
            <ul className="vocab-list">
              {vocab.map(v => (
                <li key={v.word}>
                  <span className="es">{v.word}</span>
                  <span className="vocab-meaning">
                    {v.meaningFusha ?? v.meaningEg ?? '—'}
                    {v.meaningEg && v.meaningEg !== v.meaningFusha && (
                      <span className="small muted"> (مصرى: {v.meaningEg})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {reviewVocab.length > 0 && (
          <Section title="مراجعة مفردات سابقة" icon="refresh">
            <ul className="vocab-list">
              {reviewVocab.map(v => (
                <li key={v.word}>
                  <span className="es">{v.word}</span>
                  <span className="vocab-meaning">{v.meaningFusha ?? v.meaningEg ?? '—'}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {brief.targetStructures.length > 0 && (
          <Section title="جمل وعبارات تُستخدم فعلًا" icon="sparkles">
            <ul className="list-plain">
              {brief.targetStructures.map((s, i) => (
                <li key={i}>
                  <span className="es">{s}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {brief.scenarios.length > 0 && (
          <Section title="حوار" icon="chat">
            {brief.scenarios.map((sc, i) => (
              <div key={i} style={{ marginBottom: 'var(--s-3)' }}>
                {(sc.contextAr || sc.settingAr) && (
                  <p className="small muted" style={{ margin: '0 0 var(--s-2)' }}>
                    {sc.contextAr}{sc.settingAr ? ` · ${sc.settingAr}` : ''}
                  </p>
                )}
                <ul className="list-plain" style={{ margin: 0, paddingInlineStart: 'var(--s-4)' }}>
                  {sc.lines.map((ln, j) => (
                    <li key={j}>
                      <span className="es">{ln.es}</span>
                      <span className="small muted" style={{ display: 'block' }}>{ln.ar}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {brief.culturalNoteAr && (
          <Section title="ملاحظة" icon="info">
            <p style={{ margin: 0 }}>{brief.culturalNoteAr}</p>
          </Section>
        )}

        {brief.pedagogicalRationaleAr && (
          <Section title="لماذا هذا الترتيب؟" icon="info">
            <p className="small muted" style={{ margin: 0 }}>{brief.pedagogicalRationaleAr}</p>
          </Section>
        )}

        <div className="row" style={{ marginTop: 'var(--s-5)', justifyContent: 'flex-end' }}>
          <button className="btn navy" onClick={onStart} data-testid="lesson-start">
            <Icon name="play" size={18} /> ابدأ التمارين
          </button>
        </div>
      </div>
    </div>
  );
}
