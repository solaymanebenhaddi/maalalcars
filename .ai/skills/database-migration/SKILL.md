# Database Migration

## Procedure
1. **Document**: What changes and why (reference ADR if architectural)
2. **Schema**: Modify prisma/schema.prisma
3. **Generate**: Run `npx prisma migrate dev --name descriptive-name`
4. **Review**: Check generated SQL migration
5. **Test**: Verify migration applies cleanly on fresh DB
6. **Seed**: Update seed if new required data
7. **Verify**: Run existing tests to check for regressions

## Rules
- Never modify an already-applied migration
- Always use descriptive migration names
- Test both migrate-up and fresh-push
- Back up data before destructive changes
- Document breaking changes
