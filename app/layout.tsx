import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'ABCResolve - Prestadores de Serviços ABC',
  description: 'Marketplace de prestadores de serviços na região do ABC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
