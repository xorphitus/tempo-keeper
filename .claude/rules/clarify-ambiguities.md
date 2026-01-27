# Clarify All Ambiguities Before Proceeding

When you receive instructions that contain any ambiguities, you must ask clarifying questions until all ambiguities are resolved. Do not make assumptions or proceed with implementation when the requirements are unclear.

## What Counts as Ambiguity

An instruction is ambiguous when:

- Multiple valid interpretations exist for what the user wants
- Technical implementation details are unspecified (e.g., which library, framework, or approach to use)
- The scope or boundaries of the task are unclear
- Requirements conflict with each other or with existing code patterns
- Expected behavior in edge cases is not defined
- The user's intent could mean different things in the current codebase context

## How to Handle Ambiguities

1. **Identify all ambiguities** in the instruction before starting any work
2. **Ask specific questions** about each ambiguous point using the AskUserQuestion tool when appropriate
3. **Provide context** in your questions - explain why you're asking and what the implications of different choices are
4. **Suggest options** when helpful, but make it clear you're seeking the user's decision, not making assumptions
5. **Wait for answers** before proceeding with implementation

## Examples of Ambiguities to Clarify

- "Add validation" - What should be validated? What are the validation rules? What happens when validation fails?
- "Improve performance" - Which performance metric? What is acceptable? Are there trade-offs to consider?
- "Add error handling" - Which errors? How should they be handled? User-facing messages or logging?
- "Make it configurable" - Through what mechanism? Config file, environment variables, or UI?
- "Refactor this code" - What specific issues should be addressed? How far should the refactoring go?

## When You Can Proceed Without Questions

You may proceed without asking questions only when:

- The instruction is completely clear and unambiguous
- The implementation approach is obvious given the codebase context
- Standard conventions or best practices clearly apply
- You're fixing an obvious bug with a clear solution

Remember: It's always better to ask one more clarifying question than to implement the wrong thing.
