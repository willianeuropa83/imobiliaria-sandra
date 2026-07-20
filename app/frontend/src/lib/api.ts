/**
 * API client para o imoveis-app (FastAPI backend existente)
 *
 * O imoveis-app corre em localhost:8000 (desenvolvimento local)
 * ou no Hetzner VPS (produção futura).
 *
 * Endpoints conhecidos da API FastAPI:
 * - GET /api/stats — estatísticas gerais (total ativos, por portal, etc.)
 * - GET /api/imoveis — listagem com filtros
 * - GET /api/imoveis/{id} — detalhe de um imóvel
 * - GET /api/portais — lista de portais
 */

// Em produção (Vercel): API routes internas (mesmo domínio)
// Em desenvolvimento local: pode apontar para o imoveis-app (localhost:8000)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiStats {
  total_ativos: number;
  total_inativos: number;
  por_portal: Record<string, number>;
  ultima_atualizacao: string;
}

export interface ApiImovel {
  id: number;
  titulo: string;
  preco: number;
  tipologia: string;
  area: number;
  quartos: number;
  casas_banho: number;
  distrito: string;
  concelho: string;
  freguesia: string;
  morada: string;
  descricao: string;
  url: string;
  portal: string;
  fotos: string[];
  estado: string;
  tipo: string;
  aceita_corretores: string;
  restricao_texto: string;
  data_publicacao: string;
  data_scraping: string;
  ativo: boolean;
  // campos adicionais do imoveis-app
  slug: string;
  latitude: number;
  longitude: number;
  certificado_energetico: string;
  garagem: boolean;
  elevador: boolean;
  varanda: boolean;
  piscina: boolean;
  jardim: boolean;
  ar_condicionado: boolean;
}

export interface ApiListResponse {
  imoveis: ApiImovel[];
  total: number;
  pagina: number;
  total_paginas: number;
}

export async function fetchStats(): Promise<ApiStats> {
  const res = await fetch(`${API_BASE}/api/stats`, {
    next: { revalidate: 3600 }, // cache 1h
  });
  if (!res.ok) throw new Error(`API stats: ${res.status}`);
  return res.json();
}

export async function fetchImoveis(params: Record<string, string>): Promise<ApiListResponse> {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/imoveis?${query}`, {
    next: { revalidate: 300 }, // cache 5min
  });
  if (!res.ok) throw new Error(`API imoveis: ${res.status}`);
  return res.json();
}

export async function fetchImovel(id: string | number): Promise<ApiImovel> {
  const res = await fetch(`${API_BASE}/api/imoveis/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`API imovel ${id}: ${res.status}`);
  return res.json();
}

export async function fetchPortais(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/portais`, {
    next: { revalidate: 86400 }, // cache 24h
  });
  if (!res.ok) throw new Error(`API portais: ${res.status}`);
  return res.json();
}
