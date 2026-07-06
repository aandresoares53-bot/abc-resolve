import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CloudflareEnv, User } from '@/lib/db';

export const runtime = 'edge';

interface AdminEnv extends CloudflareEnv {
  ADMIN_SECRET: string;
}

function isAuthorized(request: NextRequest, adminSecret: string): boolean {
  return request.headers.get('Authorization') === `Bearer ${adminSecret}`;
}

export async function GET(request: NextRequest) {
  const { env } = (await getCloudflareContext()) as unknown as { env: AdminEnv };

  if (!isAuthorized(request, env.ADMIN_SECRET)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const result = await env.DB
    .prepare(`SELECT id, name, email, phone, service, city, created_at FROM users WHERE type = 'provider' ORDER BY created_at DESC`)
    .all<Omit<User, 'password_hash' | 'updated_at' | 'type'>>();

  return NextResponse.json({ providers: result.results });
}
