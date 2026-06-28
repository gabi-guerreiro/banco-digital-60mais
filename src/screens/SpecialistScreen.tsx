"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { IconUser, IconMic, IconPhone } from "@/components/icons";
import { streamViaProxy, type ChatMsg } from "@/lib/deepseek";
import { CLARA_PROXY_URL } from "@/lib/config";
import { speak, stopSpeaking } from "@/lib/voice";
import { localReply } from "@/lib/claraLocal";

type Cap = { who: "ana" | "user"; text: string };
type Phase = "calling" | "live";

const GREETING = "Alô! Aqui é a Ana Paula, do atendimento do Banco 60+. Em que posso ajudar a senhora hoje?";
const CHIPS = ["Quero pagar minha conta de luz", "O Pix é seguro?", "Quanto tenho de saldo?"];
const HIST_CAP = 12;

export function SpecialistScreen() {
  const { resetTo } = useApp();
  const [phase, setPhase] = useState<Phase>("calling");
  const [seconds, setSeconds] = useState(0);
  const [caps, setCaps] = useState<Cap[]>([]);
  const [listening, setListening] = useState(false);
  const [anaSpeaking, setAnaSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);

  const historyRef = useRef<ChatMsg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);
  const abortRef = useRef<AbortController | null>(null);
  const busy = thinking || listening;

  // Limpeza total ao desmontar: para mic, fetch e voz.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      try { recRef.current?.abort?.(); } catch {}
      try { abortRef.current?.abort(); } catch {}
      stopSpeaking();
    };
  }, []);

  // Toca e atende: depois do "ringing", Ana Paula fala (voz) e abre a conversa.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase("live");
      setCaps([{ who: "ana", text: GREETING }]);
      historyRef.current = [{ role: "assistant", content: GREETING }];
      setAnaSpeaking(true);
      speak(GREETING, { onEnd: () => { if (mountedRef.current) setAnaSpeaking(false); } });
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "live") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [caps, thinking]);

  const ask = useCallback(async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    stopSpeaking();
    setAnaSpeaking(false);
    setCaps((c) => [...c, { who: "user", text: t }]);
    historyRef.current = [...historyRef.current, { role: "user" as const, content: t }].slice(-HIST_CAP);
    setThinking(true);
    const ac = new AbortController();
    abortRef.current = ac;
    let full = "";
    try {
      if (CLARA_PROXY_URL) full = await streamViaProxy(CLARA_PROXY_URL, historyRef.current, () => {}, ac.signal, "atendente");
      else full = localReply(t);
    } catch {
      full = "Desculpe, a ligação ficou ruim por um instante. Pode repetir, por favor?";
    }
    if (!mountedRef.current || ac.signal.aborted) return; // desligou no meio
    setThinking(false);
    const reply = full || "Pode repetir, por favor?";
    setCaps((c) => [...c, { who: "ana", text: reply }]);
    historyRef.current = [...historyRef.current, { role: "assistant" as const, content: reply }].slice(-HIST_CAP);
    setAnaSpeaking(true);
    speak(reply, { onEnd: () => { if (mountedRef.current) setAnaSpeaking(false); } });
  }, [busy]);

  function talk() {
    if (busy) return;
    stopSpeaking();
    setAnaSpeaking(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type W = Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const w = window as W;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setCaps((c) => [...c, { who: "ana", text: "Não consegui ouvir pelo seu aparelho. Toque numa das frases abaixo que eu te ajudo." }]);
      return;
    }
    const rec = new SR();
    recRef.current = rec;
    rec.lang = "pt-BR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => { if (mountedRef.current) setListening(true); };
    rec.onend = () => { if (mountedRef.current) setListening(false); };
    rec.onresult = (e: Event) => {
      if (!mountedRef.current) return;
      const r = e as unknown as { results?: { [i: number]: { [j: number]: { transcript?: string } } } };
      const txt = r.results?.[0]?.[0]?.transcript?.trim();
      if (txt) ask(txt);
      else setCaps((c) => [...c, { who: "ana", text: "Não consegui entender, pode repetir mais devagar?" }]);
    };
    rec.onerror = () => { if (mountedRef.current) setListening(false); };
    try { rec.start(); } catch { setListening(false); }
  }

  function hangUp() {
    try { recRef.current?.abort?.(); } catch {}
    try { abortRef.current?.abort(); } catch {}
    stopSpeaking();
    resetTo("home");
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const statusText = phase === "calling"
    ? "chamando…"
    : listening ? "ouvindo você…"
    : anaSpeaking ? "Ana Paula está falando"
    : thinking ? "Ana Paula está respondendo"
    : "toque no microfone para falar";

  return (
    <>
      <div className="topbar success">
        <div className="topbar-spacer" />
        <div className="topbar-title">Linha Direta <em>60+</em></div>
        <div className="mono" style={{ fontSize: "var(--fs-2xs)", color: "rgba(255,255,255,.7)", letterSpacing: ".08em" }}>● AO VIVO</div>
      </div>

      <div className="call">
        <div className="call-top">
          <div className={`call-ring${phase === "calling" ? " ringing" : ""}`}>
            <IconUser size={32} />
          </div>
          <div className="call-name">Ana Paula</div>
          <div className="call-role">Atendente 60+ · São Paulo {phase === "live" && `· ${mm}:${ss}`}</div>
          <div className="call-status" role="status" aria-live="polite">
            {(listening || anaSpeaking || thinking) && <span className="eqbars" aria-hidden="true"><i /><i /><i /></span>}
            {statusText}
          </div>
        </div>

        <div className="call-captions">
          {caps.map((c, i) => (
            <div key={i} className={`call-cap ${c.who}`}>
              <span className="call-cap-who">{c.who === "ana" ? "Ana Paula" : "Você"}</span>
              {c.text}
            </div>
          ))}
          {thinking && <div className="call-cap ana typing" aria-hidden="true"><i /><i /><i /></div>}
          <div ref={endRef} />
        </div>

        <div className="call-actions">
          {phase === "live" && !busy && (
            <div className="call-chips">
              {CHIPS.map((c) => (
                <button key={c} className="call-chip" onClick={() => ask(c)}>{c}</button>
              ))}
            </div>
          )}

          {phase === "live" && (
            <span className="call-mic-label">
              {listening ? "Pode falar…" : "Toque no microfone para falar"}
            </span>
          )}

          <div className="call-mic-row">
            {phase === "live" && (
              <button
                className={`call-mic${listening ? " listening" : ""}`}
                onClick={talk}
                disabled={thinking}
                aria-label="Falar com a Ana Paula"
              >
                <IconMic size={30} />
              </button>
            )}
            <button className="call-end" onClick={hangUp} aria-label="Encerrar chamada">
              <IconPhone size={26} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
