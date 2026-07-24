// Skeletons reusables para estados de carga. animate-pulse es una utility
// de Tailwind — sin librerías externas.
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-md bg-slate-200 ${className}`}
    />
  );
}

export function UserCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-2 h-9 w-32" />
        </div>
      </div>
    </div>
  );
}

export function UserStatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
        >
          <Skeleton className="mx-auto h-7 w-16" />
          <Skeleton className="mx-auto mt-2 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
