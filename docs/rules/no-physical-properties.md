# no-physical-properties

📝 Encourage the use of logical properties over physical properties to foster a responsive and adaptable user interface.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

Encourage the use of logical properties over physical properties to foster a responsive and adaptable user interface.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const styles = css({ left: '0' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ marginLeft: '4' })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  borderBottom: 'solid 1px' }} />;
};
```
```js

import { css } from './panda/css';

const styles = css({ textAlign: 'left' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ textAlign: 'right' })} />;
};
```
```js

import { Box } from './panda/jsx';

function App(){
  return <Box textAlign={"left"} />;
};
```
```js

import { Box } from './panda/jsx';

function App(){
  return <Box textAlign={"right"} />;
}
```

Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({ insetInlineStart: '0' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ marginInlineStart: '4' })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  borderBlockEnd: 'solid 1px' }} />;
};
```
```js

import { css } from './panda/css';

const styles = css({ textAlign: 'start' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ textAlign: 'end' })} />;
};
```
```js

import { Box } from './panda/jsx';

function App(){
  return <Box textAlign={"start"} />;
};
```
```js

import { Box } from './panda/jsx';

function App(){
  return <Box textAlign={"end"} />;
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name        | Type     |
| :---------- | :------- |
| `whitelist` | String[] |

<!-- end auto-generated rule options list -->

### `whitelist`

An array of property names to allow. For example, to allow `left` and `right`:

```json
{
  "@pandacss/no-physical-properties": ["warn", { "whitelist": ["left", "right"] }]
}
```
