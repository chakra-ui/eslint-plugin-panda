import { isRecipeVariant, isPandaAttribute, isPandaProp, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isIdentifier, isJSXIdentifier, isLiteral, isJSXExpressionContainer } from '../utils/nodes'
import { physicalProperties, physicalPropertyValues } from '../utils/physical-properties'
import type { TSESTree, TSESLint } from '@typescript-eslint/utils'

type CacheMap<K extends object, V> = WeakMap<K, V | undefined>
type ValueNode = TSESTree.Property['value'] | TSESTree.JSXAttribute['value']
type IdentifierNode = TSESTree.Identifier | TSESTree.JSXIdentifier
type RuleContextType = TSESLint.RuleContext<keyof typeof MESSAGES, [{ whitelist: string[] }]>

export const RULE_NAME = 'no-physical-properties'

const MESSAGES = {
  physical: 'Use logical property instead of {{physical}}. Prefer `{{logical}}`.',
  physicalValue: 'Use logical value instead of {{physical}}. Prefer `{{logical}}`.',
  replace: 'Replace `{{physical}}` with `{{logical}}`.',
} as const

class PropertyCache {
  private longhandCache = new Map<string, string>()
  private pandaPropCache: CacheMap<TSESTree.JSXAttribute, boolean> = new WeakMap()
  private pandaAttributeCache: CacheMap<TSESTree.Property, boolean> = new WeakMap()
  private recipeVariantCache: CacheMap<TSESTree.Property, boolean> = new WeakMap()

  getLonghand(name: string, context: RuleContextType): string {
    if (this.longhandCache.has(name)) {
      return this.longhandCache.get(name)!
    }
    const longhand = resolveLonghand(name, context) ?? name
    this.longhandCache.set(name, longhand)
    return longhand
  }

  isPandaProp(node: TSESTree.JSXAttribute, context: RuleContextType): boolean {
    if (this.pandaPropCache.has(node)) {
      return this.pandaPropCache.get(node)!
    }
    const result = isPandaProp(node, context)
    this.pandaPropCache.set(node, result)
    return !!result
  }

  isPandaAttribute(node: TSESTree.Property, context: RuleContextType): boolean {
    if (this.pandaAttributeCache.has(node)) {
      return this.pandaAttributeCache.get(node)!
    }
    const result = isPandaAttribute(node, context)
    this.pandaAttributeCache.set(node, result)
    return !!result
  }

  isRecipeVariant(node: TSESTree.Property, context: RuleContextType): boolean {
    if (this.recipeVariantCache.has(node)) {
      return this.recipeVariantCache.get(node)!
    }
    const result = isRecipeVariant(node, context)
    this.recipeVariantCache.set(node, result)
    return !!result
  }
}

const extractStringLiteralValue = (valueNode: ValueNode): string | null => {
  if (isLiteral(valueNode) && typeof valueNode.value === 'string') {
    return valueNode.value
  }

  if (
    isJSXExpressionContainer(valueNode) &&
    isLiteral(valueNode.expression) &&
    typeof valueNode.expression.value === 'string'
  ) {
    return valueNode.expression.value
  }

  return null
}

const createPropertyReport = (
  node: IdentifierNode,
  longhandName: string,
  logical: string,
  context: RuleContextType,
) => {
  const physicalName = `\`${node.name}\`${longhandName !== node.name ? ` (resolved to \`${longhandName}\`)` : ''}`

  context.report({
    node,
    messageId: 'physical',
    data: { physical: physicalName, logical },
    suggest: [
      {
        messageId: 'replace',
        data: { physical: node.name, logical },
        fix: (fixer: TSESLint.RuleFixer) => fixer.replaceText(node, logical),
      },
    ],
  })
}

const createValueReport = (
  valueNode: NonNullable<ValueNode>,
  valueText: string,
  logical: string,
  context: RuleContextType,
) => {
  context.report({
    node: valueNode,
    messageId: 'physicalValue',
    data: { physical: `"${valueText}"`, logical: `"${logical}"` },
    suggest: [
      {
        messageId: 'replace',
        data: { physical: `"${valueText}"`, logical: `"${logical}"` },
        fix: (fixer: TSESLint.RuleFixer) => {
          if (isLiteral(valueNode)) {
            return fixer.replaceText(valueNode, `"${logical}"`)
          }
          if (isJSXExpressionContainer(valueNode) && isLiteral(valueNode.expression)) {
            return fixer.replaceText(valueNode.expression, `"${logical}"`)
          }
          return null
        },
      },
    ],
  })
}

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Encourage the use of logical properties over physical properties to foster a responsive and adaptable user interface.',
    },
    messages: MESSAGES,
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
  defaultOptions: [{ whitelist: [] }],
  create(context) {
    const whitelist: string[] = context.options[0]?.whitelist ?? []
    const cache = new PropertyCache()

    const checkPropertyName = (node: IdentifierNode) => {
      if (whitelist.includes(node.name)) return
      const longhandName = cache.getLonghand(node.name, context)
      if (!(longhandName in physicalProperties)) return

      const logical = physicalProperties[longhandName]
      createPropertyReport(node, longhandName, logical, context)
    }

    const checkPropertyValue = (keyNode: IdentifierNode, valueNode: NonNullable<ValueNode>): boolean => {
      const propName = keyNode.name
      if (!(propName in physicalPropertyValues)) return false

      const valueText = extractStringLiteralValue(valueNode)
      if (valueText === null) return false

      const valueMap = physicalPropertyValues[propName]
      if (!valueMap[valueText]) return false

      createValueReport(valueNode, valueText, valueMap[valueText], context)
      return true
    }

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (!isJSXIdentifier(node.name)) return
        if (!cache.isPandaProp(node, context)) return

        checkPropertyName(node.name)
        if (node.value) {
          checkPropertyValue(node.name, node.value)
        }
      },

      Property(node: TSESTree.Property) {
        if (!isIdentifier(node.key)) return
        if (!cache.isPandaAttribute(node, context)) return
        if (cache.isRecipeVariant(node, context)) return

        checkPropertyName(node.key)
        if (node.value) {
          checkPropertyValue(node.key, node.value)
        }
      },
    }
  },
})

export default rule
