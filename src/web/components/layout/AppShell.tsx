import { useState, type FormEvent, type ReactNode } from 'react';
import { useAuth } from '../../state';
import { Icon, type IconName, BrandMark } from '../icons';
import { Avatar } from '../ui';
import { usePopover } from '../hooks';

interface ShellNavItem {
  label: string;
  to: string;
  icon: IconName;
  active: (path: string) => boolean;
}

interface ShellNavGroup {
  heading: string;
  items: ShellNavItem[];
}

export function AppShell({
  children,
  path,
  navigate,
}: {
  children: ReactNode;
  path: string;
  navigate: (to: string) => void;
}) {
  const { user, signOut } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState('');
  const accountRef = usePopover(accountOpen, () => setAccountOpen(false));
  const sheetRef = usePopover(sheetOpen, () => setSheetOpen(false));

  if (!user) return null;

  const navGroups: ShellNavGroup[] = [
    {
      heading: 'التعلّم اليومي',
      items: [
        { label: 'الرئيسية', to: '/learn', icon: 'home', active: p => p === '/learn' },
        { label: 'مسار التعلم', to: '/path', icon: 'route', active: p => p === '/path' },
        { label: 'المراجعة', to: '/review', icon: 'cards', active: p => p === '/review' },
      ],
    },
    {
      heading: 'مكتبة المهارات',
      items: [
        { label: 'المفردات', to: '/vocabulary', icon: 'book', active: p => p === '/vocabulary' || p === '/review/packs' },
        { label: 'القواعد', to: '/grammar', icon: 'sparkles', active: p => p === '/grammar' },
        { label: 'المحادثات', to: '/conversations', icon: 'chat', active: p => p === '/conversations' },
        { label: 'الاستماع', to: '/listening', icon: 'headset', active: p => p === '/listening' },
      ],
    },
    {
      heading: 'التقدّم والحساب',
      items: [
        { label: 'الإحصائيات', to: '/stats', icon: 'trophy', active: p => p === '/stats' },
        { label: 'الملف الشخصي', to: '/profile', icon: 'user', active: p => p === '/profile' },
        { label: 'الإعدادات', to: '/settings', icon: 'settings', active: p => p === '/settings' },
      ],
    },
  ];

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const bottomNav: { label: string; icon: IconName; onClick: () => void; active: boolean }[] = [
    { label: 'الرئيسية', icon: 'home', onClick: () => navigate('/learn'), active: path === '/learn' },
    { label: 'المسار', icon: 'route', onClick: () => navigate('/path'), active: path === '/path' },
    { label: 'المراجعة', icon: 'cards', onClick: () => navigate('/review'), active: path === '/review' },
    { label: 'المحادثات', icon: 'chat', onClick: () => navigate('/conversations'), active: path === '/conversations' },
    { label: 'المزيد', icon: 'menu', onClick: () => setSheetOpen(true), active: false },
  ];

  const goMobile = (to: string) => {
    setSheetOpen(false);
    navigate(to);
  };

  return (
    <div className="app-shell">
      {/* الشريط الجانبي — حاسوب */}
      <aside className="app-sidebar" aria-label="التنقل الرئيسي">
        <div className="sidebar-brand">
          <a
            className="brand"
            href="/learn"
            onClick={e => {
              e.preventDefault();
              navigate('/learn');
            }}
          >
            <span className="brand-mark"><BrandMark size={30} /></span>
            <span>Español<small>منصتك لتعلّم الإسبانية</small></span>
          </a>
        </div>
        <nav className="sidebar-nav">
          {navGroups.map(group => (
            <div className="nav-group" key={group.heading}>
              <span className="nav-group-label">{group.heading}</span>
              {group.items.map(item => (
                <button
                  key={item.to}
                  type="button"
                  className={`nav-item${item.active(path) ? ' active' : ''}`}
                  aria-current={item.active(path) ? 'page' : undefined}
                  onClick={() => navigate(item.to)}
                >
                  <Icon name={item.icon} size={20} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button
            type="button"
            className={`nav-item${path === '/placement' ? ' active' : ''}`}
            onClick={() => navigate('/placement')}
          >
            <Icon name="target" size={20} /> تحديد المستوى
          </button>
          <button type="button" className="nav-item" onClick={() => void signOut().then(() => navigate('/'))}>
            <Icon name="logout" size={20} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="app-main">
        {/* الشريط العلوي */}
        <header className="app-topbar">
          <form className="search-box" onSubmit={onSearch} role="search">
            <Icon name="search" size={19} />
            <input
              type="search"
              placeholder="ابحث عن كلمة أو درس أو قاعدة…"
              aria-label="بحث في المحتوى"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </form>
          <span className="spacer" />
          <div className="account-menu" ref={accountRef}>
            {/* الاسم البصري يُخفى على الشاشات الضيقة، فيبقى الزر بلا اسم لقارئ الشاشة */}
            <button
              type="button"
              className="row"
              style={{ background: 'none', border: 0, cursor: 'pointer', gap: 8, padding: 4, borderRadius: 12, font: 'inherit' }}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              aria-label={`حساب ${user.displayName || user.email}`}
              onClick={() => setAccountOpen(v => !v)}
            >
              <Avatar name={user.displayName} email={user.email} />
              <span className="small account-btn-name" style={{ fontWeight: 700, color: 'var(--color-navy)', textAlign: 'start' }}>
                {user.displayName || 'حسابي'}
              </span>
              <span className="account-btn-chevron"><Icon name="chevron-down" size={16} /></span>
            </button>
            {accountOpen && (
              <div className="account-pop" role="menu">
                <button type="button" role="menuitem" onClick={() => { setAccountOpen(false); navigate('/profile'); }}>
                  <Icon name="user" size={19} /> الملف الشخصي
                </button>
                <button type="button" role="menuitem" onClick={() => { setAccountOpen(false); navigate('/stats'); }}>
                  <Icon name="trophy" size={19} /> الإحصائيات
                </button>
                <button type="button" role="menuitem" onClick={() => { setAccountOpen(false); navigate('/settings'); }}>
                  <Icon name="settings" size={19} /> الإعدادات
                </button>
                <button type="button" role="menuitem" onClick={() => { setAccountOpen(false); navigate('/placement'); }}>
                  <Icon name="target" size={19} /> اختبار تحديد المستوى
                </button>
                <button type="button" role="menuitem" onClick={() => { setAccountOpen(false); navigate('/transparency'); }}>
                  <Icon name="info" size={19} /> حدود المنصة
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setAccountOpen(false); void signOut().then(() => navigate('/')); }}
                >
                  <Icon name="logout" size={19} /> تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="app-content" id="main">{children}</main>
      </div>

      {/* تنقل الموبايل السفلي */}
      <nav className="mobile-nav" aria-label="تنقل سريع">
        <div className="mobile-nav-inner">
          {bottomNav.map(item => (
            <button
              key={item.label}
              type="button"
              className={`mobile-nav-item${item.active ? ' active' : ''}`}
              aria-current={item.active ? 'page' : undefined}
              onClick={item.onClick}
            >
              <Icon name={item.icon} size={22} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {sheetOpen && (
        <div className="mobile-sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-label="كل الأقسام">
          <div className="sheet-panel">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong style={{ fontSize: '1.05rem' }}>أقسام المنصة</strong>
              <button className="btn ghost icon-btn" aria-label="إغلاق" onClick={() => setSheetOpen(false)}>
                <Icon name="close" size={22} />
              </button>
            </div>
            <button type="button" className="nav-item" onClick={() => goMobile('/vocabulary')}>
              <Icon name="book" size={21} /> المفردات
            </button>
            <button type="button" className="nav-item" onClick={() => goMobile('/grammar')}>
              <Icon name="sparkles" size={21} /> القواعد
            </button>
            <button type="button" className="nav-item" onClick={() => goMobile('/listening')}>
              <Icon name="headset" size={21} /> الاستماع والنطق
            </button>
            <button type="button" className="nav-item" onClick={() => goMobile('/stats')}>
              <Icon name="trophy" size={21} /> الإحصائيات
            </button>
            <button type="button" className="nav-item" onClick={() => goMobile('/profile')}>
              <Icon name="user" size={21} /> الملف الشخصي
            </button>
            <button type="button" className="nav-item" onClick={() => goMobile('/review/packs')}>
              <Icon name="cards" size={21} /> حزم المفردات
            </button>
            <button type="button" className="nav-item" onClick={() => goMobile('/placement')}>
              <Icon name="target" size={21} /> اختبار تحديد المستوى
            </button>
            <button type="button" className="nav-item" onClick={() => goMobile('/settings')}>
              <Icon name="settings" size={21} /> الإعدادات
            </button>
            <button
              type="button"
              className="nav-item"
              style={{ color: 'var(--color-danger)' }}
              onClick={() => { setSheetOpen(false); void signOut().then(() => navigate('/')); }}
            >
              <Icon name="logout" size={21} /> تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
