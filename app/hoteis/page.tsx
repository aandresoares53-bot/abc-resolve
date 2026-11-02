'use client';
import { useState, useRef, useEffect } from 'react';

type Hotel = {
  id: string;
  name: string;
  rating: string | null;
  city: string;
  state: string;
  price: number;
  currency: string;
  roomType: string;
  freeCancellation: boolean;
  amenities: string[];
  checkIn: string;
  checkOut: string;
};

type ChatMessage = { role: 'user' | 'assistant'; text: string };

const SEASONAL = [
  { label: '🎆 Réveillon', query: 'Rio de Janeiro Réveillon', checkIn: '2025-12-29', checkOut: '2026-01-02' },
  { label: '🎭 Carnaval', query: 'Salvador Carnaval', checkIn: '2026-02-28', checkOut: '2026-03-05' },
  { label: '🌊 Verão Nordeste', query: 'Fortaleza praia', checkIn: '', checkOut: '' },
  { label: '❄️ Inverno Gramado', query: 'Gramado inverno', checkIn: '', checkOut: '' },
  { label: '🏖️ Férias Julho', query: 'Florianópolis julho', checkIn: '2026-07-05', checkOut: '2026-07-12' },
  { label: '👨‍👩‍👧 Família SP', query: 'São Paulo família', checkIn: '', checkOut: '' },
];

const AMENITY_ICONS: Record<string, string> = {
  SWIMMING_POOL: '🏊', WIFI: '📶', PARKING: '🅿️', RESTAURANT: '🍽️',
  SPA: '💆', GYM: '🏋️', AIR_CONDITIONING: '❄️', ROOM_SERVICE: '🛎️',
  BAR: '🍸', BEACH: '🏖️', PETS_ALLOWED: '🐾', BREAKFAST: '☕',
};

function Stars({ rating }: { rating: string | null }) {
  const n = parseInt(rating || '0');
  return (
    <span className="text-yellow-400 text-sm">
      {'★'.repeat(Math.min(n, 5))}{'☆'.repeat(Math.max(0, 5 - n))}
    </span>
  );
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  const nights = Math.max(1, Math.round(
    (new Date(hotel.checkOut).getTime() - new Date(hotel.checkIn).getTime()) / 86400000
  ));
  const total = hotel.price * nights;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 h-2" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-gray-800 text-base leading-tight">{hotel.name}</h3>
            <p className="text-gray-500 text-sm mt-0.5">📍 {hotel.city}{hotel.state ? `, ${hotel.state}` : ''}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-black text-blue-600">R${hotel.price.toFixed(0)}</p>
            <p className="text-xs text-gray-400">/ noite</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Stars rating={hotel.rating} />
          <span className="text-xs text-gray-400">{hotel.roomType}</span>
        </div>

        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {hotel.amenities.map(a => (
              <span key={a} className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-600">
                {AMENITY_ICONS[a] || '•'} {a.replace(/_/g, ' ').toLowerCase()}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            {hotel.freeCancellation && (
              <span className="text-xs text-green-600 font-medium">✓ Cancelamento grátis</span>
            )}
            <p className="text-xs text-gray-400 mt-0.5">
              {nights} noite{nights > 1 ? 's' : ''} · Total R${total.toFixed(0)}
            </p>
          </div>
          <a
            href={`https://www.booking.com/search.html?ss=${encodeURIComponent(hotel.name + ' ' + hotel.city)}&checkin=${hotel.checkIn}&checkout=${hotel.checkOut}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Ver oferta →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HoteisPage() {
  const [query, setQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Olá! 👋 Sou seu assistente de viagens. Me conte o que você está buscando: destino, datas, número de pessoas e orçamento.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  async function search(overrideQuery?: string, overrideCheckIn?: string, overrideCheckOut?: string) {
    const q = overrideQuery ?? query;
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
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
      if (data.error) setError(data.error);
      else setHotels(data.hotels || []);
    } catch {
      setError('Erro ao conectar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatLoading(true);

    // auto-trigger search if message looks like a search
    const searchTrigger = /busca|procura|quero|hotel|pousada|viagem|viajar|ir para/i.test(msg);
    if (searchTrigger && !loading) {
      setQuery(msg);
      search(msg);
    }

    try {
      const res = await fetch('/api/hoteis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, hotels }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Erro ao conectar com o assistente.' }]);
    } finally {
      setChatLoading(false);
    }
  }

  const filtered = hotels
    .filter(h => h.price <= maxPrice)
    .sort((a, b) => sortBy === 'price'
      ? a.price - b.price
      : (parseInt(b.rating || '0') - parseInt(a.rating || '0'))
    );

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-blue-700">🏨 HotéisIA</h1>
            <p className="text-xs text-gray-400">Hotéis e pousadas em todo o Brasil</p>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            💬 {showChat ? 'Fechar chat' : 'Assistente IA'}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero search */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-black text-gray-800 mb-1">Encontre o hotel ideal 🇧🇷</h2>
          <p className="text-gray-500 text-sm mb-5">Busca inteligente em hotéis e pousadas por todo o Brasil</p>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Ex: praia em Fortaleza para família, pousada em Gramado..."
              className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-2xl px-5 py-4 text-base outline-none transition-colors"
            />
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label className="text-xs text-gray-500 font-medium">Check-in</label>
                <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm outline-none" />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
                <label className="text-xs text-gray-500 font-medium">Check-out</label>
                <input type="date" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Hóspedes</label>
                <select value={adults} onChange={e => setAdults(parseInt(e.target.value))}
                  className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm outline-none bg-white">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} adulto{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => search()}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-8 py-2.5 rounded-xl transition-colors text-sm"
                >
                  {loading ? '⏳ Buscando...' : '🔍 Buscar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal shortcuts */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-500 mb-3">🗓️ Pacotes sazonais populares</p>
          <div className="flex flex-wrap gap-2">
            {SEASONAL.map(s => (
              <button
                key={s.label}
                onClick={() => { setQuery(s.query); if(s.checkIn) setCheckIn(s.checkIn); if(s.checkOut) setCheckOut(s.checkOut); search(s.query, s.checkIn, s.checkOut); }}
                className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-400 text-gray-700 text-sm px-4 py-2 rounded-full transition-colors font-medium"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Results */}
          <div className="flex-1">
            {searched && !loading && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {filtered.length > 0
                    ? `${filtered.length} hotel${filtered.length > 1 ? 's' : ''} encontrado${filtered.length > 1 ? 's' : ''}`
                    : 'Nenhum hotel encontrado'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-500">Até R$</label>
                    <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-24 outline-none" />
                  </div>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as 'price' | 'rating')}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
                    <option value="price">Menor preço</option>
                    <option value="rating">Melhor avaliação</option>
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-red-700 text-sm">
                ⚠️ {error}
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-100 rounded-full w-16" />
                      <div className="h-6 bg-gray-100 rounded-full w-20" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
              </div>
            )}

            {!loading && searched && filtered.length === 0 && !error && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-4">🏨</p>
                <p className="text-lg font-semibold text-gray-500">Nenhum hotel disponível para este destino</p>
                <p className="text-sm mt-2">Tente outro destino ou ajuste as datas</p>
              </div>
            )}

            {!searched && (
              <div className="text-center py-20 text-gray-300">
                <p className="text-6xl mb-4">🇧🇷</p>
                <p className="text-xl font-bold text-gray-400">Busque hotéis em qualquer cidade do Brasil</p>
                <p className="text-sm text-gray-300 mt-2">Preços reais · Comparação instantânea · IA integrada</p>
              </div>
            )}
          </div>

          {/* Chat panel */}
          {showChat && (
            <div className="w-80 shrink-0">
              <div className="bg-white rounded-3xl shadow-lg flex flex-col h-[600px] sticky top-24">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-bold text-gray-800">💬 Assistente de Viagens</p>
                  <p className="text-xs text-gray-400">Powered by Claude AI</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-700 rounded-bl-none'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-gray-100 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    placeholder="Pergunte algo..."
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={sendChat}
                    disabled={chatLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-3 py-2 text-sm transition-colors"
                  >
                    ➤
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-8 text-xs text-gray-300 mt-8">
        HotéisIA · Dados via Amadeus · IA via Anthropic Claude · 🇧🇷 Todo o Brasil
      </footer>
    </div>
  );
}
