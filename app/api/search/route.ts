import { NextRequest, NextResponse } from "next/server";
import { hotelsData, Hotel } from "@/lib/hotels-data";

function scoreHotel(hotel: Hotel, query: string, filters: {
  region?: string;
  state?: string;
  seasonal?: string;
  packageFor?: string;
  maxPrice?: number;
  type?: string;
}): number {
  let score = 0;
  const q = query.toLowerCase();

  if (hotel.name.toLowerCase().includes(q)) score += 10;
  if (hotel.city.toLowerCase().includes(q)) score += 8;
  if (hotel.state.toLowerCase().includes(q)) score += 7;
  if (hotel.region.toLowerCase().includes(q)) score += 6;
  if (hotel.tags.some(t => t.toLowerCase().includes(q))) score += 5;
  if (hotel.description.toLowerCase().includes(q)) score += 3;
  if (hotel.amenities.some(a => a.toLowerCase().includes(q))) score += 2;

  if (filters.region && filters.region !== "Todos") {
    if (hotel.region === filters.region) score += 15;
    else score -= 20;
  }
  if (filters.state && filters.state !== "Todos") {
    if (hotel.state === filters.state) score += 15;
    else score -= 20;
  }
  if (filters.seasonal) {
    const seasonMap: Record<string, string> = {
      verao: "Verão", carnaval: "Carnaval", "semana-santa": "Semana Santa",
      "ferias-julho": "Férias de Julho", natal: "Natal", reveillon: "Réveillon",
      inverno: "Inverno", pascoa: "Páscoa",
    };
    const season = seasonMap[filters.seasonal] || filters.seasonal;
    if (hotel.seasonal?.some(s => s.toLowerCase().includes(season.toLowerCase()))) score += 12;
  }
  if (filters.packageFor) {
    const pkgMap: Record<string, string> = {
      familia: "Família", casal: "Casal", aventura: "Aventura",
      natureza: "Natureza", gastronomia: "Gastronomia", "all-inclusive": "All-Inclusive",
    };
    const pkg = pkgMap[filters.packageFor] || filters.packageFor;
    if (hotel.packageFor?.some(p => p.toLowerCase().includes(pkg.toLowerCase()))) score += 10;
  }
  if (filters.maxPrice && hotel.priceFrom <= filters.maxPrice) score += 5;
  if (filters.type && filters.type !== "todos") {
    if (hotel.type === filters.type) score += 8;
  }

  score += hotel.rating * 2;
  if (hotel.featured) score += 5;
  if (hotel.discount) score += hotel.discount / 10;

  return score;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const region = searchParams.get("region") || "Todos";
  const state = searchParams.get("state") || "Todos";
  const seasonal = searchParams.get("seasonal") || "";
  const packageFor = searchParams.get("packageFor") || "";
  const maxPrice = parseInt(searchParams.get("maxPrice") || "0");
  const type = searchParams.get("type") || "todos";

  const filters = { region, state, seasonal, packageFor, maxPrice, type };

  let results = hotelsData
    .map(hotel => ({ hotel, score: scoreHotel(hotel, query, filters) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ hotel }) => hotel);

  if (!query && region === "Todos" && state === "Todos" && !seasonal && !packageFor) {
    results = [...hotelsData].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }

  const aiSuggestion = generateAISuggestion(query, results.length, filters);

  return NextResponse.json({ results, total: results.length, aiSuggestion, query });
}

function generateAISuggestion(query: string, count: number, filters: Record<string, string | number | undefined>): string {
  if (!query && !filters.seasonal && !filters.packageFor) {
    return `Encontrei ${count} hotéis e pousadas disponíveis em todo o Brasil. Use os filtros ou descreva sua viagem ideal!`;
  }
  const parts: string[] = [];
  if (query) parts.push(`"${query}"`);
  if (filters.region && filters.region !== "Todos") parts.push(`na região ${filters.region}`);
  if (filters.state && filters.state !== "Todos") parts.push(`no estado ${filters.state}`);
  if (filters.seasonal) parts.push(`para o período sazonal selecionado`);
  if (filters.packageFor) parts.push(`com pacote para ${filters.packageFor}`);
  if (count === 0) return `Não encontrei resultados para ${parts.join(", ")}. Tente ampliar os filtros.`;
  return `IA encontrou ${count} opção${count > 1 ? "s" : ""} para ${parts.join(", ")}. Ordenados por relevância e avaliação.`;
}
