import { AudioService, type AudioLike, type SpeechLike, type SpeechSynthesisUtteranceLike } from './AudioService';
import assetManifest from './assetManifest.json';

const ASSET_MAP = assetManifest as Record<string, { file?: string } | undefined>;

/** ربط الخدمة ببيئة المتصفح — المُكوّنات لا تعرف تفاصيل الصوت */
const MEDIA_ORIGIN = (import.meta.env.VITE_MEDIA_ORIGIN as string | undefined) ?? '';

// الاحتفاظ بالمراجع النشطة لمنع Chromium Garbage Collection Bug من قتل النطق الصوتي في منتصفه
const activeUtterances = new Set<SpeechSynthesisUtterance>();

interface BrowserSpeech extends SpeechLike {
  /** إشارة داخلية: زيادة تتغير كلما تحدّثت قائمة الأصوات */
  voicesVersion: () => number;
}

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  return window.speechSynthesis;
}

/**
 * نحتفظ بقائمة أصوات محدّثة محليًا لأن getVoices() ترجع مصفوفة فارغة
 * في أول استدعاء بمعظم المتصفحات قبل حدث voiceschanged.
 */
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesVersion = 0;

function refreshVoices(synth: SpeechSynthesis) {
  const list = synth.getVoices();
  if (list.length !== cachedVoices.length || list.some((v, i) => v.name !== cachedVoices[i]?.name)) {
    cachedVoices = list.slice();
    voicesVersion++;
  }
}

function createSpeech(): BrowserSpeech | null {
  const synthOrNull = getSynth();
  if (!synthOrNull) return null;
  const synth: SpeechSynthesis = synthOrNull;
  let pendingStart: number | null = null;

  refreshVoices(synth);
  // تسجيل مرة واحدة: بعض المتصفحات (كروم/أندرويد) يطلق الحدث بشكل غير متزامن
  synth.addEventListener?.('voiceschanged', () => refreshVoices(synth));
  // بعض الإصدارات لا تطلق voiceschanged موثوقًا — استطلاع محدود جدًا عند الإقلاع فقط
  let polls = 0;
  const poll: number = window.setInterval(() => {
    refreshVoices(synth);
    if (cachedVoices.length > 0 || ++polls >= 5) window.clearInterval(poll);
  }, 250);

  /** اختيار أفضل صوت إسباني: es-ES المفضل ثم أي إسباني متاح */
  function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
    const voices = cachedVoices.length ? cachedVoices : synth.getVoices();
    if (lang === 'es-419') {
      return (
        voices.find(v => /^es-(419|mx|ar|co|cl|pe|us)/i.test(v.lang)) ||
        voices.find(v => /^es[-_]/i.test(v.lang))
      );
    }
    return (
      voices.find(v => /^es-ES/i.test(v.lang) && /Spain|Castilian|es-ES/i.test(`${v.name} ${v.lang}`)) ||
      voices.find(v => /^es-ES/i.test(v.lang)) ||
      voices.find(v => /^es[-_]/i.test(v.lang))
    );
  }

  return {
    voicesVersion: () => voicesVersion,
    speak: (u: SpeechSynthesisUtteranceLike) => {
      try {
        // إلغاء أي بداية مؤجّلة سابقة حتى لا ينطق الطلب القديم بعد إيقافه
        if (pendingStart) {
          window.clearTimeout(pendingStart);
          pendingStart = null;
        }
        // إلغاء أي نطق سابق — لكن نؤجّل النطق الجديد قليلًا لأن Chrome
        // قد يبتلع utterance جديد يُستدعى مباشرة بعد cancel() (عُرف موثّق في المتصفح)
        synth.cancel();

        const startSpeaking = () => {
          if (synth.paused) synth.resume();
          const utter = new window.SpeechSynthesisUtterance(u.text);
          utter.lang = u.lang || 'es-ES';
          utter.rate = u.rate || 1.0;
          utter.pitch = 1;
          utter.volume = 1;

          const matched = pickVoice(utter.lang);
          if (matched) {
            try {
              utter.voice = matched;
            } catch {
              // بعض المتصفحات والبيئات ترفض تعيين كائن غير أصلي
            }
            utter.lang = matched.lang;
          }

          activeUtterances.add(utter);
          const cleanup = () => activeUtterances.delete(utter);

          let settled = false;
          utter.onstart = () => {
            settled = true;
          };
          utter.onend = () => {
            settled = true;
            cleanup();
            u.onend?.();
          };
          utter.onerror = e => {
            settled = true;
            cleanup();
            u.onerror?.(e);
          };

          synth.speak(utter);

          // حارس صمت Chrome: إن لم يبدأ النطق خلال 300ms نحاول مرة واحدة بعد resume
          window.setTimeout(() => {
            if (!settled && !synth.speaking && activeUtterances.has(utter)) {
              try {
                synth.resume();
                synth.speak(utter);
              } catch {
                u.onerror?.(new Error('speech-retry-failed'));
              }
            }
          }, 300);
        };

        // تأجيل قصير بعد cancel() يعالج السباق دون أن يلاحظه المستخدم (داخل ضغطة الزر نفسها)
        pendingStart = window.setTimeout(() => {
          pendingStart = null;
          startSpeaking();
        }, 60);
      } catch (err) {
        u.onerror?.(err);
      }
    },
    cancel: () => {
      try {
        if (pendingStart) {
          window.clearTimeout(pendingStart);
          pendingStart = null;
        }
        activeUtterances.clear();
        synth.cancel();
      } catch { /* متصفح يرفض الإلغاء في حالة توقف */ }
    },
    getVoices: () => {
      try {
        refreshVoices(synth);
        return cachedVoices.map(v => ({ lang: v.lang, name: v.name }));
      } catch {
        return [];
      }
    },
  };
}

export const audioService = new AudioService({
  createAudio: url => new Audio(url) as unknown as AudioLike,
  speech: createSpeech(),
  resolveUrl: (key, variant) => {
    if (!key) return null;
    const v = variant ?? 'es-ES';

    // 1) فحص أصول الصوت المحلية المولدة مسبقًا بمحرك Piper
    const local = ASSET_MAP[key];
    if (local && local.file) {
      const base = MEDIA_ORIGIN || '';
      return `${base}/audio/${v}/${local.file}`;
    }

    // 2) المفاتيح المعلَّقة التي لم تولّد بعد أو مفاتيح TTS التلقائية: البديل المحلي speechSynthesis يعمل فورًا بلا طلب شبكة فاشل
    if (key.startsWith('pending/') || key.startsWith('tts-') || !MEDIA_ORIGIN) return null;

    // 3) المسار الافتراضي لأصول R2 البعيدة (عند إعداد أصل وسائط مخصص)
    return `${MEDIA_ORIGIN}/audio/${v}/${key}.opus`;
  },
  loadTimeoutMs: 1500, // مهلة منضبطة تمنع انتهاء مهلة إذن التفاعل للمتصفح (user gesture activation)
});

/**
 * استعلام صادق عن قدرات الصوت على هذا الجهاز.
 * نميّز: لا دعم للنطق أصلًا مقابل لا أصوات إسبانية مثبتة.
 */
export function getAvailableVoicesInfo(): {
  synthesisSupported: boolean;
  count: number;
  spanishVoices: { name: string; lang: string }[];
} {
  const synth = getSynth();
  if (!synth) return { synthesisSupported: false, count: 0, spanishVoices: [] };
  const voices = cachedVoices.length ? cachedVoices : synth.getVoices();
  const spanish = voices.filter(v => /^es[-_]/i.test(v.lang)).map(v => ({ name: v.name, lang: v.lang }));
  return { synthesisSupported: true, count: voices.length, spanishVoices: spanish };
}

/** انتظار محدود لجاهزية قائمة الأصوات (لا تعليق إلى أجل غير مسمى) */
export function waitForVoices(timeoutMs = 600): Promise<number> {
  const initial = getAvailableVoicesInfo();
  if (!initial.synthesisSupported) return Promise.resolve(0);
  if (initial.count > 0) return Promise.resolve(initial.count);
  return new Promise(resolve => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const info = getAvailableVoicesInfo();
      if (info.count > 0 || Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(timer);
        resolve(info.count);
      }
    }, 100);
  });
}
