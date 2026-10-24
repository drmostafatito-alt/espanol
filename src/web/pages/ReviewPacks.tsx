/* حزم المفردات: يعرض الحزم المتاحة ويبدأ بطاقات المراجعة لها */
import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, type ReviewPack } from '../api';
import { EmptyState, ErrorState, LoadingState } from '../components/ui';

type LoadKind = 'network' | 'server' | 'generic';

export function ReviewPacks({ navigate }: { navigate: (to: string) => void }) {
  const [packs, setPacks] = useState<ReviewPack[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<LoadKind>('generic');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1 style={{ marginTop: 0 }}>حزم المفردات</h1>
        <button className="btn ghost sm" onClick={() => navigate('/review')}>← المراجعة</button>
      </div>
      <p className="small muted">
        هذه حزم مفردات أساسية داخلية مرتبة للتدريس. لا نسمّيها «الأكثر شيوعًا» قبل اعتماد قائمة تكرار مرخَّصة.
      </p>

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

      <div className="stack" style={{ marginTop: 'var(--s-3)' }}>
        {packs?.map(p => (
          <div className="card row" key={p.slug} style={{ justifyContent: 'space-between' }}>
            <div>
              <strong>{p.titleAr}</strong>
              <p className="small muted" style={{ margin: 'var(--s-1) 0 0' }}>
                {p.entries} مدخلًا · {p.started>0 ? `${p.started} في مراجعتك` : 'لم تبدأ'} {p.level ? `· ${p.level}` : ''}
              </p>
            </div>
            <button
              className="btn sm"
              disabled={busy === p.slug || p.startedAll}
              onClick={() => void start(p.slug)}
              data-testid={`pack-start-${p.slug}`}
            >
              {p.startedAll ? 'مضافة بالكامل' : busy === p.slug ? 'جارٍ الإضافة…' : 'ابدأ الحزمة'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
