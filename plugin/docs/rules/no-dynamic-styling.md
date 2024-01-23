# @pandacss/no-dynamic-styling

⚠️ This rule _warns_ in the following configs: 🌐 `plugin:@pandacss/all`, ✅ `plugin:@pandacss/recommended`.

<!-- end auto-generated rule header -->

Ensure user doesn't use dynamic styling at any point. Prefer to use static styles, leverage css variables or recipes for
known dynamic styles.

```json
{
  "plugins": ["@pandacss"],
  "rules": {
    "@pandacss/no-dynamic-styling": "warn" // or error
  }
}
```

```js
// ❌ bad
const color = 'red'
const styles = css({ background: color })

// ✅ good
const styles = css({ background: 'red' })
```
