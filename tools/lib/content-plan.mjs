/**
 * ============================================================================
 * مخطط استيراد المحتوى — مصدر واحد للحقيقة
 * ============================================================================
 * يُستخدم من:
 *   - tools/import-content.mjs   (ينفّذ SQL على D1 المحلي عبر wrangler)
 *   - tests/content-fixture.ts   (ينفّذ نفس SQL على SQLite في الذاكرة)
 * لأن النسختين تستخدمان نفس المولّد، لا يمكن أن تنحرف إحداهما عن الأخرى.
 *
 * قاعدة غير قابلة للتفاوض: لا يوجد هنا سطر يكتب 'published'.
 *
 * ملاحظة مخطط (2026-10-27): جدول `vocabulary_forms` في المخطط لا يُعبَّأ هنا
 * عمدًا — لا ميزة في المنتج تستعلمه، والتصريفات تصل للبحث عبر الفهرس الثابت
 * (tools/generate-search-index.mjs من `forms[]` في ملفات المفردات). لا تحذف
 * الجدول ولا تبنِ خط تعبئة له حتى تظهر ميزة تستعلمه فعلًا؛ حينها يُعبَّأ من
 * المصدر نفسه (ملفات المفردات) مع اختبار استعلام.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

export const EXERCISE_TYPES = new Set([
  'choose_reply', 'conjugate_in_context', 'dialogue_order', 'dictation', 'distinguish_similar',
  'fill_blank', 'find_fix_error', 'identify_speaker', 'image_choice', 'infer_meaning', 'listen_choose', 'match_pairs',
  'phone_call_response', 'preposition_choice', 'recall_previous_word', 'reconstruct_audio_sentence',
  'resolve_customer_issue', 'review_common_errors', 'roleplay_simulation', 'speak_free', 'speak_with_text',
  'summarize_dialogue', 'translate_short', 'type_missing_word', 'word_choice', 'word_order', 'write_email', 'write_sentence',
]);

/** رقم الإصدار الحالي لكل درس — يُستعلم مرة واحدة قبل توليد الخطة */
export function mergeVersionState(existing, lessonSlug, contentHash) {
  const prev = existing[lessonSlug];
  if (!prev) return 1;
  return prev.contentHash === contentHash ? prev.versionNo : prev.versionNo + 1;
}

export function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

const ENC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
/** معرّف ثابت — نفس البذرة ⇒ نفس المعرّف في كل تشغيل وفي كل بيئة */
export function stableId(prefix, seed) {
  const digest = createHash('sha256').update(seed).digest();
  let out = '';
  for (let i = 0; i < 12; i++) out += ENC[digest[i] % 32];
  return `${prefix}_${out}`;
}

/**
 * صيغ لا تُربط تلقائيًا بمدخلها الفعلي رغم وجودها في `forms[]` — لأن الدرس
 * يستخدمها بمعنى آخر (اسم/صفة/حرف)، وربطها بالفعل كان سيعلّم الكلمة الخطأ.
 * الدليل: تدقيق مراجع المفردات 2026-10-27 (جُمل مقتبسة لكل حالة في التقرير).
 * أي إضافة هنا تتطلب دليل جملة من الدرس نفسه. `visto` محجوز بانتظار تأكيد
 * بشري (participle لـver مقابل 1s لـvestir)، و`normativa`/`cabria` لقرار
 * لغوي (اسم مؤنث / صيغة بلا نبرة في المرجع).
 */
const FORM_LINK_BLOCKLIST = new Set([
  'acuerdo', 'argumento', 'como', 'para', 'asombro', 'contraste', 'debate',
  'enfoque', 'estimado', 'logro', 'sublime', 'cambio', 'comunicado',
  'estudio', 'incremento', 'mareo', 'parecido', 'pica', 'desarrollo',
  'fui', 'anhelo', 'cabria', 'normativa', 'visto',
]);

const q = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
const j = (v) => q(JSON.stringify(v ?? {}));
const n = (v) => (v === null || v === undefined || Number.isNaN(Number(v)) ? 'NULL' : String(Number(v)));

/**
 * يبني كل أوامر الاستيراد من مجلد ملفات المحتوى.
 * @returns {{ statements: string[], answers: Record<string, unknown>, counters: Record<string, number>, errors: string[] }}
 */
const walkJson = (d) => readdirSync(d, { withFileTypes: true }).flatMap(ent => {
  const full = join(d, ent.name);
  if (ent.isDirectory()) return walkJson(full);
  return ent.name.endsWith('.json') ? [full] : [];
});
const loadJson = (f) => JSON.parse(readFileSync(f, 'utf8'));
const foldAccents = (v) => String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
const stripOuterPunctuation = (v) => String(v).trim().replace(/^[¿¡"'«»]+/, '').replace(/[?!.…"'"«»]+$/, '').trim();

/**
 * فهرس حلّ الكلمات ⇒ معرّفاتها من جذور معجمية (مشترك بين بناء الخطة وجامع
 * الروابط الشامل في VER-04). المطابقة الاحتياطية بلا تشكيل عند غياب الحرفية
 * وبشرط عدم الغموض.
 */
export function buildLexiconIndex(lexRoots) {
  const vocabIdByNormalized = new Map();
  const foldedToId = new Map();
  const foldedAmbiguous = new Set();
  for (const root of lexRoots) {
    for (const f of walkJson(root).filter(x => basename(x).startsWith('vocab-'))) {
      for (const entry of loadJson(f).entries ?? []) {
        if (!entry.normalized) continue;
        vocabIdByNormalized.set(entry.normalized, stableId('voc', entry.normalized));
        const folded = foldAccents(entry.normalized);
        if (foldedAmbiguous.has(folded)) continue;
        const prev = foldedToId.get(folded);
        if (prev && prev !== entry.normalized) { foldedAmbiguous.add(folded); foldedToId.delete(folded); }
        else foldedToId.set(folded, entry.normalized);
      }
    }
  }
  const resolve = (word) => {
    const rawNorm = String(word).toLowerCase().trim();
    let id = vocabIdByNormalized.get(rawNorm);
    const norm = stripOuterPunctuation(rawNorm);
    if (!id && norm !== rawNorm) id = vocabIdByNormalized.get(norm);
    if (!id) {
      const folded = foldedToId.get(foldAccents(norm));
      if (folded) id = vocabIdByNormalized.get(folded);
    }
    return id ?? null;
  };
  return { vocabIdByNormalized, foldedToId, resolve };
}

/* -----------------------------------------------------------------------------
 * تنقية الخطة من تكرار المفتاح نفسه.
 *
 * كانت الخطة تصدر صفًّا واحدًا لكل (حزمة × وسم) حتى لو كان الوسم نفسه: 16384 أمر
 * `vocabulary_tags` لـ75 وسمًا فقط، و`programs` للسَّلّة نفسها ستّ مرات بوصف
 * مختلف لكل مستوى (آخر أمر يفوز ⇒ وصف البرنامج يعتمد على ترتيب الملفات).
 * هنا: أول ظهور يفوز، والتكرار الحرفي يُسقط بصمت، والتكرار بمحتوى مختلف يُبلَّغ
 * فيقف المحرّر على تعارض حقيقي بدل أن يُحسم عشوائيًا.
 * -------------------------------------------------------------------------- */
const INSERT_HEAD = /^\s*INSERT\s+INTO\s+(\w+)\s*\(([^)]*)\)\s*VALUES\s*\(/i;

/** يقرأ قيم الصفّ الأول (نصوص وأرقام وNULL) باحترام علامات التنصيص والفواصل داخل JSON. */
function firstRowValues(text) {
  const vals = [];
  let i = 0;
  let cur = '';
  let inStr = false;
  let depth = 0;
  for (; i < text.length; i += 1) {
    const ch = text[i];
    if (inStr) {
      if (ch === "'" && text[i + 1] === "'") { cur += "''"; i += 1; continue; }
      if (ch === "'") { inStr = false; cur += ch; continue; }
      cur += ch; continue;
    }
    if (ch === "'") { inStr = true; cur += ch; continue; }
    if (ch === '(' || ch === '[' || ch === '{') { depth += 1; cur += ch; continue; }
    if (ch === ')' || ch === ']' || ch === '}') {
      if (depth === 0) break; // نهاية الصفّ
      depth -= 1; cur += ch; continue;
    }
    if (ch === ',' && depth === 0) { vals.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) vals.push(cur.trim());
  return vals;
}

/** مفتاح الصفّ: عمود id إن وُجد، وإلا أول عمودين (جداول الربط). */
export function statementRowKey(stmt) {
  const m = INSERT_HEAD.exec(stmt);
  if (!m) return null;
  const table = m[1];
  const cols = m[2].split(',').map(c => c.trim());
  const vals = firstRowValues(stmt.slice(m[0].length));
  if (vals.length < cols.length) return null;
  const idIdx = cols.indexOf('id');
  if (idIdx >= 0) return { table, key: `${table}:${vals[idIdx]}`, id: vals[idIdx] };
  if (cols.length >= 2 && /_id$/.test(cols[0]) && /_id$/.test(cols[1])) {
    return { table, key: `${table}:${vals[0]}|${vals[1]}`, id: `${vals[0]}|${vals[1]}` };
  }
  return null;
}

const normSql = s => s.replace(/\s+/g, ' ').trim();

/**
 * يزيل الأوامر المكررة بالمفتاح نفسه. يعيد { statements, conflicts, dropped }.
 * conflicts: [{ table, key, first, later }] — تعارضات محتوى حقيقية (تبقى الأولى).
 */
export function dedupePlanStatements(statements) {
  const seen = new Map();
  const out = [];
  const conflicts = [];
  let dropped = 0;
  for (const stmt of statements) {
    const parsed = statementRowKey(stmt);
    if (!parsed) { out.push(stmt); continue; }
    const prev = seen.get(parsed.key);
    if (prev === undefined) { seen.set(parsed.key, stmt); out.push(stmt); continue; }
    dropped += 1;
    if (normSql(prev) !== normSql(stmt)) {
      conflicts.push({ table: parsed.table, key: parsed.id, first: prev, later: stmt });
    }
  }
  return { statements: out, conflicts, dropped };
}

/** عبارة إدخال رابط محروسة الوجود — نفس الشكل في الخطة والمرور النهائي */
export function linkInsertStatement({ lessonId, entryId, role }) {
  return `INSERT INTO lesson_vocabulary (lesson_id, entry_id, role)
            SELECT ${q(lessonId)}, ${q(entryId)}, ${q(role)}
            WHERE EXISTS (SELECT 1 FROM vocabulary_entries WHERE id = ${q(entryId)})
              AND EXISTS (SELECT 1 FROM lessons WHERE id = ${q(lessonId)})
            ON CONFLICT(lesson_id, entry_id) DO NOTHING`;
}

/**
 * VER-04: كل روابط درس↔مفردة القابلة للحل من جذر محتوى كامل، بلا توليد أي
 * عبارات محتوى. المستورِد ينفّذها كمرور نهائي بعد أي استدعاء، فلا يعود
 * ترتيب مجلدات الاستيراد مؤثرًا في النتيجة.
 */
export function collectGlobalLinks(contentRoot) {
  const index = buildLexiconIndex([contentRoot]);
  const links = [];
  let unresolved = 0;
  for (const f of walkJson(contentRoot).filter(x => basename(x).startsWith('lesson-'))) {
    const L = loadJson(f).lesson;
    if (!L?.slug) continue;
    const lessonId = stableId('lesson', L.slug);
    for (const [words, role] of [[L.newVocabulary, 'new'], [L.reviewVocabulary, 'review']]) {
      for (const w of words ?? []) {
        const entryId = index.resolve(w);
        if (!entryId) { unresolved++; continue; }
        links.push({ lessonId, entryId, role });
      }
    }
  }
  return { links, unresolved };
}

/**
 * `releasePolicy`: سياسة الإفراج المحسوبة آليًا (content/review/release-policy.v1.json).
 * عند تمريرها يصبح الدرس المُفرج عنه منشورًا (published/approved) ويُسجَّل له
 * سجل مراجعة آلي، وما عدا ذلك يبقى draft/unreviewed. بلا تمريرها (اختبارات
 * المجلدات المعزولة) يبقى السلوك القديم كما هو.
 */
/**
 * أرقام دروس المحتوى الحقيقي (content/drafts). تُمرَّر إلى بناء خطة مجلد
 * العيّنات (`content/exemplars`) ليتخطى كل درس مكرَّر بمعرّف موجود — بدل أن
 * يُصدر نسخة ثانية منه تتعارض مع الأصل في `objective_ar`/التمارين.
 */
export function collectLessonSlugs(rootDir) {
  const slugs = new Set();
  for (const file of walkJson(rootDir)) {
    if (!basename(file).startsWith('lesson-')) continue;
    try {
      const doc = loadJson(file);
      const slug = doc?.lesson?.slug ?? doc?.slug;
      if (slug) slugs.add(String(slug));
    } catch {
      // ملف تالف يُترك لمدقّق المحتوى، لا لهذه الدالة
    }
  }
  return slugs;
}

export function buildContentPlan(dir, { existingVersions = {}, lexiconDirs = null, skipLessonSlugs = null, releasePolicy = null } = {}) {
  // مسح متكرر: المحتوى مُنظَّم في مجلدات فرعية (a1/، travel/، …)، ودمج كل ملفات
  // paths.json يسمح لكل وحدة بإعلان مسارها دون ملف مركزي هش.
  const walk = walkJson;
  const allFiles = walk(dir);
  const pathFiles = allFiles.filter(f => basename(f) === 'paths.json');
  const vocabFiles = allFiles.filter(f => basename(f).startsWith('vocab-'));
  const lessonFiles = allFiles.filter(f => basename(f).startsWith('lesson-'));
  const load = loadJson;

  const statements = [];
  const answers = {};
  const releasedSlugs = new Set(
    Object.entries(releasePolicy?.lessons ?? {})
      .filter(([, v]) => v?.released)
      .map(([slug]) => slug),
  );
  const releaseDate = String(releasePolicy?.generatedAt ?? '').slice(0, 10) || '1970-01-01';
  const reviewRecords = [];
  const emittedTags = new Set();
  const emittedSources = new Set(); // content_sources المُصدرة في هذه الخطة // معرّف التمرين في القاعدة ⇒ الإجابة الصحيحة (للاختبارات فقط)

  /* ---------------------------------------------------------------------------
   * كلمة واحدة في حزمتين: أي ظهور يُعتمد؟
   *
   * المشكلة الفعلية: 15 كلمة أساسية (hola، café، ser، ir…) معلنة في حزمتين
   * بمستويين و«internalRank» و«pronunciationHint» مختلفين، فتخرج صفوف متعارضة
   * لنفس المفتاح: entries 15 وسنses 15 وsentences 15 وtranslations 12 وforms 12.
   * كان الحسم بترتيب الملفات (آخر ظهور يفوز) ⇒ بيانات غير حتمية ومعرّفات معانٍ
   * تتغير بتغيّر الترتيب.
   *
   * القاعدة الآن (حتمية وموثّقة): الظهور المعتمد هو **الأدنى مستوى** لأن الكلمة
   * تُعلَّم أولًا هناك (PREA1 < A1 < A2 < B1 < B2 < C1 < بلا مستوى)، ثم أبجديًا
   * باسم الحزمة، ثم بمسار الملف. الظهور الآخر يُسهم بعضويته في الحزم والوسوم
   * (جدول ربط) ولا يعيد تعريف الكلمة نفسها.
   * ------------------------------------------------------------------------- */
  const lexRoots = Array.isArray(lexiconDirs) && lexiconDirs.length ? lexiconDirs : [dir];
  const LEVEL_RANK = { PREA1: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
  const rankOf = (entry) => (entry?.level && LEVEL_RANK[entry.level] !== undefined ? LEVEL_RANK[entry.level] : 9);
  // كل ظهورات الكلمة في المعجم — لدمج الحقول التي ينقصها الظهور المعتمد
  // (ترجمة مصرية، ملاحظة استعمال) بدل إسقاطها مع الظهور الآخر.
  const occurrencesByNormalized = new Map();
  // الظهور المعتمد يُحسب من **كل** الجذور المعجمية لا من المجلد الحالي: التصدير
  // يبني الخطة مرتين (exemplars ثم drafts)، فلو حُسب لكل مجلد على حدة لاختير
  // «ser» من exemplars في المرور الأول ومن drafts في الثاني ⇒ صفّان متعارضان.
  // الآن يخرج الصفّ نفسه نصًّا في المرورين، فتُسقطه التنقية بلا تعارض ولا فقدان.
  const canonicalOwner = new Map(); // normalized ⇒ { file, idx, bundleSlug, level, entry }
  for (const root of lexRoots) {
    for (const file of walkJson(root).filter(f => basename(f).startsWith('vocab-'))) {
      const doc = loadJson(file);
      if (!doc?.bundleSlug) continue;
      for (const [idx, entry] of (doc.entries ?? []).entries()) {
        if (!entry?.normalized) continue;
        const cand = { file, idx, bundleSlug: doc.bundleSlug, level: entry.level ?? null, entry, source: doc.source ?? {}, rankingNoteAr: doc.rankingNoteAr ?? null };
        if (!occurrencesByNormalized.has(entry.normalized)) occurrencesByNormalized.set(entry.normalized, []);
        occurrencesByNormalized.get(entry.normalized).push(entry);
        const prev = canonicalOwner.get(entry.normalized);
        if (!prev) { canonicalOwner.set(entry.normalized, cand); continue; }
        const better = rankOf(cand.entry) < rankOf(prev.entry) ||
          (rankOf(cand.entry) === rankOf(prev.entry) && `${cand.bundleSlug}` < `${prev.bundleSlug}`) ||
          (rankOf(cand.entry) === rankOf(prev.entry) && cand.bundleSlug === prev.bundleSlug && cand.file < prev.file);
        if (better) canonicalOwner.set(entry.normalized, cand);
      }
    }
  }

  // خريطة الكلمة ⇒ معرّفها (AUD-07: من كل الجذور المعجمية لا مجلد الاستيراد)
  const { vocabIdByNormalized, foldedToId } = buildLexiconIndex(lexRoots);

  // إحالات دروس لم تُحلّ — تُقرَّر ولا تُصمت عنها (كلمات بلا مدخل معجمي أصلًا)
  const unresolvedVocabRefs = [];
  // روابط الدرس↔المفردات تُنفَّذ بعد إدخال المفردات (قيد المفتاح الأجنبي يمنع غير ذلك)
  const deferredVocabLinks = [];
  // VER-04: الروابط بصيغة منظمة أيضًا — ليتحقق المستورِد من المنفَّذ فعليًا
  // ويعيد تنفيذها في مرور نهائي بعد كل المجلدات (لا اعتماد على الترتيب)
  const structuredLinks = [];
  // حزم بلا عنوان عربي (أو عنوان == المعرّف) — تُبلَّغ للمراجعة، ولا تُكتب كمعرّف تقني
  const missingBundleTitles = [];
  const errors = [];
  const counters = { programs: 0, units: 0, lessons: 0, versions: 0, exercises: 0, options: 0, items: 0, vocab: 0, senses: 0, tags: 0 };
  const versions = {}; // slug ⇒ {versionNo, contentHash} — ليُسلسل المستورِد أرقام الإصدارات عبر مجلدات متعددة

  const mergedPrograms = pathFiles.flatMap(f => load(f).programs ?? []);
  /* نشر الأسلاف شرط ظهور المسار في الكتالوج: البرنامج/الوحدة لا يظهران إلا
   * منشورَين. يُشتق النشر من **كل** إعلانات paths.json في جذور المعجم (لا من
   * المجلد الحالي): إعلان الوحدة في مجلد العيّنات لا يعرف دروس المحتوى الحقيقي،
   * فكان يُصدر الصفّ نفسه بحالة مختلفة ⇒ تعارض «أول ظهور فوز».
   */
  const publishedUnits = new Set();
  const publishedPrograms = new Set();
  const computeReleaseStatus = () => {
    if (!releasedSlugs.size) return;
    for (const root of lexRoots) {
      for (const f of walkJson(root).filter(x => basename(x) === 'paths.json')) {
        for (const program of loadJson(f).programs ?? []) {
          for (const unit of program.units ?? []) {
            if ((unit.lessons ?? []).some(l => releasedSlugs.has(l))) {
              publishedUnits.add(`${program.slug}/${unit.slug}`);
              publishedPrograms.add(program.slug);
            }
          }
        }
      }
    }
  };
  computeReleaseStatus();

  /* ---------------------------------------------------------------------------
   * البرنامج الواحد يُعلَن في كل ملف `paths.json` لمستوى: سبعة إعلانات لـmain-track
   * بوصف مختلف لكل مستوى («المسار الأساسي للمستوى B2» …). الصفّ في `programs` صفّ
   * برنامج لا صفّ مستوى، فكان آخر إعلان يفوز ⇒ وصف البرنامج يتغيّر بتغيّر ترتيب
   * الملفات، و`level_code`/`sort_order` كذلك.
   *
   * الحسم هنا: الإعلان المعتمد هو الذي **بلا مستوى** (تعريف البرنامج الشامل)،
   * ويُفضَّل ما له وصف، ثم الأول حسب ترتيب الملفات. إعلانات بقية المستويات تُسهم
   * بوحداتها فقط — هي مصادر حقيقية لا يجوز إسقاطها.
   * ------------------------------------------------------------------------- */
  const canonicalProgram = new Map();
  /* التعريف المعتمد للبرنامج يُختار من **كل** الجذور لا من المجلد الحالي:
   * `main-track` معلن في ستة `paths.json` (prea1→c1) وفي exemplars. الأولوية:
   * تعريف داخل content/drafts (المحتوى الحقيقي لا العيّنات)، ثم إعلان بلا
   * مستوى، ثم الوصف الأطول. النتيجة واحدة أيًّا كان المجلد الذي بُني منه الملف. */
  const globalPrograms = [];
  for (const root of lexRoots) {
    for (const f of walkJson(root).filter(x => basename(x) === 'paths.json')) {
      for (const program of loadJson(f).programs ?? []) globalPrograms.push({ program, file: f });
    }
  }
  for (const { program } of globalPrograms) {
    if (!program?.slug) continue;
    const prev = canonicalProgram.get(program.slug);
    const score = (p, file) => [file.includes('/drafts/') ? 0 : 1, p.levelCode ? 1 : 0, -String(p.objectiveAr ?? '').length];
    if (!prev) { canonicalProgram.set(program.slug, program); continue; }
    const a = score(program, globalPrograms.find(g => g.program === program).file);
    const b = score(prev, globalPrograms.find(g => g.program === prev).file);
    if (a[0] < b[0] || (a[0] === b[0] && (a[1] < b[1] || (a[1] === b[1] && a[2] < b[2])))) {
      canonicalProgram.set(program.slug, program);
    }
  }
  for (const program of mergedPrograms) {
    if (!program?.slug) continue;
    const prev = canonicalProgram.get(program.slug);
    const score = (p) => [p.levelCode ? 1 : 0, String(p.objectiveAr ?? '').trim() ? 0 : 1];
    if (!prev) { canonicalProgram.set(program.slug, program); continue; }
    const a = score(program), b = score(prev);
    if (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) canonicalProgram.set(program.slug, program);
  }
  if (mergedPrograms.length) {
    const emittedPrograms = new Set();
    // ترتيب حتمي عند غياب sortOrder صريح: أبجديًا باسم البرنامج — لا بترتيب
    // ظهور الملفات (كان callcenter يأخذ 2 أو 6 بحسب المرور).
    const programOrder = new Map([...new Set(mergedPrograms.map(p => p.slug))].sort().map((slug, i) => [slug, i + 1]));
    mergedPrograms.forEach((program, pIdx) => {
      const programId = stableId('prog', program.slug);
      const canon = canonicalProgram.get(program.slug) ?? program;
      if (!emittedPrograms.has(program.slug)) {
        emittedPrograms.add(program.slug);
        statements.push(`INSERT INTO programs (id, slug, title_ar, description_ar, kind, level_code, category, status, sort_order, is_active)
        VALUES (${q(programId)}, ${q(program.slug)}, ${q(canon.titleAr)}, ${q(canon.objectiveAr ?? '')},
                ${q(canon.kind ?? 'path')}, ${q(canon.levelCode ?? null)}, ${q(canon.category ?? program.category)},
                ${q(publishedPrograms.has(program.slug) ? 'published' : 'draft')}, ${n(canon.sortOrder ?? program.sortOrder ?? programOrder.get(program.slug))}, 1)
        ON CONFLICT(id) DO UPDATE SET title_ar=excluded.title_ar, description_ar=excluded.description_ar,
          level_code=excluded.level_code, sort_order=excluded.sort_order, status=excluded.status`);
        counters.programs++;
      }

      (program.units ?? []).forEach((unit, uIdx) => {
        const unitId = stableId('unit', `${program.slug}/${unit.slug}`);
        statements.push(`INSERT INTO units (id, program_id, level_code, slug, title_ar, objective_ar, sort_order, status)
          VALUES (${q(unitId)}, ${q(programId)}, ${q(unit.levelCode ?? null)}, ${q(unit.slug)},
                  ${q(unit.titleAr)}, ${q(unit.objectiveAr ?? '')}, ${n(unit.sortOrder ?? uIdx + 1)},
                  ${q(publishedUnits.has(`${program.slug}/${unit.slug}`) ? 'published' : 'draft')})
          ON CONFLICT(id) DO UPDATE SET title_ar=excluded.title_ar, sort_order=excluded.sort_order, status=excluded.status`);
        counters.units++;
      });
    });
  }

  // ترتيب دروس كل وحدة كما أعلنه paths.json، لاشتقاق قاعدة الفتح المتسلسل.
  // (ملف الدرس لا يعرف من يسبقه، والمنهج هو مصدر الحقيقة للتسلسل.)
  const unitLessonOrder = new Map();
  for (const p of mergedPrograms) {
    for (const u of p.units ?? []) {
      const key = `${p.slug}/${u.slug}`;
      unitLessonOrder.set(key, (u.lessons ?? []).filter(Boolean));
    }
  }


  // خريطة الصيغ ⇒ المدخل: تُبنى من `forms[]` وحقل `plural` في الحزم نفسها.
  // تُستخدم احتياطيًا فقط عند غياب تطابق حرفي مع `normalized`، وبشرط أن تكون
  // الصيغة غير ملتبسة (مدخل واحد فقط) وغير محجوبة في FORM_LINK_BLOCKLIST.
  // لا مطابقة بلا تشكيل هنا أبدًا: `papa`/`papá` و`año`/`ano` لا تُدمج.
  const formOwners = new Map(); // formNorm -> Set<entryId>
  const noteForm = (formEs, entryId) => {
    const formNorm = String(formEs).toLowerCase().trim();
    if (!formNorm) return;
    if (!formOwners.has(formNorm)) formOwners.set(formNorm, new Set());
    formOwners.get(formNorm).add(entryId);
  };

  for (const file of vocabFiles) {
    for (const entry of load(file).entries ?? []) {
      if (!entry.normalized) continue;
      const entryId = stableId('voc', entry.normalized);
      vocabIdByNormalized.set(entry.normalized, entryId);
      for (const f of entry.forms ?? []) noteForm(f.formEs, entryId);
      if (entry.plural) noteForm(entry.plural, entryId);
    }
  }

  /* حسم مكتوب للحالات الملتبسة التي يوضّحها الدرس نفسه (لا تخمين):
   * - `fui` تصلح لـser ولـir. درس a2-indefinido-irregular يشرح في نصّه:
   *   «Fui al cine… الفعل fui هنا مشتق من ir بمعنى ذهب» ⇒ تُربط بـir.
   * - `visto` تصلح لـver (اسم مفعول) ولـvestir (أنا ألبس). درس
   *   a2-participios-irregulares يسرد «ver -> visto» ⇒ تُربط بـver.
   * المفتاح: "<slug الدرس>|<الصيغة>" والقيمة: الكلمة الأساسية المعتمدة.
   */
  const LESSON_FORM_OVERRIDES = new Map([
    ['a2-indefinido-irregular|fui', 'ir'],
    ['a2-participios-irregulares|visto', 'ver'],
  ]);

  const formToEntry = new Map(); // formNorm -> entryId (غير ملتبس فقط)
  for (const [formNorm, owners] of formOwners) {
    if (owners.size !== 1) continue; // صيغة مشتركة بين مدخلين (fui: ser/ir) — لا تخمين
    if (vocabIdByNormalized.has(formNorm)) continue; // كلمة قائمة بذاتها تتغلب
    if (FORM_LINK_BLOCKLIST.has(formNorm)) continue; // معنى آخر في الدرس — قرار بشري
    formToEntry.set(formNorm, [...owners][0]);
  }

  const skippedLessons = [];
  for (const file of lessonFiles) {
    const L = load(file).lesson;
    if (!L?.slug) { errors.push(`درس بلا slug في ${file}`); continue; }
    // درس عيّنة مكرر بمعرّف درس موجود في المحتوى الحقيقي: يُسقَط من الاستيراد
    // ويُبلَّغ، فلا يدخل الدرس مرتين بنسختين وتمارين مكرّرة.
    if (skipLessonSlugs && skipLessonSlugs.has(L.slug)) { skippedLessons.push({ slug: L.slug, file }); continue; }

    for (const ex of L.exercises ?? []) {
      if (!EXERCISE_TYPES.has(ex.type)) errors.push(`نوع تمرين غير معرَّف: ${ex.type} (${file})`);
      if (!ex.explanationAr || String(ex.explanationAr).trim().length < 10) errors.push(`تمرين ${ex.id} بلا شرح عربي كافٍ (${file})`);
    }

    const programSlug = L.programSlug ?? 'main-track';
    const programId = stableId('prog', programSlug);
    const unitId = stableId('unit', `${programSlug}/${L.unitSlug}`);
    const lessonId = stableId('lesson', L.slug);
    const contentHash = sha256(JSON.stringify(L));
    const released = releasedSlugs.has(L.slug);
    const lessonStatus = released ? 'published' : 'draft';
    const reviewState = released ? 'approved' : 'unreviewed';
    // رقم الإصدار يجيء من القاعدة (يمرّره المستدعي). بلا ذلك يبقى 1 — وهو الصحيح
    // فقط عند أول استيراد أو في بيئة اختبار فارغة.
    const prior = existingVersions[L.slug];
    const versionNo = prior && prior.contentHash !== contentHash ? prior.versionNo + 1 : (prior?.versionNo ?? 1);
    const versionId = stableId('lv', `${L.slug}#${versionNo}#${contentHash.slice(0, 12)}`);
    versions[L.slug] = { versionNo, contentHash };

    // قاعدة الفتح: إن كانت «متسلسل» ولم يعلن الدرس متطلباته صراحةً، نشتقها من
    // ترتيب الوحدة في paths.json. بلا هذا الاشتقاق يبقى كل درس مفتوحًا.
    const order = unitLessonOrder.get(`${programSlug}/${L.unitSlug}`) ?? [];
    const idxInUnit = order.indexOf(L.slug);
    const declaredRequires = Array.isArray(L.unlock?.requires) ? L.unlock.requires : null;
    const requires = declaredRequires ?? (idxInUnit > 0 ? [order[idxInUnit - 1]] : []);
    const unlockRule = { ...(L.unlock ?? { type: 'open' }) };
    if (requires.length) unlockRule.requires = requires;
    else delete unlockRule.requires;

    statements.push(`INSERT INTO lessons (id, unit_id, slug, title_ar, level_code, objective_ar, estimated_minutes, skills_json,
                             status, unlock_rule_json, mastery_criteria_json, offline_priority, sort_order)
        VALUES (${q(lessonId)}, ${q(unitId)}, ${q(L.slug)}, ${q(L.titleAr)}, ${q(L.level)},
                ${q(L.objectiveAr)}, ${n(L.estimatedMinutes ?? 8)}, ${j(L.skills ?? [])},
                ${q(lessonStatus)}, ${j(unlockRule)}, ${j(L.mastery ?? {})},
                ${n(L.offlinePriority ?? 0)}, 1)
        ON CONFLICT(id) DO UPDATE SET
          title_ar=excluded.title_ar, objective_ar=excluded.objective_ar, estimated_minutes=excluded.estimated_minutes,
          skills_json=excluded.skills_json, unlock_rule_json=excluded.unlock_rule_json,
          mastery_criteria_json=excluded.mastery_criteria_json, status=excluded.status`);
    counters.lessons++;

    statements.push(`INSERT INTO lesson_versions (id, lesson_id, version_no, status, content_json, content_hash, change_summary, review_state)
        VALUES (${q(versionId)}, ${q(lessonId)}, ${n(versionNo)}, ${q(lessonStatus)}, ${j(L)}, ${q(contentHash)},
                ${q('استيراد من ' + file)}, ${q(reviewState)})
        ON CONFLICT(id) DO NOTHING`);
    statements.push(`UPDATE lessons SET current_version_id = ${q(versionId)} WHERE id = ${q(lessonId)}`);
    /* إصدار كان مستوردًا قبل الإفراج: نصّه لا يُعاد كتابته (الإصدارات لقطة
     * ثابتة)، لكن حالته تُرقّى إلى published/approved مرة واحدة، فتظهر النسخة
     * المُفرج عنها في المسار التعليمي بدل بقائها unreviewed. */
    if (released) {
      statements.push(`UPDATE lesson_versions SET status = 'published', review_state = 'approved'
        WHERE id = ${q(versionId)} AND (status <> 'published' OR review_state <> 'approved')`);
    }
    /* سجل مراجعة آلي للنسخة المُفرج عنها: ثلاث مراحل صريحة (الإسبانية، الترجمة،
     * الفحص الآلي) قرارها passed بمصدر ai+automated. reviewer_id = NULL لأن
     * المراجعة آلية لا بشرية — ولا يُكتب اسم مراجع بشري وهمي. */
    if (released) {
      const stages = [['language_es', 'فحص الإسبانية آليًا + مراجعة الذكاء الاصطناعي'], ['translation_ar', 'فحص الترجمة العربية (فصحى/مصرية)'], ['automated', 'بوابات آلية: validate-content · audit-content-quality · فحص التمارين']];
      for (const [stage, note] of stages) {
        const recId = stableId('crr', `${L.slug}#${stage}`);
        statements.push(`INSERT INTO content_review_records (id, target_type, target_id, stage, reviewer_id, decision, notes, created_at)
        VALUES (${q(recId)}, 'lesson_version', ${q(versionId)}, ${q(stage)}, NULL, 'passed',
                ${q(`${note} — provenance: ai+automated (no human reviewer)`)}, ${q(releaseDate + 'T00:00:00.000Z')})
        ON CONFLICT(id) DO NOTHING`);
        reviewRecords.push(recId);
      }
    }
    counters.versions++;

    (L.exercises ?? []).forEach((ex, idx) => {
      const exId = stableId('ex', `${L.slug}/${ex.id}`);
      // مفاتيح الإجابة تشير إلى معرّفات الخيارات كما وردت في ملف المحتوى؛
      // لكن العميل يرى المعرّفات المشتقة في القاعدة. لولا هذا التحويل لما طابق
      // التصحيح أبدًا — خطأ صامت لا يظهر إلا باختبار فعلي.
      const optId = (rawId) => stableId('opt', `${L.slug}/${ex.id}/${rawId}`);
      const answerKey = { ...(ex.answerKey ?? {}) };
      if (Array.isArray(answerKey.correctOptionIds)) {
        answerKey.correctOptionIds = answerKey.correctOptionIds.map(optId);
      }
      const errorFeedback = {};
      for (const [k, v] of Object.entries(ex.errorFeedback ?? {})) errorFeedback[optId(k)] = v;
      statements.push(`INSERT INTO exercises (id, lesson_version_id, type, prompt_json, answer_key_json, explanation_ar,
                                   error_feedback_json, difficulty, skills_json, media_json, sort_order)
            VALUES (${q(exId)}, ${q(versionId)}, ${q(ex.type)}, ${j({
              instructionAr: ex.instructionAr,
              stemEs: ex.stemEs ?? null,
              stemAr: ex.stemAr ?? null,
              audioKey: ex.audioKey ?? null,

              // نص النطق الذي كتبه المؤلف — يُحفظ كما هو؛ الخادم لا يشتق
              // speechEs من مفتاح الإجابة، فبدون هذا الحقل تضيع أصوات مؤلفة.
              speechEs: ex.speechEs ?? null,
            })}, ${j(answerKey)}, ${q(ex.explanationAr)}, ${j(errorFeedback)},
            ${n(ex.difficulty ?? 2)}, ${j(ex.skills ?? [])}, ${j({ audioKey: ex.audioKey ?? null })}, ${n(idx + 1)})
            ON CONFLICT(id) DO UPDATE SET lesson_version_id=excluded.lesson_version_id,
              prompt_json=excluded.prompt_json, answer_key_json=excluded.answer_key_json,
              explanation_ar=excluded.explanation_ar, error_feedback_json=excluded.error_feedback_json,
              difficulty=excluded.difficulty, skills_json=excluded.skills_json,
              media_json=excluded.media_json, sort_order=excluded.sort_order`);
      counters.exercises++;

      // الإجابة الصحيحة القياسية — للاختبارات فقط، لا تُرسل إلى أي عميل
      if (ex.answerKey?.correctOptionIds?.length) {
        answers[exId] = optId(ex.answerKey.correctOptionIds[0]);
      } else if (ex.answerKey?.accepted?.length) {
        answers[exId] = ex.type === 'word_order' ? { tokens: ex.answerKey.accepted[0].split(' ') } : ex.answerKey.accepted[0];
      }

      (ex.options ?? []).forEach((opt, oIdx) => {
        const optId = stableId('opt', `${L.slug}/${ex.id}/${opt.id}`);
        statements.push(`INSERT INTO exercise_options (id, exercise_id, text, is_correct, distractor_rationale_ar, sort_order)
              VALUES (${q(optId)}, ${q(exId)}, ${q(opt.text)}, ${opt.isCorrect ? 1 : 0},
                      ${q(opt.distractorRationaleAr ?? null)}, ${n(oIdx + 1)})
              ON CONFLICT(id) DO UPDATE SET text=excluded.text, is_correct=excluded.is_correct, sort_order=excluded.sort_order`);
        counters.options++;
      });

      (ex.items ?? []).forEach((item, iIdx) => {
        const itemId = stableId('itm', `${L.slug}/${ex.id}/${item.id ?? iIdx}`);
        statements.push(`INSERT INTO exercise_items (id, exercise_id, ordinal, item_type, payload_json)
              VALUES (${q(itemId)}, ${q(exId)}, ${n(iIdx + 1)}, ${q(item.kind === 'token' ? 'word_bank_token' : (item.kind ?? 'word_bank_token'))},
                      ${j(item)})
              ON CONFLICT(exercise_id, ordinal) DO UPDATE SET payload_json=excluded.payload_json`);
        counters.items++;
      });
    });

    // ربط مفردات الدرس بمدخلاتها (لتوليد بطاقات المراجعة بعد إتمام الدرس)
    const linkVocab = (words, role) => {
      for (const wRaw of words ?? []) {
        const rawNorm = String(wRaw).toLowerCase().trim();
        const norm = stripOuterPunctuation(rawNorm);
        let entryId = vocabIdByNormalized.get(rawNorm) ?? vocabIdByNormalized.get(norm);
        if (!entryId) {
          const folded = foldedToId.get(foldAccents(norm));
          if (folded) entryId = vocabIdByNormalized.get(folded);
        }
        // صيغة غير ملتبسة من forms[]/plural (احتياطي بعد التطابق الحرفي والمطوي)
        if (!entryId) entryId = formToEntry.get(norm) ?? formToEntry.get(rawNorm);
        // حسم مكتوب للحالات التي يوضّحها الدرس (fui→ir، visto→ver)
        if (!entryId) {
          const lemma = LESSON_FORM_OVERRIDES.get(`${L.slug}|${norm}`);
          if (lemma) entryId = vocabIdByNormalized.get(lemma) ?? null;
        }
        if (!entryId) {
          // كلمة بلا مدخل معجمي في أي مجلد: تُسجَّل في التقرير ولا تُختلَق لها بيانات
          unresolvedVocabRefs.push({ lesson: L.slug, word: norm, role });
          counters.vocabLinksUnresolved = (counters.vocabLinksUnresolved ?? 0) + 1;
          continue;
        }
        // محروس بـEXISTS: ترتيب استيراد المجلدات لا يكسر FK إن جاءت الدروس
        // قبل حزمة الكلمة المحالة إليها؛ إعادة الاستيراد تكمل الرابط لاحقًا.
        deferredVocabLinks.push(linkInsertStatement({ lessonId, entryId, role }));
        structuredLinks.push({ lessonId, entryId, role });
        counters.vocabLinks = (counters.vocabLinks ?? 0) + 1;
      }
    };
    linkVocab(L.newVocabulary, 'new');
    linkVocab(L.reviewVocabulary, 'review');
  }

  for (const file of vocabFiles) {
    const bundle = load(file);
    const sourceId = stableId('src', `${bundle.bundleSlug}/source`);
    statements.push(`INSERT INTO content_sources (id, title, url, publisher, license, accessed_at, notes)
        VALUES (${q(sourceId)}, ${q(bundle.source?.title ?? 'حزمة مفردات داخلية')}, ${q(bundle.source?.url ?? '')},
                ${q(bundle.source?.publisher ?? null)}, ${q(bundle.source?.license ?? 'internal-draft')},
                ${q(bundle.source?.accessedAt ?? null)}, ${q(bundle.source?.rankingNote ?? '')})
        ON CONFLICT(id) DO UPDATE SET notes=excluded.notes, license=excluded.license`);

    const bundleId = stableId('vbn', bundle.bundleSlug);
    // عنوان عربي إلزامي للعرض: لا نكتب المعرّف الإنجليزي في عمود العنوان (كان يظهر
    // للطالب «cv-lex-nouns-core»). البديل واضح، والمصدر الصحيح titleAr في ملف الحزمة.
    const bundleLevel = bundle.levelCode ?? bundle.entries?.[0]?.level ?? null;
    const titleAr = String(bundle.titleAr ?? '').trim();
    if (!titleAr || titleAr === bundle.bundleSlug) {
      missingBundleTitles.push(bundle.bundleSlug);
    }
    const displayTitle = titleAr && titleAr !== bundle.bundleSlug
      ? titleAr
      : (bundleLevel ? `حزمة مفردات ${bundleLevel}` : 'حزمة مفردات');
    statements.push(`INSERT INTO vocabulary_bundles (id, slug, title_ar, level_code, sort_order, status, source_id, notes_ar)
        VALUES (${q(bundleId)}, ${q(bundle.bundleSlug)}, ${q(displayTitle)},
                ${q(bundleLevel)}, ${n(bundle.sortOrder ?? 0)},
                'draft', ${q(sourceId)}, ${q(bundle.rankingNoteAr ?? bundle.source?.rankingNote ?? null)})
        ON CONFLICT(slug) DO UPDATE SET title_ar=excluded.title_ar, notes_ar=excluded.notes_ar`);
    counters.bundles = (counters.bundles ?? 0) + 1;

    for (const [eIdx, entry] of (bundle.entries ?? []).entries()) {
      // المعرّف مشتق من الكلمة نفسها لا من الحزمة: نفس الكلمة في حزمتين = صف واحد
      // يُعاد استخدامه بدل تكرار الشرح (قاعدة crossTrackRules في المنهج).
      const entryId = stableId('voc', entry.normalized);
      // الظهور المعتمد عالميًا (أدنى مستوى ← الحزمة أبجديًا) هو وحده الذي يُصدر
      // التعريف والمعاني والأمثلة والصيغ. الظهورات الأخرى تُصدر ارتباطها بالحزمة
      // ووسومها فقط. قبل ذلك كانت كل حزمة تُصدر صفّ المفردة نفسها بقيم مختلفة
      // (مستوى/رتبة/تلميح نطق) ⇒ 15 تعارضًا كان يُحسم بالترتيب، وهو ما رُفض.
      const canonicalRec = canonicalOwner.get(entry.normalized);
      const meta = canonicalRec?.entry ?? entry;
      const isCanonicalOccurrence = !canonicalRec || (canonicalRec.file === file && canonicalRec.idx === eIdx);
      /* يُصدر التعريف من الظهور المعتمد إن كان **داخل هذه الخطة**، وإلا فلابد
       * من إصداره من هنا (وإلا بقي المدخل بلا صفّ عند استيراد مجلد منفرد،
       * كخطة مجلد العيّنات وحدها أو خطة اختبار معزولة). الصفّ نفسه نصًّا في
       * الحالتين، فإعادة الإصدار تُسقطها التنقية بلا تعارض. */
      const canonicalInPlan = canonicalRec ? vocabFiles.includes(canonicalRec.file) : true;
      const emitDefinition = isCanonicalOccurrence || !canonicalInPlan;
      const metaSourceId = canonicalRec ? stableId('src', `${canonicalRec.bundleSlug}/source`) : sourceId;

      if (emitDefinition) {
        if (metaSourceId !== sourceId && !emittedSources.has(metaSourceId)) {
          emittedSources.add(metaSourceId);
          const cs = canonicalRec?.source ?? {};
          statements.push(`INSERT INTO content_sources (id, title, url, publisher, license, accessed_at, notes)
              VALUES (${q(metaSourceId)}, ${q(cs.title ?? 'حزمة مفردات داخلية')}, ${q(cs.url ?? '')},
                      ${q(cs.publisher ?? null)}, ${q(cs.license ?? 'internal-draft')},
                      ${q(cs.accessedAt ?? null)}, ${q(cs.rankingNote ?? canonicalRec?.rankingNoteAr ?? '')})
              ON CONFLICT(id) DO UPDATE SET notes=excluded.notes, license=excluded.license`);
        }
        statements.push(`INSERT INTO vocabulary_entries (id, headword_es, headword_normalized, entry_kind, pos, gender, plural_es,
                                            level_code, frequency_rank, frequency_source_id, ipa, pronunciation_hint_ar,
                                            register, status, notes_ar)
            VALUES (${q(entryId)}, ${q(meta.headword)}, ${q(meta.normalized)}, ${q(meta.kind ?? 'word')},
                    ${q(meta.pos ?? null)}, ${q(meta.gender ?? null)}, ${q(meta.plural ?? null)}, ${q(meta.level ?? null)},
                    ${n(meta.internalRank ?? null)}, ${q(metaSourceId)}, ${q(meta.ipa ?? null)},
                    ${q(meta.pronunciationHintAr ?? null)}, ${q(meta.register ?? 'neutral')}, 'draft', ${q(meta.variantNoteAr ?? null)})
            ON CONFLICT(headword_normalized) DO UPDATE SET headword_es=excluded.headword_es, ipa=excluded.ipa,
              pronunciation_hint_ar=excluded.pronunciation_hint_ar, level_code=excluded.level_code`);
        counters.vocab++;
      }

      statements.push(`INSERT INTO vocabulary_bundle_entries (bundle_id, entry_id, sort_order)
          VALUES (${q(bundleId)}, ${q(entryId)}, ${n(eIdx + 1)})
          ON CONFLICT(bundle_id, entry_id) DO NOTHING`);

      if (emitDefinition) {
        const mergedSenses = (meta.senses ?? []).map((sense) => {
          const others = (occurrencesByNormalized.get(meta.normalized) ?? []).filter(o => o !== meta);
          const merged = { ...sense };
          for (const other of others) {
            const twin = (other.senses ?? []).find(o => (o.senseNo ?? 1) === (sense.senseNo ?? 1));
            if (!twin) continue;
            for (const field of ['meaningArFusha', 'meaningArEg', 'usageNoteAr', 'commonErrorAr', 'glossEs']) {
              if ((merged[field] == null || merged[field] === '') && twin[field]) merged[field] = twin[field];
            }
            // الترجمة تُدمج فقط إذا كان المثال الإسباني نفسه (وإلا فهي ترجمة جملة أخرى)
            for (const field of ['exampleAr', 'exampleArEg']) {
              if ((merged[field] == null || merged[field] === '') && twin[field] && twin.exampleEs === sense.exampleEs) {
                merged[field] = twin[field];
              }
            }
          }
          return merged;
        });
        mergedSenses.forEach((sense) => {
          // المعرّف من الكلمة والمعنى وحدهما: إدخال الحزمة في البذرة كان يجعل
          // معرّف المعنى يتغيّر بتغيّر ترتيب استيراد الحزم، ومعه 15 صفًّا مكرّرًا.
          const senseId = stableId('sen', `${meta.normalized}/${sense.senseNo ?? 1}`);
          let exampleSentenceId = null;
          const exampleEs = typeof sense.exampleEs === 'string' ? sense.exampleEs.trim() : '';
          if (exampleEs) {
            const sentenceKey = `vocab-example:${meta.normalized}:${sense.senseNo ?? 1}`;
            exampleSentenceId = stableId('snt', sentenceKey);
            const SREG = new Set(['neutral', 'informal', 'formal', 'colloquial_spain', 'colloquial_latam']);
            const sReg = SREG.has(meta.register) ? meta.register : 'neutral';
            statements.push(`INSERT INTO sentences (id, text_es, level_code, register, source_id)
                VALUES (${q(exampleSentenceId)}, ${q(exampleEs)}, ${q(meta.level ?? null)}, ${q(sReg)}, ${q(metaSourceId)})
                ON CONFLICT(id) DO UPDATE SET text_es=excluded.text_es, level_code=excluded.level_code`);
            for (const [style, text] of [['fusha', sense.exampleAr], ['eg', sense.exampleArEg]]) {
              if (typeof text === 'string' && text.trim()) {
                statements.push(`INSERT INTO sentence_translations (id, sentence_id, locale, style, text, is_primary)
                    VALUES (${q(stableId('snt', `${sentenceKey}:${style}`))},
                            ${q(exampleSentenceId)}, 'ar', ${q(style)}, ${q(text.trim())}, ${style === 'fusha' ? 1 : 0})
                    ON CONFLICT(sentence_id, locale, style) DO UPDATE SET text=excluded.text`);
              }
            }
            counters.sentences = (counters.sentences ?? 0) + 1;
          }
          statements.push(`INSERT INTO vocabulary_senses (id, entry_id, sense_no, meaning_ar_fusha, meaning_ar_eg, gloss_es, register, usage_note_ar, common_error_ar, example_sentence_id)
              VALUES (${q(senseId)}, ${q(entryId)}, ${n(sense.senseNo ?? 1)}, ${q(sense.meaningArFusha)},
                      ${q(sense.meaningArEg ?? null)}, ${q(sense.glossEs ?? null)}, ${q(meta.register ?? 'neutral')},
                      ${q(sense.usageNoteAr ?? null)}, ${q(sense.commonErrorAr ?? null)}, ${q(exampleSentenceId)})
              ON CONFLICT(entry_id, sense_no) DO UPDATE SET meaning_ar_fusha=excluded.meaning_ar_fusha,
                meaning_ar_eg=excluded.meaning_ar_eg, usage_note_ar=excluded.usage_note_ar, common_error_ar=excluded.common_error_ar,
                example_sentence_id=excluded.example_sentence_id`);
          counters.senses++;
        });

        // الصيغ: اتحاد صيغ كل الظهورات (قد يحمل ظهور صيغةً ينقصها الآخر)، بلا
        // تكرار داخل الخطة — والمفتاح من الكلمة نفسها لا من الحزمة.
        const seenForms = new Set();
        const emitForm = (kind, formEs, tense, mood, person, irregular) => {
          const key = `${entryId}|${kind}|${formEs}|${tense ?? ''}|${mood ?? ''}|${person ?? ''}`;
          if (seenForms.has(key)) return;
          seenForms.add(key);
          const formId = stableId('vfm', `${meta.normalized}/${kind}/${formEs}/${tense ?? ''}/${mood ?? ''}/${person ?? ''}`);
          statements.push(`INSERT INTO vocabulary_forms (id, entry_id, form_kind, form_es, tense, mood, person, is_irregular)
              VALUES (${q(formId)}, ${q(entryId)}, ${q(kind)}, ${q(formEs)}, ${q(tense ?? null)}, ${q(mood ?? null)}, ${q(person ?? null)}, ${n(irregular ? 1 : 0)})
              ON CONFLICT(id) DO NOTHING`);
          counters.forms = (counters.forms ?? 0) + 1;
        };
        const allForms = [];
        for (const occ of occurrencesByNormalized.get(meta.normalized) ?? [meta]) allForms.push(...(occ.forms ?? []));
        for (const f of allForms) {
          if (!f?.formEs || !['conjugation', 'plural', 'feminine', 'participle', 'gerund', 'diminutive'].includes(f.kind)) continue;
          emitForm(f.kind, f.formEs, f.tense ?? null, f.mood ?? null, f.person ?? null, f.irregular);
        }
        const plurals = new Set([meta.plural, ...(occurrencesByNormalized.get(meta.normalized) ?? []).map(o => o.plural)].filter(Boolean));
        for (const plural of plurals) emitForm('plural', plural, null, null, null, false);
      }

      for (const tagName of entry.tags ?? []) {
        const tagSlug = tagName.trim().replace(/\s+/g, '-');
        const tagId = stableId('tag', tagSlug);
        // صفّ الوسم يُصدر مرة واحدة: كان يُكتب مع كل مفردة (16,384 أمرًا لـ75
        // وسمًا) وهو تكرار ضرره حجم ملف SQL لا صحّة البيانات.
        if (!emittedTags.has(tagSlug)) {
          emittedTags.add(tagSlug);
          statements.push(`INSERT INTO vocabulary_tags (id, slug, name_ar) VALUES (${q(tagId)}, ${q(tagSlug)}, ${q(tagName)}) ON CONFLICT(slug) DO NOTHING`);
        }
        statements.push(`INSERT INTO vocabulary_tag_links (entry_id, tag_id) VALUES (${q(entryId)}, ${q(tagId)}) ON CONFLICT(entry_id, tag_id) DO NOTHING`);
        counters.tags++;
      }

    }
  }

  statements.push(...deferredVocabLinks);

  // تنقية أخيرة: لا يُصدر الأمر نفسه مرتين، ولا يُحسم تعارض محتوى بالترتيب وحده بلا إبلاغ.
  const deduped = dedupePlanStatements(statements);

  return {
    statements: deduped.statements,
    answers,
    counters,
    errors,
    unresolvedVocabRefs,
    links: structuredLinks,
    linkStatements: deferredVocabLinks,
    versions,
    missingBundleTitles,
    conflicts: deduped.conflicts,
    dedupedStatements: deduped.dropped,
    skippedLessons,
  };
}
