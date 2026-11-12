"use client";
import { useEffect, useRef } from "react";
import { Hotel } from "@/lib/hotels-data";

// City coordinates for Brazilian cities
const CITY_COORDS: Record<string, [number, number]> = {
  "Gramado": [-29.3744, -50.8769],
  "Campos do Jordão": [-22.7391, -45.5918],
  "Bonito": [-21.1261, -56.4833],
  "Trancoso": [-16.5906, -39.0869],
  "Porto de Galinhas": [-8.7069, -35.0444],
  "Florianópolis": [-27.5969, -48.5495],
  "Búzios": [-22.7470, -41.8818],
  "Angra dos Reis": [-23.0067, -44.3182],
  "Paraty": [-23.2178, -44.7131],
  "Foz do Iguaçu": [-25.5478, -54.5882],
  "Fortaleza": [-3.7319, -38.5267],
  "Natal": [-5.7945, -35.2110],
  "Maceió": [-9.6659, -35.7350],
  "Salvador": [-12.9714, -38.5014],
  "Recife": [-8.0476, -34.8770],
  "Manaus": [-3.1190, -60.0217],
  "Belém": [-1.4558, -48.5044],
  "Porto Alegre": [-30.0346, -51.2177],
  "Curitiba": [-25.4290, -49.2671],
  "São Paulo": [-23.5558, -46.6396],
  "Rio de Janeiro": [-22.9068, -43.1729],
  "Belo Horizonte": [-19.9191, -43.9387],
  "Campinas": [-22.9099, -47.0626],
  "Ribeirão Preto": [-21.1704, -47.8103],
  "Santos": [-23.9608, -46.3336],
  "Ilhéus": [-14.7889, -39.0481],
  "Itacaré": [-14.2769, -38.9986],
  "Praia do Forte": [-12.5771, -38.0019],
  "Jericoacoara": [-2.7975, -40.5131],
  "Lençóis Maranhenses": [-2.4855, -43.1293],
  "Pantanal": [-17.7262, -57.4825],
  "Chapada Diamantina": [-12.4580, -41.3300],
  "Chapada dos Veadeiros": [-14.1443, -47.7215],
  "Alter do Chão": [-2.5215, -55.0094],
  "Fernando de Noronha": [-3.8554, -32.4290],
  "Arraial do Cabo": [-22.9666, -42.0280],
  "Cabo Frio": [-22.8794, -42.0186],
  "Petrópolis": [-22.5059, -43.1792],
  "Teresópolis": [-22.4123, -42.9608],
  "Nova Friburgo": [-22.2822, -42.5311],
  "Tiradentes": [-21.1127, -44.1740],
  "Ouro Preto": [-20.3851, -43.5035],
  "São João del Rei": [-21.1300, -44.2581],
  "Olinda": [-7.9994, -34.8509],
  "Morro de São Paulo": [-13.3814, -38.9142],
  "Barreirinhas": [-2.7557, -42.8217],
  "Atibaia": [-23.1172, -46.5508],
  "Serra Negra": [-22.6094, -46.6997],
  "Brotas": [-22.2797, -48.1264],
  "Olímpia": [-20.7325, -48.9120],
  "Águas de Lindóia": [-22.4772, -46.6319],
  "Boituva": [-23.2847, -47.6744],
  "São Roque": [-23.5280, -47.1364],
};

function getCoords(hotel: Hotel): [number, number] | null {
  if (CITY_COORDS[hotel.city]) return CITY_COORDS[hotel.city];
  // Slight random offset so overlapping pins spread
  const seed = hotel.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  // Fall back: Brazil center
  return [-14.2350 + (seed % 30 - 15) * 0.5, -51.9253 + (seed % 40 - 20) * 0.5];
}

export default function MapView({ hotels, onHotelClick }: { hotels: Hotel[]; onHotelClick?: (hotel: Hotel) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then(L => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [-15.7801, -47.9292],
        zoom: 4,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Custom icon
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#f97316;color:white;font-size:11px;font-weight:800;padding:3px 7px;border-radius:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white">R$</div>`,
        iconAnchor: [20, 10],
      });

      const bounds: [number, number][] = [];

      hotels.forEach(hotel => {
        const coords = getCoords(hotel);
        if (!coords) return;
        bounds.push(coords);

        const marker = L.marker(coords, {
          icon: L.divIcon({
            className: "",
            html: `<div style="background:#f97316;color:white;font-size:10px;font-weight:800;padding:3px 8px;border-radius:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;cursor:pointer">R$ ${hotel.priceFrom}</div>`,
            iconAnchor: [30, 10],
          }),
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family:sans-serif;min-width:200px">
            <img src="${hotel.image}?w=400&q=70" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px" />
            <div style="font-weight:800;font-size:13px;margin-bottom:2px">${hotel.name}</div>
            <div style="color:#6b7280;font-size:12px;margin-bottom:4px">📍 ${hotel.city}, ${hotel.state}</div>
            <div style="font-size:14px;font-weight:900;color:#1f2937">R$ ${hotel.priceFrom}<span style="font-size:11px;font-weight:400;color:#9ca3af">/noite</span></div>
            <div style="margin-top:6px">
              ${"★".repeat(hotel.stars)}<span style="color:#9ca3af">${"★".repeat(5 - hotel.stars)}</span>
              <span style="margin-left:6px;background:#4ade80;color:#14532d;font-size:11px;font-weight:700;padding:2px 6px;border-radius:4px">${hotel.rating.toFixed(1)}</span>
            </div>
          </div>
        `);

        marker.on("click", () => {
          onHotelClick?.(hotel);
        });
      });

      if (bounds.length > 0) {
        try { map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 }); } catch {}
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when hotels change
  useEffect(() => {
    // Re-mount handled by key prop in parent
  }, [hotels]);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      <div ref={mapRef} style={{ height: "480px", width: "100%" }} />
    </div>
  );
}
