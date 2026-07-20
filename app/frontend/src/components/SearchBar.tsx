"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIPOLOGIAS = ["T0", "T1", "T2", "T3", "T4", "T5+"] as const;
const TIPOS_IMOVEL = [
  { value: "apartamento", label: "Apartamento" },
  { value: "moradia", label: "Moradia" },
  { value: "terreno", label: "Terreno" },
  { value: "loja", label: "Loja" },
  { value: "escritorio", label: "Escritório" },
  { value: "armazem", label: "Armazém" },
] as const;

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [finalidade, setFinalidade] = useState<"venda" | "arrendamento">("venda");
  const [tipologia, setTipologia] = useState("");
  const [tipo, setTipo] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    params.set("finalidade", finalidade);
    if (tipologia) params.set("tipologia", tipologia);
    if (tipo) params.set("tipo", tipo);
    if (precoMin) params.set("preco_min", precoMin);
    if (precoMax) params.set("preco_max", precoMax);

    router.push(`/imoveis?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6"
    >
      {/* Campo de pesquisa principal */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Localização, distrito, concelho ou palavra-chave..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[var(--primary-light)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-light)]/20"
        />
      </div>

      {/* Filtros rápidos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2">
        {/* Finalidade (toggle) */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Finalidade
          </label>
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
              type="button"
              onClick={() => setFinalidade("venda")}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                finalidade === "venda"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setFinalidade("arrendamento")}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                finalidade === "arrendamento"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Arrendar
            </button>
          </div>
        </div>

        {/* Tipologia */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Tipologia
          </label>
          <select
            value={tipologia}
            onChange={(e) => setTipologia(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none transition-colors focus:border-[var(--primary-light)] focus:ring-2 focus:ring-[var(--primary-light)]/20"
          >
            <option value="">Todas</option>
            {TIPOLOGIAS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de imóvel */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Tipo
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none transition-colors focus:border-[var(--primary-light)] focus:ring-2 focus:ring-[var(--primary-light)]/20"
          >
            <option value="">Todos</option>
            {TIPOS_IMOVEL.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Preço mínimo */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Preço mín.
          </label>
          <input
            type="number"
            value={precoMin}
            onChange={(e) => setPrecoMin(e.target.value)}
            placeholder="0 €"
            min={0}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none transition-colors focus:border-[var(--primary-light)] focus:ring-2 focus:ring-[var(--primary-light)]/20"
          />
        </div>

        {/* Preço máximo */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Preço máx.
          </label>
          <input
            type="number"
            value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value)}
            placeholder="Sem limite"
            min={0}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none transition-colors focus:border-[var(--primary-light)] focus:ring-2 focus:ring-[var(--primary-light)]/20"
          />
        </div>
      </div>

      {/* Botão pesquisar */}
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
        >
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          Pesquisar
        </button>
      </div>
    </form>
  );
}
