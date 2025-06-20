import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'
import type { TSESTree } from '@typescript-eslint/utils'
import { analyze } from '@typescript-eslint/scope-manager'
import { type ImportResult, syncAction } from '.'
import {
  isCallExpression,
  isIdentifier,
  isImportDeclaration,
  isImportSpecifier,
  isJSXAttribute,
  isJSXExpressionContainer,
  isJSXIdentifier,
  isJSXMemberExpression,
  isJSXOpeningElement,
  isLiteral,
  isMemberExpression,
  isTemplateLiteral,
  isVariableDeclarator,
  type Node,
} from './nodes'
import type { DeprecatedToken } from './worker'

export const getAncestor = <N extends Node>(ofType: (node: Node) => node is N, for_: Node): N | undefined => {
  let current: Node | undefined = for_.parent
  while (current) {
    if (ofType(current)) return current
    current = current.parent
  }

  return
}

const getSyncOpts = (context: RuleContext<any, any>) => {
  return {
    currentFile: context.filename,
    configPath: context.settings['@pandacss/configPath'] as string | undefined,
  }
}

export const getImportSpecifiers = (context: RuleContext<any, any>) => {
  const specifiers: { specifier: TSESTree.ImportSpecifier; mod: string }[] = []

  context.sourceCode?.ast.body.forEach((node) => {
    if (!isImportDeclaration(node)) return

    const mod = node.source.value
    if (!mod) return

    node.specifiers.forEach((specifier) => {
      if (!isImportSpecifier(specifier)) return
      specifiers.push({ specifier, mod })
    })
  })

  return specifiers
}

export const hasPkgImport = (context: RuleContext<any, any>) => {
  const imports = _getImports(context)
  return imports.some(({ mod }) => mod === '@pandacss/dev')
}

export const isPandaConfigFunction = (context: RuleContext<any, any>, name: string) => {
  const imports = _getImports(context)
  return imports.some(({ alias, mod }) => alias === name && mod === '@pandacss/dev')
}

const _getImports = (context: RuleContext<any, any>) => {
  const specifiers = getImportSpecifiers(context)

  const imports: ImportResult[] = specifiers.map(({ specifier, mod }) => ({
    name: (specifier.imported as any).name,
    alias: specifier.local.name,
    mod,
  }))

  return imports
}

// Caching imports per context to avoid redundant computations
const importsCache = new WeakMap<RuleContext<any, any>, ImportResult[]>()

export const getImports = (context: RuleContext<any, any>) => {
  if (importsCache.has(context)) {
    return importsCache.get(context)!
  }
  const imports = _getImports(context)
  const filteredImports = imports.filter((imp) => syncAction('matchImports', getSyncOpts(context), imp))
  importsCache.set(context, filteredImports)
  return filteredImports
}

const isValidStyledProp = <T extends Node>(node: T, context: RuleContext<any, any>) => {
  return isJSXIdentifier(node) && isValidProperty(node.name, context)
}

export const isPandaIsh = (name: string, context: RuleContext<any, any>) => {
  const imports = getImports(context)
  if (imports.length === 0) return false
  return syncAction('matchFile', getSyncOpts(context), name, imports)
}

const findDeclaration = (name: string, context: RuleContext<any, any>) => {
  try {
    const src = context.sourceCode

    if (!src) {
      console.warn("⚠️ ESLint's sourceCode is not available. Ensure that the rule is invoked with valid code.")
      return undefined
    }

    const scope = analyze(src.ast, {
      sourceType: 'module',
    })
    const decl = scope.variables
      .find((v) => v.name === name)
      ?.defs.find((d) => isIdentifier(d.name) && d.name.name === name)?.node
    if (isVariableDeclarator(decl)) return decl
  } catch (error) {
    console.error('Error in findDeclaration:', error)
    return undefined
  }
}

const isLocalStyledFactory = (node: TSESTree.JSXOpeningElement, context: RuleContext<any, any>) => {
  if (!isJSXIdentifier(node.name)) return
  const decl = findDeclaration(node.name.name, context)

  if (!decl) return
  if (!isCallExpression(decl.init)) return
  if (!isIdentifier(decl.init.callee)) return
  if (!isPandaIsh(decl.init.callee.name, context)) return

  return true
}

export const isValidFile = (context: RuleContext<any, any>) => {
  return syncAction('isValidFile', getSyncOpts(context))
}

export const isValidProperty = (name: string, context: RuleContext<any, any>, calleName?: string) => {
  return syncAction('isValidProperty', getSyncOpts(context), name, calleName)
}

export const isPandaImport = (node: TSESTree.ImportDeclaration, context: RuleContext<any, any>) => {
  const imports = getImports(context)
  return imports.some((imp) => imp.mod === node.source.value)
}

export const isPandaProp = (node: TSESTree.JSXAttribute, context: RuleContext<any, any>) => {
  const jsxAncestor = getAncestor(isJSXOpeningElement, node)

  if (!jsxAncestor) return

  // <styled.div /> && <Box />
  if (!isJSXMemberExpression(jsxAncestor.name) && !isJSXIdentifier(jsxAncestor.name)) return

  const name = isJSXMemberExpression(jsxAncestor.name) ? (jsxAncestor.name.object as any).name : jsxAncestor.name.name
  const prop = node.name.name

  // Ensure component is a panda component
  if (!isPandaIsh(name, context) && !isLocalStyledFactory(jsxAncestor, context)) return

  // Ensure prop is a styled prop
  if (typeof prop !== 'string' || !isValidProperty(prop, context, name)) return

  return true
}

export const isStyledProperty = (node: TSESTree.Property, context: RuleContext<any, any>, calleeName?: string) => {
  if (!isIdentifier(node.key) && !isLiteral(node.key) && !isTemplateLiteral(node.key)) return

  if (isIdentifier(node.key) && !isValidProperty(node.key.name, context, calleeName)) return
  if (
    isLiteral(node.key) &&
    typeof node.key.value === 'string' &&
    !isValidProperty(node.key.value, context, calleeName)
  )
    return
  if (isTemplateLiteral(node.key) && !isValidProperty(node.key.quasis[0].value.raw, context, calleeName)) return
  return true
}

export const isInPandaFunction = (node: TSESTree.Property, context: RuleContext<any, any>) => {
  const callAncestor = getAncestor(isCallExpression, node)
  if (!callAncestor) return

  let calleeName: string | undefined

  // E.g. css({...}), cvs({...})
  if (isIdentifier(callAncestor.callee)) {
    calleeName = callAncestor.callee.name
  }

  // E.g. css.raw({...})
  if (isMemberExpression(callAncestor.callee) && isIdentifier(callAncestor.callee.object)) {
    calleeName = callAncestor.callee.object.name
  }

  if (!calleeName) return
  if (!isPandaIsh(calleeName, context)) return

  return calleeName
}

export const isInJSXProp = (node: TSESTree.Property, context: RuleContext<any, any>) => {
  const jsxExprAncestor = getAncestor(isJSXExpressionContainer, node)
  const jsxAttrAncestor = getAncestor(isJSXAttribute, node)

  if (!jsxExprAncestor || !jsxAttrAncestor) return
  if (!isPandaProp(jsxAttrAncestor, context)) return
  if (typeof jsxAttrAncestor.name === 'string') return
  if (!isValidStyledProp(jsxAttrAncestor.name, context)) return

  return true
}

export const isPandaAttribute = (node: TSESTree.Property, context: RuleContext<any, any>) => {
  const callAncestor = getAncestor(isCallExpression, node)

  if (callAncestor) {
    const callee = isInPandaFunction(node, context)
    if (!callee) return
    return isStyledProperty(node, context, callee)
  }

  // Object could be in JSX prop value i.e css prop or a pseudo
  return isInJSXProp(node, context) && isStyledProperty(node, context)
}

export const resolveLonghand = (name: string, context: RuleContext<any, any>) => {
  return syncAction('resolveLongHand', getSyncOpts(context), name)
}

export const resolveShorthands = (name: string, context: RuleContext<any, any>) => {
  return syncAction('resolveShorthands', getSyncOpts(context), name)
}

export const isColorAttribute = (attr: string, context: RuleContext<any, any>) => {
  return syncAction('isColorAttribute', getSyncOpts(context), attr)
}

export const isColorToken = (value: string | undefined, context: RuleContext<any, any>) => {
  if (!value) return
  return syncAction('isColorToken', getSyncOpts(context), value)
}

export const extractTokens = (value: string) => {
  const regex = /token\(([^"'(),]+)(?:,\s*([^"'(),]+))?\)|\{([^{\r\n}]+)\}/g
  const matches = []
  let match

  while ((match = regex.exec(value)) !== null) {
    const tokenFromFirstSyntax = match[1] || match[2] || match[3]
    const tokensFromSecondSyntax = match[4] && match[4].match(/(\w+\.\w+(\.\w+)?)/g)

    if (tokenFromFirstSyntax) {
      matches.push(tokenFromFirstSyntax)
    }

    if (tokensFromSecondSyntax) {
      matches.push(...tokensFromSecondSyntax)
    }
  }

  return matches.filter(Boolean)
}

// Caching invalid tokens to avoid redundant computations
const invalidTokensCache = new Map<string, string[]>()

export const getInvalidTokens = (value: string, context: RuleContext<any, any>) => {
  if (invalidTokensCache.has(value)) {
    return invalidTokensCache.get(value)!
  }

  const tokens = extractTokens(value)
  if (!tokens.length) return []

  const invalidTokens = syncAction('filterInvalidTokens', getSyncOpts(context), tokens)
  invalidTokensCache.set(value, invalidTokens)
  return invalidTokens
}

// Caching deprecated tokens to avoid redundant computations
const deprecatedTokensCache = new Map<string, DeprecatedToken[]>()

export const getDeprecatedTokens = (prop: string, value: string, context: RuleContext<any, any>) => {
  const propCategory = syncAction('getPropCategory', getSyncOpts(context), prop)

  const tokens = extractTokens(value)

  if (!propCategory && !tokens.length) return []

  const values = tokens.length ? tokens : [{ category: propCategory, value: value.split('/')[0] }]

  if (deprecatedTokensCache.has(value)) {
    return deprecatedTokensCache.get(value)!
  }

  const deprecatedTokens = syncAction('filterDeprecatedTokens', getSyncOpts(context), values)
  deprecatedTokensCache.set(value, deprecatedTokens)

  return deprecatedTokens
}

export const getTokenImport = (context: RuleContext<any, any>) => {
  const imports = _getImports(context)
  return imports.find((imp) => imp.name === 'token')
}

export const getTaggedTemplateCaller = (node: TSESTree.TaggedTemplateExpression) => {
  // css``
  if (isIdentifier(node.tag)) {
    return node.tag.name
  }

  // styled.h1``
  if (isMemberExpression(node.tag)) {
    if (!isIdentifier(node.tag.object)) return
    return node.tag.object.name
  }

  // styled(Comp)``
  if (isCallExpression(node.tag)) {
    if (!isIdentifier(node.tag.callee)) return
    return node.tag.callee.name
  }
}

export function isRecipeVariant(node: TSESTree.Property, context: RuleContext<any, any>) {
  const caller = isInPandaFunction(node, context)
  if (!caller) return

  // Check if the caller is either 'cva' or 'sva'
  const recipe = getImports(context).find((imp) => ['cva', 'sva'].includes(imp.name) && imp.alias === caller)
  if (!recipe) return

  //* Nesting is different here because of slots and variants. We don't want to warn about those.
  let currentNode: any = node
  let length = 0
  let styleObjectParent: string | null = null

  // Traverse up the AST
  while (currentNode) {
    const keyName = currentNode?.key?.name
    if (keyName && ['base', 'variants'].includes(keyName)) {
      styleObjectParent = keyName
    }
    currentNode = currentNode.parent
    if (!styleObjectParent) length++
  }

  // Determine the required length based on caller and styleObjectParent
  const isCvaCaller = caller === 'cva'
  const requiredLength = isCvaCaller ? 2 : 4
  const extraLength = styleObjectParent === 'base' ? 0 : 4

  if (length < requiredLength + extraLength) return true
}
