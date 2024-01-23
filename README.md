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

Visit the Panda CSS [eslint docs](https://panda-css.com/docs/references/eslint) to view the full documentation for this plugin.

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

> [!NOTE]  
> This is not recommended. You should only enable the rules you need.

## Settings

### `configPath`

You can tell `eslint` to use a custom panda config file by setting the `configPath` option in your `.eslintrc.js` file.

By default we find the nearest panda config to the linted file.

```js filename=".eslintrc.(c)js"
const path = require("path");

module.exports = {
  plugins: [
    "@pandacss"
  ],
  settings: {
    "@pandacss/configPath": path.join("PATH-TO/panda.config.js")
  }
};
```