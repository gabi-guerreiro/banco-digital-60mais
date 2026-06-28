"use client";

import { useApp } from "@/context/AppContext";
import { SpecialistFAB } from "@/components/SpecialistFAB";

export function HomeScreen() {
  const { navigate } = useApp();

  return (
    <div className="screen-fade" style={{ position: "absolute", inset: 0, top: 44, overflowY: "auto", background: "#f8f6f4" }}>

      {/* Greeting header */}
      <div style={{ padding: "18px 18px 10px", background: "linear-gradient(135deg, var(--navy-deep), var(--navy))", color: "white" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginBottom: 2 }}>Boa tarde,</div>
        <div className="font-serif" style={{ fontSize: 20, fontWeight: 500 }}>
          <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Maria Lúcia</em>
        </div>
      </div>

      {/* Saldo card */}
      <div style={{ margin: "-4px 16px 0", background: "white", borderRadius: 12, padding: "16px 18px", boxShadow: "0 4px 16px rgba(58,14,32,.08)", position: "relative", zIndex: 5 }}>
        <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
          Saldo Disponível
        </div>
        <div className="font-serif" style={{ fontSize: 28, color: "var(--navy-deep)", fontWeight: 500, margin: "4px 0" }}>
          R$ 4.218,50
        </div>
        <div style={{ fontSize: 10, color: "var(--muted)" }}>
          Conta corrente · Ag 0342 · CC 18745-9
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "16px 16px 12px" }}>
        {[
          { label: "Pagar", screen: "pay1" as const, icon: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /> },
          { label: "Pix", screen: "pay1" as const, icon: <><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></> },
          { label: "Extrato", screen: "summary" as const, icon: <><rect x={3} y={3} width={18} height={18} rx={2} /><line x1={3} y1={9} x2={21} y2={9} /><line x1={9} y1={21} x2={9} y2={9} /></> },
          { label: "Clara", screen: "clara" as const, icon: <><path d="M12 1a3 3 0 013 3v7a3 3 0 01-6 0V4a3 3 0 013-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /></> },
        ].map(({ label, screen, icon }) => (
          <button
            key={label}
            onClick={() => navigate(screen)}
            style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 4px 10px", textAlign: "center", cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={(e) => { Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: "var(--teal-lt)", transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(58,14,32,.06)" }); }}
            onMouseLeave={(e) => { Object.assign((e.currentTarget as HTMLButtonElement).style, { borderColor: "var(--border)", transform: "translateY(0)", boxShadow: "none" }); }}
          >
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 6px" }}>
              {icon}
            </svg>
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--navy-deep)", letterSpacing: ".02em" }}>{label}</div>
          </button>
        ))}
      </div>

      {/* Clara widget */}
      <button
        onClick={() => navigate("clara")}
        style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 16px 12px", background: "linear-gradient(135deg, var(--accent), white)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all .15s", width: "calc(100% - 32px)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--teal-lt)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
      >
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--navy))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
            <path d="M12 1a3 3 0 013 3v7a3 3 0 01-6 0V4a3 3 0 013-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
          </svg>
        </div>
        <div style={{ textAlign: "left" }}>
          <strong style={{ color: "var(--navy-deep)", display: "block", fontSize: 12, marginBottom: 1 }}>Clara, assistente por voz</strong>
          <span style={{ fontSize: 11, color: "var(--slate)" }}>Diga &ldquo;Clara, paga minha conta de luz&rdquo;</span>
        </div>
      </button>

      {/* Weekly summary card */}
      <button
        onClick={() => navigate("summary")}
        style={{ display: "block", margin: "0 16px 16px", background: "white", border: "1px solid var(--border)", borderLeft: "3px solid var(--green)", borderRadius: "0 10px 10px 0", padding: "12px 14px", cursor: "pointer", textAlign: "left", width: "calc(100% - 32px)" }}
      >
        <div style={{ fontSize: 9, fontWeight: 800, color: "var(--green-dark)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>
          Resumo da Semana
        </div>
        <div style={{ fontSize: 11, color: "var(--slate)", lineHeight: 1.45 }}>
          Esta semana entraram <strong style={{ color: "var(--navy-deep)" }}>R$ 2.100</strong> e saíram{" "}
          <strong style={{ color: "var(--navy-deep)" }}>R$ 647</strong>. Seu maior gasto foi com supermercado.
        </div>
      </button>

      <SpecialistFAB />
      <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: 100, height: 4, background: "rgba(0,0,0,.15)", borderRadius: 2, zIndex: 25 }} />
    </div>
  );
}
