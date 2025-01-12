import { isRecipeVariant, isPandaAttribute, isPandaProp, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXIdentifier } from '../utils/nodes'
import { physicalProperties } from '../utils/physical-properties'
import type { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'no-physical-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Encourage the use of logical properties over physical properties to foster a responsive and adaptable user interface.',
    },
    messages: {
      physical: 'Use logical property instead of {{physical}}. Prefer `{{logical}}`.',
      replace: 'Replace `{{physical}}` with `{{logical}}`.',
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
    const longhandCache = new Map<string, string>()

    // Cache for helper functions
    const pandaPropCache = new WeakMap<TSESTree.JSXAttribute, boolean | undefined>()
    const pandaAttributeCache = new WeakMap<TSESTree.Property, boolean | undefined>()
    const recipeVariantCache = new WeakMap<TSESTree.Property, boolean | undefined>()

    const getLonghand = (name: string): string => {
      if (longhandCache.has(name)) {
        return longhandCache.get(name)!
      }
      const longhand = resolveLonghand(name, context) ?? name
      longhandCache.set(name, longhand)
      return longhand
    }

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

    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
      if (whitelist.includes(node.name)) return
      const longhandName = getLonghand(node.name)
      if (!(longhandName in physicalProperties)) return

      const logical = physicalProperties[longhandName]
      const physicalName = `\`${node.name}\`${longhandName !== node.name ? ` (resolved to \`${longhandName}\`)` : ''}`

      context.report({
        node,
        messageId: 'physical',
        data: {
          physical: physicalName,
          logical,
        },
        suggest: [
          {
            messageId: 'replace',
            data: {
              physical: node.name,
              logical,
            },
            fix: (fixer) => {
              return fixer.replaceText(node, logical)
            },
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
