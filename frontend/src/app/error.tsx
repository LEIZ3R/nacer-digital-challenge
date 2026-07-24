"use client";

import Link from "next/link";
import { useEffect } from "react";

// Error boundary obligatorio: es un client component porque necesita
// hooks (useEffect) y callbacks del runtime de Next. Captura cualquier
// error que se tire en un server component descendiente.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log server-side: en prod esto aparece en el log del runtime de Next.
    // En dev, también en la consola del browser.
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">
        Algo salió mal
      </h1>
      <p className="mt-2 text-slate-600">
        El backend no respondió como esperábamos. Probá de nuevo en unos
        segundos.
      </p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-slate-400">
          id: {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
