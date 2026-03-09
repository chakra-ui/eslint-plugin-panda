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
  return <div className={css({ background: 'red.100' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  borderTop: 'solid 1px blue' }} />;
}`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ marginBlock: '4' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ paddingInline: '4' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ insetBlock: '0' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ borderBlock: 'solid 1px blue' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ scrollMarginInline: '4' })`,
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
  return <div className={css({ bgColor: 'red.100' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: 'blue' }} />;
}`,
    errors: 3,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ marginBlockStart: '4', marginBlockEnd: '8' })`,
    errors: 2,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ paddingInlineStart: '4', paddingInlineEnd: '8' })`,
    errors: 2,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ insetBlockStart: '0', insetBlockEnd: '0' })`,
    errors: 2,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ borderBlockWidth: '1px', borderBlockStyle: 'solid', borderBlockColor: 'red' })`,
    errors: 3,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ scrollMarginInlineStart: '4', scrollMarginInlineEnd: '8' })`,
    errors: 2,
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
