import { AudioService, type AudioLike, type SpeechLike, type SpeechSynthesisUtteranceLike } from './AudioService';

/** ربط الخدمة ببيئة المتصفح — المُكوّنات لا تعرف تفاصيل الصوت */
const MEDIA_ORIGIN = (import.meta.env.VITE_MEDIA_ORIGIN as string | undefined) ?? '';

function createSpeech(): SpeechLike | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  return {
    speak: (u: SpeechSynthesisUtteranceLike) => {
      try {
        window.speechSynthesis.cancel();
        const utter = new window.SpeechSynthesisUtterance(u.text);
        utter.lang = u.lang || 'es-ES';
        utter.rate = u.rate || 1.0;

        // اختيار أفضل صوت إسباني متوفر على الجهاز
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

        if (u.onend) utter.onend = () => u.onend?.();
        if (u.onerror) utter.onerror = (e) => u.onerror?.(e);

        window.speechSynthesis.speak(utter);
      } catch (err) {
        if (u.onerror) u.onerror(err);
      }
    },
    cancel: () => {
      try {
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
  };
}

export const audioService = new AudioService({
  createAudio: url => new Audio(url) as unknown as AudioLike,
  speech: createSpeech(),
  resolveUrl: (key, variant) => {
    // المفاتيح المعلَّقة (pending/) لا تُترجم إلى رابط: لا ندّعي وجود تسجيل
    if (!key || key.startsWith('pending/')) return null;
    const v = variant ?? 'es-ES';
    return `${MEDIA_ORIGIN}/audio/${v}/${key}.opus`;
  },
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
