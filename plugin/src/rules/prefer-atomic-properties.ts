import { isPandaAttribute, isPandaProp, isValidProperty, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { compositeProperties } from '../utils/composite-properties'
import { isIdentifier, isJSXIdentifier } from '../utils/nodes'

export const RULE_NAME = 'prefer-atomic-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Encourage the use of atomic properties instead of composite shorthand properties in the codebase.',
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

    const sendReport = (node: any, name: string) => {
      const cpd = resolveCompositeProperty(name)!

      const atomics = compositeProperties[cpd].map((name) => `\`${name}\``).join(',\n')

      return context.report({
        node,
        messageId: 'atomic',
        data: {
          composite: name,
          atomics,
        },
      })
    }

    return {
      JSXAttribute(node) {
        if (!isJSXIdentifier(node.name)) return
        if (!isPandaProp(node, context)) return

        const cpd = resolveCompositeProperty(node.name.name)
        if (!cpd) return

        sendReport(node, node.name.name)
      },

      Property(node) {
        if (!isIdentifier(node.key)) return
        if (!isPandaAttribute(node, context)) return
        const cpd = resolveCompositeProperty(node.key.name)
        if (!cpd) return

        sendReport(node.key, node.key.name)
      },
    }
  },
})

export default rule
