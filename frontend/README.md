# Nacer Digital — Frontend

Next.js 14 (App Router) que consume la API del backend NestJS para buscar
perfiles públicos de GitHub.

## Requisitos

- Node 20+
- pnpm 9+
- El backend corriendo en `http://localhost:3001` (ver `../backend/README.md`)

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable               | Descripción              | Default                  |
| ---------------------- | ------------------------ | ------------------------ |
| `NEXT_PUBLIC_API_URL`  | URL del backend NestJS   | `http://localhost:3001`  |

`NEXT_PUBLIC_*` se embebe en el bundle del cliente. En este reto no es
un problema: el endpoint no requiere auth y la URL ya queda pública en
el repo.

## Scripts

- `pnpm dev` — dev server en `:3000`
- `pnpm build` — build de producción
- `pnpm start` — serve del build
- `pnpm lint` — ESLint con `next lint`

## Estructura

```
src/
├── app/
│   ├── layout.tsx           # root layout + tipografía (Geist)
│   ├── page.tsx             # / — home con SearchForm
│   ├── loading.tsx          # skeleton global
│   ├── error.tsx            # error boundary (client)
│   ├── not-found.tsx        # 404 cuando el user no existe
│   └── [username]/page.tsx  # /:username — perfil
├── components/
│   ├── UserCard.tsx         # avatar + nombre + bio
│   ├── UserStats.tsx        # 3 cards: repos, followers, following
│   ├── UserMeta.tsx         # location, company, twitter, joined
│   ├── SearchForm.tsx       # 'use client' — input + submit
│   └── Skeleton.tsx         # loading state reutilizable
├── lib/
│   ├── api.ts               # fetchUser() — único punto de contacto
│   └── format.ts            # formatNumber, formatDate
└── types/
    └── user.ts              # tipo User compartido
```

## Decisiones de diseño

- **Server Components por default.** Home y perfil son server components.
  Solo `SearchForm` y `error.tsx` son client.
- **`cache: 'no-store'` en el fetch.** Los perfiles cambian seguido
  (followers, bio, etc.). Sin caché por request.
- **`generateMetadata` en `/[username]`.** Para que la tab del browser
  muestre el nombre real del user.
- **404 → `notFound()`.** El backend responde 404 con un shape conocido;
  mapeamos a `UserNotFoundError` y disparamos `notFound()` para que
  `not-found.tsx` se renderice. Otros errores suben a `error.tsx`.
- **`UserNotFoundError` extiende `Error`.** Permite distinguir 404 de
  fallos de red sin parsear strings.
- **Sin librerías de UI externas.** Tailwind puro + componentes
  presentacionales. Sin shadcn, sin MUI.
- **Sin dark mode.** No estaba en el spec; mantener simple.
- **`@/*` apunta a `./src/*`** (default de create-next-app).
- **`next/font/local` con Geist.** Sin requests externos, fuentes
  auto-servidas por Next.
- **`useTransition` en `SearchForm`.** `isPending` mientras Next resuelve
  el server component de destino. Deshabilita el botón y muestra
  "Buscando…".

## Flujo de datos

1. El usuario tipea un username en `/`
2. `SearchForm` valida localmente (regex de GitHub) y hace
   `router.push('/' + username)`
3. Next navega a `/[username]`, server component
4. La página llama a `fetchUser(username)` en `lib/api.ts`
5. `fetchUser` hace `fetch` al backend, mapea 404 →
   `UserNotFoundError`, otros errores → `Error`
6. Si 404 → `notFound()` → `not-found.tsx`
7. Si OK → renderiza `<UserCard>`, `<UserStats>`, `<UserMeta>`

## Próximos pasos

- Tests con Vitest + React Testing Library para `SearchForm` (validación
  + navegación) y para los componentes presentacionales (snapshot).
- Loading state per-segment (`app/[username]/loading.tsx`) en lugar del
  global, para que el skeleton de la home no aparezca al navegar entre
  perfiles.
- Streaming con `<Suspense>` para que el header/footer aparezcan antes
  que la data del perfil.
- ISR con `next: { revalidate: 60 }` si el costo de cada request al
  backend empieza a importar.
- Open Graph image dinámica por user (`opengraph-image.tsx`).
