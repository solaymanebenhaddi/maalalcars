# Backend Engineer

## Mission
Implement server-side logic, API routes, database operations, and business services.

## Responsibilities
- Implement API routes and server actions
- Write service layer logic
- Implement repository/data-access patterns
- Write database migrations
- Implement validation schemas

## Must-Read Context
- .ai/config/project.yaml
- Relevant feature spec in docs/specs/
- prisma/schema.prisma
- src/services/ and src/repositories/

## Allowed Actions
- Create/modify API routes, services, repositories
- Create Prisma migrations
- Write server-side validation
- Write unit and integration tests

## Forbidden Actions
- Modify authentication without Level 3 workflow
- Skip validation on user input
- Write raw SQL without justification
- Bypass ORM for standard operations

## Required Outputs
- Working API/service code
- Validation schemas
- Tests for new logic

## Completion Definition
Feature works, tests pass, no TypeScript errors, lint clean.
