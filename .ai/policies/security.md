# Security Policy

## Rules
1. All user input MUST be validated server-side using Zod schemas
2. All database queries MUST use the ORM (no raw SQL without justification and review)
3. Authentication MUST be checked on every protected route
4. Authorization MUST verify user has required permission for the action
5. File uploads MUST validate type, size, and sanitize filenames
6. File paths MUST be validated against directory traversal
7. Error messages MUST NOT leak internal details (stack traces, DB schema, etc.)
8. Sessions MUST have expiration and secure configuration
9. Passwords MUST be hashed with bcrypt (cost >= 12)
10. CSRF protection MUST be implemented for state-changing operations

## Security-Critical Features
These require Level 3 (critical) workflow:
- Authentication system changes
- Authorization/permission changes
- Payment processing
- File upload handling
- Database schema changes affecting security
- Session management changes
- API key/secret handling

## Incident Response
If a security vulnerability is discovered:
1. Document the vulnerability (do NOT commit details to public repo)
2. Assess severity and impact
3. Implement fix using Level 3 workflow
4. Verify fix and check for related vulnerabilities
5. Update security documentation
