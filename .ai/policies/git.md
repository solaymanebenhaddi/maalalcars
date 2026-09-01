# Git Policy

## Rules
1. Never force push to main/master
2. Never rewrite published history
3. Use descriptive commit messages
4. Never commit secrets, .env files, or credentials
5. Never commit node_modules or build artifacts
6. Review changes before committing (git diff)
7. Keep commits focused on a single logical change
8. Use .gitignore to prevent accidental inclusion

## Branch Strategy
- main: stable, production-ready
- feature/*: feature branches
- fix/*: bug fix branches
- release/*: release preparation
