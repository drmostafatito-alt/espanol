import { useEffect, useRef, useState } from 'react';

/** إغلاق القوائم المنبثقة عند الضغط خارجها أو Escape وإدارة التركيز */
export function usePopover(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);
  return ref;
}

/** تفضيل لهجة الشرح للزوار (المستخدمون المسجلون يحفظونه على الخادم عبر /api/me) */
const GUEST_STYLE_KEY = 'es.explanationStyle';
export type ExplanationStyle = 'fusha' | 'fusha_eg' | 'eg';

export function useGuestExplanationStyle(): [ExplanationStyle, (v: ExplanationStyle) => void] {
  const [style, setStyle] = useState<ExplanationStyle>(() => {
    if (typeof window === 'undefined') return 'fusha_eg';
    const raw = window.localStorage.getItem(GUEST_STYLE_KEY);
    return raw === 'fusha' || raw === 'eg' || raw === 'fusha_eg' ? raw : 'fusha_eg';
  });
  const update = (v: ExplanationStyle) => {
    setStyle(v);
    try {
      window.localStorage.setItem(GUEST_STYLE_KEY, v);
    } catch {
      /* وضع خاص — التفضيل يظل لهذه الجلسة فقط */
    }
  };
  return [style, update];
}
