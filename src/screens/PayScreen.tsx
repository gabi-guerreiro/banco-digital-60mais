"use client";

import { useApp } from "@/context/AppContext";
import { IconBack, IconLock } from "@/components/icons";

export function PayScreen() {
  const { back, navigate, resetTo } = useApp();

  return (
    <>
      <div className="topbar">
        <button className="iconbtn" onClick={back}><IconBack size={16} /> Voltar</button>
        <div className="topbar-title"><em>Pagamento</em></div>
        <div className="topbar-spacer" />
      </div>

      <div className="scroll">
        <div className="pad">
          <div className="layer-tag"><span className="dot" /> Camada 1 · Em linguagem simples</div>

          <div className="field">
            <div className="field-label">Para quem</div>
            <div className="field-value">Eletropaulo</div>
            <div className="field-detail">Conta de luz — vence amanhã</div>
          </div>

          <div className="field">
            <div className="field-label">Valor a pagar</div>
            <div className="field-value field-big">R$ 289,40</div>
          </div>

          <div className="narrative">
            <p>
              &ldquo;Você está pagando a conta de luz de maio para{" "}
              <em>Eletropaulo</em>. O valor de <em>R$ 289,40</em> vai sair da sua conta agora.&rdquo;
            </p>
          </div>

          <button className="btn-primary" onClick={() => navigate("biometrics")}>
            <IconLock size={18} /> Confirmar pagamento
          </button>
          <button className="btn-ghost" onClick={() => resetTo("home")}>
            Cancelar — não quero pagar
          </button>
        </div>
      </div>
    </>
  );
}
