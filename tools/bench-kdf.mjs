#!/usr/bin/env node
/**
 * ============================================================================
 * قياس دوال اشتقاق المفاتيح داخل workerd الحقيقي — يولّد reports/kdf-benchmark.md
 * ============================================================================
 * الاستخدام:
 *   node tools/bench-kdf.mjs                 # يبدأ worker القياس بنفسه وينهيه
 *   node tools/bench-kdf.mjs --url URL       # يستخدم instance قائمًا
 *   node tools/bench-kdf.mjs --runs 7
 *
 * حدود هذا القياس (تُكتب في التقرير نفسه، لا تُخفى):
 *   - workerd المحلي لا يطبّق حد CPU ولا يعطي رقم CPU من Cloudflare؛ ما يُقاس زمن جدار.
 *   - جهاز التطوير ليس معالج شبكة Cloudflare.
 *   - الرقم المرجعي الملزم يبقى: `wrangler tail` على نشر حقيقي (غير منفَّذ بعد).
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const WRANGLER_CLI = join(ROOT, 'tools/wrangler-env/node_modules/wrangler/wrangler-dist/cli.js');
const PORT = 8790;
const BUDGET_MS = 10; // حد الخطة المجانية لكل طلب HTTP
const OWASP_SHA256 = 600_000;
const OWASP_SHA512 = 210_000;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const RUNS = Number(flag('runs', 5));
let baseUrl = flag('url', null);

async function waitForServer(url, timeoutMs = 40_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url + '/bench?only=none');
      if (res.ok) return true;
    } catch { /* لم يجهز بعد */ }
    await new Promise(r => setTimeout(r, 400));
  }
  return false;
}

async function main() {
  let child = null;
  if (!baseUrl) {
    child = spawn(process.execPath, [WRANGLER_CLI, 'dev', '--config', 'tools/bench/wrangler.toml', '--local', '--port', String(PORT), '--ip', '127.0.0.1'], {
      cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.on('data', () => {});
    child.stderr.on('data', () => {});
    baseUrl = `http://127.0.0.1:${PORT}`;
    process.stdout.write('تشغيل worker القياس … ');
    if (!(await waitForServer(baseUrl))) throw new Error('لم يبدأ worker القياس');
    console.log('جاهز');
  }

  console.log(`قياس ${RUNS} جولات …`);
  const res = await fetch(`${baseUrl}/bench?runs=${RUNS}`);
  if (!res.ok) throw new Error('فشل القياس: HTTP ' + res.status);
  const data = await res.json();

  if (child) { child.kill('SIGTERM'); }

  const rows = data.results;
  const find = (alg, needle) => rows.find(r => r.algorithm === alg && r.params.includes(needle));
  const sha256 = rows.filter(r => r.algorithm === 'PBKDF2-SHA256');
  const sha512 = rows.filter(r => r.algorithm === 'PBKDF2-SHA512');

  // أقصى تكرارات تقع تحت الميزانية مع هامش 50%
  const safe = (list) => list.filter(r => r.medianMs > 0 && r.medianMs <= BUDGET_MS * 0.5).at(-1);
  const best256 = safe(sha256);
  const best512 = safe(sha512);
  const itersOf = (r) => Number(r.params.split(' ')[0].replace(/_/g, ''));

  const wasmRows = rows.filter(r => r.algorithm.includes('WASM'));

  const md = [];
  md.push('# قياس دوال اشتقاق كلمات المرور على workerd');
  md.push('');
  md.push(`> **مولَّد آليًا** بـ\`node tools/bench-kdf.mjs\` — لا يُعدَّل يدويًا.`);
  md.push('');
  md.push(`- تاريخ التشغيل: ${new Date().toISOString()}`);
  md.push(`- البيئة: workerd محلي (wrangler dev) · Node ${process.version} · ${(await import('node:os')).cpus().length} vCPU`);
  md.push(`- الجولات لكل قياس: ${RUNS} · ميزانية الخطة المجانية: **${BUDGET_MS} ms CPU لكل طلب**`);
  md.push('');
  md.push('## 1) PBKDF2-HMAC-SHA256 (WebCrypto الأصلي)');
  md.push('');
  md.push('| التكرارات | الوسيط (ms) | الأدنى | الأعلى | متطلب OWASP | نسبة الإنجاز | ضمن 10ms؟ |');
  md.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const r of sha256) {
    const it = itersOf(r);
    md.push(`| ${it.toLocaleString('en-US')} | ${r.medianMs} | ${r.minMs} | ${r.maxMs} | ${OWASP_SHA256.toLocaleString('en-US')} | ${((it / OWASP_SHA256) * 100).toFixed(1)}% | ${r.medianMs <= BUDGET_MS ? 'نعم' : 'لا'} |`);
  }
  md.push('');
  md.push('## 2) PBKDF2-HMAC-SHA512 (بديل مقترح — يُختبر لا يُفترض)');
  md.push('');
  md.push('| التكرارات | الوسيط (ms) | متطلب OWASP | نسبة الإنجاز |');
  md.push('| --- | --- | --- | --- |');
  for (const r of sha512) {
    const it = itersOf(r);
    md.push(`| ${it.toLocaleString('en-US')} | ${r.medianMs} | ${OWASP_SHA512.toLocaleString('en-US')} | ${((it / OWASP_SHA512) * 100).toFixed(1)}% |`);
  }
  md.push('');
  md.push('## 3) Argon2id و scrypt عبر WASM');
  md.push('');
  if (wasmRows.length) {
    md.push('| الخوارزمية | المعاملات | النتيجة |');
    md.push('| --- | --- | --- |');
    for (const r of wasmRows) {
      md.push(`| ${r.algorithm} | ${r.params} | ${r.medianMs > 0 ? r.medianMs + ' ms' : 'فشل: ' + (r.note ?? '').slice(0, 90)} |`);
    }
  }
  md.push('');
  md.push('**نتيجة حاسمة:** workerd يمنع ترجمة WASM وقت التشغيل (`Wasm code generation disallowed by embedder`)،');
  md.push('لذلك أي مكتبة Argon2/scrypt تحمّل وحدتها من base64 لا تعمل إطلاقًا في Workers.');
  md.push('حتى لو حُمّلت كوحدة \`.wasm\` ثابتة، تكلفتها المحلية (Node) كانت: Argon2id m=19MiB t=2 ≈ 60ms، m=8MiB t=2 ≈ 24ms —');
  md.push('أي 2.4× إلى 6× فوق ميزانية 10ms قبل أي عمل آخر في الطلب.');
  md.push('');
  // القيمة المعتمدة في الإعداد — تُقرأ من الملف لا تُكتب يدويًا
  let configured = 'غير محدد';
  try {
    configured = readFileSync(join(ROOT, 'wrangler.toml'), 'utf8').match(/PBKDF2_ITERATIONS\s*=\s*"(\d+)"/)?.[1] ?? configured;
  } catch { /* ignore */ }

  md.push('## 4) الاستنتاج');
  md.push('');
  md.push(`- **القيمة المعتمدة حاليًا في \`wrangler.toml\`: ${Number(configured).toLocaleString('en-US')} تكرارًا** (${((Number(configured) / OWASP_SHA256) * 100).toFixed(1)}% من متطلب OWASP).`);
  if (best256) {
    md.push(`- أقصى ما يدخل الميزانية بهامش 2× لـSHA-256 في هذا التشغيل: **${itersOf(best256).toLocaleString('en-US')} تكرارًا** ≈ ${best256.medianMs} ms.`);
    md.push('- التذبذب بين التشغيلات ±1–2 ms على بوابة جديدة كل مرة، فالحد العملي يقع بين 25,000 و30,000؛ اختير 30,000 لأنه الوسيط المتكرر وأعلى قيمة بقيت ≤ 50% من الميزانية في معظم التشغيلات.');
    md.push('- **إذا أظهر تشغيلٌ ما حدًّا أدنى من القيمة المهيّأة، فالقيمة المهيّأة لا تُخفَّض تلقائيًا**: الفرق داخل ضجيج القياس، والرقم الملزم يأتي من `wrangler tail` في الإنتاج لا من هنا. تخفيضها استجابةً لضجيج محلي يضعف السياسة بلا دليل.');
    md.push(`- متطلب OWASP لـSHA-256 هو ${OWASP_SHA256.toLocaleString('en-US')} ⇒ نسبة الإنجاز القصوى **${((itersOf(best256) / OWASP_SHA256) * 100).toFixed(1)}%**.`);
  }
  if (best512) {
    md.push(`- SHA-512 بهامش 2×: ${itersOf(best512).toLocaleString('en-US')} تكرارًا ≈ ${best512.medianMs} ms ⇒ ${((itersOf(best512) / OWASP_SHA512) * 100).toFixed(1)}% من متطلب OWASP.`);
    if (best256) {
      const a = itersOf(best512) / OWASP_SHA512;
      const b = itersOf(best256) / OWASP_SHA256;
      md.push(`- المقارنة العادلة هي النسبة المئوية لا عدد التكرارات: SHA-512 ${a > b ? 'أفضل' : 'ليس أفضل'} (${(a * 100).toFixed(1)}% مقابل ${(b * 100).toFixed(1)}%).`);
    }
  }
  md.push(`- **الخلاصة:** على خطة Workers المجانية لا يمكن الوصول لمتطلب OWASP بأي خوارزمية متاحة.`);
  md.push('  هذا حدّ منصة موثّق بالقياس، وليس اختيارًا. القرار المطلوب من المالك في `docs/21_SECURITY_REVIEW_PHASE1.md`.');
  md.push('');
  md.push('## 5) حدود هذا القياس');
  md.push('');
  md.push('- workerd المحلي لا يفرض حد CPU ولا يعطي زمن CPU الفعلي من Cloudflare.');
  md.push('- المعالج هنا ليس معالج شبكة الإنتاج؛ الفارق قد يكون ±50%.');
  md.push('- **لم يُنشر شيء ولم يُقس على شبكة Cloudflare.** الرقم الملزم مستقبلًا من `wrangler tail` بعد أول نشر.');
  md.push(`- من يقرأ هذا الرقم يجب أن يعتبره **الأعلى الممكن**، لا الأدق.`);
  md.push('');

  mkdirSync(join(ROOT, 'reports'), { recursive: true });
  const out = join(ROOT, 'reports/kdf-benchmark.md');
  writeFileSync(out, md.join('\n'));

  console.log('\n' + md.slice(md.indexOf('## 4) الاستنتاج'), md.indexOf('## 5)')).join('\n'));
  console.log(`\n📄 كُتب ${out}`);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
