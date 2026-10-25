import { BrandMark } from '../icons';

export function PublicFooter({ navigate }: { navigate: (to: string) => void }) {
  const link = (label: string, to: string) => (
    <a
      key={to}
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
      <div className="footer-grid footer-grid-compact">
        <div className="footer-brand">
          <span className="brand">
            <span className="brand-mark"><BrandMark size={28} /></span>
            <span>Español<small>تعلّم الإسبانية بالعربي</small></span>
          </span>
        </div>
        <div>
          <h4>المنصة</h4>
          {link('الرئيسية', '/')}
          {link('لوحة المتعلم', '/learn')}
          {link('البحث في المحتوى', '/search')}
          {link('حزم المفردات', '/review/packs')}
        </div>
        <div>
          <h4>الحساب والشفافية</h4>
          {link('تسجيل الدخول', '/login')}
          {link('إنشاء حساب', '/signup')}
          {link('حدود المنصة والشفافية', '/transparency')}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Español بالعربي</span>
        <span className="small muted">تعلّم جاد بلا شهادات مزيفة أو وعود غير قابلة للتحقق.</span>
      </div>
    </footer>
  );
}
