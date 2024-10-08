import { type Rule, createRule } from '../utils'
import { isPandaProp, isPandaAttribute, isRecipeVariant } from '../utils/helpers'
import { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'no-debug'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Disallow the inclusion of the debug attribute when shipping code to the production environment.',
    },
    messages: {
      debug: 'Unnecessary debug utility.',
      prop: 'Remove the debug prop.',
      property: 'Remove the debug property.',
    },
    type: 'problem',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      'JSXAttribute[name.name="debug"]'(node: TSESTree.JSXAttribute) {
        // Ensure the attribute is a Panda prop
        if (!isPandaProp(node, context)) return

        context.report({
          node,
          messageId: 'debug',
          suggest: [
            {
              messageId: 'prop',
              fix: (fixer) => fixer.remove(node),
            },
          ],
        })
      },

      'Property[key.name="debug"]'(node: TSESTree.Property) {
        // Ensure the property is a Panda attribute
        if (!isPandaAttribute(node, context)) return
        // Exclude recipe variants
        if (isRecipeVariant(node, context)) return

        context.report({
          node: node.key,
          messageId: 'debug',
          suggest: [
            {
              messageId: 'property',
              fix: (fixer) => fixer.removeRange([node.range[0], node.range[1] + 1]),
            },
          ],
        })
      },
    }
  },
})

export default rule
