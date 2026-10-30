#!/usr/bin/env node
/**
 * توليد نسخ صور متعددة المقاسات للصفحة الرئيسية وخريطة المسار.
 *
 * المصدر الوحيد هو الملفات الأصلية في public/img (لا صور مُبتكرة ولا مسارات وهمية).
 * الترميز عبر ImageMagick فقط (لا sharp/jimp في المشروع). الأبعاد المختارة مبنية
 * على المقاسات المعروضة فعلًا: الهيرو يُعرض في عمود ~520px ويُقصّ بنسبة 4/3،
 * وبطاقات المسارات 320px، مع احتساب شاشات DPR=2.
 *
 *   node tools/build-image-variants.mjs           # عرض ما سيُولَّد
 *   node tools/build-image-variants.mjs --write   # ترميز فعلي
 */
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = join(ROOT, 'public', 'img');
const WRITE = process.argv.includes('--write');

const PLAN = [
  // الأكبر JPEG يبقى الملف الأصلي نفسه: إعادة ترميزه كانت تُنتج ملفًا أكبر منه
  { src: 'hero-spain.jpg', widths: { jpg: [400, 700], webp: [400, 700, 1100], avif: [400, 700, 1100] }, quality: { jpg: 82, webp: 80, avif: 54 } },
  ...['track-daily.jpg', 'track-work.jpg', 'track-vocab.jpg', 'track-travel.jpg', 'track-food.jpg'].map(src => ({
    src,
    widths: { jpg: [320, 640], webp: [320, 640] },
    quality: { jpg: 80, webp: 78 },
  })),
];

const rows = [];
for (const item of PLAN) {
  const abs = join(IMG_DIR, item.src);
  if (!existsSync(abs)) {
    console.error(`❌ أصل مفقود: ${item.src}`);
    process.exit(1);
  }
  const base = item.src.replace(/\.jpg$/, '');
  const originalBytes = statSync(abs).size;
  for (const [format, widths] of Object.entries(item.widths)) {
    for (const width of widths) {
      const out = join(IMG_DIR, `${base}-${width}.${format}`);
      const args = [abs, '-resize', `${width}x`, '-strip'];
      if (format === 'jpg') args.push('-interlace', 'Plane', '-quality', String(item.quality.jpg));
      else if (format === 'webp') args.push('-quality', String(item.quality.webp), '-define', 'webp:method=6');
      else args.push('-quality', String(item.quality.avif));
      args.push(out);
      if (WRITE) execFileSync('convert', args, { stdio: 'pipe' });
      rows.push({ file: `${base}-${width}.${format}`, width, format, originalBytes, bytes: WRITE ? statSync(out).size : null });
    }
  }
}

const group = {};
for (const row of rows) {
  const key = row.file.replace(/-\d+\.\w+$/, '');
  group[key] = group[key] ?? { originalBytes: row.originalBytes, files: [] };
  group[key].files.push(row);
}

for (const [key, g] of Object.entries(group)) {
  console.log(`\n${key}.jpg — الأصل ${g.originalBytes.toLocaleString('en-US')} بايت`);
  for (const f of g.files) {
    const size = f.bytes ? `${f.bytes.toLocaleString('en-US')} بايت` : '—';
    console.log(`   ${f.file.padEnd(26)} ${String(f.width).padStart(4)}px  ${size}`);
  }
}
console.log(`\n${WRITE ? '✅ كُتبت' : '👀 معاينة'} ${rows.length} نسخة (أضف --write للترميز)`);
