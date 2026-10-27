import { describe, it, expect } from 'vitest';
import { timingSafeEqual, randomToken, sha256Hex, b64url, fromB64url } from '../src/worker/lib/crypto';
import { hashPassword, verifyPassword, passwordProblems, resolvePolicy, needsRehash, MIN_ITERATIONS } from '../src/worker/lib/password';
import { ulid, stableId } from '../src/worker/lib/ids';
import { checkRateLimit } from '../src/worker/lib/rate-limit';
import { gradingModeOf, gradeAnswer } from '../src/worker/lib/grading';
import { createTestDb } from '../src/worker/testing/d1-adapter';

describe('crypto', () => {
  const policy = resolvePolicy({ PBKDF2_ITERATIONS: '20000', PASSWORD_PEPPER: 'p'.repeat(40), ENVIRONMENT: 'test' });

  it('تجزئة كلمة المرور ثم التحقق منها', async () => {
    const h = await hashPassword('Cairo2026learn', policy);
    expect(await verifyPassword('Cairo2026learn', h, policy)).toBe(true);
    expect(await verifyPassword('Cairo2026learn', h, { ...policy, pepper: 'other-pepper-xxxxxxxxxxxxxxxxxxxxxxxx' })).toBe(false);
    expect(await verifyPassword('cairo2026learn', h, policy)).toBe(false);
  });

  it('ملح مختلف في كل تجزئة (لا تكرار)', async () => {
    const a = await hashPassword('Cairo2026learn', policy);
    const b = await hashPassword('Cairo2026learn', policy);
    expect(a).not.toBe(b);
    expect(a.split('$')[2]).not.toBe(b.split('$')[2]);
  });

  it('صيغة مخزَّنة تالفة تُرفض بأمان (لا استثناء)', async () => {
    expect(await verifyPassword('x', 'plaintext', policy)).toBe(false);
    expect(await verifyPassword('x', 'pbkdf2$10$abc', policy)).toBe(false);
    expect(await verifyPassword('x', 'pbkdf2$999999999$ic$ic', policy)).toBe(false);
    expect(await verifyPassword('x', 'pbkdf2-sha256$99999999$ic$ic', policy)).toBe(false);
  });

  it('المقارنة الزمنية الثابتة', () => {
    expect(timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
    expect(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
  });

  it('base64url ذهابًا وإيابًا', () => {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    expect([...fromB64url(b64url(bytes))]).toEqual([...bytes]);
    expect(b64url(bytes)).not.toMatch(/[+/=]/);
  });

  it('توكنات عشوائية فريدة بطول مناسب', () => {
    const a = randomToken(32), b = randomToken(32);
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(40);
  });

  it('sha256 ثابت معروف', async () => {
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('قواعد قوة كلمة المرور', () => {
    expect(passwordProblems('short')).not.toHaveLength(0);
    expect(passwordProblems('alllettersonly')).toContain('يجب أن تحتوي رقمًا واحدًا على الأقل.');
    expect(passwordProblems('1234567890')).toContain('يجب أن تحتوي حرفًا واحدًا على الأقل.');
    expect(passwordProblems(' Cairo2026learn')).toContain('لا تبدأ أو تنتهِ بمسافة.');
    expect(passwordProblems('Cairo2026learn')).toHaveLength(0);
    expect(passwordProblems(undefined as unknown as string)).toHaveLength(1);
  });
});

describe('سياسة كلمات المرور (password.ts)', () => {
  const strong = 'p'.repeat(40);

  it('ترفض سياسة بلا pepper في غير بيئة الاختبار', () => {
    expect(() => resolvePolicy({ PBKDF2_ITERATIONS: '30000', PASSWORD_PEPPER: '', ENVIRONMENT: 'production' })).toThrow();
  });

  it('ترفض pepper قصيرًا في الإنتاج وتقبله في الاختبار', () => {
    expect(() => resolvePolicy({ PBKDF2_ITERATIONS: '30000', PASSWORD_PEPPER: 'short', ENVIRONMENT: 'production' })).toThrow();
    expect(() => resolvePolicy({ PBKDF2_ITERATIONS: '30000', PASSWORD_PEPPER: 'short', ENVIRONMENT: 'test' })).not.toThrow();
  });

  it('ترفع أي قيمة تحت الأرضية وتقصّ أي قيمة فوق السقف', () => {
    expect(resolvePolicy({ PBKDF2_ITERATIONS: '1', PASSWORD_PEPPER: strong, ENVIRONMENT: 'test' }).iterations).toBe(MIN_ITERATIONS);
    expect(resolvePolicy({ PBKDF2_ITERATIONS: '99999999', PASSWORD_PEPPER: strong, ENVIRONMENT: 'test' }).iterations).toBe(2_000_000);
  });

  it('الافتراضي عند غياب المتغير هو متطلب OWASP (فشل مغلق لا صامت)', () => {
    expect(resolvePolicy({ PASSWORD_PEPPER: strong, ENVIRONMENT: 'test' }).iterations).toBe(600_000);
  });

  it('تكتشف الحاجة لترقية التجزئة عند رفع التكرارات أو تغيير الصيغة', async () => {
    const low = resolvePolicy({ PBKDF2_ITERATIONS: '20000', PASSWORD_PEPPER: strong, ENVIRONMENT: 'test' });
    const high = resolvePolicy({ PBKDF2_ITERATIONS: '40000', PASSWORD_PEPPER: strong, ENVIRONMENT: 'test' });
    const h = await hashPassword('Cairo2026learn', low);
    expect(needsRehash(h, low)).toBe(false);
    expect(needsRehash(h, high)).toBe(true);
    // كلمة المرور نفسها تظل صالحة بعد الترقية (المعاملات مُضمَّنة في الصيغة المخزَّنة)
    expect(await verifyPassword('Cairo2026learn', h, high)).toBe(true);
  });

  it('needsRehash تعيد true للصيغة القديمة (legacy) والصيغ التالفة', () => {
    const policy = resolvePolicy({ PBKDF2_ITERATIONS: '30000', PASSWORD_PEPPER: strong, ENVIRONMENT: 'test' });
    // صيغة legacy تبدأ بـ pbkdf2$ بدلاً من pbkdf2-sha256$
    expect(needsRehash('pbkdf2$30000$c2FsdHNhbHRzYWx0MTY$aGFzaGhhc2hoYXNoMzJoYXNoMzJoYXNoMzJoYXNoMzI', policy)).toBe(true);
    // صيغ تالفة أو غير صالحة
    expect(needsRehash('invalid_hash', policy)).toBe(true);
    expect(needsRehash('pbkdf2-sha256$bad', policy)).toBe(true);
    expect(needsRehash('', policy)).toBe(true);
  });

  it('needsRehash لا تخفّض التكرارات إذا كانت التجزئة المخزنة أعلى من السياسة', async () => {
    const highPolicy = resolvePolicy({ PBKDF2_ITERATIONS: '50000', PASSWORD_PEPPER: strong, ENVIRONMENT: 'test' });
    const lowPolicy = resolvePolicy({ PBKDF2_ITERATIONS: '30000', PASSWORD_PEPPER: strong, ENVIRONMENT: 'test' });
    const h = await hashPassword('Cairo2026learn', highPolicy);
    // التجزئة بـ 50000 تكرار؛ والسياسة الحالية 30000: لا نخفض الأمان
    expect(needsRehash(h, lowPolicy)).toBe(false);
    expect(await verifyPassword('Cairo2026learn', h, lowPolicy)).toBe(true);
  });

  it('تغيير الـ pepper يمنع التحقق تمامًا (فشل آمن)', async () => {
    const policyA = resolvePolicy({ PBKDF2_ITERATIONS: '30000', PASSWORD_PEPPER: 'a'.repeat(40), ENVIRONMENT: 'test' });
    const policyB = resolvePolicy({ PBKDF2_ITERATIONS: '30000', PASSWORD_PEPPER: 'b'.repeat(40), ENVIRONMENT: 'test' });
    const h = await hashPassword('Cairo2026learn', policyA);
    expect(await verifyPassword('Cairo2026learn', h, policyA)).toBe(true);
    expect(await verifyPassword('Cairo2026learn', h, policyB)).toBe(false);
  });

  it('ترفض كلمات المرور الشائعة والمتسلسلة حتى لو طالت', () => {
    expect(passwordProblems('password1234')).not.toHaveLength(0);
    expect(passwordProblems('abcdefghijklm')).not.toHaveLength(0);
    expect(passwordProblems('aaaaaaaaaaaa')).not.toHaveLength(0);
    expect(passwordProblems('Cairo2026learn')).toHaveLength(0);
  });

  it('ترفض استخدام البريد داخل كلمة المرور', () => {
    expect(passwordProblems('sara2026learn', { email: 'sara@example.com' })).not.toHaveLength(0);
  });
});

describe('ids', () => {
  it('ULID بطول 26 وحروف Crockford فقط', () => {
    const id = ulid();
    expect(id).toHaveLength(26);
    expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
  });
  it('ULID يزيد زمنيًا مع الوقت', () => {
    expect(ulid(1000) < ulid(2000)).toBe(true);
  });
  it('stableId ثابت لنفس البذرة ومختلف لبذرة أخرى', async () => {
    const a = await stableId('lsn', 'prea1-hola-me-llamo');
    const b = await stableId('lsn', 'prea1-hola-me-llamo');
    const c = await stableId('lsn', 'a1-un-cafe-por-favor');
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a.startsWith('lsn_')).toBe(true);
  });
});

describe('سياسة التشكيل في التصحيح (grading.ts)', () => {
  it('الافتراضي متسامح مع غياب النبرة: esta تقبل está', () => {
    expect(gradeAnswer('fill_blank', { accepted: ['está'] }, 'esta').correct).toBe(true);
    expect(gradeAnswer('fill_blank', { accepted: ['café'] }, 'cafe').correct).toBe(true);
    expect(gradeAnswer('fill_blank', { accepted: ['Hacía'] }, 'hacia').correct).toBe(true);
  });

  it('ñ حرف قائم بذاته لا يُحذف: año ≠ ano وpeña ≠ pena حتى مع التسامح', () => {
    expect(gradeAnswer('fill_blank', { accepted: ['año'] }, 'ano').correct).toBe(false);
    expect(gradeAnswer('fill_blank', { accepted: ['peña'] }, 'pena').correct).toBe(false);
    expect(gradeAnswer('fill_blank', { accepted: ['mañana'] }, 'manana').correct).toBe(false);
    expect(gradeAnswer('fill_blank', { accepted: ['año'] }, 'año').correct).toBe(true);
    expect(gradeAnswer('fill_blank', { accepted: ['soñar'] }, 'sonar').correct).toBe(false);
  });

  it('strictAccent يميّز الزوج الدنيا ويعطي تلميح نبرة فقط', () => {
    const key = { accepted: ['si'], strictAccent: true };
    expect(gradeAnswer('fill_blank', key, 'si').correct).toBe(true);
    const wrong = gradeAnswer('fill_blank', key, 'sí');
    expect(wrong.correct).toBe(false);
    expect(wrong.wrongByAccentOnly).toBe(true);
    expect(wrong.chosenFeedbackAr).toMatch(/النبرة/);
  });

  it('الحالة والمسافات والترقيم ما زالت متسامحة افتراضيًا', () => {
    expect(gradeAnswer('fill_blank', { accepted: ['Está bien.'] }, '  está   bien ').correct).toBe(true);
  });
});

describe('gradingModeOf', () => {
  it('نوع غير معروف يُعامل كمشاركة لا كمُصحَّح (لا درس مستحيل صامتًا)', () => {
    expect(gradingModeOf('word_choice')).toBe('graded');
    expect(gradingModeOf('speak_with_text')).toBe('participation');
    expect(gradingModeOf('some_future_type')).toBe('participation');
  });
});

describe('rate limit', () => {
  it('يسمح حتى الحد ثم يمنع، وينفتح في نافذة جديدة', async () => {
    const { d1, raw } = createTestDb();
    const t0 = 1_700_000_000_000;
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await checkRateLimit(d1, 'b1', 3, 60, t0 + i * 100));
    expect(results.slice(0, 3).every(r => r.allowed)).toBe(true);
    expect(results[3]!.allowed).toBe(false);
    expect(results[3]!.remaining).toBe(0);
    const next = await checkRateLimit(d1, 'b1', 3, 60, t0 + 61_000);
    expect(next.allowed).toBe(true);
    raw.close();
  });
});
