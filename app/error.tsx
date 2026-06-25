'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
      <div className="card max-w-md text-center">
        <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Algo deu errado!
        </h1>
        <p className="text-gray-600 mb-6">
          Desculpe, ocorreu um erro ao carregar esta página. Tente novamente.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="btn-primary flex-1"
          >
            Tentar Novamente
          </button>
          <Link href="/" className="btn-secondary flex-1 text-center">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
