import { isLiteral, isTemplateLiteral } from '../utils/nodes'
import { type Rule, createRule } from '../utils'
import { isInJSXProp, isInPandaFunction, isRecipeVariant, isStyledProperty } from '../utils/helpers'
import { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'no-invalid-nesting'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Warn against invalid nesting. Nested styles must contain the `&` character.',
    },
    messages: {
      nesting: 'Invalid style nesting. Nested styles must contain the `&` character.',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Caches for helper functions
    const pandaFunctionCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const jsxPropCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const recipeVariantCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const styledPropertyCache = new WeakMap<TSESTree.Property, boolean | undefined>()

    // Cached helper functions
    const isCachedInPandaFunction = (node: TSESTree.Property): boolean => {
      if (pandaFunctionCache.has(node)) {
        return pandaFunctionCache.get(node)!
      }
      const result = !!isInPandaFunction(node, context)
      pandaFunctionCache.set(node, result)
      return !!result
    }

    const isCachedInJSXProp = (node: TSESTree.Property): boolean => {
      if (jsxPropCache.has(node)) {
        return jsxPropCache.get(node)!
      }
      const result = isInJSXProp(node, context)
      jsxPropCache.set(node, result)
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

    const isCachedStyledProperty = (node: TSESTree.Property): boolean => {
      if (styledPropertyCache.has(node)) {
        return styledPropertyCache.get(node)!
      }
      const result = isStyledProperty(node, context)
      styledPropertyCache.set(node, result)
      return !!result
    }

    // Function to check if a key is an invalid nesting selector
    const isInvalidNestingSelector = (node: TSESTree.Expression): boolean => {
      if (isLiteral(node) && typeof node.value === 'string') {
        return !node.value.includes('&')
      } else if (isTemplateLiteral(node) && node.expressions.length === 0) {
        return !node.quasis[0].value.raw.includes('&')
      }
      return false
    }

    return {
      // Use AST selector to target Property nodes with non-Identifier keys whose value is an ObjectExpression
      'Property[key.type!=/Identifier/][value.type="ObjectExpression"]'(node: TSESTree.Property) {
        // Check if the node is within a Panda function or JSX prop
        const inPandaFunction = isCachedInPandaFunction(node)
        const inJSXProp = isCachedInJSXProp(node)

        if (!inPandaFunction && !inJSXProp) return
        if (isCachedRecipeVariant(node)) return
        if (isCachedStyledProperty(node)) return

        const keyNode = node.key

        if (isInvalidNestingSelector(keyNode)) {
          context.report({
            node: keyNode,
            messageId: 'nesting',
          })
        }
      },
    }
  },
})

export default rule
