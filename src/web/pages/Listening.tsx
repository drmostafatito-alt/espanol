import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type ListeningHubClip } from '../api';
import { useAuth } from '../state';
import { audioService } from '../audio/instance';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../audio/speechRecognition';
import { normalizeEs } from '../../shared/normalize-es';
import { AccentBar, insertAtCursor } from '../components/AccentBar';
import { Icon } from '../components/icons';
import { EmptyState, ErrorState, LevelBadge, LoadingState } from '../components/ui';

const LEVELS = ['ALL', 'PREA1', 'A1', 'A2', 'B1', 'B2', 'C1'] as const;

export function Listening({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [clips, setClips] = useState<ListeningHubClip[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<string>('ALL');
  const [mode, setMode] = useState<'dictation' | 'speaking'>('dictation');
  const [index, setIndex] = useState(0);
  const [rate, setRate] = useState<number>(1.0);
  const [dictation, setDictation] = useState('');
  const [checked, setChecked] = useState<boolean | null>(null);
  const [revealText, setRevealText] = useState(false);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [speechErr, setSpeechErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const recRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);

  const load = useCallback(() => {
    setError(null);
    api
      .listeningHub({ level: level === 'ALL' ? undefined : level, limit: 60 })
      .then(res => {
        setClips(res.clips);
        setIndex(0);
        setDictation('');
        setChecked(null);
        setRevealText(false);
        setSpokenText('');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'تعذّر تحميل مقاطع الاستماع.'));
  }, [level]);

  useEffect(load, [load]);
  useEffect(() => () => { void audioService.stop(); recRef.current?.abort(); }, []);

  const current = clips?.[index];

  const playCurrent = (overrideRate?: number) => {
    if (!current) return;
    setAudioNotice(null);
    const r = overrideRate ?? rate;
    audioService.setRate(r);
    void audioService
      .play({ key: current.audioKey || `listen-${current.id}`, text: current.es, variant: user?.audioVariant })
      .then(res => {
        if (res && res.ok === false) {
          setAudioNotice(res.messageAr ?? 'تعذّر تشغيل الصوت في هذا المتصفح — يمكنك إظهار النص للممارسة.');
        }
      })
      .catch(() => setAudioNotice('تعذّر تشغيل الصوت في هذا المتصفح.'));
  };

  const checkDictation = () => {
    if (!current) return;
    const isOk = normalizeEs(dictation) === normalizeEs(current.es);
    setChecked(isOk);
    setRevealText(true);
  };

  const nextClip = () => {
    if (!clips?.length) return;
    setIndex(i => (i + 1) % clips.length);
    setDictation('');
    setChecked(null);
    setRevealText(false);
    setSpokenText('');
    setSpeechErr(null);
    setAudioNotice(null);
  };

  const toggleMic = () => {
    if (recording) {
      recRef.current?.stop();
      setRecording(false);
      return;
    }
    setSpeechErr(null);
    const rec = createSpeechRecognizer({
      lang: user?.audioVariant === 'es-419' ? 'es-419' : 'es-ES',
      onStart: () => setRecording(true),
      onResult: res => setSpokenText(res.transcript),
      onError: msg => { setSpeechErr(msg); setRecording(false); },
      onEnd: () => setRecording(false),
    });
    if (!rec) {
      setSpeechErr('التعرّف الصوتي غير مدعوم في هذا المتصفح. استمع وردّد الجملة بصوت واضح.');
      return;
    }
    recRef.current = rec;
    rec.start();
  };

  if (!user) return null;

  return (
    <div className="hub-page">
      <header className="hub-hero">
        <div>
          <span className="continue-eyebrow">
            <Icon name="headset" size={14} /> استوديو الاستماع والنطق
          </span>
          <h1>درّب أذنك ولسانك</h1>
          <p className="muted">
            استمع لجمل حقيقية من دروس المنهج بسرعات متعددة، اختبر سمعك بالإملاء، وتدرّب على النطق الواضح.
          </p>
        </div>
        <div className="hub-hero-actions">
          <div className="tabs-row" role="tablist" aria-label="وضع التدريب" style={{ margin: 0 }}>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'dictation'}
              className={`level-pill${mode === 'dictation' ? ' active' : ''}`}
              onClick={() => setMode('dictation')}
            >
              <Icon name="volume" size={15} /> استماع وإملاء
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'speaking'}
              className={`level-pill${mode === 'speaking' ? ' active' : ''}`}
              onClick={() => setMode('speaking')}
            >
              <Icon name="mic" size={15} /> تدريب النطق
            </button>
          </div>
        </div>
      </header>

      <div className="hub-controls card tight">
        <div className="tabs-row" role="tablist" aria-label="تصفية المستوى" style={{ margin: 0 }}>
          {LEVELS.map(lv => (
            <button
              key={lv}
              type="button"
              role="tab"
              aria-selected={level === lv}
              className={`level-pill${level === lv ? ' active' : ''}`}
              onClick={() => setLevel(lv)}
            >
              {lv === 'ALL' ? 'كل المستويات' : lv === 'PREA1' ? 'Pre-A1' : lv}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState title="تعذّر تحميل المقاطع" description={error} onRetry={load} />}
      {!error && !clips && <LoadingState text="جارٍ تجهيز استوديو الاستماع…" />}

      {clips && clips.length === 0 && (
        <EmptyState
          icon="headset"
          title="لا مقاطع في هذا المستوى"
          description="اختر مستوى آخر للاستماع والتدريب."
          action={<button type="button" className="btn secondary sm" onClick={() => setLevel('ALL')}>كل المستويات</button>}
        />
      )}

      {current && (
        <section className="card listening-studio">
          <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
            <div className="row" style={{ gap: 'var(--s-2)' }}>
              <LevelBadge level={current.level} />
              <span className="small muted">{current.lessonTitleAr}</span>
            </div>
            <span className="small muted num">مقطع {index + 1} من {clips!.length}</span>
          </div>

          <p className="small muted" style={{ margin: 'var(--s-2) 0 var(--s-4)' }}>{current.contextAr}</p>

          <div className="listening-player">
            <button type="button" className="btn lg" onClick={() => playCurrent()}>
              <Icon name="volume" size={20} /> استمع الآن
            </button>
            <div className="speed-group" role="group" aria-label="سرعة الصوت">
              {[0.75, 1.0, 1.25].map(r => (
                <button
                  key={r}
                  type="button"
                  className={`btn sm ${rate === r ? 'navy' : 'secondary'}`}
                  onClick={() => { setRate(r); playCurrent(r); }}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>

          {audioNotice && (
            <p className="banner-warn small" role="status" style={{ marginTop: 'var(--s-3)' }}>
              {audioNotice}
            </p>
          )}

          {mode === 'dictation' ? (
            <div style={{ marginTop: 'var(--s-4)' }}>
              <label className="field">
                <span>اكتب ما سمعته بالإسبانية</span>
                <input
                  ref={inputRef}
                  type="text"
                  dir="ltr"
                  className="es"
                  value={dictation}
                  onChange={e => { setDictation(e.target.value); setChecked(null); }}
                  onKeyDown={e => { if (e.key === 'Enter' && dictation.trim()) checkDictation(); }}
                  placeholder="Escribe lo que escuchas…"
                />
              </label>
              <AccentBar
                onInsert={ch => insertAtCursor(inputRef.current, dictation, ch, setDictation)}
              />
              <div className="row" style={{ marginTop: 'var(--s-3)', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
                <button type="button" className="btn" disabled={!dictation.trim()} onClick={checkDictation}>
                  تحقّق من الإملاء
                </button>
                <button type="button" className="btn secondary" onClick={() => setRevealText(v => !v)}>
                  {revealText ? 'إخفاء النص' : 'إظهار النص والمعنى'}
                </button>
                <button type="button" className="btn ghost" onClick={nextClip}>
                  المقطع التالي <Icon name="arrow-left" size={16} />
                </button>
              </div>
              {checked !== null && (
                <div className={`feedback-sheet ${checked ? 'ok' : 'bad'}`} style={{ marginTop: 'var(--s-3)' }}>
                  <span className="fb-icon"><Icon name={checked ? 'check' : 'close'} size={20} /></span>
                  <div>
                    <h3>{checked ? 'ممتاز! تطابق تام' : 'تحتاج مراجعة بسيطة'}</h3>
                    <p className="es" dir="ltr" style={{ fontWeight: 700, margin: '4px 0 0' }}>{current.es}</p>
                    <p className="small muted" style={{ margin: '2px 0 0' }}>{current.ar}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginTop: 'var(--s-4)' }}>
              <div className="card flat">
                <p className="es" dir="ltr" style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px' }}>
                  {current.es}
                </p>
                <p className="small muted" style={{ margin: 0 }}>{current.ar}</p>
              </div>
              <div className="row" style={{ marginTop: 'var(--s-3)', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
                {isSpeechRecognitionSupported() ? (
                  <button
                    type="button"
                    className={`btn ${recording ? 'danger' : 'navy'}`}
                    onClick={toggleMic}
                  >
                    <Icon name="mic" size={18} /> {recording ? 'إيقاف التسجيل' : 'سجّل نطقك الآن'}
                  </button>
                ) : (
                  <p className="small muted" style={{ margin: 0 }}>
                    التعرّف الصوتي غير متوفر في هذا المتصفح — استمع وكرّر بصوت مسموع ثم انتقل للتالي.
                  </p>
                )}
                <button type="button" className="btn ghost" onClick={nextClip}>
                  الجملة التالية <Icon name="arrow-left" size={16} />
                </button>
              </div>
              {spokenText && (
                <p className="small" style={{ marginTop: 'var(--s-3)' }}>
                  <strong>ما سُمع:</strong> <span className="es" dir="ltr">{spokenText}</span>
                </p>
              )}
              {speechErr && <p className="small error-text" style={{ marginTop: 'var(--s-2)' }}>{speechErr}</p>}
            </div>
          )}

          {revealText && mode === 'dictation' && checked === null && (
            <div className="card flat" style={{ marginTop: 'var(--s-3)' }}>
              <p className="es" dir="ltr" style={{ fontWeight: 800, margin: '0 0 4px' }}>{current.es}</p>
              <p className="small muted" style={{ margin: 0 }}>{current.ar}</p>
            </div>
          )}

          {current.isUnlocked && (
            <div style={{ marginTop: 'var(--s-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--s-3)' }}>
              <button type="button" className="btn sm ghost" onClick={() => navigate(`/learn/${current.lessonSlug}`)}>
                <Icon name="book" size={15} /> افتح الدرس الأصلي: {current.lessonTitleAr}
              </button>
            </div>
          )}
        </section>
      )}

      {/* ---------------- مختبر المقاطع والمقطع المشدود (§8) ---------------- */}
      <section className="card" style={{ marginTop: 'var(--s-4)' }} aria-labelledby="syllables-lab-title">
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <div>
            <span className="continue-eyebrow">
              <Icon name="volume" size={14} /> دليل النطق الصوتي للمتحدث العربي
            </span>
            <h2 id="syllables-lab-title" style={{ margin: '4px 0 0', fontSize: '1.2rem' }}>
              تقطيع المقاطع والمقطع المشدود (Sílaba Tónica)
            </h2>
          </div>
          <span className="badge info">تسجيلات صوتية حقيقية · سرعة عادية وبطيئة</span>
        </div>
        <p className="small muted" style={{ margin: '0 0 14px' }}>
          في الإسبانية يُنطق كل حرف مكتوب تقريبًا (ما عدا حرف <b>h</b> الصامت)، ويبرز مقطع واحد في كل كلمة يُسمّى <b>المقطع المشدود</b> (المميز باللون الأخضر أدناه):
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 12,
          }}
        >
          {[
            {
              key: 'vocab-hola',
              word: 'Hola',
              meaningAr: 'مرحبًا',
              syllables: ['HO', 'la'],
              stressedIndex: 0,
              phoneticAr: 'أُو - لا (حرف H صامت لا يُنطق)',
            },
            {
              key: 'vocab-gracias',
              word: 'Gracias',
              meaningAr: 'شكرًا',
              syllables: ['GRA', 'cias'],
              stressedIndex: 0,
              phoneticAr: 'غْرا - ثياس / غْرا - سياس',
            },
            {
              key: 'core_cafe',
              word: 'Café',
              meaningAr: 'قهوة',
              syllables: ['ca', 'FÉ'],
              stressedIndex: 1,
              phoneticAr: 'كا - فِيه (النبر على المقطع الأخير لوجود علامة ´)',
            },
            {
              key: 'core_buenos_dias',
              word: 'Buenos días',
              meaningAr: 'صباح الخير',
              syllables: ['BUE', 'nos', 'DÍ', 'as'],
              stressedIndex: 2,
              phoneticAr: 'بْوِي - نوس دِي - آس',
            },
            {
              key: 'vocab-me-llamo',
              word: 'Me llamo',
              meaningAr: 'اسمي',
              syllables: ['me', 'LLA', 'mo'],
              stressedIndex: 1,
              phoneticAr: 'مِي يَا - مو (حرفا ll يُنطقان ياءً)',
            },
            {
              key: 'phonetic_h_habitacion',
              word: 'Habitación',
              meaningAr: 'غرفة فندق',
              syllables: ['ha', 'bi', 'ta', 'CIÓN'],
              stressedIndex: 3,
              phoneticAr: 'آ - بي - تا - ثْيُون (H صامتة والنبر في الآخر)',
            },
          ].map(item => (
            <div
              key={item.key}
              className="card tight"
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong className="es" dir="ltr" style={{ fontSize: '1.15rem' }}>
                  {item.word}
                </strong>
                <span className="badge neutral">{item.meaningAr}</span>
              </div>

              <div dir="ltr" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                {item.syllables.map((syl, sIdx) => {
                  const isStressed = sIdx === item.stressedIndex;
                  return (
                    <span
                      key={sIdx}
                      className="es"
                      style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        background: isStressed ? 'var(--primary-soft)' : 'var(--bg-surface)',
                        color: isStressed ? 'var(--primary-hover)' : 'var(--text-secondary)',
                        border: isStressed ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      }}
                      title={isStressed ? 'المقطع المشدود (Sílaba tónica)' : 'مقطع غير مشدود'}
                    >
                      {syl}
                    </span>
                  );
                })}
              </div>

              <p className="small muted" style={{ margin: 0 }}>
                النطق التقريبي: <b>{item.phoneticAr}</b>
              </p>

              <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
                <button
                  type="button"
                  className="btn sm secondary"
                  onClick={() => {
                    audioService.setRate(1.0);
                    void audioService.play({ key: item.key, text: item.word, variant: user?.audioVariant });
                  }}
                >
                  <Icon name="volume" size={14} /> عادي (1x)
                </button>
                <button
                  type="button"
                  className="btn sm ghost"
                  onClick={() => {
                    audioService.setRate(0.75);
                    void audioService.play({ key: item.key, text: item.word, variant: user?.audioVariant });
                  }}
                >
                  🐢 بطيء (0.75x)
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

