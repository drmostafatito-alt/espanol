/* ============================================================================
   AudioService — خدمة صوت مستقلة عن مكونات الدروس
   العقد (بناءً على متطلبات المالك):
   1) R2 أولًا، وspeechSynthesis احتياطًا فقط بعد التحقق من وجود صوت إسباني.
   2) لا انتظار توليد عند الضغط: لا TTS وقت التشغيل على الخادم؛ إما أصل جاهز أو بديل محلي.
   3) صوت واحد فقط: أي طلب جديد يوقف السابق (بلا تداخل).
   4) منع الطلبات المكررة: نفس المفتاح أثناء التشغيل = إيقاف (toggle)، ونفس المفتاح أثناء التحميل = لا طلب ثانٍ.
   5) تغيير السرعة بلا إعادة تحميل (playbackRate).
   6) إلغاء آمن عند إغلاق الدرس/الانتقال (dispose/stop + AbortController).
   7) أخطاء مفهومة للمستخدم، وتشخيص غير حساس داخليًا.
   ========================================================================== */

export type AudioErrorCode = 'ASSET_MISSING' | 'NETWORK' | 'NOT_SUPPORTED' | 'NO_VOICE' | 'PLAY_REJECTED' | 'ABORTED';
export type AudioState = 'idle' | 'loading' | 'playing' | 'error';

export interface AudioLike {
  src: string;
  playbackRate: number;
  preload: string;
  play(): Promise<void>;
  pause(): void;
  load?(): void;
  addEventListener(type: 'canplay' | 'ended' | 'error' | 'timeupdate', fn: () => void): void;
  removeEventListener(type: string, fn: () => void): void;
  currentTime: number;
}

export interface SpeechLike {
  speak(utterance: SpeechSynthesisUtteranceLike): void;
  cancel(): void;
  getVoices(): { lang: string; name: string }[];
  speaking?: boolean;
}
export interface SpeechSynthesisUtteranceLike {
  text: string;
  lang: string;
  rate: number;
  onend?: () => void;
  onerror?: (e: unknown) => void;
}

export interface Cue { key: string; text: string; variant?: 'es-ES' | 'es-419' }
export interface PlayResult { ok: boolean; source: 'asset' | 'speech' | 'none'; error?: AudioErrorCode; messageAr?: string }

export interface AudioDeps {
  createAudio: (url: string) => AudioLike;
  speech: SpeechLike | null;
  /** يحوّل مفتاح الأصل إلى رابط. يعيد null إن كان المفتاح معلَّقًا (pending/) */
  resolveUrl: (key: string, variant?: string) => string | null;
  now?: () => number;
  /** مهلة انتظار تحميل الأصل قبل الانتقال للبديل */
  loadTimeoutMs?: number;
}

interface DiagEvent { at: number; type: string; key?: string; source?: string; error?: string }

const MESSAGES: Record<AudioErrorCode, string> = {
  ASSET_MISSING: 'لم يتوفر تسجيل لهذا النص بعد. يمكنك قراءة النص والاستمرار في الدرس.',
  NETWORK: 'تعذّر تحميل الصوت الآن. تحقق من الاتصال وسنحاول البديل.',
  NOT_SUPPORTED: 'جهازك لا يدعم تشغيل هذا الصوت، والنص مكتوب أمامك.',
  NO_VOICE: 'لم نجد صوتًا إسبانيًا على هذا الجهاز. النص مكتوب، ويمكنك المتابعة دون الصوت — أو استخدام جهاز به أصوات إسبانية مثبّتة.',
  PLAY_REJECTED: 'المتصفح منع التشغيل التلقائي. اضغط زر الصوت مرة أخرى.',
  ABORTED: 'أُوقف التشغيل.',
};

export class AudioService {
  private state: AudioState = 'idle';
  private current: AudioLike | null = null;
  private currentKey: string | null = null;
  private rate = 1;
  /**
   * جيل الطلب: كل stop/تشغيل جديد يزيده، فأي وعد قديم يحلّ لاحقًا (شبكة بطيئة،
   * أو صوت رفض التشغيل) لا يستطيع تغيير الحالة أو أخذ مكان الصوت الحالي.
   */
  private gen = 0;
  private diagnostics: DiagEvent[] = [];
  private listeners = new Set<(s: AudioState) => void>();
  private deps: Required<Pick<AudioDeps, 'createAudio' | 'resolveUrl' | 'now' | 'loadTimeoutMs'>> & Pick<AudioDeps, 'speech'>;

  constructor(deps: AudioDeps) {
    this.deps = {
      createAudio: deps.createAudio,
      resolveUrl: deps.resolveUrl,
      speech: deps.speech,
      now: deps.now ?? (() => Date.now()),
      loadTimeoutMs: deps.loadTimeoutMs ?? 4000,
    };
  }

  onStateChange(fn: (s: AudioState) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  getState(): AudioState { return this.state; }
  getRate(): number { return this.rate; }
  getDiagnostics(): readonly DiagEvent[] { return this.diagnostics; }

  private setState(s: AudioState) {
    if (this.state === s) return;
    this.state = s;
    for (const fn of this.listeners) fn(s);
  }
  private diag(type: string, extra: Partial<DiagEvent> = {}) {
    this.diagnostics.push({ at: this.deps.now(), type, ...extra });
    if (this.diagnostics.length > 50) this.diagnostics.shift();
  }

  /** هل يوجد صوت إسباني متاح على الجهاز؟ إذا لم تكن الأصوات قد حُمّلت بعد في المتصفح، نسمح بالمحاولة */
  hasSpanishVoice(): boolean {
    const v = this.deps.speech?.getVoices?.() ?? [];
    if (v.length === 0) return true;
    return v.some(x => /^es/i.test(x.lang));
  }

  setRate(rate: number): void {
    this.rate = Math.min(1.5, Math.max(0.5, rate));
    if (this.current) this.current.playbackRate = this.rate; // بلا إعادة تحميل
  }

  stop(): void {
    this.gen += 1;
    if (this.current) {
      try { this.current.pause(); } catch { /* متصفح يرفض الإيقاف بعد الانتهاء */ }
      this.current = null;
    }
    this.deps.speech?.cancel();
    this.currentKey = null;
    this.setState('idle');
    this.diag('stop');
  }

  dispose(): void {
    this.stop();
    this.listeners.clear();
  }

  /**
   * تشغيل كلمة/جملة.
   * - نفس المفتاح يعمل الآن → إيقاف (toggle) وإرجاع ok.
   * - نفس المفتاح قيد التحميل → لا طلب ثانٍ.
   */
  async play(cue: Cue): Promise<PlayResult> {
    if (this.currentKey === cue.key && (this.state === 'playing' || this.state === 'loading')) {
      this.stop();
      return { ok: true, source: 'none' };
    }
    this.stop();
    const gen = this.gen;

    const url = this.deps.resolveUrl(cue.key, cue.variant);
    if (url) {
      const res = await this.tryAsset(url, cue, gen);
      // طلب جديد/إيقاف حدث أثناء انتظار الأصل: لا بديل ولا نطق للنص القديم
      if (gen !== this.gen) return { ok: true, source: 'none' };
      if (res.ok) return res;
      this.diag('asset_failed_fallback', { key: cue.key, error: res.error });
    } else {
      this.diag('asset_missing', { key: cue.key });
    }
    return this.speak(cue, gen);
  }

  private tryAsset(url: string, cue: Cue, gen: number): Promise<PlayResult> {
    return new Promise<PlayResult>(resolve => {
      const audio = this.deps.createAudio(url);
      audio.preload = 'auto';
      audio.playbackRate = this.rate;
      this.current = audio;
      this.currentKey = cue.key;
      this.setState('loading');

      let settled = false;
      const cleanup = () => {
        clearTimeout(timer);
        audio.removeEventListener('error', onError);
      };
      const done = (r: PlayResult) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (gen !== this.gen) {
          // طلب متجاوَز: لا نلمس الحالة ولا الصوت الحالي (وإلا أوقفنا الصوت الجديد)
          try { audio.pause(); } catch { /* تجاهل */ }
          resolve({ ok: false, source: 'asset', error: 'ABORTED' });
          return;
        }
        if (!r.ok) {
          this.current = null;
          this.currentKey = null;
          this.setState('error');
        } else {
          this.setState('playing');
        }
        resolve(r);
      };
      const onError = () => done({ ok: false, source: 'asset', error: 'ASSET_MISSING' });
      const timer = setTimeout(() => done({ ok: false, source: 'asset', error: 'NETWORK' }), this.deps.loadTimeoutMs);

      audio.addEventListener('error', onError);

      // التشغيل مباشرة: المتصفح يبدأ التحميل ويشغّل عند الجهوزية.
      // لا ننتظر canplay لأن بعض المتصفحات/Alts لا تُطلقه قبل play().
      audio
        .play()
        .then(() => {
          this.diag('asset_play', { key: cue.key });
          audio.addEventListener('ended', () => {
            if (gen === this.gen && this.currentKey === cue.key) this.stop();
          });
          done({ ok: true, source: 'asset' });
        })
        .catch((e: unknown) => {
          const name = (e as { name?: string })?.name;
          const error: AudioErrorCode =
            name === 'NotAllowedError' ? 'PLAY_REJECTED'
            : name === 'AbortError' ? 'ABORTED'
            : name === 'NotSupportedError' ? 'ASSET_MISSING'
            : 'NETWORK';
          done({ ok: false, source: 'asset', error });
        });
    });
  }

  private speak(cue: Cue, gen: number): PlayResult {
    if (gen !== this.gen) return { ok: true, source: 'none' };
    const speech = this.deps.speech;
    if (!speech) {
      this.diag('speech_unavailable', { key: cue.key });
      return { ok: false, source: 'none', error: 'NOT_SUPPORTED', messageAr: MESSAGES.NOT_SUPPORTED };
    }
    if (!this.hasSpanishVoice()) {
      this.diag('no_spanish_voice', { key: cue.key });
      return { ok: false, source: 'none', error: 'NO_VOICE', messageAr: MESSAGES.NO_VOICE };
    }
    const u: SpeechSynthesisUtteranceLike = { text: cue.text, lang: cue.variant ?? 'es-ES', rate: this.rate };
    u.onend = () => { if (gen === this.gen && this.currentKey === cue.key) this.stop(); };
    u.onerror = () => {
      if (gen !== this.gen) return;
      this.diag('speech_error', { key: cue.key });
      this.stop();
    };
    this.currentKey = cue.key;
    this.setState('playing');
    speech.speak(u);
    this.diag('speech_play', { key: cue.key });
    return { ok: true, source: 'speech' };
  }

  /** تحميل مسبق محدود: يجهّز المقاطع القادمة دون تشغيلها، بلا انتظار */
  preload(keys: string[], variant?: string): void {
    for (const key of keys.slice(0, 3)) { // حد أقصى 3 — لا تحميل مكتبة كاملة
      const url = this.deps.resolveUrl(key, variant);
      if (!url) continue;
      try {
        const a = this.deps.createAudio(url);
        a.preload = 'auto';
        a.load?.();
        this.diag('preload', { key });
      } catch {
        this.diag('preload_failed', { key });
      }
    }
  }

  static messageFor(code: AudioErrorCode): string { return MESSAGES[code]; }
}
