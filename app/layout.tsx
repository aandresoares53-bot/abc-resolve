import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Encontrar Hotéis e Pousadas | Melhores Ofertas no Brasil',
  description: 'Busca inteligente com IA para hotéis e pousadas em todo o Brasil. Promoções exclusivas, pacotes familiares e ofertas sazonais.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
