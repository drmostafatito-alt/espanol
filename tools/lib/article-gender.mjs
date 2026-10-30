/**
 * فحص تطابق أداة التعريف مع جنس المدخل في مثال إسباني.
 * مفصول عن سكربت `check-vocab-batch.mjs` حتى يمكن اختباره مباشرة دون تشغيل السكربت.
 */

const words = s => (s ?? '').toLowerCase().match(/[\p{L}]+/gu) ?? [];
const loose = s =>
  (s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:"'«»()…]/g, '').replace(/\s+/g, ' ').trim();

const FEM_DET = new Set(['la', 'las', 'una', 'unas', 'esta', 'estas', 'esa', 'esas']);
const MASC_DET = new Set(['el', 'los', 'un', 'unos', 'este', 'estos', 'ese', 'esos']);

/**
 * أسماء مؤنثة مفردة تبدأ بـ a-/ha- مشدّدة، فتأخذ «el» في المفرد (el agua, el hacha,
 * el haba, el águila). قائمة مغلقة عمدًا: قاعدة التشديد لا تُستنتج من الحروف، وإدراج
 * كلمات مثل «amiga» أو «casa» سيُخفي أخطاء حقيقية، فنقتصر على ما هو مؤكَّد لغويًا.
 */
export const FEM_MASC_ARTICLE_OK = new Set([
  'agua', 'aguila', 'algebra', 'alma', 'ama', 'ancla', 'arca', 'area', 'arpa',
  'asa', 'asta', 'aula', 'ave', 'haba', 'habla', 'hacha', 'hada', 'hambre',
  'hampa', 'hazaña', 'ala',
]);

/**
 * يعيد نصّ المشكلة عند عدم تطابق الأداة مع الجنس، أو null إذا كان سليمًا.
 * @param {{headword: string, gender?: string}} entry
 * @param {string} exampleEs
 */
export function articleGenderProblem(entry, exampleEs) {
  if (!entry || (entry.gender !== 'f' && entry.gender !== 'm')) return null;
  const ws = words(exampleEs);
  const head = words(entry.headword)[0];
  if (!head) return null;
  const idx = ws.findIndex((w, i) => w === head && i > 0);
  if (idx <= 0) return null;
  const det = ws[idx - 1];
  // «el» صحيحة مع المؤنث الذي يبدأ بـ a-/ha- مشدّدة، فلا تُحتسب خطأ
  const elOk = det === 'el' && FEM_MASC_ARTICLE_OK.has(loose(entry.headword).split(' ')[0]);
  if (entry.gender === 'f' && MASC_DET.has(det) && !elOk) return `أداة مذكر مع اسم مؤنث («${det}») در`;
  if (entry.gender === 'm' && FEM_DET.has(det)) return `أداة مؤنث مع اسم مذكر («${det}»)`;
  return null;
}
