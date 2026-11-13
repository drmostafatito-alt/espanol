import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { api, ApiError, type AnswerResult, type CompleteResult, type LessonExercise, type LessonSession } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { isSpeechRecognitionSupported, createSpeechRecognizer } from '../audio/speechRecognition';
import { Icon } from '../components/icons';
import { Mascot } from '../components/Mascot';
import { Solecito } from '../components/Illustrations';
import { ProgressBar } from '../components/ui';
import { LessonBriefView } from '../components/LessonBrief';
import { AccentBar, insertAtCursor } from '../components/AccentBar';

/** معرّف حدث فريد لكل محاولة — أساس منع تكرار النقاط */
function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID().replace(/-/g, '');
  return `ev${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

type Phase = 'loading' | 'brief' | 'exercise' | 'feedback' | 'done' | 'error';

export function Lesson({ slug, navigate }: { slug: string; navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [session, setSession] = useState<LessonSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState<Record<string, unknown> | null>(null);
  const [loadKind, setLoadKind] = useState<'locked' | 'network' | 'server'>('server');

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [reviewingBrief, setReviewingBrief] = useState(false);
  const [answer, setAnswer] = useState<unknown>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [completion, setCompletion] = useState<CompleteResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean | null>>({});
  const [audioRate, setAudioRate] = useState<number>(1.0);
  const startedAt = useRef<number>(Date.now());
  // حارس متزامن ضد النقر المزدوج: setBusy لا يصل إلى الإغلاق التالي فورًا،
  // فنقرتان سريعتان كانتا تُرسلان محاولتين بمفتاحين مختلفين وتضخّمان attempts_count.
  const busyRef = useRef(false);

  const audio = audioService;

  // عدّاد إعادة المحاولة: زر «أعد المحاولة» يزيده فيُعاد تشغيل أثر التحميل نفسه
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setPhase('loading');
    setReviewingBrief(false);
    setError(null);
    setLocked(null);
    void api
      .lessonSession(slug)
      .then(s => {
        if (cancelled) return;
        setSession(s);
        // شاشة تعريف الدرس أولًا (هدف، مفردات، أمثلة، حوار)، ثم التمارين
        setPhase('brief');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.code === 'LESSON_LOCKED') {
          setLocked((err.details as Record<string, unknown>) ?? {});
          setLoadKind('locked');
          setPhase('error');
        } else if (err instanceof ApiError && err.isUnauthorized()) {
          // المعالج المركزي يحوّل لصفحة الدخول؛ نبقى على حالة تحميل هادئة
          setPhase('loading');
        } else if (err instanceof ApiError && err.isNetwork()) {
          setLoadKind('network');
          setError('تعذّر الوصول إلى الخادم. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.');
          setPhase('error');
        } else {
          setLoadKind('server');
          setError(err instanceof ApiError ? err.message : 'تعذّر تحميل الدرس. حاول مرة أخرى بعد قليل.');
          setPhase('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug, reloadTick]);

  useEffect(() => {
    return () => {
      void audio.stop();
    };
  }, [audio]);

  const exercises = session?.exercises ?? [];
  const current: LessonExercise | undefined = exercises[index];

  const playAudio = useCallback(
    (targetRate?: number) => {
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
    },
    [audio, audioRate, current, user?.audioVariant],
  );

  const toggleRate = useCallback(() => {
    const nextRate = audioRate === 1.0 ? 0.75 : audioRate === 0.75 ? 1.25 : 1.0;
    setAudioRate(nextRate);
    playAudio(nextRate);
  }, [audioRate, playAudio]);

  // AUD-13: معرّف حدث ثابت لكل تمرين حتى يؤكّد الخادم الاستلام — إعادة
  // المحاولة بعد ضياع استجابة تعيد نفس الحدث فيعيد الخادم النتيجة (replay)
  // بلا محاولة مكررة. يُمسح عند النجاح فقط.
  const eventIdByExercise = useRef(new Map<string, string>());

  const submit = useCallback(async () => {
    if (!current || busy || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    let eventId = eventIdByExercise.current.get(current.id);
    if (!eventId) {
      eventId = newEventId();
      eventIdByExercise.current.set(current.id, eventId);
    }
    try {
      const res = await api.submitAnswer(slug, {
        eventId,
        exerciseId: current.id,
        response: answer,
        durationMs: Date.now() - startedAt.current,
      });
      eventIdByExercise.current.delete(current.id);
      setResult(res);
      setResults(prev => ({ ...prev, [current.id]: res.correct }));
      setPhase('feedback');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'تعذّر إرسال الإجابة.');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, [answer, busy, current, slug]);

  const [completionError, setCompletionError] = useState<string | null>(null);
  // الدرس التالي بعد النجاح — يأتي من تقدم المتعلم على الخادم لا من تخمين الواجهة
  const [nextAfter, setNextAfter] = useState<{ slug: string; titleAr: string } | null>(null);

  const finishLesson = useCallback(() => {
    setCompletionError(null);
    void (async () => {
      try {
        const res = await api.completeLesson(slug, newEventId());
        setCompletion(res);
        if (res.passed) {
          void api
            .progress()
            .then(p => {
              const n = p.nextLesson;
              setNextAfter(n && n.slug !== slug ? { slug: n.slug, titleAr: n.title_ar } : null);
            })
            .catch(() => setNextAfter(null));
        }
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

  // لوحة التغذية الراجعة تظهر أسفل البطاقة: نمرّرها إلى العرض حتى لا يفوت
  // المتعلم على الموبايل أنها ظهرت ولا يرى زر «متابعة».
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = feedbackRef.current;
    if (phase === 'feedback' && el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus?.();
    }
  }, [phase]);

  // اختصارات لوحة المفاتيح: أرقام 1–4 لاختيار الخيارات، وEnter للتأكيد
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'exercise' || !current) return;
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (!isInput && current.options && current.options.length > 0) {
        const num = Number(e.key);
        if (num >= 1 && num <= current.options.length) {
          const opt = current.options[num - 1];
          if (opt) {
            e.preventDefault();
            setAnswer(opt.id);
            return;
          }
        }
      }

      if (!isInput && e.key === 'Enter' && hasAnswer(current, answer) && !busy && !busyRef.current) {
        e.preventDefault();
        void submit();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, current, answer, busy, submit]);

  if (phase === 'loading') {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: 'var(--s-6)' }}>
          <div className="spinner" />
          <p className="muted" style={{ textAlign: 'center', margin: 0 }}>جارٍ تحميل الدرس…</p>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    const isLocked = loadKind === 'locked';
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card" style={{ marginTop: 'var(--s-6)' }}>
          <div
            className="state-icon"
            style={{
              background: isLocked ? 'var(--color-navy-soft)' : 'var(--color-warning-soft)',
              color: isLocked ? 'var(--color-navy)' : 'var(--color-warning)',
              marginBottom: 'var(--s-3)',
            }}
          >
            <Icon name={isLocked ? 'lock' : 'warning'} size={28} />
          </div>
          <h1 style={{ marginTop: 0 }}>{isLocked ? 'تعذّر فتح الدرس' : loadKind === 'network' ? 'تعذّر الاتصال بالخادم' : 'تعذّر تحميل الدرس'}</h1>
          {isLocked ? (
            <>
              <p>هذا الدرس مقفل — أكمل الدرس السابق بدقة كافية أولًا.</p>
              <p className="small muted">
                المطلوب:{' '}
                {((locked?.missing as string[] | undefined) ?? []).length > 0 ? (
                  <span dir="ltr">{((locked?.missing as string[] | undefined) ?? []).join('، ')}</span>
                ) : (
                  'الدرس السابق'
                )}
              </p>
            </>
          ) : (
            <p role="alert">{error}</p>
          )}
          <div className="row">
            {!isLocked && (
              <button className="btn" onClick={() => setReloadTick(t => t + 1)}>
                <Icon name="refresh" size={18} /> أعد المحاولة
              </button>
            )}
            <button className="btn navy" onClick={() => navigate('/learn')}>رجوع إلى لوحتي</button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (phase === 'brief' || reviewingBrief) {
    return (
      <LessonBriefView
        brief={session.lesson.brief}
        title={session.lesson.titleAr}
        level={session.lesson.level}
        exerciseCount={exercises.length}
        startLabel={reviewingBrief ? 'العودة إلى التمارين' : 'ابدأ التمارين'}
        onStart={() => {
          if (reviewingBrief) {
            setReviewingBrief(false);
          } else {
            startedAt.current = Date.now();
            setPhase('exercise');
          }
        }}
        onBack={() => navigate('/learn')}
      />
    );
  }

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
          onReview={() => navigate('/review')}
          onNext={nextAfter ? () => navigate(`/learn/${nextAfter.slug}`) : undefined}
          nextTitle={nextAfter?.titleAr ?? null}
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
  const mistakesCount = Object.values(results).filter(v => v === false).length;
  const heartsLeft = Math.max(1, 5 - mistakesCount);
  let comboStreak = 0;
  for (let i = index; i >= 0; i--) {
    const exId = exercises[i]?.id;
    if (!exId || results[exId] === undefined) continue;
    if (results[exId] === true) comboStreak++;
    else if (results[exId] === false) break;
  }

  const label = exerciseLabel(current.type);
  const userAnswerText =
    current.options.length === 0
      ? Array.isArray(answer)
        ? answer.map(String).join(' ')
        : typeof answer === 'string'
          ? answer.trim()
          : null
      : null;

  return (
    <div className="lesson-shell" style={{ paddingBottom: 'var(--s-6)' }}>
      {/* شريط علوي للتركيز: خروج + عنوان + عدّاد + قلوب التركيز + شريط تقدم */}
      <div className="lesson-top">
        <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'nowrap' }}>
          <button className="lesson-close" onClick={() => navigate('/learn')} aria-label="خروج إلى صفحة اليوم">
            <Icon name="close" size={20} />
          </button>
          <div className="lesson-title" style={{ minWidth: 0, flex: 1 }}>
            <h1>{session.lesson.titleAr}</h1>
            <span className="small muted">
              {session.lesson.level ? `${session.lesson.level} · ` : ''}السؤال <span className="num">{index + 1}</span> من{' '}
              <span className="num">{exercises.length}</span>
            </span>
          </div>
          {comboStreak >= 2 ? (
            <span className="duo-combo-pill" title="سلسلة إجابات صحيحة متتالية">
              🔥 <span className="num">{comboStreak}</span> متتالية!
            </span>
          ) : null}
          <span
            className="duo-heart-pill"
            title="نقاط التركيز في هذا الدرس (لا تمنع إكمال الدرس)"
            aria-label={`نقاط التركيز: ${heartsLeft} من 5`}
          >
            ❤️ <span className="num">{heartsLeft}</span>
          </span>
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => setReviewingBrief(true)}
            title="راجع شرح الدرس والمفردات"
          >
            <Icon name="book" size={15} /> الشرح
          </button>
          <span className={`node-badge${phase === 'feedback' ? ' done' : ' current'}`}>
            <Icon name={phase === 'feedback' ? 'check' : 'clock'} size={13} />
            <span className="num">{progressPct}%</span>
          </span>
        </div>
        <div className="lesson-progress-wrap" style={{ marginTop: 'var(--s-2)' }}>
          <ProgressBar value={progressPct} label="تقدم الدرس" height={14} />
        </div>
      </div>

      <div className="card exercise-card">
        <span className="exercise-type">
          <Icon name={label.icon} size={14} /> {label.label}
        </span>
        <ExerciseBody
          exercise={current}
          answer={answer}
          setAnswer={setAnswer}
          disabled={phase === 'feedback'}
          correct={phase === 'feedback' ? result?.correct ?? null : undefined}
          result={phase === 'feedback' ? result : null}
          onSubmit={() => {
            if (!busy && !busyRef.current && hasAnswer(current, answer)) {
              void submit();
            }
          }}
          onPlayAudio={() => playAudio()}
          onReplayAudio={() => playAudio()}
          onToggleRate={toggleRate}
          audioRate={audioRate}
          audioNotice={audioNotice}
          clearAudioNotice={() => setAudioNotice(null)}
        />

        {audioNotice && (
          <p role="status" aria-live="polite" className="small banner-warn" data-testid="audio-notice" style={{ marginTop: 'var(--s-3)' }}>
            {audioNotice}{' '}
            <button type="button" className="btn ghost sm" onClick={() => setAudioNotice(null)}>
              حسنًا، أكمل بدون صوت
            </button>
          </p>
        )}

        {error && <p role="alert" className="small error-text" style={{ marginTop: 'var(--s-2)' }}>{error}</p>}
      </div>

      {phase === 'feedback' && result ? (
        <div ref={feedbackRef} tabIndex={-1} style={{ outline: 'none' }}>
        <FeedbackPanel
          result={result}
          userAnswerText={userAnswerText}
          action={
            <button className="btn success lg" data-testid="lesson-next" onClick={next} autoFocus>
              {index + 1 < exercises.length ? 'متابعة' : 'إنهاء الدرس'} <Icon name="arrow-left" size={18} />
            </button>
          }
        />
        </div>
      ) : (
        <div className="row" style={{ marginTop: 'var(--s-4)', justifyContent: 'flex-end' }}>
          <button
            className="btn lg"
            data-testid="lesson-submit"
            onClick={() => void submit()}
            disabled={busy || !hasAnswer(current, answer)}
          >
            {busy ? 'جارٍ التحقق…' : 'تحقّق من الإجابة'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- التغذية الراجعة ---------------- */
function FeedbackPanel({
  result,
  userAnswerText,
  action,
}: {
  result: AnswerResult;
  userAnswerText?: string | null;
  action?: ReactNode;
}) {
  const participation = result.mode === 'participation';
  const bad = !participation && !result.correct;
  const cls = participation ? 'neutral' : result.correct ? 'ok' : 'bad';
  const title = participation
    ? 'تمرين مشاركة — لا يُصحَّح آليًا'
    : result.correct
      ? 'أحسنت! إجابة صحيحة'
      : 'ليست صحيحة — هذه هي الإجابة الصحيحة';
  const icon = participation ? 'info' : result.correct ? 'check' : 'close';
  return (
    <div data-testid="lesson-feedback" className={`feedback-sheet ${cls}`} role="status" aria-live="polite">
      <span className="fb-icon"><Icon name={icon as 'info'} size={21} /></span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {bad ? (
            <span className="badge danger" style={{ fontSize: '0.72rem' }}>
              📌 سُجّلت في المراجعة الذكية لتثبيتها
            </span>
          ) : !participation ? (
            <span className="badge success" style={{ fontSize: '0.72rem' }}>
              +XP إتقان
            </span>
          ) : null}
        </div>
        {result.feedbackAr && <p style={{ margin: '4px 0', fontWeight: 600 }}>{result.feedbackAr}</p>}
        {bad && result.correctText && (
          <div className="feedback-compare">
            {userAnswerText && (
              <p className="small" style={{ margin: 0 }}>
                <strong>إجابتك:</strong> <span className="es" dir="ltr">{userAnswerText}</span>
              </p>
            )}
            <p className="small" style={{ margin: 0 }}>
              <strong>الإجابة الصحيحة:</strong> <span className="es" dir="ltr">{result.correctText}</span>
            </p>
          </div>
        )}
        {result.explanationAr && <p>{result.explanationAr}</p>}
        {participation && (
          <p className="small muted" style={{ marginTop: 4 }}>
            لا يدخل في حساب الدقة — تصحيح النطق أو المحادثة المفتوحة يحتاج مراجعًا بشريًا أو تعرّفًا صوتيًا.
          </p>
        )}
        {bad && <span className="visually-hidden">الإجابة الصحيحة موضحة في التفسير أعلاه.</span>}
      </div>
      {action ? <div className="fb-actions">{action}</div> : null}
    </div>
  );
}

/* ---------------- مشهد السؤال الكرتوني ---------------- */
function QuestionScene({ children, mood = 'wave' }: { children: ReactNode; mood?: 'wave' | 'celebrate' }) {
  return (
    <div className="question-scene">
      <Mascot mood={mood} size={118} />
      <div className="speech-bubble">{children}</div>
    </div>
  );
}

const EXERCISE_LABEL: Record<string, { label: string; icon: 'volume' | 'cards' | 'sort' | 'chat' | 'book' | 'mic' }> = {
  listen_choose: { label: 'استمع واختر', icon: 'volume' },
  listen_type: { label: 'استمع واكتب', icon: 'volume' },
  dictation: { label: 'إملاء صوتي', icon: 'volume' },
  audio_dictation: { label: 'إملاء صوتي', icon: 'volume' },
  reconstruct_audio_sentence: { label: 'استمع وركّب الجملة', icon: 'volume' },
  match_pairs: { label: 'وصّل الكلمات بمعانيها', icon: 'cards' },
  image_choice: { label: 'اختر الكلمة المطابقة للمعنى', icon: 'cards' },
  word_order: { label: 'رتّب الكلمات لتكوين جملة', icon: 'sort' },
  sentence_building: { label: 'كوّن الجملة', icon: 'sort' },
  dialogue_order: { label: 'رتّب الحوار', icon: 'sort' },
  fill_blank: { label: 'أكمل الفراغ', icon: 'book' },
  type_missing_word: { label: 'اكتب الكلمة الناقصة', icon: 'book' },
  preposition_choice: { label: 'اختر حرف الجر المناسب', icon: 'book' },
  conjugate_in_context: { label: 'صرّف الفعل في السياق', icon: 'book' },
  translate_short: { label: 'ترجمة سريعة', icon: 'chat' },
  translate_es_ar: { label: 'ترجم إلى العربية', icon: 'chat' },
  translate_ar_es: { label: 'ترجم إلى الإسبانية', icon: 'chat' },
  translation_es_ar: { label: 'ترجم إلى العربية', icon: 'chat' },
  translation_ar_es: { label: 'ترجم إلى الإسبانية', icon: 'chat' },
  multiple_choice: { label: 'اختر الإجابة الصحيحة', icon: 'cards' },
  word_choice: { label: 'اختر الكلمة الصحيحة', icon: 'cards' },
  distinguish_similar: { label: 'فرّق بين المتشابهات', icon: 'cards' },
  infer_meaning: { label: 'استنتج المعنى من السياق', icon: 'book' },
  choose_reply: { label: 'اختر الرد المناسب في الحوار', icon: 'chat' },
  phone_call_response: { label: 'ردّ على المكالمة المهنية', icon: 'chat' },
  resolve_customer_issue: { label: 'حلّ مشكلة العميل', icon: 'chat' },
  reading_comprehension: { label: 'اقرأ ثم أجب', icon: 'book' },
  read_answer: { label: 'اقرأ ثم أجب', icon: 'book' },
  find_fix_error: { label: 'اكتشف الخطأ وصحّحه', icon: 'book' },
  review_common_errors: { label: 'تجنّب الخطأ الشائع', icon: 'book' },
  correct_error: { label: 'صحّح الخطأ', icon: 'book' },
  error_correction: { label: 'صحّح الخطأ', icon: 'book' },
  grammar_transform: { label: 'تطبيق القاعدة', icon: 'book' },
  roleplay: { label: 'حوار وتمثيل دور', icon: 'chat' },
  roleplay_simulation: { label: 'محاكاة حوار تفاعلي', icon: 'chat' },
  speak_with_text: { label: 'تدرّب على النطق', icon: 'mic' },
  speak_free: { label: 'تحدّث بحرية', icon: 'mic' },
  speaking_prompt: { label: 'تدرّب على التحدّث', icon: 'mic' },
  write_sentence: { label: 'اكتب جملة', icon: 'book' },
  write_email: { label: 'اكتب رسالة', icon: 'book' },
  summarize_dialogue: { label: 'لخّص الحوار', icon: 'chat' },
};

function exerciseLabel(type: string): { label: string; icon: 'volume' | 'cards' | 'sort' | 'chat' | 'book' | 'mic' } {
  return EXERCISE_LABEL[type] ?? { label: 'تمرين تطبيقي', icon: 'book' };
}

function hasAnswer(exercise: LessonExercise, answer: unknown): boolean {
  // AUD-16: «المشاركة» تعني محاولة فعلية (نص مكتوب أو منطوق مُتعرف) لا ضغطة فارغة
  if (exercise.mode === 'participation') return typeof answer === 'string' && answer.trim().length > 0;
  if (Array.isArray(answer)) return answer.length > 0;
  if (exercise.options.length) return typeof answer === 'string' && answer.length > 0;
  return typeof answer === 'string' && answer.trim().length > 0;
}

function ExerciseBody({
  exercise,
  answer,
  setAnswer,
  disabled,
  correct,
  result,
  onSubmit,
  onPlayAudio,
  onReplayAudio,
  onToggleRate,
  audioRate,
  audioNotice,
  clearAudioNotice,
}: {
  exercise: LessonExercise;
  answer: unknown;
  setAnswer: (v: unknown) => void;
  disabled: boolean;
  /** حالة الإجابة بعد التحقق (null = لم يُجرَّب بعد) */
  correct?: boolean | null;
  result?: AnswerResult | null;
  onSubmit?: () => void;
  onPlayAudio: () => void;
  onReplayAudio: () => void;
  onToggleRate: () => void;
  audioRate: number;
  audioNotice: string | null;
  clearAudioNotice: () => void;
}) {
  const [tokens, setTokens] = useState<string[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

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
      onResult: res => {
        setSpeechTranscript(res.transcript);
        setAnswer(res.transcript);
      },
      onError: errMsg => {
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


  // زر تشغيل بلا نص منطوق = زر ميت صامت (playAudio يخرج مبكرًا)؛ لا نظهره أصلًا
  const hasAudio = !!(exercise.speechEs || exercise.stemEs);
  // الماسكوت حاضر في كل سؤال: عند غياب الجملة الإسبانية تعرض الفقاعة التعليمات نفسها
  const instructionBubble = (
    <p className="bubble-ar" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
      {exercise.instructionAr}
    </p>
  );
  const stemBubble = (
    <>
      {exercise.stemEs && <p className="bubble-es es" dir="ltr">{exercise.stemEs}</p>}
      {exercise.stemAr && <p className="bubble-ar">{exercise.stemAr}</p>}
    </>
  );
  const playButton = hasAudio ? (
    <button className="btn navy sm" data-testid="lesson-audio" onClick={onPlayAudio} type="button">
      <Icon name="volume" size={17} /> استمع
    </button>
  ) : null;

  const rateButton = hasAudio ? (
    <button className="btn ghost sm" data-testid="lesson-audio-rate" onClick={onToggleRate} type="button">
      {audioRate === 1.0 ? 'سرعة بطيئة (0.75x)' : audioRate === 0.75 ? 'سرعة سريعة (1.25x)' : 'السرعة العادية (1.0x)'}
    </button>
  ) : null;

  const optionGroup = (
    <div role="group" aria-label="اختر إجابة" style={{ marginTop: 'var(--s-4)' }}>
      {exercise.options.map((opt, i) => {
        const isChosen = answer === opt.id;
        const revealId = result?.correctOptionId ?? null;
        const mark = revealId && correct !== undefined
          ? opt.id === revealId ? 'correct' : isChosen ? 'wrong' : ''
          : '';
        return (
        <label key={opt.id} className={`choice ${isChosen ? 'selected' : ''} ${mark}`}>
          <input
            type="radio"
            name={`q-${exercise.id}`}
            value={opt.id}
            checked={answer === opt.id}
            disabled={disabled}
            onChange={() => setAnswer(opt.id)}
            style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
          />
          <span className="choice-letter" aria-hidden="true">
            {mark === 'correct' ? <Icon name="check" size={15} /> : mark === 'wrong' ? <Icon name="close" size={15} /> : String.fromCharCode(65 + i)}
          </span>
          <span className="choice-body"><span className="es">{opt.text}</span></span>
        </label>
        );
      })}
    </div>
  );

  /* تمارين المشاركة (نطق/محادثة حرة) */
  if (exercise.mode === 'participation') {
    const isSpeech = exercise.type === 'speak_with_text' || exercise.type === 'speak_free';
    const recSupported = isSpeechRecognitionSupported();
    return (
      <div>
        <QuestionScene>
          {exercise.stemEs ? (
            <>
              <p className="bubble-es es" dir="ltr">{exercise.stemEs}</p>
              {exercise.stemAr && <p className="bubble-ar">{exercise.stemAr}</p>}
            </>
          ) : (
            instructionBubble
          )}
        </QuestionScene>

        <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
          {hasAudio && (
            <button className="btn secondary sm" data-testid="lesson-audio" onClick={onPlayAudio} type="button">
              <Icon name="volume" size={17} /> استمع للنموذج
            </button>
          )}
          {rateButton}
          {isSpeech && recSupported && (
            <button
              className={`btn sm ${isRecording ? 'danger' : 'navy'}`}
              data-testid="speech-mic-btn"
              onClick={toggleRecording}
              type="button"
              disabled={disabled}
            >
              <Icon name="mic" size={17} /> {isRecording ? 'إيقاف الاستماع' : 'تحدّث الآن (ميكروفون المتصفح)'}
            </button>
          )}
        </div>

        {isRecording && (
          <p role="status" aria-live="polite" className="row small" style={{ color: 'var(--color-danger)', marginTop: 'var(--s-2)', gap: 'var(--s-2)' }}>
            <span className="rec-dot" aria-hidden="true" /> جارٍ الاستماع… تكلّم بالإسبانية الآن بصوت واضح
          </p>
        )}

        {speechTranscript && (
          <div className="card" style={{ marginTop: 'var(--s-3)', padding: 'var(--s-3)', background: 'var(--color-surface-2)' }}>
            <p className="small" style={{ margin: 0 }}>
              <strong>ما تعرّف عليه المتصفح:</strong> <span className="es">{speechTranscript}</span>
            </p>
            {exercise.stemEs && speechTranscript.trim().toLowerCase() === exercise.stemEs.trim().toLowerCase() && (
              <p className="row small" style={{ color: 'var(--color-success-strong)', margin: '4px 0 0', gap: 'var(--s-1)' }}>
                <Icon name="check-circle" size={16} /> ممتاز! نطقك طابق الجملة تمامًا.
              </p>
            )}
            <p className="small muted" style={{ margin: '4px 0 0' }}>
              (تمرين نطق لتدريب لسانك — لا يوجد تقييم آلي للنبرة، فالهدف هو التدرّب)
            </p>
          </div>
        )}

        {speechError && (
          <p role="alert" className="small error-text" style={{ marginTop: 'var(--s-2)' }}>{speechError}</p>
        )}

        {isSpeech && !recSupported && (
          <p className="small muted" style={{ marginTop: 'var(--s-2)' }}>
            ميزة التعرف الصوتي غير متوفرة في هذا المتصفح. يمكنك تكرار الجملة بصوت عالٍ ثم كتابتها أدناه للمشاركة.
          </p>
        )}

        <label className="field" style={{ marginTop: 'var(--s-4)' }}>
          <span>اكتب ما قلته أو ما فهمته (اختياري)</span>
          <textarea
            rows={3}
            disabled={disabled}
            value={typeof answer === 'string' ? answer : ''}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !disabled && onSubmit) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="اكتب هنا أو استخدم الميكروفون أعلاه…"
          />
        </label>
      </div>
    );
  }

  /* تمارين الاستماع */
  if (exercise.type === 'listen_choose' && exercise.options.length) {
    return (
      <div>
        <QuestionScene>
          <p className="bubble-ar" style={{ fontWeight: 700, color: 'var(--color-navy)', marginTop: 0 }}>
            {exercise.instructionAr}
          </p>
          <div className="row" style={{ gap: 'var(--s-2)', flexWrap: 'wrap' }}>
            {playButton}
            <button className="btn secondary sm" data-testid="lesson-audio-replay" onClick={onReplayAudio} type="button">
              <Icon name="refresh" size={16} /> إعادة الاستماع
            </button>
            {rateButton}
            {exercise.stemEs && (disabled || audioNotice) && (
              <button className="btn ghost sm" data-testid="toggle-transcript" onClick={() => setShowTranscript(v => !v)} type="button">
                {showTranscript ? 'إخفاء النص' : 'إظهار النص المكتوب'}
              </button>
            )}
          </div>
          {((showTranscript && disabled) || audioNotice) && exercise.stemEs && (
            <p className="bubble-es es" dir="ltr" style={{ marginTop: 'var(--s-3)', marginBottom: 0 }}>{exercise.stemEs}</p>
          )}
          {((showTranscript && disabled) || audioNotice) && exercise.stemAr && (
            <p className="bubble-ar" style={{ marginTop: 'var(--s-1)', marginBottom: 0 }}>{exercise.stemAr}</p>
          )}
        </QuestionScene>
        {audioNotice && (
          <p className="small muted" style={{ marginTop: 0 }}>
            <button type="button" className="btn ghost sm" onClick={clearAudioNotice}>حسنًا، أكمل بدون صوت</button>
          </p>
        )}
        {optionGroup}
      </div>
    );
  }

  /* خيارات عامة */
  if (exercise.options.length) {
    return (
      <div>
        <QuestionScene>
          {(exercise.stemEs || exercise.stemAr) ? stemBubble : instructionBubble}
          {hasAudio && <div style={{ marginTop: 'var(--s-2)' }}>{playButton}</div>}
        </QuestionScene>
        {optionGroup}
      </div>
    );
  }

  /* ترتيب الكلمات/الحوار */
  if ((exercise.type === 'word_order' || exercise.type === 'dialogue_order') && exercise.items.length) {
    const byId = new Map(exercise.items.map(i => [i.id, i.text]));
    const remaining = exercise.items.filter(i => !tokens.includes(i.id));
    const place = (ids: string[]) => {
      const nextValues = ids.map(id => byId.get(id) ?? '');
      setTokens(ids);
      setAnswer(nextValues);
    };
    return (
      <div>
        <QuestionScene>
          {(exercise.stemEs || exercise.stemAr) ? stemBubble : instructionBubble}
          {playButton && <div style={{ marginTop: 'var(--s-2)' }}>{playButton}</div>}
        </QuestionScene>
        <p className="small muted" style={{ marginBottom: 'var(--s-2)' }}>اضغط الكلمات بالترتيب الصحيح — أو استخدم لوحة المفاتيح.</p>
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
        <div className="token-box" dir="ltr" data-testid="remaining-tokens" style={{ marginTop: 'var(--s-3)', borderStyle: 'solid', background: 'var(--color-surface)' }}>
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

  /* إدخال نصي حر */
  const currentText = typeof answer === 'string' ? answer : '';
  return (
    <div>
      <QuestionScene>
        {(exercise.stemEs || exercise.stemAr) ? stemBubble : instructionBubble}
        {playButton && <div style={{ marginTop: 'var(--s-2)' }}>{playButton}</div>}
      </QuestionScene>
      <label className="field" style={{ marginTop: 'var(--s-4)' }}>
        <span>إجابتك بالإسبانية</span>
        {(['write_email', 'summarize_dialogue', 'write_sentence'].includes(exercise.type)) ? (
        <textarea
          ref={textAreaRef}
          data-testid="lesson-text"
          dir="ltr"
          className="es"
          rows={4}
          disabled={disabled}
          value={currentText}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Escribe aquí…"
          autoComplete="off"
          autoCapitalize="off"
        />
        ) : (
        <input
          ref={textInputRef}
          data-testid="lesson-text"
          type="text"
          dir="ltr"
          className="es"
          disabled={disabled}
          value={currentText}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !disabled && hasAnswer(exercise, answer) && onSubmit) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Escribe aquí…"
          autoComplete="off"
          autoCapitalize="off"
        />
        )}
      </label>
      <AccentBar
        disabled={disabled}
        onInsert={ch =>
          insertAtCursor(
            ['write_email', 'summarize_dialogue', 'write_sentence'].includes(exercise.type)
              ? textAreaRef.current
              : textInputRef.current,
            currentText,
            ch,
            setAnswer,
          )
        }
      />
    </div>
  );
}

/* ---------------- شاشة إكمال الدرس ---------------- */
function ResultScreen({
  completion,
  completionError,
  onRetryCompletion,
  session,
  results,
  onBack,
  onRetry,
  onReview,
  onNext,
  nextTitle,
}: {
  completion: CompleteResult | null;
  completionError: string | null;
  onRetryCompletion: () => void;
  session: LessonSession;
  results: Record<string, boolean | null>;
  onBack: () => void;
  onRetry: () => void;
  onReview: () => void;
  onNext?: () => void;
  nextTitle: string | null;
}) {
  const { user } = useAuth();
  const participation = Object.values(results).filter(v => v === null).length;
  const passed = completion?.passed ?? false;
  const firstCompletion = passed && !completion?.alreadyCompleted;
  const newVocab = session.lesson.brief.newVocabulary.filter(v => v.word);
  const missedExercises = session.exercises.filter(ex => results[ex.id] === false);
  const grammarPoints = session.lesson.brief.grammarPoints ?? [];

  return (
    <div
      className={`card result-hero ${completion ? (passed ? 'passed' : 'failed') : ''}`}
      data-testid="lesson-result"
      style={{ marginTop: 'var(--s-5)', position: 'relative', overflow: 'hidden' }}
    >
      {passed && (
        <div aria-hidden="true">
          {[
            { l: '8%', c: 'var(--color-primary)', d: '0s' },
            { l: '18%', c: 'var(--color-info)', d: '0.2s' },
            { l: '78%', c: 'var(--color-success)', d: '0.1s' },
            { l: '88%', c: '#FFB020', d: '0.3s' },
            { l: '46%', c: 'var(--color-primary)', d: '0.15s' },
            { l: '62%', c: 'var(--color-info)', d: '0.25s' },
          ].map((dot, i) => (
            <span key={i} className="confetti-dot" style={{ insetInlineStart: dot.l, top: 18 + (i % 3) * 14, background: dot.c, animationDelay: dot.d }} />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {passed ? (
          <Solecito mood="celebrate" size={168} />
        ) : (
          <div className="result-trophy">
            <Icon name={completion ? 'info' : 'clock'} size={40} />
          </div>
        )}
      </div>

      <h1 style={{ marginTop: 'var(--s-2)' }}>
        {passed ? 'أحسنت! أتممت الدرس' : completion ? 'تحتاج مزيدًا من التدريب' : 'جارٍ حساب النتيجة…'}
      </h1>
      {!completion && !completionError && <p className="muted">جارٍ حساب النتيجة على الخادم…</p>}
      {!completion && completionError && (
        <div className="alert" role="alert">
          <p style={{ margin: 0 }}>{completionError}</p>
          <button className="btn sm" style={{ marginTop: 'var(--s-2)' }} onClick={onRetryCompletion}>أعد حساب النتيجة</button>
        </div>
      )}

      {completion && (
        <>
          {firstCompletion && completion.xpAwarded > 0 && (
            <div className="result-xp">
              <Icon name="star" size={18} /> +<span className="num">{completion.xpAwarded}</span> XP
            </div>
          )}

          <div className="result-stats">
            <div className="result-stat">
              <b className="num">{completion.accuracy}%</b>
              <span>الدقة</span>
            </div>
            <div className="result-stat">
              <b className="num">{completion.correctCount}/{completion.gradedTotal}</b>
              <span>إجابات صحيحة</span>
            </div>
            <div className="result-stat">
              <b className="num">{completion.xpAwarded > 0 ? `+${completion.xpAwarded}` : '0'}</b>
              <span>نقاط هذا الدرس</span>
            </div>
          </div>

          <p>
            {passed
              ? completion.alreadyCompleted
                ? 'هذا الدرس مكتمل سابقًا — أتممت الدرس بنجاح مرة أخرى، ولا تُمنح نقاط إضافية عند الإعادة.'
                : `أتممت الدرس بنجاح${completion.xpAwarded ? ` وكسبت ${completion.xpAwarded} XP` : ''}. إجمالي رصيدك الآن ${completion.xpTotal} XP.`
              : `لم تُحقق حد الإتقان (${completion.minAccuracy}%). أعد المحاولة — التقدم محفوظ على الخادم.`}
          </p>

          {(completion.reviewCardsCreated ?? 0) > 0 && (
            <p className="small muted">
              <Icon name="cards" size={14} /> أُضيفت {completion.reviewCardsCreated} بطاقة مراجعة من مفردات الدرس إلى مجموعتك.
            </p>
          )}
          {participation > 0 && (
            <p className="small muted">{participation} تمرين مشاركة (نطق/محادثة) لم يُدخل في حساب الدقة.</p>
          )}
          {!completion.passed && completion.missingRequiredTypes.length > 0 && (
            <p className="small error-text">أنواع تمارين مطلوبة غير موجودة في هذا الدرس: {completion.missingRequiredTypes.join('، ')}</p>
          )}

          {(newVocab.length > 0 || missedExercises.length > 0 || grammarPoints.length > 0) && (
            <div className="result-summary-panels">
              {newVocab.length > 0 && (
                <div className="result-panel">
                  <h2>مفردات تعلّمتها في هذا الدرس ({newVocab.length})</h2>
                  <div className="vocab-list">
                    {newVocab.map(v => (
                      <button
                        key={v.word}
                        type="button"
                        className="vocab-chip"
                        style={{ cursor: 'pointer', font: 'inherit' }}
                        onClick={() => {
                          audioService.setRate(1.0);
                          void audioService.play({ key: `res-${v.word}`, text: v.word, variant: user?.audioVariant });
                        }}
                      >
                        <Icon name="volume" size={13} />
                        <b className="es" dir="ltr">{v.word}</b>
                        <span>{v.meaningFusha ?? v.meaningEg ?? ''}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {grammarPoints.length > 0 && (
                <div className="result-panel">
                  <h2>القواعد والمفاهيم المغطاة</h2>
                  <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                    {grammarPoints.map((gp, i) => (
                      <span key={`gp-${i}`} className="badge navy">{gp.titleAr}</span>
                    ))}
                  </div>
                </div>
              )}

              {missedExercises.length > 0 && (
                <div className="result-panel">
                  <h2>نقاط تحتاج منك مراجعة ({missedExercises.length})</h2>
                  <ul className="list-plain" style={{ margin: 0 }}>
                    {missedExercises.map(ex => (
                      <li key={ex.id} className="small">
                        {ex.stemEs ? <b className="es" dir="ltr">{ex.stemEs}</b> : <b>{ex.instructionAr}</b>}
                        {ex.stemAr ? ` — ${ex.stemAr}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="result-actions">
        {completion && passed && onNext && (
          <button className="btn lg" onClick={onNext} data-testid="result-next-lesson">
            <Icon name="play" size={18} /> الدرس التالي{nextTitle ? `: ${nextTitle}` : ''}
          </button>
        )}
        {completion && passed && !onNext && (
          <button className="btn lg" onClick={onBack}>
            <Icon name="home" size={18} /> عد إلى مسارك
          </button>
        )}
        {completion && (
          <button className="btn secondary" onClick={onReview}>
            <Icon name="cards" size={17} /> راجع مفرداتك
          </button>
        )}
        <button className={`btn ${completion && passed ? 'ghost' : 'navy'}`} onClick={onBack}>
          رجوع إلى لوحتي
        </button>
        <button className="btn ghost" onClick={onRetry}>إعادة الدرس</button>
      </div>

      <p className="small muted" style={{ marginTop: 'var(--s-4)' }}>
        نتيجة درس «{session.lesson.titleAr}» — كل رقم محسوب من محاولاتك المخزَّنة في القاعدة، والخادم هو مصدر الحقيقة.
      </p>
    </div>
  );
}
