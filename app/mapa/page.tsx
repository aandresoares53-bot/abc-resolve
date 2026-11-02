"use client"
import dynamic from 'next/dynamic'
import Header from '@/components/Header'

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
      <p className="text-gray-500">Carregando mapa...</p>
    </div>
  ),
})

export default function MapaPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-2 mt-6" style={{ color: 'var(--foreground)' }}>
          🗺️ Mapa de Hotéis
        </h1>
        <p className="text-gray-500 mb-6">Explore hotéis e pousadas em todo o Brasil. Clique nos marcadores para ver detalhes.</p>
        <MapComponent />
      </div>
    </main>
  )
}
