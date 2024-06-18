import { isIdentifier, isLiteral, isObjectExpression, isTemplateLiteral } from '../utils/nodes'
import { type Rule, createRule } from '../utils'
import { getImports, isInJSXProp, isInPandaFunction, isStyledProperty } from '../utils/helpers'
import type { TSESTree } from '@typescript-eslint/utils'
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'

export const RULE_NAME = 'no-invalid-nesting'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Warn against invalid nesting. i.e. nested styles that don't contain the `&` character.",
    },
    messages: {
      nesting: 'Invalid style nesting. Nested styles must contain the `&` character.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Property(node) {
        if (!isObjectExpression(node.value) || isIdentifier(node.key)) return
        const caller = isInPandaFunction(node, context)
        if (!caller && !isInJSXProp(node, context)) return
        if (isStyledProperty(node, context)) return

        const invalidNesting = isInvalidNesting(node, context, caller)
        if (!invalidNesting) return

        context.report({
          node: node.key,
          messageId: 'nesting',
        })
      },
    }
  },
})

export default rule

function isInvalidNesting(node: TSESTree.Property, context: RuleContext<any, any>, caller: string | undefined) {
  // Check if the caller is either 'cva' or 'sva'
  const recipe = getImports(context).find((imp) => ['cva', 'sva'].includes(imp.name) && imp.alias === caller)
  if (!recipe) return checkNode(node)

  //* Nesting is different here because of slots and variants. We don't want to warn about those.
  let currentNode: any = node
  let length = 0
  let styleObjectParent = null

  // Traverse up the AST
  while (currentNode) {
    if (currentNode.key && ['base', 'variants'].includes(currentNode.key.name)) {
      styleObjectParent = currentNode.key.name
    }
    currentNode = currentNode.parent
    if (!styleObjectParent) length++
  }

  // Determine the required length based on caller and styleObjectParent
  const requiredLength = caller === 'cva' ? 2 : 4
  const extraLength = styleObjectParent === 'base' ? 0 : 4

  if (length >= requiredLength + extraLength) {
    return checkNode(node)
  }

  return false
}

function checkNode(node: TSESTree.Property) {
  const invalidLiteral = isLiteral(node.key) && typeof node.key.value === 'string' && !node.key.value.includes('&')
  const invalidTemplateLiteral = isTemplateLiteral(node.key) && !node.key.quasis[0].value.raw.includes('&')

  return invalidLiteral || invalidTemplateLiteral
}
