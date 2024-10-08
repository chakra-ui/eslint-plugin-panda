import {
  extractTokens,
  isColorAttribute as originalIsColorAttribute,
  isColorToken as originalIsColorToken,
  isPandaAttribute,
  isPandaProp,
  isRecipeVariant,
} from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXExpressionContainer, isJSXIdentifier, isLiteral, isTemplateLiteral } from '../utils/nodes'
import { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'no-hardcoded-color'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Enforce the exclusive use of design tokens as values for colors within the codebase.',
    },
    messages: {
      invalidColor: '`{{color}}` is not a valid color token.',
    },
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          noOpacity: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      noOpacity: false,
    },
  ],
  create(context) {
    const noOpacity = context.options[0]?.noOpacity

    // Caches for isColorToken and isColorAttribute results
    const colorTokenCache = new Map<string, boolean | undefined>()
    const colorAttributeCache = new Map<string, boolean>()

    // Cached version of isColorToken
    const isColorToken = (token: string): boolean => {
      if (colorTokenCache.has(token)) {
        return colorTokenCache.get(token)!
      }
      const result = originalIsColorToken(token, context)
      colorTokenCache.set(token, result)
      return !!result
    }

    // Cached version of isColorAttribute
    const isColorAttribute = (attribute: string): boolean => {
      if (colorAttributeCache.has(attribute)) {
        return colorAttributeCache.get(attribute)!
      }
      const result = originalIsColorAttribute(attribute, context)
      colorAttributeCache.set(attribute, result)
      return result
    }

    const isTokenFunctionUsed = (value: string): boolean => {
      if (!value) return false
      const tokens = extractTokens(value)
      return tokens.length > 0
    }

    const isValidColorToken = (value: string): boolean => {
      if (!value) return false
      const [colorToken, opacity] = value.split('/')
      const hasOpacity = opacity !== undefined && opacity.length > 0
      const isValidToken = isColorToken(colorToken)

      return noOpacity ? isValidToken && !hasOpacity : isValidToken
    }

    const reportInvalidColor = (node: TSESTree.Node, color: string) => {
      context.report({
        node,
        messageId: 'invalidColor',
        data: {
          color,
        },
      })
    }

    const checkColorValue = (node: TSESTree.Node, value: string, attributeName: string) => {
      if (!isColorAttribute(attributeName)) return
      if (isTokenFunctionUsed(value)) return
      if (isValidColorToken(value)) return

      reportInvalidColor(node, value)
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!isJSXIdentifier(node.name)) return
        if (!isPandaProp(node, context) || !node.value) return

        const attributeName = node.name.name
        const valueNode = node.value

        if (isLiteral(valueNode)) {
          const value = valueNode.value?.toString() || ''
          checkColorValue(valueNode, value, attributeName)
        } else if (isJSXExpressionContainer(valueNode)) {
          const expression = valueNode.expression
          if (isLiteral(expression)) {
            const value = expression.value?.toString() || ''
            checkColorValue(expression, value, attributeName)
          } else if (isTemplateLiteral(expression) && expression.expressions.length === 0) {
            const value = expression.quasis[0].value.raw
            checkColorValue(expression.quasis[0], value, attributeName)
          }
        }
      },

      Property(node: TSESTree.Property) {
        if (!isIdentifier(node.key)) return
        if (!isPandaAttribute(node, context)) return
        if (isRecipeVariant(node, context)) return

        const attributeName = node.key.name
        const valueNode = node.value

        if (isLiteral(valueNode)) {
          const value = valueNode.value?.toString() || ''
          checkColorValue(valueNode, value, attributeName)
        } else if (isTemplateLiteral(valueNode) && valueNode.expressions.length === 0) {
          const value = valueNode.quasis[0].value.raw
          checkColorValue(valueNode.quasis[0], value, attributeName)
        }
      },
    }
  },
})

export default rule
