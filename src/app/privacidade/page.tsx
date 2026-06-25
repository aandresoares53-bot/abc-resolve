import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
            <ChevronLeft size={16} /> Voltar
          </Link>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p>Esta política descreve como o ABCResolve trata os dados pessoais dos usuários.</p>
              <h2 className="font-semibold text-gray-800 text-base mt-6">Dados coletados</h2>
              <p>Coletamos nome, e-mail, telefone e endereço (cidade/bairro) para viabilizar o contato entre clientes e prestadores.</p>
              <h2 className="font-semibold text-gray-800 text-base mt-6">Uso dos dados</h2>
              <p>Os dados são utilizados exclusivamente para conectar clientes a prestadores na região do Grande ABC.</p>
              <h2 className="font-semibold text-gray-800 text-base mt-6">Seus direitos (LGPD)</h2>
              <p>Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail: privacidade@abcresolve.com.br</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
