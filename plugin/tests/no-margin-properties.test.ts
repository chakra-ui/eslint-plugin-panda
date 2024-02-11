import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-margin-properties'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ display: 'flex', gap: '4' })`,
  },

  {
    code: javascript`
import { grid } from './panda/css';

function App(){
  return <div className={grid({ gap: '3' })} />;
}`,
  },

  {
    code: javascript`
import { Flex } from './panda/jsx';

function App(){
  return <Flex gap="2" />;
}`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ marginLeft: '4' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return <div className={css({ margin: '3' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return <Circle marginX="2" />;
}`,
  },
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
