import { AudioService, type AudioLike, type SpeechLike, type SpeechSynthesisUtteranceLike } from './AudioService';

/** ربط الخدمة ببيئة المتصفح — المُكوّنات لا تعرف تفاصيل الصوت */
const MEDIA_ORIGIN = (import.meta.env.VITE_MEDIA_ORIGIN as string | undefined) ?? '';

// الاحتفاظ بالمراجع النشطة لمنع Chromium Garbage Collection Bug من قتل النطق الصوتي في منتصفه
const activeUtterances = new Set<SpeechSynthesisUtterance>();

function createSpeech(): SpeechLike | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  return {
    speak: (u: SpeechSynthesisUtteranceLike) => {
      try {
        // فك تعليق المحرك في حال كان المتصفح أوقفه مؤقتًا (Chrome/Safari paused state bug)
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utter = new window.SpeechSynthesisUtterance(u.text);
        utter.lang = u.lang || 'es-ES';
        utter.rate = u.rate || 1.0;

        // اختيار أفضل صوت إسباني متوفر على الجهاز إن وُجد
        const voices = window.speechSynthesis.getVoices();
        let matchedVoice: SpeechSynthesisVoice | undefined;
        if (u.lang === 'es-419') {
          matchedVoice = voices.find(v => /^es-(419|mx|ar|co|cl|pe|us)/i.test(v.lang));
        } else if (u.lang === 'es-ES') {
          matchedVoice = voices.find(v => /^es-ES/i.test(v.lang));
        }
        if (!matchedVoice) {
          matchedVoice = voices.find(v => /^es/i.test(v.lang));
        }
        if (matchedVoice) {
          utter.voice = matchedVoice;
        }

        activeUtterances.add(utter);

        const cleanup = () => {
          activeUtterances.delete(utter);
        };

        utter.onend = () => {
          cleanup();
          u.onend?.();
        };

        utter.onerror = (e) => {
          cleanup();
          u.onerror?.(e);
        };

        window.speechSynthesis.speak(utter);
      } catch (err) {
        if (u.onerror) u.onerror(err);
      }
    },
    cancel: () => {
      try {
        activeUtterances.clear();
        window.speechSynthesis.cancel();
      } catch { /* ignored */ }
    },
    getVoices: () => {
      try {
        return window.speechSynthesis.getVoices().map(v => ({ lang: v.lang, name: v.name }));
      } catch {
        return [];
      }
    },
    // انتظار تحميل الأصوات بمهلة 1000ms: الأصوات تصل متأخرة في Chrome،
    // والحكم بـ«لا صوت» قبلها كان يعطي NO_VOICE كاذبًا أو تشغيلًا صامتًا.
    awaitVoices: () => {
      try {
        if (window.speechSynthesis.getVoices().length > 0) return Promise.resolve(true);
        return new Promise<boolean>(resolve => {
          let done = false;
          let timer: ReturnType<typeof setTimeout> | undefined;
          const finish = (v: boolean) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            window.speechSynthesis.removeEventListener('voiceschanged', onChange);
            resolve(v);
          };
          const onChange = () => finish(window.speechSynthesis.getVoices().length > 0);
          timer = setTimeout(() => finish(false), 1000);
          window.speechSynthesis.addEventListener('voiceschanged', onChange);
        });
      } catch {
        return Promise.resolve(false);
      }
    },
  };
}

export const audioService = new AudioService({
  createAudio: url => new Audio(url) as unknown as AudioLike,
  speech: createSpeech(),
  resolveUrl: (key, variant) => {
    // المفاتيح المعلَّقة (pending/) أو مفاتيح TTS التلقائية أو عدم توفر أصل R2
    // لا تُترجم إلى رابط: البديل المحلي speechSynthesis يعمل فورًا بلا طلب شبكة فاشل
    if (!key || key.startsWith('pending/') || key.startsWith('tts-') || !MEDIA_ORIGIN) return null;
    const v = variant ?? 'es-ES';
    return `${MEDIA_ORIGIN}/audio/${v}/${key}.opus`;
  },
  loadTimeoutMs: 1500, // مهلة منضبطة تمنع انتهاء مهلة إذن التفاعل للمتصفح (user gesture activation)
});

// الأصوات قد تُحمَّل بعد أول تفاعل أو حدث غير متزامن في بعض المتصفحات
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    /* hasSpanishVoice يُقرأ لحظيًا من getVoices() */
  });
}

/** استعلام عن الأصوات الإسبانية المتوفرة على نظام التشغيل/المتصفح الحالي */
export function getAvailableVoicesInfo(): { count: number; spanishVoices: { name: string; lang: string }[] } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { count: 0, spanishVoices: [] };
  }
  const voices = window.speechSynthesis.getVoices();
  const spanish = voices.filter(v => /^es/i.test(v.lang)).map(v => ({ name: v.name, lang: v.lang }));
  return { count: voices.length, spanishVoices: spanish };
}
