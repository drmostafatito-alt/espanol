/**
 * اختبارات انحدار لإصلاح الأمثلة القالبية (30 أكتوبر 2026).
 *
 * كانت 2,103 مفردة (B1 1339 · B2 534 · C1 230) تحمل أمثلة قالبية من نوع
 * «Esta persona es sumamente cilíndrico…» أو «Suelo acomodar todos los días
 * con atención.»: جملة واحدة تُركّب على أي كلمة بلا معنى، وبعضها بخطأ مطابقة
 * جنس (persona مؤنثة + صفة مذكرة). أداة `tools/fix-vocab-example.mjs` تستبدلها
 * بأمثلة حقيقية (إسبانية + فصحى + مصرية) بعد فحص صارم، وهذا الاختبار يثبت أن
 * كل دفعة مطبقة في السجل لم تعد قالبية وأن الجملة تحتوي رأس المدخل فعلًا.
 */
import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
// @ts-ignore — وحدة مشتركة مع الأدوات
import { loadInventory, isTemplateExample } from '../tools/lib/content-review.mjs';
// @ts-ignore
import { buildContentPlan } from '../tools/lib/content-plan.mjs';

const ROOT = join(import.meta.dirname, '..');
const AUDIT = join(ROOT, 'reports/content-review/template-fixes.json');

describe('إصلاح الأمثلة القالبية', () => {
  it('كل دفعة مطبقة: المثال الجديد حقيقي ويحتوي الكلمة الرأس', () => {
    expect(existsSync(AUDIT)).toBe(true);
    const audit = JSON.parse(readFileSync(AUDIT, 'utf8'));
    const { vocab } = loadInventory(ROOT) as { vocab: any[] };
    const byId = new Map(vocab.map((v) => [v.id, v.entry]));
    let checked = 0;
    for (const [name, batch] of Object.entries<any>(audit.batches)) {
      for (const change of batch.changes) {
        const entry = byId.get(change.id);
        expect(entry, `${name}: ${change.id} غير موجود`).toBeTruthy();
        const example = entry.senses?.[0]?.exampleEs ?? '';
        expect(
          isTemplateExample(entry.headword, example),
          `${name}: «${entry.headword}» ما زال قالبًا: ${example}`,
        ).toBe(false);
        expect(example.toLowerCase()).toContain(String(entry.headword).toLowerCase());
        expect(String(entry.senses?.[0]?.exampleArEg ?? '').trim().length).toBeGreaterThan(0);
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThanOrEqual(454);
  });

  it('قوائم الانتظار المتبقية = ما يحسبه الماسح (لا أرقام مكتوبة يدويًا)', () => {
    const { vocab } = loadInventory(ROOT) as { vocab: any[] };
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
      const doc = JSON.parse(
        readFileSync(join(ROOT, `content/review/queues/template-${level.toLowerCase()}.json`), 'utf8'),
      );
      const counted = vocab.filter(({ entry }) => {
        const example = entry.senses?.[0]?.exampleEs ?? '';
        return String(entry.level ?? '').toUpperCase() === level && isTemplateExample(entry.headword, example);
      });
      expect(doc.ids.length, `مستوى ${level}`).toBe(counted.length);
    }
  });

  it('إحالتا «fui» و«visto» تُحلّان من نص الدرس بدل تركهما معلّقتين', () => {
    const plan = buildContentPlan(join(ROOT, 'content/drafts'), {
      existingVersions: {},
      lexiconDirs: [join(ROOT, 'content')],
    }) as { unresolvedVocabRefs: Array<{ lesson: string; word: string }> };
    const unresolved = plan.unresolvedVocabRefs.map((r) => `${r.lesson}|${r.word}`);
    expect(unresolved).not.toContain('a2-indefinido-irregular|fui');
    expect(unresolved).not.toContain('a2-participios-irregulares|visto');
  });
});
