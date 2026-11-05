'use client';

import { useState } from 'react';

interface Hotel {
  name: string;
  neighborhood: string;
  stars: number;
  priceRange: string;
  description: string;
  highlights: string[];
  type: string;
  bookingUrl: string;
}

interface SearchResult {
  hotels: Hotel[];
  city: string;
  query: string;
  checkIn: string;
  checkOut: string;
  allResultsUrl: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SHORTCUTS = [
  { label: '🎆 Réveillon', query: 'hotéis para réveillon na praia', checkIn: '2025-12-30', checkOut: '2026-01-02' },
  { label: '🎭 Carnaval', query: 'hotéis para carnaval Salvador ou Rio', checkIn: '2026-02-28', checkOut: '2026-03-04' },
  { label: '☀️ Verão Nordeste', query: 'pousadas na praia no nordeste', checkIn: '', checkOut: '' },
  { label: '❄️ Gramado Inverno', query: 'hotéis em Gramado no inverno', checkIn: '2025-07-10', checkOut: '2025-07-14' },
  { label: '🏖️ Férias Julho', query: 'hotéis na praia para família em julho', checkIn: '2025-07-05', checkOut: '2025-07-12' },
  { label: '🏙️ Família SP', query: 'hotéis em São Paulo para família com crianças', checkIn: '', checkOut: '' },
];

const TYPE_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  pousada: 'Pousada',
  resort: 'Resort',
  hostel: 'Hostel',
};

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {'★'.repeat(Math.min(5, Math.max(1, stars)))}
      {'☆'.repeat(Math.max(0, 5 - stars))}
    </span>
  );
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{hotel.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{hotel.neighborhood}</p>
        </div>
        <span className="shrink-0 text-xs bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded-full">
          {TYPE_LABELS[hotel.type] || hotel.type}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <StarRating stars={hotel.stars} />
        <span className="text-green-700 font-semibold text-sm">{hotel.priceRange}</span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{hotel.description}</p>

      {hotel.highlights?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {hotel.highlights.slice(0, 4).map((h) => (
            <span key={h} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{h}</span>
          ))}
        </div>
      )}

      <a
        href={hotel.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
      >
        Ver no Booking.com →
      </a>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-12 bg-gray-200 rounded" />
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-20" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="h-10 bg-gray-200 rounded-xl mt-auto" />
    </div>
  );
}

export default function HoteisPage() {
  const [query, setQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  async function search(overrideQuery?: string, overrideCheckIn?: string, overrideCheckOut?: string) {
    const q = overrideQuery ?? query;
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/hoteis/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          checkIn: overrideCheckIn ?? checkIn,
          checkOut: overrideCheckOut ?? checkOut,
          adults,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao buscar hotéis');
    } finally {
      setLoading(false);
    }
  }

  function applyShortcut(s: typeof SHORTCUTS[0]) {
    setQuery(s.query);
    if (s.checkIn) setCheckIn(s.checkIn);
    if (s.checkOut) setCheckOut(s.checkOut);
    search(s.query, s.checkIn || checkIn, s.checkOut || checkOut);
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', content: msg }];
    setChatMessages(newMessages);
    setChatLoading(true);
    try {
      const res = await fetch('/api/hoteis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          hotels: result?.hotels,
          context: result ? `Busca atual: "${result.query}" em ${result.city}, ${result.checkIn} a ${result.checkOut}` : '',
        }),
      });
      const data = await res.json();
      setChatMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setChatMessages([...newMessages, { role: 'assistant', content: 'Erro ao conectar com o assistente.' }]);
    } finally {
      setChatLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🏨 HotéisIA</h1>
            <p className="text-xs text-gray-500">Busca inteligente de hotéis no Brasil</p>
          </div>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            🤖 Assistente IA
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); search(); } }}
              placeholder="Ex: pousada na praia de Morro de São Paulo para 2 pessoas em fevereiro..."
              className="w-full resize-none border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[72px]"
            />

            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Adultos</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'adulto' : 'adultos'}</option>)}
                </select>
              </div>
              <button
                onClick={() => search()}
                disabled={loading || !query.trim()}
                className="mt-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-xl text-sm transition-colors"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Shortcuts */}
          <div className="flex flex-wrap gap-2 mb-6">
            {SHORTCUTS.map((s) => (
              <button
                key={s.label}
                onClick={() => applyShortcut(s)}
                className="text-sm bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {result.hotels.length} opções em <span className="text-blue-600">{result.city}</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {result.checkIn} → {result.checkOut} · {adults} {adults === 1 ? 'adulto' : 'adultos'}
                  </p>
                </div>
                <a
                  href={result.allResultsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver todos no Booking.com →
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.hotels.map((hotel, i) => (
                  <HotelCard key={i} hotel={hotel} />
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🏨</div>
              <p className="text-lg font-medium text-gray-500">Encontre o hotel ideal no Brasil</p>
              <p className="text-sm mt-1">Descreva sua viagem em linguagem natural ou use um atalho acima</p>
            </div>
          )}
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div className="w-80 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px] sticky top-24">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-gray-800">🤖 Assistente IA</p>
                <p className="text-xs text-gray-400">Dúvidas sobre destinos e hotéis</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-8">
                  <div className="text-3xl mb-2">💬</div>
                  <p>Pergunte sobre destinos, melhores épocas, dicas de viagem...</p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`text-sm px-3 py-2 rounded-xl max-w-[95%] leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white self-end'
                    : 'bg-gray-100 text-gray-800 self-start'
                }`}>
                  {m.content}
                </div>
              ))}
              {chatLoading && (
                <div className="bg-gray-100 text-gray-500 text-sm px-3 py-2 rounded-xl self-start animate-pulse">
                  Digitando...
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }}
                placeholder="Faça uma pergunta..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-sm transition-colors"
              >
                →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
