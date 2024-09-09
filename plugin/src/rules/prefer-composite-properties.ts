import { isPandaAttribute, isPandaProp, isRecipeVariant, isValidProperty, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { compositeProperties } from '../utils/composite-properties'
import { isIdentifier, isJSXIdentifier } from '../utils/nodes'
import type { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'prefer-composite-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Encourage the use of composite properties instead of atomic properties in the codebase.',
    },
    messages: {
      composite: 'Use composite property of `{{atomic}}` instead. \nPrefer: {{composite}}',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const resolveCompositeProperty = (name: string) => {
      const longhand = resolveLonghand(name, context) ?? name

      if (!isValidProperty(longhand, context)) return
      return Object.keys(compositeProperties).find((cpd) => compositeProperties[cpd].includes(longhand))
    }

    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
      const cmp = resolveCompositeProperty(node.name)
      if (!cmp) return

      return context.report({
        node,
        messageId: 'composite',
        data: {
          composite: cmp,
          atomic: node.name,
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
        if (isRecipeVariant(node, context)) return

        sendReport(node.key)
      },
    }
  },
})

export default rule
