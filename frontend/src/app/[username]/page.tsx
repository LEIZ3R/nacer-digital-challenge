import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchUser, UserNotFoundError } from "@/lib/api";
import { Layout } from "@/components/Layout";
import { UserCard } from "@/components/UserCard";
import { UserStats } from "@/components/UserStats";
import { UserMeta } from "@/components/UserMeta";

type Params = { username: string };

// generateMetadata corre en el server antes de la página. Si el user
// existe, seteamos el title con su nombre real. Si el backend tira 404,
// dejamos un title genérico. Otros errores se propagan a error.tsx.
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const user = await fetchUser(params.username);
    return {
      title: `${user.name ?? user.login} (@${user.login})`,
      description: user.bio ?? `Perfil público de ${user.login} en GitHub.`,
    };
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return { title: "Usuario no encontrado" };
    }
    throw err;
  }
}

export default async function UserPage({
  params,
}: {
  params: Params;
}) {
  let user;
  try {
    user = await fetchUser(params.username);
  } catch (err) {
    // 404 → not-found.tsx. Cualquier otro error (500, 502, network) se
    // deja subir para que lo capture error.tsx.
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
