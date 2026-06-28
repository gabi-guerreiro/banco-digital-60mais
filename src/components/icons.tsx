import type { ReactNode } from "react";

type IconProps = { size?: number; className?: string };

const wrap = (children: ReactNode) => (p: IconProps) => (
  <svg
    width={p.size ?? 24}
    height={p.size ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconHome = wrap(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></>);
export const IconPay = wrap(<><rect x="2.5" y="6" width="19" height="13" rx="2.5" /><path d="M2.5 10h19" /><path d="M6 15h4" /></>);
export const IconChart = wrap(<><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M21 20H3" /></>);
export const IconChat = wrap(<><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-3.8A8.4 8.4 0 1 1 21 11.5Z" /></>);
export const IconMic = wrap(<><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" /><path d="M19 10v1a7 7 0 0 1-14 0v-1" /><path d="M12 18.5V22" /></>);
export const IconBack = wrap(<polyline points="15 18 9 12 15 6" />);
export const IconLock = wrap(<><rect x="4" y="11" width="16" height="10" rx="2.5" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>);
export const IconCheck = wrap(<polyline points="20 6 9 17 4 12" />);
export const IconSpeaker = wrap(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M16 9a4 4 0 0 1 0 6" /><path d="M19 6a8 8 0 0 1 0 12" /></>);
export const IconPhone = wrap(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-5.8-5.8A19.8 19.8 0 0 1 2.3 4.4 2 2 0 0 1 4.3 2.2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 5.3 5.3l1-1a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />);
export const IconUser = wrap(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>);
export const IconText = wrap(<><path d="M4 7V5h16v2" /><path d="M9 19h6" /><path d="M12 5v14" /></>);
export const IconEye = wrap(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>);
export const IconEyeOff = wrap(<><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 8 10 8a18 18 0 0 1-2.5 3.5M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7a10.9 10.9 0 0 0 4-.8" /><path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" /><path d="m2 2 20 20" /></>);
export const IconArrowRight = wrap(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
export const IconShield = wrap(<><path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></>);
export const IconCart = wrap(<><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h2.5l2.2 12.4a1.6 1.6 0 0 0 1.6 1.3h8.8a1.6 1.6 0 0 0 1.6-1.3L21 7H6" /></>);
export const IconPill = wrap(<><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(45 12 12)" /><path d="m9 9 6 6" /></>);
export const IconReceipt = wrap(<><path d="M5 3v18l2-1.4 2 1.4 2-1.4 2 1.4 2-1.4 2 1.4V3l-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4Z" /><path d="M8 8h8M8 12h8" /></>);
export const IconWifi = wrap(<><path d="M2 8.5a16 16 0 0 1 20 0" /><path d="M5 12a11 11 0 0 1 14 0" /><path d="M8.5 15.5a6 6 0 0 1 7 0" /><path d="M12 19h0" /></>);
export const IconSparkles = wrap(<><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" /><path d="M19 14l.7 1.9L21.6 16.6 19.7 17.3 19 19.2 18.3 17.3 16.4 16.6 18.3 15.9 19 14Z" /></>);
export const IconVolume = wrap(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M16 9a4 4 0 0 1 0 6" /><path d="M19 6a8 8 0 0 1 0 12" /></>);
export const IconVolumeOff = wrap(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="m23 9-6 6" /><path d="m17 9 6 6" /></>);
export const IconStop = wrap(<rect x="6" y="6" width="12" height="12" rx="2" />);
export const IconKey = wrap(<><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.5 12.5 8-8" /><path d="m16 4.5 3 3" /><path d="m13.5 7 3 3" /></>);
export const IconSend = wrap(<><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></>);
