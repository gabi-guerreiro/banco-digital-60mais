"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ScreenId =
  | "home"
  | "clara"
  | "pay1"
  | "biometrics"
  | "receipt"
  | "summary"
  | "specialist";

type AppState = {
  screen: ScreenId;
  history: ScreenId[];
  navigate: (screen: ScreenId) => void;
  back: () => void;
  resetTo: (screen: ScreenId) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<ScreenId[]>(["home"]);

  const screen = history[history.length - 1];

  const navigate = useCallback((next: ScreenId) => {
    setHistory((prev) => {
      if (prev[prev.length - 1] === next) return prev;
      return [...prev, next];
    });
  }, []);

  const back = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : ["home"]));
  }, []);

  const resetTo = useCallback((target: ScreenId) => {
    setHistory([target]);
  }, []);

  return (
    <AppContext.Provider value={{ screen, history, navigate, back, resetTo }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
