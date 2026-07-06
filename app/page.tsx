'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

const services = [
  { emoji: '🔧', label: 'Encanador' },
  { emoji: '⚡', label: 'Eletricista' },
  { emoji: '🎨', label: 'Pintor' },
  { emoji: '🪚', label: 'Carpinteiro' },
  { emoji: '🌿', label: 'Jardineiro' },
  { emoji: '🧹', label: 'Limpeza' },
  { emoji: '❄️', label: 'Ar Condicionado' },
  { emoji: '🏠', label: 'Reparos Gerais' },
];

const steps = [
  { n: '1', emoji: '🔍', title: 'Busque o serviço', desc: 'Escolha o tipo de serviço e a cidade. Veja todos os prestadores disponíveis perto de você.' },
  { n: '2', emoji: '👤', title: 'Escolha o profissional', desc: 'Compare perfis e avaliações. Entre em contato direto com o prestador pelo WhatsApp.' },
  { n: '3', emoji: '✅', title: 'Contrate com segurança', desc: 'Combine o serviço, agende o horário e avalie o profissional ao final.' },
];

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>

      {/* HEADER */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2563eb,#1e40af)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>A</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>ABCResolve</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/login?type=consumer" style={{ color: '#374151', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
              Entrar
            </Link>
            <Link href="/register?type=provider" style={{ background: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Sou Prestador
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#1d4ed8 0%,#2563eb 50%,#4338ca 100%)', color: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '6px 16px', marginBottom: 28, fontSize: 14, fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
            Mais de 500 prestadores na região do ABC
          </div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-1px' }}>
            Encontre o profissional<br />
            <span style={{ color: '#fbbf24' }}>certo para você</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(255,255,255,0.85)', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Conecte-se com prestadores de serviços confiáveis em Santo André, São Bernardo, São Caetano e toda a região do Grande ABC.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 56 }}>
            <button onClick={() => router.push('/login?type=consumer')} style={{ background: '#fff', color: '#1d4ed8', border: 'none', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
              🔍 Buscar Serviços
            </button>
            <button onClick={() => router.push('/register?type=provider')} style={{ background: '#fbbf24', color: '#111', border: 'none', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
              💼 Sou Prestador
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
            {[['500+', 'Prestadores'], ['6', 'Cidades'], ['4.8★', 'Avaliação média']].map(([num, label]) => (
              <div key={label} style={{ padding: '20px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fbbf24' }}>{num}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ background: '#f9fafb', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Como funciona</h2>
            <p style={{ fontSize: 16, color: '#6b7280', margin: 0 }}>Simples, rápido e seguro</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
            {steps.map(s => (
              <div key={s.n} style={{ background: '#fff', borderRadius: 16, padding: '36px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', position: 'relative', textAlign: 'center' }}>
                <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 32, height: 32, background: '#2563eb', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{s.n}</div>
                <div style={{ fontSize: 52, marginBottom: 16, marginTop: 8 }}>{s.emoji}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Serviços disponíveis</h2>
            <p style={{ fontSize: 16, color: '#6b7280', margin: 0 }}>Encontre profissionais para qualquer necessidade</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 16 }}>
            {services.map(s => (
              <button key={s.label} onClick={() => router.push('/login?type=consumer')} style={{ background: '#f9fafb', border: '2px solid transparent', borderRadius: 16, padding: '24px 12px', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#93c5fd'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
              >
                <div style={{ fontSize: 40, marginBottom: 10 }}>{s.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{s.label}</div>
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button onClick={() => router.push('/login?type=consumer')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              Ver todos os serviços →
            </button>
          </div>
        </div>
      </section>

      {/* CTA PRESTADOR */}
      <section style={{ background: 'linear-gradient(135deg,#059669,#047857)', padding: '80px 24px', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>💼</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, margin: '0 0 14px' }}>É prestador de serviços?</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 0 36px' }}>
            Cadastre-se gratuitamente e comece a receber clientes hoje mesmo. Milhares de consumidores buscam profissionais na sua região.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register?type=provider" style={{ background: '#fff', color: '#065f46', padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>
              Criar conta grátis
            </Link>
            <Link href="/login?type=provider" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.35)', padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#111', color: '#9ca3af', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>A</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>ABCResolve</span>
        </div>
        <p style={{ fontSize: 14, margin: '0 0 6px' }}>Conectando profissionais e clientes no Grande ABC</p>
        <p style={{ fontSize: 12, color: '#4b5563', margin: 0 }}>© 2025 ABCResolve. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
