// Proxy serverless da Clara (Vercel). A chave DeepSeek vive só no servidor;
// o navegador chama este endpoint, que é travado à origem do site + rate-limit.
// Deixe "" para desligar o modo proxy e cair em BYOK/local.
export const CLARA_PROXY_URL = "https://clara-proxy-topaz.vercel.app/api/clara";
