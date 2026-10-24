import { useEffect, useState } from 'react';
import { audioService, getAvailableVoicesInfo, waitForVoices } from '../audio/instance';
import type { AudioState } from '../audio/AudioService';
import { Icon } from './icons';

/**
 * تجربة صوت صادقة وموحّدة:
 * - زر واحد كبير يعرض الحالة (تشغيل/تحميل/إيقاف/خطأ)
 * - تحكم سرعة منظم
 * - رسالة قدرات الجهاز دقيقة: لا ادعاء بوجود صوت ولا اتهام للجهاز بلا دليل
 */
export function AudioDemo({
  text,
  audioKey,
  variant,
  title = 'جرّب الصوت الآن',
}: {
  text: string;
  audioKey: string;
  variant?: 'es-ES' | 'es-419';
  title?: string;
}) {
  const [state, setState] = useState<AudioState>(audioService.getState());
  const [rate, setRate] = useState(1);
  const [note, setNote] = useState<string | null>(null);
  const [source, setSource] = useState<'asset' | 'speech' | 'none' | null>(null);
  const [capability, setCapability] = useState(() => getAvailableVoicesInfo());

  useEffect(() => audioService.onStateChange(setState), []);

  useEffect(() => {
    let alive = true;
    void waitForVoices().then(() => {
      if (alive) setCapability(getAvailableVoicesInfo());
    });
    return () => {
      alive = false;
    };
  }, []);

  async function play() {
    setNote(null);
    const r = await audioService.play({ key: audioKey, text, variant });
    setSource(r.source);
    if (!r.ok && r.messageAr) {
      setNote(r.messageAr);
    } else if (r.ok && r.source === 'speech') {
      setNote('الصوت الآن من نطق متصفحك (احتياطي) — جودته تعتمد على الأصوات المثبتة على جهازك.');
    }
  }

  function toggle() {
    if (state === 'playing' || state === 'loading') {
      audioService.stop();
      setState('idle');
      return;
    }
    void play();
  }

  const busy = state === 'loading';
  const playing = state === 'playing';

  return (
    <div className="audio-card">
      <div className="audio-card-head">
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span className={`badge ${capability.synthesisSupported && capability.spanishVoices.length ? 'success' : 'accent'}`}>
          {capability.synthesisSupported
            ? capability.spanishVoices.length
              ? `صوت إسباني متاح (${capability.spanishVoices.length})`
              : 'بلا صوت إسباني مثبت'
            : 'النطق غير مدعوم'}
        </span>
      </div>

      <p className="es audio-sentence" dir="ltr" lang="es">{text}</p>

      <div className="audio-controls">
        <button
          type="button"
          className={`btn ${playing ? 'secondary' : 'navy'} audio-play-btn`}
          onClick={toggle}
          aria-label={playing ? 'أوقف النطق' : 'استمع للجملة'}
          aria-busy={busy}
        >
          {busy ? (
            <span className="spinner" style={{ width: 20, height: 20, borderWidth: 3, margin: 0 }} aria-hidden="true" />
          ) : playing ? (
            <Icon name="close" size={20} />
          ) : (
            <Icon name="volume" size={22} />
          )}
          {busy ? 'جارٍ التجهيز…' : playing ? 'إيقاف' : 'استمع'}
        </button>

        <label className="audio-rate">
          <span className="small muted">السرعة</span>
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.25}
            value={rate}
            aria-label="سرعة النطق"
            onChange={e => {
              const v = Number(e.target.value);
              setRate(v);
              audioService.setRate(v);
            }}
          />
          <span className="num small" dir="ltr">{rate.toFixed(2)}×</span>
        </label>
      </div>

      <p className="audio-state small" role="status" aria-live="polite">
        {state === 'playing'
          ? source === 'asset'
            ? 'يعمل الآن من تسجيل صوتي'
            : 'يعمل الآن من نطق المتصفح'
          : state === 'error'
            ? 'تعذّر التشغيل — النص مكتوب أمامك ويمكنك المتابعة'
            : 'جاهز للتشغيل — اضغط الزر واستمع'}
      </p>

      {note && (
        <div className={note.includes('النطق الآن') ? 'alert info audio-note' : 'alert audio-note'} role="status">
          {note}
        </div>
      )}
      {!capability.synthesisSupported && (
        <p className="small muted" style={{ marginBottom: 0 }}>
          متصفحك لا يدعم النطق الصوتي حاليًا. جرّب متصفحًا حديثًا أو ثبّت حزمة أصوات إسبانية على جهازك، والنص يظل متاحًا للقراءة.
        </p>
      )}
      {capability.synthesisSupported && capability.spanishVoices.length === 0 && (
        <p className="small muted" style={{ marginBottom: 0 }}>
          لا توجد أصوات إسبانية مثبتة على هذا الجهاز. ثبّت صوتًا إسبانيًا من إعدادات نظام التشغيل لسماع النطق، ولن نستبدله بصوت لغة أخرى.
        </p>
      )}
    </div>
  );
}
