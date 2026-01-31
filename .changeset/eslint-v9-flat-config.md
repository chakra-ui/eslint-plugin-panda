---
"@pandacss/eslint-plugin": minor
---

## Breaking Changes

### ESLint v9+ with Flat Config Required

This release drops support for ESLint v8 and legacy `.eslintrc` configuration files. The plugin now requires:

- **ESLint v9.0.0 or higher**
- **Flat config format** (`eslint.config.mjs`)

If you're still using ESLint v8 or legacy config, please upgrade before updating to this version.

### Panda CSS v1.0+ Required

This release requires Panda CSS v1.0.0 or higher. Earlier versions of Panda CSS are no longer supported.

## What's New

### Improved Documentation Generation

Replaced the deprecated `eslint-docgen` with `eslint-doc-generator` from eslint-community. This provides:

- Auto-generated rules table in README with config status, fixable indicators, and options
- Auto-generated rule headers in documentation files
- Auto-generated options tables for rules with configuration
- `pnpm docs:check` command to verify documentation is up-to-date in CI

### Migration Guide

**Before (ESLint v8 / Legacy Config):**
```json
{
  "extends": ["plugin:@pandacss/recommended"]
}
```

**After (ESLint v9 / Flat Config):**
```js
// eslint.config.mjs
import panda from '@pandacss/eslint-plugin'

export default [panda.configs.recommended]
```
