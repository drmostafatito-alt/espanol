#!/usr/bin/env node
/**
 * إزالة علامة «(الصواب)» من نصوص خيارات التمارين.
 *
 * الخلفية: 264 خيارًا (كلها الخيار الصحيح بالضبط) تحمل في `textAr` لاحقة
 * «(الصواب)» — أثر توليد آلي يضع مفتاح الإجابة داخل نص الخيار نفسه. الواجهة
 * الحالية تعرض `text` الإسباني فقط، فالعلامة لا تظهر للمتعلم اليوم، لكنها
 * موجودة في حمولة الـ API وفي أي تصدير للمحتوى، وهدفها الوحيد كشف الإجابة.
 *
 * السكربت يحذف العلامة فقط (لا يغيّر أي كلمة عربية)، ولا يمسّ `pedagogy`
 * حيث ورد «الصواب» بمعنى تربوي مشروع («الخطأ: … والصواب: …»).
 *
 * الاستخدام:
 *   node tools/strip-option-answer-flags.mjs            # معاينة
 *   node tools/strip-option-answer-flags.mjs --apply     # كتابة
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRAFTS = join(ROOT, 'content/drafts');
const AUDIT = join(ROOT, 'reports/content-review/option-answer-flag-strip.json');
const APPLY = process.argv.includes('--apply');
// أي قوس يبدأ بـ «الصواب»: (الصواب) أو (الصواب مع tú) أو (الصواب: llevarse bien)
const MARKER = /\s*[（(]\s*الصواب[^)）]*[)）]/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/^lesson-.*\.json$/.test(name)) out.push(full);
  }
  return out;
}

const audit = existsSync(AUDIT) ? JSON.parse(readFileSync(AUDIT, 'utf8')) : { appliedAt: null, fields: [] };
const changes = [];
const touched = new Set();
const empty = [];

for (const file of walk(DRAFTS)) {
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  const lesson = doc.lesson ?? doc;
  let dirty = false;
  for (const ex of lesson.exercises ?? []) {
    for (const opt of ex.options ?? []) {
      const before = String(opt.textAr ?? '');
      if (!before.includes('الصواب')) continue;
      const after = before.replace(MARKER, '').replace(/\s{2,}/g, ' ').trim();
      if (!after) { empty.push(`${lesson.slug}#${ex.id}/${opt.id}`); continue; }
      changes.push({
        file: relative(ROOT, file).split('\\').join('/'),
        lesson: lesson.slug,
        level: lesson.level,
        exerciseId: ex.id,
        optionId: opt.id,
        isCorrect: Boolean(opt.isCorrect),
        before,
        after,
      });
      if (APPLY) { opt.textAr = after; dirty = true; }
    }
  }
  if (APPLY && dirty) {
    writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
    touched.add(file);
  }
}

if (APPLY && changes.length) {
  audit.appliedAt ??= new Date().toISOString();
  audit.fields.push(...changes.map(c => ({
    lesson: c.lesson, exerciseId: c.exerciseId, optionId: c.optionId, isCorrect: c.isCorrect,
    before: c.before, after: c.after, appliedAt: new Date().toISOString(),
  })));
  mkdirSync(dirname(AUDIT), { recursive: true });
  writeFileSync(AUDIT, JSON.stringify(audit, null, 2) + '\n');
}

const levels = {};
for (const c of changes) levels[c.level] = (levels[c.level] ?? 0) + 1;
console.log(`\n${APPLY ? '✅ أُزيلت' : '👀 معاينة'}: ${changes.length} علامة «(الصواب)» في ${new Set(changes.map(c => c.lesson)).size} درسًا · ${JSON.stringify(levels)}`);
if (empty.length) { console.log(`   ❌ خيار كان سيصبح فارغًا (لم يُلمس): ${empty.join(', ')}`); }
if (APPLY) console.log(`   حُرِّرت ${touched.size} ملفًا · الأثر: ${relative(ROOT, AUDIT)}`);
if (!APPLY) console.log('   أضف --apply للكتابة\n');
