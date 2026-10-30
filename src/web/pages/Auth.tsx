import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { api, ApiError, type AuthCredentials } from '../api';
import { deriveKeyB64, supportsClientKdf } from '../kdf';
import { useAuth } from '../state';
import { BrandMark, Icon } from '../components/icons';

/**
 * سياسة كلمة المرور — تُطبَّق في المتصفح لأن كلمة المرور لا تصل إلى الخادم أصلًا
 * في المسار v2 (الخادم يرى مفتاحًا مشتقًا فقط). نفس الحدود المعروضة للمستخدم.
 */
export function passwordProblemsClient(pw: string, email: string): string[] {
  const problems: string[] = [];
  if (pw.length < 12) problems.push('استخدم 12 حرفًا على الأقل.');
  if (pw.length > 200) problems.push('كلمة المرور طويلة جدًا (200 حرف كحد أقصى).');
  if (!/[A-Za-zÀ-ÿ]/.test(pw)) problems.push('أضف حرفًا واحدًا على الأقل.');
  if (!/\d/.test(pw)) problems.push('أضف رقمًا واحدًا على الأقل.');
  const local = email.split('@')[0]?.toLowerCase() ?? '';
  if (local.length >= 3 && pw.toLowerCase().includes(local)) problems.push('لا تُدخل بريدك داخل كلمة المرور.');
  return problems;
}

/** اشتقاق المفتاح في المتصفح ثم إرساله بدل كلمة المرور. */
async function prepareCredential(email: string, password: string): Promise<AuthCredentials> {
  if (!supportsClientKdf()) {
    throw new Error('CLIENT_KDF_UNSUPPORTED');
  }
  const params = await api.kdfParams(email);
  return { derivedKey: await deriveKeyB64(password, params.salt, params.iterations) };
}

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

/* الدخول عبر Google: تنقّل كامل (لا SPA) لأن المسار يبدأ تدفق OAuth على الخادم.
   لا شعار مرسومًا: زر نصي فقط، بلا ادعاء شعار العلامة. */
function GoogleButton() {
  return (
    <button
      type="button"
      className="btn block"
      onClick={() => { window.location.href = '/api/auth/oauth/google/start'; }}
    >
      المتابعة بحساب Google
    </button>
  );
}

function AuthDivider() {
  return (
    <p className="small muted" style={{ textAlign: 'center', marginBottom: 0 }}>أو</p>
  );
}

/* رسائل إعادة التوجيه من مسار OAuth: رموز عامة فقط، بلا تفاصيل مزوّد. */
const OAUTH_MESSAGES: Record<string, string> = {
  unavailable: 'تسجيل الدخول عبر Google غير متاح حاليًا. جرّب الدخول بكلمة المرور.',
  denied: 'ألغيت تسجيل الدخول عبر Google. يمكنك المحاولة مجددًا أو الدخول بكلمة المرور.',
  invalid: 'انتهت صلاحية محاولة الدخول عبر Google. حاول مجددًا.',
  failed: 'تعذّر تسجيل الدخول عبر Google. حاول مجددًا أو ادخل بكلمة المرور.',
};

function oauthErrorFromQuery(): FormError | null {
  if (typeof window === 'undefined') return null;
  const code = new URLSearchParams(window.location.search).get('oauth');
  if (!code || !(code in OAUTH_MESSAGES)) return null;
  return { message: OAUTH_MESSAGES[code]! };
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
    const problems = passwordProblemsClient(password, email);
    if (problems.length) {
      submit(async () => { throw new ApiError(400, 'WEAK_PASSWORD', 'كلمة المرور غير مقبولة: ' + problems.join(' '), { problems }); });
      return;
    }
    void submit(async () => api.signup(email, await prepareCredential(email, password), displayName || undefined));
  };

  return (
    <AuthLayout title="إنشاء حساب جديد" subtitle="ابدأ رحلتك في الإسبانية خلال دقيقة.">
      <form className="stack" onSubmit={onSubmit} noValidate>
        <p className="muted small">
          نطلب البريد لتعريف حسابك وحفظ تقدمك فيه. لا نرسل رسائل تسويقية، ولا نشارك بريدك مع أي جهة إعلانية.
        </p>
        <ErrorBox error={error} />
        <GoogleButton />
        <AuthDivider />
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
  const [oauthError] = useState(oauthErrorFromQuery);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit(async () => {
      const credential = await prepareCredential(email, password);
      try {
        return await api.login(email, credential);
      } catch (err) {
        // حساب قديم (v1) يحتاج كلمة المرور نفسها للتحقق ثم يُرقّى. يحدث مرة واحدة.
        if (err instanceof ApiError && err.status === 409 && err.code === 'LEGACY_CREDENTIALS') {
          return api.login(email, { password });
        }
        throw err;
      }
    });
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
        <ErrorBox error={error ?? oauthError} />
        <GoogleButton />
        <AuthDivider />
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
        <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>
          <a href="/forgot" onClick={e => { e.preventDefault(); navigate('/forgot'); }}>نسيت كلمة المرور؟</a>
        </p>
      </form>
    </AuthLayout>
  );
}


/* ============================================================================
   استعادة الوصول — ثلاث شاشات عامة
   ----------------------------------------------------------------------------
   • /forgot: نطلب رابطًا؛ الخادم يعيد 200 دائمًا فلا يُعرف إن كان البريد مسجلًا.
   • /reset?token=…&email=…: المفتاح الجديد يُشتق في المتصفح (نفس مسار kdfv2)،
     ثم يُستهلك الرمز مرة واحدة وتُبطَل كل الجلسات.
   • /verify?token=…: يؤكّد البريد فور فتح الرابط (بلا جلسة، يعمل على أي جهاز).
   الرمز في العنوان سرّ: يُقرأ عند التركيب ثم يُمسح من شريط العنوان ومن البحث
   التاريخي عبر replaceState، فلا يبقى في سجل التصفح ولا ينتقل في Referer.
   ========================================================================== */

function readQuery() {
  if (typeof window === 'undefined') return { token: '', email: '' };
  const q = new URLSearchParams(window.location.search);
  return { token: q.get('token') ?? '', email: q.get('email') ?? '' };
}

/** يمسح المعاملات الحسّاسة من شريط العنوان بعد قراءتها. */
function scrubQuery() {
  if (typeof window === 'undefined') return;
  if (!window.location.search) return;
  window.history.replaceState({}, '', window.location.pathname);
}

const NETWORK_MESSAGE = 'تعذّر الاتصال بالخادم. تحقق من الشبكة ثم أعد المحاولة.';

export function ForgotPassword({ navigate }: { navigate: (to: string) => void }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    void api
      .passwordResetRequest(email.trim())
      .then(() => setSent(true))
      .catch((err: unknown) => {
        setError({
          message: err instanceof ApiError && err.isNetwork() ? NETWORK_MESSAGE : 'تعذّر إرسال الطلب الآن. حاول بعد قليل.',
        });
      })
      .finally(() => setBusy(false));
  };

  return (
    <AuthLayout title="استعادة كلمة المرور" subtitle="أدخل بريدك وسنرسل رابطًا لإعادة التعيين.">
      {sent ? (
        <div className="stack">
          <div className="alert info" role="status">
            <strong style={{ display: 'block' }}>إن كان هذا البريد مسجلًا فسيصلك رابط خلال دقائق.</strong>
            <span className="small muted">
              الرابط صالح 30 دقيقة ويُستخدم مرة واحدة. إن لم يصل، تحقق من مجلد «الرسائل غير المرغوبة».
            </span>
          </div>
          <button className="btn block lg" type="button" onClick={() => navigate('/login')}>العودة إلى الدخول</button>
        </div>
      ) : (
        <form className="stack" onSubmit={onSubmit} noValidate>
          <ErrorBox error={error} />
          <label className="field">
            <span>البريد الإلكتروني</span>
            <input
              className="ltr"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <button className="btn block lg" type="submit" disabled={busy || !email.trim()}>
            {busy ? <><span className="spinner spinner-sm" aria-hidden="true" /> جارٍ الإرسال…</> : 'أرسل رابط الاستعادة'}
          </button>
          <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>
            تذكّرت كلمة المرور؟{' '}
            <a href="/login" onClick={e => { e.preventDefault(); navigate('/login'); }}>سجّل الدخول</a>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}

export function ResetPassword({ navigate }: { navigate: (to: string) => void }) {
  const [{ token, email }] = useState(readQuery);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  useEffect(() => {
    if (token) scrubQuery();
  }, [token]);

  const validLink = token.length >= 20 && email.includes('@');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const problems = passwordProblemsClient(password, email);
    if (password !== confirm) problems.push('الكلمتان غير متطابقتين.');
    if (problems.length) {
      setError({ message: 'لم تُحفظ كلمة المرور بعد.', problems });
      return;
    }
    setBusy(true);
    setError(null);
    void (async () => {
      try {
        const params = await api.kdfParams(email);
        const derivedKey = await deriveKeyB64(password, params.salt, params.iterations);
        await api.passwordResetConfirm(token, derivedKey);
        setDone(true);
      } catch (err) {
        if (err instanceof ApiError && err.isNetwork()) {
          setError({ message: NETWORK_MESSAGE });
        } else if (err instanceof ApiError && (err.code === 'INVALID_TOKEN' || err.status === 400)) {
          setError({ message: 'انتهت صلاحية الرابط أو استُخدم سابقًا. اطلب رابطًا جديدًا.' });
        } else if (err instanceof ApiError && err.status === 429) {
          setError({ message: 'محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.' });
        } else {
          setError({ message: 'تعذّرت إعادة التعيين الآن. حاول لاحقًا.' });
        }
      } finally {
        setBusy(false);
      }
    })();
  };

  if (!validLink) {
    return (
      <AuthLayout title="رابط غير صالح" subtitle="الرابط ناقص أو تالف.">
        <div className="stack">
          <div className="alert" role="alert">
            <strong style={{ display: 'block' }}>هذا الرابط غير صالح أو منتهي.</strong>
            <span className="small muted">اطلب رابطًا جديدًا من صفحة الاستعادة.</span>
          </div>
          <button className="btn block lg" type="button" onClick={() => navigate('/forgot')}>اطلب رابطًا جديدًا</button>
        </div>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="تم تغيير كلمة المرور" subtitle="سجّل الدخول بكلمة المرور الجديدة.">
        <div className="stack">
          <div className="alert info" role="status">
            <strong style={{ display: 'block' }}>حُفظت كلمة المرور الجديدة.</strong>
            <span className="small muted">
              أُغلقت كل الجلسات السابقة على جميع الأجهزة. المفتاح لم يغادر متصفحك.
            </span>
          </div>
          <button className="btn block lg" type="button" onClick={() => navigate('/login')}>الذهاب إلى الدخول</button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="كلمة مرور جديدة" subtitle="اختر كلمة مرور قوية لحسابك.">
      <form className="stack" onSubmit={onSubmit} noValidate>
        <ErrorBox error={error} />
        <PasswordField value={password} onChange={setPassword} autoComplete="new-password" minLength={12} />
        <PasswordField value={confirm} onChange={setConfirm} autoComplete="new-password" minLength={12} />
        <p className="small muted" style={{ margin: 0 }}>
          12 حرفًا على الأقل، مع حرف ورقم. تُشتق الكلمة في متصفحك ولا تُرسل إلى الخادم.
        </p>
        <button className="btn block lg" type="submit" disabled={busy}>
          {busy ? <><span className="spinner spinner-sm" aria-hidden="true" /> جارٍ الحفظ…</> : 'احفظ كلمة المرور'}
        </button>
      </form>
    </AuthLayout>
  );
}

export function VerifyEmail({ navigate }: { navigate: (to: string) => void }) {
  const [{ token }] = useState(readQuery);
  const [state, setState] = useState<'checking' | 'ok' | 'invalid' | 'network'>('checking');

  useEffect(() => {
    if (token) scrubQuery();
    if (token.length < 20) {
      setState('invalid');
      return;
    }
    let alive = true;
    api
      .verifyEmailConfirm(token)
      .then(() => { if (alive) setState('ok'); })
      .catch((err: unknown) => {
        if (!alive) return;
        setState(err instanceof ApiError && err.isNetwork() ? 'network' : 'invalid');
      });
    return () => { alive = false; };
  }, [token]);

  const title =
    state === 'ok' ? 'تم تأكيد بريدك'
    : state === 'checking' ? 'جارٍ التحقق من الرابط'
    : 'لم نتمكن من تأكيد البريد';

  return (
    <AuthLayout title={title} subtitle="تأكيد البريد يفتح استعادة كلمة المرور برابط آمن.">
      {state === 'checking' && (
        <p className="muted" role="status" style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center' }}>
          <span className="spinner spinner-sm" aria-hidden="true" /> لحظة واحدة…
        </p>
      )}
      {state === 'ok' && (
        <div className="stack">
          <div className="alert info" role="status">
            <strong style={{ display: 'block' }}>صار بريدك مؤكدًا.</strong>
            <span className="small muted">يمكنك الآن استعادة كلمة المرور برابط عند الحاجة.</span>
          </div>
          <button className="btn block lg" type="button" onClick={() => navigate('/learn')}>متابعة التعلّم</button>
        </div>
      )}
      {(state === 'invalid' || state === 'network') && (
        <div className="stack">
          <div className="alert" role="alert">
            <strong style={{ display: 'block' }}>
              {state === 'network' ? 'تعذّر الاتصال بالخادم.' : 'الرابط غير صالح أو منتهي أو استُخدم سابقًا.'}
            </strong>
            <span className="small muted">
              {state === 'network' ? 'تحقق من الشبكة وأعد فتح الرابط.' : 'اطلب رابطًا جديدًا من إعدادات حسابك.'}
            </span>
          </div>
          <button className="btn block lg" type="button" onClick={() => navigate('/settings')}>إعدادات الحساب</button>
        </div>
      )}
    </AuthLayout>
  );
}
