import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, ApiError, onUnauthorized, type ApiUser } from './api';

/* ---------- التوجيه (بلا مكتبة: مسارات بسيطة + سجل المتصفح) ---------- */
export function useRoute(): [string, (to: string) => void] {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, '', to);
    setPath(to);
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

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { user: current } = await api.me();
      setUser(current);
      setAuthError(null);
      setSessionExpired(false);
    } catch (err) {
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    // انتهاء الجلسة أثناء الاستخدام (401 من أي طلب): معالجة مركزية واحدة
    const off = onUnauthorized(() => {
      setUser(prev => {
        if (prev) setSessionExpired(true);
        return null;
      });
    });
    return off;
  }, [refresh]);

  const signOut = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      /* حتى لو فشل الطلب، نمسح الحالة المحلية */
    } finally {
      setUser(null);
      setSessionExpired(false);
      setAuthError(null);
    }
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      authError,
      sessionExpired,
      setUser: (u: ApiUser | null) => {
        setUser(u);
        if (u) {
          setAuthError(null);
          setSessionExpired(false);
        }
      },
      refresh,
      retryAuth: refresh,
      clearSessionExpired: () => setSessionExpired(false),
      signOut,
    }),
    [user, loading, authError, sessionExpired, refresh, signOut],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth خارج AuthProvider');
  return ctx;
}
