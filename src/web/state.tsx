import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api, ApiError, invalidateInFlightAuth, onUnauthorized, type ApiUser } from './api';
import { bindPendingQueue, clearPendingQueue } from './pages/Review';

/* ---------- التوجيه (بلا مكتبة: مسارات بسيطة + سجل المتصفح) ---------- */
export function useRoute(): [string, (to: string) => void] {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = useCallback((to: string) => {
    const nextPathname = (to.split('?')[0] ?? '').split('#')[0] || '/';
    if (to === window.location.pathname + window.location.search + window.location.hash) return;
    window.history.pushState({}, '', to);
    setPath(nextPathname);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);
  return [path, navigate];
}

/* ---------- جلسة المستخدم ---------- */
interface AuthValue {
  user: ApiUser | null;
  loading: boolean;
  /** فشل الاتصال بالخادم (شبكة/5xx) — يختلف عن عدم المصادقة */
  authError: string | null;
  /** انتهت الجلسة بعد أن كان المستخدم مسجلًا */
  sessionExpired: boolean;
  setUser: (u: ApiUser | null) => void;
  refresh: () => Promise<void>;
  retryAuth: () => Promise<void>;
  clearSessionExpired: () => void;
  signOut: () => Promise<void>;
}
const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  /**
   * جيل الطلبات: كل عملية مصادقة جديدة (إقلاع/دخول/خروج) تزيد الرقم.
   * أي استجابة قديمة تصل متأخرة (مثل /me الإقلاعي بعد نجاح الدخول على شبكة بطيئة)
   * تُتجاهل، فلا يمحو طلب 401 عالق هوية المستخدم الذي سجّل دخوله للتو.
   */
  const seqRef = useRef(0);

  const refresh = useCallback(async () => {
    const seq = ++seqRef.current;
    invalidateInFlightAuth();
    setLoading(true);
    try {
      // صامت تجاه المعالج المركزي: 401 الإقلاع يُعالَج هنا مع حارس الجيل
      const { user: current } = await api.me({ silentUnauth: true });
      if (seq !== seqRef.current) return; // عملية أحدث سبقت هذه الاستجابة
      setUser(current);
      setAuthError(null);
      setSessionExpired(false);
    } catch (err) {
      if (seq !== seqRef.current) return;
      if (err instanceof ApiError && err.isUnauthorized()) {
        // 401 حقيقي: زائر أو جلسة منتهية. لا نعرض هذا كخطأ اتصال.
        setUser(null);
        setAuthError(null);
      } else {
        // فشل شبكة/خادم: لا نمحو هوية المستخدم إن كانت معروفة، ولا نعامله كتسجيل خروج
        const message = err instanceof ApiError ? err.message : 'تعذّر الاتصال بالخادم.';
        setAuthError(message);
      }
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, []);

  // AUD-14: قائمة المراجعة المعلّقة مربوطة بهوية صاحبها وتُمسح عند الخروج
  useEffect(() => {
    if (user) bindPendingQueue(user.id);
    else { clearPendingQueue(); bindPendingQueue(null); }
  }, [user]);

  useEffect(() => {
    void refresh();
    // انتهاء الجلسة أثناء الاستخدام (401 من طلب ثانوي): معالجة مركزية واحدة.
    // طلب /me الإقلاعي صامت عمدًا حتى لا يطرد مستخدمًا دخل للتو.
    const off = onUnauthorized(() => {
      setUser(prev => {
        if (prev) setSessionExpired(true);
        return null;
      });
    });
    return off;
  }, [refresh]);

  const signOut = useCallback(async () => {
    seqRef.current++; // تُلغى أي استجابة مصادقة عالقة
    invalidateInFlightAuth(); // ولا يطرد رد 401 قديم حالة ما بعد الخروج
    try {
      await api.logout();
    } catch {
      /* حتى لو فشل الطلب، نمسح الحالة المحلية */
    } finally {
      setUser(null);
      setSessionExpired(false);
      setAuthError(null);
      setLoading(false);
    }
  }, []);

  const applyUser = useCallback((u: ApiUser | null) => {
    // دخول/تسجيل ناجح: يُبطل كل طلبات /me العالقة فورًا
    seqRef.current++;
    invalidateInFlightAuth();
    setLoading(false);
    setUser(u);
    if (u) {
      setAuthError(null);
      setSessionExpired(false);
    }
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      authError,
      sessionExpired,
      setUser: applyUser,
      refresh,
      retryAuth: refresh,
      clearSessionExpired: () => setSessionExpired(false),
      signOut,
    }),
    [user, loading, authError, sessionExpired, applyUser, refresh, signOut],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth خارج AuthProvider');
  return ctx;
}

/** نسخة آمنة من useAuth للصفحات العامة التي قد تُرسَم بلا مزوّد (اختبارات/تضمين):
 *  تعيد null بدل الرمي، فيُعرض الهيرو بحالة «غير مسجَّل». */
export function useAuthOptional(): AuthValue | null {
  return useContext(AuthCtx);
}
