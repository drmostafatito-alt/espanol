import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const BANNED_PATTERNS = [
  { re: /(?<![A-Za-zÀ-ÿ])transfero(?![A-Za-zÀ-ÿ])/i, name: 'transfero (must be transfiero)' },
  { re: /(?<![A-Za-zÀ-ÿ])recogo(?![A-Za-zÀ-ÿ])/i, name: 'recogo (must be recojo)' },
  { re: /(?<![A-Za-zÀ-ÿ])agradezo(?![A-Za-zÀ-ÿ])/i, name: 'agradezo (must be agradezco)' },
  { re: /(?<![A-Za-zÀ-ÿ])atendo(?![A-Za-zÀ-ÿ])/i, name: 'atendo (must be atiendo)' },
  { re: /(?<![A-Za-zÀ-ÿ])incluo(?![A-Za-zÀ-ÿ])/i, name: 'incluo (must be incluyo)' },
  { re: /(?<![A-Za-zÀ-ÿ])producjo(?![A-Za-zÀ-ÿ])/i, name: 'producjo (must be produjo)' },
  { re: /(?<![A-Za-zÀ-ÿ])reducjo(?![A-Za-zÀ-ÿ])/i, name: 'reducjo (must be redujo)' },
  { re: /(?<![A-Za-zÀ-ÿ])deducjo(?![A-Za-zÀ-ÿ])/i, name: 'deducjo (must be dedujo)' },
  { re: /(?<![A-Za-zÀ-ÿ])inducjo(?![A-Za-zÀ-ÿ])/i, name: 'inducjo (must be indujo)' },
  { re: /(?<![A-Za-zÀ-ÿ])introducjo(?![A-Za-zÀ-ÿ])/i, name: 'introducjo (must be introdujo)' },
  { re: /(?<![A-Za-zÀ-ÿ])seducjo(?![A-Za-zÀ-ÿ])/i, name: 'seducjo (must be sedujo)' },
  { re: /(?<![A-Za-zÀ-ÿ])conoco(?![A-Za-zÀ-ÿ])/i, name: 'conoco (must be conozco)' },
  { re: /(?<![A-Za-zÀ-ÿ])poneo(?![A-Za-zÀ-ÿ])/i, name: 'poneo (must be pongo)' },
  { re: /(?<![A-Za-zÀ-ÿ])saleo(?![A-Za-zÀ-ÿ])/i, name: 'saleo (must be salgo)' },
  { re: /(?<![A-Za-zÀ-ÿ])tenero(?![A-Za-zÀ-ÿ])/i, name: 'tenero' },
  { re: /(?<![A-Za-zÀ-ÿ])haceo(?![A-Za-zÀ-ÿ])/i, name: 'haceo (must be hago)' },
  { re: /(?<![A-Za-zÀ-ÿ])decio(?![A-Za-zÀ-ÿ])/i, name: 'decio (must be digo)' },
  { re: /(?<![A-Za-zÀ-ÿ])venio(?![A-Za-zÀ-ÿ])/i, name: 'venio (must be vengo)' },
  { re: /(?<![A-Za-zÀ-ÿ])sabeo(?![A-Za-zÀ-ÿ])/i, name: 'sabeo (must be sé)' },
  { re: /(?<![A-Za-zÀ-ÿ])traducjo(?![A-Za-zÀ-ÿ])/i, name: 'traducjo (must be tradujo)' },
  { re: /(?<![A-Za-zÀ-ÿ])conducjo(?![A-Za-zÀ-ÿ])/i, name: 'conducjo (must be condujo)' }
];

function walk(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  const list = readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.wrangler' && entry.name !== 'dist') {
        results.push(...walk(full));
      }
    } else {
      results.push(full);
    }
  }
  return results;
}

const contentFiles = walk(join(ROOT, 'content')).filter(f => f.endsWith('.json'));

const verbViolations = [];
for (const file of contentFiles) {
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '');
  const content = readFileSync(file, 'utf8');
  for (const pat of BANNED_PATTERNS) {
    const match = content.match(pat.re);
    if (match) {
      const idx = match.index;
      const snippet = content.slice(Math.max(0, idx - 60), Math.min(content.length, idx + 60));
      if (snippet.includes('commonError') || snippet.includes('لا تستخدم') || snippet.includes('استخدم') || snippet.includes('خطأ شائع')) {
        continue;
      }
      verbViolations.push({ file: rel, match: match[0], rule: pat.name, snippet: snippet.replace(/\r?\n/g, ' ') });
    }
  }
}

console.log(`Banned verb violations found: ${verbViolations.length}`);
for (const v of verbViolations) {
  console.log(`❌ [${v.rule}] in ${v.file}: "${v.snippet}"`);
}

const lessonFiles = contentFiles.filter(f => f.includes('lesson-'));
let totalLessons = 0;
let totalExercises = 0;
const exerciseErrors = [];
const seenExerciseIds = new Map();

for (const file of lessonFiles) {
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '');
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const lesson = data.lesson;
  if (!lesson) continue;
  totalLessons++;

  const exercises = lesson.exercises || [];
  for (const ex of exercises) {
    totalExercises++;
    if (seenExerciseIds.has(ex.id)) {
      exerciseErrors.push({ file: rel, exerciseId: ex.id, error: `Duplicate exercise ID! Previously seen in ${seenExerciseIds.get(ex.id)}` });
    } else {
      seenExerciseIds.set(ex.id, rel);
    }

    if (ex.options && ex.options.length > 0) {
      const optIds = new Set(ex.options.map(o => o.id));
      if (optIds.size !== ex.options.length) {
        exerciseErrors.push({ file: rel, exerciseId: ex.id, error: 'Duplicate option IDs within exercise' });
      }

      if (ex.answerKey && ex.answerKey.correctOptionIds) {
        for (const cid of ex.answerKey.correctOptionIds) {
          if (!optIds.has(cid)) {
            exerciseErrors.push({ file: rel, exerciseId: ex.id, error: `correctOptionId '${cid}' not found in options` });
          }
        }
      }

      const correctOpts = ex.options.filter(o => o.isCorrect);
      if (ex.mode !== 'participation' && (!ex.scoring || ex.scoring.mode !== 'participation')) {
        if (correctOpts.length === 0 && (!ex.answerKey || !ex.answerKey.correctOptionIds || ex.answerKey.correctOptionIds.length === 0)) {
          exerciseErrors.push({ file: rel, exerciseId: ex.id, error: 'Exercise has options but NO correct option designated!' });
        }
      }
    }

    if (ex.type === 'word_order' || ex.type === 'dialogue_order') {
      const items = ex.items || [];
      const itemTexts = items.map(i => i.text.trim());
      const ak = ex.answerKey;
      if (ak && ak.order) {
        const isIds = ak.order.every(o => items.some(i => i.id === o));
        const isTexts = ak.order.every(o => itemTexts.includes(o.trim()));
        if (!isIds && !isTexts) {
          exerciseErrors.push({ file: rel, exerciseId: ex.id, error: `order [${ak.order.join(', ')}] cannot be satisfied by items` });
        }
      }
    }

    // Check placeholder in Arabic fields only (avoid false positive on Spanish "todo")
    const arabicText = `${ex.stemAr || ''} ${ex.instructionAr || ''} ${ex.explanationAr || ''}`;
    if (/lorem ipsum|\bTODO\s*:|\bFIXME\b|asdf|تجريبي مؤقت|نص وهمي/i.test(arabicText)) {
      exerciseErrors.push({ file: rel, exerciseId: ex.id, error: `Placeholder text found: ${arabicText.slice(0, 80)}` });
    }
  }
}

console.log(`Total lessons: ${totalLessons}`);
console.log(`Total exercises: ${totalExercises}`);
console.log(`Exercise errors found: ${exerciseErrors.length}`);
for (const e of exerciseErrors) {
  console.log(`❌ [${e.file}#${e.exerciseId}]: ${e.error}`);
}
