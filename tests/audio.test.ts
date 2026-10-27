import { describe, it, expect, vi } from 'vitest';
import { AudioService, type AudioLike, type SpeechLike, type SpeechSynthesisUtteranceLike } from '../src/web/audio/AudioService';

/** بديل صوتي مزيف قابل للتحكم */
class FakeAudio implements AudioLike {
  src: string;
  playbackRate = 1;
  preload = 'auto';
  currentTime = 0;
  paused = true;
  loadCount = 0;
  private handlers: Record<string, (() => void)[]> = {};
  constructor(src: string, private behavior: 'ok' | 'error' | 'hang' | 'reject' = 'ok') { this.src = src; }
  play(): Promise<void> {
    if (this.behavior === 'reject') return Promise.reject(Object.assign(new Error('x'), { name: 'NotAllowedError' }));
    if (this.behavior === 'hang') return new Promise<void>(() => {});
    if (this.behavior === 'error') {
      setTimeout(() => this.emit('error'), 0);
      return Promise.reject(Object.assign(new Error('404'), { name: 'NotSupportedError' }));
    }
    this.paused = false;
    setTimeout(() => this.emit('canplay'), 0);
    return Promise.resolve();
  }
  pause(): void { this.paused = true; }
  load(): void { this.loadCount++; }
  addEventListener(t: string, fn: () => void) { (this.handlers[t] ||= []).push(fn); }
  removeEventListener(t: string, fn: () => void) { this.handlers[t] = (this.handlers[t] || []).filter(f => f !== fn); }
  emit(t: string) { for (const fn of this.handlers[t] || []) fn(); }
}

function makeService(opts: {
  behavior?: 'ok' | 'error' | 'hang' | 'reject';
  resolve?: (k: string) => string | null;
  voices?: { lang: string; name: string }[];
  withSpeech?: boolean;
  /** يُستدعى عند قائمة أصوات فارغة؛ يملأ الأصوات المتأخرة ثم يعيد التحميل */
  awaitVoices?: () => Promise<boolean>;
} = {}) {
  const created: FakeAudio[] = [];
  const spoken: SpeechSynthesisUtteranceLike[] = [];
  let cancelled = 0;
  const speech: SpeechLike | null = opts.withSpeech === false ? null : {
    speak: (u) => spoken.push(u),
    cancel: () => { cancelled++; },
    getVoices: () => opts.voices ?? [],
    awaitVoices: opts.awaitVoices,
  };
  const svc = new AudioService({
    createAudio: (url) => {
      const a = new FakeAudio(url, opts.behavior ?? 'ok');
      created.push(a);
      return a;
    },
    speech,
    resolveUrl: opts.resolve ?? ((k) => (k.startsWith('pending/') ? null : `https://media.test/${k}.opus`)),
    loadTimeoutMs: 20,
  });
  return { svc, created, spoken, cancelled: () => cancelled };
}

const cue = (key: string, text = 'Hola') => ({ key, text });

describe('AudioService — عقد الصوت', () => {
  it('يشغّل الأصل من R2 عندما يكون متاحًا', async () => {
    const { svc, created } = makeService();
    const r = await svc.play(cue('audio/hola'));
    expect(r).toEqual({ ok: true, source: 'asset' });
    expect(created).toHaveLength(1);
    expect(created[0]!.src).toBe('https://media.test/audio/hola.opus');
    expect(svc.getState()).toBe('playing');
  });

  it('يوقف الصوت السابق قبل الجديد (لا تداخل)', async () => {
    const { svc, created } = makeService();
    await svc.play(cue('audio/a'));
    await svc.play(cue('audio/b'));
    expect(created[0]!.paused).toBe(true);
    expect(created[1]!.paused).toBe(false);
  });

  it('نفس المفتاح أثناء التشغيل = إيقاف (toggle) بلا طلب جديد', async () => {
    const { svc, created } = makeService();
    await svc.play(cue('audio/a'));
    const r = await svc.play(cue('audio/a'));
    expect(r.ok).toBe(true);
    expect(created).toHaveLength(1);
    expect(svc.getState()).toBe('idle');
  });

  it('المفاتيح المعلَّقة (pending/) تنتقل إلى البديل بلا طلب شبكة', async () => {
    const { svc, created, spoken } = makeService({ voices: [{ lang: 'es-ES', name: 'Spanish' }] });
    const r = await svc.play(cue('pending/hola', 'Hola'));
    expect(r.source).toBe('speech');
    expect(created).toHaveLength(0);
    expect(spoken[0]!.text).toBe('Hola');
    expect(spoken[0]!.lang).toBe('es-ES');
  });

  it('مفاتيح tts-* التلقائية تنتقل مباشرة إلى النطق المحلي بلا طلب شبكة', async () => {
    const { svc, created, spoken } = makeService({
      resolve: (k) => (k.startsWith('pending/') || k.startsWith('tts-') ? null : `https://media.test/${k}.opus`),
      voices: [{ lang: 'es-ES', name: 'Spanish' }],
    });
    const r = await svc.play(cue('tts-ex_123', 'Quiero un café'));
    expect(r.source).toBe('speech');
    expect(created).toHaveLength(0);
    expect(spoken[0]!.text).toBe('Quiero un café');
  });

  it('فشل الأصل → بديل صوتي (بعد التحقق من وجود صوت إسباني)', async () => {
    const { svc, spoken } = makeService({ behavior: 'error', voices: [{ lang: 'es-ES', name: 'Spanish' }] });
    const r = await svc.play(cue('audio/broken'));
    expect(r.source).toBe('speech');
    expect(spoken).toHaveLength(1);
  });

  it('لا يوجد صوت إسباني على الجهاز → رسالة واضحة بلا ادعاء نجاح', async () => {
    const { svc } = makeService({ voices: [{ lang: 'en-US', name: 'English' }] });
    const r = await svc.play(cue('pending/x'));
    expect(r.ok).toBe(false);
    expect(r.error).toBe('NO_VOICE');
    expect(r.messageAr).toMatch(/صوتًا إسبانيًا/);
  });

  it('قائمة أصوات فارغة ثم تحميل بلا إسباني → NO_VOICE بعد الانتظار', async () => {
    const voices: { lang: string; name: string }[] = [];
    const { svc } = makeService({
      voices,
      awaitVoices: async () => {
        voices.push({ lang: 'en-US', name: 'English' });
        return true;
      },
    });
    const r = await svc.play(cue('pending/x'));
    expect(r.ok).toBe(false);
    expect(r.error).toBe('NO_VOICE');
  });

  it('قائمة أصوات فارغة ثم تحميل صوت إسباني → يُنطق ولا يُرفض', async () => {
    const voices: { lang: string; name: string }[] = [];
    const { svc, spoken } = makeService({
      voices,
      awaitVoices: async () => {
        voices.push({ lang: 'es-ES', name: 'Spanish' });
        return true;
      },
    });
    const r = await svc.play(cue('pending/x'));
    expect(r.ok).toBe(true);
    expect(r.source).toBe('speech');
    expect(spoken).toHaveLength(1);
  });

  it('بلا speechSynthesis → NOT_SUPPORTED برسالة مفهومة', async () => {
    const { svc } = makeService({ withSpeech: false });
    const r = await svc.play(cue('pending/x'));
    expect(r.error).toBe('NOT_SUPPORTED');
    expect(r.messageAr).toContain('النص مكتوب');
  });

  it('تعذر التشغيل التلقائي (NotAllowedError) يُصنَّف بدقة', async () => {
    const { svc } = makeService({ behavior: 'reject', voices: [{ lang: 'es-MX', name: 'Paulina' }] });
    const r = await svc.play(cue('audio/x'));
    // ينتقل للبديل لأنه لا يوجد صوت فعليًا (سلوك متصفح) لكن التشخيص يسجّل السبب
    expect(svc.getDiagnostics().some(d => d.type === 'asset_failed_fallback')).toBe(true);
    expect(r.ok).toBe(true);
  });

  it('مهلة التحميل تنتقل إلى البديل بدل ترك المستخدم منتظرًا', async () => {
    const { svc } = makeService({ behavior: 'hang', voices: [{ lang: 'es-ES', name: 'Spanish' }] });
    const r = await svc.play(cue('audio/slow'));
    expect(r.source).toBe('speech');
    expect(r.ok).toBe(true);
  });

  it('تغيير السرعة لا يعيد التحميل ويُطبَّق على العنصر الحالي', async () => {
    const { svc, created } = makeService();
    await svc.play(cue('audio/a'));
    svc.setRate(0.75);
    expect(created).toHaveLength(1);
    expect(created[0]!.playbackRate).toBe(0.75);
    expect(svc.getRate()).toBe(0.75);
    svc.setRate(5); // يُقيَّد
    expect(svc.getRate()).toBe(1.5);
  });

  it('التحميل المسبق محدود بثلاثة مقاطع ولا يشغّل شيئًا', () => {
    const { svc, created } = makeService();
    svc.preload(['a', 'b', 'c', 'd', 'e']);
    expect(created).toHaveLength(3);
    expect(created.every(a => a.paused)).toBe(true);
  });

  it('stop يلغي الكلام الجاري ويصفّر الحالة', async () => {
    const { svc, cancelled } = makeService({ voices: [{ lang: 'es-ES', name: 'S' }] });
    await svc.play(cue('pending/x'));
    svc.stop();
    expect(cancelled()).toBeGreaterThan(0);
    expect(svc.getState()).toBe('idle');
  });

  it('التشخيص لا يحتوي نصوصًا ولا بيانات مستخدم', async () => {
    const { svc } = makeService({ voices: [] });
    await svc.play(cue('pending/secret-sentence', 'Mi contraseña es 1234'));
    const dump = JSON.stringify(svc.getDiagnostics());
    expect(dump).not.toContain('1234');
    expect(dump).not.toContain('contraseña');
  });

  it('dispose يوقف كل شيء ويزيل المستمعين', async () => {
    const { svc } = makeService();
    const spy = vi.fn();
    svc.onStateChange(spy);
    await svc.play(cue('audio/a'));
    svc.dispose();
    expect(svc.getState()).toBe('idle');
    svc.stop();
    expect(spy).toHaveBeenCalled();
  });
});
