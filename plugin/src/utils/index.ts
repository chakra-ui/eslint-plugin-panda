import { ESLintUtils } from '@typescript-eslint/utils'
import { createSyncFn } from 'synckit'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { run } from './worker'

// Rule creator
export const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/chakra-ui/eslint-plugin-panda/blob/main/docs/rules/${name}.md`,
)

// Define Rule type explicitly
export type Rule = ReturnType<typeof createRule>

// Determine the distribution directory
const isBase = process.env.NODE_ENV !== 'test' || import.meta.url.includes('/dist/index')
export const distDir = fileURLToPath(new URL(isBase ? './' : '../../dist', import.meta.url))

// Create synchronous function using synckit
export const _syncAction = createSyncFn(join(distDir, 'utils/worker.mjs'))

// Define syncAction with proper typing and error handling
export const syncAction = ((...args: Parameters<typeof run>) => {
  try {
    return _syncAction(...args)
  } catch (error) {
    console.error('syncAction error:', error)
    return undefined
  }
}) as typeof run

export interface ImportResult {
  name: string
  alias: string
  mod: string
  importMapValue?: string
}
