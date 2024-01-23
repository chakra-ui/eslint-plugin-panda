# @pandacss/no-unsafe-token-fn-usage

⚠️ This rule _warns_ in the 🌐 `plugin:@pandacss/all` config.

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Prevent users from using the token function in situations where they could simply use the raw design token.

```json
{
  "plugins": ["@pandacss"],
  "rules": {
    "@pandacss/no-unsafe-token-fn-usage": "warn" // or error
  }
}
```

```js
// ❌ bad
const styles = css({ backgroundColor: '{colors.gray.100}' })

// ✅ good
const styles = css({ border: 'solid 1px {colors.gray.50}' })
```
