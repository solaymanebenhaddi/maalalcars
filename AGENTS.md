<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MAALAL CARS — Agent Instructions

## Core Rules

1. **Inspect before modifying.** Read existing code before changing it.
2. **Read project config** → `.ai/config/project.yaml`
3. **Read relevant specification** → `docs/specs/{feature}.md`
4. **Read relevant architecture** → `docs/architecture/` and `docs/decisions/`
5. **Choose the workflow level** → `.ai/workflows/feature.yaml` (Level 1/2/3)
6. **Respect policies** → `.ai/policies/`
7. **Run quality gates** → `npm run verify` before claiming done
8. **Evidence required** — never claim success without command output proving it
9. **Update documentation** when architecture or decisions change

## Stack

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- Prisma + SQLite (→ PostgreSQL later)
- Vitest for testing
- Zod for validation
- React Hook Form for forms
- Recharts for charts
- TanStack Table for tables

## Architecture

```
UI (app/, components/) → Services (services/) → Repositories (repositories/) → Prisma → SQLite
```

## Key Paths

| Path | Purpose |
|------|---------|
| `.ai/` | AI engineering system (agents, skills, workflows, policies) |
| `prisma/schema.prisma` | Database schema |
| `src/components/ui/` | Design system primitives |
| `src/styles/globals.css` | Design tokens |
| `reference-uiux/` | 40 UI/UX reference mockups |
| `docs/decisions/` | Architecture Decision Records |
| `storage/` | Local file storage (gitignored contents) |

## Locale

- Language: French (Morocco)
- Currency: MAD, displayed as "DH"
- Timezone: Africa/Casablanca
