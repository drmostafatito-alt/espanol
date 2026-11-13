/**
 * تطبيع النص الإسباني للمقارنة المرنة (بدون تحميل فهرس البحث الكامل إلى الواجهة).
 */
export function normalizeEs(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:"'«»()…—\-_/\\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
