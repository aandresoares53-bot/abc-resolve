"use client"
import { useEffect, useRef } from 'react'
import { hotelsData } from '@/lib/hotels-data'

const cityCoords: Record<string, [number, number]> = {
  "Gramado": [-29.374, -50.874],
  "Canela": [-29.364, -50.816],
  "Campos do Jordão": [-22.739, -45.590],
  "Bonito": [-21.126, -56.483],
  "Fernando de Noronha": [-3.854, -32.425],
  "Florianópolis": [-27.594, -48.548],
  "Salvador": [-12.971, -38.501],
  "Rio de Janeiro": [-22.906, -43.172],
  "São Paulo": [-23.548, -46.636],
  "Fortaleza": [-3.717, -38.543],
  "Manaus": [-3.119, -60.021],
  "Foz do Iguaçu": [-25.547, -54.588],
  "Porto Alegre": [-30.034, -51.217],
  "Recife": [-8.047, -34.877],
  "Natal": [-5.793, -35.209],
  "Maceió": [-9.665, -35.735],
  "Curitiba": [-25.428, -49.273],
  "Belo Horizonte": [-19.916, -43.934],
  "Brasília": [-15.779, -47.929],
  "Belém": [-1.455, -48.502],
  "Chapada dos Guimarães": [-15.462, -55.748],
  "Lençóis Maranhenses": [-2.488, -43.121],
  "Barreirinhas": [-2.755, -42.826],
  "Jericoacoara": [-2.793, -40.512],
  "Arraial do Cabo": [-22.966, -42.028],
  "Búzios": [-22.748, -41.882],
  "Paraty": [-23.217, -44.714],
  "Angra dos Reis": [-23.006, -44.318],
  "Trancoso": [-16.589, -39.092],
  "Porto Seguro": [-16.446, -39.064],
  "Morro de São Paulo": [-13.381, -38.916],
  "Pirenópolis": [-15.851, -48.961],
  "Alto Paraíso de Goiás": [-14.124, -47.509],
  "Chapada Diamantina": [-12.554, -41.389],
  "Lençóis": [-12.561, -41.388],
  "Pantanal": [-18.000, -57.000],
  "Corumbá": [-19.009, -57.653],
  "Alter do Chão": [-2.506, -54.951],
  "São Thomé das Letras": [-21.718, -44.982],
  "Tiradentes": [-21.108, -44.174],
  "Ouro Preto": [-20.385, -43.503],
  "Diamantina": [-18.241, -43.600],
  "Penedo": [-10.295, -36.585],
  "Olinda": [-8.009, -34.855],
  "São Luís": [-2.529, -44.302],
  "Palmas": [-10.240, -48.358],
  "Porto Velho": [-8.761, -63.904],
  "Boa Vista": [2.820, -60.672],
  "Macapá": [0.034, -51.066],
  "Rio Branco": [-9.975, -67.824],
  "Vitória": [-20.315, -40.312],
  "Aracaju": [-10.916, -37.077],
  "João Pessoa": [-7.120, -34.862],
  "Teresina": [-5.089, -42.802],
  "Cuiabá": [-15.601, -56.097],
  "Campo Grande": [-20.469, -54.620],
  "Porto de Galinhas": [-8.705, -35.038],
  "Maragogi": [-9.010, -35.222],
  "Pipa": [-6.228, -35.038],
  "Maraú": [-14.106, -39.015],
  "Caraíva": [-16.893, -39.176],
  "Arraial d'Ajuda": [-16.459, -39.056],
  "Mucugê": [-13.002, -41.370],
  "Prado": [-17.339, -39.218],
  "Cachoeira": [-12.607, -38.957],
  "Cumbuco": [-3.637, -38.720],
  "Aracati": [-4.562, -37.769],
  "Beberibe": [-4.179, -38.133],
  "Camocim": [-2.902, -40.841],
  "Mariana": [-20.376, -43.416],
  "Capitólio": [-20.613, -46.044],
  "Poços de Caldas": [-21.787, -46.561],
  "São Lourenço": [-22.115, -45.053],
  "Araxá": [-19.593, -46.940],
  "Urubici": [-28.015, -49.593],
  "São Joaquim": [-28.293, -49.932],
  "Itapema": [-27.090, -48.612],
  "São Francisco do Sul": [-26.241, -48.638],
  "Cambará do Sul": [-29.046, -50.135],
  "Itu": [-23.264, -47.299],
  "Guarujá": [-23.993, -46.257],
  "Aparecida": [-22.851, -45.231],
  "Ribeirão Preto": [-21.170, -47.810],
  "Iguape": [-24.708, -47.556],
  "Ilha Grande": [-23.145, -44.220],
  "Itatiaia": [-22.493, -44.556],
  "Saquarema": [-22.919, -42.509],
  "Tamandaré": [-8.758, -35.104],
  "Triunfo": [-7.832, -38.098],
  "Galinhos": [-4.988, -36.266],
  "Mossoró": [-5.188, -37.344],
  "Campina Grande": [-7.230, -35.881],
  "Areia": [-6.968, -35.697],
  "Barra de São Miguel": [-9.872, -35.902],
  "São Miguel dos Milagres": [-9.276, -35.420],
  "Pedro II": [-4.425, -41.458],
  "Luís Correia": [-2.882, -41.663],
  "Alcântara": [-2.407, -44.414],
  "Atins": [-2.534, -42.746],
  "Abadiânia": [-16.197, -48.706],
  "Cavalcante": [-13.796, -47.458],
  "Alta Floresta": [-9.876, -56.086],
  "Cáceres": [-16.072, -57.679],
  "Londrina": [-23.304, -51.167],
  "Maringá": [-23.425, -51.938],
  "Matinhos": [-25.818, -48.533],
  "São Cristóvão": [-11.014, -37.203],
  "Itaúnas": [-18.414, -39.674],
  "Anchieta": [-20.804, -40.646],
  "Monte Alegre": [-1.996, -54.069],
  "Barcelos": [-0.971, -62.923],
  "São Gabriel da Cachoeira": [-0.131, -67.088],
  "Cruzeiro do Sul": [-7.627, -72.675],
  "Guajará-Mirim": [-10.783, -65.340],
}

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const L = (window as any).L
      if (!mapRef.current) return
      const map = L.map(mapRef.current).setView([-15.788, -47.879], 4)
      mapInstance.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(map)

      // Group hotels by city to avoid duplicate markers
      const cityHotels: Record<string, typeof hotelsData> = {}
      hotelsData.forEach(hotel => {
        const coords = cityCoords[hotel.city]
        if (!coords) return
        if (!cityHotels[hotel.city]) cityHotels[hotel.city] = []
        cityHotels[hotel.city].push(hotel)
      })

      Object.entries(cityHotels).forEach(([city, hotels]) => {
        const coords = cityCoords[city]
        if (!coords) return
        const first = hotels[0]
        const count = hotels.length

        const icon = L.divIcon({
          html: `<div style="background:linear-gradient(135deg,#2563eb,#7c3aed);color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;gap:4px"><span>${city}</span>${count > 1 ? `<span style="background:white;color:#2563eb;border-radius:10px;padding:1px 5px;font-size:10px">${count}</span>` : ''}</div>`,
          className: '',
          iconAnchor: [0, 0],
        })

        const marker = L.marker(coords, { icon }).addTo(map)
        const hotelLinks = hotels.slice(0, 3).map(h =>
          `<a href="/hotel/${h.id}" style="display:block;padding:4px 0;color:#2563eb;text-decoration:none;font-size:12px;font-weight:500">→ ${h.name}</a>`
        ).join('')

        marker.bindPopup(`
          <div style="min-width:200px;font-family:system-ui,sans-serif">
            <img src="${first.image}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;margin-bottom:8px" alt="${city}">
            <b style="font-size:14px;color:#111">${city}, ${first.state}</b><br>
            <span style="color:#6b7280;font-size:11px">${count} ${count === 1 ? 'hotel' : 'hotéis'} disponíveis</span>
            <div style="margin-top:8px;border-top:1px solid #f0f0f0;padding-top:8px">
              ${hotelLinks}
            </div>
          </div>
        `)
      })
    }
    document.head.appendChild(script)

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div>
      <div ref={mapRef} style={{ height: '600px', borderRadius: '16px', zIndex: 0, border: '1px solid #e5e7eb' }} />
      <p className="text-gray-400 text-xs mt-2 text-center">
        Clique nos marcadores para ver os hotéis disponíveis na cidade
      </p>
    </div>
  )
}
