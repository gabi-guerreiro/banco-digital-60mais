"use client";

import { useApp, CLAREZA_LEVELS } from "@/context/AppContext";
import { IconText, IconCheck } from "@/components/icons";

export function ClarezaTrigger({ onOpen }: { onOpen: () => void }) {
  const { clareza } = useApp();
  return (
    <button className="cz-trigger" onClick={onOpen} aria-label="Ajustar tamanho do texto — Modo Clareza">
      <IconText size={15} />
      {CLAREZA_LEVELS[clareza].label}
    </button>
  );
}

export function ClarezaSheet({ onClose }: { onClose: () => void }) {
  const { clareza, setClareza } = useApp();

  return (
    <div className="cz-sheet-bg" onClick={onClose}>
      <div className="cz-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="cz-grip" />
        <h3>Modo <em>Clareza</em></h3>
        <p className="cz-sub">Escolha o tamanho do texto que for mais confortável para você. Tudo no app se ajusta na hora.</p>

        <div className="cz-opts">
          {CLAREZA_LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              className={`cz-opt${clareza === lvl.id ? " on" : ""}`}
              onClick={() => setClareza(lvl.id)}
            >
              <span className="cz-opt-label">{lvl.label}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="cz-opt-demo" style={{ fontSize: `${15 * lvl.scale}px` }}>{lvl.demo}</span>
                <span className="cz-check"><IconCheck size={13} /></span>
              </span>
            </button>
          ))}
        </div>

        <button className="cz-done" onClick={onClose}>Pronto</button>
      </div>
    </div>
  );
}
