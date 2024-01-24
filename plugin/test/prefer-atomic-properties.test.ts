import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/prefer-atomic-properties'

const imports = `import { css } from './panda/css'
import { Circle } from './panda/jsx'\n\n`

const valids = [
  'const styles = css({ rowGap: "4", columnGap: "4" })',
  '<div className={css({ backgroundColor: "red" })} />',
  '<Circle _hover={{ borderTopStyle: "solid", borderTopWidth: "1px", borderTopColor: "blue" }} />',
]

const invalids = [
  'const styles = css({ gap: "4" })',
  '<div className={css({ background: "red" })} />',
  '<Circle _hover={{ borderTop: "solid 1px blue" }} />',
]

tester.run(RULE_NAME, rule as any, {
  valid: valids.map((code) => ({
    code: imports + code,
    filename: './src/valid.tsx',
    docgen: true,
  })),
  invalid: invalids.map((code) => ({
    code: imports + code,
    filename: './src/invalid.tsx',
    errors: [
      {
        messageId: 'atomic',
        suggestions: null,
      },
    ],
    docgen: true,
  })),
})
