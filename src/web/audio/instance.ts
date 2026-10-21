import { AudioService, type AudioLike, type SpeechLike } from './AudioService';

/** ربط الخدمة ببيئة المتصفح — المُكوّنات لا تعرف تفاصيل الصوت */
const MEDIA_ORIGIN = (import.meta.env.VITE_MEDIA_ORIGIN as string | undefined) ?? '';

function createSpeech(): SpeechLike | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  return {
    speak: u => window.speechSynthesis.speak(u as unknown as SpeechSynthesisUtterance),
    cancel: () => window.speechSynthesis.cancel(),
    getVoices: () => window.speechSynthesis.getVoices().map(v => ({ lang: v.lang, name: v.name })),
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

// الأصوات قد تُحمَّل بعد أول تفاعل في بعض المتصفحات
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => { /* hasSpanishVoice يُقرأ لحظيًا */ });
}
