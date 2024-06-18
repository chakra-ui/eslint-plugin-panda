import { getInvalidTokens, getTaggedTemplateCaller, isPandaAttribute, isPandaIsh, isPandaProp } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { isNodeOfTypes } from '@typescript-eslint/utils/ast-utils'
import { isIdentifier, isJSXExpressionContainer, isLiteral, isTemplateLiteral, type Node } from '../utils/nodes'

export const RULE_NAME = 'no-invalid-token-paths'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Disallow the use of invalid token paths within token function syntax.',
    },
    messages: {
      noInvalidTokenPaths: '`{{token}}` is an invalid token path.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const handleLiteral = (node: Node) => {
      if (!isLiteral(node)) return

      sendReport(node)
    }

    const handleTemplateLiteral = (node: Node) => {
      if (!isTemplateLiteral(node)) return
      if (node.expressions.length > 0) return
      sendReport(node.quasis[0], node.quasis[0].value.raw)
    }

    const sendReport = (node: any, _value?: string) => {
      const value = _value ?? node.value?.toString()
      const tokens = getInvalidTokens(value, context)
      if (!tokens) return

      if (tokens.length > 0) {
        tokens.forEach((token) => {
          context.report({
            node,
            messageId: 'noInvalidTokenPaths',
            data: { token },
          })
        })
      }
    }

    return {
      JSXAttribute(node) {
        if (!node.value) return
        if (!isPandaProp(node, context)) return

        handleLiteral(node.value)

        if (!isJSXExpressionContainer(node.value)) return

        handleLiteral(node.value.expression)
        handleTemplateLiteral(node.value.expression)
      },

      Property(node) {
        if (!isIdentifier(node.key)) return
        if (!isNodeOfTypes([AST_NODE_TYPES.Literal, AST_NODE_TYPES.TemplateLiteral])(node.value)) return
        if (!isPandaAttribute(node, context)) return

        handleLiteral(node.value)
        handleTemplateLiteral(node.value)
      },

      TaggedTemplateExpression(node) {
        const caller = getTaggedTemplateCaller(node)
        if (!caller) return

        if (!isPandaIsh(caller, context)) return

        const quasis = node.quasi.quasis[0]
        const styles = quasis.value.raw
        const tokens = getInvalidTokens(styles, context)
        if (!tokens) return

        tokens.forEach((token, i, arr) => {
          // Avoid duplicate reports on the same token
          if (arr.indexOf(token) < i) return

          let index = styles.indexOf(token)

          while (index !== -1) {
            const start = quasis.range[0] + 1 + index
            const end = start + token.length

            context.report({
              loc: { start: context.sourceCode.getLocFromIndex(start), end: context.sourceCode.getLocFromIndex(end) },
              messageId: 'noInvalidTokenPaths',
              data: { token },
            })

            // Check for other occurences of the invalid token
            index = styles.indexOf(token, index + 1)
          }
        })
      },
    }
  },
})

export default rule
