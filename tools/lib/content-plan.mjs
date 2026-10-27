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

export function buildContentPlan(dir, { existingVersions = {}, lexiconDirs = null } = {}) {
  // مسح متكرر: المحتوى مُنظَّم في مجلدات فرعية (a1/، travel/، …)، ودمج كل ملفات
  // paths.json يسمح لكل وحدة بإعلان مسارها دون ملف مركزي هش.
  const walk = walkJson;
  const allFiles = walk(dir);
  const pathFiles = allFiles.filter(f => basename(f) === 'paths.json');
  const vocabFiles = allFiles.filter(f => basename(f).startsWith('vocab-'));
  const lessonFiles = allFiles.filter(f => basename(f).startsWith('lesson-'));
  const load = loadJson;

  const statements = [];
  const answers = {}; // معرّف التمرين في القاعدة ⇒ الإجابة الصحيحة (للاختبارات فقط)
  // خريطة الكلمة ⇒ معرّفها (AUD-07: من كل الجذور المعجمية لا مجلد الاستيراد)
  const lexRoots = Array.isArray(lexiconDirs) && lexiconDirs.length ? lexiconDirs : [dir];
  const { vocabIdByNormalized, foldedToId } = buildLexiconIndex(lexRoots);
  // إحالات دروس لم تُحلّ — تُقرَّر ولا تُصمت عنها (كلمات بلا مدخل معجمي أصلًا)
  const unresolvedVocabRefs = [];
  // روابط الدرس↔المفردات تُنفَّذ بعد إدخال المفردات (قيد المفتاح الأجنبي يمنع غير ذلك)
  const deferredVocabLinks = [];
  // VER-04: الروابط بصيغة منظمة أيضًا — ليتحقق المستورِد من المنفَّذ فعليًا
  // ويعيد تنفيذها في مرور نهائي بعد كل المجلدات (لا اعتماد على الترتيب)
  const structuredLinks = [];
  const errors = [];
  const counters = { programs: 0, units: 0, lessons: 0, versions: 0, exercises: 0, options: 0, items: 0, vocab: 0, senses: 0, tags: 0 };

  const mergedPrograms = pathFiles.flatMap(f => load(f).programs ?? []);
  if (mergedPrograms.length) {
    mergedPrograms.forEach((program, pIdx) => {
      const programId = stableId('prog', program.slug);
      statements.push(`INSERT INTO programs (id, slug, title_ar, description_ar, kind, level_code, category, status, sort_order, is_active)
        VALUES (${q(programId)}, ${q(program.slug)}, ${q(program.titleAr)}, ${q(program.objectiveAr ?? '')},
                ${q(program.kind ?? 'path')}, ${q(program.levelCode)}, ${q(program.category)},
                'draft', ${n(program.sortOrder ?? pIdx + 1)}, 1)
        ON CONFLICT(id) DO UPDATE SET title_ar=excluded.title_ar, description_ar=excluded.description_ar`);
      counters.programs++;

      (program.units ?? []).forEach((unit, uIdx) => {
        const unitId = stableId('unit', `${program.slug}/${unit.slug}`);
        statements.push(`INSERT INTO units (id, program_id, level_code, slug, title_ar, objective_ar, sort_order, status)
          VALUES (${q(unitId)}, ${q(programId)}, ${q(unit.levelCode ?? null)}, ${q(unit.slug)},
                  ${q(unit.titleAr)}, ${q(unit.objectiveAr ?? '')}, ${n(unit.sortOrder ?? uIdx + 1)}, 'draft')
          ON CONFLICT(id) DO UPDATE SET title_ar=excluded.title_ar, sort_order=excluded.sort_order`);
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

  for (const file of lessonFiles) {
    const L = load(file).lesson;
    if (!L?.slug) { errors.push(`درس بلا slug في ${file}`); continue; }

    for (const ex of L.exercises ?? []) {
      if (!EXERCISE_TYPES.has(ex.type)) errors.push(`نوع تمرين غير معرَّف: ${ex.type} (${file})`);
      if (!ex.explanationAr || String(ex.explanationAr).trim().length < 10) errors.push(`تمرين ${ex.id} بلا شرح عربي كافٍ (${file})`);
    }

    const programSlug = L.programSlug ?? 'main-track';
    const programId = stableId('prog', programSlug);
    const unitId = stableId('unit', `${programSlug}/${L.unitSlug}`);
    const lessonId = stableId('lesson', L.slug);
    const contentHash = sha256(JSON.stringify(L));
    // رقم الإصدار يجيء من القاعدة (يمرّره المستدعي). بلا ذلك يبقى 1 — وهو الصحيح
    // فقط عند أول استيراد أو في بيئة اختبار فارغة.
    const prior = existingVersions[L.slug];
    const versionNo = prior && prior.contentHash !== contentHash ? prior.versionNo + 1 : (prior?.versionNo ?? 1);
    const versionId = stableId('lv', `${L.slug}#${versionNo}#${contentHash.slice(0, 12)}`);

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
                'draft', ${j(unlockRule)}, ${j(L.mastery ?? {})},
                ${n(L.offlinePriority ?? 0)}, 1)
        ON CONFLICT(id) DO UPDATE SET
          title_ar=excluded.title_ar, objective_ar=excluded.objective_ar, estimated_minutes=excluded.estimated_minutes,
          skills_json=excluded.skills_json, unlock_rule_json=excluded.unlock_rule_json,
          mastery_criteria_json=excluded.mastery_criteria_json`);
    counters.lessons++;

    statements.push(`INSERT INTO lesson_versions (id, lesson_id, version_no, status, content_json, content_hash, change_summary, review_state)
        VALUES (${q(versionId)}, ${q(lessonId)}, ${n(versionNo)}, 'draft', ${j(L)}, ${q(contentHash)},
                ${q('استيراد من ' + file)}, 'unreviewed')
        ON CONFLICT(id) DO NOTHING`);
    statements.push(`UPDATE lessons SET current_version_id = ${q(versionId)} WHERE id = ${q(lessonId)}`);
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
    statements.push(`INSERT INTO vocabulary_bundles (id, slug, title_ar, level_code, sort_order, status, source_id, notes_ar)
        VALUES (${q(bundleId)}, ${q(bundle.bundleSlug)}, ${q(bundle.titleAr ?? bundle.bundleSlug)},
                ${q(bundle.levelCode ?? bundle.entries?.[0]?.level ?? null)}, ${n(bundle.sortOrder ?? 0)},
                'draft', ${q(sourceId)}, ${q(bundle.rankingNoteAr ?? bundle.source?.rankingNote ?? null)})
        ON CONFLICT(slug) DO UPDATE SET title_ar=excluded.title_ar, notes_ar=excluded.notes_ar`);
    counters.bundles = (counters.bundles ?? 0) + 1;

    for (const [eIdx, entry] of (bundle.entries ?? []).entries()) {
      // المعرّف مشتق من الكلمة نفسها لا من الحزمة: نفس الكلمة في حزمتين = صف واحد
      // يُعاد استخدامه بدل تكرار الشرح (قاعدة crossTrackRules في المنهج).
      const entryId = stableId('voc', entry.normalized);
      statements.push(`INSERT INTO vocabulary_entries (id, headword_es, headword_normalized, entry_kind, pos, gender, plural_es,
                                          level_code, frequency_rank, frequency_source_id, ipa, pronunciation_hint_ar,
                                          register, status, notes_ar)
          VALUES (${q(entryId)}, ${q(entry.headword)}, ${q(entry.normalized)}, ${q(entry.kind ?? 'word')},
                  ${q(entry.pos ?? null)}, ${q(entry.gender ?? null)}, ${q(entry.plural ?? null)}, ${q(entry.level ?? null)},
                  ${n(entry.internalRank ?? null)}, ${q(sourceId)}, ${q(entry.ipa ?? null)},
                  ${q(entry.pronunciationHintAr ?? null)}, ${q(entry.register ?? 'neutral')}, 'draft', ${q(entry.variantNoteAr ?? null)})
          ON CONFLICT(headword_normalized) DO UPDATE SET headword_es=excluded.headword_es, ipa=excluded.ipa,
            pronunciation_hint_ar=excluded.pronunciation_hint_ar, level_code=excluded.level_code`);
      counters.vocab++;

      statements.push(`INSERT INTO vocabulary_bundle_entries (bundle_id, entry_id, sort_order)
          VALUES (${q(bundleId)}, ${q(entryId)}, ${n(eIdx + 1)})
          ON CONFLICT(bundle_id, entry_id) DO NOTHING`);

      (entry.senses ?? []).forEach((sense) => {
        const senseId = stableId('sen', `${bundle.bundleSlug}/${entry.normalized}/${sense.senseNo}`);
        // AUD-09: جدول sentences كان يبقى فارغًا وexample_sentence_id كله NULL
        // فظهرت كل بطاقة مراجعة بلا مثال. المثال بملف المفردات نفسه — يُستورَد
        // الآن كجملة + ترجمتها ويُربط بالمعنى قبل إدخال المعنى (FK).
        let exampleSentenceId = null;
        const exampleEs = typeof sense.exampleEs === 'string' ? sense.exampleEs.trim() : '';
        if (exampleEs) {
          exampleSentenceId = stableId('snt', `vocab-example:${entry.normalized}:${sense.senseNo ?? 1}`);
          const SREG = new Set(['neutral', 'informal', 'formal', 'colloquial_spain', 'colloquial_latam']);
          const sReg = SREG.has(entry.register) ? entry.register : 'neutral';
          statements.push(`INSERT INTO sentences (id, text_es, level_code, register, source_id)
              VALUES (${q(exampleSentenceId)}, ${q(exampleEs)}, ${q(entry.level ?? null)}, ${q(sReg)}, ${q(sourceId)})
              ON CONFLICT(id) DO UPDATE SET text_es=excluded.text_es, level_code=excluded.level_code`);
          for (const [style, text] of [['fusha', sense.exampleAr], ['eg', sense.exampleArEg]]) {
            if (typeof text === 'string' && text.trim()) {
              statements.push(`INSERT INTO sentence_translations (id, sentence_id, locale, style, text, is_primary)
                  VALUES (${q(stableId('snt', `vocab-example:${entry.normalized}:${sense.senseNo ?? 1}:${style}`))},
                          ${q(exampleSentenceId)}, 'ar', ${q(style)}, ${q(text.trim())}, ${style === 'fusha' ? 1 : 0})
                  ON CONFLICT(sentence_id, locale, style) DO UPDATE SET text=excluded.text`);
            }
          }
          counters.sentences = (counters.sentences ?? 0) + 1;
        }
        statements.push(`INSERT INTO vocabulary_senses (id, entry_id, sense_no, meaning_ar_fusha, meaning_ar_eg, gloss_es, register, usage_note_ar, common_error_ar, example_sentence_id)
            VALUES (${q(senseId)}, ${q(entryId)}, ${n(sense.senseNo ?? 1)}, ${q(sense.meaningArFusha)},
                    ${q(sense.meaningArEg ?? null)}, ${q(sense.glossEs ?? null)}, ${q(entry.register ?? 'neutral')},
                    ${q(sense.usageNoteAr ?? null)}, ${q(sense.commonErrorAr ?? null)}, ${q(exampleSentenceId)})
            ON CONFLICT(entry_id, sense_no) DO UPDATE SET meaning_ar_fusha=excluded.meaning_ar_fusha,
              meaning_ar_eg=excluded.meaning_ar_eg, usage_note_ar=excluded.usage_note_ar, common_error_ar=excluded.common_error_ar,
              example_sentence_id=excluded.example_sentence_id`);
        counters.senses++;
      });

      for (const tagName of entry.tags ?? []) {
        const tagSlug = tagName.trim().replace(/\s+/g, '-');
        const tagId = stableId('tag', tagSlug);
        statements.push(`INSERT INTO vocabulary_tags (id, slug, name_ar) VALUES (${q(tagId)}, ${q(tagSlug)}, ${q(tagName)}) ON CONFLICT(slug) DO NOTHING`);
        statements.push(`INSERT INTO vocabulary_tag_links (entry_id, tag_id) VALUES (${q(entryId)}, ${q(tagId)}) ON CONFLICT(entry_id, tag_id) DO NOTHING`);
        counters.tags++;
      }
    }
  }

  statements.push(...deferredVocabLinks);

  return { statements, answers, counters, errors, unresolvedVocabRefs, links: structuredLinks, linkStatements: deferredVocabLinks };
}
