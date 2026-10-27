import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError, type AnswerResult, type CompleteResult, type LessonExercise, type LessonSession } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { isSpeechRecognitionSupported, createSpeechRecognizer } from '../audio/speechRecognition';

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
  const [audioRate, setAudioRate] = useState<number>(1.0);
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

  const playAudio = useCallback((targetRate?: number) => {
    const spanishText = current?.speechEs ?? current?.stemEs ?? '';
    const audioKey = current?.audioKey || (spanishText ? `tts-${current?.id}` : null);
    if (!audioKey || !spanishText) return;
    setAudioNotice(null);
    const effRate = targetRate ?? audioRate;
    audio.setRate(effRate);
    void audio
      .play({ key: audioKey, text: spanishText, variant: user?.audioVariant })
      .then(res => {
        if (res && res.ok === false) {
          setAudioNotice(res.messageAr ?? 'تعذّر تشغيل الصوت الآن. النص مكتوب أمامك.');
        }
      })
      .catch(() => setAudioNotice('تعذّر تشغيل الصوت الآن. النص مكتوب أمامك.'));
  }, [audio, audioRate, current, user?.audioVariant]);

  const toggleRate = useCallback(() => {
    const nextRate = audioRate === 1.0 ? 0.75 : 1.0;
    setAudioRate(nextRate);
    playAudio(nextRate);
  }, [audioRate, playAudio]);

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

  const [completionError, setCompletionError] = useState<string | null>(null);

  const finishLesson = useCallback(() => {
    setCompletionError(null);
    void (async () => {
      try {
        const res = await api.completeLesson(slug, newEventId());
        setCompletion(res);
      } catch (err) {
        setCompletionError(err instanceof ApiError ? err.message : 'تعذّر حساب النتيجة.');
      }
    })();
  }, [slug]);

  const next = useCallback(() => {
    if (index + 1 < exercises.length) {
      setIndex(i => i + 1);
      setAnswer(null);
      setResult(null);
      startedAt.current = Date.now();
      setPhase('exercise');
    } else {
      setPhase('done');
      finishLesson();
    }
  }, [exercises.length, index, finishLesson]);

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
          completionError={completionError}
          onRetryCompletion={finishLesson}
          session={session}
          results={results}
          onBack={() => navigate('/learn')}
          onRetry={() => {
            setIndex(0);
            setAnswer(null);
            setResult(null);
            setCompletion(null);
            setCompletionError(null);
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
        <div className="alert" role="status" style={{ marginBottom: 'var(--s-3)' }}>
          {session.lesson.provenance.warningAr}
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
          onPlayAudio={() => playAudio()}
          onReplayAudio={() => playAudio()}
          onToggleRate={toggleRate}
          audioRate={audioRate}
          audioNotice={audioNotice}
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
  onReplayAudio,
  onToggleRate,
  audioRate,
  audioNotice,
}: {
  exercise: LessonExercise;
  answer: unknown;
  setAnswer: (v: unknown) => void;
  disabled: boolean;
  onPlayAudio: () => void;
  onReplayAudio: () => void;
  onToggleRate: () => void;
  audioRate: number;
  audioNotice: string | null;
}) {
  const [tokens, setTokens] = useState<string[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);

  useEffect(() => {
    setTokens([]);
    setShowTranscript(false);
    setIsRecording(false);
    setSpeechTranscript('');
    setSpeechError(null);
    recognizerRef.current?.abort();
  }, [exercise.id]);

  const toggleRecording = () => {
    if (isRecording) {
      recognizerRef.current?.stop();
      setIsRecording(false);
      return;
    }
    setSpeechError(null);
    const recognizer = createSpeechRecognizer({
      lang: 'es-ES',
      onStart: () => setIsRecording(true),
      onResult: (res) => {
        setSpeechTranscript(res.transcript);
        setAnswer(res.transcript);
      },
      onError: (errMsg) => {
        setSpeechError(errMsg);
        setIsRecording(false);
      },
      onEnd: () => setIsRecording(false),
    });
    if (!recognizer) {
      setSpeechError('التعرف الصوتي غير متوفر في هذا المتصفح. يمكنك كتابة الجملة للمشاركة.');
      return;
    }
    recognizerRef.current = recognizer;
    recognizer.start();
  };

  // زر الاستماع يظهر فقط عندما يوجد نص قابل للنطق — وإلا كان زرًا صامتًا لا يفعل شيئًا
  const hasAudio = !!(exercise.speechEs || exercise.stemEs);
  const playButton = hasAudio ? (
    <button className="btn secondary sm" data-testid="lesson-audio" onClick={onPlayAudio} type="button">
      🔊 استمع
    </button>
  ) : null;

  if (exercise.mode === 'participation') {
    const isSpeech = exercise.type === 'speak_with_text' || exercise.type === 'speak_free';
    const recSupported = isSpeechRecognitionSupported();

    return (
      <div>
        {exercise.stemEs && <p className="es" style={{ fontSize: '1.2rem', fontWeight: 600 }}>{exercise.stemEs}</p>}
        {exercise.stemAr && <p className="small muted">{exercise.stemAr}</p>}

        <div className="row" style={{ gap: 'var(--s-2)', marginTop: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          {hasAudio && (
            <button className="btn secondary sm" data-testid="lesson-audio" onClick={onPlayAudio} type="button">
              🔊 استمع للنموذج
            </button>
          )}
          {hasAudio && (
            <button className="btn ghost sm" data-testid="lesson-audio-rate" onClick={onToggleRate} type="button">
              {audioRate === 1.0 ? '🐢 بطيء (0.75x)' : '⚡ عادي (1.0x)'}
            </button>
          )}
          {isSpeech && recSupported && (
            <button
              className={`btn sm ${isRecording ? 'error' : 'secondary'}`}
              data-testid="speech-mic-btn"
              onClick={toggleRecording}
              type="button"
              disabled={disabled}
            >
              {isRecording ? '⏹️ إيقاف الاستماع' : '🎙️ تحدّث الآن (ميكروفون المتصفح)'}
            </button>
          )}
        </div>

        {isRecording && (
          <p role="status" aria-live="polite" className="small" style={{ color: 'var(--color-primary, #0066cc)', marginTop: 'var(--s-2)' }}>
            🔴 جارٍ الاستماع… تكلّم بالإسبانية الآن بصوت واضح
          </p>
        )}

        {speechTranscript && (
          <div className="card" style={{ marginTop: 'var(--s-2)', padding: 'var(--s-2)' }}>
            <p className="small" style={{ margin: 0 }}>
              <strong>ما تعرّف عليه المتصفح:</strong> <span className="es">{speechTranscript}</span>
            </p>
            {exercise.stemEs && speechTranscript.trim().toLowerCase() === exercise.stemEs.trim().toLowerCase() && (
              <p className="small" style={{ color: 'var(--color-success, #28a745)', margin: 'var(--s-1) 0 0' }}>
                ✓ ممتاز! نطقك طابق الجملة تمامًا.
              </p>
            )}
            <p className="small muted" style={{ margin: 'var(--s-1) 0 0' }}>
              (تعرّف تجريبي عبر المتصفح — هذا تمرين مشاركة لتدريب لسانك ولا يُقيّم نبرة الصوت أو النطق الدقيق آليًا)
            </p>
          </div>
        )}

        {speechError && (
          <p role="alert" className="small error-text" style={{ marginTop: 'var(--s-2)' }}>
            {speechError}
          </p>
        )}

        {isSpeech && !recSupported && (
          <p className="small muted" style={{ marginTop: 'var(--s-2)' }}>
            ميزة التعرف الصوتي غير متوفرة في هذا المتصفح. يمكنك تكرار الجملة بصوت عالٍ ثم كتابتها أدناه للمشاركة.
          </p>
        )}

        <label className="field" style={{ marginTop: 'var(--s-3)' }}>
          <span>اكتب ما قلته أو ما فهمته (اختياري)</span>
          <textarea
            rows={3}
            disabled={disabled}
            value={typeof answer === 'string' ? answer : ''}
            onChange={e => setAnswer(e.target.value)}
            placeholder="اكتب هنا أو استخدم الميكروفون أعلاه…"
          />
        </label>
      </div>
    );
  }

  // تمارين الاستماع listen_choose: تحكّم صوتي متكامل + إمكانية إظهار النص عند تعذر الصوت
  if (exercise.type === 'listen_choose' && exercise.options.length) {
    return (
      <div>
        <div className="card" style={{ background: 'var(--surface-2, #f4f6f8)', padding: 'var(--s-3)', borderRadius: 8, marginBottom: 'var(--s-3)' }}>
          <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            {playButton}
            {hasAudio && (
              <button
                className="btn secondary sm"
                data-testid="lesson-audio-replay"
                onClick={onReplayAudio}
                type="button"
              >
                🔁 إعادة الاستماع
              </button>
            )}
            {hasAudio && (
              <button
                className="btn ghost sm"
                data-testid="lesson-audio-rate"
                onClick={onToggleRate}
                type="button"
              >
                {audioRate === 1.0 ? '🐢 بطيء (0.75x)' : '⚡ عادي (1.0x)'}
              </button>
            )}
            {exercise.stemEs && (
              <button
                className="btn ghost sm"
                data-testid="toggle-transcript"
                onClick={() => setShowTranscript(v => !v)}
                type="button"
              >
                {showTranscript ? '👁️ إخفاء النص' : '👁️ إظهار النص المكتوب'}
              </button>
            )}
          </div>
          {(showTranscript || audioNotice) && exercise.stemEs && (
            <p className="es" style={{ fontSize: '1.15rem', marginTop: 'var(--s-2)', marginBottom: 0 }}>
              {exercise.stemEs}
            </p>
          )}
          {(showTranscript || audioNotice) && exercise.stemAr && (
            <p className="small muted" style={{ marginTop: 'var(--s-1)', marginBottom: 0 }}>
              {exercise.stemAr}
            </p>
          )}
        </div>

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
        {playButton && <div style={{ marginBottom: 'var(--s-2)' }}>{playButton}</div>}
        <div className="token-box" dir="ltr" data-testid="selected-tokens" aria-label="الجملة التي تكوّنها">
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
        <div className="token-box" dir="ltr" data-testid="remaining-tokens" style={{ marginTop: 'var(--s-2)' }}>
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
  completionError,
  onRetryCompletion,
  session,
  results,
  onBack,
  onRetry,
}: {
  completion: CompleteResult | null;
  completionError: string | null;
  onRetryCompletion: () => void;
  session: LessonSession;
  results: Record<string, boolean | null>;
  onBack: () => void;
  onRetry: () => void;
}) {
  const participation = Object.values(results).filter(v => v === null).length;

  return (
    <div className="card" data-testid="lesson-result">
      <h1 style={{ marginTop: 0 }}>انتهى الدرس</h1>
      {!completion && !completionError && <p className="muted">جارٍ حساب النتيجة على الخادم…</p>}
      {!completion && completionError && (
        <div className="alert" role="alert">
          <p style={{ margin: 0 }}>{completionError}</p>
          <button className="btn sm" style={{ marginTop: 'var(--s-2)' }} onClick={onRetryCompletion}>أعد حساب النتيجة</button>
        </div>
      )}
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
