# prefer-composite-properties

📝 Encourage the use of composite properties instead of atomic properties in the codebase.

<!-- end auto-generated rule header -->

## Rule Details

Encourage the use of composite properties instead of atomic properties in the codebase.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const styles = css({ rowGap: '4', columnGap: '4' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ bgColor: 'red.100' })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: 'blue' }} />;
}
```

Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({ gap: '4' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ background: 'red.100' })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  borderTop: 'solid 1px blue' }} />;
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name        | Type     |
| :---------- | :------- |
| `whitelist` | String[] |

<!-- end auto-generated rule options list -->

### `whitelist`

An array of atomic property names to allow. For example, to allow `rowGap` and `columnGap`:

```json
{
  "@pandacss/prefer-composite-properties": ["warn", { "whitelist": ["rowGap", "columnGap"] }]
}
```
