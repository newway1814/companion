# Companion

Companion is a private, desktop-first AI interview sparring partner for university
candidates preparing for software internship interviews. The MVP focuses on a
technical project deep-dive: a bounded five-question practice session that helps
the user defend resume project claims with ownership, implementation detail,
tradeoffs, and measured results.

Product docs live in [`docs/`](docs/) and [`AGENTS.md`](AGENTS.md); the UI source
of truth is the Stitch design under [`docs/design/stitch/`](docs/design/stitch/).

## Tech stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** + **shadcn/ui**
- **Supabase** — Postgres, Auth, and Storage
- **Prisma 7** ORM (driver adapter: `@prisma/adapter-pg`)
- **Vitest** for unit/route tests
- **Claude (Anthropic)** for the AI layer (added in a later slice)
- Deploys to **Vercel**

## Prerequisites

- Node.js 22+
- pnpm 11+ (`corepack enable` or install globally)
- A Supabase project

## Setup

```bash
pnpm install            # installs deps and runs `prisma generate` (postinstall)
cp .env.example .env    # then fill in your Supabase values
```

### Environment variables

See [`.env.example`](.env.example) for the full list. From the Supabase
dashboard:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role key (server-only) |
| `DATABASE_URL` | Project Settings → Database → pooled connection (port 6543, `?pgbouncer=true&connection_limit=1`) |
| `DIRECT_URL` | Project Settings → Database → direct connection (port 5432) |

The app connects to Postgres over the pooled `DATABASE_URL`; Prisma Migrate uses
the direct `DIRECT_URL`.

## Commands

```bash
pnpm dev          # start the dev server
pnpm build        # production build
pnpm start        # run the production build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm test         # Vitest (run once)
pnpm test:watch   # Vitest (watch mode)
pnpm db:generate  # prisma generate
pnpm db:migrate   # prisma migrate dev (requires a reachable database)
```

## Database

The Prisma schema lives in [`prisma/schema.prisma`](prisma/schema.prisma) and is
currently empty — models are added by later vertical slices. With a reachable
database configured in `.env`, create and apply migrations with:

```bash
pnpm db:migrate --name <migration-name>
```

## Tests

```bash
pnpm test
```

Tests run on Vitest in a Node environment. CI (`.github/workflows/ci.yml`) runs
lint, typecheck, test, and build on every push to `main` and on pull requests.
