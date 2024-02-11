import { isPandaAttribute, isPandaIsh, isPandaProp, resolveLonghand } from '../utils/helpers'
import { type Rule, createRule } from '../utils'
import { isCallExpression, isIdentifier, isJSXIdentifier, isMemberExpression } from '../utils/nodes'
import type { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'no-margin-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Discourage using margin properties for spacing; prefer defining spacing in parent elements with `flex` or `grid` using the `gap` property for a more resilient layout. Margins make components less reusable in other contexts.',
    },
    messages: {
      noMargin:
        'Use flex or grid with the `gap` property to define spacing in parent elements for a more resilient layout.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const getLonghand = (name: string) => resolveLonghand(name, context) ?? name

    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
      if (!getLonghand(node.name).toLowerCase().includes('margin')) return

      return context.report({
        node,
        messageId: 'noMargin',
      })
    }

    return {
      JSXAttribute(node) {
        if (!isJSXIdentifier(node.name)) return
        if (!isPandaProp(node, context)) return

        sendReport(node.name)
      },

      Property(node) {
        if (!isIdentifier(node.key)) return
        if (!isPandaAttribute(node, context)) return

        sendReport(node.key)
      },

      TaggedTemplateExpression(node) {
        const handleExpression = (caller: string) => {
          if (!isPandaIsh(caller, context)) return

          const quasis = node.quasi.quasis[0]
          const styles = quasis.value.raw

          const propertyRegex = /([a-zA-Z-]+):/g
          const propertyMatches = [...styles.matchAll(propertyRegex)]
          const properties = propertyMatches.map((match) => match[1].trim())

          properties.forEach((property, i, arr) => {
            if (!property.includes('margin')) return

            // Avoid duplicate reports on the same token
            if (arr.indexOf(property) < i) return

            let index = styles.indexOf(property)

            while (index !== -1) {
              const start = quasis.range[0] + 1 + index
              const end = start + property.length

              context.report({
                loc: {
                  start: context.sourceCode.getLocFromIndex(start),
                  end: context.sourceCode.getLocFromIndex(end),
                },
                messageId: 'noMargin',
              })

              // Check for other occurences of the invalid token
              index = styles.indexOf(property, index + 1)
            }
          })
        }

        // css``
        if (isIdentifier(node.tag)) {
          handleExpression(node.tag.name)
        }

        // styled.h1``
        if (isMemberExpression(node.tag)) {
          if (!isIdentifier(node.tag.object)) return
          handleExpression(node.tag.object.name)
        }

        // styled(Comp)``
        if (isCallExpression(node.tag)) {
          if (!isIdentifier(node.tag.callee)) return
          handleExpression(node.tag.callee.name)
        }
      },
    }
  },
})

export default rule
