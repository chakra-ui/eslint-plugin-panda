import { type Rule, createRule } from '../utils'
import { isPandaProp } from '../utils/helpers'
import { isIdentifier, isJSXExpressionContainer, isMemberExpression } from '../utils/nodes'

export const RULE_NAME = 'no-property-renaming'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Ensure user does not rename a property for a pattern or style prop. It doesn't get tracked.",
    },
    messages: {
      noRenaming:
        'Incoming `{{prop}}` prop is different from the expected `{{expected}}` attribute. Panada will not track this prop.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sendReport = (node: any, expected: string, prop: string) => {
      return context.report({
        node: node.value,
        messageId: 'noRenaming',
        data: {
          expected,
          prop,
        },
      })
    }

    return {
      JSXAttribute(node) {
        if (!node.value) return
        if (!isJSXExpressionContainer(node.value)) return
        if (!isPandaProp(node.name, context)) return

        const attr = node.name.name.toString()
        const expression = node.value.expression

        if (isIdentifier(expression) && attr !== expression.name) {
          return sendReport(node, attr, expression.name)
        }

        if (isMemberExpression(expression) && isIdentifier(expression.property) && attr !== expression.property.name) {
          return sendReport(node, attr, expression.property.name)
        }
      },
    }
  },
})

export default rule
