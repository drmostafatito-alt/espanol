/* ============================================================================
   شاشة المراجعة المتباعدة
   ----------------------------------------------------------------------------
   مبادئ:
   * بطاقة واحدة في كل مرة، والتذكّر قبل كشف الإجابة.
   * التقييم يُرسل للخادم؛ الخادم هو من يحدد الموعد القادم.
   * إن انقطعت الشبكة لا نفقد التقييم: يُحفظ في قائمة انتظار محلية بمفتاح حدث
     ثابت، ويُعاد إرساله لاحقًا. الخادم يمنع التكرار بـclientEventId، فإعادة
     الإرسال آمنة تمامًا. لا نقول «تم الحفظ» قبل تأكيد الخادم.
   * لا ادعاء لنطق أو استماع: لا بطاقات استماع قبل وجود صوت معتمد.
   ========================================================================== */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError, type ReviewCard, type ReviewPayload, type ReviewRating } from '../api';
import { readQueue, writeQueue, type PendingReview } from '../review-queue';
import { useAuth } from '../state';
import { ErrorState, LoadingState, ProgressBar } from '../components/ui';
import { AccentBar, insertAtCursor } from '../components/AccentBar';
import { audioService } from '../audio/instance';
import { normalizeEs } from '../../shared/normalize-es';
import { Icon } from '../components/icons';
import { Solecito } from '../components/Illustrations';
import { Mascot } from '../components/Mascot';

// قائمة الانتظار انتقلت إلى وحدة مستقلة (src/web/review-queue.ts) حتى لا
// تُحمَّل صفحة المراجعة كاملة مع الحزمة الأساسية. نعيد التصدير للتوافق.
export { bindPendingQueue, clearPendingQueue } from '../review-queue';

function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID().replace(/-/g, '');
  return `ev${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/** لافتة الموعد القادم من dueAt الفعلي، لا من intervalDays (بطاقة hard الجديدة مستحقة بعد 12 ساعة لا «غدًا»). */
function formatNextDue(dueAt: string): string {
  const ms = new Date(dueAt).getTime() - Date.now();
  if (!Number.isFinite(ms)) return 'غدًا';
  const mins = Math.max(0, Math.round(ms / 60000));
  const ar = (n: number) => n.toLocaleString('ar-EG');
  if (mins < 60) return mins <= 1 ? 'بعد دقيقة' : `بعد ${ar(mins)} دقيقة`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `بعد ${ar(hours)} ساعة`;
  return `بعد ${ar(Math.round(hours / 24))} يوم`;
}

const RATING_LABEL: Record<ReviewRating, string> = {
  again: 'لم أتذكّر',
  hard: 'صعب',
  good: 'جيد',
  easy: 'سهل',
};

const RATING_KEY: Record<string, ReviewRating> = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' };

type Phase = 'loading' | 'card' | 'revealed' | 'saving' | 'empty' | 'error' | 'expired';
type ErrorKind = 'network' | 'server' | 'generic';

export function Review({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'due' | 'weak'>(() => {
    if (typeof window === 'undefined') return 'due';
    return new URLSearchParams(window.location.search).get('mode') === 'weak' ? 'weak' : 'due';
  });
  const [payload, setPayload] = useState<ReviewPayload | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<ErrorKind>('generic');
  const [lastNext, setLastNext] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [typedGuess, setTypedGuess] = useState('');
  const guessInputRef = useRef<HTMLInputElement | null>(null);
  const shownAt = useRef<number>(Date.now());
  const cardRef = useRef<HTMLDivElement | null>(null);
  const savingRef = useRef(false);

  const cards = useMemo(() => payload?.cards ?? [], [payload]);
  const card: ReviewCard | undefined = cards[index];

  const userId = user?.id ?? null;

  useEffect(() => {
    return () => {
      void audioService.stop();
    };
  }, []);

  const playWord = (key: string, text: string | null | undefined) => {
    if (!text) return;
    audioService.setRate(1.0);
    void audioService.play({ key, text, variant: user?.audioVariant });
  };

  const flushQueue = useCallback(async () => {
    if (!userId) return; // بلا مستخدم معروف لا نلمس أي طابور — ولا طابور غيره
    const queued = readQueue(userId);
    if (!queued.length) {
      setPendingCount(0);
      return;
    }
    const left: PendingReview[] = [];
    for (const item of queued) {
      if (item.userId !== userId) continue; // دفاع إضافي: لا يُرسَل تقييم إلا لصاحبه
      try {
        await api.submitReview({
          clientEventId: item.clientEventId,
          cardId: item.cardId,
          rating: item.rating,
          responseMs: item.responseMs,
        });
      } catch (err) {
        // 400/404 فقط = طلب مرفوض نهائيًا (بطاقة محذوفة مثلًا) ⇒ لا معنى لإعادة المحاولة.
        // أخطاء الجلسة (401/403) والخادم والشبكة لا تعني أن التقييم فقد قيمته:
        // يبقى في القائمة لمحاولة لاحقة بدل فقدانه صامتًا (AUD-14).
        if (err instanceof ApiError && (err.status === 400 || err.status === 404)) continue;
        left.push(item);
      }
    }
    writeQueue(userId, left);
    setPendingCount(left.length);
    setOffline(left.length > 0);
  }, [userId]);

  const load = useCallback(async () => {
    setPhase('loading');
    setError(null);
    try {
      const res = await api.reviewSession(undefined, mode);
      setPayload(res);
      setIndex(0);
      setTypedGuess('');
      setPhase(res.cards.length ? 'card' : 'empty');
      setOffline(false);
    } catch (err) {
      // 401: الجلسة منتهية — المعالج المركزي سيحوّل لصفحة الدخول؛ نعرض حالة هادئة لا بطاقة خطأ مخيفة
      if (err instanceof ApiError && err.isUnauthorized()) {
        setPhase('expired');
        return;
      }
      if (err instanceof ApiError && err.isNetwork()) {
        setErrorKind('network');
        setError('تعذّر الوصول إلى الخادم. تحقّق من اتصالك بالإنترنت، ثم أعد المحاولة — تقييماتك المحفوظة لن تضيع.');
      } else {
        setErrorKind('server');
        setError(err instanceof ApiError ? err.message : 'تعذّر تحميل بطاقات المراجعة. حاول مرة أخرى بعد قليل.');
      }
      setPhase('error');
    }
  }, [mode]);

  // التحميل مرة واحدة عند الدخول فقط: إعادة التحميل عند وصول هوية المستخدم
  // كانت تُعيد الطور إلى 'card' وتمحو كشف الإجابة أثناء تقييم المستخدم.
  const flushRef = useRef(flushQueue);
  flushRef.current = flushQueue;
  useEffect(() => {
    void flushRef.current().then(load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  // عند وصول هوية المستخدم (بعد تحميل الجلسة) نُفرّغ طابوره فقط، بلا إعادة تحميل.
  useEffect(() => {
    if (userId) void flushQueue();
  }, [flushQueue, userId]);

  useEffect(() => {
    const onOnline = () => void flushQueue();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [flushQueue]);

  useEffect(() => {
    shownAt.current = Date.now();
    setTypedGuess('');
    cardRef.current?.focus();
  }, [index, phase === 'card']);

  const rate = useCallback(
    async (rating: ReviewRating) => {

      // setPhase غير متزامن؛ بلا حارس متزامن تمرّ نقرتان سريعتان فتجدول البطاقة مرتين.
      if (!card || phase === 'saving' || !userId || savingRef.current) return;
      savingRef.current = true;
      const item: PendingReview = {
        clientEventId: newEventId(),
        cardId: card.id,
        rating,
        responseMs: Date.now() - shownAt.current,
        queuedAt: Date.now(),
        userId,
      };
      setPhase('saving');
      try {
        const res = await api.submitReview({
          clientEventId: item.clientEventId,
          cardId: item.cardId,
          rating: item.rating,
          responseMs: item.responseMs,
        });
        setLastNext(formatNextDue(res.next.dueAt));
        setOffline(false);
      } catch (err) {
        if (err instanceof ApiError && err.isUnauthorized()) {
          // انتهاء الجلسة أثناء التقييم: التحويل المركزي قادم؛ لا نضع التقييم في قائمة المحاولة
          setPhase('expired');
          return;
        }
        if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
          setError(err.message);
          setPhase('card');
          return;
        }
        // فشل شبكة: نحفظ في قائمة الانتظار ولا نقول إنه حُفظ على الخادم
        const queued = [...readQueue(userId), item];
        writeQueue(userId, queued);
        setPendingCount(queued.length);
        setOffline(true);
        setLastNext('لم يُرسل بعد — سيُرسل عند عودة الاتصال');
      } finally {
        savingRef.current = false;
      }
      if (index + 1 < cards.length) {
        setIndex(i => i + 1);
        setPhase('card');
      } else {
        setPhase('empty');
      }
    },
    [card, cards.length, index, phase, userId],
  );

  // اختصارات لوحة المفاتيح: مسافة لكشف الإجابة، و1–4 للتقييم
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' && phase === 'card') {
        e.preventDefault();
        setPhase('revealed');
        return;
      }
      if (phase === 'revealed' && RATING_KEY[e.key]) {
        e.preventDefault();
        void rate(RATING_KEY[e.key]!);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, rate]);

  if (phase === 'loading') {
    return (
      <div className="container" style={{ maxWidth: 640, paddingTop: 'var(--s-6)' }}>
        <LoadingState text="جارٍ تحميل بطاقاتك…" />
      </div>
    );
  }

  if (phase === 'expired') {
    return (
      <div className="container" style={{ maxWidth: 640, paddingTop: 'var(--s-6)' }}>
        <div className="state-box" role="status">
          <div className="spinner" />
          <p className="muted" style={{ margin: 0 }}>
            انتهت جلستك. جارٍ التحويل إلى صفحة تسجيل الدخول…
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="container" style={{ maxWidth: 640, paddingTop: 'var(--s-4)' }}>
        <ErrorState
          variant={errorKind === 'network' ? 'warning' : 'error'}
          title={errorKind === 'network' ? 'تعذّر الاتصال بالخادم' : 'تعذّر تحميل المراجعة'}
          description={error ?? undefined}
          onRetry={() => void load()}
          onBack={() => navigate('/learn')}
          backLabel="رجوع إلى لوحتي"
        />
      </div>
    );
  }

  const session = payload?.session;

  if (phase === 'empty' || !card) {
    const reason = payload?.emptyReason;
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card" data-testid="review-empty" style={{ textAlign: 'center' }}>
          <Solecito mood="happy" size={132} />
          <h1 style={{ marginTop: 'var(--s-2)' }}>
            {mode === 'weak' ? 'لا توجد كلمات متعثرة للمراجعة الآن' : 'لا بطاقات مستحقة الآن'}
          </h1>
          {reason === 'NO_VALID_CARDS' ? (
            <p>
              بطاقاتك المستحقة بلا بيانات عرض صالحة حاليًا (مشكلة بيانات، لا حدّ يومي).
              جرّب التحقق مرة أخرى، وإن تكرر الأمر أخبرنا.
            </p>
          ) : reason === 'DAILY_LIMIT_REACHED' ? (
            <p>
              وصلت إلى حدّك اليومي ({session?.limits.newPerDay} بطاقة جديدة و{session?.limits.reviewsPerDay} مراجعة).
              يمكنك العودة غدًا — التقدّم محفوظ.
            </p>
          ) : mode === 'weak' ? (
            <p>لا توجد لديك بطاقات متعثرة حاليًا — أداء ممتاز! يمكنك مراجعة البطاقات المستحقة أو استعراض مكتبة المفردات.</p>
          ) : (
            <p>أتممت كل ما هو مستحق. العودة غدًا تعطي دماغك وقتًا لتثبيت ما تعلّمته.</p>
          )}
          {lastNext && <p className="small muted">آخر بطاقة: موعدها القادم {lastNext}.</p>}
          {pendingCount > 0 && (
            <p className="banner-warn small" role="status">
              {pendingCount} تقييم لم يُرسل بعد. سيُرسل تلقائيًا عند عودة الاتصال — لا يضيع.
            </p>
          )}
          <div className="row" style={{ marginTop: 'var(--s-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => void load()}>تحقّق مرة أخرى</button>
            {mode === 'weak' && (
              <button
                className="btn navy"
                onClick={() => {
                  setMode('due');
                  window.history.replaceState({}, '', '/review');
                }}
              >
                كل البطاقات المستحقة
              </button>
            )}
            <button className="btn secondary" onClick={() => navigate('/learn')}>رجوع إلى لوحتي</button>
            <button className="btn ghost" onClick={() => navigate('/review/packs')}>حزم المفردات</button>
          </div>
        </div>
      </div>
    );
  }

  const revealed = phase === 'revealed' || phase === 'saving';
  const progressPct = Math.round((index / Math.max(1, cards.length)) * 100);
  const expectedEs = card.kind === 'production' ? card.revealEs : card.headwordEs;
  const guessExact =
    typedGuess.trim().length > 0 && expectedEs
      ? normalizeEs(typedGuess) === normalizeEs(expectedEs)
      : null;

  return (
    <div className="lesson-shell" style={{ paddingBlock: 'var(--s-4) var(--s-6)' }}>
      <div className="lesson-top">
        <div className="row" style={{ gap: 'var(--s-3)', flexWrap: 'nowrap' }}>
          <button className="lesson-close" onClick={() => navigate('/learn')} aria-label="خروج من المراجعة">
            <Icon name="close" size={20} />
          </button>
          <div className="lesson-title" style={{ minWidth: 0, flex: 1 }}>
            <h1>{mode === 'weak' ? 'تركيز على الكلمات المتعثرة' : 'مراجعة الكلمات'}</h1>
            <span className="small muted">
              بطاقة <span className="num">{index + 1}</span> من <span className="num">{cards.length}</span> · متبقٍ اليوم:{' '}
              <span className="num">{session?.newRemaining ?? 0}</span> جديدة
            </span>
          </div>
          {mode === 'weak' && (
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => {
                setMode('due');
                window.history.replaceState({}, '', '/review');
              }}
            >
              المراجعة العادية
            </button>
          )}
          <span className="node-badge current num">{progressPct}%</span>
        </div>
        <div className="lesson-progress-wrap" style={{ marginTop: 'var(--s-2)' }}>
          <ProgressBar value={progressPct} label="تقدم المراجعة" height={12} />
        </div>
      </div>

      {offline && (
        <p className="banner-warn small" role="status" data-testid="review-offline">
          لا اتصال: تقييماتك تُحفظ على جهازك ({pendingCount}) وتُرسل عند عودة الشبكة.
        </p>
      )}

      <div
        className="card review-card"
        ref={cardRef}
        tabIndex={-1}
        data-testid="review-card"
        aria-live="polite"
      >
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            <p className="small muted" style={{ margin: 0 }}>
              {card.kind === 'production' ? 'أنتج الكلمة' : 'تعرّف على الكلمة'}
              {card.level ? ` · ${card.level}` : ''}
            </p>
            {(card.lapses ?? 0) > 0 && (
              <span className="badge danger">تعثرت <span className="num">{card.lapses}</span>×</span>
            )}
          </div>
          <Mascot size={64} alt="" />
        </div>

        {card.kind === 'production' ? (
          <>
            <p className="review-prompt" data-testid="review-prompt">{card.promptAr}</p>
            {card.promptHintAr && <p className="small muted">{card.promptHintAr}</p>}
            {!revealed && (
              <div style={{ marginTop: 'var(--s-3)' }}>
                <label className="field">
                  <span className="small muted">اختبر تذكّرك بكتابة الكلمة بالإسبانية (اختياري)</span>
                  <input
                    ref={guessInputRef}
                    type="text"
                    dir="ltr"
                    className="es"
                    value={typedGuess}
                    onChange={e => setTypedGuess(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setPhase('revealed');
                      }
                    }}
                    placeholder="اكتب الإجابة ثم اضغط إظهار الإجابة…"
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                </label>
                <AccentBar
                  onInsert={ch => insertAtCursor(guessInputRef.current, typedGuess, ch, setTypedGuess)}
                />
              </div>
            )}
            {revealed && (
              <div data-testid="review-answer">
                <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                  <p className="es" dir="ltr" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{card.revealEs}</p>
                  {card.revealEs && (
                    <button
                      type="button"
                      className="btn ghost sm icon-only-btn"
                      onClick={() => playWord(`rev-prod-${card.id}`, card.revealEs)}
                      aria-label={`استمع إلى ${card.revealEs}`}
                    >
                      <Icon name="volume" size={18} />
                    </button>
                  )}
                </div>
                {guessExact !== null && (
                  <p className={`small ${guessExact ? 'success-text' : 'error-text'}`} style={{ marginTop: 6 }}>
                    {guessExact ? 'كتابتك مطابقة تمامًا!' : `كتبتَ: «${typedGuess}»`}
                  </p>
                )}
                {card.exampleEs && (
                  <div className="row" style={{ gap: 8, alignItems: 'center', marginTop: 8 }}>
                    <span className="es small" dir="ltr">«{card.exampleEs}»</span>
                    <button
                      type="button"
                      className="btn ghost sm icon-only-btn"
                      onClick={() => playWord(`rev-ex-${card.id}`, card.exampleEs)}
                      aria-label="استمع إلى المثال"
                    >
                      <Icon name="volume" size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="row" style={{ gap: 10, alignItems: 'center', justifyContent: 'center' }}>
              <p className="es review-prompt" dir="ltr" data-testid="review-prompt" style={{ margin: 0 }}>{card.headwordEs}</p>
              {card.headwordEs && (
                <button
                  type="button"
                  className="btn ghost sm icon-only-btn"
                  onClick={() => playWord(`rev-rec-${card.id}`, card.headwordEs)}
                  aria-label={`استمع إلى ${card.headwordEs}`}
                >
                  <Icon name="volume" size={18} />
                </button>
              )}
            </div>
            {card.ipa && <p className="small muted" dir="ltr">{card.ipa}</p>}
            {revealed && (
              <div data-testid="review-answer">
                <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{card.revealAr}</p>
                {user?.explanationStyle !== 'fusha' && card.revealArEg && <p className="small muted">بالعامية: {card.revealArEg}</p>}
                {card.exampleEs && (
                  <div className="row" style={{ gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <p className="es small" dir="ltr" style={{ margin: 0 }}>«{card.exampleEs}»</p>
                    <button
                      type="button"
                      className="btn ghost sm icon-only-btn"
                      onClick={() => playWord(`rev-ex-${card.id}`, card.exampleEs)}
                      aria-label="استمع إلى المثال"
                    >
                      <Icon name="volume" size={14} />
                    </button>
                  </div>
                )}
                {card.usageNoteAr && <p className="small muted">{card.usageNoteAr}</p>}
                {card.commonErrorAr && <p className="small error-text">خطأ شائع: {card.commonErrorAr}</p>}
              </div>
            )}
          </>
        )}

        {!revealed && (
          <button
            className="btn block"
            data-testid="review-reveal"
            style={{ marginTop: 'var(--s-4)' }}
            onClick={() => setPhase('revealed')}
          >
            أظهر الإجابة <span className="small" style={{ opacity: 0.88, fontWeight: 500 }}>(مسافة)</span>
          </button>
        )}

        {revealed && (
          <div className="rating-grid" role="group" aria-label="قيّم تذكّرك" style={{ marginTop: 'var(--s-4)' }}>
            {(['again', 'hard', 'good', 'easy'] as ReviewRating[]).map((r, i) => (
              <button
                key={r}
                className={`btn rating rating-${r}`}
                data-testid={`review-rate-${r}`}
                disabled={phase === 'saving'}
                onClick={() => void rate(r)}
              >
                {RATING_LABEL[r]} <span className="small muted">{i + 1}</span>
              </button>
            ))}
          </div>
        )}

        {error && <p role="alert" className="small error-text">{error}</p>}
        {lastNext && phase !== 'saving' && (
          <p className="small muted" data-testid="review-last-next">البطاقة السابقة: {lastNext}</p>
        )}
      </div>

      <p className="small muted" style={{ marginTop: 'var(--s-3)' }}>
        الموعد القادم يحسبه الخادم من تقييمك؛ لا تُحسب نقاط إضافية عند تكرار نفس التقييم.
      </p>
    </div>
  );
}
