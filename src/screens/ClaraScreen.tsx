"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";

type Message = { role: "bot" | "user"; text: string };

const KNOWLEDGE: { triggers: string[]; response: string; action?: () => void }[] = [
  {
    triggers: ["paga", "conta", "luz", "boleto", "eletro"],
    response: "Encontrei sua conta de luz da <b>Eletropaulo</b>, no valor de R$ 289,40 — vence amanhã. Quer que eu prepare o pagamento para você confirmar?",
  },
  {
    triggers: ["sim", "quero", "pode", "faz", "confirma", "manda", "prepara"],
    response: "Pronto! Preparei o pagamento. Vou te mostrar o resumo em linguagem simples para você revisar antes de confirmar.",
  },
  {
    triggers: ["saldo", "quanto", "tenho", "sobrou", "disponível"],
    response: "Seu saldo é <b>R$ 4.218,50</b> na conta corrente (Agência 0342). Quer que eu mostre o resumo da semana?",
  },
  {
    triggers: ["extrato", "resumo", "semana", "gastei", "entrou", "gasto"],
    response: "Na última semana entraram <b>R$ 2.100</b> da aposentadoria e saíram <b>R$ 647,30</b>. Seu maior gasto foi com supermercado (R$ 380). Quer ver o resumo completo?",
  },
  {
    triggers: ["transfer", "pix", "envia", "neta", "joana", "filha"],
    response: "Para quem você quer transferir? Pode dizer o nome que eu procuro nos seus contatos recentes.",
  },
  {
    triggers: ["ajuda", "help", "consigo", "difícil", "como", "não sei"],
    response: "Sem problema! Posso te ajudar com: <b>pagamentos</b>, <b>transferências</b>, ver seu <b>saldo</b> ou <b>extrato</b>, ou ligar para uma <b>especialista</b>. O que prefere?",
  },
  {
    triggers: ["pessoa", "humano", "atendente", "especialista", "ligar", "falar"],
    response: "Vou te conectar agora com uma especialista da nossa equipe 60+. Ela já vai ter todo o contexto da nossa conversa. Um momento...",
  },
  {
    triggers: ["obrigad", "valeu", "agradeç", "ótimo", "perfeito"],
    response: "De nada, Maria Lúcia! Estou sempre aqui. Se precisar de qualquer coisa, é só chamar. 😊",
  },
  {
    triggers: ["pix", "segur", "golpe", "fraude", "perig"],
    response: "<b>Pix é seguro</b> quando você faz pelo app do banco. Nunca faça Pix pedido por mensagem, telefone ou link suspeito. Dúvida? Me pergunte ou chame uma especialista.",
  },
];

function matchKnowledge(text: string) {
  const lower = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return KNOWLEDGE.find((k) => k.triggers.some((t) => lower.includes(t)));
}

const QUICK_CHIPS = [
  { label: "Pagar conta de luz", msg: "Paga minha conta de luz" },
  { label: "Ver meu saldo", msg: "Quanto tenho de saldo?" },
  { label: "Resumo da semana", msg: "Me mostra o resumo da semana" },
  { label: "Falar com especialista", msg: "Quero falar com uma pessoa" },
  { label: "PIX é seguro?", msg: "O PIX é seguro?" },
];

export function ClaraScreen() {
  const { back, navigate } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "<b>Olá, Maria Lúcia!</b> Como posso te ajudar? Pode falar ou digitar." },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addMessage(role: "bot" | "user", text: string) {
    setMessages((prev) => [...prev, { role, text }]);
  }

  function handleSend(text: string) {
    if (!text.trim()) return;
    addMessage("user", text);
    setInput("");

    setTimeout(() => {
      const match = matchKnowledge(text);
      if (match) {
        addMessage("bot", match.response);
        if (text.toLowerCase().includes("sim") || text.toLowerCase().includes("confirma") || text.toLowerCase().includes("prepara")) {
          setTimeout(() => navigate("pay1"), 1600);
        } else if (text.toLowerCase().includes("pessoa") || text.toLowerCase().includes("especialista") || text.toLowerCase().includes("ligar")) {
          setTimeout(() => navigate("specialist"), 1800);
        } else if (text.toLowerCase().includes("resumo") || text.toLowerCase().includes("extrato")) {
          setTimeout(() => navigate("summary"), 2000);
        }
      } else {
        addMessage("bot", "Não entendi bem. Pode me dizer de outro jeito? Posso te ajudar com <b>pagamentos</b>, <b>saldo</b>, <b>transferências</b> ou conectar com uma <b>especialista</b>.");
      }
    }, 600);
  }

  function handleVoice() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type AnyWindow = Window & { SpeechRecognition?: new() => any; webkitSpeechRecognition?: new() => any };
    const w = window as AnyWindow;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      addMessage("bot", "Reconhecimento de voz não disponível neste navegador. Por favor, digita sua mensagem.");
      return;
    }
    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: Event) => {
      const sr = e as unknown as { results: { [i: number]: { [j: number]: { transcript: string } } } };
      const transcript = sr.results[0][0].transcript;
      handleSend(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      addMessage("bot", "Não consegui ouvir. Tenta de novo ou digita sua mensagem.");
    };
    recognition.start();
  }

  return (
    <div className="screen-fade" style={{ position: "absolute", inset: 0, top: 44, display: "flex", flexDirection: "column", background: "#f8f6f4" }}>
      {/* Header */}
      <div style={{ background: "var(--navy-deep)", color: "white", padding: "14px 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={back} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Voltar
        </button>
        <div className="font-serif" style={{ fontSize: 15, fontWeight: 500 }}>
          <em style={{ color: "var(--rose)", fontStyle: "italic" }}>Clara</em> · Assistente
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className="msg-slide"
            style={{
              maxWidth: "82%",
              padding: "10px 14px",
              borderRadius: 14,
              fontSize: 12,
              lineHeight: 1.45,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "var(--navy-deep)" : "white",
              color: msg.role === "user" ? "white" : "var(--slate)",
              border: msg.role === "bot" ? "1px solid var(--border)" : "none",
              borderBottomLeftRadius: msg.role === "bot" ? 4 : 14,
              borderBottomRightRadius: msg.role === "user" ? 4 : 14,
            }}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick chips */}
      {messages.length <= 2 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 16px 8px" }}>
          {QUICK_CHIPS.map(({ label, msg }) => (
            <button
              key={label}
              onClick={() => handleSend(msg)}
              style={{ background: "var(--accent)", border: "1px solid var(--border)", borderRadius: 16, padding: "6px 12px", fontFamily: "inherit", fontSize: 10, color: "var(--teal)", fontWeight: 600, cursor: "pointer" }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ display: "flex", gap: 8, padding: "8px 16px 16px", borderTop: "1px solid var(--border)", background: "white" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(input); }}
          placeholder="Diga algo para Clara..."
          style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 20, fontFamily: "inherit", fontSize: 11, background: "white", outline: "none" }}
        />
        <button
          onClick={handleVoice}
          style={{ width: 38, height: 38, borderRadius: "50%", background: isListening ? "var(--coral)" : "var(--teal)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
            <path d="M12 1a3 3 0 013 3v7a3 3 0 01-6 0V4a3 3 0 013-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
