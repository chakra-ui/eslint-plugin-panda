# prefer-unified-property-style

📝 Discourage mixing atomic and composite forms of the same property in a style declaration. Atomic styles give more consistent results.

<!-- end auto-generated rule header -->

## Rule Details

Discourage mixing atomic and composite forms of the same property in a style declaration. Atomic styles give more consistent results.

Examples of **incorrect** code:
```js
import { css } from './panda/css';

const styles = css({ margin:"2", marginLeft: "5" });
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle border="solid 1px" borderColor="gray.800" />;
}
```

Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({ marginTop: "2", marginRight: "2", marginBottom: "2", marginLeft: "5" });
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle borderStyle="solid" borderColor="gray.900" borderWidth="1px" />;
}
```
