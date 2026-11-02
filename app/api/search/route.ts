import { NextRequest, NextResponse } from "next/server";
import { hotelsData, Hotel } from "@/lib/hotels-data";

function normalizeText(text: string): string {
  return text.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

function scoreHotel(hotel: Hotel, query: string, filters: {
  region?: string;
  state?: string;
  seasonal?: string;
  packageFor?: string;
  maxPrice?: number;
  type?: string;
}): number {
  let score = 0;
  const words = normalizeText(query).split(/\s+/).filter(Boolean);

  for (const w of words) {
    if (normalizeText(hotel.city).includes(w)) score += 20;
    if (normalizeText(hotel.state).includes(w)) score += 7;
    if (normalizeText(hotel.region).includes(w)) score += 6;
    if (normalizeText(hotel.name).includes(w)) score += 10;
    if (hotel.tags.some(t => normalizeText(t).includes(w))) score += 5;
    if (normalizeText(hotel.description).includes(w)) score += 3;
    if (hotel.amenities.some(a => normalizeText(a).includes(w))) score += 2;
  }

  // Filter scoring
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
      verao: "Verão",
      carnaval: "Carnaval",
      "semana-santa": "Semana Santa",
      "ferias-julho": "Férias de Julho",
      natal: "Natal",
      reveillon: "Réveillon",
      inverno: "Inverno",
      pascoa: "Páscoa",
    };
    const season = seasonMap[filters.seasonal] || filters.seasonal;
    if (hotel.seasonal?.some(s => s.toLowerCase().includes(season.toLowerCase()))) score += 12;
  }
  if (filters.packageFor) {
    const pkgMap: Record<string, string> = {
      familia: "Família",
      casal: "Casal",
      aventura: "Aventura",
      natureza: "Natureza",
      gastronomia: "Gastronomia",
      "all-inclusive": "All-Inclusive",
    };
    const pkg = pkgMap[filters.packageFor] || filters.packageFor;
    if (hotel.packageFor?.some(p => p.toLowerCase().includes(pkg.toLowerCase()))) score += 10;
  }
  if (filters.maxPrice && hotel.priceFrom <= filters.maxPrice) score += 5;
  if (filters.type && filters.type !== "todos") {
    if (hotel.type === filters.type) score += 8;
  }

  // Quality boost
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

  const scored = hotelsData.map(hotel => ({ hotel, score: scoreHotel(hotel, query, filters) }));

  let results = scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ hotel }) => hotel);

  // If no query and no meaningful filters, return all featured first
  if (!query && region === "Todos" && state === "Todos" && !seasonal && !packageFor) {
    results = [...hotelsData].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }

  // If query returned nothing, suggest top-rated hotels as fallback
  if (query && results.length === 0) {
    results = [...hotelsData]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }

  const aiSuggestion = generateAISuggestion(query, results.length, filters);

  return NextResponse.json({
    results,
    total: results.length,
    aiSuggestion,
    query,
  });
}

function generateAISuggestion(query: string, count: number, filters: Record<string, string | number | undefined>): string {
  if (!query && !filters.seasonal && !filters.packageFor) {
    return `Encontrei ${count} hotéis e pousadas disponíveis em todo o Brasil. Use os filtros ou descreva sua viagem ideal para resultados personalizados!`;
  }

  const parts: string[] = [];
  if (query) parts.push(`"${query}"`);
  if (filters.region && filters.region !== "Todos") parts.push(`na região ${filters.region}`);
  if (filters.state && filters.state !== "Todos") parts.push(`no estado ${filters.state}`);
  if (filters.seasonal) parts.push(`para o período sazonal selecionado`);
  if (filters.packageFor) parts.push(`com pacote para ${filters.packageFor}`);

  if (count === 0) {
    return `Não encontrei resultados para ${parts.join(", ")}. Tente ampliar os filtros ou buscar em outras regiões do Brasil.`;
  }

  if (query && parts.length > 0) {
    return `Encontrei ${count} opção${count > 1 ? "s" : ""} para ${parts.join(", ")}. Resultados ordenados por relevância e avaliação dos hóspedes.`;
  }

  return `Mostrando ${count} opção${count > 1 ? "s" : ""} disponíveis. Os resultados estão ordenados por relevância e avaliação dos hóspedes.`;
}
