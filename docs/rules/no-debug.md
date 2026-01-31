# no-debug

📝 Disallow the inclusion of the debug attribute when shipping code to the production environment.

⚠️ This rule _warns_ in the ✅ `recommended` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

Disallow the inclusion of the debug attribute when shipping code to the production environment.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const styles = css({ marginLeft: '4', debug: true });
```
```js

import { css } from './panda/css';

function App(){
  return <div className={css({ background: 'red.100', debug: true })} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{ position: 'absolute' }} debug />;
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
