# no-escape-hatch

📝 Prohibit the use of escape hatch syntax in the code.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

Prohibit the use of escape hatch syntax in the code.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const styles = css({ marginLeft: '[4px]' });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ background: '[#111]' })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{ position: '[absolute]' }} />;
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
  return <Circle _hover={{ position: 'absolute' }} />;
}
```
