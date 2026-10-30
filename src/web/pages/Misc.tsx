import { Icon } from '../components/icons';
import { Solecito } from '../components/Illustrations';

/** صفحة 404 — تعرض طريقًا واضحًا للعودة بدل رسالة خطأ جافة */
export function NotFound({ navigate }: { navigate: (to: string) => void }) {
  return (
    <div className="container" style={{ maxWidth: 620 }}>
      <div className="card" style={{ textAlign: 'center', padding: 'var(--s-7) var(--s-5)', marginTop: 'var(--s-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Solecito mood="think" size={128} />
        </div>
        <h1 style={{ marginTop: 'var(--s-3)' }}>لم نجد هذه الصفحة</h1>
        <p className="muted" style={{ maxWidth: '42ch', margin: '0 auto var(--s-4)' }}>
          الرابط الذي فتحته غير صحيح أو تغيّر. لا شيء ضاع — يمكنك العودة إلى مسارك من هنا.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn navy" onClick={() => navigate('/learn')}>
            <Icon name="route" size={17} /> مسار التعلم
          </button>
          <button className="btn secondary" onClick={() => navigate('/')}>الصفحة الرئيسية</button>
        </div>
      </div>
    </div>
  );
}
