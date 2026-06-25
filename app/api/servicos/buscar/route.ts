'use server';

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

type Env = {
  DB: D1Database;
};

interface ServicoRow {
  id: number;
  prestador_id: number;
  categoria_id: number;
  titulo: string;
  descricao: string;
  preco_minimo: number;
  preco_maximo: number;
  tempo_medio_dias: number | null;
  experiencia_anos: number | null;
  criado_em: string;
  ativo: number;
}

interface PrestadorRow {
  id: number;
  nome: string;
  avatar_url: string | null;
}

interface ServicoComPrestador extends ServicoRow {
  prestador: PrestadorRow;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const categoria = searchParams.get('categoria');
    const preco_min = searchParams.get('preco_min');
    const preco_max = searchParams.get('preco_max');
    const cidade = searchParams.get('cidade');

    const env = process.env as unknown as Env;
    const db = env.DB;

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Banco de dados não configurado' },
        { status: 500 }
      );
    }

    // Build query
    let query = `
      SELECT s.*, u.nome as prestador_nome, u.avatar_url
      FROM servicos s
      JOIN users u ON s.prestador_id = u.id
      WHERE s.ativo = 1
    `;

    const params: any[] = [];

    if (q) {
      query += ` AND (s.titulo LIKE ? OR s.descricao LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }

    if (categoria) {
      query += ` AND s.categoria_id = ?`;
      params.push(Number(categoria));
    }

    if (preco_min) {
      query += ` AND s.preco_maximo >= ?`;
      params.push(Number(preco_min));
    }

    if (preco_max) {
      query += ` AND s.preco_minimo <= ?`;
      params.push(Number(preco_max));
    }

    if (cidade) {
      query += ` AND u.cidade = ?`;
      params.push(cidade);
    }

    query += ` LIMIT 50`;

    // Execute query
    let stmt = db.prepare(query);
    for (const param of params) {
      stmt = stmt.bind(param);
    }

    const result = await stmt.all() as any;

    const servicos = result.results?.map((row: any) => ({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      categoria_id: row.categoria_id,
      preco_minimo: row.preco_minimo,
      preco_maximo: row.preco_maximo,
      tempo_medio_dias: row.tempo_medio_dias,
      experiencia_anos: row.experiencia_anos,
      criado_em: row.criado_em,
      prestador: {
        id: row.prestador_id,
        nome: row.prestador_nome,
        avatar_url: row.avatar_url,
      },
    })) || [];

    const response: ApiResponse<any> = {
      success: true,
      data: {
        servicos,
        total: servicos.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar serviços' },
      { status: 500 }
    );
  }
}
