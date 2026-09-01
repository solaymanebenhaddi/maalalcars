# Testing

## Test Categories
- **Unit**: Single function/module, mocked dependencies
- **Integration**: Multiple modules, real DB (test database)
- **Component**: React components with Testing Library
- **E2E**: Full browser flow (future)

## Conventions
- Test files: `*.test.ts` or `*.test.tsx`
- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Component tests: co-located or `tests/components/`
- Use descriptive test names: "should [expected behavior] when [condition]"
- Each test should test ONE thing
- Prefer testing behavior over implementation details

## Database Testing
- Use separate test database: `file:./test.db`
- Reset DB before test suite
- Clean up after tests
- Never test against dev/production DB

## Checklist
- [ ] Happy path tested
- [ ] Key error cases tested
- [ ] Edge cases for validation
- [ ] No flaky tests
- [ ] Tests actually assert meaningful values
- [ ] Tests can run independently
