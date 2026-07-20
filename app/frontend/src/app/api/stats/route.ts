import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/data-loader';

export async function GET() {
  try {
    const data = await readDataFile();

    const ativos = data.imoveis.filter((i: any) => i.ativo);
    const inativos = data.imoveis.filter((i: any) => !i.ativo);

    const porPortal: Record<string, number> = {};
    ativos.forEach((i: any) => {
      porPortal[i.portal] = (porPortal[i.portal] || 0) + 1;
    });

    return NextResponse.json({
      total_ativos: ativos.length,
      total_inativos: inativos.length,
      por_portal: porPortal,
      ultima_atualizacao: data.ultima_atualizacao || new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { total_ativos: 0, total_inativos: 0, por_portal: {}, ultima_atualizacao: '' },
      { status: 200 }
    );
  }
}
