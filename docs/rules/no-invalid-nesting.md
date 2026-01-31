# no-invalid-nesting

📝 Warn against invalid nesting. Nested styles must contain the `&` character.

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Rule Details

Warn against invalid nesting. Nested styles must contain the `&` character.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const styles = css({
  ':hover': { marginLeft: '4px' },
});
```
```js

import { css } from './panda/css';

function App() {
  return (
    <div
      className={css({
        '.dark ': { background: 'red.100' },
      })}
    />
  );
};
```
```js

import { Circle } from './panda/jsx';

function App() {
  return (
    <Circle
      css={{
        '[data-focus]': { position: 'absolute' },
      }}
    />
  );
}
```

Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({
  '&:hover': { marginLeft: '4px' },
});
```
```js

import { css } from './panda/css';

function App() {
  return (
    <div
      className={css({
        '.dark &': { background: 'red.100' },
      })}
    />
  );
};
```
```js

import { Circle } from './panda/jsx';

function App() {
  return (
    <Circle
      css={{
        '&[data-focus]': { position: 'absolute' },
      }}
    />
  );
}
```
