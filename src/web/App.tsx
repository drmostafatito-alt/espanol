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
import { Icon } from './components/ui';

function Shell() {
  const [path, navigate] = useRoute();
  const { user, loading, signOut } = useAuth();

  // حماية المسارات: غير المسجّل يُوجَّه للدخول (بعد معرفة الحالة)
  const isProtected =
    path === '/settings' || path === '/learn' || path.startsWith('/learn/') || path === '/review' || path.startsWith('/review/') || path === '/placement';
  useEffect(() => {
    if (!loading && !user && isProtected) {
      navigate('/login');
    }
  }, [loading, user, isProtected, navigate]);

  const lessonSlug = path.startsWith('/learn/') ? path.slice('/learn/'.length) : null;

  let page: ReactElement;
  if (lessonSlug && /^[a-z0-9-]{3,64}$/.test(lessonSlug)) {
    page = user ? <Lesson slug={lessonSlug} navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
  } else if (path === '/') {
    page = <Landing navigate={navigate} />;
  } else if (path === '/signup') {
    page = user ? <Dashboard navigate={navigate} /> : <Signup navigate={navigate} />;
  } else if (path === '/login') {
    page = user ? <Dashboard navigate={navigate} /> : <Login navigate={navigate} />;
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
    page = <Search navigate={navigate} initialQuery={typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('q') ?? '') : ''} />;
  } else if (path === '/transparency') {
    page = <Transparency />;
  } else {
    page = <NotFound navigate={navigate} />;
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main">تخطَّ إلى المحتوى</a>
      <header className="topbar">
        <a className="brand" href="/" onClick={e => { e.preventDefault(); navigate(user ? '/learn' : '/'); }}>
          <span className="brand-mark" aria-hidden="true">Ñ</span>
          <span>
            <span style={{ display: 'block', lineHeight: 1.25 }}>Español بالعربي</span>
            <span className="brand-sub">من الصفر حتى C1 · بالمواقف الحقيقية</span>
          </span>
        </a>
        <span className="spacer" />
        <nav className="nav-links" aria-label="التنقل الرئيسي">
          <a href="/search" className="btn ghost sm" data-testid="nav-search" onClick={e => { e.preventDefault(); navigate('/search'); }}><Icon name="search" size={17} /> بحث</a>
          {user ? (
            <>
              <a href="/learn" className="btn ghost sm" onClick={e => { e.preventDefault(); navigate('/learn'); }}>لوحتي</a>
              <a href="/review" className="btn ghost sm" onClick={e => { e.preventDefault(); navigate('/review'); }}>مراجعة</a>
              <button className="btn secondary sm" onClick={() => void signOut()}><Icon name="logout" size={16} /> خروج</button>
            </>
          ) : (
            <>
              <a href="/transparency" className="btn ghost sm" onClick={e => { e.preventDefault(); navigate('/transparency'); }}>الشفافية</a>
              <a href="/login" className="btn secondary sm" onClick={e => { e.preventDefault(); navigate('/login'); }}>دخول</a>
              <a href="/signup" className="btn sm" onClick={e => { e.preventDefault(); navigate('/signup'); }}>حساب جديد</a>
            </>
          )}
        </nav>
      </header>

      <main id="main" style={{ flex: 1 }}>{page}</main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="brand" href="/" onClick={e => { e.preventDefault(); navigate(user ? '/learn' : '/'); }}>
                <span className="brand-mark" aria-hidden="true">Ñ</span>
                <span>Español بالعربي</span>
              </a>
              <p style={{ marginTop: 'var(--s-3)', maxWidth: '46ch' }}>
                منصة عربية لتعلّم الإسبانية من التمهيد حتى C1 — بالمواقف الحقيقية،
                والاستماع، والمراجعة المتباعدة.
              </p>
            </div>
            <div>
              <h4>التعلّم</h4>
              <ul>
                <li><a href="/learn" onClick={e => { e.preventDefault(); navigate('/learn'); }}>لوحة المتعلم</a></li>
                <li><a href="/review" onClick={e => { e.preventDefault(); navigate('/review'); }}>المراجعة المتباعدة</a></li>
                <li><a href="/search" onClick={e => { e.preventDefault(); navigate('/search'); }}>البحث في المحتوى</a></li>
              </ul>
            </div>
            <div>
              <h4>المنصة</h4>
              <ul>
                <li><a href="/transparency" onClick={e => { e.preventDefault(); navigate('/transparency'); }}>الشفافية والحدود</a></li>
                <li><a href="/login" onClick={e => { e.preventDefault(); navigate('/login'); }}>تسجيل الدخول</a></li>
                <li><a href="/signup" onClick={e => { e.preventDefault(); navigate('/signup'); }}>إنشاء حساب</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Español بالعربي</span>
            <span>المحتوى يُراجع باستمرار؛ الحدود معلنة في صفحة الشفافية.</span>
          </div>
        </div>
      </footer>
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
