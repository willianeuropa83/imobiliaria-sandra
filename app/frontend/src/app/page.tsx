import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";

/* ---------- Dados placeholder para destaque ---------- */
const IMOVEIS_DESTAQUE = [
  {
    id: "1",
    titulo: "Apartamento T2 renovado no centro de Lisboa",
    preco: 285000,
    tipologia: "T2",
    area: 85,
    distrito: "Lisboa",
    concelho: "Lisboa",
    foto_principal: "",
    portal: "idealista",
    finalidade: "venda" as const,
    aceita_corretores: "SIM" as const,
  },
  {
    id: "2",
    titulo: "Moradia T4 com jardim e piscina em Cascais",
    preco: 675000,
    tipologia: "T4",
    area: 220,
    distrito: "Lisboa",
    concelho: "Cascais",
    foto_principal: "",
    portal: "imovirtual",
    finalidade: "venda" as const,
    aceita_corretores: "SIM" as const,
  },
  {
    id: "3",
    titulo: "Apartamento T1 junto ao metro em Matosinhos",
    preco: 650,
    tipologia: "T1",
    area: 55,
    distrito: "Porto",
    concelho: "Matosinhos",
    foto_principal: "",
    portal: "olx",
    finalidade: "arrendamento" as const,
    aceita_corretores: "NAO" as const,
  },
  {
    id: "4",
    titulo: "Terreno urbano com 500m² em Braga",
    preco: 95000,
    tipologia: "T0",
    area: 500,
    distrito: "Braga",
    concelho: "Braga",
    foto_principal: "",
    portal: "supercasa",
    finalidade: "venda" as const,
    aceita_corretores: "SIM" as const,
  },
  {
    id: "5",
    titulo: "Apartamento T3 com varanda panorâmica no Porto",
    preco: 420000,
    tipologia: "T3",
    area: 130,
    distrito: "Porto",
    concelho: "Porto",
    foto_principal: "",
    portal: "era",
    finalidade: "venda" as const,
    aceita_corretores: "SIM*" as const,
  },
  {
    id: "6",
    titulo: "Moradia T3 rústica recuperada no Algarve",
    preco: 350000,
    tipologia: "T3",
    area: 150,
    distrito: "Faro",
    concelho: "Loulé",
    foto_principal: "",
    portal: "remax",
    finalidade: "venda" as const,
    aceita_corretores: "SIM" as const,
  },
];

/* ---------- Componente auxiliar: passo "Como funciona" ---------- */
function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg">
        {icon}
      </div>
      <span className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--primary-light)]">
        Passo {step}
      </span>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="max-w-xs text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}

/* ================================================================
   HOMEPAGE
   ================================================================ */
export default function Home() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)]">
        {/* Padrão decorativo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Encontre o seu imóvel
              <br className="hidden sm:block" /> em Portugal
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-blue-100 sm:mt-6 sm:text-lg">
              Milhares de imóveis dos principais portais, num só lugar.
              Pesquise, compare e encontre a casa ideal para si.
            </p>
          </div>

          {/* Barra de pesquisa */}
          <div className="mt-10 sm:mt-12">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ───────── Estatísticas ───────── */}
      <section className="-mt-6 relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { value: "12 500", label: "Imóveis disponíveis" },
            { value: "8", label: "Portais agregados" },
            { value: "Diariamente", label: "Actualizado" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-white px-6 py-5 shadow-sm"
            >
              <span className="text-2xl font-extrabold text-[var(--primary)]">
                {stat.value}
              </span>
              <span className="mt-1 text-sm text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Imóveis em Destaque ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Imóveis em Destaque
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
            Uma selecção dos melhores imóveis disponíveis neste momento
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IMOVEIS_DESTAQUE.map((imovel) => (
            <PropertyCard key={imovel.id} {...imovel} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/imoveis"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--primary)] px-8 py-3 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-white"
          >
            Ver todos os imóveis
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* ───────── Como funciona ───────── */}
      <section className="border-t border-[var(--border)] bg-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Como funciona
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
              Encontre o seu imóvel em três passos simples
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <StepCard
              step={1}
              icon={
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              }
              title="Pesquise"
              description="Introduza a localização ou palavra-chave. A nossa plataforma reúne anúncios de 8 portais imobiliários."
            />
            <StepCard
              step={2}
              icon={
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              }
              title="Filtre"
              description="Refine a pesquisa por preço, tipologia, área, distrito e muito mais. Encontre exactamente o que procura."
            />
            <StepCard
              step={3}
              icon={
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              }
              title="Contacte"
              description="Aceda ao anúncio original no portal e entre em contacto directo com o anunciante ou agência."
            />
          </div>
        </div>
      </section>
    </>
  );
}
