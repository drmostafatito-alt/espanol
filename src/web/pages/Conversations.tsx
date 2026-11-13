import { useCallback, useEffect, useState } from 'react';
import { api, type ConversationsHubPayload, type ScenarioDomain } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { Icon } from '../components/icons';
import { BidiText, EmptyState, ErrorState, extractSpanishForAudio, LevelBadge, LoadingState } from '../components/ui';

const DOMAINS: { id: 'all' | ScenarioDomain; label: string }[] = [
  { id: 'all', label: 'كل المواقف' },
  { id: 'callcenter', label: 'الكول سنتر' },
  { id: 'travel', label: 'السفر والفنادق' },
  { id: 'food', label: 'المقاهي والمطاعم' },
  { id: 'shopping', label: 'التسوق' },
  { id: 'work', label: 'العمل والمقابلات' },
  { id: 'health', label: 'الصحة والطوارئ' },
  { id: 'everyday', label: 'الحياة اليومية' },
];

export function Conversations({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [data, setData] = useState<ConversationsHubPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<'all' | ScenarioDomain>('all');
  const [rolePlayMode, setRolePlayMode] = useState<Record<string, boolean>>({});
  const [revealedLines, setRevealedLines] = useState<Record<string, number>>({});
  const [quizChoice, setQuizChoice] = useState<Record<string, string>>({});
  const [showEg, setShowEg] = useState(user?.explanationStyle !== 'fusha');

  const load = useCallback(() => {
    setError(null);
    api
      .conversationsHub({ domain: domain === 'all' ? undefined : domain })
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'تعذّر تحميل المحادثات.'));
  }, [domain]);

  useEffect(load, [load]);
  useEffect(() => () => { void audioService.stop(); }, []);

  const playLine = (key: string, text: string, rate = 1.0) => {
    if (audioService.getRate() !== rate) {
      audioService.stop();
    }
    audioService.setRate(rate);
    void audioService.play({ key, text, variant: user?.audioVariant });
  };

  if (!user) return null;

  const masteredScenariosCount = data
    ? data.scenarios.filter(sc => {
        const targetLine = sc.lines[Math.min(1, sc.lines.length - 1)];
        return targetLine && quizChoice[sc.id] === targetLine.es;
      }).length
    : 0;

  return (
    <div className="hub-page">
      <header className="hub-hero">
        <div>
          <span className="continue-eyebrow">
            <Icon name="chat" size={14} /> مواقف التواصل الحقيقية
          </span>
          <h1>المحادثات التفاعلية ومحاكاة الكول سنتر</h1>
          <p className="muted">
            حوارات عملية جاهزة للاستماع، مع تحدي اختيار الرد المناسب في كل موقف ومسار متخصص لخدمة العملاء.
          </p>
        </div>
        <div className="hub-hero-actions">
          <span className="badge success num" style={{ alignSelf: 'center' }}>
            🏆 {masteredScenariosCount} موقف مُتقن في هذه الجلسة
          </span>
          <button type="button" className="btn secondary" onClick={() => setShowEg(v => !v)}>
            {showEg ? 'عرض الفصحى فقط' : 'إظهار العامية المصرية'}
          </button>
          <button type="button" className="btn navy" onClick={() => setDomain('callcenter')}>
            <Icon name="headset" size={17} /> مسار الكول سنتر
          </button>
        </div>
      </header>

      <div className="hub-controls card tight">
        <div className="tabs-row" role="tablist" aria-label="مجال المحادثة" style={{ margin: 0 }}>
          {DOMAINS.map(d => {
            const count = d.id === 'all'
              ? Object.values(data?.domainCounts ?? {}).reduce((a, b) => a + b, 0)
              : data?.domainCounts?.[d.id] ?? 0;
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={domain === d.id}
                className={`level-pill${domain === d.id ? ' active' : ''}`}
                onClick={() => setDomain(d.id)}
              >
                {d.label} {data ? <span className="num">({count})</span> : ''}
              </button>
            );
          })}
        </div>
      </div>

      {domain === 'callcenter' && (
        <section className="card callcenter-banner" aria-label="خريطة مكالمة خدمة العملاء">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
            <strong><Icon name="headset" size={17} style={{ display: 'inline', verticalAlign: '-3px' }} /> مراحل مكالمة الكول سنتر الاحترافية</strong>
            <span className="small muted">فعّل وضع «تمثيل الدور» في أي سيناريو لاختبار ردّك قبل كشفه</span>
          </div>
          <div className="cc-phases">
            <span>١. الوضوح الصوتي</span>
            <span>٢. الاستقبال والتحقق</span>
            <span>٣. تشخيص المشكلة</span>
            <span>٤. تقديم الحل</span>
            <span>٥. تهدئة الشكاوى</span>
            <span>٦. التصعيد والإغلاق</span>
          </div>
        </section>
      )}

      {error && <ErrorState title="تعذّر تحميل المحادثات" description={error} onRetry={load} />}
      {!error && !data && <LoadingState text="جارٍ تحميل سيناريوهات المحادثة…" />}

      {data && data.scenarios.length === 0 && (
        <EmptyState
          icon="chat"
          title="لا محادثات في هذا القسم"
          description="اختر مجالًا آخر أو استعرض كل المواقف."
          action={<button type="button" className="btn secondary sm" onClick={() => setDomain('all')}>كل المواقف</button>}
        />
      )}

      {data && data.scenarios.length > 0 && (
        <div className="scenarios-list">
          {data.scenarios.map((sc, scIdx) => {
            const isRolePlay = !!rolePlayMode[sc.id];
            const visibleCount = isRolePlay ? (revealedLines[sc.id] ?? 1) : sc.lines.length;
            const promptLine = sc.lines[0];
            const replyLine = sc.lines[Math.min(1, sc.lines.length - 1)];
            const otherScenario = data.scenarios[(scIdx + 1) % data.scenarios.length];
            const distractor1 =
              otherScenario?.lines[0]?.es && otherScenario.lines[0].es !== replyLine?.es
                ? otherScenario.lines[0].es
                : 'No sé dónde está la estación de tren.';
            const distractor2 =
              sc.lines.length > 2 && sc.lines[sc.lines.length - 1]?.es !== replyLine?.es
                ? sc.lines[sc.lines.length - 1]!.es
                : 'Perdón, ahora no puedo hablar.';
            const options = replyLine ? [replyLine.es, distractor1, distractor2] : [];
            const chosen = quizChoice[sc.id] ?? null;
            const isCorrectChoice = chosen !== null && replyLine && chosen === replyLine.es;

            return (
              <article className="card scenario-card" key={sc.id}>
                <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
                  <div className="row" style={{ gap: 'var(--s-2)' }}>
                    <LevelBadge level={sc.level} />
                    {sc.callCenterPhase && <span className="badge primary">{sc.callCenterPhase.labelAr}</span>}
                    <span className="small muted">{sc.settingAr}</span>
                    {isCorrectChoice ? <span className="badge success">✓ أتقنت الرد</span> : null}
                  </div>
                  <div className="row" style={{ gap: 'var(--s-2)' }}>
                    <button
                      type="button"
                      className={`btn sm ${isRolePlay ? 'primary' : 'secondary'}`}
                      onClick={() => {
                        setRolePlayMode(prev => ({ ...prev, [sc.id]: !isRolePlay }));
                        setRevealedLines(prev => ({ ...prev, [sc.id]: 1 }));
                      }}
                    >
                      <Icon name="chat" size={15} /> {isRolePlay ? 'إظهار الحوار كاملًا' : 'وضع تمثيل الدور'}
                    </button>
                    <button
                      type="button"
                      className={`btn sm ${sc.isUnlocked ? 'navy' : 'ghost'}`}
                      disabled={!sc.isUnlocked}
                      onClick={() => sc.isUnlocked && navigate(`/learn/${sc.lessonSlug}`)}
                    >
                      {sc.isUnlocked ? 'افتح الدرس' : 'مقفل'}
                    </button>
                  </div>
                </div>

                <h2 style={{ margin: 'var(--s-2) 0 4px', fontSize: '1.12rem' }}>{sc.lessonTitleAr}</h2>
                <p className="small muted" style={{ margin: '0 0 var(--s-3)' }}>{sc.contextAr}</p>

                <div className="dialogue-studio">
                  {sc.lines.slice(0, visibleCount).map((ln, idx) => {
                    const isSecondSpeaker = idx % 2 === 1;
                    return (
                      <div className={`studio-turn ${isSecondSpeaker ? 'speaker-b' : 'speaker-a'}`} key={idx}>
                        <div className="studio-turn-head">
                          <span className="small" style={{ fontWeight: 800 }}>
                            {sc.domain === 'callcenter'
                              ? (isSecondSpeaker ? 'العميل' : 'الموظف')
                              : (isSecondSpeaker ? 'الطرف الثاني' : 'المتحدث الأول')}
                          </span>
                          <div className="row" style={{ gap: 4 }}>
                            <button
                              type="button"
                              className="btn ghost sm icon-btn"
                              aria-label={`استمع للجملة ${idx + 1}`}
                              onClick={() => playLine(ln.audioKey || `${sc.id}-${idx}`, ln.es, 1.0)}
                            >
                              <Icon name="volume" size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn ghost sm"
                              style={{ minHeight: 32, padding: '2px 8px', fontSize: '0.78rem' }}
                              onClick={() => playLine(ln.audioKey || `${sc.id}-${idx}`, ln.es, 0.75)}
                            >
                              0.75x
                            </button>
                          </div>
                        </div>
                        <p className="es studio-es" dir="ltr">{ln.es}</p>
                        <p className="small studio-ar">{ln.ar}</p>
                        {showEg && ln.arEg && (
                          <p className="small muted" style={{ margin: '2px 0 0' }}>بالمصرية: {ln.arEg}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isRolePlay && visibleCount < sc.lines.length && (
                  <div className="row" style={{ marginTop: 'var(--s-3)', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="btn secondary sm"
                      onClick={() => setRevealedLines(prev => ({ ...prev, [sc.id]: visibleCount + 1 }))}
                    >
                      اكشف الرد التالي ({visibleCount}/{sc.lines.length})
                    </button>
                  </div>
                )}

                {/* تحدي الرد التفاعلي للمحادثة (§9) */}
                {promptLine && replyLine && sc.lines.length >= 2 && (
                  <div
                    style={{
                      marginTop: 'var(--s-3)',
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        🎯 تمرين الرد التفاعلي: لو قال لك المتحدث «<span className="es" dir="ltr">{promptLine.es}</span>»، ما أنسب رد في هذا الموقف؟
                      </strong>
                      {chosen ? (
                        <span className={`badge ${isCorrectChoice ? 'success' : 'danger'}`}>
                          {isCorrectChoice ? 'إجابة صحيحة! +10 XP' : 'حاول مرة أخرى'}
                        </span>
                      ) : null}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {options.map((optEs, oIdx) => {
                        const isSelected = chosen === optEs;
                        const isRight = optEs === replyLine.es;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            className={`btn sm ${
                              isSelected
                                ? isRight
                                  ? 'primary'
                                  : 'danger'
                                : 'secondary'
                            }`}
                            onClick={() => {
                              setQuizChoice(prev => ({ ...prev, [sc.id]: optEs }));
                              if (isRight) {
                                playLine(replyLine.audioKey || `${sc.id}-reply`, replyLine.es, 1.0);
                              }
                            }}
                          >
                            <span className="es" dir="ltr">{optEs}</span>
                          </button>
                        );
                      })}
                    </div>
                    {chosen && (
                      <p className="small muted" style={{ margin: '8px 0 0' }}>
                        {isCorrectChoice
                          ? `أحسنت! المعنى: «${replyLine.ar}» — رد مناسب تمامًا لسياق «${sc.settingAr}».`
                          : `الرد الأنسب في هذا السياق هو: «${replyLine.es}» بمعنى «${replyLine.ar}».`}
                      </p>
                    )}
                  </div>
                )}

                {sc.keyPhrases.length > 0 && (
                  <div className="vocab-list" style={{ marginTop: 'var(--s-3)' }}>
                    {sc.keyPhrases.map((p, i) => (
                      <button
                        type="button"
                        key={i}
                        className="vocab-chip phrase-btn"
                        onClick={() => playLine(`${sc.id}-kp-${i}`, extractSpanishForAudio(p))}
                      >
                        <b><BidiText text={p} /></b>
                        <Icon name="volume" size={14} />
                      </button>
                    ))}
                  </div>
                )}

                {sc.culturalNoteAr && (
                  <p className="small muted" style={{ margin: 'var(--s-3) 0 0' }}>
                    <Icon name="globe" size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> <BidiText text={sc.culturalNoteAr} />
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

