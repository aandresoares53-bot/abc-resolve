import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import type { User, AuthPayload, ApiResponse, AuthResponse } from '@/lib/types';

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

    // TODO: Verify credentials against D1 database
    // TODO: Check password hash

    // Mock user (in production, fetch from DB)
    const user: User = {
      id: 1,
      email,
      tipo: 'cliente',
      nome: 'João Silva',
      telefone: '11999999999',
      estado: 'SP',
      cidade: 'São Paulo',
      avatar_url: undefined,
      bio: undefined,
      verificado: false,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
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
