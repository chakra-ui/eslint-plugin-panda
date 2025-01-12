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
      composite: 'Use composite property instead of `{{atomic}}`. Prefer: `{{composite}}`.',
    },
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          whitelist: {
            type: 'array',
            items: {
              type: 'string',
              minLength: 0,
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      whitelist: [],
    },
  ],
  create(context) {
    const whitelist: string[] = context.options[0]?.whitelist ?? []

    // Cache for resolved longhand properties
    const longhandCache = new Map<string, string>()

    const getLonghand = (name: string): string => {
      if (longhandCache.has(name)) {
        return longhandCache.get(name)!
      }
      const longhand = resolveLonghand(name, context) ?? name
      longhandCache.set(name, longhand)
      return longhand
    }

    // Cache for composite property resolution
    const compositePropertyCache = new Map<string, string | undefined>()

    const resolveCompositeProperty = (name: string): string | undefined => {
      if (compositePropertyCache.has(name)) {
        return compositePropertyCache.get(name)
      }

      const longhand = getLonghand(name)

      if (!isValidProperty(longhand, context)) {
        compositePropertyCache.set(name, undefined)
        return undefined
      }

      const composite = Object.keys(compositeProperties).find((cpd) => compositeProperties[cpd].includes(longhand))

      compositePropertyCache.set(name, composite)
      return composite
    }

    // Caches for helper functions
    const pandaPropCache = new WeakMap<TSESTree.JSXAttribute, boolean | undefined>()
    const isCachedPandaProp = (node: TSESTree.JSXAttribute): boolean => {
      if (pandaPropCache.has(node)) {
        return pandaPropCache.get(node)!
      }
      const result = isPandaProp(node, context)
      pandaPropCache.set(node, result)
      return !!result
    }

    const pandaAttributeCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const isCachedPandaAttribute = (node: TSESTree.Property): boolean => {
      if (pandaAttributeCache.has(node)) {
        return pandaAttributeCache.get(node)!
      }
      const result = isPandaAttribute(node, context)
      pandaAttributeCache.set(node, result)
      return !!result
    }

    const recipeVariantCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const isCachedRecipeVariant = (node: TSESTree.Property): boolean => {
      if (recipeVariantCache.has(node)) {
        return recipeVariantCache.get(node)!
      }
      const result = isRecipeVariant(node, context)
      recipeVariantCache.set(node, result)
      return !!result
    }

    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier, composite: string) => {
      if (whitelist.includes(node.name)) return
      context.report({
        node,
        messageId: 'composite',
        data: {
          composite,
          atomic: node.name,
        },
      })
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!isJSXIdentifier(node.name)) return
        if (!isCachedPandaProp(node)) return

        const composite = resolveCompositeProperty(node.name.name)
        if (!composite) return

        sendReport(node.name, composite)
      },

      Property(node: TSESTree.Property) {
        if (!isIdentifier(node.key)) return
        if (!isCachedPandaAttribute(node)) return
        if (isCachedRecipeVariant(node)) return

        const composite = resolveCompositeProperty(node.key.name)
        if (!composite) return

        sendReport(node.key, composite)
      },
    }
  },
})

export default rule
