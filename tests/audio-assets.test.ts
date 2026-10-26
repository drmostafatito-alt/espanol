/**
 * اختبارات تناسق قائمة الأصول الصوتية المولدة مع الملفات على القرص.
 *
 * الغاية: القائمة هي مصدر الحقيقة الذي يحوّل مفتاحًا إلى أصل صوتي. لو انحرفت
 * عن القرص انهار أحدُهما بصمت (أصل مفقود ⇒ بديل نطق، أو ملف غير قابل للوصول).
 * هذا الاختبار يمنع الانحراف من التسلل، ويغطي:
 *   - الفحوص المنطقية (مفقود، مُهمَل، اسم مستعار، مدخل بلا ملف).
 *   - التحقق من الأحجام.
 *   - التناسق الحقيقي للمستودع (القائمة ↔ public/audio ولفروعه).
 *   - سلوك البرنامج من CLI (exit 0 على تطابق).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
// @ts-ignore — وحدة .mjs مشتركة مع أداة التحقق
import { collectAudioFiles, verifyAudioManifest, verifyManifestSizes } from '../tools/check-audio-manifest.mjs';

type ManifestIssue = {
  code: string; key?: string; file?: string; variant?: string; declared?: number; actual?: number;
};
type ManifestReport = {
  entries: number; uniqueDeclaredFiles: number; variants: string[]; filesOnDisk: number;
  referencedOnDisk: number; aliases: { file: string; keys: string[] }[];
  errors: ManifestIssue[]; warnings: ManifestIssue[];
};
type FilesByVariant = Record<string, string[]>;

const ROOT = process.cwd();
const MANIFEST_PATH = join(ROOT, 'src/web/audio/assetManifest.json');
const AUDIO_ROOT = join(ROOT, 'public/audio');
const TOOL = join(ROOT, 'tools/check-audio-manifest.mjs');

function runTool(args = ['--json']): { code: number; json: any } {
  try {
    const out = execFileSync('node', [TOOL, ...args], { cwd: ROOT, encoding: 'utf8' });
    return { code: 0, json: JSON.parse(out) };
  } catch (e: any) {
    const out = String(e.stdout ?? '');
    return { code: e.status ?? -1, json: safeJson(out) };
  }
}
const safeJson = (s: string) => { try { return JSON.parse(s); } catch { return null; } };

/** يفحص قائمة وهمية ويُرجع نتيجة موصوفة (لأن الوحدة .mjs غير مُعرِّفَة لـtsc). */
function check(manifest: Record<string, unknown>, filesByVariant: FilesByVariant): ManifestReport {
  return verifyAudioManifest(manifest, filesByVariant) as ManifestReport;
}
const variantFiles = (...names: string[]): FilesByVariant => ({ 'es-ES': names });

describe('قائمة الأصول الصوتية — منطق الفحص', () => {
  it('تُصادِف مدخلاً بلا ملف معلن', () => {
    const r = check({ a: { file: 'a.wav' }, b: { text: 'no file' } }, variantFiles('a.wav'));
    expect(r.errors.map((e: ManifestIssue) => e.code)).toContain('MANIFEST_ENTRY_WITHOUT_FILE');
    expect(r.errors.find((e: ManifestIssue) => e.key === 'b')).toBeTruthy();
  });

  it('تُصادِف أصلاً مُشارًا إليه بلكن غير موجود على القرص', () => {
    const r = check({ a: { file: 'a.wav' } }, variantFiles('other.wav'));
    expect(r.errors.map((e: ManifestIssue) => e.code)).toContain('AUDIO_FILE_MISSING');
    expect(r.errors.find((e: ManifestIssue) => e.file === 'a.wav' && e.variant === 'es-ES')).toBeTruthy();
  });

  it('تُصادِف أصلاً مفقودًا في بيئة واحدة من بين عدة بيئات', () => {
    const r = check({ a: { file: 'a.wav' } }, { 'es-ES': ['a.wav'], 'es-419': ['c.wav'] });
    // a.wav مفقود في es-419 (مسرّج في es-ES فقط)
    expect(r.errors.map((e: ManifestIssue) => e.code)).toContain('AUDIO_FILE_MISSING');
    expect(r.errors.find((e: ManifestIssue) => e.file === 'a.wav' && e.variant === 'es-419')).toBeTruthy();
    // c.wav غير مرجوع ⇒ مُهمَل في es-419
    expect(r.errors.find((e: ManifestIssue) => e.file === 'c.wav' && e.variant === 'es-419')).toBeTruthy();
  });

  it('تسمح بأكثر من مفتاح لنفس الملف (الأسماء المستعارة) وتحصيها', () => {
    const r = check(
      { k: { file: 'x.wav' }, 'pending/k': { file: 'x.wav' } },
      variantFiles('x.wav'),
    );
    expect(r.errors).toEqual([]);
    expect(r.entries).toBe(2);
    expect(r.uniqueDeclaredFiles).toBe(1);
    expect(r.aliases).toHaveLength(1);
    expect(r.aliases[0]!.keys).toEqual(['k', 'pending/k']);
  });

  it('تُحصي المداخل والأحجام بوحدات صحيحة', () => {
    const r = check({ a: { file: 'a.wav' }, b: { file: 'b.wav' } }, variantFiles('a.wav', 'b.wav'));
    expect(r.entries).toBe(2);
    expect(r.filesOnDisk).toBe(2);
    expect(r.uniqueDeclaredFiles).toBe(2);
    expect(r.variants).toEqual(['es-ES']);
  });
});

describe('قائمة الأصول الصوتية — حجم الملف', () => {
  it('تُصادِف حجمًا معلنًا لا يطابق الحجم الحقيقي', () => {
    const byVariant = collectAudioFiles(AUDIO_ROOT) as FilesByVariant;
    const firstVariant = Object.keys(byVariant)[0]!;
    const name = byVariant[firstVariant]![0]!;
    const sizes = verifyManifestSizes({ bogus: { file: name, sizeBytes: 1 } }, byVariant, AUDIO_ROOT) as ManifestIssue[];
    expect(sizes.map((s: ManifestIssue) => s.code)).toContain('AUDIO_SIZE_MISMATCH');
    expect(sizes[0]!.key).toBe('bogus');
    expect(sizes[0]!.variant).toBe(firstVariant);
  });

  it('تتطابق الأحجام المعلنة مع القرص في المستودع الحقيقي', () => {
    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
    const byVariant = collectAudioFiles(AUDIO_ROOT) as FilesByVariant;
    expect(verifyManifestSizes(manifest, byVariant, AUDIO_ROOT)).toEqual([]);
  });
});

describe('قائمة الأصول الصوتية — تناسق المستودع الحقيقي', () => {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  const byVariant = collectAudioFiles(AUDIO_ROOT) as FilesByVariant;

  it('كل مفتاح له ملف معلن', () => {
    const r = check(manifest, byVariant);
    expect(r.errors.filter((e: ManifestIssue) => e.code === 'MANIFEST_ENTRY_WITHOUT_FILE')).toEqual([]);
  });

  it('كل ملف معلن موجود فعليًا في كل بيئة صوتية', () => {
    const r = check(manifest, byVariant);
    expect(r.errors.filter((e: ManifestIssue) => e.code === 'AUDIO_FILE_MISSING')).toEqual([]);
  });

  it('لا يوجد ملف على القرص بلا قائمة', () => {
    const r = check(manifest, byVariant);
    expect(r.errors.filter((e: ManifestIssue) => e.code === 'AUDIO_FILE_ORPHAN')).toEqual([]);
  });

  it('القائمة تغطي كل ملف على القرص (مرجع واحد↔ملف واحد بعد تفكيك الأسماء المستعارة)', () => {
    const r = check(manifest, byVariant);
    expect(r.uniqueDeclaredFiles).toBe(r.filesOnDisk);
    expect(r.referencedOnDisk).toBe(r.variants.length);
  });

  it('لا تنافر إطلاقًا', () => {
    const r = check(manifest, byVariant);
    expect(r.errors).toEqual([]);
  });
});

describe('قائمة الأصول الصوتية — سلوك البرنامج من CLI', () => {
  it('يخرج 0 ويُعلن PASS على التناسق الحقيقي', () => {
    const { code, json } = runTool(['--json']);
    expect(code).toBe(0);
    expect(json?.ok).toBe(true);
    expect(json?.entries).toBeGreaterThan(0);
    expect(json?.filesOnDisk).toBeGreaterThan(0);
    expect(json?.errors).toEqual([]);
  });

  it('لا يُعدّل أي ملف (فحص للقراءة فقط)', () => {
    const before = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' });
    runTool(['--json']);
    const after = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' });
    expect(after).toBe(before);
  });
});
