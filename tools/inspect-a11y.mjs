import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir) {
  let files = [];
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) files = files.concat(walk(p));
    else if (p.endsWith('.tsx')) files.push(p);
  }
  return files;
}

const files = walk('src/web');
let ariaCount = 0;
let keyCount = 0;
let roleCount = 0;

for (const f of files) {
  const content = readFileSync(f, 'utf8');
  ariaCount += (content.match(/aria-[a-z]+/g) || []).length;
  keyCount += (content.match(/onKeyDown|onKeyUp/g) || []).length;
  roleCount += (content.match(/role=['"][a-z]+['"]/g) || []).length;
}

console.log('ARIA attributes count:', ariaCount);
console.log('Keyboard handlers count:', keyCount);
console.log('Role attributes count:', roleCount);
