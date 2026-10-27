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
export function buildContentPlan(dir, { existingVersions = {} } = {}) {
  // مسح متكرر: المحتوى مُنظَّم في مجلدات فرعية (a1/، travel/، …)، ودمج كل ملفات
  // paths.json يسمح لكل وحدة بإعلان مسارها دون ملف مركزي هش.
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap(ent => {
    const full = join(d, ent.name);
    if (ent.isDirectory()) return walk(full);
    return ent.name.endsWith('.json') ? [full] : [];
  });
  const allFiles = walk(dir);
  const pathFiles = allFiles.filter(f => basename(f) === 'paths.json');
  const vocabFiles = allFiles.filter(f => basename(f).startsWith('vocab-'));
  const lessonFiles = allFiles.filter(f => basename(f).startsWith('lesson-'));
  const load = (f) => JSON.parse(readFileSync(f, 'utf8'));

  const statements = [];
  const answers = {}; // معرّف التمرين في القاعدة ⇒ الإجابة الصحيحة (للاختبارات فقط)
  // خريطة الكلمة ⇒ معرّفها، مبنية من كل الحزم قبل معالجة الدروس حتى تُربط
  // مفردات الدرس بمدخلاتها الفعلية.
  const vocabIdByNormalized = new Map();
  // روابط الدرس↔المفردات تُنفَّذ بعد إدخال المفردات (قيد المفتاح الأجنبي يمنع غير ذلك)
  const deferredVocabLinks = [];
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

  const formToEntry = new Map(); // formNorm -> entryId (غير ملتبس فقط)
  for (const [formNorm, owners] of formOwners) {
    if (owners.size !== 1) continue; // صيغة مشتركة بين مدخلين (fui: ser/ir) — لا تخمين
    if (vocabIdByNormalized.has(formNorm)) continue; // كلمة قائمة بذاتها تتغلب
    if (FORM_LINK_BLOCKLIST.has(formNorm)) continue; // معنى آخر في الدرس — قرار بشري
    formToEntry.set(formNorm, [...owners][0]);
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
              // نص النطق الذي كتبه المؤلف — يُحفظ كما هو؛ الخادم لا يشتق
              // speechEs من مفتاح الإجابة، فبدون هذا الحقل تضيع أصوات مؤلفة.
              speechEs: ex.speechEs ?? null,
            })}, ${j(answerKey)}, ${q(ex.explanationAr)}, ${j(errorFeedback)},
            ${n(ex.difficulty ?? 2)}, ${j(ex.skills ?? [])}, ${j({ audioKey: ex.audioKey ?? null })}, ${n(idx + 1)})
            ON CONFLICT(id) DO UPDATE SET prompt_json=excluded.prompt_json, answer_key_json=excluded.answer_key_json,
              explanation_ar=excluded.explanation_ar, error_feedback_json=excluded.error_feedback_json`);
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
        const norm = String(wRaw).toLowerCase().trim();
        // تطابق حرفي أولًا، ثم صيغة غير ملتبسة من vocabulary_forms (forms[]/plural).
        const entryId = vocabIdByNormalized.get(norm) ?? formToEntry.get(norm);
        if (!entryId) continue; // مفردة غير موجودة في حزم هذا المجلد — تحذير في المدقق
        deferredVocabLinks.push(`INSERT INTO lesson_vocabulary (lesson_id, entry_id, role)
            VALUES (${q(lessonId)}, ${q(entryId)}, ${q(role)}) ON CONFLICT(lesson_id, entry_id) DO NOTHING`);
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
        statements.push(`INSERT INTO vocabulary_senses (id, entry_id, sense_no, meaning_ar_fusha, meaning_ar_eg, gloss_es, register, usage_note_ar, common_error_ar)
            VALUES (${q(senseId)}, ${q(entryId)}, ${n(sense.senseNo ?? 1)}, ${q(sense.meaningArFusha)},
                    ${q(sense.meaningArEg ?? null)}, ${q(sense.glossEs ?? null)}, ${q(entry.register ?? 'neutral')},
                    ${q(sense.usageNoteAr ?? null)}, ${q(sense.commonErrorAr ?? null)})
            ON CONFLICT(entry_id, sense_no) DO UPDATE SET meaning_ar_fusha=excluded.meaning_ar_fusha,
              meaning_ar_eg=excluded.meaning_ar_eg, usage_note_ar=excluded.usage_note_ar, common_error_ar=excluded.common_error_ar`);
        counters.senses++;
      });

      for (const tagName of entry.tags ?? []) {
        const tagSlug = tagName.trim().replace(/\s+/g, '-');
        const tagId = stableId('tag', tagSlug);
        statements.push(`INSERT INTO vocabulary_tags (id, slug, name_ar) VALUES (${q(tagId)}, ${q(tagSlug)}, ${q(tagName)}) ON CONFLICT(slug) DO NOTHING`);
        statements.push(`INSERT INTO vocabulary_tag_links (entry_id, tag_id) VALUES (${q(entryId)}, ${q(tagId)}) ON CONFLICT(entry_id, tag_id) DO NOTHING`);
        counters.tags++;
      }

      // تعبئة vocabulary_forms من المصدر نفسه (forms[] + plural في ملف الحزمة):
      // الجدول كان ميتًا (DDL فقط بلا كتابة ولا قراءة)؛ الآن هو مصدر حقيقة
      // الصيغ للربط الاحتياطي أعلاه. إزالة تكرار داخل الخطة (نفس الصيغة
      // لشخصين) بمفتاح كامل؛ وعند إعادة الاستيراد يحمي ON CONFLICT(id).
      const seenForms = new Set();
      const emitForm = (kind, formEs, tense, mood, person, irregular) => {
        const key = `${entryId}|${kind}|${formEs}|${tense ?? ''}|${mood ?? ''}|${person ?? ''}`;
        if (seenForms.has(key)) return;
        seenForms.add(key);
        const formId = stableId('vfm', `${entry.normalized}/${kind}/${formEs}/${tense ?? ''}/${mood ?? ''}/${person ?? ''}`);
        statements.push(`INSERT INTO vocabulary_forms (id, entry_id, form_kind, form_es, tense, mood, person, is_irregular)
            VALUES (${q(formId)}, ${q(entryId)}, ${q(kind)}, ${q(formEs)}, ${q(tense ?? null)}, ${q(mood ?? null)}, ${q(person ?? null)}, ${n(irregular ? 1 : 0)})
            ON CONFLICT(id) DO NOTHING`);
        counters.forms = (counters.forms ?? 0) + 1;
      };
      for (const f of entry.forms ?? []) {
        if (!f?.formEs || !['conjugation', 'plural', 'feminine', 'participle', 'gerund', 'diminutive'].includes(f.kind)) continue;
        emitForm(f.kind, f.formEs, f.tense ?? null, f.mood ?? null, f.person ?? null, f.irregular);
      }
      if (entry.plural) emitForm('plural', entry.plural, null, null, null, false);
    }
  }

  statements.push(...deferredVocabLinks);

  return { statements, answers, counters, errors };
}
