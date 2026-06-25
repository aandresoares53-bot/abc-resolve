import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnv } from '@/lib/db';
import { sendTelegram } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, string>;
    const { name, email, phone, whatsapp, city, neighborhood, category_slug, description, experience_years } = body;

    if (!name || !email || !phone || !city || !category_slug || !description) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const db = await getDB();

    const existing = await db.prepare('SELECT id FROM providers WHERE email = ?').bind(email).first<{ id: number }>();
    if (existing) return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 });

    const category = await db.prepare('SELECT id, name FROM categories WHERE slug = ?').bind(category_slug).first<{ id: number; name: string }>();
    if (!category) return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });

    const insert = await db.prepare(
      `INSERT INTO providers (name, email, phone, whatsapp, city, neighborhood, category_id, description, experience_years, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
    ).bind(name, email, phone, whatsapp || null, city, neighborhood || null, category.id, description, Number(experience_years) || 0).run();

    if (insert.meta.last_row_id) {
      await db.prepare(
        `INSERT INTO subscriptions (provider_id, status, amount) VALUES (?, 'pending', '19.90')`
      ).bind(insert.meta.last_row_id).run();
    }

    // Notificação Telegram
    const env = await getEnv();
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      await sendTelegram(
        env.TELEGRAM_BOT_TOKEN,
        env.TELEGRAM_CHAT_ID,
        `🆕 <b>Novo prestador cadastrado!</b>\n\n` +
        `👤 <b>Nome:</b> ${name}\n` +
        `📧 <b>E-mail:</b> ${email}\n` +
        `📱 <b>Telefone:</b> ${phone}\n` +
        `📍 <b>Cidade:</b> ${city}\n` +
        `🔧 <b>Categoria:</b> ${category.name}\n\n` +
        `⏳ Aguardando pagamento PIX de R$19,90\n` +
        `🔗 Acesse o admin para aprovar após confirmação do PIX.`
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
