import Image from "next/image";
import type { User } from "@/types/user";

// Tarjeta principal: avatar, nombre, bio y CTA al perfil de GitHub.
// Server component puro — no usa hooks, no toca estado.
export function UserCard({ user }: { user: User }) {
  const displayName = user.name ?? user.login;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
        <Image
          src={user.avatarUrl}
          alt={`Avatar de ${user.login}`}
          width={120}
          height={120}
          priority
          className="h-28 w-28 rounded-full border border-slate-200"
        />
        <div className="mt-4 flex-1 sm:mt-0">
          <h1 className="text-2xl font-semibold text-slate-900">
            {displayName}
          </h1>
          {user.name && (
            <p className="text-sm text-slate-500">@{user.login}</p>
          )}
          {user.bio && (
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {user.bio}
            </p>
          )}
          <a
            href={user.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Ver en GitHub
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
