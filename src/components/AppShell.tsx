"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SysBar } from "@/components/SysBar";
import { BottomNav } from "@/components/BottomNav";
import { Fab } from "@/components/Fab";
import { ClarezaTrigger, ClarezaSheet } from "@/components/ClarezaControl";
import { SplashScreen } from "@/screens/SplashScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { ClaraScreen } from "@/screens/ClaraScreen";
import { PayScreen } from "@/screens/PayScreen";
import { BiometricsScreen } from "@/screens/BiometricsScreen";
import { ReceiptScreen } from "@/screens/ReceiptScreen";
import { SummaryScreen } from "@/screens/SummaryScreen";
import { SpecialistScreen } from "@/screens/SpecialistScreen";
import { QR_SVG } from "@/lib/qr";

function ActiveScreen() {
  const { screen } = useApp();
  switch (screen) {
    case "home":       return <div className="screen" key="home"><HomeScreen /></div>;
    case "clara":      return <div className="screen" key="clara"><ClaraScreen /></div>;
    case "pay1":       return <div className="screen" key="pay1"><PayScreen /></div>;
    case "biometrics": return <div className="screen" key="bio"><BiometricsScreen /></div>;
    case "receipt":    return <div className="screen" key="receipt"><ReceiptScreen /></div>;
    case "summary":    return <div className="screen" key="summary"><SummaryScreen /></div>;
    case "specialist": return <div className="screen" key="spec"><SpecialistScreen /></div>;
    default:           return <div className="screen" key="home"><HomeScreen /></div>;
  }
}

function StageArt() {
  return (
    <svg className="stage-art" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {[200, 340, 480, 620, 760].map((r) => (
        <circle key={r} cx="1180" cy="240" r={r} fill="none" stroke="#e8a0b4" strokeOpacity="0.08" />
      ))}
      {Array.from({ length: 120 }).map((_, i) => (
        <circle key={i} cx={(i * 137) % 1440} cy={((i * 233) % 900)} r="1.4" fill="#e8a0b4" fillOpacity="0.1" />
      ))}
    </svg>
  );
}

export function AppShell() {
  const { started, screen } = useApp();
  const [czOpen, setCzOpen] = useState(false);

  return (
    <div className="stage">
      <StageArt />

      {/* Apresentação lateral (somente desktop) */}
      <aside className="stage-aside">
        <div className="stage-eyebrow">Banco Digital · 60+</div>
        <h1>Use no seu <em>celular</em>, como se fosse você.</h1>
        <p>
          Protótipo funcional do app bancário desenhado para o público <strong>60+</strong>,
          a partir da pesquisa de Design Thinking de <strong>Marília Pinheiro</strong>.
        </p>
        <p>Aponte a câmera do celular para abrir e experimentar com as próprias mãos.</p>
        <div className="stage-qr">
          <span className="stage-qr-img" dangerouslySetInnerHTML={{ __html: QR_SVG }} />
          <span className="stage-qr-cap"><strong>Abra no celular</strong>aponte a câmera para o código</span>
        </div>
      </aside>

      {/* O aparelho */}
      <div className="device">
        <div className="surface">
          <SysBar />
          <div className="screen-host">
            {started ? <ActiveScreen /> : <SplashScreen />}
            {started && (
              <>
                <div style={{ position: "absolute", top: 8, right: 12, zIndex: 46 }}>
                  <ClarezaTrigger onOpen={() => setCzOpen(true)} />
                </div>
                {screen !== "specialist" && <Fab />}
                {czOpen && <ClarezaSheet onClose={() => setCzOpen(false)} />}
              </>
            )}
          </div>
          {started && <BottomNav />}
        </div>
      </div>

      <div className="stage-sign">
        <b>Banco 60+</b> · artefato acadêmico de Design Thinking · dados fictícios
      </div>
    </div>
  );
}
