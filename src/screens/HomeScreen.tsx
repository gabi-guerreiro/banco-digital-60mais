"use client";

import { useApp } from "@/context/AppContext";
import {
  IconPay, IconChart, IconChat, IconMic, IconEye, IconEyeOff,
  IconArrowRight, IconCart, IconPill, IconReceipt,
} from "@/components/icons";

const QUICK = [
  { label: "Pagar", screen: "pay1" as const, icon: <IconPay size={21} /> },
  { label: "Pix", screen: "pay1" as const, icon: <IconArrowRight size={21} /> },
  { label: "Extrato", screen: "summary" as const, icon: <IconChart size={21} /> },
  { label: "Clara", screen: "clara" as const, icon: <IconMic size={21} /> },
];

const TX = [
  { name: "Aposentadoria · INSS", date: "10 jun · 09:12", val: "+ 2.100,00", dir: "in" as const, icon: <IconArrowRight size={18} />, bg: "var(--green-bg)", st: "var(--green-dark)" },
  { name: "Supermercado Pão de Açúcar", date: "08 jun · 17:40", val: "− 380,00", dir: "out" as const, icon: <IconCart size={18} />, bg: "var(--paper-2)", st: "var(--wine)" },
  { name: "Farmácia São Paulo", date: "06 jun · 11:05", val: "− 127,30", dir: "out" as const, icon: <IconPill size={18} />, bg: "var(--paper-2)", st: "var(--wine)" },
  { name: "Conta de luz · Eletropaulo", date: "04 jun · 08:30", val: "− 264,10", dir: "out" as const, icon: <IconReceipt size={18} />, bg: "var(--paper-2)", st: "var(--wine)" },
];

export function HomeScreen() {
  const { navigate, balanceHidden, toggleBalance } = useApp();

  return (
    <div className="scroll">
      {/* Hero */}
      <div className="home-hero">
        <svg className="home-hero-art" viewBox="0 0 200 200" aria-hidden="true">
          {[40, 70, 100].map((r) => (
            <circle key={r} cx="140" cy="60" r={r} fill="none" stroke="#e8a0b4" strokeOpacity="0.25" />
          ))}
        </svg>
        <div className="home-greet rise">Boa tarde,</div>
        <div className="home-name rise d1">
          <em>Maria Lúcia</em>
        </div>
      </div>

      {/* Saldo */}
      <div className="balance-card rise d2">
        <div className="balance-row">
          <span className="balance-label">Saldo disponível</span>
          <button className="balance-eye" onClick={toggleBalance} aria-label={balanceHidden ? "Mostrar saldo" : "Ocultar saldo"}>
            {balanceHidden ? <IconEye size={19} /> : <IconEyeOff size={19} />}
          </button>
        </div>
        <div className={`balance-value${balanceHidden ? " hidden" : ""}`}>
          {balanceHidden ? "R$ ••••••" : "R$ 4.218,50"}
        </div>
        <div className="balance-sub">Conta corrente · Ag 0342 · CC 18745-9</div>
      </div>

      {/* Ações rápidas */}
      <div className="quick">
        {QUICK.map(({ label, screen, icon }, i) => (
          <button key={label} className={`quick-btn rise d${i + 2}`} onClick={() => navigate(screen)}>
            <span className="quick-ic">{icon}</span>
            <span className="quick-label">{label}</span>
          </button>
        ))}
      </div>

      {/* Clara CTA */}
      <button className="clara-cta rise d3" onClick={() => navigate("clara")}>
        <span className="clara-cta-orb"><IconMic size={21} /></span>
        <span className="clara-cta-tx">
          <strong>Clara, sua assistente</strong>
          <span>Toque e diga: &ldquo;paga minha conta de luz&rdquo;</span>
        </span>
      </button>

      {/* Resumo semanal */}
      <div className="section-tag">Resumo da semana</div>
      <button className="weekly rise" onClick={() => navigate("summary")}>
        <div className="weekly-tx">
          Esta semana entraram <strong>R$ 2.100</strong> e saíram <strong>R$ 647</strong>.
          Seu maior gasto foi com supermercado.
        </div>
        <div className="weekly-go">Ver resumo completo →</div>
      </button>

      {/* Últimas movimentações */}
      <div className="section-tag">Últimas movimentações</div>
      <div className="tx-list">
        {TX.map((t) => (
          <div className="tx-item" key={t.name}>
            <span className="tx-ic" style={{ background: t.bg, color: t.st }}>{t.icon}</span>
            <div className="tx-meta">
              <div className="tx-name">{t.name}</div>
              <div className="tx-date">{t.date}</div>
            </div>
            <div className={`tx-val ${t.dir}`}>{t.val}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 12 }} />
    </div>
  );
}
