import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptVision — Gerador de Prompts para Imagens AI",
  description:
    "Crie prompts profissionais e detalhados para gerar imagens RAW ultra-realistas com Midjourney, Stable Diffusion, DALL-E e outros geradores de IA.",
  keywords: "prompt generator, AI images, Midjourney, Stable Diffusion, realistic photos, fashion photography",
  openGraph: {
    title: "PromptVision — Gerador de Prompts para Imagens AI",
    description: "Crie prompts profissionais para imagens ultra-realistas com IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
