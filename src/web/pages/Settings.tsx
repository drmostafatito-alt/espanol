import { useState } from 'react';
import { api, ApiError } from '../api';
import { useAuth } from '../state';
import { AudioDemo } from '../components/AudioDemo';

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
    <div className="container narrow">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1>الإعدادات</h1>
        <button className="btn ghost sm" onClick={() => navigate('/learn')}>عودة</button>
      </div>

      <form className="card stack" onSubmit={e => { e.preventDefault(); void save(); }}>
        <h2>التعلّم</h2>
        <label className="field">
          <span>الاسم</span>
          <input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={80} />
        </label>
        <label className="field">
          <span>أسلوب الشرح</span>
          <select value={style} onChange={e => setStyle(e.target.value as typeof style)}>
            <option value="fusha">العربية الفصحى</option>
            <option value="eg">العامية المصرية</option>
            <option value="fusha_eg">فصحى مع توضيح مصري مختصر (موصى به)</option>
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

      <section className="card" style={{ marginTop: 'var(--s-4)' }}>
        <h2>الصوت</h2>
        <AudioDemo text="Buenos días, ¿en qué puedo ayudarle?" audioKey="pending/cc1-opening-omar" variant={variant as 'es-ES' | 'es-419'} />
        <p className="small muted" style={{ marginTop: 'var(--s-3)' }}>
          لا نرفع تسجيلاتك الصوتية إلى الخادم في هذه المرحلة، ولا نقيّم نطقك آليًا. عندما يصبح متاحًا
          ستُطلب موافقتك صراحةً قبل أي رفع.
        </p>
      </section>

      <section className="card" style={{ marginTop: 'var(--s-4)' }}>
        <h2>البيانات والحساب</h2>
        <ul className="list-plain small">
          <li>البريد: <span className="es">{user.email}</span></li>
          <li>الدور: <span className="badge">{user.role}</span></li>
          <li>الجلسة: كوكي <code>HttpOnly</code> — لا يمكن لأي سكربت في الصفحة قراءتها.</li>
          <li>حذف الحساب وتصدير البيانات: غير مفعّلين بعد؛ مطلوبان في المرحلة 5.</li>
        </ul>
      </section>
    </div>
  );
}
