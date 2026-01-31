import { name, version } from '../package.json'
import { rules } from './rules'

const recommendedRules = {
  '@pandacss/file-not-included': 'error',
  '@pandacss/no-config-function-in-source': 'error',
  '@pandacss/no-debug': 'warn',
  '@pandacss/no-dynamic-styling': 'warn',
  '@pandacss/no-hardcoded-color': 'warn',
  '@pandacss/no-invalid-nesting': 'error',
  '@pandacss/no-invalid-token-paths': 'error',
  '@pandacss/no-property-renaming': 'warn',
  '@pandacss/no-unsafe-token-fn-usage': 'warn',
  '@pandacss/no-deprecated-tokens': 'warn',
} as const

const errorRules = ['file-not-included', 'no-config-function-in-source', 'no-invalid-token-paths']

const allRules = Object.fromEntries(
  Object.entries(rules).map(([ruleName]) => [
    `@pandacss/${ruleName}`,
    errorRules.includes(ruleName) ? 'error' : 'warn',
  ]),
) as Record<string, 'error' | 'warn'>

type Plugin = {
  meta: { name: string; version: string }
  rules: typeof rules
  configs: Record<string, { name: string; plugins: Record<string, Plugin>; rules: Record<string, unknown> }>
}

const plugin: Plugin = {
  meta: { name, version },
  rules,
  configs: {},
}

// Flat configs (ESLint v9 only)
plugin.configs.recommended = {
  name: '@pandacss/recommended',
  plugins: { '@pandacss': plugin },
  rules: recommendedRules,
}

plugin.configs.all = {
  name: '@pandacss/all',
  plugins: { '@pandacss': plugin },
  rules: allRules,
}

export default plugin
