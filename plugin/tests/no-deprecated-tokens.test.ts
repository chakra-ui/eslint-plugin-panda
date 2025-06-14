import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-deprecated-tokens'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ color: 'red.100' })`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

// Assumes that the token is deprecated
const styles = css({ color: 'red.400' })`,
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
