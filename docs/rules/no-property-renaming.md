# no-property-renaming

📝 Ensure that properties for patterns or style props are not renamed, as it prevents proper tracking.

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Rule Details

Ensure that properties for patterns or style props are not renamed, as it prevents proper tracking.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

function Text({ variant }){
  return <p className={css({ textStyle: variant })} />;
};
```
```js

import { css } from './panda/css';

function Text(props){
  return <p className={css({ textStyle: props.variant })} />;
}
```

Examples of **correct** code:
```js
import { css } from './panda/css';

function Text({ textStyle }){
  return <p className={css({ textStyle })} />;
};
```
```js

import { css } from './panda/css';

function Text(props){
  return <p className={css({ textStyle: props.textStyle })} />;
};
```
```js

import { Circle } from './panda/jsx';

function CustomCircle(props){
  const { size = '3' } = props
  return (
    <Circle
      size={size}
    />
  )
};
```
```js

import { Circle } from './panda/jsx';

function CustomCircle(props){
  return (
    <Circle
      size={props.size}
    />
  )
}
```
