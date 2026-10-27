import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../state';
import { Icon } from '../components/icons';
import { Mascot } from '../components/Mascot';
import { ProgressBar } from '../components/ui';

/* ============================================================================
   اختبار تحديد المستوى — واجهة فقط (إصلاح AUD-05)
   الأسئلة وترتيب الخيارات يأتيان من الخادم لكل محاولة، والتصحيح على الخادم.
   لا بنك أسئلة ولا مفاتيح صحة في حزمة العميل.
   ========================================================================== */

interface ServerQuestion {
  id: string;
  level: string;
  promptAr: string;
  stemEs?: string;
  options: { id: string; text: string }[];
}

type Phase = 'loading' | 'quiz' | 'error';

export function Placement({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>('loading');
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ServerQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    unlockedLevel: string;
    xpAwarded: number;
    messageAr: string;
    feedback?: { id: string; explanationAr: string }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setPhase('loading');
    setError(null);
    try {
      const res = await api.placementStart();
      setAttemptId(res.attemptId);
      setQuestions(res.questions);
      setIndex(0);
      setAnswers({});
      setResult(null);
      setPhase('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر بدء الاختبار.');
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    if (user) void start();
  }, [user, start]);

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card" style={{ marginTop: 'var(--s-6)' }}>
          <h2>تسجيل الدخول مطلوب</h2>
          <p className="muted">يرجى تسجيل الدخول أو إنشاء حساب لحفظ نتيجتك وفتح المستويات تلقائيًا.</p>
          <button className="btn navy" onClick={() => navigate('/login')}>تسجيل الدخول</button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card" style={{ marginTop: 'var(--s-6)' }}>
          <div className="spinner" />
          <p className="muted" style={{ textAlign: 'center', margin: 0 }}>جارٍ تجهيز أسئلة الاختبار من الخادم…</p>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card" style={{ marginTop: 'var(--s-6)' }}>
          <h2>تعذّر بدء الاختبار</h2>
          <p role="alert">{error}</p>
          <div className="row">
            <button className="btn" onClick={() => void start()}>أعد المحاولة</button>
            <button className="btn navy" onClick={() => navigate('/learn')}>رجوع إلى لوحتي</button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="card result-hero" style={{ marginTop: 'var(--s-6)' }}>
          <div className="result-mascot" style={{ width: 150 }}>
            <Mascot mood={result.passed ? 'celebrate' : 'wave'} size={150} />
          </div>
          <h1 style={{ marginTop: 0 }}>نتيجة اختبار تحديد المستوى</h1>
          <p className="lead" style={{ margin: 'var(--s-2) 0' }}>
            نسبة الإجابات الصحيحة: <strong className="num">{result.score}%</strong>
          </p>
          <div className={`feedback ${result.passed ? 'ok' : 'neutral'}`} style={{ textAlign: 'start', margin: 'var(--s-4) 0' }}>
            <span className="feedback-icon">
              <Icon name={result.passed ? 'check' : 'info'} size={20} />
            </span>
            <div>
              <strong>المستوى الموصى به: {result.unlockedLevel}</strong>
              <p style={{ margin: '2px 0 0' }}>{result.messageAr}</p>
              {result.xpAwarded > 0 && (
                <p className="row small" style={{ color: 'var(--color-success-strong)', margin: 'var(--s-2) 0 0', gap: 'var(--s-1)' }}>
                  <Icon name="star" size={16} /> تمت إضافة <strong>+{result.xpAwarded} XP</strong> إلى رصيدك كمكافأة على اجتياز التقييم!
                </p>
              )}
            </div>
          </div>
          {result.feedback && result.feedback.length > 0 && (
            <details style={{ textAlign: 'start', marginBottom: 'var(--s-4)' }}>
              <summary>قواعد غطّاها هذا الاختبار — راجِعها أينما شعرت بصعوبة</summary>
              <ul style={{ marginTop: 'var(--s-2)' }}>
                {result.feedback.map(f => (
                  <li key={f.id} className="small" style={{ marginBottom: 'var(--s-2)' }}>
                    {f.explanationAr}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <div className="row" style={{ justifyContent: 'center' }}>
            <button className="btn navy" onClick={() => navigate('/learn')}>
              الانتقال إلى خريطة المنهج والدروس ←
            </button>
            <button className="btn secondary" onClick={() => void start()}>إعادة الاختبار</button>
          </div>
        </div>
      </div>
    );
  }

  const current = questions[index];
  if (!current) return null;
  const selectedOptionId = answers[current.id];
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((index + 1) / Math.max(1, questions.length)) * 100);

  const handleFinish = async () => {
    if (!attemptId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.submitPlacement({ attemptId, answers });
      setResult({
        passed: res.passed,
        score: res.score,
        unlockedLevel: res.unlockedLevel,
        xpAwarded: res.xpAwarded,
        messageAr: res.messageAr,
        feedback: res.feedback,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر إرسال نتيجة الاختبار.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="lesson-top" style={{ marginTop: 'var(--s-4)' }}>
        <button className="btn ghost icon-btn" onClick={() => navigate('/learn')} aria-label="خروج من الاختبار">
          <Icon name="close" size={22} />
        </button>
        <div className="lesson-title">
          <h1 style={{ fontSize: '1.25rem' }}>اختبار تحديد المستوى</h1>
          <span className="small muted">{questions.length} أسئلة سريعة لتقييم معرفتك الحالية — التصحيح على الخادم</span>
        </div>
        <span className="badge navy">{current.level}</span>
      </div>

      <ProgressBar value={progressPct} label="تقدم الاختبار" />

      <div className="card" style={{ marginTop: 'var(--s-4)' }}>
        <p className="small muted num" style={{ marginBottom: 'var(--s-3)' }}>
          السؤال {index + 1} من {questions.length}
        </p>

        <div className="question-scene">
          <Mascot size={104} />
          <div className="speech-bubble">
            {current.stemEs ? (
              <>
                <p className="bubble-es es" dir="ltr">{current.stemEs}</p>
                <p className="bubble-ar">{current.promptAr}</p>
              </>
            ) : (
              <p className="bubble-es" style={{ fontSize: '1.15rem' }}>{current.promptAr}</p>
            )}
          </div>
        </div>

        <div role="group" aria-label="خيارات الإجابة">
          {current.options.map(opt => (
            <label key={opt.id} className={`choice ${selectedOptionId === opt.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name={`placement-q-${current.id}`}
                value={opt.id}
                checked={selectedOptionId === opt.id}
                onChange={() => {
                  if (result) return;
                  setAnswers(prev => ({ ...prev, [current.id]: opt.id }));
                }}
              />
              <span className="es">{opt.text}</span>
            </label>
          ))}
        </div>

        {error && <div className="alert" role="alert" style={{ marginTop: 'var(--s-3)' }}>{error}</div>}

        <div className="row" style={{ justifyContent: 'space-between', marginTop: 'var(--s-5)' }}>
          <button type="button" className="btn ghost" onClick={() => index > 0 && setIndex(i => i - 1)} disabled={index === 0 || submitting}>
            ← السابق
          </button>
          {index + 1 < questions.length ? (
            <button type="button" className="btn navy" onClick={() => setIndex(i => i + 1)} disabled={!selectedOptionId || submitting}>
              التالي →
            </button>
          ) : (
            <button
              type="button"
              className="btn success"
              onClick={() => void handleFinish()}
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
