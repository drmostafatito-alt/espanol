/**
 * منطق اختيار أمثلة المفردات المعدَّنة (نقي وقابل للاختبار) — إصلاح AUD-08 المتقدم.
 *
 * الضوابط (بتوجيه مراجعة مستقلة):
 *  1) بوابة مستوى: لا مثال أعلى من مستوى الكلمة بأكثر من مستويين متى وُجد بديل
 *     داخل النطاق (اختيار من مرحلتين، لا مجرد ترجيح بالنقاط).
 *  2) توافق المعنى بنيويًا: فخاخ تعبيرات ثابتة يظهر فيها اللفظ بمعنى مختلف
 *     (مرجعيتها حالة «pesar» مقابل «a pesar de»). اللفظ داخل فخّ لا يُحسب
 *     «استخدامًا» للكلمة ما لم يكن المدخل نفسه هو ذلك التعبير.
 *     ما يتجاوز هذه الفخاخ من التباس لا يستطيع كاشف آلي إثبات سلامته —
 *     يُصنَّف للمراجعة البشرية، ولا يُدَّعى له سلامة ولا مراجعة.
 *  3) سقف إعادة استخدام الجملة تراكمي عبر كل التشغيلات: يُحسب الاستخدام
 *     الحالي من ملفات المفردات نفسها قبل التعدين، فلا يتجاوز مجموع
 *     الاستخدامات (قديمًا وجديدًا) السقف أبدًا.
 */
export const LEVELS = { PREA1: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
export const MAX_LEVEL_GAP = 2;
export const MAX_SENTENCE_REUSE_TOTAL = 3;

export const norm = (s) => String(s ?? '').trim().replace(/\s+/g, ' ');
export const fold = (s) => norm(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const tokens = (s) => fold(s).replace(/[¿?¡!.,;:«»"()]/g, ' ').split(' ').filter(Boolean);

/** صيغ مقبولة للاحتواء: المدخل وجمعه وتصريفات forms وتبديل الجنس الشائع */
export function acceptedForms(entry) {
  const forms = new Set();
  const add = (v) => { if (v) forms.add(fold(String(v))); };
  add(entry.normalized);
  add(entry.plural);
  for (const f of entry.forms ?? []) add(f.formEs);
  const base = fold(entry.normalized ?? '');
  if (base) {
    add(base + 's'); add(base + 'es');
    if (base.endsWith('o')) { add(base.slice(0, -1) + 'a'); add(base.slice(0, -1) + 'as'); }
    if (base.endsWith('a')) add(base + 's');
  }
  return forms;
}

const PUNCT_RE = /[¿?¡!.,;:«»"()]/g;
/** هل تحتوي الجملة أي صيغة مقبولة ككلمة/عبارة كاملة؟ */
export function containsForm(sentenceEs, forms) {
  const tk = new Set(tokens(sentenceEs));
  for (const f of forms) if (tk.has(f)) return true;
  const hay = ' ' + fold(sentenceEs).replace(PUNCT_RE, ' ') + ' ';
  for (const f of forms) if (f.includes(' ') && hay.includes(' ' + f + ' ')) return true;
  return false;
}

/**
 * فخاخ تعبيرات ثابتة: اللفظ نفسه داخل تعبير بمعنى آخر مختلف عن معنى المدخل.
 * المفتاح: الصيغة المطوية للكلمة؛ القيمة: عبارات مطوية إن احتوتها الجملة
 * فاللفظ «محاصَر» داخل التعبير ولا يشهد للمعنى المستهدف.
 * قائمة مقصودة الصغر وقابلة للتدقيق — تُوسَّع بحالات مُثبتة لا بتخمين.
 */
export const IDIOM_TRAPS = new Map(Object.entries({
  pesar: ['a pesar de'],          // pesar=يزن ✗ «على الرغم من»
  bien: ['mas bien', 'esta bien', 'si bien'],
  medio: ['en medio de', 'por medio de'],
  menos: ['a menos que', 'por lo menos', 'a menos de'],
  mas: ['a lo mas', 'nada mas', 'sin mas'],
  parte: ['por otra parte', 'por mi parte', 'por tu parte', 'por su parte', 'en parte'],
  cuenta: ['darse cuenta', 'dar cuenta', 'ten en cuenta', 'tener en cuenta', 'tomar en cuenta'],
  lugar: ['en lugar de', 'en primer lugar', 'tiene lugar', 'tener lugar'],
  caso: ['en caso de', 'en todo caso', 'hacer caso'],
  vez: ['otra vez', 'a veces', 'en vez de', 'una vez que', 'tal vez'],
  punto: ['a punto de', 'punto de vista'],
  fin: ['por fin', 'al fin', 'sin fin'],
  tiempo: ['al mismo tiempo', 'a tiempo', 'con el tiempo'],
  modo: ['de todos modos', 'de este modo', 'de cualquier modo'],
  derecho: ['a la derecha'],
  seguro: ['por seguro', 'de seguro'],
}));

/** هل ظهورات اللفظ في الجملة كلها داخل فخّ تعبيري؟ (أو واحد على الأقل بلا بديل حر) */
export function isTrappedUse(sentenceEs, entry, forms) {
  const head = fold(entry.normalized ?? '');
  const traps = IDIOM_TRAPS.get(head);
  if (!traps) return false;
  // إن كان المدخل نفسه هو التعبير (مدخل عبارة) فلا فخّ
  const hay = ' ' + fold(sentenceEs).replace(PUNCT_RE, ' ').replace(/\s+/g, ' ') + ' ';
  let trapped = false;
  for (const trap of traps) {
    if (head === trap || fold(entry.headword ?? '') === trap) return false;
    if (hay.includes(' ' + trap + ' ')) trapped = true;
  }
  if (!trapped) return false;
  // ظهور حر للفظ خارج عبارات الفخ ينقذ الجملة: احذف الفخاخ وابحث من جديد
  let stripped = hay;
  for (const trap of traps) stripped = stripped.split(' ' + trap + ' ').join(' § ');
  return !containsForm(stripped, forms);
}

/**
 * اختيار أفضل مرشح بضوابط صارمة:
 *  - استبعاد الفخاخ المعنوية دائمًا.
 *  - استبعاد ما بلغ سقف الاستخدام التراكمي (uses = قديم + هذه الجولة).
 *  - مرحلتان: مرشحو «داخل النطاق» (فرق مستوى ≤ MAX_LEVEL_GAP) أولًا؛
 *    لا يُنظر للأعلى إلا عند انعدامهم.
 * candidates: [{es, ar, arEg, level:number, uses:number}]
 * skipEs: نص مطوي يجب ألا يُختار (مثال حالي معيب عند الإصلاح مثلًا).
 */
export function chooseCandidate(candidates, { forms, entry, entryLevel, skipFolded = null }) {
  const eligible = [];
  for (const c of candidates) {
    if ((c.uses ?? 0) >= MAX_SENTENCE_REUSE_TOTAL) continue;
    if (skipFolded && fold(c.es) === skipFolded) continue;
    if (!containsForm(c.es, forms)) continue;
    if (isTrappedUse(c.es, entry, forms)) continue;
    eligible.push(c);
  }
  if (!eligible.length) return null;
  const score = (c) => Math.abs(c.level - entryLevel) * 10 + (c.uses ?? 0) * 3 + Math.abs(c.es.split(' ').length - 8);
  const inBand = eligible.filter(c => c.level - entryLevel <= MAX_LEVEL_GAP);
  const pool = inBand.length ? inBand : eligible;
  return pool.reduce((best, c) => (score(c) < score(best) ? c : best), pool[0]);
}

/** إطار المثال: استبدال أي صيغة مقبولة بـ § لمقارنة القوالب */
export function frameOf(exampleEs, forms) {
  let out = fold(exampleEs);
  const sorted = [...forms].sort((a, b) => b.length - a.length);
  for (const f of sorted) {
    if (!f) continue;
    const re = new RegExp(`(^|[^\\p{L}])${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'giu');
    out = out.replace(re, '$1§$2');
  }
  return out.replace(/\s+/g, ' ').trim();
}
