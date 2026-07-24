import { formatNumber } from "@/lib/format";
import type { User } from "@/types/user";

// Tres stat cards individuales en grid: repos públicos, seguidores,
// siguiendo. Números formateados con Intl.NumberFormat (miles con coma
// en en-US). Las labels se ven en mayúsculas vía CSS (uppercase +
// tracking-wider), por eso el source queda en minúsculas.
export function UserStats({ user }: { user: User }) {
  const items: { label: string; value: number }[] = [
    { label: "Repos púb.", value: user.publicRepos },
    { label: "Seguidores", value: user.followers },
    { label: "Siguiendo", value: user.following },
  ];

  return (
    <section
      aria-label="Estadísticas del usuario"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm"
        >
          <p className="text-2xl font-bold tabular-nums text-slate-900 md:text-3xl">
            {formatNumber(item.value)}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            {item.label}
          </p>
        </div>
      ))}
    </section>
  );
}
