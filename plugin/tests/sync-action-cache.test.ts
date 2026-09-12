import rule, { RULE_NAME } from '../src/rules/file-not-included'
import { eslintTester } from '../test-utils'

/**
 * Regression test for the `syncAction` memoization in `utils/index.ts`.
 *
 * `isValidFile` is the only worker action that reads `opts.currentFile` inside the worker instead
 * of taking it as an argument, so it must never be served from a key that omits the file.
 *
 * Both cases set `@pandacss/configPath` and are linted in the same process on purpose: the cache
 * key only falls back to the current file when that setting is absent, so without it the two
 * files get different keys and the regression stays invisible. That is why the existing
 * `file-not-included` tests, which already lint two files, do not catch it.
 */
const settings = { '@pandacss/configPath': 'panda.config.ts' }

const code = `import { css } from './panda/css';`

eslintTester.run(`${RULE_NAME} (isValidFile is not shared across files)`, rule as any, {
  valid: [
    // App.tsx is covered by `include`, so importing panda into it is allowed.
    { code, filename: 'App.tsx', settings },
  ],
  invalid: [
    // Invalid.tsx is excluded, so the same import must still be reported — even though App.tsx
    // was linted first under the same config path.
    { code, filename: 'Invalid.tsx', settings, errors: 1 },
  ],
})
