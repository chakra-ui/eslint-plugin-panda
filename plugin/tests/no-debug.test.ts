import rule, { RULE_NAME } from '../src/rules/no-debug'
import { tester } from '../test-utils'

const imports = `import { css } from './panda/css';
import { styled, Circle } from './panda/jsx';\n\n`

const valids = [
  { code: 'const styles = { debug: true }' },
  { code: 'const styles = css({ bg: "red" })' },
  { code: 'const styles = css.raw({ bg: "red" })' },
  { code: 'const randomFunc = f({ debug: true })', docgen: true },
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
    docgen: true,
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
    docgen: true,
  },
]

tester.run(RULE_NAME, rule as any, {
  valid: valids.map(({ code, docgen }) => ({
    code: imports + code,
    filename: './src/valid.tsx',
    docgen,
  })),
  invalid: invalids.map(({ code, output, docgen }) => ({
    code: imports + code,
    filename: './src/invalid.tsx',
    errors: [
      {
        messageId: 'debug',
        suggestions: null,
      },
    ],
    output: imports + output,
    docgen,
  })),
})