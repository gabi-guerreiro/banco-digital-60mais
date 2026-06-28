"use client";

import { useApp } from "@/context/AppContext";

export function SpecialistFAB() {
  const { navigate } = useApp();
  return (
    <button
      onClick={() => navigate("specialist")}
      title="Linha Direta · Especialista 60+"
      style={{
        position: "absolute",
        bottom: 20,
        right: 16,
        zIndex: 30,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "var(--coral)",
        color: "white",
        border: "none",
        boxShadow: "0 4px 16px rgba(208,96,96,.4)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform .2s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
    >
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.39 13a19.79 19.79 0 01-3.07-8.67A2 2 0 013.63 1.2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.82a16 16 0 005.29 5.29l.98-.98a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    </button>
  );
}
