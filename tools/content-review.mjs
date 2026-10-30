#!/usr/bin/env node
/**
 * سير عمل مراجعة جودة المحتوى — Español بالعربي
 *
 * ما يفعله:
 *   * يفهرس كل عناصر المحتوى القابلة للمراجعة بمعرّفات ثابتة.
 *   * يشغّل فحوصًا آلية تُنتج «مرشّحين» (لا تعدّل شيئًا).
 *   * يقرأ سجل المراجعة (content/review/ledger.v1.json) ويشتق منه التغطية.
 *   * يطبّق التصحيحات عالية الثقة فقط، وبشكل idempotent (إعادة التشغيل لا تُكرّر).
 *
 * أمثلة:
 *   node tools/content-review.mjs                 # تقرير التغطية والحالة
 *   node tools/content-review.mjs --scan          # المرشّحون الآليون (JSON)
 *   node tools/content-review.mjs --apply --dry-run
 *   node tools/content-review.mjs --apply
 *   node tools/content-review.mjs --sql           # سجلات content_review_records
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadInventory,
  computeCoverage,
  validateLedger,
  planCorrections,
  applyPlan,
  runChecks,
  formatCoverage,
  expandScope,
  isTemplateExample,
} from './lib/content-review.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER_PATH = join(ROOT, 'content', 'review', 'ledger.v1.json');
const OUT_DIR = join(ROOT, 'reports', 'content-review');

const args = process.argv.slice(2);
const has = flag => args.includes(flag);
const asJson = has('--json');

const ledger = JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
const inventory = loadInventory(ROOT);
const coverage = computeCoverage(inventory, ledger);
const validation = validateLedger(ledger, inventory);

function summary() {
  const counts = { corrected: 0, flagged: 0, accepted: 0, deferred: 0 };
  for (const f of ledger.findings ?? []) counts[f.status] = (counts[f.status] ?? 0) + 1;
  const bySeverity = {};
  for (const f of ledger.findings ?? []) bySeverity[f.severity] = (bySeverity[f.severity] ?? 0) + 1;
  return { counts, bySeverity, batches: (ledger.batches ?? []).length };
}

function fail(title, lines) {
  console.error(`\n❌ ${title}`);
  for (const line of lines) console.error(`  • ${line}`);
  return 1;
}

/**
 * بناء قوائم انتظار قابلية للاستئناف للأمثلة القالبية، بمستوى واحد لكل ملف:
 * content/review/queues/template-<level>.json. نفس الكاشف المستخدم في الفحص
 * (isTemplateExample) كي تتطابق الأرقام في التقرير والقوائم.
 */
if (has('--queues')) {
  const LEVELS = ['PREA1', 'A1', 'A2', 'B1', 'B2', 'C1'];
  const groups = new Map(LEVELS.map(l => [l, []]));
  for (const item of inventory.vocab) {
    const example = String(item.entry.senses?.[0]?.exampleEs ?? '').trim();
    if (!example || !isTemplateExample(item.entry.headword, example)) continue;
    const level = String(item.level ?? '').toUpperCase() || 'A1';
    if (!groups.has(level)) groups.set(level, []);
    groups.get(level).push(item.id);
  }
  mkdirSync(join(ROOT, 'content/review/queues'), { recursive: true });
  let total = 0;
  // نكتب ملفًا لكل مستوى حتى لو كان فارغًا: تخطّي المستوى المنتهي يترك قائمة قديمة
  // على القرص توهم بأن العمل ما زال متبقيًا فيه.
  for (const [level, ids] of groups) {
    total += ids.length;
    const name = `template-${level.toLowerCase()}`;
    writeFileSync(join(ROOT, 'content/review/queues', `${name}.json`),
      JSON.stringify({ queue: name, level, generatedAt: new Date().toISOString().slice(0, 10), ids: ids.sort() }, null, 2) + '\n');
    console.log(`  ${level.padEnd(6)} ${String(ids.length).padStart(5)}  content/review/queues/${name}.json`);
  }
  console.log(`\n🧾 إجمالي الأمثلة القالبية الباقية: ${total} من ${inventory.vocab.length}`);
  process.exit(0);
}

if (has('--scan')) {
  const candidates = runChecks(inventory);
  mkdirSync(OUT_DIR, { recursive: true });
  const out = join(OUT_DIR, 'candidates.json');
  writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), total: candidates.length, candidates }, null, 2));
  if (asJson) console.log(JSON.stringify(candidates, null, 2));
  else {
    const byCheck = {};
    for (const c of candidates) byCheck[c.check] = (byCheck[c.check] ?? 0) + 1;
    console.log(`🔎 مرشّحون آليون: ${candidates.length}`);
    for (const [check, n] of Object.entries(byCheck).sort((a, b) => b[1] - a[1])) console.log(`   ${check.padEnd(22)} ${n}`);
    console.log(`\n📄 ${out.replace(ROOT + '/', '')}`);
  }
  process.exit(validation.errors.length ? fail('سجل المراجعة فيه أخطاء', validation.errors) : 0);
}

if (has('--apply')) {
  if (validation.errors.length) process.exit(fail('سجل المراجعة فيه أخطاء — لا تطبيق', validation.errors));
  const plan = planCorrections(ledger, inventory);
  if (plan.stale.length) {
    process.exit(fail('تصحيحات لم تعد مطابقة للمحتوى', plan.stale.map(s => `${s.finding.id}: ${s.reason}`)));
  }
  const dryRun = has('--dry-run');
  const applied = dryRun ? plan.toApply.map(e => ({ id: e.finding.id, path: e.finding.path.join('.'), file: e.item.file })) : applyPlan(plan, ROOT);
  console.log(`🩹 تصحيحات: ${applied.length} ${dryRun ? '(تجربة بلا كتابة)' : 'مطبَّقة'} · سابقًا: ${plan.alreadyApplied.length}`);
  for (const a of applied) console.log(`   ${a.id}  ${a.path}`);
  process.exit(0);
}

if (has('--sql')) {
  // سجلات مراجعة D1 محلية (content_review_records) — مشتقة من السجل نفسه.
  // المرحلة automated لأن المراجعة مساعدة آلية ولم تُعتمد بشريًا (human_final تبقى فارغة).
  const esc = s => String(s).replace(/'/g, "''");
  const lines = [];
  for (const batch of ledger.batches ?? []) {
    if (batch.status !== 'reviewed') continue;
    const seen = new Set();
    for (const scope of batch.scopes ?? []) {
      for (const itemId of expandScope(scope, inventory)) {
        const key = `${batch.id}|${itemId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const kind = itemId.split(':')[0];
        const targetType =
          kind === 'lesson' ? 'lesson_version' : kind === 'vocab' ? 'vocabulary_entry' : kind === 'exercise' ? 'exercise' : null;
        if (!targetType) continue;
        const targetId = itemId.slice(itemId.indexOf(':') + 1);
        const decision = (ledger.findings ?? []).some(f => f.itemId === itemId && f.status === 'flagged') ? 'needs_changes' : 'passed';
        lines.push(
          `INSERT OR IGNORE INTO content_review_records (id, target_type, target_id, stage, decision, notes) VALUES ` +
            // الصياغة تصرّح بأنها مراجعة آلية مساعدة، لا اعتماد بشري ولا نشر
            `('rev_${esc(batch.id)}_${esc(targetId)}', '${targetType}', '${esc(targetId)}', 'automated', '${decision}', 'مراجعة آلية مساعدة (ليست اعتمادًا بشريًا، ولا تنشر شيئًا): ${esc(batch.method)}');`,
        );
      }
    }
  }
  const out = join(OUT_DIR, 'review-records.sql');
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(out, lines.join('\n') + '\n');
  console.log(`🗄️  ${lines.length} سجل مراجعة → ${out.replace(ROOT + '/', '')}`);
  process.exit(0);
}

// التقرير الافتراضي
if (validation.errors.length) {
  process.exit(fail('سجل المراجعة فيه أخطاء', validation.errors));
}

const { counts, bySeverity, batches } = summary();
if (asJson) {
  console.log(JSON.stringify({ coverage, counts, bySeverity, batches, warnings: validation.warnings }, null, 2));
  process.exit(0);
}

console.log('📚 تغطية المراجعة (من سجل content/review/ledger.v1.json)');
console.log(formatCoverage(coverage));
console.log(`\n📝 ملاحظات: ${counts.corrected ?? 0} مُصحَّحة · ${counts.flagged ?? 0} مُعلَّقة · ${counts.accepted ?? 0} مقبولة · ${counts.deferred ?? 0} مؤجّلة`);
console.log(`   الدفعات: ${batches} · الشدة: ${JSON.stringify(bySeverity)}`);

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
console.log('\n📍 التغطية حسب المستوى (دروس/مفردات):');
for (const [level, v] of Object.entries(coverage.byLevel).sort()) {
  console.log(
    `   ${level.padEnd(7)} دروس ${String(v.lessons[1]).padStart(3)}/${String(v.lessons[0]).padEnd(3)} (${pct(v.lessons[1], v.lessons[0])}%)` +
      ` · مفردات ${String(v.vocab[1]).padStart(4)}/${String(v.vocab[0]).padEnd(4)} (${pct(v.vocab[1], v.vocab[0])}%)`,
  );
}
if (validation.warnings.length) {
  console.log('\n⚠️  تنبيهات السجل:');
  for (const w of validation.warnings.slice(0, 10)) console.log(`   • ${w}`);
}
