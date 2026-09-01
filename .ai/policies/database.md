# Database Policy

## Rules
1. All schema changes MUST go through Prisma migrations
2. Never modify an already-applied migration file
3. Use descriptive migration names
4. Test migrations on fresh database before merging
5. Never delete or truncate production data without authorization
6. Use transactions for multi-step operations
7. Always use the ORM for queries (no raw SQL without justification)
8. Soft-delete by default (set archivedAt, don't DELETE)
9. Every table must have id, createdAt, updatedAt
10. Use cuid() for primary keys

## Backup
- Back up before destructive migrations
- Test restore from backup periodically
