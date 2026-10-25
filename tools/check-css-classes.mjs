#!/usr/bin/env node
/** فحص مؤقت: كل الكلاسات الساكنة المستخدمة في TSX يجب أن تكون معرّفة في styles.css */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync('src/web/styles.css', 'utf8');
const defined = new Set([...css.matchAll(/\.([a-z][a-z0-9-]*)/g)].map(m => m[1]));

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const used = new Set();
for (const f of walk('src/web').filter(f => f.endsWith('.tsx'))) {
  const t = readFileSync(f, 'utf8');
  for (const m of t.matchAll(/className="([^"]+)"/g)) {
    m[1].split(/\s+/).filter(Boolean).forEach(c => used.add(c));
  }
  for (const m of t.matchAll(/className=\{`([^`]+)`\}/g)) {
    m[1].split(/\s+/).filter(c => /^[a-z]/.test(c) && !c.includes('${')).forEach(c => used.add(c));
  }
}

// نتجاهل شظايا القوالب الديناميكية (معرفات JS، علامات اقتباس عالقة، أحرف مفردة)
const isStaticClass = c => /^[a-z][a-z0-9-]+$/.test(c) && c.length >= 2;
const missing = [...used].filter(c => isStaticClass(c) && !defined.has(c)).sort();
console.log(`used classes: ${used.size} | missing: ${missing.length}`);
if (missing.length) {
  console.log(missing.join('\n'));
  process.exit(1);
}
