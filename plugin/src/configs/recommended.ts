export default {
  parser: '@typescript-eslint/parser',
  parserOptions: { sourceType: 'module' },
  plugins: ['@pandacss'],
  rules: {
    '@pandacss/file-not-included': 'error',
    '@pandacss/no-config-function-in-source': 'error',
    '@pandacss/no-debug': 'warn',
    '@pandacss/no-dynamic-styling': 'warn',
    '@pandacss/no-hardcoded-color': 'warn',
    '@pandacss/no-extend-keyword': 'warn',
    '@pandacss/no-invalid-nesting': 'error',
    '@pandacss/no-invalid-token-paths': 'error',
    '@pandacss/no-property-renaming': 'warn',
    '@pandacss/no-unsafe-token-fn-usage': 'warn',
  },
}
