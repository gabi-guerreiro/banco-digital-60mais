"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { IconSpeaker } from "@/components/icons";
import { speak } from "@/lib/voice";

const CONFETTI = [
  { x: 30, c: "var(--rose)", d: 0 }, { x: 90, c: "var(--gold)", d: 0.1 },
  { x: 150, c: "var(--green)", d: 0.05 }, { x: 220, c: "var(--wine-lt)", d: 0.15 },
  { x: 280, c: "var(--rose)", d: 0.08 }, { x: 340, c: "var(--gold)", d: 0.18 },
];

const RECEIPT_SPEAK =
  "Pagamento realizado! Você pagou duzentos e oitenta e nove reais e quarenta centavos para a Eletropaulo, hoje, dez de junho, às catorze horas e trinta e dois minutos. O dinheiro saiu da sua conta. Protocolo: B R, 2026, 0610, 8892.";

export function ReceiptScreen() {
  const { resetTo, setSpeakable } = useApp();
  const [played, setPlayed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  // Confirma em voz alta automaticamente (momento crítico de confiança p/ 60+).
  useEffect(() => {
    setSpeakable(RECEIPT_SPEAK);
    const t = setTimeout(() => { setPlayed(true); speak(RECEIPT_SPEAK, { rate: 0.9 }); }, 700);
    return () => clearTimeout(t);
  }, [setSpeakable]);

  function listen() {
    setPlayed(true);
    speak(RECEIPT_SPEAK, { rate: 0.9 });
  }

  return (
    <div className="scroll">
      <div className="receipt-hero">
        {CONFETTI.map((c, i) => (
          <span key={i} className="confetti" style={{ left: c.x, top: 10, background: c.c, animationDelay: `${c.d}s` }} />
        ))}
        <div className="receipt-check">
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div className="receipt-title">Pagamento realizado!</div>
      </div>

      <div className="pad">
        <div className="receipt-narr">
          <p>
            &ldquo;Você pagou <strong>R$ 289,40</strong> para <strong>Eletropaulo</strong> hoje,
            10 de junho, às 14h32. O dinheiro saiu da sua conta.&rdquo;
          </p>
        </div>

        <div className="receipt-proto">Protocolo: <strong>#BR20260610-8892</strong></div>

        <button className={`listen${played ? " on" : ""}`} onClick={listen}>
          {played ? (
            <>
              <span className="bars"><i /><i /><i /><i /></span>
              Lendo em voz alta…
            </>
          ) : (
            <>
              <IconSpeaker size={19} />
              Ouvir comprovante em voz alta
            </>
          )}
        </button>

        <div className="receipt-acts">
          <button className={`receipt-act${saved ? " done" : ""}`} onClick={() => setSaved(true)}>
            {saved ? "Imagem salva ✓" : "Salvar imagem"}
          </button>
          <button className={`receipt-act${shared ? " done" : ""}`} onClick={() => setShared(true)}>
            {shared ? "Compartilhado ✓" : "Compartilhar"}
          </button>
        </div>

        <button className="btn-primary" onClick={() => resetTo("home")}>Ir para o início</button>
      </div>
    </div>
  );
}
