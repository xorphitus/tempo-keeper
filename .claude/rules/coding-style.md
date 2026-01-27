# Coding Style Rules

## 1. Always Prefer Immutability

- Use `const` by default for variable declarations
- Avoid mutating objects and arrays; use spread operators, `Object.freeze()`, or immutable data patterns
- Prefer functional programming patterns that return new values rather than modifying existing ones
- Use `readonly` modifiers in TypeScript interfaces and types where applicable

## 2. Domain Logic Decoupling

- Domain logic must be decoupled from the presentation layer
- Keep business logic separate from React components
- Domain functions should be pure and framework-agnostic
- UI components should be thin wrappers that call domain logic
- This separation enables easier testing and maintainability

## 3. Write Tests for Domain Logic

- All domain logic must have corresponding unit tests
- Tests should be isolated from UI concerns
- Focus on testing business rules, calculations, and core functionality
- Aim for high coverage of domain code

## 4. Apply Code Checkers

Before committing code, ensure all of the following pass:

- **ESLint**: `npm run lint` (or equivalent)
- **Tests**: `npm test`
- **Build**: `npm run build`

All three checks must pass without errors before code can be considered ready for commit.

## 5. Verify End-to-End Behavior

Before committing significant changes, verify the application works correctly from a user perspective:

- **Run e2e tests**: `npm run test:e2e` to execute automated end-to-end tests
- **Manual testing**: Test critical user flows in the browser to ensure the UI behaves as expected
- **Cross-browser verification**: Check compatibility across major browsers when applicable
- Focus on testing:
  - User interactions and workflows
  - Visual rendering and layout
  - Integration between components
  - Overall application behavior

## 6. Ensure Security

Security must be considered throughout the development process:

- **Never use `dangerouslySetInnerHTML`** or other unsafe DOM manipulation without explicit justification
- **Validate and sanitize all user inputs** before processing or storing
- **Never commit secrets, API keys, or credentials** to the codebase
- **Review dependencies** regularly for known vulnerabilities using `npm audit`
- **Use HTTPS** for all external API calls in production
- **Minimize sensitive data** stored in localStorage/sessionStorage
- **Avoid logging sensitive information** in console or error messages
- **Run security review** for significant changes, especially those involving:
  - User input handling
  - Authentication or session management
  - Third-party integrations
  - Data storage or transmission

## 7. Always Prefer Well-Typed Implementation

Maintain strong type safety throughout the codebase:

- **Eliminate `any` type** whenever possible - use specific types or generics instead
- **Avoid type assertions (`as`)** unless absolutely necessary - prefer type guards and proper type narrowing
- **Use TypeScript's type system** to catch errors at compile time rather than runtime
- **Leverage union types and discriminated unions** for complex state management
- **Define explicit types for function parameters and return values**
- **Use `unknown` instead of `any`** when the type is truly unknown and needs runtime checking
- When type assertions are unavoidable, add a comment explaining why

## 8. Performance Considerations

Write efficient algorithms and avoid performance pitfalls:

- **Avoid O(N²) time complexity** when better solutions exist (O(N), O(N log N))
- **Use appropriate data structures** - Maps/Sets for lookups, Arrays for ordered data
- **Minimize nested loops** - consider using reduce, filter, map, or other functional patterns
- **Cache expensive computations** when results are reused
- **Profile before optimizing** - don't prematurely optimize without measurements
- **Consider space-time tradeoffs** - sometimes using more memory improves time complexity
- For DOM operations:
  - Batch updates to minimize reflows
  - Use React's reconciliation efficiently (proper keys, memoization)
  - Debounce/throttle frequent event handlers