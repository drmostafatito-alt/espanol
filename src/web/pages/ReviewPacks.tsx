/* حزم المفردات: يعرض الحزم المتاحة ويبدأ بطاقات المراجعة لها */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, ApiError, type ReviewPack } from '../api';
import { EmptyState, ErrorState, LoadingState, ProgressBar } from '../components/ui';
import { Icon } from '../components/icons';
import { Solecito } from '../components/Illustrations';

type LoadKind = 'network' | 'server' | 'generic';

export function ReviewPacks({ navigate }: { navigate: (to: string) => void }) {
  const [packs, setPacks] = useState<ReviewPack[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<LoadKind>('generic');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  // أكثر من مئة حزمة: بحث + تصفية بالمستوى + عرض تدريجي بدل قائمة لا نهائية.
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [visibleCount, setVisibleCount] = useState(24);

  const load = useCallback(async () => {
    setError(null);
    try {
      const r = await api.reviewPacks();
      setPacks(r.packs);
    } catch (err) {
      // 401 يعالجه المعالج المركزي والتحويل لصفحة الدخول؛ لا نرسم بطاقة خطأ متناقضة
      if (err instanceof ApiError && err.isUnauthorized()) return;
      if (err instanceof ApiError && err.isNetwork()) {
        setErrorKind('network');
        setError('تعذّر الوصول إلى الخادم. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.');
      } else {
        setErrorKind('server');
        setError(err instanceof ApiError ? err.message : 'تعذّر تحميل الحزم. حاول مرة أخرى بعد قليل.');
      }
      setPacks(null);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const r = await api.reviewPacks();
        if (alive) setPacks(r.packs);
      } catch (err) {
        if (!alive) return;
        if (err instanceof ApiError && err.isUnauthorized()) return;
        if (err instanceof ApiError && err.isNetwork()) {
          setErrorKind('network');
          setError('تعذّر الوصول إلى الخادم. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.');
        } else {
          setErrorKind('server');
          setError(err instanceof ApiError ? err.message : 'تعذّر تحميل الحزم. حاول مرة أخرى بعد قليل.');
        }
        setPacks(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const start = async (slug: string) => {
    setBusy(slug);
    setMessage(null);
    setError(null);
    try {
      const res = await api.startPack(slug);
      setMessage(res.created > 0 ? `أُضيفت ${res.created} بطاقة إلى مراجعتك.` : 'كل بطاقات هذه الحزمة موجودة في مراجعتك بالفعل.');
      const refreshed = await api.reviewPacks();
      setPacks(refreshed.packs);
    } catch (err) {
      if (err instanceof ApiError && err.isUnauthorized()) return;
      // فشل أثناء الإضافة يبقى المستخدم في سياق الصفحة ببانر واضح، لا شاشة كاملة
      setError(err instanceof ApiError ? err.message : 'تعذّر بدء الحزمة. حاول مرة أخرى.');
    } finally {
      setBusy(null);
    }
  };

  const totalEntries = packs?.reduce((sum, p) => sum + p.entries, 0) ?? 0;
  const totalStarted = packs?.reduce((sum, p) => sum + Math.min(p.started, p.entries), 0) ?? 0;
  const levels = useMemo(
    () => [...new Set((packs ?? []).map(p => p.level).filter((l): l is string => !!l))].sort(),
    [packs],
  );
  const matched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (packs ?? []).filter(p => {
      if (levelFilter !== 'ALL' && p.level !== levelFilter) return false;
      if (!q) return true;
      return p.titleAr.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    });
  }, [packs, query, levelFilter]);
  const shown = matched.slice(0, visibleCount);

  return (
    <div className="path-page">
      <header className="path-head">
        <div style={{ minWidth: 0 }}>
          <h1>حزم المفردات</h1>
          <p className="muted small" style={{ margin: 0 }}>
            مجموعات كلمات مرتبة حسب الموضوع. أضف الحزمة إلى مراجعتك فتظهر بطاقاتها في مواعيدها،
            وتُحسب إجاباتك في تقدمك اليومي.
          </p>
          {packs?.length ? (
            <div className="row" style={{ marginTop: 'var(--s-3)', gap: 'var(--s-3)' }}>
              <span className="badge navy">
                <Icon name="cards" size={14} /> {packs.length} حزم · <span className="num">{totalEntries}</span> كلمة
              </span>
              <span className="badge">
                في مراجعتك الآن: <span className="num">{totalStarted}</span>
              </span>
            </div>
          ) : null}
        </div>
        <div className="row" style={{ gap: 'var(--s-3)' }}>
          <button className="btn secondary" onClick={() => navigate('/review')}>
            <Icon name="refresh" size={17} /> مراجعة الكلمات
          </button>
          <Solecito mood={totalStarted > 0 ? 'happy' : 'think'} size={92} />
        </div>
      </header>

      {message && <p role="status" className="banner-ok small">{message}</p>}
      {error && packs === null ? (
        <ErrorState
          variant={errorKind === 'network' ? 'warning' : 'error'}
          title={errorKind === 'network' ? 'تعذّر الاتصال بالخادم' : 'تعذّر تحميل الحزم'}
          description={error ?? undefined}
          onRetry={() => void load()}
          onBack={() => navigate('/review')}
          backLabel="رجوع إلى المراجعة"
        />
      ) : error ? (
        <p role="alert" className="banner-warn small" style={{ marginTop: 'var(--s-3)' }}>{error}</p>
      ) : null}

      {packs === null && !error && <LoadingState text="جارٍ تحميل حزم المفردات…" />}
      {packs?.length === 0 && (
        <EmptyState
          icon="cards"
          title="لا توجد حزم مستوردة بعد"
          description="ستظهر هنا حزم المفردات المعتمدة فور إضافتها إلى المحتوى."
        />
      )}

      {packs?.length ? (
        <div className="pack-tools" role="search">
          <label className="pack-search">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={query}
              onChange={e => { setQuery(e.target.value); setVisibleCount(24); }}
              placeholder="ابحث في الحزم بالاسم أو الموضوع"
              aria-label="ابحث في حزم المفردات"
            />
          </label>
          <div className="level-jump" role="tablist" aria-label="تصفية الحزم بالمستوى">
            {['ALL', ...levels].map(l => (
              <button
                key={l}
                role="tab"
                aria-selected={levelFilter === l}
                className={`level-pill${levelFilter === l ? ' active' : ''}`}
                onClick={() => { setLevelFilter(l); setVisibleCount(24); }}
              >
                {l === 'ALL' ? 'كل المستويات' : l}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {packs?.length && matched.length === 0 ? (
        <div className="state-box">
          <div className="state-icon"><Icon name="search" size={26} /></div>
          <h3>لا حزمة تطابق بحثك</h3>
          <p className="muted small">جرّب كلمة أقصر، أو اختر «كل المستويات» لعرض كل الحزم.</p>
        </div>
      ) : null}

      {shown.length ? (
        <div className="pack-grid">
          {shown.map(p => {
            const pct = p.entries ? Math.round((Math.min(p.started, p.entries) / p.entries) * 100) : 0;
            return (
              <article className="pack-card" key={p.slug}>
                <div className="pack-icon" aria-hidden="true">
                  <Icon name="cards" size={22} />
                </div>
                <div className="pack-body">
                  <h2>{p.titleAr}</h2>
                  <p className="small muted" style={{ margin: '2px 0 var(--s-2)' }}>
                    <span className="num">{p.entries}</span> كلمة ·{' '}
                    {p.started > 0 ? `${p.started} في مراجعتك` : 'لم تبدأ بعد'}
                    {p.level ? ` · ${p.level}` : ''}
                  </p>
                  {p.started > 0 ? (
                    <ProgressBar value={pct} height={8} label={`نسبة كلمات ${p.titleAr} في مراجعتك`} />
                  ) : null}
                </div>
                <button
                  className={`btn sm ${p.startedAll ? 'secondary' : 'navy'}`}
                  disabled={busy === p.slug || p.startedAll}
                  onClick={() => void start(p.slug)}
                  data-testid={`pack-start-${p.slug}`}
                >
                  {p.startedAll ? 'مضافة بالكامل' : busy === p.slug ? 'جارٍ الإضافة…' : 'ابدأ الحزمة'}
                </button>
              </article>
            );
          })}
        </div>
      ) : null}

      {matched.length > shown.length ? (
        <div className="row" style={{ justifyContent: 'center', marginTop: 'var(--s-4)' }}>
          <button className="btn secondary" onClick={() => setVisibleCount(c => c + 24)}>
            اعرض المزيد ({matched.length - shown.length} حزمة متبقية)
          </button>
        </div>
      ) : null}
    </div>
  );
}
