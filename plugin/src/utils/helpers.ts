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
  isMemberExpression,
  isVariableDeclarator,
  type Node,
} from './nodes'

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

  context.sourceCode.ast.body.forEach((node) => {
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

const _getImports = (context: RuleContext<any, any>) => {
  const specifiers = getImportSpecifiers(context)
  specifiers.map(({ specifier, mod }) => ({
    name: specifier.imported.name,
    alias: specifier.local.name,
    mod,
  }))

  const imports: ImportResult[] = []

  context.sourceCode.ast.body.forEach((node) => {
    if (!isImportDeclaration(node)) return

    const mod = node.source.value
    if (!mod) return

    node.specifiers.forEach((specifier) => {
      if (!isImportSpecifier(specifier)) return

      const name = specifier.imported.name
      const alias = specifier.local.name

      const result = { name, alias, mod }

      imports.push(result)
    })
  })

  return imports
}

const getImports = (context: RuleContext<any, any>) => {
  const imports = _getImports(context)

  return imports.filter((imp) => syncAction('matchImports', getSyncOpts(context), imp))
}

const isValidStyledProp = <T extends Node | string>(node: T, context: RuleContext<any, any>) => {
  if (typeof node === 'string') return
  return isJSXIdentifier(node) && isValidProperty(node.name, context)
}

export const isPandaIsh = (name: string, context: RuleContext<any, any>) => {
  const imports = getImports(context)
  return syncAction('matchFile', getSyncOpts(context), name, imports)
}

const findDeclaration = (name: string, context: RuleContext<any, any>) => {
  const scope = analyze(context.sourceCode.ast, {
    sourceType: 'module',
  })
  const decl = scope.variables
    .find((v) => v.name === name)
    ?.defs.find((d) => isIdentifier(d.name) && d.name.name === name)?.node
  if (isVariableDeclarator(decl)) return decl
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

export const isConfigFile = (context: RuleContext<any, any>) => {
  return syncAction('isConfigFile', getSyncOpts(context))
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

  if (
    isJSXMemberExpression(jsxAncestor.name) &&
    isJSXIdentifier(jsxAncestor.name.object) &&
    isPandaIsh(jsxAncestor.name.object.name, context)
  )
    return true
  else if (!isJSXIdentifier(jsxAncestor.name)) return

  // Ensure component is a panda component
  if (!isPandaIsh(jsxAncestor.name.name, context) && !isLocalStyledFactory(jsxAncestor, context)) return

  // Ensure prop is a styled prop
  const prop = node.name.name
  if (typeof prop !== 'string' || !isValidProperty(prop, context, jsxAncestor.name.name)) return

  return true
}

const isInPandaFunction = (node: TSESTree.Property, context: RuleContext<any, any>) => {
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

  // Ensure attribute is a styled attribute
  if (!isIdentifier(node.key)) return
  const attr = node.key.name
  if (!isValidProperty(attr, context, calleeName)) return

  return true
}

export const isPandaAttribute = (node: TSESTree.Property, context: RuleContext<any, any>) => {
  const callAncestor = getAncestor(isCallExpression, node)

  if (callAncestor) return isInPandaFunction(node, context)

  // Object could be in JSX prop value i.e css prop or a pseudo
  const jsxExprAncestor = getAncestor(isJSXExpressionContainer, node)
  const jsxAttrAncestor = getAncestor(isJSXAttribute, node)

  if (!jsxExprAncestor || !jsxAttrAncestor) return
  if (!isPandaProp(jsxAttrAncestor, context)) return
  if (!isValidStyledProp(jsxAttrAncestor.name, context)) return

  return true
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
  const regex = /token\(([^"'(),]+)(?:,\s*([^"'(),]+))?\)|\{([^{}]+)\}/g
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

export const getInvalidTokens = (value: string, context: RuleContext<any, any>) => {
  const tokens = extractTokens(value)
  if (!tokens.length) return []
  return syncAction('filterInvalidTokens', getSyncOpts(context), tokens)
}

export const getExtendWarnings = (context: RuleContext<any, any>) => {
  return syncAction('getExtendWarnings', getSyncOpts(context))
}

export const getTokenImport = (context: RuleContext<any, any>) => {
  const imports = _getImports(context)
  return imports.find((imp) => imp.name === 'token')
}
