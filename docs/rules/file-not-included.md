# file-not-included

📝 Disallow the use of Panda CSS in files that are not included in the specified Panda CSS `include` config.

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Rule Details

Disallow the use of Panda CSS in files that are not included in the specified Panda CSS `include` config.

Examples of **correct** code for a file named `App.tsx`:
```js
// File App.tsx is covered in the include config, so it's okay to import css and Circle from panda into it.

import { css } from './panda/css';
import { Circle } from './panda/jsx';
```

Examples of **incorrect** code for a file named `Invalid.tsx`:
```js
// File Invalid.tsx is not covered in the include config, so imporing css and Circle from panda into it is not allowed.

import { css } from './panda/css';
import { Circle } from './panda/jsx';
```
