[//]: # (This file is generated by eslint-docgen. Do not edit it directly.)

# no-unsafe-token-fn-usage

Prevent users from using the token function in situations where they could simply use the raw design token.

📋 This rule is enabled in `plugin:@pandacss/all`.

📋 This rule is enabled in `plugin:@pandacss/recommended`.

## Rule details

❌ Examples of **incorrect** code:
```js
import { token } from './panda/tokens';
import { css } from './panda/css';

const styles = css({ bg: token('colors.red.300') });
```
```js

import { token } from './panda/tokens';
  import { css } from './panda/css';

  function App(){
    return <div className={css({ bg: 'token(colors.red.300)' })} />;
  };
```
```js

import { Circle } from './panda/jsx';

  function App(){
    return <Circle margin='[{sizes.4}]' />;
  }
```

✔️ Examples of **correct** code:
```js
import { css } from './panda/css';

const styles = css({ bg: 'token(colors.red.300) 50%' });
```
```js

import { css } from './panda/css';
import { token } from './panda/tokens';

function App(){
  return <div style={{ color: token('colors.red.50') }} />;
};
```
```js

import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  border: 'solid 1px {colors.blue.400}' }} />;
}
```

## Resources

* [Rule source](/plugin/src/rules/no-unsafe-token-fn-usage.ts)
* [Test source](/plugin/tests/no-unsafe-token-fn-usage.test.ts)
