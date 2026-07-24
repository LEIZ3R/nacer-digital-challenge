import Image from "next/image";
import type { User } from "@/types/user";

// Tarjeta principal: avatar grande, nombre, @username, bio (si hay) y CTA
// al perfil de GitHub. Stack vertical: pensada para vivir sola en la
// columna izquierda del grid (md:col-span-1). Server component puro.
export function UserCard({ user }: { user: User }) {
  const hasName = Boolean(user.name);

  return (
    <article className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col items-center text-center">
        <Image
          src={user.avatarUrl}
          alt={`Avatar de ${user.login}`}
          width={128}
          height={128}
          priority
          className="h-32 w-32 rounded-full border-4 border-white shadow-md"
        />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">
          {hasName ? user.name : `@${user.login}`}
        </h1>
        {hasName && (
          <p className="mt-1 text-sm text-slate-500">@{user.login}</p>
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
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
        >
          Ver en GitHub
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </article>
  );
}
