# MAALAL CARS — Claude Code Instructions

Read `AGENTS.md` first for stack and architecture overview.

## Critical Rules

- **Dark theme only** — all UI uses design tokens from `src/styles/globals.css`
- **French locale** — all user-facing text in French (fr-MA)
- **Prisma ORM only** — no raw SQL without ADR justification
- **Soft-delete** — set `archivedAt`, never hard DELETE user data
- **Zod validation** — all user input validated server-side
- **Design system** — use `src/components/ui/` primitives, don't create one-off styles

## Before Any Implementation

1. Check `reference-uiux/` for the relevant mockup
2. Check `docs/specs/` for feature specification
3. Check `docs/decisions/` for relevant ADRs
4. Determine workflow level (see `.ai/workflows/feature.yaml`)

## Quality Gate

Run `npm run verify` before reporting completion. This executes:
- `tsc --noEmit` (typecheck)
- `eslint` (lint)
- `vitest run` (tests)
- `next build` (build)

## File Organization

- Pages/routes: `src/app/`
- UI primitives: `src/components/ui/`
- Feature components: `src/features/{module}/`
- Business logic: `src/services/`
- Data access: `src/repositories/`
- Validation: `src/validation/`
- Types: `src/types/`
