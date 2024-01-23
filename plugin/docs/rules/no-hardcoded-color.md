# @pandacss/no-hardcoded-color

⚠️ This rule _warns_ in the 🌐 `plugin:@pandacss/all` config.

<!-- end auto-generated rule header -->

Enforce the exclusive use of design tokens as values for colors within the codebase.

```json
{
  "plugins": ["@pandacss"],
  "rules": {
    "@pandacss/no-hardcoded-color": "warn" // or error
  }
}
```

```js
// ❌ bad
const styles = css({ background: '#111' })

// ✅ good
const styles = css({ background: 'gray.100' })
```
