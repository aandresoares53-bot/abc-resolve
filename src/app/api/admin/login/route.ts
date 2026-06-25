import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/db';
import { createAdminToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json() as { password: string };
    const env = await getEnv();
    if (!password || password !== env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }
    const token = await createAdminToken(env.ADMIN_SECRET);
    const res = NextResponse.json({ success: true });
    res.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(TOKEN_NAME);
  return res;
}
