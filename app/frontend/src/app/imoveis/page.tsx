import { Suspense } from 'react';
import type { Metadata } from 'next';
import PropertyCard from '@/components/PropertyCard';
import FilterPanel from '@/components/FilterPanel';
import SortSelectClient from './SortSelectClient';
import { IMOVEIS_MOCK } from '@/lib/mock-data';
import type { Imovel } from '@/types/imovel';

export const metadata: Metadata = {
  title: 'Imoveis em Portugal | Imobiliaria Sandra',
  description:
    'Pesquise apartamentos, moradias e terrenos em todo o Portugal. Filtros avancados por tipologia, distrito, preco e muito mais.',
};

const POR_PAGINA = 9;

const ORDENACAO_LABELS: Record<string, string> = {
  data_desc: 'Mais recentes',
  preco_asc: 'Preco: menor primeiro',
  preco_desc: 'Preco: maior primeiro',
  area_desc: 'Area: maior primeiro',
};

function filtrarImoveis(
  imoveis: Imovel[],
  params: Record<string, string | string[] | undefined>,
): Imovel[] {
  let resultado = [...imoveis].filter((i) => i.ativo);

  // Pesquisa por texto
  const query = typeof params.query === 'string' ? params.query.toLowerCase().trim() : '';
  if (query) {
    resultado = resultado.filter(
      (i) =>
        i.titulo.toLowerCase().includes(query) ||
        i.descricao.toLowerCase().includes(query) ||
        i.distrito.toLowerCase().includes(query) ||
        i.concelho.toLowerCase().includes(query) ||
        (i.freguesia && i.freguesia.toLowerCase().includes(query)),
    );
  }

  // Tipologia
  const tipologias =
    typeof params.tipologia === 'string'
      ? params.tipologia.split(',').filter(Boolean)
      : [];
  if (tipologias.length > 0) {
    resultado = resultado.filter((i) => tipologias.includes(i.tipologia));
  }

  // Tipo
  const tipos =
    typeof params.tipo === 'string' ? params.tipo.split(',').filter(Boolean) : [];
  if (tipos.length > 0) {
    resultado = resultado.filter((i) => tipos.includes(i.tipo));
  }

  // Distrito
  const distrito = typeof params.distrito === 'string' ? params.distrito : '';
  if (distrito) {
    resultado = resultado.filter((i) => i.distrito === distrito);
  }

  // Finalidade
  const finalidade = typeof params.finalidade === 'string' ? params.finalidade : '';
  if (finalidade === 'venda' || finalidade === 'arrendamento') {
    resultado = resultado.filter((i) => i.finalidade === finalidade);
  }

  // Preco min/max
  const precoMin = typeof params.preco_min === 'string' ? Number(params.preco_min) : NaN;
  const precoMax = typeof params.preco_max === 'string' ? Number(params.preco_max) : NaN;
  if (!isNaN(precoMin)) {
    resultado = resultado.filter((i) => i.preco >= precoMin);
  }
  if (!isNaN(precoMax)) {
    resultado = resultado.filter((i) => i.preco <= precoMax);
  }

  // Estado
  const estados =
    typeof params.estado === 'string' ? params.estado.split(',').filter(Boolean) : [];
  if (estados.length > 0) {
    resultado = resultado.filter((i) => estados.includes(i.estado));
  }

  // Portal
  const portais =
    typeof params.portal === 'string' ? params.portal.split(',').filter(Boolean) : [];
  if (portais.length > 0) {
    resultado = resultado.filter((i) => portais.includes(i.portal));
  }

  // Aceita corretores
  if (params.aceita_corretores === 'true') {
    resultado = resultado.filter((i) => i.aceita_corretores !== 'NAO');
  }

  return resultado;
}

function ordenarImoveis(imoveis: Imovel[], ordenar: string): Imovel[] {
  const copia = [...imoveis];
  switch (ordenar) {
    case 'preco_asc':
      return copia.sort((a, b) => a.preco - b.preco);
    case 'preco_desc':
      return copia.sort((a, b) => b.preco - a.preco);
    case 'area_desc':
      return copia.sort((a, b) => (b.area_util || 0) - (a.area_util || 0));
    case 'data_desc':
    default:
      return copia.sort(
        (a, b) =>
          new Date(b.data_atualizacao).getTime() -
          new Date(a.data_atualizacao).getTime(),
      );
  }
}

/* ─── Paginacao ─── */
function Paginacao({
  paginaAtual,
  totalPaginas,
  baseUrl,
}: {
  paginaAtual: number;
  totalPaginas: number;
  baseUrl: string;
}) {
  if (totalPaginas <= 1) return null;

  const paginas: (number | '...')[] = [];
  for (let i = 1; i <= totalPaginas; i++) {
    if (
      i === 1 ||
      i === totalPaginas ||
      (i >= paginaAtual - 1 && i <= paginaAtual + 1)
    ) {
      paginas.push(i);
    } else if (paginas[paginas.length - 1] !== '...') {
      paginas.push('...');
    }
  }

  function urlPagina(pagina: number): string {
    const url = new URL(baseUrl, 'http://localhost');
    if (pagina > 1) {
      url.searchParams.set('pagina', String(pagina));
    } else {
      url.searchParams.delete('pagina');
    }
    return `${url.pathname}${url.search}`;
  }

  return (
    <nav aria-label="Paginacao" className="flex items-center justify-center gap-1 mt-10">
      {/* Anterior */}
      {paginaAtual > 1 ? (
        <a
          href={urlPagina(paginaAtual - 1)}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </a>
      ) : (
        <span className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </span>
      )}

      {/* Numeros */}
      {paginas.map((p, idx) =>
        p === '...' ? (
          <span key={`dots-${idx}`} className="px-2 py-2 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <a
            key={p}
            href={urlPagina(p)}
            className={`flex items-center justify-center h-10 w-10 rounded-lg text-sm font-medium transition ${
              p === paginaAtual
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {p}
          </a>
        ),
      )}

      {/* Seguinte */}
      {paginaAtual < totalPaginas ? (
        <a
          href={urlPagina(paginaAtual + 1)}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Seguinte
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      ) : (
        <span className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
          Seguinte
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}

/* ─── Pagina principal ─── */
export default async function ImoveisPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;

  // Filtrar e ordenar
  const filtrados = filtrarImoveis(IMOVEIS_MOCK, searchParams);
  const ordenarPor =
    typeof searchParams.ordenar_por === 'string' ? searchParams.ordenar_por : 'data_desc';
  const ordenados = ordenarImoveis(filtrados, ordenarPor);

  // Paginacao
  const paginaAtual =
    typeof searchParams.pagina === 'string' ? Math.max(1, Number(searchParams.pagina)) : 1;
  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / POR_PAGINA));
  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const imoveisPagina = ordenados.slice(inicio, inicio + POR_PAGINA);

  // Construir URL base para paginacao
  const paramsObj = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== 'pagina') {
      paramsObj.set(key, String(value));
    }
  }
  const baseUrl = `/imoveis?${paramsObj.toString()}`;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header da pagina */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Imoveis em Portugal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Encontre o imovel ideal entre milhares de opcoes nos principais portais
          </p>
        </div>
      </div>

      {/* Conteudo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filtros (sidebar) */}
          <Suspense fallback={null}>
            <FilterPanel />
          </Suspense>

          {/* Resultados */}
          <div className="flex-1 min-w-0">
            {/* Barra de resultados */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">{ordenados.length}</span>{' '}
                  {ordenados.length === 1 ? 'imovel encontrado' : 'imoveis encontrados'}
                </p>
              </div>

              {/* Ordenacao — form nativa para funcionar sem JS */}
              <SortClientWrapper currentSort={ordenarPor} />
            </div>

            {/* Grid de resultados */}
            {imoveisPagina.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {imoveisPagina.map((imovel) => (
                  <PropertyCard
                    key={imovel.id}
                    id={imovel.id}
                    titulo={imovel.titulo}
                    preco={imovel.preco}
                    tipologia={imovel.tipologia}
                    area={imovel.area_util}
                    distrito={imovel.distrito}
                    concelho={imovel.concelho}
                    foto_principal={imovel.foto_principal}
                    portal={imovel.portal}
                    finalidade={imovel.finalidade}
                    aceita_corretores={imovel.aceita_corretores}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  Nenhum imovel encontrado
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Tente ajustar os filtros de pesquisa para encontrar mais resultados. Pode
                  alterar a tipologia, o distrito ou a faixa de precos.
                </p>
                <a
                  href="/imoveis"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-dark)] transition"
                >
                  Limpar filtros
                </a>
              </div>
            )}

            {/* Paginacao */}
            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
              baseUrl={baseUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Wrapper client para o select de ordenacao ─── */
function SortClientWrapper({ currentSort }: { currentSort: string }) {
  return <SortSelectClient currentSort={currentSort} />;
}
