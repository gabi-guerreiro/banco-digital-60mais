"use client";

import { useApp } from "@/context/AppContext";
import { IconLock } from "@/components/icons";

export function SplashScreen() {
  const { start } = useApp();

  return (
    <div className="splash">
      {/* Arte generativa de fundo */}
      <svg className="splash-art" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="sg" cx="50%" cy="18%" r="60%">
            <stop offset="0%" stopColor="#e8a0b4" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#e8a0b4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="url(#sg)" />
        {[120, 200, 280, 360].map((r) => (
          <circle key={r} cx="320" cy="120" r={r} fill="none" stroke="#e8a0b4" strokeOpacity="0.12" />
        ))}
        {Array.from({ length: 60 }).map((_, i) => (
          <circle key={i} cx={(i * 53) % 400} cy={((i * 97) % 800)} r="1.3" fill="#e8a0b4" fillOpacity="0.18" />
        ))}
      </svg>

      <div className="splash-top">
        <div className="splash-mark">Banco Digital · 60+</div>
        <h1>
          Seu banco,<br />no seu <em>tempo</em>.
        </h1>
        <p className="splash-lead">
          Simples, em voz alta quando você quiser, e com gente de verdade a um toque de distância.
        </p>
      </div>

      <div className="splash-bottom">
        <div className="splash-greet">
          <div className="splash-avatar">ML</div>
          <div className="splash-greet-tx">
            Bem-vinda de volta,
            <strong>Maria Lúcia</strong>
          </div>
        </div>

        <button className="splash-cta" onClick={start}>
          <IconLock size={20} />
          Entrar com biometria
        </button>

        <div className="splash-alt">
          ou <button onClick={start}>usar minha senha de 6 dígitos</button>
        </div>
      </div>
    </div>
  );
}
