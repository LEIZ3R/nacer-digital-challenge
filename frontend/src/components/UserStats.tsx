import { formatNumber } from "@/lib/format";
import type { User } from "@/types/user";

// Grid de 3 stats: repos públicos, seguidores, siguiendo.
// Números formateados con Intl.NumberFormat (miles con coma en en-US).
export function UserStats({ user }: { user: User }) {
  const items: { label: string; value: number }[] = [
    { label: "Repos públicos", value: user.publicRepos },
    { label: "Seguidores", value: user.followers },
    { label: "Siguiendo", value: user.following },
  ];

  return (
    <section
      aria-label="Estadísticas del usuario"
      className="grid grid-cols-3 gap-3"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
        >
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            {formatNumber(item.value)}
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
            {item.label}
          </p>
        </div>
      ))}
    </section>
  );
}
