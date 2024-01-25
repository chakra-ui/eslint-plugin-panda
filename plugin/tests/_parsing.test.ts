import rule, { RULE_NAME } from '../src/rules/no-debug'
import rule2, { RULE_NAME as RULE_NAME2 } from '../src/rules/no-dynamic-styling'
import rule3, { RULE_NAME as RULE_NAME3 } from '../src/rules/no-escape-hatch'
import rule4, { RULE_NAME as RULE_NAME4 } from '../src/rules/no-unsafe-token-fn-usage'
import { tester } from '../test-utils'
import { getArbitraryValue } from '@pandacss/shared'

//* This test is just to ensure that the plugin correctly recognises panda in various kinds of code.

const imports = `import { css } from './panda/css';
import { styled, Circle } from './panda/jsx';\n\n`

//? For testing correct parsing

const valids = [
  { code: 'const styles = { debug: true }' },
  { code: 'const styles = css({ bg: "red" })' },
  { code: 'const styles = css.raw({ bg: "red" })' },
  { code: 'const randomFunc = f({ debug: true })' },
  { code: '<NonPandaComponent debug={true} />' },
  { code: '<NonPandaComponent debug={true}>content</NonPandaComponent>' },
  {
    code: `const PandaComp = styled(div); function App(){ const a = 1;  return (<PandaComp someProp={{ debug: true }} />)}`,
  },
]

const invalids = [
  {
    code: 'const styles = css({ bg: "red", debug: true })',
    output: 'const styles = css({ bg: "red", })',
  },
  {
    code: 'const styles = css.raw({ bg: "red", debug: true })',
    output: 'const styles = css.raw({ bg: "red", })',
  },
  {
    code: 'const styles = css({ bg: "red", "&:hover": { debug: true } })',
    output: 'const styles = css({ bg: "red", "&:hover": { } })',
  },
  {
    code: 'const styles = css({ bg: "red", "&:hover": { "&:disabled": { debug: true } } })',
    output: 'const styles = css({ bg: "red", "&:hover": { "&:disabled": { } } })',
  },
  { code: '<Circle debug />', output: '<Circle  />' },
  { code: '<Circle debug={true} />', output: '<Circle  />' },
  { code: '<Circle css={{ debug: true }} />', output: '<Circle css={{ }} />' },
  { code: '<Circle css={{ "&:hover": { debug: true } }} />', output: '<Circle css={{ "&:hover": { } }} />' },
  { code: '<styled.div _hover={{ debug: true }} />', output: '<styled.div _hover={{ }} />' },
  {
    code: `const PandaComp = styled(div); <PandaComp css={{ debug: true }} />`,
    output: 'const PandaComp = styled(div); <PandaComp css={{ }} />',
  },
  {
    code: `function App() {
  const PandaComp = styled(div);
  return <PandaComp css={{ debug: true }} />;
}`,
    output: `function App() {
  const PandaComp = styled(div);
  return <PandaComp css={{ }} />;
}`,
  },
]

tester.run(RULE_NAME, rule, {
  valid: valids.map(({ code }) => ({
    code: imports + code,
  })),
  invalid: invalids.map(({ code, output }) => ({
    code: imports + code,
    errors: [
      {
        messageId: 'debug',
        suggestions: null,
      },
    ],
    output: imports + output,
  })),
})

//? For testing all sorts of expressions

const valids2 = [
  'const styles = css({ bg: "red" })',
  'const styles = css({ bg: `red` })',
  'const styles = css({ bg: 1 })',
  'const styles = css({ debug: true })',
  '<Circle debug={true} />',
  '<Circle color={"red"} />',
  '<Circle color={`red`} />',
]

const invalids2 = ['const styles = css({ bg: color })', '<Circle debug={bool} />', '<styled.div color={color} />']

tester.run(RULE_NAME2, rule2 as any, {
  valid: valids2.map((code) => ({
    code: imports + code,
  })),
  invalid: invalids2.map((code) => ({
    code: imports + code,
    errors: [
      {
        messageId: 'dynamic',
        suggestions: null,
      },
    ],
  })),
})

//? Testing multiline arbitrary expressions

const namedGridLines = `
[
  [full-start]
    minmax(16px, 1fr)
      [breakout-start]
        minmax(0, 16px)
          [content-start]
            minmax(min-content, 1024px)
          [content-end]
        minmax(0, 16px)
      [breakout-end]
    minmax(16px, 1fr)
  [full-end]
]
`

const valids3 = [
  `const layout = css({
      display: "grid",
      gridTemplateColumns: \`${getArbitraryValue(namedGridLines)}\`,
    });
    `,
  `<Circle gridTemplateColumns={\`${getArbitraryValue(namedGridLines)}\`} />`,
]

const invalids3 = [
  {
    code: `const layout = css({
    display: "grid",
    gridTemplateColumns: \`${namedGridLines}\`,
  });
  `,
    output: `const layout = css({
    display: "grid",
    gridTemplateColumns: \`${getArbitraryValue(namedGridLines)}\`,
  });
  `,
  },
  {
    code: `<Circle gridTemplateColumns={\`${namedGridLines}\`} />`,
    output: `<Circle gridTemplateColumns={\`${getArbitraryValue(namedGridLines)}\`} />`,
  },
]

tester.run(RULE_NAME3, rule3, {
  valid: valids3.map((code) => ({
    code: imports + code,
  })),
  invalid: invalids3.map(({ code, output }) => ({
    code: imports + code,
    errors: [
      {
        messageId: 'escapeHatch',
        suggestions: null,
      },
    ],
    output: imports + output,
  })),
})

//? Testing aliased imports

const imports4 = `import { css } from './panda/css';
import { token as tk } from './panda/tokens'
import { Circle } from './panda/jsx';\n\n`

const valids4 = ['const styles = css({ bg: "token(colors.red.300) 50%" })']

const invalids4 = [
  {
    code: 'const styles = css({ bg: tk("colors.red.300") })',
    output: 'const styles = css({ bg: "red.300" })',
  },
  {
    code: 'const styles = css({ bg: tk(`colors.red.300`) })',
    output: 'const styles = css({ bg: "red.300" })',
  },

  { code: '<Circle bg={tk("colors.red.300")} />', output: '<Circle bg={"red.300"} />' },
]

tester.run(RULE_NAME4, rule4, {
  valid: valids4.map((code) => ({
    code: imports4 + code,
  })),
  invalid: invalids4.map(({ code, output }) => ({
    code: imports4 + code,

    errors: [
      {
        messageId: 'noUnsafeTokenFnUsage',
        suggestions: null,
      },
    ],
    output: imports4 + output,
  })),
})
