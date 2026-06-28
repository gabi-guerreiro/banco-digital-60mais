"use client";

import { useApp } from "@/context/AppContext";
import { SpecialistFAB } from "@/components/SpecialistFAB";

export function PayScreen() {
  const { back, navigate, resetTo } = useApp();

  return (
    <div className="screen-fade" style={{ position: "absolute", inset: 0, top: 44, overflowY: "auto", background: "#f8f6f4" }}>
      {/* Header */}
      <div style={{ background: "var(--navy-deep)", color: "white", padding: "14px 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={back} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Voltar
        </button>
        <div className="font-serif" style={{ fontSize: 15, fontWeight: 500 }}>
          <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Pagamento</em>
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        {/* Layer label */}
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--teal)", marginBottom: 8 }}>
          Camada 1 · Resumo em Linguagem Natural
        </div>

        {/* Destinatário */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: "var(--muted)", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 3 }}>
            Destinatário
          </div>
          <div style={{ fontSize: 14, color: "var(--navy-deep)", fontWeight: 600 }}>Eletropaulo</div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>Conta de luz — vence amanhã</div>
        </div>

        {/* Valor */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: "var(--muted)", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 3 }}>
            Valor a Pagar
          </div>
          <div className="font-serif" style={{ fontSize: 22, color: "var(--navy-deep)", fontWeight: 500 }}>
            R$ 289,40
          </div>
        </div>

        {/* Narrative box */}
        <div style={{ background: "var(--accent)", borderLeft: "3px solid var(--teal)", borderRadius: "0 8px 8px 0", padding: "12px 14px", margin: "12px 0" }}>
          <p style={{ fontSize: 11.5, color: "var(--navy)", lineHeight: 1.5, margin: 0 }}>
            &ldquo;Você está pagando a conta de luz de maio para{" "}
            <em style={{ color: "var(--teal)", fontStyle: "italic", fontWeight: 500 }}>Eletropaulo</em>.
            O valor de{" "}
            <em style={{ color: "var(--teal)", fontStyle: "italic", fontWeight: 500 }}>R$ 289,40</em>{" "}
            vai sair da sua conta agora.&rdquo;
          </p>
        </div>

        {/* Confirm button */}
        <button
          onClick={() => navigate("biometrics")}
          style={{ width: "100%", padding: 14, border: "none", borderRadius: 10, background: "var(--navy-deep)", color: "white", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 12, transition: "all .15s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--teal)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--navy-deep)"; }}
        >
          Confirmar Pagamento
        </button>

        {/* Cancel button */}
        <button
          onClick={() => resetTo("home")}
          style={{ width: "100%", padding: 10, border: "none", background: "transparent", color: "var(--teal-lt)", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer", marginTop: 6 }}
        >
          Cancelar — não quero pagar
        </button>
      </div>

      <SpecialistFAB />
    </div>
  );
}
