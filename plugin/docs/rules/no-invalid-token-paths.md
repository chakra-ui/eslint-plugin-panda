# @pandacss/no-invalid-token-paths

💼 This rule is enabled in the following configs: 🌐 `plugin:@pandacss/all`, ✅ `plugin:@pandacss/recommended`.

<!-- end auto-generated rule header -->

Disallow the use of invalid token paths within token function syntax.

```json
{
  "plugins": ["@pandacss"],
  "rules": {
    "@pandacss/no-invalid-token-paths": "warn" // or error
  }
}
```

```js
// ❌ bad                                      ^
const styles = css({ border: 'solid 1px {colorss.gray.50}' })

// ✅ good
const styles = css({ border: 'solid 1px {colors.gray.50}' })
```
