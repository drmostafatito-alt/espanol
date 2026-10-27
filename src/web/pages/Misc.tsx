export function NotFound({ navigate }: { navigate: (to: string) => void }) {
  return (
    <div className="container narrow">
      <h1>الصفحة غير موجودة</h1>
      <p className="muted">الرابط الذي فتحته غير صحيح أو تغيّر.</p>
      <div className="row">
        <button className="btn" onClick={() => navigate('/')}>الصفحة الرئيسية</button>
        <button className="btn secondary" onClick={() => navigate('/learn')}>لوحتي</button>
      </div>
    </div>
  );
}
