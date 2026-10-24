import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../state';
import { Icon } from './icons';
import { usePopover, useGuestExplanationStyle, type ExplanationStyle } from './hooks';
import { EXPLANATION_STYLES } from './tracks';

/**
 * قائمة أسلوب الشرح (فصحى/عامية) — منفصلة تمامًا عن لغة تعلّم الإسبانية.
 * المسجل: يحفظ على الخادم عبر PATCH /api/me. الزائر: تفضيل محلي على جهازه.
 */
export function LanguageMenu() {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [guestStyle, setGuestStyle] = useGuestExplanationStyle();
  const ref = usePopover(open, () => setOpen(false));

  const active: ExplanationStyle = user ? user.explanationStyle : guestStyle;

  async function choose(id: ExplanationStyle) {
    if (id === active || busy) return;
    if (!user) {
      setGuestStyle(id);
      setOpen(false);
      return;
    }
    setBusy(true);
    try {
      const { user: updated } = await api.updateMe({ explanationStyle: id });
      setUser(updated);
      setOpen(false);
    } catch {
      /* يبقى الاختيار القديم ظاهرًا ولا ندّعي الحفظ */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="lang-menu" ref={ref}>
      <button
        type="button"
        className="btn ghost sm"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        style={{ minHeight: 44 }}
      >
        <Icon name="globe" size={20} />
        <span className="lang-label">العربية</span>
        <Icon name="chevron-down" size={16} />
      </button>
      {open && (
        <div className="lang-pop" role="menu" aria-label="أسلوب الشرح والترجمة">
          {EXPLANATION_STYLES.map(opt => (
            <button
              key={opt.id}
              type="button"
              role="menuitemradio"
              aria-checked={active === opt.id}
              disabled={busy}
              onClick={() => void choose(opt.id)}
            >
              <Icon name={active === opt.id ? 'check-circle' : 'globe'} size={20}
                style={{ color: active === opt.id ? 'var(--color-success)' : 'var(--color-muted)' }} />
              <span>
                {opt.label}
                <span className="small muted" style={{ display: 'block', fontWeight: 400 }}>{opt.hint}</span>
              </span>
              {active === opt.id ? <span className="active-dot" aria-hidden="true"><Icon name="check" size={18} /></span> : null}
            </button>
          ))}
          <p className="lang-note">
            {user
              ? 'يُحفظ اختيارك في حسابك. لغة تعلّم الإسبانية تبقى إسبانية كما هي.'
              : 'اختيارك محفوظ على هذا الجهاز، ويُربط بحسابك عند التسجيل.'}
          </p>
        </div>
      )}
    </div>
  );
}
