import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    type Hotel = {name: string; price: number; rating: string; city: string; roomType: string; freeCancellation: boolean};
    const { message, hotels, context } = await req.json() as { message: string; hotels: Hotel[]; context: string };

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ reply: 'Configure ANTHROPIC_API_KEY para usar o assistente IA.' });
    }

    const hotelsContext = hotels?.length
      ? `\n\nHotéis disponíveis na busca atual:\n${hotels.slice(0, 10).map((h: Hotel) =>
          `- ${h.name} | R$${h.price}/noite | ${h.rating}⭐ | ${h.city} | ${h.roomType}${h.freeCancellation ? ' | Cancelamento grátis' : ''}`
        ).join('\n')}`
      : '';

    const systemPrompt = `Você é um especialista em turismo brasileiro e assistente de busca de hotéis e pousadas.
Ajude o usuário a encontrar a melhor opção de hospedagem no Brasil.
Você conhece profundamente todos os destinos turísticos brasileiros, épocas sazonais, eventos, promoções e dicas de viagem.
Quando o usuário descrever o que quer, identifique: destino, datas, número de pessoas, orçamento, perfil (família, casal, aventura).
Seja direto, amigável e prático. Use emojis com moderação.
Se houver hotéis listados, comente sobre eles e faça recomendações baseadas no perfil do usuário.
${context || ''}${hotelsContext}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await res.json();
    const reply = data.content?.[0]?.text || 'Não consegui processar sua mensagem.';
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reply: 'Erro ao conectar com o assistente.' });
  }
}
