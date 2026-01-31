# no-margin-properties

📝 Discourage using margin properties for spacing; prefer defining spacing in parent elements with `flex` or `grid` using the `gap` property for a more resilient layout. Margins make components less reusable in other contexts.

<!-- end auto-generated rule header -->

## Rule Details

Discourage using margin properties for spacing; prefer defining spacing in parent elements with `flex` or `grid` using the `gap` property for a more resilient layout. Margins make components less reusable in other contexts.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const styles = css({ marginLeft: '4' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ margin: '3' })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle marginX="2" />;
}
```

Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({ display: 'flex', gap: '4' });
```
```js

import { grid } from './panda/css';

function App(){
  return <div className={grid({ gap: '3' })} />;
};
```
```js

import { Flex } from './panda/jsx';

function App(){
  return <Flex gap="2" />;
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name        | Type     |
| :---------- | :------- |
| `whitelist` | String[] |

<!-- end auto-generated rule options list -->

### `whitelist`

An array of property names to allow. For example, to allow `margin` and `marginTop`:

```json
{
  "@pandacss/no-margin-properties": ["warn", { "whitelist": ["margin", "marginTop"] }]
}
```
