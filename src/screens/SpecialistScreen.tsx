"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export function SpecialistScreen() {
  const { resetTo } = useApp();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="screen-fade" style={{ position: "absolute", inset: 0, top: 44, overflowY: "auto", background: "#f8f6f4" }}>
      {/* Header */}
      <div style={{ background: "var(--green-dark)", color: "white", padding: "14px 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 14 }} />
        <div className="font-serif" style={{ fontSize: 15, fontWeight: 500 }}>
          Linha Direta <em style={{ color: "#a8e6cf", fontStyle: "italic" }}>60+</em>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>● AO VIVO</div>
      </div>

      <div style={{ padding: "24px 16px", textAlign: "center" }}>
        {/* Avatar ring */}
        <div className="ring-pulse" style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid var(--green)", margin: "12px auto", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--green-bg)" }}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth={1.6}>
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx={12} cy={7} r={4} />
          </svg>
        </div>

        <div className="font-serif" style={{ fontSize: 16, color: "var(--navy-deep)", margin: "10px 0 2px", fontWeight: 500 }}>
          Ana Paula
        </div>
        <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, marginBottom: 16 }}>
          Especialista Atendimento 60+ · SP
        </div>

        {/* Timer */}
        <div className="font-serif" style={{ fontSize: 24, color: "var(--green)", marginBottom: 16, fontWeight: 500 }}>
          {mins}:{secs}
        </div>

        {/* Context card */}
        <div style={{ background: "var(--accent)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, textAlign: "left", marginBottom: 14 }}>
          <p style={{ fontSize: 10.5, color: "var(--slate)", lineHeight: 1.45, margin: 0 }}>
            <strong style={{ color: "var(--teal)" }}>Contexto compartilhado:</strong>{" "}
            Maria Lúcia estava na tela de pagamento de boleto Eletropaulo (R$ 289,40). Especialista já tem o histórico da sessão.
          </p>
        </div>

        {/* Wave animation (decorative) */}
        <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 20 }}>
          {[1,2,3,4,5,6,7].map((i) => (
            <div
              key={i}
              style={{ width: 4, background: "var(--green)", borderRadius: 2, animation: `wave ${0.4 + i * 0.1}s ease-in-out infinite alternate`, opacity: 0.7 }}
              className={`h-${[3,6,8,10,8,6,3][i-1]}`}
            />
          ))}
        </div>
        <style>{`
          @keyframes wave {
            from { height: 6px; }
            to { height: ${20}px; }
          }
          div[style*="animation: wave"] {
            height: 6px;
          }
        `}</style>

        {/* End call */}
        <button
          onClick={() => resetTo("home")}
          style={{ padding: "12px 24px", border: "2px solid var(--coral)", borderRadius: 24, background: "transparent", color: "var(--coral)", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}
          onMouseEnter={(e) => { Object.assign((e.currentTarget as HTMLButtonElement).style, { background: "var(--coral)", color: "white" }); }}
          onMouseLeave={(e) => { Object.assign((e.currentTarget as HTMLButtonElement).style, { background: "transparent", color: "var(--coral)" }); }}
        >
          Encerrar chamada
        </button>
      </div>
    </div>
  );
}
