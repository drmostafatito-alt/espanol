// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAvailableVoicesInfo } from '../src/web/audio/instance';

/** jsdom لا يوفّر speechSynthesis أصلًا — نحاكي سلوك المتصفح */
function mockSynth(voices: SpeechSynthesisVoice[]) {
  const listeners: Record<string, (() => void)[]> = {};
  const synth = {
    getVoices: vi.fn(() => voices),
    speak: vi.fn(),
    cancel: vi.fn(),
    resume: vi.fn(),
    paused: false,
    speaking: false,
    addEventListener: (ev: string, fn: () => void) => {
      (listeners[ev] ||= []).push(fn);
    },
    emitVoicesChanged: () => listeners['voiceschanged']?.forEach(fn => fn()),
  };
  // @ts-expect-error حقن وهمي للاختبار
  window.speechSynthesis = synth;
  // @ts-expect-error حقن المنشئ
  window.SpeechSynthesisUtterance = class {
    text: string;
    constructor(text: string) {
      this.text = text;
    }
  };
  return synth;
}

describe('ربط الصوت بالمتصفح', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error تنظيف
    delete window.speechSynthesis;
    // @ts-expect-error تنظيف
    delete window.SpeechSynthesisUtterance;
  });

  it('يبلّغ بصدق أن النطق غير مدعوم عندما لا توجد الخدمة', () => {
    const info = getAvailableVoicesInfo();
    expect(info.synthesisSupported).toBe(false);
    expect(info.spanishVoices).toEqual([]);
  });

  it('يفرز الأصوات الإسبانية المتاحة ويعدّها', () => {
    mockSynth([
      { lang: 'en-US', name: 'English' } as SpeechSynthesisVoice,
      { lang: 'es-ES', name: 'Google Español' } as SpeechSynthesisVoice,
      { lang: 'es-MX', name: 'Paulina' } as SpeechSynthesisVoice,
    ]);
    // إعادة استيراد الوحدة بعد حقن المحاكي لالتقاط البيئة الجديدة
    vi.resetModules();
    return import('../src/web/audio/instance').then(mod => {
      const info = mod.getAvailableVoicesInfo();
      expect(info.synthesisSupported).toBe(true);
      expect(info.spanishVoices).toHaveLength(2);
      expect(info.spanishVoices.some(v => v.lang === 'es-ES')).toBe(true);
    });
  });

  it('waitForVoices لا يعلّق إلى أجل غير مسمى ويعيد صفرًا بلا أصوات', async () => {
    mockSynth([]);
    vi.resetModules();
    const mod = await import('../src/web/audio/instance');
    const n = await mod.waitForVoices(200);
    expect(n).toBe(0);
  });
});
