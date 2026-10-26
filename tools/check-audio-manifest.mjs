#!/usr/bin/env node
/**
 * ============================================================================
 * تحقق تناسق قائمة الأصول الصوتية المولدة مسبقًا مع الملفات فعليًا
 * ----------------------------------------------------------------------------
 * لماذا؟
 *   الملف `src/web/audio/assetManifest.json` هو مصدر الحقيقة الذي يعتمده
 *   `AudioService` لتحويل مفتاحٍ إلى أصل صوتي جاهز. لو حدث انحراف بين القائمة
 *   والقرص (أصل مُشار إليه بلكن غير موجود، أو ملف موجود بلا قائمة) ينهار أحدُهما:
 *     - أصل مُشار إليه بلكن غير موجود ⇒ طلب شبكة فاشل ثم بديل speechSynthesis.
 *     - ملف موجود بلا قائمة ⇒ أصل غير قابل للوصول أبدًا (موت صامت).
 *   لا نريد أن نُكتشف هذا عند التشغيل، بل عند التحقق.
 *
 * ما يفحصه:
 *   1. كل مدخل في القائمة له ملف معلن.
 *   2. كل ملف معلن موجود فعليًا في كل بيئة صوتية تحت public/audio (es-ES و es-419).
 *   3. كل ملف على القرص مرجوع في القائمة (لا مفردات مهملة).
 *   4. `sizeBytes` المعلن يطابق الحجم الحقيقي (اكتشاف تلف أو تحديث غير متزامن).
 *
 * الاستخدام:
 *   node tools/check-audio-manifest.mjs            # تقرير نصي، exit 1 على تنافر
 *   node tools/check-audio-manifest.mjs --json     # تقرير JSON
 *
 * هذا الفحص قراءة فقط: لا يكتب، لا يتصل بالشبكة، ولا يولّد أي أصل.
 * ========================================================================== */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = join(ROOT, 'src/web/audio/assetManifest.json');
const AUDIO_ROOT = join(ROOT, 'public/audio');
const AUDIO_EXT = /\.(wav|mp3|ogg|opus|m4a|flac)$/i;

/**
 * يجمع ملفات الصوت حسب البيئة (variant). القائمة الحالية: es-ES فقط، لكن
 * الفحص لا يفترض ذلك: `resolveUrl` يبني الرابط لكل بيئة، لذا يجب أن يكون
 * الملف حاضرًا في كل بيئة صوتية موجودة.
 * الإرجاع: { 'es-ES': ['a.wav', ...], 'es-419': [...] }
 */
export function collectAudioFiles(audioRoot) {
  const byVariant = {};
  if (!existsSync(audioRoot)) return byVariant;
  for (const entry of readdirSync(audioRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = join(audioRoot, entry.name);
    byVariant[entry.name] = readdirSync(dir).filter(f => AUDIO_EXT.test(f));
  }
  return byVariant;
}

/**
 * تحقق تناسق القائمة مع ملفات القرص (دون اعتماد على حجم الملف).
 * يُرجع فئات مفصلة حتى يتمكن الاختبار من التحقق من كل فئة على حدة.
 */
export function verifyAudioManifest(manifest, filesByVariant) {
  const errors = [];
  const warnings = [];
  /** file → مفاتيح القائمة التي تشير إليه (قد يشارك أكثر من مفتاح نفس الملف) */
  const byFile = new Map();

  for (const [key, entry] of Object.entries(manifest)) {
    if (!entry || typeof entry.file !== 'string' || entry.file.length === 0) {
      errors.push({ code: 'MANIFEST_ENTRY_WITHOUT_FILE', key });
      continue;
    }
    if (!byFile.has(entry.file)) byFile.set(entry.file, []);
    byFile.get(entry.file).push(key);
  }

  const referenced = new Set(byFile.keys());
  const variants = Object.keys(filesByVariant);
  for (const variant of variants) {
    const set = new Set(filesByVariant[variant]);
    for (const file of byFile.keys()) {
      if (!set.has(file)) {
        errors.push({ code: 'AUDIO_FILE_MISSING', key: byFile.get(file)[0], file, variant });
      }
    }
    for (const file of set) {
      if (!referenced.has(file)) errors.push({ code: 'AUDIO_FILE_ORPHAN', file, variant });
    }
  }

  return {
    entries: Object.keys(manifest).length,
    uniqueDeclaredFiles: byFile.size,
    variants,
    filesOnDisk: variants.reduce((a, v) => a + filesByVariant[v].length, 0),
    referencedOnDisk: variants.filter(v => filesByVariant[v].every(f => referenced.has(f))).length,
    aliases: [...byFile.entries()].filter(([, keys]) => keys.length > 1).map(([file, keys]) => ({ file, keys })),
    errors,
    warnings,
  };
}

/** التحقق من أن الحجم المعلن يطابق الحجم على القرص لكل بيئة صوتية. */
export function verifyManifestSizes(manifest, filesByVariant, audioRoot) {
  const byFile = new Map();
  for (const [key, entry] of Object.entries(manifest)) {
    if (!entry?.file) continue;
    if (!byFile.has(entry.file)) byFile.set(entry.file, []);
    byFile.get(entry.file).push(key);
  }
  const mismatches = [];
  for (const [variant, files] of Object.entries(filesByVariant)) {
    for (const file of files) {
      const keys = byFile.get(file);
      if (!keys) continue;
      const entry = manifest[keys[0]];
      if (typeof entry.sizeBytes !== 'number') continue;
      const actual = statSync(join(audioRoot, variant, file)).size;
      if (actual !== entry.sizeBytes) {
        for (const key of keys) mismatches.push({ code: 'AUDIO_SIZE_MISMATCH', key, file, variant, declared: entry.sizeBytes, actual });
      }
    }
  }
  return mismatches;
}

function main() {
  const AS_JSON = process.argv.includes('--json');
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  const filesByVariant = collectAudioFiles(AUDIO_ROOT);
  const report = verifyAudioManifest(manifest, filesByVariant);
  report.sizeMismatches = verifyManifestSizes(manifest, filesByVariant, AUDIO_ROOT);
  report.errors.push(...report.sizeMismatches);
  const ok = report.errors.length === 0;

  if (AS_JSON) {
    console.log(JSON.stringify({ manifest: relative(ROOT, MANIFEST_PATH), ok, ...report }, null, 2));
  } else {
    console.log(`# تحقق قائمة الأصول الصوتية — ${relative(ROOT, MANIFEST_PATH)}\n`);
    console.log(`- مداخل القائمة: ${report.entries}`);
    console.log(`- بيئات صوتية: ${report.variants.join(', ') || '(لا شيء)'}`);
    console.log(`- ملفات مفردة مُعلنة: ${report.uniqueDeclaredFiles}`);
    console.log(`- ملفات موجودة على القرص: ${report.filesOnDisk}`);
    console.log(`- أسماء مستعارة (مفتاحان → ملف واحد): ${report.aliases.length}\n`);

    const section = (title, list) => {
      if (!list.length) return;
      console.log(`## ${title}`);
      for (const item of list) console.log(`- ✗ [${item.code}] ${item.file ?? item.key} — ${JSON.stringify(item)}`);
      console.log('');
    };
    section('أخطاء', report.errors);

    console.log(`**النتيجة: ${ok ? 'PASS' : 'FAIL'}**`);
  }
  process.exit(ok ? 0 : 1);
}

// يُشغَّل كبرنامج فقط، لا عند الاستيراد للاختبار.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
