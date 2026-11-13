import { useCallback, useEffect, useState } from 'react';
import { api, type GrammarHubPayload } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { Icon } from '../components/icons';
import { EmptyState, ErrorState, LevelBadge, LoadingState } from '../components/ui';

const LEVELS = ['ALL', 'PREA1', 'A1', 'A2', 'B1', 'B2', 'C1'] as const;

export function Grammar({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [data, setData] = useState<GrammarHubPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<string>('ALL');
  const [query, setQuery] = useState('');

  const load = useCallback(() => {
    setError(null);
    api
      .grammarHub({
        level: level === 'ALL' ? undefined : level,
        q: query.trim() || undefined,
      })
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'تعذّر تحميل فهرس القواعد.'));
  }, [level, query]);

  useEffect(() => {
    const t = window.setTimeout(load, 160);
    return () => window.clearTimeout(t);
  }, [load]);

  useEffect(() => () => { void audioService.stop(); }, []);

  if (!user) return null;

  return (
    <div className="hub-page">
      <header className="hub-hero">
        <div>
          <span className="continue-eyebrow">
            <Icon name="sparkles" size={14} /> مرجع القواعد التطبيقية
          </span>
          <h1>القواعد الإسبانية خطوة بخطوة</h1>
          <p className="muted">
            شروح عربية مبسّطة من دروس المنهج، مع أمثلة منطوقة وتنبيهات للأخطاء الشائعة لدى المتحدثين بالعربية.
          </p>
        </div>
        <div className="hub-hero-actions">
          <button type="button" className="btn navy" onClick={() => navigate('/path')}>
            <Icon name="route" size={17} /> مسار الدروس
          </button>
        </div>
      </header>

      <div className="hub-controls card tight">
        <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <div className="tabs-row" role="tablist" aria-label="تصفية المستوى" style={{ margin: 0 }}>
            {LEVELS.map(lv => (
              <button
                key={lv}
                type="button"
                role="tab"
                aria-selected={level === lv}
                className={`level-pill${level === lv ? ' active' : ''}`}
                onClick={() => setLevel(lv)}
              >
                {lv === 'ALL' ? 'كل المستويات' : lv === 'PREA1' ? 'Pre-A1' : lv}
              </button>
            ))}
          </div>
          <div className="hub-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="ابحث عن قاعدة أو فعل أو تصريف…"
              aria-label="ابحث في القواعد"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <ErrorState title="تعذّر تحميل القواعد" description={error} onRetry={load} />}
      {!error && !data && <LoadingState text="جارٍ تحميل القواعد…" />}

      {data && data.entries.length === 0 && (
        <EmptyState
          icon="book"
          title="لا قواعد مطابقة"
          description="جرّب البحث بكلمة أخرى أو اختيار مستوى مختلف."
          action={<button type="button" className="btn secondary sm" onClick={() => { setLevel('ALL'); setQuery(''); }}>عرض كل المستويات</button>}
        />
      )}

      {data && data.entries.length > 0 && (
        <div className="grammar-grid">
          {data.entries.map(g => (
            <article className="card grammar-card" key={g.id}>
              <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-2)' }}>
                <div className="row" style={{ gap: 'var(--s-2)' }}>
                  <LevelBadge level={g.level} />
                  <span className="small muted">{g.unitTitleAr}</span>
                </div>
                {g.progressStatus === 'completed' ? (
                  <span className="badge success"><Icon name="check" size={12} /> مدروس</span>
                ) : !g.isUnlocked ? (
                  <span className="badge navy"><Icon name="lock" size={12} /> ضمن درس مقفل</span>
                ) : null}
              </div>

              <h2 className="grammar-title">{g.titleAr}</h2>
              <p className="grammar-body">{g.explanationAr}</p>

              {g.examples.length > 0 && (
                <div className="grammar-examples">
                  <span className="small" style={{ fontWeight: 800, color: 'var(--color-navy)' }}>أمثلة تطبيقية</span>
                  <ul className="list-plain">
                    {g.examples.map((ex, i) => (
                      <li key={i} className="grammar-example-row">
                        <span className="es" dir="ltr">{ex}</span>
                        <button
                          type="button"
                          className="btn ghost sm icon-btn"
                          aria-label={`استمع إلى ${ex}`}
                          onClick={() => void audioService.play({ key: `gram-${g.id}-${i}`, text: ex, variant: user.audioVariant })}
                        >
                          <Icon name="volume" size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {g.commonMistakesAr.length > 0 && (
                <div className="grammar-mistakes">
                  <strong>أخطاء شائعة تجنّبها:</strong>
                  <ul>
                    {g.commonMistakesAr.map((m, i) => (
                      <li key={i} className="small">{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {g.culturalNoteAr && (
                <p className="small muted" style={{ margin: 0 }}>
                  <Icon name="globe" size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> {g.culturalNoteAr}
                </p>
              )}

              <div className="grammar-foot">
                <span className="small muted">{g.lessonTitleAr}</span>
                <button
                  type="button"
                  className={`btn sm ${g.isUnlocked ? 'navy' : 'ghost'}`}
                  disabled={!g.isUnlocked}
                  onClick={() => g.isUnlocked && navigate(`/learn/${g.lessonSlug}`)}
                >
                  {g.isUnlocked ? 'تدرّب في الدرس' : 'أكمل المتطلب السابق'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
