import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnv } from '@/lib/db';
import { verifyAdminToken, TOKEN_NAME } from '@/lib/auth';
import { sendTelegram } from '@/lib/telegram';

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(TOKEN_NAME)?.value;
  if (!token) return false;
  const env = await getEnv();
  return verifyAdminToken(token, env.ADMIN_SECRET);
}

// Calcula próximo vencimento preservando o dia do mês do primeiro pagamento
function nextExpiresAt(currentExpiresAt: string | null, paidAt: string | null): string {
  // Se já tem expires_at (renovação), avança 1 mês a partir dele
  // Se não tem (primeiro pagamento), avança 1 mês a partir de agora
  const base = currentExpiresAt ? new Date(currentExpiresAt) : new Date();
  const paymentDay = paidAt ? new Date(paidAt).getDate() : base.getDate();

  const next = new Date(base);
  next.setMonth(next.getMonth() + 1);

  // Preserva o dia original do pagamento (ex: dia 15 → sempre vence no 15)
  const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(paymentDay, maxDay));
  next.setHours(23, 59, 59, 0);

  return next.toISOString();
}

export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'pending';
  const db = await getDB();

  const rows = await db.prepare(
    `SELECT s.*, p.name as provider_name, p.email as provider_email, p.phone as provider_phone,
            p.whatsapp as provider_whatsapp, c.name as category_name
     FROM subscriptions s
     JOIN providers p ON p.id = s.provider_id
     JOIN categories c ON c.id = p.category_id
     WHERE s.status = ?
     ORDER BY s.created_at DESC LIMIT 100`
  ).bind(status).all();

  return NextResponse.json({ subscriptions: rows.results });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthorized(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const body = await req.json() as { id: number; status: string; amount?: string };
  const { id, status, amount } = body;

  if (!id || !['active', 'pending', 'expired', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const db = await getDB();

  if (status === 'active') {
    // Busca dados atuais para calcular próximo vencimento
    const current = await db.prepare(
      'SELECT provider_id, paid_at, expires_at FROM subscriptions WHERE id = ?'
    ).bind(id).first<{ provider_id: number; paid_at: string | null; expires_at: string | null }>();

    if (!current) return NextResponse.json({ error: 'Assinatura não encontrada' }, { status: 404 });

    const newExpiresAt = nextExpiresAt(current.expires_at, current.paid_at);

    await db.prepare(
      `UPDATE subscriptions SET status = 'active', paid_at = datetime('now'),
       expires_at = ?, amount = COALESCE(?, amount), updated_at = datetime('now') WHERE id = ?`
    ).bind(newExpiresAt, amount || null, id).run();

    // Reativa o prestador
    await db.prepare(
      `UPDATE providers SET status = 'approved', updated_at = datetime('now') WHERE id = ?`
    ).bind(current.provider_id).run();

    // Notificação Telegram
    const prov = await db.prepare('SELECT name, email, phone FROM providers WHERE id = ?').bind(current.provider_id).first<{ name: string; email: string; phone: string }>();
    const env = await getEnv();
    if (prov && env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      const expires = new Date(newExpiresAt);
      await sendTelegram(
        env.TELEGRAM_BOT_TOKEN,
        env.TELEGRAM_CHAT_ID,
        `✅ <b>PIX confirmado — Prestador aprovado!</b>\n\n` +
        `👤 <b>Nome:</b> ${prov.name}\n` +
        `📧 <b>E-mail:</b> ${prov.email}\n` +
        `📱 <b>Telefone:</b> ${prov.phone}\n` +
        `💰 <b>Valor:</b> R$ ${amount || '19.90'}\n` +
        `📅 <b>Próximo vencimento:</b> ${expires.toLocaleDateString('pt-BR')}\n\n` +
        `🔓 Prestador liberado no sistema com sucesso!`
      );
    }
  } else {
    await db.prepare(
      `UPDATE subscriptions SET status = ?, amount = COALESCE(?, amount), updated_at = datetime('now') WHERE id = ?`
    ).bind(status, amount || null, id).run();

    // Suspende o prestador se cancelado/expirado
    if (status === 'expired' || status === 'cancelled') {
      const sub = await db.prepare('SELECT provider_id FROM subscriptions WHERE id = ?').bind(id).first<{ provider_id: number }>();
      if (sub) {
        await db.prepare(`UPDATE providers SET status = 'suspended', updated_at = datetime('now') WHERE id = ?`).bind(sub.provider_id).run();
      }
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthorized(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await req.json() as { id: number };
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const db = await getDB();
  await db.prepare('DELETE FROM subscriptions WHERE id = ?').bind(id).run();
  return NextResponse.json({ success: true });
}
