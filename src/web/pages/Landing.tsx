import { useAuth } from '../state';

export function Landing({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  return (
    <div className="container">
      <section className="hero">
        <h1>
          تعلّم <span className="es">español</span> من الصفر… بالعربي وبالمواقف الحقيقية
        </h1>
        <p className="lead">
          منصة عربية لتعلّم الإسبانية من التمهيد حتى C1: جمل حقيقية بدل حفظ القوائم، استماع وتحدّث،
          مراجعة متباعدة، ومسارات عملية للسفر وخدمة العملاء.
        </p>
        <div className="row" style={{ marginTop: 'var(--s-4)' }}>
          {user ? (
            <button className="btn" onClick={() => navigate('/learn')}>متابعة التعلّم</button>
          ) : (
            <>
              <button className="btn" onClick={() => navigate('/signup')}>أنشئ حسابك</button>
              <button className="btn secondary" onClick={() => navigate('/login')}>لديّ حساب</button>
            </>
          )}
          <button className="btn ghost" onClick={() => navigate('/search')}>🔍 ابحث في المفردات</button>
        </div>
      </section>
    </div>
  );
}
