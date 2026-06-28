"use client";

import { useApp } from "@/context/AppContext";
import { HomeScreen } from "@/screens/HomeScreen";
import { ClaraScreen } from "@/screens/ClaraScreen";
import { PayScreen } from "@/screens/PayScreen";
import { BiometricsScreen } from "@/screens/BiometricsScreen";
import { ReceiptScreen } from "@/screens/ReceiptScreen";
import { SummaryScreen } from "@/screens/SummaryScreen";
import { SpecialistScreen } from "@/screens/SpecialistScreen";

function StatusBar() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  return (
    <div style={{ height: 44, background: "var(--navy-deep)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 20px 6px", fontSize: 10, color: "rgba(255,255,255,.6)", fontWeight: 600, position: "relative", zIndex: 10 }}>
      <span>{hh}:{mm}</span>
      <span>4G &nbsp; 84%</span>
    </div>
  );
}

function ActiveScreen() {
  const { screen } = useApp();
  switch (screen) {
    case "home":       return <HomeScreen />;
    case "clara":      return <ClaraScreen />;
    case "pay1":       return <PayScreen />;
    case "biometrics": return <BiometricsScreen />;
    case "receipt":    return <ReceiptScreen />;
    case "summary":    return <SummaryScreen />;
    case "specialist": return <SpecialistScreen />;
    default:           return <HomeScreen />;
  }
}

export function PhoneFrame() {
  return (
    <div style={{ width: 310, height: 640, background: "#1a1a1e", borderRadius: 36, padding: 12, boxShadow: "0 20px 60px rgba(58,14,32,.25), 0 0 0 2px rgba(255,255,255,.08)", flexShrink: 0 }}>
      <div style={{ width: "100%", height: "100%", background: "#f8f6f4", borderRadius: 26, overflow: "hidden", position: "relative" }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 28, background: "#1a1a1e", borderRadius: "0 0 18px 18px", zIndex: 20 }}>
          <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 50, height: 6, background: "#2a2a30", borderRadius: 3 }} />
        </div>

        <StatusBar />
        <ActiveScreen />

        {/* Home bar */}
        <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: 100, height: 4, background: "rgba(0,0,0,.15)", borderRadius: 2, zIndex: 25, pointerEvents: "none" }} />
      </div>
    </div>
  );
}
