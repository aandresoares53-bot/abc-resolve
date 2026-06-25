import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
                A
              </div>
              <span className="font-bold text-gray-900">ABC Resolve</span>
            </div>
            <p className="text-sm text-gray-600">
              Marketplace de serviços para a região de São Paulo
            </p>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Para Clientes</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categorias" className="text-sm text-gray-600 hover:text-brand-600">
                  Buscar Serviços
                </Link>
              </li>
              <li>
                <Link href="/solicitacoes/nova" className="text-sm text-gray-600 hover:text-brand-600">
                  Postar Solicitação
                </Link>
              </li>
              <li>
                <Link href="/prestadores" className="text-sm text-gray-600 hover:text-brand-600">
                  Encontrar Prestador
                </Link>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Para Prestadores</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/registrar" className="text-sm text-gray-600 hover:text-brand-600">
                  Cadastre-se
                </Link>
              </li>
              <li>
                <Link href="/prestadores/dashboard" className="text-sm text-gray-600 hover:text-brand-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-brand-600">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-brand-600">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-brand-600">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-brand-600">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-brand-600">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2025 ABC Resolve. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-brand-600">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20v-7.75H5.5V8.5h2.79V6.31c0-2.75 1.68-4.25 4.13-4.25 1.17 0 2.18.09 2.47.13v2.86h-1.7c-1.33 0-1.59.63-1.59 1.56V8.5h3.19l-.41 3.75h-2.78V20h-3.02z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-600">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20v-7.75H5.5V8.5h2.79V6.31c0-2.75 1.68-4.25 4.13-4.25 1.17 0 2.18.09 2.47.13v2.86h-1.7c-1.33 0-1.59.63-1.59 1.56V8.5h3.19l-.41 3.75h-2.78V20h-3.02z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-600">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
