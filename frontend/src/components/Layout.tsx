import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";

// Shell global de la app: header sticky con brand a la izquierda y
// SearchForm a la derecha, y un <main> con container responsive.
// Server component — el SearchForm adentro ya es "use client".
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-slate-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="text-lg font-bold text-slate-900">
            GitHub Profile
          </Link>
          <SearchForm />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}
