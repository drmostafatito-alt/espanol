/* ============================================================================
   ملف قياس مستقل (ليس جزءًا من Worker الإنتاج)
   الغرض: قياس تكلفة دوال اشتقاق المفاتيح داخل workerd الحقيقي.
   يُشغَّل بـ: ./tools/wrangler-env/node_modules/.bin/wrangler dev tools/bench/bench-worker.ts --port 8790 --local
   ملاحظة: هذا القياس على جهاز التطوير، وليس على شبكة Cloudflare.
   ========================================================================== */

interface BenchResult {
  algorithm: string;
  params: string;
  runs: number[];
  medianMs: number;
  minMs: number;
  maxMs: number;
  note?: string;
}

const enc = new TextEncoder();
const PASSWORD = 'Correct-Horse-Battery-Staple-2026!';
const SALT = new Uint8Array(16).map((_, i) => i * 7 + 1);

async function timeIt(fn: () => Promise<unknown>, runs: number): Promise<BenchResult['runs']> {
  const out: number[] = [];
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    await fn();
    out.push(Number((performance.now() - t0).toFixed(2)));
  }
  return out;
}

function summarize(algorithm: string, params: string, runs: number[], note?: string): BenchResult {
  const sorted = [...runs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
  return { algorithm, params, runs, medianMs: median, minMs: sorted[0]!, maxMs: sorted[sorted.length - 1]!, note };
}

async function pbkdf2(iterations: number, hash: 'SHA-256' | 'SHA-512' = 'SHA-256'): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', enc.encode(PASSWORD), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: SALT as BufferSource, iterations, hash },
    key,
    256,
  );
  return new Uint8Array(bits);
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/bench') {
      return new Response('POST /bench', { status: 405 });
    }
    const only = url.searchParams.get('only');
    const runs = Number(url.searchParams.get('runs')) || 5;
    const results: BenchResult[] = [];

    // ---- PBKDF2-HMAC-SHA256 (WebCrypto الأصلي في workerd) ----
    if (!only || only === 'pbkdf2') {
      for (const iters of [10_000, 20_000, 25_000, 30_000, 50_000, 100_000, 210_000, 600_000]) {
        results.push(summarize('PBKDF2-SHA256', `${iters} iterations`, await timeIt(() => pbkdf2(iters, 'SHA-256'), runs)));
      }
      // SHA-512: كل تكرار أغلى، لكن متطلب OWASP أقل (210k مقابل 600k) ⇒ كفاءة أعلى لكل مللي ثانية
      for (const iters of [6_000, 8_000, 10_000, 12_000, 15_000, 20_000, 30_000, 50_000, 210_000]) {
        results.push(summarize('PBKDF2-SHA512', `${iters} iterations`, await timeIt(() => pbkdf2(iters, 'SHA-512'), runs)));
      }
    }

    // ---- Argon2id / scrypt عبر WASM ----
    if (!only || only === 'wasm') {
      const { argon2id, scrypt } = await import('hash-wasm');
      const argonParams: Array<[string, number, number, number]> = [
        ['m=19MiB t=2 p=1 (OWASP minimum)', 19 * 1024, 2, 1],
        ['m=12MiB t=3 p=1', 12 * 1024, 3, 1],
        ['m=8MiB t=2 p=1', 8 * 1024, 2, 1],
        ['m=4MiB t=3 p=1', 4 * 1024, 3, 1],
        ['m=1MiB t=3 p=1', 1 * 1024, 3, 1],
      ];
      for (const [label, memorySize, iterations, parallelism] of argonParams) {
        try {
          results.push(
            summarize(
              'Argon2id (WASM)',
              label,
              await timeIt(() => argon2id({ password: PASSWORD, salt: SALT, memorySize, iterations, parallelism, hashLength: 32, outputType: 'binary' }), runs),
            ),
          );
        } catch (e) {
          results.push({ algorithm: 'Argon2id (WASM)', params: label, runs: [], medianMs: -1, minMs: -1, maxMs: -1, note: String(e).slice(0, 200) });
        }
      }
      for (const [label, N, r] of [
        ['N=2^14 r=8 p=1', 1 << 14, 8],
        ['N=2^16 r=8 p=1 (OWASP min)', 1 << 16, 8],
      ] as Array<[string, number, number]>) {
        try {
          results.push(
            summarize(
              'scrypt (WASM)',
              label,
              await timeIt(() => scrypt({ password: PASSWORD, salt: SALT, cost: N, blockSize: r, parallelism: 1, hashLength: 32, outputType: 'binary' }), runs),
            ),
          );
        } catch (e) {
          results.push({ algorithm: 'scrypt (WASM)', params: label, runs: [], medianMs: -1, minMs: -1, maxMs: -1, note: String(e).slice(0, 200) });
        }
      }
    }

    return new Response(JSON.stringify({ runtime: 'workerd (local dev)', runs, results }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
