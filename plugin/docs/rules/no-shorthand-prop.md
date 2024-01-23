# @pandacss/no-shorthand-prop

⚠️ This rule _warns_ in the 🌐 `plugin:@pandacss/all` config.

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Discourage the use of shorthand properties and promote the preference for longhand CSS properties in the codebase.

```json
{
  "plugins": ["@pandacss"],
  "rules": {
    "@pandacss/no-shorthand-prop": "warn" // or error
  }
}
```

```js
// ❌ bad
const styles = css({ bgColor: 'gray.100' })

// ✅ good
const styles = css({ backgroundColor: 'gray.100' })
```
