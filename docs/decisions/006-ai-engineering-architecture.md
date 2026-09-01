# ADR-006: Repository-Native AI Engineering Architecture

## Status
Accepted

## Date
2026-09-01

## Context
The project uses AI coding agents for development. Need a structured system to ensure consistent, safe, high-quality work across sessions and potentially across different AI models.

## Decision
Create a model-neutral `.ai/` directory containing agents, skills, workflows, policies, quality gates, memory, and templates. Keep top-level instruction files (AGENTS.md, CLAUDE.md) concise with pointers to deeper context.

## Alternatives Considered
1. **No structure** — Let AI agents work freestyle (inconsistent, error-prone)
2. **CLAUDE.md only** — Ties to one model, becomes bloated
3. **External tool (Linear, Notion)** — Disconnected from repository

## Consequences
### Advantages
- Model-neutral: works with Claude, Codex, Gemini, etc.
- Hierarchical context loading prevents context overload
- Separation of concerns: agents/skills/workflows/policies
- Quality gates enforce deterministic verification
- Memory persists across sessions

### Disadvantages
- Initial setup overhead
- Must be maintained as project evolves
- AI agents must be instructed to read and follow the system

### Risks
- Over-engineering the AI layer could slow down development
- Must keep documentation current or it becomes misleading
