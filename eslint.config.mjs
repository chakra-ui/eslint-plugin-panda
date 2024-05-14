import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import globals from 'globals'

export default tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  ignores: ['**/*.d.ts'],
  extends: [
    eslint.configs.recommended,
    eslintPlugin.configs['flat/recommended'],
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
  ],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  rules: {
    'no-prototype-builtins': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    /**
     * This rules is set up to use the same rules as "@typescript-eslint/recommended" in v5.
     * @see https://typescript-eslint.io/blog/announcing-typescript-eslint-v6/
     */
    // This rules removed from recommended in v6.
    'no-extra-semi': 'off',
    '@typescript-eslint/no-extra-semi': 'error',
    // This rules added recommended in v6.
    '@typescript-eslint/no-duplicate-enum-values': 'off',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    // This rule moved from recommended to stylistic in v6.
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/ban-tslint-comment': 'off',
    '@typescript-eslint/class-literal-property-style': 'off',
    '@typescript-eslint/consistent-generic-constructors': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-confusing-non-null-assertion': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/prefer-function-type': 'off',
  },
})
