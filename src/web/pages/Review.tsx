/* ============================================================================
   شاشة المراجعة المتباعدة
   ----------------------------------------------------------------------------
   مبادئ:
   * بطاقة واحدة في كل مرة، والتذكّر قبل كشف الإجابة.
   * التقييم يُرسل للخادم؛ الخادم هو من يحدد الموعد القادم.
   * إن انقطعت الشبكة لا نفقد التقييم: يُحفظ في قائمة انتظار محلية بمفتاح حدث
     ثابت، ويُعاد إرساله لاحقًا. الخادم يمنع التكرار بـclientEventId، فإعادة
     الإرسال آمنة تمامًا. لا نقول «تم الحفظ» قبل تأكيد الخادم.
   * لا ادعاء لملفات صوتية: زر «استمع» في البطاقة يستخدم نطق المتصفح
     (speechSynthesis) عبر audioService نفسه المستعمل في الدروس، بمفتاح
     tts-review-…، ولا يُنطق جواب بطاقة الإنتاج قبل كشفه.
   ========================================================================== */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError, type ReviewCard, type ReviewPayload, type ReviewRating } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { Icon, ProgressBar } from '../components/ui';
import { CartoonScene, cartoonForReviewCard } from '../components/Illustrations';

const QUEUE_KEY = 'srs.pending.v1';

interface PendingReview {
  clientEventId: string;
  cardId: string;
  rating: ReviewRating;
  responseMs: number;
  queuedAt: number;
}

function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID().replace(/-/g, '');
  return `ev${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function readQueue(): PendingReview[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as PendingReview[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: PendingReview[]): void {
  try {
    if (items.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
    else localStorage.removeItem(QUEUE_KEY);
  } catch {
    /* التخزين قد يكون معطّلًا (وضع خاص) — نفشل بهدوء ولا ندّعي حفظًا */
  }
}

const RATING_LABEL: Record<ReviewRating, string> = {
  again: 'لم أتذكّر',
  hard: 'صعب',
  good: 'جيد',
  easy: 'سهل',
};

const RATING_KEY: Record<string, ReviewRating> = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' };

type Phase = 'loading' | 'card' | 'revealed' | 'saving' | 'empty' | 'error';

export function Review({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [payload, setPayload] = useState<ReviewPayload | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<string | null>(null);
  const [lastNext, setLastNext] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const shownAt = useRef<number>(Date.now());
  const cardRef = useRef<HTMLDivElement | null>(null);

  const cards = useMemo(() => payload?.cards ?? [], [payload]);
  const card: ReviewCard | undefined = cards[index];
  const revealed = phase === 'revealed' || phase === 'saving';
  // نص الاستماع: كلمة التعرّف نفسها، أو جواب بطاقة الإنتاج بعد كشفه فقط
  // (نطقه قبل الكشف كان سيكشف الجواب سمعيًا).
  const listenText = card
    ? card.kind === 'production'
      ? revealed ? card.revealEs : undefined
      : card.headwordEs
    : undefined;

  const playListen = useCallback(() => {
    if (!card || !listenText) return;
    setAudioNotice(null);
    void audioService
      .play({ key: `tts-review-${card.id}`, text: listenText, variant: user?.audioVariant })
      .then(res => {
        if (res && res.ok === false) {
          setAudioNotice(res.messageAr ?? 'تعذّر تشغيل الصوت على هذا المتصفح.');
        }
      })
      .catch(() => setAudioNotice('تعذّر تشغيل الصوت على هذا المتصفح.'));
  }, [card, listenText, user?.audioVariant]);

  // إيقاف الصوت عند مغادرة المراجعة — لا صوت يعيش بعد الشاشة
  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, []);

  const flushQueue = useCallback(async () => {
    const queued = readQueue();
    if (!queued.length) {
      setPendingCount(0);
      return;
    }
    const left: PendingReview[] = [];
    for (const item of queued) {
      try {
        await api.submitReview({
          clientEventId: item.clientEventId,
          cardId: item.cardId,
          rating: item.rating,
          responseMs: item.responseMs,
        });
      } catch (err) {
        // 4xx = الطلب مرفوض نهائيًا (بطاقة محذوفة مثلًا) ⇒ لا معنى لإعادة المحاولة
        if (err instanceof ApiError && err.status >= 400 && err.status < 500) continue;
        left.push(item);
      }
    }
    writeQueue(left);
    setPendingCount(left.length);
    setOffline(left.length > 0);
  }, []);

  const load = useCallback(async () => {
    setPhase('loading');
    setError(null);
    try {
      const res = await api.reviewSession();
      setPayload(res);
      setIndex(0);
      setPhase(res.cards.length ? 'card' : 'empty');
      setOffline(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'تعذّر تحميل بطاقات المراجعة.');
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    void flushQueue().then(load);
  }, [flushQueue, load]);

  useEffect(() => {
    const onOnline = () => void flushQueue();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [flushQueue]);

  useEffect(() => {
    shownAt.current = Date.now();
    setAudioNotice(null);
    cardRef.current?.focus();
  }, [index, phase === 'card']);

  const rate = useCallback(
    async (rating: ReviewRating) => {
      if (!card || phase === 'saving') return;
      const item: PendingReview = {
        clientEventId: newEventId(),
        cardId: card.id,
        rating,
        responseMs: Date.now() - shownAt.current,
        queuedAt: Date.now(),
      };
      setPhase('saving');
      try {
        const res = await api.submitReview({
          clientEventId: item.clientEventId,
          cardId: item.cardId,
          rating: item.rating,
          responseMs: item.responseMs,
        });
        const days = res.next.intervalDays;
        setLastNext(days === 0 ? 'بعد ١٠ دقائق' : days === 1 ? 'غدًا' : `بعد ${days} يومًا`);
        setOffline(false);
      } catch (err) {
        if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
          setError(err.message);
          setPhase('card');
          return;
        }
        // فشل شبكة: نحفظ في قائمة الانتظار ولا نقول إنه حُفظ على الخادم
        const queued = [...readQueue(), item];
        writeQueue(queued);
        setPendingCount(queued.length);
        setOffline(true);
        setLastNext('لم يُرسل بعد — سيُرسل عند عودة الاتصال');
      }
      if (index + 1 < cards.length) {
        setIndex(i => i + 1);
        setPhase('card');
      } else {
        setPhase('empty');
      }
    },
    [card, cards.length, index, phase],
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

  if (phase === 'loading') return <p className="container muted">جارٍ تحميل بطاقاتك…</p>;

  if (phase === 'error') {
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Icon name="warn" size={32} label="تعذّر تحميل المراجعة" />
          <h1 style={{ marginTop: 'var(--s-2)' }}>تعذّر تحميل المراجعة</h1>
          <p role="alert">{error}</p>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => void load()}>أعد المحاولة</button>
            <button className="btn secondary" onClick={() => navigate('/learn')}>رجوع إلى لوحتي</button>
          </div>
        </div>
      </div>
    );
  }

  const session = payload?.session;

  if (phase === 'empty' || !card) {
    const reason = payload?.emptyReason;
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card" data-testid="review-empty" style={{ textAlign: 'center' }}>
          <Icon name="book" size={32} label="لا بطاقات مستحقة" />
          <h1 style={{ marginTop: 'var(--s-2)' }}>لا بطاقات مستحقة الآن</h1>
          {reason === 'DAILY_LIMIT_REACHED' ? (
            <p>
              وصلت إلى حدّك اليومي ({session?.limits.newPerDay} بطاقة جديدة و{session?.limits.reviewsPerDay} مراجعة).
              يمكنك العودة غدًا — التقدّم محفوظ.
            </p>
          ) : (
            <p>أتممت كل ما هو مستحق. العودة غدًا تعطي دماغك وقتًا لتثبيت ما تعلّمته.</p>
          )}
          {lastNext && <p className="small muted">آخر بطاقة: موعدها القادم {lastNext}.</p>}
          {pendingCount > 0 && (
            <p className="banner-warn small" role="status">
              {pendingCount} تقييم لم يُرسل بعد. سيُرسل تلقائيًا عند عودة الاتصال — لا يضيع.
            </p>
          )}
          <div className="row" style={{ marginTop: 'var(--s-4)', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => void load()}>تحقّق مرة أخرى</button>
            <button className="btn secondary" onClick={() => navigate('/learn')}>رجوع إلى لوحتي</button>
            <button className="btn ghost" onClick={() => navigate('/review/packs')}>حزم المفردات</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)', flexWrap: 'wrap' }}>
        <button className="btn ghost sm" onClick={() => navigate('/learn')}><Icon name="arrowR" size={16} /> خروج</button>
        <span className="small muted num">
          {index + 1} / {cards.length} · متبقٍ اليوم: {session?.newRemaining ?? 0} جديد
        </span>
      </div>
      <ProgressBar value={cards.length ? (index / cards.length) * 100 : 0} label="تقدم جلسة المراجعة" showPct={false} />

      {offline && (
        <p className="banner-warn small" role="status" data-testid="review-offline">
          <Icon name="warn" size={16} /> لا اتصال: تقييماتك تُحفظ على جهازك ({pendingCount}) وتُرسل عند عودة الشبكة.
        </p>
      )}

      <div
        className="card review-card"
        ref={cardRef}
        tabIndex={-1}
        data-testid="review-card"
        aria-live="polite"
        style={{ minWidth: 0, overflowWrap: 'break-word' }}
      >
        {/* رأس كرتوني مطابق لموضوع البطاقة — من الحقول الظاهرة فقط، لا يلمّح للجواب */}
        <div style={{ width: 150, maxWidth: '100%', margin: '0 auto var(--s-2)' }}>
          <CartoonScene
            cartoon={cartoonForReviewCard({
              headwordEs: card.headwordEs,
              promptAr: card.promptAr,
              promptHintAr: card.promptHintAr ?? undefined,
            })}
            label="رسم يوضح موضوع بطاقة المراجعة"
          />
        </div>
        <p className="small muted" style={{ marginTop: 0 }}>
          {card.kind === 'production' ? 'أنتج الكلمة' : 'تعرّف على الكلمة'}
          {card.level ? ` · ${card.level}` : ''}
        </p>

        {card.kind === 'production' ? (
          <>
            <p className="review-prompt" data-testid="review-prompt">{card.promptAr}</p>
            {card.promptHintAr && <p className="small muted">{card.promptHintAr}</p>}
            {revealed && (
              <div data-testid="review-answer">
                <p className="es" dir="ltr" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{card.revealEs}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="es review-prompt" dir="ltr" data-testid="review-prompt">{card.headwordEs}</p>
            {card.ipa && <p className="small muted" dir="ltr">{card.ipa}</p>}
            {revealed && (
              <div data-testid="review-answer">
                <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{card.revealAr}</p>
                {user?.explanationStyle !== 'fusha' && card.revealArEg && <p className="small muted">بالعامية: {card.revealArEg}</p>}
                {card.exampleEs && <p className="es small" dir="ltr">«{card.exampleEs}»</p>}
                {card.usageNoteAr && <p className="small muted">{card.usageNoteAr}</p>}
                {card.commonErrorAr && <p className="small error-text">خطأ شائع: {card.commonErrorAr}</p>}
              </div>
            )}
          </>
        )}

        {listenText && (
          <div className="row" style={{ marginTop: 'var(--s-3)' }}>
            <button type="button" className="btn secondary sm" data-testid="review-listen" onClick={playListen}>
              <Icon name="listen" size={17} /> استمع
            </button>
            <span className="small muted">نطق المتصفح — لا ملف صوتي مسجّل</span>
          </div>
        )}

        {audioNotice && (
          <p role="status" className="small" data-testid="review-audio-notice">{audioNotice}</p>
        )}

        {!revealed && (
          <button
            className="btn block"
            data-testid="review-reveal"
            style={{ marginTop: 'var(--s-4)' }}
            onClick={() => setPhase('revealed')}
          >
            أظهر الإجابة <span className="small muted">(مسافة)</span>
          </button>
        )}

        {revealed && (
          <div className="rating-grid" role="group" aria-label="قيّم تذكّرك" style={{ marginTop: 'var(--s-4)', minWidth: 0 }}>
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
