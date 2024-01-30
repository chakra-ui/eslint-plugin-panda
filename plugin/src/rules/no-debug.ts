import { isIdentifier, isJSXIdentifier } from '../utils/nodes'
import { type Rule, createRule } from '../utils'
import { isPandaAttribute, isPandaProp } from '../utils/helpers'

export const RULE_NAME = 'no-debug'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Disallow the inclusion of the debug attribute when shipping code to the production environment.',
    },
    messages: {
      debug: 'Remove the debug utility.',
    },
    type: 'suggestion',
    fixable: 'code',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        if (!isJSXIdentifier(node.name) || node.name.name !== 'debug') return
        if (!isPandaProp(node, context)) return

        context.report({
          node,
          messageId: 'debug',
          fix: (fixer) => fixer.remove(node),
        })
      },

      Property(node) {
        if (!isIdentifier(node.key) || node.key.name !== 'debug') return
        if (!isPandaAttribute(node, context)) return

        context.report({
          node: node.key,
          messageId: 'debug',
          fix: (fixer) => fixer.removeRange([node.range[0], node.range[1] + 1]),
        })
      },
    }
  },
})

export default rule
