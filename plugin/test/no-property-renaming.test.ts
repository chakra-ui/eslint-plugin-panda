import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-property-renaming'

const imports = `import { Circle } from './panda/jsx';`

const valids = [
  `
const CustomCircle = (props: Props) => {
  const { size = '3' } = props
  return (
    <Circle
      size={size}
    />
  )
}
`,
  `
const CustomCircle = (props: Props) => {
  return (
    <Circle
      size={props.size}
    />
  )
}
`,
]

const invalids = [
  `
const CustomCircle = (props: Props) => {
  const { circleSize = '3' } = props
  return (
    <Circle
      size={circleSize}
    />
  )
}
`,
  `
const CustomCircle = (props: Props) => {
  return (
    <Circle
      size={props.circleSize}
    />
  )
}
`,
]

tester.run(RULE_NAME, rule as any, {
  valid: valids.map((code) => ({
    code: imports + code,
    filename: './src/valid.tsx',
  })),
  invalid: invalids.map((code) => ({
    code: imports + code,
    filename: './src/invalid.tsx',
    errors: [
      {
        messageId: 'noRenaming',
        suggestions: null,
      },
    ],
  })),
})
