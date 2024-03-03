import { type Rule, createRule } from '../utils'
import { getExtendWarnings, isConfigFile } from '../utils/helpers'

export const RULE_NAME = 'no-extend-keyword'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Warn when the user doesn't use extend in their config and they don't have presets or eject set.",
    },
    messages: {
      extendKeyword:
        'Not using the `extend` keyword in your {{configKeys}}. This will override the internal preset or/and tokens. Is this intentional? \n> See: https://panda-css.com/docs/concepts/extend',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Program() {
        if (!isConfigFile(context)) return
        const warnings = getExtendWarnings(context)
        if (!warnings.length) return

        context.report({
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
          messageId: 'extendKeyword',
          data: {
            configKeys: warnings.map((w) => `\`${w}\``).join(' / '),
          },
        })
      },
    }
  },
})

export default rule
