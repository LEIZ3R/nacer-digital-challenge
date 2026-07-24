import { formatDate } from "@/lib/format";
import type { User } from "@/types/user";

type Item = {
  key: string;
  icon: string;
  label: string;
  value: string;
  href?: string;
};

// Lista de "meta" del usuario: location, company, twitter, fecha de join.
// Cada item es condicional — si el campo es null, no se renderiza.
// `joinedAt` siempre se muestra: createdAt es obligatorio en el DTO.
export function UserMeta({ user }: { user: User }) {
  const items: Item[] = [
    user.location && {
      key: "location",
      icon: "📍",
      label: "Ubicación",
      value: user.location,
    },
    user.company && {
      key: "company",
      icon: "🏢",
      label: "Empresa",
      value: user.company,
    },
    user.twitter && {
      key: "twitter",
      icon: "🐦",
      label: "Twitter",
      value: `@${user.twitter}`,
      href: `https://twitter.com/${user.twitter}`,
    },
    {
      key: "joined",
      icon: "📅",
      label: "Se unió",
      value: formatDate(user.createdAt),
    },
  ].filter((x): x is Item => Boolean(x));

  return (
    <section
      aria-label="Información adicional"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
        Info
      </h2>
      <ul className="space-y-3">
        {items.map((it) => {
          const inner = (
            <>
              <span aria-hidden className="text-lg">
                {it.icon}
              </span>
              <span className="text-sm text-slate-500">{it.label}:</span>
              <span className="text-sm font-medium text-slate-900">
                {it.value}
              </span>
            </>
          );

          return (
            <li key={it.key} className="flex items-center gap-2">
              {it.href ? (
                <a
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  {inner}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2">
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
