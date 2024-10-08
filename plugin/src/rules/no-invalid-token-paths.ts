import {
  getInvalidTokens,
  getTaggedTemplateCaller,
  isPandaAttribute,
  isPandaIsh,
  isPandaProp,
  isRecipeVariant,
} from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { isNodeOfTypes } from '@typescript-eslint/utils/ast-utils'
import { isIdentifier, isJSXExpressionContainer, isLiteral, isTemplateLiteral } from '../utils/nodes'

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
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Cache for invalid tokens to avoid redundant computations
    const invalidTokensCache = new Map<string, string[]>()

    const sendReport = (node: TSESTree.Node, value: string | undefined) => {
      if (!value) return

      let tokens: string[] | undefined = invalidTokensCache.get(value)
      if (!tokens) {
        tokens = getInvalidTokens(value, context)
        invalidTokensCache.set(value, tokens)
      }

      if (tokens.length === 0) return

      tokens.forEach((token) => {
        context.report({
          node,
          messageId: 'noInvalidTokenPaths',
          data: { token },
        })
      })
    }

    const handleLiteralOrTemplate = (node: TSESTree.Node | undefined) => {
      if (!node) return

      if (isLiteral(node)) {
        const value = node.value?.toString()
        sendReport(node, value)
      } else if (isTemplateLiteral(node) && node.expressions.length === 0) {
        const value = node.quasis[0].value.raw
        sendReport(node.quasis[0], value)
      }
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!node.value || !isPandaProp(node, context)) return

        if (isLiteral(node.value)) {
          handleLiteralOrTemplate(node.value)
        } else if (isJSXExpressionContainer(node.value)) {
          handleLiteralOrTemplate(node.value.expression)
        }
      },

      Property(node: TSESTree.Property) {
        if (
          !isIdentifier(node.key) ||
          !isNodeOfTypes([AST_NODE_TYPES.Literal, AST_NODE_TYPES.TemplateLiteral])(node.value) ||
          !isPandaAttribute(node, context) ||
          isRecipeVariant(node, context)
        ) {
          return
        }

        handleLiteralOrTemplate(node.value)
      },

      TaggedTemplateExpression(node: TSESTree.TaggedTemplateExpression) {
        const caller = getTaggedTemplateCaller(node)
        if (!caller || !isPandaIsh(caller, context)) return

        const quasis = node.quasi.quasis
        quasis.forEach((quasi) => {
          const styles = quasi.value.raw
          if (!styles) return

          let tokens: string[] | undefined = invalidTokensCache.get(styles)
          if (!tokens) {
            tokens = getInvalidTokens(styles, context)
            invalidTokensCache.set(styles, tokens)
          }

          if (tokens.length === 0) return

          tokens.forEach((token) => {
            let index = styles.indexOf(token)

            while (index !== -1) {
              const start = quasi.range[0] + index + 1 // +1 for the backtick
              const end = start + token.length

              context.report({
                loc: {
                  start: context.sourceCode.getLocFromIndex(start),
                  end: context.sourceCode.getLocFromIndex(end),
                },
                messageId: 'noInvalidTokenPaths',
                data: { token },
              })

              // Check for other occurences of the invalid token
              index = styles.indexOf(token, index + token.length)
            }
          })
        })
      },
    }
  },
})

export default rule
