import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/prefer-atomic-properties'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ rowGap: '4', columnGap: '4' });
`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return  <div className={css({ backgroundColor: 'red.100' })} />;
}
`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: 'blue' }} />;
}
`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ gap: '4' });
`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return  <div className={css({ background: 'red.100' })} />;
}
`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  borderTop: 'solid 1px blue' }} />;
}
`,
  },
]

tester.run(RULE_NAME, rule, {
  valid: valids.map(({ code }) => ({
    code,
  })),
  invalid: invalids.map(({ code }) => ({
    code,
    errors: [
      {
        messageId: 'atomic',
        suggestions: null,
      },
    ],
  })),
})
