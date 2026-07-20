import { NextRequest, NextResponse } from 'next/server';
import { readDataFile } from '@/lib/data-loader';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data = await readDataFile();
    const imovel = data.imoveis.find((i: any) => String(i.id) === id);

    if (!imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    return NextResponse.json(imovel);
  } catch {
    return NextResponse.json({ error: 'Erro ao carregar dados' }, { status: 500 });
  }
}
