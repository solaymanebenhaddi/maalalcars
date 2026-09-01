# Security Review

## Checklist
- [ ] Input validation on all user-supplied data
- [ ] Output encoding to prevent XSS
- [ ] SQL injection prevention (parameterized queries via ORM)
- [ ] Authentication checks on protected routes
- [ ] Authorization checks (correct role/permission)
- [ ] CSRF protection
- [ ] File upload validation (type, size, filename)
- [ ] No directory traversal in file paths
- [ ] No secrets in code or committed files
- [ ] Dependency vulnerabilities checked
- [ ] Error messages don't leak internal details
- [ ] Session management is secure
- [ ] Rate limiting considered
- [ ] Secure headers set
