import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        <div className="text-8xl mb-6">🗺️</div>
        <h1 className="text-9xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-none">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-3">Ops! Página não encontrada</h2>
        <p className="text-white/60 text-lg mb-10">Este destino não existe no nosso mapa</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-white/90 transition-all"
          >
            ← Voltar para o início
          </Link>
          <Link
            href="/#buscar"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            ✨ Buscar hotéis
          </Link>
        </div>
      </div>
    </main>
  );
}
