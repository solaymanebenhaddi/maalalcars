# Destructive Actions Policy

## NEVER without explicit user authorization:
- `git push --force`
- `git reset --hard`
- `git branch -D` on shared branches
- `rm -rf` on significant directories
- Database DROP operations
- Database TRUNCATE operations
- Deleting migration files
- Deleting user data
- Overwriting .env with secrets
- Production deployments

## ALWAYS before destructive actions:
1. Explain what will be destroyed
2. Confirm no data loss will occur
3. Verify backups exist if applicable
4. Get explicit user confirmation
5. Document the action

## Default: READ_ONLY
- Agents start in READ_ONLY mode
- Inspection, search, analysis are always allowed
- Source code changes require SAFE_WRITE mode
- Destructive operations require PRIVILEGED mode
- Production changes require PRODUCTION mode with explicit authorization
