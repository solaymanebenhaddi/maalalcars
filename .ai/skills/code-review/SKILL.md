# Code Review

## Procedure
1. **Context**: Read the specification/ticket
2. **Architecture**: Does it follow project patterns?
3. **Correctness**: Does it do what it should?
4. **Security**: Any vulnerabilities? (OWASP Top 10)
5. **Performance**: Any obvious inefficiencies?
6. **Testing**: Adequate test coverage?
7. **Types**: TypeScript used correctly?
8. **Design System**: UI follows design tokens?
9. **Edge Cases**: Error/loading/empty states handled?
10. **Documentation**: Updated if needed?

## Severity Levels
- **Blocker**: Must fix before merge (security, data loss, crash)
- **Major**: Should fix before merge (bug, missing validation)
- **Minor**: Can fix later (style, naming, minor improvement)
- **Nitpick**: Optional (preference, alternative approach)
