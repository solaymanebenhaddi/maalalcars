# Systematic Debugging

## Procedure
1. **Observe**: What exactly is the symptom? Screenshot, error message, log output
2. **Reproduce**: Find minimal reliable reproduction steps
3. **Gather Evidence**: Check logs, network requests, DB state, console output
4. **Hypothesize**: List possible causes ranked by likelihood
5. **Isolate**: Test ONE variable at a time — change one thing, observe
6. **Root Cause**: Identify the actual root cause, not just a symptom
7. **Fix**: Apply the minimal targeted fix
8. **Regression Test**: Verify the fix AND verify nothing else broke
9. **Document**: Record what caused it and how it was fixed

## Anti-Patterns
- Changing multiple things at once
- Guessing without evidence
- Fixing symptoms instead of root causes
- Not testing after fixing
- Not checking for regressions
