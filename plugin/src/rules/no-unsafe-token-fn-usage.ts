import { extractTokens, getTokenImport, isPandaAttribute, isPandaProp, isRecipeVariant } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isCallExpression, isIdentifier, isJSXExpressionContainer, isLiteral, isTemplateLiteral } from '../utils/nodes'
import { type TSESTree } from '@typescript-eslint/utils'
import { getArbitraryValue } from '@pandacss/shared'

export const RULE_NAME = 'no-unsafe-token-fn-usage'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Prevent users from using the token function in situations where they could simply use the raw design token.',
    },
    messages: {
      noUnsafeTokenFnUsage: 'Unnecessary token function usage. Prefer design token.',
      replace: 'Replace token function with `{{safe}}`.',
    },
    type: 'suggestion',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Cache for getTokenImport result
    let tokenImportCache: { alias: string } | null | undefined

    const getCachedTokenImport = (): { alias: string } | null | undefined => {
      if (tokenImportCache !== undefined) {
        return tokenImportCache
      }
      tokenImportCache = getTokenImport(context)
      return tokenImportCache
    }

    const isUnsafeCallExpression = (node: TSESTree.CallExpression): boolean => {
      const tkImport = getCachedTokenImport()
      return isIdentifier(node.callee) && node.callee.name === tkImport?.alias
    }

    const tokenWrap = (value?: string): string => (value ? `token(${value})` : '')

    const isCompositeValue = (input?: string): boolean => {
      if (!input) return false
      // Regular expression to match token-only values, e.g., token('space.2') or {space.2}
      const tokenRegex = /^(?:token\([^)]*\)|\{[^}]*\})$/
      return !tokenRegex.test(input)
    }

    const sendReport = (node: TSESTree.Node, value: string) => {
      const tkImports = extractTokens(value)
      if (!tkImports.length) return
      const token = tkImports[0].replace(/^[^.]*\./, '')

      context.report({
        node,
        messageId: 'noUnsafeTokenFnUsage',
        suggest: [
          {
            messageId: 'replace',
            data: { safe: token },
            fix: (fixer) => fixer.replaceText(node, `'${token}'`),
          },
        ],
      })
    }

    const handleRuntimeFn = (node: TSESTree.Node) => {
      if (!isCallExpression(node)) return
      if (!isUnsafeCallExpression(node)) return

      const value = node.arguments[0]

      if (isLiteral(value)) {
        const val = getArbitraryValue(value.value?.toString() ?? '')
        sendReport(node, tokenWrap(val))
      } else if (isTemplateLiteral(value) && value.expressions.length === 0) {
        const val = getArbitraryValue(value.quasis[0].value.raw)
        sendReport(node, tokenWrap(val))
      }
    }

    const handleLiteral = (node: TSESTree.Node) => {
      if (!isLiteral(node)) return
      const value = getArbitraryValue(node.value?.toString() ?? '')
      if (isCompositeValue(value)) return

      sendReport(node, value)
    }

    const handleTemplateLiteral = (node: TSESTree.Node) => {
      if (!isTemplateLiteral(node) || node.expressions.length > 0) return
      const value = getArbitraryValue(node.quasis[0].value.raw)
      if (isCompositeValue(value)) return

      sendReport(node, value)
    }

    // Cached versions of helper functions
    const pandaPropCache = new WeakMap<TSESTree.JSXAttribute, boolean | undefined>()
    const isCachedPandaProp = (node: TSESTree.JSXAttribute): boolean => {
      if (pandaPropCache.has(node)) {
        return pandaPropCache.get(node)!
      }
      const result = isPandaProp(node, context)
      pandaPropCache.set(node, result)
      return !!result
    }

    const pandaAttributeCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const isCachedPandaAttribute = (node: TSESTree.Property): boolean => {
      if (pandaAttributeCache.has(node)) {
        return pandaAttributeCache.get(node)!
      }
      const result = isPandaAttribute(node, context)
      pandaAttributeCache.set(node, result)
      return !!result
    }

    const recipeVariantCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const isCachedRecipeVariant = (node: TSESTree.Property): boolean => {
      if (recipeVariantCache.has(node)) {
        return recipeVariantCache.get(node)!
      }
      const result = isRecipeVariant(node, context)
      recipeVariantCache.set(node, result)
      return !!result
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!node.value) return
        if (!isCachedPandaProp(node)) return

        handleLiteral(node.value)

        if (isJSXExpressionContainer(node.value)) {
          const expression = node.value.expression
          handleLiteral(expression)
          handleTemplateLiteral(expression)
          handleRuntimeFn(expression)
        }
      },

      Property(node: TSESTree.Property) {
        if (!isCachedPandaAttribute(node)) return
        if (isCachedRecipeVariant(node)) return

        const valueNode = node.value

        if (isCallExpression(valueNode) || isLiteral(valueNode) || isTemplateLiteral(valueNode)) {
          handleRuntimeFn(valueNode)
          handleLiteral(valueNode)
          handleTemplateLiteral(valueNode)
        }
      },
    }
  },
})

export default rule
