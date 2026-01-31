# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ESLint plugin for Panda CSS (`@pandacss/eslint-plugin`). Requires ESLint v9+ with flat config and Panda CSS v1.0+.

## Common Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build the plugin
pnpm test             # Run all tests
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript type checking
pnpm docs             # Generate rule documentation
pnpm docs:check       # Verify docs are up-to-date (CI check)
pnpm readme           # Regenerate README.md from template
```

### Running a Single Test

```bash
pnpm vitest run plugin/tests/no-debug.test.ts
pnpm vitest run -t "test name pattern"
```

## Architecture

### Workspace Structure

This is a pnpm monorepo with three packages:

- `plugin/` - The main ESLint plugin (published as `@pandacss/eslint-plugin`)
- `fixture/` - Test fixtures providing mock Panda CSS context
- `sandbox/` - Development playground for testing rules

### Plugin Structure

```
plugin/
├── src/
│   ├── index.ts           # Plugin entry point, exports rules and configs
│   ├── rules/             # Individual rule implementations
│   │   ├── index.ts       # Rule registry
│   │   └── *.ts           # Each rule file exports RULE_NAME and default rule
│   └── utils/
│       ├── helpers.ts     # AST traversal and Panda CSS detection helpers
│       ├── worker.ts      # Synckit worker for Panda CSS context access
│       └── nodes.ts       # TypeScript ESTree node type guards
├── tests/                 # Test files mirror rules/ structure
└── test-utils.ts          # RuleTester wrapper for TypeScript rules
```

### Key Concepts

**Panda Context via Synckit**: Rules need access to Panda CSS configuration (tokens, properties, etc.). Since ESLint
rules are synchronous but Panda's config loading is async, we use `synckit` to run a worker that loads the Panda
context. The `syncAction` helper in `utils/index.ts` communicates with the worker.

**Import Detection**: Rules use `getImports()` to detect Panda CSS imports (css, styled, patterns, etc.) and determine
if a file uses Panda. The `isPandaIsh()` helper checks if a function/component name comes from Panda.

**Test Fixtures**: During tests (`NODE_ENV=test`), the worker returns a mock context from `fixture/` instead of loading
real Panda config.

### Adding a New Rule

1. Create rule file in `plugin/src/rules/` following existing patterns
2. Export `RULE_NAME` constant and default rule using `createRule()` from `@typescript-eslint/utils`
3. Add to `plugin/src/rules/index.ts`
4. Create test file in `plugin/tests/`
5. Create doc file in `docs/rules/` with marker comments for auto-generation
6. Run `pnpm docs` to generate documentation

### Documentation Generation

Rule documentation uses `eslint-doc-generator`. Doc files have marker comments:

- `<!-- begin auto-generated rule header -->` / `<!-- end auto-generated rule header -->`
- `<!-- begin auto-generated rule options list -->` / `<!-- end auto-generated rule options list -->`

Content outside these markers is preserved. README rules table is auto-generated from `README.md.template`.
