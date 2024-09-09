import { isPandaAttribute, isPandaProp, isRecipeVariant, isValidProperty, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { compositeProperties } from '../utils/composite-properties'
import { isIdentifier, isJSXIdentifier, isJSXOpeningElement, isObjectExpression } from '../utils/nodes'

export const RULE_NAME = 'prefer-unified-property-style'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Discourage against mixing atomic and composite forms of the same property in a style declaration. Atomic styles give more consistent results',
    },
    messages: {
      unify:
        "You're mixing atomic {{atomicProperties}} with composite property {{composite}}. \nPrefer atomic styling to mixing atomic and composite properties. \nRemove `{{composite}}` and use one or more of {{atomics}} instead",
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const getLonghand = (name: string) => resolveLonghand(name, context) ?? name

    const resolveCompositeProperty = (name: string) => {
      if (name in compositeProperties) return name

      const longhand = getLonghand(name)
      if (isValidProperty(longhand, context) && longhand in compositeProperties) return longhand
    }

    const sendReport = (node: any, cmp: string, siblings: string[]) => {
      const _atomicProperties = siblings
        .filter((prop) => compositeProperties[cmp].includes(getLonghand(prop)))
        .map((prop) => `\`${prop}\``)
      if (!_atomicProperties.length) return

      const atomicProperties = _atomicProperties.join(', ') + (_atomicProperties.length === 1 ? ' style' : ' styles')
      const atomics = compositeProperties[cmp].map((name) => `\`${name}\``).join(', ')

      context.report({
        node,
        messageId: 'unify',
        data: {
          composite: cmp,
          atomicProperties,
          atomics,
        },
      })
    }

    return {
      JSXAttribute(node) {
        if (!isJSXIdentifier(node.name)) return
        if (!isPandaProp(node, context)) return

        const cmp = resolveCompositeProperty(node.name.name)
        if (!cmp) return
        if (!isJSXOpeningElement(node.parent)) return

        const siblings = node.parent.attributes.map((attr: any) => attr.name.name)
        sendReport(node, cmp, siblings)
      },

      Property(node) {
        if (!isIdentifier(node.key)) return
        if (!isPandaAttribute(node, context)) return
        if (isRecipeVariant(node, context)) return

        const cmp = resolveCompositeProperty(node.key.name)
        if (!cmp) return
        if (!isObjectExpression(node.parent)) return

        const siblings = node.parent.properties.map((prop: any) => isIdentifier(prop.key) && prop.key.name)
        sendReport(node.key, cmp, siblings)
      },
    }
  },
})

export default rule
