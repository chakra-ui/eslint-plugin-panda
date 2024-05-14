import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

import panda from '@pandacss/eslint-plugin'

export default tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  ignores: [
    '**/*.d.ts',
    'styled-system',
    // Ignore panda errors cause that's what we're here for
    'src/App.tsx',
  ],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    // TODO
    // 'plugin:react-hooks/recommended',
  ],
  plugins: {
    '@pandacss': panda,
    // TODO
    // 'react-refresh'
  },
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.es2020,
    },
  },
  rules: {
    ...panda.configs.recommended.rules,
    '@pandacss/no-debug': 'off',
    '@pandacss/no-margin-properties': 'warn',
    '@pandacss/no-hardcoded-color': ['error', { noOpacity: true }],
    // TODO
    // 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
})
