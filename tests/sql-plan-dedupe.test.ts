/**
 * انحدار: تكرار الأوامر وتعارض المفاتيح في خطة تصدير SQL.
 *
 * الخلل المكتشف (30 أكتوبر 2026): الملف المولَّد كان يحمل 153,416 أمرًا منها
 * **16,309** أمر `vocabulary_tags` مكرَّر لنفس 75 وسمًا (الأمر يُصدر لكل
 * «مدخل × وسم» لا لكل وسم)، و`programs` للسَّلّة `main-track` ستّ مرات بوصف
 * مختلف لكل مستوى — وآخر أمر يفوز، فيصير وصف البرنامج رهينة ترتيب الملفات.
 * بعد الإصلاح: 137,012 أمرًا، بلا مفتاح مكرَّر، والتعارضات تُبلَّغ صراحةً.
 */
import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
// @ts-ignore — وحدة .mjs مشتركة مع الأدوات
import { buildContentPlan, dedupePlanStatements, statementRowKey } from '../tools/lib/content-plan.mjs';

const ROOT = join(import.meta.dirname, '..');

const ins = (table: string, cols: string[], vals: string[]) =>
  `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${vals.join(', ')}) ON CONFLICT(id) DO NOTHING`;

describe('dedupePlanStatements', () => {
  it('يسقط التكرار الحرفي ويُبقي أول ظهور', () => {
    const a = ins('vocabulary_tags', ['id', 'slug', 'name_ar'], ["'tag_1'", "'greet'", "'تحيات'"]);
    const r = dedupePlanStatements([a, a, a]);
    expect(r.statements).toEqual([a]);
    expect(r.dropped).toBe(2);
    expect(r.conflicts).toEqual([]);
  });

  it('يُبقي أول ظهور ويُبلّغ عند اختلاف المحتوى', () => {
    const first = ins('programs', ['id', 'slug', 'description_ar'], ["'prog_1'", "'main'", "'وصف عام'"]);
    const later = ins('programs', ['id', 'slug', 'description_ar'], ["'prog_1'", "'main'", "'وصف A2'"]);
    const r = dedupePlanStatements([first, later]);
    expect(r.statements).toEqual([first]);
    expect(r.conflicts).toHaveLength(1);
    expect(r.conflicts[0].table).toBe('programs');
    expect(r.conflicts[0].key).toBe("'prog_1'");
  });

  it('يعالج جداول الربط بالمفتاح المركّب', () => {
    const l1 = ins('vocabulary_tag_links', ['entry_id', 'tag_id'], ["'voc_1'", "'tag_1'"]);
    const l2 = ins('vocabulary_tag_links', ['entry_id', 'tag_id'], ["'voc_1'", "'tag_2'"]);
    const l1dup = ins('vocabulary_tag_links', ['entry_id', 'tag_id'], ["'voc_1'", "'tag_1'"]);
    const r = dedupePlanStatements([l1, l2, l1dup]);
    expect(r.statements).toEqual([l1, l2]);
    expect(r.dropped).toBe(1);
  });

  it('لا يمسّ أوامر غير الإدخال (UPDATE يبقى كما هو)', () => {
    const upd = "UPDATE lessons SET current_version_id = 'lv_1' WHERE id = 'lesson_1';";
    const r = dedupePlanStatements([upd, upd]);
    // لا مفتاح صفّ لـUPDATE ⇒ يُترك بلا تنقية (إعادة تنفيذه آمنة أصلًا)
    expect(r.statements).toEqual([upd, upd]);
    expect(r.dropped).toBe(0);
    expect(statementRowKey(upd)).toBeNull();
  });

  it('يقرأ الصفّ حتى مع فواصل ونصوص JSON داخله', () => {
    const stmt = ins('vocabulary_senses', ['id', 'entry_id', 'gloss_es'],
      ["'sen_1'", "'voc_1'", `'شرح فيه فاصلة, وقوس ) ونص "مقتبس"'`]);
    expect(statementRowKey(stmt)).toEqual({ table: 'vocabulary_senses', key: "vocabulary_senses:'sen_1'", id: "'sen_1'" });
  });
});

describe('خطة المحتوى الحقيقية بعد التنقية', () => {
  const plan = buildContentPlan(join(ROOT, 'content/drafts'), {
    existingVersions: {},
    lexiconDirs: [join(ROOT, 'content')],
  });

  it('لا مفتاح صفّ مكرَّر في الخطة', () => {
    const seen = new Set();
    const dups: string[] = [];
    for (const s of plan.statements) {
      const k = statementRowKey(s);
      if (!k) continue;
      if (seen.has(k.key)) dups.push(k.key);
      seen.add(k.key);
    }
    expect(dups.slice(0, 5)).toEqual([]);
  });

  it('أوامر الوسوم بعدد الوسوم الفريد لا بعدد (مدخل × وسم)', () => {
    const tagStatements = plan.statements.filter((s: string) => /^INSERT INTO vocabulary_tags /.test(s));
    const links = plan.statements.filter((s: string) => /^INSERT INTO vocabulary_tag_links /.test(s));
    expect(tagStatements.length).toBeLessThanOrEqual(200);
    expect(links.length).toBeGreaterThan(tagStatements.length);
    expect(new Set(tagStatements).size).toBe(tagStatements.length);
  });

  it('برنامج main-track يُكتب مرة واحدة بالسطر الأساسي (level_code NULL)', () => {
    const rows = plan.statements.filter((s: string) => /^INSERT INTO programs /.test(s) && s.includes("'main-track'"));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toContain('NULL');
    expect(rows[0]).toContain('المسار الرئيسي المتسلسل');
  });

  it('كل تعارض مُبلَّغ صراحةً بدلًا من حسمه بالترتيب', () => {
    expect(Array.isArray(plan.conflicts)).toBe(true);
    for (const c of plan.conflicts) {
      expect(c.first).not.toBe(c.later);
      expect(c.table).toBeTruthy();
    }
  });
});
