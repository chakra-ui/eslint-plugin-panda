import eslint from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

import panda from '@pandacss/eslint-plugin'

const compat = new FlatCompat()

export default tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  ignores: [
    '**/*.d.ts',
    'styled-system',
    // Ignore panda errors cause that's what we're here for
    // 'src/App.tsx',
  ],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...compat.config(reactHooks.configs.recommended),
  ],
  plugins: {
    '@pandacss': panda,
    'react-refresh': reactRefresh,
  },
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.es2020,
    },
  },
  rules: {
    ...panda.configs.recommended.rules,
    '@pandacss/no-margin-properties': 'warn',
    '@pandacss/no-physical-properties': 'error',
    '@pandacss/no-hardcoded-color': ['error', { noOpacity: true, whitelist: ['inherit'] }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
})
