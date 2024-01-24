//@ts-expect-error
import { RuleTester } from 'eslint-docgen'

const baseTesterConfig = {
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
}

export const tester = new RuleTester(baseTesterConfig)
