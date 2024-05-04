import { extractTokens, getTokenImport, isPandaAttribute, isPandaProp } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { TSESTree } from '@typescript-eslint/utils'
import {
  isCallExpression,
  isIdentifier,
  isJSXExpressionContainer,
  isLiteral,
  isTemplateLiteral,
  type Node,
} from '../utils/nodes'
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
      noUnsafeTokenFnUsage: 'Unneccessary token function usage. Prefer design token',
      replace: 'Replace token function with `{{safe}}`',
    },
    type: 'suggestion',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const isUnsafeCallExpression = (node: TSESTree.CallExpression) => {
      const tkImport = getTokenImport(context)
      return isIdentifier(node.callee) && node.callee.name === tkImport?.alias
    }

    const tokenWrap = (value?: string) => (value ? `token(${value})` : '')

    const handleRuntimeFm = (node: Node) => {
      if (!isCallExpression(node)) return
      if (!isUnsafeCallExpression(node)) return

      const value = node.arguments[0]

      if (isLiteral(value)) {
        sendReport(node, tokenWrap(getArbitraryValue(value.value?.toString() ?? '')))
      }
      if (isTemplateLiteral(value)) {
        sendReport(node, tokenWrap(getArbitraryValue(value.quasis[0].value.raw)))
      }
    }

    const isCompositeValue = (input?: string) => {
      if (!input) return
      // Regular expression to match token only values. i.e. token('space.2') or {space.2}
      const tokenRegex = /^(?:token\([^)]*\)|\{[^}]*\})$/
      return !tokenRegex.test(input)
    }

    const handleLiteral = (node: Node) => {
      if (!isLiteral(node)) return
      const value = getArbitraryValue(node.value?.toString() ?? '')
      if (isCompositeValue(value)) return

      sendReport(node, value)
    }

    const handleTemplateLiteral = (node: Node) => {
      if (!isTemplateLiteral(node)) return
      if (node.expressions.length > 0) return

      sendReport(node, getArbitraryValue(node.quasis[0].value.raw))
    }

    const sendReport = (node: any, value: string) => {
      const tkImports = extractTokens(value)
      const token = tkImports[0].replace(/^[^.]*\./, '')

      return context.report({
        node,
        messageId: 'noUnsafeTokenFnUsage',
        suggest: [
          {
            messageId: 'replace',
            data: { safe: token },
            fix: (fixer) => {
              return fixer.replaceTextRange(node.range, `'${token}'`)
            },
          },
        ],
      })
    }

    return {
      JSXAttribute(node) {
        if (!node.value) return
        if (!isPandaProp(node, context)) return

        handleLiteral(node.value)

        if (!isJSXExpressionContainer(node.value)) return

        handleLiteral(node.value.expression)
        handleTemplateLiteral(node.value.expression)
        handleRuntimeFm(node.value.expression)
      },

      Property(node) {
        if (!isCallExpression(node.value) && !isLiteral(node.value) && !isTemplateLiteral(node.value)) return
        if (!isPandaAttribute(node, context)) return

        handleRuntimeFm(node.value)
        handleLiteral(node.value)
        handleTemplateLiteral(node.value)
      },
    }
  },
})

export default rule
