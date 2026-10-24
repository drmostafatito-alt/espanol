/* ============================================================================
   SpeechRecognition — أداة التعرف على الكلام عبر إمكانيات المتصفح الأصلية
   ----------------------------------------------------------------------------
   قواعد صارمة:
   1) مجاني 100%: نستخدم واجهة المتصفح الأصلية فقط (SpeechRecognition / webkitSpeechRecognition).
   2) لا نرسل تسجيلات صوتية إلى أي API خارجي أو خادم مدفوع.
   3) لا ندّعي دقة صوتية أو تقييمًا معمليًا؛ التمارين هي مشاركة تدريبية.
   4) إذا لم يتوفر الميكروفون أو رُفض الإذن، يبقى البديل النصي متاحًا فورًا.
   ========================================================================== */

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export interface SpeechRecognizer {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as {
    SpeechRecognition?: unknown;
    webkitSpeechRecognition?: unknown;
  };
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function createSpeechRecognizer(options: {
  lang?: string;
  onStart?: () => void;
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (errorMessageAr: string, rawError: unknown) => void;
  onEnd?: () => void;
}): SpeechRecognizer | null {
  if (!isSpeechRecognitionSupported()) return null;

  try {
    const w = window as unknown as {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    };
    const RecognitionClass = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!RecognitionClass) return null;

    const recognition = new RecognitionClass();
    recognition.lang = options.lang ?? 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      options.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item && item[0]) {
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }
      }
      const transcript = (final || interim).trim();
      options.onResult?.({ transcript, isFinal: Boolean(final) });
    };

    recognition.onerror = (event: any) => {
      const code = event?.error;
      let msg = 'حدث خطأ أثناء الاستماع. يمكنك كتابة الجملة أو إعادة المحاولة.';
      if (code === 'not-allowed' || code === 'permission-denied') {
        msg = 'رُفض إذن استخدام الميكروفون. يمكنك تفعيل الإذن من إعدادات المتصفح أو إكمال التمرين كتابةً.';
      } else if (code === 'no-speech') {
        msg = 'لم يُرصد أي صوت. تأكد من عمل الميكروفون وقربك منه ثم أعد المحاولة.';
      } else if (code === 'network') {
        msg = 'تعذّر الاتصال بخدمة التعرف الصوتي للمتصفح. يمكنك إكمال التمرين كتابةً.';
      } else if (code === 'audio-capture') {
        msg = 'لم نجد جهاز التقاط صوت (ميكروفون). يمكنك إكمال التمرين كتابةً.';
      }
      options.onError?.(msg, event);
    };

    recognition.onend = () => {
      options.onEnd?.();
    };

    return {
      start: () => {
        try {
          recognition.start();
        } catch (err) {
          console.warn('Speech recognition start prevented:', err);
        }
      },
      stop: () => {
        try {
          recognition.stop();
        } catch { /* ignored */ }
      },
      abort: () => {
        try {
          recognition.abort();
        } catch { /* ignored */ }
      },
    };
  } catch {
    return null;
  }
}
