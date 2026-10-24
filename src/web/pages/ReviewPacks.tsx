/* حزم المفردات: يعرض الحزم المتاحة ويبدأ بطاقات المراجعة لها */
import { useEffect, useState } from 'react';
import { api, ApiError, type ReviewPack } from '../api';
import { Icon, SectionHead, EmptyState } from '../components/ui';

export function ReviewPacks({ navigate }: { navigate: (to: string) => void }) {
  const [packs, setPacks] = useState<ReviewPack[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .reviewPacks()
      .then(r => alive && setPacks(r.packs))
      .catch((err: unknown) => alive && setError(err instanceof ApiError ? err.message : 'تعذّر تحميل الحزم.'));
    return () => {
      alive = false;
    };
  }, []);

  const start = async (slug: string) => {
    setBusy(slug);
    setMessage(null);
    try {
      const res = await api.startPack(slug);
      setMessage(res.created > 0 ? `أُضيفت ${res.created} بطاقة إلى مراجعتك.` : 'كل بطاقات هذه الحزمة موجودة في مراجعتك بالفعل.');
      const refreshed = await api.reviewPacks();
      setPacks(refreshed.packs);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'تعذّر بدء الحزمة.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <SectionHead
        kicker="المراجعة المتباعدة"
        title="حزم المفردات"
        desc="هذه حزم مفردات أساسية داخلية مرتبة للتدريس. لا نسمّيها «الأكثر شيوعًا» قبل اعتماد قائمة تكرار مرخَّصة."
        action={<button className="btn ghost sm" onClick={() => navigate('/review')}><Icon name="arrowR" size={16} /> المراجعة</button>}
      />

      {error && <p role="alert" className="error-text">{error}</p>}
      {message && <p role="status" className="banner-warn small">{message}</p>}
      {packs === null && <p className="muted">جارٍ التحميل…</p>}
      {packs?.length === 0 && (
        <EmptyState
          title="لا توجد حزم مستوردة بعد"
          desc="عندما تُستورد حزمة مفردات ستظهر هنا لتبدأ بطاقاتها في مراجعتك."
        />
      )}

      <div className="stack" style={{ marginTop: 'var(--s-3)' }}>
        {packs?.map(p => (
          <div className="card card-hover row" key={p.slug} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="row" style={{ gap: 'var(--s-3)', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--c-primary-strong)', marginTop: 2 }}><Icon name="book" size={22} /></span>
              <div>
                <strong>{p.titleAr}</strong>
                <p className="small muted" style={{ margin: 'var(--s-1) 0 0' }}>
                  {p.entries} مدخلًا · {p.started>0 ? `${p.started} في مراجعتك` : 'لم تبدأ'} {p.level ? `· ${p.level}` : ''}
                </p>
              </div>
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
