/**
 * حماية تباين الألوان (WCAG 2.1 AA): كل نص يُعرض على خلفية فاتحة يجب أن يحقق
 * نسبة تباين ≥ 4.5:1، وإلا يكون غير مقروء لمن يعانون من ضعف بصر أو في ضوء
 * الشمس. هذا الاختبار يقرأ وسوم الألوان من CSS ويتحقق من الأزواج الأساسية،
 * ويمنع العودة إلى استخدام الألوان الفاتحة كنص مباشر.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS = readFileSync(join(process.cwd(), 'src/web/styles.css'), 'utf8');

function tokens(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of CSS.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    const k = m[1];
    const v = m[2];
    if (k !== undefined && v !== undefined) out[`--${k}`] = v;
  }
  return out;
}

function channel(v: number): number {
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function lum(hex: string): number {
  const c = hex.replace('#', '');
  const r = channel(parseInt(c.slice(0, 2), 16) / 255);
  const g = channel(parseInt(c.slice(2, 4), 16) / 255);
  const b = channel(parseInt(c.slice(4, 6), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string): number {
  const l1 = lum(a);
  const l2 = lum(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

describe('تباين الألوان (WCAG AA ≥ 4.5:1 للنص)', () => {
  it('الأزواج الأساسية للنص على الخلفيات الفاتحة تحقق 4.5:1', () => {
    const t = tokens();
    const pairs: [string, string][] = [
      ['--color-text', '--color-bg'],
      ['--color-text', '--color-surface'],
      ['--color-muted', '--color-bg'],
      ['--color-muted', '--color-surface'],
      ['--color-muted', '--color-surface-2'],
      ['--color-link', '--color-bg'],
      ['--color-link', '--color-surface'],
      ['--color-primary-text', '--color-primary-soft'],
      ['--color-success-text', '--color-success-soft'],
      ['--color-info-text', '--color-info-soft'],
      ['--color-warning-text', '--color-warning-soft'],
      ['--color-danger', '--color-bg'],
      ['--color-navy', '--color-navy-soft'],
    ];
    const problems: string[] = [];
    for (const [fg, bg] of pairs) {
      if (!t[fg] || !t[bg]) {
        problems.push(`وسم مفقود: ${fg} أو ${bg}`);
        continue;
      }
      const r = ratio(t[fg], t[bg]);
      if (r < 4.5) problems.push(`${fg} على ${bg} = ${r.toFixed(2)}`);
    }
    expect(problems).toEqual([]);
  });

  it('لا يُستخدم اللون الفاتح للزر كنص مباشر (يجب استخدام صيغة النص الأغمق)', () => {
    // نكفي النصوص التي تأتي مباشرة بعد ; أو { أو مسافة، حتى لا نخطئ في
    // حقول مثل border-top-color أو accent-color التي ليست لون نص.
    const re = /(^|[;{ ])color: var\(--color-(primary|success|info|warning)\);/g;
    const hits: string[] = [];
    for (const rule of CSS.split('}')) {
      if (re.test(rule)) hits.push(rule.trim().replace(/\s+/g, ' ').slice(0, 90));
    }
    expect(hits).toEqual([]);
  });
});
