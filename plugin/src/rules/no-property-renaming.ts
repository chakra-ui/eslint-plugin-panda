import { type Rule, createRule } from '../utils'
import { isPandaAttribute, isPandaProp } from '../utils/helpers'
import { isIdentifier, isJSXExpressionContainer, isMemberExpression } from '../utils/nodes'

export const RULE_NAME = 'no-property-renaming'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Ensure user does not rename a property for a pattern or style prop. \nIt doesn't get tracked.",
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
        if (!isPandaProp(node, context)) return

        const attr = node.name.name.toString()
        const expression = node.value.expression

        if (isIdentifier(expression) && attr !== expression.name) {
          return sendReport(node, attr, expression.name)
        }

        if (isMemberExpression(expression) && isIdentifier(expression.property) && attr !== expression.property.name) {
          return sendReport(node, attr, expression.property.name)
        }
      },

      Property(node) {
        if (!isIdentifier(node.key)) return
        if (!isIdentifier(node.value) && !isMemberExpression(node.value)) return
        if (!isPandaAttribute(node, context)) return

        const attr = node.key.name.toString()
        const value = node.value

        if (isIdentifier(value) && attr !== value.name) {
          return sendReport(node, attr, value.name)
        }

        if (isMemberExpression(value) && isIdentifier(value.property) && attr !== value.property.name) {
          return sendReport(node, attr, value.property.name)
        }
      },
    }
  },
})

export default rule
