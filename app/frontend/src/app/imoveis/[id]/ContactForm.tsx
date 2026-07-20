'use client';

import { useState } from 'react';

interface ContactFormProps {
  imovelTitulo: string;
  imovelId: string;
}

export default function ContactForm({ imovelTitulo, imovelId }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder — integracao futura com API
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Mensagem enviada</h3>
          <p className="text-xs text-gray-500">
            Entraremos em contacto consigo brevemente.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-3 text-xs text-[var(--primary)] hover:underline"
          >
            Enviar nova mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Interessado neste imovel?</h3>
      <p className="text-xs text-gray-500 mb-4">
        Preencha o formulario e entraremos em contacto.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="hidden" name="imovel_id" value={imovelId} />
        <input type="hidden" name="imovel_titulo" value={imovelTitulo} />

        <div>
          <label htmlFor="contact_nome" className="block text-xs font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            id="contact_nome"
            name="nome"
            type="text"
            required
            placeholder="O seu nome"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="contact_telefone" className="block text-xs font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            id="contact_telefone"
            name="telefone"
            type="tel"
            required
            placeholder="+351 900 000 000"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="contact_email" className="block text-xs font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="contact_email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="contact_mensagem" className="block text-xs font-medium text-gray-700 mb-1">
            Mensagem
          </label>
          <textarea
            id="contact_mensagem"
            name="mensagem"
            rows={4}
            required
            placeholder={`Gostaria de obter mais informacoes sobre: ${imovelTitulo}`}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] transition shadow-sm"
        >
          Enviar mensagem
        </button>

        <p className="text-[10px] text-gray-400 text-center">
          Ao submeter, aceita a nossa politica de privacidade.
        </p>
      </form>
    </div>
  );
}
