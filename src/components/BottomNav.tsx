"use client";

import { useApp, type ScreenId } from "@/context/AppContext";
import { IconHome, IconPay, IconChart, IconMic } from "@/components/icons";

const TABS: { id: ScreenId; label: string; icon: React.ReactNode; match: ScreenId[] }[] = [
  { id: "home", label: "Início", icon: <IconHome size={23} />, match: ["home"] },
  { id: "pay1", label: "Pagar", icon: <IconPay size={23} />, match: ["pay1", "biometrics", "receipt"] },
  { id: "summary", label: "Extrato", icon: <IconChart size={23} />, match: ["summary"] },
  { id: "clara", label: "Clara", icon: <IconMic size={23} />, match: ["clara"] },
];

export function BottomNav() {
  const { screen, resetTo } = useApp();

  return (
    <nav className="botnav" aria-label="Navegação principal">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`botnav-btn${t.match.includes(screen) ? " on" : ""}`}
          onClick={() => resetTo(t.id)}
          aria-current={t.match.includes(screen) ? "page" : undefined}
        >
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
