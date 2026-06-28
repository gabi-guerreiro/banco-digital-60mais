import { AppProvider } from "@/context/AppContext";
import { PhoneFrame } from "@/components/PhoneFrame";

const STEPS = [
  { num: 1, title: "Tela Inicial — Login + Saldo", desc: "Saldo em fonte 28px. Menu simplificado.", tag: "F01 Clareza" },
  { num: 2, title: "Clara — Assistente por Voz", desc: '"Clara, paga minha conta de luz." NLP coloquial.', tag: "F02 Clara" },
  { num: 3, title: "Camada 1 — Linguagem Natural", desc: "Transação traduzida para conversa. Sem jargão.", tag: "F03 Confirmação" },
  { num: 4, title: "Camada 2 — Biometria + PIN", desc: "Confirmação de identidade antes de qualquer saída.", tag: "F03 Confirmação" },
  { num: 5, title: "Camada 3 — Comprovante Persistente", desc: "Voz confirma. Protocolo numerado. Salvar. Compartilhar.", tag: "F03 Confirmação" },
  { num: 6, title: "Resumo Narrativo Semanal", desc: "Dados viram história. Controle financeiro devolvido.", tag: "F04 Resumo" },
  { num: 7, title: "Linha Direta — Especialista 60+", desc: "Um toque. Humano em <2min. Contexto compartilhado.", tag: "F05 Especialista" },
];

export default function HomePage() {
  return (
    <AppProvider>
      <main style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Header */}
        <div style={{ width: "100%", background: "var(--navy)", padding: "28px 40px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--rose)", marginBottom: 10 }}>
              Banco Digital 60+ · Design Thinking
            </div>
            <h1 className="font-serif" style={{ fontSize: 26, fontWeight: 400, color: "white", lineHeight: 1.15, maxWidth: 560 }}>
              App Bancário Adaptado ao <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Segmento 60+</em>
            </h1>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255,255,255,.5)", lineHeight: 1.9, flexShrink: 0 }}>
            <strong style={{ color: "rgba(255,255,255,.9)", display: "block", fontSize: 13 }}>Marília Pinheiro</strong>
            Módulo 2 · Semana 10 · Design Thinking
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,160,180,.2)", border: "1px solid rgba(232,160,180,.35)", padding: "4px 10px", borderRadius: 20, marginTop: 10, fontSize: 10, fontWeight: 700, color: "var(--rose)", textTransform: "uppercase" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rose)", display: "inline-block", animation: "pulse 2s ease infinite" }} />
              Demo Interativo
            </div>
          </div>
        </div>

        {/* Gradient bar */}
        <div style={{ height: 4, width: "100%", background: "linear-gradient(90deg, var(--navy) 0%, var(--teal) 35%, var(--teal-lt) 60%, var(--rose) 80%, var(--light) 100%)" }} />

        {/* Main content */}
        <div style={{ width: "100%", maxWidth: 1100, padding: "36px 40px 48px", display: "grid", gridTemplateColumns: "340px 1fr", gap: 48 }}>

          {/* Phone */}
          <div style={{ position: "sticky", top: 24, alignSelf: "flex-start" }}>
            <PhoneFrame />
          </div>

          {/* Side panel */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--teal)", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 2, background: "var(--teal)", display: "inline-block" }} />
              Jornada Interativa
            </div>
            <h2 className="font-serif" style={{ fontSize: 24, fontWeight: 500, color: "var(--navy-deep)", marginBottom: 8, lineHeight: 1.15 }}>
              Percorra a jornada da <em style={{ fontStyle: "italic", color: "var(--teal)" }}>Maria Lúcia</em> em tempo real
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 24 }}>
              Interaja diretamente no celular à esquerda. Navegue pelas telas, converse com a Clara,
              complete o pagamento e ouça o comprovante em voz alta. Cada passo abaixo descreve o que você vai encontrar.
            </p>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {STEPS.map(({ num, title, desc, tag }) => (
                <div key={num} style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, alignItems: "center", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8, background: "white" }}>
                  <div className="font-serif" style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--light)", color: "var(--muted)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {num}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 2 }}>{title}</h4>
                    <p style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.3, margin: 0 }}>{desc}</p>
                  </div>
                  <span style={{ fontSize: 8, fontWeight: 800, color: "var(--teal)", background: "var(--accent)", padding: "3px 7px", borderRadius: 3, letterSpacing: ".06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Principles card */}
            <div style={{ background: "linear-gradient(135deg, var(--navy-deep), var(--navy))", borderRadius: 10, padding: "16px 18px", color: "white", marginBottom: 16 }}>
              <h4 className="font-serif" style={{ fontSize: 14, fontWeight: 500, color: "var(--rose)", marginBottom: 6 }}>
                Princípios ativos nesta demonstração
              </h4>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.75)", lineHeight: 1.55, margin: 0 }}>
                <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Norman:</em> Visibilidade (saldo imediato), Feedback (3 camadas), Affordance (botões 48dp+).{" "}
                <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Gestalt:</em> Proximidade (cards), Figura/Fundo (contraste 7:1), Prägnanz (1 intenção por tela).{" "}
                <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Nielsen:</em> H1 (status), H2 (linguagem real), H5 (prevenção de erros), H10 (especialista visível).
              </p>
            </div>

            {/* Feature badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["F01 Modo Clareza", "F02 Assistente Clara", "F03 Confirmação 3 Camadas", "F04 Resumo Narrativo", "F05 Linha Direta 60+"].map((f) => (
                <span key={f} style={{ fontSize: 10, fontWeight: 700, color: "var(--teal)", background: "var(--accent)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 20 }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

      </main>
    </AppProvider>
  );
}
