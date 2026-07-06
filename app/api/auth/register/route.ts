import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { hashPassword, signToken, type User, type CloudflareEnv } from '@/lib/db';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, service, city, type } = body as {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
      service?: string;
      city?: string;
      type?: string;
    };

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'Nome, email, senha e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const userType = type === 'provider' ? 'provider' : 'consumer';

    if (userType === 'provider' && (!service || !city)) {
      return NextResponse.json(
        { error: 'Serviço e cidade são obrigatórios para prestadores' },
        { status: 400 }
      );
    }

    const { env } = (await getCloudflareContext()) as unknown as { env: CloudflareEnv };

    const existing = await env.DB
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first<{ id: string }>();

    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const password_hash = await hashPassword(password);
    const now = new Date().toISOString();

    await env.DB
      .prepare(
        `INSERT INTO users (id, name, email, password_hash, phone, type, service, city, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(id, name, email, password_hash, phone, userType, service ?? null, city ?? null, now, now)
      .run();

    const user = await env.DB
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(id)
      .first<User>();

    if (!user) {
      return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
    }

    const token = await signToken(
      { id: user.id, email: user.email, type: user.type },
      env.JWT_SECRET
    );

    const { password_hash: _, ...safeUser } = user;

    return NextResponse.json(
      { user: safeUser, token, message: 'Conta criada com sucesso' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
  }
}
