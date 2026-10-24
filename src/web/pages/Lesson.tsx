import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError, type AnswerResult, type CompleteResult, type LessonExercise, type LessonSession } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { isSpeechRecognitionSupported, createSpeechRecognizer } from '../audio/speechRecognition';
import { Icon, LevelBadge, ProgressBar } from '../components/ui';
import { TopicScene, topicForLesson, CartoonScene, cartoonForQuestion } from '../components/Illustrations';

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
      <div className="container lesson-shell">
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
  // كرتون مطابق لموقف السؤال نفسه — لا عشوائية، ويتغير مع كل سؤال
  const questionCartoon = cartoonForQuestion({
    titleAr: session.lesson.titleAr,
    instructionAr: current.instructionAr,
    stemEs: current.stemEs ?? undefined,
    stemAr: current.stemAr ?? undefined,
    type: current.type,
  });

  return (
    <div className="container lesson-shell">
      {session.lesson.provenance && (
        <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
          {session.lesson.provenance.warningAr}
        </span>
      )}

      <div className="lesson-topbar">
        <button className="btn ghost" onClick={() => navigate('/learn')} type="button">
          <Icon name="arrowR" size={20} label="رجوع" /> خروج
        </button>
        <span className="small muted">
          سؤال <span className="num">{index + 1}</span> من <span className="num">{exercises.length}</span>
        </span>
      </div>

      <ProgressBar value={progressPct} showPct={false} />

      <div className="card lesson-card" style={{ marginTop: 'var(--s-3)', minWidth: 0, overflowWrap: 'break-word' }}>
        <style>{`.lesson-topic-art svg{width:48px;height:48px;display:block}`}</style>
        <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
          <div className="lesson-topic-art" style={{ flex: 'none', width: 48, height: 48 }}>
            <TopicScene topic={topicForLesson({ titleAr: session.lesson.titleAr })} label={`رسم موضوع درس ${session.lesson.titleAr}`} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 800 }}>{session.lesson.titleAr}</p>
              <LevelBadge level={session.lesson.level} size="sm" />
            </div>
            {session.lesson.objectiveAr && (
              <p className="small muted" style={{ margin: 'var(--s-1) 0 0' }}>{session.lesson.objectiveAr}</p>
            )}
          </div>
        </div>
        <h2 style={{ marginTop: 'var(--s-3)' }}>{current.instructionAr}</h2>
        {/* رسم الموقف فوق السؤال — يتغير مع كل سؤال حسب موضوعه */}
        <div style={{ width: 176, maxWidth: '100%', margin: 'var(--s-3) auto 0' }}>
          <CartoonScene cartoon={questionCartoon} label={`رسم يوضح موقف السؤال: ${current.instructionAr}`} />
        </div>

        <ExerciseBody
          exercise={current}
          answer={answer}
          setAnswer={setAnswer}
          disabled={phase === 'feedback'}
          feedbackResult={phase === 'feedback' ? result : null}
          onPlayAudio={() => playAudio()}
          onReplayAudio={() => playAudio()}
          onToggleRate={toggleRate}
          audioRate={audioRate}
          audioNotice={audioNotice}
        />

        {audioNotice && (
          <p role="status" aria-live="polite" className="small" data-testid="audio-notice" style={{ marginTop: 'var(--s-2)' }}>
            {audioNotice}{' '}
            <button type="button" className="btn ghost" onClick={() => setAudioNotice(null)}>
              حسنًا، أكمل بدون صوت
            </button>
          </p>
        )}

        {phase === 'feedback' && result && result.mode === 'graded' && result.correct && (
          <div style={{ width: 190, maxWidth: '100%', margin: 'var(--s-3) auto 0' }}>
            <CartoonScene cartoon="celebrate" label="احتفال بإجابة صحيحة" />
          </div>
        )}

        {phase === 'feedback' && result && (
          <div
            data-testid="lesson-feedback"
            className={`card feedback ${result.mode === 'participation' ? 'neutral' : result.correct ? 'ok' : 'bad'}`}
            role="status"
            aria-live="polite"
            style={{ marginTop: 'var(--s-3)', minWidth: 0, overflowWrap: 'break-word' }}
          >
            <strong className="row" style={{ gap: 'var(--s-2)' }}>
              {result.mode === 'participation' ? (
                <Icon name="info" size={20} label="معلومة" />
              ) : result.correct ? (
                <Icon name="checkCircle" size={36} label="صحيح" />
              ) : (
                <Icon name="x" size={20} label="غير صحيح" />
              )}
              <span>
                {result.mode === 'participation'
                  ? 'تمرين مشاركة — لا يُصحَّح آليًا'
                  : result.correct
                    ? 'إجابة صحيحة'
                    : 'إجابة غير صحيحة'}
              </span>
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

        <div className="row" style={{ marginTop: 'var(--s-4)', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {phase === 'exercise' ? (
            <button
              className="btn"
              style={{ width: '100%' }}
              data-testid="lesson-submit"
              onClick={() => void submit()}
              disabled={busy || !hasAnswer(current, answer)}
            >
              {busy ? 'جارٍ التحقق…' : 'تحقّق'}
            </button>
          ) : (
            <button className="btn" style={{ width: '100%' }} data-testid="lesson-next" onClick={next} autoFocus>
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
  feedbackResult,
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
  /** نتيجة الخادم للعرض فقط — تُستخدم لتلوين الخيار المختار، ولا تغيّر النتيجة */
  feedbackResult: AnswerResult | null;
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

  const hasAudio = !!(exercise.audioKey || exercise.speechEs || exercise.stemEs);
  /** تلوين الخيار المختار فقط في مرحلة التغذية الراجعة — نتيجة الخادم كما هي */
  const choiceMark =
    feedbackResult && feedbackResult.mode === 'graded' && typeof feedbackResult.correct === 'boolean'
      ? feedbackResult.correct
        ? 'correct'
        : 'wrong'
      : '';
  const playButton = hasAudio ? (
    <button className="btn secondary" data-testid="lesson-audio" onClick={onPlayAudio} type="button">
      <Icon name="listen" size={20} label="استمع" /> استمع
    </button>
  ) : null;

  if (exercise.mode === 'participation') {
    const isSpeech = exercise.type === 'speak_with_text' || exercise.type === 'speak_free';
    const recSupported = isSpeechRecognitionSupported();

    return (
      <div>
        {exercise.stemEs && <p className="es-block exercise-stem" dir="ltr">{exercise.stemEs}</p>}
        {exercise.stemAr && <p className="small muted">{exercise.stemAr}</p>}

        <div className="row" style={{ gap: 'var(--s-2)', marginTop: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          {hasAudio && (
            <button className="btn secondary" data-testid="lesson-audio" onClick={onPlayAudio} type="button">
              <Icon name="listen" size={20} label="استمع" /> استمع للنموذج
            </button>
          )}
          {hasAudio && (
            <button className="btn ghost" data-testid="lesson-audio-rate" onClick={onToggleRate} type="button">
              <Icon name="play" size={20} label="سرعة التشغيل" />
              {audioRate === 1.0 ? 'بطيء (0.75x)' : 'عادي (1.0x)'}
            </button>
          )}
          {isSpeech && recSupported && (
            <button
              className={`btn ${isRecording ? 'danger' : 'secondary'}`}
              data-testid="speech-mic-btn"
              onClick={toggleRecording}
              type="button"
              disabled={disabled}
            >
              {isRecording ? (
                <><Icon name="x" size={20} label="إيقاف" /> إيقاف الاستماع</>
              ) : (
                <><Icon name="mic" size={20} label="ميكروفون" /> تحدّث الآن (ميكروفون المتصفح)</>
              )}
            </button>
          )}
        </div>

        {isRecording && (
          <p role="status" aria-live="polite" className="small row" style={{ color: 'var(--c-primary-strong)', marginTop: 'var(--s-2)' }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--c-danger)', flex: 'none' }} />
            جارٍ الاستماع… تكلّم بالإسبانية الآن بصوت واضح
          </p>
        )}

        {speechTranscript && (
          <div className="card" style={{ marginTop: 'var(--s-2)', padding: 'var(--s-2)' }}>
            <p className="small" style={{ margin: 0 }}>
              <strong>ما تعرّف عليه المتصفح:</strong> <span className="es" dir="ltr">{speechTranscript}</span>
            </p>
            {exercise.stemEs && speechTranscript.trim().toLowerCase() === exercise.stemEs.trim().toLowerCase() && (
              <p className="small row" style={{ color: 'var(--c-success)', margin: 'var(--s-1) 0 0' }}>
                <Icon name="check" size={18} label="صحيح" /> ممتاز! نطقك طابق الجملة تمامًا.
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
        <div className="card" style={{ background: 'var(--c-surface-2)', padding: 'var(--s-3)', borderRadius: 8, marginBottom: 'var(--s-3)' }}>
          <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            {playButton}
            {hasAudio && (
              <button
                className="btn secondary"
                data-testid="lesson-audio-replay"
                onClick={onReplayAudio}
                type="button"
              >
                <Icon name="replay" size={20} label="إعادة" /> إعادة الاستماع
              </button>
            )}
            {hasAudio && (
              <button
                className="btn ghost"
                data-testid="lesson-audio-rate"
                onClick={onToggleRate}
                type="button"
              >
                <Icon name="play" size={20} label="سرعة التشغيل" />
                {audioRate === 1.0 ? 'بطيء (0.75x)' : 'عادي (1.0x)'}
              </button>
            )}
            {exercise.stemEs && (
              <button
                className="btn ghost"
                data-testid="toggle-transcript"
                onClick={() => setShowTranscript(v => !v)}
                type="button"
              >
                <Icon name={showTranscript ? 'eyeOff' : 'eye'} size={20} label={showTranscript ? 'إخفاء النص' : 'إظهار النص'} />
                {showTranscript ? 'إخفاء النص' : 'إظهار النص المكتوب'}
              </button>
            )}
          </div>
          {(showTranscript || audioNotice) && exercise.stemEs && (
            <p className="es-block exercise-stem" dir="ltr" style={{ marginTop: 'var(--s-2)', marginBottom: 0 }}>
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
            <label key={opt.id} className={`choice ${answer === opt.id ? `selected ${choiceMark}` : ''}`}>
              <input
                type="radio"
                name={`q-${exercise.id}`}
                value={opt.id}
                checked={answer === opt.id}
                disabled={disabled}
                onChange={() => setAnswer(opt.id)}
              />
              <span className="es" dir="ltr">{opt.text}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (exercise.options.length) {
    return (
      <div>
        {exercise.stemEs && <p className="es-block exercise-stem" dir="ltr">{exercise.stemEs}</p>}
        {exercise.stemAr && <p className="small muted">{exercise.stemAr}</p>}
        {playButton}
        <div role="group" aria-label="اختر إجابة" style={{ marginTop: 'var(--s-3)' }}>
          {exercise.options.map(opt => (
            <label key={opt.id} className={`choice ${answer === opt.id ? `selected ${choiceMark}` : ''}`}>
              <input
                type="radio"
                name={`q-${exercise.id}`}
                value={opt.id}
                checked={answer === opt.id}
                disabled={disabled}
                onChange={() => setAnswer(opt.id)}
              />
              <span className="es" dir="ltr">{opt.text}</span>
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
              style={{ minHeight: 44 }}
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
              style={{ minHeight: 44 }}
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
      {exercise.stemEs && <p className="es-block exercise-stem" dir="ltr">{exercise.stemEs}</p>}
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
    <div className="card lesson-card" data-testid="lesson-result" style={{ minWidth: 0, overflowWrap: 'break-word' }}>
      {/* كأس الإتمام عند النجاح — وكرتون مراجعة عند عدم الاجتياز؛ الأرقام كلها من الخادم كما هي */}
      {completion && completion.passed && (
        <div style={{ width: 190, maxWidth: '100%', margin: '0 auto var(--s-2)' }}>
          <CartoonScene cartoon="trophy" label="كأس إتمام الدرس بنجاح" />
        </div>
      )}
      {completion && !completion.passed && (
        <div style={{ width: 170, maxWidth: '100%', margin: '0 auto var(--s-2)' }}>
          <CartoonScene cartoon="study" label="طالب يراجع درسه للمحاولة التالية" />
        </div>
      )}
      <div className="row" style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
        {completion && (
          <span
            aria-hidden="true"
            style={{
              flex: 'none', width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center',
              background: completion.passed ? 'var(--c-primary-soft)' : 'var(--c-gold-soft)',
              color: completion.passed ? 'var(--c-primary-strong)' : 'var(--c-gold-deep)',
            }}
          >
            <Icon name={completion.passed ? 'checkCircle' : 'warn'} size={28} />
          </span>
        )}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0 }}>انتهى الدرس</h1>
          <p className="small muted" style={{ margin: 0 }}>{session.lesson.titleAr}</p>
        </div>
      </div>
      {!completion && <p className="muted" style={{ marginTop: 'var(--s-3)' }}>جارٍ حساب النتيجة على الخادم…</p>}
      {completion && (
        <>
          <div className="stat-row" style={{ marginTop: 'var(--s-3)', minWidth: 0, flexWrap: 'wrap' }}>
            <div className="stat"><b className="num">{completion.accuracy}%</b><span>الدقة</span></div>
            <div className="stat"><b className="num">{completion.correctCount}/{completion.gradedTotal}</b><span>إجابات صحيحة</span></div>
            <div className="stat"><b className="num">{completion.xpAwarded} XP</b><span>XP هذا الدرس</span></div>
            <div className="stat"><b className="num">{completion.xpTotal} XP</b><span>إجمالي XP</span></div>
          </div>

          <div className={`feedback ${completion.passed ? 'ok' : 'bad'}`} role="status" style={{ marginTop: 'var(--s-3)' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              {completion.passed
                ? completion.alreadyCompleted
                  ? 'أتممت هذا الدرس سابقًا — لا تُمنح نقاط إضافية عند الإعادة.'
                  : `أتممت الدرس بنجاح${completion.xpAwarded ? ` وكسبت ${completion.xpAwarded} XP` : ''}.`
                : `لم تُحقق حد الإتقان (${completion.minAccuracy}%). أعد المحاولة — التقدم محفوظ على الخادم.`}
            </p>
          </div>
          <p className="small muted" style={{ marginTop: 'var(--s-2)' }}>
            يمكنك إعادة الدرس للمراجعة من الزر أدناه.
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

      <div className="row" style={{ marginTop: 'var(--s-4)', flexWrap: 'wrap' }}>
        <button className="btn" onClick={onBack}>رجوع إلى لوحتي</button>
        <button className="btn secondary" onClick={onRetry}>إعادة الدرس</button>
      </div>

      <p className="small muted" style={{ marginTop: 'var(--s-3)' }}>
        هذه نتيجة درس «{session.lesson.titleAr}». كل رقم هنا محسوب من محاولاتك المخزَّنة في القاعدة.
      </p>
    </div>
  );
}
