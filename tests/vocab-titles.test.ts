/**
 * عناوين حزم المفردات: مصدر الحقيقة في ملفات المحتوى، وحماية العرض من
 * المعرّفات التقنية، وعقد الـAPI الذي يستهلكه الطالب.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { isTechnicalPackTitle, resolvePackTitle } from '../src/shared/vocab-titles';
import { makeHarness, signupAndGetCookie, type Harness } from './harness';
import { importExemplars } from './content-fixture';

const CONTENT_ROOT = join(process.cwd(), 'content');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.startsWith('vocab-') && entry.endsWith('.json')) out.push(full);
  }
  return out;
}

const ARABIC = /[\u0600-\u06FF]/;

describe('عناوين حزم المفردات — مصدر المحتوى', () => {
  const files = walk(join(CONTENT_ROOT, 'drafts'));

  it('كل حزمة لها titleAr عربي غير مطابق للمعرّف', () => {
    expect(files.length).toBeGreaterThan(50);
    const problems: string[] = [];
    for (const file of files) {
      const doc = JSON.parse(readFileSync(file, 'utf8')) as { bundleSlug: string; titleAr?: string };
      const title = (doc.titleAr ?? '').trim();
      if (!title) problems.push(`${doc.bundleSlug}: بلا titleAr`);
      else if (title === doc.bundleSlug) problems.push(`${doc.bundleSlug}: العنوان معرّف تقني`);
      else if (!ARABIC.test(title)) problems.push(`${doc.bundleSlug}: العنوان بلا حروف عربية (${title})`);
    }
    expect(problems).toEqual([]);
  });

  it('العناوين فريدة (لا عنوانان متطابقان لحزمتين مختلفتين)', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const file of files) {
      const doc = JSON.parse(readFileSync(file, 'utf8')) as { bundleSlug: string; titleAr: string };
      const prior = seen.get(doc.titleAr);
      if (prior) dupes.push(`${doc.titleAr} → ${prior} / ${doc.bundleSlug}`);
      seen.set(doc.titleAr, doc.bundleSlug);
    }
    expect(dupes).toEqual([]);
  });

  it('المعرّفات نفسها محفوظة: slug الحزمة داخل الملف واسم الملف متوافقان', () => {
    for (const file of files) {
      const doc = JSON.parse(readFileSync(file, 'utf8')) as { bundleSlug: string };
      expect(doc.bundleSlug).toMatch(/^[a-z0-9-]+$/);
      expect(file.endsWith(`vocab-${doc.bundleSlug}.json`)).toBe(true);
    }
  });

  it('لا عنوان عربي يبدأ أو ينتهي بمسافة، ولا يتجاوز 60 حرفًا', () => {
    for (const file of files) {
      const { bundleSlug, titleAr } = JSON.parse(readFileSync(file, 'utf8')) as {
        bundleSlug: string;
        titleAr: string;
      };
      expect(titleAr, bundleSlug).toBe(titleAr.trim());
      expect(titleAr.length, bundleSlug).toBeLessThanOrEqual(60);
    }
  });
});

describe('resolvePackTitle — حماية العرض', () => {
  it('يُبقي العنوان العربي المخزَّن كما هو', () => {
    expect(resolvePackTitle('التحيات والمجاملات', 'a1-u2-saludos', 'A1')).toBe('التحيات والمجاملات');
  });

  it('يستبدل المعرّف التقني بعنوان عربي واضح', () => {
    expect(resolvePackTitle('cv-lex-nouns-core', 'cv-lex-nouns-core', 'A1')).toBe('حزمة مفردات A1');
    expect(resolvePackTitle('a1-u1-origen', 'a1-u1-origen', null)).toBe('حزمة مفردات');
  });

  it('يعالج القيم الفارغة واللاتينية بالكامل', () => {
    expect(isTechnicalPackTitle(null, 'x')).toBe(true);
    expect(isTechnicalPackTitle('   ', 'x')).toBe(true);
    expect(isTechnicalPackTitle('Vocabulary Pack A1', 'x')).toBe(true);
    expect(isTechnicalPackTitle('حزمة عربية A1', 'x')).toBe(false);
    expect(resolvePackTitle(undefined, 'tr-shared', 'A2')).toBe('حزمة مفردات A2');
  });
});

describe('GET /api/review/packs — عنوان العرض في العقد', () => {
  let h: Harness;
  let cookie: string;

  beforeEach(async () => {
    h = makeHarness({ ALLOW_UNREVIEWED_CONTENT: 'true' });
    importExemplars(h);
    const signup = await signupAndGetCookie(h, 'packs@example.com');
    expect(signup.res.status).toBe(201);
    cookie = signup.cookie!;
  });
  afterEach(() => h.close());

  it('يعيد العنوان العربي من المحتوى لا المعرّف', async () => {
    const res = await h.json<{ packs: { slug: string; titleAr: string; level: string | null }[] }>(
      await h.call('/api/review/packs', { cookie }),
    );
    expect(res.packs.length).toBeGreaterThan(0);
    const pack = res.packs.find(p => p.slug === 'a1-core-20')!;
    expect(pack.titleAr).toBe('كلمات A1 الأولى');
    expect(pack.titleAr).not.toContain(pack.slug);
  });

  it('صف قديم بعنوان = المعرّف لا يصل للطالب كهذا', async () => {
    h.db.raw
      .prepare(`UPDATE vocabulary_bundles SET title_ar = slug WHERE slug = 'a1-core-20'`)
      .run();
    const res = await h.json<{ packs: { slug: string; titleAr: string }[] }>(
      await h.call('/api/review/packs', { cookie }),
    );
    const pack = res.packs.find(p => p.slug === 'a1-core-20')!;
    expect(pack.titleAr).not.toBe('a1-core-20');
    expect(pack.titleAr).toMatch(ARABIC);
    // المعرّف نفسه يبقى كما هو (لا تغيير في العقود أو الروابط)
    expect(pack.slug).toBe('a1-core-20');
  });

  it('بدء الحزمة يعمل بالمعرّف نفسه بعد التغيير', async () => {
    const res = await h.call('/api/review/packs/a1-core-20/start', { method: 'POST', cookie });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { created: number; totalEntries: number };
    expect(body.created).toBe(body.totalEntries);
  });
});
