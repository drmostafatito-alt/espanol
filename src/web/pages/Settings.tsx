import { useState } from 'react';
import { api, ApiError } from '../api';
import { useAuth } from '../state';
import { AudioDemo } from '../components/AudioDemo';
import { Icon, SectionHead } from '../components/ui';

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
      <div style={{ color: '#1e2a4a' }}>
        <SectionHead
          kicker="حسابك"
          title="الإعدادات"
          desc="تفضيلات التعلم والصوت تُحفظ في حسابك وتُطبَّق على الدروس والمراجعة."
          action={<button className="btn ghost sm" onClick={() => navigate('/learn')}><Icon name="arrowR" size={16} /> عودة</button>}
        />
      </div>

      <form className="card stack" style={{ borderRadius: 24, padding: 'var(--s-5)', boxShadow: '0 12px 32px rgba(34, 29, 22, 0.08)' }} onSubmit={e => { e.preventDefault(); void save(); }}>
        <h2 style={{ color: '#1e2a4a' }}><Icon name="settings" size={20} /> التعلّم</h2>
        <label className="field">
          <span>الاسم</span>
          <input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={80} style={{ borderRadius: 16, padding: '12px 14px' }} />
        </label>
        <label className="field">
          <span>أسلوب الشرح والترجمة</span>
          <select value={style} onChange={e => setStyle(e.target.value as typeof style)} style={{ borderRadius: 16, padding: '12px 14px' }}>
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
          <span className="small num" style={{ color: '#9a3412', fontWeight: 800 }}>{goal} دقيقة</span>
        </label>
        <label className="field">
          <span>المنطقة الصوتية</span>
          <select value={variant} onChange={e => setVariant(e.target.value as typeof variant)} style={{ borderRadius: 16, padding: '12px 14px' }}>
            <option value="es-ES">إسبانية إسبانيا (افتراضي)</option>
            <option value="es-419">أمريكا اللاتينية</option>
          </select>
        </label>
        {status && <div className={status.kind === 'ok' ? 'alert ok' : 'alert'} role="status">{status.text}</div>}
        <button className="btn block" type="submit" disabled={busy} style={{ background: '#ea580c', borderColor: '#ea580c', color: '#fff' }}>{busy ? 'جارٍ الحفظ…' : 'حفظ الإعدادات'}</button>
      </form>

      <section className="card" style={{ marginTop: 'var(--s-4)', borderRadius: 24, padding: 'var(--s-5)', boxShadow: '0 12px 32px rgba(34, 29, 22, 0.08)' }}>
        <h2 style={{ color: '#1e2a4a' }}><Icon name="listen" size={20} /> الصوت</h2>
        <AudioDemo text="Buenos días, ¿en qué puedo ayudarle?" audioKey="pending/cc1-opening-omar" variant={variant as 'es-ES' | 'es-419'} />
        <p className="small muted" style={{ marginTop: 'var(--s-3)' }}>
          لا نرفع تسجيلاتك الصوتية إلى الخادم في هذه المرحلة، ولا نقيّم نطقك آليًا. عندما يصبح متاحًا
          ستُطلب موافقتك صراحةً قبل أي رفع.
        </p>
      </section>

      <section className="card" style={{ marginTop: 'var(--s-4)', borderRadius: 24, padding: 'var(--s-5)', boxShadow: '0 12px 32px rgba(34, 29, 22, 0.08)' }}>
        <h2 style={{ color: '#1e2a4a' }}><Icon name="lock" size={20} /> البيانات والحساب</h2>
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
