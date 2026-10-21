import { AudioDemo } from '../components/AudioDemo';

export function Landing({ navigate }: { navigate: (to: string) => void }) {
  return (
    <div className="container">
      <section className="hero">
        <span className="badge accent">نسخة قيد البناء — المرحلة 1</span>
        <h1>
          تعلّم <span className="es">español</span> من الصفر… بالعربي وبالمواقف الحقيقية
        </h1>
        <p className="lead">
          منصة عربية لتعلّم الإسبانية من التمهيد حتى C1: جمل حقيقية بدل حفظ القوائم، استماع وتحدّث،
          مراجعة متباعدة، ومسار مهني كامل للكول سنتر.
        </p>
        <div className="row" style={{ marginTop: 'var(--s-4)' }}>
          <button className="btn" onClick={() => navigate('/signup')}>أنشئ حسابك</button>
          <button className="btn secondary" onClick={() => navigate('/login')}>لديّ حساب</button>
        </div>
      </section>

      <div className="grid cols-2" style={{ marginTop: 'var(--s-5)' }}>
        <section className="card">
          <h2>ما الذي يعمل الآن فعلًا؟</h2>
          <ul className="list-plain small">
            <li>✅ حسابات حقيقية: إنشاء، دخول، خروج، جلسات آمنة في الخادم.</li>
            <li>✅ حفظ تفضيلاتك: أسلوب الشرح (فصحى / مصري / مدمج)، الهدف اليومي، المنطقة الصوتية.</li>
            <li>✅ قاعدة بيانات كاملة (56 جدولًا) تعمل على D1 محليًا.</li>
            <li>✅ خدمة صوت مستقلة: تسجيل من R2 أولًا، وصوت الجهاز احتياطًا فقط.</li>
            <li>⏳ محرك التمارين والدروس: المرحلة 2 — لا نعرض تقدمًا غير محفوظ.</li>
          </ul>
          <p className="small muted" style={{ marginTop: 'var(--s-3)' }}>
            لا أرقام نجاح ولا نسب إتقان معروضة قبل أن تُحفظ فعليًا في الخادم.
          </p>
        </section>

        <section className="card">
          <h2>جرّب الصوت</h2>
          <AudioDemo text="Quiero un café, por favor." audioKey="pending/a1-cafe-quiero-cafe-con-leche" />
        </section>
      </div>

      <section className="card" style={{ marginTop: 'var(--s-4)' }}>
        <h2>لماذا طريقة مختلفة؟</h2>
        <div className="grid cols-2">
          <div>
            <h3>من الجملة لا من القائمة</h3>
            <p className="small muted">
              نتعلّم «أريد قهوة من فضلك» في موقف مقهى حقيقي، ثم نُفكّك التركيب. الكلمة تُختبر في سياق جديد
              لا في نفس الجملة المحفوظة.
            </p>
          </div>
          <div>
            <h3>عربي فصيح + توضيح مصري</h3>
            <p className="small muted">
              الشرح فصحى دقيق، ومع كل معنى ملاحظة مصرية قصيرة عند الحاجة — وتختار الأسلوب الذي يناسبك.
            </p>
          </div>
          <div>
            <h3>إسبانيا أولًا ثم البدائل</h3>
            <p className="small muted">
              الأساس إسبانية إسبانيا المعاصرة، مع تنبيه واضح للفروق المهمة في أمريكا اللاتينية
              (<span className="es">zumo</span> / <span className="es">jugo</span>) دون إرباك المبتدئ.
            </p>
          </div>
          <div>
            <h3>لا وعود غير صحيحة</h3>
            <p className="small muted">
              لا شهادات معتمدة، ولا ضمان وظيفة، ولا «مجاني بلا حدود». الحدود والقيود معلنة في صفحة الشفافية.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
