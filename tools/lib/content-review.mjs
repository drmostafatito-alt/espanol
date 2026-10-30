/**
 * منطق سير عمل مراجعة المحتوى — دوال خالصة قابلة للاختبار.
 *
 * الفكرة: المراجعة اللغوية (إسباني/عربي) لا يمكن أتمتتها، لكن يمكن جعلها
 * **قابلة للتتبع والتكرار**: نُسجّل كل دفعة مراجَعة ونطاقها، وكل ملاحظة
 * بمعرّف ثابت ونوع ودرجة ثقة، ثم نشتق التغطية من السجل نفسه.
 *
 * مبادئ التصميم:
 *  1. السجل (ledger) هو المصدر الوحيد للحقيقة — لا حالة منفصلة تتفرّع عنه.
 *  2. إعادة التشغيل لا تُكرّر السجلات ولا تُعدّل نصًا صُحِّح سابقًا (idempotent).
 *  3. كل تصحيح يحمل before/after؛ التطبيق يرفض التصحيح إن لم يطابق before.
 *  4. المراجعة الآلية تُنتج «مرشّحين» فقط، والقرار النهائي مسجّل يدويًا.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename, relative, dirname } from 'node:path';

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..', '..');

export const REVIEW_CATEGORIES = [
  'spanish-spelling',
  'spanish-grammar',
  'arabic-translation',
  'arabic-wording',
  'answer-key',
  'distractor',
  'level-fit',
  'dialogue-consistency',
  'terminology',
  'pronunciation-hint',
  'vocab-example',
  'review-tooling',
];

export const SEVERITIES = ['low', 'medium', 'high'];
export const CONFIDENCES = ['low', 'medium', 'high'];
export const STATUSES = ['corrected', 'flagged', 'accepted', 'deferred'];

/** مسار أي ملف تحت content، بصيغة موحّدة للمخرجات */
const rel = (root, file) => relative(root, file).split('\\').join('/');

function walkJson(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkJson(full));
    else if (entry.endsWith('.json')) out.push(full);
  }
  return out;
}

/**
 * فهرس كل ما يمكن مراجعته: دروس، تمارين، مداخل مفردات، معاني.
 * كل عنصر يحمل معرّفًا ثابتًا لا يتغيّر بإعادة الترتيب أو إعادة الاستيراد.
 */
export function loadInventory(root) {
  const contentDir = join(root, 'content', 'drafts');
  const files = walkJson(contentDir);
  const lessons = [];
  const exercises = [];
  const vocab = [];
  const senses = [];

  for (const file of files.sort()) {
    const name = basename(file);
    const doc = JSON.parse(readFileSync(file, 'utf8'));
    const source = rel(root, file);
    if (name.startsWith('lesson-')) {
      const lesson = doc.lesson ?? doc;
      const slug = lesson.slug;
      const level = lesson.level ?? null;
      const program = lesson.programSlug ?? null;
      const lessonPtr = doc.lesson ? ['lesson'] : [];
      lessons.push({ id: `lesson:${slug}`, slug, level, program, file: source, doc, ptr: lessonPtr });
      (lesson.exercises ?? []).forEach((ex, index) => {
        exercises.push({
          id: `exercise:${slug}#${ex.id}`,
          slug,
          exerciseId: ex.id,
          index,
          type: ex.type ?? null,
          level,
          program,
          file: source,
          doc,
          ptr: [...lessonPtr, 'exercises', index],
          ex,
        });
      });
    } else if (name.startsWith('vocab-')) {
      const bundle = doc.bundleSlug;
      (doc.entries ?? []).forEach((entry, index) => {
        const key = entry.normalized || entry.headword;
        vocab.push({
          id: `vocab:${bundle}#${key}`,
          bundle,
          key,
          index,
          level: entry.level ?? null,
          file: source,
          doc,
          ptr: ['entries', index],
          entry,
        });
        (entry.senses ?? []).forEach((sense, si) => {
          senses.push({
            id: `sense:${bundle}#${key}#${sense.senseNo ?? si + 1}`,
            bundle,
            key,
            index,
            senseIndex: si,
            level: entry.level ?? null,
            file: source,
            doc,
            ptr: ['entries', index, 'senses', si],
            sense,
            entry,
          });
        });
      });
    }
  }

  return { lessons, exercises, vocab, senses };
}

/** يوسّع نطاقًا نصيًا إلى مجموعة معرّفات عناصر */
export function expandScope(scope, inv) {
  const ids = new Set();
  const push = items => items.forEach(i => ids.add(i.id));
  const [kind, value] = scope.split(':');

  if (scope === 'all') {
    push(inv.lessons);
    push(inv.vocab);
    return ids;
  }
  // نطاق الدروس فقط لمستوى معيّن — ضروري كي لا تُحتسب مفردات المستوى نفسها
  // مراجَعة لمجرد قراءة دروسه (تغطية صادقة تفصل الدروس عن المفردات).
  if (kind === 'lesson-level') {
    push(inv.lessons.filter(i => (i.level ?? '').toUpperCase() === value.toUpperCase()));
    return ids;
  }
  if (kind === 'vocab-level') {
    push(inv.vocab.filter(i => (i.level ?? '').toUpperCase() === value.toUpperCase()));
    return ids;
  }
  if (kind === 'level') {
    for (const group of [inv.lessons, inv.vocab]) {
      push(group.filter(i => (i.level ?? '').toUpperCase() === value.toUpperCase()));
    }
    return ids;
  }
  if (kind === 'program') {
    push(inv.lessons.filter(i => i.program === value));
    return ids;
  }
  if (kind === 'lesson') {
    for (const slug of value.split(',')) push(inv.lessons.filter(i => i.slug === slug));
    return ids;
  }
  // نطاق قائمة انتظار محفوظة: content/review/queues/<name>.json
  // يجعل الدفعات الصغيرة قابلة للاستئناف والتدقيق دون تضخيم تغطية مستوى كامل.
  if (kind === 'vocab-queue') {
    const file = join(ROOT, 'content/review/queues', `${value}.json`);
    if (!existsSync(file)) throw new Error(`قائمة انتظار غير موجودة: ${value}`);
    const doc = JSON.parse(readFileSync(file, 'utf8'));
    const ids = new Set(doc.ids ?? []);
    push(inv.vocab.filter(i => ids.has(i.id)));
    return ids;
  }
  if (kind === 'bundle') {
    for (const bundle of value.split(',')) push(inv.vocab.filter(i => i.bundle === bundle));
    return ids;
  }
  throw new Error(`نطاق غير معروف: ${scope}`);
}

/** معرّفات التمارين التابعة لدروس محدّدة (تغطية على مستوى التمرين) */
export function exercisesOf(lessonIds, inv) {
  const slugs = new Set([...lessonIds].map(id => id.replace(/^lesson:/, '')));
  return inv.exercises.filter(ex => slugs.has(ex.slug)).map(ex => ex.id);
}

/** معاني المفردات التابعة لمداخل محدّدة */
export function sensesOf(vocabIds, inv) {
  const keys = new Set([...vocabIds]);
  return inv.senses.filter(s => keys.has(`vocab:${s.bundle}#${s.key}`)).map(s => s.id);
}

function emptyCounts() {
  return { total: 0, reviewed: 0, corrected: 0, flagged: 0, skipped: 0, remaining: 0, accepted: 0 };
}

/** يحسب التغطية من السجل: لا حالة محفوظة تتفرّع عن المصدر */
export function computeCoverage(inv, ledger) {
  const reviewedLessons = new Set();
  const reviewedVocab = new Set();
  const skipped = new Set();

  for (const batch of ledger.batches ?? []) {
    for (const scope of batch.scopes ?? []) {
      const ids = expandScope(scope, inv);
      if (batch.status === 'skipped') ids.forEach(id => skipped.add(id));
      else ids.forEach(id => (id.startsWith('vocab:') ? reviewedVocab : reviewedLessons).add(id));
    }
  }

  const corrected = new Set();
  const flagged = new Set();
  const accepted = new Set();
  for (const f of ledger.findings ?? []) {
    const bucket = f.status === 'corrected' ? corrected : f.status === 'flagged' ? flagged : f.status === 'accepted' ? accepted : null;
    if (bucket) bucket.add(f.itemId);
  }

  const build = (items, kind) => {
    const counts = emptyCounts();
    counts.total = items.length;
    for (const item of items) {
      if (skipped.has(item.id)) counts.skipped += 1;
      else if (reviewedLessons.has(item.id) || reviewedVocab.has(item.id)) counts.reviewed += 1;
      else counts.remaining += 1;
    }
    // الملاحظات تُحتسب على كل العناصر لا على المراجَع فقط: الملاحظة دليل على
    // العنصر حتى لو جاءت من عيّنة قراءة خارج نطاق دفعة (مثل فحص الأمثلة القالبية).
    counts.corrected = items.filter(i => corrected.has(i.id)).length;
    counts.flagged = items.filter(i => flagged.has(i.id)).length;
    counts.accepted = items.filter(i => accepted.has(i.id)).length;
    counts.kind = kind;
    return counts;
  };

  const lessonCore = build(inv.lessons, 'lesson');
  const vocabCore = build(inv.vocab, 'vocab');

  // التمارين والمعاني تُغطّى ضمنًا عندما يُراجَع الدرس/المدخل الذي تنتمي إليه
  const reviewedExerciseIds = new Set(exercisesOf(reviewedLessons, inv));
  const reviewedSenseIds = new Set(sensesOf(reviewedVocab, inv));
  const exercise = emptyCounts();
  exercise.total = inv.exercises.length;
  exercise.reviewed = inv.exercises.filter(e => reviewedExerciseIds.has(e.id)).length;
  exercise.remaining = exercise.total - exercise.reviewed;
  exercise.corrected = inv.exercises.filter(e => corrected.has(e.id)).length;
  exercise.flagged = inv.exercises.filter(e => flagged.has(e.id)).length;
  exercise.kind = 'exercise';

  const sense = emptyCounts();
  sense.total = inv.senses.length;
  sense.reviewed = inv.senses.filter(s => reviewedSenseIds.has(s.id)).length;
  sense.remaining = sense.total - sense.reviewed;
  sense.corrected = inv.senses.filter(s => corrected.has(s.id)).length;
  sense.flagged = inv.senses.filter(s => flagged.has(s.id)).length;
  sense.kind = 'sense';

  const byLevel = {};
  for (const item of [...inv.lessons, ...inv.vocab]) {
    const level = (item.level ?? 'UNKNOWN').toUpperCase();
    byLevel[level] = byLevel[level] ?? { lessons: [0, 0], vocab: [0, 0] };
    const slot = item.id.startsWith('vocab:') ? byLevel[level].vocab : byLevel[level].lessons;
    slot[0] += 1;
    if (reviewedLessons.has(item.id) || reviewedVocab.has(item.id)) slot[1] += 1;
  }

  return { lesson: lessonCore, vocab: vocabCore, exercise, sense, byLevel };
}

/** يجد عنصرًا بالمعرّف ويحضر الكائن الذي تُطبَّق عليه المسارات */
/** يعيد الكائن الهدف داخل مستند مُعاد تحليله (لا داخل نسخة التحميل القديمة) */
export function locateTarget(item, doc) {
  let node = doc;
  for (const key of item.ptr ?? []) node = node?.[key];
  return node;
}

export function resolveItem(itemId, inv) {
  if (itemId.startsWith('lesson:')) {
    const slug = itemId.slice('lesson:'.length);
    const item = inv.lessons.find(i => i.slug === slug);
    return item ? { item, target: locateTarget(item, item.doc) } : null;
  }
  if (itemId.startsWith('exercise:')) {
    const [slug, exId] = itemId.slice('exercise:'.length).split('#');
    const item = inv.exercises.find(i => i.slug === slug && i.exerciseId === exId);
    return item ? { item, target: locateTarget(item, item.doc) } : null;
  }
  if (itemId.startsWith('vocab:')) {
    const [bundle, key] = itemId.slice('vocab:'.length).split('#');
    const item = inv.vocab.find(i => i.bundle === bundle && i.key === key);
    return item ? { item, target: locateTarget(item, item.doc) } : null;
  }
  if (itemId.startsWith('sense:')) {
    const [bundle, key, senseNo] = itemId.slice('sense:'.length).split('#');
    const item = inv.senses.find(
      i => i.bundle === bundle && i.key === key && String(i.sense.senseNo ?? i.senseIndex + 1) === String(senseNo),
    );
    return item ? { item, target: locateTarget(item, item.doc) } : null;
  }
  return null;
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function readPath(target, path) {
  let node = target;
  for (const step of path) {
    if (node == null) return undefined;
    node = node[step];
  }
  return node;
}

function parentOf(target, path) {
  let node = target;
  for (let i = 0; i < path.length - 1; i += 1) {
    node = node[path[i]];
    if (node == null) throw new Error(`مسار غير موجود: ${path.join('.')}`);
  }
  return node;
}

/** يطبّق قيمة (أو يحذف) على مسار حقل؛ يُنشئ المفتاح الأخير إن كان جديدًا */
function writePath(target, path, value, op = 'set') {
  const parent = parentOf(target, path);
  const key = path[path.length - 1];
  if (op === 'delete') {
    if (Array.isArray(parent)) parent.splice(Number(key), 1);
    else delete parent[key];
    return;
  }
  parent[key] = value;
}

/** يتحقق من بنية السجل ومراجع العناصر — أساس منع السجلات المشوّهة */
export function validateLedger(ledger, inv) {
  const errors = [];
  const warnings = [];
  if (ledger.version !== 1) errors.push('ledger.version يجب أن يكون 1');
  if (!Array.isArray(ledger.batches)) errors.push('ledger.batches مفقود');
  if (!Array.isArray(ledger.findings)) errors.push('ledger.findings مفقود');

  const batchIds = new Set();
  for (const batch of ledger.batches ?? []) {
    if (!batch.id) errors.push('دفعة بلا معرّف');
    else if (batchIds.has(batch.id)) errors.push(`دفعة مكرّرة: ${batch.id}`);
    batchIds.add(batch.id);
    if (!['reviewed', 'skipped'].includes(batch.status)) errors.push(`حالة دفعة غير معروفة في ${batch.id}: ${batch.status}`);
    if (!Array.isArray(batch.scopes) || batch.scopes.length === 0) errors.push(`دفعة بلا نطاق: ${batch.id}`);
    for (const scope of batch.scopes ?? []) {
      try {
        const ids = expandScope(scope, inv);
        if (ids.size === 0) warnings.push(`نطاق فارغ في ${batch.id}: ${scope}`);
      } catch (err) {
        errors.push(`${batch.id}: ${err.message}`);
      }
    }
  }

  const findingIds = new Set();
  for (const f of ledger.findings ?? []) {
    if (!f.id) errors.push('ملاحظة بلا معرّف');
    else if (findingIds.has(f.id)) errors.push(`ملاحظة مكرّرة: ${f.id}`);
    findingIds.add(f.id);
    if (!REVIEW_CATEGORIES.includes(f.category)) errors.push(`${f.id}: تصنيف غير معروف (${f.category})`);
    if (!SEVERITIES.includes(f.severity)) errors.push(`${f.id}: درجة خطورة غير معروفة (${f.severity})`);
    if (!CONFIDENCES.includes(f.confidence)) errors.push(`${f.id}: درجة ثقة غير معروفة (${f.confidence})`);
    if (!STATUSES.includes(f.status)) errors.push(`${f.id}: حالة غير معروفة (${f.status})`);
    if (!f.itemId) errors.push(`${f.id}: بلا عنصر مرجعي`);
    if (!f.explanation) errors.push(`${f.id}: بلا شرح`);
    const resolved = f.itemId ? resolveItem(f.itemId, inv) : null;
    if (f.itemId && !resolved) errors.push(`${f.id}: العنصر ${f.itemId} غير موجود`);
    // «مغلقة بملاحظات أخرى»: سجل تاريخي أُعيد تأليفه في ملاحظات مفصّلة (resolvedBy)
    // فلا يُطلب لها path/before/after ولا تدخل خطة التطبيق.
    if (f.resolvedBy) {
      if (f.status !== 'corrected') errors.push(`${f.id}: resolvedBy لا يصحّ إلا مع status=corrected`);
    } else if (f.status === 'corrected') {
      // before محذوف = مفتاح جديد لم يكن موجودًا؛ after إلزامي ما لم يكن حذفًا
      if (f.op !== 'delete' && f.after === undefined) errors.push(`${f.id}: التصحيح يحتاج after`);
      if (f.op !== 'delete' && same(f.before, f.after)) errors.push(`${f.id}: before و after متطابقان`);
      if (!Array.isArray(f.path) || f.path.length === 0) errors.push(`${f.id}: التصحيح يحتاج مسار حقل`); 
      if (resolved && Array.isArray(f.path)) {
        const current = readPath(resolved.target, f.path);
        if (f.op === 'delete') {
          // الحقل غير موجود = الحذف مُطبَّق سابقًا (سجل قابل لإعادة التشغيل)
        } else {
          // before غير معرّف يعني «المفتاح غير موجود أصلًا»
          const unchanged = f.before === undefined ? current === undefined : same(current, f.before);
          if (!unchanged && !same(current, f.after)) {
            errors.push(`${f.id}: المحتوى الحالي لا يطابق before ولا after (تغيّر خارج السجل)`);
          }
        }
      }
    }
  }
  return { errors, warnings };
}

/**
 * يخطط التصحيحات: ما سيُطبَّق، ما طُبِّق سابقًا، وما تعطّل (before غير مطابق).
 * لا يكتب شيئًا — التطبيق منفصل حتى يمكن تشغيله كـ dry-run.
 */
export function planCorrections(ledger, inv) {
  const toApply = [];
  const alreadyApplied = [];
  const stale = [];

  for (const f of ledger.findings ?? []) {
    if (f.status !== 'corrected' || f.resolvedBy) continue;
    const resolved = resolveItem(f.itemId, inv);
    if (!resolved) {
      stale.push({ finding: f, reason: 'العنصر غير موجود' });
      continue;
    }
    const current = readPath(resolved.target, f.path);
    if (f.op === 'delete') {
      if (current === undefined) alreadyApplied.push(f);
      else toApply.push({ finding: f, ...resolved });
      continue;
    }
    if (same(current, f.after)) {
      alreadyApplied.push(f);
      continue;
    }
    const unchanged = f.before === undefined ? current === undefined : same(current, f.before);
    if (unchanged) toApply.push({ finding: f, ...resolved });
    else stale.push({ finding: f, reason: `القيمة الحالية مختلفة: ${String(current).slice(0, 60)}` });
  }
  return { toApply, alreadyApplied, stale };
}

/** يطبّق خطة التصحيحات على ملفات المصدر ويحفظها مع أقل قدر من التغيير */
export function applyPlan(plan, root, { write = true } = {}) {
  const byFile = new Map();
  for (const entry of plan.toApply) {
    const file = join(root, entry.item.file);
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file).push(entry);
  }
  const results = [];
  for (const [file, entries] of byFile) {
    const raw = readFileSync(file, 'utf8');
    const trailingNewline = raw.endsWith('\n');
    const doc = JSON.parse(raw);
    // نُبقي إزاحة الملف الأصلية كما هي حتى لا يتحول التصحيح إلى ضجيج diff
    const indentMatch = raw.match(/\n( +)"/);
    const indent = indentMatch ? indentMatch[1] : 2;
    for (const { finding, item } of entries) {
      const target = locateTarget(item, doc);
      if (target == null) throw new Error(`تعذّر إيجاد الهدف ${finding.itemId} داخل ${rel(root, file)}`);
      writePath(target, finding.path, finding.after, finding.op === 'delete' ? 'delete' : 'set');
      results.push({ id: finding.id, file: rel(root, file), path: finding.path.join('.') });
    }
    if (write) {
      const next = JSON.stringify(doc, null, indent) + (trailingNewline ? '\n' : '');
      if (next !== raw) writeFileSync(file, next);
    }
  }
  return results;
}

/* ------------------------------------------------------------------ */
/* فحوص آلية تُنتج «مرشّحين» لمراجعة بشرية — لا تُعدّل شيئًا بنفسها    */
/* ------------------------------------------------------------------ */

const AR_DUPLICATE_OK = new Set([
  'خطوة خطوة',
  'حرفًا حرفًا',
  'حرف حرف',
  'كلمة كلمة',
  'مقطع مقطع',
  'مقطعًا مقطعًا',
  'حتة حتة',
  'تمام تمام',
  'حسنًا حسنًا',
  'شيئًا فشيئًا',
  'يوم يوم',
  'باب باب',
]);

/** أدوات وحروف مغلقة: تكرارها خطأ نسخ، بخلاف التكرار البلاغي للأسماء والأحوال. */
const AR_FUNCTION_WORDS = new Set([
  'في','من','على','إلى','عن','أن','إن','لا','ما','لم','لن','قد','كان','هذا','هذه','ذلك','تلك',
  'التي','الذي','ثم','أو','ثم','مع','كل','بعض','غير','بعد','قبل','حتى','كما','بل','لكن','هو','هي',
]);

const MASCULINE_A = new Set([
  'gorila','koala','puma','tranvía','sofisma','aneurisma','coma','diafragma','eccema','edema',
  'electrocardiograma','enfisema','eritema','hematoma','sida','albacea','champaña',
  'defensa','telesilla','crucigrama','socorrista','electricista','fuera',
  'día','mapa','problema','sistema','clima','idioma','tema','programa','planeta','poema','drama','cometa',
  'pijama','sofá','esquí','menú','taxi','coche','dilema','fantasma','axioma','paradigma','cromosoma','diagrama',
  'ecosistema','genoma','holograma','plasma','prisma','síntoma','diploma','pentagrama','mediodía','panorama',
  'organigrama','centinela','guía','nómada','oboísta','organista','paracaidista','pediatra','percusionista',
  'saxofonista','congresista','papa','noventa','alerta','área','dínamo','soprano','mañana',
]);
const FEMININE_O = new Set(['mano','foto','moto','radio','soprano','dínamo','cuatrimoto','reductio']);

/**
 * أمثلة قالبية: تُكتشف بالهيكل (نص المثال بعد إحلال المدخل مكانه)، لا بقائمة
 * يدوية. العتبة تمنع التنبيه على جملة عرضية واحدة تشبه القالب.
 * لا تُستخدم هذه القائمة للاستبدال الآلي أبدًا — إعادة الكتابة قرار تحريري.
 */
const VOCAB_TEMPLATE_MIN = 8;
const VOCAB_TEMPLATE_NOTES = {
  'esta persona es sumamente ~ en su vida cotidiana.': 'cv-adjectives-master',
  'este rasgo resulta muy ~.': 'cv-alphabet-exp-*',
  'se trata de un ~ de gran relevancia.': 'cv-topic-c1-extended',
  'la ~ es muy conocido en este ambito.': 'تعارض مطابقة الجنس: أداة مؤنثة + صفة مذكرة',
};

/** القوالب المعروفة كهيكل: النص بعد إحلال المدخل (بالعبارة الكاملة ثم بالكلمة الأولى). */
export const VOCAB_TEMPLATE_PATTERNS = [
  /^suelo ~ todos los dias con atencion\.$/,
  /^(el|la) ~ es muy importante en la vida cotidiana\.$/,
  /^(el|la) ~ es un concepto clave en este contexto\.$/,
  /^solemos ~ con (bastante|mucha) frecuencia en estas (situaciones|circunstancias)\.$/,
  /^(el|la) ~ es muy conocido en este ambito\.$/,
  /^trabajamos ~ para lograr el exito en cada tarea\.$/,
  /^(el|la) ~ es de suma importancia en el campo de la medicina\.$/,
  /^esta persona es sumamente ~ en su vida cotidiana\.$/,
  /^(el|la) ~ es un concepto clave en el desarrollo cientifico y tecnologico\.$/,
  /^(el|la) ~ es un concepto clave en el desarrollo cientifico y tecnico\.$/,
  /^(el|la) ~ enriquece el patrimonio cultural de la sociedad\.$/,
  /^solemos ~ con bastante regularidad en nuestras actividades\.$/,
  /^este rasgo resulta muy ~ en muchas situaciones reales\.$/,
  /^(el|la) ~ resulta muy comun en el entorno cotidiano\.$/,
  /^(el|la) ~ enriquece la cultura y el pensamiento humano\.$/,
  /^debemos ~ de manera responsable y atenta\.$/,
  /^se trata de un aspecto verdaderamente ~ en este contexto\.$/,
  /^solemos ~ de manera habitual en nuestro trabajo diario\.$/,
  /^(el|la) ~ es una maravilla de la naturaleza y del medio ambiente\.$/,
  /^(el|la) ~ es un concepto indispensable en el mundo de los negocios\.$/,
  /^(el|la) ~ es fundamental para organizar el viaje\.$/,
  /^(el|la) ~ es un ingrediente muy popular en la cocina\.$/,
  /^este nuevo dispositivo cuenta con un diseno ~ muy avanzado\.$/,
  /^(el|la) ~ resulta fundamental en el desarrollo informatico moderno\.$/,
  /^es preciso ~ con rigor y objetividad en todo momento\.$/,
  /^(el|la) ~ es un termino fundamental en la atencion al cliente\.$/,
  /^los ingenieros suelen ~ con gran precision en los sistemas\.$/,
  /^(el|la) ~ resulta muy practico para el hogar moderno\.$/,
  /^(el|la) ~ resulta muy popular entre los deportistas\.$/,
  /^(el|la) ~ resulta fundamental en los analisis avanzados\.$/,
  /^se trata de un ~ de gran relevancia\.$/,
  /^en este sentido, ~, conviene mantener la claridad expositiva\.$/,
];

const plainForm = value =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/** الهيكل: النص بعد إحلال المدخل مكانه، لضبط القوالب بلا حساسية للمدخل. */
export function templateSkeleton(headword, example) {
  const normalized = plainForm(example);
  const full = plainForm(headword).trim();
  const head = full.split(' ')[0];
  if (full && normalized.includes(full)) return normalized.split(full).join('~');
  return head && normalized.includes(head) ? normalized.split(head).join('~') : normalized;
}

export function isTemplateExample(headword, example) {
  const skeleton = templateSkeleton(headword, example);
  return VOCAB_TEMPLATE_PATTERNS.some(re => re.test(skeleton));
}


function eachString(node, path, out, filter) {
  if (typeof node === 'string') {
    if (!filter || filter(node)) out.push([path, node]);
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => eachString(v, [...path, i], out, filter));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) eachString(v, [...path, k], out, filter);
  }
}

const hasArabic = s => /[\u0600-\u06FF]/.test(s);

/**
 * يرصد المرشّحين ذوي القيمة العالية فقط (لغوية/اتساق)، لا يكرّر ما يفعله
 * tools/validate-content.mjs (المخططات والبنية).
 */
export function runChecks(inv) {
  const candidates = [];
  const add = (check, itemId, severity, message, extra = {}) =>
    candidates.push({ check, itemId, severity, message, ...extra });

  // 1) كلمة عربية مكرّرة فورًا (غالبًا خطأ نسخ) — مع قائمة عبارات مشروعة
  for (const item of [...inv.lessons, ...inv.exercises, ...inv.vocab]) {
    const strings = [];
    eachString(item.id.startsWith('lesson:') ? item.doc.lesson ?? item.doc : item.id.startsWith('exercise:') ? item.ex : item.entry, [], strings, hasArabic);
    for (const [path, text] of strings) {
      // حدود الكلمة العربية إلزامية، وإلا التقط «وتوقف وقفة» كتكرار
      const re = /(?<![\u0600-\u06FF])([\u0600-\u06FF]{3,})[ \u00A0]+\1(?![\u0600-\u06FF])/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (AR_DUPLICATE_OK.has(m[0])) continue;
        // التكرار البلاغي مشروع في العربية (بين بين، قليلاً قليلاً، حرفاً حرفاً).
        // لا ننبّه إلا على تكرار أداة/حرف مغلق، حيث يكون خطأ نسخ شبه مؤكد.
        if (!AR_FUNCTION_WORDS.has(m[1])) continue;
        add('ar.repeated-word', item.id, 'low', `أداة مكرّرة: «${m[0]}»`, { path, text: text.slice(0, 120) });
      }
    }
  }

  // 1b) مفتاح الإجابة مكتوب داخل نصّ الخيار العربي («(الصواب)»)
  //     لا تعرضه الواجهة، لكنه في حمولة الـ API وأي تصدير ⇒ تسريب بنيوي.
  for (const item of inv.exercises) {
    const options = item.ex?.options ?? [];
    for (const opt of options) {
      if (!String(opt.textAr ?? '').includes('الصواب')) continue;
      add('answer-flag-in-option', item.id, 'high',
        `مفتاح الإجابة مكتوب داخل نص الخيار «${opt.id}»: ${String(opt.textAr).slice(0, 50)}`, { optionId: opt.id });
    }
  }

  // 2) تمارين متطابقة داخل الدرس نفسه (سؤال + خيارات + إجابة)
  for (const lesson of inv.lessons) {
    const seen = new Map();
    for (const ex of lesson.doc.lesson?.exercises ?? lesson.doc.exercises ?? []) {
      const signature = JSON.stringify({
        type: ex.type,
        stem: ex.stemEs ?? '',
        options: (ex.options ?? []).map(o => o.text),
        answer: ex.answerKey ?? null,
      });
      if (seen.has(signature)) {
        add('exercise.duplicate', `exercise:${lesson.slug}#${ex.id}`, 'medium',
          `تمرين مكرّر عن «${seen.get(signature)}» بنفس السؤال والخيارات والإجابة`);
      } else {
        seen.set(signature, ex.id);
      }
    }
  }

  // 3) جنس الاسم مع نهايته (مرشّح فقط — كثير من الأسماء اليونانية شاذة)
  for (const item of inv.vocab) {
    const entry = item.entry;
    if (entry.pos !== 'noun' || !entry.gender || entry.gender === 'mf') continue;
    // أسماء -ista مشتركة بين الجنسين (el/la electricista) فلا تصلح للمقارنة بالنهاية
    if (String(entry.headword).toLowerCase().split(' ')[0].endsWith('ista')) continue;
    const head = String(entry.headword).toLowerCase().split(' ')[0];
    if (entry.gender === 'm' && head.endsWith('a') && !MASCULINE_A.has(head)) {
      add('vocab.gender', item.id, 'medium', `اسم مذكّر ينتهي بـ a — تحقق من الجنس: ${entry.headword}`);
    }
    if (entry.gender === 'f' && head.endsWith('o') && !FEMININE_O.has(head)) {
      add('vocab.gender', item.id, 'medium', `اسم مؤنّث ينتهي بـ o — تحقق من الجنس: ${entry.headword}`);
    }
  }

  // 4) مدخلان مختلفان بنفس الترجمة العربية في الحزمة نفسها (قد تكون ترجمة مبسّطة)
  for (const bundle of new Set(inv.vocab.map(v => v.bundle))) {
    const byGloss = new Map();
    for (const item of inv.vocab.filter(v => v.bundle === bundle)) {
      const gloss = (item.entry.senses?.[0]?.meaningArFusha ?? '').trim();
      if (!gloss) continue;
      if (!byGloss.has(gloss)) byGloss.set(gloss, []);
      byGloss.get(gloss).push(item);
    }
    for (const [gloss, items] of byGloss) {
      if (items.length < 2) continue;
      add('vocab.shared-gloss', items[1].id, 'low',
        `نفس الترجمة «${gloss}» لمدخلين: ${items.map(i => i.entry.headword).join(' / ')}`);
    }
  }

  // 5) مثال مشترك بين مدخلين لا يخدم أحدهما
  //    (فحص «المثال لا يضم المدخل» ساذج مع الأفعال: Quiero/querer، cierra/cerrar
  //     تُنتج 144 إنذارًا كاذبًا. الفحص الدقيق هو الاشتراك نفسه + غياب جذر المدخل.)
  {
    const normalize = value =>
      String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    const byExample = new Map();
    for (const item of inv.vocab) {
      const example = String(item.entry.senses?.[0]?.exampleEs ?? '').trim();
      if (!example) continue;
      if (!byExample.has(example)) byExample.set(example, []);
      byExample.get(example).push(item);
    }
    for (const [example, items] of byExample) {
      if (items.length < 2) continue;
      const normalized = normalize(example);
      const orphans = items.filter(item => {
        const head = normalize(item.entry.headword).split(' ')[0];
        return head.length >= 3 && !normalized.includes(head.slice(0, 3));
      });
      for (const orphan of orphans) {
        add('vocab.shared-example', orphan.id, 'medium',
          `مثال مشترك مع ${items.length - 1} مدخل آخر ولا يضم جذر مدخله: ${example.slice(0, 70)}`, {
            others: items.filter(i => i !== orphan).map(i => i.entry.headword).slice(0, 3),
            example,
          });
      }
    }
  }

  // 6) أمثلة مفردات من قوالب مكرّرة — تُرصد كهيكل، ولا تُؤتمت إعادة كتابتها
  {
    const skeletons = new Map();
    for (const item of inv.vocab) {
      const example = String(item.entry.senses?.[0]?.exampleEs ?? '').trim();
      if (!example) continue;
      const skeleton = templateSkeleton(item.entry.headword, example);
      const bucket = skeletons.get(skeleton) ?? { items: [], note: VOCAB_TEMPLATE_NOTES[skeleton] ?? '' };
      bucket.items.push(item);
      skeletons.set(skeleton, bucket);
    }
    for (const [skeleton, bucket] of skeletons) {
      if (bucket.items.length < VOCAB_TEMPLATE_MIN) continue;
      add('vocab.template-example', bucket.items[0].id, 'high',
        `مثال قالبي في ${bucket.items.length} مدخلًا: «${skeleton.slice(0, 60)}»${bucket.note ? ` — ${bucket.note}` : ''} — يحتاج إعادة كتابة بشرية`, {
          count: bucket.items.length,
          sample: bucket.items.slice(0, 3).map(i => i.id),
        });
    }
  }

  // 7) لصق «الـ» التعريف بمدخل عربي داخل أمثلة/ترجمات مولّدة (أثر قالب)
  //    ملاحظة: «الـ» قبل كلمة لاتينية (الـvoseo) مشروع، لذا نفحص الحرف العربي فقط.
  {
    const glue = /الـ[\u0600-\u06FF]/;
    const perBundle = new Map();
    for (const item of inv.vocab) {
      const entry = item.entry;
      const fields = [];
      (entry.senses ?? []).forEach(sense => {
        if (sense.meaningArFusha && glue.test(sense.meaningArFusha)) fields.push('meaningArFusha');
        if (sense.exampleAr && glue.test(sense.exampleAr)) fields.push('exampleAr');
      });
      (entry.examples ?? []).forEach(ex => {
        if (ex.ar && glue.test(ex.ar)) fields.push('examples.ar');
      });
      if (!fields.length) continue;
      const bucket = perBundle.get(item.bundle) ?? { count: 0, items: [], first: item };
      bucket.count += fields.length;
      if (bucket.items.length < 3) bucket.items.push(item.id);
      perBundle.set(item.bundle, bucket);
    }
    for (const [bundle, bucket] of perBundle) {
      add('vocab.article-glue', bucket.first.id, 'high',
        `«الـ» ملتصقة بمدخل عربي في ${bucket.count} حقلًا داخل ${bundle} — أثر توليد آلي`, {
          bundle,
          count: bucket.count,
          sample: bucket.items,
        });
    }
  }

  // 8) عبارات نطق عربية مشكوك فيها (تحتاج مراجعة بشرية)
  const PHONETIC_FLAGS = [
    { re: /g[^\n]{0,25}«غ»/i, msg: 'وصف نطق g بالغين — g قبل a/o/u صوت شديد وليست غ' },
    { re: /v[^\n]{0,20}«ف»/i, msg: 'وصف v بالفاء — v تُنطق قريبة من b' },
    { re: /خاء مرققة/, msg: '«خاء مرققة»: خاء الإسبانية (j) صوت واضح لا مرقّق' },
  ];
  for (const item of [...inv.lessons, ...inv.exercises, ...inv.vocab]) {
    const strings = [];
    eachString(item.id.startsWith('lesson:') ? item.doc.lesson ?? item.doc : item.id.startsWith('exercise:') ? item.ex : item.entry, [], strings, hasArabic);
    for (const [path, text] of strings) {
      for (const flag of PHONETIC_FLAGS) {
        if (flag.re.test(text)) add('ar.phonetic', item.id, 'medium', flag.msg, { path, text: text.slice(0, 140) });
      }
    }
  }

  return candidates;
}

/** تقرير تغطية نصي قابل للطباعة */
export function formatCoverage(coverage) {
  const line = c =>
    `${c.kind.padEnd(9)} ${String(c.reviewed).padStart(5)}/${String(c.total).padEnd(5)} مراجَع · ` +
    `${String(c.corrected).padStart(3)} مُصحَّح · ${String(c.flagged).padStart(3)} مُعلَّق · ${String(c.remaining).padStart(5)} متبقٍ`;
  return [line(coverage.lesson), line(coverage.exercise), line(coverage.vocab), line(coverage.sense)].join('\n');
}
