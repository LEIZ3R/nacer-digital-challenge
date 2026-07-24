import Link from "next/link";

// 404 custom. Lo dispara Next cuando un server component llama a
// notFound() — en nuestra app, cuando el backend responde 404 al buscar
// un username.
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">
        Usuario no encontrado
      </h1>
      <p className="mt-2 text-slate-600">
        No pudimos encontrar ese perfil en GitHub. Verificá que el username
        esté bien escrito.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Buscar otro
      </Link>
    </main>
  );
}
