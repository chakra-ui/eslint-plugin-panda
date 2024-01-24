import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/file-not-included'

const code = `import { css } from './panda/css'
import { Circle } from './panda/jsx'\n\n`

tester.run(RULE_NAME, rule as any, {
  valid: [
    {
      code: code,
      filename: './src/valid.tsx',
      docgen: true,
    },
  ],
  invalid: [
    {
      code: code,
      filename: './src/invalid.tsx',
      docgen: true,
      errors: [
        {
          messageId: 'include',
          suggestions: null,
        },
        {
          messageId: 'include',
          suggestions: null,
        },
      ],
    },
  ],
})
