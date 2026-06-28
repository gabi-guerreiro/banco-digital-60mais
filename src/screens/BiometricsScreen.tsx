"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SpecialistFAB } from "@/components/SpecialistFAB";

export function BiometricsScreen() {
  const { back, navigate } = useApp();
  const [pin, setPin] = useState<number[]>([]);
  const [bioPressed, setBioPressed] = useState(false);

  function handleDigit(d: number) {
    if (pin.length >= 4) return;
    const next = [...pin, d];
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => navigate("receipt"), 600);
    }
  }

  function handleDelete() {
    setPin((p) => p.slice(0, -1));
  }

  function handleBio() {
    setBioPressed(true);
    setTimeout(() => navigate("receipt"), 1000);
  }

  return (
    <div className="screen-fade" style={{ position: "absolute", inset: 0, top: 44, overflowY: "auto", background: "#f8f6f4" }}>
      {/* Header */}
      <div style={{ background: "var(--navy-deep)", color: "white", padding: "14px 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={back} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Voltar
        </button>
        <div className="font-serif" style={{ fontSize: 15, fontWeight: 500 }}>
          Camada 2 · <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Identidade</em>
        </div>
      </div>

      <div style={{ padding: "24px 16px", textAlign: "center" }}>
        <div className="font-serif" style={{ fontSize: 17, color: "var(--navy-deep)", marginBottom: 6, fontWeight: 500 }}>
          Confirme sua identidade
        </div>
        <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 8 }}>
          para autorizar o pagamento de R$ 289,40
        </div>

        {/* Biometric circle */}
        <button
          onClick={handleBio}
          className="bio-pulse"
          style={{ width: 100, height: 100, borderRadius: "50%", border: `3px solid ${bioPressed ? "var(--green)" : "var(--teal-lt)"}`, margin: "20px auto", display: "flex", alignItems: "center", justifyContent: "center", background: "white", cursor: "pointer", transition: "all .3s" }}
        >
          <svg width={42} height={42} viewBox="0 0 24 24" fill="none" stroke={bioPressed ? "var(--green)" : "var(--teal)"} strokeWidth={1.4}>
            <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </button>

        <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>
          {bioPressed ? "Verificando biometria..." : "Toque aqui para biometria facial / digital"}
        </div>

        {/* OR divider */}
        <div style={{ fontSize: 10, color: "var(--muted)", margin: "12px 0", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
          — ou —
        </div>

        <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 14 }}>
          Use seu PIN de 4 dígitos
        </div>

        {/* PIN dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--border)", background: i < pin.length ? "var(--teal)" : "white", borderColor: i < pin.length ? "var(--teal)" : "var(--border)", transition: "all .2s" }}
            />
          ))}
        </div>

        {/* Numpad */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, maxWidth: 220, margin: "0 auto" }}>
          {[1,2,3,4,5,6,7,8,9].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              style={{ padding: "14px 0", borderRadius: 12, border: "1px solid var(--border)", background: "white", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 18, fontWeight: 500, color: "var(--navy-deep)", cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={(e) => { Object.assign((e.currentTarget as HTMLButtonElement).style, { background: "var(--light)", borderColor: "var(--teal-lt)" }); }}
              onMouseLeave={(e) => { Object.assign((e.currentTarget as HTMLButtonElement).style, { background: "white", borderColor: "var(--border)" }); }}
            >
              {d}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit(0)}
            style={{ padding: "14px 0", borderRadius: 12, border: "1px solid var(--border)", background: "white", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 18, fontWeight: 500, color: "var(--navy-deep)", cursor: "pointer" }}
          >0</button>
          <button
            onClick={handleDelete}
            style={{ padding: "14px 0", borderRadius: 12, border: "1px solid var(--border)", background: "white", fontFamily: "inherit", fontSize: 11, color: "var(--muted)", cursor: "pointer" }}
          >⌫</button>
        </div>
      </div>

      <SpecialistFAB />
    </div>
  );
}
