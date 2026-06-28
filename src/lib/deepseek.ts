// ════════════════════════════════════════════════
// Cliente DeepSeek (BYOK) — a chave vive só no aparelho
// (localStorage), nunca no repositório nem em servidor.
// A API DeepSeek é OpenAI-compatible e libera CORS para
// chamadas diretas do navegador.
// ════════════════════════════════════════════════

const ENDPOINT = "https://api.deepseek.com/chat/completions";
const KEY_STORAGE = "banco60.deepseek.key";

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export const CLARA_SYSTEM: ChatMsg = {
  role: "system",
  content: [
    "Você é a Clara, assistente de voz do \"Banco 60+\", um banco digital pensado para pessoas com mais de 60 anos.",
    "Fale SEMPRE em português do Brasil, com calor humano, paciência e frases curtas e simples — como quem conversa com a própria avó.",
    "A cliente se chama Maria Lúcia. Trate-a pelo nome de vez em quando.",
    "Você ajuda com: ver saldo, pagar contas e boletos, fazer Pix, ver o extrato/resumo da semana e tirar dúvidas de segurança (golpes).",
    "Contexto (dados fictícios): saldo R$ 4.218,50; conta de luz da Eletropaulo de R$ 289,40 vence amanhã; nesta semana entraram R$ 2.100 da aposentadoria (INSS) e saíram R$ 647,30, sendo o maior gasto supermercado (R$ 380).",
    "NUNCA peça senha, PIN, número de cartão ou código de segurança. Se perguntarem algo fora do banco, responda gentil e traga de volta ao assunto.",
    "Quando a pessoa quiser uma ação (pagar, ver saldo, ver extrato, falar com atendente humano), confirme em UMA frase curta — o aplicativo abre a tela sozinho.",
    "Responda em no máximo 3 frases curtas. Não use listas nem markdown — é uma conversa falada.",
  ].join(" "),
};

export class DeepSeekError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "DeepSeekError";
  }
}

export function getKey(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(KEY_STORAGE); } catch { return null; }
}
export function setKey(key: string) {
  try { window.localStorage.setItem(KEY_STORAGE, key.trim()); } catch {}
}
export function clearKey() {
  try { window.localStorage.removeItem(KEY_STORAGE); } catch {}
}
export function hasKey(): boolean {
  return !!getKey();
}

function friendlyError(status: number): string {
  if (status === 401) return "A chave da DeepSeek não foi aceita. Confira se copiou certinho.";
  if (status === 402) return "A conta DeepSeek está sem saldo. Adicione créditos para continuar.";
  if (status === 429) return "Muitas mensagens em pouco tempo. Espere um instante e tente de novo.";
  if (status >= 500) return "O serviço da DeepSeek está instável agora. Tente novamente em alguns segundos.";
  return "Não consegui falar com a DeepSeek agora.";
}

/** Faz uma chamada de teste curtíssima para validar a chave. */
export async function validateKey(key: string): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key.trim()}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "diga apenas: ok" }],
        max_tokens: 4,
        stream: false,
      }),
    });
    if (res.ok) return { ok: true };
    return { ok: false, message: friendlyError(res.status) };
  } catch {
    return { ok: false, message: "Sem conexão com a DeepSeek. Verifique a internet." };
  }
}

/** Lê um stream SSE (OpenAI-compatible) e entrega os deltas de conteúdo. */
async function consumeSSE(body: ReadableStream<Uint8Array>, onToken: (d: string) => void): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") continue;
      try {
        const json = JSON.parse(data);
        const delta: string | undefined = json.choices?.[0]?.delta?.content;
        if (delta) { full += delta; onToken(delta); }
      } catch {
        // fragmento parcial — ignora
      }
    }
  }
  return full.trim();
}

/**
 * BYOK: conversa direto com a DeepSeek usando a chave do próprio usuário.
 * Transmite os tokens conforme chegam (digitação ao vivo).
 */
export async function streamClara(
  history: ChatMsg[],
  key: string,
  onToken: (delta: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key.trim()}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [CLARA_SYSTEM, ...history],
      stream: true,
      temperature: 0.7,
      max_tokens: 320,
    }),
    signal,
  });
  if (!res.ok || !res.body) throw new DeepSeekError(res.status, friendlyError(res.status));
  return consumeSSE(res.body, onToken);
}

/**
 * Modo proxy: chama o backend serverless (a chave fica no servidor).
 * Envia só a conversa; o proxy injeta a persona da Clara.
 */
export async function streamViaProxy(
  proxyUrl: string,
  history: ChatMsg[],
  onToken: (delta: string) => void,
  signal?: AbortSignal,
  persona?: "clara" | "atendente",
): Promise<string> {
  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(persona ? { messages: history, persona } : { messages: history }),
    signal,
  });
  if (!res.ok || !res.body) throw new DeepSeekError(res.status, friendlyError(res.status));
  return consumeSSE(res.body, onToken);
}
