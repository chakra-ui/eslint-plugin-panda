import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-unsafe-token-fn-usage'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ bg: 'token(colors.red.300) 50%' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';
import { token } from './panda/tokens';

function App(){
  return  <div style={{ color: token('colors.red.50') }} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  border: 'solid 1px {colors.blue.400}' }} />;
}`,
  },
]

const invalids = [
  {
    code: javascript`
import { token } from './panda/tokens';
import { css } from './panda/css';

const styles = css({ bg: token('colors.red.300') })`,
    output: javascript`
import { token } from './panda/tokens';
import { css } from './panda/css';

const styles = css({ bg: 'red.300' })`,
  },

  {
    code: javascript`
import { token } from './panda/tokens';
import { css } from './panda/css';

function App(){
  return  <div className={css({ bg: 'token(colors.red.300)' })} />;
}`,
    output: javascript`
import { token } from './panda/tokens';
import { css } from './panda/css';

function App(){
  return  <div className={css({ bg: 'red.300' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle margin='{sizes.4}' />;
}`,
    output: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle margin='4' />;
}`,
  },
]

tester.run(RULE_NAME, rule, {
  valid: valids.map(({ code }) => ({
    code,
  })),
  invalid: invalids.map(({ code, output }) => ({
    code,
    errors: [
      {
        messageId: 'noUnsafeTokenFnUsage',
      },
    ],
    output,
  })),
})
