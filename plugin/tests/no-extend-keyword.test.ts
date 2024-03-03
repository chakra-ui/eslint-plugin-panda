import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-extend-keyword'
import path from 'path'
import fs from 'fs'

const validConfig = path.resolve('plugin/tests/no-extend-keyword/valid-panda.config.ts')
const invalidConfig = path.resolve('plugin/tests/no-extend-keyword/invalid-panda.config.ts')

const valid = fs.readFileSync(validConfig, 'utf8')

const invalid = fs.readFileSync(invalidConfig, 'utf8')

tester.run(RULE_NAME, rule, {
  valid: [
    {
      code: valid,
      settings: {
        '@pandacss/configPath': validConfig,
      },
      filename: validConfig,
    },
  ],
  invalid: [
    {
      code: invalid,
      settings: {
        '@pandacss/configPath': invalidConfig,
      },
      filename: invalidConfig,
      errors: 1,
    },
  ],
})
