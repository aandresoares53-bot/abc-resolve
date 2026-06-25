import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function TermosPage() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
            <ChevronLeft size={16} /> Voltar
          </Link>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p>Ao utilizar o ABCResolve, você concorda com os seguintes termos:</p>
              <h2 className="font-semibold text-gray-800 text-base mt-6">1. Sobre a plataforma</h2>
              <p>O ABCResolve é uma plataforma de conexão entre clientes e prestadores de serviços na região do Grande ABC, São Paulo.</p>
              <h2 className="font-semibold text-gray-800 text-base mt-6">2. Responsabilidades</h2>
              <p>O ABCResolve atua como intermediário e não se responsabiliza pela execução dos serviços contratados diretamente entre clientes e prestadores.</p>
              <h2 className="font-semibold text-gray-800 text-base mt-6">3. Dados pessoais</h2>
              <p>Os dados fornecidos são utilizados exclusivamente para conectar clientes e prestadores. Não compartilhamos seus dados com terceiros sem consentimento.</p>
              <h2 className="font-semibold text-gray-800 text-base mt-6">4. Gratuidade</h2>
              <p>A solicitação de serviços por clientes é totalmente gratuita. Prestadores cadastrados podem estar sujeitos a tarifas futuras mediante aviso prévio.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
