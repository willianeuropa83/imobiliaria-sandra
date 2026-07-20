'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';

const ORDENACAO_LABELS: Record<string, string> = {
  data_desc: 'Mais recentes',
  preco_asc: 'Preco: menor primeiro',
  preco_desc: 'Preco: maior primeiro',
  area_desc: 'Area: maior primeiro',
};

export default function SortSelectClient({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    if (value && value !== 'data_desc') {
      params.set('ordenar_por', value);
    } else {
      params.delete('ordenar_por');
    }
    params.delete('pagina');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="ordenar_por" className="text-xs text-gray-500 whitespace-nowrap">
        Ordenar por:
      </label>
      <select
        id="ordenar_por"
        value={currentSort}
        onChange={handleChange}
        disabled={isPending}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition disabled:opacity-50"
      >
        {Object.entries(ORDENACAO_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {isPending && (
        <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
    </div>
  );
}
