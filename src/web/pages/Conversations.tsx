import { useCallback, useEffect, useState } from 'react';
import { api, type ConversationsHubPayload, type ScenarioDomain } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { Icon } from '../components/icons';
import { EmptyState, ErrorState, LevelBadge, LoadingState } from '../components/ui';

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
    audioService.setRate(rate);
    void audioService.play({ key, text, variant: user?.audioVariant });
  };

  if (!user) return null;

  return (
    <div className="hub-page">
      <header className="hub-hero">
        <div>
          <span className="continue-eyebrow">
            <Icon name="chat" size={14} /> مواقف التواصل الحقيقية
          </span>
          <h1>المحادثات ومحاكاة الكول سنتر</h1>
          <p className="muted">
            حوارات عملية جاهزة للاستماع وتمثيل الأدوار، مع مسار متخصص لخدمة العملاء من استقبال المكالمة حتى إغلاقها.
          </p>
        </div>
        <div className="hub-hero-actions">
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
          {data.scenarios.map(sc => {
            const isRolePlay = !!rolePlayMode[sc.id];
            const visibleCount = isRolePlay ? (revealedLines[sc.id] ?? 1) : sc.lines.length;
            return (
              <article className="card scenario-card" key={sc.id}>
                <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
                  <div className="row" style={{ gap: 'var(--s-2)' }}>
                    <LevelBadge level={sc.level} />
                    {sc.callCenterPhase && <span className="badge primary">{sc.callCenterPhase.labelAr}</span>}
                    <span className="small muted">{sc.settingAr}</span>
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

                {sc.keyPhrases.length > 0 && (
                  <div className="vocab-list" style={{ marginTop: 'var(--s-3)' }}>
                    {sc.keyPhrases.map((p, i) => (
                      <button
                        type="button"
                        key={i}
                        className="vocab-chip phrase-btn"
                        onClick={() => playLine(`${sc.id}-kp-${i}`, p)}
                      >
                        <b className="es" dir="ltr">{p}</b>
                        <Icon name="volume" size={14} />
                      </button>
                    ))}
                  </div>
                )}

                {sc.culturalNoteAr && (
                  <p className="small muted" style={{ margin: 'var(--s-3) 0 0' }}>
                    <Icon name="globe" size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> {sc.culturalNoteAr}
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
