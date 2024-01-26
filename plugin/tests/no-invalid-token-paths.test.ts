import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-invalid-token-paths'

const javascript = String.raw

const validLiteral = 'const className = css`\n  font-size: {fontSizes.md};\n`'
const invalidLiteral = 'const className = css`\n  font-size: {fontSizes.emd};\n`'

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ bg: 'token(colors.red.300) 50%' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return  <div className={css({ marginX: '{sizes.4} 20px' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  border: 'solid 1px token(colors.gray.100, #F3F4F6)' }} />;
}`,
  },

  {
    code: javascript`
import { css } from './panda/css';

${validLiteral}`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

// colorszz is not a valid token type
const styles = css({ bg: 'token(colorszz.red.300) 50%' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  // \`4000\` is not a valid size token. Assuming we're using the default panda presets
  return  <div className={css({ marginX: '{sizes.4000} 20px' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  // \`1\` does not exist in borderWidths, and \`grays\` is not a valid color token. Assuming we're using the default panda presets
  return  <Circle _hover={{  border: 'solid {borderWidths.1} token(colors.grays.100, #F3F4F6)' }} />;
}`,
    errors: 2,
  },

  {
    code: javascript`
import { css } from './panda/css';

${invalidLiteral}`,
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
