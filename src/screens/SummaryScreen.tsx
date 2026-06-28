"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { IconBack } from "@/components/icons";

const CATS = [
  { label: "Supermercado", value: "380,00", color: "var(--wine)", pct: 59 },
  { label: "Farmácia", value: "127,30", color: "var(--blue)", pct: 20 },
  { label: "Padaria", value: "82,00", color: "var(--gold)", pct: 13 },
  { label: "Outros", value: "58,00", color: "var(--faint)", pct: 8 },
];

const SUMMARY_SPEAK =
  "Resumo da semana. Entraram dois mil e cem reais da sua aposentadoria. Você gastou seiscentos e quarenta e sete reais e trinta centavos no total. Seu maior gasto foi com supermercado, trezentos e oitenta reais. Sobrou mil, quatrocentos e cinquenta e dois reais e setenta centavos — mais do que na semana passada.";

export function SummaryScreen() {
  const { back, setSpeakable } = useApp();

  useEffect(() => { setSpeakable(SUMMARY_SPEAK); }, [setSpeakable]);

  return (
    <>
      <div className="topbar">
        <button className="iconbtn" onClick={back}><IconBack size={16} /> Voltar</button>
        <div className="topbar-title">Resumo <em>semanal</em></div>
        <div className="topbar-spacer" />
      </div>

      <div className="scroll">
        <div className="pad">
          <div className="sum-period">2 a 8 de junho de 2026</div>

          <div className="sum-block">
            <p>Esta semana <strong>entraram R$ 2.100,00</strong> da sua aposentadoria (INSS). Você gastou <strong>R$ 647,30</strong> no total.</p>
            <p>Seu maior gasto foi com <em>supermercado</em> (R$ 380,00), seguido de <em>farmácia</em> (R$ 127,30) e <em>padaria</em> (R$ 82,00).</p>
            <p>Sobrou <strong>R$ 1.452,70</strong> — <em className="up">mais do que na semana passada</em>, quando sobraram R$ 1.190.</p>
          </div>

          {/* Gráfico de barras */}
          <div className="sum-block">
            <div className="sum-card-title">Entradas vs Saídas · últimas 4 semanas</div>
            <svg viewBox="0 0 260 96" width="100%" aria-hidden="true">
              {[
                { x: 16, in: 78, out: 38, lin: "2,0k", lout: "1,1k", lbl: "Sem 1" },
                { x: 78, in: 80, out: 30, lin: "2,1k", lout: "890", lbl: "Sem 2" },
                { x: 140, in: 78, out: 34, lin: "2,0k", lout: "950", lbl: "Sem 3" },
                { x: 202, in: 80, out: 24, lin: "2,1k", lout: "647", lbl: "Sem 4" },
              ].map((b) => (
                <g key={b.lbl}>
                  <rect x={b.x} y={80 - b.in} width={18} height={b.in} rx={3} fill="var(--green)" opacity={0.85} />
                  <rect x={b.x + 22} y={80 - b.out} width={18} height={b.out} rx={3} fill="var(--coral)" opacity={0.7} />
                  <text x={b.x + 9} y={78 - b.in} fontSize={7} fill="var(--green-dark)" textAnchor="middle" fontFamily="JetBrains Mono">{b.lin}</text>
                  <text x={b.x + 20} y={92} fontSize={7} fill="var(--muted)" textAnchor="middle" fontFamily="JetBrains Mono">{b.lbl}</text>
                </g>
              ))}
            </svg>
          </div>

          {/* Categorias */}
          <div className="sum-block">
            <div className="sum-card-title">Para onde foi o dinheiro</div>
            <div className="cats">
              {CATS.map((c, i) => (
                <div key={c.label}>
                  <div className="cat-row-top">
                    <span className="cat-name">{c.label}</span>
                    <span className="cat-val">R$ {c.value}</span>
                  </div>
                  <div className="cat-bar">
                    <div className="cat-fill" style={{ width: `${c.pct}%`, background: c.color, animationDelay: `${i * 0.1}s` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
