import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/prefer-composite-properties'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ gap: '4' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return  <div className={css({ background: 'red.100' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  borderTop: 'solid 1px blue' }} />;
}`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ rowGap: '4', columnGap: '4' })`,
    errors: 2,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return  <div className={css({ bgColor: 'red.100' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: 'blue' }} />;
}`,
    errors: 3,
  },
]

tester.run(RULE_NAME, rule, {
  valid: valids.map(({ code }) => ({
    code,
  })),
  invalid: invalids.map(({ code, errors = 1 }) => ({
    code,
    errors,
  })),
})
