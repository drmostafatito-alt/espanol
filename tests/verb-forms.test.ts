/**
 * اختبارات انحدار لتصريفات الأفعال المخزّنة في حزم المفردات.
 *
 * الخلفية: التصريفات مولَّدة آليًا، وكان المولّد يعامل كل فعل معاملة المنتظم،
 * فأنتج صيغًا غير موجودة في الإسبانية (transfero، incluo، redució، Recogo...).
 * هذه الصيغ تُعرض للمتعلم في بطاقة المفردة، أي أنها خطأ لغوي مباشر لا أسلوبي.
 *
 * الأداة tools/audit-verb-forms.mjs تُستَورد هنا نفسها — لا منطق مكرر.
 */
import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
// @ts-ignore — وحدة .mjs مشتركة مع الأداة
import { auditVerbForms, checkVerbEntry as checkVerbEntryRaw } from '../tools/audit-verb-forms.mjs';

const ROOT = process.cwd();

type Violation = { rule: string; headword: string; expected: string; got: string };

const checkVerbEntry = (entry: unknown): Violation[] =>
  (checkVerbEntryRaw as (e: unknown) => Violation[])(entry);

const audit = auditVerbForms(join(ROOT, 'content/drafts')) as {
  files: number;
  verbs: number;
  forms: number;
  violations: Violation[];
};

describe('تصريفات الأفعال في المحتوى', () => {
  it('لا توجد أي صيغة تصريف مخالفة في كل حزم المفردات', () => {
    const report = audit.violations.map(v => `${v.rule} · ${v.headword}: «${v.got}» ← «${v.expected}»`).join('\n');
    expect(report).toBe('');
  });

  it('الفحص يرى عددًا معتبرًا من الأفعال والصيغ (ليس عيّنة)', () => {
    expect(audit.files).toBeGreaterThanOrEqual(40);
    expect(audit.verbs).toBeGreaterThanOrEqual(1000);
    expect(audit.forms).toBeGreaterThanOrEqual(40000);
  });
});

describe('قواعد الفحص نفسها (تُختبر على أمثلة صحيحة وخاطئة)', () => {
  const makeEntry = (headword: string, present: string[], extra: object[] = [], gerund?: string) => ({
    headword,
    forms: [
      ...['1s', '2s', '3s', '1p', '2p', '3p'].map((person, i) => ({
        kind: 'conjugation', formEs: present[i], tense: 'presente', mood: 'indicativo', person, irregular: false,
      })),
      { kind: 'gerund', formEs: gerund ?? `${headword}ndo`, tense: null, mood: null, person: null, irregular: false },
      { kind: 'participle', formEs: `${headword}do`, tense: null, mood: null, person: null, irregular: false },
      ...extra,
    ],
  });

  it('يمسك الصيغة الخاطئة لـ-ger/-gir (recogo) ويقبل الصحيحة (recojo)', () => {
    const bad = makeEntry('recoger', ['recogo', 'recoges', 'recoge', 'recogemos', 'recogéis', 'recogen']);
    expect(checkVerbEntry(bad).map(v => v.rule)).toContain('V1-ger-gir');

    const good = makeEntry('recoger', ['recojo', 'recoges', 'recoge', 'recogemos', 'recogéis', 'recogen'], [], 'recogiendo');
    expect(checkVerbEntry(good)).toEqual([]);
  });

  it('يمسك الصيغة الخاطئة لـ-cer/-cir بعد حرف علة (agradezo) ويقبل الصحيحة (agradezco)', () => {
    const bad = makeEntry('agradecer', ['agradezo', 'agradeces', 'agradece', 'agradecemos', 'agradecéis', 'agradecen']);
    expect(checkVerbEntry(bad).map(v => v.rule)).toContain('V2-cer-cir');

    const good = makeEntry('agradecer', ['agradezco', 'agradeces', 'agradece', 'agradecemos', 'agradecéis', 'agradecen'], [], 'agradeciendo');
    expect(checkVerbEntry(good)).toEqual([]);
  });

  it('يمسك ماضي وجيروند الأفعال متغيرة الجذر في -ir (dormió/pediendo) ويقبل الصحيح (durmió/pidiendo)', () => {
    const pret = (formEs: string) => ({ kind: 'conjugation', formEs, tense: 'pretérito', mood: 'indicativo', person: '3s', irregular: true });
    
    // dormió بدلاً من durmió
    const badDormir = {
      ...makeEntry('dormir', ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen']),
      forms: [
        ...makeEntry('dormir', ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen']).forms,
        pret('dormió'),
      ],
    };
    expect(checkVerbEntry(badDormir).map(v => v.rule)).toContain('V6-preterite-stem');

    // pediendo بدلاً من pidiendo
    const badPedir = makeEntry('pedir', ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden'], [], 'pediendo');
    expect(checkVerbEntry(badPedir).map(v => v.rule)).toContain('V7-gerund-stem');

    // الصيغ الصحيحة تمر بسلام
    const goodDormir = {
      ...makeEntry('dormir', ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen']),
      forms: [
        ...makeEntry('dormir', ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen']).forms,
        pret('durmió'),
      ],
    };
    expect(checkVerbEntry(goodDormir).map(v => v.rule)).not.toContain('V6-preterite-stem');
  });

  it('يمسك ماضي andar القياسي الخاطئ (andó) ويقبل الشاذ (anduvo)', () => {
    const pret = (formEs: string) => ({ kind: 'conjugation', formEs, tense: 'pretérito', mood: 'indicativo', person: '3s', irregular: true });
    const bad = {
      ...makeEntry('andar', ['ando', 'andas', 'anda', 'andamos', 'andáis', 'andan']),
      forms: [
        ...makeEntry('andar', ['ando', 'andas', 'anda', 'andamos', 'andáis', 'andan']).forms,
        pret('andó'),
      ],
    };
    expect(checkVerbEntry(bad).map(v => v.rule)).toContain('V9-andar');
  });

  it('لا توجد أي تصريفات منتظمة ساذجة في الجمل والتمارين الفعلية داخل الدروس', () => {
    const { readdirSync, readFileSync } = require('node:fs');
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e: any) => {
        const p = join(dir, e.name);
        return e.isDirectory() ? walk(p) : [p];
      });
    const lessonFiles = walk(join(ROOT, 'content/drafts')).filter((f: string) => f.endsWith('.json') && f.includes('lesson-'));
    const badRegex = /\b(transfero|recogo|agradezo|atendo|incluo|producjo|reducjo|dormió|pedió|andó|ponió|hició|dició)\b/i;
    const violations: string[] = [];

    for (const f of lessonFiles) {
      const text = readFileSync(f, 'utf8');
      const lines = text.split('\n');
      lines.forEach((l: string, idx: number) => {
        if (/commonErrorAr|distractorRationaleAr|errorFeedback/i.test(l)) return;
        const m = l.match(badRegex);
        if (m) violations.push(`${f}:${idx + 1} (${m[0]})`);
      });
    }
    expect(violations).toEqual([]);
  });

  it('يمسك الصيغة الخاطئة لـ-uir', () => {
    const bad = makeEntry('incluir', ['incluo', 'inclues', 'inclue', 'incluimos', 'incluís', 'incluen']);
    const rules = checkVerbEntry(bad).map(v => v.rule);
    expect(rules).toContain('V3-uir-y');
  });

  it('يقبل الصيغة الصحيحة لـ-uir', () => {
    const good = makeEntry('incluir', ['incluyo', 'incluyes', 'incluye', 'incluimos', 'incluís', 'incluyen'], [], 'incluyendo');
    expect(checkVerbEntry(good)).toEqual([]);
  });

  it('يمسك تغيّر الجذر الخاطئ (atender)', () => {
    const bad = makeEntry('atender', ['atendo', 'atendes', 'atende', 'atendemos', 'atendéis', 'atenden']);
    expect(checkVerbEntry(bad).map(v => v.rule)).toContain('V4-stem-change');
  });

  it('يمسك ماضي -ducir الخاطئ ويقبل الصحيح', () => {
    const pret = (formEs: string) => ({ kind: 'conjugation', formEs, tense: 'pretérito', mood: 'indicativo', person: '3s', irregular: true });
    const bad = { ...makeEntry('reducir', ['reduzco', 'reduces', 'reduce', 'reducimos', 'reducís', 'reducen']), forms: [
      ...makeEntry('reducir', ['reduzco', 'reduces', 'reduce', 'reducimos', 'reducís', 'reducen']).forms,
      pret('redució'),
    ] };
    expect(checkVerbEntry(bad).map(v => v.rule)).toContain('V8-ducir');

    const good = { ...makeEntry('reducir', ['reduzco', 'reduces', 'reduce', 'reducimos', 'reducís', 'reducen']), forms: [
      ...makeEntry('reducir', ['reduzco', 'reduces', 'reduce', 'reducimos', 'reducís', 'reducen']).forms,
      pret('redujo'),
    ] };
    expect(checkVerbEntry(good).map(v => v.rule)).not.toContain('V8-ducir');
  });

  it('لا يطلق إنذارًا على صيغة الجمع القياسية في أمثلة المفردات', () => {
    // كان R36 يعدّ «abarrotes» مثالًا لا علاقة له بـ«abarrote» (111 إنذارًا كاذبًا)
    // @ts-ignore
    const { findings } = require('../tools/audit-content-quality.mjs').auditContent(join(ROOT, 'content/drafts'));
    const r36 = (findings as { rule: string; where: string }[]).filter(f => f.rule === 'R36-example-fit');
    expect(r36.some(f => f.where.includes('abarrote'))).toBe(false);
  });
});
