'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Copy, Loader2, ChevronLeft, Smartphone, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AssinaturaPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [pixCode, setPixCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/subscription/qrcode')
      .then((r) => r.json())
      .then((d) => (d as { qrDataUrl: string; pixCode: string }))
      .then((d) => {
        setQrDataUrl(d.qrDataUrl);
        setPixCode(d.pixCode);
        setLoading(false);
      });
  }, []);

  function copyCode() {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
            <ChevronLeft size={16} /> Voltar
          </Link>

          <div className="text-center mb-8">
            <span className="badge bg-green-100 text-green-700 text-sm mb-3">Assinatura Mensal</span>
            <h1 className="text-3xl font-bold text-gray-900">Ative seu perfil de prestador</h1>
            <p className="text-gray-500 mt-2">Pague via PIX e comece a receber pedidos na sua região.</p>
          </div>

          {/* Plano */}
          <div className="card p-6 mb-6 border-2 border-primary-200 bg-primary-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-gray-900">Plano Prestador</p>
                <p className="text-sm text-gray-500 mt-0.5">Acesso completo à plataforma ABCResolve</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-primary-700">R$ 19<span className="text-xl">,90</span></p>
                <p className="text-xs text-gray-400">por mês</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                'Perfil verificado visível aos clientes',
                'Receba pedidos ilimitados',
                'Destaque na sua categoria',
                'Suporte por e-mail',
              ].map((item) => (
                <div key={item} className="flex items-start gap-1.5 text-sm text-gray-700">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="card p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Smartphone size={16} className="text-green-600" />
              </div>
              <span className="font-semibold text-gray-900">Pague com PIX</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-primary-500" />
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="QR Code PIX"
                    className="w-52 h-52 rounded-xl border-4 border-gray-100 shadow-sm"
                  />
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  Escaneie o QR Code com o app do seu banco
                </p>

                <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1 font-medium">PIX Copia e Cola</p>
                  <p className="text-xs text-gray-600 font-mono break-all leading-relaxed line-clamp-3">
                    {pixCode}
                  </p>
                </div>

                <button
                  onClick={copyCode}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {copied ? (
                    <><CheckCircle size={16} /> Código copiado!</>
                  ) : (
                    <><Copy size={16} /> Copiar código PIX</>
                  )}
                </button>
              </>
            )}

            <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield size={13} className="text-green-500" />
                Chave PIX: suporte@gde.com.br
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Clock size={13} className="text-blue-400" />
                Ativação em até 24h após confirmação
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800">
            <p className="font-semibold mb-1">Após o pagamento:</p>
            <p>Envie o comprovante para <strong>suporte@gde.com.br</strong> com seu nome e e-mail cadastrado. Seu perfil será ativado em até 24 horas.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
