"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

// Regex oficial de GitHub para usernames (single-line version, sin anchor):
// empieza con alfanum, puede tener guiones pero no al final, max 39 chars.
const GITHUB_USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

type Props = {
  defaultValue?: string;
};

export function SearchForm({ defaultValue = "" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  // useTransition marca la navegación como transición de baja prioridad.
  // Mientras Next está resolviendo el server component de /:username,
  // isPending queda en true y deshabilitamos el botón. Mejor UX que
  // manejarlo a mano.
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Ingresá un username");
      return;
    }
    if (!GITHUB_USERNAME_RE.test(trimmed)) {
      setError("Username inválido (solo letras, números y guiones, máx 39)");
      return;
    }

    setError(null);
    startTransition(() => {
      router.push(`/${trimmed}`);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Buscar usuario de GitHub"
      className="mx-auto flex w-full max-w-md flex-col gap-2"
    >
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="octocat"
          aria-label="Username de GitHub"
          aria-invalid={Boolean(error)}
          className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Buscando…" : "Buscar"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
