import { isPandaAttribute, isPandaProp, isRecipeVariant } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXExpressionContainer, isLiteral, isTemplateLiteral, type Node } from '../utils/nodes'
import { getArbitraryValue } from '@pandacss/shared'

// Check if the string ends with '!' with optional whitespace before it
const exclamationRegex = /\s*!$/
// Check if the string ends with '!important' with optional whitespace before it and after, but not within '!important'
const importantRegex = /\s*!important\s*$/

export const RULE_NAME = 'no-important'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Disallow usage of important keyword. Prioroitize specificity for a maintainable and predictable styling structure.',
    },
    messages: {
      important:
        'Avoid using the !important keyword. Refactor your code to prioritize specificity for predictable styling.',
      remove: 'Remove the `{{keyword}}` keyword.',
    },
    type: 'suggestion',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const removeQuotes = ([start, end]: readonly [number, number]) => [start + 1, end - 1] as const

    const hasImportantKeyword = (_value?: string) => {
      if (!_value) return false
      const value = getArbitraryValue(_value)
      return exclamationRegex.test(value) || importantRegex.test(value)
    }

    const removeImportantKeyword = (input: string) => {
      if (exclamationRegex.test(input)) {
        // Remove trailing '!'
        return { fixed: input.replace(exclamationRegex, ''), keyword: '!' }
      } else if (importantRegex.test(input)) {
        // Remove '!important' with optional whitespace
        return { fixed: input.replace(importantRegex, ''), keyword: '!important' }
      } else {
        // No match, return the original string
        return { fixed: input, keyword: null }
      }
    }

    const handleLiteral = (node: Node) => {
      if (!isLiteral(node)) return
      if (!hasImportantKeyword(node.value?.toString())) return

      sendReport(node)
    }

    const handleTemplateLiteral = (node: Node) => {
      if (!isTemplateLiteral(node)) return
      if (node.expressions.length > 0) return
      if (!hasImportantKeyword(node.quasis[0].value.raw)) return

      sendReport(node.quasis[0], node.quasis[0].value.raw)
    }

    const sendReport = (node: any, _value?: string) => {
      const value = _value ?? node.value?.toString()
      const { keyword, fixed } = removeImportantKeyword(value)

      return context.report({
        node,
        messageId: 'important',
        suggest: [
          {
            messageId: 'remove',
            data: { keyword },
            fix: (fixer) => {
              return fixer.replaceTextRange(removeQuotes(node.range), fixed)
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
      },

      Property(node) {
        if (!isIdentifier(node.key)) return
        if (!isLiteral(node.value) && !isTemplateLiteral(node.value)) return
        if (!isPandaAttribute(node, context)) return
        if (isRecipeVariant(node, context)) return

        handleLiteral(node.value)
        handleTemplateLiteral(node.value)
      },
    }
  },
})

export default rule
