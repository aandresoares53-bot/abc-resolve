import { type NextRequest, NextResponse } from 'next/server';
import { getSQL } from '../../../lib/db';
import {
  normalizeProperty, normalizeProfile,
  matchPropertiesToProfile,
  type Property, type BuyerProfile
} from '../../../lib/matching';

export async function GET(req: NextRequest) {
  try {
    const sql = getSQL();
    const url = new URL(req.url);
    const profileId = url.searchParams.get('profile_id');
    const minScore = parseFloat(url.searchParams.get('min_score') ?? '0.35');

    if (!profileId) return NextResponse.json({ error: 'profile_id obrigatório' }, { status: 400 });

    const profileRows = await sql`SELECT * FROM buyer_profiles WHERE id = ${profileId} AND active = true LIMIT 1`;
    if (profileRows.length === 0) return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });

    const profile = normalizeProfile(profileRows[0] as Record<string, unknown>) as BuyerProfile;

    const propRows = await sql`SELECT * FROM properties WHERE active = true`;
    const properties = propRows.map(r => normalizeProperty(r as Record<string, unknown>)) as Property[];

    const matches = matchPropertiesToProfile(properties, profile, minScore);

    // Salva matches no banco (upsert)
    const now = new Date().toISOString();
    for (const m of matches) {
      await sql`
        INSERT INTO property_matches (id, property_id, profile_id, score, score_breakdown, created_at)
        VALUES (${crypto.randomUUID()}, ${m.property.id}, ${profile.id}, ${m.score}, ${JSON.stringify(m.breakdown)}, ${now})
        ON CONFLICT (property_id, profile_id) DO UPDATE SET score = EXCLUDED.score, score_breakdown = EXCLUDED.score_breakdown
      `;
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
  } catch (error) {
    console.error('Erro no matching:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
