"use client";
import { useState, useCallback } from "react";
import { Hotel } from "@/lib/hotels-data";
import { regions, states, seasonalDates, packageTypes } from "@/lib/hotels-data";
import HotelCard from "./HotelCard";

type SearchResult = { results: Hotel[]; total: number; aiSuggestion: string; query: string; };

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Todos");
  const [state, setState] = useState("Todos");
  const [seasonal, setSeasonal] = useState("");
  const [packageFor, setPackageFor] = useState("");
  const [type, setType] = useState("todos");
  const [maxPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    const params = new URLSearchParams({ q: query, region, state, seasonal, packageFor, type, maxPrice: maxPrice.toString() });
    try {
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResult(data);
    } catch { setResult(null); } finally { setLoading(false); }
  }, [query, region, state, seasonal, packageFor, type, maxPrice]);

  const examples = ["Praia em Fortaleza", "Pousada com cachoeira", "Resort família nordeste", "Hotel fazenda Minas", "Gramado inverno"];

  return (
    <section id="buscar" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          <span>🤖</span><span>Busca inteligente com Inteligência Artificial</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Encontre o hotel ou pousada perfeito</h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">Descreva a viagem dos seus sonhos e nossa IA encontra as melhores opções em todo o Brasil</p>
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder='Ex: "Pousada com piscina em Trancoso"...' className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base transition-all" />
          </div>
          <button onClick={handleSearch} disabled={loading} className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2 whitespace-nowrap">
            {loading ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <span>✨</span>}
            <span className="hidden sm:inline">{loading ? "Buscando..." : "Buscar com IA"}</span>
            <span className="sm:hidden">{loading ? "..." : "Buscar"}</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-gray-400 text-sm self-center">Exemplos:</span>
          {examples.map(ex => <button key={ex} onClick={() => setQuery(ex)} className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors">{ex}</button>)}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:text-blue-700">
          <svg className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          {showFilters ? "Ocultar filtros" : "Filtros avançados"}
        </button>
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div><label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Tipo</label><select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="todos">Todos</option><option value="hotel">Hotel</option><option value="pousada">Pousada</option></select></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Região</label><select value={region} onChange={e => setRegion(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{regions.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Estado</label><select value={state} onChange={e => setState(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{states.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div className="mb-4"><label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Data Sazonal</label><div className="flex flex-wrap gap-2"><button onClick={() => setSeasonal("")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${seasonal === "" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>Qualquer data</button>{seasonalDates.map(s => <button key={s.id} onClick={() => setSeasonal(seasonal === s.id ? "" : s.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${seasonal === s.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>{s.icon} {s.label}</button>)}</div></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Tipo de Pacote</label><div className="flex flex-wrap gap-2"><button onClick={() => setPackageFor("")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${packageFor === "" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"}`}>Todos</button>{packageTypes.map(p => <button key={p.id} onClick={() => setPackageFor(packageFor === p.id ? "" : p.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${packageFor === p.id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"}`}>{p.icon} {p.label}</button>)}</div></div>
          </div>
        )}
      </div>
      {result?.aiSuggestion && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 text-sm">🤖</div>
          <p className="text-gray-700 text-sm">{result.aiSuggestion}</p>
        </div>
      )}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="h-52 shimmer" />
              <div className="p-4 space-y-3"><div className="h-4 shimmer rounded w-3/4" /><div className="h-3 shimmer rounded w-1/2" /><div className="h-8 shimmer rounded-xl w-1/3 ml-auto" /></div>
            </div>
          ))}
        </div>
      )}
      {!loading && searched && result && (
        result.results.length === 0 ? (
          <div className="text-center py-16"><div className="text-6xl mb-4">🔍</div><h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum resultado encontrado</h3><p className="text-gray-400">Tente ampliar os filtros ou buscar em outras regiões</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{result.results.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}</div>
        )
      )}
      {!searched && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">Use a busca acima para encontrar hotéis e pousadas ✨</p>
          <button onClick={handleSearch} className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all">Ver todas as opções</button>
        </div>
      )}
    </section>
  );
}
