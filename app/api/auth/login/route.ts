import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import bcryptjs from 'bcryptjs';
import type { User, AuthPayload, ApiResponse, AuthResponse } from '@/lib/types';

type Env = {
  DB: D1Database;
  JWT_SECRET?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: AuthPayload = await request.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Get D1 database from environment
    const env = process.env as unknown as Env;
    const db = env.DB;

    if (!db) {
      console.error('D1 database not configured');
      return NextResponse.json(
        { success: false, error: 'Erro no servidor' },
        { status: 500 }
      );
    }

    // Find user by email
    const dbUser = await db.prepare(
      'SELECT id, email, password_hash, tipo, nome, telefone, estado, cidade, avatar_url, bio, verificado, criado_em, atualizado_em FROM users WHERE email = ?'
    ).bind(email).first() as any;

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(senha, dbUser.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    // Create user object for token
    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      tipo: dbUser.tipo,
      nome: dbUser.nome,
      telefone: dbUser.telefone || '',
      estado: dbUser.estado,
      cidade: dbUser.cidade,
      avatar_url: dbUser.avatar_url,
      bio: dbUser.bio,
      verificado: Boolean(dbUser.verificado),
      criado_em: dbUser.criado_em,
      atualizado_em: dbUser.atualizado_em,
    };

    const token = signToken(user);

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        token,
        user,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}
