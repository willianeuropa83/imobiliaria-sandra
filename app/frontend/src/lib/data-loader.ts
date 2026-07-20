/**
 * Data Loader — Lê os dados de imóveis do ficheiro JSON estático
 *
 * Em produção (Vercel), os dados vêm de public/data/imoveis_data.json
 * gerado diariamente pelo script export_data.py no PC do Deivid.
 *
 * Inclui mapeamento dos campos da base de dados para o tipo Imovel do frontend.
 */

import { promises as fs } from 'fs';
import path from 'path';
import type { Imovel } from '@/types/imovel';

interface RawDataFile {
  imoveis: RawImovel[];
  ultima_atualizacao: string;
  total_exportados: number;
  total_ativos?: number;
  total_inativos?: number;
}

interface RawImovel {
  id: number;
  titulo: string;
  preco: number;
  preco_texto?: string;
  tipologia: string;
  area?: number;
  quartos?: number;
  casas_banho?: number;
  distrito: string;
  concelho: string;
  morada?: string;
  descricao?: string;
  url?: string;
  portal: string;
  portal_id?: string | null;
  estado?: string;
  tipo_vendedor?: string;
  nome_vendedor?: string;
  aceita_corretores?: string;
  restricao_texto?: string;
  data_publicacao?: string;
  data_scraping?: string;
  ativo: boolean;
  latitude?: number | null;
  longitude?: number | null;
  certificado_energetico?: string;
  fotos?: string[];
}

let cachedImoveis: Imovel[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minuto

/**
 * Deriva o tipo de imóvel a partir do título e tipologia
 */
function derivarTipo(titulo: string): string {
  const t = titulo.toLowerCase();
  if (t.includes('moradia') || t.includes('vivenda') || t.includes('villa')) return 'moradia';
  if (t.includes('terreno') || t.includes('lote') || t.includes('parcela')) return 'terreno';
  if (t.includes('loja') || t.includes('comércio') || t.includes('comercio')) return 'loja';
  if (t.includes('escritório') || t.includes('escritorio') || t.includes('gabinete')) return 'escritorio';
  if (t.includes('armazém') || t.includes('armazem') || t.includes('pavilhão')) return 'armazem';
  if (t.includes('garagem') || t.includes('estacionamento') || t.includes('parking')) return 'garagem';
  if (t.includes('quinta') || t.includes('herdade')) return 'moradia';
  return 'apartamento'; // default
}

/**
 * Deriva a finalidade (venda/arrendamento) a partir do título e preço
 */
function derivarFinalidade(titulo: string, preco: number): string {
  const t = titulo.toLowerCase();
  if (t.includes('arrend') || t.includes('alug') || t.includes('renda')) return 'arrendamento';
  // Preço muito baixo para venda → provavelmente arrendamento
  if (preco > 0 && preco < 3000) return 'arrendamento';
  return 'venda';
}

/**
 * Mapeia um imóvel raw (JSON da base de dados) para o tipo Imovel do frontend
 */
function mapToImovel(raw: RawImovel): Imovel {
  const titulo = raw.titulo || '';
  const preco = raw.preco || 0;
  const fotos = (raw.fotos || []).filter((f) => f && !f.includes('eficiencia-energetica') && !f.includes('static_map') && !f.includes('users/'));

  return {
    id: String(raw.id),
    titulo,
    descricao: raw.descricao || '',
    preco,
    tipologia: raw.tipologia || '',
    area_util: raw.area || undefined,
    quartos: raw.quartos || undefined,
    casas_banho: raw.casas_banho || undefined,
    estado: raw.estado || 'usado',
    tipo: derivarTipo(titulo),
    finalidade: derivarFinalidade(titulo, preco),
    distrito: raw.distrito || '',
    concelho: raw.concelho || '',
    morada: raw.morada || undefined,
    latitude: raw.latitude ?? undefined,
    longitude: raw.longitude ?? undefined,
    garagem: undefined,
    elevador: undefined,
    varanda: undefined,
    terraço: undefined,
    jardim: undefined,
    piscina: undefined,
    ar_condicionado: undefined,
    certificado_energetico: raw.certificado_energetico || undefined,
    fotos,
    foto_principal: fotos[0] || undefined,
    portal: raw.portal || '',
    url_original: raw.url || '',
    referencia_portal: raw.portal_id || undefined,
    aceita_corretores: (raw.aceita_corretores as 'SIM' | 'NAO' | 'SIM*') || 'SIM*',
    restricao_texto: raw.restricao_texto || undefined,
    data_publicacao: raw.data_publicacao || undefined,
    data_scraping: raw.data_scraping || new Date().toISOString(),
    data_atualizacao: raw.data_scraping || new Date().toISOString(),
    ativo: raw.ativo,
  };
}

/**
 * Lê e retorna todos os imóveis mapeados para o tipo Imovel
 */
export async function getImoveis(): Promise<Imovel[]> {
  const now = Date.now();

  if (cachedImoveis && (now - cacheTime) < CACHE_TTL) {
    return cachedImoveis;
  }

  const filePath = path.join(process.cwd(), 'public', 'data', 'imoveis_data.json');

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const data: RawDataFile = JSON.parse(raw);
    cachedImoveis = (data.imoveis || []).map(mapToImovel);
    cacheTime = now;
    return cachedImoveis;
  } catch {
    return [];
  }
}

/**
 * Busca um imóvel por ID (string)
 */
export async function getImovelById(id: string): Promise<Imovel | undefined> {
  const imoveis = await getImoveis();
  return imoveis.find((i) => i.id === id);
}

// Manter compatibilidade com API routes existentes
export async function readDataFile() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'imoveis_data.json');
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { imoveis: [], ultima_atualizacao: '', total_exportados: 0 };
  }
}
