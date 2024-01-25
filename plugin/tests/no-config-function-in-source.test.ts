import { tester } from '../test-utils'
import rule, { RULE_NAME } from '../src/rules/no-config-function-in-source'

const javascript = String.raw

const panda_config = javascript`
import { defineConfig, defineKeyframes } from '@pandacss/dev';

const keyframes = defineKeyframes({
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
});

export default defineConfig({
  theme: {
    keyframes
  }
});
`

const app = javascript`
import {  defineKeyframes } from '@pandacss/dev';
import { css } from './panda/css';

const keyframes = defineKeyframes({
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
});

const styles = css({
  animation: 'fadeIn 1s ease-in-out',
});
`

const app_output = javascript`
import {   } from '@pandacss/dev';
import { css } from './panda/css';



const styles = css({
  animation: 'fadeIn 1s ease-in-out',
});
`

tester.run(RULE_NAME, rule, {
  valid: [
    {
      code: panda_config,
      filename: 'panda.config.ts',
    },
  ],
  invalid: [
    {
      code: app,
      filename: 'App.tsx',
      errors: [
        {
          messageId: 'configFunction',
        },
      ],
      output: app_output,
    },
  ],
})
