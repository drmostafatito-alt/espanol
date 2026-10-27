/**
 * ضوابط تعدين أمثلة المفردات (إصلاح متابعة AUD-08):
 * بوابة مستوى قاطعة عند توفر البديل، كشف فخاخ المعنى (حالة pesar مرجعية)،
 * وسقف إعادة استخدام تراكمي عبر التشغيلات. منطق نقي مستورَد من الأداة نفسها.
 */
import { describe, it, expect } from 'vitest';
// @ts-expect-error مكتبة أدوات Node بلا أنواع — نفس منطق الأداة
import { acceptedForms, isTrappedUse, chooseCandidate, LEVELS } from '../tools/lib/example-miner.mjs';

type Cand = { es: string; ar: string; arEg?: string | null; level: number; uses: number };
const c = (es: string, level: number, uses = 0): Cand => ({ es, ar: 'ترجمة الجملة المعروضة', level, uses });

describe('فخاخ المعنى — pesar مرجعية', () => {
  const entry = { normalized: 'pesar', headword: 'pesar', level: 'B1' };
  const forms = acceptedForms(entry);

  it('يرفض «a pesar de» لكلمة pesar (يزن) رفضًا قاطعًا', () => {
    expect(isTrappedUse('A pesar de la lluvia, salimos a correr.', entry, forms)).toBe(true);
    const chosen = chooseCandidate([c('A pesar de la lluvia, salimos a correr.', LEVELS.B1)], {
      forms, entry, entryLevel: LEVELS.B1,
    });
    expect(chosen).toBeNull();
  });

  it('يقبل استخدامًا حرًا للفعل نفسه', () => {
    expect(isTrappedUse('¿Cuánto pesa la maleta?', entry, new Set([...forms, 'pesa']))).toBe(false);
  });

  it('ظهور حر بجانب الفخ ينقذ الجملة، وغيابه لا ينقذها', () => {
    const f2 = new Set([...forms, 'pesamos']);
    expect(isTrappedUse('A pesar de todo, pesamos las maletas en casa.', entry, f2)).toBe(false);
    expect(isTrappedUse('A pesar de todo, salimos temprano.', entry, forms)).toBe(true);
  });

  it('مدخل يكون هو التعبير نفسه لا يُفخَّخ', () => {
    const idiomEntry = { normalized: 'a pesar de', headword: 'a pesar de', level: 'B1' };
    expect(isTrappedUse('A pesar de la lluvia, salimos.', idiomEntry, acceptedForms(idiomEntry))).toBe(false);
  });
});

describe('بوابة المستوى', () => {
  const entry = { normalized: 'mesa', headword: 'mesa', level: 'A1' };
  const forms = acceptedForms(entry);

  it('لا يختار مثالًا أعلى بمستويين+ متى وجد بديل داخل النطاق — حتى لو «نقاطه» أفضل', () => {
    const high = c('La mesa redonda del parlamento debatió la moción constitucional durante horas.', LEVELS.C1, 0);
    const inBand = c('Pon el libro sobre la mesa ahora mismo, por favor.', LEVELS.A2, 2);
    const chosen = chooseCandidate([high, inBand], { forms, entry, entryLevel: LEVELS.A1 });
    expect(chosen?.es).toBe(inBand.es);
  });

  it('يرضى بالأعلى فقط عند انعدام البدائل داخل النطاق (قرار موثّق لا تسرب)', () => {
    const high = c('La mesa redonda del parlamento debatió la moción constitucional durante horas.', LEVELS.C1);
    const chosen = chooseCandidate([high], { forms, entry, entryLevel: LEVELS.A1 });
    expect(chosen?.es).toBe(high.es);
  });
});

describe('سقف إعادة الاستخدام التراكمي', () => {
  const entry = { normalized: 'casa', headword: 'casa', level: 'A1' };
  const forms = acceptedForms(entry);

  it('جملة بلغت السقف في تشغيلات سابقة (uses=3) لا تُمنح استخدامًا رابعًا', () => {
    const capped = c('Mi casa es muy grande y bonita siempre.', LEVELS.A1, 3);
    expect(chooseCandidate([capped], { forms, entry, entryLevel: LEVELS.A1 })).toBeNull();
  });

  it('جملة عند حد السقف ناقص واحد تظل متاحة مرة أخيرة', () => {
    const almost = c('Mi casa es muy grande y bonita siempre.', LEVELS.A1, 2);
    expect(chooseCandidate([almost], { forms, entry, entryLevel: LEVELS.A1 })?.es).toBe(almost.es);
  });
});
