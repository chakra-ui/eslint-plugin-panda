import {
  getDeprecatedTokens,
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
import type { DeprecatedToken } from '../utils/worker'

export const RULE_NAME = 'no-deprecated-tokens'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Disallow the use of deprecated tokens within token function syntax.',
    },
    messages: {
      noDeprecatedTokenPaths: '`{{token}}` is a deprecated token.',
      noDeprecatedTokens: '`{{token}}` is a deprecated {{category}} token.',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Cache for deprecated tokens to avoid redundant computations
    const deprecatedTokensCache = new Map<string, DeprecatedToken[]>()

    const sendReport = (prop: string, node: TSESTree.Node, value: string | undefined) => {
      if (!value) return

      let tokens: DeprecatedToken[] | undefined = deprecatedTokensCache.get(value)
      if (!tokens) {
        tokens = getDeprecatedTokens(prop, value, context)
        deprecatedTokensCache.set(value, tokens)
      }

      if (tokens.length === 0) return

      tokens.forEach((token) => {
        context.report({
          node,
          messageId: typeof token === 'string' ? 'noDeprecatedTokenPaths' : 'noDeprecatedTokens',
          data: {
            token: typeof token === 'string' ? token : token.value,
            category: typeof token === 'string' ? undefined : token.category,
          },
        })
      })
    }

    const handleLiteralOrTemplate = (prop: string, node: TSESTree.Node | undefined) => {
      if (!node) return

      if (isLiteral(node)) {
        const value = node.value?.toString()
        sendReport(prop, node, value)
      } else if (isTemplateLiteral(node) && node.expressions.length === 0) {
        const value = node.quasis[0].value.raw
        sendReport(prop, node.quasis[0], value)
      }
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!node.value || !isPandaProp(node, context)) return

        const prop = node.name.name as string

        if (isLiteral(node.value)) {
          handleLiteralOrTemplate(prop, node.value)
        } else if (isJSXExpressionContainer(node.value)) {
          handleLiteralOrTemplate(prop, node.value.expression)
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

        const prop = node.key.name as string

        handleLiteralOrTemplate(prop, node.value)
      },

      TaggedTemplateExpression(node: TSESTree.TaggedTemplateExpression) {
        const caller = getTaggedTemplateCaller(node)
        if (!caller || !isPandaIsh(caller, context)) return

        const quasis = node.quasi.quasis
        quasis.forEach((quasi) => {
          const styles = quasi.value.raw
          if (!styles) return

          // Use the same pattern as sendReport function
          let tokens: DeprecatedToken[] | undefined = deprecatedTokensCache.get(styles)
          if (!tokens) {
            // For template literals, we don't have a specific prop, so we use an empty string
            tokens = getDeprecatedTokens('', styles, context)
            deprecatedTokensCache.set(styles, tokens)
          }

          if (tokens.length === 0) return

          tokens.forEach((token) => {
            const tokenValue = typeof token === 'string' ? token : token.value
            let index = styles.indexOf(tokenValue)

            while (index !== -1) {
              const start = quasi.range[0] + index + 1 // +1 for the backtick
              const end = start + tokenValue.length

              context.report({
                loc: {
                  start: context.sourceCode.getLocFromIndex(start),
                  end: context.sourceCode.getLocFromIndex(end),
                },
                messageId: typeof token === 'string' ? 'noDeprecatedTokenPaths' : 'noDeprecatedTokens',
                data: {
                  token: tokenValue,
                  category: typeof token === 'string' ? undefined : token.category,
                },
              })

              // Check for other occurrences of the deprecated token
              index = styles.indexOf(tokenValue, index + tokenValue.length)
            }
          })
        })
      },
    }
  },
})

export default rule
