/**
 * Data Loader — Lê os dados de imóveis do ficheiro JSON estático
 *
 * Em produção (Vercel), os dados vêm de public/data/imoveis_data.json
 * gerado diariamente pelo script export_data.py no PC do Deivid.
 *
 * O ficheiro é cached em memória para evitar leituras repetidas do disco.
 */

import { promises as fs } from 'fs';
import path from 'path';

interface DataFile {
  imoveis: any[];
  ultima_atualizacao: string;
  total_exportados: number;
}

let cachedData: DataFile | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minuto

export async function readDataFile(): Promise<DataFile> {
  const now = Date.now();

  // Cache em memória (1 min)
  if (cachedData && (now - cacheTime) < CACHE_TTL) {
    return cachedData;
  }

  const filePath = path.join(process.cwd(), 'public', 'data', 'imoveis_data.json');

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    cachedData = JSON.parse(raw);
    cacheTime = now;
    return cachedData!;
  } catch {
    // Ficheiro não existe ainda — retornar vazio
    return {
      imoveis: [],
      ultima_atualizacao: '',
      total_exportados: 0,
    };
  }
}
