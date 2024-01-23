<br>
<div align="center">

<p align="center">
    <a href="https://panda-css.com">
        <picture>
            <img alt="Panda CSS" src="https://github.com/chakra-ui/panda/raw/main/.github/assets/banner.png" width="100%">
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

## Documentation

Visit the Panda CSS [eslint docs](https://panda-css.com/docs/references/eslint) to view the full documentation for this
plugin.

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

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
⚠️ Configurations set to warn in.\
🌐 Set in the `all` configuration.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                              | Description                                                                                                                                    | 💼    | ⚠️    | 🔧  |
| :-------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :---- | :---- | :-- |
| [file-not-included](plugin/docs/rules/file-not-included.md)                       | Disallow the use of panda css in files that are not included in the specified panda `include` config.                                          | 🌐 ✅ |       |     |
| [no-config-function-in-source](plugin/docs/rules/no-config-function-in-source.md) | Prohibit the use of config functions outside the Panda config.                                                                                 | 🌐 ✅ |       | 🔧  |
| [no-debug](plugin/docs/rules/no-debug.md)                                         | Disallow the inclusion of the debug attribute when shipping code to the production environment.                                                |       | 🌐 ✅ | 🔧  |
| [no-dynamic-styling](plugin/docs/rules/no-dynamic-styling.md)                     | Ensure user doesn't use dynamic styling at any point. Prefer to use static styles, leverage css variables or recipes for known dynamic styles. |       | 🌐 ✅ |     |
| [no-escape-hatch](plugin/docs/rules/no-escape-hatch.md)                           | Prohibit the use of escape hatch syntax in the code.                                                                                           |       | 🌐    | 🔧  |
| [no-hardcoded-color](plugin/docs/rules/no-hardcoded-color.md)                     | Enforce the exclusive use of design tokens as values for colors within the codebase.                                                           |       | 🌐    |     |
| [no-invalid-token-paths](plugin/docs/rules/no-invalid-token-paths.md)             | Disallow the use of invalid token paths within token function syntax.                                                                          | 🌐 ✅ |       |     |
| [no-shorthand-prop](plugin/docs/rules/no-shorthand-prop.md)                       | Discourage the use of shorthand properties and promote the preference for longhand CSS properties in the codebase.                             |       | 🌐    | 🔧  |
| [no-unsafe-token-fn-usage](plugin/docs/rules/no-unsafe-token-fn-usage.md)         | Prevent users from using the token function in situations where they could simply use the raw design token.                                    |       | 🌐    | 🔧  |
| [prefer-atomic-properties](plugin/docs/rules/prefer-atomic-properties.md)         | Encourage the use of atomic properties instead of composite shorthand properties in the codebase.                                              |       | 🌐    |     |

<!-- end auto-generated rules list -->

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
