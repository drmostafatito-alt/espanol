import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function getAllJsonFiles(dir) {
  let results = [];
  try {
    const list = readdirSync(dir);
    for (const file of list) {
      const full = join(dir, file);
      const stat = statSync(full);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllJsonFiles(full));
      } else if (file.endsWith('.json')) {
        results.push(full);
      }
    }
  } catch {}
  return results;
}

function inspectAll() {
  const lessonFiles = [
    ...getAllJsonFiles('content/exemplars'),
    ...getAllJsonFiles('content/drafts')
  ].filter(f => !f.includes('paths.json') && !f.includes('vocab-'));

  const vocabFiles = getAllJsonFiles('content').filter(f => f.includes('vocab-'));

  let audioKeys = new Set();
  let scenarioLines = 0;
  let exercisesWithAudio = 0;
  let exercisesWithStemEs = 0;

  for (const f of lessonFiles) {
    try {
      const data = JSON.parse(readFileSync(f, 'utf8'));
      const exercises = data.lesson?.exercises || data.exercises || [];
      for (const ex of exercises) {
        if (ex.audioKey) audioKeys.add(ex.audioKey);
        if (ex.speechEs || ex.audioKey) exercisesWithAudio++;
        if (ex.stemEs) exercisesWithStemEs++;
      }
      const scenarios = data.lesson?.scenarios || [];
      for (const sc of scenarios) {
        for (const line of sc.lines || []) {
          scenarioLines++;
          if (line.audioKey) audioKeys.add(line.audioKey);
        }
      }
    } catch {}
  }

  let totalVocabEntries = 0;
  for (const f of vocabFiles) {
    try {
      const data = JSON.parse(readFileSync(f, 'utf8'));
      const entries = data.entries || [];
      totalVocabEntries += entries.length;
    } catch {}
  }

  console.log(`=== Audio Inventory Across Full Curriculum ===`);
  console.log(`Total lesson files inspected: ${lessonFiles.length}`);
  console.log(`Distinct audioKeys present: ${audioKeys.size}`);
  console.log(`Dialogue scenario lines: ${scenarioLines}`);
  console.log(`Exercises with explicit audio/speechEs: ${exercisesWithAudio}`);
  console.log(`Exercises with stemEs: ${exercisesWithStemEs}`);
  console.log(`Total vocabulary pack entries: ${totalVocabEntries}`);
}

inspectAll();
