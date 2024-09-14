import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-dynamic-styling'

const javascript = String.raw

const valids = [
  {
    code: javascript`
import { css } from './panda/css';

const styles = css({ bg: 'gray.900' })`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  return <Circle debug={true} />;
}`,
  },

  {
    code: javascript`
import { styled } from './panda/jsx';

function App(){
  return <styled.div color='red.100' />;
}`,
  },

  {
    code: javascript`
import { cva,sva } from './panda/css';

function App(){
  const heading = cva({
    variants: {
      value: {
        color: "red.100",
      }
    }
  });
}`,
  },
]

const invalids = [
  {
    code: javascript`
import { css } from './panda/css';

const color = 'red.100';
const styles = css({ bg: color })`,
  },

  {
    code: javascript`
import { stack } from './panda/patterns';

const align = 'center';
const styles = stack({ align: align })`,
  },

  {
    code: javascript`
import { Circle } from './panda/jsx';

function App(){
  const bool = true;
  return <Circle debug={bool} />;
}`,
  },

  {
    code: javascript`
import { styled } from './panda/jsx';

function App(){
  const color = 'red.100';
  return <styled.div color={color} />;
}`,
  },

  {
    code: javascript`
import { cva,sva } from './panda/css';

function App(){
  const computedValue = "value"
  const heading = cva({
    variants: {
      [computedValue]: {
        color: "red.100",
      }
    }
  });
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
