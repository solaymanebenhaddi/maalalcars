# Production Policy

## Rules
1. No direct production database access without authorization
2. No production deployments without all quality gates passing
3. No untested code in production
4. No debugging in production (use logging/monitoring)
5. Environment variables must be set via secure configuration
6. All production changes must be reversible or have rollback plan
