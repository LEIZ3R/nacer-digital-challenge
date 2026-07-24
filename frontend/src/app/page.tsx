import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";

// Home: server component. Solo el SearchForm es client (necesita useRouter
// y estado controlado). La home no fetchea al backend: la búsqueda vive
// en /:username, que es server-rendered con datos frescos en cada request.
type SearchParams = { username?: string };

export default function Home({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  // Si la URL trae ?username=foo, lo pre-cargamos en el input. Útil para
  // compartir links y para que un refresh no pierda lo que el usuario
  // había tipeado.
  const initial = searchParams?.username?.trim() ?? "";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold text-slate-900 hover:text-slate-700"
        >
          Nacer Digital
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-500 transition hover:text-slate-900"
        >
          github.com ↗
        </a>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Buscá un usuario de GitHub
        </h1>
        <p className="mt-3 max-w-md text-slate-600">
          Ingresá un username y mirá su perfil público al instante.
        </p>
        <div className="mt-8 w-full">
          <SearchForm defaultValue={initial} />
        </div>
      </section>

      <footer className="mt-16 text-center text-xs text-slate-400">
        Hecho con Next.js 14 · Datos vía la API propia del backend
      </footer>
    </main>
  );
}
