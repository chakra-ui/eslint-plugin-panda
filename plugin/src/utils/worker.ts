import { Generator } from '@pandacss/generator'
import { runAsWorker } from 'synckit'
import { createGeneratorContext, v9Config } from 'fixture'
import { resolveTsPathPattern } from '@pandacss/config/ts-path'
import { findConfig, loadConfig } from '@pandacss/config'
import path from 'path'
import micromatch from 'micromatch'
import type { ImportResult } from '.'

type Opts = {
  currentFile: string
  configPath?: string
}

const contextCache: { [configPath: string]: Promise<Generator> } = {}

async function _getContext(configPath: string | undefined) {
  if (!configPath) throw new Error('Invalid config path')

  const cwd = path.dirname(configPath)

  const conf = await loadConfig({ file: configPath, cwd })
  const ctx = new Generator(conf)
  return ctx
}

export async function getContext(opts: Opts) {
  if (process.env.NODE_ENV === 'test') {
    const ctx = createGeneratorContext({
      ...v9Config,
      include: ['**/*'],
      exclude: ['**/Invalid.tsx', '**/panda.config.ts'],
      importMap: './panda',
      jsxFactory: 'styled',
    } as any) as unknown as Generator
    return ctx
  } else {
    const configPath = findConfig({ cwd: opts.configPath ?? opts.currentFile })

    // The context cache ensures we don't reload the same config multiple times
    if (!contextCache[configPath]) {
      contextCache[configPath] = _getContext(configPath)
    }

    return contextCache[configPath]
  }
}

async function filterInvalidTokens(ctx: Generator, paths: string[]): Promise<string[]> {
  const invalid = paths.filter((path) => !ctx.utility.tokens.view.get(path))
  if (invalid.length > 0) {
    console.error('filterInvalidTokens', { paths, invalid })
  }
  return invalid
}

export type DeprecatedToken =
  | string
  | {
      category: string
      value: string
    }

async function filterDeprecatedTokens(ctx: Generator, tokens: DeprecatedToken[]): Promise<DeprecatedToken[]> {
  return tokens.filter((token) => {
    const value = typeof token === 'string' ? token : token.category + '.' + token.value
    return ctx.utility.tokens.isDeprecated(value)
  })
}

async function isColorToken(ctx: Generator, value: string): Promise<boolean> {
  return !!ctx.utility.tokens.view.categoryMap.get('colors')?.get(value)
}

async function getPropCategory(ctx: Generator, _attr: string) {
  const longhand = await resolveLongHand(ctx, _attr)
  const attr = longhand || _attr
  const attrConfig = ctx.utility.config[attr]
  return typeof attrConfig?.values === 'string' ? attrConfig.values : undefined
}

async function isColorAttribute(ctx: Generator, _attr: string): Promise<boolean> {
  const category = await getPropCategory(ctx, _attr)
  return category === 'colors'
}

async function isValidFile(ctx: Generator, fileName: string): Promise<boolean> {
  const { include, exclude } = ctx.config
  const cwd = ctx.config.cwd || process.cwd()

  const relativePath = path.isAbsolute(fileName) ? path.relative(cwd, fileName) : fileName

  return micromatch.isMatch(relativePath, include, { ignore: exclude, dot: true })
}

async function resolveShorthands(ctx: Generator, name: string): Promise<string[] | undefined> {
  return ctx.utility.getPropShorthandsMap().get(name)
}

const reverseLonghandCache = new WeakMap<Generator, Map<string, string>>()

async function resolveLongHand(ctx: Generator, name: string): Promise<string | undefined> {
  let reverseMap = reverseLonghandCache.get(ctx)
  if (!reverseMap) {
    reverseMap = new Map()
    for (const [key, values] of ctx.utility.getPropShorthandsMap()) {
      for (const value of values) {
        reverseMap.set(value, key)
      }
    }
    reverseLonghandCache.set(ctx, reverseMap)
  }
  return reverseMap.get(name)
}

async function isValidProperty(ctx: Generator, name: string, patternName?: string) {
  const isValid = ctx.isValidProperty(name)
  if (isValid) return true
  if (!patternName) return false

  // If the pattern name is the jsxFactory (e.g., 'styled'), we should accept
  // any property that is valid according to the global property check
  // Since styled components are generic wrappers, we don't need pattern-specific checks
  if (patternName === ctx.config.jsxFactory) {
    // Already checked globally above, so return false if we got here
    return false
  }

  const pattern = ctx.patterns.details.find((p) => p.baseName === patternName || p.jsx.includes(patternName))?.config
    .properties
  if (!pattern) return false
  return Object.keys(pattern).includes(name)
}

async function matchFile(ctx: Generator, name: string, imports: ImportResult[]) {
  const file = ctx.imports.file(imports)

  return file.match(name)
}

type MatchImportResult = {
  name: string
  alias: string
  mod: string
}
async function matchImports(ctx: Generator, result: MatchImportResult) {
  const isMatch = ctx.imports.match(result, (mod) => {
    const { tsOptions } = ctx.parserOptions
    if (!tsOptions?.pathMappings) return
    return resolveTsPathPattern(tsOptions.pathMappings, mod)
  })
  return isMatch
}

async function getJsxFactory(ctx: Generator) {
  return ctx.config.jsxFactory
}

export function runAsync(action: 'filterInvalidTokens', opts: Opts, paths: string[]): Promise<string[]>
export function runAsync(action: 'isColorToken', opts: Opts, value: string): Promise<boolean>
export function runAsync(action: 'isColorAttribute', opts: Opts, attr: string): Promise<boolean>
export function runAsync(action: 'isValidFile', opts: Opts, fileName: string): Promise<string>
export function runAsync(action: 'resolveShorthands', opts: Opts, name: string): Promise<string[] | undefined>
export function runAsync(action: 'resolveLongHand', opts: Opts, name: string): Promise<string | undefined>
export function runAsync(action: 'isValidProperty', opts: Opts, name: string, patternName?: string): Promise<boolean>
export function runAsync(action: 'matchFile', opts: Opts, name: string, imports: ImportResult[]): Promise<boolean>
export function runAsync(action: 'matchImports', opts: Opts, result: MatchImportResult): Promise<boolean>
export function runAsync(action: 'getPropCategory', opts: Opts, prop: string): Promise<string>
export function runAsync(action: 'getJsxFactory', opts: Opts): Promise<string | undefined>
export function runAsync(
  action: 'filterDeprecatedTokens',
  opts: Opts,
  tokens: DeprecatedToken[],
): Promise<DeprecatedToken[]>
export async function runAsync(action: string, opts: Opts, ...args: any): Promise<any> {
  const ctx = await getContext(opts)

  switch (action) {
    case 'matchImports':
      // @ts-expect-error cast
      return matchImports(ctx, ...args)
    case 'matchFile':
      // @ts-expect-error cast
      return matchFile(ctx, ...args)
    case 'isValidProperty':
      // @ts-expect-error cast
      return isValidProperty(ctx, ...args)
    case 'resolveLongHand':
      // @ts-expect-error cast
      return resolveLongHand(ctx, ...args)
    case 'resolveShorthands':
      // @ts-expect-error cast
      return resolveShorthands(ctx, ...args)
    case 'isValidFile':
      return isValidFile(ctx, opts.currentFile)
    case 'isColorAttribute':
      // @ts-expect-error cast
      return isColorAttribute(ctx, ...args)
    case 'isColorToken':
      // @ts-expect-error cast
      return isColorToken(ctx, ...args)
    case 'filterInvalidTokens':
      // @ts-expect-error cast
      return filterInvalidTokens(ctx, ...args)
    case 'getPropCategory':
      // @ts-expect-error cast
      return getPropCategory(ctx, ...args)
    case 'getJsxFactory':
      return getJsxFactory(ctx)
    case 'filterDeprecatedTokens':
      // @ts-expect-error cast
      return filterDeprecatedTokens(ctx, ...args)
  }
}

export function run(action: 'filterInvalidTokens', opts: Opts, paths: string[]): string[]
export function run(action: 'isColorToken', opts: Opts, value: string): boolean
export function run(action: 'isColorAttribute', opts: Opts, attr: string): boolean
export function run(action: 'isValidFile', opts: Opts): boolean
export function run(action: 'resolveShorthands', opts: Opts, name: string): string[] | undefined
export function run(action: 'resolveLongHand', opts: Opts, name: string): string | undefined
export function run(action: 'isValidProperty', opts: Opts, name: string, patternName?: string): boolean
export function run(action: 'matchFile', opts: Opts, name: string, imports: ImportResult[]): boolean
export function run(action: 'matchImports', opts: Opts, result: MatchImportResult): boolean
export function run(action: 'getPropCategory', opts: Opts, prop: string): string
export function run(action: 'getJsxFactory', opts: Opts): string | undefined
export function run(action: 'filterDeprecatedTokens', opts: Opts, tokens: DeprecatedToken[]): DeprecatedToken[]
export function run(action: string, opts: Opts, ...args: any[]): any {
  // @ts-expect-error cast
  return runAsync(action, opts, ...args)
}

runAsWorker(run as any)
