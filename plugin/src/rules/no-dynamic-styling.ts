import { type TSESTree } from '@typescript-eslint/utils'
import { type Rule, createRule } from '../utils'
import { isInPandaFunction, isPandaAttribute, isPandaProp, isRecipeVariant } from '../utils/helpers'
import {
  isArrayExpression,
  isIdentifier,
  isJSXExpressionContainer,
  isLiteral,
  isObjectExpression,
  isTemplateLiteral,
} from '../utils/nodes'

export const RULE_NAME = 'no-dynamic-styling'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        "Ensure users don't use dynamic styling. Prefer static styles, leverage CSS variables, or recipes for known dynamic styles.",
    },
    messages: {
      dynamic: 'Remove dynamic value. Prefer static styles.',
      dynamicProperty: 'Remove dynamic property. Prefer static style property.',
      dynamicRecipeVariant: 'Remove dynamic variant. Prefer static variant definition.',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Helper function to determine if a node represents a static value
    function isStaticValue(node: TSESTree.Node | null | undefined): boolean {
      if (!node) return false
      if (isLiteral(node)) return true
      if (isTemplateLiteral(node) && node.expressions.length === 0) return true
      if (isObjectExpression(node)) return true // Conditions are acceptable
      return false
    }

    // Function to check array elements for dynamic values
    function checkArrayElements(array: TSESTree.ArrayExpression) {
      array.elements.forEach((element) => {
        if (!element) return
        if (isStaticValue(element)) return

        context.report({
          node: element,
          messageId: 'dynamic',
        })
      })
    }

    return {
      // JSX Attributes
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!node.value) return

        if (isLiteral(node.value)) return
        // Check if it's a Panda prop early to avoid unnecessary processing
        if (!isPandaProp(node, context)) return

        if (isJSXExpressionContainer(node.value)) {
          const expr = node.value.expression

          if (isStaticValue(expr)) return

          if (isArrayExpression(expr)) {
            checkArrayElements(expr)
            return
          }
        }

        // Report dynamic value usage
        context.report({
          node: node.value,
          messageId: 'dynamic',
        })
      },

      // Dynamic properties with computed keys
      'Property[computed=true]': (node: TSESTree.Property) => {
        if (!isInPandaFunction(node, context)) return

        context.report({
          node: node.key,
          messageId: isRecipeVariant(node, context) ? 'dynamicRecipeVariant' : 'dynamicProperty',
        })
      },

      // Object Properties
      Property(node: TSESTree.Property) {
        if (!isIdentifier(node.key)) return

        // Check if it's a Panda attribute early to avoid unnecessary processing
        if (!isPandaAttribute(node, context)) return
        if (isRecipeVariant(node, context)) return

        if (isStaticValue(node.value)) return

        if (isArrayExpression(node.value)) {
          checkArrayElements(node.value)
          return
        }

        // Report dynamic value usage
        context.report({
          node: node.value,
          messageId: 'dynamic',
        })
      },
    }
  },
})

export default rule
