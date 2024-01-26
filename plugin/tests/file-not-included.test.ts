import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/file-not-included'

const javascript = String.raw

const validCode = javascript`
// File App.tsx is covered in the include config, so it's okay to import css and Circle from panda into it.

import { css } from './panda/css';
import { Circle } from './panda/jsx';
`

const invalidCode = javascript`
// File Invalid.tsx is not covered in the include config, so imporing css and Circle from panda into it is not allowed.

import { css } from './panda/css';
import { Circle } from './panda/jsx';
`

tester.run(RULE_NAME, rule, {
  valid: [
    {
      code: validCode,
      filename: 'App.tsx',
    },
  ],
  invalid: [
    {
      code: invalidCode,
      filename: 'Invalid.tsx',
      errors: 2,
    },
  ],
})
