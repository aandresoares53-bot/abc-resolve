import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ABCResolve — Encontre profissionais no Grande ABC',
  description:
    'Conectamos você aos melhores prestadores de serviços do Grande ABC: Santo André, São Bernardo, São Caetano, Diadema, Mauá e mais.',
  keywords: 'serviços, profissionais, ABC, Santo André, São Bernardo, eletricista, encanador, pintor, faxineira',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
