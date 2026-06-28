"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { IconUser } from "@/components/icons";

export function SpecialistScreen() {
  const { resetTo } = useApp();
  const [s, setS] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");

  return (
    <>
      <div className="topbar success">
        <div className="topbar-spacer" />
        <div className="topbar-title">Linha Direta <em>60+</em></div>
        <div className="mono" style={{ fontSize: "var(--fs-2xs)", color: "rgba(255,255,255,.7)", letterSpacing: ".08em" }}>● AO VIVO</div>
      </div>

      <div className="scroll">
        <div className="spec">
          <div className="spec-ring"><IconUser size={36} /></div>
          <div className="spec-name">Ana Paula</div>
          <div className="spec-role">Especialista atendimento 60+ · SP</div>
          <div className="spec-timer">{mm}:{ss}</div>

          <div className="spec-ctx">
            <p>
              <strong>Contexto compartilhado:</strong> Maria Lúcia estava na tela de pagamento de
              boleto Eletropaulo (R$ 289,40). A especialista já tem o histórico da sessão.
            </p>
          </div>

          <div className="spec-wave"><i /><i /><i /><i /><i /><i /></div>

          <button className="spec-end" onClick={() => resetTo("home")}>Encerrar chamada</button>
        </div>
      </div>
    </>
  );
}
