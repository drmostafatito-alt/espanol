import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir) {
  let files = [];
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) files = files.concat(walk(p));
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) files.push(p);
  }
  return files;
}

const files = walk('src/web');
for (const f of files) {
  const content = readFileSync(f, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('import') && (line.includes('.json') || line.includes('search') || line.includes('dist'))) {
      console.log(f + ' -> ' + line.trim());
    }
  }
}
