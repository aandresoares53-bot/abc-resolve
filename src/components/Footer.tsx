import Link from 'next/link';
import { Wrench, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-extrabold text-xl text-white mb-3">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Wrench size={18} />
              </div>
              ABC<span className="text-accent-500">Resolve</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Conectamos você aos melhores profissionais da região do Grande ABC.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary-400" />
                Grande ABC — SP
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary-400" />
                (11) 99999-0000
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary-400" />
                contato@abcresolve.com.br
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Para Clientes</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/solicitar-servico" className="hover:text-white transition-colors">Solicitar serviço</Link></li>
              <li><Link href="/#categorias" className="hover:text-white transition-colors">Ver categorias</Link></li>
              <li><Link href="/#como-funciona" className="hover:text-white transition-colors">Como funciona</Link></li>
              <li><Link href="/#depoimentos" className="hover:text-white transition-colors">Avaliações</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Para Prestadores</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cadastro-prestador" className="hover:text-white transition-colors">Cadastre-se</Link></li>
              <li><Link href="/assinatura" className="hover:text-white transition-colors">Ativar assinatura</Link></li>
              <li><Link href="/#como-funciona" className="hover:text-white transition-colors">Como receber pedidos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Cidades Atendidas</h4>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li>Santo André</li>
              <li>São Bernardo do Campo</li>
              <li>São Caetano do Sul</li>
              <li>Diadema</li>
              <li>Mauá</li>
              <li>Ribeirão Pires</li>
              <li>Rio Grande da Serra</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ABCResolve. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-gray-300 transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-gray-300 transition-colors">Termos de uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
