import { ESLintUtils } from '@typescript-eslint/utils'
import { createSyncFn } from 'synckit'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { run } from './worker'
import { ruleStarted, ruleFinished } from './cache'

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

// The one action that reads `opts.currentFile` inside the worker instead of taking it as an
// argument, so a key built from the arguments alone would make every file inherit the first
// file's verdict.
const PER_FILE_ACTIONS = new Set(['isValidFile'])

// Memoized worker round-trips, keyed by (config, action, arguments).
// The worker already caches one panda context per config path for the lifetime of the process
// (see `contextCache` in ./worker), and every action derives its answer from that context plus
// either its own arguments or the current file — so the answer cannot change between calls.
// The scope falls back to the current file when `settings['@pandacss/configPath']` is unset,
// since the worker then resolves the config by walking up from each file and a monorepo can
// reach different ones.
const syncActionCache = new Map<string, unknown>()

// Define syncAction with proper typing and error handling
export const syncAction = ((...args: Parameters<typeof run>) => {
  const [action, opts, ...rest] = args

  const scope = opts.configPath ?? opts.currentFile
  const key = PER_FILE_ACTIONS.has(action)
    ? `${scope}\0${action}\0${opts.currentFile}`
    : `${scope}\0${action}\0${JSON.stringify(rest)}`

  if (syncActionCache.has(key)) {
    return syncActionCache.get(key)
  }

  try {
    const result = _syncAction(...args)
    syncActionCache.set(key, result)
    return result
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
