# Secrets Policy

## Rules
1. NEVER commit secrets to the repository
2. NEVER log secrets or tokens
3. NEVER include secrets in error messages
4. Use .env.example with placeholders only
5. Store secrets in .env (gitignored)
6. Rotate secrets if accidentally exposed
7. Use environment variables for all sensitive configuration
8. Review .gitignore includes .env before committing

## What counts as a secret:
- Database credentials
- API keys
- JWT secrets
- OAuth client secrets
- Encryption keys
- Admin passwords
- Third-party service tokens
