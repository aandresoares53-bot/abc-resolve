import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CloudflareEnv } from '@/lib/db';


interface AdminEnv extends CloudflareEnv {
  ADMIN_SECRET: string;
}

function isAuthorized(request: NextRequest, adminSecret: string): boolean {
  return request.headers.get('Authorization') === `Bearer ${adminSecret}`;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { env } = (await getCloudflareContext()) as unknown as { env: AdminEnv };

  if (!isAuthorized(request, env.ADMIN_SECRET)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await env.DB
    .prepare(`SELECT id FROM users WHERE id = ? AND type = 'provider'`)
    .bind(id)
    .first<{ id: string }>();

  if (!existing) {
    return NextResponse.json({ error: 'Prestador não encontrado' }, { status: 404 });
  }

  await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

  return NextResponse.json({ message: 'Prestador excluído com sucesso' });
}
