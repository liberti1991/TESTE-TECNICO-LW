import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Consulta Veicular',
  description: 'Sistema de consulta de débitos veiculares',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
