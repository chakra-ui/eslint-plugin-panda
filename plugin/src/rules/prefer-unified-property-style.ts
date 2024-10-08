import { isPandaAttribute, isPandaProp, isRecipeVariant, isValidProperty, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { compositeProperties } from '../utils/composite-properties'
import { isIdentifier, isJSXIdentifier, isJSXOpeningElement, isObjectExpression } from '../utils/nodes'
import type { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'prefer-unified-property-style'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Discourage mixing atomic and composite forms of the same property in a style declaration. Atomic styles give more consistent results.',
    },
    messages: {
      unify:
        "You're mixing atomic {{atomicProperties}} with composite property `{{composite}}`. Prefer atomic styling to mixing atomic and composite properties. Remove `{{composite}}` and use one or more of {{atomics}} instead.",
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
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

      if (name in compositeProperties) {
        compositePropertyCache.set(name, name)
        return name
      }

      const longhand = getLonghand(name)
      if (isValidProperty(longhand, context) && longhand in compositeProperties) {
        compositePropertyCache.set(name, longhand)
        return longhand
      }

      compositePropertyCache.set(name, undefined)
      return undefined
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

    const sendReport = (node: TSESTree.Node, composite: string, siblings: string[]) => {
      const atomicPropertiesSet = new Set(
        siblings.filter((prop) => compositeProperties[composite].includes(getLonghand(prop))),
      )

      if (atomicPropertiesSet.size === 0) return

      const atomicProperties = Array.from(atomicPropertiesSet)
        .map((prop) => `\`${prop}\``)
        .join(', ')

      const atomics = compositeProperties[composite].map((name) => `\`${name}\``).join(', ')

      context.report({
        node,
        messageId: 'unify',
        data: {
          composite,
          atomicProperties,
          atomics,
        },
      })
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!isJSXIdentifier(node.name)) return
        if (!isCachedPandaProp(node)) return

        const composite = resolveCompositeProperty(node.name.name)
        if (!composite) return
        if (!isJSXOpeningElement(node.parent)) return

        const siblings = node.parent.attributes.map((attr: any) => attr.name.name)

        sendReport(node, composite, siblings)
      },

      Property(node: TSESTree.Property) {
        if (!isIdentifier(node.key)) return
        if (!isCachedPandaAttribute(node)) return
        if (isCachedRecipeVariant(node)) return

        const composite = resolveCompositeProperty(node.key.name)
        if (!composite) return
        if (!isObjectExpression(node.parent)) return

        const siblings = node.parent.properties
          .filter((prop): prop is TSESTree.Property => prop.type === 'Property')
          .map((prop) => (isIdentifier(prop.key) ? prop.key.name : ''))

        sendReport(node.key, composite, siblings)
      },
    }
  },
})

export default rule
