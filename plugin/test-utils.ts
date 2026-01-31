import { RuleTester } from 'eslint'
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint'
import tsParser from '@typescript-eslint/parser'

const baseTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
  },
})

type ValidTestCase<Options> = string | { code: string; options?: Options; filename?: string; [key: string]: unknown }
type InvalidTestCase<Options> = {
  code: string
  errors: number | unknown[]
  options?: Options
  filename?: string
  [key: string]: unknown
}

// Wrapper that handles the type mismatch between @typescript-eslint/utils rules and ESLint's RuleTester
export const tester = {
  run<MessageIds extends string, Options extends readonly unknown[]>(
    name: string,
    rule: RuleModule<MessageIds, Options>,
    tests: {
      valid?: readonly ValidTestCase<Options>[]
      invalid?: readonly InvalidTestCase<Options>[]
    },
  ): void {
    baseTester.run(name, rule as any, tests as any)
  },
}
