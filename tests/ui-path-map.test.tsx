// @vitest-environment jsdom
/**
 * عيوب مثبتة في خريطة المسار أُصلحت هنا (اختبارات انحدار):
 * 1) كانت وحدة الطالب الحالية قابلة للطيّ، فكان درسه التالي يختفي من الخريطة.
 * 2) كانت نافذة الوحدات (8 وحدات) قادرة على إخفاء وحدة الطالب بلا طريق واضح للرجوع.
 * الاختبارات ترسم المكوّن الحقيقي ببيانات على شكل عقد /api/me/progress.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { PathMap, type PathUnit } from '../src/web/components/PathMap';
import type { ProgressLessonItem } from '../src/web/api';

afterEach(cleanup);

function lesson(slug: string, title: string, opts: Partial<ProgressLessonItem> = {}): ProgressLessonItem {
  return {
    slug,
    title_ar: title,
    level_code: 'PREA1',
    unit_id: opts.unit_id ?? 'unit-1',
    unit_title_ar: opts.unit_title_ar ?? 'أصوات وحروف',
    program_slug: opts.program_slug ?? 'main-track',
    program_title_ar: opts.program_title_ar ?? 'المسار الأساسي',
    progress_status: opts.progress_status ?? 'not_started',
    is_unlocked: opts.is_unlocked ?? true,
    best_accuracy: opts.best_accuracy ?? null,
    estimated_minutes: opts.estimated_minutes ?? 8,
    missing_prerequisites: opts.missing_prerequisites ?? [],
  } as ProgressLessonItem;
}

/** 20 وحدة × 3 دروس: أكثر من نافذة العرض (8) لإجبار سلوك الترقيم */
function manyUnits(): ProgressLessonItem[] {
  const out: ProgressLessonItem[] = [];
  for (let u = 1; u <= 20; u++) {
    for (let l = 1; l <= 3; l++) {
      out.push(
        lesson(`u${u}-l${l}`, `درس ${u}-${l}`, {
          unit_id: `unit-${u}`,
          unit_title_ar: `وحدة ${u}`,
        }),
      );
    }
  }
  return out;
}

const noop = () => {};

describe('PathMap — وحدة الطالب الحالية ودرسُه التالي', () => {
  it('تفتح وحدة الدرس التالي افتراضيًا وتُظهر دروسها', () => {
    const lessons = manyUnits();
    render(<PathMap lessons={lessons} nextSlug="u3-l1" onOpenLesson={noop} onOpenReview={noop} />);
    // الوحدة الثالثة هي الحالية ⇒ أزرار دروسها ظاهرة
    expect(screen.getByText('درس 3-1')).toBeTruthy();
    expect(screen.getByText('درس 3-2')).toBeTruthy();
  });

  it('زر طيّ الوحدة الحالية معطّل وشرحه واضح (لا يختفي الدرس التالي)', () => {
    const lessons = manyUnits();
    render(<PathMap lessons={lessons} nextSlug="u3-l1" onOpenLesson={noop} onOpenReview={noop} />);
    const currentSection = screen.getByText('وحدة 3').closest('section') as HTMLElement;
    const toggle = within(currentSection).getByRole('button', { name: /وحدتك الحالية/ }) as HTMLButtonElement;
    expect(toggle.disabled).toBe(true);
    fireEvent.click(toggle);
    // بعد محاولة الطيّ يبقى الدرس التالي معروضًا
    expect(screen.getByText('درس 3-1')).toBeTruthy();
  });

  it('يمكن طيّ وحدة أخرى وإعادة فتحها', () => {
    const lessons = manyUnits();
    render(<PathMap lessons={lessons} nextSlug="u3-l1" onOpenLesson={noop} onOpenReview={noop} />);
    const otherSection = screen.getByText('وحدة 4').closest('section') as HTMLElement;
    expect(within(otherSection).queryByText('درس 4-1')).toBeNull(); // مطويّة افتراضيًا
    fireEvent.click(within(otherSection).getByRole('button', { name: /عرض وحدة/ }));
    expect(within(otherSection).getByText('درس 4-1')).toBeTruthy();
  });

  it('الابتعاد بالنافذة يُبقي طريق عودة إلى وحدة الطالب الحالية', () => {
    const lessons = manyUnits();
    render(<PathMap lessons={lessons} nextSlug="u3-l1" onOpenLesson={noop} onOpenReview={noop} />);
    // نافذة تبدأ حول الوحدة 3 (فهرس 2) ⇒ «عرض الوحدات التالية» متاح
    fireEvent.click(screen.getByRole('button', { name: /وحدة تالية/ }));
    const back = screen.getByRole('button', { name: /العودة إلى وحدتك الحالية/ });
    fireEvent.click(back);
    expect(screen.getByText('درس 3-1')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /العودة إلى وحدتك الحالية/ })).toBeNull();
  });

  it('لا تُطبَّق النافذة على مسار صغير (6 وحدات) فلا زر ترقيم ولا عودة', () => {
    const lessons = manyUnits()
      .filter(l => Number(l.slug.split('-')[0]!.slice(1)) <= 6)
      .map(l => ({ ...l }));
    render(<PathMap lessons={lessons} nextSlug="u1-l1" onOpenLesson={noop} onOpenReview={noop} />);
    expect(screen.queryByRole('button', { name: /وحدة تالية/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /العودة إلى وحدتك الحالية/ })).toBeNull();
  });

  it('الدرس التالي في وحدة بعيدة لا يُطوى: يظهر ضمن نافذة الطالب', () => {
    const lessons = manyUnits();
    // الطالب متقدم: الدرس التالي في الوحدة 9 ⇒ يجب أن تظهر وحدته ضمن النافذة
    render(<PathMap lessons={lessons} nextSlug="u9-l1" onOpenLesson={noop} onOpenReview={noop} />);
    expect(screen.getByText('درس 9-1')).toBeTruthy();
    expect(screen.getByText('وحدة 9')).toBeTruthy();
  });
});

describe('PathMap — سبب القفل والمتطلبات', () => {
  it('يعرض عنوان الدرس المطلوب لا المعرّف الإنجليزي', () => {
    const lessons = [
      lesson('prea1-abecedario', 'الأبجدية الإسبانية'),
      lesson('prea1-vocales', 'الحروف المتحركة', {
        is_unlocked: false,
        missing_prerequisites: ['prea1-abecedario'],
      }),
    ];
    render(
      <PathMap
        lessons={lessons}
        nextSlug="prea1-abecedario"
        titleBySlug={{ 'prea1-abecedario': 'الأبجدية الإسبانية' }}
        onOpenLesson={noop}
        onOpenReview={noop}
      />,
    );
    expect(screen.getByText(/يتطلب أولًا: الأبجدية الإسبانية/)).toBeTruthy();
  });

  it('الدرس المقفل لا يُفتح بالنقر ولا يعرض بطاقة «مقفل» فقط', () => {
    const lessons = [
      lesson('a', 'الأول'),
      lesson('b', 'الثاني', { is_unlocked: false, missing_prerequisites: ['a'] }),
    ];
    const onOpen = vi.fn();
    render(<PathMap lessons={lessons} nextSlug="a" titleBySlug={{ a: 'الأول' }} onOpenLesson={onOpen} onOpenReview={noop} />);
    const lockedBtn = screen.getByRole('button', { name: /الثاني/ }) as HTMLButtonElement;
    expect(lockedBtn.disabled).toBe(true);
    fireEvent.click(lockedBtn);
    expect(onOpen).not.toHaveBeenCalled();
  });
});

describe('groupUnits — تجميع الوحدات من بيانات الخادم', () => {
  it('يحافظ على ترتيب المنهج ويجمع الحالات', async () => {
    const { groupUnits } = await import('../src/web/components/PathMap');
    const units: PathUnit[] = groupUnits([
      lesson('a', 'أ', { unit_id: 'u1', progress_status: 'completed', best_accuracy: 92 }),
      lesson('b', 'ب', { unit_id: 'u1' }),
      lesson('c', 'ج', { unit_id: 'u2', is_unlocked: false }),
    ]);
    expect(units.map(u => u.id)).toEqual(['u1', 'u2']);
    expect(units[0]!.completed).toBe(1);
    expect(units[0]!.total).toBe(2);
    expect(units[0]!.locked).toBe(false); // فيه درس متاح
    expect(units[1]!.locked).toBe(true);
  });
});
