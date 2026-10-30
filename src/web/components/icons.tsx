/* مكتبة أيقونات SVG داخلية — بلا مكتبات خارجية، تتبع currentColor وتدعم RTL منطقيًا */
import type { ReactElement, SVGProps } from 'react';

export type IconName =
  | 'home' | 'route' | 'tracks' | 'cards' | 'target' | 'trophy' | 'user' | 'settings' | 'logout'
  | 'search' | 'flame' | 'gem' | 'star' | 'lock' | 'check' | 'check-circle' | 'play' | 'arrow-right'
  | 'arrow-left' | 'chevron-down' | 'chevron-up' | 'globe' | 'menu' | 'close' | 'book' | 'headset' | 'chat'
  | 'mic' | 'volume' | 'clock' | 'refresh' | 'mail' | 'key' | 'coffee' | 'plane' | 'utensils'
  | 'briefcase' | 'buildings' | 'sparkles' | 'graduation' | 'sort' | 'warning' | 'info' | 'x-circle'
  | 'image-off' | 'heart' | 'eye' | 'eye-off';

const PATHS: Record<IconName, ReactElement> = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9.5 21v-6h5v6" />,
  route: <><circle cx="6" cy="19" r="2.5" /><circle cx="18" cy="5" r="2.5" /><path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" /></>,
  tracks: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></>,
  cards: <><rect x="3" y="6" width="13" height="15" rx="2" /><path d="M8 3h11a2 2 0 0 1 2 2v12" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5.5A2.5 2.5 0 0 0 8 11M16 6h2.5A2.5 2.5 0 0 1 16 11M9.5 13.5h5M12 13.5V17M9 21h6M10 17h4l.5 4h-5L10 17Z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  flame: <path d="M12 22c4.5 0 7.5-2.9 7.5-7 0-3.4-2.4-5.7-4-7.3-.9-.9-1.5-2-1.5-3.2-1.6 1.2-2.5 2.8-3.4 4.4C9.7 10.4 8.5 11.5 7 12.4 5.9 13.1 4.5 14.6 4.5 17c0 3 3 5 7.5 5Z" />,
  gem: <path d="M6 3h12l4 6-10 12L2 9l4-6Zm-2.5 6h17M9 3 7 9l5 12M15 3l2 6-5 12M2 9h20" />,
  star: <path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z" />,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
  check: <path d="m4 12.5 5 5L20 6.5" />,
  'check-circle': <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  'arrow-right': <path d="M4 12h16m-6-6 6 6-6 6" />,
  'arrow-left': <path d="M20 12H4m6 6-6-6 6-6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-up': <path d="m6 15 6-6 6 6" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" /></>,
  headset: <><path d="M4 13a8 8 0 0 1 16 0" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M20 19v1a3 3 0 0 1-3 3h-3" /></>,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  volume: <><path d="M4 9.5v5h4l5 4V5.5l-5 4H4Z" /><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  refresh: <><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9m-4 4 2 2m-5 1 2 2" /></>,
  coffee: <><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" /><path d="M17 9h2a2.5 2.5 0 0 1 0 5h-2M7 4.5v2M11 4.5v2" /></>,
  plane: <path d="M21 4 10 12.5M21 4l-6.5 17-3.5-7.5L3.5 10 21 4Z" />,
  utensils: <><path d="M7 3v7a2 2 0 0 1-2 2v9M7 3v4M7 3a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3M17 3c-1.7 0-3 2.2-3 5s1.3 5 3 5v8" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
  buildings: <><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></>,
  sparkles: <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Zm7 10 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13ZM5 14l.7 1.8L7.5 16.5 5.7 17.2 5 19l-.7-1.8L2.5 16.5 4.3 15.8 5 14Z" />,
  graduation: <><path d="m12 4 10 5-10 5L2 9l10-5Z" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" /></>,
  sort: <path d="M4 7h12M4 12h9M4 17h6m10-10-3-3m3 3-3 3m3 7-3 3m3-3-3-3" />,
  warning: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 10v4M12 17.5v.5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" /></>,
  'x-circle': <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
  'image-off': <><path d="m3 3 18 18" /><rect x="4" y="6" width="16" height="13" rx="2" /><circle cx="9" cy="11" r="1.5" /><path d="m7 18 4.5-4.5 2.5 2.5 2-2L20 17" /></>,
  heart: <path d="M12 20.5C7 17 3.5 13.8 3.5 10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 3c0 3.8-3.5 7-8.5 10.5Z" />,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  'eye-off': <><path d="m3 3 18 18" /><path d="M10.6 5.9A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.2 3.9M6.2 7.7A16.4 16.4 0 0 0 2.5 12S6 18.5 12 18.5c1.3 0 2.5-.3 3.6-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  title?: string;
}

export function Icon({ name, size = 22, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}

/** شعار الشمس الخاص بالعلامة — ألوان العلامة الرسمية */
export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="شعار Español بالعربي">
      <circle cx="20" cy="20" r="11" fill="#F45B35" />
      <circle cx="20" cy="20" r="6.5" fill="#FFB020" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 20 + Math.cos(a) * 14.5;
        const y1 = 20 + Math.sin(a) * 14.5;
        const x2 = 20 + Math.cos(a) * 18;
        const y2 = 20 + Math.sin(a) * 18;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F45B35" strokeWidth={2.4} strokeLinecap="round" />;
      })}
    </svg>
  );
}

/** علم إسبانيا مصغّر (زخرفي) */
export function SpainFlag({ size = 22 }: { size?: number }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 28 20" aria-hidden="true" style={{ borderRadius: 4, flexShrink: 0 }}>
      <rect width="28" height="20" rx="2.5" fill="#AA151B" />
      <rect y="5" width="28" height="10" fill="#F1BF00" />
    </svg>
  );
}
