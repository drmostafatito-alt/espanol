import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dirs = [
  'content/exemplars',
  'content/drafts/a1',
  'content/drafts/a2',
  'content/drafts/travel'
];

const items = new Map(); // textHash -> { key, text, source, type }

for (const d of dirs) {
  if (!existsSync(d)) continue;
  const files = readdirSync(d).filter(f => f.endsWith('.json') && !f.includes('paths.json') && !f.includes('vocab-'));
  for (const f of files) {
    const data = JSON.parse(readFileSync(join(d, f), 'utf8'));
    const lesson = data.lesson || data;
    const slug = lesson.slug || f.replace('.json', '');
    const exercises = lesson.exercises || [];

    for (const ex of exercises) {
      const text = ex.speechEs || (ex.type === 'listen_choose' || ex.type === 'speak_with_text' ? ex.stemEs : null);
      if (text && text.trim()) {
        const cleanKey = ex.audioKey ? ex.audioKey.replace(/^pending\//, '') : `${slug}-${ex.id}`;
        const trimmed = text.trim();
        if (!items.has(trimmed)) {
          items.set(trimmed, {
            key: cleanKey,
            rawKey: ex.audioKey || cleanKey,
            text: trimmed,
            source: `${slug}:${ex.id}`,
            type: ex.type,
          });
        }
      }
    }

    const scenarios = lesson.scenarios || [];
    for (let sIdx = 0; sIdx < scenarios.length; sIdx++) {
      const sc = scenarios[sIdx];
      const lines = sc.lines || [];
      for (let lIdx = 0; lIdx < lines.length; lIdx++) {
        const l = lines[lIdx];
        if (l.es && l.es.trim()) {
          const cleanKey = l.audioKey ? l.audioKey.replace(/^pending\//, '') : `${slug}-sc${sIdx + 1}-l${lIdx + 1}`;
          const trimmed = l.es.trim();
          if (!items.has(trimmed)) {
            items.set(trimmed, {
              key: cleanKey,
              rawKey: l.audioKey || cleanKey,
              text: trimmed,
              source: `${slug}:scenario-${sIdx + 1}`,
              type: 'dialogue',
            });
          }
        }
      }
    }
  }
}

console.log(`=== Unique Audio Items in Priority Lessons (Exemplars, A1, A2, Travel) ===`);
console.log(`Total unique phrases/dialogues: ${items.size}`);
let count = 0;
for (const [text, info] of items.entries()) {
  if (++count <= 15) {
    console.log(`  [${info.key}] "${text}" (from ${info.source})`);
  }
}
