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
        body { background: #0f172a; }

        .login-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .login-logo-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }

        .login-logo-text h1 { color: #f1f5f9; font-size: 20px; font-weight: 700; }
        .login-logo-text p { color: #64748b; font-size: 13px; }

        .login-title { color: #f1f5f9; font-size: 26px; font-weight: 700; margin-bottom: 6px; }
        .login-subtitle { color: #64748b; font-size: 14px; margin-bottom: 32px; }

        .tabs {
          display: flex;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 28px;
        }

        .tab-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all .2s;
          background: transparent;
          color: #64748b;
        }

        .tab-btn.active {
          background: #6366f1;
          color: #fff;
          box-shadow: 0 4px 12px rgba(99,102,241,0.4);
        }

        .form-group { margin-bottom: 18px; }

        .form-label {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .05em;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #f1f5f9;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color .2s, background .2s;
        }

        .form-input:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,0.08);
        }

        .form-input::placeholder { color: #475569; }

        .err {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          color: #fca5a5;
          font-size: 14px;
          padding: 12px 16px;
          margin-bottom: 18px;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all .2s;
          box-shadow: 0 4px 16px rgba(99,102,241,0.4);
        }

        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,0.5); }
        .btn-primary:disabled { opacity: .6; cursor: not-allowed; }

        .login-switch {
          text-align: center;
          margin-top: 20px;
          color: #475569;
          font-size: 14px;
        }

        .login-switch button {
          background: none; border: none; color: #6366f1; cursor: pointer;
          font-weight: 600; font-size: 14px; font-family: inherit;
        }

        .features {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #475569;
          font-size: 13px;
        }

        .feature-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
        }
      `}</style>

      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">🏠</div>
            <div className="login-logo-text">
              <h1>Controle Casa</h1>
              <p>Gestão de gastos domésticos</p>
            </div>
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
            {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
          </button>

          <div className="login-switch">
            {tab === 'login' ? (
              <>Não tem conta? <button onClick={() => { setTab('register'); setError('') }}>Cadastre-se</button></>
            ) : (
              <>Já tem conta? <button onClick={() => { setTab('login'); setError('') }}>Entrar</button></>
            )}
          </div>

          <div className="features">
            <div className="feature-item"><div className="feature-dot" />Dashboard com gráficos e resumos</div>
            <div className="feature-item"><div className="feature-dot" />Controle por categorias</div>
            <div className="feature-item"><div className="feature-dot" />Relatórios em PDF</div>
            <div className="feature-item"><div className="feature-dot" />Previsões de gastos</div>
          </div>
        </div>
      </div>
    </>
  )
}
