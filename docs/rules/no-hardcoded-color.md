# no-hardcoded-color

📝 Enforce the exclusive use of design tokens as values for colors within the codebase.

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Rule Details

Enforce the exclusive use of design tokens as values for colors within the codebase.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const styles = css({ color: '#FEE2E2' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ background: 'rgb(134, 239, 172)' })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  borderColor: 'hsl(220deg, 14%, 96%)' }} />;
}
```

Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({ color: 'red.100' });
```
```js

import { css } from './panda/css';

const styles = css({ color: 'red.100/30' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ background: 'green.300' })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  borderColor: 'gray.100' }} />;
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name        | Type     |
| :---------- | :------- |
| `noOpacity` | Boolean  |
| `whitelist` | String[] |

<!-- end auto-generated rule options list -->

Examples of **incorrect** code with `noOpacity: true` option:
```js
import { css } from './panda/css';

const styles = css({ color: 'red.100/30' });
```
