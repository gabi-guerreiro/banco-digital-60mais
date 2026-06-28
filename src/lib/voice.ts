// ════════════════════════════════════════════════
// Voz — seleciona a melhor voz feminina pt-BR disponível
// e fala com prosódia calorosa, mais lenta (público 60+).
// Prioriza vozes neurais ("Natural"/"Online" da Microsoft,
// "Google português do Brasil", "Luciana" da Apple).
// ════════════════════════════════════════════════

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

function score(v: SpeechSynthesisVoice): number {
  const name = (v.name || "").toLowerCase();
  const lang = (v.lang || "").toLowerCase().replace("_", "-");
  let s = -1;
  if (lang.startsWith("pt-br")) s = 100;
  else if (lang.startsWith("pt")) s = 55;
  else return -1; // não é português
  if (FEMALE.some((f) => name.includes(f))) s += 60;
  if (MALE.some((m) => name.includes(m))) s -= 90;
  if (name.includes("natural") || name.includes("online")) s += 55; // neural
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

/** Carrega as vozes (assíncronas em alguns navegadores) e memoriza a melhor. */
export function primeVoices(onReady?: (name: string) => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const load = () => {
    const v = pickVoice();
    if (v) { cached = v; cachedName = v.name; onReady?.(v.name); }
  };
  load();
  window.speechSynthesis.onvoiceschanged = load;
  // alguns navegadores precisam de um "empurrão"
  setTimeout(load, 300);
}

export function currentVoiceName(): string {
  return cachedName || pickVoice()?.name || "";
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

type SpeakOpts = { rate?: number; pitch?: number; onStart?: () => void; onEnd?: () => void };

/** Fala um texto com a melhor voz pt-BR feminina, em ritmo confortável. */
export function speak(text: string, opts: SpeakOpts = {}) {
  if (!isSpeechSupported()) { opts.onEnd?.(); return; }
  const synth = window.speechSynthesis;
  synth.cancel();
  const clean = text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (!clean) { opts.onEnd?.(); return; }
  const u = new SpeechSynthesisUtterance(clean);
  const v = cached || pickVoice();
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "pt-BR"; }
  u.rate = opts.rate ?? 0.95;   // levemente mais lento: clareza para 60+
  u.pitch = opts.pitch ?? 1.02; // leve calor
  u.volume = 1;
  u.onstart = () => opts.onStart?.();
  u.onend = () => opts.onEnd?.();
  u.onerror = () => opts.onEnd?.();
  synth.speak(u);
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

/**
 * iOS/Safari só permite falar se a síntese for "destravada" dentro de um gesto
 * do usuário. Destrava no primeiro toque/tecla com uma fala silenciosa.
 */
export function unlockAudioOnce() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const unlock = () => {
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch {}
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}
