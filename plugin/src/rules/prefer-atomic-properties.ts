import { isPandaAttribute, isPandaProp, isValidProperty, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { compositeProperties } from '../utils/composite-properties'
import { isIdentifier, isJSXIdentifier } from '../utils/nodes'
import type { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'prefer-atomic-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Encourage the use of atomic properties instead of composite properties in the codebase.',
    },
    messages: {
      atomic: 'Use atomic properties of `{{composite}}` instead. Prefer: \n{{atomics}}',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const resolveCompositeProperty = (name: string) => {
      if (Object.hasOwn(compositeProperties, name)) return name

      const longhand = resolveLonghand(name, context) ?? name
      if (isValidProperty(longhand, context) && Object.hasOwn(compositeProperties, longhand)) return longhand
    }

    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
      const cmp = resolveCompositeProperty(node.name)
      if (!cmp) return

      const atomics = compositeProperties[cmp].map((name) => `\`${name}\``).join(',\n')

      return context.report({
        node,
        messageId: 'atomic',
        data: {
          composite: node.name,
          atomics,
        },
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
