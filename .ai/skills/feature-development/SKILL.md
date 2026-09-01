# Feature Development

## Procedure
1. **Understand**: Read the feature specification and related UI references
2. **Analyze Impact**: Identify affected files, models, routes, components
3. **Plan**: Break into subtasks, identify the workflow level (1/2/3)
4. **Schema First**: If DB changes needed, create migration before code
5. **Backend**: Implement services, repositories, API routes, validation
6. **Frontend**: Implement components, pages, forms using design system
7. **Test**: Write tests covering happy path and key error cases
8. **Verify**: Run all quality gates for the workflow level
9. **Document**: Update relevant documentation

## Checklist
- [ ] Specification read and understood
- [ ] UI reference images reviewed
- [ ] Impact analysis complete
- [ ] Workflow level determined
- [ ] Schema migration created (if needed)
- [ ] Service/repository layer implemented
- [ ] API routes implemented
- [ ] UI components implemented
- [ ] Form validation with Zod
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Tests written and passing
- [ ] Quality gates passing
- [ ] No TypeScript errors
- [ ] Lint clean
