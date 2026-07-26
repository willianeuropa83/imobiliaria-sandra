"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const portals = [
    { name: "Idealista", url: "https://www.idealista.pt" },
    { name: "Imovirtual", url: "https://www.imovirtual.com" },
    { name: "OLX", url: "https://www.olx.pt" },
    { name: "Supercasa", url: "https://supercasa.pt" },
    { name: "RE/MAX", url: "https://www.remax.pt" },
    { name: "ERA", url: "https://www.era.pt" },
    { name: "Century 21", url: "https://www.century21.pt" },
    { name: "CustoJusto", url: "https://www.custojusto.pt" },
    { name: "Caixa Imobiliário", url: "https://www.caixaimobiliario.pt" },
    { name: "Casa Sapo", url: "https://casa.sapo.pt" },
    { name: "ComprarCasa", url: "https://www.comprarcasa.pt" },
    { name: "KW Portugal", url: "https://www.kwportugal.pt" },
    { name: "BPI Expresso", url: "https://www.bpiexpressoimobiliario.pt" },
    { name: "Engel & Völkers", url: "https://www.engelvoelkers.com/pt/pt" },
  ];

  return (
    <footer className="bg-[#1e293b] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          {/* Branding */}
          <div className="shrink-0">
            <h3 className="text-white text-lg font-bold mb-1">
              Imobiliária Sandra
            </h3>
            <p className="text-xs text-gray-400">
              Todos os portais imobiliários num só lugar.
            </p>
          </div>

          {/* Portais */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">
              Portais Agregados
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {portals.map((portal) => (
                <a
                  key={portal.name}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:text-white transition-colors"
                >
                  {portal.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-xs text-gray-500">
            &copy; {currentYear} Imobiliária Sandra
          </p>
        </div>
      </div>
    </footer>
  );
}
