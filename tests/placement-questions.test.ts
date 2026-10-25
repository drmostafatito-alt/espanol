/**
 * حماية توافق اختبار تحديد المستوى: مفتاح الإجابات موجود على الخادم، لكن
 * الأسئلة تُعرَّف في واجهة React. لو اختلف الخيار الصحيح في الواجهة عن مفتاح
 * الخادم (مثل إعادة ترتيب الخيارات)، يُصبح الاختبار «غير قابل للتصحيح» أو
 * يمنح المستوى بناءً على إجابات خاطئة. هذا الاختبار يمنع الانحراف بينهما.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PLACEMENT_SRC = readFileSync(join(ROOT, 'src/web/pages/Placement.tsx'), 'utf8');
const LEARN_SRC = readFileSync(join(ROOT, 'src/worker/routes/learn.ts'), 'utf8');

/** استخراج مفتاح الإجابات الcanonical من الخادم. */
function serverAnswerKeys(): Record<string, string> {
  const block = LEARN_SRC.match(/PLACEMENT_CANONICAL_KEYS:[\s\S]*?\};/);
  if (!block) throw new Error('مفتاح PLACEMENT_CANONICAL_KEYS غير موجود في learn.ts');
  const keys: Record<string, string> = {};
  for (const m of block[0].matchAll(/'(\d+)':\s*'([a-z])'/g)) {
    const k = m[1];
    const v = m[2];
    if (k !== undefined && v !== undefined) keys[k] = v;
  }
  return keys;
}

/** استخراج كتل الأسئلة من واجهة Placement.tsx. */
function questionChunks(): { id: string; body: string }[] {
  const arr = PLACEMENT_SRC.match(/const QUESTIONS[\s\S]*?=\s*\[([\s\S]*?)\n\];/)?.[1] ?? '';
  if (!arr.trim()) throw new Error('لم أعثر على مصفوفة QUESTIONS في Placement.tsx');
  const starts: number[] = [];
  const re = /id:\s*(\d+)\s*,/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(arr))) starts.push(m.index);
  return starts.map((start, i) => ({
    id: arr.slice(start).match(/id:\s*(\d+)/)?.[1] ?? `#${i}`,
    body: arr.slice(start, i + 1 < starts.length ? starts[i + 1] : arr.length),
  }));
}

describe('توافق أسئلة تحديد المستوى بين الواجهة والخادم', () => {
  it('الخادم يحتوي على مفتاح إجابات لـ 10 أسئلة', () => {
    const keys = serverAnswerKeys();
    expect(Object.keys(keys)).toHaveLength(10);
  });

  it('عدد أسئلة الواجهة يساوي عدد مفاتيح الخادم', () => {
    const keys = serverAnswerKeys();
    const questions = questionChunks();
    expect(questions.length).toBe(Object.keys(keys).length);
  });

  it('الخيار الصحيح في الواجهة يطابق مفتاح الخادم لكل سؤال', () => {
    const keys = serverAnswerKeys();
    const problems: string[] = [];
    for (const q of questionChunks()) {
      const optRe = /id:\s*'([a-z])',\s*text:\s*'[^']*'[^}]*?correct:\s*(true|false)/g;
      let correctId: string | null = null;
      let correctCount = 0;
      const texts: string[] = [];
      for (const om of q.body.matchAll(/id:\s*'([a-z])',\s*text:\s*'([^']*)'/g)) {
        const t = om[2];
        if (t !== undefined) texts.push(t);
      }
      for (const om of q.body.matchAll(optRe)) {
        const flag = om[2];
        const cid = om[1];
        if (flag === 'true' && cid !== undefined) {
          correctCount++;
          correctId = cid;
        }
      }
      if (correctCount !== 1) {
        problems.push(`سؤال ${q.id}: عدد الخيارات الصحيحة = ${correctCount} (يجب أن يكون 1)`);
        continue;
      }
      if (new Set(texts).size !== texts.length) {
        problems.push(`سؤال ${q.id}: خيارات متطابقة (ملتبس)`);
      }
      if (keys[q.id] !== correctId) {
        problems.push(`سؤال ${q.id}: الواجهة «${correctId}» ≠ الخادم «${keys[q.id]}»`);
      }
    }
    expect(problems).toEqual([]);
  });
});
