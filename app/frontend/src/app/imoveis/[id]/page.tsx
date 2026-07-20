import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { IMOVEIS_MOCK } from '@/lib/mock-data';
import type { Imovel } from '@/types/imovel';
import PhotoGallery from './PhotoGallery';
import ContactForm from './ContactForm';

/* ─── Metadata dinamica ─── */
export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const imovel = IMOVEIS_MOCK.find((i) => i.id === id);
  if (!imovel) {
    return { title: 'Imovel nao encontrado | Imobiliaria Sandra' };
  }
  return {
    title: `${imovel.titulo} | Imobiliaria Sandra`,
    description: imovel.descricao.slice(0, 160),
  };
}

/* ─── Helpers ─── */
function formatarPreco(preco: number, finalidade: string): string {
  const formatado = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(preco);
  return finalidade === 'arrendamento' ? `${formatado}/mes` : formatado;
}

function estadoLabel(estado: string): string {
  const map: Record<string, string> = {
    novo: 'Novo',
    usado: 'Usado',
    renovado: 'Renovado',
    'em-construcao': 'Em construcao',
    'para-recuperar': 'Para recuperar',
  };
  return map[estado] || estado;
}

function portalBadgeColor(portal: string): string {
  switch (portal) {
    case 'idealista':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'imovirtual':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'olx':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/* ─── Caracteristicas grid ─── */
interface CaracteristicaItem {
  label: string;
  valor: boolean | undefined;
}

function CaracteristicasGrid({ imovel }: { imovel: Imovel }) {
  const items: CaracteristicaItem[] = [
    { label: 'Garagem', valor: imovel.garagem },
    { label: 'Elevador', valor: imovel.elevador },
    { label: 'Varanda', valor: imovel.varanda },
    { label: 'Terraco', valor: imovel.terraço },
    { label: 'Jardim', valor: imovel.jardim },
    { label: 'Piscina', valor: imovel.piscina },
    { label: 'Ar condicionado', valor: imovel.ar_condicionado },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
            item.valor
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 bg-gray-50 text-gray-400'
          }`}
        >
          {item.valor ? (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="text-xs font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Badge aceita corretores ─── */
function AceitaCorretoresBadge({ aceita, restricao }: { aceita: string; restricao?: string }) {
  if (aceita === 'NAO') {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-500">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <span className="text-sm font-bold text-red-700">Nao aceita corretores</span>
        </div>
        {restricao && (
          <p className="text-xs text-red-600 ml-8 italic">&quot;{restricao}&quot;</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-sm font-bold text-emerald-700">
          Aceita corretores{aceita === 'SIM*' ? ' *' : ''}
        </span>
      </div>
      {aceita === 'SIM*' && (
        <p className="text-xs text-emerald-600 ml-8 mt-1">
          * Anuncio inacessivel — nao foi possivel confirmar restricoes
        </p>
      )}
    </div>
  );
}

/* ─── Pagina principal ─── */
export default async function ImovelDetalhePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const imovel = IMOVEIS_MOCK.find((i) => i.id === id);

  if (!imovel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[var(--primary)] transition">
              Inicio
            </Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/imoveis" className="hover:text-[var(--primary)] transition">
              Imoveis
            </Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {imovel.titulo}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Conteudo principal */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Galeria de fotos */}
            <PhotoGallery fotos={imovel.fotos} titulo={imovel.titulo} />

            {/* Header do imovel */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                    imovel.finalidade === 'venda'
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {imovel.finalidade === 'venda' ? 'Venda' : 'Arrendamento'}
                </span>
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                  {imovel.tipologia}
                </span>
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 capitalize">
                  {imovel.tipo}
                </span>
                <span className={`rounded border px-2.5 py-1 text-xs font-medium capitalize ${portalBadgeColor(imovel.portal)}`}>
                  {imovel.portal}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {imovel.titulo}
              </h1>

              {/* Localizacao */}
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  {imovel.morada && `${imovel.morada}, `}
                  {imovel.freguesia && `${imovel.freguesia}, `}
                  {imovel.concelho}, {imovel.distrito}
                  {imovel.codigo_postal && ` - ${imovel.codigo_postal}`}
                </span>
              </div>

              {/* Preco */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[var(--primary)]">
                  {formatarPreco(imovel.preco, imovel.finalidade)}
                </span>
                {imovel.preco_anterior && imovel.preco_anterior > imovel.preco && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatarPreco(imovel.preco_anterior, imovel.finalidade)}
                  </span>
                )}
              </div>
            </div>

            {/* Info rapida */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imovel.area_util && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Area util</p>
                  <p className="text-lg font-bold text-gray-900">{imovel.area_util} m²</p>
                </div>
              )}
              {imovel.quartos !== undefined && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Quartos</p>
                  <p className="text-lg font-bold text-gray-900">{imovel.quartos}</p>
                </div>
              )}
              {imovel.casas_banho !== undefined && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Casas de banho</p>
                  <p className="text-lg font-bold text-gray-900">{imovel.casas_banho}</p>
                </div>
              )}
              {imovel.andar && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Andar</p>
                  <p className="text-lg font-bold text-gray-900">{imovel.andar}</p>
                </div>
              )}
            </div>

            {/* Detalhes adicionais */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Detalhes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado</span>
                  <span className="font-medium text-gray-900">{estadoLabel(imovel.estado)}</span>
                </div>
                {imovel.area_bruta && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Area bruta</span>
                    <span className="font-medium text-gray-900">{imovel.area_bruta} m²</span>
                  </div>
                )}
                {imovel.area_terreno && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Area terreno</span>
                    <span className="font-medium text-gray-900">{imovel.area_terreno} m²</span>
                  </div>
                )}
                {imovel.certificado_energetico && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Certificado energetico</span>
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                      {imovel.certificado_energetico}
                    </span>
                  </div>
                )}
                {imovel.referencia_portal && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Referencia</span>
                    <span className="font-medium text-gray-900 text-xs font-mono">{imovel.referencia_portal}</span>
                  </div>
                )}
                {imovel.data_publicacao && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Publicado em</span>
                    <span className="font-medium text-gray-900">
                      {new Date(imovel.data_publicacao).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Descricao */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Descricao</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {imovel.descricao}
              </p>
            </div>

            {/* Caracteristicas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Caracteristicas</h2>
              <CaracteristicasGrid imovel={imovel} />
            </div>

            {/* Localizacao (placeholder para mapa) */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Localizacao</h2>
              <p className="text-sm text-gray-600 mb-4">
                {imovel.morada && `${imovel.morada}, `}
                {imovel.freguesia && `${imovel.freguesia}, `}
                {imovel.concelho}, {imovel.distrito}
                {imovel.codigo_postal && ` - ${imovel.codigo_postal}`}
              </p>
              {/* Placeholder do mapa */}
              <div className="w-full h-64 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                  <p className="text-sm font-medium">Mapa em breve</p>
                  {imovel.latitude && imovel.longitude && (
                    <p className="text-xs mt-1">
                      {imovel.latitude.toFixed(4)}, {imovel.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Aceita corretores */}
            <AceitaCorretoresBadge
              aceita={imovel.aceita_corretores}
              restricao={imovel.restricao_texto}
            />

            {/* Ver anuncio original */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={imovel.url_original}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] transition shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver anuncio original no {imovel.portal}
              </a>
              <Link
                href="/imoveis"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Voltar a pesquisa
              </Link>
            </div>
          </div>

          {/* Sidebar — formulario de contacto */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Preco destaque (mobile) */}
              <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-4">
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {formatarPreco(imovel.preco, imovel.finalidade)}
                </span>
              </div>

              {/* Formulario de contacto */}
              <ContactForm imovelTitulo={imovel.titulo} imovelId={imovel.id} />

              {/* Info do portal */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Fonte do anuncio</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Portal</span>
                    <span className={`rounded border px-2 py-0.5 text-xs font-medium capitalize ${portalBadgeColor(imovel.portal)}`}>
                      {imovel.portal}
                    </span>
                  </div>
                  {imovel.referencia_portal && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Referencia</span>
                      <span className="font-mono text-xs text-gray-700">{imovel.referencia_portal}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Ultima atualizacao</span>
                    <span className="text-xs text-gray-700">
                      {new Date(imovel.data_atualizacao).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Aceita corretores (sidebar) */}
              <div className="hidden lg:block">
                <AceitaCorretoresBadge
                  aceita={imovel.aceita_corretores}
                  restricao={imovel.restricao_texto}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
