import { isPandaAttribute, isPandaProp, isRecipeVariant, resolveLonghand, resolveShorthands } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXIdentifier } from '../utils/nodes'
import type { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'prefer-shorthand-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Discourage the use of longhand properties and promote the preference for shorthand properties in the codebase.',
    },
    messages: {
      shorthand: 'Use shorthand property of `{{longhand}}` instead. Prefer {{shorthand}}',
      replace: 'Replace `{{longhand}}` with `{{shorthand}}`',
    },
    type: 'suggestion',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
      const longhand = resolveLonghand(node.name, context)
      if (longhand) return

      const shorthands = resolveShorthands(node.name, context)
      if (!shorthands) return

      const shorthand = shorthands.map((s) => `\`${s}\``)?.join(', ')

      const data = {
        longhand: node.name,
        shorthand,
      }

      return context.report({
        node,
        messageId: 'shorthand',
        data,
        suggest: [
          {
            messageId: 'replace',
            data,
            fix: (fixer) => {
              return fixer.replaceTextRange(node.range, shorthands[0])
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
