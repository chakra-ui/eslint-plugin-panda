import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-shorthand-prop'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ marginLeft: '4' })`,
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
  return  <Circle _hover={{  position: 'absolute' }} />;
}`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ ml: '4' })`,
    output: javascript`
import { css } from './panda/css';

const styles = css({ marginLeft: '4' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return  <div className={css({ bg: 'red.100' })} />;
}`,
    output: javascript`
import { css } from './panda/css';

function App(){
  return  <div className={css({ background: 'red.100' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  pos: 'absolute' }} />;
}`,
    output: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  position: 'absolute' }} />;
}`,
  },
]

tester.run(RULE_NAME, rule, {
  valid: valids.map(({ code }) => ({
    code,
  })),
  invalid: invalids.map(({ code, output }) => ({
    code,
    errors: 1,
    output: output,
  })),
})
