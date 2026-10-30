import { useState, type FormEvent } from 'react';
import { api, ApiError } from '../api';
import { deriveKeyB64, supportsClientKdf } from '../kdf';
import { useAuth } from '../state';
import { passwordProblemsClient } from './Auth';

export function Settings({ navigate }: { navigate: (to: string) => void }) {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.displayName ?? '');
  const [style, setStyle] = useState(user?.explanationStyle ?? 'fusha_eg');
  const [goal, setGoal] = useState(user?.dailyGoalMinutes ?? 10);
  const [variant, setVariant] = useState(user?.audioVariant ?? 'es-ES');
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const { user: updated } = await api.updateMe({
        displayName: name.trim() || null,
        explanationStyle: style as 'fusha' | 'eg' | 'fusha_eg',
        dailyGoalMinutes: goal,
        audioVariant: variant as 'es-ES' | 'es-419',
      });
      setUser(updated);
      setStatus({ kind: 'ok', text: 'حُفظت الإعدادات في حسابك.' });
    } catch (e) {
      setStatus({ kind: 'err', text: e instanceof ApiError ? e.message : 'تعذّر الحفظ. حاول لاحقًا.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="narrow" style={{ maxWidth: 720 }}>
      <header className="path-head" style={{ marginBottom: 'var(--s-4)' }}>
        <div>
          <h1>الإعدادات</h1>
          <p className="small muted" style={{ margin: 0 }}>تخصيص تجربة التعلّم والشرح والصوت</p>
        </div>
        <div className="row">
          <button className="btn secondary sm" onClick={() => navigate('/profile')}>ملفي وتقدمي</button>
          <button className="btn ghost sm" onClick={() => navigate('/learn')}>عودة</button>
        </div>
      </header>

      <form className="card stack" onSubmit={e => { e.preventDefault(); void save(); }}>
        <h2 style={{ margin: 0 }}>التعلّم</h2>
        <label className="field">
          <span>الاسم</span>
          <input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={80} />
        </label>
        <label className="field">
          <span>أسلوب الشرح والترجمة</span>
          <select value={style} onChange={e => setStyle(e.target.value as typeof style)}>
            <option value="fusha">العربية الفصحى فقط (دون أي لهجات عامية)</option>
            <option value="fusha_eg">الفصحى مع التوضيح بالمصرية عند توفره (موصى به)</option>
            <option value="eg">العامية المصرية</option>
          </select>
        </label>
        <label className="field">
          <span>الهدف اليومي (دقائق)</span>
          <input
            type="range" min={5} max={60} step={5} value={goal}
            onChange={e => setGoal(Number(e.target.value))}
            aria-valuemin={5} aria-valuemax={60} aria-valuenow={goal}
          />
          <span className="small num">{goal} دقيقة</span>
        </label>
        <label className="field">
          <span>المنطقة الصوتية</span>
          <select value={variant} onChange={e => setVariant(e.target.value as typeof variant)}>
            <option value="es-ES">إسبانية إسبانيا (افتراضي)</option>
            <option value="es-419">أمريكا اللاتينية</option>
          </select>
        </label>
        {status && <div className={status.kind === 'ok' ? 'alert ok' : 'alert'} role="status">{status.text}</div>}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'جارٍ الحفظ…' : 'حفظ الإعدادات'}</button>
      </form>

      <PasswordSection />

      <section className="card" style={{ marginTop: 'var(--s-4)' }}>
        <h2 style={{ marginTop: 0 }}>البيانات والحساب</h2>
        <ul className="list-plain small">
          <li>البريد: <span className="es">{user.email}</span></li>
          <li>الدور: <span className="badge">{user.role}</span></li>
          <li>الجلسة: كوكي <code>HttpOnly</code> — لا يمكن لأي سكربت في الصفحة قراءتها.</li>
          <li>حذف الحساب وتصدير البيانات: غير مفعّلين حاليًا.</li>
        </ul>
        <EmailVerifyBlock />
      </section>
    </div>
  );
}

/**
 * تغيير كلمة المرور — المفتاحان يُشتقان في المتصفح (kdfv2)، فلا تصل الكلمة للخادم.
 * الحساب القديم (v1) يرد 409 LEGACY_CREDENTIALS مرة واحدة، فيُعاد الإرسال بكلمة
 * المرور الخام **مع** المفتاح الجديد المشتق: يتحقق الخادم ويُرقّي الصف إلى v2.
 */
function PasswordSection() {
  const { user } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string; problems?: string[] } | null>(null);

  if (!user) return null;

  async function derive(password: string): Promise<string> {
    const params = await api.kdfParams(user!.email);
    return deriveKeyB64(password, params.salt, params.iterations);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supportsClientKdf()) {
      setStatus({ kind: 'err', text: 'متصفحك لا يدعم التشفير اللازم لتغيير كلمة المرور.' });
      return;
    }
    const problems = passwordProblemsClient(next, user!.email);
    if (next !== confirm) problems.push('الكلمتان غير متطابقتين.');
    if (!current) problems.push('أدخل كلمة المرور الحالية.');
    if (problems.length) {
      setStatus({ kind: 'err', text: 'لم يُجرَ أي تغيير.', problems });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const newDerivedKey = await derive(next);
      const currentDerivedKey = await derive(current);
      if (newDerivedKey === currentDerivedKey) {
        setStatus({ kind: 'err', text: 'كلمة المرور الجديدة مطابقة للحالية.' });
        return;
      }
      try {
        await api.changePassword({ currentDerivedKey, newDerivedKey });
      } catch (err) {
        if (err instanceof ApiError && err.status === 409 && err.code === 'LEGACY_CREDENTIALS') {
          await api.changePassword({ currentPassword: current, newDerivedKey });
        } else {
          throw err;
        }
      }
      setCurrent('');
      setNext('');
      setConfirm('');
      setStatus({ kind: 'ok', text: 'تغيّرت كلمة المرور، وأُغلقت الجلسات الأخرى.' });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setStatus({ kind: 'err', text: 'كلمة المرور الحالية غير صحيحة.' });
      } else if (err instanceof ApiError && err.isNetwork()) {
        setStatus({ kind: 'err', text: 'تعذّر الاتصال بالخادم. تحقق من الشبكة.' });
      } else {
        setStatus({ kind: 'err', text: err instanceof ApiError ? err.message : 'تعذّر التغيير الآن.' });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card stack" style={{ marginTop: 'var(--s-4)' }} onSubmit={onSubmit} noValidate>
      <h2 style={{ margin: 0 }}>كلمة المرور</h2>
      <p className="small muted" style={{ margin: 0 }}>
        تُشتق كلمة المرور في متصفحك ولا تُرسل إلى الخادم. تغييرها يُبقي جلستك الحالية ويُغلق الباقي.
      </p>
      <label className="field">
        <span>كلمة المرور الحالية</span>
        <input className="ltr" type="password" value={current} onChange={e => setCurrent(e.target.value)} autoComplete="current-password" required />
      </label>
      <label className="field">
        <span>كلمة المرور الجديدة</span>
        <input className="ltr" type="password" value={next} onChange={e => setNext(e.target.value)} autoComplete="new-password" minLength={12} required />
      </label>
      <label className="field">
        <span>تأكيد كلمة المرور الجديدة</span>
        <input className="ltr" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" minLength={12} required />
      </label>
      <p className="small muted" style={{ margin: 0 }}>12 حرفًا على الأقل، مع حرف ورقم، وبلا بريدك.</p>
      {status && (
        <div className={status.kind === 'ok' ? 'alert ok' : 'alert'} role={status.kind === 'ok' ? 'status' : 'alert'}>
          <span>{status.text}</span>
          {status.problems?.length ? (
            <ul style={{ marginBottom: 0 }}>{status.problems.map(p => <li key={p} className="small">{p}</li>)}</ul>
          ) : null}
        </div>
      )}
      <button className="btn" type="submit" disabled={busy}>{busy ? 'جارٍ التغيير…' : 'تغيير كلمة المرور'}</button>
    </form>
  );
}


/**
 * تأكيد البريد: زر واحد يطلب الرابط. الحالة تُقرأ من رد الخادم نفسه
 * (alreadyVerified / mailSent) — ولا ندّعي إرسالًا إن لم يكن المزوّد مضبوطًا.
 */
function EmailVerifyBlock() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'info' | 'err'; text: string } | null>(null);

  async function ask() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await api.verifyEmailRequest();
      if (res.alreadyVerified) setMsg({ kind: 'ok', text: 'بريدك مؤكد بالفعل.' });
      else if (res.mailSent) setMsg({ kind: 'info', text: 'أرسلنا رابط التحقق إلى بريدك. يبقى صالحًا 24 ساعة.' });
      else
        setMsg({
          kind: 'err',
          text: 'الرابط جاهز لكن خدمة البريد غير مهيأة على هذه النسخة، فلم تُرسل رسالة. أبلغ مسؤول المنصة.',
        });
    } catch (err) {
      setMsg({
        kind: 'err',
        text: err instanceof ApiError && err.status === 429 ? 'طلبت روابط كثيرة. انتظر ساعة ثم أعد المحاولة.' : 'تعذّر إنشاء رابط التحقق الآن.',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 'var(--s-3)' }}>
      <button className="btn secondary sm" type="button" onClick={() => void ask()} disabled={busy}>
        {busy ? 'جارٍ التحقق…' : 'أرسل رابط تأكيد البريد'}
      </button>
      {msg && (
        <p className={msg.kind === 'err' ? 'small' : 'small muted'} role="status" style={{ marginTop: 'var(--s-2)' }}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
