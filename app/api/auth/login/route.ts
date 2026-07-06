import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { verifyPassword, signToken, type User, type CloudflareEnv } from '@/lib/db';


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

    const { env } = (await getCloudflareContext()) as unknown as { env: CloudflareEnv };

    const user = await env.DB
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<User>();

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

    const token = await signToken(
      { id: user.id, email: user.email, type: user.type },
      env.JWT_SECRET
    );

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
