import { isPandaAttribute, isPandaProp, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXIdentifier } from '../utils/nodes'
import type { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'no-margin-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Discourage using margin properties for spacing; prefer defining spacing in parent elements with `flex` or `grid` using the `gap` property for a more resilient layout. Margins make components less reusable in other contexts.',
    },
    messages: {
      noMargin:
        'Use flex or grid with the `gap` property to define spacing in parent elements for a more resilient layout.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const getLonghand = (name: string) => resolveLonghand(name, context) ?? name

    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
      if (!getLonghand(node.name).toLowerCase().includes('margin')) return

      return context.report({
        node,
        messageId: 'noMargin',
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

        sendReport(node.key)
      },
    }
  },
})

export default rule
