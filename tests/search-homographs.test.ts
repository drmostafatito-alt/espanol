/**
 * اختبارات الأزواج المتقاربة: كلمتان مختلفتان تتطابقان بعد إزالة التشكيل.
 * تكشف الخلل الحالي في الفهرس/المحرك، ولا تُخفَّف لتمرير الاختبار.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { SearchEngine } from '../src/shared/search-engine';
import searchIndex from '../src/shared/search-index.json';

const PAIRS: [string, string][] = [
  ['papa', 'papá'],
  ['pena', 'peña'],
  ['oir', 'oír'],
  ['sonar', 'soñar'],
  ['modem', 'módem'],
];

const DRAFTS = join(process.cwd(), 'content', 'drafts');
function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const sourceWords = new Set<string>(
  walk(DRAFTS)
    .filter(f => basename(f).startsWith('vocab-') && f.endsWith('.json'))
    .flatMap(f => (JSON.parse(readFileSync(f, 'utf8')).entries ?? []).map((e: any) => e.normalized as string)),
);
const engine = new SearchEngine(searchIndex as any);
const indexWords = new Set<string>((searchIndex as any).vocab.map((v: any) => v.e as string));

describe('الأزواج المتقاربة: وجود المصدر', () => {
  for (const [a, b] of PAIRS) {
    it(`المصدر يحوي «${a}» و«${b}» كمدخلين منفصلين`, () => {
      expect(sourceWords.has(a)).toBe(true);
      expect(sourceWords.has(b)).toBe(true);
    });
  }
});

describe('الأزواج المتقاربة: الفهرس يحتفظ بالعضوين', () => {
  for (const [a, b] of PAIRS) {
    it(`الفهرس يحوي «${a}» و«${b}»`, () => {
      expect(indexWords.has(a), `الفهرس لا يحوي «${a}»`).toBe(true);
      expect(indexWords.has(b), `الفهرس لا يحوي «${b}»`).toBe(true);
    });
  }
});

describe('الأزواج المتقاربة: البحث يميّز بين العضوين', () => {
  for (const [a, b] of PAIRS) {
    it(`البحث عن «${a}» يعيد «${a}» أولًا`, () => {
      expect(engine.search(a).results[0]?.titleEs).toBe(a);
    });
    it(`البحث عن «${b}» يعيد «${b}» أولًا (بالتشكيل)`, () => {
      expect(engine.search(b).results[0]?.titleEs).toBe(b);
    });
    it(`البحث عن «${b}» بلا تشكيل لا يعيد «${b}» كما لو كان «${a}»`, () => {
      const plain = b.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      expect(engine.search(plain).results[0]?.titleEs).toBe(a);
    });
  }
});
