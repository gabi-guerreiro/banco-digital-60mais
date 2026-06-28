"use client";

import { useState } from "react";
import { getKey, setKey, clearKey, validateKey } from "@/lib/deepseek";
import { IconSparkles, IconShield } from "@/components/icons";

export function ClaraConnect({
  onClose,
  onChange,
}: {
  onClose: () => void;
  onChange: (connected: boolean) => void;
}) {
  const [value, setValue] = useState(getKey() ?? "");
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const connected = !!getKey();

  async function testAndSave() {
    const key = value.trim();
    if (!key) { setStatus({ ok: false, msg: "Cole sua chave da DeepSeek primeiro." }); return; }
    setTesting(true);
    setStatus(null);
    const res = await validateKey(key);
    setTesting(false);
    if (res.ok) {
      setKey(key);
      onChange(true);
      setStatus({ ok: true, msg: "Conectado! A Clara agora pensa de verdade." });
      setTimeout(onClose, 900);
    } else {
      setStatus({ ok: false, msg: res.message ?? "Não consegui validar a chave." });
    }
  }

  function disconnect() {
    clearKey();
    onChange(false);
    onClose();
  }

  return (
    <div className="cz-sheet-bg" onClick={onClose}>
      <div className="cz-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="cz-grip" />
        <div className="connect-eyebrow"><IconSparkles size={14} /> Clara Inteligente · DeepSeek</div>
        <h3>Dê um <em>cérebro de verdade</em> à Clara</h3>
        <p className="cz-sub">
          Conecte uma chave da DeepSeek e a Clara passa a entender qualquer pergunta, conversar livremente e responder em voz.
        </p>

        <div className="connect-field">
          <input
            className="connect-input"
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="sk-..."
            autoComplete="off"
            spellCheck={false}
          />
          <button className="connect-test" onClick={testAndSave} disabled={testing}>
            {testing ? "Testando…" : connected ? "Atualizar" : "Conectar"}
          </button>
        </div>

        {status && (
          <div className={`connect-status ${status.ok ? "ok" : "err"}`}>{status.msg}</div>
        )}

        <div className="connect-priv">
          <IconShield size={16} />
          <p>Sua chave fica salva <strong>só neste aparelho</strong> (no navegador). Nunca é enviada para nós nem para o repositório.</p>
        </div>

        <p className="connect-hint">
          Não tem uma chave? Crie em{" "}
          <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer">platform.deepseek.com</a>{" "}
          — leva 1 minuto e os primeiros créditos costumam ser gratuitos.
        </p>

        {connected ? (
          <button className="connect-remove" onClick={disconnect}>Desconectar a Clara Inteligente</button>
        ) : (
          <button className="cz-done" onClick={onClose} style={{ marginTop: 14 }}>
            Agora não, usar a Clara simples
          </button>
        )}
      </div>
    </div>
  );
}
