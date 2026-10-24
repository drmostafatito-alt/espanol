/**
 * ============================================================================
 * مدقّق خريطة المنهج — منطق قابل للاختبار (يُستدعى من CLI ومن vitest)
 * ============================================================================
 * يتحقق من:
 *   1) تفرّد المعرّفات (مسار/وحدة/درس) وعدم تكرار درس في وحدتين.
 *   2) وجود هدف تعليمي فعلي لكل درس مكتوب، ومهارات ضمن القائمة المعلنة.
 *   3) تسلسل المتطلبات السابقة: كل درس يحتاج الدرس الذي قبله، وأول درس في مسار
 *      لا يحتاج شيئًا؛ ولا حلقات (döngü) ولا مراجع مكسورة.
 *   4) حدود الأعداد المعلنة مقابل الموجود فعلًا (لا ادعاء أرقام).
 *   5) «مسار المفردات»: منع عبارات الادعاء («أهم 1000») قبل اعتماد مصدر مرخَّص.
 *   6) روابط المفردات: الحزم المذكورة في المنهج يجب أن توجد فعلًا، ولا تُكرَّر
 *      الكلمة نفسها في حزمتين (تُعاد الاستخدام بدل التكرار).
 *
 * كل عطل يُعيد كائنًا {code, message} حتى يمكن اختباره برمجيًا.
 * ========================================================================== */

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** يبني سلسلة المتطلبات الضمنية: كل درس يحتاج الذي قبله في المسار. */
export function buildPrerequisites(map) {
  const prereq = new Map();
  for (const track of map.tracks ?? []) {
    let previous = null;
    for (const level of track.levels ?? []) {
      for (const unit of level.units ?? []) {
        for (const lesson of unit.lessons ?? []) {
          const key = `${track.slug}/${lesson.slug}`;
          // متطلب صريح يتقدّم على التسلسل الضمني (يُستخدم للتحقق من الحلقات والمراجع المكسورة)
          const explicit = Array.isArray(lesson.requires) ? lesson.requires.map(r => `${track.slug}/${r}`) : null;
          prereq.set(key, explicit ?? (previous ? [previous] : []));
          previous = `${track.slug}/${lesson.slug}`;
        }
      }
      // المستوى التالي يبدأ من آخر درس في المستوى السابق — نفسه `previous`.
    }
  }
  return prereq;
}

/** كشف الحلقات في رسم بياني موجّه (DFS ثلاثي الحالات). */
export function findCycles(nodes, edgesOf) {
  const state = new Map(); // 0 = لم يُزر، 1 = في المسار، 2 = تم
  const cycles = [];
  const walk = (node, stack) => {
    if (state.get(node) === 2) return;
    if (state.get(node) === 1) {
      cycles.push([...stack.slice(stack.indexOf(node)), node]);
      return;
    }
    state.set(node, 1);
    stack.push(node);
    for (const next of edgesOf(node) ?? []) {
      if (!nodes.has(next)) continue;
      walk(next, stack);
    }
    stack.pop();
    state.set(node, 2);
  };
  for (const n of nodes) if (!state.get(n)) walk(n, []);
  return cycles;
}

const CLAIM_PATTERNS = [/أهم\s*1000/, /أكثر\s*1000/, /most\s+common\s+1000/i, /top\s*1000/i, /الأكثر\s+شيوعًا/];

/**
 * @param {object} map خريطة المنهج (JSON)
 * @param {object} opts
 *   opts.bundles: [{slug, entries:[{normalized, headword}]}] حزم المفردات الموجودة
 *   opts.lessonFiles: [{slug, unlock}] ملفات الدروس الموجودة
 */
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_FOR_FS = fileURLToPath(new URL('../../', import.meta.url));
const existsSyncSafe = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

export function validateCurriculum(map, opts = {}) {
  const errors = [];
  const warnings = [];
  const err = (code, message, where) => errors.push({ code, message, where });
  const warn = (code, message, where) => warnings.push({ code, message, where });

  if (!map || typeof map !== 'object') return { errors: [{ code: 'BAD_DOC', message: 'الملف ليس كائن JSON' }], warnings, stats: {} };
  if (!map.schemaVersion) err('NO_SCHEMA_VERSION', 'schemaVersion مفقود');
  if (!Array.isArray(map.tracks) || !map.tracks.length) err('NO_TRACKS', 'لا توجد مسارات');

  const declaredSkills = new Set(map.skills ?? []);
  const trackSlugs = new Set();
  const unitSlugs = new Set();
  const lessonSlugs = new Map(); // slug → المسار/الوحدة
  const allLessonList = [];

  for (const track of map.tracks ?? []) {
    if (trackSlugs.has(track.slug)) err('DUP_TRACK', `مسار مكرر: ${track.slug}`);
    trackSlugs.add(track.slug);
    if (!SLUG_RE.test(track.slug ?? '')) err('BAD_TRACK_SLUG', `معرّف مسار غير صالح: ${track.slug}`);

    let trackAuthored = 0;
    let trackPlanned = 0;

    for (const level of track.levels ?? []) {
      if (!level.levelCode) err('NO_LEVEL_CODE', `مستوى بلا levelCode في ${track.slug}`);
      for (const unit of level.units ?? []) {
        if (unitSlugs.has(unit.slug)) err('DUP_UNIT', `وحدة مكررة: ${unit.slug}`);
        unitSlugs.add(unit.slug);
        if (!SLUG_RE.test(unit.slug ?? '')) err('BAD_UNIT_SLUG', `معرّف وحدة غير صالح: ${unit.slug}`);
        if (!unit.objectiveAr || unit.objectiveAr.trim().length < 12) {
          err('UNIT_NO_OBJECTIVE', `وحدة بلا هدف واضح: ${unit.slug}`);
        }
        if (!Array.isArray(unit.lessons)) err('UNIT_NO_LESSONS_ARRAY', `الوحدة ${unit.slug} بلا مصفوفة دروس`);
        const lessons = Array.isArray(unit.lessons) ? unit.lessons : [];
        trackAuthored += lessons.length;
        trackPlanned += unit.plannedLessonCount ?? lessons.length;

        if (typeof unit.plannedLessonCount === 'number' && lessons.length && unit.plannedLessonCount !== lessons.length) {
          err(
            'COUNT_MISMATCH',
            `الوحدة ${unit.slug}: معلن ${unit.plannedLessonCount} درسًا والمكتوب ${lessons.length}`,
          );
        }

        for (const lesson of lessons) {
          const where = `${unit.slug}/${lesson.slug}`;
          if (!SLUG_RE.test(lesson.slug ?? '')) err('BAD_LESSON_SLUG', `معرّف درس غير صالح: ${lesson.slug}`, where);
          if (lessonSlugs.has(lesson.slug)) {
            err('DUP_LESSON', `درس مكرر بين وحدتين: ${lesson.slug}`, where);
          }
          lessonSlugs.set(lesson.slug, where);
          if (!lesson.titleAr || lesson.titleAr.trim().length < 3) err('LESSON_NO_TITLE', 'درس بلا عنوان', where);
          if (!lesson.objectiveAr || lesson.objectiveAr.trim().length < 20) {
            err('LESSON_NO_OBJECTIVE', 'درس بلا هدف تعليمي كافٍ (أقل من 20 حرفًا)', where);
          }
          if (!Array.isArray(lesson.skills) || !lesson.skills.length) err('LESSON_NO_SKILLS', 'درس بلا مهارات', where);
          for (const s of lesson.skills ?? []) {
            if (!declaredSkills.has(s)) err('UNKNOWN_SKILL', `مهارة غير معرَّفة: ${s}`, where);
          }
          if (lesson.levelCode && lesson.levelCode !== level.levelCode) {
            err('LEVEL_MISMATCH', `مستوى الدرس ${lesson.levelCode} يخالف مستوى الوحدة ${level.levelCode}`, where);
          }
          allLessonList.push({ track: track.slug, unit: unit.slug, level: level.levelCode, ...lesson });
        }
      }
    }

    if (typeof track.plannedLessonCount === 'number' && track.plannedLessonCount !== trackPlanned) {
      warn('TRACK_COUNT_NOTE', `المسار ${track.slug}: المعلن ${track.plannedLessonCount} والمجموع من الوحدات ${trackPlanned}`);
    }
    void trackAuthored;
  }

  // ---- المتطلبات السابقة ----
  const prereq = buildPrerequisites(map);
  const nodes = new Set(prereq.keys());
  for (const [key, reqs] of prereq) {
    for (const r of reqs) {
      if (!nodes.has(r)) err('BROKEN_PREREQ', `متطلب سابق مفقود: ${r}`, key);
    }
  }
  const cycles = findCycles(nodes, n => prereq.get(n) ?? []);
  for (const c of cycles) err('PREREQ_CYCLE', `حلقة في المتطلبات: ${c.join(' → ')}`);

  // ---- الدروس المكتوبة مقابل المنهج ----
  const files = opts.lessonFiles ?? [];
  for (const f of files) {
    if (!lessonSlugs.has(f.slug)) err('LESSON_NOT_IN_MAP', `ملف درس غير مسجَّل في المنهج: ${f.slug}`);
  }
  // درس «مكتوب» يجوز أن يعلن مسار ملفه صراحةً (filePath) — مثل الدروس العيّنة
  // في content/exemplars التي تُستعمل كـfixtures ولا تُدار داخل مجلد المسودات.
  // بلا هذا الحقل، «مكتوب» يعني: يجب أن يوجد ملفه بين الملفات المفحوصة.
  const declaredAuthored = allLessonList.filter(l => l.status === 'authored');
  for (const l of declaredAuthored) {
    if (l.filePath) {
      const abs = join(ROOT_FOR_FS, l.filePath);
      if (!existsSyncSafe(abs)) err('AUTHORED_FILE_MISSING', `مسار الملف المعلَن غير موجود: ${l.filePath}`, l.slug);
      continue;
    }
    if (files.length && !files.some(f => f.slug === l.slug)) {
      warn('AUTHORED_WITHOUT_FILE', `الدرس مُعلَن كمكتوب لكن لا ملف له: ${l.slug}`);
    }
  }
  for (const f of files) {
    const declared = allLessonList.find(l => l.slug === f.slug);
    if (declared && declared.status !== 'authored') {
      warn('FILE_WITHOUT_AUTHORED_FLAG', `الدرس له ملف لكن حالته في الخريطة «${declared.status}»: ${f.slug}`);
    }
    // تسلسل المتطلبات في ملف الدرس يجب أن يطابق التسلسل المُشتق
    const key = `${declared?.track}/${f.slug}`;
    const expected = prereq.get(key) ?? [];
    const declaredReq = f.unlock?.requires ?? [];
    if (declaredReq.length && JSON.stringify(declaredReq) !== JSON.stringify(expected)) {
      err(
        'UNLOCK_MISMATCH',
        `متطلبات الفتح في الملف (${declaredReq.join(', ')}) تخالف تسلسل المنهج (${expected.join(', ') || 'بلا'})`,
        f.slug,
      );
    }
  }

  // ---- ادعاءات لا يجوز ذكرها قبل مصدر مرخَّص ----
  // تُفحص الحقول التعليمية فقط: حقول السياسة/التنبيهات/الفجوات مذكورة لتحريم
  // العبارة نفسها، فمحاسبتها على ذكرها ستكون دائرة مغلقة.
  const stripPolicy = (node) => {
    if (Array.isArray(node)) return node.map(stripPolicy);
    if (node && typeof node === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(node)) {
        if (['namingPolicy', 'honestyRules', 'gaps', 'noteAr', 'note', 'rankingNote', 'descriptionAr', 'sourceStatus'].includes(k)) continue;
        out[k] = stripPolicy(v);
      }
      return out;
    }
    return node;
  };
  const text = JSON.stringify(stripPolicy(map));
  for (const p of CLAIM_PATTERNS) {
    if (p.test(text)) err('UNLICENSED_FREQUENCY_CLAIM', `عبارة تكرار غير موثّقة في المنهج: ${p}`);
  }

  // ---- حزم المفردات ----
  const bundles = opts.bundles ?? [];
  const bundleSlugs = new Set(bundles.map(b => b.slug));
  const seenWord = new Map();
  let dupWords = 0;
  for (const b of bundles) {
    for (const e of b.entries ?? []) {
      const norm = String(e.normalized ?? '').trim();
      if (!norm) continue;
      if (seenWord.has(norm)) {
        dupWords++;
        // السياسة: إعادة استخدام الكلمة نفسها بين حزمتين مسموحة إذا كان الشرح
        // متطابقًا (هذا هو «الربط» المطلوب: لا نُعيد شرح ما شُرح).
        // أما تكرارها بشرح مختلف فيُنشئ تناقضًا تعليميًا ⇒ خطأ.
        const prev = seenWord.get(norm);
        const sameMeaning =
          JSON.stringify((prev.meanings ?? []).slice().sort()) ===
          JSON.stringify((e.senses ?? []).map(x => x.meaningArFusha ?? '').slice().sort());
        if (sameMeaning) {
          warn(
            'SHARED_VOCAB_REUSED',
            `«${norm}» مشتركة بين ${prev.bundle} و${b.slug} بنفس الشرح — مسموح، ويجب أن يُحال الدرس إليها لا أن يعيد شرحها.`,
          );
        } else {
          err('DUP_VOCAB_ACROSS_BUNDLES', `كلمة مكررة بشرح مختلف: «${norm}» في ${prev.bundle} و${b.slug}`);
        }
      } else {
        seenWord.set(norm, { bundle: b.slug, meanings: (e.senses ?? []).map(x => x.meaningArFusha ?? '') });
      }
    }
  }
  for (const l of allLessonList) {
    if (l.vocabPack && !bundleSlugs.has(l.vocabPack)) {
      err('MISSING_VOCAB_PACK', `الدرس ${l.slug} يشير إلى حزمة غير موجودة: ${l.vocabPack}`);
    }
  }

  // ---- إحصاءات صادقة ----
  const byLevel = {};
  for (const l of allLessonList) {
    const k = l.level ?? 'غير محدد';
    byLevel[k] = byLevel[k] ?? { authored: 0, planned: 0 };
    byLevel[k].authored++;
  }
  for (const track of map.tracks ?? []) {
    for (const level of track.levels ?? []) {
      const k = level.levelCode;
      byLevel[k] = byLevel[k] ?? { authored: 0, planned: 0 };
      byLevel[k].planned = Math.max(byLevel[k].planned, level.plannedLessonCount ?? 0);
    }
  }

  const stats = {
    tracks: trackSlugs.size,
    units: unitSlugs.size,
    // عدد الدروس التي لها هدف تعليمي مكتوب (كل المدرَجة حاليًا)
    lessonsWithObjectives: allLessonList.length,
    // عدد الدروس التي حالتها authored في الخريطة
    authoredLessons: allLessonList.filter(l => l.status === 'authored').length,
    // عدد ملفات الدروس الموجودة فعلًا في المجلدات المفحوصة
    lessonFiles: (opts.lessonFiles ?? []).length,
    plannedLessons: Object.values(byLevel).reduce((a, b) => a + b.planned, 0),
    byLevel,
    vocabBundles: bundles.length,
    vocabEntries: seenWord.size,
    duplicateVocabAcrossBundles: dupWords,
    levelOutlineOnly: (map.tracks ?? [])
      .flatMap(t => t.levels ?? [])
      .filter(lv => (lv.units ?? []).every(u => !(u.lessons ?? []).length))
      .map(lv => lv.levelCode),
  };

  return { errors, warnings, stats, prereq };
}

/** تقرير نصّي قصير للطرفية */
export function formatReport({ errors, warnings, stats }) {
  const lines = [];
  lines.push('## خريطة المنهج');
  lines.push('');
  lines.push(`| المقياس | القيمة |`);
  lines.push(`| --- | --- |`);
  lines.push(`| مسارات | ${stats.tracks} |`);
  lines.push(`| وحدات | ${stats.units} |`);
  lines.push(`| دروس لها هدف تعليمي | ${stats.lessonsWithObjectives} |`);
  lines.push(`| دروس حالتها «مكتوب» في الخريطة | ${stats.authoredLessons} |`);
  lines.push(`| ملفات دروس موجودة فعلًا | ${stats.lessonFiles} |`);
  lines.push(`| دروس مخطّطة إجمالًا (كل المسارات) | ${stats.plannedLessons} |`);
  lines.push(`| حزم مفردات | ${stats.vocabBundles} (${stats.vocabEntries} مدخلًا) |`);
  lines.push(`| مستويات بهيكل فقط (بلا دروس) | ${stats.levelOutlineOnly.join(', ') || 'لا شيء'} |`);
  lines.push('');
  lines.push(`## الأخطاء (${errors.length})`);
  for (const e of errors.slice(0, 60)) lines.push(`- ❌ ${e.where ? e.where + ': ' : ''}${e.message} [${e.code}]`);
  lines.push('');
  lines.push(`## التنبيهات (${warnings.length})`);
  for (const w of warnings.slice(0, 40)) lines.push(`- ⚠️ ${w.where ? w.where + ': ' : ''}${w.message} [${w.code}]`);
  return lines.join('\n');
}
