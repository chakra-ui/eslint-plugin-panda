import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-dynamic-styling'

const imports = `import { css } from './panda/css'
import { styled, Circle } from './panda/jsx'\n\n`

const valids = [
  'const styles = css({ bg: "red" })',
  'const styles = css({ bg: `red` })',
  'const styles = css({ bg: 1 })',
  'const styles = css({ debug: true })',
  '<Circle debug={true} />',
  '<Circle color={"red"} />',
  '<Circle color={`red`} />',
]

const invalids = ['const styles = css({ bg: color })', '<Circle debug={bool} />', '<styled.div color={color} />']

tester.run(RULE_NAME, rule as any, {
  valid: valids.map((code) => ({
    code: imports + code,
    filename: './src/valid.tsx',
    docgen: true,
  })),
  invalid: invalids.map((code) => ({
    code: imports + code,
    filename: './src/invalid.tsx',
    docgen: true,
    errors: [
      {
        messageId: 'dynamic',
        suggestions: null,
      },
    ],
  })),
})
