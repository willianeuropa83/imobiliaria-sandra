import { NextRequest, NextResponse } from 'next/server';
import { readDataFile } from '@/lib/data-loader';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const portal = params.get('portal');
  const tipologia = params.get('tipologia');
  const distrito = params.get('distrito');
  const concelho = params.get('concelho');
  const precoMin = params.get('preco_min') ? parseFloat(params.get('preco_min')!) : null;
  const precoMax = params.get('preco_max') ? parseFloat(params.get('preco_max')!) : null;
  const aceita = params.get('aceita_corretores');
  const busca = params.get('busca')?.toLowerCase();
  const ordenar = params.get('ordenar') || 'recente';
  const pagina = parseInt(params.get('pagina') || '1');
  const porPagina = parseInt(params.get('por_pagina') || '24');

  try {
    const data = await readDataFile();
    let imoveis = data.imoveis.filter((i: any) => i.ativo);

    // Filtros
    if (portal) imoveis = imoveis.filter((i: any) => i.portal === portal);
    if (tipologia) imoveis = imoveis.filter((i: any) => i.tipologia === tipologia);
    if (distrito) imoveis = imoveis.filter((i: any) => i.distrito === distrito);
    if (concelho) imoveis = imoveis.filter((i: any) => i.concelho === concelho);
    if (precoMin) imoveis = imoveis.filter((i: any) => i.preco >= precoMin);
    if (precoMax) imoveis = imoveis.filter((i: any) => i.preco <= precoMax);
    if (aceita) imoveis = imoveis.filter((i: any) => i.aceita_corretores === aceita);
    if (busca) {
      imoveis = imoveis.filter((i: any) =>
        (i.titulo?.toLowerCase().includes(busca)) ||
        (i.descricao?.toLowerCase().includes(busca)) ||
        (i.concelho?.toLowerCase().includes(busca)) ||
        (i.distrito?.toLowerCase().includes(busca))
      );
    }

    // Ordenação
    switch (ordenar) {
      case 'preco_asc':
        imoveis.sort((a: any, b: any) => (a.preco || 0) - (b.preco || 0));
        break;
      case 'preco_desc':
        imoveis.sort((a: any, b: any) => (b.preco || 0) - (a.preco || 0));
        break;
      case 'recente':
      default:
        imoveis.sort((a: any, b: any) =>
          new Date(b.data_scraping || 0).getTime() - new Date(a.data_scraping || 0).getTime()
        );
    }

    // Paginação
    const total = imoveis.length;
    const totalPaginas = Math.ceil(total / porPagina);
    const offset = (pagina - 1) * porPagina;
    imoveis = imoveis.slice(offset, offset + porPagina);

    return NextResponse.json({
      imoveis,
      total,
      pagina,
      total_paginas: totalPaginas,
    });
  } catch {
    return NextResponse.json({ imoveis: [], total: 0, pagina: 1, total_paginas: 0 });
  }
}
