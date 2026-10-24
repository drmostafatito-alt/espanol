import { useState, type FormEvent } from 'react';
import { api, ApiError } from '../api';
import { useAuth } from '../state';
import { BrandMark, Icon } from '../components/icons';

function useAuthForm(onDone: () => void) {
  const { setUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ message: string; problems?: string[] } | null>(null);

  async function submit(fn: () => Promise<{ user: Parameters<typeof setUser>[0] }>) {
    setBusy(true);
    setError(null);
    try {
      const { user } = await fn();
      setUser(user);
      onDone();
    } catch (e) {
      if (e instanceof ApiError) {
        const d = e.details as { problems?: string[] } | undefined;
        setError({ message: e.message, problems: d?.problems });
      } else {
        setError({ message: 'تعذّر الاتصال بالخادم. تحقق من الشبكة ثم أعد المحاولة.' });
      }
    } finally {
      setBusy(false);
    }
  }

  return { busy, error, submit };
}

function ErrorBox({ error }: { error: { message: string; problems?: string[] } | null }) {
  if (!error) return null;
  return (
    <div className="alert" role="alert">
      {error.message}
      {error.problems?.length ? (
        <ul>{error.problems.map(p => <li key={p} className="small">{p}</li>)}</ul>
      ) : null}
    </div>
  );
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="container" style={{ paddingBlock: 'var(--s-6)' }}>
      <div className="auth-wrap">
        <div className="auth-logo">
          <span className="brand-mark" style={{ width: 52, height: 52, borderRadius: 16 }}>
            <BrandMark size={42} />
          </span>
        </div>
        <div className="auth-title">
          <h1 style={{ marginBottom: 6 }}>{title}</h1>
          <p className="muted small" style={{ margin: 0 }}>{subtitle}</p>
        </div>
        <div className="card auth-card">{children}</div>
      </div>
    </div>
  );
}

export function Signup({ navigate }: { navigate: (to: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { busy, error, submit } = useAuthForm(() => navigate('/learn'));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit(() => api.signup(email, password, displayName || undefined));
  };

  return (
    <AuthShell title="إنشاء حساب جديد" subtitle="ابدأ رحلتك في الإسبانية خلال دقيقة — بدون رسائل تسويقية.">
      <form className="stack" onSubmit={onSubmit} noValidate>
        <ErrorBox error={error} />
        <label className="field">
          <span>الاسم الذي تحب أن نناديك به (اختياري)</span>
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} autoComplete="nickname" maxLength={80} />
        </label>
        <label className="field">
          <span>البريد الإلكتروني</span>
          <input className="ltr" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="field">
          <span>كلمة المرور</span>
          <input className="ltr" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required />
          <span className="small muted">10 أحرف على الأقل، وتحتوي حرفًا ورقمًا.</span>
        </label>
        <button className="btn block" type="submit" disabled={busy}>
          {busy ? 'جارٍ إنشاء الحساب…' : 'إنشاء الحساب'}
        </button>
        <p className="small muted" style={{ textAlign: 'center' }}>
          لديك حساب؟{' '}
          <a href="/login" onClick={e => { e.preventDefault(); navigate('/login'); }}>سجّل الدخول</a>
        </p>
      </form>
    </AuthShell>
  );
}

export function Login({
  navigate,
  sessionExpired = false,
  onDismissNotice,
}: {
  navigate: (to: string) => void;
  sessionExpired?: boolean;
  onDismissNotice?: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { busy, error, submit } = useAuthForm(() => navigate('/learn'));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit(() => api.login(email, password));
  };

  return (
    <AuthShell title="تسجيل الدخول" subtitle="أهلًا بعودتك — تابع من حيث توقفت.">
      <form className="stack" onSubmit={onSubmit} noValidate>
        {sessionExpired && (
          <div className="alert info" role="status" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--s-2)' }}>
            <span>انتهت جلستك أو انقطعت. سجّل الدخول من جديد لمتابعة تقدمك المحفوظ.</span>
            {onDismissNotice && (
              <button type="button" className="btn ghost icon-btn" aria-label="إغلاق التنبيه" onClick={onDismissNotice} style={{ minHeight: 32, minWidth: 32 }}>
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        )}
        <ErrorBox error={error} />
        <label className="field">
          <span>البريد الإلكتروني</span>
          <div style={{ position: 'relative' }}>
            <Icon name="mail" size={18} style={{ position: 'absolute', insetInlineStart: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            <input className="ltr" style={{ paddingInlineStart: 44 }} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
          </div>
        </label>
        <label className="field">
          <span>كلمة المرور</span>
          <div style={{ position: 'relative' }}>
            <Icon name="key" size={18} style={{ position: 'absolute', insetInlineStart: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            <input className="ltr" style={{ paddingInlineStart: 44 }} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
        </label>
        <button className="btn navy block" type="submit" disabled={busy}>{busy ? 'جارٍ الدخول…' : 'دخول'}</button>
        <p className="small muted" style={{ textAlign: 'center', marginBottom: 0 }}>
          نسيت كلمة المرور؟ <strong>غير مفعّل حاليًا</strong> — لم يُعِد المالك مزوّد بريد بعد، ولا ندّعي أنه يعمل.
        </p>
        <p className="small muted" style={{ textAlign: 'center' }}>
          لا تملك حسابًا؟{' '}
          <a href="/signup" onClick={e => { e.preventDefault(); navigate('/signup'); }}>أنشئ حسابًا</a>
        </p>
      </form>
    </AuthShell>
  );
}
