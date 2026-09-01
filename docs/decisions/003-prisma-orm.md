# ADR-003: Prisma as ORM

## Status
Accepted

## Date
2026-09-01

## Context
Need an ORM that works well with SQLite now and PostgreSQL later, integrates with Next.js, and provides type-safe database access.

## Decision
Use Prisma ORM with Prisma Client for type-safe database access.

## Alternatives Considered
1. **Drizzle ORM** — More lightweight, SQL-like syntax, but less mature migration tooling and ecosystem
2. **Kysely** — Type-safe query builder but no schema management or migrations
3. **TypeORM** — Mature but decorator-heavy pattern less suited to modern TypeScript
4. **Raw SQL** — Maximum control but no type safety, migration management, or schema generation

## Consequences
### Advantages
- Excellent TypeScript integration with auto-generated types
- Built-in migration system
- Schema-as-code (schema.prisma)
- Prisma Studio for visual DB browsing
- Strong SQLite and PostgreSQL support
- Large community and documentation

### Disadvantages
- Generated client adds to bundle/startup
- Some complex queries require raw SQL fallback
- Schema language is Prisma-specific (not standard SQL)
- Migration history can be tricky to manage in teams

### Risks
- Prisma version upgrades occasionally require migration adjustments
