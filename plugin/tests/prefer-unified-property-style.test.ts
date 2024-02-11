import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/prefer-unified-property-style'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ marginTop: "2", marginRight: "2", marginBottom: "2", marginLeft: "5" })`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return <Circle borderStyle="solid" borderColor="gray.900" borderWidth="1px" />;
}`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ margin:"2", marginLeft: "5" })`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
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
