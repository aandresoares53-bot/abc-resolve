'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CITIES = ['Santo André', 'São Bernardo do Campo', 'São Caetano do Sul', 'Diadema', 'Mauá', 'Ribeirão Pires'];
const PROPERTY_TYPES = [
  { value: 'apartment', label: '🏢 Apartamento' },
  { value: 'house', label: '🏡 Casa' },
  { value: 'commercial', label: '🏪 Comercial' },
  { value: 'land', label: '🌳 Terreno' },
  { value: 'kitnet', label: '🛏 Kitnet' },
];
const FEATURES = [
  { value: 'pool', label: '🏊 Piscina' },
  { value: 'gym', label: '🏋️ Academia' },
  { value: 'elevator', label: '🛗 Elevador' },
  { value: 'furnished', label: '🛋️ Mobiliado' },
  { value: 'pet_friendly', label: '🐾 Pet Friendly' },
  { value: 'gated', label: '🔒 Condomínio' },
  { value: 'balcony', label: '🌅 Varanda' },
  { value: 'party_room', label: '🎉 Salão' },
];

interface Profile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  operation_type: string;
  property_types: string[];
  cities: string[];
  neighborhoods: string[];
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  required_features: string[];
  notes?: string;
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

export default function PerfilPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', whatsapp: '',
    operation_type: 'both',
    property_types: [] as string[],
    cities: [] as string[],
    neighborhoods: '',
    min_price: '', max_price: '',
    min_area: '', max_area: '',
    min_bedrooms: '', max_bedrooms: '',
    required_features: [] as string[],
    notes: '',
  });

  useEffect(() => {
    fetch('/api/imoveis/perfis').then(r => r.json()).then((d: unknown) => {
      const data = d as { profiles?: Profile[] };
      setProfiles(data.profiles ?? []);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      neighborhoods: form.neighborhoods ? form.neighborhoods.split(',').map(s => s.trim()).filter(Boolean) : [],
      min_price: form.min_price ? parseFloat(form.min_price) : undefined,
      max_price: form.max_price ? parseFloat(form.max_price) : undefined,
      min_area: form.min_area ? parseFloat(form.min_area) : undefined,
      max_area: form.max_area ? parseFloat(form.max_area) : undefined,
      min_bedrooms: form.min_bedrooms ? parseInt(form.min_bedrooms) : undefined,
      max_bedrooms: form.max_bedrooms ? parseInt(form.max_bedrooms) : undefined,
    };
    const res = await fetch('/api/imoveis/perfis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json() as { profile?: Profile };
    if (data.profile) {
      setSaved(data.profile);
      setProfiles(prev => [data.profile!, ...prev]);
    }
    setSaving(false);
  }

  const F = form;
  const setF = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  if (saved) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0fdf4', fontFamily: 'system-ui,-apple-system,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 36px', maxWidth: 560, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: '0 0 10px' }}>Perfil criado com sucesso!</h2>
          <p style={{ color: '#6b7280', fontSize: 15, margin: '0 0 28px' }}>
            Agora nosso algoritmo vai buscar os imóveis mais compatíveis com o perfil de <strong>{saved.name}</strong>.
          </p>
          <Link href={`/imoveis/matches?profile_id=${saved.id}`}
            style={{ background: '#2563eb', color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none', display: 'inline-block', marginBottom: 14 }}>
            🔍 Ver Imóveis Compatíveis →
          </Link>
          <br />
          <Link href="/imoveis" style={{ color: '#6b7280', fontSize: 14 }}>← Voltar para todos os imóveis</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/imoveis" style={{ textDecoration: 'none', color: '#6b7280', fontSize: 13 }}>← Imóveis ABC</Link>
        <span style={{ color: '#d1d5db' }}>›</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>🧑‍💼 Meu Perfil de Interesse</span>
      </header>

      <div style={{ maxWidth: 780, margin: '32px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: '32px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Cadastrar Perfil de Interesse</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 28px' }}>Preencha suas preferências e nosso algoritmo encontrará os melhores imóveis para você.</p>

          {/* Dados pessoais */}
          <Section title="👤 Dados de Contato">
            <Row>
              <Field label="Nome completo *" required>
                <input required value={F.name} onChange={e => setF('name', e.target.value)} placeholder="Seu nome" style={inputStyle} />
              </Field>
              <Field label="WhatsApp">
                <input value={F.whatsapp} onChange={e => setF('whatsapp', e.target.value)} placeholder="(11) 9xxxx-xxxx" style={inputStyle} />
              </Field>
            </Row>
            <Row>
              <Field label="E-mail">
                <input type="email" value={F.email} onChange={e => setF('email', e.target.value)} placeholder="seu@email.com" style={inputStyle} />
              </Field>
              <Field label="Telefone">
                <input value={F.phone} onChange={e => setF('phone', e.target.value)} placeholder="(11) 4xxx-xxxx" style={inputStyle} />
              </Field>
            </Row>
          </Section>

          {/* Operação */}
          <Section title="📋 Tipo de Interesse">
            <div style={{ display: 'flex', gap: 10 }}>
              {[['both', '🏷+🔑 Compra e Locação'], ['sale', '🏷 Quero Comprar'], ['rent', '🔑 Quero Alugar']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setF('operation_type', v)}
                  style={{ flex: 1, padding: '10px 8px', borderRadius: 10, border: `2px solid ${F.operation_type === v ? '#2563eb' : '#e5e7eb'}`, background: F.operation_type === v ? '#eff6ff' : '#fff', color: F.operation_type === v ? '#1d4ed8' : '#374151', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                  {l}
                </button>
              ))}
            </div>
          </Section>

          {/* Tipo de imóvel */}
          <Section title="🏠 Tipo de Imóvel">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PROPERTY_TYPES.map(({ value, label }) => {
                const sel = F.property_types.includes(value);
                return (
                  <button key={value} type="button" onClick={() => setF('property_types', toggle(F.property_types, value))}
                    style={{ padding: '8px 14px', borderRadius: 999, border: `2px solid ${sel ? '#2563eb' : '#e5e7eb'}`, background: sel ? '#eff6ff' : '#f9fafb', color: sel ? '#1d4ed8' : '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    {label}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 0' }}>Deixe em branco para todos os tipos</p>
          </Section>

          {/* Localização */}
          <Section title="📍 Localização">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {CITIES.map(c => {
                const sel = F.cities.includes(c);
                return (
                  <button key={c} type="button" onClick={() => setF('cities', toggle(F.cities, c))}
                    style={{ padding: '7px 14px', borderRadius: 999, border: `2px solid ${sel ? '#059669' : '#e5e7eb'}`, background: sel ? '#f0fdf4' : '#f9fafb', color: sel ? '#065f46' : '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    {c}
                  </button>
                );
              })}
            </div>
            <Field label="Bairros de interesse (separados por vírgula)">
              <input value={F.neighborhoods} onChange={e => setF('neighborhoods', e.target.value)} placeholder="Ex: Centro, Vila Assunção, Nova Petrópolis" style={inputStyle} />
            </Field>
          </Section>

          {/* Orçamento */}
          <Section title="💰 Orçamento">
            <Row>
              <Field label="Valor mínimo (R$)">
                <input type="number" value={F.min_price} onChange={e => setF('min_price', e.target.value)} placeholder="0" style={inputStyle} />
              </Field>
              <Field label="Valor máximo (R$)">
                <input type="number" value={F.max_price} onChange={e => setF('max_price', e.target.value)} placeholder="sem limite" style={inputStyle} />
              </Field>
            </Row>
          </Section>

          {/* Metragem e Quartos */}
          <Section title="📐 Características">
            <Row>
              <Field label="Área mínima (m²)">
                <input type="number" value={F.min_area} onChange={e => setF('min_area', e.target.value)} placeholder="0" style={inputStyle} />
              </Field>
              <Field label="Área máxima (m²)">
                <input type="number" value={F.max_area} onChange={e => setF('max_area', e.target.value)} placeholder="sem limite" style={inputStyle} />
              </Field>
            </Row>
            <Row>
              <Field label="Quartos mínimos">
                <select value={F.min_bedrooms} onChange={e => setF('min_bedrooms', e.target.value)} style={inputStyle}>
                  <option value="">Qualquer</option>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}+</option>)}
                </select>
              </Field>
              <Field label="Quartos máximos">
                <select value={F.max_bedrooms} onChange={e => setF('max_bedrooms', e.target.value)} style={inputStyle}>
                  <option value="">Qualquer</option>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
            </Row>
          </Section>

          {/* Características desejadas */}
          <Section title="✨ Características Desejadas">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FEATURES.map(({ value, label }) => {
                const sel = F.required_features.includes(value);
                return (
                  <button key={value} type="button" onClick={() => setF('required_features', toggle(F.required_features, value))}
                    style={{ padding: '7px 14px', borderRadius: 999, border: `2px solid ${sel ? '#7c3aed' : '#e5e7eb'}`, background: sel ? '#f5f3ff' : '#f9fafb', color: sel ? '#5b21b6' : '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Observações */}
          <Section title="📝 Observações">
            <textarea value={F.notes} onChange={e => setF('notes', e.target.value)} rows={3}
              placeholder="Descreva outros requisitos, urgência, preferências especiais..." style={{ ...inputStyle, resize: 'vertical' }} />
          </Section>

          <button type="submit" disabled={saving}
            style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', opacity: saving ? 0.7 : 1, marginTop: 8 }}>
            {saving ? '⏳ Salvando...' : '🎯 Criar Perfil e Ver Matches'}
          </button>
        </form>

        {/* Sidebar: perfis existentes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '16px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#1e40af' }}>💡 Como funciona o matching</h3>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: '#1e3a8a', lineHeight: 1.8 }}>
              <li><strong>Orçamento</strong> — 25% do score</li>
              <li><strong>Operação</strong> — 20% do score</li>
              <li><strong>Localização</strong> — 20% do score</li>
              <li><strong>Tipo do imóvel</strong> — 15% do score</li>
              <li><strong>Metragem</strong> — 10% do score</li>
              <li><strong>Quartos</strong> — 5% do score</li>
              <li><strong>Características</strong> — 5% do score</li>
            </ul>
          </div>

          {profiles.length > 0 && (
            <div>
              <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#374151' }}>Perfis criados</h3>
              {profiles.map(p => (
                <Link key={p.id} href={`/imoveis/matches?profile_id=${p.id}`}
                  style={{ display: 'block', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 14px', textDecoration: 'none', marginBottom: 8 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, color: '#111', fontSize: 14 }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                    {p.operation_type === 'sale' ? 'Compra' : p.operation_type === 'rent' ? 'Locação' : 'Compra + Locação'}
                    {p.max_price ? ` · até R$ ${p.max_price.toLocaleString('pt-BR')}` : ''}
                  </p>
                  <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Ver matches →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb',
  fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fff',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#374151', borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>{title}</h3>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>{children}</div>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
    </div>
  );
}
