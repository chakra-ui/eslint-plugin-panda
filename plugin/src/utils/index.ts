import { ESLintUtils } from '@typescript-eslint/utils'
import { createSyncFn } from 'synckit'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { run } from './worker'

export const createRule: ReturnType<(typeof ESLintUtils)['RuleCreator']> = ESLintUtils.RuleCreator(
  (name) => `https://github.com/chakra-ui/eslint-plugin-panda/blob/main/docs/rules/${name}.md`,
)

export type Rule<A extends readonly unknown[] = any, B extends string = any> = ReturnType<typeof createRule<A, B>>

const isBase = process.env.NODE_ENV !== 'test' || import.meta.url.endsWith('dist/index.js')
export const distDir = fileURLToPath(new URL(isBase ? './' : '../../dist', import.meta.url))

export const _syncAction = createSyncFn(join(distDir, 'utils/worker.mjs'))
// export const _syncAction = createSyncFn(join(distDir, 'utils/worker.mjs')) as typeof run

export const syncAction = ((...args: any) => {
  try {
    return _syncAction(...args)
  } catch (error) {
    return
  }
}) as typeof run | ((...args: any) => undefined)

export interface ImportResult {
  name: string
  alias: string
  mod: string
  importMapValue?: string
}
