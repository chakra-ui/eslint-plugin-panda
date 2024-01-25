import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-hardcoded-color'

const javascript = String.raw

// TODO Watch out for color opacity in the future

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ color: 'red.100' });
`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return  <div className={css({ background: 'green.300' })} />;
}
`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  borderColor: 'gray.100' }} />;
}
`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ color: '#FEE2E2' });
`,
  },

  {
    code: javascript`
import { css } from './panda/css';

function App(){
  return  <div className={css({ background: 'rgb(134, 239, 172)' })} />;
}
`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return  <Circle _hover={{  borderColor: 'hsl(220deg, 14%, 96%)' }} />;
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
        messageId: 'invalidColor',
        suggestions: null,
      },
    ],
  })),
})
