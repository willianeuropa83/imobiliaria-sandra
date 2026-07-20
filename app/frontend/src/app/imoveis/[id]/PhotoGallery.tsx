'use client';

import { useState } from 'react';

interface PhotoGalleryProps {
  fotos: string[];
  titulo: string;
}

export default function PhotoGallery({ fotos, titulo }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (fotos.length === 0) {
    return (
      <div className="aspect-video w-full rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <p className="text-sm">Sem fotografias disponiveis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Foto principal */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        <img
          src={fotos[selectedIndex]}
          alt={`${titulo} - Foto ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Contador */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {selectedIndex + 1} / {fotos.length}
        </div>

        {/* Setas de navegacao */}
        {fotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setSelectedIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md transition"
              aria-label="Foto anterior"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md transition"
              aria-label="Proxima foto"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {fotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {fotos.map((foto, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                index === selectedIndex
                  ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={foto}
                alt={`${titulo} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
