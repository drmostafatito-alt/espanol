import { useCallback, useEffect, useState } from 'react';
import { api, type VocabularyHubPayload } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { Icon } from '../components/icons';
import { EmptyState, ErrorState, LevelBadge, LoadingState } from '../components/ui';

const LEVELS = ['ALL', 'PREA1', 'A1', 'A2', 'B1', 'B2', 'C1'] as const;

const BUCKET_META: Record<
  'all' | 'weak' | 'learning' | 'familiar' | 'mastered' | 'new',
  { label: string; cls: string }
> = {
  all: { label: 'الكل', cls: 'navy' },
  weak: { label: 'متعثرة', cls: 'danger' },
  learning: { label: 'قيد التعلّم', cls: 'accent' },
  familiar: { label: 'مألوفة', cls: 'primary' },
  mastered: { label: 'متقنة', cls: 'success' },
  new: { label: 'جديدة', cls: 'navy' },
};

export function posLabelAr(pos: string | null | undefined, gender: string | null | undefined): string | null {
  if (!pos) return null;
  const map: Record<string, string> = {
    noun: gender === 'f' ? 'اسم مؤنث' : gender === 'm' ? 'اسم مذكر' : 'اسم',
    verb: 'فعل',
    adj: 'صفة',
    adv: 'ظرف',
    pron: 'ضمير',
    prep: 'حرف جر',
    conj: 'أداة ربط',
    det: 'أداة تعريف/تحديد',
    interj: 'تعبير',
    num: 'عدد',
    phrase: 'عبارة',
  };
  return map[pos] ?? pos;
}

export function Vocabulary({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [data, setData] = useState<VocabularyHubPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'deck' | 'dictionary'>('deck');
  const [bucket, setBucket] = useState<'all' | 'weak' | 'learning' | 'familiar' | 'mastered' | 'new'>('all');
  const [level, setLevel] = useState<string>('ALL');
  const [query, setQuery] = useState('');
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    api
      .myVocabulary({
        filter: bucket,
        level: level === 'ALL' ? undefined : level,
        q: query.trim() || undefined,
        limit: 80,
      })
      .then(res => {
        setData(res);
        if (res.summary.totalCards === 0 && res.explorer.length > 0) {
          setTab(prev => (prev === 'deck' ? 'dictionary' : prev));
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'تعذّر تحميل المفردات.'));
  }, [bucket, level, query]);

  useEffect(() => {
    const t = window.setTimeout(load, 160);
    return () => window.clearTimeout(t);
  }, [load]);

  useEffect(() => () => { void audioService.stop(); }, []);

  const speak = (key: string, text: string) => {
    setSpeakingKey(key);
    audioService.setRate(1.0);
    void audioService
      .play({ key, text, variant: user?.audioVariant })
      .finally(() => setSpeakingKey(curr => (curr === key ? null : curr)));
  };

  if (!user) return null;

  const summary = data?.summary;
  const totalDeck = summary?.totalCards ?? 0;
  const pct = (n: number) => (totalDeck > 0 ? Math.round((n / totalDeck) * 100) : 0);

  return (
    <div className="hub-page">
      <header className="hub-hero">
        <div>
          <span className="continue-eyebrow">
            <Icon name="book" size={14} /> مكتبة المفردات الذكية
          </span>
          <h1>المفردات والإتقان</h1>
          <p className="muted">
            تتبّع كلماتك بين الجديدة، قيد التعلّم، المألوفة، والمتقنة — أو استكشف المعجم حسب مستويات CEFR.
          </p>
        </div>
        <div className="hub-hero-actions">
          {(summary?.dueNow ?? 0) > 0 && (
            <button type="button" className="btn" onClick={() => navigate('/review')}>
              <Icon name="cards" size={18} /> راجع المستحقة (<span className="num">{summary?.dueNow}</span>)
            </button>
          )}
          {(summary?.weak ?? 0) > 0 && (
            <button type="button" className="btn secondary" onClick={() => navigate('/review?mode=weak')}>
              <Icon name="warning" size={17} /> درّب المتعثرة (<span className="num">{summary?.weak}</span>)
            </button>
          )}
          <button type="button" className="btn navy" onClick={() => navigate('/review/packs')}>
            <Icon name="book" size={17} /> حزم المفردات
          </button>
        </div>
      </header>

      {summary && (
        <section className="card mastery-overview" aria-label="ملخص إتقان المفردات">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
            <strong>توزيع مفرداتك ({summary.totalCards} كلمة في مجموعتك · {summary.dictionaryTotal} في المعجم)</strong>
            <span className="small muted num">{summary.mastered} متقنة (فاصل ≥ 21 يومًا)</span>
          </div>
          <div className="mastery-stack" role="img" aria-label="شريط توزيع إتقان المفردات">
            <span className="seg mastered" style={{ width: `${pct(summary.mastered)}%` }} title={`متقنة: ${summary.mastered}`} />
            <span className="seg familiar" style={{ width: `${pct(summary.familiar)}%` }} title={`مألوفة: ${summary.familiar}`} />
            <span className="seg learning" style={{ width: `${pct(summary.learning)}%` }} title={`قيد التعلم: ${summary.learning}`} />
            <span className="seg weak" style={{ width: `${pct(summary.weak)}%` }} title={`متعثرة: ${summary.weak}`} />
            <span className="seg fresh" style={{ width: `${pct(summary.fresh)}%` }} title={`جديدة: ${summary.fresh}`} />
          </div>
          <div className="mastery-legend">
            <span><i className="dot mastered" /> متقنة <b className="num">{summary.mastered}</b></span>
            <span><i className="dot familiar" /> مألوفة <b className="num">{summary.familiar}</b></span>
            <span><i className="dot learning" /> قيد التعلّم <b className="num">{summary.learning}</b></span>
            <span><i className="dot weak" /> متعثرة <b className="num">{summary.weak}</b></span>
            <span><i className="dot fresh" /> جديدة <b className="num">{summary.fresh}</b></span>
          </div>
        </section>
      )}

      <div className="hub-controls card tight">
        <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <div className="tabs-row" role="tablist" aria-label="عرض المفردات" style={{ margin: 0 }}>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'deck'}
              className={`level-pill${tab === 'deck' ? ' active' : ''}`}
              onClick={() => setTab('deck')}
            >
              بطاقاتي ({summary?.totalCards ?? 0})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'dictionary'}
              className={`level-pill${tab === 'dictionary' ? ' active' : ''}`}
              onClick={() => setTab('dictionary')}
            >
              مستكشف المعجم ({summary?.dictionaryTotal ?? 0})
            </button>
          </div>
          <div className="hub-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="ابحث بكلمة إسبانية أو معنى عربي…"
              aria-label="ابحث في المفردات"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="tabs-row" role="tablist" aria-label="تصفية المستوى" style={{ marginTop: 'var(--s-3)' }}>
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

        {tab === 'deck' && (
          <div className="tabs-row" role="tablist" aria-label="حالة الإتقان" style={{ marginTop: 'var(--s-2)' }}>
            {(['all', 'weak', 'learning', 'familiar', 'mastered', 'new'] as const).map(b => (
              <button
                key={b}
                type="button"
                role="tab"
                aria-selected={bucket === b}
                className={`level-pill${bucket === b ? ' active' : ''}`}
                onClick={() => setBucket(b)}
              >
                {BUCKET_META[b].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <ErrorState title="تعذّر تحميل المفردات" description={error} onRetry={load} />}
      {!error && !data && <LoadingState text="جارٍ تحميل مفرداتك…" />}

      {data && tab === 'deck' && (
        data.cards.length === 0 ? (
          <EmptyState
            icon="cards"
            title={totalDeck === 0 ? 'مجموعتك ما زالت جديدة' : 'لا كلمات تطابق التصفية الحالية'}
            description={
              totalDeck === 0
                ? 'أكمل درسك الأول أو افتح حزمة مفردات لتوليد بطاقات مراجعة متباعدة تلقائيًا.'
                : 'جرّب تغيير حالة الإتقان أو المستوى أو البحث بكلمة أخرى.'
            }
            action={
              <button
                type="button"
                className="btn secondary sm"
                onClick={() => (totalDeck === 0 ? navigate('/review/packs') : setBucket('all'))}
              >
                {totalDeck === 0 ? 'استكشف حزم المفردات' : 'عرض الكل'}
              </button>
            }
          />
        ) : (
          <div className="vocab-cards-grid">
            {data.cards.map(c => {
              const posText = posLabelAr(c.pos, c.gender);
              return (
                <article className="card vocab-rich-card" key={c.id}>
                  <div className="vocab-rich-head">
                    <div style={{ minWidth: 0 }}>
                      <div className="row" style={{ gap: 'var(--s-2)' }}>
                        <b className="es vocab-headword" dir="ltr">{c.headwordEs}</b>
                        {c.level && <LevelBadge level={c.level} />}
                        <span className={`badge ${BUCKET_META[c.bucket].cls}`}>
                          {BUCKET_META[c.bucket].label}
                        </span>
                      </div>
                      <div className="row small muted" style={{ gap: 'var(--s-2)', marginTop: 4 }}>
                        {posText && <span>{posText}</span>}
                        {c.ipa && <span dir="ltr">/{c.ipa.replace(/^\/+|\/+$/g, '')}/</span>}
                        {c.pronunciationHintAr && <span>نطق: {c.pronunciationHintAr}</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn ghost sm icon-btn"
                      aria-label={`استمع إلى ${c.headwordEs}`}
                      onClick={() => speak(`vocab-${c.id}`, c.headwordEs)}
                    >
                      <Icon name="volume" size={18} />
                    </button>
                  </div>
                  <p className="vocab-meaning">
                    {c.meaningArFusha || '—'}
                    {c.meaningArEg && <span className="small muted"> · بالمصرية: {c.meaningArEg}</span>}
                  </p>
                  {c.exampleEs && (
                    <div className="vocab-example">
                      <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-2)' }}>
                        <span className="es" dir="ltr">{c.exampleEs}</span>
                        <button
                          type="button"
                          className="btn ghost sm icon-btn"
                          aria-label="استمع للمثال"
                          onClick={() => speak(`vocab-ex-${c.id}`, c.exampleEs!)}
                        >
                          <Icon name={speakingKey === `vocab-ex-${c.id}` ? 'refresh' : 'volume'} size={15} />
                        </button>
                      </div>
                      {c.exampleAr && <p className="small muted" style={{ margin: '2px 0 0' }}>{c.exampleAr}</p>}
                    </div>
                  )}
                  {(c.usageNoteAr || c.commonErrorAr) && (
                    <div className="vocab-notes">
                      {c.usageNoteAr && <p className="small muted" style={{ margin: 0 }}>{c.usageNoteAr}</p>}
                      {c.commonErrorAr && (
                        <p className="small error-text" style={{ margin: '4px 0 0' }}>تنبيه: {c.commonErrorAr}</p>
                      )}
                    </div>
                  )}
                  <div className="vocab-srs-meta small muted">
                    <span>الفاصل: <b className="num">{c.intervalDays}</b> يوم</span>
                    <span>مرات النسيان: <b className="num">{c.lapses}</b></span>
                    <span>{c.isDue ? 'مستحقة الآن' : 'مجدولة'}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )
      )}

      {data && tab === 'dictionary' && (
        data.explorer.length === 0 ? (
          <EmptyState
            icon="search"
            title="لا كلمات مطابقة"
            description="جرّب إزالة البحث أو اختيار مستوى آخر."
            action={<button type="button" className="btn secondary sm" onClick={() => { setLevel('ALL'); setQuery(''); }}>إعادة الضبط</button>}
          />
        ) : (
          <div className="vocab-cards-grid">
            {data.explorer.map(w => {
              const posText = posLabelAr(w.pos, w.gender);
              return (
                <article className="card vocab-rich-card" key={w.id}>
                  <div className="vocab-rich-head">
                    <div style={{ minWidth: 0 }}>
                      <div className="row" style={{ gap: 'var(--s-2)' }}>
                        <b className="es vocab-headword" dir="ltr">{w.headwordEs}</b>
                        {w.level && <LevelBadge level={w.level} />}
                        {w.masteryBucket && (
                          <span className={`badge ${BUCKET_META[w.masteryBucket].cls}`}>
                            {BUCKET_META[w.masteryBucket].label}
                          </span>
                        )}
                      </div>
                      <div className="row small muted" style={{ gap: 'var(--s-2)', marginTop: 4 }}>
                        {posText && <span>{posText}</span>}
                        {w.ipa && <span dir="ltr">/{w.ipa.replace(/^\/+|\/+$/g, '')}/</span>}
                        {w.pronunciationHintAr && <span>نطق: {w.pronunciationHintAr}</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn ghost sm icon-btn"
                      aria-label={`استمع إلى ${w.headwordEs}`}
                      onClick={() => speak(`dict-${w.id}`, w.headwordEs)}
                    >
                      <Icon name="volume" size={18} />
                    </button>
                  </div>
                  <p className="vocab-meaning">
                    {w.meaningArFusha || '—'}
                    {w.meaningArEg && <span className="small muted"> · بالمصرية: {w.meaningArEg}</span>}
                  </p>
                  {w.exampleEs && (
                    <div className="vocab-example">
                      <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s-2)' }}>
                        <span className="es" dir="ltr">{w.exampleEs}</span>
                        <button
                          type="button"
                          className="btn ghost sm icon-btn"
                          aria-label="استمع للمثال"
                          onClick={() => speak(`dict-ex-${w.id}`, w.exampleEs!)}
                        >
                          <Icon name="volume" size={15} />
                        </button>
                      </div>
                      {w.exampleAr && <p className="small muted" style={{ margin: '2px 0 0' }}>{w.exampleAr}</p>}
                    </div>
                  )}
                  {(w.usageNoteAr || w.commonErrorAr) && (
                    <div className="vocab-notes">
                      {w.usageNoteAr && <p className="small muted" style={{ margin: 0 }}>{w.usageNoteAr}</p>}
                      {w.commonErrorAr && (
                        <p className="small error-text" style={{ margin: '4px 0 0' }}>تنبيه: {w.commonErrorAr}</p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
