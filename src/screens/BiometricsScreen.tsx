"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { IconBack, IconLock } from "@/components/icons";

const BIO_SPEAK =
  "Confirme que é você para autorizar o pagamento de duzentos e oitenta e nove reais e quarenta centavos. Toque no círculo para usar o rosto ou a digital, ou digite seu PIN de quatro dígitos.";

export function BiometricsScreen() {
  const { back, navigate, setSpeakable } = useApp();
  const [pin, setPin] = useState<number[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => { setSpeakable(BIO_SPEAK); }, [setSpeakable]);

  // Navega ao completar 4 dígitos — robusto mesmo com toques rápidos.
  useEffect(() => {
    if (pin.length < 4) return;
    const t = setTimeout(() => navigate("receipt"), 520);
    return () => clearTimeout(t);
  }, [pin, navigate]);

  function pushDigit(d: number) {
    setPin((prev) => (prev.length >= 4 ? prev : [...prev, d]));
  }

  function bio() {
    setScanning(true);
    setTimeout(() => navigate("receipt"), 1100);
  }

  return (
    <>
      <div className="topbar">
        <button className="iconbtn" onClick={back}><IconBack size={16} /> Voltar</button>
        <div className="topbar-title">Camada 2 · <em>Identidade</em></div>
        <div className="topbar-spacer" />
      </div>

      <div className="scroll">
        <div className="bio">
          <h2>Confirme que é você</h2>
          <div className="bio-sub">para autorizar o pagamento de R$ 289,40</div>

          <button className={`bio-orb${scanning ? " ok" : ""}`} onClick={bio} aria-label="Autenticar com biometria">
            <IconLock size={46} />
          </button>
          <div className="bio-hint">{scanning ? "Verificando…" : "Toque para usar o rosto ou a digital"}</div>

          <div className="bio-or">— ou use seu PIN —</div>

          <div className="bio-dots">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`bio-dot${i < pin.length ? " fill" : ""}`} />
            ))}
          </div>

          <div className="pad-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <button key={d} className="pad-key" onClick={() => pushDigit(d)}>{d}</button>
            ))}
            <span />
            <button className="pad-key" onClick={() => pushDigit(0)}>0</button>
            <button className="pad-key fn" onClick={() => setPin((p) => p.slice(0, -1))} aria-label="Apagar">⌫</button>
          </div>
        </div>
      </div>
    </>
  );
}
