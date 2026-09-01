# ADR-002: SQLite as MVP Persistence Layer

## Status
Accepted

## Date
2026-09-01

## Context
The application needs a relational database for transactional data (clients, vehicles, sales, invoices, etc.). At the MVP stage, deployment complexity should be minimized.

## Decision
Use SQLite as the primary database for the MVP phase, with architecture ensuring easy migration to PostgreSQL/MySQL later.

## Alternatives Considered
1. **PostgreSQL** — Production-grade but requires separate server setup for development
2. **MySQL** — Similar to PostgreSQL concerns
3. **JSON files** — No relational integrity, no transactions, no concurrent safety
4. **MongoDB** — Not suitable for heavily relational automotive business data

## Consequences
### Advantages
- Zero infrastructure: single file database
- Full SQL support with relational integrity
- Transactions, indexes, filtering, pagination
- Migrations via Prisma
- Easy to back up (copy one file)
- Prisma abstracts the database, making future migration straightforward

### Disadvantages
- Limited concurrent write performance
- No built-in replication
- Some SQL features unavailable (e.g., certain JSON operations)

### Risks
- May need migration to PostgreSQL if concurrent write load increases
- Some Prisma features behave differently on SQLite vs PostgreSQL

## Migration Path
Replace `provider = "sqlite"` with `provider = "postgresql"` in Prisma schema, update DATABASE_URL, and re-run migrations.
