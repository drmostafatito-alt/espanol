// @vitest-environment jsdom
/**
 * اختبارات واجهة الهوية البصرية الجديدة:
 * الصفحة الرئيسية ولوحة المتعلم تُرسَمان ببيانات حقيقية الشكل (عبر api مطابق للعقد)
 * دون أي قيم ثابتة، مع الحفاظ على معرّفات الاختبار التي تعتمد عليها اختبارات e2e.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../src/web/state';
import { Landing } from '../src/web/pages/Landing';
import { Dashboard } from '../src/web/pages/Dashboard';

vi.mock('../src/web/api', () => {
  const user = {
    id: 'u1',
    email: 'learner@example.com',
    displayName: 'مصطفى',
    role: 'learner',
    explanationStyle: 'fusha_eg' as const,
    audioVariant: 'es-ES' as const,
    dailyGoalMinutes: 10,
    permissions: [],
  };
  const progressPayload = {
    stats: {
      xp_total: 120,
      minutes_total: 35,
      streak_current: 4,
      streak_longest: 4,
      reviews_done: 0,
      words_seen: 12,
      words_stable: 3,
    },
    totals: { lessons_total: 3, lessons_completed: 1 },
    contentProvenance: null,
    nextLesson: {
      slug: 'prea1-como-estas',
      title_ar: 'التحيات والتعارف',
      level_code: 'PREA1',
      unit_title_ar: 'أول كلماتك',
      program_title_ar: 'المسار الأساسي',
    },
    lessons: [
      {
        slug: 'prea1-hola-me-llamo', title_ar: 'مرحبًا، اسمي', level_code: 'PREA1',
        status: 'published', progress_status: 'completed', best_accuracy: 100, completed_at: '2026-10-20',
        unit_id: 'u1', unit_slug: 'prea1-u3', unit_title_ar: 'أول كلماتك',
        program_slug: 'main-track', program_title_ar: 'المسار الأساسي', program_kind: 'main',
        is_unlocked: true, missing_prerequisites: [],
      },
      {
        slug: 'prea1-como-estas', title_ar: 'التحيات والتعارف', level_code: 'PREA1',
        status: 'published', progress_status: 'in_progress', best_accuracy: 0, completed_at: null,
        unit_id: 'u1', unit_slug: 'prea1-u3', unit_title_ar: 'أول كلماتك',
        program_slug: 'main-track', program_title_ar: 'المسار الأساسي', program_kind: 'main',
        is_unlocked: true, missing_prerequisites: [],
      },
      {
        slug: 'a1-cafe', title_ar: 'قهوة من فضلك', level_code: 'A1',
        status: 'published', progress_status: 'not_started', best_accuracy: 0, completed_at: null,
        unit_id: 'u2', unit_slug: 'a1-u4', unit_title_ar: 'الطعام والشراب',
        program_slug: 'main-track', program_title_ar: 'المسار الأساسي', program_kind: 'main',
        is_unlocked: false, missing_prerequisites: ['prea1-como-estas'],
      },
    ],
  };
  return {
    ApiError: class ApiError extends Error {
      constructor(public status: number, public code: string, messageAr: string) {
        super(messageAr);
      }
    },
    api: {
      me: vi.fn(async () => ({ user })),
      logout: vi.fn(async () => ({ ok: true })),
      paths: vi.fn(async () => ({
        paths: [
          { slug: 'main-track', title_ar: 'المسار الأساسي (من الصفر إلى C1)', kind: 'main', level_code: null, units_count: 5, lessons_count: 2 },
          { slug: 'callcenter', title_ar: 'مسار الكول سنتر', kind: 'path', level_code: 'B1', units_count: 8, lessons_count: 1 },
          { slug: 'top1000', title_ar: 'أهم 1000 كلمة', kind: 'path', level_code: 'A1', units_count: 1, lessons_count: 0 },
        ],
      })),
      progress: vi.fn(async () => progressPayload),
      reviewSession: vi.fn(async () => ({
        cards: [],
        session: {
          dueNow: 0, totalCards: 0, suspended: 0, reviewedToday: 0,
          limits: { newPerDay: 20, reviewsPerDay: 100 }, newRemaining: 20, reviewsRemaining: 100, dayBoundary: '',
        },
        emptyReason: 'NOTHING_DUE',
      })),
    },
  };
});

beforeEach(() => {
  window.history.pushState({}, '', '/learn');
});

afterEach(() => cleanup());

describe('الصفحة الرئيسية (الهوية الجديدة)', () => {
  it('تعرض الهيرو الواقعي وبطاقات الموضوعات وأزرارًا حقيقية', () => {
    const navigate = vi.fn();
    render(<Landing navigate={navigate} />);
    expect(screen.getByText(/تعلّم الإسبانية/)).toBeTruthy();
    expect(screen.getByText(/بطريقة/)).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /ابدأ رحلتك الآن/ }).length).toBe(2);
    expect(screen.getByRole('button', { name: 'استكشف المنهج' })).toBeTruthy();
    for (const t of ['السفر', 'المطاعم والطعام', 'العمل والكول سنتر', 'الحياة اليومية']) {
      expect(screen.getByText(t)).toBeTruthy();
    }
    // الصورة الواقعية للهيرو موجودة بوصف بديل وصفي
    const heroImg = document.querySelector('.hero-media img') as HTMLImageElement;
    expect(heroImg).toBeTruthy();
    expect(heroImg.alt).toContain('إشبيلية');
    expect(heroImg.src).toContain('/img/hero-spain.jpg');
  });
});

describe('لوحة المتعلم (الهوية الجديدة)', () => {
  it('تعرض إحصائيات حقيقية ومسار العقد والمسارات وكل المعرّفات المحمية', async () => {
    const navigate = vi.fn();
    render(
      <AuthProvider>
        <Dashboard navigate={navigate} />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('next-step-hero')).toBeTruthy());

    // الترحيب باسم المستخدم الحقيقي لا اسم ثابت
    expect(screen.getByText(/مرحبًا يا مصطفى/)).toBeTruthy();

    // إحصائيات من الحمولة نفسها
    expect(document.querySelector('[data-testid="stat-xp"] .num')?.textContent).toBe('120');
    expect(document.querySelector('[data-testid="stat-lessons"] .num')?.textContent).toBe('1/3');
    expect(screen.getByText('إجمالي XP')).toBeTruthy();
    expect(screen.getByText('دروس مكتملة')).toBeTruthy();

    // بطاقة الدرس التالي وزرها (العنوان يتكرر في قائمة المسار أيضًا)
    expect(screen.getByTestId('next-lesson-btn')).toBeTruthy();
    expect(screen.getAllByText('التحيات والتعارف').length).toBeGreaterThan(0);

    // دعوة التحديد والمراجعة
    expect(screen.getByTestId('placement-cta')).toBeTruthy();
    expect(screen.getByTestId('review-cta')).toBeTruthy();
    expect(screen.getByTestId('review-start')).toBeTruthy();

    // تبويبات بأسمائها الدقيقة (تعتمد عليها e2e)
    expect(screen.getByRole('tab', { name: 'التمهيد Pre-A1' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'مستوى A1' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'مسار السفر' })).toBeTruthy();

    // عقد مسار التعلم: مكتمل/حالي/مقفل
    const nodes = document.querySelectorAll('.path-node');
    expect(nodes.length).toBe(3);
    expect(document.querySelectorAll('.path-node.done').length).toBe(1);
    expect(document.querySelectorAll('.path-node.current').length).toBe(1);
    expect(document.querySelectorAll('.path-node.locked').length).toBe(1);
    const lockedBtn = document.querySelector('.path-node.locked') as HTMLButtonElement;
    expect(lockedBtn.disabled).toBe(true);

    // المسارات المتخصصة من البيانات الحقيقية
    expect(screen.getByText('مسار الكول سنتر')).toBeTruthy();
    expect(screen.getByText('أهم 1000 كلمة')).toBeTruthy();
  });

  it('حالة التحميل لا تكشف قيمًا غير معرفة', () => {
    render(
      <AuthProvider>
        <Dashboard navigate={vi.fn()} />
      </AuthProvider>,
    );
    expect(document.body.textContent).not.toMatch(/undefined|NaN/);
  });
});
