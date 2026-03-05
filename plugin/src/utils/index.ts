import { ESLintUtils } from '@typescript-eslint/utils'
import { createSyncFn } from 'synckit'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { run } from './worker'
import { ruleStarted, ruleFinished } from './helpers'

// Rule creator
const _createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/chakra-ui/eslint-plugin-panda/blob/main/docs/rules/${name}.md`,
)

// Wraps the base rule creator to track how many rules are running.
// Each rule increments a counter in `create()` and decrements it in `Program:exit`.
// When the counter reaches 0 (all rules have finished for the current file), caches are cleared.
// This ensures cached data is never stale across files, without relying on WeakMap identity
// (which doesn't work in Oxlint where context objects are reused).
export const createRule: typeof _createRule = (...args) => {
  const rule = _createRule(...args)
  const originalCreate = rule.create

  rule.create = (context) => {
    ruleStarted()
    const visitor = originalCreate(context)

    const existingExit = visitor['Program:exit']
    if (existingExit) {
      visitor['Program:exit'] = (node) => {
        existingExit(node)
        ruleFinished()
      }
    } else {
      visitor['Program:exit'] = (_node) => ruleFinished()
    }

    return visitor
  }

  return rule
}

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
