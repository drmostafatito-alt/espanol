import { useState, type FormEvent } from 'react';
import { api, ApiError } from '../api';
import { useAuth } from '../state';
import { Icon, SectionHead } from '../components/ui';

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
    <div className="container narrow">
      <SectionHead
        kicker="Español بالعربي"
        title="إنشاء حساب"
        desc="نطلب البريد لأتمكن من استعادة حسابك لاحقًا. لا نرسل رسائل تسويقية، ولا نشارك بريدك مع أي جهة إعلانية."
      />
      <form className="card stack" onSubmit={onSubmit} noValidate>
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
        <button className="btn block" type="submit" disabled={busy}>{busy ? 'جارٍ إنشاء الحساب…' : (<><Icon name="lock" size={17} /> إنشاء الحساب</>)}</button>
        <p className="small muted">
          لديك حساب؟ <a href="/login" onClick={e => { e.preventDefault(); navigate('/login'); }}>سجّل الدخول</a>
        </p>
      </form>
    </div>
  );
}

export function Login({ navigate }: { navigate: (to: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { busy, error, submit } = useAuthForm(() => navigate('/learn'));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit(() => api.login(email, password));
  };

  return (
    <div className="container narrow">
      <SectionHead
        kicker="Español بالعربي"
        title="تسجيل الدخول"
        desc="ادخل ببريدك وكلمة مرورك للوصول إلى لوحتك ومراجعتك."
      />
      <form className="card stack" onSubmit={onSubmit} noValidate>
        <ErrorBox error={error} />
        <label className="field">
          <span>البريد الإلكتروني</span>
          <input className="ltr" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="field">
          <span>كلمة المرور</span>
          <input className="ltr" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        <button className="btn block" type="submit" disabled={busy}>{busy ? 'جارٍ الدخول…' : (<><Icon name="lock" size={17} /> دخول</>)}</button>
        <p className="small muted">
          نسيت كلمة المرور؟ <strong>غير مفعّل حاليًا</strong> — لم يُعِد المالك مزوّد بريد بعد، ولا ندّعي أنه يعمل.
        </p>
        <p className="small muted">
          لا تملك حسابًا؟ <a href="/signup" onClick={e => { e.preventDefault(); navigate('/signup'); }}>أنشئ حسابًا</a>
        </p>
      </form>
    </div>
  );
}
