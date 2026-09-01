# ADR-005: Session-Based Authentication

## Status
Accepted

## Date
2026-09-01

## Context
The application needs user authentication for the management platform. MVP deployment is single-instance.

## Decision
Use session-based authentication with bcrypt password hashing and database-stored sessions.

## Alternatives Considered
1. **JWT tokens** — Stateless but harder to revoke, more complex refresh logic
2. **OAuth/SSO** — Appropriate for multi-tenant but overkill for single-deployment MVP
3. **Passkeys/WebAuthn** — Modern but limited browser support and complex implementation

## Consequences
### Advantages
- Simple to implement and understand
- Easy session revocation (delete from DB)
- Server-side session validation
- Works well with SQLite
- Bcrypt provides strong password hashing

### Disadvantages
- Requires database lookup for every authenticated request
- Sessions stored in DB add minor query overhead
- Not suitable for distributed deployments without shared session store

### Risks
- Session fixation must be prevented (regenerate on login)
- Session token must be transmitted securely
