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
        'Encourage the use of [logical properties](https://mdn.io/logical-properties-basic-concepts) over physical proeprties, to foster a responsive and adaptable user interface.',
    },
    messages: {
      physical: 'Use logical property of {{physical}} instead. Prefer `{{logical}}`',
      replace: 'Replace `{{physical}}` with `{{logical}}`',
    },
    type: 'suggestion',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const getLonghand = (name: string) => resolveLonghand(name, context) ?? name

    const sendReport = (node: TSESTree.Identifier | TSESTree.JSXIdentifier) => {
      if (!(getLonghand(node.name) in physicalProperties)) return

      const logical = physicalProperties[getLonghand(node.name)]
      const longhand = resolveLonghand(node.name, context)

      return context.report({
        node,
        messageId: 'physical',
        data: {
          physical: `\`${node.name}\`${longhand ? ` - \`${longhand}\`` : ''}`,
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
              return fixer.replaceTextRange(node.range, logical)
            },
          },
        ],
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
        if (isRecipeVariant(node, context)) return

        sendReport(node.key)
      },
    }
  },
})

export default rule
