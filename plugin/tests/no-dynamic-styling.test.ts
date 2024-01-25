import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-dynamic-styling'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ bg: 'gray.900' });
`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return <Circle debug={true} />;
}
`,
  },

  {
    code: javascript`
import { styled } from './panda/jsx';

function App(){
  return <styled.div color='red.100' />;
}
`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ bg: color });
`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  const bool = true;
  return  <Circle debug={bool} />;
}
`,
  },

  {
    code: javascript`
import { styled } from './panda/jsx';

function App(){
  const color = 'red.100';
  return  <styled.div color={color} />;
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
        messageId: 'dynamic',
      },
    ],
  })),
})
