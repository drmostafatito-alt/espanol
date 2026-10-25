import { useState } from 'react';
import { BrandMark, Icon } from '../icons';
import { LanguageMenu } from '../LanguageMenu';
import { usePopover } from '../hooks';
import type { ApiUser } from '../../api';

const NAV_LINKS = [
  { label: 'الرئيسية', to: '/' },
  { label: 'المسارات', to: '/learn' },
  { label: 'طريقة التعلم', to: '/#method' },
  { label: 'البحث', to: '/search' },
  { label: 'حدود المنصة', to: '/transparency' },
];

export function PublicHeader({
  navigate,
  user,
}: {
  navigate: (to: string) => void;
  user: ApiUser | null;
}) {
  const [drawer, setDrawer] = useState(false);
  const drawerRef = usePopover(drawer, () => setDrawer(false));

  const go = (to: string) => {
    setDrawer(false);
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      navigate(path || '/');
      if (hash) {
        window.setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
      return;
    }
    navigate(to);
  };

  return (
    <>
      <header className="public-header">
        <div className="header-inner">
          <a
            className="brand"
            href="/"
            onClick={e => {
              e.preventDefault();
              navigate(user ? '/learn' : '/');
            }}
          >
            <span className="brand-mark"><BrandMark size={30} /></span>
            <span>
              Español
              <small>تعلّم الإسبانية بالعربي</small>
            </span>
          </a>

          <nav className="nav-links" aria-label="التنقل الرئيسي">
            {NAV_LINKS.map(l => (
              <a key={l.to} href={l.to} onClick={e => { e.preventDefault(); go(l.to); }}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <LanguageMenu />
            {user ? (
              <button className="btn navy sm" onClick={() => navigate('/learn')}>
                لوحتي <Icon name="arrow-left" size={16} />
              </button>
            ) : (
              <>
                <button className="btn secondary sm" onClick={() => navigate('/login')}>تسجيل الدخول</button>
                <button className="btn sm" onClick={() => navigate('/signup')}>
                  ابدأ الآن <Icon name="arrow-left" size={16} />
                </button>
              </>
            )}
            <button
              className="btn ghost icon-btn menu-toggle"
              aria-label="افتح القائمة"
              aria-expanded={drawer}
              onClick={() => setDrawer(true)}
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>

      {drawer && (
        <div className="mobile-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-label="قائمة التنقل">
          <div className="drawer-panel">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-3)' }}>
              <span className="brand">
                <span className="brand-mark"><BrandMark size={28} /></span>
                <span>Español</span>
              </span>
              <button className="btn ghost icon-btn" aria-label="أغلق القائمة" onClick={() => setDrawer(false)}>
                <Icon name="close" size={24} />
              </button>
            </div>
            {NAV_LINKS.map(l => (
              <a key={l.to} href={l.to} onClick={e => { e.preventDefault(); go(l.to); }}>{l.label}</a>
            ))}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              {user ? (
                <button className="btn navy block" onClick={() => go('/learn')}>لوحتي</button>
              ) : (
                <>
                  <button className="btn secondary block" onClick={() => go('/login')}>تسجيل الدخول</button>
                  <button className="btn block" onClick={() => go('/signup')}>ابدأ الآن</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
