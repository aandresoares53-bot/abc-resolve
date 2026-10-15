'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Gasto = { id: number; descricao: string; cat: string; val: number; data: string | null; mes: string | null }
type Previsao = { id: number; descricao: string; cat: string; val: number; data_prevista: string | null; recorrente: boolean }
type User = { id: number; name: string; email: string; trial_expires_at: string; paid: boolean; trialExpired: boolean }

const CATS: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  casa:        { label: 'Contas da Casa',  icon: '🏠', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  alimentacao: { label: 'Alimentação',     icon: '🛒', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  carro:       { label: 'Carro',           icon: '🚗', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  gasolina:    { label: 'Gasolina',        icon: '⛽', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  limpeza:     { label: 'Limpeza',         icon: '🧹', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  filhos:      { label: 'Filhos',          icon: '👶', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  saude:       { label: 'Saúde / Médico',  icon: '🏥', color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
  vacinas:     { label: 'Vacinas',         icon: '💉', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  cachorro:    { label: 'Cachorro / Pet',  icon: '🐶', color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
  outros:      { label: 'Outros',          icon: '📦', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
}

function fmt(n: number) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

function getMes() {
  const now = new Date()
  return `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
}

function mesLabel(mes: string) {
  const [m, y] = mes.split('/')
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${months[parseInt(m) - 1]}/${y}`
}

function navMes(mes: string, dir: number) {
  const [m, y] = mes.split('/').map(Number)
  const d = new Date(y, m - 1 + dir, 1)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [previsoes, setPrevisoes] = useState<Previsao[]>([])
  const [orcamento, setOrcamento] = useState(0)
  const [mes, setMes] = useState(getMes())
  const [tab, setTab] = useState<'gastos' | 'previsoes' | 'visao'>('gastos')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // form
  const [desc, setDesc] = useState('')
  const [cat, setCat] = useState('casa')
  const [val, setVal] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10))
  const [filterCat, setFilterCat] = useState('todos')
  const [search, setSearch] = useState('')

  // modal orcamento
  const [showOrc, setShowOrc] = useState(false)
  const [orcInput, setOrcInput] = useState('')

  // previsao form
  const [pvDesc, setPvDesc] = useState('')
  const [pvCat, setPvCat] = useState('casa')
  const [pvVal, setPvVal] = useState('')
  const [pvData, setPvData] = useState('')
  const [pvRec, setPvRec] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const loadData = useCallback(async (m: string) => {
    setLoading(true)
    try {
      const [uRes, gRes, pRes, oRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/gastos?mes=${encodeURIComponent(m)}`),
        fetch('/api/previsoes'),
        fetch('/api/orcamento'),
      ])
      if (!uRes.ok) { setLoading(false); router.push('/login'); return }
      const u = await uRes.json()
      const g = gRes.ok ? await gRes.json() : []
      const p = pRes.ok ? await pRes.json() : []
      const o = oRes.ok ? await oRes.json() : {}
      setUser(u); setGastos(g); setPrevisoes(p); setOrcamento(o.orcamento || 0)
    } catch (e) {
      console.error('loadData error', e)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { loadData(mes) }, [mes, loadData])

  useEffect(() => {
    if (tab !== 'visao' || !canvasRef.current) return
    drawChart()
  }, [tab, gastos])

  function drawChart() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bycat: Record<string, number> = {}
    gastos.forEach(g => { bycat[g.cat] = (bycat[g.cat] || 0) + Number(g.val) })
    const entries = Object.entries(bycat).filter(([, v]) => v > 0)
    if (!entries.length) { ctx.clearRect(0, 0, canvas.width, canvas.height); return }

    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2, r = Math.min(cx, cy) - 20
    ctx.clearRect(0, 0, W, H)

    const total = entries.reduce((s, [, v]) => s + v, 0)
    let angle = -Math.PI / 2

    entries.forEach(([c, v]) => {
      const slice = (v / total) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, angle, angle + slice)
      ctx.fillStyle = CATS[c]?.color || '#64748b'
      ctx.fill()
      angle += slice
    })

    // center hole
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()

    // center text
    ctx.fillStyle = '#f1f5f9'
    ctx.font = 'bold 14px Inter, system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Total', cx, cy - 6)
    ctx.font = 'bold 13px Inter, system-ui'
    ctx.fillStyle = '#94a3b8'
    ctx.fillText(fmt(total), cx, cy + 12)
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function addGasto() {
    if (!desc || !val) return
    setSaving(true)
    await fetch('/api/gastos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao: desc, cat, val: parseFloat(val), data, mes }),
    })
    setDesc(''); setVal('')
    await loadData(mes)
    setSaving(false)
  }

  async function delGasto(id: number) {
    await fetch(`/api/gastos?id=${id}`, { method: 'DELETE' })
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  async function saveOrcamento() {
    const v = parseFloat(orcInput)
    if (isNaN(v)) return
    await fetch('/api/orcamento', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orcamento: v }) })
    setOrcamento(v); setShowOrc(false)
  }

  async function addPrevisao() {
    if (!pvDesc || !pvVal) return
    setSaving(true)
    await fetch('/api/previsoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao: pvDesc, cat: pvCat, val: parseFloat(pvVal), data_prevista: pvData || null, recorrente: pvRec }),
    })
    setPvDesc(''); setPvVal(''); setPvData(''); setPvRec(false)
    await loadData(mes)
    setSaving(false)
  }

  async function delPrevisao(id: number) {
    await fetch(`/api/previsoes?id=${id}`, { method: 'DELETE' })
    setPrevisoes(prev => prev.filter(p => p.id !== id))
  }

  function gerarPDF() {
    const lines: string[] = []
    lines.push(`RELATÓRIO DE GASTOS — ${mesLabel(mes)}`)
    lines.push(`Usuário: ${user?.name} | Gerado em: ${new Date().toLocaleDateString('pt-BR')}`)
    lines.push('')
    lines.push('RESUMO')
    lines.push(`Orçamento: ${fmt(orcamento)}`)
    lines.push(`Total Gasto: ${fmt(totalGasto)}`)
    lines.push(`Saldo: ${fmt(orcamento - totalGasto)}`)
    lines.push('')
    lines.push('CATEGORIAS')
    Object.entries(CATS).forEach(([k, c]) => {
      const v = gastos.filter(g => g.cat === k).reduce((s, g) => s + Number(g.val), 0)
      if (v > 0) lines.push(`  ${c.icon} ${c.label}: ${fmt(v)}`)
    })
    lines.push('')
    lines.push('LANÇAMENTOS')
    gastosFiltered.forEach(g => {
      lines.push(`  ${g.data || ''} | ${CATS[g.cat]?.icon || ''} ${CATS[g.cat]?.label || g.cat} | ${g.descricao} | ${fmt(Number(g.val))}`)
    })

    const content = lines.join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `relatorio-${mes.replace('/', '-')}.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  const totalGasto = gastos.reduce((s, g) => s + Number(g.val), 0)
  const totalPrevisoes = previsoes.reduce((s, p) => s + Number(p.val), 0)
  const saldo = orcamento - totalGasto
  const pct = orcamento > 0 ? Math.min((totalGasto / orcamento) * 100, 100) : 0

  const gastosFiltered = gastos.filter(g =>
    (filterCat === 'todos' || g.cat === filterCat) &&
    (!search || g.descricao.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#6366f1', fontSize: 18 }}>Carregando...</div>
    </div>
  )

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f172a; color: #f1f5f9; font-family: 'Inter', system-ui, sans-serif; }

        .header {
          background: rgba(15,23,42,0.95);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 50;
          padding: 0 24px;
        }
        .header-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .logo-box {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .logo-name { font-size: 16px; font-weight: 700; color: #f1f5f9; }
        .logo-sub { font-size: 11px; color: #475569; }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .user-chip {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 6px 12px;
        }
        .user-avatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff;
        }
        .user-name { font-size: 13px; font-weight: 500; color: #cbd5e1; }
        .btn-logout {
          padding: 7px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: #fca5a5; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit;
        }
        .btn-logout:hover { background: rgba(239,68,68,0.2); }

        .main { max-width: 1200px; margin: 0 auto; padding: 28px 24px; }

        /* month nav */
        .month-nav {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .month-label { font-size: 22px; font-weight: 700; color: #f1f5f9; }
        .month-btns { display: flex; gap: 8px; }
        .btn-nav {
          padding: 8px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #94a3b8; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit;
        }
        .btn-nav:hover { background: rgba(255,255,255,0.1); }

        /* summary cards */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .summary-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .summary-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--accent, #6366f1);
        }
        .summary-icon { font-size: 22px; margin-bottom: 12px; }
        .summary-label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #475569; font-weight: 600; margin-bottom: 6px; }
        .summary-value { font-size: 24px; font-weight: 800; color: #f1f5f9; }
        .summary-sub { font-size: 12px; color: #475569; margin-top: 4px; }

        /* orcamento bar */
        .orc-bar-wrap { margin-top: 8px; }
        .orc-bar-bg { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
        .orc-bar-fill { height: 100%; border-radius: 3px; transition: width .4s; background: var(--bar-color, #10b981); }

        /* tabs */
        .tabs-row {
          display: flex; gap: 4px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 4px;
          margin-bottom: 24px;
        }
        .tab-btn {
          flex: 1; padding: 10px 16px;
          border: none; border-radius: 10px;
          font-size: 14px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          transition: all .2s;
          background: transparent; color: #64748b;
        }
        .tab-btn.active {
          background: #6366f1; color: #fff;
          box-shadow: 0 4px 12px rgba(99,102,241,0.35);
        }

        /* panel */
        .panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }
        .panel-title { font-size: 15px; font-weight: 600; color: #cbd5e1; margin-bottom: 16px; }

        /* form row */
        .form-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .form-input {
          flex: 1; min-width: 120px;
          padding: 11px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #f1f5f9; font-size: 14px; font-family: inherit;
          outline: none;
        }
        .form-input:focus { border-color: #6366f1; background: rgba(99,102,241,0.08); }
        .form-input::placeholder { color: #334155; }
        .form-select {
          padding: 11px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #f1f5f9; font-size: 14px; font-family: inherit;
          outline: none; cursor: pointer;
        }
        .form-select option { background: #1e293b; }

        .btn-add {
          padding: 11px 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; border-radius: 10px;
          color: #fff; font-size: 14px; font-weight: 600; font-family: inherit;
          cursor: pointer; white-space: nowrap;
        }
        .btn-add:disabled { opacity: .6; cursor: not-allowed; }

        /* filter bar */
        .filter-bar {
          display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center;
        }
        .filter-chip {
          padding: 6px 14px;
          border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: #64748b;
          font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit;
        }
        .filter-chip.active { background: rgba(99,102,241,0.2); border-color: #6366f1; color: #a5b4fc; }
        .search-input {
          margin-left: auto; padding: 6px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; color: #f1f5f9; font-size: 13px; font-family: inherit;
          outline: none; min-width: 180px;
        }
        .search-input::placeholder { color: #334155; }

        /* table */
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th {
          text-align: left; padding: 10px 12px;
          font-size: 11px; text-transform: uppercase; letter-spacing: .06em;
          color: #475569; font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background .15s; }
        tbody tr:hover { background: rgba(255,255,255,0.03); }
        td { padding: 12px; font-size: 14px; color: #cbd5e1; }
        .cat-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;
        }
        .val-cell { font-weight: 700; color: #f1f5f9; }
        .del-btn {
          padding: 5px 10px; border-radius: 7px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5; font-size: 12px; cursor: pointer; font-family: inherit;
        }
        .del-btn:hover { background: rgba(239,68,68,0.2); }
        .empty-state {
          text-align: center; padding: 40px; color: #334155; font-size: 14px;
        }

        /* cat grid */
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
        .cat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 16px;
        }
        .cat-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .cat-card-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }
        .cat-card-label { font-size: 13px; font-weight: 600; color: #94a3b8; }
        .cat-card-val { font-size: 18px; font-weight: 800; color: #f1f5f9; }
        .cat-bar-bg { height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; margin-top: 8px; overflow: hidden; }
        .cat-bar-fill { height: 100%; border-radius: 2px; }

        /* modal */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center; z-index: 100;
          backdrop-filter: blur(4px);
        }
        .modal {
          background: #1e293b; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 32px; width: 100%; max-width: 380px;
        }
        .modal h3 { font-size: 18px; font-weight: 700; color: #f1f5f9; margin-bottom: 20px; }
        .modal-btns { display: flex; gap: 10px; margin-top: 20px; }
        .btn-cancel {
          flex: 1; padding: 11px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #64748b; font-size: 14px; font-family: inherit; cursor: pointer;
        }
        .btn-save {
          flex: 1; padding: 11px;
          background: #6366f1; border: none;
          border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer;
        }

        /* pdf btn */
        .btn-pdf {
          padding: 9px 18px;
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2);
          border-radius: 10px; color: #34d399; font-size: 13px; font-weight: 600; font-family: inherit;
          cursor: pointer; display: flex; align-items: center; gap: 6px;
        }
        .btn-pdf:hover { background: rgba(16,185,129,0.2); }

        /* orc btn */
        .btn-orc {
          padding: 9px 18px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          border-radius: 10px; color: #a5b4fc; font-size: 13px; font-weight: 600; font-family: inherit;
          cursor: pointer;
        }
        .btn-orc:hover { background: rgba(99,102,241,0.2); }

        .top-actions { display: flex; gap: 10px; margin-bottom: 24px; }

        /* chart area */
        .visao-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 700px) { .visao-grid { grid-template-columns: 1fr; } }
        .canvas-wrap { display: flex; align-items: center; justify-content: center; }

        /* trial banner */
        .trial-banner {
          background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
          border-radius: 12px; padding: 14px 20px; margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
          color: #fbbf24; font-size: 14px; font-weight: 500;
        }

        @media (max-width: 600px) {
          .summary-grid { grid-template-columns: 1fr 1fr; }
          .summary-value { font-size: 18px; }
          .form-row { flex-direction: column; }
          .main { padding: 16px; }
          .top-actions { flex-wrap: wrap; }
        }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="logo-box">🏠</div>
            <div>
              <div className="logo-name">Controle Casa</div>
              <div className="logo-sub">Gestão de Gastos Domésticos</div>
            </div>
          </div>
          <div className="header-right">
            <div className="user-chip">
              <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <span className="user-name">{user?.name}</span>
            </div>
            <button className="btn-logout" onClick={logout}>Sair</button>
          </div>
        </div>
      </header>

      <main className="main">
        {/* trial banner */}
        {user?.trialExpired && (
          <div className="trial-banner">
            ⚠ Seu período de trial expirou. Entre em contato para continuar usando.
          </div>
        )}

        {/* month nav */}
        <div className="month-nav">
          <div className="month-label">{mesLabel(mes)}</div>
          <div className="month-btns">
            <button className="btn-nav" onClick={() => setMes(m => navMes(m, -1))}>‹ Anterior</button>
            <button className="btn-nav" onClick={() => setMes(getMes())}>Hoje</button>
            <button className="btn-nav" onClick={() => setMes(m => navMes(m, 1))}>Próximo ›</button>
          </div>
        </div>

        {/* summary cards */}
        <div className="summary-grid">
          <div className="summary-card" style={{ '--accent': '#ef4444' } as React.CSSProperties}>
            <div className="summary-icon">💸</div>
            <div className="summary-label">Total Gasto</div>
            <div className="summary-value" style={{ color: totalGasto > orcamento && orcamento > 0 ? '#ef4444' : '#f1f5f9' }}>{fmt(totalGasto)}</div>
            <div className="summary-sub">{gastos.length} lançamento{gastos.length !== 1 ? 's' : ''} em {mesLabel(mes)}</div>
          </div>

          <div className="summary-card" style={{ '--accent': '#6366f1' } as React.CSSProperties}>
            <div className="summary-icon">🎯</div>
            <div className="summary-label">Orçamento</div>
            <div className="summary-value">{fmt(orcamento)}</div>
            {orcamento > 0 && (
              <div className="orc-bar-wrap">
                <div className="orc-bar-bg">
                  <div className="orc-bar-fill" style={{ width: `${pct}%`, '--bar-color': pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981' } as React.CSSProperties} />
                </div>
                <div className="summary-sub" style={{ marginTop: 6 }}>{pct.toFixed(0)}% utilizado</div>
              </div>
            )}
          </div>

          <div className="summary-card" style={{ '--accent': saldo < 0 ? '#ef4444' : '#10b981' } as React.CSSProperties}>
            <div className="summary-icon">{saldo >= 0 ? '✅' : '⚠'}</div>
            <div className="summary-label">Saldo Restante</div>
            <div className="summary-value" style={{ color: saldo < 0 ? '#ef4444' : '#10b981' }}>{fmt(saldo)}</div>
            <div className="summary-sub">{saldo >= 0 ? 'Dentro do orçamento' : 'Acima do orçamento'}</div>
          </div>

          <div className="summary-card" style={{ '--accent': '#f59e0b' } as React.CSSProperties}>
            <div className="summary-icon">📋</div>
            <div className="summary-label">Previsões</div>
            <div className="summary-value">{fmt(totalPrevisoes)}</div>
            <div className="summary-sub">{previsoes.length} item{previsoes.length !== 1 ? 's' : ''} previstos</div>
          </div>
        </div>

        {/* actions */}
        <div className="top-actions">
          <button className="btn-orc" onClick={() => { setOrcInput(String(orcamento)); setShowOrc(true) }}>
            🎯 Definir Orçamento
          </button>
          <button className="btn-pdf" onClick={gerarPDF}>
            📄 Exportar Relatório
          </button>
        </div>

        {/* tabs */}
        <div className="tabs-row">
          <button className={`tab-btn ${tab === 'gastos' ? 'active' : ''}`} onClick={() => setTab('gastos')}>
            💸 Gastos Realizados
          </button>
          <button className={`tab-btn ${tab === 'previsoes' ? 'active' : ''}`} onClick={() => setTab('previsoes')}>
            📋 Contas a Pagar
          </button>
          <button className={`tab-btn ${tab === 'visao' ? 'active' : ''}`} onClick={() => setTab('visao')}>
            📊 Visão Geral
          </button>
        </div>

        {/* GASTOS TAB */}
        {tab === 'gastos' && (
          <>
            {/* form */}
            <div className="panel">
              <div className="panel-title">+ Registrar Gasto</div>
              <div className="form-row">
                <input className="form-input" placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} style={{ flex: 2 }} />
                <select className="form-select" value={cat} onChange={e => setCat(e.target.value)}>
                  {Object.entries(CATS).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
                </select>
                <input className="form-input" type="number" placeholder="R$ 0,00" value={val} onChange={e => setVal(e.target.value)} style={{ maxWidth: 130 }} />
                <input className="form-input" type="date" value={data} onChange={e => setData(e.target.value)} style={{ maxWidth: 150 }} />
                <button className="btn-add" onClick={addGasto} disabled={saving || !desc || !val}>
                  {saving ? '...' : '+ Adicionar'}
                </button>
              </div>
            </div>

            {/* category summary */}
            <div className="cat-grid" style={{ marginBottom: 20 }}>
              {Object.entries(CATS).map(([k, c]) => {
                const v = gastos.filter(g => g.cat === k).reduce((s, g) => s + Number(g.val), 0)
                const p = totalGasto > 0 ? (v / totalGasto) * 100 : 0
                return (
                  <div key={k} className="cat-card" onClick={() => setFilterCat(f => f === k ? 'todos' : k)} style={{ cursor: 'pointer', border: filterCat === k ? `1px solid ${c.color}` : undefined }}>
                    <div className="cat-card-top">
                      <div className="cat-card-icon" style={{ background: c.bg }}>{c.icon}</div>
                      <div className="cat-card-label">{c.label}</div>
                    </div>
                    <div className="cat-card-val">{fmt(v)}</div>
                    <div className="cat-bar-bg">
                      <div className="cat-bar-fill" style={{ width: `${p}%`, background: c.color }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* list */}
            <div className="panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="panel-title" style={{ marginBottom: 0 }}>Lançamentos — {mesLabel(mes)}</div>
                <span style={{ fontSize: 12, color: '#475569' }}>{gastosFiltered.length} de {gastos.length}</span>
              </div>

              <div className="filter-bar">
                <button className={`filter-chip ${filterCat === 'todos' ? 'active' : ''}`} onClick={() => setFilterCat('todos')}>Todos</button>
                {Object.entries(CATS).map(([k, c]) => {
                  const count = gastos.filter(g => g.cat === k).length
                  if (!count) return null
                  return <button key={k} className={`filter-chip ${filterCat === k ? 'active' : ''}`} onClick={() => setFilterCat(f => f === k ? 'todos' : k)}>{c.icon} {c.label}</button>
                })}
                <input className="search-input" placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              {gastosFiltered.length === 0 ? (
                <div className="empty-state">📭 Nenhum gasto encontrado</div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Data</th>
                        <th>Valor</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {gastosFiltered.map(g => (
                        <tr key={g.id}>
                          <td>{g.descricao}</td>
                          <td>
                            <span className="cat-badge" style={{ background: CATS[g.cat]?.bg, color: CATS[g.cat]?.color }}>
                              {CATS[g.cat]?.icon} {CATS[g.cat]?.label || g.cat}
                            </span>
                          </td>
                          <td style={{ color: '#475569' }}>{g.data ? new Date(g.data + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                          <td className="val-cell">{fmt(Number(g.val))}</td>
                          <td><button className="del-btn" onClick={() => delGasto(g.id)}>✕</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* PREVISOES TAB */}
        {tab === 'previsoes' && (
          <>
            <div className="panel">
              <div className="panel-title">+ Adicionar Conta a Pagar</div>
              <div className="form-row">
                <input className="form-input" placeholder="Descrição" value={pvDesc} onChange={e => setPvDesc(e.target.value)} style={{ flex: 2 }} />
                <select className="form-select" value={pvCat} onChange={e => setPvCat(e.target.value)}>
                  {Object.entries(CATS).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
                </select>
                <input className="form-input" type="number" placeholder="R$ 0,00" value={pvVal} onChange={e => setPvVal(e.target.value)} style={{ maxWidth: 130 }} />
                <input className="form-input" type="date" value={pvData} onChange={e => setPvData(e.target.value)} style={{ maxWidth: 150 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={pvRec} onChange={e => setPvRec(e.target.checked)} />
                  Recorrente
                </label>
                <button className="btn-add" onClick={addPrevisao} disabled={saving || !pvDesc || !pvVal}>
                  {saving ? '...' : '+ Adicionar'}
                </button>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Contas Previstas — Total: {fmt(totalPrevisoes)}</div>
              {previsoes.length === 0 ? (
                <div className="empty-state">📭 Nenhuma previsão cadastrada</div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Vencimento</th>
                        <th>Recorrente</th>
                        <th>Valor</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {previsoes.map(p => {
                        const venc = p.data_prevista ? new Date(p.data_prevista + 'T00:00:00') : null
                        const atrasada = venc && venc < new Date()
                        return (
                          <tr key={p.id}>
                            <td>{p.descricao}</td>
                            <td>
                              <span className="cat-badge" style={{ background: CATS[p.cat]?.bg, color: CATS[p.cat]?.color }}>
                                {CATS[p.cat]?.icon} {CATS[p.cat]?.label || p.cat}
                              </span>
                            </td>
                            <td style={{ color: atrasada ? '#ef4444' : '#475569' }}>
                              {venc ? venc.toLocaleDateString('pt-BR') : '—'}
                              {atrasada && ' ⚠'}
                            </td>
                            <td style={{ color: p.recorrente ? '#10b981' : '#475569' }}>{p.recorrente ? 'Sim' : 'Não'}</td>
                            <td className="val-cell">{fmt(Number(p.val))}</td>
                            <td><button className="del-btn" onClick={() => delPrevisao(p.id)}>✕</button></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* VISÃO GERAL */}
        {tab === 'visao' && (
          <div className="visao-grid">
            <div className="panel">
              <div className="panel-title">📊 Por Categoria</div>
              <div className="canvas-wrap">
                <canvas ref={canvasRef} width={280} height={280} />
              </div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(CATS).map(([k, c]) => {
                  const v = gastos.filter(g => g.cat === k).reduce((s, g) => s + Number(g.val), 0)
                  if (!v) return null
                  return (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#94a3b8', flex: 1 }}>{c.icon} {c.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{fmt(v)}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">📈 Resumo do Mês</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Total Gasto', value: fmt(totalGasto), color: '#ef4444' },
                  { label: 'Orçamento', value: fmt(orcamento), color: '#6366f1' },
                  { label: 'Saldo', value: fmt(saldo), color: saldo >= 0 ? '#10b981' : '#ef4444' },
                  { label: 'Previsões', value: fmt(totalPrevisoes), color: '#f59e0b' },
                  { label: 'Categorias ativas', value: String(Object.keys(CATS).filter(k => gastos.some(g => g.cat === k)).length), color: '#8b5cf6' },
                  { label: 'Lançamentos', value: String(gastos.length), color: '#06b6d4' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#64748b', fontSize: 14 }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: 700, fontSize: 16 }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {orcamento > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>Utilização do Orçamento</div>
                  <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981', borderRadius: 5 }} />
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>{pct.toFixed(1)}% utilizado</div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* modal orcamento */}
      {showOrc && (
        <div className="modal-overlay" onClick={() => setShowOrc(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🎯 Definir Orçamento Mensal</h3>
            <input
              className="form-input" type="number" placeholder="Ex: 3000"
              value={orcInput} onChange={e => setOrcInput(e.target.value)}
              style={{ width: '100%' }}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && saveOrcamento()}
            />
            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setShowOrc(false)}>Cancelar</button>
              <button className="btn-save" onClick={saveOrcamento}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
