import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import type { SearchResponse } from '../../shared/search-engine';

import { Icon } from '../components/icons';
import { EmptyState } from '../components/ui';

export function Search({
  navigate,
  initialQuery = '',
}: {
  navigate: (to: string) => void;
  initialQuery?: string;
}) {
  const { user } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [level, setLevel] = useState<string>('all');
  const [kind, setKind] = useState<'all' | 'vocab' | 'grammar' | 'lesson'>('all');
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);

  const performSearch = useCallback(async (q: string, lev: string, k: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResponse(null);
      setSearchError(null);
      return;
    }
    setBusy(true);
    setAudioNotice(null);
    setSearchError(null);
    try {

      // مصدر واحد للحقيقة: بحث الخادم. أزلنا محركًا مدمجًا في المتصفح كان يشحن
      // الفهرس كاملًا (2.3MB) ويعرض نتائج قديمة بصمت (AUD-12).
      const res = await api.search(trimmed, {
        level: lev === 'all' ? undefined : lev,
        kind: k === 'all' ? undefined : k,
      });
      setResponse(res);
      setSearchError(null);
    } catch {

      setResponse(null);
      setSearchError('تعذّر الاتصال بالخادم لإتمام البحث. تحقق من الاتصال ثم أعد المحاولة.');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void performSearch(query, level, kind);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, level, kind, performSearch]);

  const playWordAudio = (word: string, id: string) => {
    setAudioNotice(null);
    void audioService
      .play({ key: `pending/search-${id}`, text: word, variant: user?.audioVariant })
      .then(res => {
        if (res && res.ok === false) {
          setAudioNotice(res.messageAr ?? 'تعذّر تشغيل الصوت على هذا المتصفح.');
        }
      })
      .catch(() => setAudioNotice('تعذّر تشغيل الصوت على هذا المتصفح.'));
  };

  return (
    <div className="container" style={{ maxWidth: 840, paddingTop: 'var(--s-4)', paddingBottom: 'var(--s-5)' }}>
      <div className="card" style={{ marginBottom: 'var(--s-3)' }}>
        <h1 className="row" style={{ marginTop: 0, fontSize: '1.75rem', gap: 'var(--s-2)' }}>
          <Icon name="search" size={26} /> البحث الذكي في الإسبانية
        </h1>
        <p className="muted" style={{ margin: 'var(--s-1) 0 var(--s-3)' }}>
          ابحث عن كلمة إسبانية، أو معنى عربي فصيح أو مصري، أو قاعدة نحوية، أو تصريف فعل، أو موضوع درس.
        </p>

        <div className="field">
          <input
            type="search"
            data-testid="search-input"
            className="search-input"
            placeholder="اكتب هنا… مثلاً: hablar, gracias, كتاب, عايز, ser y estar, fui..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{ fontSize: '1.1rem', padding: '10px 14px' }}
          />
        </div>

        {/* فلاتر البحث */}
        <div className="row" style={{ marginTop: 'var(--s-3)', gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="row" style={{ gap: 'var(--s-1)' }}>
            <span className="small muted">النوع:</span>
            {(['all', 'vocab', 'grammar', 'lesson'] as const).map(k => (
              <button
                key={k}
                type="button"
                className={`btn sm ${kind === k ? 'navy' : 'ghost'}`}
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
              >
                {k === 'all' ? 'الكل' : k === 'vocab' ? 'المفردات' : k === 'grammar' ? 'القواعد' : 'الدروس'}
              </button>
            ))}
          </div>

          <span className="spacer" />

          <div className="row" style={{ gap: 'var(--s-1)' }}>
            <span className="small muted">المستوى:</span>
            {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map(l => (
              <button
                key={l}
                type="button"
                className={`btn sm ${level === l ? 'navy' : 'ghost'}`}
                aria-pressed={level === l}
                onClick={() => setLevel(l)}
              >
                {l === 'all' ? 'الكل' : l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {audioNotice && (
        <p role="status" className="small" data-testid="search-audio-notice" style={{ color: 'var(--color-primary)' }}>
          {audioNotice}
        </p>
      )}

      {searchError && (
        <p role="status" className="small" data-testid="search-error" style={{ color: 'var(--color-error, #b3261e)' }}>
          {searchError}
        </p>
      )}

      {response?.contentProvenance === 'unreviewed_sample' && (
        <div className="alert" role="status" data-testid="search-provenance-warning">
          هذه النتائج تتضمن محتوى غير مراجَع: الدروس والقواعد المعروضة هنا مسودات بانتظار المراجعة البشرية، ولا تُعرض للمتعلمين في الوضع العادي.
        </div>
      )}

      {busy && <p className="muted small">جارٍ البحث…</p>}
      {!busy && response && response.total === 0 && !response.suggestion && (
        <EmptyState
          icon="search"
          title="لا توجد نتائج مطابقة"
          description="جرّب كلمة أقصر، أو تحقق من الإملاء الإسباني، أو ابحث بالمعنى بالعربية."
        />
      )}
      {searchError && !busy && (
        <div className="card" role="alert" style={{ marginBottom: 'var(--s-3)' }}>
          <p style={{ margin: '0 0 var(--s-2)' }}>{searchError}</p>
          <button className="btn sm" onClick={() => void performSearch(query, level, kind)}>أعد المحاولة</button>
        </div>
      )}

      {/* رسالة الاقتراح الذكي عند عدم وجود نتائج مباشرة */}
      {response && response.suggestion && response.results.length === 0 && (
        <div className="card" style={{ marginBottom: 'var(--s-3)', background: 'var(--surface-2, #fbfcfd)' }}>
          <p style={{ margin: 0 }}>
            لم نجد نتائج مطابقة تمامًا. هل تقصد:{' '}
            <button
              type="button"
              className="btn ghost sm"
              style={{ fontWeight: 600, color: 'var(--color-primary)' }}
              onClick={() => setQuery(response.suggestion!)}
            >
              «{response.suggestion}»؟
            </button>
          </p>
        </div>
      )}

      {/* قائمة النتائج */}
      {response && (
        <div>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
            <span className="small muted">
              {response.total === 0 ? 'لا توجد نتائج' : `تم العثور على ${response.total} نتيجة`}
            </span>
            <span className="small muted">({response.executionMs}ms)</span>
          </div>

          {response.results.map(r => (
            <div key={`${r.kind}-${r.id}`} className="card" style={{ marginBottom: 'var(--s-2)' }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 'var(--s-2)', alignItems: 'center' }}>
                    <span className="badge" style={{ fontSize: '0.8rem' }}>{r.badgeAr}</span>
                    <span className="badge muted" style={{ fontSize: '0.8rem' }}>{r.level}</span>
                    <span className="small muted">{r.matchReasonAr}</span>
                  </div>

                  <h3 style={{ margin: 'var(--s-1) 0', fontSize: '1.25rem' }}>
                    {r.titleEs ? <span className="es">{r.titleEs}</span> : null}
                    {r.titleEs && r.titleAr ? ' — ' : null}
                    {r.titleAr ? <span>{r.titleAr}</span> : null}
                    {!r.titleEs && !r.titleAr ? <span>{r.title}</span> : null}
                  </h3>

                  {user?.explanationStyle !== 'fusha' && r.meaningArEg && r.meaningArEg !== r.meaningArFusha && (
                    <p className="small" style={{ margin: 'var(--s-1) 0', color: 'var(--color-secondary, #555)' }}>
                      <strong>بالمصرية:</strong> {r.meaningArEg}
                    </p>
                  )}

                  {r.exampleEs && (
                    <div style={{ marginTop: 'var(--s-2)', padding: 'var(--s-2)', background: 'rgba(0,0,0,0.02)', borderRadius: 6 }}>
                      <p className="es" style={{ margin: 0, fontSize: '0.95rem' }}>
                        «{r.exampleEs}»
                      </p>
                      {r.exampleAr && (
                        <p className="small muted" style={{ margin: '4px 0 0' }}>
                          {r.exampleAr}
                        </p>
                      )}
                    </div>
                  )}

                  {r.targetStructures && r.targetStructures.length > 0 && (
                    <div style={{ marginTop: 'var(--s-2)' }}>
                      <span className="small muted">تراكيب مستهدفة في الدرس:</span>
                      <ul style={{ margin: '4px 0 0', paddingRight: '20px' }}>
                        {r.targetStructures.map((st, idx) => (
                          <li key={idx} className="small es">{st}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="row" style={{ gap: 'var(--s-1)', marginLeft: 'var(--s-2)' }}>
                  {r.titleEs && (
                    <button
                      type="button"
                      className="btn secondary sm"
                      title="استمع للنطق"
                      aria-label={`استمع للنطق: ${r.titleEs}`}
                      onClick={() => playWordAudio(r.titleEs!, r.id)}
                    >
                      <Icon name="volume" size={18} />
                    </button>
                  )}
                  {r.kind === 'lesson' || r.kind === 'grammar' ? (
                    <button
                      type="button"
                      className="btn sm"
                      onClick={() => navigate(r.url)}
                    >
                      فتح الدرس
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => navigate(r.url)}
                    >
                      في المنهج
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* الحالة الافتراضية قبل إدخال استعلام */}
      {!query.trim() && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--s-5) var(--s-3)' }}>
          <p className="muted" style={{ fontSize: '1.1rem', margin: 0 }}>
            ابحث في معجم يضم أكثر من 8,000 مفردة ومعانيها، وقواعد الإسبانية، ومواضيع الدروس المتاحة لك.
          </p>
          <div className="row" style={{ justifyContent: 'center', gap: 'var(--s-2)', marginTop: 'var(--s-3)', flexWrap: 'wrap' }}>
            <span className="small muted">كلمات مقترحة:</span>
            {['gracias', 'libro', 'quedamos', 'hablamos', 'ser y estar', 'gustar', 'شقة'].map(sample => (
              <button
                key={sample}
                type="button"
                className="btn ghost sm"
                onClick={() => setQuery(sample)}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
