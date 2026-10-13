import { NextRequest, NextResponse } from 'next/server';

export interface GoogleResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service') || '';
  const city = searchParams.get('city') || '';

  const apiKey = process.env.GOOGLE_API_KEY;
  const cseId = process.env.GOOGLE_CSE_ID;

  const query = [service, city, 'prestador serviço ABC'].filter(Boolean).join(' ');

  // Without API keys, return the Google search URL for the frontend to use
  if (!apiKey || !cseId) {
    return NextResponse.json({
      results: [],
      googleUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      configured: false,
    });
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(query)}&num=5`;
    const res = await fetch(url);
    const data = await res.json() as {
      items?: { title: string; link: string; snippet: string; displayLink: string }[];
      error?: { message: string };
    };

    if (!res.ok || data.error) {
      throw new Error(data.error?.message ?? 'Google API error');
    }

    const results: GoogleResult[] = (data.items ?? []).map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    }));

    return NextResponse.json({
      results,
      googleUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      configured: true,
    });
  } catch (err) {
    console.error('Google Search error:', err);
    return NextResponse.json({
      results: [],
      googleUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      configured: false,
    });
  }
}
