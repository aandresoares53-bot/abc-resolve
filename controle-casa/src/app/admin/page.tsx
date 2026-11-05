'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
  trial_expires_at: string
  paid: boolean
  created_at: string
  total_gastos: number
}

export default function Admin() {
  const router = useRouter()
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function login() {
    setError('')
    const res = await fetch(`/api/admin/users?secret=${encodeURIComponent(secret)}`)
    if (!res.ok) { setError('Senha inválida'); return }
    const data = await res.json()
    setUsers(data)
    setAuthed(true)
  }

  async function markPaid(userId: number, paid: boolean) {
    await fetch('/api/admin/mark-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, userId, paid })
    })
    setUsers(u => u.map(x => x.id === userId ? { ...x, paid } : x))
    setMsg(`Usuário ${paid ? 'marcado como pago' : 'desmarcado'}`)
    setTimeout(() => setMsg(''), 3000)
  }

  async function resetTrial(userId: number) {
    const days = prompt('Quantos dias de trial?', '7')
    if (!days) return
    await fetch('/api/admin/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, userId, days: parseInt(days) })
    })
    setMsg('Trial resetado')
    setTimeout(() => setMsg(''), 3000)
    const res = await fetch(`/api/admin/users?secret=${encodeURIComponent(secret)}`)
    setUsers(await res.json())
  }

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 40, width: 360 }}>
        <h1 style={{ color: '#f1f5f9', marginBottom: 24, fontSize: 22 }}>Admin</h1>
        <input
          type="password"
          placeholder="Senha admin"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 15, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
        />
        {error && <p style={{ color: '#fca5a5', marginBottom: 12 }}>{error}</p>}
        <button onClick={login} style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Entrar
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>🔧 Painel Admin</h1>
          <button onClick={() => router.push('/')} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, color: '#94a3b8', cursor: 'pointer' }}>
            ← Voltar
          </button>
        </div>
        {msg && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, color: '#86efac', padding: '12px 16px', marginBottom: 20 }}>{msg}</div>}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['ID','Nome','E-mail','Trial até','Pago','Gastos','Ações'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: 13 }}>{u.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: 14 }}>{u.email}</td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: 13 }}>{u.trial_expires_at ? new Date(u.trial_expires_at).toLocaleDateString('pt-BR') : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: u.paid ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: u.paid ? '#86efac' : '#fca5a5' }}>
                      {u.paid ? 'Pago' : 'Trial'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8' }}>R$ {Number(u.total_gastos || 0).toFixed(2)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => markPaid(u.id, !u.paid)} style={{ padding: '6px 12px', background: u.paid ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', border: 'none', borderRadius: 6, color: u.paid ? '#fca5a5' : '#86efac', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                        {u.paid ? 'Desmarcar' : 'Marcar Pago'}
                      </button>
                      <button onClick={() => resetTrial(u.id)} style={{ padding: '6px 12px', background: 'rgba(99,102,241,0.15)', border: 'none', borderRadius: 6, color: '#a5b4fc', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                        Reset Trial
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
