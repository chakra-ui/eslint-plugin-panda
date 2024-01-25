//@ts-expect-error
import { RuleTester } from 'eslint-docgen'
import { RuleTester as ERuleTester } from 'eslint'

const baseTesterConfig = {
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
}

export const tester = new RuleTester(baseTesterConfig)
export const eslintTester = new ERuleTester(baseTesterConfig)
