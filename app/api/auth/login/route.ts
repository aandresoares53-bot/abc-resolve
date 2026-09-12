import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, signToken, getSQL, type User } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, type } = body as { email?: string; password?: string; type?: string };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 });
    }

    const sql = getSQL();
    const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    const user = rows[0] as User | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 });
    }

    if (type && user.type !== type) {
      return NextResponse.json({ error: 'Tipo de conta incorreto para este acesso' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
    const token = await signToken({ id: user.id, email: user.email, type: user.type }, jwtSecret);

    const { password_hash: _, ...safeUser } = user;

    return NextResponse.json(
      { user: safeUser, token, message: 'Login realizado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}
