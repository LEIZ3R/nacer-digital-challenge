# Nacer Digital — Full Stack Challenge

Repositorio del reto técnico para Nacer Digital. Monorepo con dos paquetes independientes:

- **[`backend/`](./backend)** — NestJS API que consulta GitHub y expone `GET /user/:username`.
- **[`frontend/`](./frontend)** — Next.js 14 (App Router) que consume ese endpoint y renderiza el perfil.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | NestJS 10 + `@nestjs/axios` + `class-validator` |
| Frontend | Next.js 14 (App Router) + TypeScript estricto + Tailwind CSS |
| Tests | Jest (Nest) + React Testing Library |
| Deploy backend | [Render](https://render.com) (free tier) |
| Deploy frontend | [Vercel](https://vercel.com) |

## Estructura

```
.
├── backend/      # API NestJS
├── frontend/     # Web Next.js
└── README.md     # este archivo
```

## Cómo correrlo en local

Vas a necesitar **dos terminales**, una por paquete.

### Backend

```bash
cd backend
cp .env.example .env       # editar con tu GITHUB_TOKEN opcional
npm install
npm run start:dev          # http://localhost:3001
```

Endpoint disponible: `GET http://localhost:3001/user/:username`

### Frontend

```bash
cd frontend
cp .env.example .env.local  # editar con la URL del backend
npm install
npm run dev                # http://localhost:3000
```

## Despliegue

- **Backend:** Render conecta al repo, build `npm run build`, start `npm run start:prod`. Env vars en el dashboard.
- **Frontend:** Vercel conecta al repo, root dir `frontend/`. Env var `NEXT_PUBLIC_API_URL` apuntando al backend.

## Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Licencia

MIT
