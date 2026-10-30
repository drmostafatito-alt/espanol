// @vitest-environment jsdom
/**
 * صور متجاوبة: بنية <picture>/srcset + وجود كل ملف مُعلَن فعليًا على القرص.
 *
 * لماذا: كان الهيرو يُقدَّم 107KB في كل الأحوال، وبطاقات المسارات (320px معروضة)
 * تُقدَّم صورًا بعرض 1100px (حتى 208KB). بعد إضافة النسخ المتعددة صار من المهم
 * ضمان أمرين لا يراهما TypeScript: (1) كل مسار في srcset له ملف حقيقي،
 * (2) الأبعاد المعلنة (width/height) موجودة فلا إزاحة تخطيط.
 *
 * ما لا يغطيه: الرسم الفعلي بالمتصفح (Chromium لا يعمل في هذه البيئة) ولا
 * اختيار المتصفح للنسخة الأنسب — فقط البنية ووجود الأصول.
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { Landing } from '../src/web/pages/Landing';
import { HERO_IMAGE, trackImageSources, trackImageSrcSet, trackVisual } from '../src/web/components/tracks';

const PUBLIC = join(process.cwd(), 'public');
const urlsIn = (srcSet: string): string[] =>
  (srcSet ?? '')
    .split(',')
    .map(part => part.trim().split(/\s+/)[0])
    .filter((url): url is string => Boolean(url));

describe('الصور المتجاوبة', () => {
  it('كل مسار في الهيرو موجود على القرص مع نسختي avif وwebp', () => {
    for (const url of urlsIn(HERO_IMAGE.srcSet)) {
      expect(existsSync(join(PUBLIC, url)), `ملف مفقود: ${url}`).toBe(true);
    }
    for (const source of HERO_IMAGE.sources) {
      expect(['image/avif', 'image/webp']).toContain(source.type);
      for (const url of urlsIn(source.srcSet)) {
        expect(existsSync(join(PUBLIC, url)), `ملف مفقود: ${url}`).toBe(true);
      }
    }
  });

  it('نسخ الهيرو أصغر من الأصل ولا تتجاوزه', () => {
    const original = statSync(join(PUBLIC, HERO_IMAGE.src)).size;
    const smallest = statSync(join(PUBLIC, '/img/hero-spain-400.webp')).size;
    expect(smallest).toBeLessThan(original / 3);
  });

  it('بطاقات المسارات تقدّم نسخ 320 و640 للواجهتين', () => {
    const image = trackVisual('travel').image;
    const jpeg = urlsIn(trackImageSrcSet(image));
    const webp = urlsIn(trackImageSources(image).webp);
    expect(jpeg).toHaveLength(2);
    expect(webp).toHaveLength(2);
    for (const url of [...jpeg, ...webp]) expect(existsSync(join(PUBLIC, url)), `ملف مفقود: ${url}`).toBe(true);
  });

  it('الهيرو يُرسم داخل <picture> بأبعاد معلنة وpriority عالٍ', () => {
    const { container } = render(<Landing navigate={() => {}} />);
    const picture = container.querySelector('.hero-simple-media picture');
    expect(picture).not.toBeNull();
    const img = picture!.querySelector('img')!;
    expect(img.getAttribute('srcset')).toContain('400w');
    expect(img.getAttribute('sizes')).toContain('520px');
    expect(img.getAttribute('width')).toBe('1100');
    expect(img.getAttribute('height')).toBe('614');
    expect(img.getAttribute('fetchpriority')).toBe('high');
    expect(img.getAttribute('loading')).toBe('eager');
    const types = [...picture!.querySelectorAll('source')].map(s => s.getAttribute('type'));
    expect(types).toEqual(['image/avif', 'image/webp']);
  });
});
