/**
 * Motor de matching entre imóveis e perfis de compradores/locatários
 * Score de 0.0 a 1.0 baseado em múltiplos critérios com pesos
 */

export interface Property {
  id: string;
  title: string;
  description?: string;
  type: string;
  operation: string;
  price: number;
  area_m2?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking_spots?: number;
  city: string;
  neighborhood: string;
  address?: string;
  features: string[];
  images: string[];
  source: string;
  source_url?: string;
  contact_name?: string;
  contact_phone?: string;
  active: boolean;
  scraped_at: string;
  created_at: string;
}

export interface BuyerProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  operation_type: 'sale' | 'rent' | 'both';
  property_types: string[];
  cities: string[];
  neighborhoods: string[];
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  required_features: string[];
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchResult {
  property: Property;
  score: number;
  breakdown: {
    operation: number;
    price: number;
    location: number;
    type: number;
    area: number;
    bedrooms: number;
    features: number;
  };
  reasons: string[];
}

// Pesos dos critérios (somam 1.0)
const WEIGHTS = {
  operation: 0.20,  // compra/locação é essencial
  price: 0.25,      // orçamento é o filtro mais importante
  location: 0.20,   // cidade/bairro
  type: 0.15,       // tipo do imóvel
  area: 0.10,       // metragem
  bedrooms: 0.05,   // quartos
  features: 0.05,   // características desejadas
};

export function calculateMatch(property: Property, profile: BuyerProfile): MatchResult {
  const breakdown = {
    operation: scoreOperation(property, profile),
    price: scorePrice(property, profile),
    location: scoreLocation(property, profile),
    type: scoreType(property, profile),
    area: scoreArea(property, profile),
    bedrooms: scoreBedrooms(property, profile),
    features: scoreFeatures(property, profile),
  };

  const score =
    breakdown.operation * WEIGHTS.operation +
    breakdown.price * WEIGHTS.price +
    breakdown.location * WEIGHTS.location +
    breakdown.type * WEIGHTS.type +
    breakdown.area * WEIGHTS.area +
    breakdown.bedrooms * WEIGHTS.bedrooms +
    breakdown.features * WEIGHTS.features;

  const reasons = buildReasons(property, profile, breakdown);

  return { property, score: Math.round(score * 100) / 100, breakdown, reasons };
}

function scoreOperation(p: Property, prof: BuyerProfile): number {
  if (prof.operation_type === 'both') return 1.0;
  return p.operation === prof.operation_type ? 1.0 : 0.0;
}

function scorePrice(p: Property, prof: BuyerProfile): number {
  const { min_price, max_price } = prof;
  if (!min_price && !max_price) return 1.0;

  const min = min_price ?? 0;
  const max = max_price ?? Infinity;

  if (p.price >= min && p.price <= max) return 1.0;

  // Penalidade gradual: até 20% fora do orçamento = parcial
  const tolerance = (max - min) * 0.20;
  if (p.price < min) {
    const diff = min - p.price;
    return diff <= tolerance ? 0.7 : 0.3;
  }
  // acima do máximo
  const diff = p.price - max;
  if (diff <= tolerance) return 0.6;
  if (diff <= tolerance * 2) return 0.3;
  return 0.0;
}

function scoreLocation(p: Property, prof: BuyerProfile): number {
  const cities = prof.cities.map(c => c.toLowerCase().trim());
  const hoods = prof.neighborhoods.map(n => n.toLowerCase().trim());

  const cityMatch = cities.length === 0 || cities.includes(p.city.toLowerCase().trim());
  const hoodMatch = hoods.length === 0 || hoods.includes(p.neighborhood.toLowerCase().trim());

  if (cityMatch && hoodMatch) return 1.0;
  if (cityMatch) return 0.7;  // cidade certa mas bairro diferente
  return 0.0;
}

function scoreType(p: Property, prof: BuyerProfile): number {
  if (prof.property_types.length === 0) return 1.0;
  return prof.property_types.includes(p.type) ? 1.0 : 0.2;
}

function scoreArea(p: Property, prof: BuyerProfile): number {
  const { min_area, max_area } = prof;
  if (!p.area_m2) return 0.8; // sem info = neutro
  if (!min_area && !max_area) return 1.0;

  const min = min_area ?? 0;
  const max = max_area ?? Infinity;

  if (p.area_m2 >= min && p.area_m2 <= max) return 1.0;
  if (p.area_m2 < min) {
    const ratio = p.area_m2 / min;
    return ratio >= 0.85 ? 0.7 : 0.3;
  }
  // maior que o máximo (geralmente ok)
  return 0.8;
}

function scoreBedrooms(p: Property, prof: BuyerProfile): number {
  const { min_bedrooms, max_bedrooms } = prof;
  if (p.bedrooms === null || p.bedrooms === undefined) return 0.8;
  if (!min_bedrooms && !max_bedrooms) return 1.0;

  const min = min_bedrooms ?? 0;
  const max = max_bedrooms ?? 99;

  if (p.bedrooms >= min && p.bedrooms <= max) return 1.0;
  if (p.bedrooms === min - 1 || p.bedrooms === max + 1) return 0.6;
  return 0.2;
}

function scoreFeatures(p: Property, prof: BuyerProfile): number {
  if (prof.required_features.length === 0) return 1.0;
  const propFeatures = p.features.map(f => f.toLowerCase());
  const required = prof.required_features.map(f => f.toLowerCase());
  const matched = required.filter(f => propFeatures.includes(f)).length;
  return matched / required.length;
}

function buildReasons(
  p: Property,
  prof: BuyerProfile,
  bd: MatchResult['breakdown']
): string[] {
  const reasons: string[] = [];

  if (bd.operation === 1.0) {
    reasons.push(p.operation === 'sale' ? '✅ Para venda conforme interesse' : '✅ Para locação conforme interesse');
  }
  if (bd.price === 1.0) {
    reasons.push('✅ Preço dentro do orçamento');
  } else if (bd.price >= 0.6) {
    reasons.push('⚠️ Preço próximo ao orçamento');
  } else if (bd.price === 0.0) {
    reasons.push('❌ Preço fora do orçamento');
  }
  if (bd.location === 1.0) {
    reasons.push(`✅ Localização ideal em ${p.neighborhood}, ${p.city}`);
  } else if (bd.location === 0.7) {
    reasons.push(`⚠️ Cidade certa (${p.city}), bairro diferente do preferido`);
  }
  if (bd.type === 1.0 && prof.property_types.length > 0) {
    reasons.push(`✅ Tipo de imóvel compatível`);
  }
  if (bd.area === 1.0 && p.area_m2) {
    reasons.push(`✅ Metragem adequada (${p.area_m2}m²)`);
  }
  if (bd.bedrooms === 1.0 && p.bedrooms) {
    reasons.push(`✅ ${p.bedrooms} quarto(s) conforme solicitado`);
  }
  if (bd.features > 0 && bd.features < 1 && prof.required_features.length > 0) {
    const propF = p.features.map(f => f.toLowerCase());
    const missing = prof.required_features.filter(f => !propF.includes(f.toLowerCase()));
    if (missing.length > 0) {
      reasons.push(`⚠️ Faltam: ${missing.join(', ')}`);
    }
  }

  return reasons;
}

export function matchPropertiesToProfile(
  properties: Property[],
  profile: BuyerProfile,
  minScore = 0.35
): MatchResult[] {
  return properties
    .filter(p => p.active)
    .map(p => calculateMatch(p, profile))
    .filter(m => m.score >= minScore)
    .sort((a, b) => b.score - a.score);
}

// Normaliza dados do banco (JSON strings → arrays)
export function normalizeProperty(raw: Record<string, unknown>): Property {
  return {
    ...raw,
    features: safeJsonParse(raw.features as string, []),
    images: safeJsonParse(raw.images as string, []),
    active: raw.active === 1 || raw.active === true,
  } as unknown as Property;
}

export function normalizeProfile(raw: Record<string, unknown>): BuyerProfile {
  return {
    ...raw,
    property_types: safeJsonParse(raw.property_types as string, []),
    cities: safeJsonParse(raw.cities as string, []),
    neighborhoods: safeJsonParse(raw.neighborhoods as string, []),
    required_features: safeJsonParse(raw.required_features as string, []),
    active: raw.active === 1 || raw.active === true,
  } as unknown as BuyerProfile;
}

function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
  try {
    if (!str) return fallback;
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}
