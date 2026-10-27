/**
 * رؤية البحث: المسودات لا تتسرب — لا في الحزمة المضمّنة ولا في مسار API.
 * الفهرس الثابت يحمل المفردات والتصريفات فقط؛ الدروس والقواعد تُبحث من
 * قاعدة البيانات وفق قاعدة الرؤية (المنشور فقط، والمسودات فقط بمفتاح
 * ALLOW_UNREVIEWED_CONTENT الصريح في بيئة غير إنتاجية).
 */
import { describe, it, expect } from 'vitest';
import { makeHarness, type Harness } from './harness';
import { importExemplars } from './content-fixture';
import { SearchEngine } from '../src/shared/search-engine';
import searchIndex from '../src/shared/search-index.json';

describe('الفهرس المضمّن في الحزمة بلا بيانات دروس', () => {
  it('لا يحمل أي درس ولا أي موضوع قاعدة مرتبطًا بدرس', () => {
    expect((searchIndex as { lessons: unknown[] }).lessons).toEqual([]);
    expect((searchIndex as { grammar: unknown[] }).grammar).toEqual([]);
  });

  it('ما زال يحمل المعجم والتصريفات كاملة (البحث لم يُفرَّغ)', () => {
    const idx = searchIndex as { vocab: unknown[]; forms: Record<string, unknown>; stats: { vocabCount: number; formsCount: number } };
    expect(idx.vocab.length).toBeGreaterThan(8000);
    expect(Object.keys(idx.forms).length).toBeGreaterThan(40000);
    expect(idx.stats.vocabCount).toBe(idx.vocab.length);
  });

  it('المحرك الافتراضي (الفهرس المضمّن) لا يعيد نتائج دروس أو قواعد أبدًا', () => {
    const engine = new SearchEngine();
    for (const q of ['التحية', 'المقهى', 'gustar', 'usted', 'quedamos']) {
      const kinds = engine.search(q, { limit: 50 }).results.map(r => r.kind);
      expect(kinds, `استعلام «${q}»`).not.toContain('lesson');
      expect(kinds, `استعلام «${q}»`).not.toContain('grammar');
    }
  });
});

describe('مسار GET /api/content/search — فلترة الرؤية', () => {
  function publish(h: Harness, slug: string) {
    h.db.raw.exec(
      `UPDATE lessons SET status = 'published' WHERE slug = '${slug}';` +
      `UPDATE lesson_versions SET status = 'published' WHERE lesson_id = (SELECT id FROM lessons WHERE slug = '${slug}');`,
    );
  }

  it('الافتراضي: درس منشور يظهر، ودرس مسودة بعنوان مطابق لا يظهر', async () => {
    const h = makeHarness();
    importExemplars(h);
    publish(h, 'a1-un-cafe-por-favor');
    // «المقهى» في عنوان الدرس المنشور؛ «التحية» في عنوان درس المسودة فقط.
    const pub = await h.json(await h.call('/api/content/search?q=' + encodeURIComponent('المقهى')));
    expect(pub.results.some((r: { kind: string; id: string }) => r.kind === 'lesson' && r.id === 'lesson-a1-un-cafe-por-favor')).toBe(true);
    const draft = await h.json(await h.call('/api/content/search?q=' + encodeURIComponent('التحية')));
    expect(draft.results.some((r: { kind: string }) => r.kind === 'lesson')).toBe(false);
    expect(draft.results.some((r: { kind: string }) => r.kind === 'grammar')).toBe(false);
    // البحث نفسه ما زال يعمل: المفردات تظهر.
    const vocab = await h.json(await h.call('/api/content/search?q=gracias'));
    expect(vocab.results.some((r: { kind: string }) => r.kind === 'vocab')).toBe(true);
    expect(vocab.contentProvenance).toBeUndefined();
  });

  it('موضوع قاعدة من درس مسودة لا يظهر، ومن درس منشور يظهر', async () => {
    const h = makeHarness();
    importExemplars(h);
    // 'usted-formal' موضوع في درس المسودة cc1؛ 'agua-el-agua' في الدرس المنشور.
    const draftTopic = await h.json(await h.call('/api/content/search?q=usted&kind=grammar'));
    expect(draftTopic.results).toEqual([]);
    publish(h, 'a1-un-cafe-por-favor');
    const pubTopic = await h.json(await h.call('/api/content/search?q=agua&kind=grammar'));
    expect(pubTopic.results.some((r: { kind: string; id: string }) => r.kind === 'grammar' && r.id === 'grammar-agua-el-agua')).toBe(true);
  });

  it('بمفتاح المسودات الصريح (غير إنتاج): المسودة تظهر موسومة وبلا تخزين مؤقت', async () => {
    const h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const res = await h.call('/api/content/search?q=' + encodeURIComponent('التحية'));
    const body = await h.json(res);
    expect(body.results.some((r: { kind: string; id: string }) => r.kind === 'lesson' && r.id === 'lesson-prea1-hola-me-llamo')).toBe(true);
    expect(body.contentProvenance).toBe('unreviewed_sample');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });

  it('المفتاح وحده لا يكفي في بيئة production: المسودة تبقى مخفية', async () => {
    const h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true', ENVIRONMENT: 'production' });
    importExemplars(h);
    const body = await h.json(await h.call('/api/content/search?q=' + encodeURIComponent('التحية')));
    expect(body.results.some((r: { kind: string }) => r.kind === 'lesson')).toBe(false);
    expect(body.contentProvenance).toBeUndefined();
  });

  it('kind=lesson لا يعيد مفردات، وkind=vocab لا يستدعي بحث الدروس', async () => {
    const h = makeHarness();
    importExemplars(h);
    publish(h, 'a1-un-cafe-por-favor');
    const lessonsOnly = await h.json(await h.call('/api/content/search?q=' + encodeURIComponent('المقهى') + '&kind=lesson'));
    expect(lessonsOnly.results.length).toBeGreaterThan(0);
    expect(lessonsOnly.results.every((r: { kind: string }) => r.kind === 'lesson')).toBe(true);
    const vocabOnly = await h.json(await h.call('/api/content/search?q=gracias&kind=vocab'));
    expect(vocabOnly.results.every((r: { kind: string }) => r.kind === 'vocab' || r.kind === 'verb_form')).toBe(true);
  });
});
