/* ============================================================================
   محرك البحث الذكي — منصة تعليم الإسبانية للناطقين بالعربية
   ----------------------------------------------------------------------------
   الميزات:
   1) بحث بالكلمات الإسبانية ومعانيها العربية الفصحى والمصرية.
   2) بحث عكسي: من العربية إلى الكلمات والأمثلة الإسبانية.
   3) كشف صيغ الأفعال المصرفة وربطها بالفعل الأصلي (Lemma).
   4) القواعد النحوية وعناوين ومحتويات وأمثلة الدروس.
   5) تطبيع النص العربي (همزات، تاء مربوطة، تشكيل) والإسباني (تشكيل، علامات ترقيم).
   6) فهرسة معكوسة O(1) فائقة السرعة واستجابة خلال أجزاء من الملي ثانية.
   7) اقتراح تصحيحي ذكي (Fuzzy suggestion) عند وجود خطأ إملائي دون تضليل.
   8) ترتيب دقيق حسب قوة التطابق + خلو تام من أي تكلفة تشغيلية أو خدمات مدفوعة.
   ========================================================================== */

import searchIndexData from './search-index.json';

export interface CompactVocabItem {
  e: string; // headword es
  p: string | null; // pos
  g: string | null; // gender
  l: string; // level
  f: string; // fusha meaning
  eg: string; // egyptian meaning
  ex?: [string, string]; // [es, ar]
}

export interface CompactLessonItem {
  s: string; // slug
  t: string; // titleAr
  l: string; // level
  u: string | null; // unitSlug
  o?: string; // objectiveAr
  g: string[]; // grammarTopics
  st: string[]; // targetStructures
}

export interface CompactGrammarItem {
  t: string; // topic
  l: string; // level
  s: string; // lessonSlug
  a: string; // lessonTitleAr
}

export interface SearchIndex {
  version: string;
  vocab: CompactVocabItem[];
  forms: Record<string, string | string[]>;
  lessons: CompactLessonItem[];
  grammar: CompactGrammarItem[];
}

export interface SearchItemResult {
  id: string;
  kind: 'vocab' | 'verb_form' | 'grammar' | 'lesson';
  title: string;
  titleEs?: string;
  titleAr?: string;
  badgeAr: string;
  level: string;
  pos?: string;
  gender?: string;
  meaningArFusha?: string;
  meaningArEg?: string;
  exampleEs?: string;
  exampleAr?: string;
  targetStructures?: string[];
  lemma?: string;
  url: string;
  score: number;
  matchType: string;
  matchReasonAr: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchItemResult[];
  suggestion?: string | null;
  executionMs: number;
}

export interface SearchOptions {
  limit?: number;
  level?: string;
  kind?: 'all' | 'vocab' | 'grammar' | 'lesson';
  /** إن وُجدت، تُقصر نتائج الدروس والقواعد المرتبطة بها على هذه الدروس فقط. */
  lessonSlugs?: ReadonlySet<string>;
}

/** تطبيع النص الإسباني (حروف صغيرة، إزالة التشكيل وعلامات الترقيم) */
export function normalizeEs(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:"'«»()…—\-_/\\\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** تطبيع النص الإسباني مع حفظ التشكيل لمقارنة التطابق التام */
export function cleanEs(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[¿?¡!.,;:"'«»()…—\-_/\\\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** تطبيع النص العربي (إزالة التشكيل، توحيد الهمزات والتاء المربوطة والألف المقصورة) */
export function normalizeAr(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u064B-\u065F\u0670]/g, '') // إزالة التشكيل
    .replace(/ـ+/g, '') // إزالة التطويل
    .replace(/[أإآٱ]/g, 'ا') // توحيد الألف
    .replace(/ة/g, 'ه') // توحيد التاء المربوطة
    .replace(/ى/g, 'ي') // توحيد الألف المقصورة
    .replace(/[؟?!.,;:"'«»()…—\-_/\\\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** حساب المسافة التحريرية Damerau-Levenshtein للاقتراحات الذكية */
export function damerauLevenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (!al) return bl;
  if (!bl) return al;

  const m: number[][] = Array.from({ length: al + 1 }, () => Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) m[i]![0] = i;
  for (let j = 0; j <= bl; j++) m[0]![j] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(
        m[i - 1]![j]! + 1,
        m[i]![j - 1]! + 1,
        m[i - 1]![j - 1]! + cost,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, m[i - 2]![j - 2]! + 1);
      }
      m[i]![j] = val;
    }
  }
  return m[al]![bl]!;
}

interface PrecomputedVocab {
  item: CompactVocabItem;
  cleanEs: string;
  normEs: string;
  normFusha: string;
  normEg: string;
}

interface PrecomputedLesson {
  item: CompactLessonItem;
  titleNormAr: string;
  objNormAr: string;
  structNormsEs: string[];
}

interface PrecomputedGrammar {
  item: CompactGrammarItem;
  topicNormEs: string;
  titleNormAr: string;
}

export class SearchEngine {
  private index: SearchIndex;
  private precomputedVocab: PrecomputedVocab[];
  private precomputedLessons: PrecomputedLesson[];
  private precomputedGrammar: PrecomputedGrammar[];
  private normEsMap: Map<string, number[]>;
  private cleanEsMap: Map<string, number[]>;
  private normArMap: Map<string, number[]>;
  private arWordIndex: Map<string, number[]>;
  private esWordIndex: Map<string, number[]>;
  private prefixMap: Map<string, number[]>;

  constructor(indexData?: SearchIndex) {
    this.index = (indexData || searchIndexData) as SearchIndex;
    this.precomputedVocab = [];
    this.precomputedLessons = [];
    this.precomputedGrammar = [];
    this.normEsMap = new Map();
    this.cleanEsMap = new Map();
    this.normArMap = new Map();
    this.arWordIndex = new Map();
    this.esWordIndex = new Map();
    this.prefixMap = new Map();

    this.buildIndexes();
  }

  private buildIndexes() {
    // 1. فهرسة المعجم
    const vocab = this.index.vocab;
    for (let i = 0; i < vocab.length; i++) {
      const v = vocab[i];
      if (!v) continue;
      const normEs = normalizeEs(v.e);
      const cEs = cleanEs(v.e);
      const normFusha = normalizeAr(v.f);
      const normEg = normalizeAr(v.eg);

      this.precomputedVocab.push({
        item: v,
        cleanEs: cEs,
        normEs,
        normFusha,
        normEg,
      });

      if (!this.normEsMap.has(normEs)) this.normEsMap.set(normEs, []);
      this.normEsMap.get(normEs)!.push(i);

      if (!this.cleanEsMap.has(cEs)) this.cleanEsMap.set(cEs, []);
      this.cleanEsMap.get(cEs)!.push(i);

      if (!this.normArMap.has(normFusha)) this.normArMap.set(normFusha, []);
      this.normArMap.get(normFusha)!.push(i);

      const arWords = `${normFusha} ${normEg}`.split(/\s+/);
      for (const w of arWords) {
        if (w.length >= 2) {
          if (!this.arWordIndex.has(w)) this.arWordIndex.set(w, []);
          this.arWordIndex.get(w)!.push(i);
        }
      }

      if (normEs.length >= 3) {
        const pref = normEs.slice(0, 3);
        if (!this.prefixMap.has(pref)) this.prefixMap.set(pref, []);
        this.prefixMap.get(pref)!.push(i);
      }

      const esWords = normEs.split(/\s+/);
      for (const w of esWords) {
        if (w.length >= 2) {
          if (!this.esWordIndex.has(w)) this.esWordIndex.set(w, []);
          this.esWordIndex.get(w)!.push(i);
        }
      }
    }

    // 2. فهرسة القواعد مسبقًا
    for (const g of this.index.grammar) {
      if (!g) continue;
      this.precomputedGrammar.push({
        item: g,
        topicNormEs: normalizeEs(g.t),
        titleNormAr: normalizeAr(g.a),
      });
    }

    // 3. فهرسة الدروس مسبقًا
    for (const l of this.index.lessons) {
      if (!l) continue;
      this.precomputedLessons.push({
        item: l,
        titleNormAr: normalizeAr(l.t),
        objNormAr: l.o ? normalizeAr(l.o) : '',
        structNormsEs: (l.st || []).map(normalizeEs),
      });
    }
  }

  /**
   * بحث مباشر عن مدخل مفردات بالكلمة الإسبانية (تطابق تام بعد التطبيع).
   * يُستخدم لملء ملخص الدرس بالمفردات الأساسية مع ترجمتها العربية، دون
   * المرور بآلية البحث الكاملة. يعيد null إن لم يُعثر على المدخل.
   */
  lookupVocab(rawWord: string): CompactVocabItem | null {
    const w = normalizeEs(rawWord);
    const ids = this.normEsMap.get(w);
    if (!ids || ids.length === 0) return null;
    const first = ids[0];
    if (first === undefined) return null;
    const item = this.precomputedVocab[first]?.item;
    return item ?? null;
  }

  /** تنفيذ البحث فائق السرعة */
  search(rawQuery: string, options: SearchOptions = {}): SearchResponse {
    const start = Date.now();
    const query = (rawQuery || '').trim();

    if (!query) {
      return {
        query: '',
        total: 0,
        results: [],
        suggestion: null,
        executionMs: Date.now() - start,
      };
    }

    const qCleanEs = cleanEs(query);
    const qNormEs = normalizeEs(query);
    const qNormAr = normalizeAr(query);
    const limit = options.limit ?? 20;

    const matches: SearchItemResult[] = [];
    const seenKeys = new Set<string>();

    const addResult = (res: SearchItemResult) => {
      const key = `${res.kind}:${res.id}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        matches.push(res);
      }
    };

    // 1. فحص صيغة الفعل المصرف عبر الفهرس O(1)
    if (qNormEs && this.index.forms && this.index.forms[qNormEs]) {
      const formTarget = this.index.forms[qNormEs];
      const lemmas = Array.isArray(formTarget) ? formTarget : [formTarget];
      for (const lemma of lemmas) {
        if (!lemma) continue;
        const lemmaNorm = normalizeEs(lemma);
        const idxList = this.normEsMap.get(lemmaNorm);
        if (idxList && idxList.length > 0 && idxList[0] !== undefined) {
          const firstVocab = this.precomputedVocab[idxList[0]];
          if (firstVocab) {
            const vocabItem = firstVocab.item;
            addResult({
              id: `form-${qNormEs}-${lemmaNorm}`,
              kind: 'verb_form',
              title: `${qCleanEs} ← الفعل: ${vocabItem.e}`,
              titleEs: vocabItem.e,
              titleAr: vocabItem.f || vocabItem.eg,
              badgeAr: 'تصريف فعل',
              level: vocabItem.l,
              pos: vocabItem.p || 'فعل',
              lemma: vocabItem.e,
              meaningArFusha: vocabItem.f,
              meaningArEg: vocabItem.eg,
              exampleEs: vocabItem.ex?.[0],
              exampleAr: vocabItem.ex?.[1],
              url: `/learn`,
              score: 880,
              matchType: 'verb_form',
              matchReasonAr: `صيغة مصرّفة للفعل «${vocabItem.e}» (${vocabItem.f})`,
            });
          }
        }
      }
    }

    // 2. فحص التطابق التام بالإسبانية O(1)
    const exactClean = this.cleanEsMap.get(qCleanEs);
    if (exactClean) {
      for (const idx of exactClean) {
        const entry = this.precomputedVocab[idx];
        if (!entry) continue;
        const v = entry.item;
        addResult({
          id: `vocab-${entry.normEs}`,
          kind: 'vocab',
          title: v.e,
          titleEs: v.e,
          titleAr: v.f || v.eg,
          badgeAr: v.p ? `مفردة (${v.p})` : 'مفردة',
          level: v.l,
          pos: v.p || undefined,
          gender: v.g || undefined,
          meaningArFusha: v.f,
          meaningArEg: v.eg,
          exampleEs: v.ex?.[0],
          exampleAr: v.ex?.[1],
          url: `/learn`,
          score: 1000,
          matchType: 'exact_headword',
          matchReasonAr: 'تطابق تام مع الكلمة الإسبانية',
        });
      }
    }

    // 3. فحص التطابق الإسباني غير المشكّل O(1)
    const exactNorm = this.normEsMap.get(qNormEs);
    if (exactNorm) {
      for (const idx of exactNorm) {
        const entry = this.precomputedVocab[idx];
        if (!entry) continue;
        const v = entry.item;
        addResult({
          id: `vocab-${entry.normEs}`,
          kind: 'vocab',
          title: v.e,
          titleEs: v.e,
          titleAr: v.f || v.eg,
          badgeAr: v.p ? `مفردة (${v.p})` : 'مفردة',
          level: v.l,
          pos: v.p || undefined,
          gender: v.g || undefined,
          meaningArFusha: v.f,
          meaningArEg: v.eg,
          exampleEs: v.ex?.[0],
          exampleAr: v.ex?.[1],
          url: `/learn`,
          score: 950,
          matchType: 'exact_headword_unaccented',
          matchReasonAr: 'تطابق إسباني مع تجاهل علامات التشكيل',
        });
      }
    }

    // 4. فحص التطابق العربي عبر فهرس الكلمات O(1)
    const arMatches = this.arWordIndex.get(qNormAr);
    if (arMatches) {
      for (const idx of arMatches) {
        const entry = this.precomputedVocab[idx];
        if (!entry) continue;
        const v = entry.item;
        let score = 700;
        let reason = 'الكلمة واردة في المعنى العربي';
        if (entry.normFusha === qNormAr || entry.normEg === qNormAr) {
          score = 750;
          reason = 'تطابق دقيق مع المعنى العربي';
        }
        addResult({
          id: `vocab-${entry.normEs}`,
          kind: 'vocab',
          title: v.e,
          titleEs: v.e,
          titleAr: v.f || v.eg,
          badgeAr: v.p ? `مفردة (${v.p})` : 'مفردة',
          level: v.l,
          pos: v.p || undefined,
          gender: v.g || undefined,
          meaningArFusha: v.f,
          meaningArEg: v.eg,
          exampleEs: v.ex?.[0],
          exampleAr: v.ex?.[1],
          url: `/learn`,
          score,
          matchType: 'arabic_meaning',
          matchReasonAr: reason,
        });
      }
    }

    // 5. فحص بادئة الكلمة الإسبانية عبر الفهرس المسبق
    if (qNormEs.length >= 3 && matches.length < limit) {
      const candidates = this.prefixMap.get(qNormEs.slice(0, 3)) || [];
      for (const idx of candidates) {
        const entry = this.precomputedVocab[idx];
        if (!entry) continue;
        if (entry.normEs.startsWith(qNormEs)) {
          addResult({
            id: `vocab-${entry.normEs}`,
            kind: 'vocab',
            title: entry.item.e,
            titleEs: entry.item.e,
            titleAr: entry.item.f || entry.item.eg,
            badgeAr: entry.item.p ? `مفردة (${entry.item.p})` : 'مفردة',
            level: entry.item.l,
            pos: entry.item.p || undefined,
            gender: entry.item.g || undefined,
            meaningArFusha: entry.item.f,
            meaningArEg: entry.item.eg,
            exampleEs: entry.item.ex?.[0],
            exampleAr: entry.item.ex?.[1],
          url: `/learn`,
          score: 800,
            matchType: 'prefix_headword',
            matchReasonAr: 'الكلمة تبدأ بنص البحث',
          });
          if (matches.length >= limit * 2) break;
        }
      }
    }

    // 6. البحث في القواعد النحوية المسبقة
    for (const g of this.precomputedGrammar) {
      if (options.lessonSlugs && !options.lessonSlugs.has(g.item.s)) continue;
      let gScore = 0;
      let gReason = '';

      if (g.topicNormEs === qNormEs || g.titleNormAr === qNormAr) {
        gScore = 720;
        gReason = 'تطابق تام مع موضوع القاعدة النحوية';
      } else if (g.topicNormEs.includes(qNormEs) && qNormEs.length >= 3) {
        gScore = 600;
        gReason = 'موضوع القاعدة النحوية يحتوي نص البحث';
      } else if (g.titleNormAr.includes(qNormAr) && qNormAr.length >= 3) {
        gScore = 580;
        gReason = 'عنوان الدرس النحوي يحتوي نص البحث';
      }

      if (gScore > 0) {
        addResult({
          id: `grammar-${g.item.t}`,
          kind: 'grammar',
          title: g.item.a,
          titleAr: g.item.a,
          titleEs: g.item.t,
          badgeAr: 'قاعدة نحوية',
          level: g.item.l,
          url: `/learn/${g.item.s}`,
          score: gScore,
          matchType: 'grammar_topic',
          matchReasonAr: gReason,
        });
      }
    }

    // 7. البحث في الدروس والتراكيب المستهدفة
    for (const l of this.precomputedLessons) {
      if (options.lessonSlugs && !options.lessonSlugs.has(l.item.s)) continue;
      let lScore = 0;
      let lReason = '';

      for (const stNorm of l.structNormsEs) {
        if (stNorm.includes(qNormEs) && qNormEs.length >= 3) {
          lScore = Math.max(lScore, 620);
          lReason = `مثال أو جملة مستهدفة داخل الدرس`;
          break;
        }
      }

      if (l.titleNormAr === qNormAr) {
        lScore = Math.max(lScore, 700);
        lReason = 'تطابق تام مع عنوان الدرس';
      } else if (l.titleNormAr.includes(qNormAr) && qNormAr.length >= 3) {
        lScore = Math.max(lScore, 500);
        lReason = 'عنوان الدرس يحتوي نص البحث';
      } else if (l.objNormAr.includes(qNormAr) && qNormAr.length >= 4) {
        lScore = Math.max(lScore, 400);
        lReason = 'الهدف التعليمي للدرس يحتوي نص البحث';
      }

      if (lScore > 0) {
        addResult({
          id: `lesson-${l.item.s}`,
          kind: 'lesson',
          title: l.item.t,
          titleAr: l.item.t,
          badgeAr: 'درس تفاعلي',
          level: l.item.l,
          targetStructures: l.item.st.slice(0, 3),
          url: `/learn/${l.item.s}`,
          score: lScore,
          matchType: 'lesson_content',
          matchReasonAr: lReason,
        });
      }
    }

    // 8. اقتراح تصحيحي ذكي (Fuzzy suggestion) عند عدم وجود أي نتيجة مباشرة
    let suggestion: string | null = null;
    if (matches.length === 0 && (qNormEs.length >= 4 || qNormAr.length >= 4)) {
      let minDistance = 3;
      let closestWord = '';

      if (qNormEs.length >= 4) {
        for (const entry of this.precomputedVocab) {
          if (Math.abs(entry.normEs.length - qNormEs.length) <= 2) {
            const dist = damerauLevenshtein(qNormEs, entry.normEs);
            if (dist < minDistance) {
              minDistance = dist;
              closestWord = entry.item.e;
              if (dist === 1) break;
            }
          }
        }
      }

      if (!closestWord && qNormAr.length >= 4) {
        for (const [w] of this.arWordIndex.entries()) {
          if (Math.abs(w.length - qNormAr.length) <= 1) {
            const dist = damerauLevenshtein(qNormAr, w);
            if (dist < minDistance) {
              minDistance = dist;
              closestWord = w;
              if (dist === 1) break;
            }
          }
        }
      }

      if (closestWord) {
        suggestion = closestWord;
      }
    }

    matches.sort((a, b) => b.score - a.score);

    let filtered = matches;
    if (options.level) {
      filtered = filtered.filter(r => r.level.toLowerCase() === options.level!.toLowerCase());
    }
    if (options.kind && options.kind !== 'all') {
      filtered = filtered.filter(r => r.kind === options.kind);
    }

    const finalResults = filtered.slice(0, limit);

    return {
      query,
      total: filtered.length,
      results: finalResults,
      suggestion,
      executionMs: Date.now() - start,
    };
  }
}

export const searchEngine = new SearchEngine();
