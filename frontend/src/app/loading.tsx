import { Skeleton, UserCardSkeleton, UserStatsSkeleton } from "@/components/Skeleton";

// Loading state global: Next lo muestra mientras un server component está
// resolviendo. Aplica a la home (poco probable) y a /:username (cada vez
// que se navega a un perfil nuevo).
export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <UserCardSkeleton />
        </div>
        <div className="space-y-6 md:col-span-2">
          <UserStatsSkeleton />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-4 w-32" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
