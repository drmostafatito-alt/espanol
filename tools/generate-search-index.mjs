#!/usr/bin/env node
/**
 * ============================================================================
 * tools/generate-search-index.mjs — مولّد فهرس البحث الذكي للمنصة
 * ============================================================================
 * ينشئ فهرسًا فائق الكفاءة والسرعة يغطي:
 *   1) المعجم الكامل (8,046 مفردة فريدة وتصريفاتها ومعانيها الفصحى والمصرية)
 *
 * الدروس والقواعد لا تُضمَّن هنا عمدًا: ملفات المحتوى المصدرية لا تحمل
 * حالة نشر، وكلها مسودات عند الاستيراد، فأي بيانات دروس في هذا الملف
 * كانت ستُشحن داخل حزمة الواجهة وتكشف عناوين المسودات وأهدافها وتراكيبها
 * لأي زائر. بحث الدروس والقواعد يتم من الخادم فقط (GET /api/content/search)
 * من قاعدة البيانات وفق قاعدة الرؤية — المنشور فقط، والمسودات فقط عندما
 * يسمح allowUnreviewedContent (تطوير صريح، لا إنتاج).
 *
 * الفهرس يُحفظ في:
 *   src/shared/search-index.json
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRAFTS_DIR = join(ROOT, 'content', 'drafts');
const OUT_FILE = join(ROOT, 'src', 'shared', 'search-index.json');

/** تطبيع النص الإسباني بإزالة التشكيل وعلامات الترقيم */
export function normalizeEs(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:"'«»()…—\-_/\\\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** تطبيع النص الإسباني مع الإبقاء على التشكيل (لمقارنة التطابق الدقيق) */
export function cleanEs(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[¿?¡!.,;:"'«»()…—\-_/\\\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** تطبيع النص العربي لإزالة التشكيل وتوحيد الحروف المتشابهة */
export function normalizeAr(text) {
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

function listFiles(dir, pattern) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...listFiles(full, pattern));
    } else if (pattern.test(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

export function buildSearchIndex() {
  const startTime = Date.now();
  const vocabFiles = listFiles(DRAFTS_DIR, /^vocab-.*\.json$/);

  // 1. فهرسة المعجم
  const vocabList = [];
  const vocabSeen = new Set();
  const formsMap = new Map(); // formNorm -> string or array of strings (lemmas)

  for (const file of vocabFiles) {
    try {
      const data = JSON.parse(readFileSync(file, 'utf8'));
      const entries = data.entries || [];
      for (const e of entries) {
        const headword = (e.headword || e.headwordEs || e.word || '').trim();
        if (!headword) continue;
        // مفتاح إزالة التكرار يحفظ التشكيل: papa وpapá كلمتان مختلفتان
        const norm = normalizeEs(headword);
        const exactKey = cleanEs(headword);
        if (vocabSeen.has(exactKey)) continue;
        vocabSeen.add(exactKey);

        const fushaList = [];
        const egList = [];
        let primaryEx = null;

        for (const s of e.senses || []) {
          if (s.meaningArFusha) fushaList.push(s.meaningArFusha.trim());
          if (s.meaningArEg) egList.push(s.meaningArEg.trim());
          if (!primaryEx && s.exampleSentence) {
            const es = (s.exampleSentence.textEs || s.exampleSentence.es || '').trim();
            const ar = (s.exampleSentence.translations?.fusha || s.exampleSentence.translations?.ar || s.exampleSentence.ar || '').trim();
            if (es) primaryEx = [es, ar];
          }
        }

        // فهرسة التصريفات والصيغ
        for (const f of e.forms || []) {
          const formText = (f.form || f.formEs || '').trim();
          if (!formText) continue;
          const formNorm = normalizeEs(formText);
          if (formNorm && formNorm !== norm) {
            if (!formsMap.has(formNorm)) {
              formsMap.set(formNorm, headword);
            } else {
              const prev = formsMap.get(formNorm);
              if (typeof prev === 'string' && prev !== headword) {
                formsMap.set(formNorm, [prev, headword]);
              } else if (Array.isArray(prev) && !prev.includes(headword)) {
                prev.push(headword);
              }
            }
          }
        }

        vocabList.push({
          e: headword,
          p: e.pos || null,
          g: e.gender || null,
          l: e.level || 'A1',
          f: fushaList.join(' / '),
          eg: egList.join(' / '),
          ex: primaryEx || undefined,
        });
      }
    } catch (err) {
      console.warn(`تحذير أثناء قراءة ${file}:`, err.message);
    }
  }

  // 2. الدروس والقواعد: لا تُفهرس هنا أبدًا (انظر رأس الملف).
  // الفهرس المضمّن في الحزمة يحمل المفردات والتصريفات فقط؛ بحث الدروس
  // والقواعد خادمي ومقيّد بالرؤية. أي عودة لفهرسة الدروس هنا = تسريب مسودات.
  const lessons = [];
  const grammarTopicsMap = new Map();

  const formsObj = {};
  for (const [k, v] of formsMap.entries()) {
    formsObj[k] = v;
  }

  const index = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    stats: {
      vocabCount: vocabList.length,
      formsCount: Object.keys(formsObj).length,
      lessonsCount: lessons.length,
      grammarCount: grammarTopicsMap.size,
      buildMs: Date.now() - startTime,
    },
    vocab: vocabList,
    forms: formsObj,
    lessons,
    grammar: Array.from(grammarTopicsMap.values()),
  };

  // وضع --check (لـCI): يقارن الفهرس المولَّد بالملتزَم متجاهلًا الحقول
  // الزمنية (generatedAt/buildMs) — أي فرق حقيقي = فهرس قديم ويجب إعادة توليده.
  if (process.argv.includes('--check')) {
    const existing = JSON.parse(readFileSync(OUT_FILE, 'utf8'));
    const stripVolatile = (o) => {
      const c = JSON.parse(JSON.stringify(o));
      delete c.generatedAt;
      if (c.stats) delete c.stats.buildMs;
      return c;
    };
    const same = JSON.stringify(stripVolatile(existing)) === JSON.stringify(stripVolatile(index));
    if (!same) {
      console.error('فهرس البحث قديم: شغّل `npm run search-index` والتزم الناتج.');
      process.exit(1);
    }
    console.log('فهرس البحث محدَّث.');
    return index;
  }

  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(index), 'utf8');

  console.log(
    `✅ تم بناء فهرس البحث الذكي بنجاح: ` +
    `${index.stats.vocabCount} مفردة، ` +
    `${index.stats.formsCount} صيغة مصرّفة (الدروس والقواعد تُبحث من الخادم وفق الرؤية).`
  );

  return index;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  buildSearchIndex();
}
