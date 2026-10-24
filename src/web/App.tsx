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

  // شريط سفلي للجوال — وجهات المتعلم فقط؛ شاشات التركيز (/learn/:slug و/placement) مستثناة عمدًا
  const showBottomNav = !!user && ['/learn', '/review', '/review/packs', '/search', '/settings'].includes(path);
  const bottomNavActive =
    path === '/learn' ? 'home'
    : path === '/review' || path === '/review/packs' ? 'review'
    : path === '/search' ? 'search'
    : path === '/settings' ? 'settings'
    : '';

  return (
    <div className={`app${showBottomNav ? ' has-bottom-nav' : ''}`}>
      <a className="skip-link" href="#main">تخطَّ إلى المحتوى</a>
      <header className="topbar">
        <a className="brand" href="/" onClick={e => { e.preventDefault(); navigate(user ? '/learn' : '/'); }}>
          <span className="brand-mark" aria-hidden="true"><Icon name="sun" size={22} /></span>
          <span>
            <span style={{ display: 'block', lineHeight: 1.25 }}><span className="brand-name">Español</span> <span className="brand-name brand-ar">بالعربي</span></span>
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
              <a href="/login" className="btn secondary sm" onClick={e => { e.preventDefault(); navigate('/login'); }}>تسجيل الدخول</a>
              <a href="/signup" className="btn sm" onClick={e => { e.preventDefault(); navigate('/signup'); }}>ابدأ الآن</a>
            </>
          )}
        </nav>
      </header>

      <main id="main" style={{ flex: 1 }}>{page}</main>

      {/* شريط تنقل سفلي للجوال — لوحة المتعلم فقط، وجهات موجودة أصلًا */}
      {showBottomNav && (
        <nav className="bottom-nav" aria-label="تنقل لوحة المتعلم">
          <button className={`bottom-nav-item${bottomNavActive === 'home' ? ' active' : ''}`} aria-current={bottomNavActive === 'home' ? 'page' : undefined} onClick={() => navigate('/learn')}>
            <span className="bottom-nav-icon"><Icon name="home" size={19} /></span>
            الرئيسية
          </button>
          <button className={`bottom-nav-item${bottomNavActive === 'review' ? ' active' : ''}`} aria-current={bottomNavActive === 'review' ? 'page' : undefined} onClick={() => navigate('/review')}>
            <span className="bottom-nav-icon"><Icon name="target" size={19} /></span>
            المراجعة
          </button>
          <button className={`bottom-nav-item${bottomNavActive === 'search' ? ' active' : ''}`} aria-current={bottomNavActive === 'search' ? 'page' : undefined} onClick={() => navigate('/search')}>
            <span className="bottom-nav-icon"><Icon name="search" size={19} /></span>
            البحث
          </button>
          <button className={`bottom-nav-item${bottomNavActive === 'settings' ? ' active' : ''}`} aria-current={bottomNavActive === 'settings' ? 'page' : undefined} onClick={() => navigate('/settings')}>
            <span className="bottom-nav-icon"><Icon name="settings" size={19} /></span>
            الإعدادات
          </button>
        </nav>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="brand" href="/" onClick={e => { e.preventDefault(); navigate(user ? '/learn' : '/'); }}>
                <span className="brand-mark" aria-hidden="true"><Icon name="sun" size={22} /></span>
                <span><span className="brand-name">Español</span> <span className="brand-name brand-ar">بالعربي</span></span>
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
