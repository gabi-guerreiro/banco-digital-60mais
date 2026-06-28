"use client";

import { useApp } from "@/context/AppContext";
import { SpecialistFAB } from "@/components/SpecialistFAB";

const CATEGORIES = [
  { label: "Supermercado", value: 380, color: "var(--teal)", pct: 59 },
  { label: "Farmácia", value: 127.3, color: "var(--blue)", pct: 20 },
  { label: "Padaria", value: 82, color: "var(--gold)", pct: 13 },
  { label: "Outros", value: 57, color: "var(--muted)", pct: 9 },
];

export function SummaryScreen() {
  const { back } = useApp();

  return (
    <div className="screen-fade" style={{ position: "absolute", inset: 0, top: 44, overflowY: "auto", background: "#f8f6f4" }}>
      {/* Header */}
      <div style={{ background: "var(--navy-deep)", color: "white", padding: "14px 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={back} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Voltar
        </button>
        <div className="font-serif" style={{ fontSize: 15, fontWeight: 500 }}>
          Resumo <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Semanal</em>
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        {/* Period */}
        <div style={{ textAlign: "center", fontSize: 10, color: "var(--muted)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>
          2 a 8 de junho de 2026
        </div>

        {/* Narrative block */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--slate)", margin: 0 }}>
            Esta semana <strong style={{ color: "var(--navy-deep)" }}>entraram R$ 2.100,00</strong> da sua aposentadoria (INSS).
            Você gastou <strong style={{ color: "var(--navy-deep)" }}>R$ 647,30</strong> no total.
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--slate)", margin: "8px 0 0" }}>
            Seu maior gasto foi com <em style={{ color: "var(--teal)", fontStyle: "italic" }}>supermercado</em> (R$ 380,00),
            seguido de <em style={{ color: "var(--teal)", fontStyle: "italic" }}>farmácia</em> (R$ 127,30) e{" "}
            <em style={{ color: "var(--teal)", fontStyle: "italic" }}>padaria</em> (R$ 82,00).
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--slate)", margin: "8px 0 0" }}>
            Sobrou <strong style={{ color: "var(--navy-deep)" }}>R$ 1.452,70</strong> —{" "}
            <em style={{ color: "var(--green-dark)", fontStyle: "italic" }}>mais do que na semana passada</em>, quando sobraram R$ 1.190.
          </p>
        </div>

        {/* Bar chart */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
            Entradas vs Saídas · Últimas 4 semanas
          </div>
          <svg viewBox="0 0 240 80" width="100%" style={{ display: "block" }}>
            {/* Week 1 */}
            <rect x={10} y={24} width={40} height={44} fill="var(--green)" rx={3} opacity={0.8} />
            <text x={30} y={54} fontSize={8} fill="white" textAnchor="middle" fontFamily="inherit" fontWeight={700}>2,1k</text>
            <rect x={55} y={42} width={40} height={26} fill="var(--coral)" rx={3} opacity={0.6} />
            <text x={75} y={60} fontSize={8} fill="white" textAnchor="middle" fontFamily="inherit" fontWeight={700}>890</text>
            {/* Week 2 */}
            <rect x={110} y={24} width={40} height={44} fill="var(--green)" rx={3} opacity={0.8} />
            <text x={130} y={54} fontSize={8} fill="white" textAnchor="middle" fontFamily="inherit" fontWeight={700}>2,1k</text>
            <rect x={155} y={46} width={40} height={22} fill="var(--coral)" rx={3} opacity={0.6} />
            <text x={175} y={62} fontSize={8} fill="white" textAnchor="middle" fontFamily="inherit" fontWeight={700}>647</text>
            {/* Labels */}
            <text x={30} y={78} fontSize={7} fill="var(--muted)" textAnchor="middle" fontFamily="inherit">Sem 3</text>
            <text x={130} y={78} fontSize={7} fill="var(--muted)" textAnchor="middle" fontFamily="inherit">Sem 4</text>
            {/* Legend */}
            <rect x={180} y={30} width={8} height={8} fill="var(--green)" rx={2} />
            <text x={192} y={38} fontSize={7} fill="var(--muted)" fontFamily="inherit">Entradas</text>
            <rect x={180} y={44} width={8} height={8} fill="var(--coral)" rx={2} />
            <text x={192} y={52} fontSize={7} fill="var(--muted)" fontFamily="inherit">Saídas</text>
          </svg>
        </div>

        {/* Categories breakdown */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
            Gastos por categoria
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CATEGORIES.map(({ label, value, color, pct }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--navy-deep)", fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>R$ {value.toFixed(2).replace(".", ",")}</span>
                </div>
                <div style={{ height: 6, background: "var(--light)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width .6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SpecialistFAB />
    </div>
  );
}
