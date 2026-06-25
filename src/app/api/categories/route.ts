import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  const db = await getDB();
  const rows = await db.prepare('SELECT id, name, slug, icon FROM categories ORDER BY name ASC').all();
  return NextResponse.json({ categories: rows.results });
}
