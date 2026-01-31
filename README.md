<br>
<div align="center">

<p align="center">
    <a href="https://panda-css.com">
        <picture>
            <img alt="Panda CSS" src="https://github.com/chakra-ui/eslint-plugin-panda/raw/main/.github/banner.png" width="100%">
        </picture>
    </a>
</p>
<p align="center">ESLint plugin for Panda CSS</p>

<p align="center">
    <a aria-label="Github Actions" href="https://github.com/chakra-ui/eslint-plugin-panda/actions/workflows/quality.yml">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/actions/workflow/status/chakra-ui/eslint-plugin-panda/quality.yml?branch=main&label=%20&message=twitter&color=212022&logo=githubactions&style=for-the-badge">
            <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/github/actions/workflow/status/chakra-ui/eslint-plugin-panda/quality.yml?branch=main&label=%20&message=twitter&color=f6f7f8&logo=githubactions&style=for-the-badge&logoColor=%23000">
            <img alt="Github release actions" src="https://img.shields.io/github/actions/workflow/status/chakra-ui/eslint-plugin-panda/quality.yml?branch=main&label=%20&message=twitter&color=f6f7f8&logo=githubactions&style=for-the-badge&logoColor=%23000">
        </picture>
    </a>
</p>

</div>

## Getting Started

### Requirements

- **ESLint v9+** with flat config
- **Panda CSS v1.0+**

### Installation

```bash
pnpm add -D @pandacss/eslint-plugin
```

### Usage

Add the plugin to your `eslint.config.mjs`:

```js
// eslint.config.mjs
import { defineConfig } from 'eslint/config'
import panda from '@pandacss/eslint-plugin'

export default defineConfig([panda.configs.recommended])
```

Or with TypeScript and customization:

```js
// eslint.config.mjs
import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import panda from '@pandacss/eslint-plugin'

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  panda.configs.recommended,
  {
    rules: {
      '@pandacss/no-hardcoded-color': ['error', { noOpacity: true }],
    },
  },
])
```

### Available Configs

- `panda.configs.recommended` - Recommended rules for most projects
- `panda.configs.all` - All available rules (use with caution)

## Rules

Rules with ⚙️ have options. Click on the rule to see the options.

Where rules are included in the configs `recommended`, or `all` it is indicated below.

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
⚙️ Has configuration options.

| Name                                                                         | Description                                                                                                                                                                                                                     | 💼  | ⚠️  | 💡  | ⚙️  |
| :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-- | :-- | :-- | :-- |
| [file-not-included](docs/rules/file-not-included.md)                         | Disallow the use of Panda CSS in files that are not included in the specified Panda CSS `include` config.                                                                                                                       | ✅  |     |     |     |
| [no-config-function-in-source](docs/rules/no-config-function-in-source.md)   | Prohibit the use of config functions outside the Panda config file.                                                                                                                                                             | ✅  |     | 💡  |     |
| [no-debug](docs/rules/no-debug.md)                                           | Disallow the inclusion of the debug attribute when shipping code to the production environment.                                                                                                                                 |     | ✅  | 💡  |     |
| [no-deprecated-tokens](docs/rules/no-deprecated-tokens.md)                   | Disallow the use of deprecated tokens within token function syntax.                                                                                                                                                             |     | ✅  |     |     |
| [no-dynamic-styling](docs/rules/no-dynamic-styling.md)                       | Ensure users don't use dynamic styling. Prefer static styles, leverage CSS variables, or recipes for known dynamic styles.                                                                                                      |     | ✅  |     |     |
| [no-escape-hatch](docs/rules/no-escape-hatch.md)                             | Prohibit the use of escape hatch syntax in the code.                                                                                                                                                                            |     |     | 💡  |     |
| [no-hardcoded-color](docs/rules/no-hardcoded-color.md)                       | Enforce the exclusive use of design tokens as values for colors within the codebase.                                                                                                                                            |     | ✅  |     | ⚙️  |
| [no-important](docs/rules/no-important.md)                                   | Disallow usage of !important keyword. Prioritize specificity for a maintainable and predictable styling structure.                                                                                                              |     |     | 💡  |     |
| [no-invalid-nesting](docs/rules/no-invalid-nesting.md)                       | Warn against invalid nesting. Nested styles must contain the `&` character.                                                                                                                                                     | ✅  |     |     |     |
| [no-invalid-token-paths](docs/rules/no-invalid-token-paths.md)               | Disallow the use of invalid token paths within token function syntax.                                                                                                                                                           | ✅  |     |     |     |
| [no-margin-properties](docs/rules/no-margin-properties.md)                   | Discourage using margin properties for spacing; prefer defining spacing in parent elements with `flex` or `grid` using the `gap` property for a more resilient layout. Margins make components less reusable in other contexts. |     |     |     | ⚙️  |
| [no-physical-properties](docs/rules/no-physical-properties.md)               | Encourage the use of logical properties over physical properties to foster a responsive and adaptable user interface.                                                                                                           |     |     | 💡  | ⚙️  |
| [no-property-renaming](docs/rules/no-property-renaming.md)                   | Ensure that properties for patterns or style props are not renamed, as it prevents proper tracking.                                                                                                                             |     | ✅  |     |     |
| [no-unsafe-token-fn-usage](docs/rules/no-unsafe-token-fn-usage.md)           | Prevent users from using the token function in situations where they could simply use the raw design token.                                                                                                                     |     | ✅  | 💡  |     |
| [prefer-atomic-properties](docs/rules/prefer-atomic-properties.md)           | Encourage the use of atomic properties instead of composite properties in the codebase.                                                                                                                                         |     |     |     | ⚙️  |
| [prefer-composite-properties](docs/rules/prefer-composite-properties.md)     | Encourage the use of composite properties instead of atomic properties in the codebase.                                                                                                                                         |     |     |     | ⚙️  |
| [prefer-longhand-properties](docs/rules/prefer-longhand-properties.md)       | Discourage the use of shorthand properties and promote the preference for longhand properties in the codebase.                                                                                                                  |     |     | 💡  | ⚙️  |
| [prefer-shorthand-properties](docs/rules/prefer-shorthand-properties.md)     | Discourage the use of longhand properties and promote the preference for shorthand properties in the codebase.                                                                                                                  |     |     | 💡  | ⚙️  |
| [prefer-unified-property-style](docs/rules/prefer-unified-property-style.md) | Discourage mixing atomic and composite forms of the same property in a style declaration. Atomic styles give more consistent results.                                                                                           |     |     |     |     |

<!-- end auto-generated rules list -->

## Settings

### `configPath`

You can tell ESLint to use a custom Panda config file by setting the `configPath` option in your ESLint config.

By default, the plugin finds the nearest panda config to the linted file.

```js
// eslint.config.mjs
import { defineConfig } from 'eslint/config'
import panda from '@pandacss/eslint-plugin'
import path from 'node:path'

export default defineConfig([
  panda.configs.recommended,
  {
    settings: {
      '@pandacss/configPath': path.join(import.meta.dirname, 'panda.config.js'),
    },
  },
])
```
