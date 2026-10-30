/**
 * اختبارات بوابة ما قبل النشر (tools/check-deploy-ready.mjs).
 *
 * الغاية: إثبات أن البوابة ترفض إعداد التطوير المرفوع، وتقبل إعداد إنتاجيًا سليمًا.
 * لو كانت ترفض كل شيء لكانت بوابة شكلية لا تحمي من نشر إعدادات تطوير بالخطأ.
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const SCRIPT = join(ROOT, 'tools/check-deploy-ready.mjs');
const SAMPLE = 'tests/fixtures/wrangler.production.sample.toml';

function run(args: string[]): { code: number; json: any; out: string } {
  try {
    const out = execFileSync('node', [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8' });
    return { code: 0, json: safeJson(out), out };
  } catch (e: any) {
    const out = String(e.stdout ?? '');
    return { code: e.status ?? -1, json: safeJson(out), out };
  }
}

/** بيئة بلا مستودع Git (نسخة مُصدَّرة) لا تستطيع إثبات الحياد عبر git status، فنتخطى هذا الاختبار وحده بدل ادعاء النجاح */
function hasGitRepo(): boolean {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

const jsonOf = (args: string[]) => run([...args, '--json']).json;
const safeJson = (s: string) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

describe('بوابة الجاهزية للنشر', () => {
  it('ترفض wrangler.toml التطويري المرفوع (لا نشر بالخطأ)', () => {
    const res = run(['--json']);
    expect(res.code).not.toBe(0);
    const j = jsonOf([]);
    const codes = [...j.errors, ...j.blockers].map((x: any) => x.code);
    expect(codes).toContain('NOT_PRODUCTION');
    expect(codes).toContain('APP_ORIGIN_LOCAL');
    expect(codes).toContain('D1_ID_PLACEHOLDER');
    // الافتراضي الملتزَم مغلق التسجيل: لا يجب أن يظهر PUBLIC_SIGNUP_OPEN هنا؛
    // حاجز الإطلاق الباقي هو قوة الاشتقاق نفسها (30k < 600k) — لا يُخفى.
    expect(codes).not.toContain('PUBLIC_SIGNUP_OPEN');
    // 2026-10-30: إعداد التطوير يفعّل الطبقتين (CLIENT_KDF_REQUIRED + 600k)،
    // فلا حاجز KDF عليه أصلًا. الشدّة تتبع التعرّض الفعلي لا اسم الملف.
    expect(codes).not.toContain('KDF_BELOW_OWASP');
    expect(j.blockers).toEqual([]);
    expect(j.status).toBe('FAIL');
  });

  it('تمرّ على إعداد إنتاجي سليم (البوابة ليست رفضًا دائمًا)', () => {
    const j = jsonOf(['--file', SAMPLE]);
    expect(j.errors).toEqual([]);
    expect(j.blockers).toEqual([]);
    expect(j.status).toBe('PASS');
    expect(run(['--file', SAMPLE]).code).toBe(0);
  });

  it('تسجيل عام مفتوح + تجزئة مطابقة لـOWASP = يمرّ (لا رفض دائم للخطة المدفوعة)', () => {
    // 2026-10-30: كان الحاجز هنا يرفض أي تسجيل مفتوح حتى مع 600,000 تكرار — رفض زائد.
    // السياسة الحالية: الشدّة تتبع التعرّض الفعلي (تجزئة قوية + تسجيل عام = مقبول).
    const j = jsonOf(['--file', 'tests/fixtures/wrangler.open-signup.sample.toml']);
    expect(j.status).toBe('PASS');
    expect(j.errors).toEqual([]);
    expect(j.blockers).toEqual([]);
    expect(run(['--file', 'tests/fixtures/wrangler.open-signup.sample.toml']).code).toBe(0);
  });

  it('تسجيل عام مفتوح + تجزئة أضعف من OWASP = خطأ مانع للنشر لا «حاجز» (2 ← 1)', () => {
    // أخطر تركيبة: حسابات عامة بتجزئة ضعيفة. كانت «حاجزًا» يكفي لتجاوزه كود خروج 2،
    // فصارت خطأً يمنع النشر أصلًا.
    const res = run(['--file', 'tests/fixtures/wrangler.open-signup-weak-kdf.sample.toml', '--json']);
    expect(res.code).toBe(1);
    expect(res.json.status).toBe('FAIL');
    expect(res.json.errors.map((e: any) => e.code)).toContain('PUBLIC_SIGNUP_WEAK_KDF');
    // ولا يُشفع لها أي تنازل: القبول المسجَّل نطاقه تسجيل مغلق فقط
    expect(res.json.blockers.map((b: any) => b.code)).toContain('KDF_BELOW_OWASP');
  });

  it('التسجيل المغلق + 30k بلا طبقتين: يبقى حاجزًا معلنًا (لا تنازل مسجَّل الآن)', () => {
    const j = jsonOf(['--file', 'tests/fixtures/wrangler.closed-signup-weak-kdf.sample.toml']);
    expect(j.errors).toEqual([]);
    expect(j.blockers.map((b: any) => b.code)).toContain('KDF_BELOW_OWASP');
    expect(j.status).toBe('BLOCKED');
  });

  it('إعداد الإنتاج الملتزَم يمرّ نظيفًا: تسجيل مجاني + اشتقاق على طبقتين (بلا تنازلات)', () => {
    const j = jsonOf(['--file', 'wrangler.production.toml']);
    expect(j.errors).toEqual([]);
    expect(j.blockers).toEqual([]);
    expect(j.warnings).toEqual([]);
    expect(j.status).toBe('PASS');
    expect(j.waivers).toEqual([]);
  });

  it('تسجيل مفتوح + طبقة عميل 600k + خادم 30k = مقبول (البديل المجاني الآمن)', () => {
    // هذه هي الحالة الإنتاجية الفعلية: 600k في المتصفح + 30k على الخادم.
    const j = jsonOf(['--file', 'tests/fixtures/wrangler.layered-kdf.sample.toml']);
    expect(j.errors).toEqual([]);
    expect(j.blockers).toEqual([]);
    expect(j.status).toBe('PASS');
  });

  it('تسجيل مفتوح + طبقة عميل أقل من 600k = خطأ (لا يُقبل اشتقاق ضعيف بغطاء «طبقتين»)', () => {
    const j = jsonOf(['--file', 'tests/fixtures/wrangler.layered-kdf-weak.sample.toml']);
    expect(j.errors.map((e: any) => e.code)).toContain('PUBLIC_SIGNUP_WEAK_KDF');
    expect(j.status).toBe('FAIL');
  });

  it('تقرأ [env.production.vars] لا [vars] التطويري (عيب حقيقي كان موجودًا)', () => {
    // إعداد wrangler المعتاد: [vars] للتطوير + [env.production.vars] للنشر.
    // النسخة السابقة كانت تقرأ [vars] فقط ⇒ ترفض إعدادًا إنتاجيًا صحيحًا.
    const file = 'tests/fixtures/wrangler.env-sections.sample.toml';
    const j = jsonOf(['--file', file]);
    expect(j.section).toBe('env.production.vars');
    expect(j.status).toBe('PASS');
    expect(j.errors).toEqual([]);
    expect(j.blockers).toEqual([]);

    // ونفس النتيجة مع تحديد القسم صراحةً
    const withEnv = jsonOf(['--file', file, '--env', 'production']);
    expect(withEnv.section).toBe('env.production.vars');
    expect(withEnv.status).toBe('PASS');
  });

  it('قسم صريح غير موجود لا يتراجع بصمت إلى [vars] التطويري', () => {
    const res = run(['--file', 'tests/fixtures/wrangler.env-sections.sample.toml', '--env', 'staging', '--json']);
    expect(res.code).toBe(1);
    expect(res.json.status).toBe('FAIL');
    expect(res.json.errors.map((e: any) => e.code)).toContain('VARS_SECTION_MISSING');
    expect(res.json.section).toBeNull();
  });

  it('تكتشف السرّ المكتوب داخل ملف الإعداد', () => {
    const j = jsonOf(['--file', 'tests/fixtures/wrangler.secret-leak.sample.toml']);
    expect(j.status).toBe('FAIL');
    expect(j.errors.map((e: any) => e.code)).toContain('SECRET_IN_CONFIG');
  });

  it.skipIf(!hasGitRepo())('لا تعدّل أي ملف ولا تنشر شيئًا (فحص للقراءة فقط)', () => {
    const before = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' });
    run(['--json']);
    run(['--file', SAMPLE, '--json']);
    const after = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' });
    expect(after).toBe(before);
  });
});
