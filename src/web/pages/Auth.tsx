import { useState, type FormEvent, type ReactNode } from 'react';
import { api, ApiError } from '../api';
import { useAuth } from '../state';
import { BrandMark, Icon } from '../components/icons';

interface FormError {
  message: string;
  problems?: string[];
  retryAfterSeconds?: number;
}

function useAuthForm(onDone: () => void) {
  const { setUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  async function submit(fn: () => Promise<{ user: Parameters<typeof setUser>[0] }>) {
    setBusy(true);
    setError(null);
    try {
      const { user } = await fn();
      // نجاح POST لا يثبت أن المتصفح حفظ كوكي الجلسة (إطار معاينة، كوكيز محظورة،
      // بروكسي يرفض Secure على http...). نتحقق فعليًا من الجلسة قبل التوجيه،
      // بدل إرسال المستخدم إلى اللوحة ثم ارتداده بصمت إلى صفحة الدخول.
      let confirmed = user;
      try {
        confirmed = (await api.me({ silentUnauth: true })).user;
      } catch (e) {
        if (e instanceof ApiError && e.isUnauthorized()) {
          const embedded = typeof window !== 'undefined' && window.self !== window.top;
          setError({
            message: embedded
              ? 'تم التحقق من بياناتك، لكن معاينة الموقع داخل إطار منعت المتصفح من حفظ جلسة الدخول.'
              : 'تم التحقق من بياناتك، لكن المتصفح لم يحفظ جلسة الدخول.',
            problems: embedded
              ? ['افتح الموقع في تبويب مستقل ثم سجّل الدخول من هناك — ستبقى جلستك محفوظة.']
              : [
                  'اسمح بالكوكيز لهذا الموقع في إعدادات المتصفح، أو جرّب نافذة عادية بدل التصفح الخاص.',
                  'لم يُفقد حسابك ولا بياناتك — المشكلة في حفظ الجلسة على هذا الجهاز فقط.',
                ],
          });
          return; // لا توجيه: نبقى في النموذج مع سبب واضح
        }
        // تعذّر التأكيد لسبب شبكي/خادمي عابر: لا نمنع الدخول، والطلب التالي يكشف الحالة.
      }
      setUser(confirmed);
      onDone();
    } catch (e) {
      if (e instanceof ApiError) {
        const d = e.details as { problems?: string[]; retryAfterSeconds?: number } | undefined;
        setError({ message: e.message, problems: d?.problems, retryAfterSeconds: d?.retryAfterSeconds });
      } else {
        setError({ message: 'تعذّر الاتصال بالخادم. تحقق من الشبكة ثم أعد المحاولة.' });
      }
    } finally {
      setBusy(false);
    }
  }

  return { busy, error, submit };
}

function ErrorBox({ error }: { error: FormError | null }) {
  if (!error) return null;
  return (
    <div className="alert" role="alert">
      <div className="row" style={{ gap: 'var(--s-2)', alignItems: 'flex-start' }}>
        <Icon name="warning" size={18} style={{ flex: '0 0 auto', marginTop: 3, color: 'var(--color-danger)' }} />
        <div>
          <strong style={{ display: 'block' }}>{error.message}</strong>
          {typeof error.retryAfterSeconds === 'number' && (
            <span className="small muted">انتظر نحو {Math.max(1, Math.round(error.retryAfterSeconds))} ثانية قبل المحاولة التالية.</span>
          )}
          {error.problems?.length ? (
            <ul style={{ marginBottom: 0 }}>{error.problems.map(p => <li key={p} className="small">{p}</li>)}</ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* بطاقة مركزة متوازنة — بلا فوتر يدفع النموذج لأسفل على الموبايل */
function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="auth-page">
      <div className="auth-card-wrap">
        <div className="auth-card-head">
          <span className="brand-mark" style={{ width: 52, height: 52, borderRadius: 16 }}>
            <BrandMark size={42} />
          </span>
          <h1>{title}</h1>
          <p className="muted small">{subtitle}</p>
        </div>
        <div className="card auth-card">{children}</div>
      </div>
    </div>
  );
}

function PasswordField({ value, onChange, autoComplete, minLength }: { value: string; onChange: (v: string) => void; autoComplete: string; minLength?: number }) {
  const [show, setShow] = useState(false);
  return (
    <label className="field">
      <span>كلمة المرور</span>
      <div style={{ position: 'relative' }}>
        <Icon name="key" size={18} style={{ position: 'absolute', insetInlineStart: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
        <input
          className="ltr"
          style={{ paddingInlineStart: 44, paddingInlineEnd: 52 }}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          minLength={minLength}
        />
        <button
          type="button"
          className="btn ghost icon-btn password-toggle"
          aria-label={show ? 'أخفِ كلمة المرور' : 'أظهِر كلمة المرور'}
          aria-pressed={show}
          onClick={() => setShow(s => !s)}
        >
          <Icon name={show ? 'eye-off' : 'eye'} size={18} />
        </button>
      </div>
    </label>
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
    <AuthLayout title="إنشاء حساب جديد" subtitle="ابدأ رحلتك في الإسبانية خلال دقيقة.">
      <form className="stack" onSubmit={onSubmit} noValidate>
        <p className="muted small">
          نطلب البريد لتعريف حسابك وحفظ تقدمك فيه. لا نرسل رسائل تسويقية، ولا نشارك بريدك مع أي جهة إعلانية.
        </p>
        <ErrorBox error={error} />
        <label className="field">
          <span>الاسم الذي تحب أن نناديك به (اختياري)</span>
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} autoComplete="nickname" maxLength={80} />
        </label>
        <label className="field">
          <span>البريد الإلكتروني</span>
          <div style={{ position: 'relative' }}>
            <Icon name="mail" size={18} style={{ position: 'absolute', insetInlineStart: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            <input className="ltr" style={{ paddingInlineStart: 44 }} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
          </div>
        </label>
        {/* 12 هو حد سياسة الخادم (MIN_PASSWORD_LENGTH) — لا نعد المستخدم بحد أخف يُرفض بعده */}
        <PasswordField value={password} onChange={setPassword} autoComplete="new-password" minLength={12} />
        <span className="small muted" style={{ marginTop: 'calc(-1 * var(--s-2))' }}>12 حرفًا على الأقل، وتحتوي حرفًا ورقمًا.</span>
        <button className="btn block lg" type="submit" disabled={busy}>
          {busy ? (
            <>
              <span className="spinner spinner-sm" aria-hidden="true" /> جارٍ إنشاء الحساب…
            </>
          ) : 'إنشاء الحساب'}
        </button>
        <p className="small muted" style={{ textAlign: 'center', marginBottom: 0 }}>
          لديك حساب؟{' '}
          <a href="/login" onClick={e => { e.preventDefault(); navigate('/login'); }}>سجّل الدخول</a>
        </p>
      </form>
    </AuthLayout>
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
    <AuthLayout title="أهلًا بعودتك" subtitle="سجّل الدخول لتكمل من حيث توقفت.">
      <form className="stack" onSubmit={onSubmit} noValidate>
        {sessionExpired && (
          <div className="alert info" role="status" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--s-2)', alignItems: 'flex-start' }}>
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
        <PasswordField value={password} onChange={setPassword} autoComplete="current-password" />
        <button className="btn block lg" type="submit" disabled={busy}>
          {busy ? (
            <>
              <span className="spinner spinner-sm" aria-hidden="true" /> جارٍ الدخول…
            </>
          ) : 'دخول'}
        </button>
        <p className="small muted" style={{ textAlign: 'center', marginBottom: 0 }}>
          لا تملك حسابًا؟{' '}
          <a href="/signup" onClick={e => { e.preventDefault(); navigate('/signup'); }}>أنشئ حسابًا</a>
        </p>
        <p className="auth-note small muted">
          لا تتوفر حاليًا خاصية استعادة كلمة المرور. إن نسيتها، تواصل مع فريق المنصة لحل المشكلة.
        </p>
      </form>
    </AuthLayout>
  );
}
