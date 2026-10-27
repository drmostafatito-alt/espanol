// @vitest-environment jsdom
/**
 * تحذير مصدر المحتوى في صفحة البحث: عندما يعيد الخادم نتائج تتضمن مسودات
 * مسموحًا بها (contentProvenance = unreviewed_sample) يجب أن يرى المستخدم
 * تنبيهًا صريحًا بأنها مسودات غير مراجَعة — وإلا عُرضت المسودات كمحتوى عادي.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { api } from '../src/web/api';
import { Search } from '../src/web/pages/Search';
import { AuthProvider } from '../src/web/state';
import type { SearchResponse } from '../src/shared/search-engine';

const RESULT = {
  id: 'vocab-1',
  kind: 'vocab',
  title: 'rigor',
  titleEs: 'rigor',
  titleAr: 'صرامة',
  badgeAr: 'مفردة',
  level: 'C1',
  score: 100,
  matchReasonAr: 'تطابق تام',
};

function responseWith(provenance: string | undefined): SearchResponse {
  return {
    query: 'rigor',
    total: 1,
    results: [RESULT as never],
    executionMs: 1,
    ...(provenance ? { contentProvenance: provenance } : {}),
  };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('تحذير المسودات في البحث', () => {
  it('يُظهر تنبيه «محتوى غير مراجَع» عندما ترد contentProvenance', async () => {
    vi.spyOn(api, 'search').mockResolvedValue(responseWith('unreviewed_sample'));
    render(
      <AuthProvider>
        <Search navigate={() => {}} initialQuery="rigor" />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('search-provenance-warning')).toBeTruthy());
    expect(screen.getByTestId('search-provenance-warning').textContent).toContain('غير مراجَع');
  });

  it('لا يُظهر التنبيه عندما لا ترد contentProvenance', async () => {
    vi.spyOn(api, 'search').mockResolvedValue(responseWith(undefined));
    render(
      <AuthProvider>
        <Search navigate={() => {}} initialQuery="rigor" />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByText('تم العثور على 1 نتيجة')).toBeTruthy());
    expect(screen.queryByTestId('search-provenance-warning')).toBeNull();
  });
});
