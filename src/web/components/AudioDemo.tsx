import { useEffect, useState } from 'react';
import { audioService } from '../audio/instance';
import type { AudioState } from '../audio/AudioService';

/**
 * تجربة صوت صادقة: تعرض المصدر المستخدم فعلًا (تسجيل أم صوت الجهاز)
 * وتشرح الحدود بلا ادعاء جودة احترافية.
 */
export function AudioDemo({ text, audioKey, variant }: { text: string; audioKey: string; variant?: 'es-ES' | 'es-419' }) {
  const [state, setState] = useState<AudioState>(audioService.getState());
  const [rate, setRate] = useState(1);
  const [note, setNote] = useState<string | null>(null);
  const [source, setSource] = useState<'asset' | 'speech' | 'none' | null>(null);

  useEffect(() => audioService.onStateChange(setState), []);

  async function play() {
    const r = await audioService.play({ key: audioKey, text, variant });
    setSource(r.source);
    setNote(r.ok && r.source === 'speech'
      ? 'الصوت الآن من جهازك (احتياطي) — النطق يعتمد على الأصوات المثبتة، وقد يختلف عن صوت متحدث أصلي.'
      : r.messageAr ?? null);
  }

  return (
    <div className="stack">
      <p className="es" style={{ fontSize: '1.15rem' }}>{text}</p>
      <div className="audio-demo">
        <button className="btn" onClick={play} aria-describedby="audio-hint">
          {state === 'playing' ? 'إيقاف' : state === 'loading' ? 'جارٍ التحميل…' : '🔊 استمع'}
        </button>
        <label className="small" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          السرعة
          <input
            type="range" min={0.5} max={1.5} step={0.25} value={rate}
            onChange={e => { const v = Number(e.target.value); setRate(v); audioService.setRate(v); }}
            aria-label="سرعة الاستماع"
          />
          <span className="num small">{rate.toFixed(2)}×</span>
        </label>
        <span className="audio-state" role="status" aria-live="polite">
          {state === 'playing' ? 'يعمل' : state === 'loading' ? 'يحمّل' : state === 'error' ? 'تعذّر' : 'متوقف'}
          {source === 'speech' && ' · مصدر: صوت الجهاز'}
          {source === 'asset' && ' · مصدر: تسجيل'}
        </span>
      </div>
      {note && <p className="small muted" id="audio-hint">{note}</p>}
      {!note && (
        <p className="small muted" id="audio-hint">
          التسجيل الأصلي لهذه الجملة لم يُنتج بعد، لذا يُستخدم صوت الجهاز إن توفّر صوت إسباني. لا ندّعي أن جودة الصوت احترافية.
        </p>
      )}
    </div>
  );
}
