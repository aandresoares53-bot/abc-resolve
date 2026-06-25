import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import type { User, RegisterPayload, ApiResponse, AuthResponse } from '@/lib/types';

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

    if (!['cliente', 'prestador'].includes(tipo)) {
      return NextResponse.json(
        { success: false, error: 'Tipo inválido' },
        { status: 400 }
      );
    }

    // TODO: Check if user already exists in DB
    // TODO: Hash password
    // TODO: Save to D1 database

    // Mock user creation
    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      email,
      tipo: tipo as any,
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
