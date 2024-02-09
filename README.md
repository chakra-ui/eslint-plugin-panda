<!-- This file is built by build-readme.js. Do not edit it directly; edit README.md.template instead. -->
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

### Installation

```bash
pnpm add -D @pandacss/eslint-plugin
```

### Usage

Add `@pandacss/eslint-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the
`/eslint-plugin` suffx:

```json
{
  "plugins": ["@pandacss"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@pandacss/no-debug": "error"
  }
}
```

You can also enable the `recommended` rules in extends:

```diff
{
-   "plugins": ["@pandacss"]
+   "extends": ["plugin:@pandacss/recommended"]
}
```

Or enable all rules in extends:

```diff
{
-   "plugins": ["@pandacss"]
+   "extends": ["plugin:@pandacss/all"]
}
```

> [!WARNING]  
> This is not recommended. You should only enable the rules you need.

## Rules

Where rules are included in the configs `recommended`, or `all` it is indicated below.

- [`@pandacss/file-not-included`](docs/rules/file-not-included.md) `all`, `recommended`
- [`@pandacss/no-config-function-in-source`](docs/rules/no-config-function-in-source.md) `all`, `recommended`
- [`@pandacss/no-debug`](docs/rules/no-debug.md) `all`, `recommended`
- [`@pandacss/no-dynamic-styling`](docs/rules/no-dynamic-styling.md) `all`, `recommended`
- [`@pandacss/no-escape-hatch`](docs/rules/no-escape-hatch.md) `all`
- [`@pandacss/no-hardcoded-color`](docs/rules/no-hardcoded-color.md) `all`
- [`@pandacss/no-invalid-token-paths`](docs/rules/no-invalid-token-paths.md) `all`, `recommended`
- [`@pandacss/no-property-renaming`](docs/rules/no-property-renaming.md) `all`, `recommended`
- [`@pandacss/prefer-longhand-properties`](docs/rules/prefer-longhand-properties.md) `all`
- [`@pandacss/prefer-shorthand-properties`](docs/rules/prefer-shorthand-properties.md) `all`
- [`@pandacss/no-unsafe-token-fn-usage`](docs/rules/no-unsafe-token-fn-usage.md) `all`
- [`@pandacss/prefer-atomic-properties`](docs/rules/prefer-atomic-properties.md) `all`
- [`@pandacss/prefer-composite-properties`](docs/rules/prefer-composite-properties.md) `all`
- [`@pandacss/prefer-unified-property-style`](docs/rules/prefer-unified-property-style.md) `all`, `recommended`

## Settings

### `configPath`

You can tell `eslint` to use a custom panda config file by setting the `configPath` option in your `.eslintrc.js` file.

By default we find the nearest panda config to the linted file.

```js filename=".eslintrc.(c)js"
const path = require('path')

module.exports = {
  plugins: ['@pandacss'],
  settings: {
    '@pandacss/configPath': path.join('PATH-TO/panda.config.js'),
  },
}
```
