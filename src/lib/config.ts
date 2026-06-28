// Proxy serverless da Clara (Vercel). A chave DeepSeek vive só no servidor;
// o navegador chama este endpoint, travado à origem do site + rate-limit.
// Deixe "" para desligar o modo proxy e cair em BYOK/local.
export const CLARA_PROXY_URL = "https://clara-proxy-topaz.vercel.app/api/clara";

// Voz neural pt-BR (mesma origem do proxy). "" desliga e usa a voz do navegador.
export const CLARA_TTS_URL = CLARA_PROXY_URL
  ? CLARA_PROXY_URL.replace(/\/api\/clara$/, "/api/tts")
  : "";
