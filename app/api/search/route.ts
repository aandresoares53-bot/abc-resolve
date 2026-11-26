import { NextRequest, NextResponse } from "next/server";
import { hotelsData, Hotel } from "@/lib/hotels-data";
import { fetchOSMHotels, normalizeNameForDedup } from "@/lib/overpass";
import Groq from "groq-sdk";

function normalizeText(text: string): string {
  return text.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

// ---- Intent parsing: extract structured intent from free-text query ----

interface QueryIntent {
  typeOverride?: string;       // espaco-inteiro | pousada | hostel | hotel | resort
  packageFor?: string;         // Família | Casal | Aventura | Natureza | Gastronomia
  amenityBoosts: string[];     // amenities to boost: Piscina, Pet, Café da Manhã, etc.
  envBoosts: string[];         // tag environments: Praia, Serra, Centro, etc.
  budgetMax?: number;          // price ceiling from words like "barato"
  budgetMin?: number;          // price floor from words like "luxo"
  cleanQuery: string;          // query with intent keywords removed
}

const TYPE_KEYWORDS: [RegExp, string][] = [
  [/\bchal[eé]s?\b/gi, "espaco-inteiro"],
  [/\bbangal[oô]s?\b/gi, "espaco-inteiro"],
  [/\bcabanas?\b/gi, "espaco-inteiro"],
  [/\bvillas?\b/gi, "espaco-inteiro"],
  [/\bcasas?\b/gi, "espaco-inteiro"],
  [/\bhostels?\b/gi, "hostel"],
  [/\bhospedagens?\b/gi, "pousada"],
  [/\bpousadas?\b/gi, "pousada"],
  [/\bresorts?\b/gi, "hotel"],
];

const PACKAGE_KEYWORDS: [RegExp, string][] = [
  [/\bfam[ií]li[ao]s?\b/gi, "Família"],
  [/\bfilhos?\b/gi, "Família"],
  [/\bcrian[çc]as?\b/gi, "Família"],
  [/\bkids?\b/gi, "Família"],
  [/\bcasal\b/gi, "Casal"],
  [/\blua\s+de\s+mel\b/gi, "Casal"],
  [/\brom[âa]ntic[oa]s?\b/gi, "Casal"],
  [/\baventura\b/gi, "Aventura"],
  [/\btrilha\b/gi, "Aventura"],
  [/\becol[oó]gic[oa]\b/gi, "Natureza"],
  [/\bnatureza\b/gi, "Natureza"],
  [/\bgastronom\w+\b/gi, "Gastronomia"],
  [/\bculin[áa]ri[ao]\b/gi, "Gastronomia"],
  [/\ball[\s-]inclusive\b/gi, "All-Inclusive"],
];

const AMENITY_KEYWORDS: [RegExp, string][] = [
  [/\bpiscing?\b|\bpiscinas?\b|\bpool\b/gi, "Piscina"],
  [/\bpet[\s-]friendly\b|\baceita\s+pets?\b|\bcom\s+pets?\b|\bcachorro\b/gi, "Pet Friendly"],
  [/\bcaf[eé]\s+da\s+manh[ã]\b|\bcafe\s+da\s+manha\b|\bcaf[eé]\s+inclus\w+\b/gi, "Café da Manhã"],
  [/\bestacionamento\b|\bgaragem\b|\bparking\b/gi, "Estacionamento"],
  [/\bwifi\b|\binternet\b|\bwi[\s-]fi\b/gi, "Wi-Fi"],
  [/\bacademias?\b|\bgym\b|\bfitness\b/gi, "Academia"],
  [/\bspa\b/gi, "Spa"],
  [/\bar\s+condicionado\b|\bar\s+cond\b|\bac\b/gi, "Ar-condicionado"],
];

const ENV_KEYWORDS: [RegExp, string][] = [
  [/\bpraias?\b|\bmar\b|\blitoral\b|\borla\b/gi, "Praia"],
  [/\bserras?\b|\bmontanhas?\b|\bneblina\b/gi, "Serra"],
  [/\bcentro\b|\burban[oa]\b|\bcidade\b/gi, "Centro"],
  [/\bfloresta\b|\bamaz[oô]nia\b|\beco\b|\bnatur\w+\b/gi, "Natureza"],
  [/\bfazenda\b|\brural\b|\bcampo\b|\bs[ií]tio\b/gi, "Fazenda"],
  [/\bchapada\b/gi, "Chapada"],
];

const BUDGET_KEYWORDS: [RegExp, { max?: number; min?: number }][] = [
  [/\bbarato\b|\becon[oô]mic[oa]\b|\bacess[ií]vel\b|\bbom\s+pre[cç]o\b/gi, { max: 300 }],
  [/\bm[eé]dio\b|\bintermedi[áa]rio\b/gi, { max: 600, min: 200 }],
  [/\bluxo\b|\bluxuos[oa]\b|\bpremium\b|\bexclusiv\w+\b|\b5\s+estrelas?\b/gi, { min: 500 }],
  [/\b4\s+estrelas?\b/gi, { min: 300 }],
];

// Keywords to strip before city detection (type/generic travel words)
const STRIP_BEFORE_CITY = [
  /\bhoteis?\b|\bpousadas?\b|\bhostels?\b|\bresorts?\b|\bchal[eé]s?\b|\bbangal[oô]s?\b|\bcabanas?\b|\bvillas?\b/gi,
  /\bem\b|\bna\b|\bno\b|\bperto\s+de\b|\bpr[oó]ximo\s+de\b|\bpara\b|\bcom\b|\bde\b|\bdo\b|\bda\b/gi,
  /\bmelhores?\b|\bbons?\b|\bboa\b|\bbarato\b|\bluxo\b|\becon[oô]mic[oa]\b/gi,
  /\bpiscing?\b|\bpiscinas?\b|\bpool\b/gi,
  /\bpet[\s-]friendly\b/gi,
  /\bcaf[eé]\s+da\s+manh[ã]\b/gi,
  /\bfam[ií]li[ao]s?\b|\bcasal\b|\blua\s+de\s+mel\b|\brom[âa]ntic[oa]\b/gi,
  /\baventura\b|\bnatureza\b|\becol[oó]gic[oa]\b|\btrilha\b/gi,
  /\bpiscing?\b|\bpraias?\b|\bmar\b|\bserras?\b|\bmontanhas?\b|\bcentro\b/gi,
];

function parseQueryIntent(rawQuery: string): QueryIntent {
  let q = rawQuery;
  const amenityBoosts: string[] = [];
  const envBoosts: string[] = [];
  let typeOverride: string | undefined;
  let packageFor: string | undefined;
  let budgetMax: number | undefined;
  let budgetMin: number | undefined;

  // Extract type override
  for (const [re, type] of TYPE_KEYWORDS) {
    if (re.test(q)) {
      typeOverride = type;
      q = q.replace(re, " ");
      re.lastIndex = 0;
    }
  }

  // Extract package/theme
  for (const [re, pkg] of PACKAGE_KEYWORDS) {
    if (re.test(q)) {
      packageFor = pkg;
      q = q.replace(re, " ");
      re.lastIndex = 0;
    }
  }

  // Extract amenity boosts
  for (const [re, amenity] of AMENITY_KEYWORDS) {
    if (re.test(q)) {
      amenityBoosts.push(amenity);
      q = q.replace(re, " ");
      re.lastIndex = 0;
    }
  }

  // Extract environment boosts
  for (const [re, env] of ENV_KEYWORDS) {
    if (re.test(q)) {
      envBoosts.push(env);
      q = q.replace(re, " ");
      re.lastIndex = 0;
    }
  }

  // Extract budget
  for (const [re, budget] of BUDGET_KEYWORDS) {
    if (re.test(q)) {
      if (budget.max) budgetMax = budget.max;
      if (budget.min) budgetMin = budget.min;
      q = q.replace(re, " ");
      re.lastIndex = 0;
    }
  }

  const cleanQuery = q.replace(/\s{2,}/g, " ").trim();

  return { typeOverride, packageFor, amenityBoosts, envBoosts, budgetMax, budgetMin, cleanQuery };
}

// ---- Scoring ----

function scoreHotel(hotel: Hotel, query: string, filters: {
  region?: string;
  state?: string;
  seasonal?: string;
  packageFor?: string;
  maxPrice?: number;
  type?: string;
}, intent?: QueryIntent): number {
  let score = 0;
  const words = normalizeText(query).split(/\s+/).filter(Boolean);

  for (const w of words) {
    if (normalizeText(hotel.city).includes(w)) score += 20;
    if (normalizeText(hotel.state).includes(w)) score += 7;
    if (normalizeText(hotel.region).includes(w)) score += 6;
    if (normalizeText(hotel.name).includes(w)) score += 10;
    if (hotel.aliases?.some(a => normalizeText(a).includes(w))) score += 15;
    if (hotel.tags.some(t => normalizeText(t).includes(w))) score += 5;
    if (normalizeText(hotel.description).includes(w)) score += 3;
    if (hotel.amenities.some(a => normalizeText(a).includes(w))) score += 2;
  }

  // Apply intent boosts
  if (intent) {
    // Amenity boosts: heavily reward hotels that have requested amenities
    for (const amenity of intent.amenityBoosts) {
      const normAmenity = normalizeText(amenity);
      if (hotel.amenities.some(a => normalizeText(a).includes(normAmenity))) score += 18;
      if (hotel.tags.some(t => normalizeText(t).includes(normAmenity))) score += 10;
    }

    // Environment boosts: reward hotels with matching tags
    for (const env of intent.envBoosts) {
      const normEnv = normalizeText(env);
      if (hotel.tags.some(t => normalizeText(t).includes(normEnv))) score += 12;
      if (normalizeText(hotel.description).includes(normEnv)) score += 6;
      if (normalizeText(hotel.city).includes(normEnv)) score += 8;
    }

    // Package boost
    if (intent.packageFor) {
      const normPkg = normalizeText(intent.packageFor);
      if (hotel.packageFor?.some(p => normalizeText(p).includes(normPkg))) score += 15;
    }

    // Budget filtering: penalize out-of-range hotels
    if (intent.budgetMax && hotel.priceFrom > intent.budgetMax) score -= 15;
    if (intent.budgetMin && hotel.priceFrom < intent.budgetMin) score -= 10;
    // Reward in-budget
    if (intent.budgetMax && hotel.priceFrom <= intent.budgetMax) score += 5;
    if (intent.budgetMin && hotel.priceFrom >= intent.budgetMin) score += 5;
  }

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

  score += hotel.rating * 2;
  if (hotel.featured) score += 5;
  if (hotel.discount) score += hotel.discount / 10;

  return score;
}

// ---- City detection with improved fuzzy matching ----

function detectCityInQuery(rawQuery: string): string | null {
  // Build clean query: strip type/intent keywords for city detection
  let stripped = rawQuery;
  for (const re of STRIP_BEFORE_CITY) {
    stripped = stripped.replace(re, " ");
  }
  stripped = stripped.replace(/\s{2,}/g, " ").trim();

  const normQuery = normalizeText(stripped || rawQuery);
  const citySet = new Map<string, string>(); // normCity -> original city
  hotelsData.forEach(h => { citySet.set(normalizeText(h.city), h.city); });

  // Sort cities by name length descending so longer/more specific cities match first
  const cities = Array.from(citySet.entries()).sort((a, b) => b[0].length - a[0].length);

  // 1. Exact substring match against full normalized query (longest city wins)
  for (const [normCity, origCity] of cities) {
    if (normCity.length >= 3 && normQuery.includes(normCity)) return origCity;
  }

  // 2. Word-by-word city matching (each word of multi-word city must appear in query)
  for (const [normCity, origCity] of cities) {
    if (normCity.length < 4) continue;
    const cityWords = normCity.split(/\s+/).filter(w => w.length >= 3 && !["das", "dos", "de", "do", "da", "e"].includes(w));
    if (cityWords.length > 1 && cityWords.every(w => normQuery.includes(w))) return origCity;
  }

  // 3. Alias match
  for (const hotel of hotelsData) {
    if (hotel.aliases) {
      for (const alias of hotel.aliases) {
        const normAlias = normalizeText(alias);
        if (normAlias.length >= 3 && normQuery.includes(normAlias)) return hotel.city;
      }
    }
  }

  // 4. State match: normalize to city list of that state
  const stateAbbrevMap: Record<string, string> = {
    "rio de janeiro": "RJ", rj: "RJ", "sao paulo": "SP", sp: "SP",
    "minas gerais": "MG", mg: "MG", bahia: "BA", ba: "BA",
    "pernambuco": "PE", pe: "PE", ceara: "CE", ce: "CE",
    "rio grande do norte": "RN", rn: "RN",
    "rio grande do sul": "RS", rs: "RS",
    "santa catarina": "SC", sc: "SC",
    "parana": "PR", pr: "PR", goias: "GO", go: "GO",
    "mato grosso do sul": "MS", ms: "MS",
    "mato grosso": "MT", mt: "MT",
    "para": "PA", pa: "PA", amazonas: "AM", am: "AM",
    "espirito santo": "ES", es: "ES",
    "alagoas": "AL", al: "AL", sergipe: "SE", se: "SE",
    "paraiba": "PB", pb: "PB", piaui: "PI", pi: "PI",
    "maranhao": "MA", ma: "MA",
    "tocantins": "TO", to: "TO",
    "rondonia": "RO", ro: "RO", acre: "AC", ac: "AC",
    "roraima": "RR", rr: "RR", amapa: "AP", ap: "AP",
    "distrito federal": "DF", df: "DF",
  };
  for (const [stateNorm, stateCode] of Object.entries(stateAbbrevMap)) {
    if (normQuery.includes(stateNorm) || normQuery === stateNorm) {
      // Return null; caller can filter by state
      return null;
    }
  }

  return null;
}

function detectHotelByName(query: string): Hotel | null {
  const normQuery = normalizeText(query);
  let best: Hotel | null = null;
  let bestScore = 0;
  for (const hotel of hotelsData) {
    const normName = normalizeText(hotel.name);
    if (normQuery.includes(normName) || normName.includes(normQuery)) {
      const score = normName.length;
      if (score > bestScore) { bestScore = score; best = hotel; }
    }
  }
  return bestScore >= 6 ? best : null;
}

// ---- Type matching ----

const ESPACO_INTEIRO_TAGS = ["Espaço Inteiro", "Casa Inteira", "Apartamento", "Chalé", "Chalés", "Bangalô", "Bangalôs", "Villa", "Villas", "Bangalô Privativo", "Bangalôs Privativos", "Chalé Privativo", "Bangalô com Piscina", "Bangalô Pé na Areia"];

function matchesType(hotel: Hotel, t: string): boolean {
  if (t === "todos") return true;
  if (t === "espaco-inteiro") {
    const tags = hotel.tags ?? [];
    return tags.some(tag => ESPACO_INTEIRO_TAGS.some(et => tag.toLowerCase().includes(et.toLowerCase()))) ||
      hotel.type === "pousada";
  }
  if (t === "pousada") return hotel.type === "pousada";
  return hotel.type === t;
}

// ---- Main handler ----

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

  // Parse intent from free-text query
  const intent = query ? parseQueryIntent(query) : null;

  // Use cleaned query (intent-stripped) for city/hotel detection
  const queryForDetection = intent?.cleanQuery || query;

  if (!query && region === "Todos" && state === "Todos" && !seasonal && !packageFor && type === "todos") {
    const results = [...hotelsData].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
    return NextResponse.json({
      results,
      total: results.length,
      aiSuggestion: `Encontrei ${results.length} hotéis e pousadas disponíveis em todo o Brasil. Use os filtros ou descreva sua viagem ideal para resultados personalizados!`,
      query,
    });
  }

  const detectedCity = queryForDetection ? detectCityInQuery(queryForDetection) : null;
  const detectedHotel = !detectedCity && queryForDetection ? detectHotelByName(queryForDetection) : null;

  // Effective type: intent override > URL param
  const effectiveType = intent?.typeOverride || (type !== "todos" ? type : undefined);

  // Effective package: intent > URL param
  const effectivePackage = intent?.packageFor || (packageFor || undefined);

  let results: Hotel[];

  if (detectedHotel && !detectedCity) {
    // Direct hotel name search: put that hotel first, then similar hotels
    let similar = hotelsData
      .filter(h => h.id !== detectedHotel.id && (h.city === detectedHotel.city || h.state === detectedHotel.state))
      .sort((a, b) => b.rating - a.rating);

    // Filter by effective type if specified
    if (effectiveType) similar = similar.filter(h => matchesType(h, effectiveType));

    results = [detectedHotel, ...similar.slice(0, 8)];
  } else if (detectedCity) {
    // City detected: show ALL hotels from that city, sorted by featured+rating
    let cityHotels = hotelsData.filter(h => h.city === detectedCity);

    // Apply type filter from intent or URL param
    if (effectiveType) {
      cityHotels = cityHotels.filter(h => matchesType(h, effectiveType));
    }

    // Apply package filter from intent
    if (effectivePackage) {
      const normPkg = normalizeText(effectivePackage);
      const withPkg = cityHotels.filter(h => h.packageFor?.some(p => normalizeText(p).includes(normPkg)));
      if (withPkg.length > 0) cityHotels = withPkg;
    }

    // Apply amenity filters from intent (soft: only if enough results)
    if (intent && intent.amenityBoosts.length > 0) {
      const withAmenity = cityHotels.filter(h =>
        intent.amenityBoosts.every(a => {
          const normA = normalizeText(a);
          return h.amenities.some(ha => normalizeText(ha).includes(normA)) ||
            h.tags.some(t => normalizeText(t).includes(normA));
        })
      );
      if (withAmenity.length >= 2) cityHotels = withAmenity;
    }

    // Score within city to rank by intent relevance
    const cityScored = cityHotels.map(h => ({
      hotel: h,
      score: scoreHotel(h, queryForDetection, filters, intent || undefined)
    }));
    const sorted = cityScored
      .sort((a, b) => {
        // Featured first within same score band
        const scoreDiff = b.score - a.score;
        if (Math.abs(scoreDiff) > 5) return scoreDiff;
        if (a.hotel.featured && !b.hotel.featured) return -1;
        if (!a.hotel.featured && b.hotel.featured) return 1;
        return b.hotel.rating - a.hotel.rating;
      })
      .map(({ hotel }) => hotel);

    // If fewer than 5 results, expand to nearby cities (same state)
    if (sorted.length < 5) {
      const baseHotel = hotelsData.find(h => h.city === detectedCity);
      const nearbyState = baseHotel?.state || (state !== "Todos" ? state : "");
      const nearbyRegion = baseHotel?.region;
      const nearby = hotelsData
        .filter(h =>
          h.city !== detectedCity &&
          (h.state === nearbyState || h.region === nearbyRegion)
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 12 - sorted.length);
      results = [...sorted, ...nearby];
    } else {
      results = sorted;
    }

    // Augment with live OpenStreetMap data (5s timeout so it never blocks)
    const cityState = hotelsData.find(h => h.city === detectedCity)?.state ?? (state !== "Todos" ? state : "");
    if (cityState) {
      const existingNames = new Set(results.map(h => normalizeNameForDedup(h.name)));
      const osmResults = await Promise.race([
        fetchOSMHotels(detectedCity, cityState, existingNames),
        new Promise<Hotel[]>(resolve => setTimeout(() => resolve([]), 5000)),
      ]);
      if (osmResults.length > 0) {
        // Filter OSM results by type/amenity if intent present
        let osmFiltered = osmResults;
        if (effectiveType) osmFiltered = osmFiltered.filter(h => matchesType(h, effectiveType));
        results = [...results, ...osmFiltered];
      }
    }
  } else {
    // No city detected: score across all hotels using filters + intent
    const mergedFilters = {
      ...filters,
      packageFor: effectivePackage || filters.packageFor,
      type: effectiveType || filters.type,
    };

    const scored = hotelsData.map(hotel => ({
      hotel,
      score: scoreHotel(hotel, queryForDetection, mergedFilters, intent || undefined)
    }));

    results = scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ hotel }) => hotel);

    if (effectiveType && effectiveType !== "todos") {
      results = results.filter(h => matchesType(h, effectiveType));
    }

    // Fallback: no matches found — return top-rated hotels
    if (query && results.length === 0) {
      results = [...hotelsData]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    }
  }

  const cityCount = detectedCity ? hotelsData.filter(h => h.city === detectedCity).length : 0;
  const hasNearby = detectedCity && results.length > cityCount;
  const aiSuggestion = await generateAISuggestion(query, results.length, filters, detectedCity, detectedHotel?.name, hasNearby ? cityCount : undefined, intent);

  return NextResponse.json({
    results,
    total: results.length,
    aiSuggestion,
    query,
    detectedCity,
    intent: intent ? {
      typeOverride: intent.typeOverride,
      packageFor: intent.packageFor,
      amenityBoosts: intent.amenityBoosts,
      envBoosts: intent.envBoosts,
    } : null,
  });
}

function generateAISuggestionStatic(query: string, count: number, filters: Record<string, string | number | undefined>, detectedCity?: string | null, detectedHotelName?: string, cityOnlyCount?: number, intent?: QueryIntent | null): string {
  const parts: string[] = [];
  if (detectedCity) parts.push(`em ${detectedCity}`);
  else if (detectedHotelName) parts.push(`"${detectedHotelName}"`);
  else if (query) parts.push(`"${query}"`);
  if (filters.region && filters.region !== "Todos") parts.push(`na região ${filters.region}`);
  if (filters.state && filters.state !== "Todos") parts.push(`no estado ${filters.state}`);
  if (filters.seasonal) parts.push(`para o período sazonal selecionado`);
  if (filters.packageFor) parts.push(`com pacote para ${filters.packageFor}`);

  // Add intent context
  if (intent?.typeOverride) parts.push(`tipo: ${intent.typeOverride}`);
  if (intent?.amenityBoosts.length) parts.push(`com ${intent.amenityBoosts.join(", ")}`);
  if (intent?.packageFor) parts.push(`para ${intent.packageFor}`);

  if (count === 0) {
    return `Não encontrei resultados para ${parts.join(", ")}. Tente ampliar os filtros ou buscar em outras regiões do Brasil.`;
  }

  if (cityOnlyCount !== undefined && cityOnlyCount < count) {
    return `Encontrei ${cityOnlyCount} opção${cityOnlyCount !== 1 ? "s" : ""} em ${detectedCity}. Incluindo também ${count - cityOnlyCount} opção${count - cityOnlyCount !== 1 ? "s" : ""} em destinos próximos na mesma região.`;
  }

  return `Encontrei ${count} opção${count > 1 ? "s" : ""} ${parts.join(", ")}. Resultados ordenados por relevância e avaliação dos hóspedes.`;
}

async function generateAISuggestion(
  query: string,
  count: number,
  filters: Record<string, string | number | undefined>,
  detectedCity?: string | null,
  detectedHotelName?: string,
  cityOnlyCount?: number,
  intent?: QueryIntent | null
): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return generateAISuggestionStatic(query, count, filters, detectedCity, detectedHotelName, cityOnlyCount, intent);
  }
  try {
    const groq = new Groq({ apiKey: groqKey });
    const context: string[] = [];
    if (detectedCity) context.push(`cidade: ${detectedCity}`);
    else if (query) context.push(`busca: "${query}"`);
    if (filters.state && filters.state !== "Todos") context.push(`estado: ${filters.state}`);
    if (intent?.packageFor) context.push(`viagem para: ${intent.packageFor}`);
    else if (filters.packageFor) context.push(`viagem para: ${filters.packageFor}`);
    if (intent?.amenityBoosts.length) context.push(`deseja: ${intent.amenityBoosts.join(", ")}`);
    if (intent?.typeOverride) context.push(`tipo: ${intent.typeOverride}`);
    if (count === 0) context.push("nenhum resultado encontrado");
    else context.push(`${count} acomodações encontradas`);
    if (cityOnlyCount !== undefined && cityOnlyCount < count)
      context.push(`${cityOnlyCount} na cidade, ${count - cityOnlyCount} em destinos próximos`);

    const prompt = `Você é um assistente de viagens brasileiro simpático e prestativo. Contexto da busca: ${context.join(", ")}. Gere uma mensagem curta (máximo 2 frases) em português brasileiro que seja útil, animada e específica para este contexto. Não repita os números de forma robótica. Seja natural e convide o usuário a explorar as opções.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
      temperature: 0.8,
    });

    return completion.choices[0]?.message?.content?.trim() ||
      generateAISuggestionStatic(query, count, filters, detectedCity, detectedHotelName, cityOnlyCount, intent);
  } catch {
    return generateAISuggestionStatic(query, count, filters, detectedCity, detectedHotelName, cityOnlyCount, intent);
  }
}
