# @pandacss/no-debug

⚠️ This rule _warns_ in the following configs: 🌐 `plugin:@pandacss/all`, ✅ `plugin:@pandacss/recommended`.

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Disallow the inclusion of the debug attribute when shipping code to the production environment.

```json
{
  "plugins": ["@pandacss"],
  "rules": {
    "@pandacss/no-debug": "warn" // or error
  }
}
```

```js
// ❌ bad
const styles = css({ debug: true })

// ✅ good
const styles = css({ ... })
```
