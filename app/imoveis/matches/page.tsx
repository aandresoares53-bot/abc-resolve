'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const TYPES_LABEL: Record<string, string> = {
  apartment: 'Apartamento', house: 'Casa', commercial: 'Comercial', land: 'Terreno', kitnet: 'Kitnet',
};
const FEATURE_LABEL: Record<string, string> = {
  pool: '🏊 Piscina', gym: '🏋️ Academia', elevator: '🛗 Elevador', furnished: '🛋️ Mobiliado',
  pet_friendly: '🐾 Pet Friendly', gated: '🔒 Condomínio', balcony: '🌅 Varanda', party_room: '🎉 Salão',
  sauna: '🧖 Sauna', rooftop: '🌇 Rooftop',
};

interface Property {
  id: string; title: string; description?: string; type: string; operation: string;
  price: number; area_m2?: number; bedrooms?: number; bathrooms?: number; parking_spots?: number;
  city: string; neighborhood: string; features: string[]; images: string[];
  source: string; contact_name?: string; contact_phone?: string;
}

interface Match {
  score: number; score_pct: number; reasons: string[];
  breakdown: { operation: number; price: number; location: number; type: number; area: number; bedrooms: number; features: number };
  property: Property;
}

interface MatchResponse {
  profile: { id: string; name: string };
  total: number;
  matches: Match[];
}

function formatPrice(price: number, operation: string) {
  if (operation === 'rent') return `R$ ${price.toLocaleString('pt-BR')}/mês`;
  if (price >= 1000000) return `R$ ${(price / 1000000).toFixed(2).replace('.', ',')} mi`;
  return `R$ ${price.toLocaleString('pt-BR')}`;
}

function ScoreBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? '#059669' : pct >= 60 ? '#d97706' : '#dc2626';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: '#6b7280', width: 90, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, width: 30, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

function MatchCard({ m, rank }: { m: Match; rank: number }) {
  const [open, setOpen] = useState(false);
  const p = m.property;
  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';
  const scoreColor = m.score_pct >= 80 ? '#059669' : m.score_pct >= 60 ? '#d97706' : '#6b7280';

  return (
    <div style={{ background: '#fff', border: `2px solid ${rank <= 3 ? '#fbbf24' : '#e5e7eb'}`, borderRadius: 18, overflow: 'hidden', boxShadow: rank <= 3 ? '0 4px 16px rgba(251,191,36,0.15)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
      {rank <= 3 && (
        <div style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
          <span style={{ color: '#78350f', fontWeight: 700, fontSize: 12 }}>Top {rank} — Mais Compatível</span>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0 }}>
        {/* Imagem */}
        <div style={{ position: 'relative', height: '100%', minHeight: 180 }}>
          <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', top: 10, left: 10, background: p.operation === 'sale' ? '#2563eb' : '#059669', color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
            {p.operation === 'sale' ? 'VENDA' : 'LOCAÇÃO'}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Score badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                {TYPES_LABEL[p.type] ?? p.type}
              </span>
              <span style={{ marginLeft: 6, fontSize: 12, color: '#6b7280' }}>📍 {p.neighborhood}, {p.city}</span>
            </div>
            <div style={{ textAlign: 'center', background: scoreColor, color: '#fff', borderRadius: 12, padding: '6px 14px', minWidth: 70 }}>
              <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{m.score_pct}%</div>
              <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.85 }}>match</div>
            </div>
          </div>

          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.4 }}>{p.title}</h3>

          <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#6b7280', flexWrap: 'wrap' }}>
            <strong style={{ color: '#111', fontSize: 16 }}>{formatPrice(p.price, p.operation)}</strong>
            {p.bedrooms !== undefined && p.bedrooms > 0 && <span>🛏 {p.bedrooms}q</span>}
            {p.area_m2 && <span>📐 {p.area_m2}m²</span>}
            {p.parking_spots !== undefined && p.parking_spots > 0 && <span>🚗 {p.parking_spots}v</span>}
          </div>

          {/* Reasons */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {m.reasons.slice(0, 3).map((r, i) => (
              <span key={i} style={{ fontSize: 12, color: r.startsWith('✅') ? '#065f46' : r.startsWith('⚠️') ? '#92400e' : '#991b1b', background: r.startsWith('✅') ? '#f0fdf4' : r.startsWith('⚠️') ? '#fffbeb' : '#fef2f2', padding: '3px 8px', borderRadius: 6 }}>
                {r}
              </span>
            ))}
          </div>

          {/* Features */}
          {p.features.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {p.features.slice(0, 3).map(f => (
                <span key={f} style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 7px', borderRadius: 999, fontSize: 11, fontWeight: 500 }}>
                  {FEATURE_LABEL[f] ?? f}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
            <button onClick={() => setOpen(!open)}
              style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', padding: '8px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {open ? '▲ Fechar detalhes' : '▼ Ver score detalhado'}
            </button>
            {p.contact_phone && (
              <a href={`https://wa.me/55${p.contact_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, background: '#25D366', color: '#fff', textDecoration: 'none', padding: '8px', borderRadius: 8, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                📱 WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Score breakdown expandido */}
      {open && (
        <div style={{ padding: '16px 18px', borderTop: '1px solid #f3f4f6', background: '#fafafa' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#374151' }}>📊 Score por critério</h4>
          <ScoreBar value={m.breakdown.price} label="💰 Orçamento" />
          <ScoreBar value={m.breakdown.operation} label="🏷 Operação" />
          <ScoreBar value={m.breakdown.location} label="📍 Localização" />
          <ScoreBar value={m.breakdown.type} label="🏠 Tipo" />
          <ScoreBar value={m.breakdown.area} label="📐 Metragem" />
          <ScoreBar value={m.breakdown.bedrooms} label="🛏 Quartos" />
          <ScoreBar value={m.breakdown.features} label="✨ Características" />
          {p.description && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
              <strong>Descrição:</strong> {p.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MatchesContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get('profile_id');
  const [data, setData] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [minScore, setMinScore] = useState(0.3);

  const load = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    const res = await fetch(`/api/imoveis/matches?profile_id=${profileId}&min_score=${minScore}`);
    const json = await res.json() as MatchResponse;
    setData(json);
    setLoading(false);
  }, [profileId, minScore]);

  useEffect(() => { load(); }, [load]);

  if (!profileId) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <h2 style={{ color: '#111' }}>Nenhum perfil selecionado</h2>
        <Link href="/imoveis/perfil" style={{ color: '#2563eb', fontWeight: 600 }}>Criar meu perfil →</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      {/* Controles */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Score mínimo: </span>
          <strong style={{ color: '#2563eb' }}>{Math.round(minScore * 100)}%</strong>
        </div>
        <input type="range" min={10} max={90} step={5} value={minScore * 100}
          onChange={e => setMinScore(parseInt(e.target.value) / 100)}
          style={{ flex: 1, minWidth: 120 }} />
        <button onClick={load} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
          🔄 Atualizar
        </button>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 60, fontSize: 18, color: '#6b7280' }}>⏳ Calculando matches...</div>}

      {!loading && data && (
        <>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#111' }}>
                🎯 {data.total} imóveis compatíveis para {data.profile.name}
              </h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Ordenados pelo maior score de compatibilidade</p>
            </div>
            <Link href="/imoveis" style={{ fontSize: 14, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              ← Ver todos os imóveis
            </Link>
          </div>

          {data.matches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '1px dashed #d1d5db' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
              <p style={{ fontWeight: 600, color: '#374151' }}>Nenhum imóvel compatível encontrado</p>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Tente reduzir o score mínimo ou ajustar seu perfil.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {data.matches.map((m, i) => <MatchCard key={m.property.id} m={m} rank={i + 1} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/imoveis/perfil" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 13 }}>← Meu Perfil</Link>
        <span style={{ color: '#d1d5db' }}>›</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>🎯 Imóveis Compatíveis</span>
      </header>

      <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#4338ca)', padding: '24px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 22, fontWeight: 800 }}>
          Imóveis com maior compatibilidade com seu perfil
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '6px 0 0', fontSize: 14 }}>
          Algoritmo de matching inteligente com score em 7 critérios
        </p>
      </div>

      <Suspense fallback={<div style={{ textAlign: 'center', padding: 60 }}>⏳ Carregando...</div>}>
        <MatchesContent />
      </Suspense>
    </div>
  );
}
