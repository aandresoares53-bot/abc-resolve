import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

function buildBookingUrl(city: string, checkIn: string, checkOut: string, adults: number, rooms: number) {
  const params = new URLSearchParams({
    ss: city,
    checkin: checkIn,
    checkout: checkOut,
    group_adults: String(adults),
    no_rooms: String(rooms),
    lang: 'pt-br',
    selected_currency: 'BRL',
  });
  return `https://www.booking.com/searchresults.pt-br.html?${params.toString()}`;
}

function buildHotelBookingUrl(hotelName: string, city: string, checkIn: string, checkOut: string, adults: number) {
  const params = new URLSearchParams({
    ss: `${hotelName} ${city}`,
    checkin: checkIn,
    checkout: checkOut,
    group_adults: String(adults),
    lang: 'pt-br',
    selected_currency: 'BRL',
  });
  return `https://www.booking.com/searchresults.pt-br.html?${params.toString()}`;
}

export async function POST(req: NextRequest) {
  try {
    const { query, checkIn, checkOut, adults = 2, rooms = 1 } = await req.json();

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY não configurada' }, { status: 500 });
    }

    const today = new Date();
    const defaultCheckIn = checkIn || new Date(today.getTime() + 7 * 86400000).toISOString().split('T')[0];
    const defaultCheckOut = checkOut || new Date(today.getTime() + 9 * 86400000).toISOString().split('T')[0];

    const systemPrompt = `Você é um especialista em turismo brasileiro e retorna recomendações de hotéis e pousadas reais no Brasil.

Quando receber uma busca, retorne EXATAMENTE um JSON válido com este formato (sem markdown, sem explicações, apenas o JSON):

{
  "city": "Nome da cidade principal detectada",
  "hotels": [
    {
      "name": "Nome real do hotel/pousada",
      "neighborhood": "Bairro ou localização",
      "stars": 4,
      "priceRange": "R$ 250-400/noite",
      "description": "Descrição curta e real do estabelecimento (1-2 frases)",
      "highlights": ["Wi-Fi grátis", "Piscina", "Café da manhã incluso"],
      "type": "hotel"
    }
  ]
}

Regras:
- Retorne 6 a 8 opções variadas (diferentes bairros, faixas de preço, tipos)
- Use nomes REAIS e conhecidos de hotéis e pousadas brasileiras
- Cubra diferentes faixas de preço: econômico, intermediário, luxo
- "type" pode ser: hotel, pousada, resort, hostel
- "stars" de 1 a 5
- Considere a data (${defaultCheckIn} a ${defaultCheckOut}) para sugerir locais relevantes (praia no verão, serra no inverno, etc.)
- Para ${adults} adulto(s)
- Preços em BRL, estimativa realista para a temporada`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: query }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || '{}';

    let parsed: { city?: string; hotels?: Array<{
      name: string;
      neighborhood: string;
      stars: number;
      priceRange: string;
      description: string;
      highlights: string[];
      type: string;
    }> } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    const city = parsed.city || query;
    const hotels = (parsed.hotels || []).map((h) => ({
      ...h,
      bookingUrl: buildHotelBookingUrl(h.name, city, defaultCheckIn, defaultCheckOut, adults),
    }));

    return NextResponse.json({
      hotels,
      city,
      query,
      checkIn: defaultCheckIn,
      checkOut: defaultCheckOut,
      allResultsUrl: buildBookingUrl(city, defaultCheckIn, defaultCheckOut, adults, rooms),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao buscar hotéis' }, { status: 500 });
  }
}
