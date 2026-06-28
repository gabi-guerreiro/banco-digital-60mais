// ════════════════════════════════════════════════
// Voz — voz neural pt-BR feminina via proxy (Google TTS),
// que substitui a voz "robótica" do sistema. Cai para a melhor
// voz local do navegador se a rede/proxy falhar.
//
// Robustez:
// - cada fala tem um "gen"; trocar de tela / stopSpeaking invalida falas
//   em voo (fetch abortado, áudio não toca, onEnd sempre dispara);
// - usa UM <audio> persistente, destravado no 1º gesto, para a voz neural
//   tocar mesmo fora de gesto no iOS (welcome, respostas da Clara/atendente);
// - timeout no fetch do TTS → cai para a voz do navegador;
// - normaliza R$/números para leitura compreensível.
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

const SILENT_MP3 =
  "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA//////////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAAnGMHkkIAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxAADwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxAADwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

let cached: SpeechSynthesisVoice | null = null;
let cachedName = "";
let player: HTMLAudioElement | null = null;   // <audio> persistente (destravado no 1º gesto)
let currentBlobUrl: string | null = null;
let currentAbort: AbortController | null = null;
let currentOnEnd: (() => void) | null = null;
let gen = 0;

function getPlayer(): HTMLAudioElement | null {
  if (typeof window === "undefined" || typeof Audio === "undefined") return null;
  if (!player) player = new Audio();
  return player;
}

function revokeBlob() {
  if (currentBlobUrl) { try { URL.revokeObjectURL(currentBlobUrl); } catch {} currentBlobUrl = null; }
}

function fireOnEnd() {
  const cb = currentOnEnd;
  currentOnEnd = null;
  if (cb) { try { cb(); } catch {} }
}

/** Normaliza R$, números e símbolos para leitura compreensível em pt-BR. */
export function normalizeForSpeech(text: string): string {
  return text
    .replace(/R\$\s*([\d.]+),(\d{2})/g, (_m, int: string, c: string) => `${int.replace(/\./g, "")} reais e ${c} centavos`)
    .replace(/R\$\s*([\d.]+)/g, (_m, int: string) => `${int.replace(/\./g, "")} reais`)
    .replace(/(\d)\s*%/g, "$1 por cento")
    .replace(/\s*[#*•]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

function speakBrowser(text: string, opts: SpeakOpts, myGen: number) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) { fireOnEnd(); return; }
  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(text);
  const v = cached || pickVoice();
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "pt-BR"; }
  u.rate = opts.rate ?? 0.95;
  u.pitch = opts.pitch ?? 1.02;
  u.volume = 1;
  u.onstart = () => { if (gen === myGen) opts.onStart?.(); };
  u.onend = () => { if (gen === myGen) fireOnEnd(); };
  u.onerror = () => { if (gen === myGen) fireOnEnd(); };
  synth.speak(u);
}

async function speakNeural(text: string, opts: SpeakOpts, myGen: number, ac: AbortController): Promise<boolean> {
  const p = getPlayer();
  if (!p) return false;
  // timeout: se o proxy demorar, aborta e cai para a voz do navegador.
  const to = setTimeout(() => { try { ac.abort(); } catch {} }, 9000);
  try {
    const res = await fetch(`${CLARA_TTS_URL}?text=${encodeURIComponent(text)}`, { signal: ac.signal });
    clearTimeout(to);
    if (gen !== myGen) return true;                 // substituído por nova fala / parado pelo usuário
    if (!res.ok) return false;
    const blob = await res.blob();
    if (gen !== myGen) return true;
    if (!blob.size) return false;

    revokeBlob();
    currentBlobUrl = URL.createObjectURL(blob);
    p.muted = false;   // garante que não toque mudo após o desbloqueio silencioso
    p.onplay = () => { if (gen === myGen) opts.onStart?.(); };
    p.onended = () => { if (gen === myGen) { revokeBlob(); fireOnEnd(); } };
    p.onerror = () => { if (gen === myGen) { revokeBlob(); fireOnEnd(); } };
    p.src = currentBlobUrl;
    try {
      await p.play();
    } catch {
      revokeBlob();
      return false;                                  // autoplay bloqueado → fallback
    }
    return true;
  } catch (e) {
    clearTimeout(to);
    revokeBlob();
    if (gen !== myGen) return true;                  // parado pelo usuário (gen mudou)
    if ((e as { name?: string })?.name === "AbortError") return false; // timeout → fallback
    return false;
  }
}

/** Para qualquer fala em curso e desbloqueia quem dependia do onEnd. */
export function stopSpeaking() {
  if (typeof window === "undefined") return;
  gen++;
  if (currentAbort) { try { currentAbort.abort(); } catch {} currentAbort = null; }
  if ("speechSynthesis" in window) { try { window.speechSynthesis.cancel(); } catch {} }
  if (player) {
    try { player.onended = null; player.onerror = null; player.onplay = null; player.pause(); player.removeAttribute("src"); player.load(); } catch {}
  }
  revokeBlob();
  fireOnEnd();
}

/** Fala um texto com a melhor voz pt-BR feminina disponível. */
export function speak(text: string, opts: SpeakOpts = {}) {
  if (typeof window === "undefined") { opts.onEnd?.(); return; }
  stopSpeaking();                                    // cancela anterior (gen++ + onEnd anterior)
  const myGen = gen;
  const clean = normalizeForSpeech(text.replace(/<[^>]+>/g, ""));
  if (!clean) { opts.onEnd?.(); return; }
  currentOnEnd = opts.onEnd ?? null;
  if (CLARA_TTS_URL) {
    const ac = new AbortController();
    currentAbort = ac;
    speakNeural(clean, opts, myGen, ac).then((ok) => {
      if (gen === myGen && !ok) speakBrowser(clean, opts, myGen);
    });
  } else {
    speakBrowser(clean, opts, myGen);
  }
}

/**
 * Destrava o áudio no 1º gesto do usuário (iOS/Safari bloqueiam som fora de
 * gesto). Destrava a síntese do navegador E o <audio> persistente da voz
 * neural — assim a fala neural toca mesmo fora de gesto depois (welcome etc.).
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
      const p = getPlayer();
      if (p) {
        p.muted = true;
        p.src = SILENT_MP3;
        const done = () => { p.muted = false; };
        p.play().then(done).catch(done);
      }
    } catch {}
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}
