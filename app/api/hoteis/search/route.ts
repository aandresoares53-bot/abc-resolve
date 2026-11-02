import { NextRequest, NextResponse } from 'next/server';

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY || '';
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET || '';

const CITY_CODES: Record<string, string> = {
  'são paulo': 'SAO', 'sao paulo': 'SAO', 'sp': 'SAO',
  'rio de janeiro': 'RIO', 'rio': 'RIO', 'rj': 'RIO',
  'salvador': 'SSA', 'ba': 'SSA',
  'fortaleza': 'FOR', 'ce': 'FOR',
  'recife': 'REC', 'pe': 'REC',
  'belo horizonte': 'BHZ', 'bh': 'BHZ', 'mg': 'BHZ',
  'porto alegre': 'POA', 'rs': 'POA',
  'curitiba': 'CWB', 'pr': 'CWB',
  'manaus': 'MAO', 'am': 'MAO',
  'belém': 'BEL', 'belem': 'BEL', 'pa': 'BEL',
  'florianópolis': 'FLN', 'florianopolis': 'FLN', 'sc': 'FLN',
  'natal': 'NAT', 'rn': 'NAT',
  'maceió': 'MCZ', 'maceio': 'MCZ', 'al': 'MCZ',
  'goiânia': 'GYN', 'goiania': 'GYN', 'go': 'GYN',
  'campo grande': 'CGR', 'ms': 'CGR',
  'cuiabá': 'CGB', 'cuiaba': 'CGB', 'mt': 'CGB',
  'porto seguro': 'BPS',
  'foz do iguaçu': 'IGU', 'foz do iguacu': 'IGU', 'foz': 'IGU',
  'gramado': 'GRP',
  'brasília': 'BSB', 'brasilia': 'BSB', 'df': 'BSB',
  'vitória': 'VIX', 'vitoria': 'VIX', 'es': 'VIX',
  'joão pessoa': 'JPA', 'joao pessoa': 'JPA', 'pb': 'JPA',
  'aracaju': 'AJU', 'se': 'AJU',
  'teresina': 'THE', 'pi': 'THE',
  'são luís': 'SLZ', 'sao luis': 'SLZ', 'ma': 'SLZ',
  'macapá': 'MCP', 'macapa': 'MCP', 'ap': 'MCP',
  'boa vista': 'BVB', 'rr': 'BVB',
  'rio branco': 'RBR', 'ac': 'RBR',
  'porto velho': 'PVH', 'ro': 'PVH',
  'palmas': 'PMW', 'to': 'PMW',
};

async function getAmadeusToken(): Promise<string> {
  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

function detectCity(query: string): string {
  const lower = query.toLowerCase();
  for (const [name, code] of Object.entries(CITY_CODES)) {
    if (lower.includes(name)) return code;
  }
  return 'RIO'; // default
}

export async function POST(req: NextRequest) {
  try {
    const { query, checkIn, checkOut, adults = 2, rooms = 1 } = await req.json();

    if (!AMADEUS_API_KEY) {
      return NextResponse.json({ error: 'AMADEUS_API_KEY não configurada' }, { status: 500 });
    }

    const cityCode = detectCity(query || '');
    const token = await getAmadeusToken();

    // Step 1: get hotel list for city
    const hotelsRes = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&radius=20&radiusUnit=KM&hotelSource=ALL`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const hotelsData = await hotelsRes.json();
    const hotelIds: string[] = (hotelsData.data || []).slice(0, 20).map((h: {hotelId: string}) => h.hotelId);

    if (!hotelIds.length) {
      return NextResponse.json({ hotels: [], city: cityCode, query });
    }

    // Step 2: get prices for those hotels
    const today = new Date();
    const defaultCheckIn = checkIn || new Date(today.getTime() + 7 * 86400000).toISOString().split('T')[0];
    const defaultCheckOut = checkOut || new Date(today.getTime() + 9 * 86400000).toISOString().split('T')[0];

    const offersRes = await fetch(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds.join(',')}&checkInDate=${defaultCheckIn}&checkOutDate=${defaultCheckOut}&adults=${adults}&roomQuantity=${rooms}&currency=BRL&bestRateOnly=true`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const offersData = await offersRes.json();

    const hotels = (offersData.data || []).map((item: {
      hotel: { hotelId: string; name: string; rating?: string; address?: { cityName?: string; stateCode?: string }; amenities?: string[] };
      offers: Array<{ price: { total: string; currency: string }; room?: { typeEstimated?: { category?: string } }; policies?: { cancellations?: Array<{ type?: string }> } }>;
    }) => {
      const offer = item.offers?.[0];
      return {
        id: item.hotel.hotelId,
        name: item.hotel.name,
        rating: item.hotel.rating || null,
        city: item.hotel.address?.cityName || cityCode,
        state: item.hotel.address?.stateCode || '',
        price: offer?.price?.total ? parseFloat(offer.price.total) : null,
        currency: offer?.price?.currency || 'BRL',
        roomType: offer?.room?.typeEstimated?.category || 'Standard',
        freeCancellation: offer?.policies?.cancellations?.some((c) => c.type === 'FULL_STAY') || false,
        amenities: item.hotel.amenities?.slice(0, 6) || [],
        checkIn: defaultCheckIn,
        checkOut: defaultCheckOut,
      };
    }).filter((h: {price: number | null}) => h.price !== null)
      .sort((a: {price: number}, b: {price: number}) => a.price - b.price);

    return NextResponse.json({ hotels, city: cityCode, query, checkIn: defaultCheckIn, checkOut: defaultCheckOut });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao buscar hotéis' }, { status: 500 });
  }
}
