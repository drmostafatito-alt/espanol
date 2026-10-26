/**
 * اختبار حماية نسخ الواجهة ضد رسائل «تجريبي / غير جاهز / غير مُراجَع».
 *
 * الغاية: واجهة المتعلم يجب أن تبدو كمنصة تعليم لغات حقيقية، لا كنموذج تجريبي.
 * هذه الاختبارات تمنع ظهور العبارات التطويرية مرة أخرى، سواء كانت نصًا ثابتًا
 * في JSX أو نصًا يأتي من الخادم (بيانات provenance).
 *
 * القيود التي نحافظ عليها:
 *   - لا نحذف رسائل الأمان الضرورية أو أخطاء النماذج أو التنبيهات الوظيفية.
 *   - تبقى حالات المراجعة في بيانات الإدارة/الخادم، لا في تجربة المتعلم.
 *   - قائمة الاستثناءات مقصودة ومحددة، لا عامة.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const WEB = join(ROOT, 'src/web');

/** عبارات تدل على أن الموقع «نموذج تجريبي / غير جاهز / غير مراجع» — يُحظر عرضها للمتعلم. */
const BANNED = [
  'تجريبي',
  'غير جاهز',
  'قيد التطوير',
  'قيد البناء',
  'غير مراجع',
  'غير مُراجَع',
  'غير مكتمل',
  'coming soon',
  'not ready',
  'not production ready',
  'unreviewed',
  'placeholder content',
  'incomplete',
  'عينة تعليمية',
  'عينة غير مراجعة',
  'لم تُراجَع',
];

/**
 * استثناءات وظيفية دقيقة. تُضاف فقط عندما تكون الرسالة ضرورية فعلًا للمتعلم
 * وليست إيحاءً بأن الموقع غير جاهز. القائمة فارغة حاليًا — كل عبارة محصورة
 * في BANNED يجب ألا تظهر.
 */
const EXCEPTIONS: { phrase: string; file: string; reason: string }[] = [];

/** استخراج كل ملفات الواجهة (TS/TSX/CSS/JSON). */
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|css|json)$/.test(entry)) out.push(p);
  }
  return out;
}

describe('حماية نسخ الواجهة ضد رسائل «تجريبي/غير مراجع»', () => {
  it('لا تحتوي واجهة المتعلم على العبارات المحظورة', () => {
    const violations: string[] = [];
    for (const file of walk(WEB)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const phrase of BANNED) {
        const key = phrase.toLowerCase();
        if (!text.includes(key)) continue;
        const ex = EXCEPTIONS.find(
          e => e.phrase.toLowerCase() === key && relative(ROOT, file) === e.file,
        );
        if (!ex) violations.push(`${relative(ROOT, file)} ∋ «${phrase}»`);
      }
    }
    expect(violations).toEqual([]);
  });

  it('لا تعرض واجهة المتعلم بيانات provenance أو حالة المراجعة', () => {
    const violations: string[] = [];
    for (const file of walk(WEB).filter(f => f.endsWith('.tsx'))) {
      const text = readFileSync(file, 'utf8');
      for (const key of ['warningAr', 'provenance', 'contentProvenance']) {
        if (text.includes(key)) violations.push(`${relative(ROOT, file)} ∋ ${key}`);
      }
    }
    expect(violations).toEqual([]);
  });

  it('يفحص عينات متنوعة من الملفات (لا يفوّت الدليل)', () => {
    const files = walk(WEB);
    expect(files.length).toBeGreaterThan(10);
    expect(files.some(f => f.endsWith('.tsx'))).toBe(true);
    expect(files.some(f => f.endsWith('.css'))).toBe(true);
    expect(files.some(f => f.endsWith('.ts'))).toBe(true);
  });

  it('قائمة الاستثناءات لا تُستخدم كذريعة عامة', () => {
    // كل استثناء يجب أن يذكر سببًا وظيفيًا واضحًا، لا «نحتاجه مؤقتًا».
    for (const ex of EXCEPTIONS) {
      expect(ex.reason.length).toBeGreaterThan(10);
      expect(ex.file).toMatch(/\.(tsx|ts)$/);
    }
  });
});
