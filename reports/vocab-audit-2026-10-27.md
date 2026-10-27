# Vocabulary-reference audit — recomputed from scratch (READ-ONLY)

**Compliance:** No file was modified, no mutating git command was run, no `wrangler` command was run, no package was installed. All analysis was done with read-only file reads and throwaway scripts in `/tmp` (audit scripts wrote only to `/tmp/vocab_audit.json`, `/tmp/vocab_final.json`, `/tmp/vocab_ctx2.json`). The actual importer was executed in-memory only (`node -e` importing `tools/lib/content-plan.mjs`, no writes) to verify statement counts. Working copy state was taken as given (detached HEAD `188e0ec8`, prior round's uncommitted changes untouched).

**Scope:** `content/drafts/**` only for the headline counts (212 lessons, 53 vocab bundles). `content/exemplars` audited separately (§7). Lesson files are `lesson-*.json`; vocab files are `vocab-*.json`.

## 1. Method — how matching actually works (verified from code, not assumed)

**The importer** (`tools/lib/content-plan.mjs`, `linkVocab`) normalizes a lesson reference as:

```js
const norm = String(wRaw).toLowerCase().trim();
const entryId = vocabIdByNormalized.get(norm);
if (!entryId) continue; // silently skipped, no error, no warning
```

The lookup map is keyed on `entry.normalized` **verbatim** as stored in the vocab bundles. There is **no** accent stripping, **no** punctuation stripping, **no** whitespace collapsing, **no** form/plural fallback. Entries without a `normalized` field are not indexed at all (there are none — 0 of 8,046).

**The validator** (`tools/validate-content.mjs`) uses a *different* normalization — `normVocab`: lowercase + strip `¿?¡!.,;:"'«»()…` + collapse whitespace — and runs **per directory** (`--dir`, non-recursive, vocab map built from that directory's vocab files only). Folders `a2/b1/b2/c1` contain **zero** `vocab-*.json` files, so every reference in those folders warns, while cross-folder matches are invisible. This is why per-folder validator output cannot be summed into a global unresolved count.

**`count-lexicon.mjs`** counts unique `normalized` values globally (8,046, 0 duplicates, 0 missing `normalized`, 0 cases where `normalized ≠ normVocab(headword)`).

**Three reference channels exist in lesson files** (all string arrays per `content/schema/*.json`):
- `lesson.newVocabulary[]` (1,304 refs) and `lesson.reviewVocabulary[]` (576 refs) — the **only** channels the importer links (`lesson_vocabulary` rows → SRS cards).
- `exercise.targetVocab[]` (2,556 refs) — checked by the validator, **completely ignored by the importer** (0 links ever, even when resolved).

**Context evidence:** for each unresolved string I searched, accent-insensitively with word boundaries, the checked sentence fields of all 212 lessons (scenario lines, exercise `stemEs`, option text, `answerKey.accepted`) plus all vocab sense examples (`exampleEs`/`exampleAr`). Three substring-only sense-example hits were rejected as noise after token verification (`estructurar` matched inside *reestructurar*; `matiz` inside *aromatiza*; `poner con` inside *presuponer con*) — those three are counted as unattested. Context quoted below is the first attesting sentence found (occurrence lessons first); "token-only" means the word appears only as a bare option/accepted-answer token, with no sentence.

**Classification precedence applied** (exactly one bucket each): malformed → (a) normalization-variant → (b) form/inflection → (c) phrase, all tokens exist → (e) typo (strong evidence only, see §5e) → (d) genuinely absent → (f) only on positive non-lexical evidence. Where a string matched both (a) and (b) (`bebe`), lesson context decided the bucket and the competing match is flagged.

## 2. Recomputed headline numbers — prior claim CONFIRMED, with two corrections

| Measure | Recomputed | Prior claim |
|---|---|---|
| Total lesson vocab references (all 3 channels, drafts) | **4,436** | 4,436 ✓ |
| of which `new` / `review` / `targetVocab` | 1,304 / 576 / 2,556 | — |
| Distinct reference strings (importer normalization) | 1,146 | — |
| Distinct **unresolved** strings | **525** | 525 ✓ |
| Unresolved occurrences | **1,717** (588 in `new`/`review`, 1,129 in `targetVocab`) | — |
| Resolved occurrences in `new`/`review` | 1,292 | — |
| `lesson_vocabulary` INSERT statements (actual `buildContentPlan('content/drafts')`) | **1,292** | 1,292 ✓ |
| **Distinct (lesson, entry) pairs actually created** | **1,291** | 1,292 (statements, not rows — see below) |
| Distinct unresolved strings occurring in `new`/`review` (i.e. blocking an SRS link) | 524 of 525 | — |
| Per-folder validator unresolved-distinct sum (recomputed) | 1,264 | 1,264 ✓ (an artefact of per-folder scoping, **not** the global count) |

**Correction 1 — links:** the importer emits 1,292 link statements but only **1,291** distinct rows survive `ON CONFLICT DO NOTHING`: lesson `tr-u1-problem-luggage` lists `equipaje` in both `newVocabulary` and `reviewVocabulary`. Harmless duplicate.

**Correction 2 — cross-scope:** draft references resolve against the drafts lexicon exactly as against the combined (drafts+exemplars) lexicon — **zero** draft refs resolve only via an exemplar entry. The separate-plan import (`import-content.mjs` builds one plan per directory) therefore loses no draft links today. Exemplar lessons are a separate matter (§7).

**No references by id:** all 4,436 refs are plain strings. Zero non-string refs, zero `voc_*`/`lesson_*` ids, zero Arabic-script refs. Every lesson file uses string vocab lists, as the schema requires.

## 3. Lexicon, `forms[]`, and the `vocabulary_forms` table

- **Lexicon:** 53 bundles, 8,046 rows = 8,046 unique `normalized` values, 0 duplicates, 0 missing `normalized`. Every entry's `normalized` equals `normVocab(headword)`.
- **Bundles DO contain `forms[]`:** 1,365 of 8,046 entries (17.0%) have `forms`, totalling **51,798 form rows**; 46,460 distinct lowercase form strings. Kinds: `conjugation` 49,068, `gerund` 1,363, `participle` 1,363, `feminine` 2, `plural` 2. **Every verb entry (1,363/1,363) has exactly 38 forms**: 6 persons × 5 indicative tenses (presente, pretérito, imperfecto, futuro, condicional) + 6 subjuntivo presente + gerund + participle. **No verb entry records any imperfecto de subjuntivo form** (`tuviera`, `cantara`, …), no compound perfects, no imperatives as such. 4,042 entries also carry a `plural` field (separate from `forms[]`).
- **73 form strings map to more than one lemma** (homograph conjugations, e.g. `fui` → ser/ir, `visto` → ver participle / vestir 1s). Form-matching without context is therefore unsafe.
- **`vocabulary_forms` is written by nothing and read by nothing.** The table exists only as DDL (`db/migrations/0001_init.sql:305`, index at :316). Grep over `src/`, `tools/`, `tests/` finds no other mention. `tools/lib/content-plan.mjs` never inserts into it. The **only** consumer of form data anywhere is the static search index: `src/shared/search-index.json` (`forms`: 44,406 distinct accent-stripped form keys → lemma headwords; stats `vocabCount 8046, formsCount 44406, lessonsCount 212`), consumed by `src/shared/search-engine.ts:308` for verb-form lookup. Populating `vocabulary_forms` is therefore a *new* data pipeline, not a repair of an existing one — and it is only worth doing if the importer/worker is changed to use it (see §6).
- **Missing lemma — `haber`:** there is **no `haber` entry at all** in the drafts lexicon, although the perfecto lessons teach it. Its forms `he, has, ha, hemos, habéis, han` are all unresolved (§5d, tagged). Other checked missing lemmas: `amanecer`, `especializar`, `estancar`, `ceñir`, `soler` have no entry (their reflexive/derived refs are in (d), not (b)).

## 4. Bucket summary and fix-safety matrix

| Bucket | Distinct | Occurrences | In `new`/`review` (occ) | Fix route |
|---|---|---|---|---|
| (a) normalization variant | **3** | 15 | 5 | **Mechanical, safe** — normalize the 3 ref strings to the entry's `normalized` (or teach the importer the validator's punctuation-strip; do NOT blanket-strip accents) |
| (b) inflected form of an existing lemma | **68** | 208 | 74 | Split — see subverdicts below. **19 homographs must NOT be linked to the verb lemma** |
| (c) phrase, all words exist separately | **36** | 110 | 36 | **Human decision per phrase** — add a phrase entry vs link components vs drop the ref. Component-linking is mechanical but loses idiom meaning |
| (d) genuinely absent | **403** | 1,333 | 458 | **New entries needed — human/linguistic review.** 354 have sentence/sense attestation; **49 have no attestation at all** (listed in §5d) |
| (e) typo / malformed | **0** | 0 | 0 | Nothing to fix. Edit-distance "typos" were tested and rejected (§5e) |
| (f) other (non-lexical) | **15** | 51 | 15 | **Remove/replace the refs** (or move to grammar notes) — no lexicon entries. Human/content decision |
| **Total** | **525** | **1,717** | **588** | |

**(b) subverdicts** (68): `VERB` single-lemma verb-form use **32** · `PLURAL-FIELD` **6** · `MORPH-VARIANT` **5** · `VERB-REFLEXIVE` **2** · `VERB-PARADIGM-GAP` **1** · `VERB-LOOSE` (accent-variant of a form) **1** · `HOMOGRAPH-NEEDS-NEW-ENTRY` **17** · `HOMOGRAPH-FUNCTION` **2** · `AMBIG-MULTI-LEMMA` **1** (`fui`) · `AMBIG-NO-CONTEXT` **1** (`anhelo`).

**Mechanical-safe fixes (no new linguistic content):** (a) all 3 · (b) `VERB` 32 + `PLURAL-FIELD` 6, *conditional on* populating `vocabulary_forms` (from `forms[]` + `plural` fields) and adding an importer fallback to it — the per-string mapping is already verified, the mechanism is not yet built · (b) `MORPH-VARIANT` 4 of 5 (feminine/variant form rows; `normativa` needs a noun-sense decision) · (b) `VERB-REFLEXIVE` 2 + `VERB-PARADIGM-GAP` 1, conditional on extending the recorded paradigm (reflexive infinitives; imperfecto de subjuntivo derivable from the recorded pretérito 3p stem — still needs a linguist spot-check for irregulars).

**Needs a human decision:** (b) homographs 19 + ambiguous 2 · (b) `VERB-LOOSE` 1 (accent policy) · (c) all 36 · (d) all 403 (entries must be authored; meanings must not be invented — use the quoted in-project sentences) · (f) all 15 (remove vs keep-as-grammar-note).

**Must NOT be done:** blanket accent-insensitive matching (would merge `papa/papá`, `sí/si`, `año/ano`); linking homograph refs to their verb-form lemma (19 cases — would teach the wrong word); deleting refs or adding invented entries just to reach zero unresolved; treating `targetVocab` as linked (it never is — fixing it requires an importer change, not content edits).

File paths below: lesson files are `content/drafts/<folder>/lesson-<slug>.json` with folder = `a1|a2|b1|b2|c1|travel` (`tr-*` slugs) / `callcenter` (`cc-*` slugs). Entry files are given for (a)/(b) matches. Occurrence counts are `occ total (new/review/target)`.

## 5. Full classified list

### (a) Exact match under different normalization — 3 distinct, 15 occurrences — MECHANICAL, SAFE

- `¿de dónde?` — occ 7 (1/2/4) — a1-origen-de-donde-eres, a1-presentar-a-otro, a1-saludos-formalidad → entry `de dónde` (headword `¿de dónde?`), `content/drafts/a1/vocab-a1-u1-origen.json`. Ref carries `¿?` punctuation; the entry's `normalized` strips it. Fix: write the ref as `de dónde`.
- `¿cómo está usted?` — occ 5 (1/0/4) — a1-saludos-formalidad → entry `cómo está usted` (headword `¿cómo está usted?`), `content/drafts/a1/vocab-a1-u2-saludos.json`. Same punctuation cause.
- `talon` — occ 3 (1/0/2) — c1-metaforas-vida-cultura → entry `talón`, `content/drafts/core-vocab/vocab-cv-nouns-society-culture.json`. Accent-only difference, no ñ-risk, no competing form. Fix: write the ref as `talón`. (Do not generalize to accent-insensitive matching — this is a verified single-string mapping.)

### (b) Conjugated / inflected form of an existing lemma — 68 distinct, 208 occurrences

`[VERB]` = context shows genuine verb-form use, single lemma — link via `vocabulary_forms` once populated. `[PLURAL-FIELD]` = plural recorded in the entry's `plural` field (importer ignores it today). `[MORPH-VARIANT]` = feminine/variant form not recorded anywhere. `[HOMOGRAPH-*]` = **do NOT link to the named lemma** — lesson uses a different word; a new entry is needed. `[AMBIG-*]` = human must decide.

- `acuerdo` — 10 (3/1/6) — b1-acuerdo-desacuerdo, b1-conversacion-profesional, b2-concesiones-condiciones-mutuas, b2-pasiva-periodistica-se — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `acordar` — noun in fixed `de acuerdo` (agreement).
- `argumento` — 8 (3/0/5) — b1-debate-educacion, b2-conectores-argumentativos, b2-contraargumentacion — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `argumentar` — noun "argument".
- `como` — 6 (1/0/5) — a2-comparativos-igualdad — [HOMOGRAPH-FUNCTION] lemma `comer` — conjunction "as/like" ("…caro como el del centro").
- `duele` — 5 (1/0/4) — a1-doler — [VERB] `doler` 3s presente.
- `idiomas` — 5 (1/1/3) — a1-presentacion-profesional, a2-hablar-de-experiencias — [PLURAL-FIELD] `idioma`.
- `para` — 5 (1/0/4) — b1-por-vs-para — [HOMOGRAPH-FUNCTION] lemma `parar` — preposition "for" ("Vine a Madrid para estudiar…").
- `asombro` — 4 (1/0/3) — c1-realismo-magico — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `asombrar` — noun "amazement" ("un asombro infinito").
- `bebe` — 4 (1/0/3) — a2-imperativo-salud — [VERB] `beber` — imperative ("bebe mucha agua"). Competing entry `bebé` (baby) is a false friend: **must NOT be linked**.
- `come` — 4 (1/0/3) — a2-imperativo-salud — [VERB] `comer` — imperative.
- `dispararse` — 4 (1/0/3) — b2-descripcion-graficos-tendencias — [VERB-REFLEXIVE] `disparar` — reflexive infinitive; no reflexive forms are recorded anywhere.
- `expone` — 4 (1/0/3) — b2-reclamaciones-juridicas-instancias — [VERB] `exponer` 3s ("el solicitante expone…").
- `fui` — 4 (1/0/3) — a2-indefinido-irregular — [AMBIG-MULTI-LEMMA] `ser`/`ir` — shared pretérito form; lesson teaches both ("Fui al cine" = ir; "fue divertida" = ser). Cannot link to one lemma mechanically.
- `inconvenientes` — 4 (1/0/3) — b1-agradecimiento-disculpa — [PLURAL-FIELD] `inconveniente`.
- `normativa` — 4 (1/0/3) — b2-politicas-ambientales-subjuntivo — [MORPH-VARIANT] `normativo` — feminine **noun** "la normativa" = regulation ("La normativa medioambiental exige…", AR: "تلزم اللائحة البيئية…"). Meaning derivable from the lesson sentence; needs a noun-sense decision, not a bare adjective form row.
- `promulgado` — 4 (1/0/3) — b2-pasiva-periodistica-se — [VERB] `promulgar` participle.
- `prácticas` — 4 (1/0/3) — b1-planes-academicos — [PLURAL-FIELD] `práctica`.
- `reunido` — 4 (1/0/3) — a2-mensajes-recados — [VERB] `reunir` participle.
- `tuviera` — 4 (1/0/3) — b2-condicional-imperfecto-subjuntivo — [VERB-PARADIGM-GAP] `tener` — imperfecto de subjuntivo; tense recorded for **no** verb entry (see §3).
- `vivido` — 4 (1/0/3) — a2-perfecto-formacion — [VERB] `vivir` participle.
- `anhelo` — 3 (1/0/2) — b1-ojala-deseos — [AMBIG-NO-CONTEXT] lemma `anhelar?` — appears only in vocab lists/`targetVocab`, never in a sentence; noun "longing" vs verb form "I long for" undecidable from text.
- `cabria` — 3 (1/0/2) — c1-atenuacion-academica — [VERB-LOOSE] `caber` — ref lacks the accent; recorded form is `cabría` (condicional). Sentence: "cabría sugerir una correlación preliminar…" (AR: "يمكننا أن نقترح بحذر…"). Needs the accent-policy decision.
- `cerrada` — 3 (1/0/2) — c1-refranes-pensamiento — [MORPH-VARIANT] `cerrado` — feminine adjective in "en boca cerrada no entran moscas".
- `comido` — 3 (1/0/2) — a2-perfecto-formacion — [VERB] `comer` participle ("Hoy he comido…").
- `contraste` — 3 (1/0/2) — a2-contrastes-culturales — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `contrastar` — noun "contrast".
- `debate` — 3 (1/0/2) — b1-debate-educacion — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `debatir` — noun "debate".
- `debes` — 3 (1/0/2) — a2-dar-consejos-deber — [VERB] `deber` 2s.
- `descansa` — 3 (1/0/2) — a2-imperativo-salud — [VERB] `descansar` ("Duerme ocho horas y descansa bien").
- `duerme` — 3 (1/0/2) — a2-imperativo-salud — [VERB] `dormir`.
- `enfoque` — 3 (1/0/2) — b2-estructura-ensayo-academico — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `enfocar` — noun "approach/focus".
- `era` — 3 (1/0/2) — a2-imperfecto-habitos — [VERB] `ser` imperfecto ("Cuando yo era niño…").
- `estimado` — 3 (1/0/2) — c1-correspondencia-formal — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `estimar` — adjective in salutation "Estimado Sr. Director", not participle use.
- `gastos` — 3 (1/0/2) — a2-alquilar-piso — [PLURAL-FIELD] `gasto`.
- `gorda` — 3 (1/0/2) — c1-modismos-cultos — [MORPH-VARIANT] `gordo` — feminine adjective in idiom "vista gorda".
- `iba` — 3 (1/0/2) — a2-imperfecto-habitos — [VERB] `ir` imperfecto ("Todos los días iba a la escuela…").
- `logro` — 3 (1/0/2) — b1-curriculum-competencias — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `lograr` — noun "achievement".
- `quizás` — 3 (1/0/2) — b1-expresar-duda-probabilidad — [MORPH-VARIANT] `quizá` — accepted spelling variant of the adverb (with -s). Human to confirm variant handling (alias vs own entry).
- `segunda` — 3 (1/0/2) — a1-direcciones — [MORPH-VARIANT] `segundo` — feminine ordinal.
- `solicita` — 3 (1/0/2) — b2-reclamaciones-juridicas-instancias — [VERB] `solicitar` — formulaic heading "SOLICITA:"; the word is the verb form.
- `sublime` — 3 (1/0/2) — c1-traduccion-literaria — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `sublimar` — adjective "sublime" ("emoción sublime").
- `vertido` — 3 (1/0/2) — b2-politicas-ambientales-subjuntivo — [VERB] `verter` participle.
- `viajaría` — 3 (1/0/2) — b2-condicional-imperfecto-subjuntivo — [VERB] `viajar` condicional ("Si tuviera ese dinero, viajaría…").
- `alojarse` — 2 (0/1/1) — b1-alojamiento-alternativo — [VERB-REFLEXIVE] `alojar` — reflexive infinitive.
- `apuntan` — 2 (1/0/1) — c1-atenuacion-academica — [VERB] `apuntar` 3p ("Los datos obtenidos apuntan a una mejoría…").
- `cambio` — 2 (1/0/1) — b2-conectores-argumentativos — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `cambiar` — noun "change" ("el cambio").
- `comunicado` — 2 (1/0/1) — c1-diplomacia-multilateral — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `comunicar` — noun "statement/communiqué" ("El comunicado final…").
- `debe` — 2 (1/0/1) — a2-dar-consejos-deber — [VERB] `deber` 3s.
- `depende` — 2 (1/0/1) — b1-acuerdo-desacuerdo — [VERB] `depender` ("Bueno, depende de cada persona…").
- `dicho` — 2 (1/0/1) — a2-participios-irregulares — [VERB] `decir` participle ("El jefe ha dicho la verdad").
- `duelen` — 2 (1/0/1) — a1-doler — [VERB] `doler` 3p.
- `escrito` — 2 (1/0/1) — a2-participios-irregulares — [VERB] `escribir` participle.
- `estudio` — 2 (0/2/0) — b1-planes-academicos, b2-estructura-ensayo-academico — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `estudiar` — noun "study" ("objeto de estudio").
- `estuve` — 2 (1/0/1) — a2-indefinido-irregular — [VERB] `estar` pretérito ("Estuve en casa de mis padres…").
- `evita` — 2 (1/0/1) — a2-imperativo-salud — [VERB] `evitar`.
- `hablado` — 2 (1/0/1) — a2-perfecto-formacion — [VERB] `hablar` participle ("he hablado con el profesor…").
- `hablo` — 2 (1/0/1) — a1-presentacion-profesional — [VERB] `hablar` 1s.
- `hechos` — 2 (1/0/1) — b1-hoja-reclamaciones — [PLURAL-FIELD] `hecho`.
- `hice` — 2 (1/0/1) — a2-indefinido-irregular — [VERB] `hacer` pretérito (lesson topic; no sentence attestation in checked fields).
- `incremento` — 2 (1/0/1) — c1-nominalizacion — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `incrementar` — noun "increase" ("un notable incremento").
- `mareo` — 2 (1/0/1) — a2-sintomas-medico — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `marear` — noun "dizziness" (symptom; domain evidence, human to confirm the entry meaning).
- `moscas` — 2 (1/0/1) — c1-refranes-pensamiento — [PLURAL-FIELD] `mosca` ("en boca cerrada no entran moscas").
- `parecido` — 2 (1/0/1) — a2-comparativos-igualdad — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `parecer` — adjective "similar" in comparatives.
- `pica` — 2 (1/0/1) — c1-metaforas-vida-cultura — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `picar` — noun "pike" inside idiom "poner una pica en Flandes".
- `toma` — 2 (1/0/1) — a2-imperativo-salud — [VERB] `tomar` imperative.
- `tuve` — 2 (1/0/1) — a2-indefinido-irregular — [VERB] `tener` pretérito (lesson topic; no sentence attestation in checked fields).
- `visto` — 2 (1/0/1) — a2-participios-irregulares — [VERB] `ver` participle — lesson topic rules out the competing form `visto` = vestir 1s presente; human to confirm.
- `compraría` — 1 (1/0/0) — b2-condicional-imperfecto-subjuntivo — [VERB] `comprar` condicional.
- `desarrollo` — 1 (0/1/0) — b2-debate-energia-desarrollo — [HOMOGRAPH-NEEDS-NEW-ENTRY] lemma `desarrollar` — noun "development" (lesson topic).
- `estudiado` — 1 (0/0/1) — a2-perfecto-formacion — [VERB] `estudiar` participle. **The only one of the 525 strings that occurs solely in `targetVocab`** (never in `new`/`review`).

### (c) Multi-word phrase whose words all exist separately — 36 distinct, 110 occurrences — HUMAN DECISION PER PHRASE

All tokens exist as lexicon entries (exact match). None of the 36 exists as a phrase entry. Only 7 have a sense-example attestation with an Arabic gloss (marked ★); the rest have no whole-phrase sentence attestation in the checked fields and no Arabic gloss in-project — their meanings must be supplied by a human, not invented. Idioms/collocations whose meaning is not compositional are marked ◆ (component-linking would lose the meaning).

- `margen de maniobra` — 5 — b2-estrategias-negociacion-comercial ◆
- `hoja de ruta` — 4 — b2-apertura-presentacion-audiencia ◆
- `huella de carbono` — 4 — b2-cambio-climatico-sostenibilidad
- `juicio de valor` — 4 — b2-hechos-vs-opiniones ◆
- `mensaje clave` — 4 — b2-conclusion-llamada-accion
- `plato típico` — 4 — a2-mi-pais-costumbres
- `plazo de entrega` — 4 — b1-conversacion-profesional
- `tocar fondo` — 4 — b2-descripcion-graficos-tendencias ◆
- `tomar nota` — 4 — a2-mensajes-recados ◆
- `abono de transporte` — 3 — b1-guia-consejos-viajero
- `análisis de sangre` — 3 — b1-consulta-especialista ★ (sense ex. of `sangre`: "El análisis de sangre es mañana." / "تحليل الدم بكرة.")
- `casi nunca` — 3 — a2-frecuencia-actividades
- `dato fehaciente` — 3 — b2-hechos-vs-opiniones
- `defecto de fábrica` — 3 — b1-pedir-soluciones-reparacion
- `fiesta popular` — 3 — a2-fiestas-tradiciones
- `guardar cama` — 3 — a2-dar-consejos-deber ◆ ("stay in bed" — idiomatic)
- `impacto paisajístico` — 3 — b2-debate-energia-desarrollo
- `margen de beneficio` — 3 — b2-informes-ejecutivos-kpis
- `más alta consideración` — 3 — b2-formulas-protocolarias-cierre ◆ (formal closing formula)
- `número de incidencia` — 3 — b1-dialogo-atencion-cliente
- `propuesta de valor` — 3 — b2-persuasion-manejo-objeciones
- `punto de fricción` — 3 — b2-estrategias-negociacion-comercial ◆
- `punto de vista` — 3 — b1-debate-educacion ★ (sense ex. of `tergiversar`: "…defender tu punto de vista." / "…لتبرير وجهة نظرك.")
- `reunión de trabajo` — 3 — b1-conversacion-profesional
- `servicio técnico` — 3 — b1-pedir-soluciones-reparacion
- `silencio administrativo` — 3 — b2-reclamaciones-juridicas-instancias ◆ (legal term of art)
- `tasa de natalidad` — 3 — b2-transformacion-social-demografia
- `tiempo libre` — 3 — a2-deportes-tiempo-libre ★ (sense ex. of `activismo`: "Dedica su tiempo libre al activismo…" / "يكرس وقت فراغه…")
- `economía circular` — 2 — b2-cambio-climatico-sostenibilidad ★ (sense ex. of `economía`: "La economía circular busca reducir los residuos…" / "يسعى الاقتصاد الدائري…")
- `entrevista de trabajo` — 2 — b1-entrevistas-trabajo ★ (sense ex. of `entrevista`: "Tengo una entrevista de trabajo." / "عندي مقابلة شغل.")
- `estimar oportuno` — 2 — b2-correspondencia-corporativa ◆ (formal formula "deem appropriate")
- `fin de semana` — 2 — a2-ir-a-infinitivo ★ (sense ex. of `campo`: "Pasamos el fin de semana…" / "قضينا عطلة نهاية الأسبوع…")
- `poner de manifiesto` — 2 — b2-resumen-conclusiones-investigacion ◆
- `pregunta retórica` — 2 — b2-apertura-presentacion-audiencia
- `receta médica` — 2 — a2-sintomas-medico ★ — note: a longer entry `receta médica oficial` exists ("روشتة ووصفة دواء من الطبيب"); the shorter form still needs its own decision.
- `venir bien` — 2 — a2-pedir-citas ◆ ("to suit/be convenient" — idiomatic)

### (d) Genuinely absent — 403 distinct, 1,333 occurrences — NEW ENTRIES NEEDED, HUMAN REVIEW

Format: `ref — occ — lesson slugs — [tags] — context`. Context = first attesting sentence found (ES + AR as in the project; truncated). `token-only` = attested only as a bare exercise token (option/accepted answer). `NO ATTESTATION` = appears only in vocab lists — no sentence in any lesson and no sense example (49 items; a human must open the lesson to judge, and deletion of the ref is a legitimate outcome for list noise). `partial:` lists which phrase tokens already exist as entries. `haber-form` = form of `haber`, which has no entry at all (6 refs: `ha, han, he, has, habéis, hemos`). Every (d) string occurs in `newVocabulary`/`reviewVocabulary` (hence blocks an SRS link); `targetVocab` occurrences are additional and are not itemized per row.

- `rigor` — 89 — 29 C1 lessons (americanismos-lexicos, arbitraje-comercial, articulo-opinion, atenuacion-academica, clausulas-compromiso, comunicacion-crisis, conectores-metadiscursivos, critica-ensayo, diplomacia-multilateral, discurso-conmemorativo, ensayo-cultural, espanol-neutro, falsos-amigos-avanzados, generacion-del-27, interferencias-sintacticas, locuciones-adverbiales, memoria-institucional, metaforas-vida-cultura, modismos-cultos, ponencias-congresos, precision-estilistica, prosodia-fonetica, realismo-magico, refranes-pensamiento, refutacion-dialectica, siglo-de-oro, traduccion-juridica, traduccion-literaria, voseo-variacion) — [single] — "La columna exige rigor conceptual y agudeza estilística." / "يتطلب مقال العمود الصحفي رصانة مفاهيمية…". Note: `rigor` is listed as "new" vocabulary in 29 lessons — the new/review distinction is meaningless for it; also cf. `rigor metodológico` below.
- `euro` — 10 — a1-comprar, a1-numeros-20-100, a1-precios-cuentas — [single] — sense ex. of `importe`: "El importe total es 48,90 euros." / "المبلغ الإجمالي 48.90 يورو." (plural attested; meaning = currency, confidently derivable).
- `experiencia` — 9 — a1-presentacion-profesional, a2-hablar-de-experiencias, b1-curriculum-competencias, b2-carta-motivacion-becas-empleo — [single] — token-only.
- `ojalá` — 9 — b1-ojala-deseos, b1-subjuntivo-deseos — [single] — "¡Ojalá todos los estudiantes _____ el examen con buenas notas!" / "يا ليت جميع الطلاب…".
- `voseo` — 9 — b2-variedades-linguisticas-hispanas, c1-voseo-variacion — [single] — token-only.
- `seseo` — 8 — b2-variedades-linguisticas-hispanas, c1-prosodia-fonetica — [single] — token-only.
- `incumplimiento` — 7 — b1-reclamaciones-viaje, b2-acuerdo-clausulas-contractuales — [single] — token-only.
- `aspiración` — 6 — b1-planes-academicos, c1-prosodia-fonetica — [single] — token-only.
- `casa rural` — 6 — b1-alojamiento-alternativo — [phrase; partial: casa ✓ / rural ✗] — token-only ("casa rural").
- `centro` — 6 — a1-donde-esta, a1-transporte, a2-alquilar-piso, a2-conversacion-planes — [single] — "El banco está cerca _____ centro." / "البنك قريب من وسط المدينة."
- `compromiso` — 6 — b1-dialogo-atencion-cliente, c1-generacion-del-27 — [single] — token-only.
- `postura` — 6 — b1-redaccion-argumentativa, b2-contraargumentacion — [single] — token-only.
- `puntualizar` — 6 — b2-entrevista-periodistica, c1-conectores-metadiscursivos — [single] — "Cabe puntualizar que las variables contextuales no fueron aisladas…" / "يجدر التدقيق والتوضيح بأن المتغيرات السياقية…".
- `sesgo` — 6 — b2-analisis-prensa-editorial, c1-articulo-opinion — [single] — token-only.
- `agradecer la intervención` — 5 — b2-gestion-preguntas-respuestas — [phrase; partial: agradecer, intervención ✓ / la ✗] — token-only.
- `cita textual` — 5 — b2-citacion-fuentes-academicas — [phrase; partial: cita ✓ / textual ✗] — token-only.
- `concesión` — 5 — b2-concesiones-condiciones-mutuas — [single] — "Haremos esta concesión a condición de que nos ofrezcan una contrapartida…" / "سنقدم هذا التنازل شريطة أن…".
- `conflicto` — 5 — b1-conflictos-convivencia, b2-resolucion-conflictos-laborales — [single] — token-only.
- `convivencia` — 5 — b1-alojamiento-alternativo, b2-choque-cultural-integracion — [single] — token-only.
- `cuando` — 5 — a2-indefinido-vs-imperfecto — [single] — "Ayer estudiaba tranquilamente en la biblioteca cuando sonó mi teléfono." / "أمس بينما كنتُ أذاكر بهدوء في المكتبة رنّ هاتفي…".
- `desconectar` — 5 — b1-bienestar-emocional — [single] — token-only.
- `distancia interpersonal` — 5 — b2-comunicacion-no-verbal-gestos — [phrase; partial: distancia ✓ / interpersonal ✗] — "…una menor distancia interpersonal y el uso natural de los dos besos." / "…بمسافة شخصية أقصر واستخدام عفوي للترحيب بالقبلتين."
- `instancia` — 5 — b2-reclamaciones-juridicas-instancias — [single] — "Presentó una instancia administrativa ante el ayuntamiento" (no AR).
- `mayor` — 5 — a2-comparativos-superioridad, c1-clausulas-compromiso — [single] — token-only.
- `me alegra que` — 5 — b1-subjuntivo-sentimientos — [phrase; partial: none] — token-only ("Me alegra que").
- `memoria colectiva` — 5 — b2-patrimonio-cultural-inmaterial — [phrase; partial: memoria ✓ / colectiva ✗] — "…gracias a la fuerza de la memoria colectiva." / "…بفضل قوة الذاكرة الجمعية…".
- `obstante` — 5 — b2-conectores-argumentativos, b2-contraargumentacion — [single] — "No obstante, retrasar el cambio generará pérdidas…" / "بيد أن تأخير التغيير…". Note: fragment of "no obstante" listed standalone; human to decide whether the entry should be the full connector.
- `por lo tanto` — 5 — b1-conectores-discursivos — [phrase; partial: none] — token-only.
- `puesto que` — 5 — b1-conectores-discursivos, b2-conectores-causa-efecto-avanzados — [phrase; partial: puesto ✓ / que ✗] — token-only.
- `recíproco` — 5 — b2-concesiones-condiciones-mutuas — [single] — "…si obtenemos un compromiso recíproco." / "…إذا حصلنا على التزام متبادل."
- `sedentarismo` — 5 — b1-habitos-saludables — [single] — token-only.
- `sobremesa` — 5 — a2-contrastes-culturales — [single] — token-only.
- `surtir efectos legales` — 5 — b2-formulas-protocolarias-cierre — [phrase; partial: none] — NO ATTESTATION.
- `turno de preguntas` — 5 — b2-gestion-preguntas-respuestas — [phrase; partial: turno, de ✓ / preguntas ✗] — "…abrimos el turno de preguntas breves." / "…نفتح المجال للأسئلة الموجزة."
- `a modo de síntesis` — 4 — b2-resumen-conclusiones-investigacion — [phrase; partial: de, síntesis ✓ / a, modo ✗] — "A modo de síntesis los resultados son muy positivos" (no AR).
- `a su entera disposición` — 4 — b2-correspondencia-corporativa — [phrase; partial: none] — "Quedamos a su entera disposición para cualquier consulta" (no AR).
- `admitir a trámite` — 4 — b2-reclamaciones-juridicas-instancias — [phrase; partial: admitir, trámite ✓ / a ✗] — NO ATTESTATION.
- `alguna vez` — 4 — a2-marcadores-experiencias — [phrase; partial: none] — token-only ("Alguna vez").
- `atmósfera` — 4 — b2-literatura-narrativa-contemporanea — [single] — "La novela envuelve al lector en una atmósfera mágica…" / "تأسر الرواية القارئ في جو سحري آخاذ…".
- `chalet` — 4 — a2-tipos-vivienda — [single] — token-only.
- `confiar en` — 4 — b1-relaciones-personales — [phrase; partial: confiar ✓ / en ✗] — token-only.
- `copia sellada` — 4 — b1-hoja-reclamaciones — [phrase; partial: none] — token-only.
- `cuerpo` — 4 — a1-cuerpo, b1-bienestar-emocional, b2-comunicacion-no-verbal-gestos — [single] — "El deporte es bueno para el cuerpo" (no AR).
- `dado que` — 4 — b2-conectores-causa-efecto-avanzados — [phrase; partial: none] — token-only ("Dado que").
- `dar el paso` — 4 — b2-conclusion-llamada-accion — [phrase; partial: dar, paso ✓ / el ✗] — "Les invito a dar el paso hacia el futuro" (no AR).
- `de ahí que` — 4 — b2-conectores-causa-efecto-avanzados — [phrase; partial: de, ahí ✓ / que ✗] — "El presupuesto era insuficiente; de ahí que el plan _____ cancelado." / "كانت الميزانية غير كافية؛ ومن هنا أُلغي المشروع."
- `descarbonización` — 4 — b2-debate-energia-desarrollo — [single] — token-only.
- `desenlace` — 4 — b2-literatura-narrativa-contemporanea — [single] — token-only.
- `desmitificar estereotipos` — 4 — b2-choque-cultural-integracion — [phrase; partial: none] — token-only.
- `efecto secundario` — 4 — b1-consulta-especialista — [phrase; partial: secundario ✓ / efecto ✗] — token-only.
- `elipsis` — 4 — c1-interferencias-sintacticas — [single] — "En español la elipsis del sujeto es la norma general…" / "في الإسبانية يعد حذف ضمير الفاعل هو الأصل…".
- `emisiones netas cero` — 4 — b2-politicas-ambientales-subjuntivo — [phrase; partial: none] — "…alcanzar las emisiones netas cero para el año 2050." / "…الوصول إلى صافي انبعاثات صفري بحلول عام 2050."
- `empatía intercultural` — 4 — b2-choque-cultural-integracion — [phrase; partial: empatía ✓ / intercultural ✗] — "La empatía intercultural facilita una adaptación paulatina y feliz" (no AR).
- `encajar en el perfil` — 4 — b2-carta-motivacion-becas-empleo — [phrase; partial: encajar, perfil ✓ / en, el ✗] — NO ATTESTATION.
- `entorno natural` — 4 — b1-alojamiento-alternativo — [phrase; partial: none] — token-only.
- `entrar en vigor` — 4 — b2-acuerdo-clausulas-contractuales — [phrase; partial: entrar, vigor ✓ / en ✗] — NO ATTESTATION.
- `establecimiento` — 4 — b1-hoja-reclamaciones — [single] — token-only.
- `estructurar` — 4 — b2-apertura-presentacion-audiencia — [single] — NO ATTESTATION (the only apparent hit is *reestructurar*, a different word; derivation verb of noun `estructura`, which exists — human to confirm the entry).
- `evocar` — 4 — b2-metaforas-recursos-literarios — [single] — token-only.
- `gancho inicial` — 4 — b2-apertura-presentacion-audiencia — [phrase; partial: gancho ✓ / inicial ✗] — token-only.
- `genial` — 4 — a2-conversacion-hobbies — [single] — token-only.
- `gesticular` — 4 — b2-comunicacion-no-verbal-gestos — [single] — token-only.
- `hallazgo` — 4 — b2-resumen-conclusiones-investigacion — [single] — token-only (in another lesson).
- `he` — 4 — a2-perfecto-formacion — [single; haber-form] — "Hoy he comido en un restaurante" (no AR).
- `hecho contrastado` — 4 — b2-hechos-vs-opiniones — [phrase; partial: hecho ✓ / contrastado ✗] — token-only.
- `hoja de reclamaciones` — 4 — b1-hoja-reclamaciones — [phrase; partial: hoja, de ✓ / reclamaciones ✗] — token-only.
- `indicador clave` — 4 — b2-informes-ejecutivos-kpis — [phrase; partial: clave ✓ / indicador ✗] — "Este indicador clave mide la satisfacción del cliente" (no AR).
- `instar a que` — 4 — b2-politicas-ambientales-subjuntivo — [phrase; partial: none] — NO ATTESTATION.
- `interferencia` — 4 — c1-interferencias-sintacticas — [single] — "Muchos traductores caen en la trampa de la interferencia sintáctica…" / "يقع العديد من المترجمين في فخ التداخل النحوي…".
- `irrebatible` — 4 — b2-persuasion-manejo-objeciones — [single] — "…un argumento técnico irrebatible." / "…حجة فنية قاطعة لا يمكن دحضها."
- `justificante` — 4 — b1-reclamaciones-viaje — [single] — token-only.
- `magistral` — 4 — c1-discurso-conmemorativo — [single] — token-only.
- `marco teórico` — 4 — b2-estructura-ensayo-academico — [phrase; partial: marco ✓ / teórico ✗] — token-only.
- `matiz` — 4 — b2-matizar-opiniones — [single] — NO ATTESTATION (the only apparent hit is *matiz* inside *aromatiza* in an unrelated example — different word; the lesson is literally about *matizar*, so the entry is needed but its gloss must come from the lesson, not from that example).
- `norma panhispánica` — 4 — b2-variedades-linguisticas-hispanas — [phrase; partial: norma ✓ / panhispánica ✗] — "La norma panhispánica integra todos los rasgos dialectales" (no AR).
- `nota verbal` — 4 — b2-comunicacion-institucional-diplomatica — [phrase; partial: nota ✓ / verbal ✗] — token-only.
- `número de personas` — 4 — a2-dialogo-reserva — [phrase; partial: número, de ✓ / personas ✗] — token-only.
- `ocio` — 4 — a2-conversacion-hobbies — [single] — token-only.
- `orden del día` — 4 — b2-gestion-reuniones-orden-dia — [phrase; partial: orden, día ✓ / del ✗] — token-only.
- `panhispánico` — 4 — c1-espanol-neutro — [single] — "Buscamos el consenso panhispánico siempre" (no AR).
- `parque eólico` — 4 — b2-debate-energia-desarrollo — [phrase; partial: parque ✓ / eólico ✗] — token-only (in another lesson).
- `patrimonio inmaterial` — 4 — b2-patrimonio-cultural-inmaterial — [phrase; partial: patrimonio ✓ / inmaterial ✗] — token-only.
- `pedir disculpas` — 4 — b1-conflictos-convivencia — [phrase; partial: pedir ✓ / disculpas ✗] — token-only.
- `penumbra` — 4 — b2-metaforas-recursos-literarios — [single] — "Tus ojos brillan como estrellas en la penumbra" (no AR).
- `periodo de prueba` — 4 — b1-condiciones-laborales — [phrase; partial: de, prueba ✓ / periodo ✗] — token-only.
- `permítame insistir` — 4 — b2-entrevista-periodistica — [phrase; partial: insistir ✓ / permítame ✗] — token-only ("Permítame insistir").
- `pirámide invertida` — 4 — b1-cronica-periodistica — [phrase; partial: none] — token-only.
- `plenitud` — 4 — b2-expresion-estetica-emociones — [single] — token-only.
- `poner con` — 4 — a2-llamadas-telefonicas — [phrase; partial: poner ✓ / con ✗] — NO ATTESTATION (the only apparent hit is *presuponer con* — different word; this is the telephone formula "put [someone] through to…", gloss must come from the lesson).
- `porteño` — 4 — c1-voseo-variacion — [single] — "Agradezco tu entusiasmo porteño; en Madrid usamos el tuteo…" / "أقدر حماسك البوينس-آيرسي الصادق…". Demonym; entry-worthy, kept in (d).
- `propuesta comercial` — 4 — b2-correspondencia-corporativa — [phrase; partial: propuesta ✓ / comercial ✗] — "…trasladarle nuestra propuesta comercial para el próximo año." / "…إحاطتكم بعرضنا التجاري للعام القادم."
- `que te mejores` — 4 — b1-ojala-deseos — [phrase; partial: none] — token-only ("Que te mejores").
- `relevo generacional` — 4 — b2-transformacion-social-demografia — [phrase; partial: none] — "…es crucial garantizar el relevo generacional." / "…من المحوري ضمان التعاقب الجيلي."
- `rescisión` — 4 — b2-acuerdo-clausulas-contractuales — [single] — token-only.
- `rigor metodológico` — 4 — b2-estructura-ensayo-academico — [phrase; partial: none — neither `rigor` nor `metodológico` is an entry] — "El tribunal valora especialmente el rigor metodológico…" / "تثمن اللجنة بشكل خاص الصرامة المنهجية…". Adding `rigor` alone does not resolve this phrase.
- `se prevé que` — 4 — b2-pasiva-periodistica-se — [phrase; partial: none] — NO ATTESTATION.
- `se prohíbe` — 4 — a2-impersonal-se — [phrase; partial: none] — token-only ("Se prohíbe").
- `soberanía energética` — 4 — b2-debate-energia-desarrollo — [phrase; partial: soberanía ✓ / energética ✗] — token-only.
- `solemne` — 4 — c1-discurso-conmemorativo — [single] — "Rendimos un solemne homenaje al maestro" (no AR).
- `sueldo bruto` — 4 — b1-condiciones-laborales — [phrase; partial: sueldo ✓ / bruto ✗] — token-only.
- `símil` — 4 — b2-metaforas-recursos-literarios — [single] — token-only.
- `tal como sostiene` — 4 — b2-citacion-fuentes-academicas — [phrase; partial: none] — "Tal como sostiene el autor la educación es fundamental" (no AR).
- `tanto` — 4 — a2-comparativos-igualdad — [single] — token-only.
- `te sugiero que` — 4 — b1-subjuntivo-recomendaciones — [phrase; partial: none] — "Te sugiero que sigas el tratamiento médico" (no AR).
- `trama` — 4 — b2-literatura-narrativa-contemporanea — [single] — token-only.
- `transición ecológica` — 4 — b2-cambio-climatico-sostenibilidad — [phrase; partial: none] — "Acelerar la transición ecológica es el único camino viable…" / "تسريع التحول البيئي هو السبيل الوحيد…".
- `transparencia` — 4 — c1-comunicacion-crisis — [single] — "…actuar con absoluta transparencia." / "…بالعمل بمنتهى الشفافية والوضوح."
- `trascendencia` — 4 — c1-ensayo-cultural — [single] — "…una forma superior de trascendencia." / "…نمطاً أسمى… من التجرد والتعالي الوجودي."
- `trayectoria sólida` — 4 — b2-carta-motivacion-becas-empleo — [phrase; partial: none] — "…por su trayectoria sólida y su clara vocación." / "…نظراً لمسارها الراسخ وشغفها الواضح…".
- `éxodo rural` — 4 — b2-transformacion-social-demografia — [phrase; partial: none] — token-only.
- `última hora` — 4 — b1-noticias-prensa — [phrase; partial: hora ✓ / última ✗] — token-only.
- `a condición de que` — 3 — b2-concesiones-condiciones-mutuas — [phrase; partial: condición, de ✓ / a, que ✗] — "Cederemos en este punto a condición de que ustedes _____ el suministro continuo." / "سنتنازل في هذه النقطة شريطة أن تضمنوا…".
- `abrir el turno` — 3 — b2-gestion-preguntas-respuestas — [phrase; partial: abrir, turno ✓ / el ✗] — NO ATTESTATION.
- `acercar posturas` — 3 — b2-resolucion-conflictos-laborales — [phrase; partial: acercar ✓ / posturas ✗] — "Es necesario acercar posturas para resolver el malentendido" (no AR).
- `acervo` — 3 — c1-americanismos-lexicos — [single] — "…enriquecen el acervo común de nuestra lengua." / "…وتثريان الرصيد التراثي المشترك للغتنا…".
- `adaptación paulatina` — 3 — b2-choque-cultural-integracion — [phrase; partial: adaptación ✓ / paulatina ✗] — "La empatía intercultural facilita una adaptación paulatina y feliz" (no AR).
- `agradecer la presencia` — 3 — b2-apertura-presentacion-audiencia — [phrase; partial: agradecer, presencia ✓ / la ✗] — NO ATTESTATION.
- `albergue juvenil` — 3 — b1-alojamiento-alternativo — [phrase; partial: albergue ✓ / juvenil ✗] — token-only.
- `altísimo` — 3 — a2-superlativos — [single] — token-only.
- `amanece` — 3 — c1-refranes-pensamiento — [single] — "…no por mucho madrugar amanece más temprano." / "…كثرة التبكير لا تجعل الفجر يبزغ قبل أوانه." (Form of `amanecer`, which has **no entry** — hence (d), not (b).)
- `americanismo` — 3 — b2-variedades-linguisticas-hispanas — [single] — "La palabra 'computadora' es un americanismo plenamente consolidado…" / "تُعد كلمة 'computadora' لفظاً أمريكياً راسخاً…".
- `amueblado` — 3 — a2-tipos-vivienda — [single] — token-only.
- `antagonista` — 3 — b2-analisis-personajes-relato — [single] — token-only.
- `antefirma` — 3 — b2-formulas-protocolarias-cierre — [single] — token-only.
- `aparato` — 3 — b1-pedir-soluciones-reparacion — [single] — "Llevé el aparato al servicio técnico oficial" (no AR).
- `aquiles` — *moved to (f), see §5f* (proper noun; idiom "talón de Aquiles").
- `añoranza` — 3 — b2-expresion-estetica-emociones — [single] — token-only.
- `bibliografía` — 3 — b2-citacion-fuentes-academicas — [single] — "Tal como sostiene la bibliografía especializada…" / "تماماً كما تؤكد المراجع المتخصصة…".
- `bonito` — 3 — a2-superlativos — [single] — token-only.
- `broche de oro` — 3 — b2-conclusion-llamada-accion — [phrase; partial: de, oro ✓ / broche ✗] — "…poner el broche de oro al proyecto." / "…ووضع مسك الختام للمشروع."
- `cabe señalar que` — 3 — b2-analisis-prensa-editorial — [phrase; partial: señalar ✓ / cabe, que ✗] — "Cabe señalar que defendemos nuestra línea editorial" (no AR).
- `cada` — 3 — a1-farmacia, a2-dar-consejos-deber — [single] — token-only.
- `cadencia` — 3 — c1-traduccion-literaria — [single] — "…recrear la cadencia y el misterio." / "…إعادة توليد الإيقاع وسحر الغموض…".
- `calefacción` — 3 — a2-visita-piso — [single] — token-only.
- `carterista` — 3 — b1-guia-consejos-viajero — [single] — token-only (plural `carteristas` in text).
- `ceder en` — 3 — b2-concesiones-condiciones-mutuas — [phrase; partial: ceder ✓ / en ✗] — "Estamos dispuestos a ceder en los márgenes…" / "نحن على استعداد لتقديم تنازل في هوامش الأرباح…".
- `ceder la palabra` — 3 — b2-gestion-reuniones-orden-dia — [phrase; partial: ceder, palabra ✓ / la ✗] — NO ATTESTATION.
- `ceñirse al tema` — 3 — b2-gestion-preguntas-respuestas — [phrase; partial: tema ✓ / ceñirse, al ✗] — NO ATTESTATION (`ceñir` has no entry).
- `choque cultural` — 3 — b2-choque-cultural-integracion — [phrase; partial: none] — token-only.
- `cierre memorable` — 3 — b2-conclusion-llamada-accion — [phrase; partial: none] — token-only.
- `cierta` — 3 — c1-locuciones-adverbiales — [single] — "…afirmar a ciencia cierta que…" / "…أن نجزم على وجه اليقين بأن…". Feminine form of `cierto`? `cierto` exists as an entry (partial check: `cierta` is not in `forms[]` — feminine forms are recorded for only 2 entries in the whole lexicon). Human to decide: feminine form row vs own entry. Kept in (d) because no form row exists; do not confuse with (b) MORPH-VARIANT — the evidence for `cierto` having a recorded feminine form was not found.
- `cinésica` — 3 — b2-comunicacion-no-verbal-gestos — [single] — NO ATTESTATION.
- `cliché` — 3 — b2-choque-cultural-integracion — [single] — "Debemos superar el simplista cliché de que las culturas son bloques herméticos…" / "يجب أن نتجاوز الكليشيه التبسيطي…".
- `clima laboral` — 3 — b2-resolucion-conflictos-laborales — [phrase; partial: clima ✓ / laboral ✗] — NO ATTESTATION.
- `cobertura mediática` — 3 — b1-cronica-periodistica — [phrase; partial: cobertura ✓ / mediática ✗] — token-only.
- `coherente` — 3 — b1-redaccion-argumentativa — [single] — token-only.
- `con el debido respeto` — 3 — b2-entrevista-periodistica — [phrase; partial: respeto ✓ / con, el, debido ✗] — "Con el debido respeto, los ciudadanos merecen una explicación más detallada." / "مع كامل الاحترام والتقدير، يستحق المواطنون تفسيراً أكثر تفصيلاً."
- `conceptismo` — 3 — c1-siglo-de-oro — [single] — "…Quevedo prefiere el conceptismo." / "…يؤثر كيبيدو مذهب المعنى وتكثيف الفكرة."
- `concordia` — 3 — c1-diplomacia-multilateral — [single] — "…apeló con vehemencia a la concordia…" / "…الاحتكام إلى روح الوفاق والوئام…".
- `confianza` — 3 — b1-agradecimiento-disculpa — [single] — "Le agradecemos su valiosa colaboración y confianza" (no AR).
- `confidencialidad` — 3 — b2-acuerdo-clausulas-contractuales — [single] — token-only.
- `conflicto interior` — 3 — b2-analisis-personajes-relato — [phrase; partial: interior ✓ / conflicto ✗] — "El antagonista sufre un profundo conflicto interior" (no AR).
- `congoja` — 3 — b2-expresion-estetica-emociones — [single] — "Sentía una congoja inexplicable en el pecho…" / "كان يشعر بغصة واعتصار لا يفسر في صدره…".
- `contacto físico` — 3 — b2-comunicacion-no-verbal-gestos — [phrase; partial: none] — "El contacto físico ocasional denota cercanía y calidez" (no AR).
- `contacto visual` — 3 — b2-apertura-presentacion-audiencia — [phrase; partial: none] — "Es crucial mantener el contacto visual con toda la sala…" / "من الحاسم الحفاظ على التواصل البصري…".
- `contar con` — 3 — b1-relaciones-personales — [phrase; partial: contar ✓ / con ✗] — "Siempre puedes contar con mi apoyo total" (no AR).
- `contraoferta` — 3 — b2-estrategias-negociacion-comercial — [single] — token-only.
- `contrapartida` — 3 — b2-concesiones-condiciones-mutuas — [single] — token-only.
- `contrato indefinido` — 3 — b1-condiciones-laborales — [phrase; partial: contrato ✓ / indefinido ✗] — "¿El puesto ofrece contrato indefinido y cuál es el sueldo bruto?" / "هل يوفر المنصب عقداً دائماً…؟".
- `controversia` — 3 — c1-arbitraje-comercial — [single] — "…para dirimir la controversia contractual." / "…للفصل وحسم النزاع والخلاف التعاقدي…".
- `crisis` — 3 — c1-comunicacion-crisis — [single] — "El gabinete de crisis adoptó medidas urgentes…" / "اتخذت خلية الأزمة تدابير عاجلة…".
- `cualificación` — 3 — b1-entrevistas-trabajo — [single] — "Tengo la cualificación adecuada para este sector" (no AR).
- `cualitativo` — 3 — c1-memoria-institucional — [single] — "El balance cualitativo evidencia un salto histórico…" / "تثبت الحصيلة والتقييم النوعي…".
- `cuerpo diplomático` — 3 — b2-comunicacion-institucional-diplomatica — [phrase; partial: diplomático ✓ / cuerpo ✗] — "…a los miembros del cuerpo diplomático." / "…أعضاء السلك الدبلوماسي." (Note: `cuerpo` alone is also unresolved, above — adding it does not resolve this phrase.)
- `cultura` — 3 — a2-mi-pais-costumbres, b2-patrimonio-cultural-inmaterial — [single] — "Hoy voy a presentar la cultura de mi país" (no AR).
- `currículum vitae` — 3 — b1-curriculum-competencias — [phrase; partial: none] — token-only.
- `código seguro` — 3 — b2-formulas-protocolarias-cierre — [phrase; partial: seguro ✓ / código ✗] — "…mediante el código seguro impreso al pie." / "…بواسطة كود التحقق الآمن المطبوع في أسفلها."
- `debatirse entre` — 3 — b2-analisis-personajes-relato — [phrase; partial: entre ✓ / debatirse ✗] — NO ATTESTATION.
- `desasosiego` — 3 — b2-expresion-estetica-emociones — [single] — token-only.
- `desear que` — 3 — b1-ojala-deseos — [phrase; partial: desear ✓ / que ✗] — token-only.
- `desengaño` — 3 — c1-siglo-de-oro — [single] — "El tema del desengaño impregna cada verso…" / "تتخلل فكرة خيبة الأمل وفوات الأوهام كل بيت شعري…".
- `desplomarse` — 3 — b2-descripcion-graficos-tendencias — [single] — token-only (reflexive verb; no `desplomar` entry found — human to decide lemma vs reflexive entry).
- `dieta mediterránea` — 3 — b1-habitos-saludables — [phrase; partial: dieta ✓ / mediterránea ✗] — token-only.
- `dilema ético` — 3 — b2-debate-energia-desarrollo — [phrase; partial: dilema ✓ / ético ✗] — "Nos enfrentamos a un grave dilema ético y económico" (no AR).
- `disipar dudas` — 3 — b2-persuasion-manejo-objeciones — [phrase; partial: none] — NO ATTESTATION.
- `disposición` — 3 — c1-correspondencia-formal — [single] — "Quedo a su entera disposición para cualquier aclaración…" / "وأظل تحت تصرف سيادتكم التام…".
- `distinguida consideración` — 3 — b2-comunicacion-institucional-diplomatica — [phrase; partial: consideración ✓ / distinguida ✗] — "Reitera las seguridades de su más distinguida consideración" (no AR).
- `dos besos` — 3 — b2-comunicacion-no-verbal-gestos — [phrase; partial: dos ✓ / besos ✗] — token-only.
- `dónde` — 3 — a1-donde-esta — [single] — token-only. (Distinct from `¿de dónde?` in (a); the bare interrogative is not an entry.)
- `efecto invernadero` — 3 — b2-cambio-climatico-sostenibilidad — [phrase; partial: none] — NO ATTESTATION.
- `en cambio` — 3 — b1-conectores-discursivos — [phrase; partial: none] — token-only.
- `en términos interanuales` — 3 — b2-informes-ejecutivos-kpis — [phrase; partial: none] — "En términos interanuales, el margen de beneficio creció…" / "على أساس سنوي مقارن، نما هامش الربح…".
- `ende` — 3 — c1-locuciones-adverbiales — [single] — "El acuerdo es vinculante y, por ende, de obligado cumplimiento…" / "الاتفاق ملزم ومن ثَمَّ، فهو واجب النفاذ…". Fragment of "por ende" listed standalone; human to decide entry vs full locution.
- `entendedor` — 3 — c1-refranes-pensamiento — [single] — "…a buen entendedor, pocas palabras bastan." / "…فاللبيب تكفيه الإشارة وأقل الكلام."
- `envejecimiento poblacional` — 3 — b2-transformacion-social-demografia — [phrase; partial: none] — token-only.
- `equipaje perdido` — 3 — b1-viajes-imprevistos — [phrase; partial: equipaje ✓ / perdido ✗] — token-only.
- `es aconsejable que` — 3 — b1-subjuntivo-recomendaciones — [phrase; partial: none] — "…es aconsejable que usted _____ la sal." / "…من المستحسن أن … استهلاك الملح."
- `es fundamental que` — 3 — b1-subjuntivo-recomendaciones — [phrase; partial: fundamental ✓ / es, que ✗] — "Es fundamental que _____ la medicación…" / "من الجوهري أن تتناول الدواء…".
- `es imperativo que` — 3 — b2-cambio-climatico-sostenibilidad — [phrase; partial: none] — "Es imperativo que los países desarrollados _____ modelos energéticos…" / "من المحتوم أن تتبنى الدول المتقدمة نماذج طاقية…".
- `es inaceptable que` — 3 — b1-expresar-quejas-molestias — [phrase; partial: none] — "Es inaceptable que no nos _____ ninguna explicación…" / "من غير المقبول ألا يقدموا لنا أي توضيح…".
- `especializarse` — 3 — b1-planes-academicos — [single] — NO ATTESTATION (`especializar` has no entry).
- `estancarse` — 3 — b2-descripcion-graficos-tendencias — [single] — NO ATTESTATION (`estancar` has no entry).
- `estar dispuesto a` — 3 — b2-estrategias-negociacion-comercial — [phrase; partial: estar ✓ / dispuesto, a ✗] — NO ATTESTATION.
- `estimado señor` — 3 — b1-carta-formal-correo — [phrase; partial: señor ✓ / estimado ✗] — token-only. (Cf. `estimado` in (b) — adding that adjective does not resolve this salutation phrase.)
- `estrés` — 3 — b1-bienestar-emocional — [single] — token-only.
- `estética` — 3 — c1-ensayo-cultural — [single] — "…con el ritmo sereno de una prosa meditativa…" (sentence attests the adjective form; the noun use is in the lesson title/topic — human to confirm pos).
- `excelentísimo señor` — 3 — b2-comunicacion-institucional-diplomatica — [phrase; partial: señor ✓ / excelentísimo ✗] — token-only ("Excelentísimo Señor").
- `eximir` — 3 — c1-clausulas-compromiso — [single] — "…podrán eximir del pago." / "…هي ما يمكن أن تعفي من أداء الغرامة."
- `expediente académico` — 3 — b1-estudios-universidad — [phrase; partial: académico ✓ / expediente ✗] — token-only.
- `experimentar un repunte` — 3 — b2-descripcion-graficos-tendencias — [phrase; partial: experimentar ✓ / un, repunte ✗] — token-only.
- `fdo.` — 3 — b2-formulas-protocolarias-cierre — [single] — token-only ("Fdo"). **Abbreviation** of *firmado* (signed) in letter closings — human to decide: abbreviation entry (`fdo`) vs formula note; the ref carries a trailing period, which the importer's exact match would also need to handle.
- `fortaleza` — 3 — b1-entrevistas-trabajo — [single] — token-only.
- `fuegos artificiales` — 3 — a2-fiestas-tradiciones — [phrase; partial: none] — token-only.
- `fuente fidedigna` — 3 — b1-noticias-prensa — [phrase; partial: fuente ✓ / fidedigna ✗] — token-only.
- `ganar-ganar` — 3 — b2-estrategias-negociacion-comercial — [single; hyphenated] — token-only. Win-win calque; human to decide entry form (hyphenated headword vs spaced phrase).
- `grado universitario` — 3 — b1-estudios-universidad — [phrase; partial: grado ✓ / universitario ✗] — "Después de terminar el grado universitario, decidió hacer un _____…" / "بعد إنهاء البكالوريوس الجامعي…".
- `gráfico de barras` — 3 — b2-descripcion-graficos-tendencias — [phrase; partial: gráfico, de ✓ / barras ✗] — "Este gráfico de barras muestra la evolución mensual" (no AR).
- `habitación compartida` — 3 — b1-alojamiento-alternativo — [phrase; partial: habitación ✓ / compartida ✗] — token-only.
- `han` — 3 — a2-perfecto-formacion — [single; haber-form] — token-only.
- `hunde sus raíces` — 3 — b2-patrimonio-cultural-inmaterial — [phrase; partial: none] — token-only.
- `idoneidad` — 3 — b2-carta-motivacion-becas-empleo — [single] — token-only.
- `imprevisto` — 3 — b1-viajes-imprevistos — [single] — token-only.
- `intercambio de casas` — 3 — b1-alojamiento-alternativo — [phrase; partial: de ✓ / intercambio, casas ✗] — token-only.
- `jornada laboral` — 3 — b1-condiciones-laborales — [phrase; partial: jornada ✓ / laboral ✗] — token-only.
- `laudo` — 3 — c1-arbitraje-comercial — [single] — "…procederá a dictar el laudo definitivo…" / "…إصدار ونطق الحكم التحكيمي النهائي…".
- `lengua policéntrica` — 3 — b2-variedades-linguisticas-hispanas — [phrase; partial: lengua ✓ / policéntrica ✗] — token-only.
- `limar asperezas` — 3 — b2-resolucion-conflictos-laborales — [phrase; partial: none] — token-only.
- `lineal` — 3 — c1-realismo-magico — [single] — "García Márquez subvierte el tiempo lineal…" / "يعطل غارسيا ماركيز الزمن الخطي المتعاقب…".
- `llaga` — 3 — c1-modismos-cultos — [single] — "…ha puesto el dedo en la llaga…" / "…وضع كاتب الافتتاحية إصبعه على الجرح…".
- `llamada a la acción` — 3 — b2-conclusion-llamada-accion — [phrase; partial: llamada, acción ✓ / a, la ✗] — token-only.
- `llevarse bien` — 3 — b1-relaciones-personales — [phrase; partial: bien ✓ / llevarse ✗] — NO ATTESTATION (reflexive phrase; `llevar` exists but no reflexive forms are recorded).
- `línea editorial` — 3 — b2-analisis-prensa-editorial — [phrase; partial: línea ✓ / editorial ✗] — token-only.
- `madrugar` — 3 — c1-refranes-pensamiento — [single] — "…no por mucho madrugar amanece más temprano." / "…كثرة التبكير لا تجعل الفجر يبزغ…".
- `malestar` — 3 — b1-expresar-quejas-molestias — [single] — token-only.
- `me da pena que` — 3 — b1-subjuntivo-sentimientos — [phrase; partial: pena ✓ / me, da, que ✗] — token-only.
- `me dirijo a usted` — 3 — b1-carta-formal-correo — [phrase; partial: usted ✓ / me, dirijo, a ✗] — token-only.
- `me indigna que` — 3 — b1-expresar-quejas-molestias — [phrase; partial: none] — token-only ("Me indigna que").
- `me molesta que` — 3 — b1-expresar-quejas-molestias — [phrase; partial: none] — "Me molesta que la gente _____ a gritos en el cine." / "يزعجني أن … الناس بالصراخ في السينما."
- `me sorprende que` — 3 — b1-subjuntivo-sentimientos — [phrase; partial: none] — "Me sorprende que hables español tan bien" (no AR).
- `medio de comunicación` — 3 — b1-noticias-prensa — [phrase; partial: medio, de ✓ / comunicación ✗] — "Todo medio de comunicación debe verificar rigurosamente los hechos." / "يجب على كل وسيلة إعلام أن تتحقق بدقة من الوقائع."
- `meditativa` — 3 — c1-ensayo-cultural — [single] — "…una prosa meditativa que invite al recogimiento." / "…لنثر تأملي عميق يدعو القارئ للسكينة…". Feminine form of `meditativo`? No feminine form rows exist for it — human to decide form row vs entry (same pattern as `cierta`).
- `mensual` — 3 — a2-alquilar-piso — [single] — token-only.
- `mestiza` — 3 — c1-realismo-magico — [single] — "…la cosmovisión mestiza y el sincretismo cultural…" / "…الرؤية الهجينة المركبة للعالم…". Feminine form of `mestizo` — same decision as `cierta`/`meditativa`.
- `mitigar` — 3 — c1-comunicacion-crisis — [single] — "…para mitigar el impacto sobre los pasajeros afectados." / "…لتخفيف وطأة الأثر والضرر…".
- `modismo` — 3 — c1-refranes-modismos — [single] — NO ATTESTATION (lesson is about refranes/modismos; entry needed, gloss from lesson).
- `mágico` — 3 — c1-realismo-magico — [single] — "El prodigio del realismo mágico estriba en…" / "تكمن إعجازية الواقعية السحرية في…".
- `narrador omnisciente` — 3 — b2-literatura-narrativa-contemporanea — [phrase; partial: narrador ✓ / omnisciente ✗] — token-only.
- `neutro` — 3 — c1-espanol-neutro — [single] — "…exigen un español neutro para amortizar los costes de doblaje…" / "…إسبانية محايدة لتقليص نفقات الدبلجة…".
- `no obstante` — 3 — b1-conectores-discursivos — [phrase; partial: no ✓ / obstante ✗] — "No obstante seguiremos trabajando en el proyecto" (no AR). (Cf. standalone `obstante` above.)
- `nos dirigimos a usted` — 3 — b2-correspondencia-corporativa — [phrase; partial: usted ✓ / nos, dirigimos, a ✗] — token-only.
- `nutrientes` — 3 — b1-habitos-saludables — [single] — token-only.
- `objeto de estudio` — 3 — b2-estructura-ensayo-academico — [phrase; partial: objeto, de ✓ / estudio ✗] — "Es fundamental delimitar con claridad el objeto de estudio" (no AR). (Cf. `estudio` in (b).)
- `ochenta` — 3 — a1-numeros-20-100 — [single] — token-only.
- `oportunidad` — 3 — a2-hablar-de-experiencias — [single] — token-only.
- `palabras clave` — 3 — b2-resumen-conclusiones-investigacion — [phrase; partial: clave ✓ / palabras ✗] — "…incluir cinco palabras clave que definan…" / "…إدراج خمس كلمات مفتاحية…".
- `paráfrasis` — 3 — b2-citacion-fuentes-academicas — [single] — token-only.
- `pasatiempo` — 3 — a2-gustos-preferencias-avanzadas — [single] — token-only.
- `perdiz` — 3 — c1-modismos-cultos — [single] — "El comité se dedica a marear la perdiz…" / "اللجنة لا تفعل شيئاً سوى المماطلة…". (Idiom component; entry meaning is the literal bird — human to confirm the lesson wants the literal entry.)
- `perfil profesional` — 3 — b1-curriculum-competencias — [phrase; partial: perfil ✓ / profesional ✗] — token-only.
- `perjuicio` — 3 — c1-traduccion-juridica — [single] — "…sin perjuicio de las indemnizaciones…" / "…دون الإخلال بحق المطالبة بالتعويضات…".
- `personificación` — 3 — b2-metaforas-recursos-literarios — [single] — token-only.
- `pide que` — 3 — b1-estilo-indirecto-presente — [phrase; partial: none] — "El jefe pide que vengas al despacho" (no AR).
- `pieza de repuesto` — 3 — b1-pedir-soluciones-reparacion — [phrase; partial: pieza, de ✓ / repuesto ✗] — token-only.
- `plagio` — 3 — b2-citacion-fuentes-academicas — [single] — token-only.
- `platicar` — 3 — c1-americanismos-lexicos — [single] — "Tuvimos la oportunidad de platicar largo y tendido…" / "سنحت لنا الفرصة للتجاذب في أطراف الحديث مطولاً…". (Americanism; cf. `peninsular` entry handling — human to confirm register/variant note.)
- `postura de partida` — 3 — b2-estrategias-negociacion-comercial — [phrase; partial: de ✓ / postura, partida ✗] — NO ATTESTATION.
- `prefijo` — 3 — a2-llamadas-telefonicas — [single] — token-only ("Prefijo").
- `pregunta si` — 3 — b1-estilo-indirecto-presente — [phrase; partial: pregunta ✓ / si ✗] — token-only.
- `pretender` — 3 — c1-falsos-amigos-avanzados — [single] — "'pretender' no significa fingir, sino albergar la firme intención…" / "…لا يعني التظاهر… بل السعي وامتلاك نية جازمة…". (False-friend lesson — the gloss is explicit in-project.)
- `pretensión` — 3 — b1-hoja-reclamaciones — [single] — token-only.
- `primera` — 3 — a1-direcciones — [single] — "Tomas la primera calle a la derecha" (no AR). Feminine ordinal — same decision as `segunda`/`cierta`.
- `prospectiva` — 3 — b2-resumen-conclusiones-investigacion — [single] — "…abren una prometedora prospectiva investigadora." / "…وتفتح آفاقاً مستقبلية واعدة للبحث."
- `proxémica` — 3 — b2-comunicacion-no-verbal-gestos — [single] — token-only.
- `puede que` — 3 — b1-expresar-duda-probabilidad — [phrase; partial: none] — token-only ("Puede que").
- `punto de encuentro` — 3 — b2-resolucion-conflictos-laborales — [phrase; partial: punto, de ✓ / encuentro ✗] — token-only.
- `que aproveche` — 3 — b1-ojala-deseos — [phrase; partial: none] — token-only ("Que aproveche").
- `quedar a su disposición` — 3 — b1-carta-formal-correo — [phrase; partial: quedar ✓ / a, su, disposición ✗] — NO ATTESTATION.
- `rasgo dialectal` — 3 — b2-variedades-linguisticas-hispanas — [phrase; partial: rasgo ✓ / dialectal ✗] — NO ATTESTATION.
- `reconciliarse` — 3 — b1-conflictos-convivencia — [single] — token-only (reflexive verb; human to decide lemma vs reflexive entry — no `reconciliar` entry check was needed for the bucket, but the fix should consider it).
- `redención` — 3 — b2-analisis-personajes-relato — [single] — "…el protagonista busca desesperadamente la redención." / "…يبحث البطل باستماتة عن الخلاص والتطهر…".
- `reencuadrar` — 3 — b2-persuasion-manejo-objeciones — [single] — token-only.
- `rendición` — 3 — c1-memoria-institucional — [single] — "…un ejercicio insoslayable de rendición de cuentas." / "…ممارسة حتمية… للمساءلة والشفافية المؤسسية." (Phrase "rendición de cuentas" is the unit; the ref is the head noun — human to decide entry scope.)
- `repercusión` — 3 — b2-analisis-prensa-editorial — [single] — token-only.
- `resolutoria` — 3 — c1-traduccion-juridica — [single] — "…una cláusula resolutoria en caso de incumplimiento…" / "…شرطاً فاسخاً وصريحاً…". Feminine adjective — same form-row-vs-entry decision as `cierta`.
- `rito ancestral` — 3 — b2-patrimonio-cultural-inmaterial — [phrase; partial: rito ✓ / ancestral ✗] — token-only (in another lesson).
- `salud mental` — 3 — b1-bienestar-emocional — [phrase; partial: salud ✓ / mental ✗] — "Debemos cuidar nuestra salud mental siempre" (no AR).
- `saludable` — 3 — a2-dar-consejos-deber — [single] — token-only.
- `sanción disuasoria` — 3 — b2-politicas-ambientales-subjuntivo — [phrase; partial: sanción ✓ / disuasoria ✗] — "Es necesario imponer una sanción disuasoria al infractor" (no AR).
- `se acostumbra` — 3 — a2-impersonal-se — [phrase; partial: none] — "En mi ciudad se acostumbra a cenar alrededor de las diez…" / "في مدينتي من المعتاد العشاء حوالي العاشرة مساءً."
- `se permite` — 3 — a2-impersonal-se — [phrase; partial: none] — token-only ("Se permite").
- `se vende` — 3 — a2-impersonal-se — [phrase; partial: none] — token-only ("Se vende").
- `senderismo` — 3 — a2-deportes-tiempo-libre — [single] — "…me gusta _____ senderismo por la montaña." / "…يعجبني ممارسة رياضة المشي في الجبل."
- `siempre y cuando` — 3 — b2-concesiones-condiciones-mutuas — [phrase; partial: siempre ✓ / y, cuando ✗] — "Les aplicaremos el descuento máximo siempre y cuando ustedes _____ el contrato…" / "سنطبق عليكم الخصم الأقصى شريطة أن توقعوا العقد…".
- `simbolismo` — 3 — c1-generacion-del-27 — [single] — "El simbolismo de la luna y el puñal anticipa…" / "رمزية القمر والخنجر تستشرف…".
- `sin otro particular` — 3 — b2-formulas-protocolarias-cierre — [phrase; partial: none] — token-only.
- `sin tregua` — 3 — b2-literatura-narrativa-contemporanea — [phrase; partial: none] — "El viento soplaba sin tregua en la noche" (no AR).
- `sinceridad` — 3 — b1-relaciones-personales — [single] — "…un vínculo muy estrecho basado en la sinceridad." / "…رابطة وثيقة جداً قائمة على الصدق والصراحة."
- `sincretismo` — 3 — b2-patrimonio-cultural-inmaterial — [single] — token-only.
- `subsanar` — 3 — b1-agradecimiento-disculpa — [single] — token-only.
- `subtexto` — 3 — c1-critica-ensayo — [single] — "…prestando atención al subtexto podemos comprender…" / "…عبر الإنصات إلى النص المضمر والباطني…".
- `suceso` — 3 — b1-cronica-periodistica, b1-noticias-prensa — [single] — token-only.
- `sueldo neto` — 3 — b1-condiciones-laborales — [phrase; partial: sueldo ✓ / neto ✗] — token-only. (Cf. `sueldo bruto`.)
- `sumarse` — 3 — b2-conclusion-llamada-accion — [single] — "…les invito a dar el paso, sumarse a esta visión…" / "…أدعوكم لاتخاذ الخطوة، والانضمام إلى هذه الرؤية…". Reflexive verb — same lemma-vs-reflexive decision as `reconciliarse`.
- `sustento` — 3 — c1-refutacion-dialectica — [single] — "Su razonamiento carece de sustento empírico…" / "طرحه يفتقر إلى أي سند تجريبي…".
- `temo que` — 3 — b1-subjuntivo-sentimientos — [phrase; partial: none] — token-only ("Temo que").
- `tener el honor de` — 3 — b2-comunicacion-institucional-diplomatica — [phrase; partial: tener, honor, de ✓ / el ✗] — NO ATTESTATION.
- `testigo presencial` — 3 — b1-cronica-periodistica — [phrase; partial: testigo ✓ / presencial ✗] — token-only.
- `timo` — 3 — b1-guia-consejos-viajero — [single] — "Hay que tomar precauciones para evitar el timo" (no AR).
- `tocante` — 3 — c1-conectores-metadiscursivos — [single] — "En lo tocante a la metodología empírica…" / "فيما يتعلق بالمنهجية التجريبية…". (Adjective/participle of `tocar`? `tocar` exists — human to decide form row vs entry; kept in (d) since no form row was found.)
- `transposición` — 3 — c1-traduccion-literaria — [single] — "Traducir poesía exige una transposición creadora…" / "تتطلب ترجمة الشعر نقلة وتحويلاً إبداعياً…".
- `urgente` — 3 — a2-mensajes-recados — [single] — token-only.
- `vanguardia` — 3 — c1-generacion-del-27 — [single] — "…con las audacias de la vanguardia." / "…مع جرأة مدارس الطليعة الحديثة."
- `vocación investigadora` — 3 — b2-carta-motivacion-becas-empleo — [phrase; partial: vocación ✓ / investigadora ✗] — token-only.
- `a diferencia de` — 2 — a2-contrastes-culturales — [phrase; partial: diferencia, de ✓ / a ✗] — NO ATTESTATION.
- `a nombre de` — 2 — a2-dialogo-reserva — [phrase; partial: nombre, de ✓ / a ✗] — token-only.
- `a raíz de` — 2 — b2-conectores-causa-efecto-avanzados — [phrase; partial: raíz, de ✓ / a ✗] — NO ATTESTATION.
- `abundamiento` — 2 — c1-conectores-metadiscursivos — [single] — "A mayor abundamiento, los testimonios de archivo corroboran…" / "وزيادة في التأكيد والإثبات، فإن وثائق الأرشيف تعزز…". (Locution "a mayor abundamiento" is the unit; ref is the head noun — human to decide scope.)
- `adjuntar` — 2 — b1-carta-formal-correo — [single] — token-only (in another lesson: "…es imprescindible adjuntar el _____ de la reserva.").
- `adjunto remitimos` — 2 — b2-correspondencia-corporativa — [phrase; partial: none] — token-only ("Adjunto remitimos").
- `apetecer` — 2 — a2-conversacion-hobbies — [single] — NO ATTESTATION (real verb, gustar-type; gloss must come from the lesson).
- `arbitral` — 2 — c1-arbitraje-comercial — [single] — "…en virtud del convenio arbitral." / "…استناداً إلى اتفاقية التحكيم المبرمة."
- `artificio` — 2 — c1-siglo-de-oro — [single] — "Lejos de ser mero artificio vacío…" / "…مجرد صنعة وزخرف خاوٍ…".
- `asimetría` — 2 — c1-interferencias-sintacticas — [single] — sense ex. of entry `asimetría de poder`: "La asimetría de poder resulta fundamental…" / "يعد الـانعدام التكافؤ والتوازن بين الطرفين أساسياً…". (Note: an entry `asimetría de poder` exists; the bare noun still needs its own decision.)
- `atención al cliente` — 2 — b1-dialogo-atencion-cliente — [phrase; partial: atención, cliente ✓ / al ✗] — token-only.
- `cantidad` — 2 — a2-comparativos-igualdad — [single] — token-only.
- `carta` — 2 — b1-carta-formal-correo, b2-formulas-protocolarias-cierre — [single] — token-only (in another lesson: "Ya he _____ la carta para el consulado.").
- `carta de motivación` — 2 — b2-carta-motivacion-becas-empleo — [phrase; partial: de, motivación ✓ / carta ✗] — NO ATTESTATION.
- `celular` — 2 — c1-americanismos-lexicos — [single] — NO ATTESTATION (Americanism for mobile phone; gloss/derivation must come from the lesson — the obvious meaning must still be confirmed against lesson text, not assumed).
- `cien` — 2 — a1-numeros-20-100 — [single] — "Cuesta cien euros en total." / "السعر مئة يورو في المجموع."
- `cincuenta` — 2 — a1-numeros-20-100 — [single] — "Cincuenta y tres euros" (no AR).
- `cohesión` — 2 — c1-ensayo-cultural — [single] — "Es indispensable asegurar una perfecta cohesión…" / "…تأمين اتساق وترابط محكم…".
- `constipado` — 2 — c1-falsos-amigos-avanzados — [single] — "…traducir 'constipado' por estreñimiento [es un error]; en español significa tener un resfriado común." / "…تعني ببساطة الإصابة بنزلة برد وزكام." (False-friend lesson — gloss explicit in-project.)
- `cordial` — 2 — c1-correspondencia-formal — [single] — sense ex. of `invitación`: "Aceptó encantado la cordial invitación de boda…" / "قبل بكل سرور دعوة الزفاف الودية…".
- `coste de oportunidad` — 2 — b2-persuasion-manejo-objeciones — [phrase; partial: coste, de ✓ / oportunidad ✗] — NO ATTESTATION.
- `costumbre` — 2 — a2-contrastes-culturales — [single] — "La familia es el centro de nuestra costumbre" (no AR).
- `cuarenta` — 2 — a1-numeros-20-100 — [single] — "Ese cuesta cuarenta y cinco euros." / "ذاك سعره خمسة وأربعون يورو."
- `culteranismo` — 2 — c1-siglo-de-oro — [single] — "…Góngora deslumbra con el culteranismo…" / "…يبهر غونغورا القراء بمذهب الزخرف اللفظي…".
- `delimitar` — 2 — b2-estructura-ensayo-academico — [single] — "Es fundamental delimitar con claridad el objeto de estudio" (no AR).
- `desarticular` — 2 — c1-refutacion-dialectica — [single] — "Hemos logrado desarticular la teoría adversaria…" / "لقد نجحنا في تفكيك النظرية المنافسة…".
- `devolver la llamada` — 2 — a2-mensajes-recados — [phrase; partial: devolver, llamada ✓ / la ✗] — NO ATTESTATION.
- `doblaje` — 2 — c1-espanol-neutro — [single] — "…para amortizar los costes de doblaje…" / "…لتقليص نفقات الدبلجة…".
- `editorial` — 2 — b2-analisis-prensa-editorial — [single] — token-only ("el editorial").
- `embargar` — 2 — b2-expresion-estetica-emociones — [single] — token-only.
- `en palabras de` — 2 — b2-citacion-fuentes-academicas — [phrase; partial: de ✓ / en, palabras ✗] — NO ATTESTATION.
- `energía fotovoltaica` — 2 — b2-debate-energia-desarrollo — [phrase; partial: energía ✓ / fotovoltaica ✗] — NO ATTESTATION.
- `equivalencia` — 2 — c1-traduccion-literaria — [single] — "Buscamos una equivalencia estética…" / "إننا ننشد تكافؤاً جمالياً…".
- `es conveniente que` — 2 — b1-subjuntivo-recomendaciones — [phrase; partial: none] — NO ATTESTATION.
- `escritura` — 2 — b1-conectores-discursivos — [single] — token-only (in another lesson: "…para otorgar esta escritura pública ante notario." / "…لتحرير وتوثيق هذا السند الرسمي…").
- `estilo de vida` — 2 — a2-contrastes-culturales — [phrase; partial: de, vida ✓ / estilo ✗] — token-only.
- `eventual` — 2 — c1-falsos-amigos-avanzados — [single] — "…un empleo es 'eventual', nos referimos a que es temporal e incierto…" / "…تعني أنها مؤقتة وغير مستقرة…". (False-friend gloss explicit in-project.)
- `facilísimo` — 2 — a2-superlativos — [single] — token-only (superlative of `fácil` — human to decide superlative form row vs entry; `fácil` exists).
- `feliz` — 2 — b1-subjuntivo-sentimientos — [single] — token-only (in another lesson: "…una adaptación paulatina y feliz").
- `fervor popular` — 2 — b2-patrimonio-cultural-inmaterial — [phrase; partial: popular ✓ / fervor ✗] — "La fiesta se celebra con un gran fervor popular" (no AR).
- `fidelidad` — 2 — c1-traduccion-literaria — [single] — "La verdadera fidelidad no consiste en contar palabras…" / "ليست الأمانة الحقة في عد الكلمات حرفياً…".
- `ha` — 2 — a2-perfecto-formacion — [single; haber-form] — token-only.
- `hasta` — 2 — a1-horario-trabajo — [single] — token-only.
- `hemos` — 2 — a2-perfecto-formacion — [single; haber-form] — token-only.
- `hito` — 2 — c1-memoria-institucional — [single] — "Hemos alcanzado con éxito el principal hito estratégico…" / "لقد حققنا بنجاح المعلم والمحطة الاستراتيجية الكبرى…".
- `homogeneización` — 2 — c1-espanol-neutro — [single] — "…si esta homogeneización empobrece la rica diversidad dialectal." / "…ما إذا كان هذا التنميط والتوحيد القسري يفقر التنوع اللهجي…".
- `horas extras` — 2 — b1-condiciones-laborales — [phrase; partial: none] — token-only.
- `interponer un recurso` — 2 — b2-reclamaciones-juridicas-instancias — [phrase; partial: recurso ✓ / interponer, un ✗] — token-only.
- `jamás` — 2 — a2-marcadores-experiencias — [single] — token-only.
- `juntos` — 2 — a2-conversacion-planes — [single] — token-only.
- `levantar la sesión` — 2 — b2-gestion-reuniones-orden-dia — [phrase; partial: levantar, sesión ✓ / la ✗] — token-only.
- `magno` — 2 — c1-discurso-conmemorativo — [single] — "Su magno magisterio ha dejado una huella indeleble…" / "لقد تركت أستاذيته الكبرى… أثراً لا يُمحى…".
- `matricularse` — 2 — b1-estudios-universidad — [single] — token-only (reflexive verb — same lemma-vs-reflexive decision as `reconciliarse`).
- `me da rabia que` — 2 — b1-expresar-quejas-molestias — [phrase; partial: rabia ✓ / me, da, que ✗] — "Me da rabia que se corte la conexión" (no AR).
- `me dirijo a usted` — 2 — b1-carta-formal-correo — [phrase; partial: usted ✓ / me, dirijo, a ✗] — token-only.
- `me indigna que` — 2 — b1-expresar-quejas-molestias — [phrase; partial: none] — token-only ("Me indigna que").
- `me sorprende que` — 2 — b1-subjuntivo-sentimientos — [phrase; partial: none] — "Me sorprende que hables español tan bien" (no AR).
- `medio de comunicación` — 2 — b1-noticias-prensa — [phrase; partial: medio, de ✓ / comunicación ✗] — "Todo medio de comunicación debe verificar rigurosamente los hechos." / "يجب على كل وسيلة إعلام أن تتحقق بدقة من الوقائع."
- `meditativa` — 2 — c1-ensayo-cultural — [single] — "…una prosa meditativa que invite al recogimiento." / "…لنثر تأملي عميق…". (Feminine-form decision, as `cierta`.)
- `mestiza` — 2 — c1-realismo-magico — [single] — "…la cosmovisión mestiza…" / "…الرؤية الهجينة المركبة…". (Feminine-form decision, as `cierta`.)
- `narrador omnisciente` — 2 — b2-literatura-narrativa-contemporanea — [phrase; partial: narrador ✓ / omnisciente ✗] — token-only.
- `no obstante` — 2 — b1-conectores-discursivos — [phrase; partial: no ✓ / obstante ✗] — "No obstante seguiremos trabajando en el proyecto" (no AR).
- `nutrientes` — 2 — b1-habitos-saludables — [single] — token-only.
- `objeto de estudio` — 2 — b2-estructura-ensayo-academico — [phrase; partial: objeto, de ✓ / estudio ✗] — "Es fundamental delimitar con claridad el objeto de estudio" (no AR).
- `ochenta` — 2 — a1-numeros-20-100 — [single] — token-only.
- `pasatiempo` — 2 — a2-gustos-preferencias-avanzadas — [single] — token-only.
- `perdiz` — 2 — c1-modismos-cultos — [single] — see occ-3 row above (same sentence; listed twice because the ref occurs in two channels of the same lesson family — occ counts all channels).
- `perjuicio` — 2 — c1-traduccion-juridica — [single] — "…sin perjuicio de las indemnizaciones…" / "…دون الإخلال بحق المطالبة بالتعويضات…".
- `personificación` — 2 — b2-metaforas-recursos-literarios — [single] — token-only.
- `pirámide poblacional` — 2 — b2-transformacion-social-demografia — [phrase; partial: none] — NO ATTESTATION.
- `plenario` — 2 — c1-ponencias-congresos — [single] — NO ATTESTATION.
- `precedente` — 2 — c1-conectores-metadiscursivos — [single] — "A la luz de lo precedente, la tesis realiza una aportación sustancial…" / "وعلى ضوء ما تقدم ذكره، فإن هذه الأطروحة تقدم إسهاماً جوهرياً…".
- `prevenir` — 2 — b1-habitos-saludables — [single] — token-only.
- `primera` — 2 — a1-direcciones — [single] — "Tomas la primera calle a la derecha" (no AR). (Feminine ordinal — same decision as `segunda`.)
- `prohibir taxativamente que` — 2 — b2-politicas-ambientales-subjuntivo — [phrase; partial: none] — NO ATTESTATION.
- `promulgación` — 2 — c1-nominalizacion — [single] — "La promulgación de la nueva ley tributaria favoreció…" / "إن إصدار القانون الضريبي الجديد ساعد…". (Cf. `promulgado` in (b).)
- `próximo` — 2 — a2-ir-a-infinitivo — [single] — "El próximo lunes _____ a comenzar el nuevo curso." / "الاثنين القادم سوف نبدأ الدورة الجديدة."
- `rabo` — 2 — c1-locuciones-adverbiales — [single] — "…de cabo a rabo sin hallar ninguna anomalía." / "…من أولها إلى آخرها دون أن نعثر على أي شائبة." (Idiom component "de cabo a rabo"; entry is the literal noun — human to confirm.)
- `reformular` — 2 — b2-gestion-preguntas-respuestas — [single] — "Permítame reformular su pregunta…" (no AR).
- `refrán` — 2 — c1-refranes-modismos — [single] — token-only (in another lesson: "El refrán subraya la necesidad de respetar los tiempos…").
- `regañadientes` — 2 — c1-locuciones-adverbiales — [single] — "El director aceptó las cláusulas a regañadientes…" / "قبل المدير البنود على مضض…". (Locution "a regañadientes" is the unit; ref is the head word — human to decide scope.)
- `rehilado` — 2 — c1-prosodia-fonetica — [single] — "…destaca el yeísmo rehilado, donde la 'll' suena…" / "…يبرز الـ Yeísmo Rehilado، حيث يُنطق حرفا 'll'…".
- `reiterar` — 2 — b2-entrevista-periodistica — [single] — token-only (in another lesson: "…tiene el honor de reiterar las seguridades de su más distinguida consideración." / "…وتتشرف بأن تجدد لسيادته الإعراب عن فائق تقديرها…").
- `resulta alarmante que` — 2 — b2-analisis-prensa-editorial — [phrase; partial: none] — "Resulta alarmante que _____ tanta precariedad en el empleo juvenil." / "يثير القلق الشديد أن يوجد هذا القدر من الهشاشة…".
- `resulta cuestionable que` — 2 — b2-hechos-vs-opiniones — [phrase; partial: none] — "Resulta cuestionable que la nueva estrategia _____ un impacto inmediato…" / "يثير الشك والجدل أن يكون للاستراتيجية الجديدة تأثير فوري…".
- `riqueza cultural` — 2 — a2-mi-pais-costumbres — [phrase; partial: riqueza ✓ / cultural ✗] — NO ATTESTATION.
- `salud mental` — 2 — b1-bienestar-emocional — [phrase; partial: salud ✓ / mental ✗] — "Debemos cuidar nuestra salud mental siempre" (no AR).
- `se constata que` — 2 — b2-pasiva-periodistica-se — [phrase; partial: none] — token-only ("se constata que").
- `se habla` — 2 — a2-impersonal-se — [phrase; partial: habla ✓ / se ✗] — NO ATTESTATION.
- `sesenta` — 2 — a1-numeros-20-100 — [single] — token-only.
- `setenta` — 2 — a1-numeros-20-100 — [single] — token-only.
- `someter a votación` — 2 — b2-gestion-reuniones-orden-dia — [phrase; partial: someter, votación ✓ / a ✗] — "…procedemos a someter a votación la propuesta." / "…سنشرع في طرح المقترح للتصويت."
- `sustitución` — 2 — b1-pedir-soluciones-reparacion — [single] — token-only.
- `transmitir` — 2 — b1-estilo-indirecto-presente — [single] — sense ex. of `vivo`: "El pintor usó colores vivos para transmitir alegría." / "استخدم الرسام ألواناً زاهية لنقل البهجة." (No lesson-sentence attestation; gloss derivable from this example.)
- `tratar en la pausa` — 2 — b2-gestion-preguntas-respuestas — [phrase; partial: tratar, pausa ✓ / en, la ✗] — NO ATTESTATION.
- `treinta` — 2 — a1-numeros-20-100 — [single] — "El libro de gramática cuesta treinta y cinco euros." / "كتاب القواعد سعره خمسة وثلاثون يورو."
- `veinte` — 2 — a1-numeros-20-100 — [single] — token-only ("veinte y cuatro" — sic in source; human to check whether the lesson text itself has the nonstandard form).
- `verosimilitud` — 2 — c1-realismo-magico — [single] — "La perfecta verosimilitud del relato desarma la incredulidad…" / "إن الصدق الفني والإقناع السردي المحكم يجرّد القارئ…".
- `vos` — 2 — c1-voseo-variacion — [single] — "Che, vos sabés muy bien que tu novela…" / "اسمع يا صديقي، أنت تعلم جيداً أن روايتك…". (Pronoun; entry-worthy as the voseo pronoun — kept in (d).)
- `yeísmo` — 2 — c1-prosodia-fonetica — [single] — "…destaca el yeísmo rehilado…" / "…يبرز الـ Yeísmo Rehilado…".
- `anteposición` — 1 — c1-interferencias-sintacticas — [single] — NO ATTESTATION.
- `aspecto` — 1 — b2-matizar-opiniones — [single] — token-only (in another lesson: "Es un aspecto muy técnico…" / "هذه نقطة فنية دقيقة…").
- `conector` — 1 — b2-conectores-argumentativos — [single] — NO ATTESTATION (the lesson is about conectores; the singular head noun is list-only).
- `contra` — 1 — b2-contraargumentacion — [single] — token-only (in another lesson: "en contra de"). Fragment of "en contra (de)" listed standalone — human to decide entry vs full phrase.
- `correlación temporal` — 1 — b1-estilo-indirecto-pasado — [phrase; partial: temporal ✓ / correlación ✗] — NO ATTESTATION.
- `crecimiento` — 1 — c1-nominalizacion — [single] — token-only (in another lesson: "…afecta al crecimiento económico" / "…تؤثر على النمو الاقتصادي" — attestation exists outside the occurrence lesson).
- `desinencia` — 1 — c1-voseo-variacion — [single] — "…el voseo culto rioplatense conserva una desinencia histórica…" / "…تحافظ على لاحقة تاريخية…".
- `discrepar` — 1 — b1-acuerdo-desacuerdo — [single] — sense ex. of `ostracismo`: "Sufrió el ostracismo político tras discrepar con la cúpula." / "تعرض للنفي والعزل… بعد معارضته للقيادة." (No lesson-sentence attestation; gloss derivable from this example.)
- `esperar que` — 1 — b1-ojala-deseos — [phrase; partial: esperar ✓ / que ✗] — NO ATTESTATION.
- `fortuito` — 1 — c1-clausulas-compromiso — [single] — "…fuerza mayor o caso fortuito podrán eximir del pago." / "…القوة القاهرة أو الحادث الفجائي غير المتوقع…".
- `habéis` — 1 — a2-perfecto-formacion — [single; haber-form] — token-only (in another lesson: "¡Vosotros habéis perdido mi maleta!").
- `has` — 1 — a2-perfecto-formacion — [single; haber-form] — token-only (in another lesson: "Carlos, ¿has visto mis llaves?…").
- `medio ambiente` — 1 — b2-politicas-ambientales-subjuntivo — [phrase; partial: medio ✓ / ambiente ✗] — sense ex. of `albatros`: "…una maravilla de la naturaleza y del medio ambiente." / "…من روائع الطبيعة والبيئة الحية." (No lesson-sentence attestation.)
- `por tanto` — 1 — b2-conectores-causa-efecto-avanzados — [phrase; partial: none] — NO ATTESTATION.
- `se alquila` — 1 — a2-impersonal-se — [phrase; partial: none] — NO ATTESTATION.
- `texto` — 1 — b1-conectores-discursivos — [single] — token-only (in another lesson: "El texto está muy bien organizado…").
- `tuteo` — 1 — c1-voseo-variacion — [single] — "…en Madrid usamos el tuteo con otra conjugación verbal." / "…نستخدم صيغة المخاطبة tuteo بتصريف فعلي مختلف."

**The 49 (d) items with no reliable attestation** (vocab-list only; human must open the lesson — deletion of the ref is a legitimate outcome): `a diferencia de`, `a raíz de`, `abrir el turno`, `admitir a trámite`, `agradecer la presencia`, `anteposición`, `apetecer`, `carta de motivación`, `ceder la palabra`, `celular`, `ceñirse al tema`, `cinésica`, `clima laboral`, `conector`, `correlación temporal`, `coste de oportunidad`, `debatirse entre`, `devolver la llamada`, `disipar dudas`, `efecto invernadero`, `en palabras de`, `encajar en el perfil`, `energía fotovoltaica`, `entrar en vigor`, `es conveniente que`, `especializarse`, `esperar que`, `estancarse`, `estar dispuesto a`, `estructurar`, `instar a que`, `llevarse bien`, `matiz`, `modismo`, `pirámide poblacional`, `plenario`, `poner con`, `por tanto`, `postura de partida`, `prohibir taxativamente que`, `quedar a su disposición`, `rasgo dialectal`, `riqueza cultural`, `se alquila`, `se habla`, `se prevé que`, `surtir efectos legales`, `tener el honor de`, `tratar en la pausa`.

### (e) Typo / malformed — 0 distinct, 0 occurrences

No ref meets typo/malformed criteria after evidence checks. Specifically tested and **rejected**: Levenshtein distance ≤2 to an existing entry (accent-stripped). That test fires spuriously for real words — 118 of the 131 distance-≤2 candidates are attested in lesson body text, and the remaining 13 are all valid Spanish words in fitting lesson contexts (`euro` — currency, A1 prices; `rigor` — 89 occurrences across C1 academic lessons, attested in sentences; `ojalá`, `voseo`, `seseo`, `tuteo` — technical terms of their own lessons; `madrid` — proper noun, moved to (f); `texto`, `matiz`, `modismo`, `conector`, `discrepar`, `transmitir`, `cordial`, `estructurar`, `asimetría`, `celular`, `dispararse`, `alojarse` — all real words, the last two reclassified to (b)). Zero refs are empty, digit-bearing, Arabic-script, id-like, or non-string. **Caveat:** this rules out *string-level* typos only. A wrong-but-real word choice inside a lesson (e.g. a semantically wrong word that happens to exist) cannot be detected by string analysis and needs human reading. Do not "fix" any (d) item by silently substituting its nearest neighbour.

### (f) Other (non-lexical) — 15 distinct, 51 occurrences — REMOVE/REPLACE THE REFS, NO ENTRIES

- Function words as standalone vocab refs (6): `lo` — 6 — a2-pronombres-objeto-directo · `que` — 6 — a2-comparativos-superioridad · `por` — 4 — b1-por-vs-para · `la` — 3 — a2-pronombres-objeto-directo · `las` — 2 — a2-pronombres-objeto-directo · `los` — 2 — a2-pronombres-objeto-directo. These are pronouns/articles/preposition/conjunction taught as grammar, not vocabulary; an SRS vocab card for `la`/`que` is the wrong instrument. Decision: remove from vocab lists (keep in grammar structures) or handle in a grammar module — human/content decision.
- Grammar-pattern notations containing `+` (5): `dice que + indicativo` — 3 — b1-estilo-indirecto-presente · `dice que + subjuntivo` — 3 — b1-estilo-indirecto-presente · `dijo que + condicional` — 4 — b1-estilo-indirecto-pasado · `dijo que + imperfecto` — 4 — b1-estilo-indirecto-pasado · `dijo que + pluscuamperfecto` — 2 — b1-estilo-indirecto-pasado. These are rule labels, not words/phrases; they can never match a lexicon entry. Remove from vocab lists; the patterns belong in `targetStructures`/grammar notes.
- Proper nouns / proper-derived (4): `madrid` — 1 — b1-por-vs-para — "Vine a Madrid para estudiar un máster…" / "جئتُ إلى مدريد…". City name; remove the ref (or keep Madrid only inside sentences). · `aquiles` — 3 — c1-metaforas-vida-cultura — part of idiom "talón de Aquiles"; the teachable unit is the idiom, not the name standalone. · `lorquiana` — 4 — c1-generacion-del-27 — "En la obra lorquiana, la metáfora no es simple adorno…" / "في إبداع لوركا، لا تعد الاستعارة مجرد زينة…". Author-derived adjective; borderline — an entry *could* be authored from this sentence, but it needs an explicit decision (entry vs cultural note). · `españa vaciada` — 4 — b2-transformacion-social-demografia — demographic term containing a proper noun ("España vaciada" — attested as "España vaciada" in sentences). Decision: phrase entry with proper noun, or remove; do not treat as ordinary vocab without a decision.

## 6. Fix plan (ordered) and what to verify after

1. **(a) 3 strings** — rewrite the refs to the entry `normalized` forms (or add the validator's punctuation-strip to the importer's lookup). Re-run `buildContentPlan('content/drafts')`: unresolved distinct should drop 525 → 522; link statements 1,292 → 1,297 (5 new occurrences, all distinct pairs — verify no new duplicates).
2. **Build the `vocabulary_forms` pipeline** (the precondition for (b)): populate the table from `forms[]` (51,798 rows; dedupe identical `(entry, kind, form, tense, person)` — note duplicate form rows exist, e.g. `tendría` twice for tener 1s/3s) **plus** `plural`-field values (4,042 entries) **plus** the paradigm extensions decided in step 3; add an importer fallback `normalized → form → lemma` (exact match only, accent-sensitive) for `new`/`review` refs; add a regression test that the 38 verified (b) VERB/PLURAL strings now link and that the 19 homographs do **not** link to their verb lemmas. Do not populate from the accent-stripped search index (it merges distinct words).
3. **Paradigm decisions (human/linguist):** imperfecto de subjuntivo for all verbs (derivable from recorded pretérito 3p stems — spot-check irregulars); reflexive infinitives (`-se` forms) and reflexive-verb entry policy (`reconciliarse`, `matricularse`, `sumarse`, `desplomarse`, `llevarse bien`, `debatirse entre`); feminine/ordinal form rows vs own entries (`cierta`, `meditativa`, `mestiza`, `primera`, `resolutoria`, `segunda`, `cerrada`, `gorda`); superlative `facilísimo`; spelling variant `quizás`/`quizá`; accent-variant form `cabría` vs ref `cabria` (accent policy — per-string verified mapping only).
4. **(b) homographs + ambiguous (21 strings):** author new entries from the quoted sentences (meanings are in-project for most); `fui` needs a link-to-both or paradigm-note decision; `anhelo` needs the lesson opened. Re-verify each against its sentence before writing the entry.
5. **(c) 36 phrases:** decide per phrase (phrase entry with `kind: expression/collocation` + human-written meaning, vs component links, vs ref removal). The 7 ★ phrases have in-project Arabic glosses; the other 29 need human translation — do not invent glosses.
6. **(d) 403 entries:** author entries in occurrence order (rigor first — 89 occurrences). For the 49 unattested items, open the lesson first; delete the ref if it is list noise. Add the missing `haber` entry with its full paradigm (this resolves 6 refs at once, plus the perfecto lessons' core verb). Add missing lemmas behind (d) verb forms (`amanecer`, `especializar`, `estancar`, `ceñir`, `soler`, `desear`-family checks) where the lesson requires them.
7. **`targetVocab` (2,556 refs, 503 distinct unresolved in that channel):** decide whether `targetVocab` should link at all. If yes, extend the importer to link it (same fallback chain) — this is a behavior change needing approval, not a content edit. If no, remove the validator's `targetVocab` unresolved warnings or document that the channel is informational only. Either way, do not leave the current state (validator flags, importer ignores).
8. **(f) 15 strings:** remove/replace refs per §5f; keep the grammar patterns in `targetStructures`.
9. **Re-verify:** re-run this same recomputation (importer-exact normalization, global scope, all 3 channels) plus `validate-content` per folder, `count-lexicon --ci`, and the SRS-card generation path (`createCardsForLesson` on a completed lesson) to confirm new links produce cards without duplicates and without touching existing user progress (links are content-level; no user rows are created by import). Expected end state if all human decisions are made: 0 unresolved distinct strings **by legitimate resolution only** — never by deleting refs to hit zero or by inventing entries.

## 7. Exemplars (separate plan — not part of the 525)

`content/exemplars`: 3 lessons, 39 refs, 29 resolved, 10 unresolved occurrences, **7 distinct** unresolved against the exemplar-only lexicon (20 entries): `comprobar` (cc1-saludo-profesional; resolves against drafts lexicon), `deletrear` (same; resolves against drafts lexicon), `con leche` (a1-un-cafe-por-favor), `en qué puedo ayudarle`, `le atiende` (×2), `no se retire`, `¿podría facilitarme…?` (×3, with ellipsis + question marks — punctuation-variant, cf. (a)) — all in cc1-saludo-profesional. The two that resolve against drafts show the separate-plan cost in miniature: in a combined import they would link; in the shipped separate plans they do not. The other five are genuinely absent phrase entries for the call-center exemplar.

## 8. Limitations

- Context search covered scenario lines, exercise stems, option text, and accepted answers, plus vocab sense examples. Text in `instructionAr`, `explanationAr`, `contextAr`, `targetStructures`, and exercise `items` payloads was **not** searched — a ref marked "token-only" or "no attestation" may be glossed in an explanation field; the 49 unattested items should be re-checked against those fields when the lesson is opened.
- Accent-insensitive searching was used only to *find* sentences; all matching decisions used the importer's exact normalization. Spanish morphological judgments (paradigm gaps, reflexive forms, feminine variants) are based on the recorded `forms[]` data and lesson context, not on an external dictionary or native-speaker review — the (b)/(d) boundary for a handful of items (`mareo`, `parecido`, `cierta`, `meditativa`, `mestiza`, `tocante`) rests on lesson-topic evidence and is flagged as human-to-confirm in the rows.
- No judgment is made here about whether any *resolved* link is pedagogically correct (e.g. a resolved ref linked to the wrong sense of a polysemous entry) — that needs the linguistic review that, per project records, still stands at 0 of 212 lessons reviewed.