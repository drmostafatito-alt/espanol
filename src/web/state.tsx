import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, type ApiUser } from './api';

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
    // المسار المطابَق هو pathname فقط: سلسلة الاستعلام (مثل ?level= في
    // /learn?level=PREA1) تبقى في شريط العنوان لتقرأها الصفحة، ولا تدخل
    // في مطابقة المسارات — وإلا سقطت على NotFound.
    setPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);
  return [path, navigate];
}

/* ---------- جلسة المستخدم ---------- */
interface AuthValue {
  user: ApiUser | null;
  loading: boolean;
  setUser: (u: ApiUser | null) => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}
const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      setUser(null); // 401 = زائر، وليس خطأ يُعرض
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const signOut = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, loading, setUser, refresh, signOut }), [user, loading, refresh, signOut]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth خارج AuthProvider');
  return ctx;
}
