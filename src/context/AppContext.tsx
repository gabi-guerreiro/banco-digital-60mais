"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type ScreenId =
  | "home"
  | "clara"
  | "pay1"
  | "biometrics"
  | "receipt"
  | "summary"
  | "specialist";

/** Multiplicadores do Modo Clareza Adaptativo (F01). */
export const CLAREZA_LEVELS = [
  { id: 0, label: "Padrão", demo: "Aa", scale: 1 },
  { id: 1, label: "Grande", demo: "Aa", scale: 1.15 },
  { id: 2, label: "Máximo", demo: "Aa", scale: 1.32 },
] as const;

type AppState = {
  started: boolean;
  start: () => void;
  screen: ScreenId;
  navigate: (screen: ScreenId) => void;
  back: () => void;
  resetTo: (screen: ScreenId) => void;
  clareza: number;
  setClareza: (level: number) => void;
  balanceHidden: boolean;
  toggleBalance: () => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<ScreenId[]>(["home"]);
  const [clareza, setClarezaState] = useState(0);
  const [balanceHidden, setBalanceHidden] = useState(false);

  const screen = history[history.length - 1];

  // Aplica a escala do Modo Clareza na superfície do app via custom property.
  useEffect(() => {
    const scale = CLAREZA_LEVELS[clareza]?.scale ?? 1;
    document.documentElement.style.setProperty("--cz", String(scale));
  }, [clareza]);

  const start = useCallback(() => setStarted(true), []);

  const navigate = useCallback((next: ScreenId) => {
    setHistory((prev) => (prev[prev.length - 1] === next ? prev : [...prev, next]));
  }, []);

  const back = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : ["home"]));
  }, []);

  const resetTo = useCallback((target: ScreenId) => setHistory([target]), []);
  const setClareza = useCallback((level: number) => setClarezaState(level), []);
  const toggleBalance = useCallback(() => setBalanceHidden((v) => !v), []);

  return (
    <AppContext.Provider
      value={{ started, start, screen, navigate, back, resetTo, clareza, setClareza, balanceHidden, toggleBalance }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
