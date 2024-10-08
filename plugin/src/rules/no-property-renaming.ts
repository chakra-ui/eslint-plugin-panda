import type { TSESTree } from '@typescript-eslint/utils'
import { type Rule, createRule } from '../utils'
import { isPandaAttribute, isPandaProp, isRecipeVariant } from '../utils/helpers'
import { isIdentifier, isJSXExpressionContainer, isMemberExpression } from '../utils/nodes'

export const RULE_NAME = 'no-property-renaming'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Ensure that properties for patterns or style props are not renamed, as it prevents proper tracking.',
    },
    messages: {
      noRenaming:
        'Incoming `{{prop}}` prop is different from the expected `{{expected}}` attribute. Panda will not track this prop.',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Caches for helper functions
    const pandaPropCache = new WeakMap<TSESTree.JSXAttribute, boolean | undefined>()
    const pandaAttributeCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const recipeVariantCache = new WeakMap<TSESTree.Property, boolean | undefined>()

    const isCachedPandaProp = (node: TSESTree.JSXAttribute): boolean => {
      if (pandaPropCache.has(node)) {
        return pandaPropCache.get(node)!
      }
      const result = isPandaProp(node, context)
      pandaPropCache.set(node, result)
      return !!result
    }

    const isCachedPandaAttribute = (node: TSESTree.Property): boolean => {
      if (pandaAttributeCache.has(node)) {
        return pandaAttributeCache.get(node)!
      }
      const result = isPandaAttribute(node, context)
      pandaAttributeCache.set(node, result)
      return !!result
    }

    const isCachedRecipeVariant = (node: TSESTree.Property): boolean => {
      if (recipeVariantCache.has(node)) {
        return recipeVariantCache.get(node)!
      }
      const result = isRecipeVariant(node, context)
      recipeVariantCache.set(node, result)
      return !!result
    }

    const sendReport = (node: TSESTree.Node, expected: string, prop: string) => {
      context.report({
        node,
        messageId: 'noRenaming',
        data: {
          expected,
          prop,
        },
      })
    }

    const handleReport = (node: TSESTree.Node, value: TSESTree.Node, attr: string) => {
      if (isIdentifier(value) && attr !== value.name) {
        sendReport(node, attr, value.name)
      } else if (isMemberExpression(value) && isIdentifier(value.property) && attr !== value.property.name) {
        sendReport(node, attr, value.property.name)
      }
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!node.value) return
        if (!isJSXExpressionContainer(node.value)) return
        if (!isCachedPandaProp(node)) return

        const attr = node.name.name.toString()
        const expression = node.value.expression

        handleReport(node.value, expression, attr)
      },

      Property(node: TSESTree.Property) {
        if (!isIdentifier(node.key)) return
        if (!isIdentifier(node.value) && !isMemberExpression(node.value)) return
        if (!isCachedPandaAttribute(node)) return
        if (isCachedRecipeVariant(node)) return

        const attr = node.key.name
        const value = node.value

        handleReport(node.value, value, attr)
      },
    }
  },
})

export default rule
