import { isIdentifier, isLiteral, isObjectExpression, isTemplateLiteral } from '../utils/nodes'
import { type Rule, createRule } from '../utils'
import { isInJSXProp, isInPandaFunction, isStyledProperty } from '../utils/helpers'

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
        if (!isInPandaFunction(node, context) && !isInJSXProp(node, context)) return
        if (isStyledProperty(node, context)) return

        const invalidLiteral =
          isLiteral(node.key) && typeof node.key.value === 'string' && !node.key.value.includes('&')
        const invalidTemplateLiteral = isTemplateLiteral(node.key) && !node.key.quasis[0].value.raw.includes('&')

        if (invalidLiteral || invalidTemplateLiteral) {
          context.report({
            node: node.key,
            messageId: 'nesting',
          })
        }
      },
    }
  },
})

export default rule
