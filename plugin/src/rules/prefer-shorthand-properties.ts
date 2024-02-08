import { isPandaAttribute, isPandaProp, resolveLonghand, resolveShorthands } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXIdentifier } from '../utils/nodes'

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
    const sendReport = (node: any, name: string) => {
      const shorthands = resolveShorthands(name, context)
      if (!shorthands) return

      const shorthand = shorthands.map((s) => '`' + s + '`')?.join(', ')

      const data = {
        longhand: name,
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

        const longhand = resolveLonghand(node.name.name, context)
        if (longhand) return

        sendReport(node.name, node.name.name)
      },

      Property(node) {
        if (!isIdentifier(node.key)) return
        if (!isPandaAttribute(node, context)) return
        const longhand = resolveLonghand(node.key.name, context)
        if (longhand) return

        sendReport(node.key, node.key.name)
      },
    }
  },
})

export default rule
