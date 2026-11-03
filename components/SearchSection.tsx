"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Hotel } from "@/lib/hotels-data";
import { regions, states, seasonalDates, packageTypes, hotelsData } from "@/lib/hotels-data";
import HotelCard from "./HotelCard";
import CompareBar from "./CompareBar";

const allCities = Array.from(new Set(hotelsData.map(h => `${h.city}, ${h.state}`)));

const AMENITY_OPTIONS = ["Wi-Fi", "Piscina", "Spa", "Café da manhã", "Estacionamento", "Restaurante", "Academia", "Pet-friendly"];

type SortOption = "relevancia" | "menor-preco" | "maior-avaliacao" | "maior-desconto" | "mais-estrelas";

type SearchResult = {
  results: Hotel[];
  total: number;
  aiSuggestion: string;
  query: string;
};

function toInputDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatDateBR(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function getFromLS<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

function setToLS(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function sortResults(results: Hotel[], sort: SortOption): Hotel[] {
  const arr = [...results];
  switch (sort) {
    case "menor-preco": return arr.sort((a, b) => a.priceFrom - b.priceFrom);
    case "maior-avaliacao": return arr.sort((a, b) => b.rating - a.rating);
    case "maior-desconto": return arr.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
    case "mais-estrelas": return arr.sort((a, b) => b.stars - a.stars);
    default: return arr;
  }
}

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Todos");
  const [state, setState] = useState("Todos");
  const [seasonal, setSeasonal] = useState("");
  const [packageFor, setPackageFor] = useState("");
  const [type, setType] = useState("todos");
  const [maxPrice, setMaxPrice] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [compareList, setCompareList] = useState<Hotel[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("relevancia");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [preferredPlatform, setPreferredPlatform] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Hotel[]>([]);

  useEffect(() => {
    setSearchHistory(getFromLS<string[]>("searchHistory", []));
    const ids = getFromLS<string[]>("recentlyViewed", []);
    const hotels = ids.map(id => hotelsData.find(h => h.id === id)).filter(Boolean) as Hotel[];
    setRecentlyViewed(hotels.slice(0, 4));
  }, []);

  function toggleCompare(hotel: Hotel) {
    setCompareList(prev => {
      if (prev.find(h => h.id === hotel.id)) return prev.filter(h => h.id !== hotel.id);
      if (prev.length >= 3) return prev;
      return [...prev, hotel];
    });
  }

  function toggleAmenity(amenity: string) {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  }

  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(); dayAfter.setDate(dayAfter.getDate() + 2);
  const [checkIn, setCheckIn] = useState(toInputDate(tomorrow));
  const [checkOut, setCheckOut] = useState(toInputDate(dayAfter));
  const datesRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (datesRef.current && !datesRef.current.contains(e.target as Node)) {
        setShowDates(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));

  const handleSearch = useCallback(async (overrideQuery?: string) => {
    const q = overrideQuery ?? query;
    setLoading(true);
    setSearched(true);
    setShowGuests(false);
    setShowDates(false);
    setShowHistory(false);

    if (q.trim()) {
      const updated = [q, ...searchHistory.filter(h => h !== q)].slice(0, 5);
      setSearchHistory(updated);
      setToLS("searchHistory", updated);
    }

    const params = new URLSearchParams({
      q,
      region,
      state,
      seasonal,
      packageFor,
      type,
      maxPrice: maxPrice.toString(),
    });

    try {
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();

      // Apply amenity filter client-side
      if (selectedAmenities.length > 0) {
        data.results = data.results.filter((h: Hotel) =>
          selectedAmenities.every(a => h.amenities.some(ha => ha.toLowerCase().includes(a.toLowerCase())))
        );
        data.total = data.results.length;
      }

      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [query, region, state, seasonal, packageFor, type, maxPrice, selectedAmenities, searchHistory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { setShowSuggestions(false); setShowHistory(false); handleSearch(); }
  };

  function handleVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Seu navegador não suporta busca por voz."); return; }
    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      setShowSuggestions(false);
    };
    recognition.start();
  }

  function clearHistory() {
    setSearchHistory([]);
    setToLS("searchHistory", []);
  }

  const exampleSearches = [
    "Campos do Jordão",
    "Gramado inverno",
    "Porto de Galinhas",
    "Búzios casal",
    "Foz do Iguaçu família",
    "Praia em Fortaleza",
  ];

  // Nearby hotels when no results
  function getNearbyHotels(q: string): Hotel[] {
    if (!result || result.results.length > 0) return [];
    const lq = q.toLowerCase();
    const matched = hotelsData.find(h =>
      h.city.toLowerCase().includes(lq) || h.state.toLowerCase().includes(lq) || h.region.toLowerCase().includes(lq)
    );
    if (!matched) return hotelsData.sort(() => Math.random() - 0.5).slice(0, 3);
    return hotelsData
      .filter(h => h.id !== matched.id && (h.state === matched.state || h.region === matched.region))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }

  const sortedResults = result ? sortResults(result.results, sortBy) : [];
  const nearbyHotels = searched && result && result.results.length === 0 ? getNearbyHotels(result.query) : [];

  return (
    <section id="buscar" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          <span>🤖</span>
          <span>Busca inteligente com Inteligência Artificial</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
          Encontre o hotel ou pousada perfeito
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Descreva a viagem dos seus sonhos e nossa IA encontra as melhores opções em todo o Brasil
        </p>
      </div>

      {/* Main Search */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-6">
        {/* Search Input */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative" ref={searchInputRef}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setShowHistory(false);
                if (e.target.value.length >= 2) {
                  const q = e.target.value.toLowerCase();
                  setSuggestions(allCities.filter(c => c.toLowerCase().includes(q)).slice(0, 6));
                  setShowSuggestions(true);
                } else {
                  setShowSuggestions(false);
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (query.length >= 2) { setShowSuggestions(true); setShowHistory(false); }
                else if (searchHistory.length > 0) { setShowHistory(true); setShowSuggestions(false); }
              }}
              placeholder='Ex: "Pousada com piscina em Trancoso"...'
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
            />

            {/* City autocomplete suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onMouseDown={() => { setQuery(s.split(",")[0]); setShowSuggestions(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-gray-400">📍</span> {s}
                  </button>
                ))}
              </div>
            )}

            {/* Search history dropdown */}
            {showHistory && !showSuggestions && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Buscas recentes</span>
                  <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-600 font-medium">Limpar</button>
                </div>
                {searchHistory.map(h => (
                  <button
                    key={h}
                    onMouseDown={() => { setQuery(h); setShowHistory(false); handleSearch(h); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-gray-300">🕐</span> {h}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleVoice}
            title={listening ? "Ouvindo..." : "Buscar por voz"}
            className={`p-4 rounded-2xl border transition-all ${listening ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-gray-50 border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <span>✨</span>
            )}
            <span className="hidden sm:inline">{loading ? "Buscando..." : "Buscar com IA"}</span>
            <span className="sm:hidden">{loading ? "..." : "Buscar"}</span>
          </button>
        </div>

        {/* Guest & Date row */}
        <div className="flex flex-wrap gap-3 mb-4">

        {/* Guest Selector */}
        <div className="relative">
          <button
            onClick={() => { setShowGuests(!showGuests); setShowDates(false); }}
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <span className="text-lg">👥</span>
            <div className="text-left flex-1">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Hóspedes</p>
              <p className="text-sm font-bold text-gray-700">
                {adults} adulto{adults !== 1 ? "s" : ""}
                {children > 0 ? `, ${children} criança${children !== 1 ? "s" : ""}` : ""}
              </p>
              {children > 0 && childrenAges.length > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Idades: {childrenAges.slice(0, children).map(a => a === 0 ? "<1" : a).join(", ")} anos
                </p>
              )}
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showGuests ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showGuests && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-40 w-72">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Quantidade de hóspedes</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Adultos</p>
                  <p className="text-xs text-gray-400">A partir de 13 anos</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdults(v => Math.max(1, v - 1))} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 font-bold transition-colors">−</button>
                  <span className="w-6 text-center font-bold text-gray-800">{adults}</span>
                  <button onClick={() => setAdults(v => Math.min(10, v + 1))} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 font-bold transition-colors">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Crianças</p>
                  <p className="text-xs text-gray-400">Até 17 anos</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setChildren(v => Math.max(0, v - 1)); setChildrenAges(a => a.slice(0, -1)); }} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 font-bold transition-colors">−</button>
                  <span className="w-6 text-center font-bold text-gray-800">{children}</span>
                  <button onClick={() => { setChildren(v => Math.min(6, v + 1)); setChildrenAges(a => [...a, 5]); }} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 font-bold transition-colors">+</button>
                </div>
              </div>

              {/* Age selector per child */}
              {children > 0 && (
                <div className="mb-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Idade de cada criança</p>
                  {Array.from({ length: children }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Criança {i + 1}</span>
                      <select
                        value={childrenAges[i] ?? 5}
                        onChange={e => {
                          const ages = [...childrenAges];
                          ages[i] = parseInt(e.target.value);
                          setChildrenAges(ages);
                        }}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400"
                      >
                        {Array.from({ length: 18 }, (_, age) => (
                          <option key={age} value={age}>{age === 0 ? "< 1 ano" : `${age} ano${age !== 1 ? "s" : ""}`}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">Crianças até 2 anos geralmente não pagam</p>
              </div>
              <button onClick={() => setShowGuests(false)} className="mt-3 w-full py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors">Confirmar</button>
            </div>
          )}
        </div>

        {/* Date Selector */}
        <div className="relative" ref={datesRef}>
          <button
            onClick={() => { setShowDates(!showDates); setShowGuests(false); }}
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <span className="text-lg">📅</span>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Datas</p>
              <p className="text-sm font-bold text-gray-700">
                {formatDateBR(new Date(checkIn + "T12:00:00"))} → {formatDateBR(new Date(checkOut + "T12:00:00"))}
                <span className="ml-1 text-gray-400 font-normal">({nights} noite{nights !== 1 ? "s" : ""})</span>
              </p>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showDates ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDates && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-40 w-72">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Período da estadia</p>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  min={toInputDate(new Date())}
                  onChange={e => {
                    setCheckIn(e.target.value);
                    if (e.target.value >= checkOut) {
                      const next = new Date(e.target.value + "T12:00:00");
                      next.setDate(next.getDate() + 1);
                      setCheckOut(toInputDate(next));
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pt-3 border-t border-gray-100 mb-3">
                <p className="text-xs text-gray-400 text-center">{nights} noite{nights !== 1 ? "s" : ""} selecionada{nights !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setShowDates(false)} className="w-full py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors">Confirmar</button>
            </div>
          )}
        </div>

        </div>{/* end flex row */}

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-gray-400 text-sm self-center">Exemplos:</span>
          {exampleSearches.map(ex => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); }}
              className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Toggle Filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showFilters ? "Ocultar filtros" : "Filtros avançados"}
          {selectedAmenities.length > 0 && (
            <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{selectedAmenities.length}</span>
          )}
        </button>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Tipo</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="hotel">🏨 Hotel</option>
                  <option value="pousada">🏡 Pousada</option>
                  <option value="espaco-inteiro">🏠 Espaço Inteiro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Região</label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Estado</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Preço máximo/noite: {maxPrice > 0 ? `R$ ${maxPrice}` : "Qualquer"}
              </label>
              <input
                type="range"
                min={0} max={2000} step={50}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Qualquer</span>
                <span>R$ 2.000+</span>
              </div>
            </div>

            {/* Amenities filter */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Comodidades</label>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map(amenity => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      selectedAmenities.includes(amenity)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-400"
                    }`}
                  >
                    {amenity === "Wi-Fi" ? "📶" : amenity === "Piscina" ? "🏊" : amenity === "Spa" ? "💆" : amenity === "Café da manhã" ? "☕" : amenity === "Estacionamento" ? "🅿️" : amenity === "Restaurante" ? "🍽️" : amenity === "Academia" ? "💪" : "🐾"} {amenity}
                  </button>
                ))}
                {selectedAmenities.length > 0 && (
                  <button onClick={() => setSelectedAmenities([])} className="px-3 py-1.5 rounded-full text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-all">
                    ✕ Limpar
                  </button>
                )}
              </div>
              {selectedAmenities.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">Mostrando apenas hotéis com: {selectedAmenities.join(", ")}</p>
              )}
            </div>

            {/* Platform filter */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Plataforma preferida</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "", label: "Todas", emoji: "🌐" },
                  { id: "Booking.com", label: "Booking.com", emoji: "🏨" },
                  { id: "Airbnb", label: "Airbnb", emoji: "🏠" },
                  { id: "Decolar", label: "Decolar", emoji: "✈️" },
                  { id: "Expedia", label: "Expedia", emoji: "🧳" },
                  { id: "Hotels.com", label: "Hotels.com", emoji: "🛎️" },
                  { id: "Kayak", label: "Kayak", emoji: "🔍" },
                  { id: "TripAdvisor", label: "TripAdvisor", emoji: "⭐" },
                  { id: "Hurb", label: "Hurb", emoji: "🎒" },
                  { id: "CVC", label: "CVC", emoji: "🏖️" },
                  { id: "Submarino Viagens", label: "Submarino", emoji: "🚀" },
                  { id: "Google Hotels", label: "Google Hotels", emoji: "🔎" },
                  { id: "Trivago", label: "Trivago", emoji: "💡" },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPreferredPlatform(preferredPlatform === p.id ? "" : p.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      preferredPlatform === p.id
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-400"
                    }`}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
              {preferredPlatform && (
                <p className="text-xs text-orange-600 mt-1">✓ {preferredPlatform} em destaque no comparador de preços</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Data Sazonal</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSeasonal("")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${seasonal === "" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Qualquer data
                </button>
                {seasonalDates.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSeasonal(seasonal === s.id ? "" : s.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${seasonal === s.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Tipo de Pacote</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPackageFor("")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${packageFor === "" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Todos os pacotes
                </button>
                {packageTypes.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPackageFor(packageFor === p.id ? "" : p.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${packageFor === p.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Suggestion */}
      {result?.aiSuggestion && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 text-sm">
            🤖
          </div>
          <p className="text-gray-700 text-sm">{result.aiSuggestion}</p>
        </div>
      )}

      {/* Sort bar */}
      {!loading && searched && result && result.results.length > 1 && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-sm text-gray-500 font-medium">{result.total} resultado{result.total !== 1 ? "s" : ""}. Ordenar por:</span>
          {([
            { value: "relevancia", label: "Relevância" },
            { value: "menor-preco", label: "Menor preço" },
            { value: "maior-avaliacao", label: "Melhor avaliação" },
            { value: "maior-desconto", label: "Maior desconto" },
            { value: "mais-estrelas", label: "Mais estrelas" },
          ] as { value: SortOption; label: string }[]).map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${sortBy === opt.value ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex">
              <div className="w-64 shrink-0 shimmer" style={{ minHeight: "200px" }} />
              <div className="flex-1 p-4 space-y-3">
                <div className="h-4 shimmer rounded w-2/3" />
                <div className="h-3 shimmer rounded w-1/3" />
                <div className="h-3 shimmer rounded w-full" />
                <div className="h-3 shimmer rounded w-4/5" />
                <div className="h-8 shimmer rounded w-28 ml-auto mt-6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && searched && result && (
        <>
          {result.results.length === 0 ? (
            <div>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-400">Tente ampliar os filtros ou buscar em outras regiões</p>
              </div>

              {/* Nearby suggestions */}
              {nearbyHotels.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-gray-700 mb-4">✨ Talvez você goste de destinos próximos</h3>
                  <div className="flex flex-col gap-4">
                    {nearbyHotels.map((hotel, i) => (
                      <div key={hotel.id} className={`fade-in-up fade-in-up-${i + 1}`}>
                        <HotelCard hotel={hotel} adults={adults} children={children} checkIn={checkIn} checkOut={checkOut} nights={nights} compareList={compareList} onToggleCompare={toggleCompare} preferredPlatform={preferredPlatform} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sortedResults.map((hotel, i) => (
                <div key={hotel.id} className={`fade-in-up fade-in-up-${Math.min(i + 1, 6)}`}>
                  <HotelCard hotel={hotel} adults={adults} children={children} checkIn={checkIn} checkOut={checkOut} nights={nights} compareList={compareList} onToggleCompare={toggleCompare} preferredPlatform={preferredPlatform} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Initial state */}
      {!searched && !loading && (
        <div>
          {recentlyViewed.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-700 mb-4">🕐 Visitados recentemente</h3>
              <div className="flex flex-col gap-4">
                {recentlyViewed.map((hotel, i) => (
                  <div key={hotel.id} className={`fade-in-up fade-in-up-${i + 1}`}>
                    <HotelCard hotel={hotel} adults={adults} children={children} checkIn={checkIn} checkOut={checkOut} nights={nights} compareList={compareList} onToggleCompare={toggleCompare} preferredPlatform={preferredPlatform} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">Use a busca acima para encontrar hotéis e pousadas ✨</p>
            <button
              onClick={() => handleSearch()}
              className="mt-4 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition-all"
            >
              Ver todas as opções
            </button>
          </div>
        </div>
      )}

      <CompareBar
        hotels={compareList}
        onRemove={id => setCompareList(prev => prev.filter(h => h.id !== id))}
        onClear={() => setCompareList([])}
      />
    </section>
  );
}
