import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/prefer-unified-property-style'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ borderColor: 'gray.900', borderWidth: '1px' })`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return <Circle marginTop="2" marginRight="3" />;
}`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

const color = 'red.100';
const styles = css({ borderRadius:"lg", borderTopRightRadius: "0" })`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  const bool = true;
  return <Circle border="solid 1px" borderColor="gray.800" />;
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
