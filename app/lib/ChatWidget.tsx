'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME = 'Olá! Sou o **Resolve**, seu assistente inteligente 🤖\n\nMe diga: qual profissional ou serviço você está procurando? (Ex: "preciso de um encanador em Santo André")';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json() as { message?: string };
      setMessages([...next, { role: 'assistant', content: data.message || 'Erro ao responder.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Ops, algo deu errado. Tente novamente!' }]);
    } finally {
      setLoading(false);
    }
  }

  function renderText(text: string) {
    // Basic markdown: bold, line breaks
    return text
      .split('\n')
      .map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        return <span key={i}>{parts}{i < text.split('\n').length - 1 && <br />}</span>;
      });
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(37,99,235,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        title="Falar com Resolve"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#ef4444', color: '#fff', borderRadius: '50%',
            width: 20, height: 20, fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff',
          }}>{unread}</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 100, right: 28, zIndex: 9998,
          width: 'min(380px, calc(100vw - 32px))',
          height: 'min(520px, calc(100vh - 140px))',
          background: '#fff', borderRadius: 20,
          boxShadow: '0 8px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', border: '1px solid #e5e7eb',
          animation: 'chatFadeIn .2s ease',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#1d4ed8,#2563eb)',
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>🤖</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Resolve</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
                Online agora · IA do ABCResolve
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginRight: 6, flexShrink: 0, alignSelf: 'flex-end' }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 16,
                  borderBottomLeftRadius: m.role === 'assistant' ? 4 : 16,
                  borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                  background: m.role === 'user' ? '#2563eb' : '#f3f4f6',
                  color: m.role === 'user' ? '#fff' : '#111',
                  fontSize: 14, lineHeight: 1.55,
                }}>
                  {renderText(m.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                <div style={{ background: '#f3f4f6', borderRadius: 16, borderBottomLeftRadius: 4, padding: '10px 14px' }}>
                  <span style={{ display: 'inline-flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{
                        width: 7, height: 7, background: '#9ca3af', borderRadius: '50%',
                        animation: `bounce .9s ${i * 0.2}s infinite`,
                        display: 'inline-block',
                      }}></span>
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Encanador urgente', 'Eletricista', 'Advogado', 'Personal trainer'].map(s => (
                <button key={s} onClick={() => { setInput(s); setTimeout(() => send(), 0); }}
                  style={{
                    background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8',
                    borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Digite sua mensagem..."
              style={{
                flex: 1, border: '1.5px solid #e5e7eb', borderRadius: 12,
                padding: '10px 14px', fontSize: 14, outline: 'none',
                background: '#fafafa',
              }}
              onFocus={e => (e.target.style.borderColor = '#93c5fd')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 42, height: 42, borderRadius: 12, border: 'none',
                background: input.trim() && !loading ? '#2563eb' : '#e5e7eb',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s', flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? '#fff' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatFadeIn { from { opacity:0; transform:translateY(16px) scale(.97); } to { opacity:1; transform:none; } }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-6px); } }
      `}</style>
    </>
  );
}
