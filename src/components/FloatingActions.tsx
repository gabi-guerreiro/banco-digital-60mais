"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { IconPhone, IconVolume } from "@/components/icons";
import { speak, stopSpeaking } from "@/lib/voice";

export function FloatingActions() {
  const { screen, navigate, speakable } = useApp();
  const [speaking, setSpeaking] = useState(false);

  // Para a fala ao trocar de tela.
  useEffect(() => { stopSpeaking(); setSpeaking(false); }, [screen]);
  useEffect(() => () => stopSpeaking(), []);

  if (screen === "specialist") return null; // já é uma ligação por voz

  const raised = screen === "clara" ? " raised" : "";

  function ouvir() {
    if (speaking) { stopSpeaking(); setSpeaking(false); return; }
    const text = speakable || "Esta é a tela do seu Banco 60+.";
    speak(text, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });
  }

  return (
    <>
      {/* Ouvir em voz alta — disponível em toda função (exceto Clara, que já fala) */}
      {screen !== "clara" && (
        <button
          className={`float-btn float-ouvir${speaking ? " speaking" : ""}`}
          onClick={ouvir}
          aria-label={speaking ? "Parar de ouvir" : "Ouvir esta tela em voz alta"}
        >
          {speaking ? (
            <span className="eqbars"><i /><i /><i /></span>
          ) : (
            <IconVolume size={22} />
          )}
          {speaking ? "Parar" : "Ouvir"}
        </button>
      )}

      {/* Ligar — sempre flutuante e disponível */}
      <button
        className={`float-btn float-ligar${raised}`}
        onClick={() => navigate("specialist")}
        aria-label="Ligar para a Linha Direta 60+"
      >
        <IconPhone size={22} />
        Ligar
      </button>
    </>
  );
}
