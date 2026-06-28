// Cérebro local da Clara (fallback sem DeepSeek) + detecção de intenção
// de navegação (usada nos dois modos para abrir a tela certa).

import type { ScreenId } from "@/context/AppContext";

function norm(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Detecta se a fala pede uma ação que deve abrir uma tela do app. */
export function detectIntent(text: string): ScreenId | null {
  const t = norm(text);
  if (/(paga|pagar|conta de luz|boleto|eletro|fatura)/.test(t)) return "pay1";
  if (/(extrato|resumo|gastei|gasto|quanto.*(entrou|saiu|sobrou)|movimenta)/.test(t)) return "summary";
  if (/(pessoa|humano|atendente|especialista|ligar para|falar com algu|alguem de verdade)/.test(t)) return "specialist";
  return null;
}

const KB: { triggers: RegExp; reply: string }[] = [
  { triggers: /(paga|pagar|conta de luz|boleto|eletro)/, reply: "Encontrei sua conta de luz da Eletropaulo, no valor de R$ 289,40 — vence amanhã. Vou abrir o pagamento para você conferir, tá bom?" },
  { triggers: /(saldo|quanto tenho|tenho na conta|dinheiro)/, reply: "Seu saldo é de R$ 4.218,50 na conta corrente. Quer que eu mostre o resumo da semana?" },
  { triggers: /(extrato|resumo|semana|gastei|gasto)/, reply: "Esta semana entraram R$ 2.100 da aposentadoria e saíram R$ 647,30. Vou te mostrar o resumo completo." },
  { triggers: /(pessoa|humano|atendente|especialista|ligar|falar com)/, reply: "Já vou te conectar com uma atendente da nossa equipe 60+. Ela vê todo o histórico da conversa. Um instante." },
  { triggers: /(pix|seguro|golpe|fraude|perigo)/, reply: "O Pix é seguro quando feito aqui pelo aplicativo. Nunca faça Pix pedido por mensagem, telefone ou link. Na dúvida, me chame." },
  { triggers: /(obrigad|valeu|agradec)/, reply: "De nada, Maria Lúcia! Estou sempre aqui. É só me chamar quando precisar." },
  { triggers: /(ola|oi|bom dia|boa tarde|boa noite|tudo bem)/, reply: "Oi, Maria Lúcia! Que bom falar com você. Posso ajudar a ver o saldo, pagar uma conta ou conferir o extrato." },
];

/** Resposta local (sem IA) — usada quando não há chave DeepSeek configurada. */
export function localReply(text: string): string {
  const t = norm(text);
  const hit = KB.find((k) => k.triggers.test(t));
  if (hit) return hit.reply;
  return "Posso te ajudar a ver o saldo, pagar uma conta, fazer um Pix, ver o extrato ou falar com uma atendente. O que você prefere?";
}
