import { isPandaAttribute, isPandaProp, isRecipeVariant } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { getArbitraryValue } from '@pandacss/shared'
import { isIdentifier, isJSXExpressionContainer, isLiteral, isTemplateLiteral } from '../utils/nodes'
import { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'no-escape-hatch'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Prohibit the use of escape hatch syntax in the code.',
    },
    messages: {
      escapeHatch:
        'Avoid using the escape hatch [value] for undefined tokens. Define a corresponding token in your design system for better consistency and maintainability.',
      remove: 'Remove the square brackets (`[]`).',
    },
    type: 'problem',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Helper function to adjust the range for fixing (removing brackets)
    const removeBrackets = (range: readonly [number, number]) => {
      const [start, end] = range
      return [start + 1, end - 1] as const
    }

    // Function to check if a value contains escape hatch syntax
    const hasEscapeHatch = (value: string | undefined): boolean => {
      if (!value) return false
      // Early return if the value doesn't contain brackets
      if (!value.includes('[')) return false
      return getArbitraryValue(value) !== value.trim()
    }

    // Unified function to handle reporting
    const handleNodeValue = (node: TSESTree.Node, value: string) => {
      if (!hasEscapeHatch(value)) return

      context.report({
        node,
        messageId: 'escapeHatch',
        suggest: [
          {
            messageId: 'remove',
            fix: (fixer) => {
              return fixer.replaceTextRange(removeBrackets(node.range as [number, number]), getArbitraryValue(value))
            },
          },
        ],
      })
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!node.value) return
        // Ensure the attribute is a Panda prop
        if (!isPandaProp(node, context)) return

        const { value } = node

        if (isLiteral(value)) {
          const val = value.value?.toString() ?? ''
          handleNodeValue(value, val)
        } else if (isJSXExpressionContainer(value)) {
          const expr = value.expression
          if (isLiteral(expr)) {
            const val = expr.value?.toString() ?? ''
            handleNodeValue(expr, val)
          } else if (isTemplateLiteral(expr) && expr.expressions.length === 0) {
            const val = expr.quasis[0].value.raw
            handleNodeValue(expr.quasis[0], val)
          }
        }
      },

      Property(node: TSESTree.Property) {
        if (!isIdentifier(node.key)) return
        // Ensure the property is a Panda attribute
        if (!isPandaAttribute(node, context)) return
        // Exclude recipe variants
        if (isRecipeVariant(node, context)) return

        const value = node.value
        if (isLiteral(value)) {
          const val = value.value?.toString() ?? ''
          handleNodeValue(value, val)
        } else if (isTemplateLiteral(value) && value.expressions.length === 0) {
          const val = value.quasis[0].value.raw
          handleNodeValue(value.quasis[0], val)
        }
      },
    }
  },
})

export default rule
