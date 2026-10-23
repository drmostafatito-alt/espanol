import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError, type AnswerResult, type CompleteResult, type LessonExercise, type LessonSession } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';

/** معرّف حدث فريد لكل محاولة — أساس منع تكرار النقاط */
function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID().replace(/-/g, '');
  return `ev${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

type Phase = 'loading' | 'exercise' | 'feedback' | 'done' | 'error';

export function Lesson({ slug, navigate }: { slug: string; navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [session, setSession] = useState<LessonSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState<Record<string, unknown> | null>(null);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [answer, setAnswer] = useState<unknown>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [completion, setCompletion] = useState<CompleteResult | null>(null);
  const [busy, setBusy] = useState(false);
  /** رسالة صوت عربية تُعرض للمستخدم عند تعذّر التشغيل (لا أخطاء تقنية) */
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean | null>>({});
  const startedAt = useRef<number>(Date.now());

  const audio = audioService;

  useEffect(() => {
    let alive = true;
    api
      .lessonSession(slug)
      .then(s => {
        if (!alive) return;
        setSession(s);
        setPhase('exercise');
      })
      .catch((err: unknown) => {
        if (!alive) return;
        if (err instanceof ApiError && err.code === 'LESSON_LOCKED') {
          // ApiError.details هو كائن الخطأ نفسه { code, message, missing, … }
          setLocked((err.details as Record<string, unknown>) ?? {});
          setPhase('error');
        } else {
          setError(err instanceof ApiError ? err.message : 'تعذّر تحميل الدرس.');
          setPhase('error');
        }
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  useEffect(() => {
    // إيقاف الصوت عند مغادرة الدرس — لا صوت يعيش بعد الشاشة
    return () => {
      void audio.stop();
    };
  }, [audio]);

  const exercises = session?.exercises ?? [];
  const current: LessonExercise | undefined = exercises[index];

  const submit = useCallback(async () => {
    if (!current || busy) return;
    setBusy(true);
    try {
      const res = await api.submitAnswer(slug, {
        eventId: newEventId(),
        exerciseId: current.id,
        response: answer,
        durationMs: Date.now() - startedAt.current,
      });
      setResult(res);
      setResults(prev => ({ ...prev, [current.id]: res.correct }));
      setPhase('feedback');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'تعذّر إرسال الإجابة.');
    } finally {
      setBusy(false);
    }
  }, [answer, audio, busy, current, slug]);

  const next = useCallback(() => {
    if (index + 1 < exercises.length) {
      setIndex(i => i + 1);
      setAnswer(null);
      setResult(null);
      startedAt.current = Date.now();
      setPhase('exercise');
    } else {
      setPhase('done');
      void (async () => {
        try {
          const res = await api.completeLesson(slug, newEventId());
          setCompletion(res);
        } catch (err) {
          setError(err instanceof ApiError ? err.message : 'تعذّر حساب النتيجة.');
        }
      })();
    }
  }, [exercises.length, index, slug]);

  if (phase === 'loading') return <p className="container muted">جارٍ تحميل الدرس…</p>;

  if (phase === 'error') {
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card">
          <h1 style={{ marginTop: 0 }}>تعذّر فتح الدرس</h1>
          {locked ? (
            <>
              <p>هذا الدرس مقفل — أكمل الدرس السابق بدقة كافية أولًا.</p>
              <p className="small muted">
                المطلوب: {((locked.missing as string[]) ?? []).join('، ') || 'الدرس السابق'}
              </p>
            </>
          ) : (
            <p role="alert">{error}</p>
          )}
          <button className="btn" onClick={() => navigate('/learn')}>رجوع إلى لوحتي</button>
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (phase === 'done') {
    return (
      <div className="container" style={{ maxWidth: 720 }}>
        <ResultScreen
          completion={completion}
          session={session}
          results={results}
          onBack={() => navigate('/learn')}
          onRetry={() => {
            setIndex(0);
            setAnswer(null);
            setResult(null);
            setCompletion(null);
            setResults({});
            startedAt.current = Date.now();
            setPhase('exercise');
          }}
        />
      </div>
    );
  }

  if (!current) return <p className="container muted">لا توجد تمارين في هذا الدرس.</p>;
  const progressPct = Math.round((index / Math.max(1, exercises.length)) * 100);

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      {session.lesson.provenance && (
        <div className="card banner-warn" role="note" style={{ marginBottom: 'var(--s-3)' }}>
          <strong>عينة غير مراجعة.</strong> {session.lesson.provenance.warningAr}
        </div>
      )}

      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
        <button className="btn ghost sm" onClick={() => navigate('/learn')}>← خروج</button>
        <span className="small muted num">
          {index + 1} / {exercises.length}
        </span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="تقدم الدرس"
      >
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="card" style={{ marginTop: 'var(--s-3)' }}>
        <p className="small muted" style={{ marginTop: 0 }}>{session.lesson.titleAr}{session.lesson.level ? ` · ${session.lesson.level}` : ''}</p>
        <h2 style={{ marginTop: 0 }}>{current.instructionAr}</h2>

        <ExerciseBody
          exercise={current}
          answer={answer}
          setAnswer={setAnswer}
          disabled={phase === 'feedback'}
          onPlayAudio={() => {
            if (!current.audioKey) return;
            // النص الاحتياطي (speechSynthesis) يجب أن يكون إسبانيًا؛ لا ننطق العربية بصوت إسباني
            const spanishText = current.speechEs ?? current.stemEs ?? '';
            if (!spanishText) return;
            setAudioNotice(null);
            void audio
              .play({ key: current.audioKey, text: spanishText, variant: user?.audioVariant })
              .then(res => {
                // فشل الصوت لا يوقف الدرس ولا يعرض خطأ تقنيًا — رسالة عربية واضحة فقط
                if (res && res.ok === false) setAudioNotice(res.messageAr ?? 'تعذّر تشغيل الصوت الآن. النص مكتوب أمامك.');
              })
              .catch(() => setAudioNotice('تعذّر تشغيل الصوت الآن. النص مكتوب أمامك.'));
          }}
        />

        {audioNotice && (
          <p role="status" aria-live="polite" className="small" data-testid="audio-notice" style={{ marginTop: 'var(--s-2)' }}>
            {audioNotice}{' '}
            <button type="button" className="btn ghost sm" onClick={() => setAudioNotice(null)}>
              حسنًا، أكمل بدون صوت
            </button>
          </p>
        )}

        {phase === 'feedback' && result && (
          <div
            data-testid="lesson-feedback"
            className={`card feedback ${result.mode === 'participation' ? 'neutral' : result.correct ? 'ok' : 'bad'}`}
            role="status"
            aria-live="polite"
            style={{ marginTop: 'var(--s-3)' }}
          >
            <strong>
              {result.mode === 'participation'
                ? 'تمرين مشاركة — لا يُصحَّح آليًا'
                : result.correct
                  ? 'إجابة صحيحة ✓'
                  : 'إجابة غير صحيحة'}
            </strong>
            {result.feedbackAr && <p style={{ margin: 'var(--s-2) 0 0' }}>{result.feedbackAr}</p>}
            <p style={{ margin: 'var(--s-2) 0 0' }} className="small">{result.explanationAr}</p>
            {result.mode === 'participation' && (
              <p className="small muted" style={{ margin: 'var(--s-2) 0 0' }}>
                هذا التمرين لا يدخل في حساب الدقة، لأن تصحيح النطق أو المحادثة المفتوحة يحتاج مراجعًا بشريًا أو
                تعرّفًا صوتيًا، ولا نملك أيًّا منهما الآن.
              </p>
            )}
          </div>
        )}

        <div className="row" style={{ marginTop: 'var(--s-4)', justifyContent: 'flex-end' }}>
          {phase === 'exercise' ? (
            <button
              className="btn"
              data-testid="lesson-submit"
              onClick={() => void submit()}
              disabled={busy || !hasAnswer(current, answer)}
            >
              {busy ? 'جارٍ التحقق…' : 'تحقّق'}
            </button>
          ) : (
            <button className="btn" data-testid="lesson-next" onClick={next} autoFocus>
              {index + 1 < exercises.length ? 'التالي' : 'إنهاء الدرس'}
            </button>
          )}
        </div>

        {error && <p role="alert" className="small error-text" style={{ marginTop: 'var(--s-2)' }}>{error}</p>}
      </div>
    </div>
  );
}

function hasAnswer(exercise: LessonExercise, answer: unknown): boolean {
  if (exercise.mode === 'participation') return true;
  if (Array.isArray(answer)) return answer.length > 0; // word_order / dialogue_order
  if (exercise.options.length) return typeof answer === 'string' && answer.length > 0;
  return typeof answer === 'string' && answer.trim().length > 0;
}

function ExerciseBody({
  exercise,
  answer,
  setAnswer,
  disabled,
  onPlayAudio,
}: {
  exercise: LessonExercise;
  answer: unknown;
  setAnswer: (v: unknown) => void;
  disabled: boolean;
  onPlayAudio: () => void;
}) {
  const [tokens, setTokens] = useState<string[]>([]);

  useEffect(() => {
    setTokens([]);
  }, [exercise.id]);

  const playButton = exercise.audioKey ? (
    <button className="btn secondary sm" data-testid="lesson-audio" onClick={onPlayAudio} type="button">
      🔊 استمع
    </button>
  ) : null;

  if (exercise.mode === 'participation') {
    return (
      <div>
        {exercise.stemEs && <p className="es" style={{ fontSize: '1.15rem' }}>{exercise.stemEs}</p>}
        {exercise.stemAr && <p className="small muted">{exercise.stemAr}</p>}
        {playButton}
        <label className="field" style={{ marginTop: 'var(--s-3)' }}>
          <span>اكتب ما قلته أو ما فهمته (اختياري)</span>
          <textarea
            rows={3}
            disabled={disabled}
            value={typeof answer === 'string' ? answer : ''}
            onChange={e => setAnswer(e.target.value)}
          />
        </label>
      </div>
    );
  }

  if (exercise.options.length) {
    return (
      <div>
        {exercise.stemEs && <p className="es" style={{ fontSize: '1.15rem' }}>{exercise.stemEs}</p>}
        {exercise.stemAr && <p className="small muted">{exercise.stemAr}</p>}
        {playButton}
        <div role="group" aria-label="اختر إجابة" style={{ marginTop: 'var(--s-3)' }}>
          {exercise.options.map(opt => (
            <label key={opt.id} className={`choice ${answer === opt.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name={`q-${exercise.id}`}
                value={opt.id}
                checked={answer === opt.id}
                disabled={disabled}
                onChange={() => setAnswer(opt.id)}
              />
              <span className="es">{opt.text}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // word_order و dialogue_order كلاهما «رتّب العناصر»: نفس واجهة الرموز.
  // كنّا نستثني dialogue_order فكان يسقط إلى حقل نص حر لا يمكن تصحيحه.
  if ((exercise.type === 'word_order' || exercise.type === 'dialogue_order') && exercise.items.length) {
    const byId = new Map(exercise.items.map(i => [i.id, i.text]));
    // نتتبّع العناصر بالمعرّف لا بالنص: التمرين قد يكرّر الرمز نفسه («es» مرتين)
    const remaining = exercise.items.filter(i => !tokens.includes(i.id));
    const place = (ids: string[]) => {
      const next = ids.map(id => byId.get(id) ?? '');
      setTokens(ids);
      // نُرسل مصفوفة مرتّبة، لا نصًّا مدموجًا: الترتيب هو الإجابة نفسها
      setAnswer(next);
    };
    return (
      <div>
        <div className="token-box" aria-label="الجملة التي تكوّنها">
          {tokens.map((id, i) => (
            <button
              key={`${id}-${i}`}
              type="button"
              className="token"
              disabled={disabled}
              onClick={() => place(tokens.filter((_, idx) => idx !== i))}
            >
              {byId.get(id)}
            </button>
          ))}
          {tokens.length === 0 && <span className="muted small">اضغط الكلمات بالترتيب</span>}
        </div>
        <div className="token-box" style={{ marginTop: 'var(--s-2)' }}>
          {remaining.map(item => (
            <button
              key={item.id}
              type="button"
              className="token ghost"
              disabled={disabled}
              onClick={() => place([...tokens, item.id])}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {exercise.stemEs && <p className="es" style={{ fontSize: '1.15rem' }}>{exercise.stemEs}</p>}
      {exercise.stemAr && <p className="small muted">{exercise.stemAr}</p>}
      {playButton}
      <label className="field" style={{ marginTop: 'var(--s-3)' }}>
        <span>إجابتك بالإسبانية</span>
        <input
          data-testid="lesson-text"
          type="text"
          dir="ltr"
          className="es"
          disabled={disabled}
          value={typeof answer === 'string' ? answer : ''}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Escribe aquí…"
          autoComplete="off"
          autoCapitalize="off"
        />
      </label>
    </div>
  );
}

function ResultScreen({
  completion,
  session,
  results,
  onBack,
  onRetry,
}: {
  completion: CompleteResult | null;
  session: LessonSession;
  results: Record<string, boolean | null>;
  onBack: () => void;
  onRetry: () => void;
}) {
  const participation = Object.values(results).filter(v => v === null).length;

  return (
    <div className="card" data-testid="lesson-result">
      <h1 style={{ marginTop: 0 }}>انتهى الدرس</h1>
      {!completion && <p className="muted">جارٍ حساب النتيجة على الخادم…</p>}
      {completion && (
        <>
          <div className="stat-row" style={{ marginTop: 'var(--s-3)' }}>
            <div className="stat"><b className="num">{completion.accuracy}%</b><span>الدقة</span></div>
            <div className="stat"><b className="num">{completion.correctCount}/{completion.gradedTotal}</b><span>إجابات صحيحة</span></div>
            <div className="stat"><b className="num">{completion.xpTotal}</b><span>إجمالي XP</span></div>
          </div>

          <p style={{ marginTop: 'var(--s-3)' }}>
            {completion.passed
              ? completion.alreadyCompleted
                ? 'أتممت هذا الدرس سابقًا — لا تُمنح نقاط إضافية عند الإعادة.'
                : `أتممت الدرس بنجاح${completion.xpAwarded ? ` وكسبت ${completion.xpAwarded} XP` : ''}.`
              : `لم تُحقق حد الإتقان (${completion.minAccuracy}%). أعد المحاولة — التقدم محفوظ على الخادم.`}
          </p>

          {participation > 0 && (
            <p className="small muted">
              {participation} تمرين مشاركة (نطق/محادثة) لم يُدخلا في حساب الدقة.
            </p>
          )}
          {!completion.passed && completion.missingRequiredTypes.length > 0 && (
            <p className="small error-text">أنواع تمارين مطلوبة غير موجودة في هذا الدرس: {completion.missingRequiredTypes.join('، ')}</p>
          )}
        </>
      )}

      <div className="row" style={{ marginTop: 'var(--s-4)' }}>
        <button className="btn" onClick={onBack}>رجوع إلى لوحتي</button>
        <button className="btn secondary" onClick={onRetry}>إعادة الدرس</button>
      </div>

      <p className="small muted" style={{ marginTop: 'var(--s-3)' }}>
        هذه نتيجة درس «{session.lesson.titleAr}». كل رقم هنا محسوب من محاولاتك المخزَّنة في القاعدة.
      </p>
    </div>
  );
}
