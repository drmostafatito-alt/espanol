import { BrandMark, Icon } from '../icons';

export function PublicFooter({ navigate }: { navigate: (to: string) => void }) {
  const link = (label: string, to: string) => (
    <a
      href={to}
      onClick={e => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {label}
    </a>
  );
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <span className="brand" style={{ marginBottom: 'var(--s-2)' }}>
            <span className="brand-mark"><BrandMark size={28} /></span>
            <span>Español<small>تعلّم الإسبانية بالعربي</small></span>
          </span>
          <p className="small" style={{ marginTop: 'var(--s-2)', maxWidth: '38ch' }}>
            منصة عربية لتعلّم الإسبانية من الصفر حتى C1 عبر مواقف واقعية، استماع ونطق، ومراجعة متباعدة.
          </p>
        </div>
        <div>
          <h4>المنصة</h4>
          {link('الرئيسية', '/')}
          {link('لوحة المتعلم', '/learn')}
          {link('البحث في المحتوى', '/search')}
          {link('حزم المفردات', '/review/packs')}
        </div>
        <div>
          <h4>معلومات</h4>
          {link('حدود المنصة والشفافية', '/transparency')}
          {link('تسجيل الدخول', '/login')}
          {link('إنشاء حساب', '/signup')}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Español بالعربي — جميع الحقوق محفوظة.</span>
        <span className="row small" style={{ gap: 6 }}>
          <Icon name="info" size={16} /> صُمم للتعلّم الجاد — بلا شهادات مزيفة أو وعود غير قابلة للتحقق.
        </span>
      </div>
    </footer>
  );
}
