import { DatabaseSync } from 'node:sqlite';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const sqliteDir = join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
const f = readdirSync(sqliteDir).find(x => x.endsWith('.sqlite'));
const db = new DatabaseSync(join(sqliteDir, f));

console.log('=== 1. TABLE COUNTS ===');
const tables = [
  'programs', 'units', 'lessons', 'lesson_versions', 'exercises',
  'exercise_options', 'exercise_items', 'vocabulary_entries', 'vocabulary_senses',
  'vocabulary_bundles', 'vocabulary_tags', 'vocabulary_tag_links', 'lesson_vocabulary'
];
for (const t of tables) {
  const r = db.prepare(`SELECT COUNT(1) as n FROM ${t}`).get();
  console.log(`${t.padEnd(25)}: ${r.n}`);
}

console.log('\n=== 2. STATUS AUDIT ===');
const lessonStatuses = db.prepare('SELECT status, COUNT(1) as n FROM lessons GROUP BY status').all();
console.log('Lesson statuses:', lessonStatuses);
const nonDraftLessons = db.prepare("SELECT COUNT(1) as n FROM lessons WHERE status != 'draft'").get();
console.log('Non-draft lessons count:', nonDraftLessons.n);

const versionStatuses = db.prepare('SELECT status, review_state, COUNT(1) as n FROM lesson_versions GROUP BY status, review_state').all();
console.log('Lesson version statuses & review states:', versionStatuses);

const vocabStatuses = db.prepare('SELECT status, COUNT(1) as n FROM vocabulary_entries GROUP BY status').all();
console.log('Vocab statuses:', vocabStatuses);

console.log('\n=== 3. ORPHAN RECORD AUDIT ===');
const orphanChecks = [
  { desc: 'Units with missing program', sql: 'SELECT COUNT(1) as n FROM units WHERE program_id NOT IN (SELECT id FROM programs)' },
  { desc: 'Lessons with missing unit', sql: 'SELECT COUNT(1) as n FROM lessons WHERE unit_id NOT IN (SELECT id FROM units)' },
  { desc: 'Lessons with missing current_version_id', sql: 'SELECT COUNT(1) as n FROM lessons WHERE current_version_id IS NULL OR current_version_id NOT IN (SELECT id FROM lesson_versions)' },
  { desc: 'Exercises with missing lesson_version_id', sql: 'SELECT COUNT(1) as n FROM exercises WHERE lesson_version_id NOT IN (SELECT id FROM lesson_versions)' },
  { desc: 'Exercise options with missing exercise_id', sql: 'SELECT COUNT(1) as n FROM exercise_options WHERE exercise_id NOT IN (SELECT id FROM exercises)' },
  { desc: 'Exercise items with missing exercise_id', sql: 'SELECT COUNT(1) as n FROM exercise_items WHERE exercise_id NOT IN (SELECT id FROM exercises)' },
  { desc: 'Lesson vocab links with missing lesson', sql: 'SELECT COUNT(1) as n FROM lesson_vocabulary WHERE lesson_id NOT IN (SELECT id FROM lessons)' },
  { desc: 'Lesson vocab links with missing entry', sql: 'SELECT COUNT(1) as n FROM lesson_vocabulary WHERE entry_id NOT IN (SELECT id FROM vocabulary_entries)' },
  { desc: 'Vocab senses with missing entry', sql: 'SELECT COUNT(1) as n FROM vocabulary_senses WHERE entry_id NOT IN (SELECT id FROM vocabulary_entries)' },
  { desc: 'Vocab bundle links with missing entry', sql: 'SELECT COUNT(1) as n FROM vocabulary_bundle_entries WHERE entry_id NOT IN (SELECT id FROM vocabulary_entries)' },
];

for (const c of orphanChecks) {
  const r = db.prepare(c.sql).get();
  console.log(`${c.desc.padEnd(45)}: ${r.n === 0 ? '0 (Clean ✅)' : r.n + ' (FAIL ❌)'}`);
}

console.log('\n=== 4. DUPLICATE AUDIT ===');
const dupLessons = db.prepare('SELECT slug, COUNT(1) as n FROM lessons GROUP BY slug HAVING n > 1').all();
console.log('Duplicate lesson slugs:', dupLessons.length);
const dupUnits = db.prepare('SELECT slug, COUNT(1) as n FROM units GROUP BY slug HAVING n > 1').all();
console.log('Duplicate unit slugs:', dupUnits.length);
const dupVocab = db.prepare('SELECT headword_normalized, COUNT(1) as n FROM vocabulary_entries GROUP BY headword_normalized HAVING n > 1').all();
console.log('Duplicate vocab normalized entries:', dupVocab.length);

console.log('\n=== 5. SAMPLES FROM ALL LEVELS ===');
const sampleSlugs = [
  'prea1-hola-me-llamo',
  'a1-un-cafe-por-favor',
  'a1-colores-ropa',
  'a2-indefinido-regular',
  'b1-expresar-opinion-creo-que',
  'b2-condicional-imperfecto-subjuntivo',
  'c1-precision-estilistica',
  'tr-u1-checkin',
  'cc-u1-opening'
];

for (const slug of sampleSlugs) {
  const row = db.prepare('SELECT l.slug, l.title_ar, l.level_code, l.status, lv.version_no, lv.review_state, LENGTH(lv.content_json) as json_len FROM lessons l JOIN lesson_versions lv ON lv.id = l.current_version_id WHERE l.slug = ?').get(slug);
  if (row) {
    console.log(`✅ ${row.level_code.padEnd(5)} | ${row.slug.padEnd(36)} | ${row.title_ar} | v${row.version_no} (${row.status}/${row.review_state}) | JSON: ${row.json_len}b`);
  } else {
    console.log(`❌ Missing sample: ${slug}`);
  }
}

db.close();
