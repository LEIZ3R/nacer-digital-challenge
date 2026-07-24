import type { User } from "@/types/user";

// Error tipado para distinguir "el backend dijo 404" de "falló la red".
// Permite que la página decida si dispara notFound() o deja subir el
// error al boundary.
export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

// Único punto de contacto con el backend. cache: "no-store" para que
// cada request traiga datos frescos (un perfil cambia seguido: followers,
// bio, etc.). Si en el futuro queremos un TTL, acá es donde se cambia.
export async function fetchUser(username: string): Promise<User> {
  // Normalizamos para tolerar trailing slash en la env var: si alguien
  // setea NEXT_PUBLIC_API_URL=https://api.com/ no queremos terminar
  // pegando a https://api.com//user/foo con doble slash.
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const res = await fetch(`${baseUrl}/user/${username}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) throw new UserNotFoundError();
  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }

  return (await res.json()) as User;
}
