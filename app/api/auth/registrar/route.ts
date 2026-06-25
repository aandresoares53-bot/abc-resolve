import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import bcryptjs from 'bcryptjs';
import type { User, RegisterPayload, ApiResponse, AuthResponse } from '@/lib/types';

type Env = {
  DB: D1Database;
  JWT_SECRET?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: RegisterPayload = await request.json();
    const { email, senha, nome, tipo, cidade, estado, telefone } = body;

    // Validation
    if (!email || !senha || !nome || !tipo || !cidade || !estado) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    if (!['cliente', 'prestador'].includes(tipo)) {
      return NextResponse.json(
        { success: false, error: 'Tipo inválido' },
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

    // Check if user already exists
    const existing = await db.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first() as any;

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email já registrado' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(senha, 10);

    // Insert user into database
    const result = await db.prepare(`
      INSERT INTO users (email, password_hash, tipo, nome, telefone, estado, cidade, criado_em, atualizado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(passwordHash, tipo, nome, telefone || null, estado, cidade).run() as any;

    if (!result.success) {
      throw new Error('Failed to create user');
    }

    const userId = result.meta.last_row_id;

    // Create user object for token
    const newUser: User = {
      id: Number(userId),
      email,
      tipo: tipo as 'cliente' | 'prestador',
      nome,
      telefone: telefone || '',
      estado,
      cidade,
      avatar_url: undefined,
      bio: undefined,
      verificado: false,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };

    const token = signToken(newUser);

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        token,
        user: newUser,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao registrar' },
      { status: 500 }
    );
  }
}
