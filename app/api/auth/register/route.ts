import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signToken, getSQL, type User } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, service, city, type } = body as {
      name?: string; email?: string; password?: string; phone?: string;
      service?: string; city?: string; type?: string;
    };

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'Nome, email, senha e telefone são obrigatórios' }, { status: 400 });
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
      return NextResponse.json({ error: 'Serviço e cidade são obrigatórios para prestadores' }, { status: 400 });
    }

    const sql = getSQL();

    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const password_hash = await hashPassword(password);
    const now = new Date().toISOString();

    await sql`
      INSERT INTO users (id, name, email, password_hash, phone, type, service, city, created_at, updated_at)
      VALUES (${id}, ${name}, ${email}, ${password_hash}, ${phone}, ${userType}, ${service ?? null}, ${city ?? null}, ${now}, ${now})
    `;

    const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    const user = rows[0] as User | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
    }

    const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
    const token = await signToken({ id: user.id, email: user.email, type: user.type }, jwtSecret);

    const { password_hash: _, ...safeUser } = user;

    return NextResponse.json({ user: safeUser, token, message: 'Conta criada com sucesso' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
  }
}
