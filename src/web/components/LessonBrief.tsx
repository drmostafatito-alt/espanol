/**
 * شاشة تعريف الدرس (Lesson brief) — تُعرض قبل التمارين.
 *
 * الغاية: أن يعرف المتعلم ماذا سيتعلم، ولماذا، وما الكلمات التي ستظهر،
 * وكيف تُستخدم في جملة طبيعية، وما الحوار الذي يسمعه. كان هذا الكلام موجودًا
 * في بيانات الدرس ولا يُعرض، فأصبح يُعرض هنا.
 *
 * لا تُعرض مفاتيح الإجابة ولا أي بيانات تصحيح — هذه الشاشة تعليمية فقط.
 */
import { useEffect, useState } from 'react';
import { Icon, type IconName } from './icons';
import type { LessonBrief, VocabBriefItem } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { posLabelAr } from '../pages/Vocabulary';
import { Solecito } from './Illustrations';

interface Props {
  brief: LessonBrief;
  title: string;
  level: string | null;
  exerciseCount: number;
  onStart: () => void;
  onBack: () => void;
  startLabel?: string;
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

function VocabIntroCard({
  item,
  showEg,
  onPlay,
}: {
  item: VocabBriefItem;
  showEg: boolean;
  onPlay: (key: string, text: string) => void;
}) {
  const posText = posLabelAr(item.pos, item.gender);
  return (
    <article className="vocab-intro-card">
      <div className="vocab-intro-top">
        <div className="row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <b className="es vocab-intro-word" dir="ltr">{item.word}</b>
          {posText && <span className="badge navy">{posText}</span>}
          {item.ipa && <span className="small muted" dir="ltr">[{item.ipa}]</span>}
        </div>
        <button
          type="button"
          className="btn ghost sm icon-only-btn"
          onClick={() => onPlay(`brief-word-${item.word}`, item.word)}
          aria-label={`استمع إلى ${item.word}`}
        >
          <Icon name="volume" size={16} />
        </button>
      </div>

      <p className="vocab-intro-meaning">
        {item.meaningFusha ?? item.meaningEg ?? '—'}
        {showEg && item.meaningEg && item.meaningEg !== item.meaningFusha ? (
          <span className="small muted"> · بالمصرية: {item.meaningEg}</span>
        ) : null}
      </p>

      {item.pronunciationHintAr && (
        <p className="small muted" style={{ margin: '2px 0 0' }}>
          النطق التقريبي: {item.pronunciationHintAr}
        </p>
      )}

      {item.exampleEs && (
        <div className="vocab-intro-example">
          <div className="row" style={{ justifyContent: 'space-between', gap: 6 }}>
            <span className="es small" dir="ltr">{item.exampleEs}</span>
            <button
              type="button"
              className="btn ghost sm icon-only-btn"
              onClick={() => onPlay(`brief-ex-${item.word}`, item.exampleEs!)}
              aria-label={`استمع إلى مثال ${item.word}`}
            >
              <Icon name="volume" size={14} />
            </button>
          </div>
          {item.exampleAr && <span className="small muted">{item.exampleAr}</span>}
        </div>
      )}

      {item.usageNoteAr && (
        <p className="small muted" style={{ margin: '4px 0 0' }}>
          💡 {item.usageNoteAr}
        </p>
      )}
      {item.commonErrorAr && (
        <p className="small error-text" style={{ margin: '4px 0 0' }}>
          انتبه: {item.commonErrorAr}
        </p>
      )}
    </article>
  );
}

export function LessonBriefView({
  brief,
  title,
  level,
  exerciseCount,
  onStart,
  onBack,
  startLabel = 'ابدأ التمارين',
}: Props) {
  const { user } = useAuth();
  const [showEg, setShowEg] = useState(user?.explanationStyle !== 'fusha');
  const vocab = brief.newVocabulary.filter(v => v.word);
  const reviewVocab = brief.reviewVocabulary.filter(v => v.word);
  const mistakes = brief.commonMistakesAr ?? [];

  useEffect(() => {
    return () => {
      void audioService.stop();
    };
  }, []);

  const playText = (key: string, text: string) => {
    audioService.setRate(1.0);
    void audioService.play({ key, text, variant: user?.audioVariant });
  };

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
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => setShowEg(v => !v)}
            aria-pressed={showEg}
          >
            {showEg ? 'إخفاء العامية' : 'إظهار العامية'}
          </button>
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
              <div className="vocab-intro-grid">
                {vocab.map(v => (
                  <VocabIntroCard key={v.word} item={v} showEg={showEg} onPlay={playText} />
                ))}
              </div>
            </Section>
          )}

          {reviewVocab.length > 0 && (
            <Section title="مراجعة مفردات سابقة" icon="refresh">
              <div className="vocab-list">
                {reviewVocab.map(v => (
                  <span className="vocab-chip" key={v.word}>
                    <b className="es" dir="ltr">{v.word}</b>
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
                  <li key={i} className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
                    <span className="es" dir="ltr" style={{ fontWeight: 700 }}>{st}</span>
                    <button
                      type="button"
                      className="btn ghost sm icon-only-btn"
                      onClick={() => playText(`brief-st-${i}`, st)}
                      aria-label={`استمع إلى ${st}`}
                    >
                      <Icon name="volume" size={15} />
                    </button>
                  </li>
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

          {mistakes.length > 0 && (
            <Section title="أخطاء شائعة تجنّبها" icon="warning">
              <ul className="grammar-mistakes" style={{ margin: 0 }}>
                {mistakes.map((m, i) => (
                  <li key={i} className="small">{m}</li>
                ))}
              </ul>
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
                        <div className="bubble" style={{ width: '100%' }}>
                          <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
                            <span className="es" dir="ltr" style={{ fontWeight: 700 }}>{ln.es}</span>
                            <button
                              type="button"
                              className="btn ghost sm icon-only-btn"
                              onClick={() => playText(`brief-sc-${i}-${j}`, ln.es)}
                              aria-label={`استمع إلى السطر ${j + 1}`}
                            >
                              <Icon name="volume" size={14} />
                            </button>
                          </div>
                          <span className="small muted" style={{ display: 'block' }}>{ln.ar}</span>
                          {showEg && ln.arEg && ln.arEg !== ln.ar && (
                            <span className="small muted" style={{ display: 'block' }}>بالمصرية: {ln.arEg}</span>
                          )}
                        </div>
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
          <Icon name="play" size={18} /> {startLabel}
        </button>
      </div>
    </div>
  );
}
