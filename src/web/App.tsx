import { useEffect, type ReactElement } from 'react';
import { AuthProvider, useAuth, useRoute } from './state';
import { Landing } from './pages/Landing';
import { Login, Signup } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Transparency, NotFound } from './pages/Misc';
import { Lesson } from './pages/Lesson';
import { Review } from './pages/Review';
import { ReviewPacks } from './pages/ReviewPacks';
import { Search } from './pages/Search';
import { Placement } from './pages/Placement';
import { PublicHeader } from './components/layout/PublicHeader';
import { PublicFooter } from './components/layout/PublicFooter';
import { AppShell } from './components/layout/AppShell';
import { ConnectionErrorScreen } from './components/ui';

function Shell() {
  const [path, navigate] = useRoute();
  const { user, loading, authError, sessionExpired, retryAuth, clearSessionExpired } = useAuth();

  // حماية المسارات: غير المسجّل يُوجَّه للدخول (بعد معرفة الحالة)
  const isProtected =
    path === '/settings' || path === '/learn' || path.startsWith('/learn/') ||
    path === '/review' || path.startsWith('/review/') || path === '/placement';
  useEffect(() => {
    if (!loading && !user && !authError && isProtected) {
      navigate('/login');
    }
  }, [loading, user, authError, isProtected, navigate]);

  // فشل الاتصال عند الإقلاع (لا نمسح الجلسة ولا نوجّه لدخول خاطئ)
  if (!loading && authError && !user) {
    return (
      <div className="app">
        <a className="skip-link" href="#main">تخطَّ إلى المحتوى</a>
        <main id="main" style={{ flex: 1 }}>
          <ConnectionErrorScreen message={authError} onRetry={() => void retryAuth()} />
        </main>
      </div>
    );
  }

  const lessonSlug = path.startsWith('/learn/') ? path.slice('/learn/'.length) : null;

  let page: ReactElement;
  if (lessonSlug && /^[a-z0-9-]{3,64}$/.test(lessonSlug)) {
    page = user ? <Lesson slug={lessonSlug} navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
  } else if (path === '/') {
    page = <Landing navigate={navigate} />;
  } else if (path === '/signup') {
    page = user ? <Dashboard navigate={navigate} /> : <Signup navigate={navigate} />;
  } else if (path === '/login') {
    page = user
      ? <Dashboard navigate={navigate} />
      : <Login navigate={navigate} sessionExpired={sessionExpired} onDismissNotice={clearSessionExpired} />;
  } else if (path === '/learn') {
    page = user ? <Dashboard navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
  } else if (path === '/placement') {
    page = user ? <Placement navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
  } else if (path === '/review') {
    page = user ? <Review navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
  } else if (path === '/review/packs') {
    page = user ? <ReviewPacks navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
  } else if (path === '/settings') {
    page = user ? <Settings navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
  } else if (path === '/search' || path.startsWith('/search')) {
    page = (
      <Search
        navigate={navigate}
        initialQuery={typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') ?? '' : ''}
      />
    );
  } else if (path === '/transparency') {
    page = <Transparency />;
  } else {
    page = <NotFound navigate={navigate} />;
  }

  // شاشات التركيز: الدرس والمراجعة وتحديد المستوى والمصادقة — بلا هيدر جانبي أو شريط سفلي
  const isFocus = !!lessonSlug || path === '/review' || path === '/placement' || path === '/login' || path === '/signup';
  // مناطق لوحة المتعلم (الهيكل الجانبي)
  const isAppArea =
    !!user && !isFocus &&
    (path === '/learn' || path === '/settings' || path === '/review/packs' || path.startsWith('/search'));

  return (
    <div className="app">
      <a className="skip-link" href="#main">تخطَّ إلى المحتوى</a>
      {isAppArea ? (
        <AppShell path={path} navigate={navigate}>{page}</AppShell>
      ) : isFocus ? (
        <main id="main" style={{ flex: 1 }}>{page}</main>
      ) : (
        <>
          <PublicHeader navigate={navigate} user={user} />
          <main id="main" style={{ flex: 1 }}>{page}</main>
          <PublicFooter navigate={navigate} />
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
