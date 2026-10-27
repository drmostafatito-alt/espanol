import { DatabaseSync } from 'node:sqlite';

// اكتشاف ملف القاعدة المحلية ديناميكيًا (AUD-21) — الاسم هاش يختلف بين الأجهزة/المشاريع
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const D1_DIR = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
const dbFiles = (() => { try { return readdirSync(D1_DIR).filter(f => f.endsWith('.sqlite') && !f.includes('-wal') && !f.includes('-shm')); } catch { return []; } })();
if (dbFiles.length !== 1) {
  console.error(dbFiles.length === 0
    ? '❌ لا قاعدة D1 محلية. شغّل: npm run db:migrate:local ثم الاستيراد المحلي أولًا.'
    : `❌ وُجد ${dbFiles.length} ملفات قاعدة محلية — حدّد المقصودة يدويًا قبل التشغيل.`);
  process.exit(2);
}
const DB_PATH = join(D1_DIR, dbFiles[0]);
const db = new DatabaseSync(DB_PATH, { open: true, readOnly: true });

const lessons = db.prepare(`
  SELECT l.id, l.slug, l.title_ar, l.level_code, l.unlock_rule_json, u.slug as unit_slug, p.slug as prog_slug
  FROM lessons l
  JOIN units u ON u.id = l.unit_id
  JOIN programs p ON p.id = u.program_id
`).all();

const slugs = new Set(lessons.map(l => l.slug));
const brokenDeps = [];
const cycleCheck = new Map();

for (const l of lessons) {
  let rule = {};
  try { rule = JSON.parse(l.unlock_rule_json || '{}'); } catch (e) {}
  const reqs = Array.isArray(rule.requires) ? rule.requires : [];
  cycleCheck.set(l.slug, reqs);
  for (const r of reqs) {
    if (!slugs.has(r)) {
      brokenDeps.push({ lesson: l.slug, level: l.level_code, missingReq: r });
    }
  }
}

// فحص الدورات الحلقية الميتة (Circular dependencies)
const cycles = [];
function detectCycle(slug, visited = new Set(), path = []) {
  if (path.includes(slug)) {
    cycles.push([...path, slug].join(' -> '));
    return;
  }
  if (visited.has(slug)) return;
  visited.add(slug);
  const reqs = cycleCheck.get(slug) || [];
  for (const r of reqs) {
    detectCycle(r, visited, [...path, slug]);
  }
}

for (const s of slugs) {
  detectCycle(s);
}

console.log('=== فحص الرسم البياني للمتطلبات السابقة (Prerequisites Graph) ===');
console.log(`إجمالي الدروس: ${lessons.length}`);
console.log(`المتطلبات المكسورة (Broken prerequisites): ${brokenDeps.length}`);
if (brokenDeps.length > 0) {
  console.log('المتطلبات المكسورة:', brokenDeps);
}
console.log(`الدورات الحلقية الميتة (Cycles): ${cycles.length}`);
if (cycles.length > 0) {
  console.log('الدورات:', cycles);
}
if (brokenDeps.length === 0 && cycles.length === 0) {
  console.log('✅ رسم المتطلبات السابقة سليم 100% ولا يحتوي على أي فجوات أو دورات ميتة.');
}
