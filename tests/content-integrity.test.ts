/**
 * اختبار فحص تكامل المنهج — يمنع عودة الأخطاء البنيوية (دروس بلا تمارين،
 * answerKey غير متوافق مع options، إشارات requires ضالّة أو دورية، حزم مفردات
 * فارغة، دروس غير مرجعة في الخريطة، نصوص تعليمية غير مترجمة).
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const TOOL = join(process.cwd(), 'tools', 'check-content-integrity.mjs');
const REPORT = join(process.cwd(), 'reports', 'content-integrity.json');

describe('فحص تكامل المنهج (content integrity)', () => {
  it('tools/check-content-integrity.mjs يمر بلا أخطاء (كود خروج 0)', () => {
    const stdout = execFileSync('node', [TOOL], { encoding: 'utf8' });
    const m = stdout.match(/أخطاء:\s*(\d+)\s*·\s*تحذيرات:\s*(\d+)/);
    expect(m).not.toBeNull();
    expect(Number(m?.[1])).toBe(0);
  });

  it('التقرير المنتَج يخلو من الأخطاء ويقدّم إحصاءات غير صفرية', () => {
    const doc: { errors: string[]; warnings: string[]; stats: Record<string, number> } =
      JSON.parse(readFileSync(REPORT, 'utf8'));
    expect(doc.errors).toEqual([]);
    expect(doc.stats.lessons).toBeGreaterThan(150);
    expect(doc.stats.exercises).toBeGreaterThan(1000);
    expect(doc.stats.bundles).toBeGreaterThan(40);
    expect(doc.stats.bundleEntries).toBeGreaterThan(5000);
  });

  it('لا توجد حلقات في تقدم requires (دورة تعني تعذر الفتح أبدًا)', () => {
    const doc: { errors: string[] } = JSON.parse(readFileSync(REPORT, 'utf8'));
    const cycles = doc.errors.filter(e => e.includes('دورة تقدم'));
    expect(cycles).toEqual([]);
  });
});
