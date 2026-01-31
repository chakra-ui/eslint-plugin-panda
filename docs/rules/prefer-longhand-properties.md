# prefer-longhand-properties

📝 Discourage the use of shorthand properties and promote the preference for longhand properties in the codebase.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

Discourage the use of shorthand properties and promote the preference for longhand properties in the codebase.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const styles = css({ ml: '4' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ bg: 'red.100' })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  pos: 'absolute' }} />;
}
```

Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({ marginLeft: '4' });
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
  return <Circle _hover={{  position: 'absolute' }} />;
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name        | Type     |
| :---------- | :------- |
| `whitelist` | String[] |

<!-- end auto-generated rule options list -->

### `whitelist`

An array of shorthand property names to allow. For example, to allow `ml` and `bg`:

```json
{
  "@pandacss/prefer-longhand-properties": ["warn", { "whitelist": ["ml", "bg"] }]
}
```
