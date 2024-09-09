import { isPandaAttribute, isPandaProp, isRecipeVariant, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXIdentifier } from '../utils/nodes'
import type { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'prefer-longhand-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Discourage the use of shorthand properties and promote the preference for longhand properties in the codebase.',
    },
    messages: {
      longhand: 'Use longhand property of `{{shorthand}}` instead. Prefer `{{longhand}}`',
      replace: 'Replace `{{shorthand}}` with `{{longhand}}`',
    },
    type: 'suggestion',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
      const longhand = resolveLonghand(node.name, context)!
      if (!longhand) return

      const data = {
        shorthand: node.name,
        longhand,
      }

      return context.report({
        node,
        messageId: 'longhand',
        data,
        suggest: [
          {
            messageId: 'replace',
            data,
            fix: (fixer) => {
              return fixer.replaceTextRange(node.range, longhand)
            },
          },
        ],
      })
    }

    return {
      JSXAttribute(node) {
        if (!isJSXIdentifier(node.name)) return
        if (!isPandaProp(node, context)) return

        sendReport(node.name)
      },

      Property(node) {
        if (!isIdentifier(node.key)) return
        if (!isPandaAttribute(node, context)) return
        if (isRecipeVariant(node, context)) return

        sendReport(node.key)
      },
    }
  },
})

export default rule
