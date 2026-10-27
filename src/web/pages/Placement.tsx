import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../state';

interface Question {
  id: number;
  level: string;
  promptAr: string;
  stemEs?: string;
  options: { id: string; text: string }[];
}

export function Placement({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    unlockedLevel: string;
    xpAwarded: number;
    messageAr: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // الأسئلة تأتي من الخادم بلا أي علامة صواب — بنك الأسئلة خادم فقط.
  useEffect(() => {
    if (!user) return;
    let alive = true;
    api.placementQuestions()
      .then(res => { if (alive) setQuestions(res.questions); })
      .catch(() => { if (alive) setLoadError('تعذّر تحميل أسئلة التقييم. حاول لاحقًا.'); });
    return () => { alive = false; };
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card">
          <h2>تسجيل الدخول مطلوب</h2>
          <p className="muted">يرجى تسجيل الدخول أو إنشاء حساب لحفظ نتيجتك وفتح المستويات تلقائيًا.</p>
          <button className="btn" onClick={() => navigate('/login')}>تسجيل الدخول</button>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card">
          <h2>اختبار تحديد المستوى</h2>
          <div className="alert" role="alert">{loadError}</div>
          <button className="btn" onClick={() => navigate('/learn')}>الانتقال إلى الدروس</button>
        </div>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card"><p className="muted">جارٍ تحميل أسئلة التقييم…</p></div>
      </div>
    );
  }

  const current = questions[index];
  if (!current) return null;
  const selectedOptionId = answers[current.id];

  const handleSelect = (optionId: string) => {
    if (result) return;
    setAnswers(prev => ({ ...prev, [current.id]: optionId }));
  };

  const handleNext = () => {
    if (index + 1 < questions.length) {
      setIndex(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(i => i - 1);
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // الخادم وحده يصحّح ويحدد المستوى والدرجة — لا حساب محليًا.
      const res = await api.submitPlacement({ answers });
      setResult({
        passed: res.passed,
        score: res.score,
        unlockedLevel: res.unlockedLevel,
        xpAwarded: res.xpAwarded,
        messageAr: res.messageAr,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر إرسال نتيجة الاختبار.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--s-4)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--s-2)' }}>
            {result.passed ? '🎉' : '📖'}
          </div>
          <h1 style={{ marginTop: 0 }}>نتيجة اختبار تحديد المستوى</h1>
          <p className="lead" style={{ margin: 'var(--s-2) 0' }}>
            نسبة الإجابات الصحيحة: <strong className="num">{result.score}%</strong>
          </p>

          <div
            className={`card feedback ${result.passed ? 'ok' : 'neutral'}`}
            style={{ textAlign: 'right', margin: 'var(--s-3) 0' }}
          >
            <strong>المستوى الموصى به: {result.unlockedLevel}</strong>
            <p style={{ margin: 'var(--s-1) 0 0' }}>{result.messageAr}</p>
            {result.xpAwarded > 0 && (
              <p className="small" style={{ color: 'var(--color-primary, #0066cc)', margin: 'var(--s-1) 0 0' }}>
                ⭐ تمت إضافة <strong>+{result.xpAwarded} XP</strong> إلى رصيدك كمكافأة على اجتياز التقييم!
              </p>
            )}
          </div>

          <div className="row" style={{ justifyContent: 'center', gap: 'var(--s-2)', marginTop: 'var(--s-4)' }}>
            <button className="btn" onClick={() => navigate('/learn')}>
              الانتقال إلى خريطة المنهج والدروس ←
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((index + 1) / questions.length) * 100);

  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem' }}>اختبار تحديد المستوى</h1>
          <span className="small muted">
            10 أسئلة سريعة لتقييم معرفتك الحالية وتخطي ما تعرفه مسبقًا
          </span>
        </div>
        <button className="btn ghost sm" onClick={() => navigate('/learn')}>
          ✕ خروج
        </button>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="تقدم اختبار تحديد المستوى"
        style={{ marginBottom: 'var(--s-3)' }}
      >
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
          <span className="badge">{current.level}</span>
          <span className="small muted num">
            السؤال {index + 1} من {questions.length}
          </span>
        </div>

        <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>{current.promptAr}</h2>
        {current.stemEs && (
          <p className="es" style={{ fontSize: '1.2rem', fontWeight: 600, margin: 'var(--s-2) 0' }}>
            {current.stemEs}
          </p>
        )}

        <div role="group" aria-label="خيارات الإجابة" style={{ marginTop: 'var(--s-3)' }}>
          {current.options.map(opt => (
            <label
              key={opt.id}
              className={`choice ${selectedOptionId === opt.id ? 'selected' : ''}`}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--s-2)', padding: 'var(--s-2) var(--s-3)', margin: 'var(--s-2) 0', border: '1px solid var(--border)', borderRadius: 8 }}
            >
              <input
                type="radio"
                name={`placement-q-${current.id}`}
                value={opt.id}
                checked={selectedOptionId === opt.id}
                onChange={() => handleSelect(opt.id)}
              />
              <span className="es" style={{ fontSize: '1.05rem' }}>{opt.text}</span>
            </label>
          ))}
        </div>

        {error && <div className="alert" role="alert" style={{ marginTop: 'var(--s-3)' }}>{error}</div>}

        <div className="row" style={{ justifyContent: 'space-between', marginTop: 'var(--s-4)' }}>
          <button
            type="button"
            className="btn ghost sm"
            onClick={handlePrev}
            disabled={index === 0 || submitting}
          >
            ← السابق
          </button>

          {index + 1 < questions.length ? (
            <button
              type="button"
              className="btn sm"
              onClick={handleNext}
              disabled={!selectedOptionId || submitting}
            >
              التالي →
            </button>
          ) : (
            <button
              type="button"
              className="btn sm"
              onClick={handleFinish}
              disabled={answeredCount < questions.length || submitting}
            >
              {submitting ? 'جارٍ التقييم…' : `إنهاء التقييم (${answeredCount}/${questions.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
