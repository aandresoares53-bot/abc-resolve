'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError(''); setLoading(true)
    const url = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
    const body = tab === 'login' ? { email, password } : { name, email, password }
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Erro desconhecido'); setLoading(false); return }
    router.push('/')
    router.refresh()
  }

  function onKey(e: React.KeyboardEvent) { if (e.key === 'Enter') submit() }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060b18; }

        @keyframes float-a { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-18px) rotate(-4deg)} }
        @keyframes float-b { 0%,100%{transform:translateY(0) rotate(3deg)} 50%{transform:translateY(-24px) rotate(3deg)} }
        @keyframes float-c { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(-2deg)} }
        @keyframes orb-pulse { 0%,100%{opacity:.35;transform:scale(1)} 50%{opacity:.6;transform:scale(1.08)} }
        @keyframes card-in { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .login-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background:
            radial-gradient(ellipse at 15% 15%, rgba(99,102,241,0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 85%, rgba(139,92,246,0.14) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 30%, rgba(16,185,129,0.06) 0%, transparent 40%),
            linear-gradient(150deg, #060b18 0%, #0d1526 60%, #060b18 100%);
          position: relative;
          overflow: hidden;
        }

        .orb { position: absolute; border-radius: 50%; filter: blur(70px); animation: orb-pulse 5s ease-in-out infinite; pointer-events: none; }
        .orb-1 { width: 480px; height: 480px; background: rgba(99,102,241,0.22); top: -140px; left: -120px; }
        .orb-2 { width: 360px; height: 360px; background: rgba(139,92,246,0.16); bottom: -100px; right: -100px; animation-delay: 2s; }
        .orb-3 { width: 220px; height: 220px; background: rgba(16,185,129,0.1); top: 45%; right: 18%; animation-delay: 3.5s; }

        .grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
          pointer-events: none;
        }

        /* Floating decorative cards */
        .float-card {
          position: absolute;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 18px;
          padding: 18px 22px;
          backdrop-filter: blur(12px);
          pointer-events: none;
          display: none;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        @media (min-width: 1100px) { .float-card { display: block; } }

        .float-card-1 { left: 5%; top: 22%; animation: float-a 5.5s ease-in-out infinite; min-width: 170px; }
        .float-card-2 { right: 4%; top: 18%; animation: float-b 6.5s ease-in-out infinite; animation-delay: .6s; min-width: 180px; }
        .float-card-3 { left: 7%; bottom: 20%; animation: float-c 7s ease-in-out infinite; animation-delay: 1.2s; min-width: 160px; }
        .float-card-4 { right: 6%; bottom: 22%; animation: float-a 6s ease-in-out infinite; animation-delay: 2s; min-width: 165px; }

        .fc-label { font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: #475569; font-weight: 700; margin-bottom: 10px; }
        .fc-big { font-size: 24px; font-weight: 800; color: #f1f5f9; }
        .fc-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
        .fc-icon { font-size: 30px; margin-bottom: 10px; display: block; }
        .fc-progress { height: 5px; border-radius: 3px; background: rgba(255,255,255,0.07); margin-top: 12px; overflow: hidden; }
        .fc-progress-fill { height: 100%; border-radius: 3px; }
        .fc-mini-pie {
          width: 52px; height: 52px; border-radius: 50%; margin-bottom: 12px;
          background: conic-gradient(#6366f1 0% 35%, #10b981 35% 55%, #f59e0b 55% 73%, #ef4444 73% 85%, #8b5cf6 85% 100%);
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
        }
        .fc-legend { display: flex; flex-direction: column; gap: 7px; }
        .fc-legend-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #94a3b8; }
        .fc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        /* Main card */
        .login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px;
          padding: 48px 40px;
          backdrop-filter: blur(28px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08);
          position: relative; z-index: 10;
          animation: card-in .5s cubic-bezier(.16,1,.3,1);
        }

        .login-card::before {
          content: '';
          position: absolute; inset: -1px;
          border-radius: 29px;
          background: linear-gradient(135deg, rgba(99,102,241,0.35) 0%, transparent 40%, rgba(139,92,246,0.2) 100%);
          z-index: -1;
        }

        .login-card::after {
          content: '';
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          z-index: -1; pointer-events: none;
        }

        .login-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 36px; }

        .login-logo-icon {
          width: 54px; height: 54px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          box-shadow: 0 8px 28px rgba(99,102,241,0.55), inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .login-logo-text h1 { color: #f1f5f9; font-size: 20px; font-weight: 800; letter-spacing: -.02em; }
        .login-logo-text p { color: #475569; font-size: 12px; margin-top: 2px; }

        .login-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25);
          border-radius: 20px; padding: 4px 10px;
          font-size: 11px; color: #34d399; font-weight: 600;
          margin-bottom: 16px;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: orb-pulse 2s ease-in-out infinite; }

        .login-title { color: #f1f5f9; font-size: 26px; font-weight: 800; margin-bottom: 6px; letter-spacing: -.02em; }
        .login-subtitle { color: #475569; font-size: 14px; margin-bottom: 32px; }

        .tabs {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 4px; margin-bottom: 28px;
        }

        .tab-btn {
          flex: 1; padding: 10px; border: none; border-radius: 10px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: all .2s; background: transparent; color: #475569; font-family: inherit;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          box-shadow: 0 4px 16px rgba(99,102,241,0.45);
        }

        .form-group { margin-bottom: 18px; }

        .form-label {
          display: block; color: #94a3b8; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .07em; margin-bottom: 8px;
        }

        .form-input {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; color: #f1f5f9; font-size: 15px;
          font-family: inherit; outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }

        .form-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .form-input::placeholder { color: #2d3d52; }

        .err {
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px; color: #fca5a5; font-size: 14px;
          padding: 12px 16px; margin-bottom: 18px;
        }

        .btn-primary {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none; border-radius: 12px; color: #fff;
          font-size: 15px; font-weight: 700; font-family: inherit; cursor: pointer;
          transition: all .25s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.45);
          position: relative; overflow: hidden;
        }

        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity .2s;
        }

        .btn-primary:hover:not(:disabled)::before { opacity: 1; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(99,102,241,0.55); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: .55; cursor: not-allowed; }

        .login-switch { text-align: center; margin-top: 20px; color: #475569; font-size: 14px; }
        .login-switch button { background: none; border: none; color: #818cf8; cursor: pointer; font-weight: 600; font-size: 14px; font-family: inherit; }
        .login-switch button:hover { color: #a5b4fc; }

        .features {
          margin-top: 28px; padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }

        .feature-item {
          display: flex; align-items: center; gap: 8px;
          color: #334155; font-size: 12px;
          background: rgba(255,255,255,0.02); border-radius: 8px; padding: 8px 10px;
        }

        .feature-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(99,102,241,0.6);
        }
      `}</style>

      <div className="login-wrap">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-bg" />

        {/* Floating decorative cards */}
        <div className="float-card float-card-1">
          <div className="fc-label">Este mês</div>
          <span className="fc-icon">💸</span>
          <div className="fc-big">R$ 2.840</div>
          <div className="fc-sub">Total controlado</div>
          <div className="fc-progress"><div className="fc-progress-fill" style={{ width:'71%', background:'#10b981' }} /></div>
        </div>

        <div className="float-card float-card-2">
          <div className="fc-label">Por categoria</div>
          <div className="fc-mini-pie" />
          <div className="fc-legend">
            <div className="fc-legend-row"><div className="fc-dot" style={{ background:'#6366f1' }} />Casa 35%</div>
            <div className="fc-legend-row"><div className="fc-dot" style={{ background:'#10b981' }} />Alimentação 20%</div>
            <div className="fc-legend-row"><div className="fc-dot" style={{ background:'#f59e0b' }} />Carro 18%</div>
          </div>
        </div>

        <div className="float-card float-card-3">
          <div className="fc-label">Saldo restante</div>
          <span className="fc-icon">✅</span>
          <div className="fc-big" style={{ color:'#10b981' }}>R$ 1.160</div>
          <div className="fc-sub">Dentro do orçamento</div>
        </div>

        <div className="float-card float-card-4">
          <div className="fc-label">Contas previstas</div>
          <span className="fc-icon">🔮</span>
          <div className="fc-big" style={{ color:'#f59e0b' }}>3 contas</div>
          <div className="fc-sub">R$ 680 a pagar</div>
        </div>

        {/* Main login card */}
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">🏠</div>
            <div className="login-logo-text">
              <h1>Controle Casa</h1>
              <p>Gestão de gastos domésticos</p>
            </div>
          </div>

          <div className="login-badge">
            <div className="badge-dot" />
            Sistema disponível
          </div>

          <h2 className="login-title">{tab === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}</h2>
          <p className="login-subtitle">{tab === 'login' ? 'Entre na sua conta para continuar' : 'Comece a controlar seus gastos hoje'}</p>

          <div className="tabs">
            <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError('') }}>Entrar</button>
            <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError('') }}>Criar conta</button>
          </div>

          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input className="form-input" type="text" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} onKeyDown={onKey} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input className="form-input" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey} />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input className="form-input" type="password" placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={onKey} />
          </div>

          {error && <div className="err">⚠ {error}</div>}

          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? 'Aguarde...' : tab === 'login' ? '→ Entrar' : '→ Criar conta'}
          </button>

          <div className="login-switch">
            {tab === 'login' ? (
              <>Não tem conta? <button onClick={() => { setTab('register'); setError('') }}>Cadastre-se grátis</button></>
            ) : (
              <>Já tem conta? <button onClick={() => { setTab('login'); setError('') }}>Entrar</button></>
            )}
          </div>

          <div className="features">
            <div className="feature-item"><div className="feature-dot" />Gráficos e Pareto</div>
            <div className="feature-item"><div className="feature-dot" />Por categorias</div>
            <div className="feature-item"><div className="feature-dot" />Exportar PDF</div>
            <div className="feature-item"><div className="feature-dot" />Previsões</div>
          </div>
        </div>
      </div>
    </>
  )
}
