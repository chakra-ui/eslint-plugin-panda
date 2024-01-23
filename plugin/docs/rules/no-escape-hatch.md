# @pandacss/no-escape-hatch

⚠️ This rule _warns_ in the 🌐 `plugin:@pandacss/all` config.

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Prohibit the use of escape hatch syntax in the code.

```json
{
  "plugins": ["@pandacss"],
  "rules": {
    "@pandacss/no-escape-hatch": "warn" // or error
  }
}
```

```js
// ❌ bad
const styles = css({ background: '[#111]' })

// ✅ good
const styles = css({ background: 'gray.900' })
```
