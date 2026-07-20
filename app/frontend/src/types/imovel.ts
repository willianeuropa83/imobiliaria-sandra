// Tipos centrais do domínio imobiliário

export interface Imovel {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  preco_anterior?: number; // para histórico de preços
  tipologia: string; // T0, T1, T2, T3, T4, T5+
  area_util?: number; // m²
  area_bruta?: number; // m²
  area_terreno?: number; // m²
  quartos?: number;
  casas_banho?: number;
  andar?: string;
  estado: 'novo' | 'usado' | 'em-construcao' | 'renovado' | 'para-recuperar';
  tipo: 'apartamento' | 'moradia' | 'terreno' | 'loja' | 'escritorio' | 'armazem' | 'garagem' | 'outro';
  finalidade: 'venda' | 'arrendamento';

  // Localização
  distrito: string;
  concelho: string;
  freguesia?: string;
  morada?: string;
  codigo_postal?: string;
  latitude?: number;
  longitude?: number;

  // Características
  garagem?: boolean;
  elevador?: boolean;
  varanda?: boolean;
  terraço?: boolean;
  jardim?: boolean;
  piscina?: boolean;
  ar_condicionado?: boolean;
  certificado_energetico?: string; // A+, A, B, B-, C, D, E, F

  // Fotos
  fotos: string[]; // URLs das fotos
  foto_principal?: string;

  // Portal de origem
  portal: string; // idealista, imovirtual, olx, supercasa, etc.
  url_original: string; // link para o anúncio no portal
  referencia_portal?: string; // ID do anúncio no portal

  // Restrições (regra I01)
  aceita_corretores: 'SIM' | 'NAO' | 'SIM*';
  restricao_texto?: string; // texto da restrição encontrada

  // Metadados
  data_publicacao?: string;
  data_scraping: string; // ISO date
  data_atualizacao: string;
  ativo: boolean; // false se o anúncio foi removido do portal
}

export interface FiltrosPesquisa {
  texto?: string;
  distrito?: string;
  concelho?: string;
  tipologia?: string[];
  tipo?: string[];
  finalidade?: 'venda' | 'arrendamento';
  preco_min?: number;
  preco_max?: number;
  area_min?: number;
  area_max?: number;
  quartos_min?: number;
  estado?: string[];
  portal?: string[];
  aceita_corretores?: boolean;
  ordenar_por?: 'preco_asc' | 'preco_desc' | 'data_desc' | 'area_desc';
  pagina?: number;
  por_pagina?: number;
}

export interface ResultadoPesquisa {
  imoveis: Imovel[];
  total: number;
  pagina: number;
  total_paginas: number;
  filtros_aplicados: FiltrosPesquisa;
}

// Distritos de Portugal
export const DISTRITOS_PT = [
  'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco',
  'Coimbra', 'Évora', 'Faro', 'Guarda', 'Leiria',
  'Lisboa', 'Portalegre', 'Porto', 'Santarém', 'Setúbal',
  'Viana do Castelo', 'Vila Real', 'Viseu',
  'Região Autónoma dos Açores', 'Região Autónoma da Madeira'
] as const;

export const TIPOLOGIAS = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+'] as const;

export const TIPOS_IMOVEL = [
  'apartamento', 'moradia', 'terreno', 'loja',
  'escritorio', 'armazem', 'garagem', 'outro'
] as const;

export const PORTAIS = [
  'idealista', 'imovirtual', 'olx', 'supercasa',
  'casa-sapo', 'remax', 'era', 'custojusto'
] as const;
