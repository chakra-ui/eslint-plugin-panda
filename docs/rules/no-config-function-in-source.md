# no-config-function-in-source

📝 Prohibit the use of config functions outside the Panda config file.

💼 This rule is enabled in the ✅ `recommended` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

Prohibit the use of config functions outside the Panda config file.

Examples of **incorrect** code for a file named `App.tsx`:
```js
import {  defineKeyframes } from '@pandacss/dev';
import { css } from './panda/css';

const keyframes = defineKeyframes({
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
});

const styles = css({
  animation: 'fadeIn 1s ease-in-out',
});
```

Examples of **correct** code for a file named `panda.config.ts`:
```ts
import { defineConfig, defineKeyframes } from '@pandacss/dev';

const keyframes = defineKeyframes({
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
});

export default defineConfig({
  theme: {
    keyframes
  }
});
```
