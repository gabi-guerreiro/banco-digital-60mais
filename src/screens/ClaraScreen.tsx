"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { IconBack, IconMic } from "@/components/icons";

type Message = { role: "bot" | "user" | "typing"; text: string };

const KNOWLEDGE: { triggers: string[]; response: string; go?: "pay1" | "summary" | "specialist" }[] = [
  { triggers: ["paga", "conta", "luz", "boleto", "eletro"], response: "Encontrei sua conta de luz da <b>Eletropaulo</b>, no valor de R$ 289,40 — vence amanhã. Quer que eu prepare o pagamento para você confirmar?" },
  { triggers: ["sim", "quero", "pode", "faz", "confirma", "manda", "prepara", "isso"], response: "Pronto! Preparei o pagamento. Vou te mostrar o resumo em linguagem simples para você revisar antes de confirmar.", go: "pay1" },
  { triggers: ["saldo", "quanto", "tenho", "sobrou", "dinheiro"], response: "Seu saldo é <b>R$ 4.218,50</b> na conta corrente (Agência 0342). Quer que eu mostre o resumo da semana?" },
  { triggers: ["extrato", "resumo", "semana", "gastei", "entrou", "gasto"], response: "Na última semana entraram <b>R$ 2.100</b> da aposentadoria e saíram <b>R$ 647,30</b>. Seu maior gasto foi com supermercado. Vou te mostrar o resumo completo.", go: "summary" },
  { triggers: ["pessoa", "humano", "atendente", "especialista", "ligar", "falar", "alguém"], response: "Vou te conectar com uma especialista da nossa equipe 60+. Ela já vai ter todo o contexto da nossa conversa. Um momento…", go: "specialist" },
  { triggers: ["segur", "golpe", "fraude", "perig", "pix é"], response: "<b>Pix é seguro</b> quando você faz pelo app do banco. Nunca faça Pix pedido por mensagem, telefone ou link suspeito. Na dúvida, me chame ou fale com uma especialista." },
  { triggers: ["ajuda", "consigo", "difícil", "como", "não sei"], response: "Sem problema! Posso te ajudar com <b>pagamentos</b>, <b>transferências</b>, ver seu <b>saldo</b> ou <b>extrato</b>, ou ligar para uma <b>especialista</b>. O que você prefere?" },
  { triggers: ["obrigad", "valeu", "agradeç", "ótimo", "perfeito"], response: "De nada, Maria Lúcia! Estou sempre aqui. Se precisar de qualquer coisa, é só me chamar. 💛" },
];

function match(text: string) {
  const lower = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return KNOWLEDGE.find((k) => k.triggers.some((t) => lower.includes(t)));
}

const CHIPS = [
  { label: "Pagar conta de luz", msg: "Paga minha conta de luz" },
  { label: "Ver meu saldo", msg: "Quanto tenho de saldo?" },
  { label: "Resumo da semana", msg: "Me mostra o resumo da semana" },
  { label: "Falar com pessoa", msg: "Quero falar com uma pessoa" },
  { label: "Pix é seguro?", msg: "O Pix é seguro?" },
];

export function ClaraScreen() {
  const { back, navigate } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "<b>Olá, Maria Lúcia!</b> Como posso te ajudar? Você pode falar ou digitar." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function botReply(text: string) {
    setMessages((m) => [...m, { role: "typing", text: "" }]);
    setTimeout(() => {
      const hit = match(text);
      const reply = hit?.response ?? "Não entendi muito bem. Pode dizer de outro jeito? Posso ajudar com <b>pagamentos</b>, <b>saldo</b>, <b>extrato</b> ou chamar uma <b>especialista</b>.";
      setMessages((m) => [...m.filter((x) => x.role !== "typing"), { role: "bot", text: reply }]);
      if (hit?.go) setTimeout(() => navigate(hit.go!), 1500);
    }, 850);
  }

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    botReply(text);
  }

  function voice() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type W = Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const w = window as W;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [...m, { role: "bot", text: "O reconhecimento de voz não está disponível neste navegador. Pode digitar sua mensagem. 🙂" }]);
      return;
    }
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: Event) => {
      const r = e as unknown as { results: { [i: number]: { [j: number]: { transcript: string } } } };
      send(r.results[0][0].transcript);
    };
    rec.onerror = () => { setListening(false); setMessages((m) => [...m, { role: "bot", text: "Não consegui ouvir. Tenta de novo ou digita pra mim." }]); };
    rec.start();
  }

  const firstTurn = messages.filter((m) => m.role !== "typing").length <= 1;

  return (
    <>
      <div className="topbar">
        <button className="iconbtn" onClick={back}><IconBack size={16} /> Voltar</button>
        <div className="topbar-title"><em>Clara</em> · assistente</div>
        <div className="topbar-spacer" />
      </div>

      <div className="clara">
        <div className="clara-msgs">
          {messages.map((m, i) =>
            m.role === "typing" ? (
              <div key={i} className="msg bot typing"><i /><i /><i /></div>
            ) : (
              <div key={i} className={`msg ${m.role}`} dangerouslySetInnerHTML={{ __html: m.text }} />
            )
          )}
          <div ref={endRef} />
        </div>

        {firstTurn && (
          <div className="chips">
            {CHIPS.map((c) => (
              <button key={c.label} className="chip" onClick={() => send(c.msg)}>{c.label}</button>
            ))}
          </div>
        )}

        <div className="clara-input-bar">
          <input
            className="clara-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
            placeholder="Escreva ou toque no microfone…"
          />
          <button className={`mic${listening ? " live" : ""}`} onClick={voice} aria-label="Falar com a Clara">
            <IconMic size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
