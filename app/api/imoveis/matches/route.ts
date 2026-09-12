/**
 * Motor de matching: retorna imóveis mais compatíveis com um perfil
 * GET /api/imoveis/matches?profile_id=xxx&min_score=0.35
 * POST /api/imoveis/matches/run - roda matching para todos os perfis e salva no banco
 */
import { type NextRequest, NextResponse } from 'next/server';
import {
  normalizeProperty, normalizeProfile,
  matchPropertiesToProfile,
  type Property, type BuyerProfile
} from '../../../lib/matching';

export const runtime = 'edge';

function getDB(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).cf?.env?.DB as D1Database | undefined;
}

export async function GET(req: NextRequest) {
  const db = getDB(req);
  if (!db) return NextResponse.json({ error: 'DB indisponível' }, { status: 503 });

  const url = new URL(req.url);
  const profileId = url.searchParams.get('profile_id');
  const minScore = parseFloat(url.searchParams.get('min_score') ?? '0.35');

  if (!profileId) return NextResponse.json({ error: 'profile_id obrigatório' }, { status: 400 });

  // Busca perfil
  const rawProfile = await db.prepare('SELECT * FROM buyer_profiles WHERE id=? AND active=1').bind(profileId).first();
  if (!rawProfile) return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });

  const profile = normalizeProfile(rawProfile as Record<string, unknown>) as BuyerProfile;

  // Busca todos os imóveis ativos
  const { results: rawProps } = await db.prepare('SELECT * FROM properties WHERE active=1').all();
  const properties = rawProps.map(r => normalizeProperty(r as Record<string, unknown>)) as Property[];

  // Calcula matches
  const matches = matchPropertiesToProfile(properties, profile, minScore);

  // Salva matches no banco (upsert)
  const now = new Date().toISOString();
  for (const m of matches) {
    await db.prepare(`
      INSERT INTO property_matches (id, property_id, profile_id, score, score_breakdown, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(property_id, profile_id) DO UPDATE SET score=excluded.score, score_breakdown=excluded.score_breakdown
    `).bind(
      crypto.randomUUID(),
      m.property.id,
      profile.id,
      m.score,
      JSON.stringify(m.breakdown),
      now,
    ).run();
  }

  return NextResponse.json({
    profile: { id: profile.id, name: profile.name },
    total: matches.length,
    matches: matches.map(m => ({
      score: m.score,
      score_pct: Math.round(m.score * 100),
      reasons: m.reasons,
      breakdown: m.breakdown,
      property: m.property,
    })),
  });
}
