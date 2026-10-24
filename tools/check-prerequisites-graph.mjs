import { DatabaseSync } from 'node:sqlite';

const DB_PATH = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/9ba2b04bf514d9facfd57ed57d849e77241a7adc99d1c1545d06688b43d84248.sqlite';
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
