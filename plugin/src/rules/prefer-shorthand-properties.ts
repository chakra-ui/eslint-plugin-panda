import { isPandaAttribute, isPandaProp, isRecipeVariant, resolveLonghand, resolveShorthands } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXIdentifier } from '../utils/nodes'
import type { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'prefer-shorthand-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Discourage the use of longhand properties and promote the preference for shorthand properties in the codebase.',
    },
    messages: {
      shorthand: 'Use shorthand property instead of `{{longhand}}`. Prefer `{{shorthand}}`.',
      replace: 'Replace `{{longhand}}` with `{{shorthand}}`.',
    },
    type: 'suggestion',
    hasSuggestions: true,
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
    const longhandCache = new Map<string, string | undefined>()

    const getLonghand = (name: string): string | undefined => {
      if (longhandCache.has(name)) {
        return longhandCache.get(name)!
      }
      const longhand = resolveLonghand(name, context)
      longhandCache.set(name, longhand)
      return longhand
    }

    // Cache for resolved shorthands
    const shorthandsCache = new Map<string, string[] | undefined>()

    const getShorthands = (name: string): string[] | undefined => {
      if (shorthandsCache.has(name)) {
        return shorthandsCache.get(name)!
      }
      const shorthands = resolveShorthands(name, context)
      shorthandsCache.set(name, shorthands)
      return shorthands
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

    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
      if (whitelist.includes(node.name)) return
      const longhand = getLonghand(node.name)
      if (longhand) return // If it's already shorthand, no need to report

      const shorthands = getShorthands(node.name)
      if (!shorthands || shorthands.length === 0) return

      const shorthandList = shorthands.map((s) => `\`${s}\``).join(', ')

      const data = {
        longhand: node.name,
        shorthand: shorthandList,
      }

      context.report({
        node,
        messageId: 'shorthand',
        data,
        suggest: [
          {
            messageId: 'replace',
            data,
            fix: (fixer) => fixer.replaceText(node, shorthands[0]),
          },
        ],
      })
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!isJSXIdentifier(node.name)) return
        if (!isCachedPandaProp(node)) return

        sendReport(node.name)
      },

      Property(node: TSESTree.Property) {
        if (!isIdentifier(node.key)) return
        if (!isCachedPandaAttribute(node)) return
        if (isCachedRecipeVariant(node)) return

        sendReport(node.key)
      },
    }
  },
})

export default rule
