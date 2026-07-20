"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const portals = [
    { name: "Idealista", url: "https://www.idealista.pt" },
    { name: "Imovirtual", url: "https://www.imovirtual.com" },
    { name: "OLX", url: "https://www.olx.pt" },
    { name: "Supercasa", url: "https://supercasa.pt" },
  ];

  return (
    <footer className="bg-[#1e293b] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1 — About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              Imobiliária Sandra
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Especialistas em mediação imobiliária em Portugal. Ajudamos a
              encontrar o imóvel ideal para si, com um serviço personalizado e
              transparente.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <svg
                className="h-4 w-4 text-[#60a5fa]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>info@imobiliariasandra.pt</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <svg
                className="h-4 w-4 text-[#60a5fa]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+351 912 345 678</span>
            </div>
          </div>

          {/* Column 2 — Portals */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              Portais Agregados
            </h3>
            <ul className="space-y-2">
              {portals.map((portal) => (
                <li key={portal.name}>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <svg
                      className="h-3.5 w-3.5 text-[#60a5fa]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {portal.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <svg
                  className="h-4 w-4 mt-0.5 text-[#60a5fa] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Portugal</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-[#60a5fa] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+351 912 345 678</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-[#60a5fa] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>info@imobiliariasandra.pt</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-[#60a5fa] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Seg–Sex: 9h00–18h00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-gray-400">
            &copy; {currentYear} Imobiliária Sandra. Todos os direitos
            reservados. AMI 00000
          </p>
        </div>
      </div>
    </footer>
  );
}
