'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Gasto = { id: number; descricao: string; cat: string; val: number; data: string | null; mes: string | null }
type Previsao = { id: number; descricao: string; cat: string; val: number; data_prevista: string | null; recorrente: boolean }
type User = { id: number; name: string; email: string; trial_expires_at: string; paid: boolean; trialExpired: boolean }
type HistItem = { mes: string; total: number }

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
function getMes() { const d = new Date(); return `${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}` }
function mesLabel(mes: string) {
  const [m, y] = mes.split('/')
  return `${['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][parseInt(m)-1]}/${y}`
}
function navMes(mes: string, dir: number) {
  const [m, y] = mes.split('/').map(Number)
  const d = new Date(y, m - 1 + dir, 1)
  return `${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
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
  const [hist, setHist] = useState<HistItem[]>([])

  // gasto form
  const [desc, setDesc] = useState('')
  const [cat, setCat] = useState('casa')
  const [val, setVal] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().slice(0,10))
  const [filterCat, setFilterCat] = useState('todos')
  const [search, setSearch] = useState('')

  // edit gasto modal
  const [editGasto, setEditGasto] = useState<{ id: number; descricao: string; cat: string; val: string; data: string } | null>(null)

  // orcamento modal
  const [showOrc, setShowOrc] = useState(false)
  const [orcInput, setOrcInput] = useState('')

  // previsao form
  const [pvDesc, setPvDesc] = useState('')
  const [pvCat, setPvCat] = useState('casa')
  const [pvVal, setPvVal] = useState('')
  const [pvData, setPvData] = useState('')
  const [pvRec, setPvRec] = useState(false)

  const pieRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLCanvasElement>(null)
  const paretoRef = useRef<HTMLCanvasElement>(null)

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
      const [u, g, p, o] = await Promise.all([
        uRes.json(),
        gRes.ok ? gRes.json() : [],
        pRes.ok ? pRes.json() : [],
        oRes.ok ? oRes.json() : { orcamento: 0 },
      ])
      setUser(u); setGastos(g); setPrevisoes(p); setOrcamento(Number((o as { orcamento?: number | string }).orcamento) || 0)
    } catch { router.push('/login') }
    finally { setLoading(false) }
  }, [router])

  const loadHist = useCallback(async () => {
    const r = await fetch('/api/historico')
    if (r.ok) setHist(await r.json())
  }, [])

  useEffect(() => { loadData(mes) }, [mes, loadData])

  useEffect(() => {
    if (tab === 'visao') {
      drawPie()
      drawPareto()
      if (!hist.length) loadHist()
    }
  }, [tab, gastos])

  useEffect(() => {
    if (tab === 'visao' && hist.length) drawBar()
  }, [tab, hist])

  function drawPie() {
    const canvas = pieRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const bycat: Record<string, number> = {}
    gastos.forEach(g => { bycat[g.cat] = (bycat[g.cat] || 0) + Number(g.val) })
    const entries = Object.entries(bycat).filter(([, v]) => v > 0)
    const W = canvas.width, H = canvas.height
    const cx = W/2, cy = H/2, r = Math.min(cx,cy) - 24
    ctx.clearRect(0,0,W,H)
    if (!entries.length) { ctx.fillStyle='#334155'; ctx.font='13px Inter,system-ui'; ctx.textAlign='center'; ctx.fillText('Sem gastos', cx, cy); return }
    const total = entries.reduce((s,[,v])=>s+v,0)
    let angle = -Math.PI/2
    entries.forEach(([c,v]) => {
      const slice = (v/total)*Math.PI*2
      // shadow glow
      ctx.shadowColor = CATS[c]?.color || '#64748b'
      ctx.shadowBlur = 8
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,angle,angle+slice)
      ctx.fillStyle = CATS[c]?.color || '#64748b'; ctx.fill()
      ctx.shadowBlur = 0
      // percentage label on slice if large enough
      if (slice > 0.3) {
        const midAngle = angle + slice/2
        const lx = cx + Math.cos(midAngle) * r * 0.75
        const ly = cy + Math.sin(midAngle) * r * 0.75
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.font = 'bold 11px Inter,system-ui'
        ctx.textAlign = 'center'
        ctx.fillText(`${(v/total*100).toFixed(0)}%`, lx, ly+4)
      }
      angle += slice
    })
    // inner ring
    ctx.beginPath(); ctx.arc(cx,cy,r*0.54,0,Math.PI*2)
    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,r*0.54)
    grad.addColorStop(0,'#0f172a'); grad.addColorStop(1,'#1e293b')
    ctx.fillStyle = grad; ctx.fill()
    // center text
    ctx.fillStyle='#f1f5f9'; ctx.font='bold 13px Inter,system-ui'; ctx.textAlign='center'
    ctx.fillText('Total', cx, cy-7)
    ctx.font='bold 11px Inter,system-ui'; ctx.fillStyle='#94a3b8'
    ctx.fillText(fmt(total), cx, cy+10)
  }

  function drawPareto() {
    const canvas = paretoRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const bycat: Record<string, number> = {}
    gastos.forEach(g => { bycat[g.cat] = (bycat[g.cat] || 0) + Number(g.val) })
    const entries = Object.entries(bycat).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1])
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0,0,W,H)
    if (!entries.length) {
      ctx.fillStyle='#334155'; ctx.font='13px Inter,system-ui'; ctx.textAlign='center'
      ctx.fillText('Sem dados para o Pareto', W/2, H/2); return
    }
    const total = entries.reduce((s,[,v])=>s+v,0)
    const pad = { top:24, bottom:58, left:10, right:50 }
    const chartW = W - pad.left - pad.right
    const chartH = H - pad.top - pad.bottom
    const bw = chartW / entries.length
    const maxVal = entries[0][1]

    // grid lines (% axis right side)
    ;[0,25,50,75,100].forEach(pct => {
      const yy = pad.top + chartH*(1-pct/100)
      ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=1; ctx.setLineDash([])
      ctx.beginPath(); ctx.moveTo(pad.left,yy); ctx.lineTo(W-pad.right,yy); ctx.stroke()
      ctx.fillStyle='#475569'; ctx.font='9px Inter,system-ui'; ctx.textAlign='left'
      ctx.fillText(`${pct}%`, W-pad.right+4, yy+3)
    })

    // 80% dashed reference line
    const y80 = pad.top + chartH*0.2
    ctx.setLineDash([5,4]); ctx.strokeStyle='rgba(239,68,68,0.45)'; ctx.lineWidth=1
    ctx.beginPath(); ctx.moveTo(pad.left,y80); ctx.lineTo(W-pad.right,y80); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle='rgba(239,68,68,0.7)'; ctx.font='bold 9px Inter,system-ui'; ctx.textAlign='right'
    ctx.fillText('80%', W-pad.right-2, y80-3)

    // bars
    entries.forEach(([c,v],i) => {
      const bh = (v/maxVal)*chartH
      const x = pad.left + i*bw + 5
      const y = pad.top + chartH - bh
      const w = bw - 10
      const color = CATS[c]?.color || '#6366f1'
      const grad = ctx.createLinearGradient(0,y,0,pad.top+chartH)
      grad.addColorStop(0, color)
      grad.addColorStop(1, color+'44')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.roundRect(x,y,w,bh,[5,5,0,0]); ctx.fill()
      // value
      if (v > 0) {
        ctx.fillStyle='#94a3b8'; ctx.font='bold 9px Inter,system-ui'; ctx.textAlign='center'
        const vLabel = v >= 1000 ? `${(v/1000).toFixed(1)}k` : Math.round(v).toString()
        ctx.fillText(vLabel, x+w/2, y-5)
      }
      // icon + label
      ctx.font='14px Inter,system-ui'; ctx.fillStyle='#94a3b8'; ctx.textAlign='center'
      ctx.fillText(CATS[c]?.icon||'', x+w/2, H-pad.bottom+16)
      ctx.font='9px Inter,system-ui'; ctx.fillStyle='#475569'
      const lbl = (CATS[c]?.label||c); ctx.fillText(lbl.slice(0,7), x+w/2, H-pad.bottom+30)
    })

    // cumulative % line
    let cumPct = 0
    ctx.lineWidth=2; ctx.strokeStyle='#f59e0b'
    const pts: {x:number,y:number,pct:number}[] = []
    entries.forEach(([,v],i) => {
      cumPct += v/total*100
      const x = pad.left + i*bw + bw/2
      const y = pad.top + chartH*(1-cumPct/100)
      pts.push({x,y,pct:cumPct})
    })
    ctx.beginPath()
    pts.forEach((p,i) => { if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y) })
    ctx.stroke()
    pts.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fillStyle='#f59e0b'; ctx.fill()
      ctx.fillStyle='#fbbf24'; ctx.font='bold 10px Inter,system-ui'; ctx.textAlign='center'
      ctx.fillText(`${p.pct.toFixed(0)}%`, p.x, p.y-9)
    })
  }

  function drawBar() {
    const canvas = barRef.current
    if (!canvas || !hist.length) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0,0,W,H)
    const pad = { top: 20, bottom: 44, left: 12, right: 12 }
    const maxVal = Math.max(...hist.map(h=>h.total), 1)
    const bw = (W - pad.left - pad.right) / hist.length
    const gap = 8
    hist.forEach((h, i) => {
      const bh = ((h.total / maxVal) * (H - pad.top - pad.bottom)) || 0
      const x = pad.left + i * bw + gap/2
      const y = H - pad.bottom - bh
      const w = bw - gap
      // bar
      const grad = ctx.createLinearGradient(0, y, 0, H - pad.bottom)
      grad.addColorStop(0, '#6366f1')
      grad.addColorStop(1, 'rgba(99,102,241,0.3)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.roundRect(x, y, w, bh, [4, 4, 0, 0])
      ctx.fill()
      // label mes
      ctx.fillStyle = '#475569'; ctx.font = '10px Inter,system-ui'; ctx.textAlign = 'center'
      ctx.fillText(mesLabel(h.mes).split('/')[0], x + w/2, H - pad.bottom + 14)
      // value
      if (h.total > 0) {
        ctx.fillStyle = '#94a3b8'; ctx.font = '9px Inter,system-ui'
        const label = h.total >= 1000 ? `${(h.total/1000).toFixed(1)}k` : String(Math.round(h.total))
        ctx.fillText(label, x + w/2, y - 4)
      }
    })
    // current month highlight
    const curIdx = hist.findIndex(h => h.mes === mes)
    if (curIdx >= 0) {
      const x = pad.left + curIdx * bw + gap/2
      ctx.strokeStyle = '#a5b4fc'; ctx.lineWidth = 1.5
      const h = hist[curIdx]
      const bh = ((h.total / maxVal) * (H - pad.top - pad.bottom)) || 0
      const y = H - pad.bottom - bh
      ctx.strokeRect(x, y, bw - gap, bh)
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function addGasto() {
    if (!desc || !val) return
    setSaving(true)
    await fetch('/api/gastos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ descricao: desc, cat, val: parseFloat(val), data, mes }) })
    setDesc(''); setVal('')
    await loadData(mes)
    setSaving(false)
  }

  async function delGasto(id: number) {
    await fetch(`/api/gastos?id=${id}`, { method: 'DELETE' })
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  async function saveEditGasto() {
    if (!editGasto) return
    setSaving(true)
    await fetch('/api/gastos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editGasto.id, descricao: editGasto.descricao, cat: editGasto.cat, val: parseFloat(editGasto.val), data: editGasto.data }) })
    setEditGasto(null)
    await loadData(mes)
    setSaving(false)
  }

  async function saveOrcamento() {
    const v = parseFloat(orcInput.replace(',', '.'))
    if (isNaN(v) || v < 0) return
    try {
      const res = await fetch('/api/orcamento', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orcamento: v }) })
      const data = await res.json()
      if (res.ok) {
        setOrcamento(Number(data.orcamento) || v)
      } else {
        alert('Erro ao salvar orçamento: ' + (data.error || res.status))
        setOrcamento(v)
      }
    } catch (e) {
      alert('Erro de conexão: ' + e)
      setOrcamento(v)
    }
    setShowOrc(false)
  }

  async function addPrevisao() {
    if (!pvDesc || !pvVal) return
    setSaving(true)
    await fetch('/api/previsoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ descricao: pvDesc, cat: pvCat, val: parseFloat(pvVal), data_prevista: pvData || null, recorrente: pvRec }) })
    setPvDesc(''); setPvVal(''); setPvData(''); setPvRec(false)
    await loadData(mes)
    setSaving(false)
  }

  async function delPrevisao(id: number) {
    await fetch(`/api/previsoes?id=${id}`, { method: 'DELETE' })
    setPrevisoes(prev => prev.filter(p => p.id !== id))
  }

  async function pagarPrevisao(id: number) {
    await fetch('/api/previsoes/pagar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, mes }) })
    await loadData(mes)
  }

  function exportCSV() {
    const rows = [['Data','Categoria','Descrição','Valor']]
    gastosFiltered.forEach(g => {
      rows.push([g.data || '', CATS[g.cat]?.label || g.cat, g.descricao, String(Number(g.val))])
    })
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿'+csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `gastos-${mes.replace('/','-')}.csv`
    a.click()
  }

  function gerarPDF() {
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return
    const catRows = Object.entries(CATS).map(([k,c]) => {
      const v = gastos.filter(g=>g.cat===k).reduce((s,g)=>s+Number(g.val),0)
      if (!v) return ''
      const pct2 = totalGasto > 0 ? (v/totalGasto*100).toFixed(1) : '0'
      return `<tr><td>${c.icon} ${c.label}</td><td style="text-align:right;font-weight:700;color:#1e293b">${fmt(v)}</td><td style="text-align:right;color:#64748b">${pct2}%</td></tr>`
    }).join('')
    const gastoRows = gastosFiltered.map(g =>
      `<tr><td>${g.data ? new Date(g.data+'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td><td>${CATS[g.cat]?.icon||''} ${CATS[g.cat]?.label||g.cat}</td><td>${g.descricao}</td><td style="text-align:right;font-weight:700">${fmt(Number(g.val))}</td></tr>`
    ).join('')
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Relatório ${mesLabel(mes)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', Arial, sans-serif; color: #1e293b; background: #f8fafc; }
    .page { max-width: 820px; margin: 0 auto; padding: 48px 40px; background: #fff; min-height: 100vh; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 3px solid #6366f1; }
    .logo { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 44px; height: 44px; background: linear-gradient(135deg,#6366f1,#8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .logo-text h1 { font-size: 18px; font-weight: 800; color: #1e293b; }
    .logo-text p { font-size: 12px; color: #94a3b8; }
    .header-meta { text-align: right; font-size: 12px; color: #94a3b8; line-height: 1.6; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .summary-box { border-radius: 12px; padding: 20px; border-left: 4px solid; }
    .summary-box .lbl { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
    .summary-box .val { font-size: 22px; font-weight: 800; margin-top: 6px; }
    h2 { font-size: 15px; font-weight: 700; color: #374151; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 8px; }
    .section { margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #f8fafc; }
    th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; font-weight: 600; border-bottom: 2px solid #f1f5f9; }
    td { padding: 10px 12px; border-bottom: 1px solid #f8fafc; }
    tr:last-child td { border-bottom: none; }
    .print-btn { position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #6366f1; border: none; color: #fff; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
    @media print { .print-btn { display: none; } body { background: #fff; } .page { padding: 24px; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨 Imprimir / Salvar PDF</button>
  <div class="page">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">🏠</div>
        <div class="logo-text"><h1>Controle Casa</h1><p>Gestão de Gastos Domésticos</p></div>
      </div>
      <div class="header-meta">
        <div>${mesLabel(mes)}</div>
        <div>Usuário: ${user?.name}</div>
        <div>Gerado em ${new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})}</div>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-box" style="background:#fef2f2;border-color:#ef4444">
        <div class="lbl">Total Gasto</div>
        <div class="val" style="color:#ef4444">${fmt(totalGasto)}</div>
      </div>
      <div class="summary-box" style="background:#f0f9ff;border-color:#6366f1">
        <div class="lbl">Orçamento</div>
        <div class="val" style="color:#6366f1">${fmt(orcamento)}</div>
      </div>
      <div class="summary-box" style="background:${saldo>=0?'#f0fdf4':'#fef2f2'};border-color:${saldo>=0?'#10b981':'#ef4444'}">
        <div class="lbl">Saldo</div>
        <div class="val" style="color:${saldo>=0?'#10b981':'#ef4444'}">${fmt(saldo)}</div>
      </div>
    </div>

    <div class="section">
      <h2>📊 Por Categoria</h2>
      <table>
        <thead><tr><th>Categoria</th><th style="text-align:right">Valor</th><th style="text-align:right">%</th></tr></thead>
        <tbody>${catRows}</tbody>
      </table>
    </div>

    <div class="section">
      <h2>📋 Lançamentos — ${gastosFiltered.length} item${gastosFiltered.length!==1?'s':''}</h2>
      <table>
        <thead><tr><th>Data</th><th>Categoria</th><th>Descrição</th><th style="text-align:right">Valor</th></tr></thead>
        <tbody>${gastoRows}</tbody>
      </table>
    </div>
  </div>
</body>
</html>`
    win.document.write(html)
    win.document.close()
  }

  const totalGasto = gastos.reduce((s,g) => s + Number(g.val), 0)
  const totalPrevisoes = previsoes.reduce((s,p) => s + Number(p.val), 0)
  const saldo = orcamento - totalGasto
  const saldoProjetado = saldo - totalPrevisoes
  const pct = orcamento > 0 ? Math.min((totalGasto / orcamento) * 100, 100) : 0
  const overBudget = orcamento > 0 && totalGasto > orcamento

  const gastosFiltered = gastos.filter(g =>
    (filterCat === 'todos' || g.cat === filterCat) &&
    (!search || g.descricao.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .skeleton { background: linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%); background-size: 800px 100%; animation: shimmer 1.5s infinite; border-radius: 10px; }
      `}</style>
      <div style={{ background:'rgba(15,23,42,0.95)', borderBottom:'1px solid rgba(255,255,255,0.06)', height:64 }} />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:24 }}>
          {[0,1,2,3,4].map(i => <div key={i} style={{ height:110, borderRadius:16, overflow:'hidden' }}><div className="skeleton" style={{ height:'100%' }} /></div>)}
        </div>
        <div style={{ height:56, borderRadius:14, overflow:'hidden', marginBottom:24 }}><div className="skeleton" style={{ height:'100%' }} /></div>
        <div style={{ height:300, borderRadius:16, overflow:'hidden' }}><div className="skeleton" style={{ height:'100%' }} /></div>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f172a; color: #f1f5f9; font-family: 'Inter', system-ui, sans-serif; }

        .header { background: rgba(15,23,42,0.95); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 50; padding: 0 24px; }
        .header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .logo-box { width: 38px; height: 38px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .logo-name { font-size: 16px; font-weight: 700; color: #f1f5f9; }
        .logo-sub { font-size: 11px; color: #475569; }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .user-chip { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px 12px; }
        .user-avatar { width: 28px; height: 28px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; }
        .user-name { font-size: 13px; font-weight: 500; color: #cbd5e1; }
        .btn-logout { padding: 7px 14px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: #fca5a5; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; }
        .btn-logout:hover { background: rgba(239,68,68,0.2); }

        .main { max-width: 1200px; margin: 0 auto; padding: 28px 24px; }

        .month-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .month-label { font-size: 22px; font-weight: 700; color: #f1f5f9; }
        .month-btns { display: flex; gap: 8px; }
        .btn-nav { padding: 8px 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #94a3b8; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; }
        .btn-nav:hover { background: rgba(255,255,255,0.1); }

        /* over-budget banner */
        .over-budget-banner { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 12px; padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; color: #fca5a5; font-size: 14px; font-weight: 600; }

        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .summary-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; position: relative; overflow: hidden; }
        .summary-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent, #6366f1); }
        .summary-icon { font-size: 22px; margin-bottom: 12px; }
        .summary-label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #475569; font-weight: 600; margin-bottom: 6px; }
        .summary-value { font-size: 22px; font-weight: 800; color: #f1f5f9; }
        .summary-sub { font-size: 12px; color: #475569; margin-top: 4px; }
        .orc-bar-wrap { margin-top: 8px; }
        .orc-bar-bg { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
        .orc-bar-fill { height: 100%; border-radius: 3px; transition: width .4s; background: var(--bar-color, #10b981); }

        .tabs-row { display: flex; gap: 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 4px; margin-bottom: 24px; }
        .tab-btn { flex: 1; padding: 10px 16px; border: none; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .2s; background: transparent; color: #64748b; }
        .tab-btn.active { background: #6366f1; color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.35); }

        .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
        .panel-title { font-size: 15px; font-weight: 600; color: #cbd5e1; margin-bottom: 16px; }

        .form-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .form-input { flex: 1; min-width: 120px; padding: 11px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #f1f5f9; font-size: 14px; font-family: inherit; outline: none; }
        .form-input:focus { border-color: #6366f1; background: rgba(99,102,241,0.08); }
        .form-input::placeholder { color: #334155; }
        .form-select { padding: 11px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #f1f5f9; font-size: 14px; font-family: inherit; outline: none; cursor: pointer; }
        .form-select option { background: #1e293b; }

        .btn-add { padding: 11px 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer; white-space: nowrap; }
        .btn-add:disabled { opacity: .6; cursor: not-allowed; }

        .filter-bar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .filter-chip { padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #64748b; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; }
        .filter-chip.active { background: rgba(99,102,241,0.2); border-color: #6366f1; color: #a5b4fc; }
        .search-input { margin-left: auto; padding: 6px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: #f1f5f9; font-size: 13px; font-family: inherit; outline: none; min-width: 180px; }
        .search-input::placeholder { color: #334155; }

        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #475569; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.06); }
        tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background .15s; }
        tbody tr:hover { background: rgba(255,255,255,0.03); }
        td { padding: 12px; font-size: 14px; color: #cbd5e1; }
        .cat-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .val-cell { font-weight: 700; color: #f1f5f9; }
        .del-btn { padding: 5px 10px; border-radius: 7px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; font-size: 12px; cursor: pointer; font-family: inherit; }
        .del-btn:hover { background: rgba(239,68,68,0.2); }
        .edit-btn { padding: 5px 10px; border-radius: 7px; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #a5b4fc; font-size: 12px; cursor: pointer; font-family: inherit; margin-right: 6px; }
        .edit-btn:hover { background: rgba(99,102,241,0.2); }
        .pagar-btn { padding: 5px 10px; border-radius: 7px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); color: #34d399; font-size: 12px; cursor: pointer; font-family: inherit; margin-right: 6px; white-space: nowrap; }
        .pagar-btn:hover { background: rgba(16,185,129,0.2); }
        .empty-state { text-align: center; padding: 40px; color: #334155; font-size: 14px; }

        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; }
        .cat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 16px; cursor: pointer; }
        .cat-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .cat-card-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .cat-card-label { font-size: 13px; font-weight: 600; color: #94a3b8; }
        .cat-card-val { font-size: 18px; font-weight: 800; color: #f1f5f9; }
        .cat-bar-bg { height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; margin-top: 8px; overflow: hidden; }
        .cat-bar-fill { height: 100%; border-radius: 2px; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
        .modal { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; width: 100%; max-width: 400px; }
        .modal h3 { font-size: 18px; font-weight: 700; color: #f1f5f9; margin-bottom: 20px; }
        .modal-btns { display: flex; gap: 10px; margin-top: 20px; }
        .btn-cancel { flex: 1; padding: 11px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #64748b; font-size: 14px; font-family: inherit; cursor: pointer; }
        .btn-save { flex: 1; padding: 11px; background: #6366f1; border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer; }

        .top-actions { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
        .btn-pdf { padding: 9px 18px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 10px; color: #34d399; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .btn-pdf:hover { background: rgba(16,185,129,0.2); }
        .btn-csv { padding: 9px 18px; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.2); border-radius: 10px; color: #22d3ee; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
        .btn-csv:hover { background: rgba(6,182,212,0.2); }
        .btn-orc { padding: 9px 18px; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 10px; color: #a5b4fc; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
        .btn-orc:hover { background: rgba(99,102,241,0.2); }

        .visao-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 700px) { .visao-grid { grid-template-columns: 1fr; } }
        .canvas-wrap { display: flex; align-items: center; justify-content: center; }

        .trial-banner { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); border-radius: 12px; padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; color: #fbbf24; font-size: 14px; font-weight: 500; }

        @media (max-width: 600px) {
          .summary-grid { grid-template-columns: 1fr 1fr; }
          .summary-value { font-size: 17px; }
          .form-row { flex-direction: column; }
          .main { padding: 16px; }
          .top-actions { flex-wrap: wrap; }
          .user-name { display: none; }
          .month-btns { gap: 4px; }
          .btn-nav { padding: 8px 10px; font-size: 12px; }
        }
      `}</style>

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
        {user?.trialExpired && (
          <div className="trial-banner">⚠ Seu período de trial expirou. Entre em contato para continuar usando.</div>
        )}

        {overBudget && (
          <div className="over-budget-banner">
            🚨 Atenção! Você ultrapassou o orçamento em {fmt(totalGasto - orcamento)}. Revise seus gastos.
          </div>
        )}

        {/* month nav */}
        <div className="month-nav">
          <div className="month-label">{mesLabel(mes)}</div>
          <div className="month-btns">
            <button className="btn-nav" onClick={() => setMes(m => navMes(m,-1))}>‹ Anterior</button>
            <button className="btn-nav" onClick={() => setMes(getMes())}>Hoje</button>
            <button className="btn-nav" onClick={() => setMes(m => navMes(m,1))}>Próximo ›</button>
          </div>
        </div>

        {/* summary cards */}
        <div className="summary-grid">
          <div className="summary-card" style={{ '--accent': '#ef4444' } as React.CSSProperties}>
            <div className="summary-icon">💸</div>
            <div className="summary-label">Total Gasto</div>
            <div className="summary-value" style={{ color: overBudget ? '#ef4444' : '#f1f5f9' }}>{fmt(totalGasto)}</div>
            <div className="summary-sub">{gastos.length} lançamento{gastos.length !== 1 ? 's' : ''} em {mesLabel(mes)}</div>
          </div>

          <div className="summary-card" style={{ '--accent': '#6366f1' } as React.CSSProperties}>
            <div className="summary-icon">🎯</div>
            <div className="summary-label">Orçamento</div>
            <div className="summary-value">{fmt(orcamento)}</div>
            {orcamento > 0 && (
              <div className="orc-bar-wrap">
                <div className="orc-bar-bg">
                  <div className="orc-bar-fill" style={{ width:`${pct}%`, '--bar-color': pct > 100 ? '#ef4444' : pct > 80 ? '#f59e0b' : '#10b981' } as React.CSSProperties} />
                </div>
                <div className="summary-sub" style={{ marginTop:6 }}>{pct.toFixed(0)}% utilizado</div>
              </div>
            )}
          </div>

          <div className="summary-card" style={{ '--accent': saldo < 0 ? '#ef4444' : '#10b981' } as React.CSSProperties}>
            <div className="summary-icon">{saldo >= 0 ? '✅' : '⚠'}</div>
            <div className="summary-label">Saldo Restante</div>
            <div className="summary-value" style={{ color: saldo < 0 ? '#ef4444' : '#10b981' }}>{fmt(saldo)}</div>
            <div className="summary-sub">{saldo >= 0 ? 'Dentro do orçamento' : 'Acima do orçamento'}</div>
          </div>

          <div className="summary-card" style={{ '--accent': saldoProjetado < 0 ? '#ef4444' : '#f59e0b' } as React.CSSProperties}>
            <div className="summary-icon">🔮</div>
            <div className="summary-label">Saldo Projetado</div>
            <div className="summary-value" style={{ color: saldoProjetado < 0 ? '#ef4444' : '#f59e0b' }}>{fmt(saldoProjetado)}</div>
            <div className="summary-sub">Após pagar {previsoes.length} conta{previsoes.length !== 1?'s':''} previstas</div>
          </div>

          <div className="summary-card" style={{ '--accent': '#8b5cf6' } as React.CSSProperties}>
            <div className="summary-icon">📋</div>
            <div className="summary-label">Contas a Pagar</div>
            <div className="summary-value">{fmt(totalPrevisoes)}</div>
            <div className="summary-sub">{previsoes.length} item{previsoes.length !== 1 ? 's' : ''} previstos</div>
          </div>
        </div>

        {/* actions */}
        <div className="top-actions">
          <button className="btn-orc" onClick={() => { setOrcInput(String(orcamento)); setShowOrc(true) }}>🎯 Orçamento</button>
          <button className="btn-pdf" onClick={gerarPDF}>📄 Exportar PDF</button>
          <button className="btn-csv" onClick={exportCSV}>📊 Exportar CSV</button>
        </div>

        {/* tabs */}
        <div className="tabs-row">
          <button className={`tab-btn ${tab === 'gastos' ? 'active' : ''}`} onClick={() => setTab('gastos')}>💸 Gastos</button>
          <button className={`tab-btn ${tab === 'previsoes' ? 'active' : ''}`} onClick={() => setTab('previsoes')}>📋 Contas a Pagar</button>
          <button className={`tab-btn ${tab === 'visao' ? 'active' : ''}`} onClick={() => setTab('visao')}>📊 Visão Geral</button>
        </div>

        {/* ── GASTOS ── */}
        {tab === 'gastos' && (
          <>
            <div className="panel">
              <div className="panel-title">+ Registrar Gasto</div>
              <div className="form-row">
                <input className="form-input" placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} style={{ flex:2 }} />
                <select className="form-select" value={cat} onChange={e => setCat(e.target.value)}>
                  {Object.entries(CATS).map(([k,c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
                </select>
                <input className="form-input" type="number" placeholder="R$ 0,00" value={val} onChange={e => setVal(e.target.value)} style={{ maxWidth:130 }} />
                <input className="form-input" type="date" value={data} onChange={e => setData(e.target.value)} style={{ maxWidth:150 }} />
                <button className="btn-add" onClick={addGasto} disabled={saving || !desc || !val}>{saving ? '...' : '+ Adicionar'}</button>
              </div>
            </div>

            <div className="cat-grid" style={{ marginBottom:20 }}>
              {Object.entries(CATS).map(([k,c]) => {
                const v = gastos.filter(g=>g.cat===k).reduce((s,g)=>s+Number(g.val),0)
                const p = totalGasto > 0 ? (v/totalGasto)*100 : 0
                return (
                  <div key={k} className="cat-card" onClick={() => setFilterCat(f => f===k?'todos':k)} style={{ border: filterCat===k ? `1px solid ${c.color}` : undefined }}>
                    <div className="cat-card-top">
                      <div className="cat-card-icon" style={{ background:c.bg }}>{c.icon}</div>
                      <div className="cat-card-label">{c.label}</div>
                    </div>
                    <div className="cat-card-val">{fmt(v)}</div>
                    <div className="cat-bar-bg"><div className="cat-bar-fill" style={{ width:`${p}%`, background:c.color }} /></div>
                  </div>
                )
              })}
            </div>

            <div className="panel">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div className="panel-title" style={{ marginBottom:0 }}>Lançamentos — {mesLabel(mes)}</div>
                <span style={{ fontSize:12, color:'#475569' }}>{gastosFiltered.length} de {gastos.length}</span>
              </div>
              <div className="filter-bar">
                <button className={`filter-chip ${filterCat==='todos'?'active':''}`} onClick={() => setFilterCat('todos')}>Todos</button>
                {Object.entries(CATS).map(([k,c]) => {
                  const count = gastos.filter(g=>g.cat===k).length
                  if (!count) return null
                  return <button key={k} className={`filter-chip ${filterCat===k?'active':''}`} onClick={() => setFilterCat(f=>f===k?'todos':k)}>{c.icon} {c.label}</button>
                })}
                <input className="search-input" placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {gastosFiltered.length === 0 ? (
                <div className="empty-state">📭 Nenhum gasto encontrado</div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Descrição</th><th>Categoria</th><th>Data</th><th>Valor</th><th></th></tr></thead>
                    <tbody>
                      {gastosFiltered.map(g => (
                        <tr key={g.id}>
                          <td>{g.descricao}</td>
                          <td><span className="cat-badge" style={{ background:CATS[g.cat]?.bg, color:CATS[g.cat]?.color }}>{CATS[g.cat]?.icon} {CATS[g.cat]?.label||g.cat}</span></td>
                          <td style={{ color:'#475569' }}>{g.data ? new Date(g.data+'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                          <td className="val-cell">{fmt(Number(g.val))}</td>
                          <td style={{ whiteSpace:'nowrap' }}>
                            <button className="edit-btn" onClick={() => setEditGasto({ id:g.id, descricao:g.descricao, cat:g.cat, val:String(g.val), data:g.data||'' })}>✏</button>
                            <button className="del-btn" onClick={() => delGasto(g.id)}>✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── PREVISOES ── */}
        {tab === 'previsoes' && (
          <>
            <div className="panel">
              <div className="panel-title">+ Adicionar Conta a Pagar</div>
              <div className="form-row">
                <input className="form-input" placeholder="Descrição" value={pvDesc} onChange={e => setPvDesc(e.target.value)} style={{ flex:2 }} />
                <select className="form-select" value={pvCat} onChange={e => setPvCat(e.target.value)}>
                  {Object.entries(CATS).map(([k,c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
                </select>
                <input className="form-input" type="number" placeholder="R$ 0,00" value={pvVal} onChange={e => setPvVal(e.target.value)} style={{ maxWidth:130 }} />
                <input className="form-input" type="date" value={pvData} onChange={e => setPvData(e.target.value)} style={{ maxWidth:150 }} />
                <label style={{ display:'flex', alignItems:'center', gap:6, color:'#94a3b8', fontSize:13, cursor:'pointer', whiteSpace:'nowrap' }}>
                  <input type="checkbox" checked={pvRec} onChange={e => setPvRec(e.target.checked)} /> Recorrente
                </label>
                <button className="btn-add" onClick={addPrevisao} disabled={saving || !pvDesc || !pvVal}>{saving ? '...' : '+ Adicionar'}</button>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Contas Previstas — Total: {fmt(totalPrevisoes)}</div>
              {previsoes.length === 0 ? (
                <div className="empty-state">📭 Nenhuma previsão cadastrada</div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Descrição</th><th>Categoria</th><th>Vencimento</th><th>Recorrente</th><th>Valor</th><th></th></tr></thead>
                    <tbody>
                      {previsoes.map(p => {
                        const venc = p.data_prevista ? new Date(p.data_prevista+'T00:00:00') : null
                        const atrasada = venc && venc < new Date()
                        return (
                          <tr key={p.id}>
                            <td>{p.descricao}</td>
                            <td><span className="cat-badge" style={{ background:CATS[p.cat]?.bg, color:CATS[p.cat]?.color }}>{CATS[p.cat]?.icon} {CATS[p.cat]?.label||p.cat}</span></td>
                            <td style={{ color: atrasada ? '#ef4444' : '#475569' }}>
                              {venc ? venc.toLocaleDateString('pt-BR') : '—'}{atrasada && ' ⚠'}
                            </td>
                            <td>
                              <span style={{ color: p.recorrente ? '#10b981' : '#475569', fontSize:12 }}>
                                {p.recorrente ? '🔄 Sim' : 'Não'}
                              </span>
                            </td>
                            <td className="val-cell">{fmt(Number(p.val))}</td>
                            <td style={{ whiteSpace:'nowrap' }}>
                              <button className="pagar-btn" onClick={() => pagarPrevisao(p.id)}>✓ Pagar</button>
                              <button className="del-btn" onClick={() => delPrevisao(p.id)}>✕</button>
                            </td>
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

        {/* ── VISÃO GERAL ── */}
        {tab === 'visao' && (
          <>
            <div className="visao-grid">
              <div className="panel">
                <div className="panel-title">🍩 Por Categoria</div>
                <div className="canvas-wrap"><canvas ref={pieRef} width={260} height={260} /></div>
                <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:8 }}>
                  {Object.entries(CATS).map(([k,c]) => {
                    const v = gastos.filter(g=>g.cat===k).reduce((s,g)=>s+Number(g.val),0)
                    if (!v) return null
                    const pct2 = totalGasto > 0 ? (v/totalGasto*100).toFixed(1) : '0'
                    return (
                      <div key={k} style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:10, height:10, borderRadius:2, background:c.color, flexShrink:0 }} />
                        <span style={{ fontSize:12, color:'#94a3b8', flex:1 }}>{c.icon} {c.label}</span>
                        <span style={{ fontSize:11, color:'#475569' }}>{pct2}%</span>
                        <span style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>{fmt(v)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">📈 Resumo do Mês</div>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {[
                    { label:'Total Gasto', value:fmt(totalGasto), color:'#ef4444' },
                    { label:'Orçamento', value:fmt(orcamento), color:'#6366f1' },
                    { label:'Saldo Restante', value:fmt(saldo), color: saldo>=0?'#10b981':'#ef4444' },
                    { label:'Saldo Projetado', value:fmt(saldoProjetado), color: saldoProjetado>=0?'#f59e0b':'#ef4444' },
                    { label:'Contas Previstas', value:fmt(totalPrevisoes), color:'#8b5cf6' },
                    { label:'Categorias ativas', value:String(Object.keys(CATS).filter(k=>gastos.some(g=>g.cat===k)).length), color:'#06b6d4' },
                    { label:'Lançamentos', value:String(gastos.length), color:'#94a3b8' },
                  ].map(row => (
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color:'#64748b', fontSize:14 }}>{row.label}</span>
                      <span style={{ color:row.color, fontWeight:700, fontSize:15 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                {orcamento > 0 && (
                  <div style={{ marginTop:20 }}>
                    <div style={{ fontSize:12, color:'#475569', marginBottom:8 }}>Utilização do Orçamento</div>
                    <div style={{ height:10, background:'rgba(255,255,255,0.08)', borderRadius:5, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background: pct>100?'#ef4444':pct>80?'#f59e0b':'#10b981', borderRadius:5, transition:'width .5s' }} />
                    </div>
                    <div style={{ fontSize:13, color:'#94a3b8', marginTop:6 }}>{pct.toFixed(1)}% utilizado</div>
                  </div>
                )}
              </div>
            </div>

            {/* pareto chart */}
            <div className="panel">
              <div className="panel-title">📊 Gráfico de Pareto — Por Categoria</div>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
                <canvas ref={paretoRef} width={640} height={240} style={{ maxWidth:'100%' }} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:11, color:'#475569', flexWrap:'wrap', justifyContent:'center' }}>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:12, height:3, background:'#f59e0b', display:'inline-block', borderRadius:2 }} />Linha acumulada</span>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:12, height:2, borderTop:'2px dashed rgba(239,68,68,0.5)', display:'inline-block' }} />80% referência</span>
                <span style={{ color:'#64748b' }}>Barras ordenadas por valor decrescente</span>
              </div>
            </div>

            {/* bar chart - 6 months */}
            <div className="panel">
              <div className="panel-title">📈 Histórico — Últimos 6 Meses</div>
              {hist.length === 0 ? (
                <div className="empty-state">Carregando histórico...</div>
              ) : (
                <>
                  <div style={{ display:'flex', justifyContent:'center' }}>
                    <canvas ref={barRef} width={600} height={200} style={{ maxWidth:'100%' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:12, flexWrap:'wrap' }}>
                    {hist.map(h => (
                      <div key={h.mes} style={{ textAlign:'center' }}>
                        <div style={{ fontSize:11, color: h.mes===mes?'#a5b4fc':'#475569', fontWeight: h.mes===mes?700:400 }}>{mesLabel(h.mes)}</div>
                        <div style={{ fontSize:13, fontWeight:700, color: h.mes===mes?'#f1f5f9':'#64748b' }}>{fmt(h.total)}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>

      {/* modal orçamento */}
      {showOrc && (
        <div className="modal-overlay" onClick={() => setShowOrc(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🎯 Definir Orçamento Mensal</h3>
            <input className="form-input" type="number" placeholder="Ex: 3000" value={orcInput} onChange={e => setOrcInput(e.target.value)} style={{ width:'100%' }} autoFocus onKeyDown={e => e.key==='Enter' && saveOrcamento()} />
            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setShowOrc(false)}>Cancelar</button>
              <button className="btn-save" onClick={saveOrcamento}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* modal editar gasto */}
      {editGasto && (
        <div className="modal-overlay" onClick={() => setEditGasto(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>✏️ Editar Gasto</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <input className="form-input" placeholder="Descrição" value={editGasto.descricao} onChange={e => setEditGasto(g => g ? {...g, descricao:e.target.value} : g)} style={{ width:'100%' }} />
              <select className="form-select" value={editGasto.cat} onChange={e => setEditGasto(g => g ? {...g, cat:e.target.value} : g)} style={{ width:'100%' }}>
                {Object.entries(CATS).map(([k,c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
              </select>
              <input className="form-input" type="number" placeholder="Valor" value={editGasto.val} onChange={e => setEditGasto(g => g ? {...g, val:e.target.value} : g)} style={{ width:'100%' }} />
              <input className="form-input" type="date" value={editGasto.data} onChange={e => setEditGasto(g => g ? {...g, data:e.target.value} : g)} style={{ width:'100%' }} />
            </div>
            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setEditGasto(null)}>Cancelar</button>
              <button className="btn-save" onClick={saveEditGasto} disabled={saving}>{saving ? '...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
