"use client";

import { useApp } from "@/context/AppContext";
import { IconPhone } from "@/components/icons";

export function Fab() {
  const { navigate } = useApp();
  return (
    <button className="fab" onClick={() => navigate("specialist")} aria-label="Linha Direta — falar com especialista 60+">
      <IconPhone size={25} />
    </button>
  );
}
