/**
 * روابط المفردات عبر الصيغ (vocabulary_forms): اختبارات آلية للآلية، لا للأرقام.
 * - صيغة فعل/جمع غير ملتبسة في new/review تُربط بمدخلها (duele→doler، comido→comer، idiomas→idioma).
 * - صيغة يستخدمها الدرس بمعنى آخر لا تُربط بفعلها أبدًا (acuerdo ≠ acordar).
 * - جدول vocabulary_forms يُعبَّأ من forms[]/plural في الحزم نفسها.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
// @ts-ignore — وحدة .mjs مشتركة مع الأدوات
import { buildContentPlan, stableId } from '../tools/lib/content-plan.mjs';

const ROOT = process.cwd();

function plan() {
  return buildContentPlan(join(ROOT, 'content/drafts'), { existingVersions: {} }) as {
    statements: string[];
    counters: Record<string, number>;
    errors: string[];
  };
}

function linkExists(statements: string[], lessonSlug: string, entryNormalized: string): boolean {
  const lessonId = stableId('lesson', lessonSlug);
  const entryId = stableId('voc', entryNormalized);
  return statements.some(s => s.startsWith('INSERT INTO lesson_vocabulary') && s.includes(lessonId) && s.includes(entryId));
}

describe('روابط المفردات عبر الصيغ', () => {
  const p = plan();

  it('الخطة بلا أخطاء وتحتوي روابط أكثر من الأساس الحرفي وحده', () => {
    expect(p.errors).toEqual([]);
    const links = p.statements.filter(s => s.startsWith('INSERT INTO lesson_vocabulary'));
    expect(links.length).toBeGreaterThan(1292); // الأساس قبل الاحتياطي
    expect(p.counters.forms).toBeGreaterThan(50000);
  });

  it('صيغ غير ملتبسة تُربط: duele→doler، comido→comer، idiomas→idioma', () => {
    expect(linkExists(p.statements, 'a1-doler', 'doler')).toBe(true);
    expect(linkExists(p.statements, 'a2-perfecto-formacion', 'comer')).toBe(true);
    expect(linkExists(p.statements, 'a1-presentacion-profesional', 'idioma')).toBe(true);
  });

  it('المتجانسات المحجوبة لا تُربط بالفعل: acuerdo في درس الاتفاق ليس acordar', () => {
    expect(linkExists(p.statements, 'b1-acuerdo-desacuerdo', 'acordar')).toBe(false);
  });

  it('vocabulary_forms يحتوي صف الصيغة نفسه من بيانات الحزمة', () => {
    const dolerId = stableId('voc', 'doler');
    const row = p.statements.find(s => s.startsWith('INSERT INTO vocabulary_forms') && s.includes(dolerId) && s.includes("'duele'"));
    expect(row).toBeTruthy();
    expect(row).toContain("'conjugation'");
  });

  it('إصلاحات التطبيع الثلاثة تربط الآن (de dónde / cómo está usted / talón)', () => {
    expect(linkExists(p.statements, 'a1-origen-de-donde-eres', 'de dónde')).toBe(true);
    expect(linkExists(p.statements, 'a1-saludos-formalidad', 'cómo está usted')).toBe(true);
    expect(linkExists(p.statements, 'c1-metaforas-vida-cultura', 'talón')).toBe(true);
    // الملفات نفسها لم تعد تحمل الصيغ القديمة في قوائم المفردات
    const saludos = readFileSync(join(ROOT, 'content/drafts/a1/lesson-a1-saludos-formalidad.json'), 'utf8');
    expect(saludos).not.toContain('"¿cómo está usted?",');
  });
});
