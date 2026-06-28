"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

export function ReceiptScreen() {
  const { resetTo } = useApp();
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  function handleListen() {
    if (!("speechSynthesis" in window)) {
      setAudioPlayed(true);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(
      "Você pagou duzentos e oitenta e nove reais e quarenta centavos para Eletropaulo hoje, dez de junho, às catorze horas e trinta e dois minutos. O dinheiro saiu da sua conta. Protocolo B R 2026 0610 8892."
    );
    utter.lang = "pt-BR";
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
    setAudioPlayed(true);
  }

  return (
    <div className="screen-fade" style={{ position: "absolute", inset: 0, top: 44, overflowY: "auto", background: "#f8f6f4" }}>
      <div style={{ padding: "10px 16px 0" }}>
        <button
          onClick={() => resetTo("home")}
          style={{ color: "var(--teal)", fontSize: 11, cursor: "pointer", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", fontWeight: 600 }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Início
        </button>
      </div>

      {/* Success banner */}
      <div style={{ background: "linear-gradient(135deg, #eaf6f2, #dff0ea)", padding: "24px 16px 20px", textAlign: "center" }}>
        <div className="check-pop" style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="font-serif" style={{ fontSize: 18, color: "var(--green-dark)", fontWeight: 500 }}>
          Pagamento realizado!
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Narrative */}
        <div style={{ background: "white", border: "1px solid #b8ddd1", borderLeft: "3px solid var(--green)", borderRadius: "0 8px 8px 0", padding: "12px 14px", marginBottom: 14 }}>
          <p style={{ fontSize: 11.5, color: "var(--slate)", lineHeight: 1.5, margin: 0 }}>
            &ldquo;Você pagou{" "}
            <strong style={{ color: "var(--green-dark)" }}>R$ 289,40</strong> para{" "}
            <strong style={{ color: "var(--green-dark)" }}>Eletropaulo</strong>{" "}
            hoje, 10 de junho, às 14h32. O dinheiro saiu da sua conta.&rdquo;
          </p>
        </div>

        {/* Protocol */}
        <div style={{ textAlign: "center", fontSize: 10, color: "var(--muted)", fontWeight: 700, letterSpacing: ".06em", marginBottom: 14 }}>
          Protocolo:{" "}
          <strong className="font-serif" style={{ color: "var(--navy-deep)", fontSize: 12 }}>
            #BR20260610-8892
          </strong>
        </div>

        {/* Listen button */}
        <button
          onClick={handleListen}
          style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 10, background: audioPlayed ? "var(--green-bg)" : "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600, color: audioPlayed ? "var(--green-dark)" : "var(--navy-deep)", marginBottom: 10, transition: "all .3s" }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={audioPlayed ? "var(--green)" : "var(--teal)"} strokeWidth={2}>
            {audioPlayed
              ? <polyline points="20 6 9 17 4 12" />
              : <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" /></>}
          </svg>
          {audioPlayed ? "Comprovante lido em voz alta ✓" : "Ouvir comprovante em voz alta"}
        </button>

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setSaved(true)}
            style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 8, background: saved ? "var(--green-bg)" : "white", textAlign: "center", cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: 600, color: saved ? "var(--green-dark)" : "var(--slate)" }}
          >
            {saved ? "Imagem salva ✓" : "Salvar imagem"}
          </button>
          <button
            onClick={() => setShared(true)}
            style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 8, background: shared ? "var(--green-bg)" : "white", textAlign: "center", cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: 600, color: shared ? "var(--green-dark)" : "var(--slate)" }}
          >
            {shared ? "Compartilhado ✓" : "Compartilhar"}
          </button>
        </div>

        {/* Home button */}
        <button
          onClick={() => resetTo("home")}
          style={{ width: "100%", padding: 14, border: "none", borderRadius: 10, background: "var(--navy-deep)", color: "white", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .15s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--teal)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--navy-deep)"; }}
        >
          Ir para o início
        </button>
      </div>
    </div>
  );
}
