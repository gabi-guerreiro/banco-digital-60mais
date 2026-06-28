import type { Metadata, Viewport } from "next";
import { Nunito, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Banco 60+ · seu banco, no seu tempo",
  description:
    "Protótipo funcional de app bancário adaptado ao público 60+ — assistente por voz, confirmação em linguagem simples e atendimento humano a um toque. Artefato acadêmico de Design Thinking (Marília Pinheiro).",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Banco 60+" },
  openGraph: {
    title: "Banco 60+ · seu banco, no seu tempo",
    description: "App bancário funcional desenhado para o público 60+. Experimente no celular.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a081a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${fraunces.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
