# Propose Skills for Reusable Knowledge

When you encounter reusable knowledge during work on this project, consider whether it should be captured as a Claude Code Skill. Skills allow Claude to reuse specialized knowledge across conversations and tasks.

## What Makes Good Skill Material

Knowledge is a good candidate for a skill when it meets these criteria:

### 1. Reusability
- The knowledge applies to multiple scenarios or tasks
- It can be used across different parts of the codebase
- It represents a repeatable pattern or process
- It's not a one-time solution to a specific problem

### 2. Complexity
- The knowledge involves multiple steps or considerations
- It requires understanding of specific tools, patterns, or domain concepts
- It saves significant time by capturing expert knowledge
- It involves non-obvious techniques or approaches

### 3. Project-Specificity
- The knowledge is specific to this project's architecture, patterns, or domain
- It wouldn't be part of Claude's general knowledge
- It reflects decisions made specifically for this codebase
- It captures project conventions that differ from common practices

## Examples of Skill-Worthy Knowledge

### Good Candidates:
- **Audio timing patterns**: How this project handles precise audio scheduling for the metronome
- **Measure calculation logic**: The specific algorithm for determining when to play/mute based on measure numbers
- **Testing patterns**: Project-specific approaches to testing timing-dependent code
- **State management patterns**: How this project structures React state for music-related features
- **Deployment workflows**: Steps for building and deploying this SPA

### Poor Candidates:
- Generic TypeScript patterns (already in Claude's knowledge)
- One-off bug fixes without broader applicability
- Simple configuration changes
- Standard React patterns without project-specific adaptations

## How to Propose a Skill

When you identify reusable knowledge, propose it to the user:

1. **Describe what the skill would capture**
   - What knowledge or process would it document?
   - What problem does it solve repeatedly?

2. **Explain the benefits**
   - How much time would it save in future tasks?
   - What complexity would it simplify?
   - How would it improve consistency?

3. **Suggest a skill name**
   - Use kebab-case: `metronome-timing-patterns`
   - Make it descriptive and specific
   - Keep it concise (2-4 words)

4. **Outline the skill content**
   - What sections would it include?
   - What examples or code patterns would it show?
   - What context is needed to understand it?

## Skill Proposal Template

When proposing a skill, use this format:

```
I've identified reusable knowledge that could be captured as a skill:

**Skill Name**: [proposed-skill-name]

**What it captures**: [1-2 sentence description]

**Why it's valuable**:
- [Benefit 1]
- [Benefit 2]

**When to use it**:
- [Scenario 1]
- [Scenario 2]

**Outline**:
1. [Section 1]
2. [Section 2]
3. [Section 3]

Would you like me to create this skill?
```

## When to Create Skills

Create skills proactively when:
- You've explained the same concept or process twice
- You've solved a complex problem that could recur
- You've documented patterns that are project-specific
- You've discovered non-obvious approaches that work well

Don't wait for explicit user requests - part of your value is identifying knowledge worth preserving.

## Skill Structure

Skills are created at `.claude/skills/{skill-name}/SKILL.md` and should include:

- **Overview**: What the skill provides
- **Context**: When and why to use it
- **Patterns/Processes**: Step-by-step guidance or code patterns
- **Examples**: Concrete applications in this codebase
- **Caveats**: Edge cases, limitations, or warnings

Remember: A well-crafted skill is an investment that pays dividends across many future interactions.
