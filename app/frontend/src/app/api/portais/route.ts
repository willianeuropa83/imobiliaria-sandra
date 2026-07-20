import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/data-loader';

export async function GET() {
  try {
    const data = await readDataFile();
    const portais = [...new Set(data.imoveis.map((i: any) => i.portal))].filter(Boolean).sort();
    return NextResponse.json(portais);
  } catch {
    return NextResponse.json([]);
  }
}
