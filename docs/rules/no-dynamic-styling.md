# no-dynamic-styling

📝 Ensure users don't use dynamic styling. Prefer static styles, leverage CSS variables, or recipes for known dynamic styles.

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Rule Details

Ensure users don't use dynamic styling. Prefer static styles, leverage CSS variables, or recipes for known dynamic styles.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const color = 'red.100';
const styles = css({ bg: color });
```
```js

import { css } from './panda/css';

const size = '8';
const styles = css({ padding: ['4', size] });
```
```js

import { stack } from './panda/patterns';

const align = 'center';
const styles = stack({ align: align });
```
```js

import { Circle } from './panda/jsx';

function App(){
  const bool = true;
  return <Circle debug={bool} />;
};
```
```js

import { styled } from './panda/jsx';

function App(){
  const color = 'red.100';
  return <styled.div color={color} />;
};
```
```js

import { css } from './panda/css';

const property = 'background';
const styles = css({ [property]: 'red.100' });
```
```js

import { cva,sva } from './panda/css';

function App(){
  const computedValue = "value"
  const heading = cva({
    variants: {
      [computedValue]: {
        color: "red.100",
      }
    }
  });
}
```

Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({ bg: 'gray.900' });
```
```js

import { css } from './panda/css';

const styles = css({ padding: ['4', '8'] });
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle debug={true} />;
};
```
```js

import { styled } from './panda/jsx';

function App(){
  return <styled.div color='red.100' />;
};
```
```js

const foo = 'foo'
const nonStyles = {bar: [foo]}
```
