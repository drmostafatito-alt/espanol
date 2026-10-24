import { Icon, SectionHead } from '../components/ui';

export function Transparency() {
  return (
    <div className="container narrow">
      <SectionHead
        kicker="الشفافية"
        title="حدود المنصة — بصراحة"
        desc="ما هو منفَّذ فعلًا، وما ليس منفَّذًا بعد، وحدود التشغيل — دون تجميل."
      />
      <section className="card stack">
        <h2><Icon name="checkCircle" size={20} /> ما هو منفَّذ الآن</h2>
        <ul className="list-plain small">
          <li>حسابات حقيقية بالمصادقة على الخادم، وجلسات HttpOnly، وحدود معدل، وصلاحيات أدوار.</li>
          <li>قاعدة بيانات 56 جدولًا تعمل على D1 محليًا، وبذور مرجعية (7 أدوار، 6 مستويات، 28 نوع تمرين).</li>
          <li>خدمة صوت مستقلة قابلة للاختبار: تسجيل من R2 أولًا، صوت الجهاز كاحتياط فقط.</li>
          <li>مدقق محتوى آلي يمنع نشر درس بإجابة ناقصة أو تفسير مفقود أو صوت معلَّق.</li>
        </ul>
        <h2><Icon name="warn" size={20} /> ما ليس منفَّذًا بعد</h2>
        <ul className="list-plain small">
          <li>محرك التمارين والدروس، وحفظ التقدم، والمراجعة المتباعدة (المرحلة 2–5).</li>
          <li>تسجيلات صوتية (كل المقاطع الحالية معلَّمة كـ<span className="es">pending</span> ولم تُنتج).</li>
          <li>الكول سنتر كمسار تشغيلي كامل، ولوحة الإدارة، والإشعارات، والعمل دون اتصال.</li>
          <li>استعادة كلمة المرور (تحتاج مزوّد بريد)، وتصدير/حذف الحساب.</li>
        </ul>
        <h2><Icon name="info" size={20} /> حدود التشغيل</h2>
        <ul className="list-plain small">
          <li>الخطة المجانية في Cloudflare لها سقوف صلبة: 100 ألف طلب/يوم، 100 ألف كتابة D1/يوم، 500 ميغابايت لكل قاعدة.</li>
          <li>لا يوجد ضمان مجانية دائمة، ولا شهادات معتمدة، ولا ضمان وظيفة.</li>
          <li>جودة الصوت الاحتياطي تعتمد على جهازك، وقد لا يوجد صوت إسباني مثبَّت أصلًا.</li>
        </ul>
        <h2><Icon name="lock" size={20} /> بياناتك</h2>
        <p className="small">
          نحتفظ بالبريد (مُطبَّعًا) وكلمة مرور مجزّأة بـPBKDF2 وملح وpepper، وتفضيلاتك، وسجل جلساتك.
          لا نستخدم أدوات تحليل، ولا إعلانات، ولا نشارك بياناتك مع أي معلن. التسجيلات الصوتية تبقى في جهازك.
        </p>
      </section>
    </div>
  );
}

export function NotFound({ navigate }: { navigate: (to: string) => void }) {
  return (
    <div className="container narrow">
      <div className="card" style={{ textAlign: 'center' }}>
        <Icon name="search" size={32} label="الصفحة غير موجودة" />
        <h1 style={{ marginTop: 'var(--s-2)' }}>الصفحة غير موجودة</h1>
        <p className="muted">الرابط الذي فتحته غير صحيح أو تغيّر.</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn" onClick={() => navigate('/')}>الصفحة الرئيسية</button>
          <button className="btn secondary" onClick={() => navigate('/learn')}>لوحتي</button>
        </div>
      </div>
    </div>
  );
}
