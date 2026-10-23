/**
 * معايرة PBKDF2 — قياس تقديري داخل Node.
 *
 * ⚠️ القياس المرجعي هو `tools/bench-kdf.mjs` الذي يعمل داخل workerd الحقيقي ويكتب
 * `reports/kdf-benchmark.md`. هذا الملف مجرد تحقق معقولية سريع داخل الاختبارات،
 * ويُوثّق صراحة أنه ليس قياس CPU على منصة Cloudflare.
 */
import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { hashPassword, resolvePolicy } from '../src/worker/lib/password';

const ITERATIONS = [20000, 30000, 60000, 600000];
const OWASP = 600000;

describe('معايرة PBKDF2 (تقدير Node)', () => {
  it('يقيس الزمن لكل عدد تكرارات ويكتب تقريرًا تقديريًا', async () => {
    const pepper = 'p'.repeat(40);
    const rows: { iters: number; medianMs: number; maxMs: number }[] = [];
    for (const iters of ITERATIONS) {
      const policy = resolvePolicy({ PBKDF2_ITERATIONS: String(iters), PASSWORD_PEPPER: pepper, ENVIRONMENT: 'test' });
      const samples: number[] = [];
      for (let i = 0; i < 5; i++) {
        const t = performance.now();
        await hashPassword('Cairo2026learn', policy);
        samples.push(performance.now() - t);
      }
      samples.sort((a, b) => a - b);
      rows.push({ iters, medianMs: samples[Math.floor(samples.length / 2)]!, maxMs: samples[samples.length - 1]! });
    }

    const md = [
      '# معايرة PBKDF2 — تقدير داخل Node',
      '',
      `تاريخ التشغيل: ${new Date().toISOString()}`,
      `البيئة: Node ${process.version} · WebCrypto أصلي · CPU مشترك`,
      '',
      '| التكرارات | الوسيط (ms) | الأعلى (ms) | نسبة متطلب OWASP (600,000) |',
      '| --- | --- | --- | --- |',
      ...rows.map(r => `| ${r.iters} | ${r.medianMs.toFixed(2)} | ${r.maxMs.toFixed(2)} | ${((r.iters / OWASP) * 100).toFixed(1)}% |`),
      '',
      '## تنبيه',
      'هذا القياس داخل Node وليس على workerd، ولا يعكس CPU الحقيقي على شبكة Cloudflare.',
      'القياس المرجعي: `reports/kdf-benchmark.md` (مولَّد بـ`node tools/bench-kdf.mjs` مع تشغيل wrangler dev).',
      'النتيجة الحاسمة: حتى عند 600,000 تكرار يظل الطلب فوق حد 10ms CPU للخطة المجانية،',
      'ولهذا لا يمكن اعتبار أي إعداد «مطابقًا لـOWASP» على هذه الخطة — انظر docs/21_SECURITY_REVIEW_PHASE1.md.',
    ].join('\n');

    mkdirSync(join(process.cwd(), 'reports'), { recursive: true });
    writeFileSync(join(process.cwd(), 'reports', 'pbkdf2-calibration.md'), md + '\n');

    expect(rows).toHaveLength(ITERATIONS.length);
    expect(rows[0]!.medianMs).toBeGreaterThan(0);
    // تحقق معقولية: 20k أسرع من 600k
    expect(rows[0]!.medianMs).toBeLessThan(rows.at(-1)!.medianMs);
  });
});
