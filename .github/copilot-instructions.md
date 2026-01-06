# Copilot / AI Agent Instructions for forum-monorepo

This repository is a pnpm-based monorepo containing a NestJS API and a standalone domain package following DDD and Clean Architecture. Keep advice tightly focused on discoverable patterns and exact commands.

- Project layout
  - `apps/api` — NestJS HTTP API, Prisma for DB, Docker compose for Postgres+Redis. Key files: `apps/api/src/main.ts`, `apps/api/prisma/schema.prisma`, `apps/api/docker-compose.yml`, `apps/api/package.json`.
  - `packages/domain` — pure TypeScript domain library (DDD). Key files: `packages/domain/src/core/either.ts`, `packages/domain/src/core/events`, `packages/domain/test/factories`, `packages/domain/package.json`.

- How components interact
  - API depends on the domain package via a workspace dependency: `@forum/domain: workspace:*` (see `apps/api/package.json`).
  - Persistence is handled in the API (Prisma client under `apps/api/generated/prisma`, schema in `apps/api/prisma`). Tests use in-memory repositories under `packages/domain/test/repositories`.
  - Domain layer is framework-agnostic. Do not introduce Nest/Prisma references into `packages/domain` code.

- Common developer workflows (exact commands)
  - Install all deps: `pnpm install` at repo root.
  - Start full dev environment (DB + domain + API): `pnpm run dev` from repo root (script uses Docker Compose and `wait-on`).
  - Start only API in watch mode: `cd apps/api && pnpm run start:dev`.
  - Open Prisma Studio: `pnpm --filter @forum/api studio`.
  - Build everything: `pnpm -r build` or `pnpm -w build`.
  - Run unit tests for domain: `pnpm --filter @forum/domain test`.
  - Run API unit tests: `cd apps/api && pnpm test` (uses Jest).
  - Run e2e tests: from repo root `pnpm run test:e2e` (note: `pretest:e2e` builds the domain package first).
  - Linting: domain uses Biome (`pnpm --filter @forum/domain lint`); API uses ESLint (`pnpm --filter @forum/api lint`).

- Project-specific conventions and patterns
  - DDD + Clean Architecture: business rules live in `packages/domain` (entities, value objects, use-cases, repository interfaces). Infrastructure (DB, HTTP, storage) belongs to `apps/api`.
  - Use factories in `packages/domain/test/factories` for tests — prefer them when writing unit/integration tests.
  - Use in-memory repository implementations from `packages/domain/test/repositories` for unit tests to avoid touching DB.
  - Error handling pattern: repository/use-case results often use the Either monad at `packages/domain/src/core/either.ts` — follow that style in new domain use-cases.
  - Domain events mechanism exists under `packages/domain/src/core/events` — use it to emit side effects, not direct infra calls.

- Integration points & external dependencies to be mindful of
  - Prisma (apps/api) and generated client at `apps/api/generated/prisma`.
  - Docker Compose in `apps/api/docker-compose.yml` provides Postgres and Redis for local dev; root `dev` script depends on it.
  - AWS S3 SDK is used in the API for uploads (`@aws-sdk/client-s3`).
  - Redis via `ioredis` for caching/pubsub in the API.

- Quick examples to reference in suggestions
  - To reference DB schema: point to `apps/api/prisma/schema.prisma`.
  - To run e2e tests: note `apps/api/test/jest-e2e.json` and root script `test:e2e`.
  - To build domain package before running dependent tasks: `pnpm --filter @forum/domain run build` (used in `pretest:e2e`).

- What not to change automatically
  - Do not move domain code into `apps/api` or add framework-specific imports inside `packages/domain`.
  - Avoid changing Docker Compose or database data directories unless the change is explicitly required and tested locally.

If any section is unclear or you want more detail (example runs, sample PR description, or suggested unit test templates), tell me which part and I'll iterate.
