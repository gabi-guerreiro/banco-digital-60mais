"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { IconBack, IconMic, IconVolume, IconVolumeOff, IconSparkles } from "@/components/icons";
import { streamClara, streamViaProxy, getKey, hasKey, DeepSeekError, type ChatMsg } from "@/lib/deepseek";
import { CLARA_PROXY_URL } from "@/lib/config";
import { detectIntent, localReply } from "@/lib/claraLocal";
import { speak, stopSpeaking, isSpeechSupported } from "@/lib/voice";
import { ClaraConnect } from "@/components/ClaraConnect";

type Msg = { role: "user" | "bot"; text: string };

const CHIPS = [
  { label: "Pagar conta de luz", msg: "Pode pagar minha conta de luz?" },
  { label: "Ver meu saldo", msg: "Quanto eu tenho de saldo?" },
  { label: "Resumo da semana", msg: "Me mostra o resumo da semana" },
  { label: "Falar com pessoa", msg: "Quero falar com uma atendente" },
  { label: "Pix é seguro?", msg: "O Pix é seguro?" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ClaraScreen() {
  const { back, navigate } = useApp();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Olá, Maria Lúcia! Sou a Clara. Pode falar ou escrever — me diga como posso ajudar hoje." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [pending, setPending] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [busy, setBusy] = useState(false);
  const [smart, setSmart] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  const historyRef = useRef<ChatMsg[]>([]);
  const autoSpeakRef = useRef(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSmart(hasKey() || !!CLARA_PROXY_URL); }, []);
  useEffect(() => { autoSpeakRef.current = autoSpeak; }, [autoSpeak]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamText, pending]);
  useEffect(() => () => stopSpeaking(), []);

  const speakReply = useCallback((text: string) => {
    if (!autoSpeakRef.current || !isSpeechSupported()) return;
    speak(text, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });
  }, []);

  const send = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setBusy(true);
    const intent = detectIntent(text);

    const byok = hasKey();
    if (byok || CLARA_PROXY_URL) {
      const hist: ChatMsg[] = [...historyRef.current, { role: "user", content: text }];
      historyRef.current = hist;
      setStreamText("");
      setPending(true);
      let full = "";
      try {
        const onTok = (delta: string) => setStreamText((p) => p + delta);
        full = byok
          ? await streamClara(hist, getKey()!, onTok)
          : await streamViaProxy(CLARA_PROXY_URL, hist, onTok);
      } catch (e) {
        full = e instanceof DeepSeekError ? e.message : "Tive um probleminha para responder agora. Pode tentar de novo?";
      }
      setPending(false);
      setStreamText("");
      const reply = full || "Desculpe, não consegui responder agora.";
      setMessages((m) => [...m, { role: "bot", text: reply }]);
      historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
      speakReply(reply);
    } else {
      setPending(true);
      await sleep(650);
      const reply = localReply(text);
      setPending(false);
      setMessages((m) => [...m, { role: "bot", text: reply }]);
      speakReply(reply);
    }

    setBusy(false);
    if (intent) setTimeout(() => navigate(intent), 1700);
  }, [busy, navigate, speakReply]);

  function voice() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type W = Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const w = window as W;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [...m, { role: "bot", text: "Este navegador não permite ouvir pelo microfone. Pode escrever pra mim aqui embaixo. 🙂" }]);
      return;
    }
    stopSpeaking();
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: Event) => {
      const r = e as unknown as { results: { [i: number]: { [j: number]: { transcript: string } } } };
      send(r.results[0][0].transcript);
    };
    rec.onerror = () => setListening(false);
    rec.start();
  }

  function toggleSpeak() {
    setAutoSpeak((v) => {
      const next = !v;
      if (!next) { stopSpeaking(); setSpeaking(false); }
      return next;
    });
  }

  function onConnected(connected: boolean) {
    setSmart(connected);
    if (connected) {
      const msg = "Pronto! Agora eu entendo você de verdade. Pode me perguntar o que quiser. 💛";
      setMessages((m) => [...m, { role: "bot", text: msg }]);
      speakReply(msg);
    }
  }

  const firstTurn = messages.length <= 1;

  return (
    <>
      <div className="topbar">
        <button className="iconbtn" onClick={back}><IconBack size={16} /> Voltar</button>
        <div className="topbar-title">
          <em>Clara</em>{" "}
          {smart && <span className="smart-pill"><IconSparkles size={10} /> IA</span>}
        </div>
        <div className="clara-hdr-actions">
          <button className={`clara-hdr-btn${autoSpeak ? " on" : ""}`} onClick={toggleSpeak} aria-label={autoSpeak ? "Desligar voz" : "Ligar voz"}>
            {autoSpeak ? <IconVolume size={17} /> : <IconVolumeOff size={17} />}
          </button>
          <button className="clara-hdr-btn" onClick={() => setConnectOpen(true)} aria-label="Conectar Clara Inteligente">
            <IconSparkles size={17} />
          </button>
        </div>
      </div>

      <div className="clara">
        <div className="clara-msgs">
          {!smart && (
            <button className="clara-banner" onClick={() => setConnectOpen(true)}>
              <span className="clara-banner-ic"><IconSparkles size={20} /></span>
              <span className="clara-banner-tx">
                <strong>Ativar Clara Inteligente</strong>
                <span>Conecte a DeepSeek e converse livremente, por voz. Sua chave fica só no aparelho.</span>
              </span>
            </button>
          )}

          {messages.map((m, i) => {
            const isBot = m.role === "bot";
            const listen = () => speak(m.text, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });
            return (
              <div
                key={i}
                className={`msg ${isBot ? "bot" : "user"}`}
                role={isBot ? "button" : undefined}
                tabIndex={isBot ? 0 : undefined}
                aria-label={isBot ? "Ouvir esta mensagem em voz alta" : undefined}
                onClick={isBot ? listen : undefined}
                onKeyDown={isBot ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); listen(); } } : undefined}
                style={isBot ? { cursor: "pointer" } : undefined}
              >
                {m.text}
              </div>
            );
          })}

          {pending && streamText === "" && (
            <div className="msg bot typing" aria-hidden="true"><i /><i /><i /></div>
          )}
          {pending && streamText !== "" && (
            <div className="msg bot">{streamText}<span className="stream-caret" /></div>
          )}
          {speaking && (
            <div className="speaking-hint" role="status" aria-live="polite"><span className="bars" aria-hidden="true"><i /><i /><i /></span> Clara está falando…</div>
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
            placeholder={smart ? "Pergunte qualquer coisa…" : "Escreva ou toque no microfone…"}
            disabled={busy}
          />
          <button className={`mic${listening ? " live" : ""}`} onClick={voice} aria-label="Falar com a Clara">
            <IconMic size={20} />
          </button>
        </div>
      </div>

      {connectOpen && <ClaraConnect onClose={() => setConnectOpen(false)} onChange={onConnected} />}
    </>
  );
}
