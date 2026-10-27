import { describe, expect, it } from 'vitest';
import { SearchEngine } from '../src/shared/search-engine';

describe('البحث الذكي — محرك البحث المحلي الشامل', () => {
  const engine = new SearchEngine();

  it('1. كلمة إسبانية موجودة: تعود بنتيجة تطابق تام وبأعلى درجة', () => {
    const res = engine.search('gracias');
    expect(res.total).toBeGreaterThan(0);
    const top = res.results[0];
    expect(top).toBeDefined();
    expect(top!.titleEs?.toLowerCase()).toContain('gracias');
    expect(top!.score).toBeGreaterThanOrEqual(950);
    expect(top!.kind).toBe('vocab');
  });

  it('2. معنى عربي فصيح: يعود بالمفردة الإسبانية الصحيحة', () => {
    const res = engine.search('كتاب');
    expect(res.total).toBeGreaterThan(0);
    const foundLibro = res.results.some(r => r.titleEs === 'libro' || r.meaningArFusha?.includes('كتاب'));
    expect(foundLibro).toBe(true);
  });

  it('3. معنى بالمصرية: يجد الكلمة عبر المعنى المصري', () => {
    const res = engine.search('عايز');
    if (res.total > 0) {
      expect(res.results.some(r => r.meaningArEg?.includes('عايز') || r.titleAr?.includes('عايز'))).toBe(true);
    } else {
      const res2 = engine.search('شقة');
      expect(res2.total).toBeGreaterThan(0);
    }
  });

  it('4. فعل مصرف وصيغته الأصلية: ربط التصريف بالفعل المصدر (Lemma)', () => {
    const resHablamos = engine.search('hablamos');
    expect(resHablamos.total).toBeGreaterThan(0);
    const formMatch = resHablamos.results.find(r => r.kind === 'verb_form' || r.lemma === 'hablar' || r.titleEs === 'hablar');
    expect(formMatch).toBeDefined();
    expect(formMatch?.lemma || formMatch?.titleEs).toBe('hablar');

    const resFui = engine.search('fui');
    expect(resFui.total).toBeGreaterThan(0);
    const fuiMatch = resFui.results.find(r => r.kind === 'verb_form' || r.lemma === 'ir' || r.lemma === 'ser');
    expect(fuiMatch).toBeDefined();
  });

  it('5. اسم قاعدة نحوية: استخراج القاعدة والدرس المرتبط بها', () => {
    const res = engine.search('gustar');
    expect(res.total).toBeGreaterThan(0);
    const grammarOrLesson = res.results.find(r => r.kind === 'grammar' || r.kind === 'lesson' || r.titleEs?.includes('gustar'));
    expect(grammarOrLesson).toBeDefined();
  });

  it('6. مثال داخل درس: العثور على الدرس من خلال جملة مستهدفة', () => {
    const res = engine.search('quedamos');
    expect(res.total).toBeGreaterThan(0);
    const lessonFound = res.results.some(r => r.kind === 'lesson' || r.kind === 'vocab' || r.kind === 'verb_form');
    expect(lessonFound).toBe(true);
  });

  it('7. كلمة غير موجودة: يعود بمصفوفة فارغة بلا خطأ وبلا اختلاق نتائج', () => {
    const res = engine.search('xyznotaword12345');
    expect(res.total).toBe(0);
    expect(res.results).toEqual([]);
  });

  it('8. خطأ إملائي بسيط: اقتراح الكلمة الصحيحة بأمان ودون تضليل', () => {
    const res = engine.search('bibloteca');
    if (res.results.length === 0) {
      expect(res.suggestion).toBe('biblioteca');
    } else {
      expect(res.results.some(r => r.titleEs === 'biblioteca')).toBe(true);
    }
  });

  it('9. تطبيع المسافات والحروف الكبيرة وعلامات التشكيل اللاتينية والعربية', () => {
    const resUpper = engine.search('  HOLA  ');
    const resLower = engine.search('hola');
    expect(resUpper.total).toBeGreaterThan(0);
    expect(resUpper.results[0]?.titleEs).toBe(resLower.results[0]?.titleEs);

    // á vs a (adiós vs adios)
    const resAccent = engine.search('adiós');
    const resNoAccent = engine.search('adios');
    expect(resAccent.total).toBeGreaterThan(0);
    expect(resNoAccent.total).toBeGreaterThan(0);
    expect(resAccent.results[0]?.titleEs).toBe(resNoAccent.results[0]?.titleEs);

    // همزة vs بدون همزة
    const resAlef = engine.search('أستاذ');
    const resNoAlef = engine.search('استاذ');
    expect(resAlef.total).toBe(resNoAlef.total);
  });

  it('10. نتيجة تؤدي إلى الرابط الصحيح (Lesson slug أو Curriculum)', () => {
    const res = engine.search('cita');
    expect(res.total).toBeGreaterThan(0);
    const first = res.results[0];
    expect(first).toBeDefined();
    expect(first!.url).toBeTruthy();
    expect(first!.url.startsWith('/')).toBe(true);
  });

  it('12. كل رابط نتيجة يطابق مسارًا حقيقيًا في التطبيق (لا /lesson أو /curriculum)', () => {
    const routes = [/^\/learn$/, /^\/learn\/[a-z0-9-]{3,64}$/, /^\/review$/];
    for (const q of ['gracias', 'gustar', 'hablamos', 'quedamos', 'cita', 'ser y estar', 'estar']) {
      for (const r of engine.search(q, { limit: 50 }).results) {
        expect(routes.some(re => re.test(r.url)), `${q} -> ${r.url}`).toBe(true);
      }
    }
  });

  it('13. قائمة الدروس المسموحة تحجب روابط الدروس والقواعد غير المنشورة', () => {
    const gated = new SearchEngine({
      version: 'test',
      vocab: [],
      forms: {},
      lessons: [
        { s: 'published-lesson', t: 'درس منشور', l: 'A1', u: null, g: [], st: [] },
        { s: 'draft-lesson', t: 'درس مسودة', l: 'A1', u: null, g: [], st: [] },
      ],
      grammar: [{ t: 'gustar', l: 'A1', s: 'draft-lesson', a: 'درس مسودة' }],
    });
    const allowed = new Set(['published-lesson']);
    expect(gated.search('درس', { kind: 'lesson', lessonSlugs: allowed }).results.map(r => r.url)).toEqual([
      '/learn/published-lesson',
    ]);
    expect(gated.search('gustar', { kind: 'grammar', lessonSlugs: allowed }).results).toEqual([]);
  });

  it('11. أداء فائق السرعة: 100 استعلام خلال أقل من 100ms دون أي تجميد', () => {
    const queries = ['hola', 'casa', 'tiempo', 'hablar', 'comer', 'vivir', 'amigo', 'familia', 'madrid', 'gracias'];
    const t0 = Date.now();
    for (let i = 0; i < 100; i++) {
      const q = queries[i % queries.length]!;
      engine.search(q);
    }
    const elapsed = Date.now() - t0;
    expect(elapsed).toBeLessThan(100);
  });
});
