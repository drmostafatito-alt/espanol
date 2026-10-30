import { useEffect, lazy, Suspense, type ReactElement } from 'react';
import { AuthProvider, useAuth, useRoute } from './state';
import { Landing } from './pages/Landing';
/* لوحة «اليوم» تبقى في الحزمة الأساسية: تسجيل الدخول يهبط عليها مباشرة،
   وتقسيمها إلى حزمة كسولة أضاف طلبًا وسيطًا ورفع LCP من ~165ms إلى ~450ms. */
import { Dashboard } from './pages/Dashboard';
/* خريطة المسار أيضًا ثابتة: الصفحة الكسولة كانت تُعرض داخل Suspense بعد
   معرفة الجلسة، فقياس LCP على /path أعطى ~434ms مقابل ~167ms كصفحة ثابتة
   (نفس سبب رجوع لوحة اليوم للحزمة الأساسية). الحجم +6KB مضغوط فقط. */
import { Path } from './pages/Path';
import { PublicHeader } from './components/layout/PublicHeader';
import { PublicFooter } from './components/layout/PublicFooter';
import { AppShell } from './components/layout/AppShell';
import { ConnectionErrorScreen, LoadingState } from './components/ui';

/* تقسيم الحزم: صفحات لا يحتاجها أول رسم تُحمَّل عند الطلب فقط.
   الدرس أثقل صفحة في التطبيق، وكان يُنزَّل مع صفحة اليوم في كل زيارة. */
const loadAuth = () => import('./pages/Auth');
const loadLesson = () => import('./pages/Lesson');
const loadReview = () => import('./pages/Review');
const loadReviewPacks = () => import('./pages/ReviewPacks');
const loadPlacement = () => import('./pages/Placement');
const loadSettings = () => import('./pages/Settings');
const loadProfile = () => import('./pages/Profile');
const loadSearch = () => import('./pages/Search');
const loadMisc = () => import('./pages/Misc');

const Login = lazy(() => loadAuth().then(m => ({ default: m.Login })));
const Signup = lazy(() => loadAuth().then(m => ({ default: m.Signup })));
const ForgotPassword = lazy(() => loadAuth().then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => loadAuth().then(m => ({ default: m.ResetPassword })));
const VerifyEmail = lazy(() => loadAuth().then(m => ({ default: m.VerifyEmail })));
const Lesson = lazy(() => loadLesson().then(m => ({ default: m.Lesson })));
const Review = lazy(() => loadReview().then(m => ({ default: m.Review })));
const ReviewPacks = lazy(() => loadReviewPacks().then(m => ({ default: m.ReviewPacks })));
const Placement = lazy(() => loadPlacement().then(m => ({ default: m.Placement })));
const Settings = lazy(() => loadSettings().then(m => ({ default: m.Settings })));

const Profile = lazy(() => loadProfile().then(m => ({ default: m.Profile })));
const Search = lazy(() => loadSearch().then(m => ({ default: m.Search })));
const NotFound = lazy(() => loadMisc().then(m => ({ default: m.NotFound })));

/**
 * تنزيل حزمة الصفحة بالتوازي مع التحقق من الجلسة.
 * المشكلة المقيسة: الصفحات المحمية لا تُركَّب قبل وصول /api/me، فلا يبدأ تنزيل
 * حزمتها إلا بعده — طلبان متتاليان (RTT + RTT) على كل تحميل بارد.
 * التحميل المسبق هنا يبدأ الطلب فور معرفة المسار، ويُعاد استخدامه من lazy().
 */
function prefetchPage(path: string): void {
  const job =
    path === '/login' || path === '/signup' || path === '/forgot' || path === '/reset' || path === '/verify' ? loadAuth
    : path.startsWith('/learn/') ? loadLesson
    : path === '/review' ? loadReview
    : path === '/review/packs' ? loadReviewPacks
    : path === '/placement' ? loadPlacement
    : path === '/settings' ? loadSettings
    : path === '/profile' ? loadProfile
    : path.startsWith('/search') ? loadSearch
    : null;
  if (job) void job().catch(() => undefined); // فشل التحميل المسبق لا يمنع lazy() من إعادة المحاولة
}

const FALLBACK = <LoadingState text="جارٍ تحميل الصفحة…" />;

function Shell() {
  const [path, navigate] = useRoute();
  const { user, loading, authError, sessionExpired, retryAuth, clearSessionExpired } = useAuth();

  const isProtected =
    path === '/settings' || path === '/profile' || path === '/path' ||
    path === '/learn' || path.startsWith('/learn/') ||
    path === '/review' || path.startsWith('/review/') || path === '/placement';
  useEffect(() => {
    prefetchPage(path);
  }, [path]);

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
  } else if (path === '/forgot') {
    page = <ForgotPassword navigate={navigate} />;
  } else if (path === '/reset') {
    page = <ResetPassword navigate={navigate} />;
  } else if (path === '/verify') {
    page = <VerifyEmail navigate={navigate} />;
  } else if (path === '/login') {
    page = user
      ? <Dashboard navigate={navigate} />
      : <Login navigate={navigate} sessionExpired={sessionExpired} onDismissNotice={clearSessionExpired} />;
  } else if (path === '/learn') {
    page = user ? <Dashboard navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
  } else if (path === '/path') {
    page = user ? <Path navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
  } else if (path === '/profile') {
    page = user ? <Profile navigate={navigate} /> : <p className="container muted">جارٍ التحقق من الجلسة…</p>;
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
  } else {
    page = <NotFound navigate={navigate} />;
  }

  // شاشات التركيز: الدرس والمراجعة وتحديد المستوى والمصادقة — بلا هيدر جانبي أو شريط سفلي
  const isFocus =
    !!lessonSlug || path === '/review' || path === '/placement' || path === '/login' || path === '/signup' ||
    path === '/forgot' || path === '/reset' || path === '/verify';
  // مناطق لوحة المتعلم (الهيكل الجانبي)
  const isAppArea =
    !!user && !isFocus &&
    (path === '/learn' || path === '/settings' || path === '/profile' || path === '/path' ||
      path === '/review/packs' || path.startsWith('/search'));

  return (
    <div className="app">
      <a className="skip-link" href="#main">تخطَّ إلى المحتوى</a>
      {isAppArea ? (
        <AppShell path={path} navigate={navigate}>
          <Suspense fallback={FALLBACK}>{page}</Suspense>
        </AppShell>
      ) : isFocus ? (
        <main id="main" style={{ flex: 1 }}><Suspense fallback={FALLBACK}>{page}</Suspense></main>
      ) : (
        <>
          <PublicHeader navigate={navigate} user={user} />
          <main id="main" style={{ flex: 1 }}><Suspense fallback={FALLBACK}>{page}</Suspense></main>
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
