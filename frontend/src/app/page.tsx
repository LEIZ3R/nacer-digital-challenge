import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchUser, UserNotFoundError } from "@/lib/api";
import { Layout } from "@/components/Layout";
import { UserCard } from "@/components/UserCard";
import { UserStats } from "@/components/UserStats";
import { UserMeta } from "@/components/UserMeta";

// Home: server component que renderiza directo el perfil del usuario
// default (configurable vía env). NO redirige: la URL queda en `/`.
// Si el default no existe → notFound() → not-found.tsx.
// Si hay otro error (red, 5xx) → throw → error.tsx.
const DEFAULT_USERNAME = process.env.NEXT_PUBLIC_DEFAULT_USERNAME ?? "LEIZ3R";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const user = await fetchUser(DEFAULT_USERNAME);
    return {
      title: user.name ?? user.login,
      description: user.bio ?? `Perfil público de ${user.login} en GitHub.`,
    };
  } catch {
    // Si falla (404, 5xx, red), caemos al title default del root layout.
    return {};
  }
}

export default async function Home() {
  let user;
  try {
    user = await fetchUser(DEFAULT_USERNAME);
  } catch (err) {
    if (err instanceof UserNotFoundError) notFound();
    throw err;
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <UserCard user={user} />
        </div>
        <div className="space-y-6 md:col-span-2">
          <UserStats user={user} />
          <UserMeta user={user} />
        </div>
      </div>
    </Layout>
  );
}
