import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-property-renaming'

const imports = `import { css } from './panda/css'
import { Circle } from './panda/jsx'\n\n`

const valids = [
  `
const Text = ({ textStyle }) => {
  return <p className={css({ textStyle })} />
}`,
  `
const Text = (props) => {
  return <p className={css({ textStyle: props.textStyle })} />
}`,
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
const Text = ({ variant }) => {
  return <p className={css({ textStyle: variant })} />
}`,
  `
const Text = (props) => {
  return <p className={css({ textStyle: props.variant })} />
}`,
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
    docgen: true,
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
    docgen: true,
  })),
})
