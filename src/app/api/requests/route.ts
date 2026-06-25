import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnv } from '@/lib/db';
import { sendTelegram } from '@/lib/telegram';

const URGENCY_LABEL: Record<string, string> = {
  urgent: '🔴 Urgente',
  normal: '🟡 Normal',
  flexible: '🟢 Flexível',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, string>;
    const { client_name, client_email, client_phone, city, neighborhood, category_slug, description, urgency } = body;

    if (!client_name || !client_email || !client_phone || !city || !category_slug || !description) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }
    if (description.length < 20) {
      return NextResponse.json({ error: 'Descrição muito curta (mínimo 20 caracteres)' }, { status: 400 });
    }

    const db = await getDB();
    const category = await db.prepare('SELECT id, name FROM categories WHERE slug = ?').bind(category_slug).first<{ id: number; name: string }>();
    if (!category) return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });

    await db.prepare(
      `INSERT INTO service_requests (client_name, client_email, client_phone, city, neighborhood, category_id, description, urgency)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(client_name, client_email, client_phone, city, neighborhood || null, category.id, description, urgency || 'normal').run();

    // Notificação Telegram
    const env = await getEnv();
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      await sendTelegram(
        env.TELEGRAM_BOT_TOKEN,
        env.TELEGRAM_CHAT_ID,
        `📋 <b>Nova solicitação de serviço!</b>\n\n` +
        `👤 <b>Cliente:</b> ${client_name}\n` +
        `📱 <b>Telefone:</b> ${client_phone}\n` +
        `📍 <b>Cidade:</b> ${city}${neighborhood ? ` — ${neighborhood}` : ''}\n` +
        `🔧 <b>Serviço:</b> ${category.name}\n` +
        `${URGENCY_LABEL[urgency] || '🟡 Normal'}\n\n` +
        `📝 ${description.substring(0, 200)}${description.length > 200 ? '...' : ''}`
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
