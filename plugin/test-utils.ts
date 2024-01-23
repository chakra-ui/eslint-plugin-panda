import { RuleTester, type RuleTesterConfig } from '@typescript-eslint/rule-tester'
import * as vitest from 'vitest'

RuleTester.afterAll = vitest.afterAll

RuleTester.it = vitest.it
RuleTester.itOnly = vitest.it.only
RuleTester.describe = vitest.describe

const baseTesterConfig: RuleTesterConfig = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
}

export const tester = new RuleTester(baseTesterConfig)
