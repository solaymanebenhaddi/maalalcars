# ADR-001: Next.js as Application Framework

## Status
Accepted

## Date
2026-09-01

## Context
MAALAL CARS requires a full-stack web application framework supporting:
- Server-side rendering for performance
- API routes for backend logic
- TypeScript support
- Rich ecosystem for dashboard-heavy UI
- Good developer experience

## Decision
Use Next.js (current stable) with App Router, TypeScript strict mode, and Tailwind CSS.

## Alternatives Considered
1. **Remix** — Strong full-stack framework but smaller ecosystem for enterprise dashboard components
2. **Nuxt.js (Vue)** — Good framework but team experience is React-focused
3. **Laravel + React SPA** — Would provide better backend separation but adds deployment complexity
4. **Plain React + Express** — Maximum flexibility but requires more manual setup for SSR, routing, etc.

## Consequences
### Advantages
- Unified full-stack framework (frontend + API)
- Excellent TypeScript support
- App Router provides modern React patterns (Server Components, streaming)
- Large ecosystem of compatible libraries
- Built-in optimization (code splitting, image optimization)
- Easy deployment to various platforms

### Disadvantages
- Vendor lock-in to Vercel ecosystem conventions
- App Router still evolving (some patterns may change)
- Heavier than lightweight alternatives for simple APIs

### Risks
- Major version upgrades may require migration effort
- Some third-party libraries may lag behind App Router patterns
