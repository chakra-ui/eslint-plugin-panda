import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/prefer-atomic-properties'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ rowGap: '4', columnGap: '4' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return <div className={css({ backgroundColor: 'red.100' })} />;
}`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return <Circle _hover={{  borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: 'blue' }} />;
}`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ marginBlockStart: '4', marginBlockEnd: '8' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ paddingInlineStart: '4', paddingInlineEnd: '8' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ insetBlockStart: '0', insetBlockEnd: '0' })`,
  },
]

const invalids = [
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

const styles = css({ marginBlock: '4 8' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ paddingInline: '4 8' })`,
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

const styles = css({ borderInlineWidth: '1px' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ scrollMarginBlock: '4' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ insetInline: '0' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ marginInline: 'auto' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ paddingBlock: '4' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ scrollMarginInline: '4' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ borderBlockColor: 'red' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ borderInline: 'solid 1px blue' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ borderBlockStyle: 'solid' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ borderBlockWidth: '1px' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ borderInlineColor: 'red' })`,
  },

  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ borderInlineStyle: 'solid' })`,
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
