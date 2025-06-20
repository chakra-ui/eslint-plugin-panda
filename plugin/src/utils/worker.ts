import { PandaContext, loadConfigAndCreateContext } from '@pandacss/node'
import { runAsWorker } from 'synckit'
import { createContext } from 'fixture'
import { resolveTsPathPattern } from '@pandacss/config/ts-path'
import { findConfig } from '@pandacss/config'
import path from 'path'
import type { ImportResult } from '.'

type Opts = {
  currentFile: string
  configPath?: string
}

const contextCache: { [configPath: string]: Promise<PandaContext> } = {}

async function _getContext(configPath: string | undefined) {
  if (!configPath) throw new Error('Invalid config path')

  const cwd = path.dirname(configPath)

  const ctx = await loadConfigAndCreateContext({ configPath, cwd })
  return ctx
}

export async function getContext(opts: Opts) {
  if (process.env.NODE_ENV === 'test') {
    const ctx = createContext() as unknown as PandaContext
    ctx.getFiles = () => ['App.tsx']
    return ctx
  } else {
    const configPath = findConfig({ cwd: opts.configPath ?? opts.currentFile })

    // The context cache ensures we don't reload the same config multiple times
    if (!contextCache[configPath]) {
      contextCache[configPath] = _getContext(configPath)
    }

    return await contextCache[configPath]
  }
}

async function filterInvalidTokens(ctx: PandaContext, paths: string[]): Promise<string[]> {
  return paths.filter((path) => !ctx.utility.tokens.view.get(path))
}

export type DeprecatedToken =
  | string
  | {
      category: string
      value: string
    }

async function filterDeprecatedTokens(ctx: PandaContext, tokens: DeprecatedToken[]): Promise<DeprecatedToken[]> {
  return tokens.filter((token) => {
    const value = typeof token === 'string' ? token : token.category + '.' + token.value
    return ctx.utility.tokens.isDeprecated(value)
  })
}

async function isColorToken(ctx: PandaContext, value: string): Promise<boolean> {
  return !!ctx.utility.tokens.view.categoryMap.get('colors')?.get(value)
}

async function getPropCategory(ctx: PandaContext, _attr: string) {
  const longhand = await resolveLongHand(ctx, _attr)
  const attr = longhand || _attr
  const attrConfig = ctx.utility.config[attr]
  return typeof attrConfig?.values === 'string' ? attrConfig.values : undefined
}

async function isColorAttribute(ctx: PandaContext, _attr: string): Promise<boolean> {
  const category = await getPropCategory(ctx, _attr)
  return category === 'colors'
}

const arePathsEqual = (path1: string, path2: string) => {
  const normalizedPath1 = path.resolve(path1)
  const normalizedPath2 = path.resolve(path2)

  return normalizedPath1 === normalizedPath2
}

async function isValidFile(ctx: PandaContext, fileName: string): Promise<boolean> {
  return ctx.getFiles().some((file) => arePathsEqual(file, fileName))
}

async function resolveShorthands(ctx: PandaContext, name: string): Promise<string[] | undefined> {
  return ctx.utility.getPropShorthandsMap().get(name)
}

async function resolveLongHand(ctx: PandaContext, name: string): Promise<string | undefined> {
  const reverseShorthandsMap = new Map()

  for (const [key, values] of ctx.utility.getPropShorthandsMap()) {
    for (const value of values) {
      reverseShorthandsMap.set(value, key)
    }
  }

  return reverseShorthandsMap.get(name)
}

async function isValidProperty(ctx: PandaContext, name: string, patternName?: string) {
  if (ctx.isValidProperty(name)) return true
  if (!patternName) return

  const pattern = ctx.patterns.details.find((p) => p.baseName === patternName || p.jsx.includes(patternName))?.config
    .properties
  if (!pattern) return
  return Object.keys(pattern).includes(name)
}

async function matchFile(ctx: PandaContext, name: string, imports: ImportResult[]) {
  const file = ctx.imports.file(imports)

  return file.match(name)
}

type MatchImportResult = {
  name: string
  alias: string
  mod: string
}
async function matchImports(ctx: PandaContext, result: MatchImportResult) {
  return ctx.imports.match(result, (mod) => {
    const { tsOptions } = ctx.parserOptions
    if (!tsOptions?.pathMappings) return
    return resolveTsPathPattern(tsOptions.pathMappings, mod)
  })
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
export function run(action: 'filterDeprecatedTokens', opts: Opts, tokens: DeprecatedToken[]): DeprecatedToken[]
export function run(action: string, opts: Opts, ...args: any[]): any {
  // @ts-expect-error cast
  return runAsync(action, opts, ...args)
}

runAsWorker(run as any)
