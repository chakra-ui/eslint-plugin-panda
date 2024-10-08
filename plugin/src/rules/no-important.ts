import { isPandaAttribute, isPandaProp, isRecipeVariant } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXExpressionContainer, isLiteral, isTemplateLiteral } from '../utils/nodes'
import { getArbitraryValue } from '@pandacss/shared'
import { TSESTree } from '@typescript-eslint/utils'

// Regular expressions to detect '!important' and '!' at the end of a value
const exclamationRegex = /\s*!$/
const importantRegex = /\s*!important\s*$/

export const RULE_NAME = 'no-important'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Disallow usage of !important keyword. Prioritize specificity for a maintainable and predictable styling structure.',
    },
    messages: {
      important:
        'Avoid using the {{keyword}} keyword. Refactor your code to prioritize specificity for predictable styling.',
      remove: 'Remove the `{{keyword}}` keyword.',
    },
    type: 'problem',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Helper function to adjust the range for fixing (removing quotes)
    const removeQuotes = (range: readonly [number, number]) => {
      const [start, end] = range
      return [start + 1, end - 1] as const
    }

    // Caches for helper functions
    const pandaPropCache = new WeakMap<TSESTree.JSXAttribute, boolean | undefined>()
    const pandaAttributeCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const recipeVariantCache = new WeakMap<TSESTree.Property, boolean | undefined>()

    // Cached version of isPandaProp
    const isCachedPandaProp = (node: TSESTree.JSXAttribute): boolean => {
      if (pandaPropCache.has(node)) {
        return pandaPropCache.get(node)!
      }
      const result = isPandaProp(node, context)
      pandaPropCache.set(node, result)
      return !!result
    }

    // Cached version of isPandaAttribute
    const isCachedPandaAttribute = (node: TSESTree.Property): boolean => {
      if (pandaAttributeCache.has(node)) {
        return pandaAttributeCache.get(node)!
      }
      const result = isPandaAttribute(node, context)
      pandaAttributeCache.set(node, result)
      return !!result
    }

    // Cached version of isRecipeVariant
    const isCachedRecipeVariant = (node: TSESTree.Property): boolean => {
      if (recipeVariantCache.has(node)) {
        return recipeVariantCache.get(node)!
      }
      const result = isRecipeVariant(node, context)
      recipeVariantCache.set(node, result)
      return !!result
    }

    // Function to check if a value contains '!important' or '!'
    const hasImportantKeyword = (value: string | undefined): boolean => {
      if (!value) return false
      const arbitraryValue = getArbitraryValue(value)
      return exclamationRegex.test(arbitraryValue) || importantRegex.test(arbitraryValue)
    }

    // Function to remove '!important' or '!' from a string
    const removeImportantKeyword = (input: string): { fixed: string; keyword: string | null } => {
      if (importantRegex.test(input)) {
        // Remove '!important' with optional whitespace
        return { fixed: input.replace(importantRegex, '').trimEnd(), keyword: '!important' }
      } else if (exclamationRegex.test(input)) {
        // Remove trailing '!'
        return { fixed: input.replace(exclamationRegex, '').trimEnd(), keyword: '!' }
      } else {
        // No match, return the original string
        return { fixed: input, keyword: null }
      }
    }

    // Unified function to handle reporting
    const handleNodeValue = (node: TSESTree.Node, value: string) => {
      if (!hasImportantKeyword(value)) return

      const { fixed, keyword } = removeImportantKeyword(value)

      context.report({
        node,
        messageId: 'important',
        data: { keyword },
        suggest: [
          {
            messageId: 'remove',
            data: { keyword },
            fix: (fixer) => {
              return fixer.replaceTextRange(removeQuotes(node.range as [number, number]), fixed)
            },
          },
        ],
      })
    }

    return {
      // JSX Attributes
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!node.value) return
        if (!isCachedPandaProp(node)) return

        const valueNode = node.value

        if (isLiteral(valueNode)) {
          const val = valueNode.value?.toString() ?? ''
          handleNodeValue(valueNode, val)
        } else if (isJSXExpressionContainer(valueNode)) {
          const expr = valueNode.expression

          if (isLiteral(expr)) {
            const val = expr.value?.toString() ?? ''
            handleNodeValue(expr, val)
          } else if (isTemplateLiteral(expr) && expr.expressions.length === 0) {
            const val = expr.quasis[0].value.raw
            handleNodeValue(expr.quasis[0], val)
          }
        }
      },

      // Object Properties
      Property(node: TSESTree.Property) {
        if (!isIdentifier(node.key)) return
        if (!isCachedPandaAttribute(node)) return
        if (isCachedRecipeVariant(node)) return

        const valueNode = node.value

        if (isLiteral(valueNode)) {
          const val = valueNode.value?.toString() ?? ''
          handleNodeValue(valueNode, val)
        } else if (isTemplateLiteral(valueNode) && valueNode.expressions.length === 0) {
          const val = valueNode.quasis[0].value.raw
          handleNodeValue(valueNode.quasis[0], val)
        }
      },
    }
  },
})

export default rule
