// ════════════════════════════════════════════════
// Voz — voz neural pt-BR feminina via proxy (Google TTS),
// que substitui a voz "robótica" do sistema. Cai para a melhor
// voz local do navegador se a rede/proxy falhar.
// ════════════════════════════════════════════════

import { CLARA_TTS_URL } from "@/lib/config";

const FEMALE = [
  "francisca", "thalita", "brenda", "giovanna", "leila", "manuela", "yara",
  "elza", "fabiana", "luciana", "joana", "catarina", "fernanda", "vitória",
  "vitoria", "maria", "helena", "camila", "heloísa", "heloisa", "letícia", "leticia", "ana",
];
const MALE = [
  "antónio", "antonio", "daniel", "felipe", "heitor", "júlio", "julio", "fábio",
  "fabio", "benício", "benicio", "bento", "donato", "humberto", "nicolau",
  "valério", "valerio", "ricardo", "joaquim", "duarte",
];

let cached: SpeechSynthesisVoice | null = null;
let cachedName = "";
let currentAudio: HTMLAudioElement | null = null;
let unlockAudio: HTMLAudioElement | null = null;

function score(v: SpeechSynthesisVoice): number {
  const name = (v.name || "").toLowerCase();
  const lang = (v.lang || "").toLowerCase().replace("_", "-");
  let s = -1;
  if (lang.startsWith("pt-br")) s = 100;
  else if (lang.startsWith("pt")) s = 55;
  else return -1;
  if (FEMALE.some((f) => name.includes(f))) s += 60;
  if (MALE.some((m) => name.includes(m))) s -= 90;
  if (name.includes("natural") || name.includes("online")) s += 55;
  if (name.includes("google")) s += 25;
  if (name.includes("microsoft")) s += 12;
  return s;
}

export function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;
  for (const v of voices) {
    const sc = score(v);
    if (sc > bestScore) { bestScore = sc; best = v; }
  }
  return best;
}

export function primeVoices(onReady?: (name: string) => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const load = () => {
    const v = pickVoice();
    if (v) { cached = v; cachedName = v.name; onReady?.(v.name); }
  };
  load();
  window.speechSynthesis.onvoiceschanged = load;
  setTimeout(load, 300);
}

export function currentVoiceName(): string {
  return CLARA_TTS_URL ? "Google pt-BR (neural)" : (cachedName || pickVoice()?.name || "");
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && ("speechSynthesis" in window || "Audio" in window);
}

type SpeakOpts = { rate?: number; pitch?: number; onStart?: () => void; onEnd?: () => void };

function speakBrowser(text: string, opts: SpeakOpts) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) { opts.onEnd?.(); return; }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = cached || pickVoice();
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "pt-BR"; }
  u.rate = opts.rate ?? 0.95;
  u.pitch = opts.pitch ?? 1.02;
  u.volume = 1;
  u.onstart = () => opts.onStart?.();
  u.onend = () => opts.onEnd?.();
  u.onerror = () => opts.onEnd?.();
  synth.speak(u);
}

async function speakNeural(text: string, opts: SpeakOpts): Promise<boolean> {
  try {
    const res = await fetch(`${CLARA_TTS_URL}?text=${encodeURIComponent(text)}`);
    if (!res.ok) return false;
    const blob = await res.blob();
    if (!blob.size) return false;
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    let started = false;
    audio.onplay = () => { started = true; opts.onStart?.(); };
    audio.onended = () => { URL.revokeObjectURL(url); if (currentAudio === audio) currentAudio = null; opts.onEnd?.(); };
    audio.onerror = () => { URL.revokeObjectURL(url); if (currentAudio === audio) currentAudio = null; if (started) opts.onEnd?.(); };
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

/** Fala um texto com a melhor voz pt-BR feminina disponível. */
export function speak(text: string, opts: SpeakOpts = {}) {
  if (typeof window === "undefined") { opts.onEnd?.(); return; }
  stopSpeaking();
  const clean = text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (!clean) { opts.onEnd?.(); return; }
  if (CLARA_TTS_URL) {
    speakNeural(clean, opts).then((ok) => { if (!ok) speakBrowser(clean, opts); });
  } else {
    speakBrowser(clean, opts);
  }
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.src = ""; } catch {}
    currentAudio = null;
  }
}

/**
 * Destrava o áudio no 1º gesto do usuário (iOS/Safari bloqueiam som fora de
 * gesto). Destrava tanto a síntese do navegador quanto o elemento <audio>.
 */
export function unlockAudioOnce() {
  if (typeof window === "undefined") return;
  const unlock = () => {
    try {
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(" ");
        u.volume = 0;
        window.speechSynthesis.speak(u);
      }
    } catch {}
    try {
      if (!unlockAudio) {
        // mp3 silencioso minúsculo (data URI) para liberar o <audio> no iOS
        unlockAudio = new Audio(
          "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA//////////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAAnGMHkkIAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxAADwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxAADwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
        );
        unlockAudio.volume = 0;
      }
      unlockAudio.play().catch(() => {});
    } catch {}
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}
