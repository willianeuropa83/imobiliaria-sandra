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
  preco_anterior?: number;
  data_alteracao_preco?: string;
  historico_precos?: { preco: number; data: string }[];
}

let cachedImoveis: Imovel[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minuto

/**
 * Normalização de nomes de distritos — corrige capitalização inconsistente
 * entre portais (ex: "Viana Do Castelo" → "Viana do Castelo")
 */
const DISTRITO_NORMALIZADO: Record<string, string> = {
  'viana do castelo': 'Viana do Castelo',
  'castelo branco': 'Castelo Branco',
  'vila real': 'Vila Real',
  'aveiro': 'Aveiro',
  'beja': 'Beja',
  'braga': 'Braga',
  'bragança': 'Bragança',
  'braganca': 'Bragança',
  'coimbra': 'Coimbra',
  'évora': 'Évora',
  'evora': 'Évora',
  'faro': 'Faro',
  'guarda': 'Guarda',
  'leiria': 'Leiria',
  'lisboa': 'Lisboa',
  'portalegre': 'Portalegre',
  'porto': 'Porto',
  'santarém': 'Santarém',
  'santarem': 'Santarém',
  'setúbal': 'Setúbal',
  'setubal': 'Setúbal',
  'viseu': 'Viseu',
  'ilha da madeira': 'Ilha da Madeira',
  'ilha de são miguel': 'Ilha de São Miguel',
  'ilha terceira': 'Ilha Terceira',
  'região autónoma dos açores': 'Região Autónoma dos Açores',
  'região autónoma da madeira': 'Região Autónoma da Madeira',
};

function normalizarDistrito(distrito: string): string {
  if (!distrito) return '';
  const key = distrito.toLowerCase().trim();
  return DISTRITO_NORMALIZADO[key] || distrito.trim();
}

/**
 * Normaliza capitalização de concelhos (Title Case com exceções)
 */
function normalizarConcelho(concelho: string): string {
  if (!concelho) return '';
  const trimmed = concelho.trim();
  // Title case com preposições em minúsculas
  const preps = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o']);
  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => {
      if (i > 0 && preps.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Normaliza a classificação da regra I01.
 *
 * A base de dados grava "NÃO" (com til), mas o resto da aplicação compara com
 * 'NAO'. Sem esta normalização o badge de restrição nunca aparecia e o filtro
 * "aceita corretores" não excluía ninguém — a regra I01 era violada na
 * apresentação. Corrigido em 26/07/2026.
 */
const NAO_ACEITA = new Set(['NAO', 'NÃO', 'NÃƒO', 'NO']);

function normalizarAceitaCorretores(valor?: string): 'SIM' | 'NAO' | 'SIM*' {
  const limpo = (valor || '').trim().toUpperCase();
  if (NAO_ACEITA.has(limpo)) return 'NAO';
  if (limpo === 'SIM') return 'SIM';
  return 'SIM*';
}

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
    distrito: normalizarDistrito(raw.distrito || ''),
    concelho: normalizarConcelho(raw.concelho || ''),
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
    aceita_corretores: normalizarAceitaCorretores(raw.aceita_corretores),
    tipo_vendedor: raw.tipo_vendedor || undefined,
    preco_anterior: raw.preco_anterior || undefined,
    data_alteracao_preco: raw.data_alteracao_preco || undefined,
    historico_precos: raw.historico_precos || undefined,
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

/**
 * Opções de filtro extraídas dos dados reais (para FilterPanel dinâmico)
 */
export interface FilterOptions {
  distritos: string[];
  concelhos: Record<string, string[]>; // distrito → concelhos[]
  portais: string[];
  tipologias: string[];
  tiposVendedor: string[]; // Imobiliária | Particular | Banca
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const imoveis = await getImoveis();
  const ativos = imoveis.filter((i) => i.ativo);

  const distritosSet = new Set<string>();
  const concelhosMap = new Map<string, Set<string>>();
  const portaisSet = new Set<string>();
  const tipologiasSet = new Set<string>();
  const vendedoresSet = new Set<string>();

  for (const im of ativos) {
    if (im.distrito) {
      distritosSet.add(im.distrito);
      if (im.concelho) {
        if (!concelhosMap.has(im.distrito)) concelhosMap.set(im.distrito, new Set());
        concelhosMap.get(im.distrito)!.add(im.concelho);
      }
    }
    if (im.portal) portaisSet.add(im.portal);
    if (im.tipologia) tipologiasSet.add(im.tipologia);
    if (im.tipo_vendedor) vendedoresSet.add(im.tipo_vendedor);
  }

  const distritos = [...distritosSet].sort((a, b) => a.localeCompare(b, 'pt'));
  const concelhos: Record<string, string[]> = {};
  for (const [dist, concs] of concelhosMap) {
    concelhos[dist] = [...concs].sort((a, b) => a.localeCompare(b, 'pt'));
  }
  const portais = [...portaisSet].sort();
  // Agrupar tipologias >= T7 num único "T6+"
  const rawTipologias = [...tipologiasSet];
  const hasTipAboveT6 = rawTipologias.some((t) => {
    const m = t.match(/^T(\d+)/);
    return m && parseInt(m[1]) >= 7;
  });
  const filteredTip = rawTipologias.filter((t) => {
    const m = t.match(/^T(\d+)/);
    return !(m && parseInt(m[1]) >= 7);
  });
  if (hasTipAboveT6) filteredTip.push('T6+');

  const tipologias = filteredTip.sort((a, b) => {
    // Ordenar T0 < T1 < T2 ... < T6 < T6+ < outros
    const matchA = a.match(/^T(\d+)/);
    const matchB = b.match(/^T(\d+)/);
    const numA = matchA ? parseInt(matchA[1]) : NaN;
    const numB = matchB ? parseInt(matchB[1]) : NaN;
    // T6+ ordena como 6.5
    const valA = a === 'T6+' ? 6.5 : numA;
    const valB = b === 'T6+' ? 6.5 : numB;
    if (!isNaN(valA) && !isNaN(valB)) return valA - valB;
    if (!isNaN(valA)) return -1;
    if (!isNaN(valB)) return 1;
    return a.localeCompare(b);
  });

  // Ordem fixa e útil para uma corretora: profissionais, particulares, banca
  const ORDEM_VENDEDOR = ['Imobiliária', 'Particular', 'Banca'];
  const tiposVendedor = [...vendedoresSet].sort((a, b) => {
    const ia = ORDEM_VENDEDOR.indexOf(a);
    const ib = ORDEM_VENDEDOR.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b, 'pt');
  });

  return { distritos, concelhos, portais, tipologias, tiposVendedor };
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
