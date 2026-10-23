/**
 * تجهيز المحتوى داخل قاعدة الاختبار.
 * ينفّذ **نفس** أوامر SQL التي يولّدها tools/lib/content-plan.mjs ويستعملها
 * tools/import-content.mjs — فلا نسخة موازية تنحرف عن الأصل.
 */
import { join } from 'node:path';
// @ts-ignore — وحدة .mjs مشتركة مع أدوات الاستيراد
import { buildContentPlan } from '../tools/lib/content-plan.mjs';
import type { Harness } from './harness';

export interface ImportedContent {
  statements: number;
  answers: Record<string, unknown>;
  counters: Record<string, number>;
}

// WeakMap بالمقبض نفسه: قواعد :memory: لا يمكن تمييزها بالاسم
const cache = new WeakMap<object, ImportedContent>();

export function importExemplars(h: Harness): ImportedContent {
  const cached = cache.get(h.db.raw as unknown as object);
  if (cached) return cached;

  const plan = buildContentPlan(join(process.cwd(), 'content/exemplars'), { existingVersions: {} }) as {
    statements: string[];
    answers: Record<string, unknown>;
    counters: Record<string, number>;
    errors: string[];
  };
  if (plan.errors.length) throw new Error('محتوى غير صالح: ' + plan.errors.join(' | '));

  h.db.raw.exec(plan.statements.join(';\n') + ';');

  const result: ImportedContent = { statements: plan.statements.length, answers: plan.answers, counters: plan.counters };
  cache.set(h.db.raw as unknown as object, result);
  return result;
}

/** الإجابة الصحيحة لتمرين بمعرّفه في القاعدة — للاختبار فقط */
export function correctAnswer(h: Harness, exerciseId: string): unknown {
  return importExemplars(h).answers[exerciseId];
}

/** يبني إجابات صحيحة لكل تمرين مصحَّح في جلسة */
export function correctAnswersFor(h: Harness, exercises: { id: string; mode: string }[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const ex of exercises) {
    if (ex.mode !== 'graded') continue;
    out[ex.id] = correctAnswer(h, ex.id) ?? '';
  }
  return out;
}
