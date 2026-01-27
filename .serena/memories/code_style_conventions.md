# Code Style and Conventions

## Prettier Configuration
- **Semicolons**: Required (semi: true)
- **Quotes**: Single quotes (singleQuote: true)
- **Tab Width**: 2 spaces
- **Trailing Commas**: ES5 style
- **Print Width**: 100 characters
- **Arrow Parens**: Avoid when possible

## ESLint Configuration
- Uses recommended ESLint rules
- React plugin with JSX runtime
- React Hooks recommended rules
- React-refresh for hot module replacement
- Target: ES2020, browser environment
- React version: 18.2

## File Naming
- React components: PascalCase (.jsx extension)
- Styles: kebab-case or matching component name (.css extension)
- Main entry: lowercase (main.jsx, index.html)

## Component Style
- Functional components preferred
- React 18 JSX runtime (no need to import React explicitly)
- Export default for main component
