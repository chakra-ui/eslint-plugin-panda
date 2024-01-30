import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-property-renaming'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

function Text({ textStyle }){
  return <p className={css({ textStyle })} />;
}`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function Text(props){
  return <p className={css({ textStyle: props.textStyle })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function CustomCircle(props){
  const { size = '3' } = props
  return (
    <Circle
      size={size}
    />
  )
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function CustomCircle(props){
  return (
    <Circle
      size={props.size}
    />
  )
}`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

function Text({ variant }){
  return <p className={css({ textStyle: variant })} />;
}`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function Text(props){
  return <p className={css({ textStyle: props.variant })} />;
}`,
  },

  //TODO detect pattern attributes as panda property
  //   {
  //     code: javascript`
  // import { Circle } from './panda/jsx';

  // function CustomCircle(props){
  //   const { circleSize = '3' } = props
  //   return (
  //     <Circle
  //       size={circleSize}
  //     />
  //   )
  // }`,
  //   },

  //   {
  //     code: javascript`
  // import { Circle } from './panda/jsx';

  // function CustomCircle(props){
  //   return (
  //     <Circle
  //       size={props.circleSize}
  //     />
  //   )
  // }`,
  //   },
]

tester.run(RULE_NAME, rule, {
  valid: valids.map(({ code }) => ({
    code,
  })),
  invalid: invalids.map(({ code }) => ({
    code,
    errors: 1,
  })),
})
