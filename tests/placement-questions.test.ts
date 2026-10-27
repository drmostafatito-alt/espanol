/**
 * حماية عقد تحديد المستوى (AUD-05):
 * البنك ومفاتيحه على الخادم فقط. كان البنك في حزمة العميل مع `correct: true`
 * ومفتاح خادم ثابت («a»×10) فاجتيازه لا يحتاج قراءة سؤال واحد. هذه الاختبارات
 * تمنع عودة أي شكل من البنك/المفاتيح إلى العميل، وتتحقق من سلامة بنك الخادم.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PLACEMENT_QUESTIONS } from '../src/worker/lib/placement-bank';

const ROOT = process.cwd();
const PLACEMENT_SRC = readFileSync(join(ROOT, 'src/web/pages/Placement.tsx'), 'utf8');

describe('بنك تحديد المستوى الخادمي (سلامة البيانات)', () => {
  it('يحتوي على 24 سؤالًا بمعرّفات فريدة وطبقات تكفي للتعيين', () => {
    expect(PLACEMENT_QUESTIONS).toHaveLength(24);
    expect(new Set(PLACEMENT_QUESTIONS.map(q => q.id)).size).toBe(24);
    const byLevel = { PREA1: 0, A1: 0, A2: 0 } as Record<string, number>;
    for (const q of PLACEMENT_QUESTIONS) byLevel[q.level]!++;
    // كل طبقة أكبر من حصتها في المحاولة (3/4/3) وإلا صارت العيّنة ثابتة قابلة للحصاد
    expect(byLevel).toEqual({ PREA1: 6, A1: 10, A2: 8 });
  });

  it('لكل سؤال صحيح واحد ضمن خياراته ونصوص خيارات غير متكررة', () => {
    for (const q of PLACEMENT_QUESTIONS) {
      expect(q.options.some(o => o.key === q.correctKey), `سؤال ${q.id}`).toBe(true);
      expect(q.options.length).toBe(4);
      expect(new Set(q.options.map(o => o.text)).size).toBe(q.options.length);
      expect(q.explanationAr.trim().length).toBeGreaterThan(10);
    }
  });

  it('DEFECT-1: مواضع الإجابة الصحيحة في البنك ليست نمطًا موحدًا قابلًا للاستغلال', () => {
    const keys = PLACEMENT_QUESTIONS.map(q => q.correctKey);
    const distinct = new Set(keys);
    expect(distinct.size).toBeGreaterThanOrEqual(3);
    for (const k of distinct) {
      const share = keys.filter(x => x === k).length / keys.length;
      expect(share).toBeLessThanOrEqual(0.4);
    }
  });

  it('VER-02: لا شرح يذكر نص الخيار الصحيح (التغذية ليست مفتاحًا متنكرًا)', () => {
    for (const q of PLACEMENT_QUESTIONS) {
      const correctText = q.options.find(o => o.key === q.correctKey)!.text;
      expect(
        q.explanationAr.toLowerCase().includes(correctText.toLowerCase()),
        `سؤال ${q.id} يسرّب «${correctText}» في شرحه`,
      ).toBe(false);
    }
  });
});

describe('العميل لا يحمل البنك أبدًا', () => {
  it('Placement.tsx بلا مفاتيح صحة ولا نصوص أسئلة', () => {
    expect(PLACEMENT_SRC).not.toContain('correctKey');
    // ملحوظة: نوع نتيجة «المراجعة» بعد التسليم فيه correct: boolean — مشروع،
    // لأنه يصل من الخادم بعد الإجابة. المحظور هو علم صحة على خيار قبل التسليم:
    expect(PLACEMENT_SRC).not.toContain('correct: true');
    expect(PLACEMENT_SRC).not.toContain('correct: false');
    expect(PLACEMENT_SRC).not.toContain('PLACEMENT_QUESTIONS');
    expect(PLACEMENT_SRC).not.toContain('Buenos días');
    expect(PLACEMENT_SRC).not.toContain('placement-bank');
    // الواجهة تطلب أسئلة الخادم عبر مسار البدء
    expect(PLACEMENT_SRC).toContain('placementStart');
  });
});
