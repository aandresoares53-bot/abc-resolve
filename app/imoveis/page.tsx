'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const CITIES = ['Santo André', 'São Bernardo do Campo', 'São Caetano do Sul', 'Diadema', 'Mauá', 'Ribeirão Pires'];
const TYPES_LABEL: Record<string, string> = {
  apartment: 'Apartamento', house: 'Casa', commercial: 'Comercial', land: 'Terreno', kitnet: 'Kitnet',
};
const FEATURE_LABEL: Record<string, string> = {
  pool: '🏊 Piscina', gym: '🏋️ Academia', elevator: '🛗 Elevador', furnished: '🛋️ Mobiliado',
  pet_friendly: '🐾 Pet Friendly', gated: '🔒 Condomínio', balcony: '🌅 Varanda', party_room: '🎉 Salão',
  sauna: '🧖 Sauna', rooftop: '🌇 Rooftop',
};
const SOURCE_COLOR: Record<string, string> = {
  vivareal: '#FF6B00', zapimoveis: '#0076D6', olx: '#7A2AB8', manual: '#059669',
};

interface Property {
  id: string; title: string; description: string; type: string; operation: string;
  price: number; area_m2?: number; bedrooms?: number; bathrooms?: number; parking_spots?: number;
  city: string; neighborhood: string; address?: string; features: string[]; images: string[];
  source: string; contact_name?: string; contact_phone?: string;
}

function formatPrice(price: number, operation: string) {
  if (operation === 'rent') {
    return `R$ ${price.toLocaleString('pt-BR')}/mês`;
  }
  if (price >= 1000000) {
    return `R$ ${(price / 1000000).toFixed(2).replace('.', ',')} mi`;
  }
  return `R$ ${price.toLocaleString('pt-BR')}`;
}

function PropertyCard({ p }: { p: Property }) {
  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          <span style={{ background: p.operation === 'sale' ? '#2563eb' : '#059669', color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
            {p.operation === 'sale' ? 'VENDA' : 'LOCAÇÃO'}
          </span>
          <span style={{ background: SOURCE_COLOR[p.source] ?? '#666', color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
            {p.source}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.7))', padding: '24px 14px 10px' }}>
          <p style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: 20 }}>{formatPrice(p.price, p.operation)}</p>
        </div>
      </div>
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
            {TYPES_LABEL[p.type] ?? p.type}
          </span>
          <span style={{ fontSize: 12, color: '#6b7280' }}>📍 {p.neighborhood}, {p.city}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111', lineHeight: 1.4 }}>{p.title}</h3>
        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#6b7280', flexWrap: 'wrap' }}>
          {p.bedrooms !== undefined && p.bedrooms > 0 && <span>🛏 {p.bedrooms} quarto{p.bedrooms !== 1 ? 's' : ''}</span>}
          {p.bathrooms !== undefined && p.bathrooms > 0 && <span>🚿 {p.bathrooms} banheiro{p.bathrooms !== 1 ? 's' : ''}</span>}
          {p.area_m2 && <span>📐 {p.area_m2}m²</span>}
          {p.parking_spots !== undefined && p.parking_spots > 0 && <span>🚗 {p.parking_spots} vaga{p.parking_spots !== 1 ? 's' : ''}</span>}
        </div>
        {p.features.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {p.features.slice(0, 4).map(f => (
              <span key={f} style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 7px', borderRadius: 999, fontSize: 11, fontWeight: 500 }}>
                {FEATURE_LABEL[f] ?? f}
              </span>
            ))}
            {p.features.length > 4 && <span style={{ fontSize: 11, color: '#9ca3af' }}>+{p.features.length - 4}</span>}
          </div>
        )}
        {p.contact_phone && (
          <a href={`https://wa.me/55${p.contact_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
            style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, background: '#25D366', color: '#fff', padding: '9px 14px', borderRadius: 9, fontWeight: 700, fontSize: 13, textDecoration: 'none', justifyContent: 'center' }}>
            <span>📱 WhatsApp — {p.contact_name}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function ImoveisPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [filters, setFilters] = useState({ operation: '', type: '', city: '', min_price: '', max_price: '', min_bedrooms: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    params.set('limit', '30');
    const res = await fetch(`/api/imoveis?${params}`);
    const data = await res.json() as { properties: Property[]; total: number };
    setProperties(data.properties ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  async function handleSeed() {
    setSeeding(true);
    const res = await fetch('/api/imoveis/seed', { method: 'POST' });
    const data = await res.json() as { inserted?: number; message?: string };
    alert(data.message ?? `${data.inserted} imóveis carregados!`);
    setSeeding(false);
    load();
  }

  const F = filters;
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#2563eb,#1e40af)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>A</span>
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>ABCResolve</span>
            </Link>
            <span style={{ color: '#d1d5db' }}>›</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#2563eb' }}>🏠 Imóveis ABC</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/imoveis/perfil" style={{ background: '#059669', color: '#fff', padding: '8px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
              + Meu Perfil
            </Link>
            <button onClick={handleSeed} disabled={seeding}
              style={{ background: '#7c3aed', color: '#fff', padding: '8px 14px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', opacity: seeding ? 0.7 : 1 }}>
              {seeding ? '⏳ Carregando...' : '🔄 Carregar Imóveis'}
            </button>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div style={{ background: '#1d4ed8', padding: '28px 20px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 20px', textAlign: 'center' }}>
            Imóveis à Venda e para Alugar no Grande ABC
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10 }}>
            {[
              { key: 'operation', label: 'Operação', opts: [['', 'Venda + Locação'], ['sale', '🏷 Venda'], ['rent', '🔑 Locação']] },
              { key: 'type', label: 'Tipo', opts: [['', 'Todos os tipos'], ['apartment', '🏢 Apartamento'], ['house', '🏡 Casa'], ['commercial', '🏪 Comercial'], ['land', '🌳 Terreno'], ['kitnet', '🛏 Kitnet']] },
              { key: 'city', label: 'Cidade', opts: [['', 'Todas as cidades'], ...CITIES.map(c => [c, c] as [string, string])] },
              { key: 'min_bedrooms', label: 'Quartos', opts: [['', 'Qualquer'], ['1', '1+'], ['2', '2+'], ['3', '3+'], ['4', '4+']] },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 4 }}>{label}</label>
                <select value={F[key as keyof typeof F]} onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', fontSize: 14, background: '#fff', color: '#111' }}>
                  {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 4 }}>Preço mín (R$)</label>
              <input type="number" placeholder="0" value={F.min_price} onChange={e => setFilters(f => ({ ...f, min_price: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 4 }}>Preço máx (R$)</label>
              <input type="number" placeholder="sem limite" value={F.max_price} onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <p style={{ margin: 0, color: '#374151', fontWeight: 600, fontSize: 15 }}>
            {loading ? 'Buscando...' : `${total} imóveis encontrados`}
          </p>
          <Link href="/imoveis/perfil" style={{ fontSize: 14, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            🎯 Ver imóveis compatíveis com meu perfil →
          </Link>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>⏳ Carregando imóveis...</div>
        )}

        {!loading && properties.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '1px dashed #d1d5db' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
            <p style={{ color: '#374151', fontWeight: 600, fontSize: 16, margin: '0 0 8px' }}>Nenhum imóvel encontrado</p>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 16px' }}>Clique em &quot;Carregar Imóveis&quot; para popular o banco com dados da região do ABC.</p>
            <button onClick={handleSeed} disabled={seeding}
              style={{ background: '#2563eb', color: '#fff', padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none' }}>
              {seeding ? '⏳ Carregando...' : '🔄 Carregar Imóveis do ABC'}
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
          {properties.map(p => <PropertyCard key={p.id} p={p} />)}
        </div>
      </div>

      {/* Banner matching */}
      <div style={{ background: 'linear-gradient(135deg,#059669,#047857)', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: '0 0 10px' }}>Receba imóveis perfeitos para você</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '0 0 24px', lineHeight: 1.6 }}>
            Cadastre seu perfil de comprador ou locatário e nosso algoritmo vai encontrar os imóveis mais compatíveis com suas necessidades — com score de compatibilidade e motivos detalhados.
          </p>
          <Link href="/imoveis/perfil" style={{ background: '#fff', color: '#065f46', padding: '13px 28px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
            Criar Meu Perfil Gratuitamente →
          </Link>
        </div>
      </div>
    </div>
  );
}
