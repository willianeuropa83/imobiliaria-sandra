'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback, useTransition } from 'react';
import { DISTRITOS_PT, TIPOLOGIAS, TIPOS_IMOVEL, PORTAIS } from '@/types/imovel';

const ESTADOS = [
  { value: 'novo', label: 'Novo' },
  { value: 'usado', label: 'Usado' },
  { value: 'renovado', label: 'Renovado' },
  { value: 'em-construcao', label: 'Em construcao' },
  { value: 'para-recuperar', label: 'Para recuperar' },
];

const TIPO_LABELS: Record<string, string> = {
  apartamento: 'Apartamento',
  moradia: 'Moradia',
  terreno: 'Terreno',
  loja: 'Loja',
  escritorio: 'Escritorio',
  armazem: 'Armazem',
  garagem: 'Garagem',
  outro: 'Outro',
};

export default function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ler valores actuais dos search params
  const currentTipologias = searchParams.get('tipologia')?.split(',').filter(Boolean) || [];
  const currentTipos = searchParams.get('tipo')?.split(',').filter(Boolean) || [];
  const currentEstados = searchParams.get('estado')?.split(',').filter(Boolean) || [];
  const currentPortais = searchParams.get('portal')?.split(',').filter(Boolean) || [];
  const currentDistrito = searchParams.get('distrito') || '';
  const currentPrecoMin = searchParams.get('preco_min') || '';
  const currentPrecoMax = searchParams.get('preco_max') || '';
  const currentFinalidade = searchParams.get('finalidade') || '';
  const currentAceitaCorretores = searchParams.get('aceita_corretores') === 'true';
  const currentQuery = searchParams.get('query') || '';

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      // Resetar pagina ao alterar filtros
      params.delete('pagina');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  function toggleArrayParam(paramName: string, value: string, currentValues: string[]) {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    updateParams({ [paramName]: newValues.join(',') });
  }

  function handleClearFilters() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  const hasActiveFilters =
    currentTipologias.length > 0 ||
    currentTipos.length > 0 ||
    currentEstados.length > 0 ||
    currentPortais.length > 0 ||
    currentDistrito !== '' ||
    currentPrecoMin !== '' ||
    currentPrecoMax !== '' ||
    currentFinalidade !== '' ||
    currentAceitaCorretores ||
    currentQuery !== '';

  const filterContent = (
    <div className="space-y-6">
      {/* Pesquisa por texto */}
      <div>
        <label htmlFor="query" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Pesquisar
        </label>
        <input
          id="query"
          type="text"
          placeholder="Ex: apartamento Lisboa..."
          defaultValue={currentQuery}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateParams({ query: (e.target as HTMLInputElement).value });
            }
          }}
          onBlur={(e) => {
            if (e.target.value !== currentQuery) {
              updateParams({ query: e.target.value });
            }
          }}
        />
      </div>

      {/* Finalidade */}
      <div>
        <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Finalidade
        </span>
        <div className="flex gap-2">
          {(['', 'venda', 'arrendamento'] as const).map((f) => (
            <button
              key={f || 'todas'}
              type="button"
              onClick={() => updateParams({ finalidade: f })}
              className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                currentFinalidade === f
                  ? 'filtro-activo'
                  : 'border-gray-300 text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)]'
              }`}
            >
              {f === '' ? 'Todas' : f === 'venda' ? 'Venda' : 'Arrendamento'}
            </button>
          ))}
        </div>
      </div>

      {/* Tipologia */}
      <div>
        <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Tipologia
        </span>
        <div className="grid grid-cols-3 gap-2">
          {TIPOLOGIAS.map((t) => (
            <label
              key={t}
              className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium cursor-pointer transition ${
                currentTipologias.includes(t)
                  ? 'filtro-activo'
                  : 'border-gray-300 text-gray-600 hover:border-[var(--primary)]'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={currentTipologias.includes(t)}
                onChange={() => toggleArrayParam('tipologia', t, currentTipologias)}
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      {/* Tipo de imovel */}
      <div>
        <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Tipo de imovel
        </span>
        <div className="space-y-1.5">
          {TIPOS_IMOVEL.map((tipo) => (
            <label
              key={tipo}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[var(--primary)] transition"
            >
              <input
                type="checkbox"
                checked={currentTipos.includes(tipo)}
                onChange={() => toggleArrayParam('tipo', tipo, currentTipos)}
                className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              {TIPO_LABELS[tipo] || tipo}
            </label>
          ))}
        </div>
      </div>

      {/* Distrito */}
      <div>
        <label htmlFor="distrito" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Distrito
        </label>
        <select
          id="distrito"
          value={currentDistrito}
          onChange={(e) => updateParams({ distrito: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition bg-white"
        >
          <option value="">Todos os distritos</option>
          {DISTRITOS_PT.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Preco */}
      <div>
        <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Preco (EUR)
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentPrecoMin}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition"
            onBlur={(e) => updateParams({ preco_min: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParams({ preco_min: (e.target as HTMLInputElement).value });
            }}
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentPrecoMax}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition"
            onBlur={(e) => updateParams({ preco_max: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParams({ preco_max: (e.target as HTMLInputElement).value });
            }}
          />
        </div>
      </div>

      {/* Estado */}
      <div>
        <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Estado
        </span>
        <div className="space-y-1.5">
          {ESTADOS.map((e) => (
            <label
              key={e.value}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[var(--primary)] transition"
            >
              <input
                type="checkbox"
                checked={currentEstados.includes(e.value)}
                onChange={() => toggleArrayParam('estado', e.value, currentEstados)}
                className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              {e.label}
            </label>
          ))}
        </div>
      </div>

      {/* Portal */}
      <div>
        <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Portal
        </span>
        <div className="space-y-1.5">
          {PORTAIS.map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[var(--primary)] transition capitalize"
            >
              <input
                type="checkbox"
                checked={currentPortais.includes(p)}
                onChange={() => toggleArrayParam('portal', p, currentPortais)}
                className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              {p}
            </label>
          ))}
        </div>
      </div>

      {/* Aceita corretores */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Aceita corretores
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={currentAceitaCorretores}
            onClick={() =>
              updateParams({
                aceita_corretores: currentAceitaCorretores ? '' : 'true',
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              currentAceitaCorretores ? 'bg-[var(--primary)]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                currentAceitaCorretores ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
        <p className="text-[11px] text-gray-400 mt-1">
          Mostrar apenas imoveis que aceitam corretores
        </p>
      </div>

      {/* Limpar filtros */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClearFilters}
          className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition"
        >
          Limpar todos os filtros
        </button>
      )}

      {/* Indicador de loading */}
      {isPending && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 py-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          A filtrar...
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Botao mobile para abrir filtros */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[var(--primary-dark)] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
        {hasActiveFilters && (
          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white text-[var(--primary)] text-xs font-bold">
            !
          </span>
        )}
      </button>

      {/* Painel lateral desktop */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-20 bg-white rounded-xl border border-gray-200 p-5 shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </h2>
          {filterContent}
        </div>
      </aside>

      {/* Slide-in mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Painel */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
              </h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {filterContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
