# @pandacss/prefer-atomic-properties

⚠️ This rule _warns_ in the 🌐 `plugin:@pandacss/all` config.

<!-- end auto-generated rule header -->

Encourage the use of atomic properties instead of composite shorthand properties in the codebase.

```json
{
  "plugins": ["@pandacss"],
  "rules": {
    "@pandacss/prefer-atomic-properties": "warn" // or error
  }
}
```

```js
// ❌ bad
const styles = css({ gap: '4' })

// ✅ good
const styles = css({ columngGap: '4', rowGap: '4' })
```
