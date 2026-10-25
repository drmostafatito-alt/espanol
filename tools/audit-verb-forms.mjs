#!/usr/bin/env node
/**
 * tools/audit-verb-forms.mjs — تدقيق آلي لتصريفات الأفعال المخزّنة في حزم المفردات
 *
 * لماذا: التصريفات مُولَّدة آليًا، والمولّدات تعامل كل فعل معاملة «المنتظم».
 * هذا ينتج صيغًا غير موجودة في الإسبانية (transfero، Recogo، agradezo، atendo، incluo)
 * تُعرض للمتعلم في بطاقات المفردات. الخطأ هنا ليس أسلوبيًا بل خطأ لغوي مؤكد.
 *
 * القواعد المطبَّقة ميكانيكية وقابلة للإثبات:
 *   V1  -ger/-gir  ⇒ صيغة المتكلم المفرد في المضارع تُبدل g بـj  (recoger → recojo)
 *   V2  -cer/-cir (بعد حرف علة) ⇒ تُضاف z قبل c                (conocer → conozco)
 *   V3  -uir (وليس -guir/-quir) ⇒ تُضاف y قبل o في المضارع       (incluir → incluyo)
 *   V4  أفعال تغيّر جذرها e→ie / o→ue / e→i (قائمة معروفة) ⇒ تُفحص صيغ المضارع الثلاث
 *   V5  جيروند/اسم المفعول يجب أن يكونا موجودين لكل فعل له تصريفات
 *
 * الاستخدام:
 *   node tools/audit-verb-forms.mjs [--json reports/audit/verb-forms.json]
 * الخروج: 1 إذا وُجدت مخالفة، 0 إذا كان كل شيء سليمًا.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** أفعال تغيّر جذرها: المصدر → { 1s, 2s, 3s, 3p } في المضارع الدلالي. */
const STEM_CHANGERS = {
  // e → ie
  pensar: ['pienso', 'piensas', 'piensa', 'piensan'],
  empezar: ['empiezo', 'empiezas', 'empieza', 'empiezan'],
  entender: ['entiendo', 'entiendes', 'entiende', 'entienden'],
  atender: ['atiendo', 'atiendes', 'atiende', 'atienden'],
  querer: ['quiero', 'quieres', 'quiere', 'quieren'],
  preferir: ['prefiero', 'prefieres', 'prefiere', 'prefieren'],
  sentir: ['siento', 'sientes', 'siente', 'sienten'],
  transferir: ['transfiero', 'transfieres', 'transfiere', 'transfieren'],
  mentir: ['miento', 'mientes', 'miente', 'mienten'],
  cerrar: ['cierro', 'cierras', 'cierra', 'cierran'],
  despertar: ['despierto', 'despiertas', 'despierta', 'despiertan'],
  // o → ue
  poder: ['puedo', 'puedes', 'puede', 'pueden'],
  volver: ['vuelvo', 'vuelves', 'vuelve', 'vuelven'],
  dormir: ['duermo', 'duermes', 'duerme', 'duermen'],
  encontrar: ['encuentro', 'encuentras', 'encuentra', 'encuentran'],
  contar: ['cuento', 'cuentas', 'cuenta', 'cuentan'],
  recordar: ['recuerdo', 'recuerdas', 'recuerda', 'recuerdan'],
  mostrar: ['muestro', 'muestras', 'muestra', 'muestran'],
  mover: ['muevo', 'mueves', 'mueve', 'mueven'],
  // e → i
  pedir: ['pido', 'pides', 'pide', 'piden'],
  servir: ['sirvo', 'sirves', 'sirve', 'sirven'],
  repetir: ['repito', 'repites', 'repite', 'repiten'],
  decir: ['digo', 'dices', 'dice', 'dicen'],
  seguir: ['sigo', 'sigues', 'sigue', 'siguen'],
  // غير منتظمة شائعة تُكتب غالبًا خطأً بالجذر
  tener: ['tengo', 'tienes', 'tiene', 'tienen'],
  venir: ['vengo', 'vienes', 'viene', 'vienen'],
  oír: ['oigo', 'oyes', 'oye', 'oyen'],
  ir: ['voy', 'vas', 'va', 'van'],
  ser: ['soy', 'eres', 'es', 'son'],
  estar: ['estoy', 'estás', 'está', 'están'],
  hacer: ['hago', 'haces', 'hace', 'hacen'],
  poner: ['pongo', 'pones', 'pone', 'ponen'],
  salir: ['salgo', 'sales', 'sale', 'salen'],
  traer: ['traigo', 'traes', 'trae', 'traen'],
  conocer: ['conozco', 'conoces', 'conoce', 'conocen'],
  conducir: ['conduzco', 'conduces', 'conduce', 'conducen'],
  recoger: ['recojo', 'recoges', 'recoge', 'recogen'],
  deshacer: ['deshago', 'deshaces', 'deshace', 'deshacen'],
  predecir: ['predigo', 'predices', 'predice', 'predicen'],
  coger: ['cojo', 'coges', 'coge', 'cogen'],
  proteger: ['protejo', 'proteges', 'protege', 'protegen'],
  agradecer: ['agradezco', 'agradeces', 'agradece', 'agradecen'],
  ofrecer: ['ofrezco', 'ofreces', 'ofrece', 'ofrecen'],
  parecer: ['parezco', 'pareces', 'parece', 'parecen'],
  incluir: ['incluyo', 'incluyes', 'incluye', 'incluyen'],
  huir: ['huyo', 'huyes', 'huye', 'huyen'],
  construir: ['construyo', 'construyes', 'construye', 'construyen'],
  jugar: ['juego', 'juegas', 'juega', 'juegan'],
};

/**
 * صيغ الماضي البسيط (3s) والجيروند للأفعال التي يتغير جذرها قبل النهاية.
 * المولّد يعاملها كمنتظمة فينتج «transferió» و«incluió» و«transferiendo».
 */
const STEM_IRREGULARS = {
  dormir: { preterite3s: 'durmió', gerund: 'durmiendo' },
  morir: { preterite3s: 'murió', gerund: 'muriendo' },
  pedir: { preterite3s: 'pidió', gerund: 'pidiendo' },
  repetir: { preterite3s: 'repitió', gerund: 'repitiendo' },
  servir: { preterite3s: 'sirvió', gerund: 'sirviendo' },
  preferir: { preterite3s: 'prefirió', gerund: 'prefiriendo' },
  sentir: { preterite3s: 'sintió', gerund: 'sintiendo' },
  mentir: { preterite3s: 'mintió', gerund: 'mintiendo' },
  transferir: { preterite3s: 'transfirió', gerund: 'transfiriendo' },
  seguir: { preterite3s: 'siguió', gerund: 'siguiendo' },
  decir: { preterite3s: 'dijo', gerund: 'diciendo' },
  venir: { preterite3s: 'vino', gerund: 'viniendo' },
  poder: { preterite3s: 'pudo', gerund: 'pudiendo' },
  poner: { preterite3s: 'puso', gerund: 'poniendo' },
  tener: { preterite3s: 'tuvo', gerund: 'teniendo' },
  huir: { preterite3s: 'huyó', gerund: 'huyendo' },
  incluir: { preterite3s: 'incluyó', gerund: 'incluyendo' },
  construir: { preterite3s: 'construyó', gerund: 'construyendo' },
  oír: { preterite3s: 'oyó', gerund: 'oyendo' },
};

const norm = s =>
  String(s ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const INF = /^(.*?)(ar|er|ir)$/;

/**
 * يفحص مدخل فعل واحدًا ويُرجع قائمة المخالفات.
 * @param {{headword:string, forms?:Array<{formEs:string,kind?:string,tense?:string|null,person?:string|null}>}} entry
 */
export function checkVerbEntry(entry) {
  const items = entry.forms || [];
  if (!items.length) return [];
  const inf = norm(entry.headword);
  const m = INF.exec(inf);
  if (!m) return [];
  const [, stem, ending] = m;
  const present = person =>
    items.find(f => f.kind === 'conjugation' && norm(f.formEs) && /presente/.test(f.tense || '') && f.person === person);
  const p1 = present('1s');
  const p2 = present('2s');
  const p3 = present('3s');
  const p3p = present('3p');
  const out = [];
  const add = (rule, expected, got) =>
    out.push({ rule, headword: entry.headword, expected, got });

  // V4 — قائمة الأفعال المعروفة بتغيّر الجذر (أعلى ثقة، تُطبَّق أولًا)
  // المقارنة تحفظ الحركات (estás ≠ estas)، وإلا صار الفحص نفسه مصدر إنذار كاذب.
  const known = STEM_CHANGERS[inf];
  if (known) {
    const got = [p1, p2, p3, p3p].map(f => String(f?.formEs ?? '').trim().toLowerCase());
    known.forEach((want, i) => {
      if (got[i] && got[i] !== want) add('V4-stem-change', want, got[i]);
    });
  }

  // V1 — -ger/-gir: المتكلم المفرد ينتهي jo (g→j)
  if (/(ger|gir)$/.test(inf) && p1 && /go$/.test(norm(p1.formEs))) {
    add('V1-ger-gir', stem.replace(/g$/, '') + 'jo', norm(p1.formEs));
  }
  // V2 — -cer/-cir بعد حرف علة: zco لا zo (reconocer → reconozco)
  // الحرف قبل c هو موضع الحكم، لا آخر حرف في الجذع (الجذع ينتهي بـc دائمًا هنا).
  // تُستثنى عائلات hacer/decir (deshago/predigo) وcocer/mecer: ليست قاعدة zc.
  const notZc = /(hacer|decir|cocer|mecer|remecer)$/.test(inf);
  if (!notZc && /(cer|cir)$/.test(inf) && /[aeiou]$/.test(stem.slice(0, -1)) && p1 && /zo$/.test(norm(p1.formEs))) {
    add('V2-cer-cir', stem.slice(0, -1) + 'zco', norm(p1.formEs));
  }
  // V3 — -uir (لا -guir/-quir): y قبل o/u/e في كل صيغ المضارع
  if (/uir$/.test(inf) && !/(guir|quir)$/.test(inf)) {
    const expected = { '1s': stem + 'yo', '2s': stem + 'yes', '3s': stem + 'ye', '3p': stem + 'yen' };
    for (const [person, want] of Object.entries(expected)) {
      const f = present(person);
      if (f && norm(f.formEs) !== want) add('V3-uir-y', want, norm(f.formEs));
    }
  }
  // V8 — -ducir: الماضي 3s ينتهي jo لا ció (reducir → redujo)
  if (/ducir$/.test(inf)) {
    const pret3p = items.find(f => f.kind === 'conjugation' && /pretérito|preterito/.test(f.tense || '') && f.person === '3s');
    const want8 = (stem.endsWith('c') ? stem.slice(0, -1) : stem) + 'jo';
    if (pret3p && String(pret3p.formEs).trim().toLowerCase() !== want8) {
      add('V8-ducir', want8, String(pret3p.formEs).trim().toLowerCase());
    }
  }
  // V9 — andar: الماضي الشاذ anduvo (لا andó)
  if (inf === 'andar') {
    const pret3p = items.find(f => f.kind === 'conjugation' && /pretérito|preterito/.test(f.tense || '') && f.person === '3s');
    if (pret3p && String(pret3p.formEs).trim().toLowerCase() !== 'anduvo') {
      add('V9-andar', 'anduvo', String(pret3p.formEs).trim().toLowerCase());
    }
  }
  // V6 — ماضي 3s لبعض الأفعال يتغير جذره (transferir → transfirió)
  // V7 — جيروندها كذلك (transferir → transfiriendo)
  const irr = STEM_IRREGULARS[inf];
  if (irr) {
    const pret = items.find(f => f.kind === 'conjugation' && /pretérito|preterito/.test(f.tense || '') && f.person === '3s');
    if (pret && String(pret.formEs).trim().toLowerCase() !== irr.preterite3s) {
      add('V6-preterite-stem', irr.preterite3s, String(pret.formEs).trim().toLowerCase());
    }
    const ger = items.find(f => f.kind === 'gerund');
    if (ger && String(ger.formEs).trim().toLowerCase() !== irr.gerund) {
      add('V7-gerund-stem', irr.gerund, String(ger.formEs).trim().toLowerCase());
    }
  }
  // V5 — جيروند واسم المفعول موجودان
  if (!items.some(f => f.kind === 'gerund')) add('V5-missing-gerund', 'gerund', '(missing)');
  if (!items.some(f => f.kind === 'participle')) add('V5-missing-participle', 'participle', '(missing)');
  return out;
}

/** يفحص مجلد محتوى كاملًا. */
export function auditVerbForms(dir) {
  const files = walk(dir).filter(f => basename(f).startsWith('vocab-') && f.endsWith('.json'));
  const violations = [];
  let verbs = 0;
  let forms = 0;
  for (const file of files) {
    const pack = JSON.parse(readFileSync(file, 'utf8'));
    for (const entry of pack.entries || []) {
      if (!entry.forms?.length) continue;
      verbs += 1;
      forms += entry.forms.length;
      for (const v of checkVerbEntry(entry)) {
        violations.push({ file: file.replace(ROOT + '/', ''), bundle: pack.bundleSlug ?? null, ...v });
      }
    }
  }
  return { files: files.length, verbs, forms, violations };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const jsonIdx = process.argv.indexOf('--json');
  const result = auditVerbForms(join(ROOT, 'content/drafts'));
  const byRule = {};
  for (const v of result.violations) byRule[v.rule] = (byRule[v.rule] || 0) + 1;
  console.log(`ملفات: ${result.files} · أفعال بتصريفات: ${result.verbs} · صيغ: ${result.forms}`);
  console.log(`المخالفات: ${result.violations.length}`);
  for (const [rule, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${rule}: ${n}`);
    const sample = result.violations.filter(v => v.rule === rule).slice(0, 5);
    for (const s of sample) console.log(`    - ${s.headword}: «${s.got}» ← «${s.expected}»`);
  }
  if (jsonIdx > 0) {
    const out = process.argv[jsonIdx + 1];
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), ...result }, null, 2));
    console.log(`📄 ${out}`);
  }
  process.exit(result.violations.length ? 1 : 0);
}
