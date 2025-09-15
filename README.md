# 🚀 Open Mercato

Open Mercato is a new‑era, AI‑supportive ERP foundation framework for service‑ and product‑based companies — built to power bookings, operations, and growth. It’s modular, extensible, and designed for teams that want strong defaults with room to customize everything.

## Highlights

- 🧩 Modular architecture with auto‑discovery (pages, APIs, CLI)
- 🧠 AI‑supportive foundation ready for assistive workflows
- 🗃️ Per‑module entities and migrations via MikroORM
- 🧬 Entity extensions + custom fields (EAV) without forking core schemas
- 🧱 Strong multi‑tenant model (tenants + organizations)
- 🧰 Dependency Injection (Awilix) for service/component overrides
- 🔔 Event Bus with subscribers (local/redis) + offline processing
- 🔐 Authentication, roles, sessions included
- ⚙️ Next.js app router, TypeScript, zod, bcryptjs

<img src="./docs//open-mercato-homepage.jpg" alt="Open Mercato homepage"/>

## Getting Started

1) Prerequisites
- Node.js 20+
- PostgreSQL database
- Environment variables in `.env` (copy from `.env.example`):
  - `DATABASE_URL=postgres://user:password@localhost:5432/mercato`
  - `JWT_SECRET=some-strong-secret`

2) Install dependencies

- `yarn install`

3) Prepare modules (registry, entities, DI)

- `yarn modules:prepare`

4) Database migrations (per‑module)

- Generate: `yarn db:generate`
- Apply: `yarn db:migrate` (also seeds global custom fields)

5) Seed roles and bootstrap an organization + admin user

- Seed default roles: `yarn mercato auth seed-roles`
- Setup tenant/org/admin:
  - `yarn mercato auth setup --orgName "Acme" --email admin@acme.com --password secret --roles owner,admin`

6) Run the app

- `yarn dev`
- Open http://localhost:3000

## Example: Todos with Custom Fields

The example module ships a simple Todos demo that showcases custom fields and the unified query layer.

Steps:

1) Ensure migrations are applied and global custom fields are seeded
- `yarn db:migrate` (runs migrations and seeds global custom fields)

2) Create an organization and admin user
- `yarn mercato auth setup --orgName "Acme" --email admin@acme.com --password secret --roles owner,admin`
- Note the printed `organizationId` (use it below)

3) Seed example Todos (entity + per‑org custom field definitions + sample data)
- `yarn mercato example seed-todos --org <organizationId>`
- Optional tenant scoping: `--tenant <tenantId>`

4) Open the Todos page
- Visit `/backend/example/todos` to filter/sort on base fields and custom fields (e.g., priority, severity, blocked).

Notes:
- The Todos page uses `queryEngine` to select and sort `cf:*` fields. Custom field definitions must exist for the current organization; the seeding command ensures they do.

## Documentation

- <a href="./docs/tutorials/first-app.md">Quickstart tutorial</a>
- <a href="./docs/tutorials/testing.md">Writing unit tests</a>
- <a href="./docs/modules.md">Modules authoring and usage</a>
- <a href="./docs/data-extensibility.md">Entity extensions and custom fields</a>
- <a href="./docs/query-layer.md">Unified query layer (filters, paging, fields)</a>
- <a href="./docs/events-and-subscribers.md">Events & subscribers</a>

### CLI

- auth: add-user, seed-roles, add-org, setup
- events: process, emit, clear, clear-processed
- example: hello
- custom_fields: seed-defs (upsert module-declared field definitions; use --global or --org <id>)

## Architecture Overview

- 🧩 Modules: Each feature lives under `src/modules/<module>` with auto‑discovered frontend/backend pages, APIs, CLI, i18n, and DB entities.
- 🗃️ Database: MikroORM with per‑module entities and migrations; no global schema. Migrations are generated and applied per module.
- 🧰 Dependency Injection: Awilix container constructed per request. Modules can register and override services/components via `di.ts`.
- 🏢 Multi‑tenant: Core `directory` module defines `tenants` and `organizations`. Most entities carry `tenant_id` + `organization_id`.
- 🔐 Security: zod validation, bcryptjs hashing, JWT sessions, role‑based access in routes and APIs.

## License

- MIT — see `LICENSE` for details.
