import Link from "next/link";

interface PropertyCardProps {
  id: string;
  titulo: string;
  preco: number;
  preco_anterior?: number;
  tipologia: string;
  area?: number;
  distrito: string;
  concelho: string;
  foto_principal?: string;
  portal: string;
  finalidade: string;
  aceita_corretores: string;
  data_publicacao?: string;
}

/** Preço por m² — a métrica que uma corretora usa para comparar zonas. */
function precoPorM2(preco: number, area?: number): string | null {
  if (!preco || !area || area <= 0) return null;
  const valor = Math.round(preco / area);
  if (!isFinite(valor) || valor <= 0) return null;
  return `${new Intl.NumberFormat('pt-PT').format(valor)} €/m²`;
}

/** Há quanto tempo o imóvel está no mercado. */
function diasNoMercado(desde?: string): string | null {
  if (!desde) return null;
  const inicio = new Date(desde).getTime();
  if (!isFinite(inicio)) return null;
  const dias = Math.floor((Date.now() - inicio) / 86_400_000);
  if (dias < 0) return null;
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Há 1 dia';
  if (dias < 30) return `Há ${dias} dias`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? 'Há 1 mês' : `Há ${meses} meses`;
}

/** Etiqueta de descida ou subida de preço face ao valor anterior. */
function variacaoPreco(preco: number, anterior?: number) {
  if (!anterior || !preco || anterior === preco) return null;

  const desceu = preco < anterior;
  const pct = Math.round(Math.abs((preco - anterior) / anterior) * 100);
  if (pct < 1) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        desceu ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}
      title={`Preço anterior: ${new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(anterior)}`}
    >
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={desceu ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : 'M5 10l7-7m0 0l7 7m-7-7v18'}
        />
      </svg>
      {desceu ? '−' : '+'}
      {pct}%
    </span>
  );
}

function formatPreco(preco: number, finalidade: string): string {
  const formatted = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(preco);
  return finalidade === "arrendamento" ? `${formatted}/mês` : formatted;
}

function corretoresBadge(aceita: string) {
  if (aceita === "NAO") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Não aceita corretores
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Aceita corretores{aceita === "SIM*" ? " *" : ""}
    </span>
  );
}

export default function PropertyCard({
  id,
  titulo,
  preco,
  preco_anterior,
  tipologia,
  area,
  distrito,
  concelho,
  foto_principal,
  portal,
  finalidade,
  aceita_corretores,
  data_publicacao,
}: PropertyCardProps) {
  const eurM2 = precoPorM2(preco, area);
  const noMercado = diasNoMercado(data_publicacao);
  return (
    <Link
      href={`/imoveis/${id}`}
      className="imovel-card group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm"
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {foto_principal ? (
          <img
            src={foto_principal}
            alt={titulo}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>
        )}

        {/* Badge de preço — esconder quando preco é 0 */}
        {preco > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="preco-badge text-sm shadow-md">
              {formatPreco(preco, finalidade)}
            </span>
          </div>
        )}

        {/* Finalidade */}
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            {finalidade === "venda" ? "Venda" : "Arrendamento"}
          </span>
        </div>

        {/* Ha quanto tempo esta no mercado */}
        {noMercado && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {noMercado}
            </span>
          </div>
        )}
      </div>

      {/* Detalhes */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Titulo */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-[var(--primary)]">
          {titulo}
        </h3>

        {/* Tipologia, area e variacao de preco */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
            {tipologia}
          </span>
          {variacaoPreco(preco, preco_anterior)}
          {eurM2 && (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {eurM2}
            </span>
          )}
          {area && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
              {area} m²
            </span>
          )}
        </div>

        {/* Localização */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg
            className="h-3.5 w-3.5 shrink-0 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <span className="truncate">
            {concelho}, {distrito}
          </span>
        </div>

        {/* Separador */}
        <div className="mt-auto border-t border-gray-100 pt-2">
          <div className="flex items-center justify-between gap-2">
            {/* Aceita corretores */}
            {corretoresBadge(aceita_corretores)}
            {/* Portal */}
            <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
              {portal}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
