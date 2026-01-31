# no-deprecated-tokens

📝 Disallow the use of deprecated tokens within token function syntax.

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Rule Details

Disallow the use of deprecated tokens within token function syntax.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

// Assumes that the token is deprecated
const styles = css({ color: 'red.400' })
```

Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({ color: 'red.100' })
```
