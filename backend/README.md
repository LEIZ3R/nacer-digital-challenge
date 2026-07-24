# Nacer Digital — Backend

NestJS 10 API que consulta GitHub y expone el perfil de un usuario. Pensado como reto técnico de entrevista, no para producción.

## Stack

- **NestJS 10** con `@nestjs/axios`
- **TypeScript** estricto
- **class-validator** + **class-transformer** para DTOs
- **@nestjs/config** + **joi** para variables de entorno
- **Jest** + **supertest** + **nock** para tests

## Requisitos

- Node 20+ (desarrollado y probado con Node 24)
- pnpm 9+ (desarrollado y probado con pnpm 11)

## Setup

```bash
cd backend
cp .env.example .env       # editar si tenés GITHUB_TOKEN
pnpm install
pnpm run start:dev         # http://localhost:3001
```

## Variables de entorno

| Variable          | Default                     | Descripción                                          |
| ----------------- | --------------------------- | ---------------------------------------------------- |
| `PORT`            | `3001`                      | Puerto del servidor HTTP                             |
| `GITHUB_API_URL`  | `https://api.github.com`    | Base URL de la API de GitHub                         |
| `GITHUB_TOKEN`    | `""`                        | Personal access token (opcional pero recomendado)   |
| `CORS_ORIGIN`     | `http://localhost:3000`     | Orígenes permitidos. Vacío = permite todos (dev)     |
| `NODE_ENV`        | `development`               | `development` \| `production` \| `test`              |

## Endpoints

### `GET /health`

Liveness check, sin auth ni dependencias externas.

```bash
curl http://localhost:3001/health
# { "status": "ok", "uptime": 1.234, "timestamp": "2025-..." }
```

### `GET /user/:username`

Devuelve el perfil público de un usuario de GitHub.

```bash
curl http://localhost:3001/user/octocat
```

Respuesta:

```json
{
  "login": "octocat",
  "name": "The Octocat",
  "bio": null,
  "avatarUrl": "https://avatars.githubusercontent.com/u/583231?v=4",
  "profileUrl": "https://github.com/octocat",
  "company": "@github",
  "location": "San Francisco",
  "email": null,
  "twitter": null,
  "publicRepos": 8,
  "followers": 9999,
  "following": 9,
  "createdAt": "2011-01-25T18:44:36Z"
}
```

Códigos de error:

| Código | Cuándo                                                       |
| ------ | ------------------------------------------------------------ |
| 400    | Username inválido (no cumple reglas de GitHub)               |
| 404    | El usuario no existe en GitHub                               |
| 503    | GitHub nos cortó por rate limit                              |
| 502    | Otro error inesperado de GitHub                              |
| 408    | GitHub no respondió en 5s                                    |

## Scripts

```bash
pnpm run start:dev     # dev con watch
pnpm run build         # compila a dist/
pnpm run start:prod    # corre dist/main
pnpm test              # tests unitarios
pnpm run test:e2e      # tests e2e con supertest + nock
pnpm run lint          # eslint --fix
pnpm run format        # prettier --write
```

## Estructura

```
src/
├── main.ts                       # bootstrap, CORS, ValidationPipe, filter global
├── app.module.ts                 # ConfigModule + GithubModule
├── config/
│   └── env.validation.ts         # schema joi
├── github/
│   ├── github.module.ts          # HttpModule + providers
│   ├── github.controller.ts      # GET /user/:username, GET /health
│   ├── github.service.ts         # orquesta HTTP + mapeo + errores
│   ├── github.client.ts          # único archivo que toca axios
│   ├── github.types.ts           # shapes crudos de GitHub + HttpError
│   └── dto/
│       ├── username-param.dto.ts
│       └── user-response.dto.ts
└── common/
    └── filters/
        └── all-exceptions.filter.ts
```

## Decisiones de diseño

- **`github.client.ts` es la única capa que conoce axios.** El service trabaja contra una interfaz limpia (`getUser`) y mapea errores de transporte a excepciones de Nest. Esto facilita mockear y testear.
- **Timeout de 5s** configurado en el `HttpModule`, no por request. Si GitHub no responde, devolvemos `408 Request Timeout` (`RequestTimeoutException`).
- **Rate limit** se detecta por `X-RateLimit-Remaining: 0` en respuestas 403 de GitHub. Devolvemos `503 Service Unavailable` para que el cliente sepa que es transitorio.
- **Validación de username** usa la regex oficial de GitHub (1-39 chars, alfanumérico + guiones, no empieza/termina con guion).
- **Filtro global** formatea toda excepción a `{ statusCode, timestamp, path, method, message }` para que el frontend tenga un shape consistente.
