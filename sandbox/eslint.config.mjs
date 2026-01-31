import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

import panda from '@pandacss/eslint-plugin'

export default defineConfig([
  {
    ignores: ['**/*.d.ts', 'styled-system', '**/*.cjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // Use the flat config directly
  panda.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    rules: {
      // Override or add Panda CSS rules
      '@pandacss/no-margin-properties': 'warn',
      '@pandacss/no-physical-properties': 'error',
      '@pandacss/no-hardcoded-color': ['error', { noOpacity: true, whitelist: ['inherit'] }],
      // React rules
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
